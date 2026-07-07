import { useDatesHelper } from "@/features/shared/utils/useDatesHelper";
import { View, Text } from "react-native";

import { ZpToChemicalTreatments } from "@/features/shared/types/interfaces-chemical_treatments_don";

type Props = {
  zpToShow: ZpToChemicalTreatments;
};

const ZpToListInfoForChemicalTreatmentsDonItem = (props: Props) => {
  ////vars
  const { zpToShow } = props;
  const { renderDateInPolishWay } = useDatesHelper();

  ////tsx
  return (
    <>
      <View className="flex-row items-center justify-between w-full my-4">
        <View>
          <Text className="text-foreground font-default-semibold">
            {zpToShow.ordnmb}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="">
            <Text className="text-foreground font-default-normal">data: </Text>
          </View>

          <View>
            <Text className="text-foreground font-default-semibold">
              {renderDateInPolishWay(zpToShow.chemical_treatment_date)}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="">
            <Text className="text-foreground font-default-normal">
              zabieg:{" "}
            </Text>
          </View>

          <View>
            <Text className="text-foreground font-default-semibold">
              {zpToShow.tredscrpt}
            </Text>
          </View>
        </View>
      </View>
      <View className="w-full h-[1px] bg-foreground opacity-30"></View>
    </>
  );
};
export default ZpToListInfoForChemicalTreatmentsDonItem;
