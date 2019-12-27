<template>
<div>
    <div class="item-container"
        :class="{ active: isActive(item) }"
        :style="styles"
        @click="onClick">{{ item.name }}
        <span class="expand-icon" v-if="isDirectory">{{ expandIcon }}</span>
    </div>

    <div v-if="isExpanded">
        <directory-list :directory="item.children" :level="level + 1" />
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapMutations } from 'vuex';

export default Vue.extend({
    props: ['item', 'level'],
    data: () => ({
        selected: false
    }),
    beforeCreate(): void {
        if (this.$options.components) {
            this.$options.components.DirectoryList = require('./directory-list.vue').default
        }
    },
    methods: {
        onClick(): void {
            this.selected = !this.selected;
            this.setActive(this.item);
        },
        ...mapMutations({
            setActive: 'DirectoryList/setActive'
        })
    },
    computed: {
        isDirectory(): boolean {
            return !!this.item.children;
        },
        isExpanded(): boolean {
            return this.isDirectory && this.selected;
        },
        expandIcon(): string {
            return this.isExpanded ? 'x' : '+';
        },
        styles(): any {
            return ({ 'padding-left': `${(this.level - 1) * 10}px` });
        },
        ...mapGetters({
            isActive: 'DirectoryList/isActive'
        })
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
