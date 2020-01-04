<template>
<div>
    <directory-item
        v-for="item in directory"
        :key="item.name"
        :item="item"
        :location="location"
        @selected="$emit('selected', $event)"
    />
</div>
</template>

<script lang="ts">
import Vue from 'vue';

import DirectoryItem from './directory-item.vue';

export default Vue.extend({
    props: ['directory', 'location'],
    components: { DirectoryItem }
});
</script>

<style lang="scss" scoped>
</style>
