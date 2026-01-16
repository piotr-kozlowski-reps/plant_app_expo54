import {
  darkColor,
  lightNuanceColor,
} from "@/features/shared/constants/colorThemeVars";
import ThreeChevrons from "@/features/shared/ui/icons/ThreeChevrons";
import clsx from "clsx";
import { View, Text, TouchableOpacity } from "react-native";

type Props = {
  title: string;
  subTitle?: string;
  subTitleName?: string;
  id: number;
  actionFn: (id: number) => void;
  isActive?: boolean;
};

const ListItemName = (props: Props) => {
  ////vars
  const {
    title,
    subTitle,
    subTitleName,
    id,
    actionFn,
    isActive = true,
  } = props;

  ////tsx
  return (
    <TouchableOpacity
      className={clsx(
        "h-[64px] flex-row items-center justify-between  rounded-app mb-4 shadow-sm px-6",
        isActive ? "bg-background-nuance opacity-100" : "bg-gray opacity-80"
      )}
      onPress={isActive ? () => actionFn(id) : undefined}
    >
      <View className="flex items-start justify-start">
        <View>
          <Text
            className={clsx(
              "font-default-bold text-foreground",
              isActive ? "opacity-100" : "opacity-70"
            )}
          >
            {title}
          </Text>
        </View>
        {subTitle ? (
          <Text
            className={clsx(
              "font-default-normal text-foreground",
              isActive ? "opacity-100" : "opacity-70"
            )}
          >
            {subTitleName ? `${subTitleName}: ` : ""}
            {subTitle}
          </Text>
        ) : null}
      </View>
      <View>
        <ThreeChevrons color={darkColor} />
      </View>
    </TouchableOpacity>
  );
};
export default ListItemName;
