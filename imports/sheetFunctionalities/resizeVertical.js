export class resize{
    constructor(dimension,mainGrid,topGrid,sideGrid){
        this.dimension=dimension;
        this.mainGrid=mainGrid;
        this.topGrid=topGrid;
        this.sideGrid=sideGrid;

        this.isMouseDown=false;
        this.mouseDownDirection
        this.ind=-1;
        this.ind=-1;

        this.addEventListner();
    }

    addEventListner(){
        window.addEventListener('mousemove',this.mouseMove.bind(this))

        this.topGrid.topCanvas.addEventListener('mousedown',this.mouseDown.bind(this, 'horizontal'))
        this.topGrid.topCanvas.addEventListener('mousemove',this.mouseMove.bind(this))

        this.sideGrid.sideCanvas.addEventListener('mousedown',this.mouseDown.bind(this, 'vertical'))
        this.sideGrid.sideCanvas.addEventListener('mousemove',this.mouseMove.bind(this))

        window.addEventListener('mouseup',this.mouseUp.bind(this))
    }
    
    mouseDown(direction, event){
        this.mouseDownDirection = direction;
        this.isMouseDown=true;
    }

    mouseUp(event){
        this.isMouseDown=false;
    }

    mouseMove(event){
        if(this.isMouseDown){
            if(this.ind!=-1){
                this.topGrid.topCanvas.style.cursor="col-resize";
                this.addExtra(this.ind,event.movementX,this.dimension.cWidthPrefixSum);

                this.mainGrid.render();
                this.topGrid.render();
            }
        }
        else{
            this.getMovingNumber(event);
            if(this.ind==-1){
                this.topGrid.topCanvas.style.cursor="default";
            }
            else{
                this.topGrid.topCanvas.style.cursor="col-resize";
            }
        }
}

    getMovingNumber(event){
        const deltaX = event.clientX - this.topGrid.rect.left + this.dimension.shiftLeft
        // const deltaY = event.clientY - this.sideGrid.rect.top + this.dimension.shiftTop

        if(this.mouseDownDirection === 'horizontal') {
            this.ind = this.findResizeIndex(deltaX, this.dimension.cWidthPrefixSum) 
            console.log("hello")
        }
        else {
            // this.ind = this.findResizeIndex(deltaY, this.dimension.rHeightPrefixSum) 
        }
    }


    findResizeIndex(delta, prefixSum){
        if(delta<=5){
            return -1;
        }
        console.log(prefixSum.length)
        let left = 0;
        let right = prefixSum.length - 1;
        let result = -1;

        while (left <= right) {
            let mid = Math.floor((left + right) / 2);

            if(delta >= prefixSum[mid]-5 && delta <= prefixSum[mid]+5){
                return mid;
            }
            else if (prefixSum[mid] < delta) {
                left = mid + 1; // Move the left boundary to mid + 1
            } else {
                right = mid - 1; // Move the right boundary to mid - 1
            }
        }
        console.log(result)
        return result;
    }

    addExtra(ind,extra, prefixSum){
        for(let i=ind; i < prefixSum.length ;i++){
            if((prefixSum[i] - prefixSum[i-1]) + extra < 10) break;
            prefixSum[i]+=extra;
        }    
    }
}