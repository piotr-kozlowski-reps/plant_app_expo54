import { configPerBuild } from "@/features/shared/env/env";
import useAuthSessionStore from "@/features/shared/stores/useAuthSessionStore";
import {
  ActivityTodaysQuantityResponse,
  ExtraWork,
} from "@/features/shared/types/interfaces-extra_works";
import { useEffect, useState } from "react";

export const useCheckIfExtraWorkWasDoneToday = (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  extraWork: ExtraWork | undefined,
) => {
  const { token } = useAuthSessionStore();
  const [todaysQuantity, setTodaysQuantity] = useState(0);

  useEffect(() => {
    getExtraWorkTodaysQuantity();
  }, [extraWork]);

  /**
   * @public
   * @procedureItem
   * @order 40
   * raporty - weryfikacja czy praca była już dziś wykonana::
   * adres: <b>{{URL}}</b>/api.php/REST/custom/korsolgetreport?rep_id=<b>1573</b>&activityid=<b>%activityid%</b>
   */
  async function getExtraWorkTodaysQuantity() {
    setIsLoading(true);

    let response: ActivityTodaysQuantityResponse;
    try {
      const res = await fetch(
        `${configPerBuild.apiAddress}/api.php/REST/custom/korsolgetreport?rep_id=${configPerBuild.edocReport_ActivityTodaysQuantity}&activityid=${extraWork?.keyval}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      response = (await res.json()) as ActivityTodaysQuantityResponse;

      if (response.data.resultMainQuery === -1) {
        return;
      }
      if (response.data.resultMainQuery.length > 0) {
        setTodaysQuantity(
          Number.parseInt(response.data.resultMainQuery[0].qntity_day),
        );
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  return { todaysQuantity };
};
