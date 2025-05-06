import { readFileSync } from 'fs';

function extractClassNames(filePath: string): string[] {
  try {
    // Read the file
    const content = readFileSync(filePath, 'utf8');

    // All main class names to extract
    const classNames: string[] = [];

    // Find the CfgWeapons bracket ranges
    let cfgWeaponsIndex = content.indexOf("class CfgWeapons");
    if (cfgWeaponsIndex === -1) {
      return classNames;
    }

    // Find all classes with scope = 2 directly
    // This regex pattern looks for class definitions followed by content with scope = 2
    const scopeClassPattern = /class\s+([A-Za-z0-9_]+)(?:\s*:\s*[A-Za-z0-9_]+)?\s*\{(?:(?!\bclass\b).)*?\bscope\s*=\s*2\b/gs;

    let match;
    while ((match = scopeClassPattern.exec(content)) !== null) {
      const className = match[1];

      // Skip base classes and config sections
      if (className === "ItemCore" ||
          className === "InventoryItem_Base_F" ||
          className === "HeadgearItem" ||
          className === "CfgWeapons" ||
          className === "CfgPatches") {
        continue;
      }

      // Add the classname to our list
      classNames.push(className);
    }

    return classNames;
  } catch (error) {
    console.error('Error processing config file:', error);
    return [];
  }
}

// If run directly
if (import.meta.main) {
  const args = Bun.argv.slice(2);
  if (args.length === 0) {
    console.error('Please provide a path to config.cpp');
    process.exit(1);
  }

  const filePath = args[0];
  const classes = extractClassNames(filePath);
  console.log(JSON.stringify(classes, null, 2));
}