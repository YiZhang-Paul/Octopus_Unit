<template>
<div class="main-container">
    <directory-viewer
        class="directory-viewer"
        :baseUrl="baseUrl"
        :directory="directory"
        @item-selected="onListItemSelected"
    />

    <div class="file-viewer-placeholder" v-if="!activeFiles"></div>
    <file-viewer v-else
        class="file-viewer"
        :opened="activeFiles.opened"
        :preview="activeFiles.preview"
        @close-file="closeFile($event)"
    />
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

import { activeFilesStoreName, directoryListStoreName } from './store';
import IDirectoryListItemSelection from './services/interfaces/directory-list-item-selection.interface';
import DirectoryViewer from './components/directory-viewer/directory-viewer.vue';
import FileViewer from './components/file-viewer/file-viewer.vue';

export default Vue.extend({
    data: () => ({
        baseUrl: 'd:/electron',
        directory: []
    }),
    components: {
        DirectoryViewer,
        FileViewer
    },
    async beforeMount(): Promise<void> {
        this.directory = await this.loadItems(this.baseUrl);
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
            loadItems: `${directoryListStoreName}/loadItems`,
            replaceActiveItem: `${directoryListStoreName}/replaceActiveItem`,
            openFile: `${activeFilesStoreName}/openFile`,
            previewFile: `${activeFilesStoreName}/previewFile`,
            closeFile: `${activeFilesStoreName}/closeFile`
        })
    },
    computed: {
        ...mapGetters({
            activeFiles: `${activeFilesStoreName}/activeFiles`
        })
    }
});
</script>

<style lang="scss" scoped>
$max-sidebar-width: 20vw;

.main-container {
    height: 100vh;
    display: flex;
    flex-flow: row nowrap;
    align-items: stretch;
}

.directory-viewer {
    flex-grow: 1;
    max-width: $max-sidebar-width;
}

.file-viewer-placeholder, .file-viewer {
    flex-grow: 7;
    max-width: calc(100% - #{$max-sidebar-width});
}

.directory-viewer, .file-viewer {
    overflow: scroll;
}
</style>
