import { StringBuilder } from "../../src/builders";
import { DataType } from "../../src/types";

describe('StringBuilder', () => {
	it('build string resolves with string', () => {
		return expect(new StringBuilder().build({ type: DataType.String, data: 'string' })).resolves.toEqual('string');
	});

	it('build undefined resolves with an empty string', () => {
		return expect(new StringBuilder().build({ type: DataType.String, data: undefined })).resolves.toBe('');
	});

	it('build null resolves with an empty string', () => {
		return expect(new StringBuilder().build({ type: DataType.String, data: null })).resolves.toBe('');
	});

	it('build non-string rejects with error', () => {
		return expect(new StringBuilder().build({ type: DataType.String, data: { 'notAString': true } })).rejects.toBe('Data must be of type string');
	});
});