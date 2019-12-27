import { StoreOptions } from 'vuex';

import IFileNode from '../services/interfaces/file-node.interface';
import DirectoryService from '../services/io/directory-service';
import DirectoryViewerService from '../services/viewers/directory-viewer-service';

const directoryViewerService = new DirectoryViewerService(new DirectoryService());

const state = {
    activeItem: null
};

const mutations = {
    setActiveItem(state: any, payload: any): void {
        state.activeItem = payload;
        state.activeItem.active = true;
    },
    removeActiveItem(state: any): void {
        if (state.activeItem) {
            state.activeItem.active = false;
            state.activeItem = null;
        }
    }
};

const actions = {
    async loadItems(_: any, payload: string): Promise<IFileNode[]> {
        return await directoryViewerService.listDirectoryRecursive(payload);
    },
    replaceActiveItem(context: any, payload: any): void {
        context.commit('removeActiveItem');
        context.commit('setActiveItem', payload);
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
} as StoreOptions<any>;
