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
    closeFile(state: any, payload: { path: string, isCurrent: boolean }): void {
        const { path, isCurrent } = payload;
        openedFilePaths.delete(path);
        const index = state.openedFiles.findIndex((_: IFileContent) => _.path === path);
        state.openedFiles = state.openedFiles.filter((_: IFileContent) => _.path !== path);

        if (!isCurrent) {
            return;
        }

        if (!state.openedFiles.length) {
            return state.lastOpenedFilePath = state.previewedFile ? state.previewedFile.path : '';
        }
        state.lastOpenedFilePath = state.openedFiles[index > 0 ? index - 1 : index].path;
    },
    previewFile(state: any, file: IFileContent): void {
        openedFilePaths.add(file.path);
        state.previewedFile = file;
    },
    closePreview(state: any): void {
        if (!state.previewedFile) {
            return;
        }
        openedFilePaths.delete(state.previewedFile.path);
        state.previewedFile = null;

        if (state.openedFiles.length) {
            state.lastOpenedFilePath = state.openedFiles.slice(-1)[0].path;
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
    closeFile(context: any, payload: { path: string, isCurrent: boolean }): void {
        const isPreviewed = context.getters.isPreviewed(payload.path);
        context.commit(isPreviewed ? 'closePreview' : 'closeFile', payload);
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
