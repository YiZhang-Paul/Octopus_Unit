import Vue from 'vue';
import Vuex from 'vuex';

import ActiveFiles from './active-files';
import DirectoryList from './directory-list';

Vue.use(Vuex);

export const activeFilesName = 'activeFiles';
export const directoryListName = 'directoryList';

export default new Vuex.Store({
    modules: {
        [activeFilesName]: ActiveFiles,
        [directoryListName]: DirectoryList
    }
});
