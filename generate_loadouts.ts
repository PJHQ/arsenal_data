import * as path from "path";
import * as fs from "fs/promises";

async function getAllUnitLoadoutFiles(baseDir: string): Promise<{ unit: string, loadout: string, file: string }[]> {
  const result: { unit: string, loadout: string, file: string }[] = [];
  const units = await fs.readdir(baseDir);
  for (const unit of units) {
    const unitPath = path.join(baseDir, unit);
    const stat = await fs.stat(unitPath);
    if (!stat.isDirectory()) continue;
    const loadouts = await fs.readdir(unitPath);
    for (const loadoutFile of loadouts) {
      if (!loadoutFile.endsWith(".json")) continue;
      const loadout = loadoutFile.replace(/\.json$/i, "");
      result.push({ unit, loadout, file: path.join(unitPath, loadoutFile) });
    }
  }
  return result;
}

const baseDir = "data_loadouts";
const outputFile = path.join("output", "loadouts.sqf");
const currentDate = new Date().toISOString().split("T")[0];
let outputLines: string[] = [];
outputLines.push(`"Last Updated: ${currentDate}";`);

try {
  const allLoadouts = await getAllUnitLoadoutFiles(baseDir);
  for (const { unit, loadout, file } of allLoadouts) {
    const name = `[${unit.replace(/_/g, " ")}] ${loadout.replace(/_/g, " ")}`;
    let loadoutArray;
    try {
      const content = await fs.readFile(file, { encoding: "utf8" });
      loadoutArray = JSON.parse(content);
      if (!Array.isArray(loadoutArray)) {
        console.error(`Invalid loadout array in ${file}`);
        continue;
      }
    } catch (e) {
      console.error(`Failed to read or parse ${file}:`, e);
      continue;
    }
    // Write the SQF call
    outputLines.push(`["${name}", ${JSON.stringify(loadoutArray)}, true] call ace_arsenal_fnc_addDefaultLoadout;`);
  }
  await fs.mkdir(path.dirname(outputFile), { recursive: true });
  await fs.writeFile(outputFile, outputLines.join("\n") + "\n", { encoding: "utf8" });
  // Subtract 1 for the comment line
  console.log(`Wrote ${outputLines.length - 1} loadouts to ${outputFile}`);
} catch (err) {
  console.error("Error generating loadouts:", err);
  process.exit(1);
}
