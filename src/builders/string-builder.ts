import { Metadata } from "../types";
import { BuilderInterface } from "./builder-interface";

export class StringBuilder implements BuilderInterface {
	public build(metadata: Metadata): Promise<string> {
		if (metadata.data && typeof metadata.data !== 'string') {
			return Promise.reject('Data must be of type string');
		}
		return Promise.resolve(metadata.data || '');
	};
};