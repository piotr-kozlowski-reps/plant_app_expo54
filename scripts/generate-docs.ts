import fg from "fast-glob";
import fs from "fs-extra";
import path from "path";

type InputDir = {
  dir: string;
  outputFileName?: string; // opcjonalne - jak nie podane, użyje nazwy folderu
  label: string;
};
type Config = {
  inputDirs: InputDir[];
  outputDir: string;
};

const config: Config = {
  inputDirs: [
    {
      dir: "features/auth",
      outputFileName: "autoryzacja_autentykacja",
      label: "Autoryzacja / Autentykacja",
    },
    {
      dir: "features/app/information/scan_zp",
      outputFileName: "informacja___skanuj_ZP",
      label: "Informacja -> skanuj ZP",
    },
    {
      dir: "features/app/information/search_zp",
      outputFileName: "informacja___wyszukaj_ZP",
      label: "Informacja -> wyszukaj ZP",
    },
    {
      dir: "features/app/information/search_by_client",
      outputFileName: "informacja___wyszukaj_klienta_z_listy",
      label: "Informacja -> wyszukaj klienta z listy",
    },
    {
      dir: "features/app/information/technological_information",
      outputFileName: "informacja___informacja_technologiczna",
      label: "Informacja -> Informacja technologiczna",
    },
  ],
  outputDir: "docs",
};

/**
 * Extract /** *\/ comments only
 */
