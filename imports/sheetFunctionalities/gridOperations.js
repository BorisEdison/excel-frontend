export class GridOperations {
  constructor(dimension, mainGrid, sideGrid, topGrid) {
    this.dimension = dimension;
    this.mainGrid = mainGrid;
    this.sideGrid = sideGrid;
    this.topGrid = topGrid;

    this.cellInput = document.querySelector(".input-box");

    // Initial state for selection
    this.selectIndexX = null;
    this.selectIndexY = null;
    this.selectedCell = null;

    this.xValStart = null;
    this.yValStart = null;
    this.xValEnd = null;
    this.yValEnd = null;

    this.dashOffset = 0;

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
    this.mainGrid.mainCanvas.addEventListener(
      "mousedown",
      this.handleMouseDown.bind(this)
    );
    this.mainGrid.mainCanvas.addEventListener(
      "mousemove",
      this.handleMouseMove.bind(this)
    );
    window.addEventListener("mouseup", this.handleMouseUp.bind(this));
    // Uncomment if you want to enable marching ants animation
    // document.addEventListener("keydown", (e) => {
    //   this.handleMarchingAnt(e);
    // });
  }

  // Handle mouse down event
  handleMouseDown(e) {
    this.isSelecting = true;
    this.isAnimated = false;

    this.selectIndexX = this.dimension.cellXIndex(
      this.dimension.shiftLeftX + e.offsetX
    );
    this.selectIndexY = this.dimension.cellYIndex(
      this.dimension.shiftTopY + e.offsetY
    );

    // Clear previous selections
    this.removeElements(this.dimension.selectedMain);
    this.removeElements(this.dimension.selectedTop);
    this.removeElements(this.dimension.selectedSide);

    // Reset selected arrays and values
    this.dimension.selectedMain = [];
    this.dimension.selectedTop = [];
    this.dimension.selectedSide = [];

    this.dimension.topValues = [];
    this.dimension.mainValues = [];
    this.dimension.sideValues = [];

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

    // Update values based on selection
    this.getValues(this.dimension.topValues, this.dimension.selectedTop);
    this.getValues(this.dimension.mainValues, this.dimension.selectedMain);
    this.getValues(this.dimension.sideValues, this.dimension.selectedSide);

    // Handle input box updates if applicable
    if (this.isInput) {
      this.updateText(
        this.selectedCell,
        this.cellInput.value,
        this.prevSelectIndexY
      );
      this.isInput = false;
    }

    this.inputBox();

    this.prevSelectIndexY = this.selectIndexY;
  }

  // Show the input box at the selected cell position
  inputBox() {
    this.selectedCell =
      this.mainGrid.mainCells[this.selectIndexY][this.selectIndexX];
    this.cellInput.value = this.selectedCell.value;
    this.cellInput.style.display = "block";
    this.cellInput.style.top =
      this.selectedCell.yVal + this.mainGrid.mainCanvas.offsetTop + "px";
    this.cellInput.style.left =
      this.selectedCell.xVal + this.mainGrid.mainCanvas.offsetLeft + "px";
    this.cellInput.style.height = this.selectedCell.height + "px";
    this.cellInput.style.width = this.selectedCell.width + "px";
    this.isInput = true;
  }

  // Update the cell value and redraw it
  async updateText(cell, value, prevSelectIndexY) {
    cell.value = value;
    console.log(prevSelectIndexY);
    cell.drawCell();

    try {
      const dataModel = {
        id : prevSelectIndexY + 1, // id start from 1
        email_id: this.mainGrid.mainCells[prevSelectIndexY][0].value,
        name: this.mainGrid.mainCells[prevSelectIndexY][1].value,
        country: this.mainGrid.mainCells[prevSelectIndexY][2].value,
        state: this.mainGrid.mainCells[prevSelectIndexY][3].value,
        city: this.mainGrid.mainCells[prevSelectIndexY][4].value,
        telephone_number: this.mainGrid.mainCells[prevSelectIndexY][5].value,
        address_line_1: this.mainGrid.mainCells[prevSelectIndexY][6].value,
        address_line_2: this.mainGrid.mainCells[prevSelectIndexY][7].value,
        date_of_birth: this.mainGrid.mainCells[prevSelectIndexY][8].value,
        gross_salary_FY2019_20:
          this.mainGrid.mainCells[prevSelectIndexY][9].value,
        gross_salary_FY2020_21:
          this.mainGrid.mainCells[prevSelectIndexY][10].value,
        gross_salary_FY2021_22:
          this.mainGrid.mainCells[prevSelectIndexY][11].value,
        gross_salary_FY2022_23:
          this.mainGrid.mainCells[prevSelectIndexY][12].value,
        gross_salary_FY2023_24:
          this.mainGrid.mainCells[prevSelectIndexY][13].value,
      };
      let response = await fetch(
        "https://localhost:7220/ExcelApi/UpdateRecord",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataModel),
        }
      );
    } catch (error) {
      console.error("error in updating the cell", error);
    }
  }

  // Handle mouse move event
  handleMouseMove(e) {
    if (this.isSelecting) {
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

      // Clear previous selections
      this.removeElements(this.dimension.selectedMain);
      this.removeElements(this.dimension.selectedSide);
      this.removeElements(this.dimension.selectedTop);

      // Reset selected arrays and values
      this.dimension.selectedMain = [];
      this.dimension.selectedSide = [];
      this.dimension.selectedTop = [];

      this.dimension.topValues = [];
      this.dimension.mainValues = [];
      this.dimension.sideValues = [];

      // Update selection based on mouse movement
      for (
        let i = Math.min(this.currentIndexY, this.selectIndexY);
        i <= Math.max(this.currentIndexY, this.selectIndexY);
        i++
      ) {
        this.addElements(
          this.sideGrid.sideCells[i],
          this.dimension.selectedSide
        );
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

      // Update the bounding box for the selection
      this.xValStart = this.dimension.selectedMain[0].xVal;
      this.yValStart = this.dimension.selectedMain[0].yVal;
      this.xValEnd =
        this.dimension.selectedMain[this.dimension.selectedMain.length - 1]
          .xVal +
        this.dimension.selectedMain[this.dimension.selectedMain.length - 1]
          .width;
      this.yValEnd =
        this.dimension.selectedMain[this.dimension.selectedMain.length - 1]
          .yVal +
        this.dimension.selectedMain[this.dimension.selectedMain.length - 1]
          .height;

      this.getValues(this.dimension.topValues, this.dimension.selectedTop);
      this.getValues(this.dimension.mainValues, this.dimension.selectedMain);
      this.getValues(this.dimension.sideValues, this.dimension.selectedSide);

      // Draw border around the selection
      this.mainGrid.mainCtx.strokeStyle = "rgba(0, 128, 0, 0.8)";
      this.mainGrid.mainCtx.strokeRect(
        this.xValStart,
        this.yValStart,
        this.xValEnd - this.xValStart,
        this.yValEnd - this.yValStart
      );
    }

    // Calculate and display statistics
    this.count = 0;
    this.sum = 0;
    if (this.dimension.selectedMain.length > 0) {
      this.min = Number.MAX_VALUE;
      this.max = -Number.MAX_VALUE;

      for (let i = 0; i < this.dimension.selectedMain.length; i++) {
        if (this.dimension.mainValues[i] === "") continue;
        let value = Number(this.dimension.mainValues[i]);

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

  // Collect values from the cells
  getValues(values, arr) {
    for (let i = 0; i < arr.length; i++) {
      values.push(arr[i].value);
    }
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

  // marching ant
  //   handleMarchingAnt(e) {
  //     if (e.key === "Control" && this.dimension.selectedMain.length > 1) {
  //       this.isAnimated = true;
  //         window.cancelAnimationFrame(this.rafId);
  //       this.march();
  //     }
  //   }

  //   march() {
  //     this.dashOffset++;
  //     if (this.dashOffset > 20) {
  //       this.dashOffset = 0;
  //     }
  //     this.drawDottedRect();
  //     this.rafId = window.requestAnimationFrame(() => {
  //       this.mainGrid.render();
  //       this.march();
  //     });
  //   }

  // drawDottedRect() {
  //   this.mainGrid.mainCtx.setLineDash([5, 5]);
  //   this.mainGrid.mainCtx.lineDashOffset = - this.dashOffset;
  //   this.mainGrid.mainCtx.strokeStyle = "rgba(0, 128, 0, 0.9)";
  //   this.mainGrid.mainCtx.lineWidth = 2;
  //   this.mainGrid.mainCtx.strokeRect(
  //     this.xValStart,
  //     this.yValStart,
  //     this.xValEnd - this.xValStart,
  //     this.yValEnd - this.yValStart
  //   );
  //   this.mainGrid.mainCtx.setLineDash([]);
  // }
}
