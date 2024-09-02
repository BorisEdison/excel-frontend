export class Resize {
    constructor(dimension, mainGrid, topGrid, sideGrid, gridOperations) {
        this.dimension = dimension;
        this.mainGrid = mainGrid;
        this.topGrid = topGrid;
        this.sideGrid = sideGrid;
        this.gridOperations = gridOperations;

        this.isMouseDown = false; // Flag to track mouse state
        this.ind = -1; // Index of the column being resized

        this.addEventListeners();
    }

    // Add event listeners for mouse events
    addEventListeners() {
        window.addEventListener('mousemove', this.mouseMove.bind(this));
        this.topGrid.topCanvas.addEventListener('mousedown', this.mouseDown.bind(this));
        this.sideGrid.sideCanvas.addEventListener('mousedown', this.mouseDown.bind(this));
        window.addEventListener('mouseup', this.mouseUp.bind(this));
    }

    // Handle mouse down event
    mouseDown(event) {
        this.isMouseDown = true; // Start resizing
    }

    // Handle mouse up event
    mouseUp(event) {
        this.mainGrid.render(); // Re-render main grid after resizing
        if (this.dimension.selectedMain.length >= 1) {
            this.gridOperations.inputBox(); // Show input box if any cells are selected
        }
        this.isMouseDown = false; // Stop resizing
    }

    // Handle mouse move event
    mouseMove(event) {
        if (this.isMouseDown) {
            // When resizing
            if (this.ind !== -1) {
                this.topGrid.topCanvas.style.cursor = "col-resize"; // Change cursor to indicate resizing
                this.adjustColumnWidth(this.ind, event.movementX); // Adjust column width

                this.topGrid.render(); // Re-render top grid
            }
        } else {
            // When not resizing
            this.updateResizeIndex(event);
            this.topGrid.topCanvas.style.cursor = this.ind === -1 ? "default" : "col-resize"; // Change cursor based on whether resizing is possible
        }
    }

    // Update the index of the column being resized
    updateResizeIndex(event) {
        // Calculate the horizontal distance from the left of the grid
        const distance = event.clientX - this.topGrid.rect.left + this.dimension.shiftLeft;
        this.ind = this.findResizeIndex(distance);
    }

    // Find the index of the column to resize based on distance
    findResizeIndex(distance) {
        if (distance <= 5) {
            return -1; // Return -1 if distance is too small
        }

        let left = 0;
        let right = this.dimension.cWidthPrefixSum.length - 1;

        // Binary search to find the column index
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);

            if (distance >= this.dimension.cWidthPrefixSum[mid] - 5 && distance <= this.dimension.cWidthPrefixSum[mid] + 5) {
                return mid; // Found the column index
            } else if (this.dimension.cWidthPrefixSum[mid] < distance) {
                left = mid + 1; // Search the right half
            } else {
                right = mid - 1; // Search the left half
            }
        }

        return -1; // Column not found
    }

    // Adjust the width of columns from the given index
    adjustColumnWidth(index, extra) {
        for (let i = index; i < this.dimension.cWidthPrefixSum.length; i++) {
            // Check if the new width is less than the minimum width (30 pixels)
            if ((this.dimension.cWidthPrefixSum[i] - this.dimension.cWidthPrefixSum[i - 1]) + extra < 30) {
                break; // Stop adjusting if the minimum width constraint is violated
            }
            this.dimension.cWidthPrefixSum[i] += extra; // Adjust the width
        }
    }
}
