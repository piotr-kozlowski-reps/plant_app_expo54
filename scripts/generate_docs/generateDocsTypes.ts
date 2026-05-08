export type DocsConfig = {
  inputDirs: DocsInputDir[];
  outputDir: string;
};

export type DocsInputDir = {
  dir: string;
  outputFileName?: string; // opcjonalne - jak nie podane, użyje nazwy folderu
  label: string;
};

export type CommentType =
  | "topic"
  | "guard"
  | "procedureItem"
  | "procedureDescription";
