/**
 * Created by VIJAYMI on 1/16/2017.
 */
var builder = require('botbuilder');

var connector = new builder.ChatConnector({
  appId: 'a3616594-f309-4ca0-8af1-94880a7114cb',
  appPassword: 'VGKr5wnsUjG4GF7MwkjRAFk'
});

var bot = new builder.UniversalBot(connector, { persistUserData: true, persistConversationData: true });

// LUIS Service for AppSupportDemo LUIS APP
var model = 'https://api.projectoxford.ai/luis/v2.0/apps/f445ce5f-1520-4d0e-aca0-c49f7012a38f?subscription-key=e86a03e6ed394f1098da68f85f380f8e&verbose=true';
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog);


// Add intent handlers
dialog.matches('getOrderStatus', 'orderstatus:/');
dialog.matches('getActivityInfo', 'activityinfo:/');
dialog.matches('getTaskInfo', 'taskdetail:/');
dialog.onDefault([
  function (session, args, next) {
    session.send('Sorry, I did not understand that.');
  }
]);

dialog.matches('greeting', [
  function (session, args, next) {
      session.send('Hello! I am new, so please be patient with me. What can I do for you today? ' +
        'You can say things like "Where is my Order XYZ?" or "What does activity ABC mean?" etc.');
      session.endDialogWithResult({result : 'OK'});
    }
]);


bot.library(require('./dialog/orderStatus'));
bot.library(require('./dialog/support'));
bot.library(require('./dialog/activityInfo'));
bot.library(require('./dialog/taskInfo'));
bot.library(require('./dialog/taskdetail'));

// Connector listener wrapper to capture site url
var connectorListener = connector.listen();
function listen() {
  return function (req, res) {
    // Capture the url for the hosted application
    // We'll later need this url to create the checkout link
    var url = req.protocol + '://' + req.get('host');
    connectorListener(req, res);
  };
}

// Other wrapper functions
function beginDialog(address, dialogId, dialogArgs) {
  bot.beginDialog(address, dialogId, dialogArgs)
}

function sendMessage(message) {
  bot.send(message);
}



module.exports = {
  listen: listen,
  beginDialog: beginDialog,
  sendMessage: sendMessage
};
