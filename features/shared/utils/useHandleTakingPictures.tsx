import {
  CameraCapturedPicture,
  CameraPictureOptions,
  CameraView,
} from "expo-camera";
import { useState } from "react";
import { toast } from "sonner-native";
import { ERROR_MESSAGES, MESSAGES } from "./messages";
import * as FileSystemLegacy from "expo-file-system/legacy";
import { useIsTakingPicturesAvailable } from "@/features/app/all_crops/order_export_to_customer/domain/useIsTakingPicturesAvailable";

type AnyObjectWithPictures = {
  pictures: CameraCapturedPicture[];
};

export const useHandleTakingPictures = <T extends AnyObjectWithPictures>(
  scannedValue: T | null,
  cameraRef: React.MutableRefObject<CameraView | null>,
  setScannedValue: (value: React.SetStateAction<T | null>) => void,
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
    try {
      if (cameraRef.current) {
        const options: CameraPictureOptions = {
          quality: 0.1,
          base64: true,
          exif: false,
          imageType: "png",
        };
        const takenPhoto = await cameraRef.current.takePictureAsync(options);

        if (!takenPhoto) {
          toast.warning(ERROR_MESSAGES.COULD_NOT_TAKE_PHOTO, {
            id: ERROR_MESSAGES.COULD_NOT_TAKE_PHOTO,
          });
          return;
        }

        addPhoto(takenPhoto);
        await deleteAllCachedPhotos();
      }
    } catch (error) {
      toast.warning(ERROR_MESSAGES.COULD_NOT_TAKE_PHOTO, {
        id: ERROR_MESSAGES.COULD_NOT_TAKE_PHOTO,
      });
      console.error(error);
    }
  };

  async function deleteAllCachedPhotos() {
    try {
      const appCachePath = FileSystemLegacy.cacheDirectory;
      if (!appCachePath) {
        toast.warning(
          ERROR_MESSAGES.ERROR_WHEN_DELETING_PICTURES_NO_DIRECTORY,
          {
            id: ERROR_MESSAGES.ERROR_WHEN_DELETING_PICTURES_NO_DIRECTORY,
          },
        );
        return;
      }

      const path = appCachePath + "/Camera/";
      const filesNames: string[] =
        await FileSystemLegacy.readDirectoryAsync(path);

      for (const fileName of filesNames) {
        await FileSystemLegacy.deleteAsync(path + fileName, {
          idempotent: true,
        });
      }
    } catch (error) {
      toast.warning(ERROR_MESSAGES.ERROR_WHEN_DELETING_PICTURES, {
        id: ERROR_MESSAGES.ERROR_WHEN_DELETING_PICTURES,
      });
      console.error(error);
    }
  }

  const addPhoto = (photo: CameraCapturedPicture) => {
    if (!photo || !scannedValue) {
      throw new Error(
        "useScanValuesForOrderToHardener -> addPhoto - no photo or no scanned value.",
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
      toast.warning(ERROR_MESSAGES.PICTURE_CANNOT_BE_DELETED, {
        id: ERROR_MESSAGES.PICTURE_CANNOT_BE_DELETED,
      });
      return;
    }

    const currentPicturesCopy = [...scannedValue.pictures];
    const updatedPictures = currentPicturesCopy.filter(
      (picture) => picture.uri !== chosenPicture.uri,
    );
    toast.success(MESSAGES.PICTURE_DELETED_SUCCESS, {
      id: MESSAGES.PICTURE_DELETED_SUCCESS,
    });
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
