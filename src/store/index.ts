import Vue from 'vue';
import Vuex from 'vuex';

import DirectoryFilesStore from './directory-files.store';
import OpenedFilesStore from './opened-files.store';

Vue.use(Vuex);

export const directoryFilesStoreName = 'directoryFilesStore';
export const openedFilesStoreName = 'openedFilesStore';

export default new Vuex.Store({
    modules: {
        [directoryFilesStoreName]: DirectoryFilesStore,
        [openedFilesStoreName]: OpenedFilesStore
    }
});
