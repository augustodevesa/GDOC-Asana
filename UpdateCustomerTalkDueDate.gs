
// Token de Asana: NO hardcodear acá.
// Se lee de las propiedades del script:
//   Archivo > Configuración del proyecto > Propiedades de la secuencia de comandos
//   -> nueva propiedad ASANA_TOKEN
// `var` en el nivel superior es global para todo el proyecto de Apps Script,
// por eso se declara una sola vez acá y lo usan los demás archivos.
var ASANA_TOKEN = PropertiesService.getScriptProperties().getProperty('ASANA_TOKEN');

function getCustomerTalkDueDatefromPoroject () {
  var member_projectgid = '1146617433973325';
  var customerTalkDueDate = "nul";
  
  var CToptions = {
  "method": 'GET',
   "headers" : {
     "Authorization": "Bearer " + ASANA_TOKEN
   }
  }
  var CTtaskID = [];
  
  var CTProjectResponse = UrlFetchApp.fetch("https://app.asana.com/api/1.0/projects/"+ member_projectgid +"/tasks", CToptions);
  //Logger.log(CTProjectResponse);
  var CTProjectData = JSON.parse(CTProjectResponse.getContentText()); //
  var CTProjectDataSet = CTProjectData.data; // "data" is the key containing the relevant objects
  
  
  for(i=0; i< CTProjectDataSet.length ; i++){
  
    if (CTProjectDataSet[i].name == "Customer talk"){
    CTtaskID = CTProjectDataSet[i].gid
    }
    
  }
  
  // se lanza el GET al API  
    var response = UrlFetchApp.fetch("https://app.asana.com/api/1.0/tasks/"+ CTtaskID, CToptions);
  
    // se parsea la respuesta JSON en Data all, 
    var dataRaw = JSON.parse(response.getContentText()); //
    var dataSet = dataRaw.data; // "data" is the key containing the relevant objects
    Logger.log(dataRaw.title);
    customerTalkDueDate = dataSet.due_on;
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = ss.getSheets();
    var sheet = ss.getSheetByName("TEST");
    var dataRange = sheet.getRange("A2:B2");
    var values = [];
 
  values.push([customerTalkDueDate,dataSet.due_on])
  dataRange.setValues(values);
  
 
  /*
    // "due_on": customerTalkDueDate,
      //"completed": false,
var body = {"data":{"due_on":"2020-04-31",}};
  
  var params = {
    "method": 'PUT',
    "headers" : {
     "Authorization": "Bearer " + ASANA_TOKEN
   },
   // contentType: 'application/json',
    //Accept: 'application/json,
    
    payload:body,
  };
  
var response = UrlFetchApp.fetch("https://app.asana.com/api/1.0/tasks/"+ CTtaskID, params);
  Logger.log(response);
  if (response.getResponseCode() >= 400) {
  // Error encountered, send an email alert to the developer
  Logger.log(response);
  }
  
  */
  //return  customerTalkDueDate;
  
  
  
}
