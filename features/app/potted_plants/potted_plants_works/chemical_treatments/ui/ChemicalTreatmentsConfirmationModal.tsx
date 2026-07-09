import {
  INDEX,
  POTTED_PLANTS,
  POTTED_PLANTS_WORKS,
  POTTED_PLANTS_WORKS_CHEMICAL_TREATMENTS,
} from "@/features/shared/types/interfaces-navigation";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import { View } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { useConfirmChemicalTreatmentFormik } from "../domain/useConfirmChemicalTreatmentFormik";
import ComboboxFormik from "@/features/shared/ui/combobox/ComboboxFormik";
import {
  ProtectiveTreatment,
  ProtectiveTreatmentInput,
  WhoDidProtectiveTreatment,
} from "@/features/shared/types/interfaces-protective_treatment";
import { Combobox } from "@/features/shared/types/interfaces-general";
import InputFormik from "@/features/shared/ui/input/InputFormik";
import { comboboxItems_WhoDidProtectiveTreatment } from "@/features/app/field_crops/field_crops_works/protective_treatment/ui/ProtectiveTreatmentForm";
import { ExtraWork } from "@/features/shared/types/interfaces-extra_works";
import { useScanValuesForProtectiveTreatment } from "@/features/app/field_crops/field_crops_works/protective_treatment/domain/useScanValuesForProtectiveTreatment";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import { useShowModal } from "@/features/shared/utils/useShowModal";
import { yellowColor } from "@/features/shared/constants/colorThemeVars";
import ProtectiveTreatmentScannerModal from "@/features/app/field_crops/field_crops_works/protective_treatment/ui/ProtectiveTreatmentScannerModal";
import AnotherLocalizationsToBeTreatedModal from "@/features/app/field_crops/field_crops_works/protective_treatment/ui/AnotherLocalizationsToBeTreatedModal";

type Props = {
  closeFn: () => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  chemicalTreatmentsDon: ProtectiveTreatment[];
  isLoading: boolean;
  // protectiveTreatment: ProtectiveTreatment | null;
  extraWorks: ExtraWork[];
  // nitrogenIrrigationList: ZpToNitrogenIrrigation[];
  // setIsShowModalWithSelectConcentration: React.Dispatch<
  //   React.SetStateAction<boolean>
  // >;
  // resetValuesForProtectiveTreatments: () => void;
  refreshAllData: () => void;
};

/**
 * @public
 * @topic
 * @order 400
 * Potwierdzenie zabiegu chemicznego:
 */
const ChemicalTreatmentsConfirmationModal = (props: Props) => {
  ////vars
  const {
    closeFn,
    refreshAllData,
    chemicalTreatmentsDon,
    extraWorks,
    setIsLoading,
    isLoading,
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
  } = useScanValuesForProtectiveTreatment(setIsLoading, true);

  //formik
  /**
   * @public
   * @procedureItem
   *  Formularz z wprowadzeniem: zabiegu chemicznego, ilości środka, kto wykonał, typu zabiegu)
   */
  const { formik, availableFormActions, canFormBeSubmitted, clearForm } =
    useConfirmChemicalTreatmentFormik(
      setDataForProtectiveTreatment,
      setIsShowScanner,
    );

  //combobox protectiveTreatments
  const comboboxItems: Combobox<ProtectiveTreatment>[] =
    chemicalTreatmentsDon.map((item) => ({
      value: item,
      visibleText: item.dscrpt,
    }));

  // combobox treatmentType
  const comboboxTreatmentType: Combobox<ExtraWork>[] = extraWorks.map(
    (item) => ({ visibleText: item.activityname, value: item }),
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
          <SafeAreaView className="flex-1 w-full bg-yellow">
            <View className="w-full px-6 mt-4">
              <AppPath
                paths={[
                  INDEX,
                  POTTED_PLANTS,
                  POTTED_PLANTS_WORKS,
                  POTTED_PLANTS_WORKS_CHEMICAL_TREATMENTS,
                  {
                    actionFn: () => {},
                    name: "Potwierdzenie zabiegu chemicznego",
                  },
                ]}
              />
            </View>

            <View className="flex-1 px-6">
              <View className="flex-col items-center justify-center flex-1 ">
                <View className="w-full">
                  <ComboboxFormik<ProtectiveTreatmentInput, ProtectiveTreatment>
                    label="Zabieg chemiczny:"
                    placeholder="wybierz środek chemiczny"
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
                    comboboxItems={comboboxItems_WhoDidProtectiveTreatment}
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
                <ButtonBack isOutline={false} actionFn={() => closeFn()} />
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

export default ChemicalTreatmentsConfirmationModal;
