import { lightColor } from "@/features/shared/constants/colorThemeVars";
import { TrayShortInfo } from "@/features/shared/types/interfaces-tray";
import ButtonIcon from "@/features/shared/ui/button/ButtonIcon";
import { X } from "lucide-react-native";
import { View, Text } from "react-native";

type Props = {
  tray: TrayShortInfo;
  // actionFn: () => void;
  // addQuantityToExistingTrayHandler: (tray: Tray, quantity: number) => void;
  openDeleteModal: () => void;
};

const CotyledonQuilting_TrayItem = (props: Props) => {
  ////vars
  const { tray, openDeleteModal } = props;

  ////tsx
  return (
    <View
      className="w-full px-6 py-3 mb-2 bg-foreground rounded-app"
      // onPress={actionFn}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-col items-start justify-start">
          <View className="flex-row items-end justify-start">
            <View className="">
              <Text className="text-background-nuance font-nav">
                {tray.stk_id}
              </Text>
            </View>
          </View>
        </View>
        <View className="flex-row items-center justify-center gap-2">
          <View>
            <ButtonIcon
              handlePress={openDeleteModal}
              icon={<X size={24} color={lightColor} strokeWidth={3} />}
              size={44}
              isOutline
              marginLeft={8}
              outlineColor={lightColor}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
export default CotyledonQuilting_TrayItem;
