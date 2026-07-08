export function parseStringToFloatAndReplaceCommaWithDigit(value: any) {
  return Number.parseFloat(value.toString().replace(",", "."));
}
