/**
 * Created by VIJAYMI on 1/16/2017.
 */

var builder = require('botbuilder');
const library = new builder.Library('activityinfo');

var activityService = require('../../services/activity-service');

library.dialog('/', [
  function (session, args, next) {
    // Resolve and store any entities passed from LUIS.
    console.log("Session.conversationData : " + JSON.stringify(session.conversationData));
    var activityName = session.conversationData.activityName;
    if(args ){
      var actName = builder.EntityRecognizer.findEntity(args.entities, 'activityName');
      if(actName != null){
        session.conversationData.activityName = actName.entity;
      }
    }

    console.log("Activity Name: " + session.conversationData.activityName);
    // Prompt for title
    if (session.conversationData.activityName == null) {
      builder.Prompts.text(session, 'What is the Activity you are looking for?');
    } else {
      next({response : session.conversationData.activityName});
    }
  },
  function (session, results, next) {
    var activityName = session.conversationData.activityName;
    console.log("Results respone: " + results.response);
    if (results.response != null) {
      session.conversationData.activityName = results.response;
    }

    // Prompt for time (title will be blank if the user said cancel)
    if (session.conversationData.activityName != null) {
      var activityData = activityService.getActivityInformation(session.conversationData.activityName);
      var activityInfoCard = new builder.HeroCard(session)
        .title('Activity: ' + session.conversationData.activityName)
        .subtitle('Description: ' + activityData.description)
        .text('This Activity is owned by ' + activityData.owner + ' and on average takes ' + activityData.duration.average +
        '. Past records indicates that it may take ' + activityData.duration.fastest + ' to ' + activityData.duration.slowest
        + ' to complete.');

      session.send(new builder.Message(session)
        .addAttachment(activityInfoCard));

      builder.Prompts.text(session, 'Enter Ok to continue...');

    } else {
      session.endDialogWithResult('Since you have not entered an Activity, Ignoring this request.');
    }
  }
]);

module.exports = library;
