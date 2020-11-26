let express =   require("express");  
let multer  =   require('multer');  
let csv = require('csvtojson');
let app =   express();

let storage =   multer.diskStorage({  
  destination: function (req, file, callback) {  
    callback(null, './assets');  
  },  
  filename: function (req, file, callback) {  
    callback(null, file.originalname);  
  }  
});  
let upload = multer({ storage : storage}).single('myfile');  
  
app.get('/',function(req,res){  
  res.sendFile(__dirname + "/index.html");  
});  

app.post('/upload',function(req,res){  
    upload(req,res,function(err) {
        let filePath = req.file.path;
        if(err) {  
            return res.end("Error uploading file.");  
        } else {
          csv().fromFile(filePath)
          .then((jsonData)=>{
            res.send(calculateCsvData(jsonData));
          });
        }
    });  
});  
  
app.listen(2000,function(){  
    console.log("Server is running on port 2000");  
}); 

function calculateCsvData(jsonData) {
  let endBalanceValidation = jsonData.filter((obj) => {
    let endBal = Number(obj['End Balance']);
    let startBal = Number(obj['Start Balance']);
    let mutation = Number(obj['Mutation']);
    let startAndMutation = Number((startBal + mutation).toFixed(2));
    return endBal !== startAndMutation;
  });

  let arrayOfRefs = jsonData.map(data => data['Reference']);
  let findDuplicates = [...new Set(arrayOfRefs.filter((item, index) => arrayOfRefs.indexOf(item) != index))];

  let referenceValidation = [];
  if (findDuplicates.length > 0) {
    referenceValidation = jsonData.filter((obj) => {
      return findDuplicates.includes(obj['Reference']);
    });
  }
  const validationError = [
    createReport(endBalanceValidation, 'Report for balance validation failed:'),
    createReport(referenceValidation, 'Report for duplicate reference number:')
  ];
  return validationError;
}

function createReport(arr, key) {
  let tempArray;
  if(arr.length > 0) {
    tempArray = arr.map(data => {
      return [data['Reference'], data['Description']]; 
    });
  } else {
    tempArray = 0;
  }
  let obj = {};
  obj[key] = tempArray;
  return obj;
}