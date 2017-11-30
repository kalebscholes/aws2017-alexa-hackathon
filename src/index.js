'use strict'

const axios = require('axios')
const Alexa = require('alexa-sdk')
const APP_ID = process.env.APP_ID
const API_URI = process.env.API_URI || 'https://alexa-hackathon.now.sh'

exports.handler = function (event, context, callback) {
  const alexa = Alexa.handler(event, context)
  alexa.appId = APP_ID
  alexa.registerHandlers(handlers)
  alexa.execute()
}

const handlers = {

  'Error': function () {
    this.emit(':tell', `Looks like we're having some minor issues...`)
  },

  'Welcome': function (val) {
    console.log(`Welcome, ${val}! Thanks!`)
    this.emit(':tell', `Welcome, ${val}! Thanks!`)
  },

  'CheckInIntent': function () {
    this.emit('CheckIn')
  },

  'Unhandled' : function(){
    this.emit('Error')
  },

  'CheckIn': function () {

    const url = `${API_URI}/take/picture`
    console.log('url', url)

    axios.get(url, {
      timeout: 25000
    })
      .then((res) => {
        console.log('res', res)

        if (res && res.data && res.data.result) {

          let result = res.data.result
          if (result === 'NO_MATCH'){
            this.emit('RegisterPrompt')
          }else if (result === 'MATCHED'){

            let name = res.data.matches[0].Face.ExternalImageId
            this.emit('Welcome', name)

          }else{
            this.emit('Error')
          }
        } else {
          this.emit('Error')
        }
      })
      .catch((err) => {
        console.error(err)
        this.emit('Error')
      })
  },

  'CheckOut': function () {
    this.response.speak('Checked out!')
    this.emit(':responseReady')
  },

  'CheckOutIntent': function () {
    this.emit('CheckOut')
  },

  'RegisterIntent': function () {
    this.emit('RegisterPrompt')
  },

  'RegisterWithNameIntent': function () {
    this.emit('RegisterWithName')
  },

  'RegisterPrompt': function () {
    this.response.speak('It looks like you need to register!')
      .listen(`What's your name?`)
    this.emit(':responseReady')
  },

  'RegisterWithName': function () {

    const name = this.event.request.intent.slots.FirstName.value
    const url = `${API_URI}/register/${name}`

    console.log('url', url)

    axios.get(url, {
      timeout: 25000
    })
      .then((res) => {

        if (res && res.data && res.data.result) {

          let result = res.data.result
          if (result === 'ADDED'){
            this.emit('Welcome', res.data.name)
          }else{
            this.emit('Error')
          }
        } else {
          this.emit('Error')
        }
      })
      .catch((err) => {
        console.error(err)
        this.emit('Error')
      })
  },

  'AMAZON.HelpIntent': function () {
    const speechOutput = 'This is the Hello World Sample Skill. '
    const reprompt = 'Say hello, to hear me speak.'

    this.response.speak(speechOutput).listen(reprompt)
    this.emit(':responseReady')
  },
  'AMAZON.CancelIntent': function () {
    this.response.speak('Goodbye!')
    this.emit(':responseReady')
  },
  'AMAZON.StopIntent': function () {
    this.response.speak('See you later!')
    this.emit(':responseReady')
  }
}
