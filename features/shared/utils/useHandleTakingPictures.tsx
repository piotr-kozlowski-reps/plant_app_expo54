import {
  CameraCapturedPicture,
  CameraPictureOptions,
  CameraView,
} from "expo-camera";
import { useState } from "react";
import { toast } from "sonner-native";
import { ERROR_MESSAGES, MESSAGES } from "./messages";
import * as FileSystem from "expo-file-system";
import { useIsTakingPicturesAvailable } from "@/features/app/all_crops/order_export_to_customer/domain/useIsTakingPicturesAvailable";

type AnyObjectWithPictures = {
  pictures: CameraCapturedPicture[];
};

export const useHandleTakingPictures = <T extends AnyObjectWithPictures>(
  scannedValue: T | null,
  cameraRef: React.MutableRefObject<CameraView | null>,
  setScannedValue: (value: React.SetStateAction<T | null>) => void
) => {
  //pictures state
  const [chosenPicture, setChosenPicture] =
    useState<CameraCapturedPicture | null>(null);
  const { isTakingPicturesAvailable } =
    useIsTakingPicturesAvailable(scannedValue);

  //modals connected
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [isShowFullPictureModal, setIsShowFullPictureModal] = useState(false);

  //fn
  const takePhotoHandler = async () => {
    if (cameraRef.current) {
      const options: CameraPictureOptions = {
        quality: 0.4,
        base64: true,
        exif: false,
        imageType: "png",
      };
      const takenPhoto = await cameraRef.current.takePictureAsync(options);

      if (!takenPhoto) {
        toast.warning(ERROR_MESSAGES.COULD_NOT_TAKE_PHOTO);
        return;
      }

      addPhoto(takenPhoto);
      await deleteAllCachedPhotos();
    }
  };

  async function deleteAllCachedPhotos() {
    const appCachePath = FileSystem.cacheDirectory;
    if (!appCachePath) {
      toast.warning(
        "Błąd podczas usuwania zdjęć, brak informacji o katalogu z cache'em aplikacji."
      );
      return;
    }

    const path = appCachePath + "/Camera/";
    const filesNames: string[] = await FileSystem.readDirectoryAsync(path);

    for (const fileName of filesNames) {
      await FileSystem.deleteAsync(path + fileName, { idempotent: true });
    }
  }

  const addPhoto = (photo: CameraCapturedPicture) => {
    if (!photo || !scannedValue) {
      throw new Error(
        "useScanValuesForOrderToHardener -> addPhoto - no photo or no scanned value."
      );
    }

    const currentPictures = [...scannedValue.pictures];
    currentPictures.push(photo);

    setScannedValue({
      ...scannedValue,
      pictures: currentPictures,
    });
  };

  const deletePicture = (): void => {
    if (!chosenPicture || !scannedValue) {
      toast.warning(ERROR_MESSAGES.PICTURE_CANNOT_BE_DELETED);
      return;
    }

    const currentPicturesCopy = [...scannedValue.pictures];
    const updatedPictures = currentPicturesCopy.filter(
      (picture) => picture.uri !== chosenPicture.uri
    );
    toast.success(MESSAGES.PICTURE_DELETED_SUCCESS);
    setScannedValue({ ...scannedValue, pictures: updatedPictures });
  };

  ////hook return
  return {
    chosenPicture,
    isTakingPicturesAvailable,
    isShowDeleteModal,
    isShowFullPictureModal,
    setIsShowFullPictureModal,
    setIsShowDeleteModal,
    setChosenPicture,
    takePhotoHandler,
    deletePicture,
  };
};
