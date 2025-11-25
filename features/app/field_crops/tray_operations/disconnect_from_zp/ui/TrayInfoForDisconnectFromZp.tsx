import {
  lightColor,
  lightNuanceColor,
} from "@/features/shared/constants/colorThemeVars";
import { TrayScannedValueForDisconnectFromZp } from "@/features/shared/types/interfaces-disconnect_from_zp";
import { TrayScannedValueForMovingToGarden } from "@/features/shared/types/interfaces-move_to_garden";
import ButtonIcon from "@/features/shared/ui/button/ButtonIcon";
import { X } from "lucide-react-native";
import { View, Text, TouchableOpacity } from "react-native";

type Props = {
  index: number;
  tray: TrayScannedValueForDisconnectFromZp;
  deleteAction: (tray: TrayScannedValueForDisconnectFromZp) => void;
  // changeDataFn: () => void;
  setChosenTray: React.Dispatch<
    React.SetStateAction<TrayScannedValueForDisconnectFromZp | null>
  >;
};

const TrayInfoForDisconnectFromZp = (props: Props) => {
  ////vars
  const { tray, deleteAction, index, setChosenTray } = props;

  const changeDataModalOpenHandler = () => {
    setChosenTray(tray);
    // changeDataFn();
  };

  return (
    <>
      <TouchableOpacity
        className="w-full px-6 py-4 mb-2 bg-foreground rounded-app"
        activeOpacity={1}
        onPress={changeDataModalOpenHandler}
      >
        <View className="flex-row items-center justify-between">
          <View className="mr-4">
            <Text className="text-background-nuance font-default-semibold">
              {index + 1}.
            </Text>
          </View>
          <View className="flex-col items-start justify-start flex-1">
            <Text className="text-background-nuance font-default-semibold">
              {tray.stk_id}
            </Text>
            <View className="w-full mt-1 mb-1">
              <View className="w-24 h-[1px] bg-background-nuance"></View>
            </View>
            <Text className="text-background-nuance font-default-normal">
              ZP:{" "}
              <Text className="text-background-nuance font-default-semibold">
                {tray.ordnmb}
              </Text>
            </Text>
            <Text className="text-background-nuance font-default-normal">
              Nazwa:{" "}
              <Text className="text-background-nuance font-default-semibold">
                {tray.twrnzw}
              </Text>
            </Text>
            {/* <View className="mt-2">
              <Text className="text-background-nuance font-default-normal">
                Powód:{" "}
                <Text className="text-background-nuance font-default-semibold">
                  {tray.delete_dscrpt ? tray.delete_dscrpt : "-"}
                </Text>
              </Text>
            </View> */}
          </View>

          <View className="flex-row items-center justify-start">
            <ButtonIcon
              handlePress={() => deleteAction(tray)}
              icon={<X size={24} color={lightColor} strokeWidth={3} />}
              size={44}
              isOutline
              marginLeft={8}
              outlineColor={lightNuanceColor}
            />
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};
export default TrayInfoForDisconnectFromZp;
