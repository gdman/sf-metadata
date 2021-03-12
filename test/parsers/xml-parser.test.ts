import { XmlParser } from "../../src/parsers";

describe('XmlParser', () => {
	it('parse xml string resolves with metadata object', () => {
		return expect(new XmlParser().parse('<tag><string>value</string></tag>'))
			.resolves.toEqual({ data: { string: [ 'value' ] }, type: 'xml', rootKey: 'tag' });
	});

	it('parse empty string rejects with no data to parse', () => {
		expect.assertions(1);
		return expect(new XmlParser().parse(''))
			.rejects.toEqual('XML parse failed: No data to parse');
	});

	it('parse invalid string rejects with xml error (from xml2js)', () => {
		expect.assertions(1);
		return expect(new XmlParser().parse('<tag><string>value')).rejects.toBeDefined();
	});
	it('parse xml string with no root resolves with metadata object - empty data and null root key', () => {
		return expect(new XmlParser().parse('<?xml version="1.0" encoding="UTF-8"?>'))
			.resolves.toEqual({ data: {}, type: 'xml', rootKey: null });
	});
});