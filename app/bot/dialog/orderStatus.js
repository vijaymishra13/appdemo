/**
 * Created by VIJAYMI on 1/16/2017.
 */

var builder = require('botbuilder');

var orderStatusService = require('../../services/order-status-service');
var taskService = require('../../services/task-services');


const library = new builder.Library('orderstatus');

const MainOptions = {
  ActivityInfo: 'More info on Current Activity',
  TaskInfo: 'Want info on associated Task'
};

library.dialog('/', [
  function (session, args, next) {

    if(session.message.text.trim().toUpperCase() === MainOptions.ActivityInfo.toUpperCase()) {
      // Activity info
      return session.beginDialog('activityinfo:/');
    }
    else if(session.message.text.trim().toUpperCase() === MainOptions.TaskInfo.toUpperCase()){
      return session.beginDialog('taskinfo:/');
    }

      // Resolve and store any entities passed from LUIS.
      var orderNumber = builder.EntityRecognizer.findEntity(args.entities, 'orderNumber');

      var orderContext = session.dialogData.orderContext = {
        orderNumber: orderNumber ? orderNumber.entity : null
      };

      console.log("Order Number: " + orderContext.orderNumber);
      // Prompt for title
      if (orderContext.orderNumber == null) {
        builder.Prompts.text(session, 'What is the order you are looking for?');
      } else {
        next({response : orderNumber.entity});
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
      session.send('Okay. Let me get information on Order Number ' + orderContext.orderNumber);
      var orderData = orderStatusService.getOrderStatus(orderContext.orderNumber);
      session.dialogData.activityName = orderData.currentActivity;
      var orderStatusCard = new builder.HeroCard(session)
        .title('Order Status')
        .subtitle('Order Number: ' + orderContext.orderNumber)
        .text('This order is for Customer ' + orderData.customerName + ' and started on ' + orderData.orderStart + '\n' +
        ' and currently on Activity ' + orderData.currentActivity + ' for past ' + orderData.timeOnCurrentActivity + '.')
        .images([
          new builder.CardImage(session)
            .url('TBD')
            .alt('Subway Map...!!')
        ])
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
