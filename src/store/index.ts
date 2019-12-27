import Vue from 'vue';
import Vuex from 'vuex';

import DirectoryList from './directory-list';

Vue.use(Vuex);

export const directoryListName = 'directoryList';

export default new Vuex.Store({
    modules: {
        [directoryListName]: DirectoryList
    }
});
