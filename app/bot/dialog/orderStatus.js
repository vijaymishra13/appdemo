/**
 * Created by VIJAYMI on 1/16/2017.
 */

var builder = require('botbuilder');

var orderStatusService = require('../../services/order-status-service');
var taskService = require('../../services/task-services');


const library = new builder.Library('orderstatus');

const MainOptions = {
  ActivityInfo: 'Info on Current Activity',
  TaskInfo: 'Info on associated Tasks'
};

var activityName;
library.dialog('/', [
  function (session, args, next) {

    if(session.message.text.trim().toUpperCase() === MainOptions.ActivityInfo.toUpperCase()) {
      // Activity info
      session.conversationData.activityName = activityName;
      return session.beginDialog('activityinfo:/');
    }
    else if(session.message.text.trim().toUpperCase() === MainOptions.TaskInfo.toUpperCase()){
      session.conversationData.orderNumber = session.dialogData.orderContext.orderNumber;
      return session.beginDialog('taskinfo:/');
    }
    if(session.message.text.trim().toUpperCase() === 'THANKS'
      || session.message.text.trim().toUpperCase() === 'BYE'
      || session.message.text.trim().toUpperCase() === 'DONE'
      || session.message.text.trim().toUpperCase() === 'OK') {
      // Thanks
      session.send('Have a nice day!');
      return session.endDialogWithResult({result : 'OK'});
    }
    else{
      // Resolve and store any entities passed from LUIS.
      var orderNumber = builder.EntityRecognizer.findEntity(args.entities, 'orderNumber');

      var orderContext = session.dialogData.orderContext = {
        orderNumber: orderNumber ? orderNumber.entity : null
      };

      // Prompt for title
      if (orderContext.orderNumber == null) {
        builder.Prompts.text(session, 'What is the order you are looking for?');
      } else {
        next({response : orderNumber.entity});
      }
    }
  },
  function (session, results, next) {
      var orderContext = session.dialogData.orderContext;
      console.log("Results respone: " + results.response);
      if (results.response) {
        orderContext.orderNumber = results.response;
      }

      // Prompt for time (title will be blank if the user said cancel)
      if (orderContext.orderNumber != null) {
        var orderData = orderStatusService.getOrderStatus(orderContext.orderNumber);

        console.log('orderContext.orderNumber' + orderContext.orderNumber);

        activityName = orderData.currentActivity;
        var orderStatusCard = new builder.HeroCard(session)
          .title('Order Status')
          .subtitle('Order Number: ' + orderContext.orderNumber)
          .text('This order is for Customer ' + orderData.customerName + ' and started on ' + orderData.orderStart + '\n' +
            ' and currently on Activity ' + orderData.currentActivity + ' for past ' + orderData.timeOnCurrentActivity + '.')
          .buttons([
            builder.CardAction.imBack(session, MainOptions.ActivityInfo, MainOptions.ActivityInfo),
            builder.CardAction.imBack(session, MainOptions.TaskInfo, MainOptions.TaskInfo)
          ]);

        session.send(new builder.Message(session)
          .addAttachment(orderStatusCard));

      } else {
        session.send('Ok... no problem.');
      }
  }
]);


module.exports = library;
