import { StoreOptions } from 'vuex';

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
