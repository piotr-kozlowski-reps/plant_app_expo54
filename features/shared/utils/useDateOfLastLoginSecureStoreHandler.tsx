import * as KeepAwake from "expo-keep-awake";
import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { useSecureStore } from "./useSecureStore";
import { router } from "expo-router";
import useAuthSessionStore from "../stores/useAuthSessionStore";

export const useDateOfLastLoginSecureStoreHandler = () => {
  const appState = useRef(AppState.currentState);
  const { getFromSecureStore, addToSecureStore } = useSecureStore();
  const { removeAuthSession } = useAuthSessionStore();

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // temp();
        onAppWake();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // const temp = async () => {
  //   await addToSecureStore("dayAppWasActiveRecently", "2025-08-06");
  // };

  const onAppWake = async () => {
    const todaysDateAsString = new Date(Date.now()).toISOString().split("T")[0];
    const dateOfLastAppActive = await getFromSecureStore(
      "dayAppWasActiveRecently"
    );

    if (!dateOfLastAppActive) {
      await addToSecureStore("dayAppWasActiveRecently", todaysDateAsString);
      return;
    }

    if (todaysDateAsString === dateOfLastAppActive) {
      return;
    }
    if (todaysDateAsString !== dateOfLastAppActive) {
      await addToSecureStore("dayAppWasActiveRecently", todaysDateAsString);
      router.replace("/login");
      removeAuthSession();
    }
  };
};
