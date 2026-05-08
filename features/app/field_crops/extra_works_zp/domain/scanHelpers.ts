import { ZpScannedValue } from "@/features/shared/types/interfaces-extra_works";

export function checkIfValueIsAlreadyScanned(
  zpValue: string | null,
  scannedValuesArray: ZpScannedValue[],
): boolean {
  if (!zpValue) return false;

  const scannedZpValues: string[] = scannedValuesArray.map(
    (item) => item.ordnmb,
  );
  return scannedZpValues.includes(zpValue);
}
