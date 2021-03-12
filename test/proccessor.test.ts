import * as path from "path";
import { processor } from "../src";
import { ProcessorDataFormat } from "../src/processor";
import { createTestDir, readTestFile } from "./test-utils/file-utils";

describe('processor', () => {
	it('construct with all parameters - update JSON files - as object - end to end (no mocking)', async () => {
		const folderPath = createTestDir();

		const updatedFiles = await processor(folderPath, '**/*.json',  (data) => { data.string = 'updated' }, ProcessorDataFormat.Object);

		expect(updatedFiles.length).toEqual(3);

		expect(updatedFiles).toContain(path.join('folder1', 'foldera', 'json-file.json'));
		expect(updatedFiles).toContain(path.join('folder1', 'json-file.json'));
		expect(updatedFiles).toContain(path.join('folder2', 'json-file.json'));

		const expectedJson = '{\n  "string": "updated"\n}';

		expect(readTestFile(path.join(folderPath, 'folder1', 'foldera', 'json-file.json'))).toEqual(expectedJson);
		expect(readTestFile(path.join(folderPath, 'folder1', 'json-file.json'))).toEqual(expectedJson);
		expect(readTestFile(path.join(folderPath, 'folder2', 'json-file.json'))).toEqual(expectedJson);
	});

	it('construct with all parameters - update XML files - as object - end to end (no mocking)', async () => {
		const folderPath = createTestDir();

		const updatedFiles = await processor(folderPath, '**/*.xml',  (data) => { data.string = 'updated' }, ProcessorDataFormat.Object);

		expect(updatedFiles.length).toEqual(3);

		expect(updatedFiles).toContain(path.join('folder1', 'foldera', 'xml-file.xml'));
		expect(updatedFiles).toContain(path.join('folder1', 'xml-file.xml'));
		expect(updatedFiles).toContain(path.join('folder2', 'xml-file.xml'));

		const expectedXml = '<?xml version="1.0" encoding="UTF-8"?>\n<tag>\n    <string>updated</string>\n</tag>\n';

		expect(readTestFile(path.join(folderPath, 'folder1', 'foldera', 'xml-file.xml'))).toEqual(expectedXml);
		expect(readTestFile(path.join(folderPath, 'folder1', 'xml-file.xml'))).toEqual(expectedXml);
		expect(readTestFile(path.join(folderPath, 'folder2', 'xml-file.xml'))).toEqual(expectedXml);
	});

	it('construct with all parameters - update JSON files - as string - end to end (no mocking)', async () => {
		const folderPath = createTestDir();

		const updatedFiles = await processor(folderPath, '**/*.json',  (data) => data.replace('value', 'updated'), ProcessorDataFormat.String);

		expect(updatedFiles.length).toEqual(3);

		expect(updatedFiles).toContain(path.join('folder1', 'foldera', 'json-file.json'));
		expect(updatedFiles).toContain(path.join('folder1', 'json-file.json'));
		expect(updatedFiles).toContain(path.join('folder2', 'json-file.json'));

		const expectedJson = '{ "string": "updated" }';

		expect(readTestFile(path.join(folderPath, 'folder1', 'foldera', 'json-file.json'))).toEqual(expectedJson);
		expect(readTestFile(path.join(folderPath, 'folder1', 'json-file.json'))).toEqual(expectedJson);
		expect(readTestFile(path.join(folderPath, 'folder2', 'json-file.json'))).toEqual(expectedJson);
	});

	it('construct with all parameters - update XML files - as string - end to end (no mocking)', async () => {
		const folderPath = createTestDir();

		const updatedFiles = await processor(folderPath, '**/*.xml',  (data) => data.replace('value', 'updated'), ProcessorDataFormat.String);

		expect(updatedFiles.length).toEqual(3);

		expect(updatedFiles).toContain(path.join('folder1', 'foldera', 'xml-file.xml'));
		expect(updatedFiles).toContain(path.join('folder1', 'xml-file.xml'));
		expect(updatedFiles).toContain(path.join('folder2', 'xml-file.xml'));

		const expectedXml = '<tag><string>updated</string></tag>';

		expect(readTestFile(path.join(folderPath, 'folder1', 'foldera', 'xml-file.xml'))).toEqual(expectedXml);
		expect(readTestFile(path.join(folderPath, 'folder1', 'xml-file.xml'))).toEqual(expectedXml);
		expect(readTestFile(path.join(folderPath, 'folder2', 'xml-file.xml'))).toEqual(expectedXml);
	});

	it('construct with all parameters - update text files - as string - end to end (no mocking)', async () => {
		const folderPath = createTestDir();

		const updatedFiles = await processor(folderPath, '**/*.txt',  (data) => data.replace('value', 'updated'), ProcessorDataFormat.String);

		expect(updatedFiles.length).toEqual(3);

		expect(updatedFiles).toContain(path.join('folder1', 'foldera', 'text-file.txt'));
		expect(updatedFiles).toContain(path.join('folder1', 'text-file.txt'));
		expect(updatedFiles).toContain(path.join('folder2', 'text-file.txt'));

		const expectedText = 'updated';

		expect(readTestFile(path.join(folderPath, 'folder1', 'foldera', 'text-file.txt'))).toEqual(expectedText);
		expect(readTestFile(path.join(folderPath, 'folder1', 'text-file.txt'))).toEqual(expectedText);
		expect(readTestFile(path.join(folderPath, 'folder2', 'text-file.txt'))).toEqual(expectedText);
	});

	it('construct with all parameters - update JSON files - as object - end to end (no mocking) - async', async () => {
		const folderPath = createTestDir();

		const updatedFiles = await processor(folderPath, '**/*.json',  async (data) => {
			data.string = 'updated';
			return Promise.resolve(data);
		}, ProcessorDataFormat.Object);

		expect(updatedFiles.length).toEqual(3);

		expect(updatedFiles).toContain(path.join('folder1', 'foldera', 'json-file.json'));
		expect(updatedFiles).toContain(path.join('folder1', 'json-file.json'));
		expect(updatedFiles).toContain(path.join('folder2', 'json-file.json'));

		const expectedJson = '{\n  "string": "updated"\n}';

		expect(readTestFile(path.join(folderPath, 'folder1', 'foldera', 'json-file.json'))).toEqual(expectedJson);
		expect(readTestFile(path.join(folderPath, 'folder1', 'json-file.json'))).toEqual(expectedJson);
		expect(readTestFile(path.join(folderPath, 'folder2', 'json-file.json'))).toEqual(expectedJson);
	});

	it('construct with all parameters - update XML files - as object - end to end (no mocking) - async', async () => {
		const folderPath = createTestDir();

		const updatedFiles = await processor(folderPath, '**/*.xml',  async (data) => {
			data.string = 'updated';
			return Promise.resolve(data);
		}, ProcessorDataFormat.Object);

		expect(updatedFiles.length).toEqual(3);

		expect(updatedFiles).toContain(path.join('folder1', 'foldera', 'xml-file.xml'));
		expect(updatedFiles).toContain(path.join('folder1', 'xml-file.xml'));
		expect(updatedFiles).toContain(path.join('folder2', 'xml-file.xml'));

		const expectedXml = '<?xml version="1.0" encoding="UTF-8"?>\n<tag>\n    <string>updated</string>\n</tag>\n';

		expect(readTestFile(path.join(folderPath, 'folder1', 'foldera', 'xml-file.xml'))).toEqual(expectedXml);
		expect(readTestFile(path.join(folderPath, 'folder1', 'xml-file.xml'))).toEqual(expectedXml);
		expect(readTestFile(path.join(folderPath, 'folder2', 'xml-file.xml'))).toEqual(expectedXml);
	});

	it('construct with all parameters - update JSON files - as string - end to end (no mocking) - async', async () => {
		const folderPath = createTestDir();

		const updatedFiles = await processor(folderPath, '**/*.json',  async (data) => Promise.resolve(data.replace('value', 'updated')), ProcessorDataFormat.String);

		expect(updatedFiles.length).toEqual(3);

		expect(updatedFiles).toContain(path.join('folder1', 'foldera', 'json-file.json'));
		expect(updatedFiles).toContain(path.join('folder1', 'json-file.json'));
		expect(updatedFiles).toContain(path.join('folder2', 'json-file.json'));

		const expectedJson = '{ "string": "updated" }';

		expect(readTestFile(path.join(folderPath, 'folder1', 'foldera', 'json-file.json'))).toEqual(expectedJson);
		expect(readTestFile(path.join(folderPath, 'folder1', 'json-file.json'))).toEqual(expectedJson);
		expect(readTestFile(path.join(folderPath, 'folder2', 'json-file.json'))).toEqual(expectedJson);
	});

	it('construct with all parameters - update XML files - as string - end to end (no mocking) - async', async () => {
		const folderPath = createTestDir();

		const updatedFiles = await processor(folderPath, '**/*.xml',  async (data) => Promise.resolve(data.replace('value', 'updated')), ProcessorDataFormat.String);

		expect(updatedFiles.length).toEqual(3);

		expect(updatedFiles).toContain(path.join('folder1', 'foldera', 'xml-file.xml'));
		expect(updatedFiles).toContain(path.join('folder1', 'xml-file.xml'));
		expect(updatedFiles).toContain(path.join('folder2', 'xml-file.xml'));

		const expectedXml = '<tag><string>updated</string></tag>';

		expect(readTestFile(path.join(folderPath, 'folder1', 'foldera', 'xml-file.xml'))).toEqual(expectedXml);
		expect(readTestFile(path.join(folderPath, 'folder1', 'xml-file.xml'))).toEqual(expectedXml);
		expect(readTestFile(path.join(folderPath, 'folder2', 'xml-file.xml'))).toEqual(expectedXml);
	});

	it('construct with all parameters - update text files - as string - end to end (no mocking) - async', async () => {
		const folderPath = createTestDir();

		const updatedFiles = await processor(folderPath, '**/*.txt',  async (data) => Promise.resolve(data.replace('value', 'updated')), ProcessorDataFormat.String);

		expect(updatedFiles.length).toEqual(3);

		expect(updatedFiles).toContain(path.join('folder1', 'foldera', 'text-file.txt'));
		expect(updatedFiles).toContain(path.join('folder1', 'text-file.txt'));
		expect(updatedFiles).toContain(path.join('folder2', 'text-file.txt'));

		const expectedText = 'updated';

		expect(readTestFile(path.join(folderPath, 'folder1', 'foldera', 'text-file.txt'))).toEqual(expectedText);
		expect(readTestFile(path.join(folderPath, 'folder1', 'text-file.txt'))).toEqual(expectedText);
		expect(readTestFile(path.join(folderPath, 'folder2', 'text-file.txt'))).toEqual(expectedText);
	});

	it('construct with object parameter - update JSON files - as object - end to end (no mocking)', async () => {
		const folderPath = createTestDir();

		const updatedFiles = await processor({
			baseDir: folderPath,
			patterns: [ '**/*.json' ],
			processorFunction: (data) => { data.string = 'updated' },
			format: ProcessorDataFormat.Object
		});

		expect(updatedFiles.length).toEqual(3);

		expect(updatedFiles).toContain(path.join('folder1', 'foldera', 'json-file.json'));
		expect(updatedFiles).toContain(path.join('folder1', 'json-file.json'));
		expect(updatedFiles).toContain(path.join('folder2', 'json-file.json'));

		const expectedJson = '{\n  "string": "updated"\n}';

		expect(readTestFile(path.join(folderPath, 'folder1', 'foldera', 'json-file.json'))).toEqual(expectedJson);
		expect(readTestFile(path.join(folderPath, 'folder1', 'json-file.json'))).toEqual(expectedJson);
		expect(readTestFile(path.join(folderPath, 'folder2', 'json-file.json'))).toEqual(expectedJson);
	});

	it('construct with object parameter - update XML files - as object - end to end (no mocking)', async () => {
		const folderPath = createTestDir();

		const updatedFiles = await processor({
			baseDir: folderPath,
			patterns: [ '**/*.xml' ],
			processorFunction: (data) => { data.string = 'updated' },
			format: ProcessorDataFormat.Object
		});

		expect(updatedFiles.length).toEqual(3);

		expect(updatedFiles).toContain(path.join('folder1', 'foldera', 'xml-file.xml'));
		expect(updatedFiles).toContain(path.join('folder1', 'xml-file.xml'));
		expect(updatedFiles).toContain(path.join('folder2', 'xml-file.xml'));

		const expectedXml = '<?xml version="1.0" encoding="UTF-8"?>\n<tag>\n    <string>updated</string>\n</tag>\n';

		expect(readTestFile(path.join(folderPath, 'folder1', 'foldera', 'xml-file.xml'))).toEqual(expectedXml);
		expect(readTestFile(path.join(folderPath, 'folder1', 'xml-file.xml'))).toEqual(expectedXml);
		expect(readTestFile(path.join(folderPath, 'folder2', 'xml-file.xml'))).toEqual(expectedXml);
	});

	it('construct with object parameter - update JSON files - as string - end to end (no mocking)', async () => {
		const folderPath = createTestDir();

		const updatedFiles = await processor({
			baseDir: folderPath,
			patterns: [ '**/*.json' ],
			processorFunction: (data) => data.replace('value', 'updated'),
			format: ProcessorDataFormat.String
		});

		expect(updatedFiles.length).toEqual(3);

		expect(updatedFiles).toContain(path.join('folder1', 'foldera', 'json-file.json'));
		expect(updatedFiles).toContain(path.join('folder1', 'json-file.json'));
		expect(updatedFiles).toContain(path.join('folder2', 'json-file.json'));

		const expectedJson = '{ "string": "updated" }';

		expect(readTestFile(path.join(folderPath, 'folder1', 'foldera', 'json-file.json'))).toEqual(expectedJson);
		expect(readTestFile(path.join(folderPath, 'folder1', 'json-file.json'))).toEqual(expectedJson);
		expect(readTestFile(path.join(folderPath, 'folder2', 'json-file.json'))).toEqual(expectedJson);
	});

	it('construct with object parameter - update XML files - as string - end to end (no mocking)', async () => {
		const folderPath = createTestDir();

		const updatedFiles = await processor({
			baseDir: folderPath,
			patterns: [ '**/*.xml' ],
			processorFunction: (data) => data.replace('value', 'updated'),
			format: ProcessorDataFormat.String
		});

		expect(updatedFiles.length).toEqual(3);

		expect(updatedFiles).toContain(path.join('folder1', 'foldera', 'xml-file.xml'));
		expect(updatedFiles).toContain(path.join('folder1', 'xml-file.xml'));
		expect(updatedFiles).toContain(path.join('folder2', 'xml-file.xml'));

		const expectedXml = '<tag><string>updated</string></tag>';

		expect(readTestFile(path.join(folderPath, 'folder1', 'foldera', 'xml-file.xml'))).toEqual(expectedXml);
		expect(readTestFile(path.join(folderPath, 'folder1', 'xml-file.xml'))).toEqual(expectedXml);
		expect(readTestFile(path.join(folderPath, 'folder2', 'xml-file.xml'))).toEqual(expectedXml);
	});

	it('construct with object parameter no patterns - update ALL files - as string - end to end (no mocking)', async () => {
		const folderPath = createTestDir();

		const updatedFiles = await processor({
			baseDir: folderPath,
			processorFunction: (data) => data.replace('value', 'updated'),
			format: ProcessorDataFormat.String
		});

		expect(updatedFiles.length).toEqual(9);

		expect(updatedFiles).toContain(path.join('folder1', 'foldera', 'xml-file.xml'));
		expect(updatedFiles).toContain(path.join('folder1', 'xml-file.xml'));
		expect(updatedFiles).toContain(path.join('folder2', 'xml-file.xml'));
		expect(updatedFiles).toContain(path.join('folder1', 'foldera', 'json-file.json'));
		expect(updatedFiles).toContain(path.join('folder1', 'json-file.json'));
		expect(updatedFiles).toContain(path.join('folder2', 'json-file.json'));
		expect(updatedFiles).toContain(path.join('folder1', 'foldera', 'text-file.txt'));
		expect(updatedFiles).toContain(path.join('folder1', 'text-file.txt'));
		expect(updatedFiles).toContain(path.join('folder2', 'text-file.txt'));

		const expectedXml = '<tag><string>updated</string></tag>';

		expect(readTestFile(path.join(folderPath, 'folder1', 'foldera', 'xml-file.xml'))).toEqual(expectedXml);
		expect(readTestFile(path.join(folderPath, 'folder1', 'xml-file.xml'))).toEqual(expectedXml);
		expect(readTestFile(path.join(folderPath, 'folder2', 'xml-file.xml'))).toEqual(expectedXml);

		const expectedJson = '{ "string": "updated" }';

		expect(readTestFile(path.join(folderPath, 'folder1', 'foldera', 'json-file.json'))).toEqual(expectedJson);
		expect(readTestFile(path.join(folderPath, 'folder1', 'json-file.json'))).toEqual(expectedJson);
		expect(readTestFile(path.join(folderPath, 'folder2', 'json-file.json'))).toEqual(expectedJson);

		const expectedText = 'updated';

		expect(readTestFile(path.join(folderPath, 'folder1', 'foldera', 'text-file.txt'))).toEqual(expectedText);
		expect(readTestFile(path.join(folderPath, 'folder1', 'text-file.txt'))).toEqual(expectedText);
		expect(readTestFile(path.join(folderPath, 'folder2', 'text-file.txt'))).toEqual(expectedText);
	});

	it('construct with all parameters - JSON files - as object - check interface', async () => {
		const folderPath = createTestDir();

		const mockProcessor = jest.fn((data: any, filename: string) => data);

		const updatedFiles = await processor(folderPath, '**/*.json',  mockProcessor, ProcessorDataFormat.Object);

		expect(mockProcessor).toHaveBeenCalledTimes(3);
		expect(mockProcessor).toHaveBeenCalledWith({ string: 'value' }, path.join('folder1', 'foldera', 'json-file.json'));
		expect(mockProcessor).toHaveBeenCalledWith({ string: 'value' }, path.join('folder1', 'json-file.json'));
		expect(mockProcessor).toHaveBeenCalledWith({ string: 'value' }, path.join('folder2', 'json-file.json'));
	});

	it('construct with all parameters - XML files - as object - check interface', async () => {
		const folderPath = createTestDir();

		const mockProcessor = jest.fn((data: any, filename: string) => data);

		const updatedFiles = await processor(folderPath, '**/*.xml',  mockProcessor, ProcessorDataFormat.Object);

		expect(mockProcessor).toHaveBeenCalledTimes(3);
		expect(mockProcessor).toHaveBeenCalledWith({ string: [ 'value' ] }, path.join('folder1', 'foldera', 'xml-file.xml'));
		expect(mockProcessor).toHaveBeenCalledWith({ string: [ 'value' ] }, path.join('folder1', 'xml-file.xml'));
		expect(mockProcessor).toHaveBeenCalledWith({ string: [ 'value' ] }, path.join('folder2', 'xml-file.xml'));
	});

	it('construct with all parameters - JSON files - as string - check interface', async () => {
		const folderPath = createTestDir();

		const mockProcessor = jest.fn((data: any, filename: string) => data);

		const updatedFiles = await processor(folderPath, '**/*.json',  mockProcessor, ProcessorDataFormat.String);

		expect(mockProcessor).toHaveBeenCalledTimes(3);
		expect(mockProcessor).toHaveBeenCalledWith('{ "string": "value" }', path.join('folder1', 'foldera', 'json-file.json'));
		expect(mockProcessor).toHaveBeenCalledWith('{ "string": "value" }', path.join('folder1', 'json-file.json'));
		expect(mockProcessor).toHaveBeenCalledWith('{ "string": "value" }', path.join('folder2', 'json-file.json'));
	});

	it('construct with all parameters - XML files - as string - check interface', async () => {
		const folderPath = createTestDir();

		const mockProcessor = jest.fn((data: any, filename: string) => data);

		const updatedFiles = await processor(folderPath, '**/*.xml',  mockProcessor, ProcessorDataFormat.String);

		expect(mockProcessor).toHaveBeenCalledTimes(3);
		expect(mockProcessor).toHaveBeenCalledWith('<tag><string>value</string></tag>', path.join('folder1', 'foldera', 'xml-file.xml'));
		expect(mockProcessor).toHaveBeenCalledWith('<tag><string>value</string></tag>', path.join('folder1', 'xml-file.xml'));
		expect(mockProcessor).toHaveBeenCalledWith('<tag><string>value</string></tag>', path.join('folder2', 'xml-file.xml'));
	});

	it('construct with all parameters - text files - as string - check interface', async () => {
		const folderPath = createTestDir();

		const mockProcessor = jest.fn((data: any, filename: string) => data);

		const updatedFiles = await processor(folderPath, '**/*.txt',  mockProcessor, ProcessorDataFormat.String);

		expect(mockProcessor).toHaveBeenCalledTimes(3);
		expect(mockProcessor).toHaveBeenCalledWith('value', path.join('folder1', 'foldera', 'text-file.txt'));
		expect(mockProcessor).toHaveBeenCalledWith('value', path.join('folder1', 'text-file.txt'));
		expect(mockProcessor).toHaveBeenCalledWith('value', path.join('folder2', 'text-file.txt'));
	});

	it('construct with no format parameter - JSON files - as object - check defaults to Object', async () => {
		const folderPath = createTestDir();

		const mockProcessor = jest.fn((data: any, filename: string) => data);

		const updatedFiles = await processor(folderPath, '**/*.json',  mockProcessor);

		expect(mockProcessor).toHaveBeenCalledTimes(3);
		expect(mockProcessor).toHaveBeenCalledWith({ string: 'value' }, path.join('folder1', 'foldera', 'json-file.json'));
		expect(mockProcessor).toHaveBeenCalledWith({ string: 'value' }, path.join('folder1', 'json-file.json'));
		expect(mockProcessor).toHaveBeenCalledWith({ string: 'value' }, path.join('folder2', 'json-file.json'));
	});

	it('construct with no format parameter - XML files - as object - check defaults to Object', async () => {
		const folderPath = createTestDir();

		const mockProcessor = jest.fn((data: any, filename: string) => data);

		const updatedFiles = await processor(folderPath, '**/*.xml',  mockProcessor);

		expect(mockProcessor).toHaveBeenCalledTimes(3);
		expect(mockProcessor).toHaveBeenCalledWith({ string: [ 'value' ] }, path.join('folder1', 'foldera', 'xml-file.xml'));
		expect(mockProcessor).toHaveBeenCalledWith({ string: [ 'value' ] }, path.join('folder1', 'xml-file.xml'));
		expect(mockProcessor).toHaveBeenCalledWith({ string: [ 'value' ] }, path.join('folder2', 'xml-file.xml'));
	});

	it('construct with options with no format parameter - JSON files - as object - check defaults to Object', async () => {
		const folderPath = createTestDir();

		const mockProcessor = jest.fn((data: any, filename: string) => data);

		const updatedFiles = await processor({
			baseDir: folderPath,
			patterns: [ '**/*.json' ],
			processorFunction: mockProcessor
		});

		expect(mockProcessor).toHaveBeenCalledTimes(3);
		expect(mockProcessor).toHaveBeenCalledWith({ string: 'value' }, path.join('folder1', 'foldera', 'json-file.json'));
		expect(mockProcessor).toHaveBeenCalledWith({ string: 'value' }, path.join('folder1', 'json-file.json'));
		expect(mockProcessor).toHaveBeenCalledWith({ string: 'value' }, path.join('folder2', 'json-file.json'));
	});

	it('construct with options with no format parameter - XML files - as object - check defaults to Object', async () => {
		const folderPath = createTestDir();

		const mockProcessor = jest.fn((data: any, filename: string) => data);

		const updatedFiles = await processor({
			baseDir: folderPath,
			patterns: [ '**/*.xml' ],
			processorFunction: mockProcessor
		});

		expect(mockProcessor).toHaveBeenCalledTimes(3);
		expect(mockProcessor).toHaveBeenCalledWith({ string: [ 'value' ] }, path.join('folder1', 'foldera', 'xml-file.xml'));
		expect(mockProcessor).toHaveBeenCalledWith({ string: [ 'value' ] }, path.join('folder1', 'xml-file.xml'));
		expect(mockProcessor).toHaveBeenCalledWith({ string: [ 'value' ] }, path.join('folder2', 'xml-file.xml'));
	});

	it('construct with array of patterns - as object - check interface', async () => {
		const folderPath = createTestDir();

		const mockProcessor = jest.fn((data: any, filename: string) => data);

		const updatedFiles = await processor(folderPath, [ 'folder1/foldera/*.json', 'folder2/*.json' ],  mockProcessor, ProcessorDataFormat.Object);

		expect(mockProcessor).toHaveBeenCalledTimes(2);
		expect(mockProcessor).toHaveBeenCalledWith({ string: 'value' }, path.join('folder1', 'foldera', 'json-file.json'));
		expect(mockProcessor).toHaveBeenCalledWith({ string: 'value' }, path.join('folder2', 'json-file.json'));
	});

	it('construct with no parameters', () => {
		expect.assertions(1);
		// @ts-ignore - intentionally call with no parameters to check that it fails gracefully
		return expect(processor()).rejects.toEqual('Metadata processor failed: Must specify base directory');
	});

	it('construct with invalid type', () => {
		expect.assertions(1);
		return expect(processor({
			// @ts-ignore - intentionally call with empty format to check that it fails gracefully
			format: 'invalid'
		})).rejects.toEqual('Metadata processor failed: Processor type not recognised (must be object or string)');
	});

	it('construct with no base directory', () => {
		expect.assertions(1);
		return expect(processor({})).rejects.toEqual('Metadata processor failed: Must specify base directory');
	});

	it('construct with no processor function', () => {
		expect.assertions(1);
		const folderPath = createTestDir();
		return expect(processor({
			baseDir: folderPath
		})).rejects.toEqual('Metadata processor failed: Must specify processor function');
	});

	it('string processor function does not return therefore error thrown', () => {
		expect.assertions(1);
		const folderPath = createTestDir();

		const mockProcessor = jest.fn((data: any, filename: string) => { data.replace('value', 'not-returned') });

		return expect(processor(folderPath, '**/*.txt',  mockProcessor, ProcessorDataFormat.String))
			.rejects.toEqual('Metadata processor failed: When working with data as a string - the processor function must return data (or null)');
	});

	it('string processor function returns null which is ok and will legitimately empty a file', async () => {
		const folderPath = createTestDir();

		const updatedFiles = await processor(folderPath, '**/*.txt', (data: any, filename: string) => null, ProcessorDataFormat.String);

		expect(updatedFiles.length).toEqual(3);

		expect(updatedFiles).toContain(path.join('folder1', 'foldera', 'text-file.txt'));
		expect(updatedFiles).toContain(path.join('folder1', 'text-file.txt'));
		expect(updatedFiles).toContain(path.join('folder2', 'text-file.txt'));

		const expectedText = '';

		expect(readTestFile(path.join(folderPath, 'folder1', 'foldera', 'text-file.txt'))).toEqual(expectedText);
		expect(readTestFile(path.join(folderPath, 'folder1', 'text-file.txt'))).toEqual(expectedText);
		expect(readTestFile(path.join(folderPath, 'folder2', 'text-file.txt'))).toEqual(expectedText);
	});

	it('processing function throws an error (string) - error is caught and processor rejects', () => {
		expect.assertions(1);
		const folderPath = createTestDir();

		return expect(
			processor(folderPath, '**/*.txt',  (data: any, filename: string) => {
				// tslint:disable-next-line:no-string-throw
				throw "THROW";
			}, ProcessorDataFormat.String)
		).rejects.toEqual('Metadata processor failed: THROW');
	});

	it('processing function throws an error (object) - error is caught and processor rejects', () => {
		expect.assertions(1);
		const folderPath = createTestDir();

		return expect(
			processor(folderPath, '**/*.txt',  (data: any, filename: string) => {
				throw new Error("THROW");
			}, ProcessorDataFormat.String)
		).rejects.toEqual('Metadata processor failed: THROW');
	});

	it('processing async function rejects (string) - error is caught and processor rejects', () => {
		expect.assertions(1);
		const folderPath = createTestDir();

		return expect(
			processor(folderPath, '**/*.txt', async (data: any, filename: string) => Promise.reject('REJECT'), ProcessorDataFormat.String)
		).rejects.toEqual('Metadata processor failed: REJECT');
	});

	it('processing async function rejects (object) - error is caught and processor rejects', () => {
		expect.assertions(1);
		const folderPath = createTestDir();

		return expect(
			processor(folderPath, '**/*.txt', async (data: any, filename: string) => Promise.reject(new Error('REJECT')), ProcessorDataFormat.String)
		).rejects.toEqual('Metadata processor failed: REJECT');
	});
});