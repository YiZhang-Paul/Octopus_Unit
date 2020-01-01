import 'mocha';
import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';

import DirectoryService from './directory-service';

context('directory service integration test', () => {
    let service: DirectoryService;
    const samplePath = path.resolve(__dirname, '../../../testing-temp');

    beforeEach('test setup', () => {
        service = new DirectoryService();
        fs.mkdirSync(`${samplePath}/sample_dir/`, { recursive: true });
        fs.outputFileSync(`${samplePath}/sample_file.txt`, '');
    });

    afterEach('test teardown', () => {
        fs.removeSync(samplePath);
    });

    describe('listDirectory', () => {
        it('should return names of all files and directories', async () => {
            const result = await service.listDirectory(samplePath);

            expect(result.length).to.equal(2);
            expect(result[0]).to.equal('sample_dir');
            expect(result[1]).to.equal('sample_file.txt');
        });

        it('should throw empty collection when directory does not exist', async () => {
            try {
                await service.listDirectory(`${samplePath}/invalid.txt`);

                throw null;
            }
            catch (error) {
                expect(error.length).to.equal(0);
            }
        });
    });

    describe('isDirectory', () => {
        it('should return true when path points to a directory', async () => {
            const path = `${samplePath}/sample_dir`;

            expect(await service.isDirectory(path)).to.be.true;
        });

        it('should return false when path points to a file', async () => {
            const path = `${samplePath}/sample_file.txt`;

            expect(await service.isDirectory(path)).to.be.false;
        });

        it('should return false when path does not exist', async () => {
            const path = `${samplePath}/invalid_file.txt`;

            expect(await service.isDirectory(path)).to.be.false;
        });
    });
});
