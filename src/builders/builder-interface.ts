import { Metadata } from "../types";

export interface BuilderInterface {
	build(data: Metadata): Promise<string>;
};