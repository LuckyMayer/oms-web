<template>
  <div id="navTab" :style="{width: width}">
    <div class="tabItem" :class="{active: activeIndex == i}" v-for="(item, i) in data" @click="shiftHandle(i)">
      {{item.name}}
    </div>
  </div>
</template>

<script>
export default {
  props: ['data', 'width'],
  data () {
    return {
      activeIndex: 0,
    }
  },
  created () {
    this.$router.push({name: this.data[0].routerName});
  },
  methods: {
    shiftHandle (i) {
      const _self = this;
      _self.activeIndex = i;
      _self.$router.push({name: _self.data[i].routerName});
      _self.$emit('shift', _self.data[i]);
    }
  }
}
</script>

<style scoped>
#navTab {
  border-bottom: 1px solid #6799FF;
  width: 350px;
}
.tabItem {
  position: relative;
  top: 1px;
  display: inline-block;
  color: #6799FF;
  padding: 10px 20px;
  background: #F2F2F2;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  cursor: pointer;
}
.active {
  background: #fff;
  color: #333;
  border-left: 1px solid #6799FF;
  border-top: 1px solid #6799FF;
  border-right: 1px solid #6799FF;
  border-bottom: 1px solid #fff;
}
</style>