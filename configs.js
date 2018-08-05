const standardisePhoneNumber = (phone) => {
  if (phone.startsWith('84')) {
    return phone = phone.replace('84', '0');
  }
  return phone
};

const getAllPhoneNumbers = (users) => {
  let phoneNumbers = [];
  users.forEach((user) => {
    phoneNumbers.push(user.fields.Phone);
  });

  return phoneNumbers;
}

const getAllUserIds = (users) => {
  let ids = [];
  users.forEach((user) => {
    ids.push(user.id);
  });

  return ids;
}

const speedSmsOptions = {
  url: 'https://api.speedsms.vn/index.php/sms/send',
  auth: {
    'user': 'ltHNv_80TkJw07pYNsA84cdx6RND0lDR',
    'pass': '123@123a'
  },
  headers: { 'Content-Type': 'application/json' },
  json: {
    "to": [],
    "content": "testing speedsms.vn from Tuan Anh Huynh",
    "sms_type": 2,
    "sender": ""
  }
};

module.exports = {
  airtable: {
    apiKey: 'keylH089x65GF9EME',
    tableName: 'Table 1'
  },
  speedSms: {
    options: speedSmsOptions,
    SUCCESS_CODE: '00'
  },
  standardisePhoneNumber,
  getAllPhoneNumbers,
  getAllUserIds
}