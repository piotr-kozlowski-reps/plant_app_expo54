import {
  AdminsGroup,
  AdminsIds,
  AppVersionAndBuild,
  FetchedUserDTO,
  LoginInput,
  TError,
  TokensDTO,
  User,
  UserPermission,
  UserPermissionDTO,
  UserProfileDTO,
  UserRole,
} from "@/features/shared/types/interfaces-auth";
import { ERROR_MESSAGES } from "@/features/shared/utils/messages";
import { useErrorHandler } from "@/features/shared/utils/useErrorHandler";
import { toast } from "sonner-native";
import { router } from "expo-router";
import { configPerBuild, env } from "@/features/shared/env/env";
import { checkOS } from "@/features/shared/utils/checkOS";
import {
  OS,
  ProductionOrDevelopment,
  PhoneInfo,
} from "@/features/shared/types/interfaces-phone-info";
import * as Application from "expo-application";
import * as Device from "expo-device";
import { query_postDataAsServerAction } from "@/features/shared/utils/commonHelpers/queryPostOnServer";
import useAppNotUpToDate_Store from "@/features/shared/stores/useAppNotUpToDate_Store";
import { useBaseAPI_URL_Store } from "@/features/shared/stores/useBaseAPI_URL_Store";

export const useLoginLogic = () => {
  ////vars
  const { errorHandler } = useErrorHandler();
  const { setIsAppUpToDate } = useAppNotUpToDate_Store();
  const { baseURL } = useBaseAPI_URL_Store();

  const login = async (values: LoginInput) => {
    try {
      const username = values.username;
      const password = values.password;

      if (!username || !password) return null;

      // tokens
      const tokens: TokensDTO | TError | null = await getTokens(
        username,
        password,
        errorHandler
      );

      if (!tokens) {
        toast.error(ERROR_MESSAGES.ERROR_IN_TOKENS);
        return null;
      }
      if ("error" in tokens) {
        toast.error(ERROR_MESSAGES.ERROR_IN_TOKENS);
        return null;
      }

      //user data
      const currentToken = (tokens as TokensDTO).token;
      const userProfilePromise = getUser(currentToken, errorHandler);
      const adminUsersGroupPromise = getAdminsUserGroups(
        currentToken,
        errorHandler
      );
      const [userProfile, adminUsersIDs] = await Promise.all([
        userProfilePromise,
        adminUsersGroupPromise,
      ]);

      if (!userProfile || !adminUsersIDs) {
        toast.error(ERROR_MESSAGES.ERROR_IN_USER_DATA);
        return null;
      }
      const isUserAnAdmin = adminUsersIDs.includes(userProfile.usr_id);

      //send phone info to creg (only in production!)
      const os: OS = checkOS();
      const version = Application.nativeApplicationVersion;
      const build = Application.nativeBuildVersion;
      const currentAppAndPhoneInfo: PhoneInfo = {
        phone_model: Device.modelName,
        os,
        os_version: Device.osVersion,
        app_version: addZerosIfNeeded(version ? version : "0"),
        app_build: addZerosIfNeeded(build ? build : "0"),
        production_or_development: env.NODE_ENV as ProductionOrDevelopment,
      };
      // console.log("configPerBuild.apiAddress: ", configPerBuild.apiAddress);

      // const currentAppAndPhoneInfo: PhoneInfo = {
      //   phone_model: Device.modelName,
      //   os,
      //   os_version: Device.osVersion,
      //   app_version: "001.000.010",
      //   app_build: "017",
      //   production_or_development: "production",
      // };

      // if (configPerBuild.apiAddress === "https://ed.mularski.pl") {
      //   try {
      //     await sendReportAboutAppVersionCurrentlyUsed(
      //       currentToken,
      //       baseURL,
      //       currentAppAndPhoneInfo
      //     );
      //   } catch (error) {
      //     errorHandler(error as Error);
      //   }
      // }

      try {
        await sendReportAboutAppVersionCurrentlyUsed(
          currentToken,
          baseURL,
          currentAppAndPhoneInfo
        );
      } catch (error) {
        errorHandler(error as Error);
      }

      //user permission and recent app versions
      const userPermissionAndRecentAppVersions =
        await getUserPermissionAndRecentAppVersions(
          currentToken,
          errorHandler,
          userProfile.usr_id
        );

      const isUserPermittedToLogin = checkIfUserIsPermittedToLogin(
        userPermissionAndRecentAppVersions,
        userProfile.usr_id
      );

      if (!isUserPermittedToLogin) {
        toast.error(ERROR_MESSAGES.USER_NOT_VERIFIED);
        return null;
      }

      /**
       * check if app is up to date
       **/

      //check if version is current or newer
      const isProduction =
        configPerBuild.apiAddress === "https://ed.mularski.pl";

      const isAppUpToDate = isProduction
        ? checkIfAppIsUpToDate(
            currentAppAndPhoneInfo,
            userPermissionAndRecentAppVersions
          )
        : true;

      if (!isAppUpToDate) {
        toast.error(ERROR_MESSAGES.APP_NOT_UP_TO_DATE);
        router.replace("/app-not-up-to-date");
        return null;
      }
      if (isAppUpToDate) {
        setIsAppUpToDate(true);
      }

      const user: User = {
        id: userProfile.usr_id,
        name: userProfile.usrnam,
        email: userProfile.e_mail,
        role: isUserAnAdmin ? UserRole.ADMIN : UserRole.USER,
        tokens: tokens,
        modulesVisibility: {
          information: {
            is_whole_module_available: true,
          },
          field_crops: {
            //field_crops_works
            is_whole_module_available: true,
            field_crops_works___overallVisibility: true,
            field_crops_works_internal_transport: true,
            field_crops_works_plants_coming_ups_counter: true,
            field_crops_works_protective_treatment: true,
            field_crops_works_loading_forecast: true,
            field_crops_works_order_to_hardener: true,
            field_crops_works_order_to_internal_transport: true,
            field_crops_works_order_export_to_customer: true,
            field_crops_works_cut: true,
            field_crops_works_loading: true,
            field_crops_nitrogen_irrigation: true,
            //extra_works_quantity
            extra_works_quantity___overallVisibility: true,
            //extra_works_zp
            extra_works_zp___overallVisibility: true,
            //extra_works_hobby
            extra_works_hobby___overallVisibility: true,
            extra_works_hobby_extra_works_quantity: true,
            extra_works_hobby_extra_works_zp: true,
            //tray_operations
            tray_operations___overallVisibility: true,
            tray_operations_destroy_tray: true,
            tray_operations_replacement_tray: true,
            tray_operations_report_damaged_trays: true,
            tray_operations_move_to_garden: true,
            tray_operations_disconnect_from_zp: true,
            tray_operations_add_to_zp: true,
          },

          greenhouse_crops: {
            is_whole_module_available: true,
            greenhouse_crops_works___overallVisibility: true,
            greenhouse_crops_works_actions_confirmation_tomato: true,
            greenhouse_crops_works_actions_confirmation_cucumber: true,
            greenhouse_crops_works_works_planning_tomato: true,
            greenhouse_crops_works_works_planning_cucumber: true,
            greenhouse_crops_works_internal_transport: true,
            greenhouse_crops_works_loading_forecast: true,
            greenhouse_crops_works_order_export_to_customer: true,

            //extra_works_quantity
            extra_works_quantity___overallVisibility: true,

            //extra_works_zp
            extra_works_zp___overallVisibility: true,
          },

          general_works: {
            is_whole_module_available: true,
            watering_plants: true,
          },
        },
      };
      return user;
    } catch (error) {
      errorHandler(error as Error);
      router.push("/");
    }
  };

  return { login };
};

