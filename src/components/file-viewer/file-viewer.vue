<template>
<div>
    <file-content-selector
        class="selector-container"
        :selections="fileNames"
        :previewed = "previewName"
        @content-selected="$emit('content-selected', $event)"
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

import FileContentSelector from './file-content-selector.vue';
import FileContentReader from './file-content-reader.vue';

import IFileContent from '../../services/interfaces/file-content.interface';

export default Vue.extend({
    props: ['opened', 'preview', 'selected'],
    components: {
        FileContentSelector,
        FileContentReader
    },
    computed: {
        contents(): Map<string, Buffer> {
            const map = new Map<string, Buffer>();

            [...this.opened, this.preview].forEach((_: IFileContent) => {
                if (_) {
                    map.set(_.path, _.content);
                }
            });

            return map;
        },
        fileNames(): string[] {
            return Array.from(this.contents.keys());
        },
        previewName(): string {
            return this.preview ? this.preview.path : '';
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
