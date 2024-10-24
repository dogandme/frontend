interface compressFileImageOptions {
  maxSize: number;
  compactSize: number;
  quality: number;
  extension: "jpeg" | "webp" | "png";
}
type compressFileImage = (
  file: File,
  options?: compressFileImageOptions,
) => Promise<File>;

const defaultCompressOptions: compressFileImageOptions = {
  maxSize: 2 ** 20, // 최대 파일 크기 1MB
  compactSize: 2 ** 10 * 100, // 압축 후 최대 파일 크기 100KB
  quality: 0.7,
  extension: "webp",
};

/**
 * compressFileImage 은 File 객체를 options 에 설정된 maxSize 보다 작은 크기로 압축하고 extension 확장자로 변환하여 저장합니다.
 * canvas 를 이용해 이미지를 압축하며 , 파일의 너비와 높이를 원 사이즈 / compactSize 만큼의 비율로 크기를 줄입니다.
 *
 * 2024/10/11 업데이트
 * 파일이 너무 크거나 손상된 경우엔 이미지 업로드를 거부하도록 합니다.
 * 만약 파일은 문제 없으나 canvas 를 사용하지 못하는 경우엔 원본 파일을 반환합니다.
 * @param file 압축할 파일
 * @param options maxSize: 압축할 파일의 최대 크기, compactSize: 압축된 파일의 최소 크기 , quality: 압축 품질, extension: 압축할 파일의 확장자
 */
export const compressFileImage: compressFileImage = async (file, options) => {
  const { maxSize, compactSize, quality, extension } = {
    ...defaultCompressOptions,
    ...options,
  };

  if (file.size <= maxSize) {
    return file;
  }
  const image = new Image();
  const reader = new FileReader();
  /**
   * FileReader 는 비동기적으로 load 되고 비동기적으로 데이터를 읽습니다.
   * result 는 reader 가 읽은 데이터를 base64 로 인코딩한 문자열 입니다.
   * 2024/10/11 에러 시 reject 처리 추가
   */
  const result = await new Promise<string>((resolve, reject) => {
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  /* 만약 canvas 를 사용 못하는 환경이라면 원본 파일을 반환 합니다. */
  if (!context) {
    return file;
  }

  /**
   * 이미지의 src 를 base64 로 인코딩된 문자열로 설정합니다.
   * 이로 인해 canvas 에 해당 이미지를 그릴 수 있습니다.
   */
  image.src = result;
  /**
   * 이미지가 load 될 때 까지 프로미스 체인을 진행하지 않고 기다립니다.
   */
  await new Promise<void>((resolve) => {
    image.onload = () => resolve();
  });
  /**
   * 원본 이미지를 인수로 선택한 compactSize 만큼의 비율로 줄입니다.
   * compactSize 는 인수로 받은 압축된 파일의 최대 용량 입니다.
   */
  const ratio = Math.sqrt(compactSize / file.size);
  const { width, height } = image;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const compressedFile: Promise<File> = new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        /* blob 생성에 실패하면 원본 데이터를 resolve 합니다. */
        if (!blob) {
          resolve(file);
          return;
        }
        resolve(
          new File([blob], file.name, {
            type: `image/${extension}`,
            lastModified: Date.now(),
          }),
        );
      },
      `image/${extension}`,
      quality,
    );
  });

  return compressedFile;
};
