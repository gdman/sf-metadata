// tslint:disable-next-line:no-reference
/// <reference path="../../types/xml2js-fork-stringify.d.ts" />

import { Parser } from "xml2js-fork-stringify";
import { DataType, Metadata } from "../types";
import { ParserInterface } from "./parser-interface";

export class XmlParser implements ParserInterface {
	public async parse(data: string): Promise<Metadata> {
		try {
			if (!data) {
				throw new Error('No data to parse');
			}

			const parsedData = await new Parser().parseStringPromise(data);

			if (!parsedData) {
				return Promise.resolve({ type: DataType.Xml, rootKey: null, data: {} });
			}

			const rootKey = Object.keys(parsedData)[0];

			return Promise.resolve({ type: DataType.Xml, rootKey, data: parsedData[rootKey] });
		} catch (ex) {
			return Promise.reject('XML parse failed: ' + ex.message);
		}
	};
};