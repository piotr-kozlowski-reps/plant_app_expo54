import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import { useState } from "react";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
// import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
// import { useCheckModuleVisibilityAndRedirectIfNeeded } from "@/features/shared/utils/useCheckModuleVisibilityAndRedirectIfNeeded";
import SubNavigation from "@/features/shared/ui/sub-navigaton/ui/SubNavigation";
import {
  GREENHOUSE_CROPS,
  INDEX,
  SubNavigationElement,
} from "@/features/shared/types/interfaces-navigation";

// import { useGetSubNavigationFieldCropsElements } from "@/features/shared/utils/useGetSubNavigationFieldCropsElements";
import { Stack } from "expo-router";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { useCheckModuleVisibilityAndRedirectIfNeeded } from "@/features/shared/utils/useCheckModuleVisibilityAndRedirectIfNeeded";
import { useGetSubNavigationGreenhouseCropsElements } from "@/features/shared/utils/useGetSubNavigationGreenhouseCropsElements";

const GreenhouseCropsWorksEntryPage = () => {
  ////sub navigation items with checked permissions
  const greenhouseCropsSubNavigationState: SubNavigationElement[] =
    useGetSubNavigationGreenhouseCropsElements();

  ////can module be visible by this user
  const { getModuleVisibility } = useAuthSessionStore();
  useCheckModuleVisibilityAndRedirectIfNeeded(
    getModuleVisibility("greenhouse_crops")
  );

  ////tsx
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="relative w-full h-full">
        <SafeAreaView className="items-center justify-center flex-1 w-full gap-2">
          <SubNavigation
            paths={[
              INDEX,
              GREENHOUSE_CROPS,
              { name: "Uprawy szklarniowe - prace", actionFn: () => {} },
            ]}
            subNavigationItems={greenhouseCropsSubNavigationState}
          />

          <View className="w-full mb-6">
            <ButtonBack />
          </View>
        </SafeAreaView>
      </View>
    </>
  );
};

export default GreenhouseCropsWorksEntryPage;
