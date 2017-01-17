/**
 * Created by VIJAYMI on 1/16/2017.
 */

var builder = require('botbuilder');
const library = new builder.Library('activityinfo');

var activityService = require('../../services/activity-service');

library.dialog('/', [
  function (session, args, next) {
    // Resolve and store any entities passed from LUIS.
    console.log("Session.DialogData : " + JSON.stringify(session.dialogData));
    var activityName = session.dialogData.activityName;
    if(args ){
      var actName = builder.EntityRecognizer.findEntity(args.entities, 'activityName');
      if(actName != null){
        session.dialogData.activityName = actName.entity;
      }
    }

    console.log("Activity Name: " + session.dialogData.activityName);
    // Prompt for title
    if (session.dialogData.activityName == null) {
      builder.Prompts.text(session, 'What is the Activity you are looking for?');
    } else {
      next({response : session.dialogData.activityName});
    }
  },
  function (session, results, next) {
    var activityName = session.dialogData.activityName;
    console.log("Results respone: " + results.response);
    if (results.response != null) {
      session.dialogData.activityName = results.response;
    }

    // Prompt for time (title will be blank if the user said cancel)
    if (session.dialogData.activityName != null) {
      var activityData = activityService.getActivityInformation(session.dialogData.activityName);
      var activityInfoCard = new builder.HeroCard(session)
        .title('Activity: ' + session.dialogData.activityName)
        .subtitle('Description: ' + activityData.description)
        .text('This Activity is owned by ' + activityData.owner + ' and on average takes ' + activityData.duration.average +
        '. Past records indicates that it may take ' + activityData.duration.fastest + ' to ' + activityData.duration.slowest
        + ' to complete.');

      session.send(new builder.Message(session)
        .addAttachment(activityInfoCard));

      session.endDialogWithResult(activityData);

    } else {
      session.endDialogWithResult('Since you have not entered an Activity, Ignoring this request.');
    }
  }
]);

module.exports = library;
