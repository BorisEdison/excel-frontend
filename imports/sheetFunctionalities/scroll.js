export class scroll {
    constructor(dimension, mainGrid, sideGrid, topGrid) {
        this.dimension = dimension;
        this.mainGrid = mainGrid;
        this.sideGrid = sideGrid;
        this.topGrid = topGrid;

        this.containerHeight;
        this.containerWidth;

        this.sliderY; 
        this.trackY;
        this.sliderPercentageY;
        this.yTravelled;
        this.mouseDownYOffset;
        this.isScrollY;

        this.sliderX; 
        this.trackX;
        this.sliderPercentageX;
        this.xTravelled;
        this.mouseDownXOffset;
        this.isScrollX;

        this.init()
    }

    init() {
        // summation of height of all the rows
        this.containerHeight = this.dimension.rHeightPrefixSum[this.dimension.rHeightPrefixSum.length - 1]
        // summation of width of all the columns
        this.containerWidth = this.dimension.cWidthPrefixSum[this.dimension.cWidthPrefixSum.length - 1];

        this.sliderY = document.getElementById("slider-y");
        this.trackY = document.getElementById("track-y");
        this.sliderPercentageY = null;
        this.yTravelled = 0
        this.isScrollY = false;

        this.sliderX = document.getElementById("slider-x");
        this.trackX = document.getElementById("track-x");
        this.sliderPercentageX = null;
        this.xTravelled = 0
        this.isScrollX = false;

        this.eventListeners()
    }

    eventListeners(){
        this.sliderY.addEventListener("mousedown", this.handleMouseDownY.bind(this))
        this.sliderX.addEventListener("mousedown", this.handleMouseDownX.bind(this))
        document.addEventListener("mouseup", this.handleMouseUp.bind(this))
        document.addEventListener("mousemove", this.handleMouseMove.bind(this))
    }

    handleMouseDownY(e) {
        this.isScrollY = true;
        // distance between slider top and mousedown
        this.mouseDownYOffset = e.pageY - this.getAttInt(this.trackY, "top") - this.getAttInt(this.sliderY, "top");
    }
    handleMouseDownX(e) {
        this.isScrollX = true;
        // distance between slider left and mousedown
        this.mouseDownXOffset = e.pageX - this.getAttInt(this.trackX, "left") - this.getAttInt(this.sliderX, "left");
    }
    handleMouseMove(e){
        // vertical scroll
        if(this.isScrollY) {
            this.yTravelled = e.pageY - this.getAttInt(this.trackY, "top") - this.mouseDownYOffset
            // if slider moves above the scrollbar
            if (this.yTravelled < 0) {
                
                this.sliderY.style.top = 0;
                this.dimension.shiftTopY = 0;
                this.dimension.shiftBottomY = this.mainGrid.mainCanvas.height;
                
                this.yTravelled = 0;
                this.sliderY.style.height = 0.6 * this.getAttInt(this.trackY, "height");
                
                this.dimension.topIndex = this.dimension.cellYIndex(this.dimension.shiftTopY)
                this.dimension.bottomIndex = this.dimension.cellYIndex(this.dimension.shiftBottomY)
                
                this.mainGrid.render();
                this.sideGrid.render()
            } 
            // if slider travels more than 80% of the available space
            else if (this.yTravelled > 0.8 * (this.getAttInt(this.trackY, "height") - this.getAttInt(this.sliderY, "height"))) {
                if (this.getAttInt(this.sliderY, "height") > 40) {
                    this.sliderY.style.height = (this.mainGrid.mainCanvas.height * this.mainGrid.mainCanvas.height) / this.containerHeight + "px";
                }

                this.mainGrid.addRows(20)
                this.sideGrid.addCells(20)

                this.containerHeight = this.dimension.rHeightPrefixSum[this.dimension.rHeightPrefixSum.length - 1];
                this.sliderY.style.top = 0.5 * (this.getAttInt(this.trackY, "height") - this.getAttInt(this.sliderY, "height"));
                this.yTravelled = 0.5 * (this.getAttInt(this.trackY, "height") - this.getAttInt(this.sliderY, "height"));
                this.isScrollY = false
            } else {
                this.sliderY.style.top = this.yTravelled + "px";
                this.sliderPercentageY = (this.yTravelled / (this.getAttInt(this.trackY, "height") - this.getAttInt(this.sliderY, "height"))) * 100;
                this.dimension.shiftTopY = (this.sliderPercentageY * (this.containerHeight - this.mainGrid.mainCanvas.height)) / 100;
                this.dimension.shiftBottomY = (this.dimension.shiftTopY + this.mainGrid.mainCanvas.height);
                
                this.dimension.topIndex = this.dimension.cellYIndex(this.dimension.shiftTopY)
                this.dimension.bottomIndex = this.dimension.cellYIndex(this.dimension.shiftBottomY)

                this.mainGrid.render();
                this.sideGrid.render()
            }     
        }

        // horizontal scroll 
        else if ( this.isScrollX){
            this.xTravelled = e.pageX - this.getAttInt(this.trackX, "left") - this.mouseDownXOffset
            // if slider moves left of scrollbar
            if (this.xTravelled < 0) {
                
                this.sliderX.style.left = 0;
                this.dimension.shiftLeftX = 0;
                this.dimension.shiftRightX = this.mainGrid.mainCanvas.width;

                this.xTravelled = 0;
                this.sliderX.style.width = 0.4 * this.getAttInt(this.trackX, "width");

                this.dimension.leftIndex = this.dimension.cellXIndex(this.dimension.shiftLeftX)
                this.dimension.rightIndex = this.dimension.cellXIndex(this.dimension.shiftRightX)

                this.mainGrid.render();
                this.topGrid.render();
              } 
                // if slider travels more than 80% of the available space
              else if (this.xTravelled > 0.8 * (this.getAttInt(this.trackX, "width") - this.getAttInt(this.sliderX, "width"))) {
                  this.mainGrid.addColumns(10);
                  this.topGrid.addCells(10)

                  this.containerWidth = this.dimension.cWidthPrefixSum[this.dimension.cWidthPrefixSum.length - 1];
                  this.sliderX.style.left = 0.5 * (this.getAttInt(this.trackX, "width") - this.getAttInt(this.sliderX, "width"));
                  this.xTravelled = 0.5 * (this.getAttInt(this.trackX, "width") - this.getAttInt(this.sliderX, "width"));
                  
                  if (this.getAttInt(this.sliderX, "width") > 40) {
                      this.sliderX.style.width = ((this.mainGrid.mainCanvas.width * this.mainGrid.mainCanvas.width) / this.containerWidth) + "px";
                  }
                  this.isScrollX = false
              } else {
                this.sliderX.style.left = this.xTravelled + "px";
                this.sliderPercentageX = (this.xTravelled / (this.getAttInt(this.trackX, "width") - this.getAttInt(this.sliderX, "width"))) * 100;

                this.dimension.shiftLeftX = (this.sliderPercentageX * (this.containerWidth - this.mainGrid.mainCanvas.width)) / 100;
                this.dimension.shiftRightX = this.dimension.shiftLeftX + this.mainGrid.mainCanvas.width;

                this.dimension.leftIndex = this.dimension.cellXIndex(this.dimension.shiftLeftX)
                this.dimension.rightIndex = this.dimension.cellXIndex(this.dimension.shiftRightX)

                this.mainGrid.render()
                this.topGrid.render()
              }
        }
    }
    handleMouseUp(e) {
        this.isScrollY = false
        this.isScrollX = false
    }
    
    // get integer value of attribute
    getAttInt(obj, attrib) {
        return parseInt(getComputedStyle(obj, null)[attrib], 10)
    }
}