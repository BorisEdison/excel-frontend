export class graph {
    constructor(dimension, mainGrid) {
      this.dimension = dimension
      this.mainGrid = mainGrid

      this.graphCanvasElement = document.getElementById("myChart");
      this.graph = document.querySelector(".graph");
      this.barGraphBtn = document.querySelector(".graph-bar-btn");
      this.lineGraphBtn = document.querySelector(".graph-line-btn");
      this.pieGraphBtn = document.querySelector(".graph-pie-btn");
      this.graphCloseBtn = document.querySelector(".graph-close")
      
      this.init()
    }
  
    init() {
        this.barGraphBtn.addEventListener("click", () => {
            this.graph.style.display = "inline-block";
            this.drawBarGraph();  
          });
      
          this.lineGraphBtn.addEventListener("click", () => {
            this.graph.style.display = "inline-block";
            this.drawLineGraph();
          });
      
          this.pieGraphBtn.addEventListener("click", () => {
            this.graph.style.display = "inline-block";
            this.drawPieGraph();
          });

          this.graphCloseBtn.addEventListener("click",() => {
            this.graph.style.display = "none";
          });
    }

    // destroy graph
    destroyGraph(){
      if(this.draw){
        this.draw.destroy()
      }
    }

    getGraphValue(){
      let xValues=[];
      let dataSets=[];
      if(this.isHorizantalSizebigger()){
          for(let i=0; i<this.dimension.selectedSide.length; i++){
              let dataSet={
                  label:this.dimension.selectedSide[i].value,   // sticker or no. of colours
                  data:[],
                  borderWidth: 1,
              }
              for(let j= 0; j<this.dimension.selectedTop.length; j++){
                  xValues[j]= this.dimension.selectedTop[j].value;
                  dataSet.data.push(this.mainGrid.mainCells[this.dimension.sideValues[i]][this.dimension.getColumnNumber(this.dimension.topValues[j])-1].value)
              }

              dataSets.push(dataSet)
          }
      }
      else{
          for(let i=0 ; i< this.dimension.selectedTop.length;i++){
              let dataSet={
                  label: this.dimension.selectedTop[i].value,
                  data:[],
                  borderWidth: 1,
              }
              for(let j=0;j<this.dimension.selectedSide.length;j++){
                  xValues[j]= this.dimension.selectedSide[j].value;
                  dataSet.data.push(this.mainGrid.mainCells[this.dimension.sideValues[j]][this.dimension.getColumnNumber(this.dimension.topValues[i])-1].value)
              }
              dataSets.push(dataSet)
          }
      }
      return {xValues,dataSets};
  }

  isHorizantalSizebigger(){
    if((this.dimension.selectedTop.length)>(this.dimension.selectedSide.length)) return true;
    
    return false;
  }

    //  * Drawing Bar Graph
    drawBarGraph() {
      this.destroyGraph()
      let {xValues:xValues,dataSets:dataSets}=this.getGraphValue();
      this.draw = new Chart(this.graphCanvasElement, {
        type: "bar",
        data: {
          labels: xValues,
          datasets: dataSets
        }
      });
    }
  
    //  * Drawing Line Graph
    drawLineGraph() {
      this.destroyGraph()
      let {xValues:xValues,dataSets:dataSets}=this.getGraphValue();
      this.draw = new Chart(this.graphCanvasElement, {
        type : 'line',
        data: {
          labels: xValues,
          datasets: dataSets
        }
      });
    }
  
    //  * Drawing Pie Chart
    drawPieGraph(){
      this.destroyGraph()
      let {xValues:xValues,dataSets:dataSets}=this.getGraphValue();
      this.draw=new Chart(this.graphCanvasElement, {
        type : 'pie',
        data: {
          labels: xValues,
          datasets: dataSets
        }
      });
    }
  }