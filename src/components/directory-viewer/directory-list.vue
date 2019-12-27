<template>
<div>
    <directory-list-item
        v-for="item in directory"
        :key="item.name"
        :item="item"
        :location="location"
    />
</div>
</template>

<script lang="ts">
import Vue from 'vue';

import DirectoryListItem from './directory-list-item.vue';

export default Vue.extend({
    props: ['directory', 'location'],
    components: {
        DirectoryListItem
    }
});
</script>

<style lang="scss" scoped>
</style>
