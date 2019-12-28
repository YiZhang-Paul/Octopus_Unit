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
        onSelected(payload: { path: string }): void {
            payload.path = `${this.base}/${payload.path}`;
            this.$emit('selected', payload);
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
