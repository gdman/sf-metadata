// tslint:disable-next-line:no-reference
/// <reference path="../../types/xml2js-fork-stringify.d.ts" />

import { Builder, BuilderOptions } from "xml2js-fork-stringify";
import { Metadata } from "../types";
import { BuilderInterface } from "./builder-interface";

export type XmlBuilderOptions = {
	disableReplaceXmlEntities?: boolean;
};

export class XmlBuilder implements BuilderInterface {
	private enableReplaceXmlEntities: boolean = true;

	constructor(options?: XmlBuilderOptions) {
		if (!options) {
			options = {};
		}

		if (options.disableReplaceXmlEntities) {
			this.disableReplaceXmlEntities();
		}
	};

	public disableReplaceXmlEntities = (): XmlBuilder => {
		this.enableReplaceXmlEntities = false;
		return this;
	};

	public build(metadata: Metadata): Promise<string> {
		try {
			const builderConfig: BuilderOptions = {
				renderOpts : {
					pretty     : true,
					indent     : '    ',
					newline    : '\n'
				},
				xmldec : {
					version    : '1.0',
					encoding   : 'UTF-8',
					standalone : null
				}
			};

			if (this.enableReplaceXmlEntities) {
				builderConfig.stringify = {
					textEscape: (str: string) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
				}
			}

			const rootKey = metadata.rootKey;
			let buildData: any = {};
			if (rootKey) {
				buildData[rootKey] = metadata.data || {};
			} else {
				buildData = metadata.data || {};
			}

			return Promise.resolve(new Builder(builderConfig).buildObject(buildData) + '\n');
		} catch (ex) {
			return Promise.reject('XML build failed: ' + (ex.message || ex));
		}
	};
};