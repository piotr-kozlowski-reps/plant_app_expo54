import * as Yup from "yup";
import { Config } from "../types/interfaces-config";

const envSchema = Yup.object({
  EXPO_PUBLIC_API_URL: Yup.string()
    .required()
    .test(
      "check possible addresses of api",
      "envSchema -> EXPO_PUBLIC_API_URL -> bad value",
      (value) => {
        const possibleValues = [
          "https://edt.mularski.pl",
          "https://ed.mularski.pl",
        ];
        return possibleValues.includes(value);
      }
    ),
  NODE_ENV: Yup.string()
    .required("NODE_ENV required")
    .test("NODE_ENV has bad value", "NODE_ENV has bad value", (value) => {
      const possibleValue = ["development", "production", "test"];
      return possibleValue.includes(value);
    }),

  // EXPO_PUBLIC_BASE_CONTENT_URL: Yup.string().required(),
});

export const env = envSchema.validateSync({
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  NODE_ENV: process.env.NODE_ENV,
});

export let configPerBuild: Config = {
  apiAddress: env.EXPO_PUBLIC_API_URL,
  edocReport_UserValidation: 1567,
  edocReport_ExtraWorks: 1568,
  edocReport_TypeOfTreatment: 1610,
  edocReport_ListOfZPsFromAField: 1569,
  edocReport_ZPForActivityId: 1571,
  edocReport_ActivityTodaysQuantity: 1573,
  edocReport_ZPDetailedInfo: 113,
  edocReport_ZPLocalizationInfo: 116,
  edocReport_ProtectiveTreatments: 121,
  edocReport_CheckLocalization: 1580,
  edocReport_Information: 163,
  edocReport_InformationAboutZPPerLocalization: 123,
  edocReport_CutsList: 911,
  edocReport_GeneralWorks: 1605,
  edocReport_TrayToBeDestroyed: 84,
  edocReport_ModulesPins: 1608,
  edocReport_TrayReplacementInfo: 88,
  edocReport_ControlSowingChanges: 119,
  edocReport_DeleteReasons: 1612,
  edocReport_ActivitiesList: 143,
  edocReport_ActivityDetails: 144,
  edocReport_NitrogenIrrigationList: 1619,

  customRegister_ExtraWork: 238,
  customRegister_PhoneInfo: 240,
  customRegister_AllLocalizations: 23,
  customRegister_CutGRU: 166,
  customRegister_LoadingForecast: 25,
  customRegister_GeneralWorks: 243,
};
