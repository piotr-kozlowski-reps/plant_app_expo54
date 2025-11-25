import { Localization } from "@/features/shared/types/interfaces-localization";
import {
  ZPCombinedInfo,
  ZPLocalizationInfoPlusQuantityToBeMoved,
} from "@/features/shared/types/interfaces-zp";
import ContainerHorizontalRoundedFrame from "@/features/shared/ui/container/ContainerHorizontalRoundedFrame";
import { View, Text, ScrollView } from "react-native";
import ZPItemInternalTransport from "./ZPItemInternalTransport";
import {
  lightNuanceColor,
  yellowColor,
} from "@/features/shared/constants/colorThemeVars";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import { useShowModal } from "@/features/shared/utils/useShowModal";
import ChangeQuantityForInternalTransportModal from "./ChangeQuantityForInternalTransportModal";
import { useState } from "react";

import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import { AllInternalTransportSubmodules } from "@/features/shared/types/interfaces-auth";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";

type Props = {
  closeFn: () => void;
  zpCombinedInfo: ZPCombinedInfo | null;
  localization: Localization | null;
  changeOverallZPsWithQuantities: () => void;
  changeQuantityHandler: (
    localizationWithNewQuantity: ZPLocalizationInfoPlusQuantityToBeMoved
  ) => void;
  clearChosenZPCombinedInfo: () => void;
  submoduleType: AllInternalTransportSubmodules;
};

