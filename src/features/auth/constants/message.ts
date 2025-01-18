import { NICKNAME_MAX_LENGTH, VERIFICATION_CODE_LENGTH } from "./form";

export const errorMessage = {
  PERMISSION_DENIED: "위치 정보를 요청 할 수 있도록 권한을 허용해주세요",
  POSITION_UNAVAILABLE:
    "현재 위치 정보를 사용 할 수 없습니다. 다시 시도해주세요",
  TIMEOUT: "현재 위치 정보를 사용 할 수 없습니다. 다시 시도해주세요",
  UNKNOWN: "알 수 없는 에러가 발생했습니다",
  NON_SELECTED_ADDRESS: "동네를 선택해주세요",
};

export const loginErrorMessage = {
  email: {
    required: "이메일 형식으로 입력해 주세요.",
    pattern: "올바른 이메일 형식으로 입력해 주세요.",
  },
  submit: {
    required: "아이디 또는 비밀번호를 모두 입력해 주세요.",
    invalid: "이메일 또는 비밀번호를 다시 확인해 주세요.",
  },
};

export const signUpFormValidationMessage = {
  email: "올바른 이메일 형식입니다.",
  verificationCode: "인증되었습니다.",
  password: "사용가능한 비밀번호 입니다.",
  confirmPassword: "비밀번호가 일치합니다.",
};
export const signUpFormErrorMessage = {
  email: {
    required: "이메일 형식으로 입력해 주세요.",
    pattern: "이메일 형식으로 입력해 주세요.",
    validate: "이미 가입된 이메일입니다.",
  },
  verificationCode: {
    required: `인증코드 ${VERIFICATION_CODE_LENGTH}자리를 입력해 주세요.`,
    minLength: `인증코드 ${VERIFICATION_CODE_LENGTH}자리를 입력해 주세요.`,
    isNotMatched: "인증코드를 다시 확인해 주세요.",
    isTimeOver: "인증시간이 만료되었습니다. 재전송 버튼을 눌러주세요.",
  },
  password: {
    required: "비밀번호를 입력해 주세요.",
    pattern: "비밀번호 형식에 맞게 입력해 주세요.",
  },
  confirmPassword: {
    required: "비밀번호를 다시 입력해 주세요.",
    pattern: "비밀번호 형식에 맞게 입력해 주세요.",
    isNotMatchedWithPassword: "비밀번호가 서로 일치하지 않습니다.",
  },
  submit: {
    required: "이메일과 비밀번호를 모두 입력해 주세요.",
    invalid: "이메일 또는 비밀번호를 올바르게 입력해 주세요.",
  },
};

export const userInfoFormValidationMessage = {
  email: "사용가능한 닉네임입니다.",
};
export const userInfoFormErrorMessage = {
  nickname: {
    required: `${NICKNAME_MAX_LENGTH}자 이내의 한글 영어 숫자만 사용 가능합니다.`,
    pattern: `${NICKNAME_MAX_LENGTH}자 이내의 한글 영어 숫자만 사용 가능합니다.`,
    maxLength: `${NICKNAME_MAX_LENGTH}자 이내의 한글 영어 숫자만 사용 가능합니다.`,
    validate: "이미 존재하는 닉네임입니다.",
  },
  submit: {
    required: "필수 항목을 모두 입력해 주세요.",
    invalidNickname: "올바른 닉네임을 입력해 주세요.",
    requiredTermsAgreement: "필수 약관에 모두 동의해 주세요.",
  },
};
