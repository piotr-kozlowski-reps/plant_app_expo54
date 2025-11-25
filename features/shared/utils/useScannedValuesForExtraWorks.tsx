import { useEffect, useState } from "react";
import { ZpScannedValue } from "../types/interfaces-extra_works";

export const useScannedValuesForExtraWorks = (
  isFieldScanned: boolean,
  setIsFieldScanned: React.Dispatch<React.SetStateAction<boolean>>,
  isZPScanned: boolean,
  setIsZPScanned: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [scannedValues, setScannedValues] = useState<ZpScannedValue[]>([]);
  useEffect(() => {
    if (scannedValues.length === 0) {
      if (isFieldScanned) setIsFieldScanned(false);
      if (isZPScanned) setIsZPScanned(false);
    }
  }, [scannedValues]);

  return { scannedValues, setScannedValues };
};
