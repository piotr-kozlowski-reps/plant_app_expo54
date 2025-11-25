import { View } from "react-native";

type Props = {
  children: React.ReactNode;
};

const AppSectionBackground = (props: Props) => {
  ////vars
  const { children } = props;

  ////tsx
  return (
    <View className="flex-1 mt-6 mb-4 bg-yellow rounded-br-[0px] rounded-tr-[96px] rounded-tl-[32px] rounded-bl-[96px] w-full">
      {children}
    </View>
  );
};

export default AppSectionBackground;
