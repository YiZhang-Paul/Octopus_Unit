<template>
<div class="main-container">
    <div class="selection-container"
        :class="{ selected: isSelected(path) }"
        v-for="path in selections"
        :key="path"
        @click="$emit('selected', path)">

        <span v-if="!isPreviewed(path)">{{ getFileName(path) }}</span>
        <span v-else><i>{{ getFileName(path) }}</i></span>
        <span class="close-button" @click.stop="$emit('close-file', path)">x</span>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    props: ['selections', 'previewed', 'selected'],
    methods: {
        isSelected(path: string): boolean {
            return this.selected === path;
        },
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

    .selection-container {
        cursor: pointer;
        min-width: 8vw;
        border: 1px solid skyblue;

        .close-button {
            float: right;
        }
    }

    .selected {
        background-color: cornflowerblue;
    }
}
</style>
