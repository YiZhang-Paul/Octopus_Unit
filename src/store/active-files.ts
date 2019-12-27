import { StoreOptions } from 'vuex';

export default {
    namespaced: true,
    state: {
        opened: [],
        preview: null
    },
    mutations: {
        open(state: any, payload: any): void {
            state.opened.push(payload);
        },
        preview(state: any, payload: any): void {
            state.preview = payload;
        }
    },
    actions: {
        async openFile(context: any, payload: { isPreview: boolean, path: string }): Promise<void> {
            const mutation = payload.isPreview ? 'preview' : 'open';
            context.commit(mutation, { path: payload.path });
        }
    }
} as StoreOptions<any>;
