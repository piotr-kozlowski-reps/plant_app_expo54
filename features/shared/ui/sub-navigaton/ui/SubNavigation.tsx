import AppSectionBackground from "@/features/shared/ui/app-section-background/AppSectionBackground";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import AppPath from "@/features/shared/ui/app-path/AppPath";
import {
  NavElement,
  SubNavigationElement,
} from "@/features/shared/types/interfaces-navigation";
import ListItemName from "@/features/app/field_crops/extra_works_zp/ui/ListItemName";
import { router } from "expo-router";
import { useShowScrollViewFlash } from "@/features/shared/utils/useShowScrollViewFlash";

type Props = {
  paths: NavElement[];
  subNavigationItems: SubNavigationElement[];
};

const SubNavigation = (props: Props) => {
  ////vars
  const { paths, subNavigationItems } = props;
  const { scrollViewRef } = useShowScrollViewFlash();

  ////tsx
  return (
    <AppSectionBackground>
      <View className="flex-1">
        <View className="flex-col items-center justify-start flex-1 w-full">
          <View className="w-full h-6 opacity-35"></View>
          <View className="w-full px-6">
            <AppPath paths={paths} />
          </View>
          <View className="w-full h-6 opacity-35"></View>

          <View className="flex-1 w-full pb-16">
            <ScrollView
              className="w-full px-6"
              persistentScrollbar={true}
              ref={scrollViewRef}
            >
              {subNavigationItems.map((subNavEl, index) => (
                <ListItemName
                  key={subNavEl.title}
                  title={subNavEl.title}
                  id={index}
                  actionFn={subNavEl.actionFn}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    </AppSectionBackground>
  );
};

export default SubNavigation;
