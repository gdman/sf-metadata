import { JsonBuilder } from "../../src/builders";
import { DataType } from "../../src/types";

describe('JsonBuilder', () => {
	it('build object resolves with json string - defaut 2 space pretty indentation', () => {
		return expect(new JsonBuilder().build({ type: DataType.Json, data: { string: 'value' } })).resolves.toEqual('{\n  "string": "value"\n}');
	});

	it('build empty object resolves with json string', () => {
		return expect(new JsonBuilder().build({ type: DataType.Json, data: {} })).resolves.toEqual('{}');
	});

	it('build null object resolves with empty string', () => {
		return expect(new JsonBuilder().build({ type: DataType.Json, data: null })).resolves.toEqual('');
	});

	it('build undefined object resolves with empty string', () => {
		return expect(new JsonBuilder().build({ type: DataType.Json, data: undefined })).resolves.toEqual('');
	});

	it('build object with indentation 4 resolves with json string with 4 space pretty indentation', () => {
		return expect(new JsonBuilder().setIndentation(4).build({ type: DataType.Json, data: { string: 'value' } })).resolves.toEqual('{\n    "string": "value"\n}');
	});

	it('build object with no indentation resolves with json string with no pretty indentation', () => {
		return expect(new JsonBuilder().setNoIndentation().build({ type: DataType.Json, data: { string: 'value' } })).resolves.toEqual('{"string":"value"}');
	});

	it('build object with indentation 4 by constructor resolves with json string with 4 space pretty indentation', () => {
		return expect(new JsonBuilder({ indentation: 4 }).build({ type: DataType.Json, data: { string: 'value' } })).resolves.toEqual('{\n    "string": "value"\n}');
	});

	it('builder catches error thrown by stringify', () => {
		JSON.stringify = jest.fn().mockImplementationOnce(object => {
			if (object.forceException) {
				throw new Error('Mocked JSON stringify error');
			}
		});
		expect.assertions(1);
		return expect(new JsonBuilder().build({ type: DataType.Json, data: { forceException: true } }))
			.rejects.toEqual('JSON build failed: Mocked JSON stringify error');
	});

	it('builder catches message thrown by stringify', () => {
		JSON.stringify = jest.fn().mockImplementationOnce(object => {
			if (object.forceException) {
				// tslint:disable-next-line:no-string-throw
				throw 'Mocked JSON stringify error';
			}
		});
		expect.assertions(1);
		return expect(new JsonBuilder().build({ type: DataType.Json, data: { forceException: true } }))
			.rejects.toEqual('JSON build failed: Mocked JSON stringify error');
	});
});