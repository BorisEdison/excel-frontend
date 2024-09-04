import { Dimension } from "./dimension.js";
import { MainGrid  } from "./mainGrid.js";
export class FileOperations {
  /**
   * Initializes the FileOperations class.
   * @param {Dimension} dimension - Dimension object that includes topIndex.
   * @param {MainGrid} mainGrid - Main grid object with render method and mainCells property.
   */
  constructor(dimension, mainGrid) {
    this.dimension = dimension;
    this.mainGrid = mainGrid;
    this.init();  // Set up event listeners
  }

  /**
   * Sets up event listeners for file upload.
   */
  init() {
    // Attach change event listener to file upload button
    document.querySelector('.file-upload-btn').addEventListener('change', (e) => {
      if (e.target.files[0]) {
        this.uploadFile(e.target.files[0]);  // Handle file upload
      }
    });
  }

  /**
   * Uploads the selected file to the server.
   * @param {File} file - The file to be uploaded.
   */
  async uploadFile(file) {
    const formData = new FormData();
    formData.append("csvFile", file);  // Append file to form data

    try {
      const response = await fetch('https://localhost:7220/ExcelApi/uploadCsv', {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server responded with an error:', errorText);
        alert('Failed to upload the file');
      } else {
        alert('The file has been uploaded successfully.');

        const offset = 0
        const limit = 1000

        // Fetch the updated file data and render the grid
        await this.getFile(offset, limit);
        this.mainGrid.render();
      }
    } catch (error) {
      console.error('Could not connect to server:', error);
      alert('Could not connect to server');
    }
  }

  /**
   * Retrieves file data from the server and updates the grid.
   * @param {number} offset - The starting index for the data to retrieve.
   * @param {number} limit - The number of rows to retrieve.
   */
  async getFile(offset, limit) {
    const range = {
      "limit": limit,
      "offset": offset
    };

    try {
      const response = await fetch('https://localhost:7220/ExcelApi/getCsv', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(range),
      });

      const res = await response.json();
      const values = res.map(item => Object.values(item));  // Convert response to array of values

      // Ensure we don't go out of bounds
      for (let i = 0; i < Math.min(limit, values.length); i++) {
        // skipping the id column
        for (let j = 1; j < values[0].length; j++) {
          this.mainGrid.mainCells[i][j-1].value = values[i][j];   // subjectracting j with 1 to skip id column
        }
      }
    } catch (error) {
      console.error('Could not get items:', error);
    }
  }
}
