import { TechnicalInformation } from "@/features/shared/types/interfaces-information";
import { View, Text } from "react-native";

type Props = {
  item: TechnicalInformation;
  index: number;
};
const DetailedTechnologicalInfoItem = (props: Props) => {
  ////vars
  const { item, index } = props;

  ////tsx
  return (
    <View className="w-full mb-4">
      <View>
        <View className="w-full h-[1px] bg-foreground mb-[18px]"></View>
        <View className="flex-col items-start justify-start">
          <View>
            <Text className="font-nav text-foreground text-wrap">
              {item.ptc_kod}
              {":"}
            </Text>
          </View>

          <View className="mt-2 ml-6">
            <Text className="text-foreground ">
              <Text className="font-normal text-foreground text-wrap">
                PLAN COMARCH:{" "}
              </Text>
              <Text className="font-nav">{item.plan_xl}</Text>
            </Text>
          </View>

          <View className="ml-6">
            <Text className="text-foreground ">
              <Text className="font-normal text-foreground text-wrap">
                PLAN PO ZEGARKU:{" "}
              </Text>
              <Text className="font-nav">
                {item.watch_dt ? item.watch_dt : "-"}
              </Text>
            </Text>
          </View>

          <View className="ml-6">
            <Text className="text-foreground ">
              <Text className="font-normal text-foreground text-wrap">
                WYKONANIE:{" "}
              </Text>
              <Text className="font-nav">
                {item.real_dt ? item.real_dt : "-"}
              </Text>
            </Text>
          </View>

          <View className="ml-6">
            <Text className="text-foreground ">
              <Text className="font-normal text-foreground text-wrap">
                WYKONANIE VS COMARCH:{" "}
              </Text>
              {/* {item.delta_days ? (
                <Text className=" font-nav text-destructive">
                  {getPreparedDayText(item.delta_days)}
                </Text>
              ) : null}
              {!item.delta_days ? (
                <Text className=" font-nav">{"-"}</Text>
              ) : null} */}

              {item.delta_days !== null && item.delta_days !== 0 ? (
                <Text className=" font-nav text-destructive">
                  {getPreparedDayText(item.delta_days)}
                </Text>
              ) : null}
              {item.delta_days === 0 ? (
                <Text className="font-nav"> {`0 dni`}</Text>
              ) : null}
              {!item.delta_days && item.delta_days !== 0 ? (
                <Text className=" font-nav">{"-"}</Text>
              ) : null}
            </Text>
          </View>

          <View className="ml-6">
            <Text className="text-foreground ">
              <Text className="font-normal text-foreground text-wrap">
                WYKONANIE VS ZEGAREK:{" "}
              </Text>
              {item.delta_days_watch !== null && item.delta_days_watch !== 0 ? (
                <Text className=" font-nav text-destructive">
                  {getPreparedDayText(item.delta_days_watch)}
                </Text>
              ) : null}
              {item.delta_days_watch === 0 ? (
                <Text className="font-nav"> {`0 dni`}</Text>
              ) : null}
              {!item.delta_days_watch && item.delta_days_watch !== 0 ? (
                <Text className=" font-nav">{"-"}</Text>
              ) : null}
            </Text>
          </View>

          {/* <View className="ml-6">
            <Text className="text-foreground ">
              <Text className="font-normal text-foreground text-wrap">
                Data po zegarku:{" "}
              </Text>
              <Text className="font-nav">
                {item.watch_dt ? item.watch_dt : "-"}
              </Text>
              {item.delta_days_watch !== null && item.delta_days_watch !== 0 ? (
                <Text className=" font-nav text-destructive">
                  {getPreparedDayText(item.delta_days_watch)}
                </Text>
              ) : null}
              {item.delta_days_watch === 0 ? (
                <Text className="font-nav"> {`${" "}${" "}${" "}0 dni`}</Text>
              ) : null}
            </Text>
          </View> */}
        </View>
      </View>
    </View>
  );
};
export default DetailedTechnologicalInfoItem;

function getPreparedDayText(deltaDays: number): string {
  const plusOrMinus = deltaDays < 0 ? "" : "+";
  const dayText = deltaDays === 1 || deltaDays === -1 ? " dzień" : " dni";

  return `${plusOrMinus}${deltaDays} ${dayText}`;
}
