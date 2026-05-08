import { generateDocsConfig } from "./config";
import { generateDocsService } from "./generateDocsService";

const config = generateDocsConfig;

async function main() {
  await generateDocsService.generateDocs(config.inputDirs, config.outputDir);
  console.log("✅ Docs generated");
}

main();
