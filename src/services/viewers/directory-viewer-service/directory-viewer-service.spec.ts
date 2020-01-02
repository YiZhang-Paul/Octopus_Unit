import 'mocha';
import { expect } from 'chai';
import { stub, SinonStubbedInstance } from 'sinon';

import Types from '../../../ioc/types';
import Container from '../../../ioc/container';
import IDirectoryService from '../../interfaces/directory-service.interface';
import IDirectoryViewerService from '../../interfaces/directory-viewer-service.interface';

context('directory viewer service unit test', () => {
    let directoryServiceStub: SinonStubbedInstance<IDirectoryService>;
    let directoryViewerService: IDirectoryViewerService;

    beforeEach('stub setup', () => {
        Container.snapshot();

        directoryServiceStub = stub({
            async listDirectory(_: any) { return []; },
            async isDirectory(_: any) { return false; }
        } as IDirectoryService);

        Container
            .rebind<IDirectoryService>(Types.IDirectoryService)
            .toConstantValue(directoryServiceStub);
    });

    beforeEach('test setup', () => {
        directoryViewerService = Container.get<IDirectoryViewerService>(Types.IDirectoryViewerService);
    });

    afterEach('test teardown', () => {
        Container.restore();
    });

    describe('listDirectoryRecursive', () => {
        it('should return all files under specified directory', async () => {
            const [file1, file2] = ['file_name_1.ts', 'file_name_2.ts'];
            directoryServiceStub.listDirectory.resolves([file1, file2]);
            directoryServiceStub.isDirectory.resolves(false);

            const result = await directoryViewerService.listDirectoryRecursive('');

            expect(result.length).to.equal(2);
            expect(result[0].name).to.equal(file1);
            expect(result[1].name).to.equal(file2);
        });

        it('should return children for directories', async () => {
            const [file1, file2, file3] = ['file_name_1.ts', 'file_name_2.ts', 'file_name_3.ts'];
            directoryServiceStub.listDirectory.onFirstCall().resolves([file1]);
            directoryServiceStub.listDirectory.onSecondCall().resolves([file2, file3]);
            directoryServiceStub.isDirectory.onFirstCall().resolves(true);
            directoryServiceStub.isDirectory.resolves(false);

            const result = await directoryViewerService.listDirectoryRecursive('');

            expect(result[0].name).to.equal(file1);
            expect((result[0].children || []).length).to.equal(2);
            expect((result[0].children || [])[0].name).to.equal(file2);
            expect((result[0].children || [])[1].name).to.equal(file3);
        });

        it('should not return any child for files', async () => {
            const file = 'file_name.ts'
            directoryServiceStub.listDirectory.resolves([file]);
            directoryServiceStub.isDirectory.resolves(false);

            const result = await directoryViewerService.listDirectoryRecursive('');

            expect(result[0].name).to.equal(file);
            expect(result[0].children).to.be.null;
        });
    });
});
