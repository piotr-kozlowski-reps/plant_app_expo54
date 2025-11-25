export function checkIfAnyOfBooleanValuesIsTrue(
  boolValuesArray: boolean[]
): boolean {
  for (let value of boolValuesArray) {
    if (value) return true;
  }

  return false;
}
