import { cellStruct } from "./cell.js";

export class mainGrid{
 
    constructor(dimension){
        this.dimension = dimension;

        this.mainCanvas;
        this.mainCtx;
        this.mainCells = [];

        this.init();
    }
    
    init() {
        this.mainCanvas = document.getElementById("main-canvas")
        this.mainCanvas.height = screen.height - 30;
        this.mainCanvas.width = screen.width;
        this.mainCtx = this.mainCanvas.getContext("2d")

        this.dimension.shiftTopY = 0;
        this.dimension.shiftBottomY = this.mainCanvas.height;
        this.dimension.shiftLeftX = 0;
        this.dimension.shiftRightX = this.mainCanvas.width;

        this.getCells()

        this.dimension.topIndex = 0
        this.dimension.bottomIndex = this.dimension.cellYIndex(this.dimension.shiftBottomY)
        this.dimension.leftIndex = 0
        this.dimension.rightIndex = this.dimension.cellXIndex(this.dimension.shiftRightX)

        this.render()
    }

    getCells(){
        for (let i = 0; i < this.dimension.rows; i++) {
            this.dimension.rHeightPrefixSum.push(this.dimension.rHeightPrefixSum[i] + this.dimension.height);
            this.mainCells[i] = [];
            for (let j = 0; j < this.dimension.columns; j++) {
                if (i == 0) {
                    this.dimension.cWidthPrefixSum.push(this.dimension.cWidthPrefixSum[j] + this.dimension.width);
                }
                var cell = new cellStruct(1 + j * this.dimension.width + 0.5, 1 + i * this.dimension.height + 0.5, this.dimension.width, this.dimension.height, Math.floor(Math.random()*1000), false, 0, this.mainCtx);
                this.mainCells[i].push(cell);
            }
        }
    }

    render() {
        this. mainCtx.reset(0, 0, this.mainCanvas.width, this.mainCanvas.height);
        for (let i = this.dimension.topIndex ; i < this.dimension.bottomIndex; i++) {
            for (let j = this.dimension.leftIndex; j < this.dimension.rightIndex; j++) {
            this.mainCells[i][j].yVal = this.dimension.rHeightPrefixSum[i] - this.dimension.shiftTopY + 0.5;
            this.mainCells[i][j].xVal = this.dimension.cWidthPrefixSum[j] - this.dimension.shiftLeftX + 0.5;
            this.mainCells[i][j].drawCell();
          }
        }    
    }

    addRows(num) {
        var currentRowLength = this.dimension.rHeightPrefixSum.length;
        var currentColumnLength = this.dimension.cWidthPrefixSum.length;

        for (let i = 0; i < num; i++) {
          this.dimension.rHeightPrefixSum.push(this.dimension.rHeightPrefixSum[currentRowLength + i - 1] + this.dimension.height);
          this.mainCells[currentRowLength + i - 1] = [];
    
          for (let j = 0; j < currentColumnLength - 1; j++) {
            var cell = new cellStruct(1,1,this.dimension.width,this.dimension.height, Math.floor(Math.random()*1000), false, 0, this.mainCtx);
            this.mainCells[currentRowLength + i - 1].push(cell);
          }
        }
    }

    addColumns(num) {
        var currentRowLength = this.dimension.rHeightPrefixSum.length;
        var currentColumnLength = this.dimension.cWidthPrefixSum.length;

        for (let i = 0; i < currentRowLength - 1; i++) {
            for (let j = 0; j < num; j++) {
                if(i==0){
                    this.dimension.cWidthPrefixSum.push(this.dimension.cWidthPrefixSum[currentColumnLength + j - 1] + this.dimension.width);
                }
                var cell = new cellStruct(1, 1, this.dimension.width, this.dimension.height, Math.floor(Math.random()*1000), false, 0, this.mainCtx);
                this.mainCells[i].push(cell);
          }
        }
    }
}