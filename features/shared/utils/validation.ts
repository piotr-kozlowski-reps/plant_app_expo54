import { FormikProps } from "formik";

export function validateFormOnDemand<T>(formik: FormikProps<T>) {
  Object.keys(formik.initialValues as object).forEach((key) => {
    formik.setFieldTouched(key, true, true);
  });

  formik.validateForm();
}
