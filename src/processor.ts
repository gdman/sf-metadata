import * as path from "path";
import { Collection } from "./core";
import { DataType } from "./types";

export type ProcessorOptions = {
	baseDir?: string;
	patterns?: string[];
	processorFunction?: ProccessorFunction;
	format?: ProcessorDataFormat;
};

export enum ProcessorDataFormat {
	String = 'string',
	Object = 'object'
};

export type ProccessorFunction = (data: any, filename: string) => any | Promise<any>;

export async function processor(baseDirOrOptions: string | ProcessorOptions, patterns?: string[] | string, processorFunction?: ProccessorFunction, format?: ProcessorDataFormat): Promise<string[]> {
	try {
		let options: ProcessorOptions = {};

		if (typeof baseDirOrOptions === 'string') {
			options.baseDir = baseDirOrOptions;
		} else if (baseDirOrOptions) {
			options = baseDirOrOptions;
		}

		if (patterns) {
			options.patterns = !Array.isArray(patterns) ? [ patterns ] : patterns;
		}

		options.processorFunction = processorFunction || options.processorFunction;
		options.format = format || options.format || ProcessorDataFormat.Object;

		if (!options.format || !isValidDataType(options.format)) {
			throw new Error('Processor type not recognised (must be object or string)');
		}

		if (!options.baseDir) {
			throw new Error('Must specify base directory');
		}

		if (!options.processorFunction) {
			throw new Error('Must specify processor function');
		}

		options.baseDir = path.resolve(options.baseDir);

		const collection = new Collection(options.baseDir);

		if (options.patterns) {
			collection.setPatterns(options.patterns);
		}

		const updatedFiles: string[] = [];

		const files = await collection.getFiles();

		for (const file of files) {

			if (options.format === ProcessorDataFormat.String) {
				file.disableParser();
			}

			const data = await file.read();

			const filename = file.getFile().replace(options.baseDir + path.sep, '');

			const processorResponse = await options.processorFunction(data.data, filename);

			if (data.type === DataType.String && processorResponse === undefined) {
				throw new Error('When working with data as a string - the processor function must return data (or null)');
			}

			if (processorResponse !== undefined) {
				data.data = processorResponse;
			}

			await file.write();

			updatedFiles.push(filename);
		}

		return Promise.resolve(updatedFiles);
	} catch (ex) {
		return Promise.reject('Metadata processor failed: ' + (ex.message || ex))
	}
};

function isValidDataType(type: ProcessorDataFormat): boolean {
	return Object.values(ProcessorDataFormat).includes(type);
};