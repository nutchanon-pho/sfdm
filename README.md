# Salesforce Data Migration CLI

This command line tool will help you move data across Salesforce Orgs with support to data with External Id relationship and Record Type. It will save you the hassle work of spreadsheet VLOOKUP and stuff.

## Getting Started


### Prerequisites

Latest version of Node.js and npm.
Please visit https://nodejs.org/en/

### Installing

```
npm install sfdm -g
```

Then, you can run ```sfdm --help``` to check if it is installed successfully.

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
sfdm import -u salesforce@salesforce.com -p password -o Account -f ./Account.json -e Account_External_Id__c -l https://test.salesforce.com
```

## Data with Relationship

### External Id
The relationship with other object with External Id can be imported using sfdm. For example, there is a ```Passenger__c``` Custom Object which related to ```Flight__c``` Custom Object through ```FlightId__c``` Custom Field. Fortunately, ```Flight__c``` has an External Id Field which is named ```Flight_External_Id__c```. For the ```import``` to automatically related ```Passenger__c``` and ```Flight__c``` automatically. The External Id field must be retrieved as ```FlightId__r.Flight_External_Id__c```. For example,

```
sfdm export -u salesforce@salesforce.com -p password -o Passenger__c -q "SELECT Name, FlightId__r.Flight_External_Id__c FROM Passenger__c LIMIT 10" -l https://login.salesforce.com -s ./Passenger__c.json
```
Please pay attention to the ```FlightId__r.Flight_External_Id__c```, this is where the relationship is specified and Salesforce will handle the relationship accordingly.

### Record Type
Record Type assignment can be done in a single import unlike the traditional Data Loader way with VLOOKUP. sfdm will query for all of the Record Type before the import and they will be assigned accordingly. The prerequisite is for the JSON file to be retrieved with ```RecordType.DeveloperName``` field. For example,
```
sfdm export -u salesforce@salesforce.com -p password -o Passenger__c -q "SELECT Name, RecordType.DeveloperName FROM Passenger__c LIMIT 10" -l https://login.salesforce.com -s ./Passenger__c.json
```

### Relationship without External Id
This is not yet supported.

## Acknowledgments
This project heavily relying on the use of [jsforce](https://github.com/jsforce/jsforce). Please send love.

## Donate
Bitcoin: 12kwTkrhx2zmUpdrEfTKRqJm93xzckLgTu<br />
Litecoin: LKU1RFPXeK7GUh7QDcW7pYW43dYVwQyBqa<br />
Ethereum: 0xdF67ED920348B201404dcDb004A9Ce0E93dD3443<br />