import { CameraCapturedPicture } from "expo-camera";
// import { SaveFormat, useImageManipulator } from "expo-image-manipulator";
import { SaveFormat, manipulateAsync } from "expo-image-manipulator";

export const useImagesHelper = () => {
  async function processPhoto(
    takenPhoto: CameraCapturedPicture
  ): Promise<CameraCapturedPicture> {
    // const context = useImageManipulator(
    //   addProperPrefixToBase64("PNG", takenPhoto.base64)
    // );
    // context.resize({
    //   width: 1024,
    // });
    // const image = await context.renderAsync();
    // const resultPhoto = await image.saveAsync({
    //   format: SaveFormat.PNG,
    //   base64: true,
    // });

    //TODO: check

    const result = await manipulateAsync(
      takenPhoto.uri,
      [{ resize: { width: 1024 } }],
      { format: SaveFormat.PNG, base64: true }
    );

    return result as CameraCapturedPicture;
  }

  const addProperPrefixToBase64 = (
    imageFormat: "JPG" | "PNG",
    imageAsBase64: string | undefined
  ): string => {
    if (imageFormat === "JPG") return `data:image/jpeg;base64,${imageAsBase64}`;
    if (imageFormat === "PNG") return `data:image/png;base64,${imageAsBase64}`;

    throw new Error("addProperPrefixToBase64 - unsupported image format");
  };

  return { processPhoto, addProperPrefixToBase64 };
};
