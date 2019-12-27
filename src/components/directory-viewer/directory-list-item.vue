<template>
<div>
    <div class="item-container"
        :class="{ active }"
        @click="onClick">{{ item.name }}
        <span class="expand-icon" v-if="isDirectory">+</span>
    </div>

    <div v-if="isExpanded">
        <directory-list :directory="item.children" />
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    props: ['item'],
    data: () => ({
        active: false
    }),
    beforeCreate(): void {
        if (this.$options.components) {
            this.$options.components.DirectoryList = require('./directory-list.vue').default
        }
    },
    methods: {
        onClick(): void {
            this.active = !this.active;
        }
    },
    computed: {
        isDirectory(): boolean {
            return !!this.item.children;
        },
        isExpanded(): boolean {
            return this.isDirectory && this.active;
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

    .active {
        background-color: rgb(40, 71, 209);
    }
}
</style>
