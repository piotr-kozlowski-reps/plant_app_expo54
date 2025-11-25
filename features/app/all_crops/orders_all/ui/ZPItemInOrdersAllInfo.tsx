import {
  lightColor,
  lightNuanceColor,
} from "@/features/shared/constants/colorThemeVars";
import {
  ZPShortenedInfo,
  ZPShortenedInfoWithoutTwrnzw,
} from "@/features/shared/types/interfaces-zp";
import { useDatesHelper } from "@/features/shared/utils/useDatesHelper";
import { TouchableOpacity, Text, View } from "react-native";
import ButtonIcon from "@/features/shared/ui/button/ButtonIcon";
import { X } from "lucide-react-native";

type Props = {
  zpInfo: ZPShortenedInfoWithoutTwrnzw;
  inHowManyDays: number | null;
  setIsShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setZPSelected: React.Dispatch<
    React.SetStateAction<ZPShortenedInfoWithoutTwrnzw | null>
  >;
  isPossibleToDeleteItem?: boolean;
};
const ZPItemInOrdersAllInfo = (props: Props) => {
  ////vars
  const {
    zpInfo,
    inHowManyDays,
    setIsShowDeleteModal,
    setZPSelected,
    isPossibleToDeleteItem = true,
  } = props;
  const { addDaysToDate } = useDatesHelper();

  const dateOfOrderToMoveToHardener = addDaysToDate(
    new Date(Date.now()),
    inHowManyDays ? inHowManyDays : 0
  );

  //fn
  const handleDeleteZp = () => {
    setZPSelected(zpInfo);
    setIsShowDeleteModal(true);
  };

  ////tsx
  return (
    <>
      <TouchableOpacity
        className="w-full px-6 py-4 mb-2 bg-foreground rounded-app"
        activeOpacity={1}
        // onPress={isActive ? () => deleteZpAction() : undefined}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-col items-start justify-start">
            <Text className="text-background-nuance font-default-semibold">
              {zpInfo.ordnmb}
            </Text>
            <Text className="text-background-nuance font-default-normal">
              Zlecenie na dzień:{" "}
              <Text className="text-background-nuance font-default-semibold">
                {dateOfOrderToMoveToHardener.toLocaleDateString("pl-PL")}
              </Text>
            </Text>

            <Text className="text-background-nuance font-default-semibold">
              {`(+ ${inHowManyDays} ${inHowManyDays === 1 ? "dzień" : "dni"})`}
            </Text>
          </View>

          {isPossibleToDeleteItem ? (
            <View className="flex-row items-center justify-start">
              <ButtonIcon
                handlePress={handleDeleteZp}
                icon={<X size={24} color={lightColor} strokeWidth={3} />}
                size={44}
                isOutline
                marginLeft={8}
                outlineColor={lightNuanceColor}
              />
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    </>
  );
};
export default ZPItemInOrdersAllInfo;
