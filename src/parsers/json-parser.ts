import { DataType, Metadata } from "../types";
import { ParserInterface } from "./parser-interface";

export class JsonParser implements ParserInterface {
	public parse(data: string): Promise<Metadata> {
		try {
			return Promise.resolve({ type: DataType.Json, data: data ? JSON.parse(data) : '' });
		} catch (ex) {
			return Promise.reject('JSON parse failed: ' + ex.message);
		}
	};
};