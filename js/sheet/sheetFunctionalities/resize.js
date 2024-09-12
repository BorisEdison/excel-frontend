import { Dimension } from "./dimension.js";
import { MainGrid } from "./mainGrid.js";
import { TopGrid } from "./topGrid.js";
import { SideGrid } from "./sideGrid.js";
import { GridOperations } from "./gridOperations.js";

export class Resize {
  /**
   *
   * @param { Dimension } dimension
   * @param { MainGrid } mainGrid
   * @param { TopGrid } topGrid
   * @param { SideGrid } sideGrid
   * @param { GridOperations } gridOperations
   */
  constructor(dimension, mainGrid, topGrid, sideGrid, gridOperations) {
    /**
     * @type { Dimension }
     */
    this.dimension = dimension;
    /**
     * @type { MainGrid }
     */
    this.mainGrid = mainGrid;
    /**
     * @type {TopGrid}
     */
    this.topGrid = topGrid;
    /**
     * @type {SideGrid}
     */
    this.sideGrid = sideGrid;
    /**
     * @type { GridOperations }
     */
    this.gridOperations = gridOperations;

    /**
     * @type { Boolean }
     */
    this.isMouseDown = false; // Flag to track mouse state
    /**
     * @type { String }
     */
        this.mouseDownDirection; // string to keep track of resize direction
    /**
     * @type { number }
     */
    this.indX = -1; // Index of the column being resized
    /**
     * @type { number }
     */
        this.indY = -1; // Index of the row being resized

    this.addEventListeners();
  }

  /**
   * Adds event listeners for mouse events to the window and canvas elements.
   * @returns {void}
   */
  addEventListeners() {
    this.topGrid.topCanvas.addEventListener(
      "mousedown",
      this.mouseDown.bind(this, 'horizontal')
    );
    this.sideGrid.sideCanvas.addEventListener(
      "mousedown",
      this.mouseDown.bind(this, 'vertical')
    );
    window.addEventListener("mousemove", this.mouseMove.bind(this));
    window.addEventListener("mouseup", this.mouseUp.bind(this));
  }

  /**
   * Handles the mouse down event, indicating that the mouse button has been pressed.
   * @returns {void}
   */
  mouseDown(direction, event) {
    this.mouseDownDirection = direction;
    this.isMouseDown = true; // Start resizing
  }

  /**
   * Handles the mouse up event, finalizing the resizing operation and updating the grid.
   * @returns {void}
   */
  mouseUp(e) {
    this.mainGrid.render(); // Re-render main grid after resizing
    if (this.dimension.selectedMain.length >= 1) {
      this.gridOperations.inputBox(); // Show input box if any cells are selected
    }
    this.isMouseDown = false; // Stop resizing
  }

  /**
   * Handles the mouse move event, adjusting the grid layout and cursor based on resizing state.
   * @param {MouseEvent} event - The mouse event object containing details about the mouse movement.
   * @returns {void}
   */
  mouseMove(event) {
    if (this.isMouseDown) {
      // When resizing
      if (this.indX != -1 || this.indY != -1) {
        if(this.mouseDownDirection === 'horizontal'){
          this.topGrid.topCanvas.style.cursor = "col-resize"; // Change cursor to indicate resizing
          this.adjustExtra(this.indX, event.movementX, this.dimension.cWidthPrefixSum); // Adjust column width
          this.topGrid.render(); // Re-render top grid
          
        }
        else {
          this.sideGrid.sideCanvas.style.cursor = "row-resize"; // Change cursor to indicate resizing
          this.adjustExtra(this.indY, event.movementY, this.dimension.rHeightPrefixSum); // Adjust column width
          this.sideGrid.render();
        }
      }
    } else {
      // When not resizing
      this.updateResizeIndex(event);
      this.topGrid.topCanvas.style.cursor =
        this.indX === -1 ? "grab" : "col-resize"; // Change cursor based on whether resizing is possible
      
      this.sideGrid.sideCanvas.style.cursor =
        this.indY === -1 ? "grab" : "row-resize";
    }
  }

  /**
   * Updates the index of the column being resized based on the mouse event.
   * @param {MouseEvent} event - The mouse event object containing details about the mouse position.
   * @returns {void}
   */
  updateResizeIndex(event) {
    // Calculate the horizontal distance from the left of the grid
    const distanceX =
      event.clientX - this.topGrid.rect.left + this.dimension.shiftLeftX;
    const distanceY = 
      event.clientY - this.sideGrid.rect.top + this.dimension.shiftTopY;

    this.indX = this.findResizeIndex(distanceX, this.dimension.cWidthPrefixSum);
    this.indY = this.findResizeIndex(distanceY, this.dimension.rHeightPrefixSum)
  }

  /**
   * Finds the index of the column to resize based on the horizontal distance from the left of the grid.
   * @param {number} distance - The horizontal distance from the left of the grid where resizing is detected.
   * @returns {number} The index of the column to resize, or -1 if no column is found within the resize range.
   */
  findResizeIndex(distance, prefixSum) {
    if (distance <= 5) {
      return -1; // Return -1 if distance is too small
    }

    let left = 0;
    let right = prefixSum.length - 1;

    // Binary search to find the column index
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (
        distance >= prefixSum[mid] - 3 &&
        distance <= prefixSum[mid] + 3
      ) {
        return mid; // Found the column index
      } else if (prefixSum[mid] < distance) {
        left = mid + 1; // Search the right half
      } else {
        right = mid - 1; // Search the left half
      }
    }

    return -1; // Column not found
  }

  /**
   * Adjusts the width of columns starting from the given index by a specified amount.
   * @param {number} index - The index of the column from which to start adjusting the width.
   * @param {number} extra - The amount by which to adjust the column width.
   * @returns {void}
   */
  adjustExtra(index, extra, prefixSum) {
    for (let i = index; i < prefixSum.length; i++) {
      // Check if the new width is less than the minimum width (30 pixels)
      if (prefixSum[i] - prefixSum[i - 1] + extra < 10) {
        break; // Stop adjusting if the minimum width constraint is violated
      }

      prefixSum[i] += extra; // Adjust the width
    }
  }
}
