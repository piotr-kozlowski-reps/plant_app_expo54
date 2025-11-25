import AppPath from "@/features/shared/ui/app-path/AppPath";
import {
  FIELD_CROPS,
  FIELD_CROPS_WORKS,
  INDEX,
} from "@/features/shared/types/interfaces-navigation";
import ComboboxFormik from "@/features/shared/ui/combobox/ComboboxFormik";
import {
  ProtectiveTreatment,
  ProtectiveTreatmentInput,
  WhoDidProtectiveTreatment,
} from "@/features/shared/types/interfaces-protective_treatment";
import { View } from "react-native";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProtectiveTreatmentFormik } from "../domain/useProtectiveTreatmentFormik";
import { Combobox } from "@/features/shared/types/interfaces-general";
import InputFormik from "@/features/shared/ui/input/InputFormik";
import { ExtraWork } from "@/features/shared/types/interfaces-extra_works";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import { useScanValuesForProtectiveTreatment } from "../domain/useScanValuesForProtectiveTreatment";
import { useShowModal } from "@/features/shared/utils/useShowModal";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import {
  primaryColor,
  yellowColor,
} from "@/features/shared/constants/colorThemeVars";
import ProtectiveTreatmentScannerModal from "./ProtectiveTreatmentScannerModal";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";
import AnotherLocalizationsToBeTreatedModal from "./AnotherLocalizationsToBeTreatedModal";

type Props = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  protectiveTreatments: ProtectiveTreatment[];
  extraWorks: ExtraWork[];
  typeOfTreatment: ExtraWork[];
  refreshAllData: () => void;
};

