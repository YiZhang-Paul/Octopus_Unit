<template>
<pre class="main-container" v-html="highlighted"></pre>
</template>

<script lang="ts">
import Vue from 'vue';
import 'highlight.js/scss/hybrid.scss';
import { getLanguage, highlight } from 'highlight.js';

export default Vue.extend({
    props: ['location', 'content'],
    computed: {
        highlighted(): string {
            const content = (this.content || '').toString();
            const canHighlight = getLanguage(this.extension);

            return canHighlight ? highlight(this.extension, content).value : content;
        },
        extension(): string {
            return this.location.split('.').slice(-1)[0];
        }
    }
});
</script>

<style lang="scss" scoped>
.main-container {
    margin: 0;
}
</style>
