import 'mocha';
import { expect } from 'chai';
import { stub, SinonStubbedInstance } from 'sinon';
import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';

import Types from '../../core/ioc/types';
import Container from '../../core/ioc/container';
import IFileContent from '../../core/interface/io/file/file-content.interface';
import IFileService from '../../core/interface/io/file/file-service.interface';

import OpenedFilesStore from './opened-files-store';

createLocalVue().use(Vuex);

context('opened files store unit test', () => {
    let store: Store<any>;
    let fileServiceStub: SinonStubbedInstance<IFileService>;

    beforeEach('stub setup', () => {
        Container.snapshot();

        fileServiceStub = stub({
            async readFile() { return new Buffer(''); }
        } as IFileService);

        Container
            .rebind<IFileService>(Types.IFileService)
            .toConstantValue(fileServiceStub);
    });

    beforeEach('test setup', () => {
        store = new Store(OpenedFilesStore());
    });

    afterEach('test teardown', () => {
        Container.restore();
    });

    describe('isPreviewed', () => {
        it('should return true when specified path is being previewed', () => {
            const path = 'example_path';
            store.state.previewed = { path } as IFileContent;

            expect(store.getters.isPreviewed(path)).to.be.true;
        });

        it('should return false when specified path is not being previewed', () => {
            store.state.previewed = { path: 'another_path' } as IFileContent;

            expect(store.getters.isPreviewed('example_path')).to.be.false;
        });

        it('should return false when no file is being previewed', () => {
            store.state.previewed = null;

            expect(store.getters.isPreviewed('example_path')).to.be.false;
        });
    });

    describe('lastOpenedFile', () => {
        it('should return last opened file', () => {
            const file = {} as IFileContent;
            store.state.lastOpened = file;

            expect(store.getters.lastOpenedFile.path).to.equal(file.path);
        });
    });

    describe('openedFiles', () => {
        it('should return all opened files', () => {
            const opened = [{ path: 'path_1' }, { path: 'path_2' }] as IFileContent[];
            const previewed = { path: 'path_3' } as IFileContent;
            store.state.opened = opened;
            store.state.previewed = previewed;

            const result = store.getters.openedFiles;

            expect(result.opened).to.deep.equal(opened);
            expect(result.previewed).to.deep.equal(previewed);
        });

        it('should return null when no file is opened', () => {
            store.state.opened = [];
            store.state.previewed = null;

            expect(store.getters.openedFiles).to.be.null;
        });
    });

    describe('setLastOpenedFile', () => {
        it('should set last opened file when specified file is being previewed', () => {
            const file = { path: 'path' } as IFileContent;
            store.state.previewed = file;
            store.state.lastOpened = { path: 'another_path' } as IFileContent;

            store.dispatch('setLastOpenedFile', file.path);

            expect(store.state.lastOpened.path).to.equal(file.path);
        });

        it('should set last opened file when specified file is already opened', () => {
            const files = [{ path: 'path_1' }, { path: 'path_2' }, { path: 'path_3' }] as IFileContent[];
            store.state.opened = files;
            store.state.lastOpened = files[1];

            store.dispatch('setLastOpenedFile', files[2].path);

            expect(store.state.lastOpened.path).to.equal(files[2].path);
        });

        it('should throw error when specified file is neither previewed or opened', () => {
            try {
                const files = [{ path: 'path_1' }, { path: 'path_2' }] as IFileContent[];
                store.state.opened = files;
                store.state.previewed = { path: 'path_3' } as IFileContent;

                store.dispatch('setLastOpenedFile', 'path_4');
            }
            catch {
                return;
            }

            throw new Error('Did not throw error as expected.');
        });
    });

    describe('openFile', () => {
        it('should close previewed file if it is going to be opened', async () => {
            const file = { path: 'path' } as IFileContent;
            store.state.previewed = file;

            await store.dispatch('openFile', file.path);

            expect(store.state.previewed).to.be.null;
        });

        it('should record specified file and last opened file if it is not already opened', async () => {
            const newPath = 'path_2';
            const files = [{ path: 'path_1' }] as IFileContent[];
            store.state.opened = files.slice();
            store.state.lastOpened = files[0];

            await store.dispatch('openFile', newPath);

            expect(store.state.opened.length).to.equal(files.length + 1);
            expect(store.state.opened[1].path).to.equal(newPath);
            expect(store.state.lastOpened.path).to.equal(newPath);
        });

        it('should not record specified file but set last opened file if it is already opened', async () => {
            const [oldPath, newPath] = ['path_1', 'path_2'];
            store.state.opened = [];

            await store.dispatch('openFile', oldPath);
            expect(store.state.opened.length).to.equal(1);
            expect(store.state.lastOpened.path).to.equal(oldPath);

            await store.dispatch('openFile', newPath);
            expect(store.state.opened.length).to.equal(2);
            expect(store.state.lastOpened.path).to.equal(newPath);

            await store.dispatch('openFile', oldPath);
            // no new record will be created as the file is already opened
            expect(store.state.opened.length).to.equal(2);
            expect(store.state.lastOpened.path).to.equal(oldPath);
        });
    });

    describe('closeOpenedFile', () => {
        it('should close the file', () => {
            const files = [{ path: 'path_1' }, { path: 'path_2' }, { path: 'path_3' }] as IFileContent[];
            store.state.opened = files.slice();

            store.dispatch('closeOpenedFile', files[1].path);

            expect(store.state.opened.length).to.equal(files.length - 1);
            expect(store.state.opened[0].path).to.equal(files[0].path);
            expect(store.state.opened[1].path).to.equal(files[2].path);
        });

        it('should not set last opened file if specified file is not the current last opened file', () => {
            const files = [{ path: 'path_1' }, { path: 'path_2' }, { path: 'path_3' }] as IFileContent[];
            store.state.opened = files.slice();
            store.state.lastOpened = files[2];

            store.dispatch('closeOpenedFile', files[1].path);

            expect(store.state.opened.length).to.equal(files.length - 1);
            expect(store.state.lastOpened.path).to.equal(files[2].path);
        });

        it('should set last opened file to null when no file is opened or previewed', () => {
            const file = { path: 'path' } as IFileContent;
            store.state.opened = [file];
            store.state.previewed = null;
            store.state.lastOpened = file;

            store.dispatch('closeOpenedFile', file.path);

            expect(store.state.opened).to.be.empty;
            expect(store.state.lastOpened).to.be.null;
        });

        it('should set last opened file to previewed file when no other files are opened', () => {
            const target = { path: 'path_1' } as IFileContent;
            const previewed = { path: 'path_2' } as IFileContent;
            store.state.opened = [target];
            store.state.previewed = previewed;
            store.state.lastOpened = target;

            store.dispatch('closeOpenedFile', target.path);

            expect(store.state.opened).to.be.empty;
            expect(store.state.lastOpened.path).to.equal(previewed.path);
        });

        it('should set last opened file to previous file in the tracker when possible', () => {
            const files = [{ path: 'path_1' }, { path: 'path_2' }] as IFileContent[];
            store.state.opened = files.slice();
            store.state.lastOpened = files[1];

            store.dispatch('closeOpenedFile', files[1].path);

            expect(store.state.opened.length).to.equal(1);
            expect(store.state.lastOpened.path).to.equal(files[0].path);
        });

        it('should set last opened file to next file in the tracker when not possible', () => {
            const files = [{ path: 'path_1' }, { path: 'path_2' }] as IFileContent[];
            store.state.opened = files.slice();
            store.state.lastOpened = files[0];

            store.dispatch('closeOpenedFile', files[0].path);

            expect(store.state.opened.length).to.equal(1);
            expect(store.state.lastOpened.path).to.equal(files[1].path);
        });
    });

    describe('previewFile', () => {
        it('should preview file and set last opened file when the file is not already previewed', async () => {
            const [oldPath, newPath] = ['path_1', 'path_2'];
            store.state.previewed = { path: oldPath } as IFileContent;
            store.state.lastOpened = { path: oldPath } as IFileContent;

            await store.dispatch('previewFile', newPath);

            expect(store.state.previewed.path).to.equal(newPath);
            expect(store.state.lastOpened.path).to.equal(newPath);
        });

        it('should preview file and set last opened file when the file is already previewed', async () => {
            const [oldPath, newPath] = ['path_1', 'path_2'];
            store.state.previewed = { path: newPath } as IFileContent;
            store.state.lastOpened = { path: newPath } as IFileContent;

            await store.dispatch('previewFile', oldPath);

            expect(store.state.previewed.path).to.equal(oldPath);
            expect(store.state.lastOpened.path).to.equal(oldPath);
        });
    });

    describe('closePreviewFile', () => {
        it('should close previewed file', () => {
            const file = { path: 'path' } as IFileContent;
            store.state.previewed = file;

            store.dispatch('closePreviewFile');

            expect(store.state.previewed).to.be.null;
        });

        it('should set last opened file to null when no other files are opened', () => {
            const file = { path: 'path' } as IFileContent;
            store.state.opened = [];
            store.state.previewed = file;
            store.state.lastOpened = file;

            store.dispatch('closePreviewFile');

            expect(store.state.previewed).to.be.null;
            expect(store.state.lastOpened).to.be.null;
        });

        it('should set last opened file to last file in file tracker', () => {
            const files = [{ path: 'path_1' }, { path: 'path_2' }, { path: 'path_3' }] as IFileContent[];
            store.state.opened = files.slice(0, 2);
            store.state.previewed = files[2];
            store.state.lastOpened = files[2];

            store.dispatch('closePreviewFile');

            expect(store.state.previewed).to.be.null;
            expect(store.state.lastOpened.path).to.equal(files[1].path);
        });
    });

    describe('closeFile', () => {
        it('should close previewed file when specified file is currently opened', () => {
            store.state.opened = [{ path: 'path_1' }, { path: 'path_2' }] as IFileContent[];
            store.state.previewed = { path: 'path_3' } as IFileContent;

            store.dispatch('closeFile', 'path_2');

            expect(store.state.opened.length).to.equal(1);
            expect(store.state.previewed).to.be.not.null;
        });

        it('should close previewed file when specified file is currently previewed', () => {
            store.state.opened = [{ path: 'path_1' }, { path: 'path_2' }] as IFileContent[];
            store.state.previewed = { path: 'path_3' } as IFileContent;

            store.dispatch('closeFile', 'path_3');

            expect(store.state.opened.length).to.equal(2);
            expect(store.state.previewed).to.be.null;
        });

        it('should throw error when specified file is neither opened or previewed', () => {
            try {
                store.state.opened = [{ path: 'path_1' }, { path: 'path_2' }] as IFileContent[];
                store.state.previewed = { path: 'path_3' } as IFileContent;

                store.dispatch('closeFile', 'path_4');
            }
            catch {
                return;
            }

            throw new Error('Did not throw error as expected.');
        });
    });
});
