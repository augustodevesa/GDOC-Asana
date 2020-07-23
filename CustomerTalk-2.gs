
function getAsanaDueOnandNotes_fromTask() {

  // logeo en Asana con TOKEN

var options = {
  'method': 'GET',
   "headers" : {
     "Authorization": "Bearer 0/ce2980f6eb47a8cf245b594cdd0a5e5a"
   }
  };

// preparo la consulta al API por ProjectID
 var projectgID = '1152281378091939'; // ID del proyecto Macro Cora
  var member_projectgid="nul";
  var customerTalkDueDate = "nada";

 // se lanza el GET al API
 var ProjectResponse = UrlFetchApp.fetch("https://app.asana.com/api/1.0/projects/"+ projectgID +"/tasks", options);
// se parsea la respuesta JSON en Data all,
 var ProjectData = JSON.parse(ProjectResponse.getContentText()); //
 var ProjectDataSet = ProjectData.data; // "data" is the key containing the relevant objects
 Logger.log(ProjectData);

  // Se prepara el documento para marcar los registros
  //var ss = SpreadsheetApp.getActiveSpreadsheet();
  //var sheets = ss.getSheets();
  var spreadsheetId = '1v4Z-kSocW7hk0zhlVAGquosNIjBaMAZUJxV-emB3uWs';
  var ss = SpreadsheetApp.openById(spreadsheetId);
  var sheet = ss.getSheetByName("Data");
  //var taskIDlistRange = sheet.getRange("A2:A4"); //rango de la lista de ID de tareas
  var dataRange = sheet.getRange("A2:G23"); // rango destino donde voy a poner los datos
  //var taskIDlist = taskIDlistRange.getValues();
  var taskIDlist = [];
  var row = [];
  var taskgID;
  var serviceList = [];
  var service = {
    member_project_gid : 1234,
    member_project_name : "BRT.YYY.XYYY",
    customerTalkDueDate : "fecha",
    id_cliente : "codigo",
    id_IGN : "circuitID",
    cliente_jp : "juanpacopedro",
    cliente_idm : "juan-idm",
    location : "",
    service_status : "in Progress",
    service_notes : "notas",
    service_customerTalk_duedate : "XX/XX/XXXX",
    LCON : "john Doe , john@doe.com, tel:55-555-5555"
    
  };

  dataRange.clear();

  for(i=0; i< ProjectDataSet.length ; i++){
  taskIDlist.push(ProjectDataSet[i].gid);
  }

  for (var i in taskIDlist) {
    taskgID = taskIDlist[i];
    // se lanza el GET al API
    var response = UrlFetchApp.fetch("https://app.asana.com/api/1.0/tasks/"+ taskgID, options);
    // se parsea la respuesta JSON en Data all,
    var dataAll = JSON.parse(response.getContentText()); //
    var dataSet = dataAll.data; // "data" is the key containing the relevant objects
    Logger.log(dataAll.title);

    //member_projectgid = dataSet.memberships[0].project.gid;
    
    //if (dataSet.memberships.lenght > 1){
      
    
    for (var i in dataSet.memberships) {
      if (dataSet.memberships[i].project.name != "Macro CORA"){
        service.member_project_name = dataSet.memberships[i].project.name;
        service.member_project_gid = dataSet.memberships[i].project.gid;

      }
      else {
        service.service_status = dataSet.memberships[i].section.name;
      }
    }
    
    

    for (var i in dataSet.custom_fields){
      if (dataSet.custom_fields[i].name == "Identificador")
        service.id_cliente = dataSet.custom_fields[i].text_value;
      if (dataSet.custom_fields[i].name == "Circuit ID")
        service.id_IGN = dataSet.custom_fields[i].text_value;
      if (dataSet.custom_fields[i].name == "Jefe de Proyecto")
        service.cliente_jp = dataSet.custom_fields[i].text_value;
      if (dataSet.custom_fields[i].name == "IDM")
        service.cliente_idm = dataSet.custom_fields[i].text_value;
      if (dataSet.custom_fields[i].name == "Location")
        service.location = dataSet.custom_fields[i].text_value;
      if (dataSet.custom_fields[i].name == "Cto Local")
        service.LCON = dataSet.custom_fields[i].text_value;

    }

    service.service_notes = dataSet.notes;
    service.service_customerTalk_duedate = getCustomerTalkDueDate(service.member_project_gid);
    
    //customerTalkDueDate = getCustomerTalkDueDate(member_projectgid);
    serviceList.push(service);
    row.push([
              service.id_IGN,
              service.id_cliente,
              service.cliente_idm,
              service.location,
              service.service_customerTalk_duedate,
              service.service_status,
              service.service_notes]);
    //}
  
  }

  dataRange.setValues(row);

}



function getCustomerTalkDueDate(member_projectgid) {
  //var member_projectgid = '1152217722311886';
  var CTalkDueDate = "nul";

  var CToptions = {
  "method": 'GET',
   "headers" : {
     "Authorization": "Bearer 0/ce2980f6eb47a8cf245b594cdd0a5e5a"
   }
  };

  var CTtaskID;

  //Lanzo la peticion al API para obnetner todas las
  var CTProjectResponse = UrlFetchApp.fetch("https://app.asana.com/api/1.0/projects/"+ member_projectgid +"/tasks", CToptions);
  //Logger.log(CTProjectResponse);
  var CTProjectData = JSON.parse(CTProjectResponse.getContentText()); //
  var CTProjectDataSet = CTProjectData.data; // "data" is the key containing the relevant objects

  for(i=0; i< CTProjectDataSet.length ; i++){

    if (CTProjectDataSet[i].name == "Customer talk"){
     CTtaskID = CTProjectDataSet[i].gid;
     break;
     }

   }

    // se lanza el GET al API  para obtener el dueDate
    var response = UrlFetchApp.fetch("https://app.asana.com/api/1.0/tasks/"+ CTtaskID, CToptions);
    // se parsea la respuesta JSON en Data all,
    var CTdataRaw = JSON.parse(response.getContentText()); //
    var CTdataSet = CTdataRaw.data; // "data" is the key containing the relevant objects
    Logger.log(CTdataRaw.title);
    CTalkDueDate = CTdataSet.due_on;
    return  CTalkDueDate;
}
