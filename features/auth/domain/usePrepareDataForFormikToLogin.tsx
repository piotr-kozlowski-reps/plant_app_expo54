import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { LoginInput, User } from "@/features/shared/types/interfaces-auth";
import {
  ERROR_MESSAGES,
  VALIDATION_MESSAGES,
} from "@/features/shared/utils/messages";
import { useSecureStore } from "@/features/shared/utils/useSecureStore";
import { FormikHelpers, useFormik } from "formik";
import { useState } from "react";
import { Keyboard } from "react-native";
import { router } from "expo-router";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import * as yup from "yup";

import { validateFormOnDemand } from "@/features/shared/utils/validation";
import { useLoginLogic } from "./useLoginLogic";

export const usePrepareDataForFormikToLogin = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  ////vars
  const [isRememberMe, setIsRememberMe] = useState(false);
  const { setAuthSession } = useAuthSessionStore();
  const { addToSecureStore } = useSecureStore();
  const { errorHandler } = useErrorHandler();
  const { login } = useLoginLogic();

  //utils
  const handleSecureStore = async (isChecked: boolean, values: LoginInput) => {
    if (isChecked) {
      await addToSecureStore("username", values.username);
      await addToSecureStore("password", values.password);
    }
  };

  //on submit
  const onSubmit = async (
    values: LoginInput,
    formikHelpers: FormikHelpers<LoginInput>
  ) => {
    Keyboard.dismiss();
    setIsLoading(true);

    let userData: User | null | undefined;
    try {
      userData = await login(values);
      if (!userData) {
        throw new Error(ERROR_MESSAGES.PROBLEM_WHEN_LOGIN);
      }
      setAuthSession(userData);
      await handleSecureStore(isRememberMe, values);
      router.push("/");
    } catch (error) {
      errorHandler(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const formikLogin = useFormik<LoginInput>({
    initialValues: { username: "", password: "" },
    onSubmit: onSubmit,
    validationSchema: yup.object({
      username: yup.string().required(VALIDATION_MESSAGES.USERNAME_REQUIRED),
      password: yup.string().required(VALIDATION_MESSAGES.PASSWORD_REQUIRED),
    }),
  });

  const validateForm = () => {
    validateFormOnDemand<LoginInput>(formikLogin);
  };
  const canFormBeSubmitted = formikLogin.dirty && formikLogin.isValid;

  const availableFormActions = canFormBeSubmitted
    ? formikLogin.submitForm
    : () => validateForm();

  return {
    isRememberMe,
    setIsRememberMe,
    formik: formikLogin,
    validateForm,
    canFormBeSubmitted,
    availableFormActions,
  };
};
