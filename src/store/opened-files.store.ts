import { ActionContext, StoreOptions } from 'vuex';

import Types from '../core/ioc/types';
import Container from '../core/ioc/container';
import IFileContent from '../core/interface/io/file/file-content.interface';
import IFileService from '../core/interface/io/file/file-service.interface';

type State = {
    lastOpened: IFileContent | null;
    opened: IFileContent[];
    previewed: IFileContent | null;
};

const fileService = Container.get<IFileService>(Types.IFileService);
const pathLookup = new Set<string>();

const state: State = {
    lastOpened: null,
    opened: [],
    previewed: null
};

const mutations = {
    setLastOpened(state: State, file: IFileContent | null): void {
        state.lastOpened = file;
    },
    addOpened(state: State, file: IFileContent): void {
        pathLookup.add(file.path);
        state.opened.push(file);
    },
    removeOpened(state: State, path: string): void {
        pathLookup.delete(path);
        state.opened = state.opened.filter(_ => _.path !== path);
    },
    setPreviewed(state: State, file: IFileContent): void {
        pathLookup.add(file.path);
        state.previewed = file;
    },
    removePreviewed(state: State): void {
        if (state.previewed) {
            pathLookup.delete(state.previewed.path);
            state.previewed = null;
        }
    }
};

const actions = {
    async setLastOpenedFile(context: ActionContext<State, any>, path: string): Promise<void> {
        const { getters, commit, state } = context;
        const isPreviewed = getters.isPreviewed(path);
        const file = isPreviewed ? state.previewed : state.opened.find(_ => _.path === path);

        if (!file) {
            throw new Error('Can only set last opened file to a file that is currently opened.');
        }
        commit('setLastOpened', file);
    },
    async openFile(context: ActionContext<State, any>, path: string): Promise<void> {
        const { getters, commit } = context;

        if (getters.isPreviewed(path)) {
            commit('removePreviewed');
        }
        const content = await fileService.readFile(path);
        const file = { path, content } as IFileContent;

        if (!pathLookup.has(path)) {
            commit('addOpened', file);
        }
        commit('setLastOpened', file);
    },
    closeOpenedFile(context: ActionContext<State, any>, payload: { path: string, isCurrent: boolean }): void {
        const { path, isCurrent } = payload;
        const { commit, state } = context;
        const index = state.opened.findIndex(_ => _.path === path);
        commit('removeOpened', path);

        if (!isCurrent) {
            return;
        }
        // shift focus to next available file that is opened or previewed
        const nextIndex = Math.max(0, index - 1);
        const file = state.opened.length ? state.opened[nextIndex] : state.previewed;
        commit('setLastOpened', file);
    },
    async previewFile(context: ActionContext<State, any>, path: string): Promise<void> {
        const { commit } = context;
        const content = await fileService.readFile(path);
        const file = { path, content } as IFileContent;

        if (!pathLookup.has(path)) {
            commit('removePreviewed');
            commit('setPreviewed', file);
        }
        commit('setLastOpened', file);
    },
    closePreviewFile(context: ActionContext<State, any>): void {
        const { commit, state } = context;
        const lastOpened = state.opened.slice(-1)[0];
        commit('removePreviewed');
        commit('setLastOpened', lastOpened || null);
    },
    closeFile(context: ActionContext<State, any>, payload: { path: string, isCurrent: boolean }): void {
        const { path } = payload;
        const { getters, dispatch } = context;
        const isPreviewed = getters.isPreviewed(path);
        dispatch(isPreviewed ? 'closePreviewFile' : 'closeOpenedFile', payload);
    }
};

const getters = {
    isPreviewed(state: State): Function {
        return (path: string): boolean => !!state.previewed && state.previewed.path === path;
    },
    lastOpenedFile(state: State): IFileContent | null {
        return state.lastOpened;
    },
    openedFiles(state: State): { opened: IFileContent[], previewed: IFileContent | null } | null {
        const { opened, previewed } = state;

        return opened.length || previewed ? ({ opened, previewed }) : null;
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
} as StoreOptions<State>;
