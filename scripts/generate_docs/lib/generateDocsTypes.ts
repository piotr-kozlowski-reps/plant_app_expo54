export type DocsConfig = {
  // inputDirs: DocsInputDir[];
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
  | "procedureDescription"
  | "transformApi"
  | "report";

export type AppRoutesConfig = {
  routes: AppRoute[];
};
export type AppRoute = {
  path: string;
  label: string;
  order: number;
  docsDir?: string;
  outputDocFileName?: string;
  routes?: AppRoute[];
};
export type AppRouteConfig = {
  label: string;
  order: number;
  docsDir?: string;
  outputDocFileName?: string;
};
