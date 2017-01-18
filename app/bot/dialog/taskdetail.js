/**
 * Created by VIJAYMI on 1/16/2017.
 */

var builder = require('botbuilder');
const library = new builder.Library('taskdetail');

var taskService = require('../../services/task-services');

library.dialog('/', [
  function (session, args, next) {
    // Resolve and store any entities passed from LUIS.
    console.log("Session.conversationData : " + JSON.stringify(session.conversationData));
    var orderNumber = session.conversationData.orderNumber;
    if(args ){
      var taskIdNum = builder.EntityRecognizer.findEntity(args.entities, 'taskId');
      if(taskIdNum != null){
        session.dialogData.taskId = taskIdNum.entity;
      }
    }

    console.log("Task Id: " + session.dialogData.taskId);
    // Prompt for title
    if (session.dialogData.taskId == null) {
      builder.Prompts.text(session, 'What is the Task you are searching task for?');
    } else {
      next({response : session.dialogData.taskId});
    }
  },
  function (session, results, next) {

    console.log("Results respone: " + results.response);
    if (results.response != null) {
      session.dialogData.taskId= results.response;
    }

    // Prompt for time (title will be blank if the user said cancel)
    if (session.dialogData.taskId != null) {
      var taskList = taskService.getActiveTasks(session.dialogData.taskId);
      var taskInfoCard = new builder.HeroCard(session)
        .title('Task Information' + session.dialogData.taskId)
        .text('Task ' + taskList[0].taskName + ' is created by ' + taskList[0].source
        + ' and assigned to ' + taskList[0].assignedToWorkgroup );

      session.send(new builder.Message(session)
        .addAttachment(taskInfoCard));

    } else {
      session.endDialogWithResult('Since you have not entered an Task, Ignoring this request.');
    }
  }
]);


module.exports = library;
