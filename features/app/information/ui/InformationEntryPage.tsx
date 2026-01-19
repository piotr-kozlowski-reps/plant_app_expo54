import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import { INDEX } from "@/features/shared/types/interfaces-navigation";
import ButtonBack from "@/features/shared/ui/button/ButtonBack";
import LeafNavigationButton from "@/features/shared/ui/button/LeafNavigationButton";
import { InformationSubmodules } from "@/features/shared/types/interfaces-auth";
import { router } from "expo-router";
import { lightNuanceColor } from "@/features/shared/constants/colorThemeVars";
import {
  BookUser,
  Pickaxe,
  ScanSearch,
  Search,
  ShoppingBag,
} from "lucide-react-native";

const InformationEntryPage = () => {
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
                paths={[INDEX, { actionFn: () => {}, name: "Informacja" }]}
              />
            </View>
            <View className="flex-col items-center gap-2 px-6 mt-16">
              <View className="flex-row items-center justify-center w-full gap-2">
                <LeafNavigationButton
                  side={"left"}
                  actionFn={
                    getModuleVisibilitiesObject<InformationSubmodules>(
                      "information",
                    ).information_scan_zp
                      ? () => {
                          router.push("/app/information/scan_zp");
                        }
                      : () => {}
                  }
                  icon={
                    <ScanSearch
                      size={24}
                      color={lightNuanceColor}
                      strokeWidth={2.7}
                    />
                  }
                  name={`Skanuj ZP`}
                  disabled={
                    !getModuleVisibilitiesObject<InformationSubmodules>(
                      "information",
                    ).information_scan_zp
                  }
                />
                <LeafNavigationButton
                  side={"right"}
                  actionFn={
                    getModuleVisibilitiesObject<InformationSubmodules>(
                      "information",
                    ).information_scan_zp
                      ? () => {
                          router.push("/app/information/search_zp");
                        }
                      : () => {}
                  }
                  icon={
                    <Search
                      size={24}
                      color={lightNuanceColor}
                      strokeWidth={2.7}
                    />
                  }
                  name={`Wyszukaj ZP`}
                  disabled={
                    !getModuleVisibilitiesObject<InformationSubmodules>(
                      "information",
                    ).information_scan_zp
                  }
                />
              </View>
              <View className="flex-row items-center justify-center w-full gap-2">
                <LeafNavigationButton
                  side={"left"}
                  actionFn={
                    getModuleVisibilitiesObject<InformationSubmodules>(
                      "information",
                    ).information_scan_zp
                      ? () => {
                          router.push(
                            "/app/field_crops/extra_works_zp?ishobby=f",
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
                    !getModuleVisibilitiesObject<InformationSubmodules>(
                      "information",
                    ).information_scan_zp
                  }
                  visibility={false}
                />
                <LeafNavigationButton
                  side={"right"}
                  actionFn={
                    getModuleVisibilitiesObject<InformationSubmodules>(
                      "information",
                    ).information_search_by_client
                      ? () => {
                          router.push("/app/information/search_by_client");
                        }
                      : () => {}
                  }
                  icon={
                    <BookUser
                      size={24}
                      color={lightNuanceColor}
                      strokeWidth={2.7}
                    />
                  }
                  name={`Wyszukaj${"\n"}po kliencie`}
                  // disabled={
                  //   !getModuleVisibilitiesObject<InformationSubmodules>(
                  //     "information"
                  //   ).information_search_by_client
                  // }
                  disabled={true}
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
  );
};

export default InformationEntryPage;
