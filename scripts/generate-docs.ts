import fg from "fast-glob";
import fs from "fs-extra";
import path from "path";

type InputDir = {
  dir: string;
  outputFileName?: string; // opcjonalne - jak nie podane, użyje nazwy folderu
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
    },
    {
      dir: "features/app/information/scan_zp",
      outputFileName: "informacja___skanuj_ZP",
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
  const commentPrepared = comment
    .split("\n")
    .filter(
      (line) =>
        !line.trim().includes("@public") && !line.trim().startsWith("@"),
    ) // ← WYCIĄGA @public + inne @tagi
    .filter((line) => line.trim().length > 0) // usuwa puste linie
    .join("\n")
    .trim();

  return commentPrepared
    .split("\n")
    .map((line) => line.replace(/^\s*\*\s?/, ""))
    .join("\n")
    .trim();
}

async function generateDocsForDir(input: InputDir, outputDir: string) {
  const { dir, outputFileName } = input;

  const files = await fg([`${dir}/**/*.{ts,tsx}`], {
    ignore: ["**/*.d.ts"],
  });

  let mdContent = `# Dokumentacja dla: ${dir}\n\n`;

  for (const file of files) {
    const fileContent = await fs.readFile(file, "utf-8");
    const comments = extractDocComments(fileContent);

    if (comments.length === 0) continue;

    mdContent += `## 📄 ${file}\n\n`;

    for (const comment of comments) {
      if (!comment.includes("@public")) continue;
      mdContent += `${formatComment(comment)}\n\n---\n\n`;
    }
  }

  const fileName = outputFileName ?? path.basename(dir);
  const outputPath = path.join(outputDir, `${fileName}.md`);

  await fs.ensureDir(outputDir);
  await fs.writeFile(outputPath, mdContent);
}

async function main() {
  // USUŃ WSZYSTKIE PLIKI .md Z KATALOGU outputDir
  const mdFiles = await fg([
    `${config.outputDir}/*.md`,
    `!${config.outputDir}/*.md`,
  ]);
  for (const mdFile of mdFiles) {
    await fs.remove(mdFile);
  }

  for (const input of config.inputDirs) {
    await generateDocsForDir(input, config.outputDir);
  }

  console.log("✅ Docs generated");
}

main();
