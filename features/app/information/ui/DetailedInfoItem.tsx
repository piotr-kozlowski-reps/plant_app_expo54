import { InformationDTO } from "@/features/shared/types/interfaces-information";
import clsx from "clsx";
import { View, Text } from "react-native";

type Props = {
  item: InformationDTO;
  index: number;
};

const DetailedInfoItem = (props: Props) => {
  ////vars
  const { item, index } = props;

  //
  const isItemWeekMainNumber = item.label === "TYDZIEŃ WYJAZDU";
  const isItemExtraWorksLabel = item.prior === "10000";
  const isRegularItem = !isItemWeekMainNumber && !isItemExtraWorksLabel;

  ////tsx
  return (
    <>
      {isItemWeekMainNumber ? (
        <View
          className={clsx(
            "w-full flex-col justify-end",
            index === 0 ? "mb-8 h-8" : "h-[96px] mb-8",
          )}
        >
          <View className="flex-row items-center justify-start w-full">
            <View>
              <Text className="underline text-foreground font-nav">
                {item.label}
                {":"}
              </Text>
            </View>
            <View className="ml-2 ">
              {getJSXWithProperColors(item.details)}
              {/* <Text className="text-foreground font-title">{item.value}</Text> */}
            </View>
          </View>
        </View>
      ) : null}
      {isItemExtraWorksLabel ? (
        <View
          className={clsx(
            "w-full flex-col justify-end",
            index === 0 ? "mb-8 h-8" : "h-[96px] mb-8",
          )}
        >
          <View className="w-full h-[8px] bg-foreground mb-[18px]"></View>
          <View className="flex-row items-center justify-start w-full">
            <View>
              <Text className="text-foreground font-nav">
                {item.label}
                {":"}
              </Text>
            </View>
            <View className="ml-2 ">
              {getJSXWithProperColors(item.details)}
              {/* <Text className="text-foreground font-title">{item.value}</Text> */}
            </View>
          </View>
        </View>
      ) : null}
      {isRegularItem ? (
        <View className="w-full mb-4">
          <View>
            <View className="w-full h-[1px] bg-foreground mb-[18px]"></View>
            <View className="flex-col items-start justify-start">
              <View>
                <Text className="font-normal text-foreground text-wrap">
                  {item.label}
                  {":"}
                </Text>
              </View>

              <View className="mt-1 ml-4">
                {getJSXWithProperColors(item.details)}
                {/* <Text className="text-foreground font-nav">{item.value}</Text> */}
              </View>
            </View>
          </View>
        </View>
      ) : // <View className="flex-col items-start justify-start w-full h-[48px] mb-2">
      //   <View className="w-full h-[1px] bg-foreground mb-[18px]"></View>
      //   <View className="flex-row items-center justify-start">
      //     <View>
      //       <Text className="font-normal text-foreground">
      //         {item.label}
      //         {":"}
      //       </Text>
      //     </View>
      //     <View className="ml-2">
      //       <Text className="text-foreground font-nav">{item.value}</Text>
      //     </View>
      //   </View>

      // </View>
      null}
    </>
  );
};
export default DetailedInfoItem;

function getJSXWithProperColors(text: string | null) {
  if (!text) return <Text className="text-foreground font-main-menu"></Text>;

  const substringsObject = parseRedString(text);

  return (
    <Text className="text-foreground font-main-menu">
      {substringsObject.map((item, index) => {
        const isRedString = item.isRed;

        if (isRedString)
          return (
            <Text className="text-destructive font-main-menu" key={index}>
              {item.text + " " + " "}
            </Text>
          );

        return (
          <Text className="text-foreground font-main-menu" key={index}>
            {item.text + " " + " "}
          </Text>
        );
      })}
      {/* {substringArray.map((substring, index) => {
        const isRedString = checkIfIsRedString(substring);
        const textWithCutTags = substring
          .replace("<red>", "")
          .replace("</red>", "");

        if (isRedString)
          return (
            <Text className="text-destructive font-main-menu" key={index}>
              {textWithCutTags}
            </Text>
          );

        return (
          <Text className="text-foreground font-main-menu" key={index}>
            {substring}
          </Text>
        );
      })} */}
    </Text>
  );
}

function checkIfIsRedString(text: string): boolean {
  return text.includes("<red>");
}

type ParsedItem = {
  isRed: boolean;
  text: string;
};
export function parseRedString(input: string): ParsedItem[] {
  const result: ParsedItem[] = [];

  let inputCropped = input.replaceAll("|", "");

  while (inputCropped.length > 0) {
    // debugger;
    const trimmedText = inputCropped.trim();

    if (!trimmedText) {
      result.push({
        isRed: false,
        text: " ",
      });
      break;
    }

    const redStartIndex = trimmedText.indexOf("<red>");
    const redEndIndex = trimmedText.indexOf("</red>");
    if (
      (redStartIndex === -1 || redEndIndex === -1) &&
      trimmedText.length > 0
    ) {
      result.push({
        isRed: false,
        text: trimmedText,
      });
      inputCropped = "";

      // break;
    }

    if (redStartIndex > 0) {
      const cutText = trimmedText.slice(0, redStartIndex);
      result.push({
        isRed: false,
        text: cutText.trim(),
      });
      inputCropped = trimmedText.replace(cutText, "");
    }

    if (redStartIndex === 0) {
      const cutText = trimmedText.slice(0, redEndIndex + 6);
      const cutTextWithoutTags = cutText
        .replace("<red>", "")
        .replace("</red>", "");
      result.push({
        isRed: true,
        text: cutTextWithoutTags.trim(),
      });
      inputCropped = trimmedText.replace(cutText, "");
    }
  }

  return result;
}
