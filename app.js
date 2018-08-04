const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const Airtable = require('airtable');

const configs = require('./configs');

const app = express();
app.use(bodyParser.json());

const base = new Airtable({apiKey: configs.airtable.apiKey}).base("apprdRz3g2BNFzkj6")(configs.airtable.tableName);

app.get('/', (req, res) => {
  console.log('Testing server logs');
  
  base.select({
    view: 'Grid view'
  }).firstPage((err, records) => {
    if (err) {
      res.status(500).json({err});
    } else {
      res.status(200).json({message: 'Fetch records successfully', records});
    }
  });
});

app.post('/sms', (req, res) => {
  let SUCCESS_CODE = "00";
  let speedSmsOptions = {
    url: 'https://api.speedsms.vn/index.php/sms/send',
    auth: {
      'user': configs.speedsmsAccessToken,
      'pass': '123@123a'
    },
    headers: { 'Content-Type': 'application/json' },
    json: req.body
  };

  request.post(
    speedSmsOptions,
    (err, response, body) => {
      if (err) {
        res.status(500).json({message: 'Send sms failed', err});
      } else if (body.code !== SUCCESS_CODE) {
        res.status(500).json(body);
      } else {
        base.update(
          'recjHFIel90qnQhdY', 
          {'Đã gửi SMS': true}, 
          (err, updatedRecord) => {
            if (err) {
              res.status(500).json({err});
            } else {
              res.status(200).json({message: 'Sms sent and sending-status updated successfully', body, updatedRecord});
            }
          }
        );
      }
    }
  );
});

app.post('/sms-reply', (req, res) => {
  console.log(req.body);

  console.log("======================");
  console.log(req);
  
  res.json({message: 'testing', body: req.body});
})


const port = process.env.PORT || 3434;

app.listen(port, () => {
  console.log(`Node app is running on port ${port}`);
});