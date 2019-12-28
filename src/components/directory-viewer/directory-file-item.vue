<template>
<div>
    <div class="file-container"
        :class="{ 'file-active': isFocused }"
        :style="styles"
        @click="onClick(false)"
        @dblclick="onClick(true)">{{ file.name }}
        <span class="expand-icon" v-if="isDirectory">{{ expandIcon }}</span>
    </div>

    <div v-if="isExpanded">
        <directory-file-list
            :directory="file.children"
            :location="selfLocation"
            @selected="$emit('selected', $event)"
        />
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';

import IDirectoryFileSelection from '../../services/interfaces/directory-file-selection.interface';

export default Vue.extend({
    props: ['file', 'location'],
    data: () => ({
        isExpanded: false,
        isFocused: false
    }),
    beforeCreate(): void {
        if (this.$options.components) {
            this.$options.components['directory-file-list'] = require('./directory-file-list.vue').default
        }
    },
    methods: {
        onClick(isDoubleClick: boolean): void {
            if (this.isDirectory) {
                this.isExpanded = !this.isExpanded;
            }
            const payload = {
                source: this,
                filePath: this.selfLocation,
                isPreview: !isDoubleClick,
                isDirectory: this.isDirectory
            };
            this.$emit('selected', payload as IDirectoryFileSelection);
        }
    },
    computed: {
        isDirectory(): boolean {
            return !!this.file.children;
        },
        expandIcon(): string {
            return this.isExpanded ? 'x' : '+';
        },
        selfLocation(): string {
            return this.location ? `${this.location}/${this.file.name}` : this.file.name;
        },
        styles(): any {
            const level = (this.selfLocation.match(/\//g) || []).length;

            return ({ 'padding-left': `${level * 20}px` });
        }
    }
});
</script>

<style lang="scss" scoped>
.file-container {
    &:hover{
        cursor: pointer;
        background-color: rgb(129, 115, 219);
    }

    .expand-icon {
        float: right;
    }
}

.file-active {
    background-color: rgb(40, 71, 209);
}
</style>
