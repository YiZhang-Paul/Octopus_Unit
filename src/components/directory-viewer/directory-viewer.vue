<template>
<directory-file-list
    :directory="directory"
    :location="''"
    @selected="onSelected"
/>
</template>

<script lang="ts">
import Vue from 'vue';

import DirectoryFileList from './directory-file-list.vue';

export default Vue.extend({
    props: ['base', 'directory'],
    components: {
        DirectoryFileList
    },
    methods: {
        onSelected(payload: { filePath: string }): void {
            payload.filePath = `${this.base}/${payload.filePath}`;
            this.$emit('selected', payload);
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
