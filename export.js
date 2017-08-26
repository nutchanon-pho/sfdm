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
    var records = [];
    let countQuery = `SELECT COUNT(Id) FROM ${options.object} ${extractConditionFromQuery(options.query)}`;
    conn.query(countQuery, function (err, result) {
        if(err) console.log(err);
        let limitFromQuery = extractLimitFromQuery(options.query);
        if (result && result.records && result.records.length > 0) {
            let numberOfRecordsToBeQueried = limitFromQuery != null ? limitFromQuery : result.records[0].expr0;
            console.log(`You are about to export ${numberOfRecordsToBeQueried} records of ${options.object}`);
            prompt.start();
            prompt.get(schema, function (err, result) {
                if (result.yesOrNo == 'Y' || result.yesOrNo == 'y') {
                    exportData(numberOfRecordsToBeQueried, options, conn);
                }
            });
        }
    });
};

function exportData(numberOfRecordsToBeQueried, options, conn) {
    let records = [];
    conn.bulk.pollTimeout = 25000;
    conn.bulk.query(options.query)
        .on('record', function (eachRecord) {
            records.push(eachRecord);
            if (records.length == numberOfRecordsToBeQueried) {
                let defaultSaveAs = path.join(process.cwd(), `${options.object}.json`);
                let saveAsToBeUsed = options.saveAs ? path.resolve(process.cwd(), options.saveAs) : defaultSaveAs;
                fs.writeFile(saveAsToBeUsed, JSON.stringify(records), function (err) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log(`The file has been saved to ${saveAsToBeUsed}`);
                });
            }
        })
        .on('error', function (err) { console.error(err); })
}

function extractConditionFromQuery(query) {
    let indexOfWHERE = query.toLowerCase().indexOf('where');

    if (indexOfWHERE != -1) {
        let whereCondition = query.substring(indexOfWHERE);
        let indexOfLIMIT = whereCondition.toLowerCase().indexOf('limit');
        if (indexOfLIMIT != -1) {
            return whereCondition.substring(0, indexOfLIMIT);
        } else {
            return whereCondition;
        }
    } else {
        return '';
    }
}

function extractLimitFromQuery(query) {
    let indexOfLIMIT = query.toLowerCase().indexOf('limit');

    if (indexOfLIMIT != -1) {
        return parseInt(query.substring(indexOfLIMIT + 5));
    } else {
        return null;
    }
}