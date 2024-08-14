export class cellStruct {
    constructor(xVal, yVal, width, height, value, isClicked, isSelected, ctx) {
        this.xVal = xVal;
        this.yVal = yVal;
        this.width = width;
        this.height = height;
        this.isClicked = isClicked;
        this.isSelected = isSelected;
        this.value = value;
        this.ctx = ctx;
      }

    drawCell() {
      this.ctx.clearRect(this.xVal, this.yVal, this.width, this.height);
        this.ctx.strokeStyle = "#E0E0E0";
        this.ctx.strokeRect(this.xVal, this.yVal, this.width, this.height);
        this.ctx.font = "14px serif";
        (this.ctx.fillStyle = "#000"),
          this.ctx.fillText(
            this.value,
            this.xVal + 12,
            this.yVal + this.height / 1.2,
            this.width
          );
        if (this.isSelected) {
          this.selectCell();
        }
      }

      selectCell() {
        if (this.isSelected) {
          this.ctx.fillStyle = "rgba(19, 126, 67, 0.1)";
          this.ctx.fillRect(this.xVal, this.yVal, this.width, this.height);
        } else {
          this.drawCell();
        }
      }
}