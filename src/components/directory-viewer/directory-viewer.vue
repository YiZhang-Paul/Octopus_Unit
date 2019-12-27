<template>
<directory-list
    :directory="directory"
    :location="''"
    @item-selected="onItemSelected"
/>
</template>

<script lang="ts">
import Vue from 'vue';

import DirectoryList from './directory-list.vue';

export default Vue.extend({
    props: ['baseUrl', 'directory'],
    components: {
        DirectoryList
    },
    methods: {
        onItemSelected(payload: { path: string }): void {
            payload.path = `${this.baseUrl}/${payload.path}`;
            this.$emit('item-selected', payload);
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
