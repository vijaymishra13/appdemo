/**
 * Created by VIJAYMI on 1/16/2017.
 */
var builder = require('botbuilder');

const library = new builder.Library('support');
library.dialog('/', builder.DialogAction.endDialog('Support will contact you shortly. Have a nice day :)'));

module.exports = library;
