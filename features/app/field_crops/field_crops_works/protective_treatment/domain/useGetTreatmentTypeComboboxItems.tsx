import { ExtraWork } from "@/features/shared/types/interfaces-extra_works";
import { Combobox } from "@/features/shared/types/interfaces-general";
import { useEffect } from "react";
import { useState } from "react";

export const useGetTreatmentTypeComboboxItems = (extraWorks: ExtraWork[]) => {
  const [comboboxTreatmentType, setComboboxTreatmentType] = useState<
    Combobox<ExtraWork>[]
  >([]);

  useEffect(() => {
    if (!extraWorks.length) return;

    setComboboxTreatmentType([
      {
        visibleText: "214 Technologia",
        value: getValueFromExtraWorkArray("214", extraWorks),
      },
      {
        visibleText: "300 Klient",
        value: getValueFromExtraWorkArray("300", extraWorks),
      },
      {
        visibleText: "303 Prewencja",
        value: getValueFromExtraWorkArray("303", extraWorks),
      },
    ]);
  }, [extraWorks]);

  return comboboxTreatmentType;
};

function getValueFromExtraWorkArray(
  treatmentId: string,
  extraWorks: ExtraWork[]
): ExtraWork {
  const foundExtraWork = extraWorks.find((work) =>
    work.activityname.startsWith(treatmentId)
  );

  if (!foundExtraWork)
    throw new Error("useGetTreatmentTypeComboboxItems -> Extra work not found");

  return foundExtraWork;
}
