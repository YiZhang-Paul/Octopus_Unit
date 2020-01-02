import 'mocha';
import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';

import Container from '../../../ioc/container';
import Types from '../../../ioc/types';
import ILogger from '../../interfaces/logger.interface';

import FileService from './file-service';

context('file service integration test', () => {
    let service: FileService;
    const samplePath = path.resolve(__dirname, '../../../testing-temp');

    beforeEach('test setup', () => {
        service = new FileService(Container.get<ILogger>(Types.ILogger));
        fs.outputFileSync(`${samplePath}/sample_file.txt`, 'sample text');
    });

    afterEach('test teardown', () => {
        fs.removeSync(samplePath);
    });

    describe('readFile', () => {
        it('should return content read from file', async () => {
            const result = await service.readFile(`${samplePath}/sample_file.txt`);

            expect(result.toString()).to.equal('sample text');
        });

        it('should throw empty string when file does not exist', async () => {
            try {
                await service.readFile(`${samplePath}/invalid_file.txt`);

                throw 'should not reach this line';
            }
            catch (error) {
                expect(error).to.be.empty;
            }
        });
    });
});
