import { ActionContext, StoreOptions } from 'vuex';

import Types from '../core/ioc/types';
import Container from '../core/ioc/container';
import IFileNode from '../core/interface/io/file/file-node.interface';
import IDirectoryService from '../core/interface/io/directory/directory-service.interface';

type State = {
    selected: { isFocused: boolean } | null
};

const directoryService = Container.get<IDirectoryService>(Types.IDirectoryService);
const state: State = { selected: null };

const mutations = {
    setSelected(state: State, item: { isFocused: boolean }): void {
        state.selected = item;
        state.selected.isFocused = true;
    },
    resetSelected(state: State): void {
        if (state.selected) {
            state.selected.isFocused = false;
            state.selected = null;
        }
    }
};

const actions = {
    async loadItems(_: any, path: string): Promise<IFileNode[]> {
        return await directoryService.listDirectoryRecursive(path);
    },
    selectItem(context: ActionContext<State, any>, item: { isFocused: boolean }): void {
        const { commit } = context;
        commit('resetSelected');
        commit('setSelected', item);
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
} as StoreOptions<State>;
