import { FormikProps } from "formik";
import { useSecureStore } from "./useSecureStore";
import { LoginInput } from "../types/interfaces-auth";
import { useEffect, useRef } from "react";

export const useCredentialsSecureStoreHandler = (
  formik: FormikProps<LoginInput>
) => {
  const { removeFromSecureStore, getFromSecureStore } = useSecureStore();

  const removeCredentialsFromSecureStore = async () => {
    await removeFromSecureStore("username");
    await removeFromSecureStore("password");
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

      if (storedUsername && storedPassword) {
        formik.setValues(() => ({
          username: storedUsername,
          password: storedPassword,
        }));
        formik.setTouched({ password: true, username: true });
        formik.submitForm();
      }
    };

    getDataFromStore();
    calledOnce.current = true;
  }, [isValidDataInFormik]);

  return { removeCredentialsFromSecureStore };
};
