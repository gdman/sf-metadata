import * as fs from "fs";
import { Minimatch } from "minimatch";
import * as path from "path";
import { getCurrentWorkingDir } from "../utils";
import { File } from "./file";

export type CollectionOptions = {
	baseDir?: string;
	patterns?: string[];
};

export class Collection {
	private baseDir: string = '';
	private patterns: string[] = [];

	constructor(baseDirOrOptions?: string | CollectionOptions, patterns?: string | string[]) {

		let options: CollectionOptions = {};

		if (typeof baseDirOrOptions === 'string') {
			options.baseDir = baseDirOrOptions;
		} else if (baseDirOrOptions) {
			options = baseDirOrOptions;
		}

		if (patterns) {
			options.patterns = Array.isArray(patterns) ? patterns : [ patterns ];
		}

		if (options.baseDir) {
			this.setBaseDir(options.baseDir);
		} else {
			this.setBaseDir(getCurrentWorkingDir());
		}

		if (options.patterns) {
			this.setPatterns(options.patterns);
		}
	};

	public setBaseDir = (dir: string): Collection => {
		this.baseDir = dir;
		return this;
	};

	public setPatterns = (patterns: string[]): Collection => {
		this.patterns = patterns;
		return this;
	};

	public getFiles = async (): Promise<File[]> => {
		return (await this.getFileNames()).map((file: string) => new File(path.join(this.baseDir, file)));
	};

	public getFileNames = async (): Promise<string[]> => {
		try {
			return Promise.resolve(this.readDir());
		} catch (ex) {
			return Promise.reject('Failed to get files: ' + (ex.message || ex));
		}
	};

	private readDir = (currentDir?: string): string[] => {
		const listing: string[] = [];
		const fullDirPath = currentDir ? path.join(this.baseDir, currentDir) : this.baseDir;
		const files = fs.readdirSync(fullDirPath);

		files.forEach(file => {
			const relativeFilePath = currentDir ? path.join(currentDir, file) : file;
			const fullFilePath = path.join(this.baseDir, relativeFilePath);

			const stats = fs.statSync(fullFilePath);

			if (stats.isDirectory()) {
				listing.push(...this.readDir(relativeFilePath));
			} else if (
				   this.patterns.length === 0
				|| this.patterns.some((pattern: string) => new Minimatch(pattern).match(relativeFilePath))) {
				listing.push(relativeFilePath);
			}
		});

		return listing;
	};
};