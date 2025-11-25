import { ERROR_MESSAGES } from "../../messages";
import { useGoBackToLogin } from "./useGoBackToLogin";

export const useChooseWhichError = () => {
  const { goBackToLogin } = useGoBackToLogin();

  const chooseWhichErrorToThrow = (err: Error): never => {
    if (
      err.message === "Request failed with status code 401" ||
      err.message === ERROR_MESSAGES.SESSION_EXPIRED
    ) {
      goBackToLogin();

      // throw new Error(ERROR_MESSAGES.SESSION_EXPIRED);
    }

    throw new Error(ERROR_MESSAGES.HAVE_NO_IDEA_ERROR);
  };

  return { chooseWhichErrorToThrow };
};
