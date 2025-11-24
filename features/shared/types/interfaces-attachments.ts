// export type AttachmentsRequest = {
//   attachments: {
//     file_0: {
//       fileName: string;
//       fileContent: string;
//       transferEncoding: "base64";
//     };
//     file_1: {
//       fileName: string;
//       fileContent: string;
//       transferEncoding: "base64";
//     };
//     file_2: {
//       fileName: string;
//       fileContent: string;
//       transferEncoding: "base64";
//     };
//   };
// };

// export type AttachmentsRequest = {
//   attachments: {
//     [key: string]: {
//       fileName: string;
//       fileContent: string;
//       transferEncoding: "base64";
//       prc_id: string;
//       dscrpt: string;
//     };
//   };
// };

export type AttachmentsRequest = {
  attachments: {
    file_0: {
      fileName: string;
      fileContent: string;
      transferEncoding: "base64";
      prc_id: number;
      dscrpt: string;
      dcpid: number;
    };
  };
};

export type AttachmentsResponse = {
  fileid: number[];
};
