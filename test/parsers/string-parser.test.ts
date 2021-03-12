import { StringParser } from "../../src/parsers";

describe('StringParser', () => {
	it('parse string resolves with metadata object', () => {
		return expect(new StringParser().parse('string')).resolves.toEqual({ data: 'string', type: 'string' });
	});
});