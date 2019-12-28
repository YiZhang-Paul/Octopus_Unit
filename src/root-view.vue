<template>
<div class="main-container">
    <directory-viewer
        class="directory-viewer-container"
        :base="base"
        :directory="directory"
        @selected="onDirectoryFileSelected"
    />

    <div class="file-viewer-placeholder" v-if="!openedFiles"></div>
    <file-viewer
        v-else
        class="file-viewer-container"
        :opened="openedFiles.openedFiles"
        :previewed="openedFiles.previewedFile"
        :selected="selectedFilePath"
        @selected="selectedFilePath = $event"
        @close-file="closeFile($event)"
    />
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

import { openedFilesStoreName, directoryFilesStoreName } from './store';
import IDirectoryFileSelection from './services/interfaces/directory-file-selection.interface';
import DirectoryViewer from './components/directory-viewer/directory-viewer.vue';
import FileViewer from './components/file-viewer/file-viewer.vue';

export default Vue.extend({
    data: () => ({
        base: 'd:/electron',
        directory: [],
        selectedFilePath: ''
    }),
    components: {
        DirectoryViewer,
        FileViewer
    },
    async beforeMount(): Promise<void> {
        this.directory = await this.loadItems(this.base);
    },
    methods: {
        async onDirectoryFileSelected(selection: IDirectoryFileSelection): Promise<void> {
            const { source, filePath, isPreview, isDirectory } = selection;
            this.selectDirectoryFile(source);

            if (!isDirectory) {
                const action = isPreview ? this.previewFile : this.openFile;
                await action.bind(this)(filePath);
                this.selectedFilePath = this.lastOpenedFilePath;
            }
        },
        ...mapActions({
            loadItems: `${directoryFilesStoreName}/loadItems`,
            selectDirectoryFile: `${directoryFilesStoreName}/selectDirectoryFile`,
            openFile: `${openedFilesStoreName}/openFile`,
            previewFile: `${openedFilesStoreName}/previewFile`,
            closeFile: `${openedFilesStoreName}/closeFile`
        })
    }
    computed: {
        ...mapGetters({
            openedFiles: `${openedFilesStoreName}/openedFiles`
        }),
        lastOpenedFilePath(): string {
            return this.$store.state[openedFilesStoreName].lastOpenedFilePath;
        }
    }
});
</script>

<style lang="scss" scoped>
.main-container {
    $max-sidebar-width: 20vw;

    height: 100vh;
    display: flex;
    flex-flow: row nowrap;
    align-items: stretch;

    .directory-viewer-container {
        flex-grow: 1;
        max-width: $max-sidebar-width;
    }

    .file-viewer-placeholder, .file-viewer-container {
        flex-grow: 7;
        max-width: calc(100% - #{$max-sidebar-width});
    }

    .directory-viewer-container, .file-viewer-container {
        overflow: scroll;
    }
}
</style>
