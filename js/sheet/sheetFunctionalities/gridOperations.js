export class GridOperations {
  constructor(dimension, mainGrid, sideGrid, topGrid, fileOperations, ) {
    this.dimension = dimension;
    this.mainGrid = mainGrid;
    this.sideGrid = sideGrid;
    this.topGrid = topGrid;
    this.fileOperations = fileOperations;

    this.cellInput = document.querySelector(".input-box");
    this.findReplaceBtn = document.querySelector(".find-replace-btn")

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
  window.addEventListener(
    "mouseup",
    this.handleMouseUp.bind(this)
  );
  window.addEventListener(
    "touchend",
    this.handleMouseUp.bind(this)
  );

    // Uncomment if you want to enable marching ants animation
    // document.addEventListener("keydown", (e) => {
    //   this.handleMarchingAnt(e);
    // });
    this.findReplaceBtn.addEventListener(
      "click",
      this.findAndReplace.bind(this)
    )
  }

  async findAndReplace() {
    const findText = prompt("Enter the value you want to change");
    const replaceText = findText && prompt("Enter the updated value");
  
    // If both values are valid
    if (findText && replaceText) {
      
      await this.fileOperations.findAndReplace(findText,replaceText)

      for(let i = 0; i < this.mainGrid.mainCells.length ; i++){
        for(let j = 0; j < this.mainGrid.mainCells[0].length; j++){
          if(this.mainGrid.mainCells[i][j].value == findText){
            console.log("hello")
            this.mainGrid.mainCells[i][j].value = replaceText
          }
        }
      }
      
      this.mainGrid.render()

    }
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
    // return if value is not changed
    if(cell.value == value) {
      return ;
    }

    cell.value = value;
    cell.drawCell();
    await this.fileOperations.updateCell(prevSelectIndexY);
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
