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

  return { form, handleChange };
};
