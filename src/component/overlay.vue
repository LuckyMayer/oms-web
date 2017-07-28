<template>
  <div class="overlay" @click="handlerClick" @touchmove="prevent" :style="style" transition="overlay-fade"></div>
</template>
<script>
export default {
  props: {
    onClick: {
      type: Function
    },
    opacity: {
      type: Number,
      default: 0.4
    },
    color: {
      type: String,
      default: '#000'
    }
  },
  computed: {
    style () {
      return {
        'opacity': this.opacity,
        'background-color': this.color
      }
    }
  },
  methods: {
    prevent (event) {
      event.preventDefault()
      event.stopPropagation()
    },
    handlerClick () {
      if (this.onClick) {
        this.onClick()
      }
    }
  }
}
</script>
<style lang="sass">
.overlay {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #000;
  opacity: .4;
  z-index: 1000;
}


.overlay-fade-transition {
  transition: all .3s linear;
  &.overlay-fade-enter,
  &.overlay-fade-leave {
    opacity: 0 !important;
  }
}
</style>