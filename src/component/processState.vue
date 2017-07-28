<template>
  <div id="processState">
    <div class="stateItem" v-for="(stateItem, index) in statedata" :class="[{firstItem: index===0}, {active: stateItem.state === curstate.state}, {pass: index < activeIndex}]">
      <span class="line" v-show="index !== 0"></span>
      <div class="stateContent" :class="{firstContent:index===0}">
        <div class="topIcon">
          <i class="topIconAfter"></i>
        </div>
        <nobr class="name">{{stateItem.name}}</nobr>
        <div class="time">
          <p>{{stateItem.time | format(0)}}</p>
          <p>{{stateItem.time | format(1)}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['statedata', 'curstate', 'styleObj'],
  data () {
    return {
      activeIndex: 0,
      pass_topIcon: 0
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getActiveState();
      this.showTopIconBgimg();
      this._selfStyle();
    });
  },
  filters: {
    format (val, i) {
      return val.split(' ')[i];
    }
  },
  updated () {
    $('.pass .topIcon').css('background-size', this.pass_topIcon + 'px ' + this.pass_topIcon + 'px');
    $('.active .topIcon').css('background-size', this.pass_topIcon + 'px ' + this.pass_topIcon + 'px');
  },
  watch: {
    curstate () {
      this.getActiveState();
    },
    activeIndex (newVal, oldVal) {
      $('.topIcon').eq(oldVal).css('background-image', '');
      $('.topIcon').eq(newVal).css('background-image', 'url('+this.curstate.icon+')');
    }
  },
  methods: {
    _selfStyle () {
      const _self = this;
      if (typeof _self.styleObj != 'undefined') {
        for (var i in _self.styleObj) {
          if (i == 'stateItem') {
            let percentage = $('.stateItem').width() / _self.styleObj[i];
            $('.'+i).width(_self.styleObj[i]);
            $('.line').css('left', - _self.styleObj[i] / 2);
            $('.line').width(_self.styleObj[i]);
          } else if (i == 'topIcon') {
            _self.pass_topIcon = _self.styleObj[i];
            $('.'+i).width(_self.styleObj[i]);
            $('.'+i).height(_self.styleObj[i]);
            $('.topIconAfter').width(_self.styleObj[i] / 2);
            $('.topIconAfter').height(_self.styleObj[i] / 2);
            $('.line').css('top', _self.styleObj[i] / 2 - 1);
          }
        }
      }
    },
    showTopIconBgimg () {
      $('.topIcon').eq(this.activeIndex).css('background-image', 'url('+this.curstate.icon+')');
    },
    getActiveState () {
      const _self = this;
      console.log(_self.statedata);
      _self.statedata.forEach(function (item, index) {
        if (item.state === _self.curstate.state) {
          _self.activeIndex = index;
        } else if (_self.curstate.state == '') {
          _self.activeIndex = -1;
        }
      });
    }
  }
}
</script>

<style scoped>
#processState {
  font-size: 14px;
  background: #fff;
}
.stateItem {
  position: relative;
  display: inline-block;
  width: 80px;
  height: 100px;
  vertical-align: top;
  text-align: center;
}
.line {
  display: inline-block;
  position: absolute;
  top: 14px;
  left: -40px;
  width: 80px;
  height: 3px;
  background: #F4F4F4;
}
.stateContent {
  display: inline-block;
  position: relative;
  top: 0;
  /*left: 50px;*/
  /*width: 50px;*/
  text-align: center;
  z-index: 9;
}
.topIcon {
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #F4F4F4;
  margin: 0 auto;
}
.topIconAfter {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 2px solid #E5E5E5;
}
.name, .time {
  color: #B9B9B9;
  font-size: 12px;
}
.firstItem {
  /*width: 50px;*/
}
.firstContent {
  left: 0;
}
.active .line {
  background: #77BF28;
}
.active .topIcon {
  background-size: 30px 30px;
}
.active .topIconAfter {
  display: none;
}
.active .name {
  color: #EA5858;
}
.pass .line {
  background: #77BF28;
}
.pass .topIcon {
  background-image: url('/src/img/u1303.png');
  background-size: 30px 30px;
}
.pass .topIconAfter {
  display: none;
}
.pass .name {
  color: #77BF28;
}
.time p {
  margin: 0 0 3px 0;
}
</style>