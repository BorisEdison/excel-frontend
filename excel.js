import sheet from './imports/sheet.js'

class Excel {

    constructor() {
        this.addSheetBtn = document.querySelector(".add-sheet-btn")
        this.excelElement = document.querySelector("#excel")
        this.dictionary = {}
        this.dictionary["sheet" + 1] = new sheet(100, 60, 60, 20,"sheet"+1)
        this.count = 1
        this.addSheetTab()

        this.setupEventListeners()
    }

    setupEventListeners() {
        this.addSheetBtn.addEventListener("click", () =>  {
            this.count++
            this.dictionary["sheet" + this.count] = new sheet(100, 60, 60, 20,"sheet"+this.count)
            this.addSheetTab()
            console.log(this.dictionary)
        })
    }

    addSheetTab() {
        var currentSheetNum = this.count
        const sheetTabBtnElement = document.createElement("span")
        sheetTabBtnElement.classList.add("sheet-tab-btn", "sheet-tab-btn-" + currentSheetNum, "active");
    
        const sheetLabelElement = document.createElement("span")
        sheetLabelElement.classList.add("sheet-label", "sheet-label-" + currentSheetNum)
        sheetLabelElement.innerText = "sheet" + currentSheetNum
    
        const sheetCloseBtnElement = document.createElement("button")
        sheetCloseBtnElement.classList.add("sheet-close-btn", "sheet-close-" + currentSheetNum)
    
        const sheetCloseBtnTextElement = document.createElement("span")
        sheetCloseBtnTextElement.innerText = "X"
    
        sheetCloseBtnElement.appendChild(sheetCloseBtnTextElement)
    
        sheetTabBtnElement.appendChild(sheetLabelElement)
        sheetTabBtnElement.appendChild(sheetCloseBtnElement)
    
        const sheetListContainerElement = document.querySelector(".sheet-list-container")
        sheetListContainerElement.appendChild(sheetTabBtnElement)

        sheetTabBtnElement.addEventListener("click", () => {
            this.excelElement.textContent = ""
            var currentSpreedSheet = this.dictionary["sheet" + currentSheetNum]
            this.excelElement.appendChild(currentSpreedSheet.spreadsheetElement)
            // currentSpreedSheet.mainGrid.render

        })
    }
}

var excel = new Excel()