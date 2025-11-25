import { AllExportToCustomerSubmodules } from "@/features/shared/types/interfaces-auth";
import { TrayInfoWithPics } from "@/features/shared/types/interfaces-destroy_tray";
import { ZPShortenedInfoWithPics } from "@/features/shared/types/interfaces-zp";
import { useEffect, useState } from "react";

export const useIsSendingOrderExportToCustomerDataAvailable = (
  scannedValue: ZPShortenedInfoWithPics | TrayInfoWithPics | null,
  submoduleType: AllExportToCustomerSubmodules
) => {
  const [isSendingDataAvailable, setIsSendingDataAvailable] = useState(false);

  useEffect(() => {
    if (!scannedValue) setIsSendingDataAvailable(false);
    if (submoduleType === "field_crops_works_order_export_to_customer") {
      if (scannedValue && scannedValue.pictures.length >= 2)
        setIsSendingDataAvailable(true);
      if (scannedValue && scannedValue.pictures.length < 2)
        setIsSendingDataAvailable(false);
    }
    if (submoduleType === "greenhouse_crops_works_order_export_to_customer") {
      if (scannedValue) setIsSendingDataAvailable(true);
      if (!scannedValue) setIsSendingDataAvailable(false);
    }
  }, [scannedValue]);

  return { isSendingDataAvailable };
};
