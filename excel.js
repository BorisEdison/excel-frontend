import { Sheet } from './imports/sheet.js'

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
        this.sheets["sheet" + 1] = new Sheet(100, 60, 60, 20, "sheet" + 1)
        this.count++
    }

    setupEventListeners() {
        // Add a click event listener to the "Add Sheet" button
        this.addSheetBtn.addEventListener("click", () => {
            this.count++  // Increment sheet counter

            // Create a new sheet and add it to the `sheets` object
            this.sheets["sheet" + this.count] = new Sheet(100, 60, 60, 20, "sheet" + this.count)
            
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
        sheetCloseBtnElement.classList.add("sheet-close-btn", "sheet-close-" + currentSheetNum)

        // Add a "X" text to the close button
        const sheetCloseBtnTextElement = document.createElement("span")
        sheetCloseBtnTextElement.innerText = "X"
        sheetCloseBtnElement.appendChild(sheetCloseBtnTextElement)

        // Append the label and close button to the sheet tab element
        sheetTabBtnElement.appendChild(sheetLabelElement)
        sheetTabBtnElement.appendChild(sheetCloseBtnElement)

        // Append the newly created sheet tab to the list container in the DOM
        const sheetListContainerElement = document.querySelector(".sheet-list-container")
        sheetListContainerElement.appendChild(sheetTabBtnElement)

        // Add a click event listener to the sheet tab to display its content
        sheetTabBtnElement.addEventListener("click", () => {
            // Clear the current content of the excel element
            this.excelElement.textContent = ""

            // Get the current sheet object
            var currentSpreadsheet = this.sheets["sheet" + currentSheetNum]
            
            // Append the spreadsheet element to the Excel element
            this.excelElement.appendChild(currentSpreadsheet.spreadsheetElement)
        })
    }
}

// Create an instance of the Excel class to start the application
var excel = new Excel()
