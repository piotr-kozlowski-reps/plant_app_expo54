import { QUERY_KEYS } from "../constants/queryKeys";
import { configPerBuild } from "../env/env";
import { Post_GeneralWork_DTO } from "../types/interfaces-general_works";
import { EdocCustomRegister } from "../utils/getEdocCustomRegister/lib/EdocCustomRegister";

/**
 * @public
 * @transformApiItem
 * @order 60
 * wysyłka - CREG:
 * <b>{{URL}}</b>/api.php/REST/v1/customRegisters/<b>243</b>/entries
 * dane - array obiektów:
 * {
 *   activityid: number;
 *   donedat: Date;
 *   mobile: true;
 *   params_json: GeneralWork_Json[];
 * }
 * @separator
 * GeneralWork_Json:
 * {
 *    a: boolean;
 *    b: boolean;
 *    c: boolean;
 *    all: boolean;
 *    id____: number;
 *    planam: string;
 *    scanned_raw_value: string
 * }
 * @separator
 */
export const customRegister_GeneralWorks = new EdocCustomRegister<
  Post_GeneralWork_DTO,
  Post_GeneralWork_DTO
>({
  address: `/api.php/REST/v1/customRegisters/${configPerBuild.customRegister_GeneralWorks}/entries`,
  queryKeysToBeRevalidated: [QUERY_KEYS.GENERAL_WORKS],
});
