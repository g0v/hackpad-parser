
let Hackpad = require('hackpad');
let cheerio = require('cheerio');
let Progress = require('progress');
let config = require('./config');


let hackpadClient = new Hackpad(config.client, config.secret, config.hackpad);

hackpadClient.list((err, pads) => {
    if(err) {
      console.log('List hackpad Error:' + err);
    } else {
      // console.log(pads);

      if (pads.indexOf("oRZkK1AwGfP")) {
        console.log("Yes");
      }

      let bar = new Progress('downloading [:bar] :percent :etas', {total: pads.length});

      let padResultList = [];

      let padResult = {};

      pads.forEach((padId, i) => {
        setTimeout(ParsePadList, 500 * i, padId, (padResult) => {
          if (Object.keys(padResult).length !== 0) {
            padResultList.push(padResult);
            console.log(padResultList);
          }
          bar.tick();
        });
      });
    }
});

let ParsePadList = (padId, callBack) => {

  hackpadClient.export(padId, 'latest', 'html', function (err, result) {
    if (err) {
      console.log(padId + ' error: ' + err);
      process.exit(1);
    } else {
      // console.log(result);

      let isProject = false;
      let padResult = {};
      let $ = cheerio.load(result);

      $("h2").each((i, el) => {
        if ($(el).text().indexOf("專案簡介") >= 0){
          isProject = true;
        }
      });

      if (isProject) {
        console.log(`Id: ${padId} Name: ${$("h1").text()}`);
        padResult["project"] = $("h1").text();
        padResult["id"] = padId;
      }

      callBack(padResult);
    }
  });
}
