import { StoreOptions } from 'vuex';

import Container from '../ioc/container';
import Types from '../ioc/types';
import ILogger from '../services/interfaces/logger.interface';
import IFileNode from '../services/interfaces/file-node.interface';
import DirectoryService from '../services/io/directory-service/directory-service';
import DirectoryViewerService from '../services/viewers/directory-viewer-service/directory-viewer-service';

type StoreState = { activeFile: null | { isFocused: boolean } };

const directoryService = new DirectoryService(Container.get<ILogger>(Types.ILogger));
const directoryViewerService = new DirectoryViewerService(directoryService);

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
