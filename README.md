# GDOC-Asana

Integración entre Google Sheets y la API REST de Asana (Google Apps Script).

Una serie de scripts de Google Sheets que consultan la API de Asana para obtener campos
personalizados de un proyecto y su última actualización, parsean la respuesta JSON y vuelcan
el resultado en la planilla.

## Archivos

| Archivo | Qué hace |
| --- | --- |
| `CustomerTalk-2.gs` | GET `/projects/{project_gid}/tasks`: trae las tareas del proyecto y su `due_on` / notas |
| `UpdateCustomerTalkDueDate.gs` | GET + PUT sobre las tareas para actualizar fechas de vencimiento |
| `AutomaticSender.gs` | Envía por correo el reporte generado, autenticando con el token OAuth del propio script (`ScriptApp.getOAuthToken()`) |

## Configuración

1. Crear el proyecto de Apps Script asociado a la planilla (Extensiones > Apps Script) y pegar los `.gs`.
2. Cargar el token de Asana como propiedad del script — **nunca en el código**:
   *Archivo > Configuración del proyecto > Propiedades de la secuencia de comandos* → nueva propiedad
   `ASANA_TOKEN` con un Personal Access Token de Asana.
3. Autorizar los permisos cuando el script los pida (uso de `UrlFetchApp` y `ScriptApp`).
4. Ajustar el `project_gid` del proyecto de Asana que se quiera consultar.

## Notas

- El proyecto original usaba un token embebido en el código; quedó revocado y reemplazado por la
  lectura desde propiedades del script.
