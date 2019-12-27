import { StoreOptions } from 'vuex';

import IFileContent from '../services/interfaces/file-content.interface';
import FileService from '../services/io/file-service';

const fileService = new FileService();
const activeFileLookup = new Set<string>();

export default {
    namespaced: true,
    state: {
        opened: [],
        preview: null
    },
    mutations: {
        openFile(state: any, payload: IFileContent): void {
            activeFileLookup.add(payload.path);
            state.opened.push(payload);
        },
        closeFile(state: any, payload: string): void {
            activeFileLookup.delete(payload);
            state.opened = state.opened.filter((_: IFileContent) => _.path !== payload);
        },
        previewFile(state: any, payload: IFileContent): void {
            activeFileLookup.add(payload.path);
            state.preview = payload;
        },
        closePreview(state: any): void {
            if (state.preview) {
                activeFileLookup.delete(state.preview.path);
                state.preview = null;
            }
        }
    },
    actions: {
        async openFile(context: any, payload: string): Promise<void> {
            if (context.getters.isPreviewed(payload)) {
                context.commit('closePreview');
            }

            if (!activeFileLookup.has(payload)) {
                const content = await fileService.readFile(payload);
                context.commit('openFile', { path: payload, content } as IFileContent);
            }
        },
        async previewFile(context: any, payload: string): Promise<void> {
            context.commit('closePreview');
            const content = await fileService.readFile(payload);
            context.commit('previewFile', { path: payload, content } as IFileContent);
        },
        closeFile(context: any, payload: string): void {
            const isPreviewed = context.getters.isPreviewed(payload);
            context.commit(isPreviewed ? 'closePreview' : 'closeFile', payload);
        }
    },
    getters: {
        isPreviewed(state: any): Function {
            return (path: string): boolean => state.preview && state.preview.path === path;
        },
        activeFiles(state: any): { opened: IFileContent[], preview: IFileContent } | null {
            const { opened, preview } = state;

            return opened.length || preview ? ({ opened, preview }) : null;
        }
    }
} as StoreOptions<any>;
