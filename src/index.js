'use strict';
const Alexa = require("alexa-sdk");

const APP_ID = 'amzn1.ask.skill.8a3c76e9-f99b-4f45-883f-a2dadd42115e'

exports.handler = function(event, context, callback) {
  const alexa = Alexa.handler(event, context);
  alexa.appId = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};

const handlers = {
  'LaunchRequest': function () {
    this.emit('SayHello');
  },
  'HelloWorldIntent': function () {
    this.emit('SayHello')
  },
  'SayHello': function () {
    this.response.speak('Hello World!');
    this.emit(':responseReady');
  },
  'AMAZON.HelpIntent': function () {
    const speechOutput = 'This is the Hello World Sample Skill. ';
    const reprompt = 'Say hello, to hear me speak.';

    this.response.speak(speechOutput).listen(reprompt);
    this.emit(':responseReady');
  },
  'AMAZON.CancelIntent': function () {
    this.response.speak('Goodbye!');
    this.emit(':responseReady');
  },
  'AMAZON.StopIntent': function () {
    this.response.speak('See you later!');
    this.emit(':responseReady');
  }
};