const fs = require("fs").promises;

const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    console.log(`Successfully deleted ${filePath}`);
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
    throw error;
  }
};

module.exports = deleteFile

