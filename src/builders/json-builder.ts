import { Metadata } from "../types";
import { BuilderInterface } from "./builder-interface";

export type JsonBuilderOptions = {
	indentation?: string | number;
};

export class JsonBuilder implements BuilderInterface {
	private indentation: string | number | undefined;

	constructor(options?: JsonBuilderOptions) {
		if (!options) {
			options = {};
		}

		if (options.indentation) {
			this.setIndentation(options.indentation);
		} else {
			this.setIndentation(2);
		}
	};

	public setIndentation = (indentation: string | number): JsonBuilder => {
		this.indentation = indentation;
		return this;
	};

	public setNoIndentation = (): JsonBuilder => {
		this.indentation = undefined;
		return this;
	};

	public build(metadata: Metadata): Promise<string> {
		try {
			if (!metadata.data) {
				return Promise.resolve('');
			}
			return Promise.resolve(JSON.stringify(metadata.data, null, this.indentation));
		} catch (ex) {
			return Promise.reject('JSON build failed: ' + (ex.message || ex));
		}
	};
};