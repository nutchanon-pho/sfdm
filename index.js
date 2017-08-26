#!/usr/bin/env node

const exporter = require('./export.js');
const importer = require('./import.js');
var jsforce = require('jsforce');

let options = require('commander')
    ;
options
    .option('-u, --username <username>', 'Salesforce Username')
    .option('-p, --password <password>', 'Salesforce Password and Security Token')
    .option('-q, --query [query]', 'SOQL Query to perform export')
    .option('-o, --object [object]', 'SObject that is going to be imported or exported')
    .option('-f, --filePath [filePath]', 'File path of the input for importing')
    .option('-e, --externalIdField [externalIdField]', 'The External Id Field for the import', 'Id')
    .option('-l, --loginUrl [loginUrl]', 'Salesforce Login Url')
    .option('-s, --saveAs [saveAs]', 'The path to save the export result')

options
    .command('export')
    .description('Perform SOQL query to export data from Salesforce')
    .action(function () {
        logIn(options, (conn) => {
            exporter(options, conn);
        });
    });

options
    .command('import')
    .description('Import data from exported file to Salesforce')
    .action(function () {
        logIn(options, (conn) => {
            importer(options, conn);
        });
    });

options.parse(process.argv);

// conn.login(options.username, options.password, function (err, userInfo) {
//     if (err) { return console.error(err); }
//     console.log(conn.instanceUrl);
//     console.log("User ID: " + userInfo.id);
//     console.log("Org ID: " + userInfo.organizationId);
//     let method = process.argv[2];
//     try {
//         if (method == 'export') {
//             exporter(options, conn);
//         } else if (method == 'import') {
//             importer(options, conn);
//         } else {
//             console.error(`Method: ${method} is not found`);
//         }
//     } catch (err) {
//         console.error(err);
//     }
// });

function logIn(options, callback) {
    var conn = new jsforce.Connection({
        loginUrl: options.loginUrl
    });
    conn.login(options.username, options.password, (err, userInfo) => {
        if (err) { return console.error(err); }
        console.log(conn.instanceUrl);
        console.log("User ID: " + userInfo.id);
        console.log("Org ID: " + userInfo.organizationId);
        callback(conn);
    });
}