<template>
<div>
    <button v-if="canOpenFolder" @click="$emit('open-folder')">
        Open Folder
    </button>

    <directory-list
        v-else
        :directory="directory"
        :location="''"
        @selected="onSelected"
    />
</div>
</template>

<script lang="ts">
import Vue from 'vue';

import DirectoryList from './directory-list.vue';

export default Vue.extend({
    props: ['base', 'directory', 'isLoading'],
    components: { DirectoryList },
    methods: {
        onSelected(payload: { path: string }): void {
            payload.path = `${this.base}/${payload.path}`;
            this.$emit('selected', payload);
        }
    },
    computed: {
        canOpenFolder(): boolean {
            return !this.isLoading && !this.directory.length;
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
