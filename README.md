# RoboBank-backend
# This is an assignment for read csv and validate data in csv, made using node.js
Req: User can import any csv file(structure of csv is attached here, records.csv) and it will validate the data.
#There are two validations:
1. all transaction references should be unique
2. the end balance needs to be validated

and eventually it will display the failed records.

UI workflow:
1. This is an local project, so user need to run node server using "node server.js" command in root folder.
2. User need to run http://localhost:2000/ and import csv file.
3. This will upload that csv file in server and will read that csv file.
4. It will validate transaction reference with duplicate records. 
5. Also validate end balance matching with start balance + mutation.

Code workflow:
npm package used: "csvtojson","express","multer",
1. Import csv from index.html and uploading using multer package.
2. Convert those string into json using csvtojson package.
3. validating end balance and duplicate records and sending those to UI in Array of objects format.