const ZpConfirmQuantitiesInternalTransportModal = (props: Props) => {
  ////vars
  const {
    closeFn,
    zpCombinedInfo,
    localization,
    changeQuantityHandler,
    changeOverallZPsWithQuantities,
    clearChosenZPCombinedInfo,
    submoduleType,
  } = props;

  const isGru = submoduleType === "field_crops_works_internal_transport";

  //handle quantity per localization
  const [isShowQuantityModal, setIsShowQuantityModal] = useShowModal();
  const [chosenLocalization, setChosenLocalization] =
    useState<ZPLocalizationInfoPlusQuantityToBeMoved | null>(null);
  const quantityPerLocalizationHandler = (
    loc: ZPLocalizationInfoPlusQuantityToBeMoved
  ) => {
    setChosenLocalization(loc);
    setIsShowQuantityModal(true);
  };

  //final confirmation
  const addZPWithLocalizationsAndQuantitiesHandler = () => {
    changeOverallZPsWithQuantities();
    clearChosenZPCombinedInfo();
    closeFn();
  };

  //TODO: do layout for no zp info or no localization in modal

  ////tsx
  return (
    <>
      {/* {!zpCombinedInfo ? (
        <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
          <View className="relative flex-col items-center justify-center flex-1">
            <View className="w-full pt-16 pb-[4px] border-t-2 border-b-2 border-gray-600 rounded-app px-8">
              <View className="flex items-center justify-center w-full ">
                <Text className="text-center text-foreground font-euclid_semibold">
                  Brak informacji o zleceniu!
                </Text>
              </View>
              <View>
                <Button title="powrót" handlePress={closeFn} isOutline />
              </View>
            </View>
          </View>
        </View>
      ) : null} */}
      {!zpCombinedInfo ? (
        <View>
          <Text>
            TODO: do layout for no zp info or no localization in modal
          </Text>
        </View>
      ) : null}
      {zpCombinedInfo && localization && zpCombinedInfo.localization.length ? (
        <View className="absolute left-0 right-0 w-full bottom-8 top-8">
          <View className="relative flex-col items-center justify-center flex-1">
            <View className="w-full flex-1 pt-8 pb-[4px] border-t-2 border-b-2 border-gray-600 rounded-app ">
              <View className="flex items-center justify-center w-full px-8">
                <Text className="text-center text-foreground font-nav">
                  {isGru ? "Potwierdzanie ilości tac" : "Potwierdzenie ilosci"}
                </Text>
              </View>
              <View className="px-8">
                <View className="mt-[24px]">
                  <Text className="text-foreground font-default-normal">
                    Zlecenie:{" "}
                    <Text className="font-nav text-foreground">
                      {zpCombinedInfo.ordnmb}
                    </Text>
                  </Text>
                </View>
                <View className="">
                  <Text className="text-foreground font-default-normal">
                    Kod:{" "}
                    <Text className="font-nav text-foreground">
                      {zpCombinedInfo.twrkod}
                    </Text>
                  </Text>
                </View>
                <View className="">
                  <Text className="text-foreground font-default-normal">
                    Produkt:{" "}
                    <Text className="font-nav text-foreground">
                      {zpCombinedInfo.twrnzw}
                    </Text>
                  </Text>
                </View>
                <View className="flex-row items-end justify-start">
                  <View>
                    <Text className="text-foreground font-default-normal">
                      {isGru ? "Ilość tac:" : "Ilość"}
                    </Text>
                  </View>
                  <View className="ml-2">
                    <Text className="text-foreground font-nav">
                      {zpCombinedInfo.stkcnt}
                    </Text>
                  </View>
                  <View>
                    <Text className="ml-4 text-foreground font-default-normal">
                      do:
                    </Text>
                  </View>
                  <View className="ml-2">
                    <Text className="text-foreground font-nav">
                      {localization.planam}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="px-8 mt-6">
                <View>
                  <Text className="text-foreground font-default-normal">
                    z lokalizacji:
                  </Text>
                </View>
              </View>
              {/* <View className="flex items-center justify-center w-full mt-2">
              <ButtonBadge zpItem={zpItem} actionFn={() => {}} isCentered />
            </View> */}

              <ContainerHorizontalRoundedFrame color={lightNuanceColor}>
                {/* {scannedValues.length === 0 ? (
                  <View className="relative flex-1 w-full h-full">
                    <View className="absolute top-0 bottom-0 left-0 right-0 opacity-50 rounded-app">
                      <View className="flex items-center justify-center w-full h-full">
                        <Image
                          source={images.hashed_background}
                          style={{
                            width: "100%",
                            height: "100%",
                            resizeMode: "cover",
                            borderRadius: 32,
                          }}
                          contentFit="cover"
                        />
                      </View>
                    </View>
                    <View className="absolute top-0 bottom-0 left-0 right-0 rounded-app">
                      <View className="flex items-center justify-center w-full h-full ">
                        <Text className="p-6 bg-yellow font-default-bold text-background-nuance rounded-app">
                          {MESSAGES.LACK_OF_SCANNED_ZP}
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : null} */}

                <ScrollView className="w-full">
                  <View className="flex-row flex-wrap items-center justify-start flex-1 px-8 py-4 ">
                    {zpCombinedInfo.localization.map((loc) => (
                      <ZPItemInternalTransport
                        key={loc.id____}
                        localization={loc}
                        actionFn={() => quantityPerLocalizationHandler(loc)}
                      />
                    ))}
                  </View>
                </ScrollView>
              </ContainerHorizontalRoundedFrame>

              <View className="flex-row items-center justify-between w-full pl-6 mt-6 mb-[16px]">
                <View className="flex-1">
                  <ButtonTextAndThreeArrows
                    actionFn={addZPWithLocalizationsAndQuantitiesHandler}
                    text="dodaj do listy"
                    isBackground
                    // disabled={scannedValues.length === 0 || isForceToScanField}
                  />
                </View>
                <View className="ml-6">
                  <ButtonBack actionFn={closeFn} isOutline={false} />
                </View>
              </View>
            </View>
          </View>
        </View>
      ) : null}

      {/* delete zp modal */}
      <ModalInternal
        isOpen={isShowQuantityModal}
        isTransparent={false}
        backgroundColor={yellowColor}
      >
        <ChangeQuantityForInternalTransportModal
          closeFn={() => setIsShowQuantityModal(false)}
          localization={chosenLocalization}
          ZPId={zpCombinedInfo?.ordnmb || ""}
          changeQuantityHandler={changeQuantityHandler}
        />
      </ModalInternal>
    </>
  );
};

export default ZpConfirmQuantitiesInternalTransportModal;
