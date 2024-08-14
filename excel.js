import sheet from './imports/sheet.js'

var addSheetBtn = document.querySelector(".add-sheet-btn")

var dictionary = {}
var count = 0

addSheetBtn.addEventListener("click", function() {
    dictionary["sheet" + count] = new sheet(100, 60, 60, 20,"sheet"+count);
    count++
    addSheetTabBtn()
    console.log(dictionary)
})


function addSheetTabBtn() {
    const sheetTabBtnElement = document.createElement("span")
    sheetTabBtnElement.classList.add("sheet-tab-btn", "sheet-tab-btn-" + count, "active");

    const sheetLabelElement = document.createElement("span")
    sheetLabelElement.classList.add("sheet-label", "sheet-label-" + count)
    sheetLabelElement.innerText = "sheet" + count

    const sheetCloseBtnElement = document.createElement("button")
    sheetCloseBtnElement.classList.add("sheet-close-btn", "sheet-close-" + count)

    const sheetCloseBtnTextElement = document.createElement("span")
    sheetCloseBtnTextElement.innerText = "X"

    sheetCloseBtnElement.appendChild(sheetCloseBtnTextElement)

    sheetTabBtnElement.appendChild(sheetLabelElement)
    sheetTabBtnElement.appendChild(sheetCloseBtnElement)

    const sheetListContainerElement = document.querySelector(".sheet-list-container")
    sheetListContainerElement.appendChild(sheetTabBtnElement)
}

