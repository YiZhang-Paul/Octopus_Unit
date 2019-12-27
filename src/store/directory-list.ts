import { StoreOptions } from 'vuex';

import IFileNode from '../services/interfaces/file-node.interface';

export default {
    namespaced: true,
    state: {
        activeItem: null
    },
    mutations: {
        setActive(state: any, payload: IFileNode): void {
            state.activeItem = payload;
        }
    },
    getters: {
        isActive(state: any): Function {
            return (payload: IFileNode): boolean => state.activeItem === payload;
        }
    }
} as StoreOptions<any>;
