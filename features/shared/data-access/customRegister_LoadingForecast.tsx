import { QUERY_KEYS } from "../constants/queryKeys";
import { configPerBuild } from "../env/env";
import { Patch_LoadingForecast_DTO } from "../types/interfaces-loading_forecast";
import { EdocCustomRegister } from "../utils/getEdocCustomRegister/lib/EdocCustomRegister";

/**
 * @public
 * @transformApiItem
 * wysyłka - Pronoza załadunkou:
 * adres: <b>{{URL}}</b>/api.php/REST/v1/customRegisters/<b>25</b>/entries
 * @separator
 * <b>dane</b>:
 * [
 *     {
 *            idOfPatchedItem: number;
 *            stkcnt: number;
 *            scanned_raw_value: string;
 *     }
 * ]
 */
export const customRegister_LoadingForecast = new EdocCustomRegister<
  Patch_LoadingForecast_DTO,
  Patch_LoadingForecast_DTO
>({
  address: `/api.php/REST/v1/customRegisters/${configPerBuild.customRegister_LoadingForecast}/entries`,
  queryKeysToBeRevalidated: [QUERY_KEYS.LOADING_FORECAST],
});
