const fs = window.electron.fs;

const saveFile = async (filePath: string, data: string) => {
  try {
    await fs.writeFile(filePath, data);
    console.log(`File saved successfully to ${filePath}`);
  } catch (error) {
    console.error(`Error saving file to ${filePath}:`, error);
  }
};

const readFile = async (filePath: string) => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    console.log(`File read successfully from ${filePath}`);
    return data;
  } catch (error) {
    console.error(`Error reading file from ${filePath}:`, error);
    return null;
  }
};

const fileExists = async (filePath: string) => {
  try {
    const exists = await fs.exists(filePath);
    console.log(`File existence check for ${filePath}: ${exists}`);
    return exists;
  } catch (error) {
    console.error(`Error checking file existence for ${filePath}:`, error);
    return false;
  }
};

export { saveFile, readFile, fileExists };
