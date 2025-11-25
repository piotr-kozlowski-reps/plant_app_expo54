import { View } from "react-native";

type Props = {
  children: React.ReactNode;
  color?: string;
};

const ContainerHorizontalRoundedFrame = (props: Props) => {
  ////vars
  const { children, color } = props;

  ////tsx
  return (
    <View
      className="relative flex-1 w-full mt-1 border-t-2 border-b-2 rounded-app"
      style={{
        borderColor: color ? color : "#4b5563",
      }}
    >
      {children}
    </View>
  );
};
export default ContainerHorizontalRoundedFrame;
