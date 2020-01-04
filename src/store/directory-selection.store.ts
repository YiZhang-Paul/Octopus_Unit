import { ActionContext, StoreOptions } from 'vuex';

import Types from '../core/ioc/types';
import Container from '../core/ioc/container';
import IFileNode from '../core/interface/io/file/file-node.interface';
import IDirectoryService from '../core/interface/io/directory/directory-service.interface';

type State = { selected: { isFocused: boolean } | null };

const directoryService = Container.get<IDirectoryService>(Types.IDirectoryService);
const state: State = { selected: null };

const mutations = {
    setSelected(state: State, item: { isFocused: boolean } | null): void {
        state.selected = item;
    },
    setFocused(state: State, isFocused: boolean): void {
        if (state.selected) {
            state.selected.isFocused = isFocused;
        }
    }
};

const actions = {
    async loadItems(context: ActionContext<State, any>, path: string): Promise<IFileNode[]> {
        const { dispatch } = context;
        dispatch('selectItem', null);

        return await directoryService.listDirectoryRecursive(path);
    },
    selectItem(context: ActionContext<State, any>, item: { isFocused: boolean }): void {
        const { commit } = context;
        commit('setFocused', false);
        commit('setSelected', item);
        commit('setFocused', true);
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
} as StoreOptions<State>;
