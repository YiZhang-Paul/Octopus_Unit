<template>
<div class="main-container">
    <div class="selection-container"
        v-for="name in selections"
        :key="name"
        @click="$emit('content-selected', name)">

        <span v-if="!isPreviewed(name)">{{ getFileName(name) }}</span>
        <span v-else><i>{{ getFileName(name) }}</i></span>
        <span class="close-button" @click="$emit('close-file', name)">x</span>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    props: ['selections', 'previewed'],
    methods: {
        isPreviewed(path: string): boolean {
            return this.previewed === path;
        },
        getFileName(path: string): string {
            return path.split('/').slice(-1)[0];
        }
    }
});
</script>

<style lang="scss" scoped>
.main-container {
    display: flex;
    flex-flow: row nowrap;
    overflow-x: scroll;
}

.selection-container {
    cursor: pointer;
    min-width: 8vw;
    border: 1px solid skyblue;

    .close-button {
        float: right;
    }
}
</style>
