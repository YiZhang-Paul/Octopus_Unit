import { StoreOptions } from 'vuex';

export default {
    namespaced: true,
    state: {
        activeItem: null
    },
    mutations: {
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
    },
    actions: {
        replaceActiveItem(context: any, payload: any): void {
            context.commit('removeActiveItem');
            context.commit('setActiveItem', payload);
        }
    }
} as StoreOptions<any>;
