<template>
<directory-list
    :directory="directory"
    :location="''"
    @item-selected="onItemSelected"
/>
</template>

<script lang="ts">
import Vue from 'vue';

import DirectoryService from '../../services/io/directory-service';
import DirectoryViewerService from '../../services/viewers/directory-viewer-service';

import DirectoryList from './directory-list.vue';

const viewerService = new DirectoryViewerService(new DirectoryService());
const location = 'd:/electron';

export default Vue.extend({
    data: () => ({
        directory: {}
    }),
    components: {
        DirectoryList
    },
    async beforeMount(): Promise<void> {
        this.directory = await viewerService.listDirectoryRecursive(location);
    },
    methods: {
        onItemSelected(payload: { path: string }): void {
            payload.path = `${location}/${payload.path}`;
            this.$emit('item-selected', payload);
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
