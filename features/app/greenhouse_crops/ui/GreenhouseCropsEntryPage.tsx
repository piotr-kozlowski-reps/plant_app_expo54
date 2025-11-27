import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { INDEX } from "@/features/shared/types/interfaces-navigation";
import { Stack, router } from "expo-router";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import LeafNavigationButton from "@/features/shared/ui/button/LeafNavigationButton";
import { GreenhouseCropsSubmodule } from "@/features/shared/types/interfaces-auth";
import {
  CheckCheck,
  FileDigit,
  House,
  Pickaxe,
  ShoppingBag,
} from "lucide-react-native";
import { lightNuanceColor } from "@/features/shared/constants/colorThemeVars";

const GreenhouseCropsEntryPage = () => {
  ////vars
  const { getModuleVisibilitiesObject } = useAuthSessionStore();

  ////tsx
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <>
        <View className="relative w-full h-full bg-yellow">
          <SafeAreaView className="items-center justify-center flex-1 gap-2">
            <View className="flex-col items-center justify-between flex-1 w-full mt-8">
              <View className="w-full px-6">
                <AppPath
                  paths={[
                    INDEX,
                    { name: "Uprawy szklarniowe", actionFn: () => {} },
                  ]}
                />
              </View>

              <View className="flex-col items-center gap-2 px-6 mt-16">
                <View className="flex-row items-center justify-center w-full gap-2">
                  <LeafNavigationButton
                    side={"left"}
                    actionFn={
                      getModuleVisibilitiesObject<GreenhouseCropsSubmodule>(
                        "greenhouse_crops"
                      ).greenhouse_crops_works___overallVisibility
                        ? () => {
                            router.push(
                              "/app/greenhouse_crops/greenhouse_crops_works"
                            );
                          }
                        : () => {}
                    }
                    icon={
                      <House
                        size={24}
                        color={lightNuanceColor}
                        strokeWidth={2.7}
                      />
                    }
                    name={`Uprawy${"\n"}szklarniowe${"\n"} - prace`}
                    disabled={
                      !getModuleVisibilitiesObject<GreenhouseCropsSubmodule>(
                        "greenhouse_crops"
                      ).greenhouse_crops_works___overallVisibility
                    }
                  />
                  <LeafNavigationButton
                    side={"right"}
                    actionFn={
                      getModuleVisibilitiesObject<GreenhouseCropsSubmodule>(
                        "greenhouse_crops"
                      ).extra_works_quantity___overallVisibility
                        ? () => {
                            router.push(
                              "/app/greenhouse_crops/extra_works_quantity"
                            );
                          }
                        : () => {}
                    }
                    icon={
                      <FileDigit
                        size={24}
                        color={lightNuanceColor}
                        strokeWidth={2.7}
                      />
                    }
                    name={`Prace${"\n"}Extra ROZ - Ilości`}
                    disabled={
                      !getModuleVisibilitiesObject<GreenhouseCropsSubmodule>(
                        "greenhouse_crops"
                      ).extra_works_quantity___overallVisibility
                    }
                  />
                </View>

                <View className="flex-row items-center justify-center w-full gap-2">
                  <LeafNavigationButton
                    side={"left"}
                    actionFn={
                      getModuleVisibilitiesObject<GreenhouseCropsSubmodule>(
                        "greenhouse_crops"
                      ).extra_works_zp___overallVisibility
                        ? () => {
                            router.push("/app/greenhouse_crops/extra_works_zp");
                          }
                        : () => {}
                    }
                    icon={
                      <Pickaxe
                        size={24}
                        color={lightNuanceColor}
                        strokeWidth={2.7}
                      />
                    }
                    name={`brak`}
                    // disabled={
                    //   !getModuleVisibilitiesObject<GreenhouseCropsSubmodule>(
                    //     "greenhouse_crops"
                    //   ).extra_works_zp___overallVisibility
                    // }
                    visibility={false}
                  />
                  <LeafNavigationButton
                    side={"right"}
                    actionFn={
                      getModuleVisibilitiesObject<GreenhouseCropsSubmodule>(
                        "greenhouse_crops"
                      ).extra_works_zp___overallVisibility
                        ? () => {
                            router.push("/app/greenhouse_crops/extra_works_zp");
                          }
                        : () => {}
                    }
                    icon={
                      <Pickaxe
                        size={24}
                        color={lightNuanceColor}
                        strokeWidth={2.7}
                      />
                    }
                    name={`Prace${"\n"}Extra ROZ - ZP`}
                    disabled={
                      !getModuleVisibilitiesObject<GreenhouseCropsSubmodule>(
                        "greenhouse_crops"
                      ).extra_works_zp___overallVisibility
                    }
                  />
                </View>

                {/* <View className="flex-row items-center justify-center w-full gap-2">
                  <LeafNavigationButton
                    side={"left"}
                    actionFn={
                      getModuleVisibilitiesObject<FieldCropsSubmodules>(
                        "field_crops"
                      ).extra_works_zp___overallVisibility
                        ? () => {
                            router.push(
                              "/app/field_crops/extra_works_zp?ishobby=f"
                            );
                          }
                        : () => {}
                    }
                    icon={
                      <Pickaxe
                        size={24}
                        color={lightNuanceColor}
                        strokeWidth={2.7}
                      />
                    }
                    name={`Prace${"\n"}Extra GRU - ZP`}
                    disabled={
                      !getModuleVisibilitiesObject<FieldCropsSubmodules>(
                        "field_crops"
                      ).extra_works_zp___overallVisibility
                    }
                    visibility={false}
                  />
                  <LeafNavigationButton
                    side={"right"}
                    actionFn={
                      getModuleVisibilitiesObject<FieldCropsSubmodules>(
                        "field_crops"
                      ).tray_operations___overallVisibility
                        ? () => {
                            router.push("/app/field_crops/tray_operations");
                          }
                        : () => {}
                    }
                    icon={
                      <Grid3x3
                        size={24}
                        color={lightNuanceColor}
                        strokeWidth={2.7}
                      />
                    }
                    name={`Operacje${"\n"}na tacach`}
                    disabled={
                      !getModuleVisibilitiesObject<FieldCropsSubmodules>(
                        "field_crops"
                      ).tray_operations___overallVisibility
                    }
                  />
                </View> */}
              </View>

              <View className="w-full mb-6">
                <ButtonBack isOutline={false} />
              </View>
            </View>
          </SafeAreaView>

          <View className="absolute top-16 left-6"></View>
        </View>
      </>

      {/* ------------------ */}
      {/* <View className="relative w-full h-full">
        {isLoading ? <LoaderWholeScreen /> : null}

        <SafeAreaView className="items-center justify-center flex-1 w-full gap-2">
          <SubNavigation
            paths={[
              INDEX,
              FIELD_CROPS,
              { name: "Rozsady gruntowe - prace", actionFn: () => {} },
            ]}
            subNavigationItems={fieldCropsSubNavigation}
          />

          <View className="w-full mb-6">
            <ButtonBack />
          </View>
        </SafeAreaView>
      </View> */}

      {/* <View className="relative w-full h-full">
        <SafeAreaView className="items-center justify-center flex-1 w-full gap-2">
          <SubNavigation
            paths={[INDEX, { name: "Uprawy szklarniowe", actionFn: () => {} }]}
            subNavigationItems={greenhouseCropsSubNavigationState}
          />

          <View className="w-full mb-6">
            <ButtonBack />
          </View>
        </SafeAreaView>
      </View> */}
    </>
  );
};

export default GreenhouseCropsEntryPage;
