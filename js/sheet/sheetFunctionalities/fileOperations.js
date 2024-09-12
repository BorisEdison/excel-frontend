import { Dimension } from "./dimension.js";
import { MainGrid } from "./mainGrid.js";
export class FileOperations {
  /**
   * Initializes the FileOperations class.
   * @param {Dimension} dimension - Dimension object that includes topIndex.
   * @param {MainGrid} mainGrid - Main grid object with render method and mainCells property.
   */
  constructor(dimension, mainGrid) {
    this.dimension = dimension;
    this.mainGrid = mainGrid;

    this.init(); // Set up event listeners
    this.signalR();
  }

  /**
   * Sets up event listeners for file upload.
   */
  init() {
    // Attach change event listener to file upload button
    document
      .querySelector(".file-upload-btn")
      .addEventListener("change", (e) => {
        if (e.target.files[0]) {
          this.uploadFile(e.target.files[0]); // Handle file upload
        }
      });
  }

  signalR() {
    let progressDivElement = document.querySelector(".progress");
    let progressBarElement = document.querySelector(".progress-bar");

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7220/progressHub", {
        withCredentials: true,
      })
      .build();

    this.connection.on("ReceiveUpdate", (message) => {
      progressDivElement.style.display = "block";

      message = parseInt(message);

      progressBarElement.style.width = message + "%";
      progressBarElement.innerText = message + "%";

      if (message == 100) {
        setTimeout(() => {
          const offset = 0;
          const limit = this.mainGrid.mainCells.length;

          // Fetch the updated file data and render the grid
          this.getFile(offset, limit);
        }, 1000);

        setTimeout(() => {
          progressDivElement.style.display = "none";
          progressBarElement.style.width = 0 + "%";
          progressBarElement.innerText = 0 + "%";
        }, 2000);
      }
    });

    this.connection.start().catch((err) => {
      return console.error(err.toString());
    });
  }

  /**
   * Uploads the selected file to the server.
   * @param {File} file - The file to be uploaded.
   */
  async uploadFile(file) {
    const formData = new FormData();
    formData.append("csvFile", file); // Append file to form data

    try {
      const response = await fetch(
        "https://localhost:7220/ExcelApi/uploadCsv",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server responded with an error:", errorText);
        alert("Failed to upload the file");
      }
    } catch (error) {
      console.error("Could not connect to server:", error);
      alert("Could not connect to server");
    }
  }

  /**
   * Retrieves file data from the server and updates the grid.
   * @param {number} offset - The starting index for the data to retrieve.
   * @param {number} limit - The number of rows to retrieve.
   * @returns {Promise<void>} - A promise that resolves when the update is complete.
   */
  async getFile(offset, limit) {
    const range = {
      limit: limit,
      offset: offset,
    };

    try {
      const response = await fetch("https://localhost:7220/ExcelApi/getCsv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(range),
      });

      const res = await response.json();
      const values = res.map((item) => Object.values(item)); // Convert response to array of values

      // Ensure we don't go out of bounds
      for (let i = 0; i < Math.min(limit, values.length); i++) {
        // skipping the id column
        for (let j = 1; j < values[0].length; j++) {
          this.mainGrid.mainCells[i][j - 1].value = values[i][j]; // subjectracting j with 1 to skip id column
        }
      }

      this.mainGrid.render();
    } catch (error) {
      console.error("Could not get items:", error);
    }
  }

  /**
   * Updates a specific cell in the grid and sends the updated data to the server.
   *
   * @async
   * @param {number} index - The index of the row to update.
   * @returns {Promise<void>} - A promise that resolves when the update is complete.
   * @throws Will throw an error if the fetch request fails.
   */
  async updateCell(value, index, column) {
    try {
      // Prepare the data model from the grid, with id starting from 1
      const params = {
        Value: value,
        Id: index + 1, // The id starts from 1, so add 1 to the index
        Column: column,
      };
      console.log(params);
      // Send a POST request to update the record in the server
      let response = await fetch(
        "https://localhost:7220/ExcelApi/updateRecord",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        }
      );

      // Optionally handle the response here if necessary (e.g., check response status)
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
    } catch (error) {
      // Log any errors that occur during the update
      console.error("error in updating the cell", error);
    }
  }

  async findAndReplace(findText, replaceText) {
    const params = {
      FindText: findText,
      ReplaceText: replaceText,
    };

    try {
      const response = await fetch(
        "https://localhost:7220/ExcelApi/findAndReplace",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        }
      );

      // Optionally handle the response here if necessary (e.g., check response status)
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
    } catch (error) {
      console.error("Could not get items:", error);
    }
  }

  async deleteRow(id) {
    try {
      const response = await fetch(
        "https://localhost:7220/ExcelApi/deleteRow",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server responded with an error:", errorText);
      }
    } catch (error) {
      console.error("Could not delete items:", error);
    }
  }
}