////utils
async function getTokens(
  username: string,
  password: string,
  errorHandler: (error: Error, errorTitle?: string) => void
): Promise<TokensDTO | TError | null> {
  let response: TokensDTO | TError;
  try {
    const res = await fetch(
      `${configPerBuild.apiAddress}/api.php/REST/v1/login`,
      {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        // agent: httpAgent,
      }
    );

    response = await res.json();

    return response;
  } catch (error) {
    errorHandler(error as Error);
  }

  return null;
}

async function getUser(
  token: string,
  errorHandler: (error: Error, errorTitle?: string) => void
): Promise<FetchedUserDTO | null> {
  let response: UserProfileDTO;
  try {
    const res = await fetch(
      `${configPerBuild.apiAddress}/api.php/REST/v1/userProfile`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // agent: httpAgent,
      }
    );

    response = (await res.json()) as UserProfileDTO;

    if (!response.data || response.error)
      throw new Error("Getting user data failed");

    return response.data;
  } catch (error) {
    errorHandler(error as Error);
  }

  return null;
}

async function getAdminsUserGroups(
  token: string,
  errorHandler: (error: Error, errorTitle?: string) => void
): Promise<AdminsIds | null> {
  let response: AdminsGroup;
  try {
    const res = await fetch(
      `${configPerBuild.apiAddress}/api.php/REST/v1/userProfile`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // agent: httpAgent,
      }
    );

    response = (await res.json()) as AdminsGroup;

    if (!response.data || response.error)
      throw new Error("Getting admins users idis data failed");

    const adminsIDs: AdminsIds = [response.data.usr_id];
    return adminsIDs;
  } catch (error) {
    errorHandler(error as Error);
  }

  return null;
}

async function getUserPermissionAndRecentAppVersions(
  token: string,
  errorHandler: (error: Error, errorTitle?: string) => void,
  usr_id: number
): Promise<UserPermission[]> {
  let response: UserPermissionDTO;
  let userPermissionAndRecentAppVersions: UserPermission[] = [];
  try {
    const res = await fetch(
      `${configPerBuild.apiAddress}/api.php/REST/v1/system/reports/${configPerBuild.edocReport_UserValidation}/data`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // agent: httpAgent,
      }
    );

    response = (await res.json()) as UserPermissionDTO;

    if (!response.data.resultMainQuery[0].usr_id)
      throw new Error(ERROR_MESSAGES.USER_NOT_VERIFIED);

    userPermissionAndRecentAppVersions = response.data.resultMainQuery.map(
      (item) => ({
        usr_id: Number.parseInt(item.usr_id),
        os: item.os,
        app_version: item.app_version,
        app_build: item.app_build,
      })
    );
  } catch (error) {
    errorHandler(error as Error);
  }
  return userPermissionAndRecentAppVersions;
}

