const functions = require('firebase-functions');
const request = require('request-promise');

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
const LINE_HEADER = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ljseDn2VwXhoMyXSqscL4cGpmvY8/RHFaJLsac8RvLTa92+tonmfCXn5wItdytiHHCC2M7YGE1WTwvw46UqJC8AL/6uV5ZuDzihb7UeqcHzy0Yng9sowMGwODTaJOugDEX3rjkwCijlObkkN7CpazAdB04t89/1O/w1cDnyilFU=`
};

exports.webhook = functions.https.onRequest((req, res) => {
  if (req.method === "POST") {
    let event = req.body.events[0]
    if (event.type === "message" && event.message.type === "text") {
      postToDialogflow(req);
    } else {
      reply(req);
    }
  }
  return res.status(200).send(req.method);
});

const reply = req => {
  return request.post({
    uri: `${LINE_MESSAGING_API}/reply`,
    headers: LINE_HEADER,
    body: JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      messages: [
        {
          type: "text",
          text: JSON.stringify(req.body)
        }
      ]
    })
  });
};

const postToDialogflow = req => {
  req.headers.host = "bots.dialogflow.com";
  return request.post({
    uri: "https://bots.dialogflow.com/line/f3381d15-6273-4596-9e03-2317f3d98c66/webhook",
    headers: req.headers,
    body: JSON.stringify(req.body)
  });
};