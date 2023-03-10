const pd = require("paralleldots");
const path = require("path");
const {config} = require('dotenv');
config();
pd.apiKey = process.env.PARALLEL_DOTS_API_KEY;
function getMaxValueKey(obj) {
  let max = 0;
  let key = "";
  for (let k in obj) {
    if (obj[k] > max) {
      max = obj[k];
      key = k;
    }
  }
  return [key, max];
}
const sentiment = async (str) => {  
  var intent = await pd
    .intent(str)
    .then((response) => {
      response = JSON.parse(response);
      response = response.intent;
      response = getMaxValueKey(response);
      let score = Math.round(response[1] * 100);
      return { emotion: response[0], score: score };
    })
    .catch((error) => {
      return { error: error };
    });

  var keywords = await pd
    .keywords(str)
    .then((response) => {
      response = JSON.parse(response);
      response = response.keywords;
      response = Object.values(response);
      // console.log(response[0].length)
      if(response[0].length == 0){
        response = [];
        // console.log(response)
      }
      return response;
    })
    .catch((error) => {
      return { error: error };
    });
    var emotion = await pd
  .emotion(str)
  .then((response) => {
    response = JSON.parse(response);
    response = response.emotion;
    response = getMaxValueKey(response);
    let score = Math.round(response[1] * 100);
    return { emotion: response[0], score: score };
  }).catch((error) => {
    return { error: error };
  });

  return { intent: intent, keywords: keywords, emotion: emotion };
};
exports.sentiment = sentiment;
