export type uploadFileResult = {
  filename: string;
  file: fileResult | undefined;
  error: fileError | undefined;
};

type fileResult = {
  duplicateInFile: number;
  duplicateInMongo: number;
  duplicateInBase: number;
  badDataCounter: number;
  validDataCounter: number;
  nullTypeAndCarrier: number;
  ATTCarrier: number;
  TMobileCarrier: number;
  verizonCarrier: number;
};

type fileError = {
  error: string;
  message: string;
};
