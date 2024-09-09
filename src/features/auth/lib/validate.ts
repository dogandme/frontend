export const validateNickname = (nickName: string) => {
  const regExp = /^[a-zA-Z0-9ㄱ-ㅎ가-힣]{1,20}$/;
  return regExp.test(nickName);
};

export const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return emailRegex.test(email);
};

export const validatePassword = (password: string) => {
  // 조건
  // 1. 영문, 숫자, 특수문자 3가지 조합 포함
  // 2. 8~15자 이내
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;

  return passwordRegex.test(password);
};
