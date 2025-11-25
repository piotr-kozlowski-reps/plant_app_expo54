import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import {
  INDEX,
  SubNavigationElement,
} from "@/features/shared/types/interfaces-navigation";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import LoaderWholeScreen from "@/features/shared/ui/loader/LoaderWholeScreen";
import SubNavigation from "@/features/shared/ui/sub-navigaton/ui/SubNavigation";
import { useCheckModuleVisibilityAndRedirectIfNeeded } from "@/features/shared/utils/useCheckModuleVisibilityAndRedirectIfNeeded";
import { useGetSubNavigationGeneralWorksElements } from "@/features/shared/utils/useGetSubNavigationGeneralWorksElements";

import { Stack } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GeneralWorksEntryPage = () => {
  ////vars
  const [isLoading, setIsLoading] = useState(false);

  ////sub navigation items with checked permissions
  const generalWorksSubNavigationState: SubNavigationElement[] =
    useGetSubNavigationGeneralWorksElements();

  ////can module be visible by this user
  const { getModuleVisibility } = useAuthSessionStore();
  useCheckModuleVisibilityAndRedirectIfNeeded(
    getModuleVisibility("general_works")
  );

  ////tsx
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="relative w-full h-full">
        {isLoading ? <LoaderWholeScreen /> : null}

        <SafeAreaView className="items-center justify-center flex-1 w-full gap-2">
          <SubNavigation
            paths={[INDEX, { name: "Prace ogólne", actionFn: () => {} }]}
            subNavigationItems={generalWorksSubNavigationState}
          />

          <View className="w-full mb-6">
            <ButtonBack />
          </View>
        </SafeAreaView>
      </View>
    </>
  );
};

export default GeneralWorksEntryPage;
