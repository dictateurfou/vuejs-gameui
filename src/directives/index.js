import { onDrag, onDragStop, onDragDrop } from './dragAndDrop.js';

const clickOutside = {

    mounted(el, binding) {
        el.__clickOutside__ = function (e) {
            if (!el.contains(e.target)) {
                binding.value(e, el);
            }
        };
        document.addEventListener('click', el.__clickOutside__);
    },

    unmounted(el) {
        document.removeEventListener('click', el.__clickOutside__);
    }
}


export default function RegisterDirectives(app) {
    app.directive('onDrag', onDrag);
    app.directive('onDragStop', onDragStop);
    app.directive('onDragDrop', onDragDrop);
    app.directive('clickOutside', clickOutside);
}