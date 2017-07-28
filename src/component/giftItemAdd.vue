<template>
  <div class="form-group">
    <label class="control-label col-sm-2" :class="{required: isRequired}">{{labelName}}</label>
    <div class="col-sm-3">
      <select v-if="type == 'select'"  class="form-control" v-model="shopData.selected">
        <option v-for="shopItem in shopData.list" :value="shopItem">{{shopItem.shopName}}</option>
      </select>
    </div>
    <div class="col-sm-1">
      <button class="btn btn-primary btn-sm" @click="shopAddFun">添加</button>
    </div>
    <div class="col-sm-6">
      <span class="addShopItem" v-for="(item, i) in selectedsShow">
        {{item.shopName}}
        <i class="iconfont control-label deleteIcon" @click="deleteIconFun(i)">&#xe61e;</i>
      </span>
    </div>
  </div>
</template>

<script>
import http from '../common/http'
import api from '../common/api'

export default {
  props: ['labelName', 'isRequired', 'type', 'api', 'selecteds'],
  data () {
    return {
      shopData: {
        selected: {},
        list: {},
        selecteds: []
      },
      selectedsShow: []
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getShop();
    });
  },
  watch: {
    'shopData.selecteds':function (newVal) {
      this.$emit('callback', this.shopData.selecteds);
    },
    selecteds: function (newVal) {
      this.selectedsShow = newVal;
    }
  },
  methods: {
    deleteIconFun (i) {
      this.selectedsShow.splice(i, 1);
    },
    shopAddFun () {
      this.shopData.selecteds = [];
      this.shopData.selecteds.push(this.shopData.selected);
      for (var i in this.shopData.selecteds) {
        this.selectedsShow.push(this.shopData.selecteds[i]);
      }
    },
    getShop () {
      const _self = this;
      http({
        instance: _self,
        url: api[_self.api],
        type: 'post',
        data: {},
        success (res) {
          _self.shopData.list = res.data;
        }
      });
    },
  }
}
</script>