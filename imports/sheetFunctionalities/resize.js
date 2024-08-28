export class resize{
    constructor(dimension,mainGrid,topGrid,sideGrid){
        this.dimension=dimension;
        this.mainGrid=mainGrid;
        this.topGrid=topGrid;
        this.sideGrid=sideGrid;

        this.isMouseDown=false;
        this.ind=-1;

        this.addEventListner();
    }

    addEventListner(){
        window.addEventListener('mousemove',this.mouseMove.bind(this))
        this.topGrid.topCanvas.addEventListener('mousedown',this.mouseDown.bind(this))
        this.sideGrid.sideCanvas.addEventListener('mousedown',this.mouseDown.bind(this))
        window.addEventListener('mouseup',this.mouseUp.bind(this))
    }
    
    mouseDown(evt){
        this.isMouseDown=true;
    }

    mouseUp(evt){
        this.isMouseDown=false;
    }

    mouseMove(evt){
        if(this.isMouseDown){
            if(this.ind!=-1){
                this.topGrid.topCanvas.style.cursor="col-resize";
                this.addExtra(this.ind,evt.movementX);

                this.mainGrid.render();
                this.topGrid.render();
            }
        }
        else{
            this.getMovingColNumber(evt);
            if(this.ind==-1){
                this.topGrid.topCanvas.style.cursor="default";
            }
            else{
                this.topGrid.topCanvas.style.cursor="col-resize";
            }
        }
    }

    getMovingColNumber(evt){
        let distance= evt.clientX - this.topGrid.rect.left + this.dimension.shiftLeft;
        this.ind=this.findResizeIndex(distance);
    }


    findResizeIndex(distance){
        if(distance<=5){
            return -1;
        }
        
        let left = 0;
        let right = this.dimension.cWidthPrefixSum.length - 1;
        let result = -1;

        while (left <= right) {
            let mid = Math.floor((left + right) / 2);

            if(distance >= this.dimension.cWidthPrefixSum[mid]-5 && distance <= this.dimension.cWidthPrefixSum[mid]+5){
                return mid;
            }
            else if (this.dimension.cWidthPrefixSum[mid] < distance) {
                left = mid + 1; // Move the left boundary to mid + 1
            } else {
                right = mid - 1; // Move the right boundary to mid - 1
            }
        }

        return result;
    }

    addExtra(ind,extra){
        for(let i=ind;i<this.dimension.cWidthPrefixSum.length;i++){
            if((this.dimension.cWidthPrefixSum[i] - this.dimension.cWidthPrefixSum[i-1]) + extra < 30) break;
            this.dimension.cWidthPrefixSum[i]+=extra;
        }    
    }
}