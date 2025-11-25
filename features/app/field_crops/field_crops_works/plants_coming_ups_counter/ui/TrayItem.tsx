import {
  darkColor,
  lightColor,
} from "@/features/shared/constants/colorThemeVars";
import { Tray } from "@/features/shared/types/interfaces-tray";
import BadgeValueHighlighted from "@/features/shared/ui/badge/BadgeValueHighlighted";
import ButtonIcon from "@/features/shared/ui/button/ButtonIcon";
import { Minus, Plus, X } from "lucide-react-native";
import { View, Text, TouchableOpacity } from "react-native";

type Props = {
  tray: Tray;
  actionFn: () => void;
  addQuantityToExistingTrayHandler: (tray: Tray, quantity: number) => void;
  openDeleteModal: () => void;
};

const TrayItem = (props: Props) => {
  ////vars
  const { tray, actionFn, addQuantityToExistingTrayHandler, openDeleteModal } =
    props;

  ////tsx
  return (
    <TouchableOpacity
      className="w-full px-6 py-4 mb-2 bg-foreground rounded-app"
      onPress={actionFn}
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

          <View className="h-[1px] w-16 bg-background-nuance mt-4"></View>

          <View className="flex-row items-end justify-start mt-4">
            <View>
              <Text className="text-background-nuance font-default-semibold">
                ilość:
              </Text>
            </View>
            <BadgeValueHighlighted value={tray.lckcnt} />
          </View>
        </View>
        <View className="flex-row items-center justify-center gap-2">
          <View>
            <ButtonIcon
              handlePress={() => {
                addQuantityToExistingTrayHandler(tray, -1);
              }}
              icon={<Minus size={24} color={lightColor} strokeWidth={3} />}
              size={44}
              isOutline
              marginLeft={8}
            />
          </View>
          <View>
            <ButtonIcon
              handlePress={() => {
                addQuantityToExistingTrayHandler(tray, 1);
              }}
              icon={<Plus size={24} color={lightColor} strokeWidth={3} />}
              size={44}
              isOutline
              marginLeft={8}
            />
          </View>
          <View>
            <ButtonIcon
              handlePress={openDeleteModal}
              icon={<X size={24} color={lightColor} strokeWidth={3} />}
              size={44}
              isOutline
              marginLeft={8}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default TrayItem;
