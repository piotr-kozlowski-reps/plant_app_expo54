import { useEffect, useState } from "react";
import { checkIfAnyOfBooleanValuesIsTrue } from "./checkIfAnyOfBooleanValuesIsTrue";
import { useChooseWhichError } from "./useChooseWhichError";
export function useHandleThrowingProperErrorWhenOccuredDuringFetchingData() {
  const { chooseWhichErrorToThrow } = useChooseWhichError();
  const [isErrorMap, setIsErrorMap] = useState<Map<string, boolean>>(
    new Map<string, boolean>()
  );
  const [errors, setErrors] = useState<Map<string, Error | null>>(
    new Map<string, Error>()
  );

  useEffect(() => {
    if (checkIfAnyOfBooleanValuesIsTrue(Array.from(isErrorMap.values()))) {
      errors.forEach((err) => {
        if (err && err.message) {
          chooseWhichErrorToThrow(err);
        }
      });
    }
  }, [isErrorMap, errors]);

  const setIsError = (mapKey: string, isError: boolean) => {
    const mapCopy: Map<string, boolean> = new Map(
      JSON.parse(JSON.stringify(Array.from(isErrorMap)))
    );
    mapCopy.set(mapKey, isError);
    setIsErrorMap(mapCopy);
  };

  const setError = (mapKey: string, error: Error | null) => {
    const mapCopy: Map<string, Error | null> = new Map(
      JSON.parse(JSON.stringify(Array.from(isErrorMap)))
    );
    mapCopy.set(mapKey, error);
    setErrors(mapCopy);
  };

  return { setIsError, setError };
}
