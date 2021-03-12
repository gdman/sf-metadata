import { BuilderInterface, XmlBuilder } from "../../src/builders";
import { File } from "../../src/core";
import { JsonParser, StringParser } from "../../src/parsers";
import { DataType, Metadata } from "../../src/types";
import { createTestFile, getTestFilePath, readTestFile } from "../test-utils/file-utils";

class NullBuilder implements BuilderInterface {
	build(data: Metadata): Promise<string> {
		// @ts-ignore - intentionally returning null as someone implementing a builder in JS
		// might return a null - the writer should be ok with this
		return Promise.resolve(null);
	}
}

describe('File', () => {
	it('construct with filename string parameter', () => {
		expect(new File('filename').getFile()).toBe('filename');
	});

	it('construct with filename options parameter', () => {
		expect(new File({ file: 'filename' }).getFile()).toBe('filename');
	});

	it('construct with no filename therefore getFile throws', () => {
		expect(() => new File({}).getFile()).toThrow(new Error('Metadata filename not specified'));
	});
	it('construct with no parameters doesnt throw', () => {
		expect(new File()).not.toBeNull();
	});

	it('construct with parser', () => {
		const jsonParser = new JsonParser();

		const file = new File({
			parser: jsonParser
		});

		// @ts-ignore - to access private method
		expect(file.getParser()).toBe(jsonParser);
	});

	it('construct with builder', () => {
		const xmlBuilder = new XmlBuilder();

		const file = new File({
			builder: xmlBuilder
		});

		// @ts-ignore - to access private method
		expect(file.getBuilder()).toBe(xmlBuilder);
	});

	it('construct with disableParser', () => {
		const file = new File({
			disableParser: true
		});

		// @ts-ignore - to access private method
		expect(file.getParser()).toBeInstanceOf(StringParser);
	});

	it('setFile sets filename and getFile can retrieve it', () => {
		expect(new File().setFile('filename').getFile()).toBe('filename');
	});

	it('getFile without setting file throws', () => {
		expect(() => new File().getFile()).toThrow(new Error('Metadata filename not specified'));
	});

	it('setParser sets parser', () => {
		const jsonParser = new JsonParser();

		const file = new File().setParser(jsonParser);

		// @ts-ignore - to access private method
		expect(file.getParser()).toBe(jsonParser);
	});

	it('setBuilder sets builder', () => {
		const xmlBuilder = new XmlBuilder();

		const file = new File().setBuilder(xmlBuilder);

		// @ts-ignore - to access private method
		expect(file.getBuilder()).toBe(xmlBuilder);
	});

	it('disableParser means getParser returns StringParser', () => {
		expect(new File()
			.disableParser()
			// @ts-ignore - to access private method
			.getParser()
		).toBeInstanceOf(StringParser)
	});

	it('setMetadata sets metadata and getMetadata returns it', () => {
		const metadata: Metadata = {
			type: DataType.String,
			data: 'data'
		};

		expect(new File().setMetadata(metadata).getMetadata()).toBe(metadata);
	});

	it('read json file', () => {
		const testFile = createTestFile('json', '{ "string": "value" }');

		return expect(
			new File(testFile)
				.read()
		).resolves.toStrictEqual({
			type: DataType.Json,
			data: {
				string: 'value'
			}
		});
	});

	it('read xml file', () => {
		const testFile = createTestFile('anything', '<tag><string>value</string></tag>');

		return expect(
			new File(testFile)
				.read()
		).resolves.toStrictEqual({
			type: DataType.Xml,
			data: {
				string: [ 'value' ]
			},
			rootKey: 'tag'
		});
	});

	it('read file as string', () => {
		const testFile = createTestFile('txt', 'value');

		return expect(
			new File(testFile)
				.disableParser()
				.read()
		).resolves.toStrictEqual({
			type: DataType.String,
			data: 'value'
		});
	});

	it('read file not specified rejects - filename not specified', () => {
		return expect(
			new File()
				.read()
		).rejects.toBe('Read failed: Metadata filename not specified')
	});

	it('read file doesnt exist rejects - not found', () => {
		return expect(
			new File('doesntExist')
				.read()
		).rejects.toBe('Read failed: File not found')
	});

	it('read file parser failure rejects - error passed back from parser', () => {
		const testFile = createTestFile('json', '{ "string":');

		return expect(
			new File(testFile)
				.read()
		).rejects.toBe('Read failed: JSON parse failed: Unexpected end of JSON input')
	});

	it('write json file', async () => {
		const testFile = getTestFilePath('json');
		await new File(testFile)
			.setMetadata({
				type: DataType.Json,
				data: { string: 'value' }
			})
			.write();

		expect(
			readTestFile(testFile)
		).toBe('{\n  "string": "value"\n}');
	});

	it('write xml file', async () => {
		const testFile = getTestFilePath('xml');
		await new File(testFile)
			.setMetadata({
				type: DataType.Xml,
				data: { string: 'value' },
				rootKey: 'tag'
			})
			.write();

		expect(
			readTestFile(testFile)
		).toBe('<?xml version="1.0" encoding="UTF-8"?>\n<tag>\n    <string>value</string>\n</tag>\n');
	});

	it('write file as string', async () => {
		const testFile = getTestFilePath('txt');
		await new File(testFile)
			.setMetadata({
				type: DataType.String,
				data: 'value'
			})
			.write();

		expect(
			readTestFile(testFile)
		).toBe('value');
	});

	it('write file not specified rejects - filename not specified', () => {
		return expect(
			new File()
				.write()
		).rejects.toBe('Write failed: Metadata filename not specified')
	});

	it('write no metadata rejects - no data to write', () => {
		return expect(
			new File('anything')
				.write()
		).rejects.toBe('Write failed: No data to write')
	});

	it('write file builder failure rejects - error passed back from builer', () => {
		const testFile = getTestFilePath('xml');

		return expect(
			new File(testFile)
				.setMetadata({
					type: DataType.String,
					data: { "not a string" : true }
				})
				.write()
		).rejects.toBe('Write failed: Data must be of type string')
	});

	it('write file with builer that returns null should write empty file', async () => {
		const testFile = getTestFilePath('txt');
		await new File(testFile)
			.setBuilder(new NullBuilder())
			.setMetadata({
				type: DataType.String,
				data: 'ignored'
			})
			.write();

		expect(
			readTestFile(testFile)
		).toBe('');
	});
});