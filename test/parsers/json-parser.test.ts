import { JsonParser } from "../../src/parsers";

describe('JsonParser', () => {
	it('parse json string resolves with metadata object', () => {
		return expect(new JsonParser().parse('{ "string": "value" }')).resolves.toEqual({ data: { string: 'value' }, type: 'json' });
	});

	it('parse empty string resolves with metadata object of an empty string', () => {
		return expect(new JsonParser().parse('')).resolves.toEqual({ data: '', type: 'json' });
	});

	it('parse invalid string rejects with json error', () => {
		expect.assertions(1);
		return expect(new JsonParser().parse('{ "string')).rejects.toEqual('JSON parse failed: Unexpected end of JSON input');
	});
});