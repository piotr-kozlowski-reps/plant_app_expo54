import { checkIfAnyOfBooleanValuesIsTrue } from "./checkIfAnyOfBooleanValuesIsTrue";

export function checkIfIsLoadingOrFetchingAndSetGlobalState(
  isLoadingOrIsFetchingMap: Map<string, boolean[]>,
  setIsLoading: (boolValue: boolean) => void
) {
  const allBoolValuesGathered: boolean[] = [];

  for (let [_key, value] of isLoadingOrIsFetchingMap) {
    allBoolValuesGathered.push(...value);
  }

  if (checkIfAnyOfBooleanValuesIsTrue(allBoolValuesGathered)) {
    setIsLoading(true);
  } else {
    setIsLoading(false);
  }
}