const ProtectiveTreatmentForm = (props: Props) => {
  ////vars
  const {
    isLoading,
    setIsLoading,
    protectiveTreatments,
    extraWorks,
    typeOfTreatment,
    refreshAllData,
  } = props;

  //scanner modal
  const [isShowScanner, setIsShowScanner] = useShowModal(false);

  //scanner
  const {
    scannedValues,
    quantity,
    treatment,
    extraWork,
    who,
    isForceToScanField,
    isFieldScanned,
    qrLock,
    isZPScanned,
    scannedZPOnManyFields,
    restOfLocalizations,
    isInformUserThatThereAreAnotherLocalizationsOfTreatedZP,

    setIsInformUserThatThereAreAnotherLocalizationsOfTreatedZP,
    setQrLock,
    setDataForProtectiveTreatment,
    scanValueHandler,
    deleteScannedValue,
    clearScannedValues,
    clearZpOnManyFields,
    resetInfoAboutRestOfLocalizations,
  } = useScanValuesForProtectiveTreatment(setIsLoading);

  //formik
  const { formik, availableFormActions, canFormBeSubmitted, clearForm } =
    useProtectiveTreatmentFormik(
      setDataForProtectiveTreatment,
      setIsShowScanner
    );

  //combobox protectiveTreatments
  const comboboxItems: Combobox<ProtectiveTreatment>[] =
    protectiveTreatments.map((item) => ({
      value: item,
      visibleText: item.dscrpt,
    }));

  // combobox treatmentType
  const comboboxTreatmentType: Combobox<ExtraWork>[] = typeOfTreatment.map(
    (item) => ({ visibleText: item.activityname, value: item })
  );

  ////tsx
  return (
    <>
      <View className="relative w-full h-full">
        <KeyboardAwareScrollView
          bottomOffset={61}
          className="flex-1"
          contentContainerStyle={{ flex: 1 }}
        >
          {isLoading ? <LoaderWholeScreen /> : null}

          <SafeAreaView className="flex-1 w-full bg-yellow">
            <View className="w-full px-6 mt-4">
              <AppPath
                paths={[
                  INDEX,
                  FIELD_CROPS,
                  FIELD_CROPS_WORKS,
                  { actionFn: () => {}, name: "Zabieg ochronny" },
                ]}
              />
            </View>

            <View className="flex-1 px-6">
              <View className="flex-col items-center justify-center flex-1 ">
                <View className="w-full">
                  <ComboboxFormik<ProtectiveTreatmentInput, ProtectiveTreatment>
                    label="Zabieg:"
                    placeholder="wybierz zabieg"
                    formik={formik}
                    formikField="treatment"
                    isVerifiedAtOnce={true}
                    comboboxItems={comboboxItems}
                    itemPropertyToBeDisplayed={"dscrpt"}
                    refreshAllData={refreshAllData}
                  />
                </View>

                <View className="w-full mt-[24px]">
                  <InputFormik<ProtectiveTreatmentInput>
                    label="Ilość środka:"
                    placeholder="podaj ilość"
                    isSignedAsRequired={true}
                    formik={formik}
                    formikField="quantity"
                    keyboardType="numeric"
                    isVerifiedAtOnce={true}
                  />
                </View>

                <View className="w-full mt-[24px]">
                  <ComboboxFormik<
                    ProtectiveTreatmentInput,
                    WhoDidProtectiveTreatment
                  >
                    label="Wykonał:"
                    placeholder="wybierz kto wykonał"
                    formik={formik}
                    formikField="who"
                    isVerifiedAtOnce={true}
                    comboboxItems={[
                      {
                        value: "ROBOT",
                        visibleText: "Robot",
                      },
                      {
                        value: "ZESPOL",
                        visibleText: "Zespół",
                      },
                    ]}
                    refreshAllData={() => {}}
                  />
                </View>

                <View className="w-full mt-[24px]">
                  <ComboboxFormik<ProtectiveTreatmentInput, ExtraWork>
                    label="Typ zabiegu:"
                    placeholder="wybierz typ zabiegu"
                    formik={formik}
                    formikField="treatment_type"
                    isVerifiedAtOnce={true}
                    comboboxItems={comboboxTreatmentType}
                    itemPropertyToBeDisplayed={"activityname"}
                    refreshAllData={() => {}}
                  />
                </View>
              </View>
            </View>

            <View className="flex-row items-center justify-between w-full pl-6 mt-4 mb-6">
              <View className="flex-1">
                <ButtonTextAndThreeArrows
                  actionFn={availableFormActions}
                  text="przejdź dalej"
                  isBackground
                  disabled={!canFormBeSubmitted}
                />
              </View>
              <View className="ml-6">
                <ButtonBack isOutline={false} />
              </View>
            </View>
          </SafeAreaView>

          <ModalInternal
            isOpen={isShowScanner}
            isTransparent={false}
            backgroundColor={yellowColor}
          >
            <ProtectiveTreatmentScannerModal
              scannedValues={scannedValues}
              closeFn={() => setIsShowScanner(false)}
              isLoading={isLoading}
              quantity={quantity}
              treatment={treatment}
              extraWork={extraWork}
              who={who}
              qrLock={qrLock}
              setQrLock={setQrLock}
              isForceToScanField={isForceToScanField}
              isFieldScanned={isFieldScanned}
              isZPScanned={isZPScanned}
              scanValueHandler={scanValueHandler}
              deleteScannedValue={deleteScannedValue}
              setIsLoading={setIsLoading}
              clearScannedValues={clearScannedValues}
              scannedZPOnManyFields={scannedZPOnManyFields}
              clearZpOnManyFields={clearZpOnManyFields}
              restOfLocalizations={restOfLocalizations}
              isInformUserThatThereAreAnotherLocalizationsOfTreatedZP={
                isInformUserThatThereAreAnotherLocalizationsOfTreatedZP
              }
              resetInfoAboutRestOfLocalizations={
                resetInfoAboutRestOfLocalizations
              }
              setIsInformUserThatThereAreAnotherLocalizationsOfTreatedZP={
                setIsInformUserThatThereAreAnotherLocalizationsOfTreatedZP
              }
              clearForm={clearForm}
            />
          </ModalInternal>

          {/* inform user that there are another localizations of ZP to be treated  -  modal */}
          <ModalInternal
            isOpen={isInformUserThatThereAreAnotherLocalizationsOfTreatedZP}
            isTransparent={false}
            backgroundColor={yellowColor}
          >
            <AnotherLocalizationsToBeTreatedModal
              closeFn={resetInfoAboutRestOfLocalizations}
              restOfLocalizations={restOfLocalizations}
            />
          </ModalInternal>
        </KeyboardAwareScrollView>
        <KeyboardToolbar doneText={"gotowe"} />
      </View>
    </>
  );
};

export default ProtectiveTreatmentForm;
