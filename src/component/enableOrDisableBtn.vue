<template>
  <div id="myOpreate" :style="{display: display, marginLeft: marginLeft}">
    <a class="opreate enable" @click="enable(id)" v-if="status == 'DELETED'">启用</a>
    <a class="opreate disable" @click="disable(id)" v-if="status == 'NORMAL'">停用</a>
  </div>
</template>

<script>
import http from '../common/http'
import api from '../common/api'

export default {
  props: ['display', 'idname', 'id', 'status', 'enableapi', 'disableapi', 'refresh', 'marginLeft'],
  // mounted () {
  //   this.$nextTick(() => {
  //     this.addDisableStyle();
  //   });
  // },
  // watch: {
  //   status () {
  //     this.addDisableStyle();
  //   }
  // },
  methods: {
    // addDisableStyle () {
    //   console.log(this);
    // },
    //停用
    disable (id) {
      const _self = this;
      const data = {};
      data[_self.idname] = id;
      layer.confirm('确认要停用吗', {
        btn: ['停用', '取消'] //按钮
      }, function(){
        http({
          instance: _self,
          url: api[_self.disableapi],
          type: 'post',
          data: {
            data
          },
          hasLoading: false,
          success (res) {
            console.log(res);
            if (res.code == 200) {
              console.log(_self);
              layer.msg('停用成功', {time: 2000});
              _self.refresh();
            }
          }
        });
      }, function(){

      });
    },
    // 启动
    enable (id) {
      const _self = this;
      const data = {};
      data[_self.idname] = id;
      layer.confirm('确认要启动吗', {
        btn: ['启动', '取消'] 
      }, function () {
        http({
          instance: _self,
          url: api[_self.enableapi],
          type: 'post',
          data: {
            data          
          },
          hasLoading: false,
          success (res) {
            console.log(res);
            if (res.code == 200) {
              layer.msg('启动成功', {time: 2000});
              _self.refresh();
            }
          }
        });
      }, function(){

      });
    },
  }
}
</script>

<style lang="sass">
#myOpreate {
  display: inline-block;
  margin-left: 10px;
  a {
    display: block;
    cursor: pointer;
  }
  .enable {
    color: #4cae4c;
  }
  .disable {
    color: #d9534f;
  }
}
</style>