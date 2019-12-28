import { StoreOptions } from 'vuex';

import IFileNode from '../services/interfaces/file-node.interface';
import DirectoryService from '../services/io/directory-service';
import DirectoryViewerService from '../services/viewers/directory-viewer-service';

const directoryViewerService = new DirectoryViewerService(new DirectoryService());

const state = {
    activeFile: null
};

const mutations = {
    selectFile(state: any, file: any): void {
        state.activeFile = file;
        state.activeFile.isFocused = true;
    },
    resetSelectedFile(state: any): void {
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
    selectDirectoryFile(context: any, file: any): void {
        context.commit('resetSelectedFile');
        context.commit('selectFile', file);
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
} as StoreOptions<any>;
