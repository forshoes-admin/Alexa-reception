// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const request = require('request-promise');

const employeeNumber = (employeeNum) => {
  console.log("employeeNumber関数の中");
  const id = require('./env').spreadsheetID;
  const url = "https://script.google.com/macros/s/" + id +
    "/exec?ticketnumber=" + employeeNum;
  console.log("url:", url);
  return request(url);
};

const replaceWithArabicNumerals = num_string => {
  let arabic_numerals = num_string.replace(/〇/g, "0");
  arabic_numerals = arabic_numerals.replace(/一/g, "1");
  arabic_numerals = arabic_numerals.replace(/二/g, "2");
  arabic_numerals = arabic_numerals.replace(/三/g, "3");
  arabic_numerals = arabic_numerals.replace(/四/g, "4");
  arabic_numerals = arabic_numerals.replace(/五/g, "5");
  arabic_numerals = arabic_numerals.replace(/六/g, "6");
  arabic_numerals = arabic_numerals.replace(/七/g, "7");
  arabic_numerals = arabic_numerals.replace(/八/g, "8");
  arabic_numerals = arabic_numerals.replace(/九/g, "9");
  return arabic_numerals;
};

const EmployeeNumberHandler = {
  canHandle(handlerInput) {

    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'employeeNumber'
      && Alexa.getDialogState(handlerInput.requestEnvelope) !== 'COMPLETED'
  },
  async handle(handlerInput) {
    console.log("employeeNumberHandlerのhandleの中");
    let speechText = "";
    let response = handlerInput.responseBuilder;
    const spoken_numbers = [];
    try {
      spoken_numbers.push(Alexa.getSlotValue(handlerInput.requestEnvelope,
        "first_number"));
      spoken_numbers.push(Alexa.getSlotValue(handlerInput.requestEnvelope,
        "second_number"));
      spoken_numbers.push(Alexa.getSlotValue(handlerInput.requestEnvelope,
        "third_number"));
      spoken_numbers.push(Alexa.getSlotValue(handlerInput.requestEnvelope,
        "fourth_number"));
      spoken_numbers.push(Alexa.getSlotValue(handlerInput.requestEnvelope,
        "fifth_number"));
      spoken_numbers.push(Alexa.getSlotValue(handlerInput.requestEnvelope,
        "sixth_number"));
      spoken_numbers.push(Alexa.getSlotValue(handlerInput.requestEnvelope,
        "seventh_number"));
      spoken_numbers.push(Alexa.getSlotValue(handlerInput.requestEnvelope,
        "eighth_number"));
      let employeeNum = "";
      for (let i = 0; i < 8; i++) {
        console.log("数字：", spoken_numbers[i]);
        if (spoken_numbers[i]) {
          employeeNum += spoken_numbers[i];
        }
      }
      if (!Number.isNaN(employeeNum)) {
        employeeNum = replaceWithArabicNumerals(employeeNum);
      }
      console.log("社員番号:", employeeNum);
      if (isNaN(employeeNum)) {
        speechText = "数字でない";
      } else {
        await employeeNumber(employeeNum)
          .then(val => {
            console.log("speechText: " + val);
            speechText = val;
          })
          .catch(e => console.error(e));
      }

      if (speechText === "missing") {
        console.log("値が取れなかった");
        handlerInput.requestEnvelope.request.intent.slots.first_number.value = undefined;
        handlerInput.requestEnvelope.request.intent.slots.second_number.value = undefined;
        handlerInput.requestEnvelope.request.intent.slots.third_number.value = undefined;
        handlerInput.requestEnvelope.request.intent.slots.fourth_number.value = undefined;
        handlerInput.requestEnvelope.request.intent.slots.fifth_number.value = undefined;
        handlerInput.requestEnvelope.request.intent.slots.sixth_number.value = undefined;
        handlerInput.requestEnvelope.request.intent.slots.seventh_number.value = undefined;
        handlerInput.requestEnvelope.request.intent.slots.eighth_number.value = undefined;
        if (/\?/.test(employeeNum)) {
          speechText = "よくわかりませんでした。受付を始めからやり直してください。";
        } else {
          speechText = "<say-as interpret-as='digits'>" + employeeNum
            + "</say-as>番の社員番号が見つかりません。もう一度言ってもらえますか？";
        }
        response.reprompt(speechText).addElicitSlotDirective("first_number", "second_number", "third_number", "fourth_number",
          "fifth_number", "sixth_number", "seventh_number", "eighth_number");
      } else if (speechText === "数字でない") {
        speechText = "よくわかりませんでした。もう一度言ってもらえますか？";
        response.reprompt(speechText).addElicitSlotDirective("first_number", "second_number", "third_number", "fourth_number",
          "fifth_number", "sixth_number", "seventh_number", "eighth_number");
      }

    } catch (e) {
      console.error(e);
    }
    return response.speak(speechText).getResponse();
  }
};

// 「受付」「受付を開いて」発話時に動く
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    console.log("LaunchRequestHandlerのhandleの中");

    return handlerInput.responseBuilder
      .addDelegateDirective({
        name: 'employeeNumber',
        confirmatioinStatus: 'NONE',
        slots: {}
      })
      .reprompt()
      .getResponse();
  }
};
const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = '何かご用はありますか？';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
};

// 「止めて」「キャンセル」「ストップ」発話時に動く
const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'さようなら！';
    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  }
};

// 「終了」「終わり」発話時に動く
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    // Any cleanup logic goes here.
    return handlerInput.responseBuilder.getResponse();
  }
};

// デバッグ用関数
// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest';
  },
  handle(handlerInput) {
    const intentName = handlerInput.requestEnvelope.request.intent.name;
    const speechText = `${intentName}を起動しました`;

    return handlerInput.responseBuilder
      .speak(speechText)
      //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
      .getResponse();
  }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`~~~~ Error handled: ${error.message}`);
    const speechText = `すみません。何て言っているかわかりませんでした。もう一度言ってもらえますか？`;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    EmployeeNumberHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler)
  //SessionEndedRequestHandler,
  //IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
  .addErrorHandlers(
    ErrorHandler)
  .lambda();
