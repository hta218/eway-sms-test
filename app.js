const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const Airtable = require('airtable');

const configs = require('./configs');

const app = express();
app.use(bodyParser.json());

const base = new Airtable({apiKey: configs.airtable.apiKey}).base("apprdRz3g2BNFzkj6")(configs.airtable.tableName);

app.get('/', (req, res) => {
  base.select({
    fields: ['Phone'],
    view: 'Grid view'
  }).firstPage((err, users) => {
    if (err) {
      res.status(500).json({err});
    } else {
      res.status(200).json({message: 'Fetch records successfully', users});
    }
  });
});

app.get('/send-sms', (req, res) => {
  base.select({
    fields: ['Phone'],
    view: 'Grid view'
  }).firstPage((err, users) => {
    if (err) {
      res.status(500).json({err});
    } else {
      phoneNumbers = configs.getAllPhoneNumbers(users);
      let { options, SUCCESS_CODE } = configs.speedSms;

      // get all user phone numbers first then create request to speedsms.vn to send sms to those people
      options.json.to = phoneNumbers;

      request.post(
        options,
        (err, response, body) => {
          if (err) {
            res.status(500).json({message: 'Send sms failed', err});
          } else if (body.code !== SUCCESS_CODE) {
            res.status(500).json(body);
          } else {
            userIds = configs.getAllUserIds(users);

            // update status of multiple users
            userIds.forEach(id => {
              base.update(
                id, 
                {'Đã gửi SMS': true}, 
                (err, updatedRecord) => {
                  if (err) {
                    res.status(500).json({err});
                  }
                }
              );
            });
            res.status(200).json({message: 'Sms sent and sending-status updated successfully', body});
          }
        }
      );
    }
  });
});

app.post('/sms-reply', (req, res) => {
  userPhone = configs.standardisePhoneNumber(req.body.phone);

  base.select({
    filterByFormula: `Phone=${userPhone}`,
    view: 'Grid view'
  }).firstPage((err, users) => {
    if (err) {
      res.status(500).json({message: "Failed to fetch user", err});
    } else if (users.length === 0) {
      res.status(404).json({message: 'User not found'});
    } else {
      foundUser = users[0];
      base.update(
        foundUser.id, 
        {'Tin nhắn trả lời': req.body.content}, 
        (err, updatedUser) => {
          if (err) {
            res.status(500).json({err});
          } else {
            res.status(200).json({message: 'User reply saved!'});
          }
        }
      );
    }
  });
});

const port = process.env.PORT || 3434;

app.listen(port, () => {
  console.log(`Node app is running on port ${port}`);
});