import { StoreOptions } from 'vuex';

import Container from '../ioc/container';
import Types from '../ioc/types';
import ILogger from '../services/interfaces/logger.interface';
import IFileContent from '../services/interfaces/file-content.interface';
import FileService from '../services/io/file-service/file-service';

type StoreState = {
    lastOpenedFilePath: string;
    openedFiles: IFileContent[];
    previewedFile: IFileContent | null
};

const fileService = new FileService(Container.get<ILogger>(Types.ILogger));
const openedFilePaths = new Set<string>();

const state: StoreState = {
    lastOpenedFilePath: '',
    openedFiles: [],
    previewedFile: null
};

const mutations = {
    setLastOpenedFilePath(state: StoreState, path: string): void {
        state.lastOpenedFilePath = path;
    },
    openFile(state: StoreState, file: IFileContent): void {
        openedFilePaths.add(file.path);
        state.openedFiles.push(file);
    },
    closeFile(state: StoreState, path: string): void {
        openedFilePaths.delete(path);
        state.openedFiles = state.openedFiles.filter(_ => _.path !== path);
    },
    previewFile(state: StoreState, file: IFileContent): void {
        openedFilePaths.add(file.path);
        state.previewedFile = file;
    },
    closePreview(state: StoreState): void {
        if (state.previewedFile) {
            openedFilePaths.delete(state.previewedFile.path);
            state.previewedFile = null;
        }
    }
};

const actions = {
    async openFile(context: { getters: any, commit: any }, path: string): Promise<void> {
        const { getters, commit } = context;

        if (getters.isPreviewed(path)) {
            commit('closePreview');
        }

        if (!openedFilePaths.has(path)) {
            const content = await fileService.readFile(path);
            commit('openFile', { path, content } as IFileContent);
        }
        commit('setLastOpenedFilePath', path);
    },
    async previewFile(context: any, path: string): Promise<void> {
        const { commit } = context;

        if (!openedFilePaths.has(path)) {
            commit('closePreview');
            const content = await fileService.readFile(path);
            commit('previewFile', { path, content } as IFileContent);
        }
        commit('setLastOpenedFilePath', path);
    },
    closeFile(context: { getters: any, commit: any, state: StoreState }, payload: { path: string, isCurrent: boolean }): void {
        const { path, isCurrent } = payload;
        const { getters, commit, state } = context;
        const isPreviewed = getters.isPreviewed(path);
        const index = state.openedFiles.findIndex(_ => _.path === path);
        commit(isPreviewed ? 'closePreview' : 'closeFile', path);

        if (isPreviewed && state.openedFiles.length) {
            commit('setLastOpenedFilePath', state.openedFiles.slice(-1)[0].path);
        }

        if (isPreviewed || !isCurrent) {
            return;
        }
        // shift focus to next available file that is opened or previewed
        if (!state.openedFiles.length) {
            const path = state.previewedFile ? state.previewedFile.path : '';
            commit('setLastOpenedFilePath', path);
        }
        else if (index >= 0) {
            const nextIndex = Math.max(0, index - 1);
            commit('setLastOpenedFilePath', state.openedFiles[nextIndex].path);
        }
    }
};

const getters = {
    isPreviewed(state: StoreState): Function {
        return (path: string): boolean => !!state.previewedFile && state.previewedFile.path === path;
    },
    openedFiles(state: StoreState): { openedFiles: IFileContent[], previewedFile: IFileContent | null } | null {
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
} as StoreOptions<StoreState>;