function checkIfAppIsUpToDate(
  currentAppAndPhoneInfo: PhoneInfo,
  userPermissionAndRecentAppVersions: UserPermission[]
): boolean {
  const currentOS = currentAppAndPhoneInfo.os;
  const currentAppVersion = currentAppAndPhoneInfo.app_version;
  const currentAppBuild = currentAppAndPhoneInfo.app_build;

  if (
    !currentOS ||
    !currentAppVersion ||
    !currentAppBuild ||
    !userPermissionAndRecentAppVersions
  ) {
    throw new Error("checkIfAppIsUpToDate -> missing data");
  }

  const lastUsedAppVersionAndBuildForDesiredOS =
    getLastUsedAppVersionAndBuildForDesiredOS(
      currentOS,
      userPermissionAndRecentAppVersions
    );

  if (!lastUsedAppVersionAndBuildForDesiredOS) {
    throw new Error(
      "checkIfAppIsUpToDate -> missing lastUsedAppVersionAndBuildForDesiredOS"
    );
  }

  const isVersionUpToDate = checkIfVersionIsUpToDate(
    currentAppVersion,
    lastUsedAppVersionAndBuildForDesiredOS
  );
  const isBuildUpToDate = checkIfNumberIsTheSameOrHigher(
    Number.parseInt(currentAppBuild),
    Number.parseInt(lastUsedAppVersionAndBuildForDesiredOS.app_version)
  );

  if (
    currentAppAndPhoneInfo.production_or_development === "development" ||
    currentAppAndPhoneInfo.production_or_development === "test"
  ) {
    return true;
  }

  return isVersionUpToDate && isBuildUpToDate;
}

function checkIfVersionIsUpToDate(
  currentAppVersion: string | null,
  lastUsedAppVersionAndBuildForDesiredOS: AppVersionAndBuild | null
): boolean {
  if (!currentAppVersion || !lastUsedAppVersionAndBuildForDesiredOS)
    return false;

  const currentAppVersionSplitted = currentAppVersion.split(".");
  const lastAppVersionSplitted =
    lastUsedAppVersionAndBuildForDesiredOS.app_version.split(".");

  const isFirstNumberCorrect = checkIfNumberIsTheSameOrHigher(
    Number.parseInt(currentAppVersionSplitted[0]),
    Number.parseInt(lastAppVersionSplitted[0])
  );
  const isSecondNumberCorrect = checkIfNumberIsTheSameOrHigher(
    Number.parseInt(currentAppVersionSplitted[1]),
    Number.parseInt(lastAppVersionSplitted[1])
  );
  const isThirdNumberCorrect = checkIfNumberIsTheSameOrHigher(
    Number.parseInt(currentAppVersionSplitted[2]),
    Number.parseInt(lastAppVersionSplitted[2])
  );

  return isFirstNumberCorrect && isSecondNumberCorrect && isThirdNumberCorrect;
}
function checkIfNumberIsTheSameOrHigher(numberOne: number, numberTwo: number) {
  return numberOne >= numberTwo;
}

function getLastUsedAppVersionAndBuildForDesiredOS(
  currentOS: OS,
  userPermissionAndRecentAppVersions: UserPermission[]
): AppVersionAndBuild | null {
  const foundOSAppVersion = userPermissionAndRecentAppVersions.find(
    (item) => item.os === currentOS
  );
  if (!foundOSAppVersion) return null;
  return {
    app_version: foundOSAppVersion.app_version,
    app_build: foundOSAppVersion.app_build,
  };
}

async function sendReportAboutAppVersionCurrentlyUsed(
  token: string,
  baseURL: string,
  info: PhoneInfo
) {
  const response = await query_postDataAsServerAction<
    {
      id____: number;
    },
    { params: PhoneInfo }
  >(
    baseURL,
    `/api.php/REST/v1/customRegisters/${configPerBuild.customRegister_PhoneInfo}/entries`,
    token,
    { params: info }
  );

  if (!response || !response.id____) {
    throw new Error("sendPhoneInfoData - Failed to send phone info data");
  }
}

function checkIfUserIsPermittedToLogin(
  userPermissionAndRecentAppVersions: UserPermission[],
  usr_id: number
): boolean {
  if (!userPermissionAndRecentAppVersions.length || !usr_id) return false;
  return userPermissionAndRecentAppVersions[0].usr_id === usr_id;
}

function addZerosIfNeeded(value: string): string {
  const valueSplittedByDot = value.split(".");
  const valuesWithZeros = [];
  for (let value of valueSplittedByDot) {
    let tempValue = "";
    for (let i = 0; i < 3 - value.length; i++) {
      tempValue += "0";
    }
    tempValue += value;
    valuesWithZeros.push(tempValue);
  }

  return valuesWithZeros.join(".");
}
