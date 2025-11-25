import { useEffect, useState } from "react";
import { checkIfIsLoadingOrFetchingAndSetGlobalState } from "./checkIfIsLoadingOrFetchingAndSetGlobalState";

export function useHandleIsLoadingAndIsFetchingGlobalState(
  setIsLoading: (boolValue: boolean) => void
) {
  const [isLoadingOrIsFetchingMap, setIsLoadingOrIsFetchingMap] = useState<
    Map<string, boolean[]>
  >(new Map<string, boolean[]>());

  useEffect(() => {
    checkIfIsLoadingOrFetchingAndSetGlobalState(
      isLoadingOrIsFetchingMap,
      setIsLoading
    );
  }, [isLoadingOrIsFetchingMap]);

  const setIsLoadingOrIsFetching = (
    //TODO: tests
    mapKey: string,
    isLoading: boolean,
    isFetching: boolean
  ) => {
    const mapCopy: Map<string, boolean[]> = new Map(
      JSON.parse(JSON.stringify(Array.from(isLoadingOrIsFetchingMap)))
    );
    mapCopy.set(mapKey, [isLoading, isFetching]);
    setIsLoadingOrIsFetchingMap(mapCopy);
  };

  return { setIsLoadingOrIsFetching };
}
