import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Convert __filename and __dirname to ES module format
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory where the snapshots are stored for tests and screenshots
const testsSnapshotDir = path.join(__dirname, "../tests");
const screenshotsDir = path.join(__dirname, "../screenshots");

// Function to delete all PNG files in a directory asynchronously
async function deleteAllPngFilesInDir(dir) {
  try {
    const files = await fs.readdir(dir);
    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(dir, file);
        const stat = await fs.lstat(filePath);
        if (stat.isDirectory()) {
          await deleteAllPngFilesInDir(filePath); // Recursively delete directory contents
        } else {
          if (path.extname(file).toLowerCase() === ".png") {
            await fs.unlink(filePath); // Delete PNG file
            console.log(`Deleted file ${filePath}`);
          }
        }
      })
    );
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log(`${dir} isn't a directory or doesn't exist.`);
    } else {
      console.error(`Error deleting files in ${dir}:`, error);
    }
  }
}

// Delete all PNG files in the snapshot directories for tests and screenshots
(async () => {
  try {
    await deleteAllPngFilesInDir(testsSnapshotDir);
    console.log(`Deleted PNG files in ${testsSnapshotDir}`);

    // If you also want to delete PNG files in screenshots directory
    await deleteAllPngFilesInDir(screenshotsDir);
    console.log(`Deleted PNG files in ${screenshotsDir}`);
  } catch (error) {
    console.error("Error deleting PNG files:", error);
  }
})();
