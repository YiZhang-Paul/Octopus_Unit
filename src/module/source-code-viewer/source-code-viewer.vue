<template>
<div class="main-container">
    <directory-viewer
        class="directory-viewer-container"
        :base="base"
        :isLoading="isDirectoryLoading"
        :directory="directory"
        @selected="onDirectoryItemSelected"
        @open-folder="onOpenFolder"
    />

    <div class="file-viewer-placeholder" v-if="!openedFiles"></div>
    <file-viewer
        v-else
        class="file-viewer-container"
        :opened="openedFiles.opened"
        :previewed="openedFiles.previewed"
        :selected="selectedPath"
        @selected="onFileSelected($event)"
        @close="onFileClose($event)"
    />
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
const { dialog } = require('electron').remote;

import Store from '../../store';
import IDirectorySelection from '../../core/interface/io/directory/directory-selection.interface';
import DirectoryViewer from '../../module/source-code-viewer/directory-viewer/directory-viewer.vue';
import FileViewer from '../../module/source-code-viewer/file-viewer/file-viewer.vue';

export default Vue.extend({
    data: () => ({
        base: '',
        directory: [],
        selected: null,
        isDirectoryLoading: false
    }),
    components: {
        DirectoryViewer,
        FileViewer
    },
    methods: {
        async onOpenFolder(): Promise<void> {
            const option = { properties: ['openDirectory'] };
            const result = await dialog.showOpenDialog(option);

            if (!result.canceled && result.filePaths[0]) {
                this.isDirectoryLoading = true;
                this.base = result.filePaths[0];
                this.directory = await this.loadItems(this.base);
                this.isDirectoryLoading = false;
            }
        },
        async onDirectoryItemSelected(selection: IDirectorySelection): Promise<void> {
            const { source, path, isPreview, isDirectory } = selection;
            this.selectDirectoryItem(source);

            if (!isDirectory) {
                const action = isPreview ? this.previewFile : this.openFile;
                await action.bind(this)(path);
                this.selected = this.lastOpenedFile;
            }
        },
        onFileSelected(path: string): void {
            this.setLastOpenedFile(path);
            this.selected = this.lastOpenedFile;
        },
        onFileClose(path: string): void {
            this.closeFile(path);
            this.selected = this.lastOpenedFile;
        },
        ...mapActions({
            loadItems: `${Store.directorySelectionStoreName}/loadItems`,
            selectDirectoryItem: `${Store.directorySelectionStoreName}/selectItem`,
            setLastOpenedFile: `${Store.openedFilesStoreName}/setLastOpenedFile`,
            openFile: `${Store.openedFilesStoreName}/openFile`,
            closeFile: `${Store.openedFilesStoreName}/closeFile`,
            previewFile: `${Store.openedFilesStoreName}/previewFile`
        })
    },
    computed: {
        ...mapGetters({
            isPreviewed: `${Store.openedFilesStoreName}/isPreviewed`,
            openedFiles: `${Store.openedFilesStoreName}/openedFiles`,
            lastOpenedFile: `${Store.openedFilesStoreName}/lastOpenedFile`
        }),
        selectedPath(): string {
            return (this.selected || {} as any).path || '';
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
