<template>
<div>
    <directory-file-item
        v-for="file in directory"
        :key="file.name"
        :file="file"
        :location="location"
        @selected="$emit('selected', $event)"
    />
</div>
</template>

<script lang="ts">
import Vue from 'vue';

import DirectoryFileItem from './directory-file-item.vue';

export default Vue.extend({
    props: ['directory', 'location'],
    components: {
        DirectoryFileItem
    }
});
</script>

<style lang="scss" scoped>
</style>
