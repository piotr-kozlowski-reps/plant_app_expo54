// import { generateDocsConfig } from "./lib/config";
import { generateConfigService } from "./lib/generateConfigService";
import { generateDocsService } from "./lib/generateDocsService";

// const config = generateDocsConfig;

async function main() {
  const config = await generateConfigService.generateConfig();
  console.log({ config });
  // await generateDocsService.generateDocs(config.inputDirs, config.outputDir);
  // console.log("✅ Docs generated");
}

main();
