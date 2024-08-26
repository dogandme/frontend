import { useState } from "react";

interface SignUpByEmailFormType {
  email: string;
  confirmCode: string;
  password: string;
  passwordConfirm: string;
}

export const useSignUpByEmailForm = () => {
  const [form, setForm] = useState<SignUpByEmailFormType>({
    email: "",
    confirmCode: "",
    password: "",
    passwordConfirm: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const { email, password, passwordConfirm } = form;

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailRegex.test(email);
  };
  const validatePassword = (password: string) => {
    // 조건
    // 1. 영문, 숫자, 특수문자 3가지 조합 포함
    // 2. 8~15자 이내
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;

    return passwordRegex.test(password);
  };

  const isValidEmail = validateEmail(email);
  const isValidPassword = validatePassword(password);
  const isPasswordMatched = password === passwordConfirm;

  return {
    form,
    isValidEmail,
    isValidPassword,
    isPasswordMatched,
    handleChange,
  };
};
