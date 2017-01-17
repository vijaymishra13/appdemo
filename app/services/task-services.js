/**
 * Created by VIJAYMI on 1/16/2017.
 */


function getActiveTasks (ordernumber) {
  return taskList;
}

var taskList = [
  {
    "taskName": "Arrange_for_CPE_Return",
    "roleName": "Tier 1-5",
    "taskType": "MANUAL",
    "createdBy": "N/A",
    "escalationLevel": "0",
    "expediteInd": false,
    "createdDate": 1427123882115,
    "deferredInd": "N",
    "subStatus": "FAILED",
    "taskTicketSystem": "CTH",
    "assignedToWorkgroup": "FOBPM-CAMO",
    "id": 2070735,
    "priority": "NORMAL",
    "source": "CTH",
    "status": "READY",
    "serviceType": "BVOIP"
  },
  {
    "taskName": "Arrange_for_CPE_Return",
    "roleName": "Tier 1-5",
    "taskType": "MANUAL",
    "createdBy": "N/A",
    "escalationLevel": "0",
    "expediteInd": false,
    "createdDate": 1427123440998,
    "deferredInd": "N",
    "subStatus": "FAILED",
    "taskTicketSystem": "CTH",
    "assignedToWorkgroup": "FOBPM-CAMO",
    "sourceSystemId": "FOBPM-CAMO",
    "id": 2070667,
    "priority": "NORMAL",
    "source": "CTH",
    "status": "READY",
    "serviceType": "BVOIP"
  }
];

module.exports = {
  getActiveTasks: getActiveTasks
};
