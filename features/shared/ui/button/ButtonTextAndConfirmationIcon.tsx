import { Check } from "lucide-react-native";

import { lightColor } from "../../constants/colorThemeVars";
import ButtonTextAndIcon from "./ButtonTextAndIcon";

type Props = {
  actionFn: () => void;
  text: string;
  isCheckedValue: boolean;
};

const ButtonTextAndConfirmationIcon = (props: Props) => {
  ////vars
  const { actionFn, text, isCheckedValue } = props;
  return (
    <ButtonTextAndIcon
      actionFn={actionFn}
      text={text}
      icon={
        isCheckedValue ? (
          <Check size={24} color={lightColor} strokeWidth={3} />
        ) : (
          <></>
        )
      }
      isBlack={isCheckedValue}
      isWhite={!isCheckedValue}
    />
  );
};
export default ButtonTextAndConfirmationIcon;
