import { StoreOptions } from 'vuex';

import IFileNode from '../services/interfaces/file-node.interface';
import DirectoryService from '../services/io/directory-service';
import DirectoryViewerService from '../services/viewers/directory-viewer-service/directory-viewer-service';

type StoreState = { activeFile: null | { isFocused: boolean } };

const directoryViewerService = new DirectoryViewerService(new DirectoryService());

const state: StoreState = { activeFile: null };

const mutations = {
    selectFile(state: StoreState, file: { isFocused: boolean }): void {
        state.activeFile = file;
        state.activeFile.isFocused = true;
    },
    resetSelectedFile(state: StoreState): void {
        if (state.activeFile) {
            state.activeFile.isFocused = false;
            state.activeFile = null;
        }
    }
};

const actions = {
    async loadItems(_: any, filePath: string): Promise<IFileNode[]> {
        return await directoryViewerService.listDirectoryRecursive(filePath);
    },
    selectDirectoryFile(context: any, file: { isFocused: boolean }): void {
        const { commit } = context;
        commit('resetSelectedFile');
        commit('selectFile', file);
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
} as StoreOptions<StoreState>;
