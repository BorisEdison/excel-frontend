import { cellStruct } from "./cell.js";

export class topGrid {
    constructor(dimension) {
        this.dimension = dimension

        this.topCells = [];
        this.topCanvas;
        this.topCtx;

        this.init();
    }

    init() {
      this.topCanvas = document.getElementById("top-canvas")
      this.topCanvas.height = 20
      this.topCanvas.width = screen.width
      this.topCtx = this.topCanvas.getContext("2d")

      this.getCells()
      this.render()
    }
    getCells(){
        for (let j = 0; j < this.dimension.columns; j++) {
            var cell = new cellStruct(1 + j * this.dimension.width + 0.5, 1, this.dimension.width, this.dimension.height, `${this.getColumnName(j + 1)}`, false, 0, this.topCtx);
            this.topCells.push(cell);
        }
    }

    render() {
      this.topCtx.reset(0,0,this.topCanvas.width,this.topCanvas.height)
      for(let i=this.dimension.leftIndex; i<this.dimension.rightIndex; i++){
        this.topCells[i].xVal = this.dimension.cWidthPrefixSum[i] - this.dimension.shiftLeftX + 0.5;
        this.topCells[i].drawCell()
      }
    }

    addCells(num) {
      var currentColumnLength = this.topCells.length;
      for (let i = 0; i < num; i++) {
          var cell = new cellStruct(1, 1, this.dimension.width, this.dimension.height, `${currentColumnLength + i}`, false, 0, this.topCtx);
          this.topCells.push(cell);
      }
    }
    getColumnName(num) {
        var s = "",
          t;
        while (num > 0) {
          t = (num - 1) % 26;
          s = String.fromCharCode(65 + t) + s;
          num = ((num - t) / 26) | 0;
        }
        return s || undefined;
      }

}
