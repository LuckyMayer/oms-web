<template>
  <div id="processState">
    <div class="stateItem" v-for="(stateItem, index) in statedata" :class="[{firstItem: index===0}, {pass: index <= activeIndex}]">
      <span class="line" v-show="index !== 0"><!-- <div style="background-color:#3697DE; left:-2px; height:4px;"></div> --></span>
      <span class="lineAfter" v-show="index !== 0 && index <= activeIndex"></span>
      <div class="stateContent" :class="{firstContent:index===0}">
        <nobr class="name">{{stateItem.name}}</nobr>
        <div class="topIcon">
          <i class="topIconAfter"></i>
        </div>
        <div class="time">
          {{stateItem.time | format(0)}}<br/>
          {{stateItem.time | format(1)}}
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
      this._selfStyle();
    });
    this.$watch('curstate.state', function () {
      this.getActiveState();
      this._selfStyle();
    })
  },
  filters: {
    format (val, i) {
      if(val) {
        return val.split(' ')[i];
      }else {
        return '';
      }
      
    }
  },
  watch: {
    curstate () {
      this.getActiveState();
    },
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
            $('.lineAfter').css('left', - _self.styleObj[i] / 2);
            $('.lineAfter').width(_self.styleObj[i]);
          }
        }
      }
    },

    getActiveState () {
      const _self = this;
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
  font-size: 12px;
  background: #fff;
}
.stateItem {
  position: relative;
  display: inline-block;
  width: 100px;
  vertical-align: top;
  text-align: center;
}
.line {
  display: inline-block;
  position: absolute;
  top: 27px;
  left: -42px;
  width: 84px;
  height: 10px;
  background: #dcdcdc;
}
.lineAfter {
  display: inline-block;
  position: absolute;
  top: 30px;
  left: -50px;
  width: 100px;
  height: 4px;
  background: #dcdcdc;
  z-index: 99;
}
.stateContent {
  display: inline-block;
  position: relative;
  top: 0;
  text-align: center;
  z-index: 9;
}
.topIcon {
  position: relative;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #ddd;
  margin: 0 auto;
}
.topIconAfter {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 4px solid #ddd;
}
.name, .time {
  color: #777;
  font-size: 12px;
  line-height: 20px;
}
.time {
  color: #777;
  font-size: 12px;
  line-height: 16px;
}
.firstContent {
  left: 0;
}
.pass .topIcon {
  background-color: #1C9EFF;
}
.pass .lineAfter {
  background: #1C9EFF;
}
.name {
  color: #777;
}
.time p {
  margin: 0 0 3px 0;
}
</style>