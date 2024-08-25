import { useDebounce } from "@/shared/lib";
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

  const { email } = form;

  const validateEmail = () => {
    if (email.length === 0) return true;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailRegex.test(email);
  };

  const isValidEmail = useDebounce(validateEmail, true);

  const isErrorEmail = !isValidEmail;

  return {
    form,
    isErrorEmail,
    handleChange,
  };
};
