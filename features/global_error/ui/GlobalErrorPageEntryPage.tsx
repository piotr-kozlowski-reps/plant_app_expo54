import Button from "@/features/shared/ui/button/Button";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import { useSendErrorDataToServerLog } from "../domain/useSendErrorDataToServerLog";

export const GlobalErrorPageEntryPage = () => {
  const { error_message } = useLocalSearchParams<{ error_message: string }>();

  const { isErrorSent } = useSendErrorDataToServerLog(error_message);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-col items-center justify-center flex-1 bg-yellow">
        <View className="w-full px-6">
          <Text className="w-full text-center text-foreground font-default-normal">
            W aplikacji pojawił się nieoczekiwany problem:
          </Text>
          <Text className="w-full mt-2 text-center text-destructive font-title">
            {error_message}
          </Text>
        </View>
        <View className="w-full px-6 mt-16">
          <Text className="w-full text-center text-foreground font-default-bold">
            {isErrorSent
              ? "Informacja została wysłana do firmy Korsol."
              : "Informacja nie została wysłana do firmy Korsol, błąd podczas przesyłania."}
          </Text>
        </View>
        <View className="w-full px-6 mt-16">
          <Button
            title="powrót"
            handlePress={() => {
              router.replace("/");
            }}
            isOutline
          />
        </View>
      </View>
    </>
  );
};

export default GlobalErrorPageEntryPage;
