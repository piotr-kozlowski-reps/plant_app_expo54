import { Overlay } from "@/features/app/field_crops/extra_works_zp/ui/Overlay";
import { CutInput, ZpToCut } from "@/features/shared/types/interfaces-cut";
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
import { useScanValuesForOrderToCut } from "../domain/useScanValuesForOrderToCut";
import { useOrderToCutFormik } from "../domain/useOrderToCutFormik";
import ComboboxFormik from "@/features/shared/ui/combobox/ComboboxFormik";
import { useGetComboboxItems } from "../domain/useGetComboboxItems";

type Props = {
  closeFn: () => void;
  cutsList: ZpToCut[];
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  refreshAllData: () => void;
};

export const OrderToCutModal = (props: Props) => {
  ////vars
  const { closeFn, cutsList, setIsLoading, refreshAllData } = props;
  const { comboboxCutHeights, comboboxCutDates } = useGetComboboxItems();

  //scan values
  const { qrLock, scannedValue, setQrLock, scanValueHandler } =
    useScanValuesForOrderToCut(setIsLoading, cutsList);

  //formik
  const { formik, availableFormActions, canFormBeSubmitted } =
    useOrderToCutFormik(closeFn, setIsLoading, scannedValue, refreshAllData);

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
                { actionFn: () => {}, name: "Zlecenie" },
              ]}
            />
          </View>
          <View className="flex-col items-center justify-between w-[94vw] pl-6 mt-6 ">
            <View className="h-[37vh] w-full relative">
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
            <View className="mt-2">
              <View className="flex-row items-center justify-center">
                <View>
                  <Text className="text-foreground font-default-normal">
                    ZP:{" "}
                  </Text>
                </View>
                <View>
                  {scannedValue ? (
                    <Text className="font-default-semibold text-foreground">
                      {scannedValue.ordnmb}
                    </Text>
                  ) : null}
                  {!scannedValue ? (
                    <Text className="font-default-bold text-destructive">
                      -
                    </Text>
                  ) : null}
                </View>
              </View>

              {/* <View className="flex-row items-center justify-center">
                <View>
                  <Text className="text-foreground font-default-normal">
                    Nazwa:{" "}
                  </Text>
                </View>
                <View>
                  {scannedValue ? (
                    <Text className="font-default-semibold text-foreground">
                      {scannedValue.twrnzw}
                    </Text>
                  ) : null}
                  {!scannedValue ? (
                    <Text className="font-default-bold text-destructive">
                      -
                    </Text>
                  ) : null}
                </View>
              </View> */}

              {/* <View className="flex-row items-center justify-center">
                <View>
                  <Text className="text-foreground font-default-normal">
                    Wysokość:{" "}
                  </Text>
                </View>
                <View>
                  {scannedValue ? (
                    <Text className="font-default-semibold text-foreground">
                      {`${formik.getFieldProps("height").value} mm`}
                    </Text>
                  ) : null}

                  {!scannedValue ? (
                    <Text className="font-default-bold text-destructive">
                      -
                    </Text>
                  ) : null}
                </View>
                <View className="ml-4">
                  <Text className="text-foreground font-default-normal">
                    Data cięcia:{" "}
                  </Text>
                </View>
                <View>
                  {scannedValue ? (
                    <Text className="font-default-semibold text-foreground">
                      {renderDateInPolishWay(
                        formik.getFieldProps("plannedDate").value
                      )}
                    </Text>
                  ) : null}
                  {!scannedValue ? (
                    <Text className="font-default-bold text-destructive">
                      -
                    </Text>
                  ) : null}
                </View>
              </View> */}
            </View>

            <View className="flex-row items-center justify-center w-full mt-2">
              <View className="w-24 h-[1px] bg-foreground"></View>
            </View>

            <View className="flex-1 px-6">
              <View className="w-full">
                <ComboboxFormik<CutInput, number>
                  label="Wysokość:"
                  placeholder="wybierz zabieg"
                  formik={formik}
                  formikField="height"
                  isVerifiedAtOnce={true}
                  comboboxItems={comboboxCutHeights}
                  refreshAllData={() => {}}
                  disabled={!scannedValue}
                />
              </View>

              <View className="w-full mt-[16px]">
                <ComboboxFormik<CutInput, Date>
                  label="Data cięcia:"
                  placeholder="wybierz datę"
                  formik={formik}
                  formikField="plannedDate"
                  isVerifiedAtOnce={true}
                  comboboxItems={comboboxCutDates}
                  refreshAllData={() => {}}
                  disabled={!scannedValue}
                />
              </View>
            </View>
            {/*  
                 
                <View className="flex-row items-center justify-center">
                  <View>
                    <Text className="text-foreground font-default-normal">
                      TMS:{" "}
                    </Text>
                  </View>
                  <View>
                    {scannedValue ? (
                      <Text className="font-default-semibold text-foreground">
                        {renderDateInPolishWay(scannedValue.tmsdat)}
                      </Text>
                    ) : null}
                    {!scannedValue ? (
                      <Text className="font-default-bold text-destructive">
                        -
                      </Text>
                    ) : null}
                  </View>
                </View> */}

            {/* <View className="mt-8">
              {!scannedValue ? (
                <Text className="text-center font-nav text-destructive">
                  zeskanuj kod ZPka lub tacy
                </Text>
              ) : null}
              {scannedValue ? (
                <>
                  <Text className="text-center font-default-normal text-foreground">
                    potwierdzasz wykonanie dla:{" "}
                  </Text>
                  <Text className="text-center font-nav text-foreground">
                    {scannedValue.ordnmb}
                  </Text>
                </>
              ) : null}
            </View> */}

            <View className="flex-row items-center justify-between w-full pl-6 mt-4 mb-6">
              <View className="flex-1">
                <ButtonTextAndThreeArrows
                  actionFn={availableFormActions}
                  text="wyślij zlecenie"
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

export default OrderToCutModal;
