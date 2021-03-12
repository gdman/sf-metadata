import { writer } from "../src";
import { DataType } from "../src/types";
import { getTestFilePath, readTestFile } from "./test-utils/file-utils";

describe('writer', () => {
	it('write a text file', async () => {
		const testFile = getTestFilePath('txt');

		await expect(writer(testFile, {
			type: DataType.String,
			data: 'value'
		})).resolves.toBe(undefined);

		expect(readTestFile(testFile)).toEqual('value');
	});

	it('write a json file', async () => {
		const testFile = getTestFilePath('json');

		await expect(writer(testFile, {
			type: DataType.Json,
			data: { string: 'value' }
		})).resolves.toBe(undefined);

		expect(readTestFile(testFile)).toEqual('{\n  "string": "value"\n}');
	});

	it('write an xml file', async () => {
		const testFile = getTestFilePath('xml');

		await expect(writer(testFile, {
			type: DataType.Xml,
			data: { string: 'value' },
			rootKey: 'tag'
		})).resolves.toBe(undefined);

		expect(readTestFile(testFile)).toEqual('<?xml version="1.0" encoding="UTF-8"?>\n<tag>\n    <string>value</string>\n</tag>\n');
	});

	it('write a text file by options', async () => {
		const testFile = getTestFilePath('txt');

		await expect(
			writer({
				filename: testFile,
				metadata: {
					type: DataType.String,
					data: 'value'
				}
			})
		).resolves.toBe(undefined);

		expect(readTestFile(testFile)).toEqual('value');
	});

	it('write a json file by options', async () => {
		const testFile = getTestFilePath('json');

		await expect(
			writer({
				filename: testFile,
				metadata: {
					type: DataType.Json,
					data: { string: 'value' }
				}
			})
		).resolves.toBe(undefined);

		expect(readTestFile(testFile)).toEqual('{\n  "string": "value"\n}');
	});

	it('write an xml file by options', async () => {
		const testFile = getTestFilePath('xml');

		await expect(
			writer({
				filename: testFile,
				metadata: {
					type: DataType.Xml,
					data: { string: 'value' },
					rootKey: 'tag'
				}
			})
		).resolves.toBe(undefined);

		expect(readTestFile(testFile)).toEqual('<?xml version="1.0" encoding="UTF-8"?>\n<tag>\n    <string>value</string>\n</tag>\n');
	});

	it('no metadata rejects with error', () => {
		expect.assertions(1);
		const testFile = getTestFilePath('xml');

		return expect(
			writer(testFile)
		).rejects.toEqual('Metadata writer failed: Must specify metadata');
	});

	it('no metadata by options rejects with error', () => {
		expect.assertions(1);
		const testFile = getTestFilePath('xml');

		return expect(
			writer({
				filename: testFile
			})
		).rejects.toEqual('Metadata writer failed: Must specify metadata');
	});

	it('invalid data rejects with error', () => {
		return expect(writer('irrelevant', {
			type: DataType.String,
			data: { notAString: true }
		})).rejects.toBe('Metadata writer failed: Write failed: Data must be of type string');
	});

	it('construct with no parameters', () => {
		expect.assertions(1);
		// @ts-ignore - intentionally call with no parameters to check that it fails gracefully
		return expect(writer()).rejects.toEqual('Metadata writer failed: Must specify metadata');
	});
});