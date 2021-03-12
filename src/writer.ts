import { File } from "./core";
import { Metadata } from "./types";

export type WriterOptions = {
	filename?: string;
	metadata?: Metadata;
};

export async function writer(filenameOrOptions: string | WriterOptions, data?: Metadata): Promise<void> {
	try {
		let options: WriterOptions = {};

		if (typeof filenameOrOptions === 'string') {
			options.filename = filenameOrOptions;
		} else if (filenameOrOptions) {
			options = filenameOrOptions;
		}

		if (data) {
			options.metadata = data;
		}

		const file = new File({
			file: options.filename
		});

		if (!options.metadata) {
			throw new Error('Must specify metadata');
		}

		file.setMetadata(options.metadata);

		await file.write();

		return Promise.resolve();
	} catch (ex) {
		return Promise.reject('Metadata writer failed: ' + (ex.message || ex));
	}
};