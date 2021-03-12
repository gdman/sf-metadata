import { Metadata } from "../types";

export interface ParserInterface {
	parse(data: string): Promise<Metadata>;
};