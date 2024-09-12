export class GridOperations {
  constructor(dimension, mainGrid, sideGrid, topGrid, fileOperations) {
    this.dimension = dimension;
    this.mainGrid = mainGrid;
    this.sideGrid = sideGrid;
    this.topGrid = topGrid;
    this.fileOperations = fileOperations;

    this.cellInput = document.querySelector(".input-box");
    this.findReplaceBtn = document.querySelector(".find-replace-btn");

    // Initial state for selection
    this.selectIndexX = null;
    this.selectIndexY = null;
    this.selectedCell = null;

    this.xValStart = null;
    this.yValStart = null;
    this.xValEnd = null;
    this.yValEnd = null;

    this.currentIndexX = null;
    this.currentIndexY = null;
    this.previousIndexX = -1;
    this.previousIndexY = -1;

    // Text elements for statistics
    this.countText = document.querySelector(".count-text");
    this.sumText = document.querySelector(".sum-text");
    this.minText = document.querySelector(".min-text");
    this.maxText = document.querySelector(".max-text");
    this.avgText = document.querySelector(".avg-text");

    // Statistical variables
    this.count = 0;
    this.sum = 0;
    this.min = Number.MAX_VALUE;
    this.max = -Number.MAX_VALUE;

    this.isSelecting = false; // Flag to track if selection is active
    this.isAnimated = false; // Flag to track if animation is active
    this.isInput = false; // Flag to track if input box is active

    this.addEventListeners();
  }

  // Add event listeners for mouse interactions
  addEventListeners() {
    // Bind mouse and touch events for canvas interactions
    this.mainGrid.mainCanvas.addEventListener(
      "mousedown",
      this.handleMouseDown.bind(this)
    );
    this.mainGrid.mainCanvas.addEventListener(
      "touchstart",
      this.handleMouseDown.bind(this)
    );

    this.mainGrid.mainCanvas.addEventListener(
      "mousemove",
      this.handleMouseMove.bind(this)
    );
    this.mainGrid.mainCanvas.addEventListener(
      "touchmove",
      this.handleMouseMove.bind(this)
    );

    // Bind global mouse and touch events for when the user stops interacting
    window.addEventListener("mouseup", this.handleMouseUp.bind(this));
    window.addEventListener("touchend", this.handleMouseUp.bind(this));
    this.topGrid.topCanvas.addEventListener(
      "click",
      this.selectColumns.bind(this)
    );
    this.sideGrid.sideCanvas.addEventListener(
      "click",
      this.selectRows.bind(this)
    );

    // enable marching ants animation
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "c") {
        this.copyToClipboard();
        this.handleMarchingAnt(e);
      } else if (e.ctrlKey && e.key.toLowerCase() === "v") {
        this.pasteFromClipboard();
      }
      else if (e.key === "Delete" && this.dimension.selectedTop.length == this.topGrid.topCells.length) {
        const index = this.sideGrid.sideCells.indexOf(this.dimension.selectedSide[0])
        this.sideGrid.sideCells.splice(index, 1)
        this.mainGrid.mainCells.splice(index,1)
        this.dimension.rHeightPrefixSum.pop()
        
        this.fileOperations.deleteRow(this.dimension.selectedSide[0].value)
        this.clearSelection()
        this.mainGrid.render()
        this.sideGrid.render()
      }
    });

    this.findReplaceBtn.addEventListener(
      "click",
      this.findAndReplace.bind(this)
    );
  }

  async findAndReplace() {
    const findText = prompt("Enter the value you want to change");
    const replaceText = findText && prompt("Enter the updated value");

    // If both values are valid
    if (findText && replaceText) {
      await this.fileOperations.findAndReplace(findText, replaceText);

      for (let i = 0; i < this.mainGrid.mainCells.length; i++) {
        for (let j = 0; j < this.mainGrid.mainCells[0].length; j++) {
          if (this.mainGrid.mainCells[i][j].value == findText) {
            console.log("hello");
            this.mainGrid.mainCells[i][j].value = replaceText;
          }
        }
      }

      this.mainGrid.render();
    }
  }

  // Handle mouse down event
  handleMouseDown(e) {
    window.cancelAnimationFrame(this.rafId);
    this.isAnimated = false;
    this.isSelecting = true;

    this.selectIndexX = this.dimension.cellXIndex(
      this.dimension.shiftLeftX + e.offsetX
    );
    this.selectIndexY = this.dimension.cellYIndex(
      this.dimension.shiftTopY + e.offsetY
    );

    this.clearSelection();

    // Select the initial cell
    this.addElements(
      this.mainGrid.mainCells[this.selectIndexY][this.selectIndexX],
      this.dimension.selectedMain
    );
    this.addElements(
      this.sideGrid.sideCells[this.selectIndexY],
      this.dimension.selectedSide
    );
    this.addElements(
      this.topGrid.topCells[this.selectIndexX],
      this.dimension.selectedTop
    );

    // Handle input box updates if applicable
    if (this.isInput) {
      this.updateText(
        this.selectedCell,
        this.cellInput.value,
        this.prevSelectIndexY,
        this.mainGrid.mainCells[0][this.prevSelectIndexX].value
      );
      this.isInput = false;
    }

    this.inputBox();

    this.prevSelectIndexY = this.selectIndexY;
    this.prevSelectIndexX = this.selectIndexX;
  }

  // Show the input box at the selected cell position
  inputBox() {
    this.selectedCell =
      this.mainGrid.mainCells[this.selectIndexY][this.selectIndexX];
    this.cellInput.value = this.selectedCell.value;
    this.cellInput.style.display = "block";
    this.cellInput.style.top =
      this.dimension.rHeightPrefixSum[this.selectIndexY] -
      this.dimension.shiftTopY +
      this.mainGrid.mainCanvas.offsetTop +
      3 +
      "px";
    this.cellInput.style.left =
      this.dimension.cWidthPrefixSum[this.selectIndexX] -
      this.dimension.shiftLeftX +
      this.mainGrid.mainCanvas.offsetLeft +
      3 +
      "px";
    this.cellInput.style.height = this.selectedCell.height - 5 + "px";
    this.cellInput.style.width = this.selectedCell.width - 5 + "px";
    this.isInput = true;
  }

  // Update the cell value and redraw it
  async updateText(cell, value, index, column) {
    // return if value is not changed
    if (cell.value == value) {
      return;
    }

    cell.value = value;
    cell.drawCell();
    console.log(value, index, column);
    await this.fileOperations.updateCell(value, index, column);
  }

  // Handle mouse move event
  handleMouseMove(e) {
    if (this.isSelecting) {
      this.selection(e);
    }

    // Calculate and display statistics
    this.displayStatistics();
  }

  selection(e) {
    this.currentIndexX = this.dimension.cellXIndex(
      this.dimension.shiftLeftX + e.offsetX
    );
    this.currentIndexY = this.dimension.cellYIndex(
      this.dimension.shiftTopY + e.offsetY
    );

    if (
      this.previousIndexX === this.currentIndexX &&
      this.previousIndexY === this.currentIndexY
    ) {
      return; // No change in selection
    } else {
      this.previousIndexX = this.currentIndexX;
      this.previousIndexY = this.currentIndexY;
    }

    this.clearSelection();

    // Update selection based on mouse movement
    for (
      let i = Math.min(this.currentIndexY, this.selectIndexY);
      i <= Math.max(this.currentIndexY, this.selectIndexY);
      i++
    ) {
      this.addElements(this.sideGrid.sideCells[i], this.dimension.selectedSide);
      for (
        let j = Math.min(this.currentIndexX, this.selectIndexX);
        j <= Math.max(this.currentIndexX, this.selectIndexX);
        j++
      ) {
        if (i === Math.min(this.currentIndexY, this.previousIndexY)) {
          this.addElements(
            this.topGrid.topCells[j],
            this.dimension.selectedTop
          );
        }
        this.addElements(
          this.mainGrid.mainCells[i][j],
          this.dimension.selectedMain
        );
      }
    }

    this.mainGrid.selectionBoundary();
    this.topGrid.selectionBoundary();
    this.sideGrid.selectionBoundary();
  }

  clearSelection() {
    // Clear previous selections
    this.removeElements(this.dimension.selectedMain);
    this.removeElements(this.dimension.selectedTop);
    this.removeElements(this.dimension.selectedSide);

    // Reset selected arrays and values
    this.dimension.selectedMain = [];
    this.dimension.selectedTop = [];
    this.dimension.selectedSide = [];
  }

  displayStatistics() {
    this.count = 0;
    this.sum = 0;
    if (this.dimension.selectedMain.length > 0) {
      this.min = Number.MAX_VALUE;
      this.max = -Number.MAX_VALUE;

      for (let i = 0; i < this.dimension.selectedMain.length; i++) {
        const value = Number(this.dimension.selectedMain[i].value);
        if (value === "") continue;

        if (!Number.isNaN(value)) {
          this.sum += value;
          this.count += 1;
          this.min = Math.min(this.min, value);
          this.max = Math.max(this.max, value);
        }
      }

      if (this.count > 1) {
        this.countText.innerHTML = `Count: <span>${this.count}</span>`;
        this.sumText.innerHTML = `Sum: <span>${this.sum}</span>`;
        this.minText.innerHTML = `Min: <span>${this.min}</span>`;
        this.maxText.innerHTML = `Max: <span>${this.max}</span>`;
        this.avgText.innerHTML = `Average: <span>${(
          this.sum / this.count
        ).toFixed(2)}</span>`;
      } else {
        this.countText.innerHTML = ``;
        this.sumText.innerHTML = ``;
        this.minText.innerHTML = ``;
        this.maxText.innerHTML = ``;
        this.avgText.innerHTML = ``;
      }
    }
  }

  // Handle mouse up event
  handleMouseUp() {
    this.isSelecting = false;
  }

  selectColumns(event) {
    const distanceX =
      event.clientX - this.topGrid.rect.left + this.dimension.shiftLeftX;
    this.indX = this.findSelectIndex(
      distanceX,
      this.dimension.cWidthPrefixSum
    );

    if(this.indX != - 1){
      this.clearSelection();
  
      for (let i = 0; i < this.mainGrid.mainCells.length; i++) {
        this.addElements(
          this.topGrid.topCells[this.indX],
          this.dimension.selectedTop
        );
        this.addElements(
          this.mainGrid.mainCells[i][this.indX],
          this.dimension.selectedMain
        );
        this.addElements(this.sideGrid.sideCells[i], this.dimension.selectedSide);
      }
  
      this.topGrid.render();
      this.sideGrid.render();
      this.mainGrid.render();
    }
  }

  selectRows(event) {
    const distanceY =
      event.clientY - this.sideGrid.rect.top + this.dimension.shiftTopY;
    this.indY = this.findSelectIndex(
      distanceY,
      this.dimension.rHeightPrefixSum
    );

    if(this.indY != -1){
      this.clearSelection();
  
      for (let j = 0; j < this.mainGrid.mainCells[0].length; j++) {
        this.addElements(
          this.sideGrid.sideCells[this.indY],
          this.dimension.selectedSide
        );
        this.addElements(
          this.mainGrid.mainCells[this.indY][j],
          this.dimension.selectedMain
        );
        this.addElements(this.topGrid.topCells[j], this.dimension.selectedTop);
      }
  
      this.sideGrid.render();
      this.topGrid.render();
      this.mainGrid.render();
    }

  }

  findSelectIndex(distance, prefixSum) {
    
    let left = 0;
    let right = prefixSum.length - 2;

    // Binary search to find the column index
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (
        distance > prefixSum[mid] + 3 &&
        distance < prefixSum[mid+1] - 3
      )
      {
        return mid; // Found the column index
      } else if (prefixSum[mid] < distance) {
        left = mid + 1; // Search the right half
      } else {
        right = mid - 1; // Search the left half
      }
    }

    return -1; // Column not found
  }

  // Add a cell to the selected array
  addElements(cell, arr) {
    arr.push(cell);
    cell.isSelected = true;
    cell.selectCell();
  }

  // Remove a cell from the selected array
  removeElements(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i].isSelected = false;
      arr[i].selectCell();
    }
  }

  /**
   * Copies selected cells from the grid to the clipboard in a CSV-like format.
   * Cells are copied from the range defined by (i, j) to (last_i, last_j).
   */
  copyToClipboard() {
    // Initialize an array to hold the copied values
    let copiedData = [];

    // Loop through the selected range of cells
    for (let i = 0; i < this.dimension.selectedSide.length; i++) {
      let rowData = [];
      for (let j = 0; j < this.dimension.selectedTop.length; j++) {
        // Get the value of the current cell
        let value =
          this.mainGrid.mainCells[this.dimension.selectedSide[i].value - 1][
            this.dimension.getColumnNumber(
              this.dimension.selectedTop[j].value
            ) - 1
          ].value;

        rowData.push(value);
      }
      // Join the row values by tabs (or commas) and push to copiedData
      copiedData.push(rowData.join("\t"));
    }

    // Convert the copied data to a single string with line breaks for each row
    let clipboardContent = copiedData.join("\n");

    // Use the Clipboard API to copy the string to the clipboard
    navigator.clipboard
      .writeText(clipboardContent)
      .then(() => {
        console.log("Copied to clipboard:", clipboardContent);
      })
      .catch((err) => {
        console.error("Failed to copy text to clipboard:", err);
      });
  }

  /**
   * Reads data from the clipboard and logs each cell value.
   * Also logs "New Line" when a new row begins.
   */
  pasteFromClipboard() {
    navigator.clipboard
      .readText()
      .then((clipboardContent) => {
        // Split the clipboard content into rows (by newline characters)
        let rows = clipboardContent.split("\n");

        rows.forEach((row, rowIndex) => {
          // Split each row into cells (by tabs or other delimiter)
          let cells = row.split("\t");

          cells.forEach((cellValue, colIndex) => {
            this.mainGrid.mainCells[this.selectIndexY + rowIndex][
              this.selectIndexX + colIndex
            ].value = cellValue;
          });
        });
        this.inputBox();
        this.mainGrid.render();
      })
      .catch((err) => {
        console.error("Failed to read from clipboard:", err);
      });
  }

  // marching ant
  handleMarchingAnt() {
    if (this.dimension.selectedMain.length > 0) {
      this.isAnimated = true;
      window.cancelAnimationFrame(this.rafId);
      this.march();
    }
  }

  march() {
    this.dimension.dashOffset += 1;
    if (this.dimension.dashOffset > 16) {
      this.dimension.dashOffset = 0;
    }
    this.mainGrid.drawDottedRect();
    this.rafId = window.requestAnimationFrame(() => {
      this.mainGrid.render();
      this.march();
    });
  }
}
