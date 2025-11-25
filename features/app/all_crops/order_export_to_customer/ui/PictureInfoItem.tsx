import { lightColor } from "@/features/shared/constants/colorThemeVars";
import ButtonIcon from "@/features/shared/ui/button/ButtonIcon";
import { useImagesHelper } from "@/features/shared/utils/useImagesHelper";
import { CameraCapturedPicture } from "expo-camera";
import { Image } from "expo-image";
import { X } from "lucide-react-native";
import { TouchableOpacity, Text, View } from "react-native";

type Props = {
  picture: CameraCapturedPicture;
  index: number;
  setChosenPicture: React.Dispatch<
    React.SetStateAction<CameraCapturedPicture | null>
  >;
  setIsShowDeleteModal: (value: React.SetStateAction<boolean>) => void;
  setIsShowFullPictureModal: (value: React.SetStateAction<boolean>) => void;
};

const PictureInfoItem = (props: Props) => {
  ////vars
  const {
    picture,
    index,
    setChosenPicture,
    setIsShowDeleteModal,
    setIsShowFullPictureModal,
  } = props;
  const { addProperPrefixToBase64 } = useImagesHelper();

  //fn
  const showFullPictureHandler = () => {
    setChosenPicture(picture);
    setIsShowFullPictureModal(true);
  };
  const deletePictureHandler = () => {
    setChosenPicture(picture);
    setIsShowDeleteModal(true);
  };

  ////tsx
  return (
    <>
      <TouchableOpacity
        className="w-full px-6 py-4 mb-2 bg-foreground rounded-app"
        activeOpacity={0.7}
        onPress={showFullPictureHandler}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center justify-start gap-4">
            <View>
              <Image
                source={{ uri: addProperPrefixToBase64("PNG", picture.base64) }}
                style={{ height: 69, width: 60, borderRadius: 8 }}
              />
            </View>
            <View>
              <Text className="text-background-nuance font-default-semibold">{`Zdjęcie: ${
                index + 1
              }`}</Text>
            </View>
          </View>

          <View className="flex-row items-center justify-start gap-4">
            <View>
              <ButtonIcon
                handlePress={deletePictureHandler}
                icon={<X size={24} color={lightColor} strokeWidth={3} />}
                size={44}
                isOutline
                marginLeft={8}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};
export default PictureInfoItem;
