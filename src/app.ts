import 'reflect-metadata';
import Vue from 'vue';

import './styles.scss';
import Store from './store';
import SourceCodeViewer from './module/source-code-viewer/source-code-viewer.vue';

new Vue({
    el: '#app',
    store: Store.store,
    components: { SourceCodeViewer },
    render: _ => _(SourceCodeViewer)
});
