import { Dimension } from "./dimension.js";
import { MainGrid } from "./mainGrid.js";

export class Graph {
  /**
   *
   * @param {Dimension} dimension
   * @param {MainGrid} mainGrid
   */
  constructor(dimension, mainGrid) {
    /**
     * @type { Dimension }
     */
    this.dimension = dimension;
    /**
     * @type { MainGrid }
     */
    this.mainGrid = mainGrid;

    // DOM elements
    /**
     * @type { HTMLElement}
     */
    this.graphCanvasElement = document.getElementById("myChart");
    /**
     * @type { HTMLElement}
     */
    this.graph = document.querySelector(".graph");
    /**
     * @type { HTMLElement}
     */
    this.barGraphBtn = document.querySelector(".graph-bar-btn");
    /**
     * @type { HTMLElement}
     */
    this.lineGraphBtn = document.querySelector(".graph-line-btn");
    /**
     * @type { HTMLElement}
     */
    this.pieGraphBtn = document.querySelector(".graph-pie-btn");
    /**
     * @type { HTMLElement}
     */
    this.graphCloseBtn = document.querySelector(".graph-close");

    // Initialize event listeners
    this.init();
  }

  // Initialize event listeners for graph buttons
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

    this.graphCloseBtn.addEventListener("click", () => {
      this.graph.style.display = "none";
    });
  }

  /**
   * Destroys the existing graph instance if it exists.
   * @returns {void}
   */
  destroyGraph() {
    if (this.draw) {
      this.draw.destroy();
    }
  }

  /**
   * Retrieves the x-axis values and datasets for generating a graph based on the selected dimensions.
   * @returns {{ xValues: string[], dataSets: Object[] }} An object containing the x-axis values (`xValues`) and the datasets (`dataSets`) for the graph.
   */
  getGraphValue() {
    let xValues = [];
    let dataSets = [];

    // Determine if the horizontal size is larger
    const isHorizontalLarger = this.isHorizontalSizeBigger();

    if (isHorizontalLarger) {
      // Iterate over selected side dimensions for horizontal larger case
      for (let i = 0; i < this.dimension.selectedSide.length; i++) {
        let dataSet = {
          label: this.dimension.selectedSide[i].value, // Label for each dataset
          data: [],
          borderWidth: 1,
        };

        
        for (let j = 0; j < this.dimension.selectedTop.length; j++) {
          xValues[j] = this.dimension.selectedTop[j].value;
          dataSet.data.push(
            this.mainGrid.mainCells[this.dimension.sideValues[i] - 1][
              this.dimension.getColumnNumber(this.dimension.topValues[j]) - 1
            ].value
          );
        }
        
        dataSets.push(dataSet);
      }
    } else {
      // Iterate over selected top dimensions for vertical larger case
      for (let i = 0; i < this.dimension.selectedTop.length; i++) {
        let dataSet = {
          label: this.dimension.selectedTop[i].value,
          data: [],
          borderWidth: 1,
        };
        
        for (let j = 0; j < this.dimension.selectedSide.length; j++) {
          xValues[j] = this.dimension.selectedSide[j].value;
          dataSet.data.push(
            this.mainGrid.mainCells[this.dimension.sideValues[j] - 1][
              this.dimension.getColumnNumber(this.dimension.topValues[i]) - 1
            ].value
          );
        }

        dataSets.push(dataSet);
      }
    }

    return { xValues, dataSets };
  }

  /**
   * Checks if the horizontal size (number of selected top cells) is larger than the vertical size (number of selected side cells).
   * @returns {boolean} Returns `true` if the horizontal size is larger than the vertical size, otherwise `false`.
   */
  isHorizontalSizeBigger() {
    return (
      this.dimension.selectedTop.length > this.dimension.selectedSide.length
    );
  }

  /**
   * Draws a bar graph on the specified canvas element.
   * @returns {void}
   */
  drawBarGraph() {
    this.destroyGraph();
    const { xValues, dataSets } = this.getGraphValue();
    this.draw = new Chart(this.graphCanvasElement, {
      type: "bar",
      data: {
        labels: xValues,
        datasets: dataSets,
      },
    });
  }

  /**
   * Draws a line graph on the specified canvas element.
   * @returns {void}
   */
  drawLineGraph() {
    this.destroyGraph();
    const { xValues, dataSets } = this.getGraphValue();
    this.draw = new Chart(this.graphCanvasElement, {
      type: "line",
      data: {
        labels: xValues,
        datasets: dataSets,
      },
    });
  }

  /**
   * Draws a pie chart on the specified canvas element.
   * @returns {void}
   */
  drawPieGraph() {
    this.destroyGraph();
    const { xValues, dataSets } = this.getGraphValue();
    this.draw = new Chart(this.graphCanvasElement, {
      type: "pie",
      data: {
        labels: xValues,
        datasets: dataSets,
      },
    });
  }
}
