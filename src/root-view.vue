<template>
<div class="main-container">
    <directory-viewer class="directory-viewer" @file-open-start="openFile($event)" />
    <file-viewer class="file-viewer" />
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import DirectoryViewer from './components/directory-viewer/directory-viewer.vue';
import FileViewer from './components/file-viewer/file-viewer.vue';

export default Vue.extend({
    components: {
        DirectoryViewer,
        FileViewer
    },
    methods: {
        async openFile(payload: { isPreview: boolean, path: string }): Promise<void> {
            console.log(payload.isPreview);
            console.log(payload.path);
        }
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
