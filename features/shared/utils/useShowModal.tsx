import { Dispatch, SetStateAction, useState } from "react";

const useShowModal = (
  initialIsShowValue?: boolean
): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const [state, setState] = useState<boolean>(initialIsShowValue || false);
  return [state, setState];
};

export { useShowModal };
