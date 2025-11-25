import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";

type Props = {
  handlePress: () => void;
  disabled?: boolean;
  visible?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

const ButtonAsChild = (props: Props) => {
  ////vars
  const {
    handlePress,
    disabled = false,
    visible = true,
    children,
    className,
    style,
  } = props;

  ////tsx
  return (
    <TouchableOpacity
      onPress={!visible || disabled ? undefined : handlePress}
      activeOpacity={0.7}
      disabled={disabled}
      className={className}
      style={style}
    >
      {children}
    </TouchableOpacity>
  );
};

export default ButtonAsChild;
