<template>
  <div class="content-wrapper">
    <section class="content-header clearfix">
      <ol class="breadcrumb col-md-6">
        <li><a href="#"><i class="fa fa-desktop"></i>采购</a></li>
        <li class="active">采购列表</li>
      </ol>
      <div class="col-md-6" style="text-align: right; position: relative; top: 10px;">
        <button class="btn btn-sm btn-primary" @click="addPurchase">
          <i class="fa fa-plus"></i>新建采购单
        </button>
      </div>
    </section>

    <!-- Main content -->
    <section class="content purchaseList content_yjlu">
      <div class="row form-horizontal searchContent bgFFF">
        <div class="col-md-3">
          <div class="form-group">
            <label class="control-label col-sm-4">采购单号</label>
            <div class="col-sm-8">
              <input class="form-control input-sm" type="text" v-model="OrderPurchaseListVO.orderSn">
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-4">供应商采购号</label>
            <div class="col-sm-8">
              <input class="form-control input-sm" type="text" v-model="OrderPurchaseListVO.providerOrderPurchaseSn">
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-4">预计到货时间</label>
            <div class="col-sm-8">
              <date-range-picker id="expectedTimeOfArrivalStart" :needhms="true" @get_date="chooseExpected" :start-time="OrderPurchaseListVO.expectArrivalStartTime" :end-time="OrderPurchaseListVO.expectArrivalEndTime"></date-range-picker>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="form-group">
            <label class="control-label col-sm-4">采购单状态</label>
            <div class="col-sm-8">
              <select class="form-control select-sm" v-model="OrderPurchaseListVO.status">
                <option value="">==请选择==</option>
                <option value="CHECK_WAIT">待审核</option>
                <option value="CHECK_PASS">已审核</option>
                <option value="PUSH">已推送</option>
                <option value="IN_START">开始入库</option>
                <option value="IN_FINISH">入库完成</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-4">供应商</label>
            <div class="col-sm-8">
              <fuzzy-search id="chooseSearchProvider" :placeholder="'供应商模糊搜索'"  searchfiled="providerName"  :listarray="['providerName']" :config="{'apiName':'getProviderTableList','needKey':true,'fixWidth':false,'keyPath':'data.provider.providerName','resultPath':'data.content'}" :parameter="selectProvider" @choose="chooseSearchProvider"> </fuzzy-search>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-4">订单时间</label>
            <div class="col-sm-8">
              <date-range-picker id="orderTimeEndId" :needhms="true" @get_date="chooseOrder" :start-time="OrderPurchaseListVO.orderStartTime" :end-time="OrderPurchaseListVO.orderEndTime"></date-range-picker>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="form-group">
            <label class="control-label col-sm-4">商品条码</label>
            <div class="col-sm-8">
              <input class="form-control input-sm" type="text" v-model="OrderPurchaseListVO.skuId">
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-4">收货仓</label>
            <div class="col-sm-8">
              <select class="form-control select-sm" v-model="OrderPurchaseListVO.warehouseId">
                <option value=""></option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-4">备注内容</label>
            <div class="col-sm-8">
              <input class="form-control input-sm" type="text" v-model="OrderPurchaseListVO.note">
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="form-group">
            <label class="control-label col-sm-4">商品名称</label>
            <div class="col-sm-8">
              <search-sku @selected="selectGoods"></search-sku>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-4">渠道类型</label>
            <div class="col-sm-8">
              <select class="form-control select-sm" v-model="OrderPurchaseListVO.channelType">
                <option value="">==请选择==</option>
                <option value="DOMESTIC_FLAGSHIP">国内旗舰店</option>
                <option value="OVERSEAS_FLAGSHIP">跨境旗舰店</option>
                <option value="TMALL_SUPERMARKET">猫超</option>
                <option value="DISTRIBUTOR">分销</option>
                <option value="EKA">EKA</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-4">发起人</label>
            <div class="col-sm-8">
              <input class="form-control input-sm" type="text" v-model="OrderPurchaseListVO.createUserId">
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-8 col-sm-offset-4">
              <button class="btn btn-sm btn-primary" @click="searchFun"><i class="fa fa-search"></i>查询</button>
              <button class="btn btn-sm btn-default" @click="" style="margin: 0 0 0 20px;"><i class="fa fa-download"></i>导出</button>
            </div>
          </div>
        </div>
      </div>
      <div class="btns">
        <input type="checkbox" v-model="selectAll" style="position:relative;top:2px;margin:0 5px 0 15px;">
        <span class="primaryBtn" @click="purchaseCheckFun">批量审核</span>
        <span class="primaryBtn" @click="purchaseDenyFun">批量否决</span>
      </div>
      <div class="box box-default">
        <div class="box-body">
          <table class="table">
            <thead>
              <tr>
                <th>选择</th>
                <th>采购单号<br/>预计入库时间</th>
                <th>渠道类型</th>
                <th>供应商</th>
                <th>收货仓</th>
                <th>申请数</th>
                <th>入库数</th>
                <th>采购金额</th>
                <th>入库金额</th>
                <th>状态</th>
                <th>指定单品申请数</th>
                <th>指定单品入库数</th>
                <th>指定商品采购金额</th>
                <th>指定商品入库金额</th>
                <th>未到票数量</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if='!OrderPurchaseResult.length'>
                <td colspan="100">
                  <h4 class='text-center text-gray'>什么也没有...</h4>
                </td>
              </tr>
              <template v-for="item in OrderPurchaseResult"> 
                <tr>
                  <td rowspan="2">
                    <input type="checkbox" v-model="item.isChecked">
                  </td>
                  <td>
                    <a :href="'#/purchase/purchaseManage/purchaseDetail/'+item.order.orderId" target="_blank">{{item.order.orderSn}}</a>
                    <br/>
                    {{item.expectArrivalTime.trim()}}
                  </td>
                  <td>{{item.channelType | channelTypeFilter}}</td>
                  <td><template v-if="item.provider">{{item.provider.providerName}}</template></td>
                  <td><template v-if="item.warehouse">{{item.warehouse.warehouseName}}</template></td>
                  <td>{{item.applyNumber}}</td>
                  <td>
                    {{item.actualInNumber}}
                    <div v-if="item.usedInNumber">{{item.usedInNumber}}(二手)</div>
                    <div v-if="item.defectiveInNumber">{{item.defectiveInNumber}}(瑕疵)</div>
                  </td>
                  <td>{{item.purchaseTotalPrice}}</td>
                  <td>{{item.actualInPrice}}</td>
                  <td>{{item.status | statusFilter}}</td>
                  <td>{{item.orderPurchaseDetails.purchaseNumber}}</td>
                  <td>
                    {{item.orderPurchaseDetails.actualInNumber}}
                    <div v-if="item.orderPurchaseDetails.usedInNumber">{{item.orderPurchaseDetails.usedInNumber}}(二手)</div>
                    <div v-if="item.orderPurchaseDetails.defectiveInNumber">{{item.orderPurchaseDetails.defectiveInNumber}}(瑕疵)</div>
                  </td>
                  <td>{{item.orderPurchaseDetails.purchasePrice}}</td>
                  <td>{{item.orderPurchaseDetails.actualInPrice}}</td>
                  <td>{{item.orderPurchaseDetails.nonArrivalInvoiceNumber}}</td>
                </tr>
                <tr>
                  <td colspan="99" class="textAlignLeft">
                    <div class="col-md-6">
                      <span class="smallTitle">内部留言</span>
                      <span>{{item.innerNote}}</span>
                    </div>
                    <div class="col-md-6">
                      <span class="smallTitle">仓库留言</span>
                      <span>{{item.warehouseNote}}</span>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div class="box-footer clearfix">
            <div class="col-md-2 no-padding"></div>
            <pagination :offset="OrderPurchaseListVO.offset" :length="OrderPurchaseListVO.length" :total-count="pageData.totalCount" @paginate="paginate"></pagination>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import initStyle from '../../../common/initStyle'
