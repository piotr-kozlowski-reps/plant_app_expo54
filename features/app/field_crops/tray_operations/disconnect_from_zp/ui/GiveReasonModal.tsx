import Button from "@/features/shared/ui/button/Button";
import { View, Text } from "react-native";
import { useGiveReasonFormik } from "../domain/useGiveReasonFormik";
import ComboboxFormik from "@/features/shared/ui/combobox/ComboboxFormik";
import {
  DeleteReason,
  GiveReasonInput,
  TrayScannedValueForDisconnectFromZp,
} from "@/features/shared/types/interfaces-disconnect_from_zp";
import { Combobox } from "@/features/shared/types/interfaces-general";

type Props = {
  closeFn: () => void;
  refreshAllData: () => void;
  deleteReasons: DeleteReason[];
  chosenTray: TrayScannedValueForDisconnectFromZp | null;
  addOrChangeDeleteReason: (
    tray: TrayScannedValueForDisconnectFromZp,
    reason: DeleteReason
  ) => void;
  // tray: TrayScannedValueForMovingToGarden | TrayScannedValueForAddToZp | null;
  // actionFn: (text: string) => void;
};

const GiveReasonModal = (props: Props) => {
  ////vars
  const {
    closeFn,
    refreshAllData,
    deleteReasons,
    chosenTray,
    addOrChangeDeleteReason,
  } = props;

  //formik
  const { formik, availableFormActions, canFormBeSubmitted } =
    useGiveReasonFormik(chosenTray, addOrChangeDeleteReason, closeFn);

  //helpers
  // const isShowBackButton =
  //   chosenTray?.delete_dscrpt && chosenTray.delete_reason_id;

  //combobox protectiveTreatments
  const comboboxItems: Combobox<DeleteReason>[] = deleteReasons.map((item) => ({
    value: item,
    visibleText: item.delete_dscrpt,
  }));

  ////tsx
  return (
    <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
      <View className="relative flex-col items-center justify-center flex-1">
        <View className="w-full pt-16 pb-[4px] border-t-2 border-b-2 border-gray-600 rounded-app">
          <View className="flex items-center justify-center w-full ">
            <Text className="text-center text-foreground font-euclid_semibold">
              Podaj powód odpięcia do bufora:
            </Text>
          </View>
          <View className="flex items-center justify-center w-full mt-2">
            {/* <ButtonZPLocalizationBadge
                localizationInfo={localization}
                actionFn={() => {}}
                ZPId={ZPId}
              /> */}
          </View>

          <View className="w-full px-6 mt-4">
            <ComboboxFormik<GiveReasonInput, DeleteReason>
              label="Powód:"
              placeholder="wybierz powód"
              formik={formik}
              formikField="reason"
              isVerifiedAtOnce={true}
              comboboxItems={comboboxItems}
              itemPropertyToBeDisplayed={"delete_dscrpt"}
              refreshAllData={refreshAllData}
            />
          </View>

          <View className="flex-col justify-center w-full gap-4 px-6 mt-32 items-between">
            <View className="mb-4">
              <Button
                title="zmień"
                handlePress={() => availableFormActions()}
                disabled={!canFormBeSubmitted}
              />
            </View>
            {/* {isShowBackButton ? (
              <View>
                <Button title="powrót" handlePress={closeFn} isOutline />
              </View>
            ) : null} */}
          </View>
        </View>
      </View>
    </View>
  );
};
export default GiveReasonModal;
