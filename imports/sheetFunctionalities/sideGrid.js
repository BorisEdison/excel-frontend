import { CellStruct } from "./cell.js";
import { Dimension } from "./dimension.js";

export class SideGrid {
  /**
   * SideGrid constructor
   * @param { Dimension } dimension - Dimension object containing grid properties.
   */
  constructor(dimension) {
    /**
     * @type { Dimension } - Store dimension reference for grid properties
     */
    this.dimension = dimension;
    /**
     * @type { Array<CellStruct> }  - Array to store side grid cells
     */
    this.sideCells = [];
    /**
     * @type { HTMLElement } - Side canvas element for rendering row headers
     */
    this.sideCanvas;
    /**
     * @type { CanvasRenderingContext2D } - 2D drawing context of the side canvas
     */
    this.sideCtx;
    /**
     * @type {DOMRect} - Rectangular area of the canvas for mouse interaction
     */
    this.rect;

    this.init(); // Initialize the side grid
  }

  /**
   * Initialize the side grid, set up the canvas, and render cells.
   */
  init() {
    // Set up side canvas element and its context
    this.sideCanvas = document.getElementById("side-canvas");
    this.sideCtx = this.sideCanvas.getContext("2d"); // Get 2D context for drawing
    
    const scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
    this.sideCanvas.width = Math.floor(this.sideCanvas.clientWidth * scale)
    this.sideCanvas.height = Math.floor(this.sideCanvas.clientHeight * scale)
    this.sideCtx.scale(scale, scale)

    this.rect = this.sideCanvas.getBoundingClientRect(); // Get canvas position and size

    // Generate initial cells for the side grid
    this.getCells();
    this.render(); // Render the side grid cells
  }

  /**
   * Generate cells for the side grid based on row dimensions.
   * @returns { void }
   */
  getCells() {
    for (let i = 0; i < this.dimension.rows; i++) {
      // Create a new cell for each row header
      const cell = new CellStruct(
        1,
        1 + i * this.dimension.height + 0.5,
        this.dimension.width,
        this.dimension.height,
        `${i + 1}`, // Row header label (1, 2, 3, etc.)
        false, // isClicked state
        0, // isSelected state
        this.sideCtx // Canvas context
      );
      this.sideCells.push(cell); // Add cell to the sideCells array
    }
  }

  /**
   * Render side grid cells on the canvas.
   * @returns { void }
   */
  render() {
    // Clear the side canvas before rendering
    this.sideCtx.clearRect(0, 0, this.sideCanvas.width, this.sideCanvas.height);

    // Render cells within the currently visible region
    for (let i = this.dimension.topIndex; i < this.dimension.bottomIndex; i++) {
      // Update cell positions and dimensions based on the current shift
      this.sideCells[i].yVal = this.dimension.rHeightPrefixSum[i] - this.dimension.shiftTopY + 0.5;
      this.sideCells[i].height = this.dimension.rHeightPrefixSum[i + 1] - this.dimension.rHeightPrefixSum[i];
      this.sideCells[i].drawCell(); // Draw the cell on the canvas
    }
  }

  /**
   * Add cells to the side grid.
   * @param {number} num - Number of cells to add.
   * @returns { void }
   */
  addCells(num) {
    const currentRowLength = this.sideCells.length; // Current number of rows in the side grid
    for (let i = 0; i < num; i++) {
      // Create a new cell and add it to the side grid
      const cell = new CellStruct(
        1,
        1 + (currentRowLength + i) * this.dimension.height + 0.5,
        this.dimension.width,
        this.dimension.height,
        `${currentRowLength + i + 1}`, // New row header label
        false, // isClicked state
        0, // isSelected state
        this.sideCtx // Canvas context
      );
      this.sideCells.push(cell); // Add cell to the sideCells array
    }
  }
}
