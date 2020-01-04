<template>
<pre class="main-container">{{ content }}</pre>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    props: ['content']
});
</script>

<style lang="scss" scoped>
.main-container {
    margin: 0;
}
</style>
