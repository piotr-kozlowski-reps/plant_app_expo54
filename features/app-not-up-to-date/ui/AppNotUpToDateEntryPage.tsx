import Button from "@/features/shared/ui/button/Button";
import { router } from "expo-router";
import { View, Text } from "react-native";

const AppNotUpToDateEntryPage = () => {
  return (
    <View className="flex-col items-center justify-center flex-1 bg-yellow">
      <View className="w-full">
        <Text className="w-full text-center text-foreground font-default-semibold">
          Posiadasz nieaktualną wersję.
        </Text>
        <Text className="w-full mt-2 text-center text-foreground font-title">
          Uaktualnij aplikację.
        </Text>
      </View>
      <View className="w-full px-6 mt-16">
        <Button
          title="powrót"
          handlePress={() => {
            router.replace("/login");
          }}
          isOutline
        />
      </View>
    </View>
  );
};
export default AppNotUpToDateEntryPage;
