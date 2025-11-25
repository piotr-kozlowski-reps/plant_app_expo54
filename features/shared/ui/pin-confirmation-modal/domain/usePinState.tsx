import { ModulePin } from "@/features/shared/types/interfaces-tray_operations";
import { ERROR_MESSAGES, MESSAGES } from "@/features/shared/utils/messages";
import { useEffect, useState } from "react";
import { toast } from "sonner-native";

type PinDot = {
  isSet: boolean;
};

export const usePinState = (
  modulesPinsArray: ModulePin[],
  confirmPinFn: () => void
) => {
  //state
  const [pin, setPin] = useState<string>("");
  const [pinDots, setPinDots] = useState<PinDot[]>([
    { isSet: false },
    { isSet: false },
    { isSet: false },
    { isSet: false },
  ]);

  //side effects
  useEffect(() => {
    const pinDots: PinDot[] = [];
    for (let i = 0; i < 4; i++) {
      const isSet = i < pin.length;
      pinDots.push({ isSet });
    }
    setPinDots(pinDots);
  }, [pin]);

  useEffect(() => {
    if (pin.length === 4) {
      checkPinHandler();
    }
  }, [pin]);

  //fn
  const addDigitToPin = (digit: string) => {
    setPin((prevPin) => prevPin + digit);
  };

  const deleteLastDigit = () => {
    if (pin.length) {
      setPin((prevPin) => prevPin.slice(0, -1));
    }
  };

  const checkPinHandler = () => {
    const foundModulePin = modulesPinsArray.find(
      (modulePin) => modulePin.module_name === "tray_operations"
    );

    if (!foundModulePin) {
      toast.warning(ERROR_MESSAGES.NO_PIN_FOR_MODULE);
      setPin("");
      return;
    }

    const isPinGood = foundModulePin.module_pin === pin;
    if (!isPinGood) {
      toast.warning(ERROR_MESSAGES.WRONG_PIN);
      setPin("");
      return;
    }

    setPin("");
    toast.success(MESSAGES.GOOD_PIN);
    confirmPinFn();
  };

  //hook return
  return {
    pin,
    pinDots,
    addDigitToPin,
    deleteLastDigit,
  };
};
