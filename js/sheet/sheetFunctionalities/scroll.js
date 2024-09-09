import { Dimension } from "./dimension.js";
import { MainGrid } from "./mainGrid.js";
import { SideGrid } from "./sideGrid.js";
import { TopGrid } from "./topGrid.js";
import { GridOperations } from "./gridOperations.js";
import { FileOperations } from "./fileOperations.js";

export class Scroll {
  constructor(
    dimension,
    mainGrid,
    sideGrid,
    topGrid,
    gridOperations,
    fileOperations
  ) {
    // Initialize properties
    /**
     * @type { Dimension }
     */
    this.dimension = dimension;
    /**
     * @type { MainGrid }
     */
    this.mainGrid = mainGrid;
    /**
     * @type { SideGrid }
     */
    this.sideGrid = sideGrid;
    /**
     * @type { TopGrid }
     */
    this.topGrid = topGrid;
    /**
     * @type { GridOperations }
     */
    this.gridOperations = gridOperations;
    /**
     * @type { FileOperations }
     */
    this.fileOperations = fileOperations;

    // Container dimensions
    /**
     * @type { number }
     */
    this.containerHeight = 0;
    /**
     * @type { number }
     */
    this.containerWidth = 0;

    // Vertical scroll properties
    /**
     * @type { HTMLElement }
     */
    this.sliderY = null;
    /**
     * @type { HTMLElement }
     */
    this.trackY = null;
    /**
     * @type { number }
     */
    this.sliderPercentageY = 0;
    /**
     * @type { number }
     */
    this.yTravelled = 0;
    /**
     * @type { number }
     */
    this.mouseDownYOffset = 0;
    /**
     * @type { Boolean }
     */
    this.isScrollY = false;

    // Horizontal scroll properties
    /**
     * @type { HTMLElement }
     */
    this.sliderX = null;
    /**
     * @type { HTMLElement }
     */
    this.trackX = null;
    /**
     * @type { number }
     */
    this.sliderPercentageX = 0;
    /**
     * @type { number }
     */
    this.xTravelled = 0;
    /**
     * @type { number }
     */
    this.mouseDownXOffset = 0;
    /**
     * @type { boolean }
     */
    this.isScrollX = false;

    // Initialize scroll
    this.init();
  }

  init() {
    // Calculate the total height and width of the scrollable container
    this.containerHeight =
      this.dimension.rHeightPrefixSum[
        this.dimension.rHeightPrefixSum.length - 1
      ];
    this.containerWidth =
      this.dimension.cWidthPrefixSum[this.dimension.cWidthPrefixSum.length - 1];

    // Get references to slider and track elements
    this.sliderY = document.getElementById("slider-y");
    this.trackY = document.getElementById("track-y");
    this.sliderX = document.getElementById("slider-x");
    this.trackX = document.getElementById("track-x");

    // Initialize scroll properties
    this.sliderPercentageY = null;
    this.yTravelled = 0;
    this.isScrollY = false;
    this.sliderPercentageX = null;
    this.xTravelled = 0;
    this.isScrollX = false;

    // Add event listeners
    this.eventListeners();
  }

  eventListeners() {
    // Bind mouse and touch events for vertical scrolling
    this.sliderY.addEventListener(
      "mousedown",
      this.handleMouseDownY.bind(this)
    );
    this.sliderY.addEventListener(
      "touchstart",
      this.handleMouseDownY.bind(this)
    );

    // Bind mouse and touch events for horizontal scrolling
    this.sliderX.addEventListener(
      "mousedown",
      this.handleMouseDownX.bind(this)  
    );
    this.sliderX.addEventListener(
      "touchstart",
      this.handleMouseDownX.bind(this)
    );

    // Bind global mouse and touch events
    document.addEventListener("mouseup", this.handleMouseUp.bind(this));
    document.addEventListener("touchend", this.handleMouseUp.bind(this));

    document.addEventListener("mousemove", this.handleMouseMove.bind(this));
    document.addEventListener("touchmove", this.handleMouseMove.bind(this));
}


  /**
   * Handles the mouse down event for starting vertical scrolling.
   * @param {MouseEvent} e - The mouse event object.
   * @returns {void}
   */
  handleMouseDownY(e) {
    // Start vertical scrolling
    this.isScrollY = true;
    this.mouseDownYOffset =
      e.pageY -
      this.getAttInt(this.trackY, "top") -
      this.getAttInt(this.sliderY, "top");
  }

  /**
   * Handles the mouse down event for starting horizontal scrolling.
   * @param {MouseEvent} e - The mouse event object.
   * @returns {void}
   */
  handleMouseDownX(e) {
    // Start horizontal scrolling
    this.isScrollX = true;
    this.mouseDownXOffset =
      e.pageX -
      this.getAttInt(this.trackX, "left") -
      this.getAttInt(this.sliderX, "left");
  }

  /**
   * Handles the mouse move event for scrolling.
   * @param {MouseEvent} e - The mouse event object.
   * @returns {void}
   */
  handleMouseMove(e) {
    if (this.isScrollY) {
      this.handleVerticalScroll(e);
    } else if (this.isScrollX) {
      this.handleHorizontalScroll(e);
    }
  }

  /**
   * Handles vertical scrolling based on mouse movement.
   * @param {MouseEvent} e - The mouse event object.
   * @returns {void}
   */
  handleVerticalScroll(e) {
    this.yTravelled = e.pageY - this.getAttInt(this.trackY, "top") - this.mouseDownYOffset;
    this.maxYTravel =this.getAttInt(this.trackY, "height") -this.getAttInt(this.sliderY, "height");

    if (this.yTravelled < 0) {
      // Handle scrolling above the top of the scrollbar
      this.yTravelled = 0;
      this.sliderY.style.top = "0px";
      this.updateVerticalScroll(0);
    } else if (this.yTravelled > 0.8 * this.maxYTravel) {
      // Handle scrolling beyond 80% of the scrollbar
      this.handleScrollBeyondBottom();
    } else {
      // Update slider position and container shift
      this.sliderY.style.top = this.yTravelled + "px";
      this.sliderPercentageY = (this.yTravelled / this.maxYTravel) * 100;
      this.updateVerticalScroll(this.sliderPercentageY);
    }
  }

