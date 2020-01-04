<template>
<div>
    <div class="main-container"
        :class="{ 'focused': isFocused }"
        :style="styles"
        @click="onClick">{{ item.name }}
        <span class="expand-icon" v-if="isDirectory">{{ expandIcon }}</span>
    </div>

    <div v-if="isExpanded">
        <directory-list
            :directory="item.children"
            :location="currentLocation"
            @selected="$emit('selected', $event)"
        />
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';

import IDirectorySelection from '../../../core/interface/io/directory/directory-selection.interface';

export default Vue.extend({
    props: ['item', 'location'],
    data: () => ({
        isExpanded: false,
        isFocused: false,
        totalClicks: 0
    }),
    beforeCreate(): void {
        if (this.$options.components) {
            this.$options.components['directory-list'] = require('./directory-list.vue').default;
        }
    },
    methods: {
        onClick(): void {
            if (this.isDirectory) {
                this.isExpanded = !this.isExpanded;
            }

            if (++this.totalClicks !== 1) {
                return;
            }
            setTimeout(() => {
                const payload = {
                    source: this,
                    path: this.currentLocation,
                    isPreview: this.totalClicks === 1,
                    isDirectory: this.isDirectory
                };
                this.$emit('selected', payload as IDirectorySelection);
                this.totalClicks = 0;
            }, 200);
        }
    },
    computed: {
        isDirectory(): boolean {
            return !!this.item.children;
        },
        expandIcon(): string {
            return this.isExpanded ? 'x' : '+';
        },
        currentLocation(): string {
            return this.location ? `${this.location}/${this.item.name}` : this.item.name;
        },
        styles(): { [key: string]: string } {
            const level = (this.currentLocation.match(/\//g) || []).length;

            return ({ 'padding-left': `${level * 20}px` });
        }
    }
});
</script>

<style lang="scss" scoped>
.main-container {
    &:hover{
        cursor: pointer;
        background-color: rgb(129, 115, 219);
    }

    .expand-icon {
        float: right;
    }
}

.focused {
    background-color: rgb(40, 71, 209);
}
</style>
