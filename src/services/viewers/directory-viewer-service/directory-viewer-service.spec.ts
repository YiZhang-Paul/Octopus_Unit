import 'mocha';
import { expect } from 'chai';
import { stub, SinonStubbedInstance } from 'sinon';

import IDirectoryService from '../../interfaces/directory-service.interface';
import DirectoryViewerService from './directory-viewer-service';

context('directory viewer service unit test', () => {
    let directoryServiceStub: SinonStubbedInstance<IDirectoryService>;
    let directoryViewerService: DirectoryViewerService;

    beforeEach('stub setup', () => {
        directoryServiceStub = stub({
            async listDirectory(_: any) { return []; },
            async isDirectory(_: any) { return false; }
        } as IDirectoryService);
    });

    beforeEach('test setup', () => {
        directoryViewerService = new DirectoryViewerService(directoryServiceStub);
    });

    describe('listDirectoryRecursive', () => {
        it('should not return any child for files', async () => {
            const file = 'file_name.ts'
            directoryServiceStub.listDirectory.resolves([file]);
            directoryServiceStub.isDirectory.resolves(false);

            const result = await directoryViewerService.listDirectoryRecursive('path');

            expect(result.length).to.equal(1);
            expect(result[0].name).to.equal(file);
            expect(result[0].children).to.be.null;
        });
    });
});
