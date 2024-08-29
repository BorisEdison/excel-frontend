import { cellStruct } from "./cell.js";

export class sideGrid {
    constructor(dimension) {
        this.dimension = dimension

        this.sideCells = [];
        this.sideCanvas;
        this.sideCtx;
        this.rect;

        this.init();
    }

    init() {
        this.sideCanvas = document.getElementById("side-canvas")
        this.sideCanvas.height = screen.height - 30;
        this.sideCanvas.width = 60
        this.sideCtx = this.sideCanvas.getContext("2d")
        this.rect = this.sideCanvas.getBoundingClientRect()

        this.getCells()
        this.render()
    }

    getCells() {
        for (let i = 0; i < this.dimension.rows; i++) {
            var cell = new cellStruct(1, 1 + i * this.dimension.height + 0.5, this.dimension.width, this.dimension.height, `${i}`, false, 0, this.sideCtx);
            this.sideCells.push(cell);
          }
    }

    render() {
        this.sideCtx.reset(0,0,this.sideCanvas.width, this.sideCanvas.height)
        for(let i = this.dimension.topIndex; i<this.dimension.bottomIndex; i++){
            this.sideCells[i].yVal = this.dimension.rHeightPrefixSum[i] - this.dimension.shiftTopY + 0.5;
            this.sideCells[i].height = this.dimension.rHeightPrefixSum[i+1] - this.dimension.rHeightPrefixSum[i];
            this.sideCells[i].drawCell()
        }
    }
    addCells(num) {
        var currentRowLength = this.sideCells.length
        for (let i = 0; i < num; i++) {
            var cell = new cellStruct(1,1,this.dimension.width,this.dimension.height,`${currentRowLength + i}`,false,0,this.sideCtx);
            this.sideCells.push(cell);
        }
    }
    
}