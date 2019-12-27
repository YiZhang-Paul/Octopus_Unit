<template>
<div>
    <div class="item-container"
        :class="{ active: isActive(item) }"
        :style="styles"
        @click="onClick(false)"
        @dblclick="onClick(true)">{{ item.name }}
        <span class="expand-icon" v-if="isDirectory">{{ expandIcon }}</span>
    </div>

    <div v-if="expanded">
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
        expanded: false
    }),
    beforeCreate(): void {
        if (this.$options.components) {
            this.$options.components.DirectoryList = require('./directory-list.vue').default
        }
    },
    methods: {
        onClick(_isDoubleClick: boolean): void {
            this.setActive(this.item);

            if (this.isDirectory) {
                this.expanded = !this.expanded;
            }
        },
        ...mapMutations({
            setActive: 'DirectoryList/setActive'
        })
    },
    computed: {
        isDirectory(): boolean {
            return !!this.item.children;
        },
        expandIcon(): string {
            return this.expanded ? 'x' : '+';
        },
        styles(): any {
            return ({ 'padding-left': `${this.level * 20}px` });
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
