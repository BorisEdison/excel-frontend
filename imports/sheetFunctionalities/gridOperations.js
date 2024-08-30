export class gridOperations {
    constructor(dimension, mainGrid, sideGrid, topGrid) {
        this.dimension = dimension;
        this.mainGrid = mainGrid;
        this.sideGrid = sideGrid;
        this.topGrid = topGrid;

        this.cellInput = document.querySelector(".input-box");

        this.selectIndexX
        this.selectIndexY
        this.selectedCell

        this.xValStart
        this.yValStart
        this.xValEnd
        this.yValEnd
        
        this.dashOffset = 0

        this.currentIndexX
        this.currentIndexY
        this.previousIndexX = -1
        this.previousIndexY = -1

        this.countText = document.querySelector(".count-text");
        this.sumText = document.querySelector(".sum-text");
        this.minText = document.querySelector(".min-text");
        this.maxText = document.querySelector(".max-text");
        this.avgText = document.querySelector(".avg-text");

        this.count = 0;
        this.sum = 0;
        this.min
        this.max

        this.isSelecting = false
        this.isAnimated = false
        this.isInput = false
        this.eventListeners()
    }

    eventListeners(){
        this.mainGrid.mainCanvas.addEventListener("mousedown", this.handleMouseDown.bind(this))
        this.mainGrid.mainCanvas.addEventListener("mousemove", this.handleMouseMove.bind(this))
        window.addEventListener("mouseup", this.handleMouseUp.bind(this))
        // document.addEventListener("keydown", (e) => {
        //   this.handleMarchingAnt(e);
        // });
    }

    handleMouseDown (e) {
        this.isSelecting = true
        this.isAnimated = false
        this.selectIndexX = this.dimension.cellXIndex(this.dimension.shiftLeftX + e.offsetX);
        this.selectIndexY = this.dimension.cellYIndex(this.dimension.shiftTopY + e.offsetY);

        this.removeElements(this.dimension.selectedMain);
        this.removeElements(this.dimension.selectedTop);
        this.removeElements(this.dimension.selectedSide);

        this.dimension.selectedMain = [];
        this.dimension.selectedSide = [];
        this.dimension.selectedTop = [];

        this.dimension.topValues = [];
        this.dimension.mainValues = [];
        this.dimension.sideValues = [];

        // select a particular cell for input
        this.addElements(this.mainGrid.mainCells[this.selectIndexY][this.selectIndexX],this.dimension.selectedMain)
        this.addElements(this.sideGrid.sideCells[this.selectIndexY],this.dimension.selectedSide)
        this.addElements(this.topGrid.topCells[this.selectIndexX],this.dimension.selectedTop)
      
        this.getValues(this.dimension.topValues,this.dimension.selectedTop)
        this.getValues(this.dimension.mainValues,this.dimension.selectedMain)
        this.getValues(this.dimension.sideValues,this.dimension.selectedSide)

        if(this.isInput){
          this.updateText(this.selectedCell,this.cellInput.value)
          this.isInput = false
        }

        this.inputBox()
    }
    inputBox(){
      this.selectedCell = this.mainGrid.mainCells[this.selectIndexY][this.selectIndexX]
      this.cellInput.value = this.selectedCell.value;
      this.cellInput.style.display = "block";
      this.cellInput.style.top = this.selectedCell.yVal + this.mainGrid.mainCanvas.offsetTop;
      this.cellInput.style.left = this.selectedCell.xVal + this.mainGrid.mainCanvas.offsetLeft;
      this.cellInput.style.height = this.selectedCell.height;
      this.cellInput.style.width = this.selectedCell.width;
      this.isInput = true
    }
    updateText(cell,value){
      cell.value = value;
      cell.drawCell()
    }

    handleMouseMove (e) {
      // select multiple cells
      if(this.isSelecting) {
          this.currentIndexX = this.dimension.cellXIndex(this.dimension.shiftLeftX + e.offsetX);
          this.currentIndexY = this.dimension.cellYIndex(this.dimension.shiftTopY + e.offsetY);
  
          if (this.previousIndexX == this.currentIndexX && this.previousIndexY == this.currentIndexY) {
            return;
          } else {
            this.previousIndexX = this.currentIndexX;
            this.previousIndexY = this.currentIndexY;
          }
      
          this.removeElements(this.dimension.selectedMain);
          this.removeElements(this.dimension.selectedSide);
          this.removeElements(this.dimension.selectedTop);
      
          this.dimension.selectedMain = [];
          this.dimension.selectedSide = [];
          this.dimension.selectedTop = [];

          this.dimension.topValues = [];
          this.dimension.mainValues = [];
          this.dimension.sideValues = [];
      
          for (let i = Math.min(this.currentIndexY, this.selectIndexY); i <= Math.max(this.currentIndexY, this.selectIndexY); i++) {
            this.addElements(this.sideGrid.sideCells[i],this.dimension.selectedSide)
            for (let j = Math.min(this.currentIndexX, this.selectIndexX); j <= Math.max(this.currentIndexX, this.selectIndexX); j++) {
              if (i === Math.min(this.currentIndexY, this.previousIndexY)) {
                this.addElements(this.topGrid.topCells[j],this.dimension.selectedTop)
              }
              this.addElements(this.mainGrid.mainCells[i][j],this.dimension.selectedMain)
            }
          }

          this.xValStart = this.dimension.selectedMain[0].xVal
          this.yValStart = this.dimension.selectedMain[0].yVal
          this.xValEnd = this.dimension.selectedMain[this.dimension.selectedMain.length -1].xVal + this.dimension.selectedMain[this.dimension.selectedMain.length -1].width
          this.yValEnd = this.dimension.selectedMain[this.dimension.selectedMain.length -1].yVal + this.dimension.selectedMain[this.dimension.selectedMain.length -1].height

          this.getValues(this.dimension.topValues,this.dimension.selectedTop)
          this.getValues(this.dimension.mainValues,this.dimension.selectedMain)
          this.getValues(this.dimension.sideValues,this.dimension.selectedSide)

          // border
          // if (this.isAnimated && this.dimension.selectedMain.length > 1) {
          //   this.drawDottedRect();
          // } else {
            this.mainGrid.mainCtx.strokeStyle = "rgba(0, 128, 0, 0.8)";
              this.mainGrid.mainCtx.strokeRect(
                this.xValStart,
                this.yValStart,
                this.xValEnd - this.xValStart,
                this.yValEnd - this.yValStart
            );
          // }
      }


      // mathematical parameter
      this.count = 0
      this.sum = 0
      if (this.dimension.selectedMain.length > 0) {
        this.min = Number.MAX_VALUE
        this.max = -Number.MAX_VALUE

        for (let i = 0; i < this.dimension.selectedMain.length; i++) {
          if( this.dimension.mainValues[i] === "") continue
          let value = Number(this.dimension.mainValues[i])

          if (!Number.isNaN(value)) {
            this.sum += value;
            this.count += 1;
            this.min = Math.min(this.min, value);
            this.max = Math.max(this.max,value);
          }
        }

        if(this.count>1){
          this.countText.innerHTML = `count: <span>${this.count}</span>`;
          this.sumText.innerHTML = `Sum: <span>${this.sum}</span>`;
          this.minText.innerHTML = `Min: <span>${this.min}</span>`;
          this.maxText.innerHTML = `Max: <span>${this.max}</span>`;
          this.avgText.innerHTML = `Average: <span>${(this.sum / this.count).toFixed(2)}</span>`;  
        }else {
          this.countText.innerHTML = ``;
          this.sumText.innerHTML = ``;
          this.minText.innerHTML = ``;
          this.maxText.innerHTML = ``;
          this.avgText.innerHTML = ``;  
        }
      }

    }

    handleMouseUp() {
      this.isSelecting = false;
    }

    getValues(values,arr){
      for(let i = 0 ; i<arr.length; i++){
          values.push(arr[i].value)
      }
    }

    // add elements to the selected array
    addElements(cell,arr){
      arr.push(cell)
      cell.isSelected = true
      cell.selectCell()
    }

    // remove elements from the selected array
    removeElements(arr) {
        for (let i = 0; i < arr.length; i++){
            arr[i].isSelected = false;
            arr[i].selectCell();
        }
    } 

  // marching ant
  //   handleMarchingAnt(e) {
  //     if (e.key === "Control" && this.dimension.selectedMain.length > 1) {
  //       this.isAnimated = true;
  //         window.cancelAnimationFrame(this.rafId);
  //       this.march();
  //     }
  //   }

  //   march() {
  //     this.dashOffset++;
  //     if (this.dashOffset > 20) {
  //       this.dashOffset = 0;
  //     }
  //     this.drawDottedRect();
  //     this.rafId = window.requestAnimationFrame(() => {
  //       this.mainGrid.render();
  //       this.march();
  //     });
  //   }

  // drawDottedRect() {
  //   this.mainGrid.mainCtx.setLineDash([5, 5]);
  //   this.mainGrid.mainCtx.lineDashOffset = - this.dashOffset;
  //   this.mainGrid.mainCtx.strokeStyle = "rgba(0, 128, 0, 0.9)";
  //   this.mainGrid.mainCtx.lineWidth = 2;
  //   this.mainGrid.mainCtx.strokeRect(
  //     this.xValStart,
  //     this.yValStart,
  //     this.xValEnd - this.xValStart,
  //     this.yValEnd - this.yValStart
  //   );
  //   this.mainGrid.mainCtx.setLineDash([]);
  // }
}