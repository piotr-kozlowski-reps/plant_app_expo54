// import { generateDocsConfig } from "./lib/config";
import { generateConfigService } from "./lib/generateConfigService";
import { generateDocsService } from "./lib/generateDocsService";

// const config = generateDocsConfig;

async function main() {
  const config = await generateConfigService.generateConfig();
  await generateDocsService.generateDocs(config);
  console.log("✅ Docs generated");
}

main();
