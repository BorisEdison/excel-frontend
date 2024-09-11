import { CellStruct } from "./cell.js";
import { Dimension } from "./dimension.js";

export class TopGrid {
  /**
   * TopGrid constructor
   * @param {Dimension} dimension - Dimension object containing grid properties.
   */
  constructor(dimension) {
    /**
     * @param { Dimension } -  Store dimension reference for grid properties
     */
    this.dimension = dimension;
    /**
     * @type { Array<CellStruct> } - Array to store top grid cells
     */
    this.topCells = [];
    /**
     * @type { HTMLElement } - Top canvas element for rendering column headers
     */
    this.topCanvas;

    /**
     * @type { CanvasRenderingContext2D } - 2D drawing context of the top canvas
     */
    this.topCtx;

    /**
     * @type { DOMRect } -  Rectangular area of the canvas for mouse interaction
     */
    this.rect;

    this.init(); // Initialize the top grid
  }

  /**
   * Initialize the top grid, setup the canvas, and render cells.
   */
  init() {
    // Set up top canvas element and its context
    this.topCanvas = document.getElementById("top-canvas");
    this.topCtx = this.topCanvas.getContext("2d"); // Get 2D context for drawing

    this.setCanvasDimension()

    this.rect = this.topCanvas.getBoundingClientRect(); // Get canvas position and size

    // Generate initial cells for the top grid
    this.getCells();
    this.render(); // Render the top grid cells
  }

  /**
   * set canvas height and width as per device pixel ratio
   * @returns { void }
   */
  setCanvasDimension() {
    this.topCanvas.width = Math.floor(this.topCanvas.clientWidth * this.dimension.scale)
    this.topCanvas.height = Math.floor(this.topCanvas.clientHeight * this.dimension.scale)
    this.topCtx.scale(this.dimension.scale, this.dimension.scale)
  }

  /**
   * Generate cells for the top grid based on column dimensions.
   * @returns { void }
   */
  getCells() {
    for (let j = 0; j < this.dimension.columns; j++) {
      // Create a new cell for each column header
      const cell = new CellStruct(
        1 + j * this.dimension.width + 0.5,
        1,
        this.dimension.width,
        this.dimension.height,
        `${this.dimension.getColumnName(j + 1)}`, // Column header label (A, B, C, etc.)
        false, // isClicked state
        0, // isSelected state
        this.topCtx // Canvas context
      );
      this.topCells.push(cell); // Add cell to the topCells array
    }
  }

  /**
   * Render top grid cells on the canvas.
   * @returns { void }
   */
  render() {
    // Clear the top canvas before rendering
    this.topCtx.clearRect(0, 0, this.topCanvas.width, this.topCanvas.height);
    
    // Render cells within the currently visible region
    for (let i = this.dimension.leftIndex; i < this.dimension.rightIndex; i++) {
      // Update cell positions and dimensions based on the current shift
      this.topCells[i].xVal = this.dimension.cWidthPrefixSum[i] - this.dimension.shiftLeftX + 0.5;
      this.topCells[i].width = this.dimension.cWidthPrefixSum[i + 1] - this.dimension.cWidthPrefixSum[i];
      this.topCells[i].drawCell(); // Draw the cell on the canvas
    }

    if (this.dimension.selectedMain.length > 0) {
      this.selectionBoundary()
    }
  }

  selectionBoundary() {
    // Update the bounding box for the selection
    this.xValStart = this.dimension.selectedTop[0].xVal;
    this.yValStart = this.dimension.selectedTop[0].yVal + this.dimension.selectedTop[0].height - 2;
    this.xValEnd = this.dimension.selectedTop[this.dimension.selectedTop.length - 1].xVal + this.dimension.selectedTop[this.dimension.selectedTop.length - 1].width;
    this.yValEnd = this.dimension.selectedTop[0].yVal + this.dimension.selectedTop[0].height - 2;

    // Draw border around the selection
    this.topCtx.lineWidth = 2;
    this.topCtx.strokeStyle = "rgba(0, 128, 0, 0.8)";
    this.topCtx.strokeRect(this.xValStart, this.yValStart, this.xValEnd - this.xValStart, this.yValEnd - this.yValStart);
    this.topCtx.lineWidth = 1;
  }

  /**
   * Add cells to the top grid.
   * @param {number} num - Number of cells to add.
   * @returns { void }
   */
  addCells(num) {
    const currentColumnLength = this.topCells.length; // Current number of columns in the top grid
    for (let i = 0; i < num; i++) {
      // Create a new cell and add it to the top grid
      const cell = new CellStruct(
        1,
        1,
        this.dimension.width,
        this.dimension.height,
        `${this.dimension.getColumnName(currentColumnLength + i + 1)}`, // New column header label
        false, // isClicked state
        0, // isSelected state
        this.topCtx // Canvas context
      );
      this.topCells.push(cell); // Add cell to the topCells array
    }
  }
}
