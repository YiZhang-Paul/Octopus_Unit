import Vue from 'vue';
import Vuex from 'vuex';

import DirectorySelectionStore from './directory-selection.store';
import OpenedFilesStore from './opened-files.store';

Vue.use(Vuex);

const directorySelectionStoreName = 'directorySelectionStore';
const openedFilesStoreName = 'openedFilesStore';

const store = new Vuex.Store<any>({
    modules: {
        [directorySelectionStoreName]: DirectorySelectionStore,
        [openedFilesStoreName]: OpenedFilesStore
    }
});

export default {
    store,
    directorySelectionStoreName,
    openedFilesStoreName
};
