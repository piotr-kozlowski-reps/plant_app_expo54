import { router } from "expo-router";
import {
  INDEX,
  POTTED_PLANTS,
} from "@/features/shared/types/interfaces-navigation";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ColorForCotyledonQuiltingInput,
  CotyledonQuilting,
} from "@/features/shared/types/interfaces-cotyledon_quilting";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import { yellowColor } from "@/features/shared/constants/colorThemeVars";
import { useShowModal } from "@/features/shared/utils/useShowModal";
import { CotyledonQuilting_AddingTrays_Modal } from "./CotyledonQuilting_AddingTrays_Modal";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import { useChooseColorForCotyledonQuiltingFormik } from "../domain/useChooseColorForCotyledonQuiltingFormik";
import ComboboxFormik from "@/features/shared/ui/combobox/ComboboxFormik";
import { Combobox } from "@/features/shared/types/interfaces-general";
import { useEffect, useState } from "react";
import Button from "@/features/shared/ui/button/Button";
import SeparatorHorizontal from "@/features/shared/ui/separator/SeparatorHorizontal";
import { useHandleChosenColor } from "../domain/useHandleChosenColor";
import CotyledonQuilting_QuantityAndSend_Modal from "./CotyledonQuilting_QuantityAndSend_Modal";

type Props = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  zpToCotyledonQuiltingArray: CotyledonQuilting[];
  refreshAllData: () => void;
};

const CotyledonQuiltingMainWindow = (props: Props) => {
  ////vars
  const { setIsLoading, zpToCotyledonQuiltingArray, refreshAllData } = props;
  const [isShowAddingTraysModal, setIsShowAddingTraysModal] = useShowModal();
  const [isShowQuantityAndSendModal, setIsShowQuantityAndSendModal] =
    useState(false);

  //active ordnmb
  let ordnmb = "";
  if (zpToCotyledonQuiltingArray.length > 0) {
    ordnmb = zpToCotyledonQuiltingArray[0].ordnmb;
  }
  //formik
  /**
   * @public
   * @procedureItem
   *  Formularz z wyborem dostępnego koloru
   */
  const { chosenColor, formik } = useHandleChosenColor();

  //combobox protectiveTreatments
  const comboboxItems: Combobox<CotyledonQuilting>[] =
    zpToCotyledonQuiltingArray.map((item) => ({
      value: item,
      visibleText: item.twr_nazwa,
    }));

  const handleAddTraysToChosenColor = () => {
    setIsShowAddingTraysModal(true);
  };
  const handleEnterQuantityAndCloseChosenColor = () => {
    setIsShowQuantityAndSendModal(true);
  };

  ////tsx
  return (
    <View className="relative w-full h-full">
      <SafeAreaView className="flex-1 w-full">
        <View className="w-full px-6 mt-4">
          <AppPath
            paths={[
              INDEX,
              POTTED_PLANTS,
              { actionFn: () => {}, name: "Pikowanie liścieni" },
            ]}
          />
        </View>

        <View className="flex-col items-center justify-between flex-1 w-full mt-6">
          <View className="flex-col items-start justify-start flex-1 w-full px-6">
            <View className="flex-col items-center justify-center w-full mt-8">
              <View>
                <Text className="font-default-normal">
                  Aktualnie pikowany ZP:
                </Text>
              </View>
              <View>
                <Text className="font-title">{ordnmb ? ordnmb : "-"}</Text>
              </View>
            </View>
            <View className="w-full mt-16">
              <ComboboxFormik<ColorForCotyledonQuiltingInput, CotyledonQuilting>
                label="Kolor:"
                placeholder="wybierz dostępny kolor"
                formik={formik}
                formikField="colorTray"
                isVerifiedAtOnce={true}
                comboboxItems={comboboxItems}
                itemPropertyToBeDisplayed={"twr_nazwa"}
                refreshAllData={refreshAllData}
              />
            </View>
            <View className="mt-16">
              <SeparatorHorizontal />
            </View>

            <View className="w-full mt-6">
              <Button
                title="Dodaj tace do koloru"
                handlePress={handleAddTraysToChosenColor}
                disabled={!chosenColor}
              />
            </View>

            <View className="w-full my-2">
              <Text className="text-center font-default-normal">lub</Text>
            </View>

            <View className="w-full">
              <Button
                title="Podaj ilość i zamknij kolor"
                handlePress={handleEnterQuantityAndCloseChosenColor}
                disabled={!chosenColor}
              />
            </View>
          </View>

          <View className="flex-row items-center justify-between w-full pl-6 mt-4 mb-6">
            <View className="flex-1">
              {/* <ButtonTextAndThreeArrows
                actionFn={availableFormActions}
                text="Przejdź do skanowania tac"
                isBackground
                disabled={!canFormBeSubmitted}
              /> */}
            </View>
            <View className="ml-6">
              <ButtonBack actionFn={() => router.back()} isOutline={false} />
            </View>
          </View>
        </View>
      </SafeAreaView>

      <ModalInternal
        isOpen={isShowAddingTraysModal}
        isTransparent={false}
        backgroundColor={yellowColor}
      >
        <CotyledonQuilting_AddingTrays_Modal
          closeFn={() => setIsShowAddingTraysModal(false)}
          ordnmb={ordnmb}
          chosenColor={chosenColor}
          setIsLoading={setIsLoading}
          cotyledonQuiltingArray={zpToCotyledonQuiltingArray}
        />
      </ModalInternal>

      {/* quantity and send -  modal */}
      <ModalInternal
        isOpen={isShowQuantityAndSendModal}
        isTransparent={false}
        backgroundColor={yellowColor}
      >
        <CotyledonQuilting_QuantityAndSend_Modal
          closeFn={() => setIsShowQuantityAndSendModal(false)}
          ordnmb={ordnmb}
          chosenColor={chosenColor}
          setIsLoading={setIsLoading}
        />
      </ModalInternal>
    </View>
  );
};

export default CotyledonQuiltingMainWindow;
