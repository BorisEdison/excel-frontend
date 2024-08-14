import { mainGrid } from "./sheetFunctionalities/mainGrid.js"
import { topGrid } from "./sheetFunctionalities/topGrid.js"
import { sideGrid } from "./sheetFunctionalities/sideGrid.js"
import { dimension } from "./sheetFunctionalities/dimension.js"
import { scroll } from "./sheetFunctionalities/scroll.js"
import { gridOperations } from "./sheetFunctionalities/gridOperations.js"
import { graph } from "./sheetFunctionalities/graph.js"
import { resize } from "./sheetFunctionalities/resize.js"

export default class sheet {
    constructor (rows, columns, width, height,sheetName) {
        this.dimension = new dimension ( rows, columns, width, height)
        this.mainGrid = new mainGrid (this.dimension)
        this.topGrid = new topGrid (this.dimension)
        this.sideGrid = new sideGrid (this.dimension)

        this.scroll = new scroll (this.dimension, this.mainGrid, this.sideGrid, this.topGrid)
        this.gridOperations = new gridOperations(this.dimension, this.mainGrid, this.sideGrid, this.topGrid)
        this.graph = new graph(this.dimension)
        this.graph = new graph(this.dimension)
        this.rezie = new resize(this.dimension)

        this.sheetName = sheetName
        this.init()
    }
    init() {
        const cornerCanvasElement = document.createElement("canvas")
        cornerCanvasElement.setAttribute("width", "60")
        cornerCanvasElement.setAttribute("height","20")

        const topCanvasElement = document.createElement("canvas")
        topCanvasElement.setAttribute("id","top-canvas")

        const row1Element = document.createElement("div")
        row1Element.setAttribute("id","row-1")

        row1Element.appendChild(cornerCanvasElement)
        row1Element.appendChild(topCanvasElement)

        const sideCanvasElement = document.createElement("canvas")
        sideCanvasElement.setAttribute("id","side-canvas")

        const sliderYElement = document.createElement("div")
        sliderYElement.setAttribute("id","slider-y")

        const trackYElement = document.createElement("div")
        trackYElement.setAttribute("id","track-y")

        trackYElement.appendChild(sliderYElement)

        const sliderXElement = document.createElement("div")
        sliderXElement.setAttribute("id","slider-x")

        const trackXElement = document.createElement("div")
        trackXElement.setAttribute("id","track-x")

        trackXElement.appendChild(sliderXElement)

        const inputElement = document.createElement("input")
        inputElement.setAttribute("type","text")
        inputElement.setAttribute("class","text")

        const mainCanvasElement = document.createElement("canvas")
        mainCanvasElement.setAttribute("id","main-canvas")

        const sheetElement = document.createElement("div")
        sheetElement.setAttribute("class", "sheet")

        sheetElement.appendChild(inputElement)
        sheetElement.appendChild(mainCanvasElement)
        sheetElement.appendChild(trackYElement)
        sheetElement.appendChild(trackXElement)

        const row2Element = document.createElement("div")
        row2Element.setAttribute("id", "row-2")       
        
        row2Element.appendChild(sideCanvasElement)
        row2Element.appendChild(sheetElement)

        const spreadsheetElement = document.createElement("div")
        spreadsheetElement.setAttribute("class","spreadsheet")
        spreadsheetElement.classList.add(`${this.sheetName}`)

        spreadsheetElement.appendChild(row1Element)
        spreadsheetElement.appendChild(row2Element)
    }
}