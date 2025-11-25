import clsx from "clsx";
import Checkbox from "expo-checkbox";
import { TouchableOpacity, View, Text } from "react-native";
import { darkColor, primaryColor } from "../../constants/colorThemeVars";

type Props = {
  isActive: boolean;
  value: boolean;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
};

const CheckBoxWithText = (props: Props) => {
  const { isActive, value, setValue, text } = props;

  return (
    <View>
      <TouchableOpacity
        className={clsx(
          "flex-row items-center justify-start",
          isActive ? "" : "opacity-30"
        )}
        onPress={() => setValue((prevState) => !prevState)}
        activeOpacity={0.9}
        disabled={!isActive}
      >
        <View>
          <Checkbox
            style={{
              transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
            }}
            className="mr-2"
            value={value}
            onValueChange={setValue}
            color={value ? darkColor : primaryColor}
          />
        </View>
        <View className="mt-[1px]">
          <View>
            <Text
              className={clsx(
                "text-foreground ",
                value ? "font-default-semibold" : "font-default-normal"
              )}
            >
              {text}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default CheckBoxWithText;
