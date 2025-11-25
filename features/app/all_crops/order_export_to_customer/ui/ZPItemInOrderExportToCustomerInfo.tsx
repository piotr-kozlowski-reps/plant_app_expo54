import { lightColor } from "@/features/shared/constants/colorThemeVars";
import {
  ZPShortenedInfo,
  ZPShortenedInfoWithPics,
} from "@/features/shared/types/interfaces-zp";
import { useDatesHelper } from "@/features/shared/utils/useDatesHelper";
import { TouchableOpacity, Text, View } from "react-native";
import ButtonIcon from "@/features/shared/ui/button/ButtonIcon";
import { Camera, X } from "lucide-react-native";

type Props = {
  zpInfo: ZPShortenedInfoWithPics;
  inHowManyDays: number | null;
  setIsShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setZPSelected: React.Dispatch<
    React.SetStateAction<ZPShortenedInfoWithPics | null>
  >;
  setIsShowTakePicturesModal: React.Dispatch<React.SetStateAction<boolean>>;
};
const ZPItemInOrderExportToCustomerInfo = (props: Props) => {
  ////vars
  const {
    zpInfo,
    inHowManyDays,
    setIsShowDeleteModal,
    setIsShowTakePicturesModal,
    setZPSelected,
  } = props;
  const { addDaysToDate, renderDateInPolishWay, getDayNameInPolish } =
    useDatesHelper();

  const dateOfOrderToMoveToHardener = addDaysToDate(
    new Date(Date.now()),
    inHowManyDays ? inHowManyDays : 0
  );

  //fn
  const deleteZpHandler = () => {
    setZPSelected(zpInfo);
    setIsShowDeleteModal(true);
  };
  const takePicturesHandler = () => {
    setZPSelected(zpInfo);
    setIsShowTakePicturesModal(true);
  };

  ////tsx
  return (
    <>
      <TouchableOpacity
        className="w-full px-6 py-4 mb-2 bg-foreground rounded-app"
        activeOpacity={1}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-col items-start justify-start">
            <Text className="text-background-nuance font-default-semibold">
              {zpInfo.ordnmb}
            </Text>
            <View className="mt-2">
              <Text className="text-background-nuance font-default-normal">
                TMS:{" "}
                <Text className="text-background-nuance font-default-semibold">
                  {`${renderDateInPolishWay(zpInfo.tmsdat)} `}
                </Text>
              </Text>

              <Text className="text-background-nuance font-default-normal">
                Zlecenie:{" "}
                <Text className="text-background-nuance font-default-semibold">
                  {`${renderDateInPolishWay(
                    dateOfOrderToMoveToHardener
                  )} - ${getDayNameInPolish(dateOfOrderToMoveToHardener)}`}
                </Text>
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-start gap-4">
            <View>
              <ButtonIcon
                handlePress={takePicturesHandler}
                icon={<Camera size={24} color={lightColor} strokeWidth={2} />}
                size={44}
                isOutline
                marginLeft={8}
              />
            </View>
            <View>
              <ButtonIcon
                handlePress={deleteZpHandler}
                icon={<X size={24} color={lightColor} strokeWidth={3} />}
                size={44}
                isOutline
                marginLeft={8}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};
export default ZPItemInOrderExportToCustomerInfo;
