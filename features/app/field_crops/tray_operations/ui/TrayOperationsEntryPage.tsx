import { yellowColor } from "@/features/shared/constants/colorThemeVars";
import edocReport_modulesPins from "@/features/shared/data-access/edocReport_modulesPins";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import {
  FIELD_CROPS,
  INDEX,
  SubNavigationElement,
} from "@/features/shared/types/interfaces-navigation";
import { ModulePin } from "@/features/shared/types/interfaces-tray_operations";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import ModalInternal from "@/features/shared/ui/modal/ModalInternal";
import PinConfirmationModal from "@/features/shared/ui/pin-confirmation-modal/PinConfirmationModal";
import SubNavigation from "@/features/shared/ui/sub-navigaton/ui/SubNavigation";
import { useGetEdocReports } from "@/features/shared/utils/getEdocReports/useGetEdocReports";
import { useCheckModuleVisibilityAndRedirectIfNeeded } from "@/features/shared/utils/useCheckModuleVisibilityAndRedirectIfNeeded";
import { useGetSubNavigationTrayOperationsElements } from "@/features/shared/utils/useGetSubNavigationTrayOperationsElements";

import { Stack } from "expo-router";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TrayOperationsEntryPage = () => {
  ////vars
  const [isLoading, setIsLoading] = useState(false);
  const [isPinConfirmed, setIsPinConfirmed] = useState(false);

  ////sub navigation items with checked permissions
  const trayOperationsSubNavigationState: SubNavigationElement[] =
    useGetSubNavigationTrayOperationsElements();

  ////can module be visible by this user
  const { getModuleVisibility } = useAuthSessionStore();
  useCheckModuleVisibilityAndRedirectIfNeeded(
    getModuleVisibility("field_crops")
  );

  //fetch
  const { modulesPins, refreshAllData } = useGetEdocReports({
    setIsLoading: setIsLoading,
    reports: [edocReport_modulesPins],
  });

  const modulesPinsArray = useMemo(() => {
    return modulesPins as ModulePin[];
  }, [modulesPins]);

  ////tsx
  return (
    <View className="relative w-full h-full">
      {isLoading ? <LoaderWholeScreen /> : null}

      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView className="items-center justify-center flex-1 w-full gap-2">
        <SubNavigation
          paths={[
            INDEX,
            FIELD_CROPS,
            { name: "Operacje na tacach", actionFn: () => {} },
          ]}
          subNavigationItems={trayOperationsSubNavigationState}
        />

        <View className="w-full mb-6">
          <ButtonBack />
        </View>
      </SafeAreaView>

      <ModalInternal
        isOpen={!isPinConfirmed}
        isTransparent={false}
        backgroundColor={yellowColor}
      >
        <PinConfirmationModal
          confirmPinFn={() => setIsPinConfirmed(true)}
          modulesPinsArray={modulesPinsArray}
        />
      </ModalInternal>
    </View>
  );
};

export default TrayOperationsEntryPage;
