import { View, Text } from "react-native";

type Props = {
  value: string | number;
};

const BadgeValueHighlighted = (props: Props) => {
  ////vars
  const { value } = props;

  return (
    <View className="px-6 ml-2 bg-background-nuance rounded-app">
      <Text className="text-center text-foreground font-nav">{value}</Text>
    </View>
  );
};
export default BadgeValueHighlighted;
