import { StoreOptions } from 'vuex';

import FileService from '../services/io/file-service';

const fileService = new FileService();
const activeFiles = new Set<string>();

export default {
    namespaced: true,
    state: {
        opened: [],
        preview: null
    },
    mutations: {
        open(state: any, payload: { path: string, content: Buffer }): void {
            const { path } = payload;

            if (!activeFiles.has(path)) {
                activeFiles.add(path);
                state.opened.push(payload);
            }
        },
        preview(state: any, payload: { path: string, content: Buffer }): void {
            const { path } = payload;

            if (!activeFiles.has(path)) {
                activeFiles.add(path);
                state.preview = payload;
            }
        }
    },
    actions: {
        async openFile(context: any, payload: { isPreview: boolean, path: string }): Promise<void> {
            const { isPreview, path } = payload;
            const mutation = isPreview ? 'preview' : 'open';
            const content = await fileService.readFile(path);
            context.commit(mutation, { path, content });
        }
    }
} as StoreOptions<any>;
