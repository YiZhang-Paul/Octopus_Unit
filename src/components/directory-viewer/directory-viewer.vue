<template>
<directory-list :directory="directory" />
</template>

<script lang="ts">
import Vue from 'vue';

import DirectoryService from '../../services/io/directory-service';
import DirectoryViewerService from '../../services/viewers/directory-viewer-service';

import DirectoryList from './directory-list.vue';

const viewerService = new DirectoryViewerService(new DirectoryService());

export default Vue.extend({
    data: () => ({
        directory: {}
    }),
    components: {
        DirectoryList
    },
    async beforeMount(): Promise<void> {
        this.directory = await viewerService.listDirectoryRecursive('d:/electron');
    }
});
</script>

<style lang="scss" scoped>
</style>
