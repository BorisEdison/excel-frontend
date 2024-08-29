export class dimension{
    constructor(rows,columns,width,height){
        this.rows=rows;
        this.columns=columns;
        this.width=width;
        this.height=height;
        
        this.selectedMain = []
        this.selectedTop = []
        this.selectedSide = []

        this.topValues = []
        this.mainValues = []
        this.sideValues = []

        this.cWidthPrefixSum=[0];
        this.rHeightPrefixSum=[0];

        this.shiftTop = 0;
        this.shiftBottom;
        this.shiftLeft = 0;
        this.shiftRight;

        this.topIndex;
        this.bottomIndex;
        this.leftIndex;
        this.rightIndex;
    }

    cellXIndex(num) {
        for (var i = 1; i < this.cWidthPrefixSum.length; i++) {
          if (num >= this.cWidthPrefixSum[i - 1] && num < this.cWidthPrefixSum[i]) return i-1;
        }
        return this.cWidthPrefixSum.length-1
      }

    cellYIndex(num) {
        for (var i = 1; i < this.rHeightPrefixSum.length; i++) {
          if (num >= this.rHeightPrefixSum[i - 1] && num < this.rHeightPrefixSum[i]) return i-1;
        }
        return this.rHeightPrefixSum.length-1;
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

      getColumnNumber(val){
        var base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', i, j, result = 0;
  
        for (i = 0, j = val.length - 1; i < val.length; i += 1, j -= 1) {
          result += Math.pow(base.length, j) * (base.indexOf(val[i]) + 1);
        }
      
        return result;
      }  
}