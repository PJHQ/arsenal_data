import { readFileSync } from 'fs';

function extractClassNames(filePath: string): string[] {
  try {
    // Read the file
    const content = readFileSync(filePath, 'utf8');

    // All main class names to extract
    const classNames: string[] = [];

    // Extract CfgWeapons section specifically
    // This handles deeply nested structures better than trying to match the entire section
    const cfgWeaponsMatch = content.match(/class\s+CfgWeapons\s*\{([\s\S]*?)(?:\n\};|\};$)/);

    if (cfgWeaponsMatch && cfgWeaponsMatch[1]) {
      const cfgWeaponsContent = cfgWeaponsMatch[1];

      // Look for equipment classes that are derived from ItemCore
      const itemPattern = /class\s+(SCM_[A-Za-z0-9_]+)\s*:\s*ItemCore/g;

      let match;
      while ((match = itemPattern.exec(cfgWeaponsContent)) !== null) {
        classNames.push(match[1]);
      }
    }

    // Extract from CfgPatches if needed
    const cfgPatchesMatch = content.match(/class\s+CfgPatches\s*\{([\s\S]*?)(?:\n\};|\};$)/);
    if (cfgPatchesMatch && cfgPatchesMatch[1]) {
      const cfgPatchesContent = cfgPatchesMatch[1];

      // Look for mod classes
      const patchPattern = /class\s+([A-Za-z0-9_]+)(?:\s*:\s*[A-Za-z0-9_]+)?\s*\{[^{}]*\}/g;

      let match;
      while ((match = patchPattern.exec(cfgPatchesContent)) !== null) {
        const className = match[1];
        if (!className.startsWith('Cfg')) {
          classNames.push(className);
        }
      }
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