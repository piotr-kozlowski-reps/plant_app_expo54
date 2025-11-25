import { ZPShortenedInfoWithPics } from "@/features/shared/types/interfaces-zp";
import { CameraCapturedPicture } from "expo-camera";
import { useEffect, useState } from "react";

export const useIsTakingPicturesAvailable = (
  scannedValue: {
    pictures: CameraCapturedPicture[];
  } | null
) => {
  const [isTakingPicturesAvailable, setIsTakingPicturesAvailable] =
    useState(true);

  const pictures = scannedValue?.pictures;

  useEffect(() => {
    if (!scannedValue) setIsTakingPicturesAvailable(true);
    if (scannedValue && scannedValue.pictures.length < 5)
      setIsTakingPicturesAvailable(true);
    if (scannedValue && scannedValue.pictures.length >= 5)
      setIsTakingPicturesAvailable(false);
  }, [pictures]);

  return { isTakingPicturesAvailable };
};
