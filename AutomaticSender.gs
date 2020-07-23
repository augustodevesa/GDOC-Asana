/* exported userActionCreateReport */

function userActionCreateReport() {
  var spreadsheetId = '1v4Z-kSocW7hk0zhlVAGquosNIjBaMAZUJxV-emB3uWs';
  var ss = SpreadsheetApp.openById(spreadsheetId);
  var sheetMatrizContacto = ss.getSheetByName("Matriz_de_contacto");
  var ContactdataRange = sheetMatrizContacto.getRange("C2:C40"); // rango origen donde obtengo los datos
  var sheetReport = ss.getSheetByName("Report");
  var dirDestinationId = '1ROX0XT75sK4i5TZZ3TeQ9IGmJWpv1csC'; // ID de mi carpeta en Drive de Cora donde almacerare el reporte
  
  var report = exportSpreadsheet_(spreadsheetId,sheetReport.getSheetId());
  //var recipient = ContactdataRange.getValues(); 
  var recipient_int = "mzecchi@ignetworks.com,emoreno@ignetworks.com,mtorres@ignetworks.com,mparedes@ignetworks.com,jelopez@ignetworks.com,adevesa@ignetworks.com,egoapper@ignetworks.com,jgonzalez@ignetworks.com,mfiguerero@ignetworks.com,gsimonetta@ignetworks.com,dhenriques@ignetworks.com";
  //var recipient_int = "adevesa@ignetworks.com";
  var recipient_ext = "juan.barrado@bt.com,alfredo.gutierrez@bt.com,josemaria.naranjo@bt.com,daniel.chacon@bt.com,miguel.paramio@bt.com, sergio.calvogonzalez@bt.com,juanmanuel.fuertesarribas@bt.com,francisco.manzano@bt.com,daniel.gonzalezrodriguez@bt.com,teresa.alcazar@bt.com,laura.2.lopezhuerga@bt.com,aurora.perez@bt.com,alona.rodriguez@bt.com,alberto.sanchezrodriguez@bt.com,carmen.morenogomez@bt.com,alberto.garciaserrano@bt.com,antonio.cantonlara@bt.com,claudia.garza@bt.com,concepcion.garciagarcia@bt.com,josemaria.lluesma@bt.com,ivan.martinlorenzo@bt.com,orlandoanmir.perezvarela@bt.com,luis.cardiel@bt.com,didier.pinar@bt.com,david.estebanrodriguez@bt.com,lauramaria.lafuente@bt.com,macarena.sanchez@bt.com,fanni.edelenyi-szabo@bt.com,stevan.samardzic@bt.com";
  
  saveBlobToFile_( report,
    Utilities.formatString(
      //'CORA Installation report of %s.pdf',
      'CORA Installation report of %s.xlsx',
      Utilities.formatDate(
        new Date(),
        Session.getScriptTimeZone(),
        'yyyy-MM-dd'
      )
    ),
    dirDestinationId
  );
  mailPdf_(recipient_int, 'CORA Weekly Installation Report ', 'Equipo, adjunto se envia el reporte Project Tracker actualizado', report);
  mailPdf_(recipient_ext, 'CORA Weekly Installation Report ', 'Equipo, adjunto se envia el reporte Project Tracker actualizado', report);
}

/**
 * https://gist.github.com/Spencer-Easton/78f9867a691e549c9c70
 */

function exportSpreadsheet_(spreadsheetId,sheetGid) {
  var url =
    'https://docs.google.com/spreadsheets/d/' +
    spreadsheetId +
    '/export' +
    '?format=xlsx&'
    //'?format=pdf&' +
    //'size=7&' +
    //'fzr=true&' +
    //'portrait=false&' +
    //'fitw=true&' +
    //'gridlines=false&' +
    //'printtitle=true&' +
    //'sheetnames=true&' +
    //'attachment=true&' +
    'gid=' + sheetGid
    ;

  var params = {
    method: 'GET',
    headers: { authorization: 'Bearer ' + ScriptApp.getOAuthToken() }
  };

  var response = UrlFetchApp.fetch(url, params).getBlob();
  return response;
}


/**
 * Saves the blob as a file
 * @param {GoogleAppsScript.Base.Blob} blob
 * @param {string?} newName
 * @param {string?} dirDestinationId
 */
function saveBlobToFile_(blob, newName, dirDestinationId) {
  var rootFolder = dirDestinationId
    ? DriveApp.getFolderById(dirDestinationId)
    : DriveApp.getRootFolder();
  if (newName) blob.setName(newName);
  return rootFolder.createFile(blob);
}

/**
 * Emails the blob
 * @param {string} email
 * @param {string} subject
 * @param {string} body
 * @param {GoogleAppsScript.Base.Blob} blob
 */
function mailPdf_(email, subject, body, blob) {
  MailApp.sendEmail(email, subject, body, {
    attachments: [
      {
        fileName: blob.getName() || 'undefined',
        content: blob.getBytes(),
        mimeType: 'application/MICROSOFT_EXCEL'
      }
    ]
  });
}



