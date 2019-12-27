<template>
<div>
    <div class="item-container"
        :class="{ active }"
        :style="styles"
        @click="onClick(false)"
        @dblclick="onClick(true)">{{ item.name }}
        <span class="expand-icon" v-if="isDirectory">{{ expandIcon }}</span>
    </div>

    <div v-if="expanded">
        <directory-list
            :directory="item.children"
            :location="currentLocation"
            @item-selected="$emit('item-selected', $event)"
        />
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';

import IDirectoryListItemSelection from '../../services/interfaces/directory-list-item-selection.interface';

export default Vue.extend({
    props: ['item', 'location'],
    data: () => ({
        expanded: false,
        active: false
    }),
    beforeCreate(): void {
        if (this.$options.components) {
            this.$options.components['directory-list'] = require('./directory-list.vue').default
        }
    },
    methods: {
        onClick(isDoubleClick: boolean): void {
            if (this.isDirectory) {
                this.expanded = !this.expanded;
            }
            const payload = {
                source: this,
                isPreview: !isDoubleClick,
                isDirectory: this.isDirectory,
                path: this.currentLocation
            };
            this.$emit('item-selected', payload as IDirectoryListItemSelection);
        }
    },
    computed: {
        isDirectory(): boolean {
            return !!this.item.children;
        },
        expandIcon(): string {
            return this.expanded ? 'x' : '+';
        },
        currentLocation(): string {
            return this.location ? `${this.location}/${this.item.name}` : this.item.name;
        },
        level(): number {
            return (this.currentLocation.match(/\//g) || []).length;
        },
        styles(): any {
            return ({ 'padding-left': `${this.level * 20}px` });
        }
    }
});
</script>

<style lang="scss" scoped>
.item-container {
    &:hover{
        cursor: pointer;
        background-color: rgb(129, 115, 219);
    }

    .expand-icon {
        float: right;
    }
}

.active {
    background-color: rgb(40, 71, 209);
}
</style>
