import { getCurrentWorkingDir } from "../../src/utils";

describe('utils', () => {
	it('getCurrentWorkingDir returns current working directory', () => {
		expect(getCurrentWorkingDir()).toEqual(process.cwd());
	});
});