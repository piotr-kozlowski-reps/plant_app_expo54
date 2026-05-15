import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { INDEX } from "@/features/shared/types/interfaces-navigation";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import LeafNavigationButton from "@/features/shared/ui/button/LeafNavigationButton";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import { lightNuanceColor } from "@/features/shared/constants/colorThemeVars";
import { PottedPlantsSubmodules } from "@/features/shared/types/interfaces-auth";
import { FileDigit, Grid3x3, Pickaxe, Sprout } from "lucide-react-native";

const PottedPlantsEntryPage = () => {
  ////vars
  const { getModuleVisibilitiesObject } = useAuthSessionStore();

  ////tsx
  return (
    <>
      <View className="relative w-full h-full bg-yellow">
        <SafeAreaView className="items-center justify-center flex-1 gap-2">
          <View className="flex-col items-center justify-between flex-1 w-full mt-8">
            <View className="w-full px-6">
              <AppPath
                paths={[
                  INDEX,
                  { name: "Rośliny doniczkowe", actionFn: () => {} },
                ]}
              />
            </View>

            <View className="flex-col items-center gap-2 px-6 mt-16">
              <View className="flex-row items-center justify-center w-full gap-2">
                <LeafNavigationButton
                  side={"left"}
                  actionFn={
                    getModuleVisibilitiesObject<PottedPlantsSubmodules>(
                      "potted_plants",
                    ).potted_plants_works___overallVisibility
                      ? () => {
                          router.push("/app/potted_plants/potted_plants_works");
                        }
                      : () => {}
                  }
                  icon={
                    <Sprout
                      size={24}
                      color={lightNuanceColor}
                      strokeWidth={2.7}
                    />
                  }
                  name={`Rośliny${"\n"}doniczkowe - prace`}
                  disabled={
                    !getModuleVisibilitiesObject<PottedPlantsSubmodules>(
                      "potted_plants",
                    ).potted_plants_works___overallVisibility
                  }
                />
                <LeafNavigationButton
                  side={"right"}
                  actionFn={
                    getModuleVisibilitiesObject<PottedPlantsSubmodules>(
                      "potted_plants",
                    ).potted_plants_quantity___overallVisibility
                      ? () => {
                          router.push(
                            "/app/potted_plants/potted_plants_quantity",
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
                  name={`Prace${"\n"}Extra RB - Ilości`}
                  disabled={
                    !getModuleVisibilitiesObject<PottedPlantsSubmodules>(
                      "potted_plants",
                    ).potted_plants_quantity___overallVisibility
                  }
                />
              </View>
              <View className="flex-row items-center justify-center w-full gap-2">
                <LeafNavigationButton
                  side={"left"}
                  actionFn={
                    getModuleVisibilitiesObject<PottedPlantsSubmodules>(
                      "potted_plants",
                    ).potted_plants_zp___overallVisibility
                      ? () => {
                          router.push("/app/potted_plants/potted_plants_zp");
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
                    !getModuleVisibilitiesObject<PottedPlantsSubmodules>(
                      "potted_plants",
                    ).potted_plants_zp___overallVisibility
                  }
                  visibility={false}
                />
                <LeafNavigationButton
                  side={"right"}
                  actionFn={
                    getModuleVisibilitiesObject<PottedPlantsSubmodules>(
                      "potted_plants",
                    ).potted_plants_zp___overallVisibility
                      ? () => {
                          router.push("/app/potted_plants/potted_plants_zp");
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
                  name={`Prace${"\n"}Extra RB - ZP`}
                  disabled={
                    !getModuleVisibilitiesObject<PottedPlantsSubmodules>(
                      "potted_plants",
                    ).potted_plants_zp___overallVisibility
                  }
                />
              </View>
            </View>

            <View className="w-full mb-6">
              <ButtonBack isOutline={false} />
            </View>
          </View>
        </SafeAreaView>

        <View className="absolute top-16 left-6"></View>
      </View>
    </>
  );
};

export default PottedPlantsEntryPage;
