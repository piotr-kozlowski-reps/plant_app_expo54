import { create } from "zustand";
import { configPerBuild } from "../env/env";

interface TestOrProductionStore {
  isProduction: boolean;
}

const useTestOrProductionStore = create<TestOrProductionStore>(() => ({
  isProduction:
    configPerBuild.apiAddress === "https://ed.mularski.pl" ? true : false,
}));

export { useTestOrProductionStore };
