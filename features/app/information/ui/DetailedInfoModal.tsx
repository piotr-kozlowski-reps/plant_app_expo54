import { lightNuanceColor } from "@/features/shared/constants/colorThemeVars";
import { InformationDTO } from "@/features/shared/types/interfaces-information";
import BadgeValueHighlighted from "@/features/shared/ui/badge/BadgeValueHighlighted";
import Button from "@/features/shared/ui/button/Button";
import ContainerHorizontalRoundedFrame from "@/features/shared/ui/container/ContainerHorizontalRoundedFrame";
import { View, ScrollView } from "react-native";
import DetailedInfoItem from "./DetailedInfoItem";

type Props = {
  closeFn: () => void;
  informationData: InformationDTO[];
  scannedPureValue: string;
  isLocalization: boolean;
  isZP: boolean;
  isTray: boolean;
};

const DetailedInfoModal = (props: Props) => {
  ////vars
  const {
    closeFn,
    informationData,
    isLocalization,
    scannedPureValue,
    isZP,
    isTray,
  } = props;

  //fn
  const getProperLabel = (): string => {
    if (!isLocalization && !isZP && !isTray) return "";

    if (isLocalization) return "Lokalizacja:";
    if (isZP) return "ZP:";
    if (isTray) return "Taca:";

    throw new Error("getProperLabel - rest not implemented.");
  };

  ////tsx
  return (
    <View className="absolute left-0 right-0 w-full bottom-8 top-8">
      <View className="relative flex-col items-center justify-center flex-1">
        <View className="w-full pt-8 pb-[4px] border-t-2 border-b-2 border-gray-600 rounded-app flex-1 ">
          <View className="flex-1">
            <View className="mb-6">
              <View className="flex-row items-center justify-center">
                {/* <View>
                  <Text className="text-center text-foreground font-nav">
                    {`${getProperLabel()} `}
                  </Text>
                </View> */}
                <View className="">
                  <BadgeValueHighlighted
                    value={`${getProperLabel()} ${scannedPureValue}`}
                  />
                </View>
              </View>
            </View>

            <ContainerHorizontalRoundedFrame color={lightNuanceColor}>
              <ScrollView className="w-full ">
                <View className="flex-row flex-wrap items-center justify-start flex-1 px-8 py-4">
                  {informationData.map((item, index) => (
                    <DetailedInfoItem key={index} item={item} index={index} />
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

export default DetailedInfoModal;
