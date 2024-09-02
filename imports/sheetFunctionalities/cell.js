export class CellStruct {
  /**
   * 
   * @param { Number } xVal 
   * @param { Number } yVal 
   * @param { Number } width 
   * @param { Number } height 
   * @param { Number } value 
   * @param { Boolean } isClicked 
   * @param { Boolean } isSelected 
   * @param { CanvasRenderingContext2D } ctx 
   */
  constructor(xVal, yVal, width, height, value, isClicked, isSelected, ctx) {
    // Initialize cell properties
    /**
     * @type { number }
     */
    this.xVal = xVal; // X-coordinate of the cell
    /**
     * @type { number }
     */
    this.yVal = yVal; // Y-coordinate of the cell
    /**
     * @type { number }
     */
    this.width = width; // Width of the cell
    /**
     * @type { number }
     */
    this.height = height; // Height of the cell
    /**
     *  @type { number }
     */
    this.value = value; // Value to display in the cell
    /**
     * @type { boolean }
     */
    this.isClicked = isClicked; // Boolean to track if the cell is clicked
    /**
     *  @type { Boolean }
     */
    this.isSelected = isSelected; // Boolean to track if the cell is selected
    /**
     * @type { CanvasRenderingContext2D }
     */
    this.ctx = ctx; // Canvas rendering context to draw on
  }

  /**
   * Draws the cell on the canvas.
   * Clears the previous content, draws the border, and fills the text.
   */
  drawCell() {
    // Clear the area of the current cell
    this.ctx.clearRect(this.xVal, this.yVal, this.width, this.height);

    // Set the stroke style and draw the cell border
    this.ctx.strokeStyle = "#E0E0E0";
    this.ctx.strokeRect(this.xVal, this.yVal, this.width, this.height);

    // Set the font style and fill color for the cell value
    this.ctx.font = "14px serif";
    this.ctx.fillStyle = "#000"; // Text color

    // Draw the text in the center of the cell
    this.ctx.fillText(
      this.value,
      this.xVal + 12, // Adjust X position to add padding
      this.yVal + this.height / 1.2, // Center text vertically
      this.width // Maximum width for the text
    );

    // If the cell is selected, draw the selection highlight
    if (this.isSelected) {
      this.selectCell();
    }
  }

  /**
   * Highlights the cell if it's selected.
   * If not selected, redraws the cell to remove any previous selection.
   */
  selectCell() {
    if (this.isSelected) {
      // Draw a semi-transparent overlay to indicate selection
      this.ctx.fillStyle = "rgba(19, 126, 67, 0.1)"; // Light green highlight
      this.ctx.fillRect(this.xVal, this.yVal, this.width, this.height);
    } else {
      // Redraw the cell if not selected (removes the selection overlay)
      this.drawCell();
    }
  }
}
