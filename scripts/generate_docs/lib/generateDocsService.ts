import fg from "fast-glob";
import fs from "fs-extra";
import path from "path";
import {
  AppRoute,
  CommentType,
  DocsConfig,
  DocsInputDir,
} from "./generateDocsTypes";
import { htmlTemplates } from "./generateDocsHtmlTemplates";

type WriteFileOptions = {
  dir: string;
  outputDir: string;
  outputFileName?: string;
  extension: "html" | "md";
  fullHtml: string;
};

type IndividualDocsFilesOptions = {
  outputDir: string;
  routes: AppRoute[];
  prevPath: string;
  prevLabel: string;
};

type HtmlDocsForDirOptions = {
  dir: string;
  label: string;
  prevLabel: string;
  outputDir: string;
  path: string;
  prevPath: string;
  isShowBackToIndex?: boolean;
  // routes: AppRoute[];
};

type CustomComment = {
  type: CommentType;
  order: number;
  comment: string;
  // level: number;
};

class GenerateDocsService {
  async generateDocs(config: DocsConfig) {
    await this.initialClear(config.outputDir);
    await this.generateIndexHtml(config);
    await this.generateIndividualDocsFiles(config);
  }

  //// priv main
  private async initialClear(path: string) {
    const htmlFiles = await fg([`${path}/*.html`]);
    const mdFiles = await fg([`${path}/*.md`]);

    try {
      await this.deleteFiles(htmlFiles);
      await this.deleteFiles(mdFiles);
    } catch (error) {
      console.error((error as Error).message);
    }
  }

  private async generateIndexHtml(config: DocsConfig) {
    const { appName, outputDir } = config;
    let htmlContent = `<h1>Dokumentacja aplikacji: <b>${appName}</b></h1>`;

    if (config.routes) {
      htmlContent += htmlTemplates.generateRoutesHtml(
        config.routes.routes,
        0,
        "",
      );

      const fullHtml = htmlTemplates.generateIndexHtml(htmlContent);
      await this.writeFile({
        dir: "index",
        outputDir,
        outputFileName: "index",
        extension: "html",
        fullHtml,
      });
    }
  }

  private async generateIndividualDocsFiles(config: DocsConfig) {
    const { outputDir, routes } = config;
    const existingRoutes = routes?.routes || [];

    await this.generateIndividualDocsFilesRecursively({
      outputDir,
      routes: existingRoutes,
      prevPath: "",
      prevLabel: "",
    });
  }

  ////priv helpers
  private async generateIndividualDocsFilesRecursively(
    options: IndividualDocsFilesOptions,
  ) {
    const { outputDir, routes, prevPath, prevLabel } = options;

    for (const route of routes) {
      if (route.docsDir) {
        await this.generateHtmlDocsForDir({
          dir: route.docsDir,
          label: route.label,
          prevLabel: prevLabel,
          outputDir,
          path: route.path,
          prevPath: prevPath,
          isShowBackToIndex: true,
        });
      }

      const subRoutes = route.routes;
      if (subRoutes && subRoutes.length) {
        await this.generateIndividualDocsFilesRecursively({
          outputDir,
          routes: subRoutes,
          prevPath: `${prevPath ? `${prevPath}__${route.path}` : `${route.path}`}`,
          prevLabel: `${prevLabel ? `${prevLabel} -> ${route.label}` : `${route.label}`}`,
        });
      }
    }
  }
  private async deleteFiles(files: string[]) {
    for (const file of files) {
      await fs.remove(file);
    }
  }

