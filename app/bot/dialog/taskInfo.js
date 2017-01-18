/**
 * Created by VIJAYMI on 1/16/2017.
 */

var builder = require('botbuilder');
const library = new builder.Library('taskinfo');

var taskService = require('../../services/task-services');

library.dialog('/', [
  function (session, args, next) {
    // Resolve and store any entities passed from LUIS.
    console.log("Session.conversationData : " + JSON.stringify(session.conversationData));
    var orderNumber = session.conversationData.orderNumber;
    if(args ){
      var orderNum = builder.EntityRecognizer.findEntity(args.entities, 'orderNumber');
      if(orderNum != null){
        session.conversationData.orderNumber = orderNum.entity;
      }
    }

    console.log("Order Name: " + session.conversationData.orderNumber);
    // Prompt for title
    if (session.conversationData.orderNumber == null) {
      builder.Prompts.text(session, 'What is the Order Number you are searching task for?');
    } else {
      next({response : session.conversationData.orderNumber});
    }
  },
  function (session, results, next) {
    var orderNumber = session.conversationData.orderNumber;
    console.log("Results respone: " + results.response);
    if (results.response != null) {
      session.conversationData.orderNumber = results.response;
    }

    // Prompt for time (title will be blank if the user said cancel)
    if (session.conversationData.orderNumber != null) {
      var taskList = taskService.getActiveTasks(session.conversationData.orderNumber);
      var taskInfoCard = new builder.HeroCard(session)
        .title('Task Info for Order Number ' + session.conversationData.orderNumber)
        .text('Task ' + taskList[0].taskName + ' is created by ' + taskList[0].source
        + ' and assigned to ' + taskList[0].assignedToWorkgroup );

      session.send(new builder.Message(session)
        .addAttachment(taskInfoCard));

      builder.Prompts.text(session, 'Enter anything to continue...');

    } else {
      session.endDialogWithResult('Since you have not entered an Task, Ignoring this request.');
    }
  }
]);


module.exports = library;
