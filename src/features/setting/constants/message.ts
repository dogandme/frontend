import { NICKNAME_MAX_LENGTH } from "@/features/auth/constants";

export const changeNicknameFormValidationMessage = {
  nickname: "올바른 양식의 닉네임입니다.",
};
export const changeNicknameFormErrorMessage = {
  nickname: {
    required: `${NICKNAME_MAX_LENGTH}자 이내의 한글 영어 숫자만 사용 가능합니다.`,
    pattern: `${NICKNAME_MAX_LENGTH}자 이내의 한글 영어 숫자만 사용 가능합니다.`,
    maxLength: `${NICKNAME_MAX_LENGTH}자 이내의 한글 영어 숫자만 사용 가능합니다.`,
    validate: "이미 존재하는 닉네임입니다.",
  },
  submit: {
    required: "닉네임을 입력해 주세요.",
    invalid: "올바른 닉네임을 입력해 주세요.",
    canChange: "한달 이후 닉네임을 변경해 주세요.",
  },
};

export const passwordChangeFormValidationMessage = {
  newPassword: "사용가능한 비밀번호 입니다.",
  confirmPassword: "비밀번호가 일치합니다.",
};
export const passwordChangeFormErrorMessage = {
  currentPassword: "현재 비밀번호를 입력해주세요.",
  newPassword: {
    required: "비밀번호를 입력해 주세요.",
    pattern: "비밀번호 형식에 맞게 입력해 주세요.",
  },
  confirmPassword: {
    required: "비밀번호를 다시 입력해 주세요.",
    pattern: "비밀번호 형식에 맞게 입력해 주세요.",
    isNotMatchedWithPassword: "비밀번호가 서로 일치하지 않습니다.",
  },
  submit: {
    required: "항목을 모두 입력해 주세요.",
    isNotMatchedWithNewPassword: "새 비밀번호를 다시 확인해 주세요.",
    invalid: "비밀번호 형식에 맞게 입력해 주세요.",
  },
};

export const passwordCheckFormErrorMessage = {
  currentPassword: {
    required: "비밀번호를 입력해주세요.",
    pattern: "비밀번호 형식에 맞게 입력해 주세요.",
  },
};

export const passwordSetFormValidationMessage = {
  newPassword: "사용가능한 비밀번호 입니다.",
  confirmPassword: "비밀번호가 일치합니다.",
};
export const passwordSetFormErrorMessage = {
  newPassword: {
    required: "비밀번호를 입력해 주세요.",
    pattern: "비밀번호 형식에 맞게 입력해 주세요.",
  },
  confirmPassword: {
    required: "비밀번호를 다시 입력해 주세요.",
    pattern: "비밀번호 형식에 맞게 입력해 주세요.",
    isNotMatchedWithPassword: "비밀번호가 서로 일치하지 않습니다.",
  },
  submit: {
    required: "항목을 모두 입력해 주세요.",
    isNotMatchedWithNewPassword: "새 비밀번호를 다시 확인해 주세요.",
    invalid: "비밀번호 형식에 맞게 입력해 주세요.",
  },
};
