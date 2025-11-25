import { FormikProps } from "formik";

export const useFormikCustomHelpers = <T,>(
  isVerifiedAtOnce: boolean,
  formik: FormikProps<T>,
  formikField: keyof T
) => {
  const isError = isVerifiedAtOnce
    ? verifyOnlyErrorField()
    : verifyErrorFieldAndTouched();

  function verifyOnlyErrorField(): boolean {
    return formik.errors[formikField] ? true : false;
  }

  function verifyErrorFieldAndTouched(): boolean {
    return formik.getFieldMeta(formikField.toString()).touched &&
      formik.errors[formikField]
      ? true
      : false;
  }
  const error = formik.errors[formikField];

  return {
    isError,
    error,
  };
};
