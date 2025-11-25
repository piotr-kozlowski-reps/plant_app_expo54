import { View, Text } from "react-native";
import Label from "../label/Label";
import { useFormikCustomHelpers } from "../../utils/useFormikCustomHelpers";
import { FormikProps } from "formik";
import ButtonTextAndIcon from "../button/ButtonTextAndIcon";
import { ChevronDown } from "lucide-react-native";
import { lightColor, yellowColor } from "../../constants/colorThemeVars";
import { Combobox } from "../../types/interfaces-general";
import ModalInternal from "../modal/ModalInternal";
import { useShowModal } from "../../utils/useShowModal";
import ComboboxModal from "./ComboboxModal";
import { useDatesHelper } from "../../utils/useDatesHelper";

type Props<InputType, ValueType> = {
  label: string;
  placeholder: string;
  disabled?: boolean;
  isSignedAsRequired?: boolean;
  formik: FormikProps<InputType>;
  formikField: keyof InputType;
  isVerifiedAtOnce?: boolean;
  isOnWhite?: boolean;
  height?: number;
  comboboxItems: Combobox<ValueType>[];
  itemPropertyToBeDisplayed?: keyof ValueType;
  refreshAllData: () => void;
};
export default function ComboboxFormik<InputType, ValueType>(
  props: Props<InputType, ValueType>
) {
  ////vars
  const {
    label,
    placeholder,
    disabled = false,
    isSignedAsRequired,
    formik,
    formikField,
    isVerifiedAtOnce = false,
    isOnWhite = false,
    height,
    comboboxItems,
    itemPropertyToBeDisplayed,
    refreshAllData,
  } = props;
  const { checkIsDate, renderDateInPolishWay } = useDatesHelper();

  //state
  const [isShowModal, setIsShowModal] = useShowModal();

  //formik
  const { isError, error } = useFormikCustomHelpers<InputType>(
    isVerifiedAtOnce,
    formik,
    formikField
  );
  const setFormikValue = (value: ValueType | null) => {
    formik.getFieldHelpers(formikField as string).setValue(value);
    setIsShowModal(false);

    // formik.setFieldValue(formikField as string, value);
  };

  const getFormikValue = (): string => {
    if (
      formik.values[formikField] instanceof Object &&
      itemPropertyToBeDisplayed
    ) {
      return (formik.values[formikField] as ValueType)[
        itemPropertyToBeDisplayed
      ]
        ? ((formik.values[formikField] as ValueType)[
            itemPropertyToBeDisplayed
          ] as string)
        : placeholder;
    }

    if (
      typeof formik.values[formikField] === "string" ||
      typeof formik.values[formikField] === "number"
    ) {
      const foundItem = comboboxItems.find(
        (item) => item.value === (formik.values[formikField] as ValueType)
      );

      if (!foundItem) {
        return placeholder;
      }

      return foundItem.visibleText;
    }

    if (checkIsDate(formik.values[formikField])) {
      const foundItem = comboboxItems.find(
        (item) =>
          renderDateInPolishWay(item.value as Date) ===
          renderDateInPolishWay(formik.values[formikField] as Date)
      );

      if (!foundItem) {
        return placeholder;
      }

      return foundItem.visibleText;
    }

    return placeholder;
  };

  // formik.handleChange(formikField);

  //css InputView
  const classNamesInputView = [
    "flex-row items-center w-full focus:border-secondary rounded-tr-xl rounded-bl-xl rounded-br-app rounded-tl-app",
  ];

  return (
    <>
      <View className="flex flex-col items-start justify-start">
        {label ? (
          <View className="mb-[6px]">
            <Label
              label={label}
              isSignedAsRequired={isSignedAsRequired}
              isError={isError}
              disabled={disabled}
              // invert={isOnWhite}
            />
          </View>
        ) : null}

        <View
          className={classNamesInputView.join(" ")}
          style={height ? { height: height } : {}}
        >
          <ButtonTextAndIcon
            actionFn={() => setIsShowModal(true)}
            icon={<ChevronDown size={24} color={lightColor} strokeWidth={2} />}
            // text={(formik.values[formikField] as string) || placeholder}
            text={getFormikValue()}
            isBackground
            disabled={disabled}
          />
        </View>
        {isError ? (
          <View className="mt-[4px]">
            <Text className="font-default-semibold text-destructive">
              {error as string}
            </Text>
          </View>
        ) : null}
      </View>

      {/* choose quantities -  modal */}
      <ModalInternal
        isOpen={isShowModal}
        isTransparent={false}
        backgroundColor={yellowColor}
      >
        <ComboboxModal<ValueType>
          closeFn={() => setIsShowModal(false)}
          mainTitle={label}
          comboboxItems={comboboxItems}
          refreshAllData={refreshAllData}
          setFormikValue={setFormikValue}
        />
      </ModalInternal>
    </>
  );
}
