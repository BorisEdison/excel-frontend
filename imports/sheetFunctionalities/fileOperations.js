export class fileOperations {
    constructor(dimension,mainGrid) {
        this.dimension = dimension;
        this.mainGrid = mainGrid
        this.init();
    }

    init() {
        document.querySelector('.file-upload-btn').addEventListener('change',  (e) => {
            if (e.target.files[0]) {
                 this.uploadFile(e.target.files[0])
            }
          });
    }

    async uploadFile(file) {
      let response;
      let formData = new FormData();        
      formData.append("csvFile", file);
      try {
          response = await fetch('https://localhost:7220/controller/uploadCsv', 
              {
              method: "POST", 
              body: formData
              }
          );    
        if(!response.ok){
          const errorText = await response.text();
          console.error('Server responded with an error');
          alert('Failed to upload the file');
        } else {
          alert('The file has been uploaded successfully.');

          // get file from database
          await this.getFile(this.dimension.topIndex, 100);
          this.mainGrid.render();
        }
      } catch (error) {
        console.error('could not connect to server');
        alert('could not connect to server');
      }
    } 

    async getFile(offset, limit){
      let response;
      let range = {
          "limit": limit,
          "offset": offset
      };        
      try {
          response = await fetch('https://localhost:7220/controller/getCsv',
              {
                  method: "POST",
                  headers: {
                      'Content-Type': 'application/json', 
                  },
                  body: JSON.stringify(range),
              }
          ); 
          const res = await response.json();
          var values = res.map(item => Object.values(item))
          for(var i = offset ; i < limit ; i++){
            console.log(i)
            for(var j = 0; j<values[0].length; j++){
              this.mainGrid.mainCells[i][j].value = values[i-offset][j] 
            }
          }
      } catch (error) {
          console.error('could not get items');
      }
    }
}