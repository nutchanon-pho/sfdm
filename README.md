# Salesforce Data Migration CLI

This command line tool will help you move data across Salesforce Orgs with support to data with relationship and Record Type.

## Getting Started


### Prerequisites

Latest version of Node.js and npm
Please visit https://nodejs.org/en/

### Installing

```
npm install sfdm -g
```

Then, you can run ```sfdm --help``` to check if it is installed successfully.

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

## Usage

```

sfdm --help
Usage: sfdm [options] [command]

  Options:

    -u, --username <username>                Salesforce Username
    -p, --password <password>                Salesforce Password and Security Token
    -q, --query [query]                      SOQL Query to perform export
    -o, --object [object]                    SObject that is going to be imported or exported
    -f, --filePath [filePath]                File path of the input for importing
    -e, --externalIdField [externalIdField]  The External Id Field for the import
    -l, --loginUrl [loginUrl]                Salesforce Login Url
    -s, --saveAs [saveAs]                    The path to save the export result
    -h, --help                               output usage information


  Commands:

    export   Perform SOQL query to export data from Salesforce
    import   Import data from exported file to Salesforce

```

### Export
The SOQL query will be queried using Bulk API to retrieved data as JSON file. This data can be used in the next step of data migration which is ```import```.

Example:
```
sfdm export -u salesforce@salesforce.com -p password -o Account -q "SELECT Name FROM Account LIMIT 10" -l https://login.salesforce.com -s ./Account.json
```

The result will be saved as ```Account.json``` in the current working directory.

### Import
The specified JSON file will be imported to the Salesforce org in the manner of ```upsert``` using Bulk API. If you do not wish to use ```upsert``` or simply want to do a whole ```insert```, then specify the ```externalIdField``` as ```Id```.

Example:
```
node index import -u salesforce@salesforce.com -p password -o Account -f ./Account.json -e Account_External_Id__c -l https://test.salesforce.com
```

## Acknowledgments
This project heavily relying on the use of [jsforce](https://github.com/jsforce/jsforce). Please send love.