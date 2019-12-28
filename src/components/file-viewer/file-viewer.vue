<template>
<div>
    <file-content-selector
        class="selector-container"
        :selections="filePaths"
        :previewed = "previewedFilePath"
        @selected="$emit('selected', $event)"
        @close-file="$emit('close-file', $event)"
    />

    <file-content-reader
        class="reader-container"
        :content="contents.get(selected)"
    />
</div>
</template>

<script lang="ts">
import Vue from 'vue';

import IFileContent from '../../services/interfaces/file-content.interface';

import FileContentSelector from './file-content-selector.vue';
import FileContentReader from './file-content-reader.vue';

export default Vue.extend({
    props: ['opened', 'previewed', 'selected'],
    components: {
        FileContentSelector,
        FileContentReader
    },
    computed: {
        contents(): Map<string, Buffer> {
            const map = new Map<string, Buffer>();

            [...this.opened, this.previewed].forEach((file: IFileContent) => {
                if (file) {
                    map.set(file.path, file.content);
                }
            });

            return map;
        },
        filePaths(): string[] {
            return Array.from(this.contents.keys());
        },
        previewedFilePath(): string {
            return this.previewed ? this.previewed.path : '';
        }
    }
});
</script>

<style lang="scss" scoped>
$selector-height: 6vh;

.selector-container {
    height: $selector-height;
}

.reader-container {
    height: calc(100% - #{$selector-height});
}
</style>
