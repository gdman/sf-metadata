import { XmlBuilder } from "../../src/builders";
import { DataType } from "../../src/types";

describe('XmlBuilder', () => {
	it('build object resolves with xml string - defaut 4 space pretty indentation', () => {
		return expect(new XmlBuilder().build({ type: DataType.Xml, data: { string: 'value' }, rootKey: 'tag' }))
			.resolves.toEqual('<?xml version="1.0" encoding="UTF-8"?>\n<tag>\n    <string>value</string>\n</tag>\n');
	});

	it('build empty object resolves with empty root tag', () => {
		return expect(new XmlBuilder().build({ type: DataType.Xml, data: {}, rootKey: 'tag' }))
			.resolves.toEqual('<?xml version="1.0" encoding="UTF-8"?>\n<tag/>\n');
	});

	it('build null object resolves with empty root tag', () => {
		return expect(new XmlBuilder().build({ type: DataType.Xml, data: null, rootKey: 'tag' }))
			.resolves.toEqual('<?xml version="1.0" encoding="UTF-8"?>\n<tag/>\n');
	});

	it('build undefined object resolves with empty root tag', () => {
		return expect(new XmlBuilder().build({ type: DataType.Xml, data: undefined, rootKey: 'tag' }))
			.resolves.toEqual('<?xml version="1.0" encoding="UTF-8"?>\n<tag/>\n');
	});

	it('build empty object and no root key resolves with empty root tag (as per xml2js)', () => {
		return expect(new XmlBuilder().build({ type: DataType.Xml, data: undefined }))
			.resolves.toEqual('<?xml version="1.0" encoding="UTF-8"?>\n<root/>\n');
	});

	it('build object with entities and replaceXmlEntities enabled (default) resolves with standard xml2js and sf entity encoding', () => {
		return expect(new XmlBuilder().build({ type: DataType.Xml, data: { entities: '[ & < > " \' ]' }, rootKey: 'root' }))
			.resolves.toEqual('<?xml version="1.0" encoding="UTF-8"?>\n<root>\n    <entities>[ &amp; &lt; &gt; &quot; &apos; ]</entities>\n</root>\n');
	});

	it('build object with entities and replaceXmlEntities disabled by method resolves with standard xml2js entity encoding', () => {
		return expect(new XmlBuilder().disableReplaceXmlEntities().build({ type: DataType.Xml, data: { entities: '[ & < > " \' ]' }, rootKey: 'root' }))
			.resolves.toEqual('<?xml version="1.0" encoding="UTF-8"?>\n<root>\n    <entities>[ &amp; &lt; &gt; " \' ]</entities>\n</root>\n');
	});

	it('build object with entities and replaceXmlEntities disabled by option resolves with standard xml2js entity encoding', () => {
		return expect(new XmlBuilder({ disableReplaceXmlEntities: true }).build({ type: DataType.Xml, data: { entities: '[ & < > " \' ]' }, rootKey: 'root' }))
			.resolves.toEqual('<?xml version="1.0" encoding="UTF-8"?>\n<root>\n    <entities>[ &amp; &lt; &gt; " \' ]</entities>\n</root>\n');
	});
});