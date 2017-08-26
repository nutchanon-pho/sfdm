var path = require('path');
var prompt = require('prompt');
var fs = require('fs');
var jsforce = require('jsforce');
var schema = {
  properties: {
    yesOrNo: {
      description: 'Are you sure? [Y/N]',
      pattern: /[YyNn]{1}/i,
      message: 'Input can only be Y or N.',
      required: true
    }
  }
};

module.exports = (options, conn) => {
  fs.readFile(path.resolve(process.cwd(), options.filePath), "utf8", function (err, data) {
    if (err) return console.log(err);
    var records = JSON.parse(data);
    console.log('Importing ' + records.length + ' records');
    prompt.start();
    prompt.get(schema, function (err, result) {
      if (result.yesOrNo == 'Y' || result.yesOrNo == 'y') {
        conn.query("SELECT Id, DeveloperName FROM RecordType", function (err, result) {
          if (err) { return console.error(err); }
          let recordTypeList = result.records;
          let recordTypeIdMapByDeveloperName = {};
          for (let eachRecordType of recordTypeList) {
            recordTypeIdMapByDeveloperName[eachRecordType.DeveloperName] = eachRecordType.Id;
          }
          for (let eachRecord of records) {
            if (eachRecord['RecordType.DeveloperName']) {
              eachRecord.RecordTypeId = recordTypeIdMapByDeveloperName[eachRecord['RecordType.DeveloperName']];
              delete eachRecord['RecordType.DeveloperName'];
            }
          }

          conn.bulk.pollTimeout = 25000; // Bulk timeout can be specified globally on the connection object
          conn.bulk.load(options.object, 'upsert', { extIdField: options.externalIdField }, records, function (err, rets) {
            if (err) { return console.error(err); }
            for (var i = 0; i < rets.length; i++) {
              if (rets[i].success) {
                console.log("#" + (i + 1) + " loaded successfully, id = " + rets[i].id);
              } else {
                console.log("#" + (i + 1) + " error occurred, message = " + rets[i].errors.join(', '));
              }
            }
          });
        });
      }
    });
  });
}