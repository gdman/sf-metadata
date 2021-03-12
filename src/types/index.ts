export enum DataType {
	Xml = 'xml',
	Json = 'json',
	String = 'string'
};

export type Metadata = {
	rootKey?: any;
	data: any;
	type: DataType;
};