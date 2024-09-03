import { Dimension } from "./sheetFunctionalities/dimension.js";
import { MainGrid } from "./sheetFunctionalities/mainGrid.js";
import { TopGrid } from "./sheetFunctionalities/topGrid.js";
import { SideGrid } from "./sheetFunctionalities/sideGrid.js";
import { Scroll } from "./sheetFunctionalities/scroll.js";
import { GridOperations } from "./sheetFunctionalities/gridOperations.js";
import { Graph } from "./sheetFunctionalities/graph.js";
import { RibbonContainer } from "./sheetFunctionalities/ribbonContainer.js";
import { Resize } from "./sheetFunctionalities/resize.js";
import { FileOperations } from "./sheetFunctionalities/fileOperations.js";

export class Sheet {
  /**
   * @param {number} rows
   * @param {number} columns
   * @param {number} width
   * @param {number} height
   * @param {string} sheetNum
   */
  constructor(rows, columns, width, height, sheetNum) {
    // Store the sheet number
    /**
     * @type { string }
     */
    this.sheetNum = sheetNum;

    // Initialize the sheet UI
    this.createSheetElements();

    /**
     * @type {Dimension} - Initialize dimensions for the sheet
     */
    this.dimension = new Dimension(rows, columns, width, height);

    // Create the main, top, and side grids based on the dimensions
    /**
     * @type {MainGrid}
     */
    this.mainGrid = new MainGrid(this.dimension);
    /**
     * @type { TopGrid }
     */
    this.topGrid = new TopGrid(this.dimension);
    /**
     * @type { SideGrid }
     */
    this.sideGrid = new SideGrid(this.dimension);

    // Initialize other functionalities of the sheet
    /**
     * @type { RibbonContainer }
     */
    this.ribbonContainer = new RibbonContainer();
    /**
     * @type { Graph }
     */
    this.graph = new Graph(this.dimension, this.mainGrid);
    /**
     * @type { FileOperations }
     */
    this.fileOperations = new FileOperations(this.dimension, this.mainGrid);
    /**
     * @type { GridOperations }
     */
    this.gridOperations = new GridOperations(
      this.dimension,
      this.mainGrid,
      this.sideGrid,
      this.topGrid
    );
    /**
     * @type { Scroll }
     */
    this.scroll = new Scroll(
      this.dimension,
      this.mainGrid,
      this.sideGrid,
      this.topGrid,
      this.gridOperations,
      this.fileOperations
    );
    /**
     * @type { Resize }
     */
    this.resize = new Resize(
      this.dimension,
      this.mainGrid,
      this.topGrid,
      this.sideGrid,
      this.gridOperations
    );

    // Set up the ResizeObserver
    this.resizeObserver();
  }

  resizeObserver() {
    this.resizeObserver = new ResizeObserver(this.handleResize.bind(this));
    this.resizeObserver.observe(this.mainGrid.mainCanvas);
  }

  handleResize() {
    console.log("hello")
    this.scallingCanvas();
  }

  scallingCanvas() {
    // tells the browser how many of the screen's actual pixels should be used to draw a single CSS pixel
    this.dimension.scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.

    //scalling top canvas
    this.topGrid.setCanvasDimension()

    //scalling side canvas
    this.sideGrid.setCanvasDimension()

    //scalling main canvas
    this.mainGrid.setCanvasDimension()

    this.mainGrid.render();
    this.topGrid.render();
    this.sideGrid.render();
  }

  createSheetElements() {
    // Create the corner canvas element (top-left corner of the grid)
    const cornerCanvasElement = document.createElement("canvas");
    cornerCanvasElement.setAttribute("width", "60");
    cornerCanvasElement.setAttribute("height", "20");

    // Create the top canvas element for the top grid (headers)
    const topCanvasElement = document.createElement("canvas");
    topCanvasElement.setAttribute("id", "top-canvas");

    // Row 1 contains the corner and top canvas elements
    const row1Element = document.createElement("div");
    row1Element.setAttribute("id", "row-1");
    row1Element.appendChild(cornerCanvasElement);
    row1Element.appendChild(topCanvasElement);

    // Create the side canvas element for the side grid (row numbers)
    const sideCanvasElement = document.createElement("canvas");
    sideCanvasElement.setAttribute("id", "side-canvas");

    // Create vertical scrollbar elements
    const sliderYElement = document.createElement("div");
    sliderYElement.setAttribute("id", "slider-y");
    const trackYElement = document.createElement("div");
    trackYElement.setAttribute("id", "track-y");
    trackYElement.appendChild(sliderYElement);

    // Create horizontal scrollbar elements
    const sliderXElement = document.createElement("div");
    sliderXElement.setAttribute("id", "slider-x");
    const trackXElement = document.createElement("div");
    trackXElement.setAttribute("id", "track-x");
    trackXElement.appendChild(sliderXElement);

    // Create input field element for text input (for entering formulas or cell content)
    const inputElement = document.createElement("input");
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("class", "text");
    inputElement.setAttribute("class", "input-box");

    // Create the main canvas element where the main grid is rendered
    const mainCanvasElement = document.createElement("canvas");
    mainCanvasElement.setAttribute("id", "main-canvas");

    // Create the sheet element to hold the input field, main grid, and scrollbars
    const mainSheetElement = document.createElement("div");
    mainSheetElement.setAttribute("class", "sheet");
    mainSheetElement.appendChild(inputElement);
    mainSheetElement.appendChild(mainCanvasElement);
    mainSheetElement.appendChild(trackYElement);
    mainSheetElement.appendChild(trackXElement);

    // Row 2 contains the side canvas and the main sheet area
    const row2Element = document.createElement("div");
    row2Element.setAttribute("id", "row-2");
    row2Element.appendChild(sideCanvasElement);
    row2Element.appendChild(mainSheetElement);

    // Create the main container for the spreadsheet elements
    this.spreadsheetElement = document.createElement("div");
    this.spreadsheetElement.setAttribute(
      "class",
      `${this.sheetNum} spreadsheet`
    );

    // Append both rows to the spreadsheet element
    this.spreadsheetElement.appendChild(row1Element);
    this.spreadsheetElement.appendChild(row2Element);

    this.excelElement = document.querySelector("#excel");

    // Clear the current content of the excel element
    this.excelElement.textContent = "";
    this.excelElement.appendChild(this.spreadsheetElement);
  }
}