import http from '../../../common/http'
import api from '../../../common/api'
import {getDateStr} from '../../../common/getDateStr'

import dateRangePicker from '../../../component/dateRangePicker'
import searchSku from '../../../component/searchSku'
import fuzzySearch from '../../../component/fuzzySearch'
import pagination from '../../../component/pagination'

export default {
  components: {
    dateRangePicker,
    searchSku,
    fuzzySearch,
    pagination
  },
  data () {
    return {
      selectAll: false,
      pageData: {
        totalCount: ''
      },
      OrderPurchaseListVO: {
        orderSn: '',
        status: '',
        warehouseId: '',
        skuId: '',
        providerId: '',
        channelType: 'DOMESTIC_FLAGSHIP',
        providerOrderPurchaseSn: '',
        note: '',
        orderStartTime: '',
        orderEndTime: '',
        expectArrivalStartTime: '',
        expectArrivalEndTime: '',
        createUserId: '',
        offset: 0,
        length: 10
      },
      OrderPurchaseResult: {},
      OrderPurchaseCheckVO: {},
      selectProvider:{    //模糊查询参数
        data:{
          provider:{
            providerName:'',  //供应商名称
          },
          offset: 0,
          length: 10,
        }
      },
      orderIds: [],  // 审批参数
    }
  },
  mounted () {
    this.$nextTick(() => {
      initStyle();
      this.searchFun();
    });
    this.OrderPurchaseListVO.orderStartTime = getDateStr(-7, true);
    this.OrderPurchaseListVO.orderEndTime = getDateStr(0, true);
  },
  watch: {
    selectAll: function (newVal) {
      this.OrderPurchaseResult.forEach(function (item, i) {
        item.isChecked = newVal;
      });
    }
  },
  filters: {
    statusFilter (val) {
      var statusObj = {
        CHECK_WAIT: '待审核',
        CHECK_PASS: '已审核',
        PUSH_FINISH: '已推送',
        IN_START: '开始入库',
        IN_FINISH: '入库完成',
        CANCEL: '作废'
      }
      for (var i in statusObj) {
        if (i == val) {
          return statusObj[i];
        }
      }
    },
    channelTypeFilter (val) {
      var channelTypeObj = {
        DOMESTIC_FLAGSHIP: '国内旗舰店',
        OVERSEAS_FLAGSHIP: '跨境旗舰店',
        TMALL_SUPERMARKET: '猫超',
        DISTRIBUTOR: '分销',
        EKA: 'EKA',
      }
      for (var i in channelTypeObj) {
        if (i == val) {
          return channelTypeObj[i];
        }
      }
    }
  },
  methods: {
    // initOrderTime (val) {
    //   if (val == 'start') {
    //     return getDateStr(-7);
    //   } else {
    //     return getDateStr(0);
    //   }
    // },
    chooseExpected (time) {
      this.OrderPurchaseListVO.expectArrivalStartTime = time.start_time;
      this.OrderPurchaseListVO.expectArrivalEndTime = time.end_time;
    },
    chooseOrder (time) {
      this.OrderPurchaseListVO.orderStartTime = time.start_time;
      this.OrderPurchaseListVO.orderEndTime = time.end_time;
    },
    addPurchase () {
      var _self = this;
      _self.$router.push({name: 'addPurchase'});
    },
    getOrderId () {
      const _self = this;
      _self.orderIds = [];
      _self.OrderPurchaseResult.forEach(function (item, i) {
        if (item.isChecked) {
          _self.orderIds.push(item.order.orderId);
        }
      });
      return _self.orderIds;
    },
    purchaseCheckFun () {
      const _self = this;
      layer.confirm('确认要审核通过吗', function(){
        http({
          instance: _self,
          url: api.purchaseCheck,
          type: 'post',
          data: {
            data: {
              orderIds: _self.getOrderId()
            }
          },
          success (res) {
            console.log(res);
            if (res.data) {
              layer.closeAll();
              _self.searchFun();
            }
          }
        });
      }, function(){
        
      });
    },
    purchaseDenyFun () {
      const _self = this;
      layer.confirm('确认要否决吗', function(){
        http({
          instance: _self,
          url: api.purchaseDeny,
          type: 'post',
          data: {
            data: {
              orderIds: _self.getOrderId()
            }
          },
          success (res) {
            console.log(res);
            if (res.data) {
              layer.closeAll();
              _self.searchFun();
            }
          }
        });
      }, function(){
        
      });
    },
    searchFun () {
      const _self = this;
      // _self.OrderPurchaseListVO.orderStartTime = _self.OrderPurchaseListVO.orderStartTime + ' 00:00:00';
      // _self.OrderPurchaseListVO.orderEndTime = _self.OrderPurchaseListVO.orderEndTime + ' 23:59:59';
      // if (_self.OrderPurchaseListVO.expectArrivalStartTime) {
      //   _self.OrderPurchaseListVO.expectArrivalStartTime = _self.OrderPurchaseListVO.expectArrivalStartTime + ' 00:00:00';
      // }
      // if (_self.OrderPurchaseListVO.expectArrivalEndTime) {
      //   _self.OrderPurchaseListVO.expectArrivalEndTime = _self.OrderPurchaseListVO.expectArrivalEndTime + ' 23:59:59';
      // }
      if (_self.OrderPurchaseListVO.orderStartTime || _self.OrderPurchaseListVO.orderEndTime || _self.OrderPurchaseListVO.expectArrivalStartTime || _self.OrderPurchaseListVO.expectArrivalEndTime) {
        http({
          instance: _self,
          url: api.purchaseList,
          type: 'post',
          data: {
            data: _self.OrderPurchaseListVO
          },
          success (res) {
            console.log(res);
            if (res.data) {
              _self.OrderPurchaseResult = res.data.content;
              _self.pageData.totalCount = res.data.totalCount;
              _self.OrderPurchaseResult.forEach(function (item, i) {
                _self.$set(item, 'isChecked', false);
              });
            }
          }
        });
      } else {
        layer.msg('请填写"订单生成时间"和"预计到货时间"', {time: 2000});
      }
    },
    selectGoods (data) {
      if (data) {
        this.$set(this.OrderPurchaseListVO, 'skuId', data.skuId);
      } else {
        this.OrderPurchaseListVO.skuId = '';
      }
    },
    chooseSearchProvider(res){
      const _self = this;
      if(res){
        _self.OrderPurchaseListVO.providerId = res.providerId;
      } else{
        _self.OrderPurchaseListVO.providerId = '';
      }
    },
    paginate (data) {
      this.OrderPurchaseResult.offset = data.offset;
      this.OrderPurchaseResult.length = data.length;
      this.searchFun();
    }
  }
}
</script>

<style lang="sass" >
.purchaseList {
  table {
    .smallTitle {
      color: #333;
    }
  }
  .col-md-3 {
    padding: 0 !important;
  }
  .control-label {
    padding-left: 0px;
    padding-right: 0px;
  }
}
</style>