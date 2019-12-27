<template>
<div class="main-container">
    <directory-viewer
        class="directory-viewer"
        @item-selected="onListItemSelected"
    />

    <div class="file-viewer-placeholder" v-if="!activeFiles"></div>

    <file-viewer
        class="file-viewer"
        v-if="activeFiles"
        :opened="activeFiles.opened"
        :preview="activeFiles.preview"
    />
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

import { activeFilesName, directoryListName } from './store';
import IDirectoryListItemSelection from './services/interfaces/directory-list-item-selection.interface';
import DirectoryViewer from './components/directory-viewer/directory-viewer.vue';
import FileViewer from './components/file-viewer/file-viewer.vue';

export default Vue.extend({
    components: {
        DirectoryViewer,
        FileViewer
    },
    methods: {
        async onListItemSelected(payload: IDirectoryListItemSelection): Promise<void> {
            const { source, isDirectory, isPreview, path } = payload;
            this.replaceActiveItem(source);

            if (!isDirectory) {
                const action = (isPreview ? this.previewFile : this.openFile);
                await action.bind(this)(path);
            }
        },
        ...mapActions({
            replaceActiveItem: `${directoryListName}/replaceActiveItem`,
            openFile: `${activeFilesName}/openFile`,
            previewFile: `${activeFilesName}/previewFile`
        })
    },
    computed: {
        ...mapGetters({
            activeFiles: `${activeFilesName}/activeFiles`
        })
    }
});
</script>

<style lang="scss" scoped>
.main-container {
    height: 100vh;
    display: flex;
    flex-flow: row nowrap;
    align-items: stretch;
}

.directory-viewer {
    flex-grow: 1;
    overflow: scroll;
}

.file-viewer-placeholder, .file-viewer {
    flex-grow: 5;
}
</style>
