const standardisePhoneNumber = (phone) => {
  if (phone.startsWith('84')) {
    return phone = phone.replace('84', '0');
  }
  return phone
};

module.exports = {
  airtable: {
    apiKey: 'keylH089x65GF9EME',
    tableName: 'Table 1'
  },
  standardisePhoneNumber,
  speedsmsAccessToken: 'ltHNv_80TkJw07pYNsA84cdx6RND0lDR'
}