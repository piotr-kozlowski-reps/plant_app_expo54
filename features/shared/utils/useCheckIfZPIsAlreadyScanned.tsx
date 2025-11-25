export const useCheckIfZpIsAlreadyScanned = () => {
  function checkIfZpIsAlreadyScanned(
    zpID: string,
    alreadyScannedZPs: { ordnmb: string }[]
  ): boolean {
    return alreadyScannedZPs.some((zp) => zp.ordnmb === zpID);
  }

  return { checkIfZpIsAlreadyScanned };
};