  /**
   * Updates the vertical scroll position based on the given percentage.
   * @param {number} percentage - The percentage of the scrollbar's movement, used to calculate the new vertical scroll position.
   * @returns {void}
  */
 updateVerticalScroll(percentage) {
  this.dimension.shiftTopY = (percentage * (this.containerHeight - this.mainGrid.mainCanvas.height)) / 100;
  this.dimension.shiftBottomY = this.dimension.shiftTopY + this.mainGrid.mainCanvas.height;

  this.dimension.topIndex = this.dimension.cellYIndex(this.dimension.shiftTopY);
  this.dimension.bottomIndex = this.dimension.cellYIndex(this.dimension.shiftBottomY);
  
  this.mainGrid.render();
  this.sideGrid.render();
  this.gridOperations.inputBox();
 }
  
  /**
   * Handles the scenario when scrolling goes beyond 80% of the scrollbar.
   * @returns {void}
  */
 handleScrollBeyondBottom() {
   this.mainGrid.addRows(500);
   this.sideGrid.addCells(500);
   this.fileOperations.getFile(this.dimension.rHeightPrefixSum.length - 21, this.dimension.rHeightPrefixSum.length - 1);
   this.containerHeight = this.dimension.rHeightPrefixSum[this.dimension.rHeightPrefixSum.length - 1];
   
   if (this.getAttInt(this.sliderY, "height") > 40) {
     const newSliderYHeight = this.getAttInt(this.sliderY, "height") * 0.8;
     this.sliderY.style.height = newSliderYHeight + "px";
     this.maxYTravel =this.getAttInt(this.trackY, "height") - newSliderYHeight;
   }    

    this.sliderY.style.top = (this.dimension.shiftTopY/(this.containerHeight-this.mainGrid.mainCanvas.height)) * this.maxYTravel +"px";
    // this.isScrollY = false;
}
    
  /**
   * Handles horizontal scrolling based on mouse movement.
   * @param {MouseEvent} e - The mouse event object.
   * @returns {void}
   */
  handleHorizontalScroll(e) {
    this.xTravelled = e.pageX - this.getAttInt(this.trackX, "left") - this.mouseDownXOffset;
    this.maxXTravel =  (this.getAttInt(this.trackX, "width") - this.getAttInt(this.sliderX, "width"));

    if (this.xTravelled < 0) {
      // Handle scrolling left of the scrollbar
      this.xTravelled = 0;
      this.sliderX.style.left = "0px";
      this.updateHorizontalScroll(0);
    } else if ( this.xTravelled > 0.8 * this.maxXTravel) {
      // Handle scrolling beyond 80% of the scrollbar
      this.handleScrollBeyondRight();
    } else {
      // Update slider position and container shift
      this.sliderX.style.left = this.xTravelled + "px";
      this.sliderPercentageX = this.xTravelled / this.maxXTravel * 100;
      this.updateHorizontalScroll(this.sliderPercentageX);
    }
  }

  /**
   * Updates the horizontal scroll position based on the given percentage.
   * @param {number} percentage - The percentage of the scrollbar's movement, used to calculate the new horizontal scroll position.
   * @returns {void}
   */
  updateHorizontalScroll(percentage) {
    this.dimension.shiftLeftX = (percentage * (this.containerWidth - this.mainGrid.mainCanvas.width)) / 100;
    this.dimension.shiftRightX = this.dimension.shiftLeftX + this.mainGrid.mainCanvas.width;

    this.dimension.leftIndex = this.dimension.cellXIndex(this.dimension.shiftLeftX);
    this.dimension.rightIndex = this.dimension.cellXIndex(this.dimension.shiftRightX);
 
    this.mainGrid.render();
    this.topGrid.render();
    this.gridOperations.inputBox();
  }
  
  /**
   * Handles the scenario when scrolling goes beyond 80% of the scrollbar.
   * @returns {void}
  */
 handleScrollBeyondRight() {
    this.mainGrid.addColumns(50);
    this.topGrid.addCells(50);
    this.containerWidth = this.dimension.cWidthPrefixSum[this.dimension.cWidthPrefixSum.length - 1];
    
    if (this.getAttInt(this.sliderX, "width") > 40) {
      const newSliderXWidth = this.getAttInt(this.sliderX, "width") * 0.8;
      this.sliderX.style.width = newSliderXWidth + "px";
      this.maxXTravel = this.getAttInt(this.trackX, "width") - newSliderXWidth;
    }

    this.sliderX.style.left = (this.dimension.shiftLeftX / (this.containerWidth - this.mainGrid.mainCanvas.width)) * this.maxXTravel + "px";
    this.isScrollX = false;
  }

  /**
   * Handles the mouse up event, stopping both vertical and horizontal scrolling.
   * @returns {void}
   */
  handleMouseUp() {
    // Stop scrolling
    this.isScrollY = false;
    this.isScrollX = false;
  }

  /**
   * Utility function to get the integer value of a CSS attribute.
   * @param {HTMLElement} obj - The HTML element from which to retrieve the CSS attribute.
   * @param {string} attrib - The CSS attribute whose integer value is needed.
   * @returns {number} The integer value of the specified CSS attribute.
   */
  getAttInt(obj, attrib) {
    return parseInt(getComputedStyle(obj, null)[attrib], 10);
  }
}
