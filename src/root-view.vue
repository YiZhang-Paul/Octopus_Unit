<template>
<div class="main-container">
    <directory-viewer
        class="directory-viewer"
        @item-selected="onListItemSelected"
    />

    <file-viewer class="file-viewer" />
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';

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
                await this.openFile({ isPreview, path });
            }
        },
        ...mapActions({
            replaceActiveItem: `${directoryListName}/replaceActiveItem`,
            openFile: `${activeFilesName}/openFile`
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
    border: 1px solid red;
}

.file-viewer {
    flex-grow: 5;
    border: 1px solid yellow;
}
</style>
