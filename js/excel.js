import { Sheet } from './sheet/sheet.js'

class Excel {
    constructor() {
        // Select the "Add Sheet" button and the Excel element from the DOM
        /**
         * @type { HTMLElement }
         */
        this.addSheetBtn = document.querySelector(".add-sheet-btn")
        /**
         * @type { HTMLElement }
         */
        this.excelElement = document.querySelector("#excel")
        
        // Initialize an object to keep track of all the sheets
        /**
         * @type { Object }
         */
        this.sheets = {}
        
        this.sheetTabBtns = {}
        
        /**
         * @type { Number }
         */
        this.count=0   // Counter to keep track of the number of sheets

        this.init()
        
        // Add a tab for the first sheet
        this.addSheetTab()

        // Setup event listeners for user interactions
        this.setupEventListeners()
    }

    init() {
        // Add the first sheet by default
        this.sheets["sheet" + 1] = new Sheet(1000, 50, 60, 20, "sheet" + 1)
        this.count++
    }

    setupEventListeners() {
        // Add a click event listener to the "Add Sheet" button
        this.addSheetBtn.addEventListener("click", () => {
            this.count++  // Increment sheet counter

            // Create a new sheet and add it to the `sheets` object
            this.sheets["sheet" + this.count] = new Sheet(1000, 50, 60, 20, "sheet" + this.count)
            
            // Add a tab for the newly created sheet
            this.addSheetTab()
        })
    }

    addSheetTab() {
        // Get the current sheet number
        var currentSheetNum = this.count

        // Create a new tab element for the sheet
        const sheetTabBtnElement = document.createElement("span")
        sheetTabBtnElement.classList.add("sheet-tab-btn", "sheet-tab-btn-" + currentSheetNum, "active")

        // Create a label element to display the sheet name
        const sheetLabelElement = document.createElement("span")
        sheetLabelElement.classList.add("sheet-label", "sheet-label-" + currentSheetNum)
        sheetLabelElement.innerText = "sheet" + currentSheetNum

        // Create a button element to allow closing the sheet
        const sheetCloseBtnElement = document.createElement("button")
        sheetCloseBtnElement.classList.add("sheet-close-btn", "sheet-close-" + currentSheetNum, "d-flex", "justify-content-center", "align-items-center")

        // Add a "X" text to the close button
        const sheetCloseBtnTextElement = document.createElement("span")
        sheetCloseBtnTextElement.innerHTML = '<span class="iconify" data-icon="maki:cross" data-width="16" data-height="17"></span>'

        sheetCloseBtnElement.appendChild(sheetCloseBtnTextElement)

        // Append the label and close button to the sheet tab element
        sheetTabBtnElement.appendChild(sheetLabelElement)
        sheetTabBtnElement.appendChild(sheetCloseBtnElement)

        // Add the current sheet button to the 'sheetTabBtns' object
        this.sheetTabBtns["sheet" + currentSheetNum] = sheetTabBtnElement

        for (let btn in this.sheetTabBtns) {
            this.sheetTabBtns[btn].classList.remove("active")
        }

        sheetTabBtnElement.classList.add("active")

        // Append the newly created sheet tab to the list container in the DOM
        const sheetListContainerElement = document.querySelector(".sheet-list-container")
        sheetListContainerElement.appendChild(sheetTabBtnElement)

        // Add a click event listener to the sheet tab to display its content
        sheetLabelElement.addEventListener("click", () => {
            // Clear the current content of the excel element
            this.excelElement.textContent = ""

            // Get the current sheet object
            var currentSpreadsheet = this.sheets["sheet" + currentSheetNum] 
            
            // Append the spreadsheet element to the Excel element
            this.excelElement.appendChild(currentSpreadsheet.spreadsheetElement)

            currentSpreadsheet.gridOperations.inputBox()  // change this after using singleton

            for (let btn in this.sheetTabBtns) {
                this.sheetTabBtns[btn].classList.remove("active")
            }
            sheetTabBtnElement.classList.add("active");
        })

        sheetCloseBtnElement.addEventListener("click", () => {
            if ( Object.keys(this.sheets).length > 1 ) {
                delete this.sheets["sheet" + currentSheetNum]

                sheetListContainerElement.removeChild(this.sheetTabBtns["sheet" + currentSheetNum])
                delete this.sheetTabBtns["sheet" + currentSheetNum]

                const previousSheet = this.sheets[Object.keys(this.sheets)[Object.keys(this.sheets).length - 1]]
                const previousSheetTabBtn = this.sheetTabBtns[Object.keys(this.sheetTabBtns)[Object.keys(this.sheetTabBtns).length - 1]]

                this.excelElement.textContent = ""
                this.excelElement.appendChild(previousSheet.spreadsheetElement)
                previousSheetTabBtn.classList.add("active");
            } else {
                alert("sorry :( you cant remove the last sheet")
            }
        })
    }
}

// Create an instance of the Excel class to start the application
var excel = new Excel()