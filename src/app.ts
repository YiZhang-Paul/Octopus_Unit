import Vue from 'vue';
import RootView from './root-view.vue';

new Vue({
    el: '#app',
    template: '<root-view/>',
    components: { RootView },
    render: _ => _(RootView)
});
