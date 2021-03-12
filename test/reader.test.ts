import { mocked } from "ts-jest/utils";
import { reader } from "../src";
import { File } from "../src/core";
import { getCurrentWorkingDir } from "./../src/utils";
import { createTestDir } from "./test-utils/file-utils";

jest.mock("../src/utils");

describe('reader', () => {
	it('call reader with array of patterns matching json and xml files therefore returns the 3 json and 3 xml files', async () => {
		const folderPath = createTestDir();

		const files = await reader(folderPath, [ '**/*.json', '**/*.xml' ]);

		expect(files.length).toEqual(6);
		expect(files[0]).toBeInstanceOf(File);
	});

	it('call reader with single pattern matching all json files therefore returns all 3 files', async () => {
		const folderPath = createTestDir();

		const files = await reader(folderPath, '**/*.json');

		expect(files.length).toEqual(3);
		expect(files[0]).toBeInstanceOf(File);
	});

	it('call reader with no pattern therefore returns all 9 files', async () => {
		const folderPath = createTestDir();

		const files = await reader(folderPath);

		expect(files.length).toEqual(9);
		expect(files[0]).toBeInstanceOf(File);
	});

	it('call reader with array of patterns matching json and xml files by options therefore returns the 3 json and 3 xml files', async () => {
		const folderPath = createTestDir();

		const files = await reader({
			baseDir: folderPath,
			patterns: [ '**/*.json', '**/*.xml' ]
		});

		expect(files.length).toEqual(6);
		expect(files[0]).toBeInstanceOf(File);
	});

	it('call reader with no pattern by options therefore returns all 9 files', async () => {
		const folderPath = createTestDir();

		const files = await reader({
			baseDir: folderPath
		});

		expect(files.length).toEqual(9);
		expect(files[0]).toBeInstanceOf(File);
	});

	it('call reader with no base directory therefore returns all 9 files in current working directory', async () => {
		const folderPath = createTestDir();
		mocked(getCurrentWorkingDir).mockReturnValue(folderPath);

		const files = await reader();

		expect(files.length).toEqual(9);
		expect(files[0]).toBeInstanceOf(File);
	});

	it('call reader with array of patterns matching json and xml files via options therefore returns the 3 json and 3 xml files', async () => {
		const folderPath = createTestDir();

		const files = await reader({
			baseDir: folderPath,
			patterns: [ '**/*.json', '**/*.xml' ]
		});

		expect(files.length).toEqual(6);
		expect(files[0]).toBeInstanceOf(File);
	});

	it('call reader with no pattern via options therefore returns all 9 files', async () => {
		const folderPath = createTestDir();

		const files = await reader({
			baseDir: folderPath
		});

		expect(files.length).toEqual(9);
		expect(files[0]).toBeInstanceOf(File);
	});

	it('invalid base directory rejects with error', () => {
		return expect(
			reader('invalid')
		).rejects.toBe('Metadata reader failed: Failed to get files: ENOENT: no such file or directory, scandir \'invalid\'');
	});
});