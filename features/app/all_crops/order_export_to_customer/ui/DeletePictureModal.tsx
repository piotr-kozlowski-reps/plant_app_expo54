import Button from "@/features/shared/ui/button/Button";
import { View, Text } from "react-native";
import { Image } from "expo-image";
import { CameraCapturedPicture } from "expo-camera";
import { useImagesHelper } from "@/features/shared/utils/useImagesHelper";

type Props = {
  closeFn: () => void;
  picture: CameraCapturedPicture | null;
  deletePicture: () => void;
};

const DeletePictureModal = (props: Props) => {
  ////vars
  const { closeFn, picture, deletePicture } = props;
  const { addProperPrefixToBase64 } = useImagesHelper();

  //fn
  const deletePictureHandler = () => {
    deletePicture();
    closeFn();
  };

  ////tsx
  return (
    <>
      {!picture ? (
        <View className="flex items-center justify-center w-full h-full">
          <Text>Brak informacji o zdjęciu</Text>
        </View>
      ) : null}
      {picture ? (
        <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
          <View className="relative flex-col items-center justify-center flex-1">
            <View className="w-full pt-16 pb-[4px] border-t-2 border-b-2 border-gray-600 rounded-app">
              <View className="flex items-center justify-center w-full ">
                <Text className="text-center text-foreground font-euclid_semibold">
                  Czy chcesz usunąć to zdjęcie?
                </Text>
              </View>
              <View className="flex items-center justify-center w-full mt-2">
                <Image
                  source={{
                    uri: addProperPrefixToBase64("PNG", picture.base64),
                  }}
                  style={{ height: 300, width: 300, borderRadius: 8 }}
                />
              </View>

              <View className="flex-col justify-center w-full gap-4 px-6 mt-8 items-between">
                <View>
                  <Button title="usuń" handlePress={deletePictureHandler} />
                </View>
                <View>
                  <Button title="powrót" handlePress={closeFn} isOutline />
                </View>
                <View></View>
              </View>
            </View>
          </View>
        </View>
      ) : null}
    </>
  );
};

export default DeletePictureModal;