  private async generateHtmlDocsForDir(options: HtmlDocsForDirOptions) {
    const {
      dir,
      label,
      prevLabel,
      outputDir,
      path,
      prevPath,
      isShowBackToIndex,
    } = options;

    //files
    const files = await fg([`${dir}/**/*.{ts,tsx}`], {
      ignore: ["**/*.d.ts"],
    });

    //html start
    const currentLabel = `${prevLabel ? `${prevLabel} -> ${label}` : `${label}`}`;
    let htmlContent = `<h1>Dokumentacja dla: <b>${currentLabel}</b></h1>`;
    if (isShowBackToIndex) {
      htmlContent += `<a href="./index.html" class="back-button">powrót</a>`;
    }
    const currentPath = `${prevPath ? `${prevPath}__${path}` : `${path}`}`;

    //comments
    const dirCommentsMap: Record<string, CustomComment[]> = {};
    for (const file of files) {
      // //TODO: get rid of that if below
      // if (!file.includes("features/auth/")) return;

      const allFileComments: CustomComment[] = [];
      const fileContent = await fs.readFile(file, "utf-8");
      const comments = this.extractDocComments(fileContent);
      if (comments.length === 0) continue;

      this.addFileComments(comments, allFileComments);
      const sortedComments = allFileComments.sort((a, b) => {
        return a.order - b.order;
      });
      dirCommentsMap[file] = sortedComments;
    }
    const allSortedComments = Object.entries(dirCommentsMap).sort(
      ([keyA], [keyB]) => {
        const a = dirCommentsMap[keyA];
        const b = dirCommentsMap[keyB];

        const lastAItemOrder = a[a.length - 1]?.order;
        const lastBItemOrder = b[0]?.order;

        if (!lastAItemOrder) return 1;
        if (!lastBItemOrder) return -1;
        if (lastAItemOrder > lastBItemOrder) return 1;
        if (lastAItemOrder < lastBItemOrder) return -1;
        return 0;
      },
    );

    htmlContent += await this.processCommentsList(allSortedComments, 0);

    if (isShowBackToIndex) {
      htmlContent += `<a href="./index.html" class="back-button" style="display: inline-block; margin-top: 32px;">powrót</a>`;
    }
    const fullHtml = htmlTemplates.generateMainHtml(dir, htmlContent);
    await this.writeFile({
      dir,
      outputDir,
      outputFileName: currentPath,
      extension: "html",
      fullHtml,
    });
  }

  private async processCommentsList(
    allSortedComments: [string, CustomComment[]][],
    index: number,
  ): Promise<string> {
    let html = "";

    for (const fileComments of allSortedComments) {
      const fileName = fileComments[0];
      const commentObject = fileComments[1];

      html += this.addFileNameItem(
        fileName,
        commentObject[0]?.order,
        commentObject[commentObject.length - 1]?.order,
      );

      for (const commentItem of commentObject) {
        const comment = commentItem.comment;
        if (!comment.includes("@public")) continue;
        if (comment.includes("@readFile")) {
          const htmlFromFile = await this.generateCommentsFromFile(
            comment,
            index,
          );
          html += `${this.formatComment(comment, index)}`;
          html += htmlFromFile;
          continue;
        }
        html += `${this.formatComment(comment, index)}`;
      }
    }
    return html;
  }

  private addFileNameItem(
    fileName: string,
    startIndex: number,
    endIndex: number,
  ) {
    return `<div style="display: flex; justify-content: start; align-items: center; margin-bottom: 4px;">
      <h4>${fileName}</h4>
      <div style="font-size: 10px;">(${startIndex} - ${endIndex})</div>
    </div>`;
  }

  private addFileComments(
    comments: string[],
    allFileComments: CustomComment[],
  ) {
    let currentOrder = 0;
    for (const comment of comments) {
      if (!comment.includes("@public")) continue;

      const commentType = this.getCommentType(comment);
      const extractedCommentOrder = this.getCommentOrder(comment);
      if (extractedCommentOrder) {
        currentOrder = extractedCommentOrder;
        allFileComments.push({
          type: commentType,
          order: currentOrder,
          comment,
        });
      } else {
        currentOrder++;
        allFileComments.push({
          type: commentType,
          order: currentOrder,
          comment,
        });
      }
    }
  }

  private async processComments(
    comments: string[],
    index: number,
  ): Promise<string> {
    let html = "";

    for (const comment of comments) {
      if (!comment.includes("@public")) continue;
      if (comment.includes("@readFile")) {
        const htmlFromFile = await this.generateCommentsFromFile(
          comment,
          index,
        );
        html += `${this.formatComment(comment, index)}`;
        html += htmlFromFile;
        continue;
      }
      html += `${this.formatComment(comment, index)}`;
    }

    return html;
  }

