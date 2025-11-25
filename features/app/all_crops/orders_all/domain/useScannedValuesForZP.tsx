import { ZPShortenedInfoWithoutTwrnzw } from "@/features/shared/types/interfaces-zp";
import { useState, useEffect } from "react";

export const useScannedValuesForZP = (
  isFieldScanned: boolean,
  setIsFieldScanned: React.Dispatch<React.SetStateAction<boolean>>,
  isZPScanned: boolean,
  setIsZPScanned: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [scannedValues, setScannedValues] = useState<
    ZPShortenedInfoWithoutTwrnzw[]
  >([]);
  useEffect(() => {
    if (scannedValues.length === 0) {
      if (isFieldScanned) setIsFieldScanned(false);
      if (isZPScanned) setIsZPScanned(false);
    }
  }, [scannedValues]);

  return { scannedValues, setScannedValues };
};
