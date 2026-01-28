import { lightNuanceColor } from "@/features/shared/constants/colorThemeVars";
import { TechnicalInformation } from "@/features/shared/types/interfaces-information";
import BadgeValueHighlighted from "@/features/shared/ui/badge/BadgeValueHighlighted";
import Button from "@/features/shared/ui/button/Button";
import ContainerHorizontalRoundedFrame from "@/features/shared/ui/container/ContainerHorizontalRoundedFrame";
import { View, ScrollView, Text } from "react-native";
import DetailedTechnologicalInfoItem from "./DetailedTechnologicalInfoItem";

type Props = {
  closeFn: () => void;
  informationData: TechnicalInformation[];
  scannedPureValue: string;
  // isLocalization: boolean;
  // isZP: boolean;
  // isTray: boolean;
};

const DetailedTechnologicalInfoModal = (props: Props) => {
  ////vars
  const {
    closeFn,
    informationData,
    // isLocalization,
    scannedPureValue,
    // isZP,
    // isTray,
  } = props;

  let twrCode = "";
  let twrName = "";
  if (informationData.length > 0) {
    twrCode = informationData[0].twr_kod ? informationData[0].twr_kod : "";
    twrName = informationData[0].twr_nazwa ? informationData[0].twr_nazwa : "";
  }
  ////tsx
  return (
    <View className="absolute left-0 right-0 w-full bottom-8 top-8">
      <View className="relative flex-col items-center justify-center flex-1">
        <View className="w-full pt-8 pb-[4px] border-t-2 border-b-2 border-gray-600 rounded-app flex-1 ">
          <View className="flex-1">
            <View className="mb-4">
              <View className="flex-col items-center justify-center">
                <View className="">
                  <BadgeValueHighlighted value={`${scannedPureValue}`} />
                </View>
                <View className="mt-1">
                  <Text className="text-center font-default-normal">
                    Kod towaru:{" "}
                    <Text className=" text-foreground font-default-bold">
                      {twrCode}
                    </Text>
                  </Text>
                </View>
                <View>
                  <Text className="text-center font-default-normal">
                    Nazwa towaru:{" "}
                    <Text className=" text-foreground font-default-bold">
                      {twrName}
                    </Text>
                  </Text>
                </View>
              </View>
            </View>

            <ContainerHorizontalRoundedFrame color={lightNuanceColor}>
              <ScrollView className="w-full ">
                <View className="flex-row flex-wrap items-center justify-start flex-1 px-8 py-4">
                  {informationData.map((item, index) => (
                    <DetailedTechnologicalInfoItem
                      key={index}
                      item={item}
                      index={index}
                    />
                  ))}
                </View>
              </ScrollView>
            </ContainerHorizontalRoundedFrame>
          </View>
          <View className="px-6 mt-8 mb-[16px]">
            <View>
              <Button title="powrót" handlePress={closeFn} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
export default DetailedTechnologicalInfoModal;