  private extractDocComments(content: string): string[] {
    const regex = /\/\*\*([\s\S]*?)(?=\*\/)/gs;
    const matches: string[] = [];

    let match;
    while ((match = regex.exec(content)) !== null) {
      const comment = match[1].trim();
      if (comment) {
        matches.push(comment);
      }
    }

    return matches;
  }

  private formatComment(comment: string, index: number): string {
    const commentType = this.getCommentType(comment);
    const commentPrepared = comment
      .split("\n")
      .filter((line) => !line.trim().includes("@public"))
      .filter((line) => !line.trim().includes("@topic"))
      .filter((line) => !line.trim().includes("@procedureItem"))
      .filter((line) => !line.trim().includes("@procedureDescription"))
      .filter((line) => !line.trim().includes("@guard"))
      .filter((line) => !line.trim().includes("@readFile"))
      .filter((line) => !line.trim().includes("@reportItem"))
      .filter((line) => !line.trim().includes("@transformApiItem"))
      .filter((line) => !line.trim().includes("@order"))
      .filter((line) => line.trim().length > 0); // usuwa puste linie
    if (commentType === "topic")
      return htmlTemplates.generateTopicHtml(commentPrepared, index);

    if (commentType === "guard")
      return htmlTemplates.generateGuardHtml(commentPrepared, index);

    if (commentType === "procedureDescription")
      return htmlTemplates.generateProcedureDescriptionHtml(
        commentPrepared,
        index,
      );

    if (commentType === "procedureItem")
      return htmlTemplates.generateProcedureItemHtml(commentPrepared, index);

    if (commentType === "transformApi")
      return htmlTemplates.generateTransformApiHtml(commentPrepared, index);

    if (commentType === "report")
      return htmlTemplates.generateReportHtml(commentPrepared, index);

    throw new Error(
      "formatComment - Unknown comment type - have no idea what HTML to generate",
    );

    // return `<div>Have No Idea!! Check function: <b>formatComment()</b></div>`;
  }

  private getCommentType(comment: string): CommentType {
    if (comment.includes("@topic")) return "topic";
    if (comment.includes("@guard")) return "guard";
    if (comment.includes("@procedureItem")) return "procedureItem";
    if (comment.includes("@procedureDescription"))
      return "procedureDescription";
    if (comment.includes("@transformApiItem")) return "transformApi";
    if (comment.includes("@reportItem")) return "report";

    throw new Error("Unknown comment type");
  }

  private getCommentOrder(comment: string): number | null {
    const match = comment.match(/@order\s+(\d+)/);
    if (match) {
      const orderNumber = Number.parseInt(
        match[0].replace("@order ", "").trim(),
      );
      return orderNumber;
    }

    return 0;
  }

  private async writeFile(options: WriteFileOptions) {
    const { dir, outputDir, outputFileName, extension, fullHtml } = options;

    const fileName = outputFileName ?? path.basename(dir);
    const outputPath = path.join(outputDir, `${fileName}.${extension}`);
    await fs.ensureDir(outputDir);
    await fs.writeFile(outputPath, fullHtml);
  }

  private async generateCommentsFromFile(pathToFile: string, index: number) {
    const matches = [
      ...pathToFile.matchAll(/^\s*\*\s*@readFile\s+`([^`]+)`/gm),
    ];

    let html = "";

    for (const match of matches) {
      const matchedFilePath = match[0].match(/`([^`]*)`/);
      const filePath = matchedFilePath?.[1];
      if (!filePath) continue;
      const fileContent = await fs.readFile(filePath, "utf-8");

      const comments = this.extractDocComments(fileContent);
      if (comments.length === 0) continue;

      html += htmlTemplates.generateH3Html(
        `pobrano z pliku: ${filePath}`,
        index,
      );
      html += await this.processComments(comments, index + 1);
    }

    return html;
  }
}
export const generateDocsService = new GenerateDocsService();
