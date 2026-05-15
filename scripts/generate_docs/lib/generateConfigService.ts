import {
  AppRoute,
  AppRouteConfig,
  AppRoutesConfig,
  DocsConfig,
} from "./generateDocsTypes";
import fs from "fs/promises";
import path from "path";

class GenerateConfigService {
  private outputDir: string;
  private appDir: string;

  constructor(outputDir: string, appDir: string) {
    this.outputDir = outputDir;
    this.appDir = appDir;
  }

  async generateConfig(): Promise<DocsConfig> {
    const config: DocsConfig = {
      outputDir: this.outputDir,
    };

    const appRoutesConfig = await this.getAppRoutesConfig(this.appDir);
    console.log(JSON.stringify(appRoutesConfig, null, 2));

    return config;
  }

  ////priv
  private async getAppRoutesConfig(appDir: string) {
    const dirs = await this.walkDirs(appDir);

    const appRoutesConfig: AppRoutesConfig = { routes: [] };
    for (const relativePath of dirs) {
      const parts = relativePath.split("/");
      if (parts.length > 3) {
        throw Error(
          "getAppRoutesConfig -> too many parts, relativePath:" +
            relativePath +
            "if so, add next level to logic",
        );
      }

      //main module
      const mainModuleRoutePathName = parts[0];
      const mainModulePath = path.join(appDir, mainModuleRoutePathName);
      const isMainModule = appRoutesConfig.routes.some(
        (route) => route.path === mainModuleRoutePathName,
      );
      if (!isMainModule) {
        appRoutesConfig.routes.push(
          await this.createNewAppRouteConfig(
            mainModulePath,
            mainModuleRoutePathName,
          ),
        );
      }

      //first level submodule
      const firstLevelSubModuleRoutePathName = parts[1];
      if (!firstLevelSubModuleRoutePathName) continue;
      const firstLevelSubModulePath = path.join(
        mainModulePath,
        firstLevelSubModuleRoutePathName,
      );
      const foundMainModule = appRoutesConfig.routes.find(
        (mod) => mod.path === mainModuleRoutePathName,
      );
      if (!foundMainModule) {
        throw new Error("getAppRoutesConfig -> foundMainModule is undefined");
      }

      const submodulesFirstLevel = foundMainModule.routes;
      if (!submodulesFirstLevel) foundMainModule.routes = [];
      const foundSubmoduleFirstLevel = submodulesFirstLevel?.find(
        (submod) => submod.path === firstLevelSubModuleRoutePathName,
      );

      if (!foundSubmoduleFirstLevel) {
        foundMainModule.routes?.push(
          await this.createNewAppRouteConfig(
            firstLevelSubModulePath,
            firstLevelSubModuleRoutePathName,
          ),
        );
      }

      //second level submodule
      const secondLevelSubModuleRoutePathName = parts[2];
      if (!secondLevelSubModuleRoutePathName) continue;
      const secondLevelSubModulePath = path.join(
        firstLevelSubModulePath,
        secondLevelSubModuleRoutePathName,
      );

      if (!foundSubmoduleFirstLevel) {
        console.log({ secondLevelSubModuleRoutePathName });
        console.log({ secondLevelSubModulePath });
        throw new Error(
          "getAppRoutesConfig -> foundSubmoduleFirstLevel is undefined",
        );
      }
      console.log({ foundSubmoduleFirstLevel });
      const foundSecondLevelModule = foundSubmoduleFirstLevel!.routes?.find(
        (mod) => mod.path === secondLevelSubModuleRoutePathName,
      );
      console.log({ foundSecondLevelModule });
      if (!foundSecondLevelModule) {
        throw new Error(
          "getAppRoutesConfig -> foundSecondLevelModule is undefined",
        );
      }

      const submodulesSecondLevel = foundSecondLevelModule.routes;
      if (!submodulesSecondLevel) foundSecondLevelModule.routes = [];
      const foundSubmoduleSecondLevel = submodulesSecondLevel?.find(
        (submod) => submod.path === secondLevelSubModuleRoutePathName,
      );

      if (!foundSubmoduleSecondLevel) {
        foundSecondLevelModule.routes?.push(
          await this.createNewAppRouteConfig(
            secondLevelSubModulePath,
            secondLevelSubModuleRoutePathName,
          ),
        );
      }
    }

    return appRoutesConfig;
  }

  private async walkDirs(dir: string, base = dir): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    const dirs: string[] = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const fullPath = path.join(dir, entry.name);
      dirs.push(fullPath);

      const nested = await this.walkDirs(fullPath, base);
      dirs.push(...nested);
    }

    return dirs.map((dir) => dir.replace(base + "/", ""));
  }
  private async readConfig(dir: string): Promise<AppRouteConfig | null> {
    try {
      const filePath = path.join(dir, "config.json");
      const file = await fs.readFile(filePath, "utf-8");
      const parsedFile = JSON.parse(file);
      return parsedFile;
    } catch (error) {
      return null;
    }
  }
  private async createNewAppRouteConfig(
    pathToDirWithConfigFile: string,
    pathName: string,
  ) {
    const config = await this.readConfig(pathToDirWithConfigFile);
    const newRoute: AppRoute = {
      path: pathName,
      label: config?.label || pathName,
      order: config?.order || Number.MAX_SAFE_INTEGER,
    };
    if (config?.docsDir) newRoute.docsDir = config.docsDir;
    if (config?.outputDocFileName)
      newRoute.outputDocFileName = config.outputDocFileName;

    return newRoute;
  }
}

////export init
export const generateConfigService = new GenerateConfigService(
  "docs",
  path.join(process.cwd(), "app", "app"),
);
