import path from "path";
import { mocked } from "ts-jest/utils";
import { Collection, File } from "../../src/core";
import { getCurrentWorkingDir } from "../../src/utils";
import { createTestDir } from "../test-utils/file-utils";

jest.mock("../../src/utils");

describe('Collection', () => {
	it('construct with base directory and pattern can return files', async () => {
		const folderPath = createTestDir();

		const collection = new Collection(folderPath, '**/*.json');
		const files = await collection.getFileNames();

		expect(files.length).toEqual(3);
		expect(files).toContain(path.join('folder1', 'foldera', 'json-file.json'));
		expect(files).toContain(path.join('folder1', 'json-file.json'));
		expect(files).toContain(path.join('folder2', 'json-file.json'));
	});

	it('construct with base directory and array of patterns can return files', async () => {
		const folderPath = createTestDir();

		const collection = new Collection(folderPath, [ 'folder1/**/*.json', 'folder2/**/*.xml' ]);
		const files = await collection.getFileNames();

		expect(files.length).toEqual(3);
		expect(files).toContain(path.join('folder1', 'foldera', 'json-file.json'));
		expect(files).toContain(path.join('folder1', 'json-file.json'));
		expect(files).toContain(path.join('folder2', 'xml-file.xml'));
	});

	it('construct with base directory and pattern options can return files (prove options used by adding pattern thats not covered by root dir)', async () => {
		const folderPath = createTestDir();

		const collection = new Collection({
			baseDir: path.join(folderPath, 'folder1'),
			patterns: [ 'foldera/*.json', '*.xml', 'folder2/*.txt' ]
		});
		const files = await collection.getFileNames();

		expect(files.length).toEqual(2);
		expect(files).toContain(path.join('foldera', 'json-file.json'));
		expect(files).toContain('xml-file.xml');
	});

	it('construct with base directory option only can return files', async () => {
		const folderPath = createTestDir();

		const collection = new Collection({
			baseDir: path.join(folderPath, 'folder1')
		});
		const files = await collection.getFileNames();

		expect(files.length).toEqual(6);
		expect(files).toContain(path.join('foldera', 'json-file.json'));
		expect(files).toContain(path.join('foldera', 'xml-file.xml'));
		expect(files).toContain(path.join('foldera', 'text-file.txt'));
		expect(files).toContain('json-file.json');
		expect(files).toContain('xml-file.xml');
		expect(files).toContain('text-file.txt');
	});

	it('construct with patterns option only can return files', async () => {
		const folderPath = createTestDir();
		mocked(getCurrentWorkingDir).mockReturnValue(folderPath);

		const collection = new Collection({
			patterns: [ 'folder1/**/*.json', 'folder2/**/*.xml' ]
		});
		const files = await collection.getFileNames();

		expect(files.length).toEqual(3);
		expect(files).toContain(path.join('folder1', 'foldera', 'json-file.json'));
		expect(files).toContain(path.join('folder1', 'json-file.json'));
		expect(files).toContain(path.join('folder2', 'xml-file.xml'));
	});

	it('construct with no parameters and setDir can return files', async () => {
		const folderPath = createTestDir();

		const collection = new Collection()
			.setBaseDir(path.join(folderPath, 'folder2'));
		const files = await collection.getFileNames();

		expect(files.length).toEqual(3);
		expect(files).toContain('json-file.json');
		expect(files).toContain('xml-file.xml');
		expect(files).toContain('text-file.txt');
	});

	it('construct with no parameters and setPatterns can return files', async () => {
		const folderPath = createTestDir();
		mocked(getCurrentWorkingDir).mockReturnValue(folderPath);

		const collection = new Collection()
			.setPatterns([ 'folder1/**/*.json', 'folder2/**/*.xml' ]);
		const files = await collection.getFileNames();

		expect(files.length).toEqual(3);
		expect(files).toContain(path.join('folder1', 'foldera', 'json-file.json'));
		expect(files).toContain(path.join('folder1', 'json-file.json'));
		expect(files).toContain(path.join('folder2', 'xml-file.xml'));
	});

	it('construct with no parameters and setDir + setPatterns can return files (prove options used by adding pattern thats not covered by root dir)', async () => {
		const folderPath = createTestDir();

		const collection = new Collection()
			.setBaseDir(path.join(folderPath, 'folder1'))
			.setPatterns([ 'foldera/*.json', '*.xml', 'folder2/*.txt' ]);
		const files = await collection.getFileNames();

		expect(files.length).toEqual(2);
		expect(files).toContain(path.join('foldera', 'json-file.json'));
		expect(files).toContain('xml-file.xml');
	});

	it('construct with no parameter doesnt throw', () => {
		expect(new Collection()).not.toBeNull();
	});

	it('construct with base directory only returns all files', async () => {
		const folderPath = createTestDir();

		const collection = new Collection(folderPath);
		const files = await collection.getFileNames();

		expect(files.length).toEqual(9);
	});

	it('construct with no parameters returns all files will return all files in the current working directory', async () => {
		const folderPath = createTestDir();
		mocked(getCurrentWorkingDir).mockReturnValue(folderPath);

		const files = await new Collection().getFileNames();

		expect(files.length).toEqual(9);
	});

	it('construct with empty options returns all files will return all files in the current working directory', async () => {
		const folderPath = createTestDir();
		mocked(getCurrentWorkingDir).mockReturnValue(folderPath);

		const files = await new Collection({}).getFileNames();

		expect(files.length).toEqual(9);
	});

	it('construct with no pattern match doesnt error', async () => {
		const folderPath = createTestDir();
		mocked(getCurrentWorkingDir).mockReturnValue(folderPath);

		const collection = new Collection()
			.setPatterns([ '**/*.exe' ]);
		const files = await collection.getFileNames();

		expect(files.length).toEqual(0);
	});

	it('getFiles returns File objects', async () => {
		const folderPath = createTestDir();
		mocked(getCurrentWorkingDir).mockReturnValue(folderPath);

		const collection = new Collection()
			.setPatterns([ '**/*' ]);
		const files = await collection.getFiles();

		expect(files.length).toEqual(9);
		expect(files[0]).toBeInstanceOf(File);
		expect(files[0].getFile()).toEqual(path.join(folderPath, 'folder1', 'foldera', 'json-file.json'));
	});

	it('errors are caught and wrapped to give context', () => {
		return expect(
			new Collection('does-not-exist').getFileNames()
		).rejects.toEqual('Failed to get files: ENOENT: no such file or directory, scandir \'does-not-exist\'');
	});
});