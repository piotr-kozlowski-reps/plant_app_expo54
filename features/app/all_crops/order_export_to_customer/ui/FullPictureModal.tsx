import { CameraCapturedPicture } from "expo-camera";
import { View, Text } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import { useImagesHelper } from "@/features/shared/utils/useImagesHelper";

type Props = {
  closeFn: () => void;
  picture: CameraCapturedPicture | null;
  deletePicture: () => void;
};

const FullPictureModal = (props: Props) => {
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
          <View className="relative w-full h-full px-6">
            <View>
              <Image
                source={{
                  uri: addProperPrefixToBase64("PNG", picture.base64),
                }}
                style={{ height: "100%", width: "100%", borderRadius: 8 }}
                contentFit="scale-down"
              />
            </View>
          </View>
          <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
            <SafeAreaView>
              <View className="flex-col items-center justify-between w-full h-full">
                <View className="flex-1"></View>
                <View>
                  <View className="flex-row items-center justify-between w-full pl-6 mt-4 mb-6">
                    <View className="flex-1">
                      <ButtonTextAndThreeArrows
                        actionFn={deletePictureHandler}
                        text="skasuj zdjęcie"
                        isBackground
                      />
                    </View>
                    <View className="ml-6">
                      <ButtonBack actionFn={closeFn} isOutline={false} />
                    </View>
                  </View>
                </View>
              </View>
            </SafeAreaView>
          </View>
        </View>
      ) : null}
    </>
  );
};
export default FullPictureModal;
