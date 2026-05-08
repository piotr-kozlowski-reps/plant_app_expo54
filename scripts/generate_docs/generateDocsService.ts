import fg from "fast-glob";
import fs from "fs-extra";
import path from "path";
import { CommentType, DocsInputDir } from "./generateDocsTypes";
import { htmlTemplates } from "./generateDocsHtmlTemplates";

type WriteFileOptions = {
  dir: string;
  outputDir: string;
  outputFileName?: string;
  extension: "html" | "md";
  fullHtml: string;
};

class GenerateDocsService {
  async generateDocs(inputDirs: DocsInputDir[], outputDir: string) {
    this.initialClear(outputDir);
    for (const input of inputDirs) {
      await this.generateHtmlDocsForDir(input, outputDir);
    }
  }

  //// priv
  private async deleteFiles(files: string[]) {
    for (const file of files) {
      await fs.remove(file);
    }
  }

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

  private async generateHtmlDocsForDir(input: DocsInputDir, outputDir: string) {
    const { dir, outputFileName, label } = input;

    const files = await fg([`${dir}/**/*.{ts,tsx}`], {
      ignore: ["**/*.d.ts"],
    });
    let htmlContent = `<h1>Dokumentacja dla: <b>${label}</b></h1>`;
    for (const file of files) {
      const fileContent = await fs.readFile(file, "utf-8");
      const comments = this.extractDocComments(fileContent);

      if (comments.length === 0) continue;

      htmlContent += `<h2> ${file}</h2>`;

      htmlContent += await this.processComments(comments, 0);
    }

    const fullHtml = htmlTemplates.generateMainHtml(dir, htmlContent);
    await this.writeFile({
      dir,
      outputDir,
      outputFileName,
      extension: "html",
      fullHtml,
    });
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
