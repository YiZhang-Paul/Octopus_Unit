import 'mocha';
import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';

import Types from '../../../ioc/types';
import Container from '../../../ioc/container';
import IDirectoryService from '../../../interface/io/directory/directory-service.interface';

context('directory service integration test', () => {
    let service: IDirectoryService;
    const samplePath = path.resolve(__dirname, '../../../testing-temp');

    beforeEach('test setup', () => {
        service = Container.get<IDirectoryService>(Types.IDirectoryService);
        fs.mkdirSync(`${samplePath}/sample_dir/`, { recursive: true });
        fs.outputFileSync(`${samplePath}/sample_file_1.txt`, '');
        fs.outputFileSync(`${samplePath}/sample_dir/sample_file_2.txt`, '');
    });

    afterEach('test teardown', () => {
        fs.removeSync(samplePath);
    });

    describe('listDirectoryFlat', () => {
        it('should return names of all files and directories', async () => {
            const result = await service.listDirectoryFlat(samplePath);

            expect(result.length).to.equal(2);
            expect(result[0]).to.equal('sample_dir');
            expect(result[1]).to.equal('sample_file_1.txt');
        });

        it('should throw empty collection when directory does not exist', async () => {
            try {
                await service.listDirectoryFlat(`${samplePath}/invalid.txt`);

                throw null;
            }
            catch (error) {
                expect(error.length).to.equal(0);
            }
        });
    });

    describe('listDirectoryRecursive', () => {
        it('should return names of all files and directories under specified path', async () => {
            const result = await service.listDirectoryRecursive(samplePath);

            expect(result.length).to.equal(2);
            expect(result[0].name).to.equal('sample_dir');
            expect(result[1].name).to.equal('sample_file_1.txt');
        });

        it('should return children for directories', async () => {
            const result = await service.listDirectoryRecursive(samplePath);

            expect(result[0].name).to.equal('sample_dir');
            expect((result[0].children || []).length).to.equal(1);
            expect((result[0].children || [])[0].name).to.equal('sample_file_2.txt');
        });

        it('should not return any child for files', async () => {
            const result = await service.listDirectoryRecursive(samplePath);

            expect(result[1].name).to.equal('sample_file_1.txt');
            expect(result[1].children).to.be.null;
        });
    });

    describe('isDirectory', () => {
        it('should return true when path points to a directory', async () => {
            const path = `${samplePath}/sample_dir`;

            expect(await service.isDirectory(path)).to.be.true;
        });

        it('should return false when path points to a file', async () => {
            const path = `${samplePath}/sample_file_1.txt`;

            expect(await service.isDirectory(path)).to.be.false;
        });

        it('should return false when path does not exist', async () => {
            const path = `${samplePath}/invalid_file.txt`;

            expect(await service.isDirectory(path)).to.be.false;
        });
    });
});
