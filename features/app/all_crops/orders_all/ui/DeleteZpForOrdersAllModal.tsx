import {
  ZPShortenedInfoWithoutTwrnzw,
  ZPShortenedInfoWithPics,
} from "@/features/shared/types/interfaces-zp";
import BadgeValueHighlighted from "@/features/shared/ui/badge/BadgeValueHighlighted";
import Button from "@/features/shared/ui/button/Button";
import { View, Text } from "react-native";

type Props = {
  closeFn: () => void;
  zpInfo: ZPShortenedInfoWithoutTwrnzw | ZPShortenedInfoWithPics | null;
  actionFn: () => void;
};

const DeleteZpForOrdersAllModal = (props: Props) => {
  ////vars
  const { closeFn, zpInfo, actionFn } = props;

  //  fn
  const actionFnWrapper = () => {
    actionFn();
    closeFn();
  };

  ////tsx
  return (
    <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
      <View className="relative flex-col items-center justify-center flex-1">
        <View className="w-full pt-16 pb-[4px] border-t-2 border-b-2 border-gray-600 rounded-app">
          <View className="flex items-center justify-center w-full ">
            <Text className="text-center text-foreground font-euclid_semibold">
              Czy chcesz usunąć to zlecenie z listy?
            </Text>
          </View>
          <View className="flex items-center justify-center w-full mt-2">
            <BadgeValueHighlighted
              value={zpInfo?.ordnmb ? zpInfo.ordnmb : ""}
            />
          </View>

          <View className="flex-col justify-center w-full gap-4 px-6 mt-8 items-between">
            <View>
              <Button title="usuń" handlePress={actionFnWrapper} />
            </View>
            <View>
              <Button title="powrót" handlePress={closeFn} isOutline />
            </View>
            <View></View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DeleteZpForOrdersAllModal;
