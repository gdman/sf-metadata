// tslint:disable-next-line:no-reference
/// <reference path="../../types/xml2js-fork-stringify.d.ts" />

import * as fs from "fs";
import { BuilderInterface, JsonBuilder, StringBuilder, XmlBuilder } from "../builders";
import { JsonParser, ParserInterface, StringParser, XmlParser } from "../parsers";
import { DataType, Metadata } from "../types";

export type FileOptions = {
	file?: string;
	parser?: ParserInterface;
	builder?: BuilderInterface;
	disableParser?: boolean;
};

export class File {
	private file: string | undefined;

	private parser: ParserInterface | undefined;
	private builder: BuilderInterface | undefined;
	private metadata: Metadata | undefined;

	constructor(fileOrOptions?: string | FileOptions) {
		const options = typeof fileOrOptions === 'string' ? { file: fileOrOptions } : fileOrOptions || {};

		if (options.file) {
			this.setFile(options.file);
		}

		if (options.parser) {
			this.setParser(options.parser);
		}

		if (options.builder) {
			this.setBuilder(options.builder);
		}

		if (options.disableParser) {
			this.disableParser();
		}
	};

	public getFile = (): string => {
		if (!this.file) {
			throw new Error('Metadata filename not specified');
		}
		return this.file;
	};

	public setFile = (file: string): File => {
		this.file = file;
		return this;
	};

	public setParser = (parser: ParserInterface): File => {
		this.parser = parser;
		return this;
	};

	public setBuilder = (builder: BuilderInterface): File => {
		this.builder = builder;
		return this;
	};

	public disableParser = (): File => {
		this.parser = new StringParser();
		return this;
	};

	public setMetadata = (metadata: Metadata): File => {
		this.metadata = metadata;
		return this;
	};

	public getMetadata = (): any => {
		return this.metadata;
	};

	public read = async (): Promise<Metadata> => {
		try {
			const file = this.getFile();

			if (!fs.existsSync(file)) {
				throw new Error('File not found');
			}

			const rawData = fs.readFileSync(file, 'utf8');

			this.metadata = await this.getParser().parse(rawData);

			return Promise.resolve(this.metadata);
		} catch (ex) {
			return Promise.reject('Read failed: ' + (ex.message || ex));
		}
	};

	public write = async (): Promise<void> => {
		try {
			const file = this.getFile();

			if (!this.metadata) {
				throw new Error('No data to write');
			}

			const rawData = await this.getBuilder().build(this.metadata);

			fs.writeFileSync(file, rawData || '', 'utf8');

			return Promise.resolve();
		} catch (ex) {
			return Promise.reject('Write failed: ' + (ex.message || ex));
		}
	};

	private getParser = (): ParserInterface => {
		if (this.parser) {
			return this.parser;
		}

		switch (this.getFileExtension()) {
			case 'json':
				this.parser = new JsonParser();
				break;
			default:
				this.parser = new XmlParser();
				break;
		}
		return this.parser;
	};

	private getBuilder = (): BuilderInterface => {
		if (this.builder) {
			return this.builder;
		}

		switch (this.getMetadataType()) {
			case DataType.Json:
				this.builder = new JsonBuilder();
				break;
			case DataType.Xml:
				this.builder = new XmlBuilder();
				break;
			case DataType.String:
				this.builder = new StringBuilder();
				break;
		}
		return this.builder;
	};

	private getFileExtension = (): string => {
		if (!this.file) {
			throw new Error('File not specified');
		}

		return this.file.substr(this.file.lastIndexOf('.') + 1);
	};

	private getMetadataType = (): DataType => {
		if (!this.metadata) {
			throw new Error('No metadata to build');
		}

		if (!Object.values(DataType).includes(this.metadata.type)) {
			throw new Error('Unsupported metadata data type');
		}

		return this.metadata.type;
	};
};