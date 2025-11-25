import { QUERY_KEYS } from "../constants/queryKeys";
import { configPerBuild } from "../env/env";
import { Patch_LoadingForecast_DTO } from "../types/interfaces-loading_forecast";
import { EdocCustomRegister } from "../utils/getEdocCustomRegister/lib/EdocCustomRegister";

export const customRegister_LoadingForecast = new EdocCustomRegister<
  Patch_LoadingForecast_DTO,
  Patch_LoadingForecast_DTO
>({
  address: `/api.php/REST/v1/customRegisters/${configPerBuild.customRegister_LoadingForecast}/entries`,
  queryKeysToBeRevalidated: [QUERY_KEYS.LOADING_FORECAST],
});
