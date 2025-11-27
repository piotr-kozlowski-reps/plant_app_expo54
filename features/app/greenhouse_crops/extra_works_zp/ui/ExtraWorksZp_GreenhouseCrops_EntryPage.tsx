import { View, Text } from "react-native";
import { Stack } from "expo-router";
import { useState } from "react";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import ItemsList from "@/features/shared/ui/list/ItemsList";
import {
  GREENHOUSE_CROPS,
  INDEX,
  NavElement,
} from "@/features/shared/types/interfaces-navigation";

const ExtraWorksZp_GreenhouseCrops_EntryPage = () => {
  ////vars
  const [isLoading, setIsLoading] = useState(false);

  //paths
  const paths: NavElement[] = [
    INDEX,
    GREENHOUSE_CROPS,
    { name: "Prace Extra ROZ - ZP", actionFn: () => {} },
  ];

  ////tsx
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="relative w-full h-full">
        {isLoading ? <LoaderWholeScreen /> : null}

        <SafeAreaView className="items-center justify-center flex-1 w-full gap-2">
          <ItemsList
            paths={paths}
            refreshAllData={() => {}}
            extraWorks={[]}
            actionPerIdFn={(id: number) => {}}
            // refreshAllData={refreshAllData}
            // extraWorks={filteredExtraWorks}
            // actionPerIdFn={openScannerHandler}
          />

          <View className="w-full mb-6">
            <ButtonBack />
          </View>
        </SafeAreaView>

        {/* <ModalInternal
          isOpen={isShowScanner}
          isTransparent={false}
          backgroundColor={primaryColor}
        >
          <ScanCameraModal
            closeFn={() => setIsShowScanner(false)}
            extraWork={extraWork}
            nitrogenProtectiveTreatments={
              filteredOnlyNitrogenProtectiveTreatments
            }
            refreshAllData={refreshAllDataFn}
          />
        </ModalInternal> */}
      </View>
    </>
  );
};

export default ExtraWorksZp_GreenhouseCrops_EntryPage;
