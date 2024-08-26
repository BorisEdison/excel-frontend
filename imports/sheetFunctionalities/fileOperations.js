export class fileOperations {
    constructor(dimension) {
        this.dimension = dimension;

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
            this.getFile(this.dimension.topIndex, (this.dimension.bottomIndex - this.dimension.topIndex));
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
            console.log(res);
             
        } catch (error) {
            console.error('could not get items');
        }
      }
}