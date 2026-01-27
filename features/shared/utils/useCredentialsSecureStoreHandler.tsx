import { FormikProps } from "formik";
import { useSecureStore } from "./useSecureStore";
import { LoginInput } from "../types/interfaces-auth";
import { useEffect, useRef } from "react";

export const useCredentialsSecureStoreHandler = (
  formik: FormikProps<LoginInput>,
  setIsRememberMe: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const { removeFromSecureStore, getFromSecureStore } = useSecureStore();

  const removeCredentialsFromSecureStore = async () => {
    await removeFromSecureStore("username");
    await removeFromSecureStore("password");
    await removeFromSecureStore("IsRememberMe");
  };

  const isValidDataInFormik = formik.values.username && formik.values.password;

  const calledOnce = useRef(false);
  useEffect(() => {
    if (calledOnce.current) {
      return;
    }

    const getDataFromStore = async () => {
      const storedUsername = await getFromSecureStore("username");
      const storedPassword = await getFromSecureStore("password");
      const storedIsRememberMe = await getFromSecureStore("IsRememberMe");

      if (storedUsername && storedPassword) {
        formik.setFieldValue("username", storedUsername, true);
        formik.setFieldValue("password", storedPassword, true);

        // clear errors
        formik.setErrors({});
        formik.setTouched({ password: true, username: true });

        // then in next cycle set touched and validate form again
        setTimeout(() => {
          formik.setTouched({ username: true, password: true });
          formik.validateForm();
        }, 0);
      }

      if (storedIsRememberMe && storedIsRememberMe === "true") {
        setIsRememberMe(true);
      }
    };

    getDataFromStore();
    calledOnce.current = true;
  }, [isValidDataInFormik]);

  return { removeCredentialsFromSecureStore };
};
