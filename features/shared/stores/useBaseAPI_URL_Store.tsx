import { create } from "zustand";
import { configPerBuild } from "../env/env";

interface BaseURLStore {
  baseURL: string;
}

const useBaseAPI_URL_Store = create<BaseURLStore>(() => ({
  baseURL: configPerBuild.apiAddress,
}));

export { useBaseAPI_URL_Store };
