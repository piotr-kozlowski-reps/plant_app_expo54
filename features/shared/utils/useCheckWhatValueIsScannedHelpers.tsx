import { TypeOfScannedValue } from "../types/interfaces-general";

export const useCheckWhatValueIsScannedHelpers = () => {
  const checkIfValueIsTray = (scannedValue: string): boolean => {
    return scannedValue.startsWith("http://www.rozsada.rozsada.com/?id=");
  };

  const checkIfValueIsField = (value: string): boolean => {
    const regex = new RegExp("POLE_[0-9]+$");
    return regex.test(value);
  };

  const checkIfValueIsZP_GRU = (value: string): boolean => {
    const isPrefixCorrect = value.startsWith("ZLEC_ZP");
    const isSuffixCorrect = value.endsWith("GRU");
    const isInteriorAnyLength =
      value.replace("ZLEC_", "").replace("GRU", "").length > 0;
    return isPrefixCorrect && isSuffixCorrect && isInteriorAnyLength;
  };
  const checkIfValueIsZP_ROZ = (value: string): boolean => {
    const isPrefixCorrect = value.startsWith("ZLEC_ZP");
    const isSuffixCorrect = value.endsWith("ROZ");
    const isInteriorAnyLength =
      value.replace("ZLEC_", "").replace("ROZ", "").length > 0;
    return isPrefixCorrect && isSuffixCorrect && isInteriorAnyLength;
  };

  const checkWhatValueWasScanned = (
    scannedValue: string
  ): TypeOfScannedValue => {
    if (checkIfValueIsTray(scannedValue)) return "tray";
    if (checkIfValueIsField(scannedValue)) return "field";
    if (checkIfValueIsZP_GRU(scannedValue)) return "zp_gru";
    if (checkIfValueIsZP_ROZ(scannedValue)) return "zp_roz";
    return "unknown";
  };

  const getPureFieldValue = (value: string): string => {
    return value.replace("POLE_", "");
  };

  const getPureZPValue = (value: string): string => {
    return value.replace("ZLEC_", "");
  };

  const getPureTrayValue = (value: string): string => {
    return value.replace("http://www.rozsada.rozsada.com/?id=", "");
  };

  //hook return
  return {
    checkIfValueIsTray,
    checkWhatValueWasScanned,
    getPureFieldValue,
    getPureZPValue,
    getPureTrayValue,
  };
};