function extractDocComments(content: string): string[] {
  const regex = /\/\*\*([\s\S]*?)(?=\*\/)/gs;
  // const regex = /\/\*\*([\s\S]*?)\*\//g;
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

/**
 * Convert comment to markdown
 */
function formatComment(comment: string): string {
  const commentType = getCommentType(comment);
  const commentPrepared = comment
    .split("\n")
    .filter((line) => !line.trim().includes("@public"))
    .filter((line) => !line.trim().includes("@topic"))
    .filter((line) => !line.trim().includes("@procedureItem"))
    .filter((line) => !line.trim().includes("@procedureDescription"))
    .filter((line) => !line.trim().includes("@guard"))
    .filter((line) => line.trim().length > 0); // usuwa puste linie

  if (commentType === "topic") return generateTopic(commentPrepared);
  if (commentType === "guard") return generateGuard(commentPrepared);
  if (commentType === "procedureDescription")
    return generateProcedureDescription(commentPrepared);
  if (commentType === "procedureItem")
    return generateProcedureItem(commentPrepared);

  return `<div>Have No Idea!! Check function: <b>formatComment()</b></div>`;
  // const commentPrepared = comment
  //   .split("\n")
  //   .filter(
  //     (line) =>
  //       !line.trim().includes("@public") && !line.trim().startsWith("@"),
  //   ) // ← WYCIĄGA @public + inne @tagi
  //   .filter((line) => line.trim().length > 0) // usuwa puste linie
  //   .join("\n")
  //   .trim();

  // return commentPrepared
  //   .split("\n")
  //   .map((line) => line.replace(/^\s*\*\s?/, ""))
  //   .join("\n")
  //   .trim();
}

async function generateDocsForDir(input: InputDir, outputDir: string) {
  const { dir, outputFileName, label } = input;

  const files = await fg([`${dir}/**/*.{ts,tsx}`], {
    ignore: ["**/*.d.ts"],
  });

  let htmlContent = `<h1>Dokumentacja dla: <b>${label}</b></h1>`;

  for (const file of files) {
    const fileContent = await fs.readFile(file, "utf-8");
    const comments = extractDocComments(fileContent);

    if (comments.length === 0) continue;

    htmlContent += `<h2> ${file}</h2>`;

    for (const comment of comments) {
      if (!comment.includes("@public")) continue;
      htmlContent += `${formatComment(comment)}`;
    }
  }

  const fullHtml = `
    <!DOCTYPE html>
    <html lang="pl">
    <head>
      <meta charset="UTF-8" />
      <title>Dokumentacja: ${dir}</title>
      <style>

      :root {
        --color-dark: #002539;
        --color-background_nuance: #FFFDF9;
        --color-gray: #C2C2C2;
        --color-procedure-description: #CAEAF2;
        --color-gray-darker: #B0B0B0;
        --color-procedure-item: #D1EDD1;
        --color-guard: #FDAFAF;
        --border-radius: 32px
        }

        @font-face {
        font-family: "euclid";
        src: url("./fonts/EuclidCircularBBold.ttf") format("truetype");
        font-weight: bold;
        font-style: bold;
        }
        @font-face {
        font-family: "euclid";
        src: url("./fonts/EuclidCircularBSemiBold.ttf") format("truetype");
        font-weight: semibold;
        font-style: semibold;
        }
        @font-face {
        font-family: "euclid";
        src: url("./fonts/EuclidCircularBRegular.ttf") format("truetype");
        font-weight: normal;
        font-style: normal;
        }
        @font-face {
        font-family: "euclid";
        src: url("./fonts/EuclidCircularBLight.ttf") format("truetype");
        font-weight: light;
        font-style: light;
        }

        body { 
        font-family: "euclid", sans-serif; max-width: 900px; margin: 40px auto; line-height: 1.4; 
        }

        h1 { 
        font-family: "euclid"; font-weight: normal; background-color: var(--color-dark); color: var(--color-background_nuance); padding-top: 8px; padding-bottom: 8px; padding-left: 32px; padding-right: 32px; border-radius: var(--border-radius);
        }

        h2 {
        font-weight: 600; font-size: 20px; background-color: var(--color-gray-darker); color: var(--color-dark); padding-top: 8px; padding-bottom: 8px; padding-left: 32px; padding-right: 32px; border-radius: var(--border-radius); width: fit-content; margin-top: 48px;
        }

        p {
        padding-top: -4px; padding-bottom: -4px;
        }

        code { background: #f5f5f5; padding: 2px 4px; }
        pre { background: #f5f5f5; padding: 10px; overflow: auto; }
      </style>
    </head>
    <body>
    ${htmlContent}
    </body>
    </html>
    `;

  const fileName = outputFileName ?? path.basename(dir);
  const outputPath = path.join(outputDir, `${fileName}.html`);

  await fs.ensureDir(outputDir);
  await fs.writeFile(outputPath, fullHtml);
}

async function main() {
  // USUŃ WSZYSTKIE PLIKI .md i .html Z KATALOGU outputDir
  const htmlAndMdFiles = await fg([`${config.outputDir}/*.html`]);
  for (const file of htmlAndMdFiles) {
    await fs.remove(file);
  }

  for (const input of config.inputDirs) {
    await generateDocsForDir(input, config.outputDir);
  }

  console.log("✅ Docs generated");
}

type CommentType = "topic" | "guard" | "procedureItem" | "procedureDescription";
function getCommentType(comment: string): CommentType {
  if (comment.includes("@topic")) return "topic";
  if (comment.includes("@guard")) return "guard";
  if (comment.includes("@procedureItem")) return "procedureItem";
  if (comment.includes("@procedureDescription")) return "procedureDescription";
  return "topic";

  // throw new Error("Unknown comment type");
}
function generateTopic(commentPrepared: string[]): string {
  let html = `<div style="margin-left: 32px; font-weight: 600; text-decoration: underline; font-size: 16px">${generateInsideLines(commentPrepared)}</div>`;
  return html;
}
function generateProcedureItem(commentPrepared: string[]): string {
  let html = `<div style="margin-left: 64px; font-weight: 500; font-size: 16px; background-color: var(--color-procedure-item); padding: 8px; padding-left: 32px; border-radius: var(--border-radius); line-height: 1.4; margin-bottom: 8px">${generateInsideLines(commentPrepared)}</div>`;
  return html;
}
function generateGuard(commentPrepared: string[]): string {
  let html = `<div style="margin-left: 64px; font-weight: 500; font-size: 16px; background-color: var(--color-guard); padding: 8px; padding-left: 32px; border-radius: var(--border-radius); line-height: 1.4; margin-bottom: 8px">
  <p style="margin-bottom:-8px;"><b>zabezpieczenie:</b></p>
  ${generateInsideLines(commentPrepared)}</div>`;
  return html;
}
function generateProcedureDescription(commentPrepared: string[]): string {
  let html = `<div style="margin-left: 64px; font-weight: 500; font-size: 16px; background-color: var(--color-procedure-description); padding: 8px; padding-left: 32px; border-radius: var(--border-radius); line-height: 1.4; margin-bottom: 8px">
  ${generateInsideLines(commentPrepared)}</div>`;
  return html;
}
function generateInsideLines(commentPrepared: string[]): string {
  let html = "";
  for (const line of commentPrepared) {
    if (line.includes("@separator")) html += `<br />`;
    else html += `<p>${line.replace("* ", "")}</p>`;
  }
  return html;
}

main();
