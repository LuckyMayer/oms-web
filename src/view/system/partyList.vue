<template>
<div class="content-wrapper">
    <section class="content-header clearfix">
      <ol class="breadcrumb col-md-6">
        <li><a href="#"><i class="fa fa-desktop"></i>系统</a></li>
        <li class="active">业务组管理</li>
      </ol>
      <div class="col-md-6" style="text-align: right; position: relative; top: 10px;">
        <button class="btn btn-sm btn-primary" @click="addFun">
          <i class="fa fa-plus"></i>新建业务组
        </button>
      </div>
    </section>
  <div>
    <div class="box box-default" style="margin-top: 15px;">
      <div class="box-body">
        <table class="table">
          <thead>
            <tr>
              <th>业务组ID</th>
              <th>业务组名称</th>
              <th>创建时间</th>
              <th>分类</th>
              <th>属性</th>
              <th>供应商</th>
              <th>备注</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in partyList">
              <td><a @click="editFun(item)">{{item.partyId}}</a></td>
              <td v-text="item.partyName"></td>
              <td v-text="item.createTime"></td>
              <td v-text="item.parentPartyId.partyName"></td>
              <td>{{item.partyGroup | partyGroupFilter}}</td>
              <td>
                <span v-for="(provider, j) in item.providerList"><br v-if="j !== 0" />{{provider.providerName}}</span>
              </td>
              <td><div style="width:10em;text-overflow:ellipsis;overflow:hidden; white-space: nowrap;">{{item.note}}</div></td>
              <td>{{item.status | statusFilter}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 弹窗 -->
    <div class="popup-wrap-yjlu popup-distributorManage" v-if="isOpen">
      <div class="popup-content row form-inline">
        <p class="popup-title" v-if="covertype === 'update'">编辑业务组</p>
        <p class="popup-title" v-if="covertype === 'add'">新建业务组</p>
        <div class="popup-main clearfix">
          <div class="col col-md-12">
            <div class="form-group">
              <label class="popup-laval required">业务组名称</label>
              <input class="form-control input-sm" type="text" v-model="addData.partyName" />
              <i class="iconfont" id="partyName" @mouseover="partyNameTip">&#xe69a;</i>
            </div>
            <div class="form-group">
              <label class="popup-laval required">业务组分类</label>
              <select class="form-control input-sm" v-model="addData.parentPartyId">
                <option value="">==请选择==</option>
                <option value="32640">电商服务</option>
                <option value="65542">海外业务</option>
                <option value="65658">跨境电商</option>
                <option value="65595">通用商品</option>
              </select>
            </div>
            <div class="form-group">
              <label class="popup-laval required">业务组属性</label>
              <select class="form-control input-sm" v-model="addData.partyGroup">
                <option value="">==请选择==</option>
                <option value="0:">其他</option>
                <option value="1:母婴">母婴</option>
                <option value="2:食品/冲饮">食品/冲饮</option>
                <option value="3:护肤/彩妆/洗护">护肤/彩妆/洗护</option>
                <option value="4:数码">数码</option>
                <option value="5:文具/保健品/非标">文具/保健品/非标</option>
                <option value="6:跨境">跨境</option>
              </select>
            </div>
            <div class="form-group">
              <label class="popup-laval required">业务组状态</label>
              <select class="form-control input-sm" v-model="addData.status">
                <option value="">==请选择==</option>
                <option value="NORMAL">运营中</option>
                <option value="CLOSING">停业中</option>
                <option value="CLOSEED">已停业</option>
                <option value="SYNCING">托管同步</option>
              </select>
            </div>
            <div class="form-group">
              <label class="popup-laval required">可用供应商</label>
              <div style="display: inline-block;">
                <fuzzy-search id="chooseSearchProvider" :placeholder="'供应商模糊搜索'"  searchfiled="providerName"  :listarray="['providerName']" :config="{'apiName':'getProviderTableList','needKey':true,'fixWidth':false,'keyPath':'data.provider.providerName','resultPath':'data.content'}" :parameter="selectProvider" @choose="chooseSearchProvider"></fuzzy-search>
              </div>
              <div class="addIcon" @click="addProvider">+添加</div>
              <div style="margin-left: 7em;">
                <span class="providerList" v-for="(provider, n) in provider.selecteds">
                  <label class="control-label">{{provider.providerName}}</label>
                  <i class="iconfont iconfontDelete" @click="delProvider(n)">&#xe63c;</i>
                </span>
              </div>
            </div>
            <div class="form-group">
              <label class="popup-laval">描述</label>
              <textarea class="form-control input-sm" v-model="addData.note"></textarea>
            </div>
          </div>
        </div>
        <div class="popup-footer">
          <button class="btn btn-sm btn-primary" @click="saveFun">
            <i class="fa fa-check"></i>保存
          </button>
          <button class="btn btn-sm btn-default" @click="closePopup($event)"><i class="fa fa-reply"></i>取消</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import http from '../../common/http'
import api from '../../common/api'
import deepClone from '../../common/deepClone'

import fuzzySearch from '../../component/fuzzySearch'
export default {
  components: {
    fuzzySearch,
  },
  data () {
    return {
      isOpen: false,
      covertype: 'add',
      partyList: [],
      addData: {
        partyName: '',
        parentPartyId: '', //属性
        partyGroup: '', //分类  
        status: '',
        providerList: [],
        note: ''
      },
      provider: {
        selected: {},
        selecteds: []
      },
      selectProvider:{    //模糊查询参数
        data:{
          provider:{
            providerName:'',  //供应商名称
          },
          offset: 0,
          length: 10,
        }
      },
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getPartyList();
    })
  },
  filters: {
    partyGroupFilter (val) {
      val = val.split(':')[1];
      if (val === '') {
        val = '其他';
      }
      return val;
      // 0:其他
      // 1:母婴
      // 2:食品 / 冲饮 
      // 3:护肤 / 彩妆 / 洗护
      // 4:数码
      // 5:文具 / 保健品 / 非标 
      // 6:跨境
    },
    statusFilter (val) {
      var statusObj = {
        NORMAL: '运营中',
        CLOSING: '停业中',
        CLOSEED: '已停业',
        SYNCING: '托管同步',
      }
      for (var i in statusObj) {
        if (val == i) {
          return statusObj[i];
        }
      }
    }
  },
  methods: {
    checkReplace (val, arr) {
      var isReplace = false;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].providerId == val.providerId) {
          isReplace = true;
          layer.msg('不能重复选规格', {time: 2000});
        }
      }
      return isReplace;
    },
    addProvider () {
      if (!this.checkReplace(this.provider.selected, this.provider.selecteds) && typeof this.provider.selected.providerId != 'undefined') {
        this.provider.selecteds.push(deepClone(this.provider.selected));
      }
    },
    delProvider (n) {
      this.provider.selecteds.splice(n, 1);
    },
    saveCheck() {
      var isAjax = true;
      if (!this.addData.partyName) {
        isAjax = false;
        layer.msg('请填写业务组名称', {time: 2000});
      } else if (!this.addData.parentPartyId) {
        isAjax = false;
        layer.msg('请填写业务组分类', {time: 2000});
      } else if (!this.addData.partyGroup) {
        isAjax = false;
        layer.msg('请填写业务组属性', {time: 2000});
      } else if (!this.addData.status) {
        isAjax = false;
        layer.msg('请填写业务组状态', {time: 2000});
      } else if (!this.addData.providerList.length) {
        isAjax = false;
        layer.msg('请填写可用供应商', {time: 2000});
      }
      return isAjax;
    },
    saveFun () {
      const _self = this;
      _self.addData.providerList = [];
      for (var i in _self.provider.selecteds) {
        this.addData.providerList.push({
          providerId: _self.provider.selecteds[i].providerId,
          providerName: _self.provider.selecteds[i].providerName
        });
      }
      if (_self.saveCheck()) {
        if (_self.covertype == 'add') {
          delete this.addData.partyId;
          http({
            instance: _self,
            url: api.addParty,
            type: 'post',
            data: {
              data: _self.addData
            },
            success (res) {
              if (res.success) {
                layer.msg('添加成功', {time: 2000});
                _self.getPartyList();
                _self.provider.selecteds = [];
                _self.isOpen = false;
              }
            }
          });
        } else {
          http({
            instance: _self,
            url: api.updateParty,
            type: 'post',
            data: {
              data: _self.addData
            },
            success (res) {
              if (res.success) {
                layer.msg('修改成功', {time: 2000});
                _self.getPartyList();
                _self.provider.selecteds = [];
                _self.isOpen = false;
              }
            }
          });
        }
      }
    },
    addFun () {
      this.covertype = 'add';
      this.isOpen = true;
      this.clearData();
    },
    clearData () {
      for (var i in this.addData) {
        if (i == 'providerList') {
          this.addData[i] = [];
          this.provider.selecteds = [];
        } else {
          this.addData[i] = '';
        }
      }
    },
    editFun (msg) {
      this.clearData();
      this.covertype = 'update';
      this.isOpen = true;
      for (var i in this.addData) {
        for (var j in msg) {
          if (i == j) {
            this.addData[i] = msg[j];
          }
        }
      }
      this.provider.selecteds = deepClone(this.addData.providerList);
      this.addData.parentPartyId = msg.parentPartyId.partyId;
      this.addData.partyId = msg.partyId;
    },
    getPartyList () {
      const _self = this;
      http({
        instance: _self,
        url: api.getPartyList,
        type: 'post',
        hasLoading: true,
        data: {
          data: {}
        },
        success (res) {
          if (res.success) {
            _self.partyList = res.data.reverse();
          }
        }
      });
    },
    partyNameTip () {
      layer.tips('业务组是系统一个完整独立的子系统，所有的商品、库存都依托于业务组下。业务组名称应该简洁易识别，与历史不可重复', '#partyName');
    },
    closePopup (e) {
      this.isOpen = false;
    },
    chooseSearchProvider(res){
      const _self = this;
      if(res){
        _self.provider.selected = res;
      } else{
        _self.provider.selected = '';
      }
    },
  }
}
</script>

<style scoped>
.addIcon {
  display: inline-block;
  color: #0066FF;
  cursor: pointer;
}
.providerList {
  margin-right: 10px;
}
</style>