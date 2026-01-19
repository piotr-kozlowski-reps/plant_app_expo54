import { InformationDTO } from "@/features/shared/types/interfaces-information";
import { useDatesHelper } from "@/features/shared/utils/useDatesHelper";
import { isValidElement } from "react";
import { Text, View } from "react-native";

export const useGetDetailedInfoHelpers = () => {
  const { checkIsStringValidToCreateADateObject, renderDateInPolishWay } =
    useDatesHelper();

  const getCorrectedRealizationSowingRootstockPOM = (
    informationData: InformationDTO[],
  ): string | React.ReactNode | null => {
    const planSowingRootstockPOM = informationData.find(
      (item) => item.label === "PLAN WYSIEW PODKŁADKI POM",
    );
    const realizationSowingRootstockPOM = informationData.find(
      (item) => item.label === "REALIZACJA WYSIEW PODKŁADKI POM",
    );

    if (
      !planSowingRootstockPOM ||
      !planSowingRootstockPOM.value ||
      !realizationSowingRootstockPOM ||
      !realizationSowingRootstockPOM.value ||
      isValidElement(realizationSowingRootstockPOM.value)
    )
      return null;

    const planSowingRootstockPOM_TypedAsString =
      planSowingRootstockPOM.value as string;
    const planDate = checkIsStringValidToCreateADateObject(
      planSowingRootstockPOM_TypedAsString,
    )
      ? new Date(planSowingRootstockPOM_TypedAsString)
      : null;

    const realizationSowingRootstockPOM_TypedAsString =
      realizationSowingRootstockPOM.value as string;

    const slicedDateFromRealization =
      realizationSowingRootstockPOM_TypedAsString.slice(0, 10);

    const slicedNameFromRealization =
      realizationSowingRootstockPOM_TypedAsString.slice(
        10,
        realizationSowingRootstockPOM_TypedAsString.length,
      );

    const realizationDate = checkIsStringValidToCreateADateObject(
      slicedDateFromRealization as string,
    )
      ? new Date(slicedDateFromRealization as string)
      : null;

    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    if (planDate && realizationDate) {
      const diffInDays =
        (realizationDate.getTime() - planDate.getTime()) / MS_PER_DAY;

      const JSX: React.ReactNode = (
        <View className="">
          <Text className="text-destructive font-nav">
            {renderDateInPolishWay(realizationDate)}
            <Text className="text-foreground font-nav">{`${" "}${" "}${" "}${slicedNameFromRealization},`}</Text>
            {diffInDays === 0 ? (
              <Text className="text-foreground font-nav">, 0 dni</Text>
            ) : null}
            {diffInDays === 1 ? (
              <Text className="text-destructive font-nav">, +1 dzień</Text>
            ) : null}
            {diffInDays > 1 ? (
              <Text className="text-destructive font-nav">{`${" "}${" "}${" "}+${diffInDays} dni`}</Text>
            ) : null}
            {diffInDays === -1 ? (
              <Text className="text-destructive font-nav">, -1 dzień</Text>
            ) : null}
            {diffInDays < -1 ? (
              <Text className="text-destructive font-nav">{`${" "}${" "}${" "}-${diffInDays} dni`}</Text>
            ) : null}
          </Text>
        </View>
      );

      return JSX;
    }

    return null;
  };

  return { getCorrectedRealizationSowingRootstockPOM };
};
