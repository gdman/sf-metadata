import { DataType, Metadata } from "../types";
import { ParserInterface } from "./parser-interface";

export class StringParser implements ParserInterface {
	public parse(data: string): Promise<Metadata> {
		return Promise.resolve({ type: DataType.String, data });
	};
};