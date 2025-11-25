import { router } from "expo-router";
import { TouchableOpacity, View, Text, ScrollView } from "react-native";
import { NavElement } from "../../types/interfaces-navigation";
import clsx from "clsx";
import { useEffect, useRef } from "react";

type Props = {
  paths: NavElement[];
};

const AppPath = (props: Props) => {
  ////vars
  const { paths } = props;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd();
    }
  }, []);

  ////tsx
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentOffset={{ x: 200, y: 0 }}
    >
      <View className="flex-row items-center justify-start">
        {paths.map((path, index) => {
          if (index !== paths.length - 1) {
            return (
              <View
                key={index}
                className={clsx(
                  "flex-row items-center justify-start",
                  index === 0 ? "ml-0" : "ml-1"
                )}
              >
                <TouchableOpacity onPress={() => path.actionFn()}>
                  <View
                    className={clsx(
                      "flex-row items-center py-2 bg-background-nuance rounded-app px-4"
                    )}
                  >
                    <Text className="font-default-normal">{path.name}</Text>
                  </View>
                </TouchableOpacity>

                <View className={clsx(index === 0 ? "pr-1 pl-2" : "pr-1 pl-2")}>
                  <Text className="font-default-semibold">/</Text>
                </View>
              </View>
            );
          }
          return (
            <Text className="pl-[4px] underline font-default-bold" key={index}>
              {path.name}
            </Text>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default AppPath;
