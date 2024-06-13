import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Convert __filename and __dirname to ES module format
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory where the snapshots are stored
const snapshotDir = path.join(__dirname, "tests", "screenshots");

// Function to delete all files in a directory asynchronously
async function deleteAllFilesInDir(dir) {
  try {
    const files = await fs.readdir(dir);
    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(dir, file);
        const stat = await fs.lstat(filePath);
        if (stat.isDirectory()) {
          await deleteAllFilesInDir(filePath); // Recursively delete directory contents
        } else {
          await fs.unlink(filePath); // Delete file
        }
      })
    );
    console.log(`Deleted snapshots in ${dir}`);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log(`${dir} isn't a directory or doesn't exist.`);
    } else {
      console.error(`Error deleting files in ${dir}:`, error);
    }
  }
}

// Delete the snapshot directory contents
(async () => {
  await deleteAllFilesInDir(snapshotDir);
})();
