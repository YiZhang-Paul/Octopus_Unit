import { StoreOptions } from 'vuex';

import IFileContent from '../services/interfaces/file-content.interface';
import FileService from '../services/io/file-service';

const fileService = new FileService();
const openedFilePaths = new Set<string>();

const state = {
    lastOpenedFilePath: '',
    openedFiles: [],
    previewedFile: null
};

const mutations = {
    openFile(state: any, file: IFileContent): void {
        openedFilePaths.add(file.path);
        state.openedFiles.push(file);
    },
    closeFile(state: any, path: string): void {
        openedFilePaths.delete(path);
        state.openedFiles = state.openedFiles.filter((_: IFileContent) => _.path !== path);
    },
    previewFile(state: any, file: IFileContent): void {
        openedFilePaths.add(file.path);
        state.previewedFile = file;
    },
    closePreview(state: any): void {
        if (state.previewedFile) {
            openedFilePaths.delete(state.previewedFile.path);
            state.previewedFile = null;
        }
    }
};

const actions = {
    async openFile(context: any, path: string): Promise<void> {
        context.state.lastOpenedFilePath = path;

        if (context.getters.isPreviewed(path)) {
            context.commit('closePreview');
        }

        if (!openedFilePaths.has(path)) {
            const content = await fileService.readFile(path);
            context.commit('openFile', { path, content } as IFileContent);
        }
    },
    async previewFile(context: any, path: string): Promise<void> {
        context.state.lastOpenedFilePath = path;

        if (!openedFilePaths.has(path)) {
            context.commit('closePreview');
            const content = await fileService.readFile(path);
            context.commit('previewFile', { path, content } as IFileContent);
        }
    },
    closeFile(context: any, path: string): void {
        const isPreviewed = context.getters.isPreviewed(path);
        context.commit(isPreviewed ? 'closePreview' : 'closeFile', path);
    }
};

const getters = {
    isPreviewed(state: any): Function {
        return (path: string): boolean => state.previewedFile && state.previewedFile.path === path;
    },
    openedFiles(state: any): { openedFiles: IFileContent[], previewedFile: IFileContent } | null {
        const { openedFiles, previewedFile } = state;

        return openedFiles.length || previewedFile ? ({ openedFiles, previewedFile }) : null;
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
} as StoreOptions<any>;
