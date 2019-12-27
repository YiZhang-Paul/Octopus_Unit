import Vue from 'vue';
import Vuex from 'vuex';

import ActiveFilesStore from './active-files.store';
import DirectoryListStore from './directory-list.store';

Vue.use(Vuex);

export const activeFilesStoreName = 'activeFiles';
export const directoryListStoreName = 'directoryList';

export default new Vuex.Store({
    modules: {
        [activeFilesStoreName]: ActiveFilesStore,
        [directoryListStoreName]: DirectoryListStore
    }
});
