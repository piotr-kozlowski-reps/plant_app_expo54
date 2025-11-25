import {
  lightColor,
  lightNuanceColor,
} from "@/features/shared/constants/colorThemeVars";
import { ZPInfoForWorkPlanning } from "@/features/shared/types/interfaces-works_planning";
import ButtonIcon from "@/features/shared/ui/button/ButtonIcon";
import { useDatesHelper } from "@/features/shared/utils/useDatesHelper";
import { X } from "lucide-react-native";
import { TouchableOpacity, Text, View } from "react-native";

type Props = {
  zpInfo: ZPInfoForWorkPlanning;
  inHowManyDays: number | null;
  setIsShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setZPSelected: React.Dispatch<
    React.SetStateAction<ZPInfoForWorkPlanning | null>
  >;
};

const ZPItemInWorksPlanningInfo = (props: Props) => {
  ////vars
  const { zpInfo, inHowManyDays, setZPSelected, setIsShowDeleteModal } = props;
  const { addDaysToDate } = useDatesHelper();

  const plannedDateOfWork = addDaysToDate(
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
                {plannedDateOfWork.toLocaleDateString("pl-PL")}
              </Text>
            </Text>

            <Text className="text-background-nuance font-default-semibold">
              {`(+ ${inHowManyDays} ${inHowManyDays === 1 ? "dzień" : "dni"})`}
            </Text>
          </View>

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
        </View>
      </TouchableOpacity>
    </>
  );
};
export default ZPItemInWorksPlanningInfo;
