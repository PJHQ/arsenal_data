import * as path from "path";
import * as fs from "fs/promises";
import { parseArgs } from "util";

async function loadAndCombineData(dataFolder: string): Promise<string[]> {
  const combinedData: string[] = [];

  const jsonFiles = await fs.readdir(dataFolder);
  for (const entry of jsonFiles) {
    if (!entry.includes(".json")) continue;
    const filePath = path.join(dataFolder, entry);
    if (!(await fs.exists(filePath))) continue;
    const fileContent = await fs.readFile(filePath, { encoding: "utf8" });

    try {
      const jsonData = JSON.parse(fileContent);
      if (Array.isArray(jsonData)) {
        combinedData.push(...jsonData.map(String)); // Ensure items are strings
      } else {
        console.error(`Invalid JSON format in file: ${filePath}`);
      }
    } catch (error) {
      console.error(`Error parsing JSON in file: ${filePath}`);
      console.error(error);
    }
  }

  return combinedData;
}

function removeDuplicates(data: string[]): string[] {
  return Array.from(new Set(data));
}

function findDuplicates(data: string[]): string[] {
  const seen: { [key: string]: boolean } = {};
  const duplicates: string[] = [];

  for (const item of data) {
    if (seen[item]) {
      duplicates.push(item);
    } else {
      seen[item] = true;
    }
  }

  return duplicates;
}

function printDuplicates(data: string[]): void {
  const duplicates = findDuplicates(data);

  if (duplicates.length > 0) {
    console.log("\nDuplicate items found:");
    duplicates.forEach((item) => {
      console.log(item);
    });
  } else {
    console.log("No duplicates found.");
  }
}

function sortData(data: string[]): string[] {
  return data.sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );
}

async function compareWithFile(
  data: string[],
  compareFilePath: string
): Promise<void> {
  try {
    const compareFileContent = await fs.readFile(compareFilePath, {
      encoding: "utf8",
    });
    const compareData = (await JSON.parse(compareFileContent)) as string[];

    const missingItems = compareData.filter(
      (item: string) =>
        !data.some(
          (dataItem: string) => dataItem.toLowerCase() === item.toLowerCase()
        )
    );

    if (missingItems.length > 0) {
      console.log("\nStrings missing from combined data:");
      missingItems.forEach((item: string) => {
        console.log(item);
      });
    } else {
      console.log("No missing strings found.");
    }
  } catch (error) {
    console.error(`Error reading or parsing compare file: ${compareFilePath}`);
    console.error(error);
  }
}

async function writeToFile(data: string[], prefix: string): Promise<void> {
  const distFolder = "output";
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];

  // const fileName = `${prefix}_${formattedDate}`;
  const fileName = `arsenal_${prefix}`;

  try {
    await fs.mkdir(distFolder, { recursive: true });
  } catch (error) {
    console.error(`Error creating ${distFolder} folder: ${error}`);
    process.exit(1);
  }

  // const jsonFile = join(distFolder, fileName + ".json");
  const sqfFileInit = path.join(distFolder, `init_${fileName}` + ".sqf");
  const sqfFileExec = path.join(distFolder, fileName + ".sqf");
  const jsonContent = JSON.stringify(data);

  const sqfContentInit = `"Type: ${prefix} | Last Updated: ${formattedDate}";
[this, false] call ace_dragging_fnc_setDraggable;
[this, false] call ace_dragging_fnc_setCarryable;
[this,
  ${jsonContent}
] call ace_arsenal_fnc_initBox;
`;

    const sqfContentExec = `"Type: ${prefix} | Last Updated: ${formattedDate}";
params ["_Arsenal"];
[_Arsenal, false] call ace_dragging_fnc_setDraggable;
[_Arsenal, false] call ace_dragging_fnc_setCarryable;
[_Arsenal,
  ${jsonContent}
] call ace_arsenal_fnc_initBox;`;

  try {
    console.log("\n")
    // await fs.writeFile(jsonFile, jsonContent, { encoding: "utf8" });
    // console.log(`Data written to file: ${jsonFile}`);

    await fs.writeFile(sqfFileInit, sqfContentInit, { encoding: "utf8" });
    console.log(`Data written to file: ${sqfFileInit}`);

    await fs.writeFile(sqfFileExec, sqfContentExec, { encoding: "utf8" });
    console.log(`Data written to file: ${sqfFileExec}`);
    console.log("\n")
  } catch (error) {
    console.error(`Error writing to file: ${error}`);
    process.exit(1);
  }
}

const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    "no-check": {
      type: "boolean",
      default: false,
    },
    folder: {
      type: "string",
      short: "f",
    },
    all: {
      type: "boolean",
      short: "a",
      default: false,
    },
  },
  strict: true,
  allowPositionals: true,
});

async function processAllDataFolders(): Promise<void> {
  const dataPath = "data";
  try {
    const folders = await fs.readdir(dataPath);
    for (const folder of folders) {
      const folderPath = path.join(dataPath, folder);
      const stat = await fs.stat(folderPath);
      if (stat.isDirectory()) {
        console.log(`\n=== Processing folder: ${folder} ===`);
        let data = await loadAndCombineData(folderPath);

        if (!values["no-check"]) {
          printDuplicates(data);
        }

        data = removeDuplicates(data);
        data = sortData(data);

        await writeToFile(data, folder);
      }
    }
  } catch (error) {
    console.error(`Error processing data folders: ${error}`);
    process.exit(1);
  }
}

let dataFolderPath: string = "";
if (values.all) {
  await processAllDataFolders();
} else if (values.folder) {
  dataFolderPath = values.folder;
} else {
  throw new Error("Missing --folder (-f) and data path, or use --all (-a) to process all folders");
}

// Only process single folder if not using --all option
if (!values.all && dataFolderPath) {
  let data = await loadAndCombineData(dataFolderPath);

  if (!values["no-check"]) {
    printDuplicates(data);
  }

  data = removeDuplicates(data);
  data = sortData(data);

  const outputName = dataFolderPath.split("/").pop()

  if (values.folder) await writeToFile(data, outputName ?? "unknown");
}
