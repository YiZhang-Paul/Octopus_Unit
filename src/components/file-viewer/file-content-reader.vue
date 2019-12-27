<template>
<pre>{{ content }}</pre>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    props: ['content']
});
</script>

<style lang="scss" scoped>
</style>
