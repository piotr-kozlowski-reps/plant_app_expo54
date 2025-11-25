import { AllCropsOrdersSubmodules } from "@/features/shared/types/interfaces-auth";
import { InHowManyDaysKeyValue } from "@/features/shared/types/interfaces-general";
import { useEffect, useState } from "react";

export const useGetOrderDetailsDependingOnType = (
  whatOrderType: AllCropsOrdersSubmodules
) => {
  //submodule name
  const [submoduleName, setSubmoduleName] = useState("");
  useEffect(() => {
    if (whatOrderType === "field_crops_works_order_to_hardener") {
      setSubmoduleName("Zlecenie na hartownik");
      return;
    }
    if (whatOrderType === "field_crops_works_internal_transport") {
      setSubmoduleName("Zlecenie transportu");
      return;
    }
    if (whatOrderType === "field_crops_works_order_export_to_customer") {
      setSubmoduleName("Zlecenie wywozu do klienta");
      return;
    }
    if (whatOrderType === "greenhouse_crops_works_order_to_spacing") {
      setSubmoduleName("Zlecenie rozstawiania");
      return;
    }

    throw new Error(
      "useGetOrderDetailsDependingOnType -> whatOrderType is not valid"
    );
  }, [whatOrderType]);

  //inHowManyDaysPlaceOrder_Array
  const [inHowManyDaysPlaceOrder_Array, setInHowManyDaysPlaceOrder_Array] =
    useState<InHowManyDaysKeyValue[]>(
      getProperArrayForInHowManyDaysPlaceOrder(whatOrderType)
    );

  //in how many days modal text
  const [inHowManyDaysText, setInHowManyDaysText] = useState(
    getInHowManyDaysText(whatOrderType)
  );

  ////return
  return {
    submoduleName,
    inHowManyDaysPlaceOrder_Array,
    inHowManyDaysText,
  };

  ////helpers
  function getInHowManyDaysText(
    whatOrderType: AllCropsOrdersSubmodules
  ): string {
    if (
      whatOrderType === "field_crops_works_order_to_hardener" ||
      whatOrderType === "field_crops_works_internal_transport" ||
      whatOrderType === "greenhouse_crops_works_order_to_spacing"
    )
      return "Wybierz za ile dni";
    if (whatOrderType === "field_crops_works_order_export_to_customer")
      return "Wybierz datę wywozu";

    throw new Error("getInHowManyDaysText -> whatOrderType is not valid");
  }
  function getProperArrayForInHowManyDaysPlaceOrder(
    whatOrderType: AllCropsOrdersSubmodules
  ): InHowManyDaysKeyValue[] {
    if (whatOrderType === "greenhouse_crops_works_order_to_spacing") {
      return [
        { name: "+ 2 dni", value: 2 },
        { name: "+ 3 dni", value: 3 },
        { name: "+ 4 dni", value: 4 },
        { name: "+ 5 dni", value: 5 },
        { name: "+ 6 dni", value: 6 },
        { name: "+ 7 dni", value: 7 },
        { name: "+ 8 dni", value: 8 },
        { name: "+ 9 dni", value: 9 },
        { name: "+ 10 dni", value: 10 },
        { name: "+ 11 dni", value: 11 },
        { name: "+ 12 dni", value: 12 },
        { name: "+ 13 dni", value: 13 },
        { name: "+ 14 dni", value: 14 },
      ];
    }

    if (whatOrderType === "field_crops_works_order_to_hardener") {
      return [
        { name: "+ 1 dzień", value: 1 },
        { name: "+ 2 dni", value: 2 },
        { name: "+ 3 dni", value: 3 },
        { name: "+ 4 dni", value: 4 },
        { name: "+ 5 dni", value: 5 },
        { name: "+ 6 dni", value: 6 },
        { name: "+ 7 dni", value: 7 },
        { name: "+ 8 dni", value: 8 },
        { name: "+ 9 dni", value: 9 },
        { name: "+ 10 dni", value: 10 },
        { name: "+ 11 dni", value: 11 },
        { name: "+ 12 dni", value: 12 },
        { name: "+ 13 dni", value: 13 },
        { name: "+ 14 dni", value: 14 },
      ];
    }

    if (whatOrderType === "field_crops_works_internal_transport") {
      return [
        // { name: "dziś", value: 0 },
        { name: "+ 1 dzień", value: 1 },
        { name: "+ 2 dni", value: 2 },
        { name: "+ 3 dni", value: 3 },
        { name: "+ 4 dni", value: 4 },
        { name: "+ 5 dni", value: 5 },
        { name: "+ 6 dni", value: 6 },
        { name: "+ 7 dni", value: 7 },
      ];
    }

    if (whatOrderType === "field_crops_works_order_export_to_customer") {
      return [
        { name: "+ 1 dzień", value: 1 },
        { name: "+ 2 dni", value: 2 },
        { name: "+ 3 dni", value: 3 },
        { name: "+ 4 dni", value: 4 },
        { name: "+ 5 dni", value: 5 },
        { name: "+ 6 dni", value: 6 },
        { name: "+ 7 dni", value: 7 },
        { name: "+ 8 dni", value: 8 },
        { name: "+ 9 dni", value: 9 },
        { name: "+ 10 dni", value: 10 },
        { name: "+ 11 dni", value: 11 },
        { name: "+ 12 dni", value: 12 },
        { name: "+ 13 dni", value: 13 },
        { name: "+ 14 dni", value: 14 },
        { name: "+ 15 dni", value: 15 },
        { name: "+ 16 dni", value: 16 },
        { name: "+ 17 dni", value: 17 },
        { name: "+ 18 dni", value: 18 },
        { name: "+ 19 dni", value: 19 },
        { name: "+ 20 dni", value: 20 },
        { name: "+ 21 dni", value: 21 },
      ];
    }

    throw new Error(
      "getProperArrayForInHowManyDaysPlaceOrder -> whatOrderType is not valid"
    );
  }
};
