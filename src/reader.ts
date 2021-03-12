import { Collection, File } from "./core";

export type ReaderOptions = {
	baseDir?: string;
	patterns?: string[];
};

export async function reader(baseDirOrOptions?: string | ReaderOptions, patterns?: string[] | string): Promise<File[]> {
	try {
		let options: ReaderOptions = {};

		if (typeof baseDirOrOptions === 'string') {
			options.baseDir = baseDirOrOptions;
		} else if (baseDirOrOptions) {
			options = baseDirOrOptions;
		}

		if (patterns) {
			options.patterns = !Array.isArray(patterns) ? [ patterns ] : patterns;
		}

		const collection = new Collection();

		if (options.baseDir) {
			collection.setBaseDir(options.baseDir);
		}

		if (options.patterns) {
			collection.setPatterns(options.patterns);
		}

		const files = await collection.getFiles();

		return Promise.resolve(files);
	} catch (ex) {
		return Promise.reject('Metadata reader failed: ' + (ex.message || ex));
	}
};