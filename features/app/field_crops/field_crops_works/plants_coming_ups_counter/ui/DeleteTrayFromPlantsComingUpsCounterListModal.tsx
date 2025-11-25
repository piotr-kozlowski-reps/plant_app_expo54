import { Tray } from "@/features/shared/types/interfaces-tray";
import { View, Text } from "react-native";
import Button from "@/features/shared/ui/button/Button";
import ButtonTrayBadge from "@/features/shared/ui/button/ButtonTrayBadge";

type Props = {
  closeFn: () => void;
  tray: Tray | null;
  deleteExistingTrayHandler: (tray: Tray) => void;
};

const DeleteTrayFromPlantsComingUpsCounterListModal = (props: Props) => {
  ////vars
  const { tray, closeFn, deleteExistingTrayHandler } = props;

  if (!tray) {
    throw new Error(
      "DeleteTrayFromPlantsComingUpsCounterListModal -> tray is null"
    );
  }

  //fn
  const handleDeleteTray = () => {
    deleteExistingTrayHandler(tray);
    closeFn();
  };

  ////tsx
  return (
    <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
      <View className="relative flex-col items-center justify-center flex-1">
        <View className="w-full pt-16 pb-[4px] border-t-2 border-b-2 border-gray-600 rounded-app">
          <View className="flex items-center justify-center w-full ">
            <Text className="text-center text-foreground font-euclid_semibold">
              Czy chcesz usunąć informację o brakach
            </Text>
            <Text className="text-center text-foreground font-euclid_semibold">
              w wybranej tacy?
            </Text>
          </View>
          <View className="flex items-center justify-center w-full mt-2">
            <ButtonTrayBadge tray={tray} actionFn={() => {}} isCentered />
          </View>

          <View className="flex-col justify-center w-full gap-4 px-6 mt-8 items-between">
            <View>
              <Button title="usuń" handlePress={handleDeleteTray} />
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

export default DeleteTrayFromPlantsComingUpsCounterListModal;
