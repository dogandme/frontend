export const validateNickname = (nickName: string) => {
  const regExp = /^[a-zA-Z0-9ㄱ-ㅎ가-힣]{1,20}$/;
  return regExp.test(nickName);
};
