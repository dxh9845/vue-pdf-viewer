<template>
    <div @mousedown="startDrag" 
        class='resize-grip'>
    </div>
</template>

<script>
import _ from "lodash";
import { RESIZE_CONTAINER } from '../../store/actions.type';
import { mapState } from 'vuex';

export default {
    name: 'resize-grip',
    data() {
        return { 
            lastY: null,
            dragging: false,
        }
    },
    computed: {
        ...mapState({
            containerHeight: state => state.SlideModule.containerHeight
        })
    },
    methods: {
        startDrag({ pageY }) {
            this.lastY = pageY;
            this.dragging = true;
        },
        endDrag(ev) {
            this.dragging = false;
        },
        moveGrip(ev) {
            if (this.dragging) {
                const deltaY = ev.pageY - this.lastY;
                this.$store.dispatch(RESIZE_CONTAINER, { clientHeight: this.containerHeight + deltaY, clientWidth: null } );
                this.lastY = ev.pageY;
            }
        }
    },
    mounted() {
        window.addEventListener('mouseup', this.endDrag);
        this.debouncedMove = _.throttle(this.moveGrip, 100, {})
        window.addEventListener('mousemove', this.debouncedMove)
    }
}
</script>

<style>
.resize-grip {
    width: 100%;
    position: absolute;
    bottom: 0;
    background-color: #000;
    text-align: center;
    height: 10px;
    color: #FFF;
}
</style>
