import { StoreOptions } from 'vuex';

export default {
    namespaced: true,
    state: {
        activeItem: null
    },
    mutations: {
        setActive(state: any, payload: any): void {
            if (state.activeItem) {
                state.activeItem.active = false;
            }
            state.activeItem = payload;
            state.activeItem.active = true;
        }
    }
} as StoreOptions<any>;
