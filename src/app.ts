import 'reflect-metadata';
import Vue from 'vue';

import './styles.scss';
import store from './store';
import RootView from './root-view.vue';

new Vue({
    el: '#app',
    store,
    template: '<root-view/>',
    components: { RootView },
    render: _ => _(RootView)
});
