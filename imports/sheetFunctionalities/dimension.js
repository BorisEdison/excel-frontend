import { CellStruct } from "./cell";

export class Dimension {
  /**
   *
   * @param { number } rows
   * @param { number } columns
   * @param { number } width
   * @param { number } height
   */
  constructor(rows, columns, width, height) {
    // Initialize dimensions of the grid
    /**
     * @type { number }
     */
    this.rows = rows; // Number of rows.
    /**
     * @type { number }
     */
    this.columns = columns; // Number of columns
    /**
     * @type { number }
     */
    this.width = width; // Width of each cell
    /**
     * @type { number }
     */
    this.height = height; // Height of each cell

    // Initialize arrays to keep track of selected cells
    /**
     * @type { Array <CellStruct> }
     */
    this.selectedMain = []; // Selected cells in the main grid
    /**
     * @type { Array <CellStruct> }
     */
    this.selectedTop = []; // Selected cells in the top grid
    /**
     * @type { Array <CellStruct> }
     */
    this.selectedSide = []; // Selected cells in the side grid

    // Initialize arrays to store cell values
    /**
     * @type { Array<String> }
     */
    this.topValues = []; // Values for the top grid (column headers)
    /**
     * @type { Array<any> }
     */
    this.mainValues = []; // Values for the main grid (spreadsheet data)
    /**
     * @type { Array<Number> }
     */
    this.sideValues = []; // Values for the side grid (row headers)

    // Prefix sum arrays for efficient range calculations
    /**
     * @type { Array<number> }
     */
    this.cWidthPrefixSum = [0]; // Prefix sum for column widths
    /**
     * @type { Array<number> }
     */
    this.rHeightPrefixSum = [0]; // Prefix sum for row heights

    // Shift properties for scrolling and viewport management
    /**
     * @type { number }
     */
    this.shiftTop = 0; // Top shift for vertical scrolling
    /**
     * @type { number }
     */
    this.shiftBottom; // Bottom shift (calculated later)
    /**
     * @type { number }
     */
    this.shiftLeft = 0; // Left shift for horizontal scrolling
    /**
     * @type { number }
     */
    this.shiftRight; // Right shift (calculated later)

    // Index properties to keep track of visible cells
    /**
     * @type { number }
     */
    this.topIndex; // Index of the top-most visible row
    /**
     * @type { number }
     */
    this.bottomIndex; // Index of the bottom-most visible row
    /**
     * @type { number }
     */
    this.leftIndex; // Index of the left-most visible column
    /**
     * @type { number }
     */
    this.rightIndex; // Index of the right-most visible column
  }

  /**
   * Determines the column index for a given X coordinate.
   * Uses prefix sums to find the index efficiently.
   * @param {number} num - X coordinate
   * @returns {number} - Column index
   */
  cellXIndex(num) {
    for (let i = 1; i < this.cWidthPrefixSum.length; i++) {
      if (num >= this.cWidthPrefixSum[i - 1] && num < this.cWidthPrefixSum[i]) {
        return i - 1;
      }
    }
    return this.cWidthPrefixSum.length - 1; // Return last column index if out of range
  }

  /**
   * Determines the row index for a given Y coordinate.
   * Uses prefix sums to find the index efficiently.
   * @param {number} num - Y coordinate
   * @returns {number} - Row index
   */
  cellYIndex(num) {
    for (let i = 1; i < this.rHeightPrefixSum.length; i++) {
      if (
        num >= this.rHeightPrefixSum[i - 1] &&
        num < this.rHeightPrefixSum[i]
      ) {
        return i - 1;
      }
    }
    return this.rHeightPrefixSum.length - 1; // Return last row index if out of range
  }

  /**
   * Converts a column number to its corresponding Excel-like column name (e.g., 1 -> 'A').
   * @param {number} num - Column number
   * @returns {string} - Column name
   */
  getColumnName(num) {
    let s = "",
      t;
    while (num > 0) {
      t = (num - 1) % 26; // Calculate the character index
      s = String.fromCharCode(65 + t) + s; // Convert to a letter and prepend to the result
      num = ((num - t) / 26) | 0; // Move to the next letter in sequence
    }
    return s || undefined; // Return the column name or undefined if not valid
  }

  /**
   * Converts a column name to its corresponding Excel-like column number (e.g., 'A' -> 1).
   * @param {string} val - Column name
   * @returns {number} - Column number
   */
  getColumnNumber(val) {
    const base = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = 0;

    // Loop through each character of the column name
    for (let i = 0, j = val.length - 1; i < val.length; i += 1, j -= 1) {
      // Calculate the column number by considering positional value
      result += Math.pow(base.length, j) * (base.indexOf(val[i]) + 1);
    }

    return result; // Return the column number
  }
}
