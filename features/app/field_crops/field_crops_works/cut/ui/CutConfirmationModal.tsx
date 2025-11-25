import { Overlay } from "@/features/app/field_crops/extra_works_zp/ui/Overlay";
import {
  CutConfirmationInput,
  ZpToCut,
} from "@/features/shared/types/interfaces-cut";
import {
  CUT_GRU,
  FIELD_CROPS,
  FIELD_CROPS_WORKS,
  INDEX,
} from "@/features/shared/types/interfaces-navigation";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import Button from "@/features/shared/ui/button/Button";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import ButtonTextAndThreeArrows from "@/features/shared/ui/button/ButtonTextAndThreeArrows";
import Scanning from "@/features/shared/ui/scanning/Scanning";
import { CameraView } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import { View, Text, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useScanValuesForCutGRU } from "../domain/useScanValuesForCutGRU";
import { useCutConfirmationFormik } from "../domain/useCutConfirmationFormik";
import ComboboxFormik from "@/features/shared/ui/combobox/ComboboxFormik";
import { useGetComboboxItems } from "../domain/useGetComboboxItems";

type Props = {
  closeFn: () => void;
  cutsList: ZpToCut[];
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CutConfirmationModal = (props: Props) => {
  ////vars
  const { closeFn, cutsList, setIsLoading } = props;
  const { comboboxCutHeights } = useGetComboboxItems();

  //scan values
  const { qrLock, scannedValue, setQrLock, scanValueHandler, refreshAllData } =
    useScanValuesForCutGRU(setIsLoading, cutsList);

  //formik
  const { formik, canFormBeSubmitted, availableFormActions } =
    useCutConfirmationFormik(
      scannedValue,
      setIsLoading,
      cutsList,
      closeFn,
      refreshAllData
    );

  ////tsx
  return (
    <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
      <View className="relative w-full h-full">
        <SafeAreaView className="flex-1 w-full">
          <View className="w-full px-6 mt-4">
            <AppPath
              paths={[
                INDEX,
                FIELD_CROPS,
                FIELD_CROPS_WORKS,
                CUT_GRU,
                { actionFn: () => {}, name: "Wykonanie" },
              ]}
            />
          </View>
          <View className="flex-col items-center justify-between w-[94vw] pl-6 mt-6 ">
            <View className="h-[50vh] w-full relative">
              {Platform.OS === "android" ? <StatusBar hidden /> : null}
              <CameraView
                facing="back"
                style={StyleSheet.absoluteFillObject}
                onBarcodeScanned={
                  !scannedValue
                    ? ({ data }) => {
                        if (data && !qrLock) {
                          scanValueHandler(data);
                          setQrLock(true);
                        }
                      }
                    : undefined
                }
              />

              <>
                <Overlay />

                <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
                  {qrLock ? (
                    <View className="flex-col items-center justify-center w-full h-full">
                      <View className="w-full px-16">
                        <View className="opacity-70">
                          <Button
                            title={"skanuj ZP lub tacę"}
                            handlePress={() => {
                              setQrLock(false);
                            }}
                            containerStyles={`h-32`}
                            isGrayed={!qrLock}
                            height={128}
                          />
                        </View>
                      </View>
                    </View>
                  ) : null}
                  {!qrLock ? (
                    <View className="flex-col items-center justify-end w-full h-full pb-6">
                      <Scanning />
                    </View>
                  ) : null}
                </View>
              </>
            </View>
          </View>

          <View className="flex-col items-center justify-between flex-1 w-full">
            {!scannedValue ? (
              <View className="mt-8">
                <Text className="text-center font-nav text-destructive">
                  zeskanuj kod ZPka lub tacy
                </Text>
              </View>
            ) : null}
            {scannedValue ? (
              <>
                <View className="flex-row items-center w-full px-6 mt-4 ">
                  <Text className=" font-default-normal text-foreground">
                    potwierdzasz wykonanie dla:{" "}
                  </Text>
                  <View className="ml-2">
                    <Text className=" font-nav text-foreground">
                      {scannedValue.ordnmb}
                    </Text>
                  </View>
                </View>
                <View className="w-full px-6 pt-2">
                  <ComboboxFormik<CutConfirmationInput, number>
                    label="Wysokość:"
                    placeholder="wybierz wysokość cięcia"
                    formik={formik}
                    formikField="height"
                    isVerifiedAtOnce={true}
                    comboboxItems={comboboxCutHeights}
                    refreshAllData={() => {}}
                    disabled={!scannedValue}
                  />
                </View>
              </>
            ) : null}

            <View className="flex-row items-center justify-between w-full pl-6 mt-4 mb-6">
              <View className="flex-1">
                <ButtonTextAndThreeArrows
                  actionFn={() => availableFormActions()}
                  text="wyślij potwierdzenie"
                  isBackground
                  disabled={!scannedValue || !canFormBeSubmitted}
                />
              </View>
              <View className="ml-6">
                <ButtonBack actionFn={closeFn} isOutline={false} />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
};

export default CutConfirmationModal;
