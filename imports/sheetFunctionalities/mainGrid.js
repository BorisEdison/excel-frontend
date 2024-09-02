import { CellStruct } from "./cell.js";
import { Dimension } from "./dimension.js";

export class MainGrid {
    /**
     * MainGrid constructor
     * @param {Dimension} dimension - Dimension object containing grid properties.
     */
    constructor(dimension) {
        /**
         * @type { Dimension }
         */
        this.dimension = dimension; // Store dimension reference for grid properties
        /** 
         * @type { HTMLElement }
         */
        this.mainCanvas; // Main canvas element
        /**
         * @type { CanvasRenderingContext2D }
         */
        this.mainCtx; // 2D drawing context of the canvas
        /**
         * @type { Array<CellStruct> }
         */
        this.mainCells = []; // Array to store cells of the grid
        /**
         * @type { DOMRect }
         */
        this.rect; // Rectangular area of the canvas for mouse interaction

        this.init(); // Initialize the grid
    }

    /**
     * Initialize the grid, setup the canvas, and render cells.
     */
    init() {
        // Set up main canvas element and its context
        this.mainCanvas = document.getElementById("main-canvas");
        this.mainCtx = this.mainCanvas.getContext("2d"); // Get 2D context for drawing

        const scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.

        //scalling main canvas
        this.mainCanvas.width = Math.floor(this.mainCanvas.clientWidth * scale)
        this.mainCanvas.height = Math.floor(this.mainCanvas.clientHeight * scale)
        this.mainCtx.scale(scale, scale)

        this.rect = this.mainCanvas.getBoundingClientRect(); // Get canvas position and size

        // Initialize shifting values for grid rendering
        this.dimension.shiftTopY = 0;
        this.dimension.shiftBottomY = this.mainCanvas.height;
        this.dimension.shiftLeftX = 0;
        this.dimension.shiftRightX = this.mainCanvas.width;

        // Generate initial cells
        this.getCells();

        // Set initial rendering indexes based on canvas size
        this.dimension.topIndex = 0;
        this.dimension.bottomIndex = this.dimension.cellYIndex(this.dimension.shiftBottomY);
        this.dimension.leftIndex = 0;
        this.dimension.rightIndex = this.dimension.cellXIndex(this.dimension.shiftRightX);

        // Render cells on canvas
        this.render();
    }

    /**
     * Generate cells based on grid dimensions.
     * @returns { void }
     */
    getCells() {
        for (let i = 0; i < this.dimension.rows; i++) {
            // Calculate prefix sum for each row to manage dynamic row heights
            this.dimension.rHeightPrefixSum.push(this.dimension.rHeightPrefixSum[i] + this.dimension.height);
            this.mainCells[i] = []; // Initialize each row in mainCells array
            for (let j = 0; j < this.dimension.columns; j++) {
                if (i === 0) {
                    // Calculate prefix sum for each column to manage dynamic column widths
                    this.dimension.cWidthPrefixSum.push(this.dimension.cWidthPrefixSum[j] + this.dimension.width);
                }
                // Create a new cell and add it to the mainCells array
                const cell = new CellStruct(
                    1 + j * this.dimension.width + 0.5,
                    1 + i * this.dimension.height + 0.5,
                    this.dimension.width,
                    this.dimension.height,
                    " ", // Cell value
                    false, // isClicked state
                    0, // isSelected state
                    this.mainCtx // Canvas context
                );
                this.mainCells[i].push(cell); // Add cell to the row
            }
        }
    }

    /**
     * Render cells on the canvas.
     * @returns { void }
     */
    render() {
        this.mainCtx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height); // Clear the canvas
        // Render cells within the currently visible region
        for (let i = this.dimension.topIndex; i < this.dimension.bottomIndex; i++) {
            for (let j = this.dimension.leftIndex; j < this.dimension.rightIndex; j++) {
                // Update cell positions based on the current shift
                this.mainCells[i][j].yVal = this.dimension.rHeightPrefixSum[i] - this.dimension.shiftTopY + 0.5;
                this.mainCells[i][j].xVal = this.dimension.cWidthPrefixSum[j] - this.dimension.shiftLeftX + 0.5;
                // Update cell dimensions
                this.mainCells[i][j].width = this.dimension.cWidthPrefixSum[j + 1] - this.dimension.cWidthPrefixSum[j];
                this.mainCells[i][j].height = this.dimension.rHeightPrefixSum[i + 1] - this.dimension.rHeightPrefixSum[i];
                this.mainCells[i][j].drawCell(); // Draw the cell on the canvas
            }
        }
    }

    /**
     * Add rows to the grid.
     * @param {number} num - Number of rows to add.
     * @returns { void }
     */
    addRows(num) {
        const currentRowLength = this.dimension.rHeightPrefixSum.length; // Current number of rows
        const currentColumnLength = this.dimension.cWidthPrefixSum.length; // Current number of columns

        for (let i = 0; i < num; i++) {
            // Add height for the new row in the prefix sum array
            this.dimension.rHeightPrefixSum.push(this.dimension.rHeightPrefixSum[currentRowLength + i - 1] + this.dimension.height);
            this.mainCells[currentRowLength + i - 1] = []; // Initialize new row in mainCells array

            for (let j = 0; j < currentColumnLength - 1; j++) {
                // Create a new cell and add it to the new row
                const cell = new CellStruct(1, 1, this.dimension.width, this.dimension.height, "", false, 0, this.mainCtx);
                this.mainCells[currentRowLength + i - 1].push(cell); // Add cell to the new row
            }
        }
    }

    /**
     * Add columns to the grid.
     * @param {number} num - Number of columns to add.
     * @returns { void }
     */
    addColumns(num) {
        const currentRowLength = this.dimension.rHeightPrefixSum.length; // Current number of rows
        const currentColumnLength = this.dimension.cWidthPrefixSum.length; // Current number of columns

        for (let i = 0; i < currentRowLength - 1; i++) {
            for (let j = 0; j < num; j++) {
                if (i === 0) {
                    // Add width for the new column in the prefix sum array
                    this.dimension.cWidthPrefixSum.push(this.dimension.cWidthPrefixSum[currentColumnLength + j - 1] + this.dimension.width);
                }
                // Create a new cell and add it to the existing row
                const cell = new CellStruct(1, 1, this.dimension.width, this.dimension.height, "", false, 0, this.mainCtx);
                this.mainCells[i].push(cell); // Add cell to the row
            }
        }
    }
}
