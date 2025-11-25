import { RestOfLocalizationsDespiteOfOneChosen } from "@/features/shared/types/interfaces-localization";
import BadgeValueHighlighted from "@/features/shared/ui/badge/BadgeValueHighlighted";
import Button from "@/features/shared/ui/button/Button";
import { View, Text } from "react-native";

type Props = {
  closeFn: () => void;
  restOfLocalizations: RestOfLocalizationsDespiteOfOneChosen[];
};

const AnotherLocalizationsToBeTreatedModal = (props: Props) => {
  ////vars
  const { restOfLocalizations, closeFn } = props;

  ////tsx
  return (
    <View className="absolute top-0 bottom-0 left-0 right-0 w-full h-full">
      <View className="relative flex-col items-center justify-center flex-1">
        <View className="w-full pt-16 pb-[4px] border-t-2 border-b-2 border-destructive rounded-app">
          <View className="flex items-center justify-center w-full px-6">
            <Text className="text-center text-foreground font-euclid_semibold">
              Zabieg ochronny wykonałeś na ZPku/ZPkach,{"\n"} który jest/które
              są w kilku lokalizacjach.
            </Text>
          </View>

          <View className="flex items-center justify-center w-full px-6 mt-8">
            <Text className="text-center text-foreground font-euclid_semibold">
              Pozostałe lokalizacje:
            </Text>
          </View>
          <View>
            {restOfLocalizations.map((loc) => (
              <View
                key={loc.ordnmb}
                className="flex-row items-center justify-center w-full mt-2"
              >
                <View className="max-w-fit">
                  <Text>{`${loc.ordnmb}: `}</Text>
                </View>

                {loc.restOfLocalizations.map((loc) => (
                  <View className="max-w-fit" key={loc}>
                    <BadgeValueHighlighted value={loc} />
                  </View>
                ))}
              </View>
            ))}
          </View>

          <View className="flex-col justify-center w-full gap-4 px-6 mt-8 mb-4 items-between">
            <View>
              <Button title="przyjąłem" handlePress={closeFn} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
export default AnotherLocalizationsToBeTreatedModal;
