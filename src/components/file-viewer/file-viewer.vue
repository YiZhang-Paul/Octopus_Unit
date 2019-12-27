<template>
<file-content-reader :content="files.get(active)" />
</template>

<script lang="ts">
import Vue from 'vue';

import FileContentReader from './file-content-reader.vue';

import IFileContent from '../../services/interfaces/file-content.interface';

export default Vue.extend({
    props: ['opened', 'preview'],
    data: () => ({
        active: ''
    }),
    components: {
        FileContentReader
    },
    beforeMount(): void {
        if (this.files.size) {
            this.active = this.files.keys().next().value;
        }
    },
    computed: {
        files(): Map<string, Buffer> {
            const map = new Map<string, Buffer>();

            [...this.opened, this.preview].forEach((_: IFileContent) => {
                if (_) {
                    map.set(_.path, _.content);
                }
            });

            return map;
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
