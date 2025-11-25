import { TrayInfoWithPics } from "@/features/shared/types/interfaces-destroy_tray";
import { ZPShortenedInfoWithPics } from "@/features/shared/types/interfaces-zp";
import { useEffect, useState } from "react";

export const useIsSendingDataAvailable = (
  scannedValue: ZPShortenedInfoWithPics | TrayInfoWithPics | null
) => {
  const [isSendingDataAvailable, setIsSendingDataAvailable] = useState(false);

  useEffect(() => {
    if (!scannedValue) setIsSendingDataAvailable(false);
    if (scannedValue && scannedValue.pictures.length >= 2)
      setIsSendingDataAvailable(true);
    if (scannedValue && scannedValue.pictures.length < 2)
      setIsSendingDataAvailable(false);
  }, [scannedValue]);

  return { isSendingDataAvailable };
};
