sf-metadata
================

Library for reading, writing and processing (read, update, write) Salesforce metadata files.

[![Version](https://img.shields.io/npm/v/sf-metadata.svg)](https://npmjs.org/package/sf-metadata)
[![Known Vulnerabilities](https://snyk.io/test/github/gdman/sf-metadata/badge.svg)](https://snyk.io/test/github/gdman/sf-metadata)
[![Downloads/week](https://img.shields.io/npm/dw/sf-metadata.svg)](https://npmjs.org/package/sf-metadata)
[![License](https://img.shields.io/npm/l/sf-metadata.svg)](https://github.com/gdman/sf-metadata/blob/master/package.json)

# Usage

## Processor

Read all Salesforce metadata files in a given directory that match a set of patterns. Matched files are passed to a user defined callback function to make changes to the metadata. The processor writes changes back to the original files and returns a list of the filenames that have been updated.

### Specification

Using options parameter:

```javascript
let updatedFiles = await processor({
	baseDir: 'baseDir', 
	patterns: [ 'pattern' ], 
	processorFunction: (data, filename) => data, 
	format: 'object'
});
```

or as a traditional function call:

```javascript
let updatedFiles = await processor(baseDir, patterns, processorFunction, format);
```

* `baseDir`: read all files in this directory
* `patterns`: match files by glob pattern(s) (note - can be an array of patterns)
* `processorFunction`: synchronous or asynchronous callback function to process metadata
```javascript
async (data, filename) => {
	return data || Promise<data>; // Required when format is string
}
```
* `format`: (Default: `object`) format of the data as passed to the processing function
  * `object`: data is parsed into a JavaScript object (support for `XML` and `JSON`)
  * `string`: data is not parsed, instead the raw contents of the file is passed

`Return`: Promise of a list of updated files (all files in the `baseDir` that match one or more `patterns`). File paths are relative to the `baseDir`.


XML parsing uses the excellent `xml2js` module, see [xml2js NPM docs](https://www.npmjs.com/package/xml2js) for data format information.

Glob patterns use the `minimatch` module, see [minimatch NPM docs](https://www.npmjs.com/package/minimatch) for examples.

*Note:* `*.json` files will be interpreted as `JSON`. All other files will be interpreted as `XML` files (to support the various traditional MD API format `.layout`, `.object`, etc.).

**Be careful not to process files that are not text based - I'm not sure exactly what will happen... definitely nothing good!**

### Example - Remove enableHistory and enableFeed attribute from object files
```javascript
let updatedFiles = await processor(
	'force-app/main/default', 
	'**/*.object-meta.xml', 
	(data, filename) => { 
		delete data.enableHistory;
		delete data.enableFeeds;
	}
);
```

### Example - Replace Information labels with Hello in layout files using a string format (i.e. data is not parsed)
```javascript
let updatedFiles = await processor(
	'force-app/main/default', 
	'**/*.layout-meta.xml', 
	(data, filename) => data.replace('<label>Information</label>', '<label>Hello</label>'),
	'string'
);
```

**This is only an example to demonstrate the difference between `object` and `string` format - working with a parsed format is obviously better...**


## Reader

Read all Salesforce metadata files in a given directory that match a set of patterns.

### Specification

Using options parameter:

```javascript
let files = await reader({
	baseDir: 'baseDir', 
	patterns: [ 'pattern' ]
});
```

or as a traditional function call:

```javascript
let files = await reader(baseDir, patterns);
```

* `baseDir`: read all files in this directory
* `patterns`: match files by glob pattern(s) (note - can be an array of patterns)

`Return`: Promise of a list matched file objects (with methods for reading and writing metadata).

**Be careful not to read files that are not text based - I'm not sure exactly what will happen... definitely nothing good!**

### Example - Get all object files
```javascript
let files = await reader('force-app/main/default', '**/*.object-meta.xml');
```

### Example - Get all object and layout files
```javascript
let files = await reader({
	baseDir: 'force-app/main/default',
	patterns: [ '**/*.layout-meta.xml', '**/*.object-meta.xml' ]
});
```

### Example - Read and write a file
Read file:
```javascript
let metadata = await file.read();
```
Example metadata:
```javascript
{
	type: 'xml',
	rootKey: 'CustomObject',
	data: {
		'$': { xmlns: 'http://soap.sforce.com/2006/04/metadata' },
		actionOverrides: [
			[Object], [Object],
			[Object], [Object],
			[Object], [Object],
			[Object], [Object],
			[Object], [Object]
		],
		allowInChatterGroups: [ 'false' ],
		compactLayoutAssignment: [ 'SYSTEM' ],
		deploymentStatus: [ 'Deployed' ],
		enableActivities: [ 'false' ],
		enableBulkApi: [ 'true' ],
		enableChangeDataCapture: [ 'false' ],
		enableReports: [ 'false' ],
		enableSearch: [ 'true' ],
		enableSharing: [ 'true' ],
		enableStreamingApi: [ 'true' ],
		label: [ 'Object Name' ],
		nameField: [ [Object] ],
		pluralLabel: [ 'Object Names' ],
		searchLayouts: [ '' ],
		sharingModel: [ 'ReadWrite' ],
		visibility: [ 'Public' ]
	}
}
```
Write metadata:
```javascript
let metadata = await file.write();
```


## Writer

Write a Salesforce metadata file. This is designed to be used to create a new metadata file, see Processor and Reader for modifying existing files.

### Specification

Using options parameter:

```javascript
await writer({
	filename: 'filename', 
	metadata: {
		rootKey: 'rootKey',
		data: {},
		type: 'type'
	}
});
```

or as a traditional function call:

```javascript
await writer(filename, {
	rootKey: 'rootKey',
	data: {},
	type: 'type'
});
```

* `filename`: full file path of file to be written
* `metadata`: metadata object to be built and written to the file
  * `rootKey`: root node - applicable for XML files e.g. `CustomObject`
  * `data`: metadata that will be built and written to the file, the structure of the data will depend on the type
  * `type`: type of metadata, supported types:
    * `xml`: data must be in `xml2js` format
    * `json`: data must be a standard JavaScript object that will be passed to `JSON.stringify`
    * `string`: data must be a string and will be written to the file as-is (no building)

### Example - Write a text file
```javascript
await writer('force-app/main/default/myFile.txt', {
	data: 'Hello world',
	type: 'string'
});
```

### Example - Write a JSON file
```javascript
await writer('force-app/main/default/myFile.json', {
	data: {
		property: 'value'
	},
	type: 'json'
});
```

### Example - Write an XML file
```javascript
await writer('force-app/main/default/myFile.xml', {
	rootKey: 'CustomObject',
	data: {
		'$': { xmlns: 'http://soap.sforce.com/2006/04/metadata' },
		allowInChatterGroups: [ 'false' ],
		compactLayoutAssignment: [ 'SYSTEM' ],
		deploymentStatus: [ 'Deployed' ],
		enableActivities: [ 'false' ],
		enableBulkApi: [ 'true' ],
		enableChangeDataCapture: [ 'false' ],
		enableReports: [ 'false' ],
		enableSearch: [ 'true' ],
		enableSharing: [ 'true' ],
		enableStreamingApi: [ 'true' ],
		label: [ 'Object Name' ],
		pluralLabel: [ 'Object Names' ],
		sharingModel: [ 'ReadWrite' ],
		visibility: [ 'Public' ]
	},
	type: 'xml'
});
```