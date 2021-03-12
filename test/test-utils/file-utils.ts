import * as fs from "fs";
import * as path from "path";
import { sync as deleteDir } from "rimraf";
import { v4 as uuid } from "uuid";

const TEST_TEMP_DIR = 'tmp';

export function getTestFilePath(extension: string) {
	createTmpDir();
	const filename = uuid() + '.' + extension;
	const filepath = path.join(TEST_TEMP_DIR, filename);
	return filepath;
};

export function createTestFile(extension: string, data: string) {
	createTmpDir();

	const filepath = getTestFilePath(extension);

	fs.writeFileSync(filepath, data, 'utf8');

	return filepath;
};

export function createTestDir() {
	createTmpDir();
	const foldername = uuid();
	const folderpath = path.join(TEST_TEMP_DIR, foldername);

	fs.mkdirSync(folderpath);
	fs.mkdirSync(path.join(folderpath, 'folder1'));
	fs.mkdirSync(path.join(folderpath, 'folder1', 'foldera'));
	fs.mkdirSync(path.join(folderpath, 'folder2'));

	createTestFileSet(path.join(folderpath, 'folder1'));
	createTestFileSet(path.join(folderpath, 'folder1', 'foldera'));
	createTestFileSet(path.join(folderpath, 'folder2'));

	return folderpath;
};

export function createTestFileSet(folder: string) {
	fs.writeFileSync(path.join(folder, 'json-file.json'), '{ "string": "value" }', 'utf8');
	fs.writeFileSync(path.join(folder, 'xml-file.xml'), '<tag><string>value</string></tag>', 'utf8');
	fs.writeFileSync(path.join(folder, 'text-file.txt'), 'value', 'utf8');
};

export function readTestFile(filepath: string) {
	return fs.readFileSync(filepath, 'utf8');
};

export function createTmpDir() {
	if (!fs.existsSync(TEST_TEMP_DIR)) {
		fs.mkdirSync(TEST_TEMP_DIR);
	}
};

export function deleteTmpDir() {
	deleteDir(TEST_TEMP_DIR);
};