<template>
  <div class="content-wrapper" style="margin:0; padding:0">
    <!-- 
    <section class="content-header">
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-desktop"></i>采购</a></li>
        <li>采购列表</li>
        <li class="active">采购单详情</li>
      </ol>
    </section>
     -->
    
    <!-- Main content -->
    <section class="content purchaseDetail content_yjlu">
      <div class="row form-horizontal">
        <div class="col-md-8 noPadding">
          <div class="col-md-12 bgFFF">
            <div class="form-group">
              <strong class="col-md-7" style="font-size:14px;">订单号:
                <span>{{OrderPurchaseResult.orderSn}}({{party.partyName}})</span>
                <span class="added-tag">{{OrderPurchaseResult.status | statusFilter}}</span>
              </strong>
              <div class="col-md-5 textAlignRight">
                <button v-if="actionButtonsShow('checkOrder')" class="btn btn-xs btn-primary" @click="purchaseCheckFun">审核通过</button>
                <button v-if="actionButtonsShow('rejectOrder')" class="btn btn-xs btn-primary" @click="purchaseDenyFun">审核否决</button>
                <button v-if="actionButtonsShow('outboundReject')" class="btn btn-xs btn-primary" @click="purchaseInRejectFun">出库驳回</button>
                <button v-if="actionButtonsShow('terminateOrder')" class="btn btn-xs btn-info" @click="purchaseTerminateFun">中止入库</button>
                <button v-if="actionButtonsShow('closeOrder')" class="btn btn-xs btn-danger" @click="purchaseCancelFun">作废订单</button>
              </div>
            </div>
            <div class="form-group">
              <process-state class="col-md-12" :statedata="stateData" :curstate="curState" :style-obj="styleObj"></process-state>
            </div>
          </div>
          <div class="col-md-12 bgFFF longLine" v-if="OrderPurchaseResult.exceptionLabel">
            <div class="form-group col-md-12">
              <button class="btn btn-xs btn-info" @click="clearExceptionLabel">清除异常</button>
              <span class="clearExceptionLabel">异常标签：</span>
              <span class="added-tag" v-if="exceptionLabelArr" v-for="item in exceptionLabelArr">{{item | exceptionLabelFilter}}</span>
            </div>
          </div>
          <div class="col-md-12">
            <small>来源信息</small>
            <i v-if="isEdit_msgInfo == false" class="iconfont iconfontEdit editIcon" @click="editFun('isEdit_msgInfo', {key:'provider.providerName',value:OrderPurchaseResult.provider.providerName}, {key:'creator.name',value:OrderPurchaseResult.creator.name}, {key:'channelType',value:OrderPurchaseResult.channelType}, {key:'providerOrderOutSn',value:OrderPurchaseResult.providerOrderOutSn}, {key:'providerOrderPurchaseSn', value:OrderPurchaseResult.providerOrderPurchaseSn})">&#xe622;</i>
            <div v-if="isEdit_msgInfo == true" class="editIcon">
              <i class="iconfont iconfontYes" @click="modify('isEdit_msgInfo')">&#xe626;</i>
              <i class="iconfont iconfontNo" @click="clearFun('isEdit_msgInfo')">&#xe7ca;</i>
            </div>
          </div>
          <div class="col-md-12 bgFFF">
            <div class="col-sm-4">
              <div class="form-group">
                <label class="control-label col-sm-3">供应商:</label>
                <div style="display: inline-block;" v-if="isEdit_msgInfo == true && OrderPurchaseResult.status != 'CANCEL'">
                  <fuzzy-search id="chooseSearchProvider" :placeholder="'供应商模糊搜索'"  searchfiled="providerName"  :listarray="['providerName']" :config="{'apiName':'getProviderTableList','needKey':true,'fixWidth':false,'keyPath':'data.provider.providerName','resultPath':'data.content'}" :parameter="selectProvider" @choose="chooseSearchProvider"></fuzzy-search>
                </div>
                <span v-if="isEdit_msgInfo == false || OrderPurchaseResult.status == 'CANCEL'" class="control-label col-sm-9 textAlignLeft">{{OrderPurchaseResult.provider.providerName}}</span>
              </div>
              <div class="form-group">
                <label class="control-label col-sm-3">发起人:</label>
                <span class="control-label col-sm-9 textAlignLeft">{{OrderPurchaseResult.creator.name}}</span>
              </div>
            </div>
            <div class="col-sm-3">
              <div class="form-group">
                <label class="control-label col-sm-12">&nbsp;</label>
              </div>
              <div class="form-group">
                <label class="control-label col-sm-5">渠道类型:</label>
                <span class="control-label col-sm-7 textAlignLeft">{{OrderPurchaseResult.channelType | channelTypeFilter}}</span>
              </div>
            </div>
            <div class="col-sm-5">
              <div class="form-group">
                <label class="control-label col-sm-6">供应商出库单号:</label>
                <div class="col-sm-6" v-if="isEdit_msgInfo == true && OrderPurchaseResult.status == 'CHECK_WAIT'">
                  <input class="form-control input-sm" type="text" v-model="OrderPurchaseResult.providerOrderOutSn" />
                </div>
                <span v-if="isEdit_msgInfo == false || OrderPurchaseResult.status != 'CHECK_WAIT'" class="control-label col-sm-6 textAlignLeft">{{OrderPurchaseResult.providerOrderOutSn}}</span>
              </div>
              <div class="form-group">
                <label class="control-label col-sm-6">供应商采购单号:</label>
                <div class="col-sm-6" v-if="isEdit_msgInfo == true && OrderPurchaseResult.status == 'CHECK_WAIT'">
                  <input class="form-control input-sm" type="text" v-model="OrderPurchaseResult.providerOrderPurchaseSn" />
                </div>
                <span v-if="isEdit_msgInfo == false || OrderPurchaseResult.status != 'CHECK_WAIT'" class="control-label col-sm-6 textAlignLeft">{{OrderPurchaseResult.providerOrderPurchaseSn}}</span>
              </div>
            </div>
          </div>
          <div class="col-md-12">
            <small>收货仓</small>
            <i v-if="isEdit_warehouse == false" class="iconfont iconfontEdit editIcon" @click="editFun('isEdit_warehouse', {key:'warehouse.warehouseName',value:OrderPurchaseResult.warehouse.warehouseName}, {key:'warehouse.warehouseType',value:OrderPurchaseResult.warehouse.warehouseType}, {key:'expectArrivalTime',value:OrderPurchaseResult.expectArrivalTime})">&#xe622;</i>
            <div v-if="isEdit_warehouse == true" class="editIcon">
              <i class="iconfont iconfontYes" @click="modify('isEdit_warehouse')">&#xe626;</i>
              <i class="iconfont iconfontNo" @click="clearFun('isEdit_warehouse')">&#xe7ca;</i>
            </div>
          </div>
          <div class="col-md-12 bgFFF">
            <div class="col-sm-4">
              <div class="form-group">
                <label class="control-label col-sm-3">仓库:</label>
                <div class="col-sm-9" v-if="isEdit_warehouse == true && OrderPurchaseResult.status == 'CHECK_WAIT'">
                  <search-warehouse id="searchWarehouse" placeholder="仓库搜索" @selected="selectedWarehouse"></search-warehouse>
                </div>
                <span v-if="isEdit_warehouse == false || OrderPurchaseResult.status != 'CHECK_WAIT'" class="control-label col-sm-9 textAlignLeft">{{OrderPurchaseResult.warehouse.warehouseName}}</span>
              </div>
            </div>
            <div class="col-sm-3">
              <div class="form-group">
                <label class="control-label col-sm-5">仓库类型:</label>
                <span class="control-label col-sm-7 textAlignLeft">{{OrderPurchaseResult.warehouse.warehouseType}}</span>
              </div>
            </div>
            <div class="col-sm-5">
              <div class="form-group">
                <label class="control-label col-sm-6">预计到货时间:</label>
                <div class="col-sm-6" v-if="isEdit_warehouse == true && (OrderPurchaseResult.status == 'CHECK_WAIT' || OrderPurchaseResult.status == 'CHECK_PASS' || OrderPurchaseResult.status == 'PUSH_FINISH')">
                  <date-picker id="expectedTimeOfArrivalStart" @choose="chooseExpectedStart" :init-date-time="OrderPurchaseResult.expectArrivalTime"></date-picker>
                </div>
              </div>
            </div>
          </div>        
          <div class="col-md-12">
            <small>订单留言</small>
            <span class="primaryBtn" @click="showMessageAddModal = true" v-if="OrderPurchaseResult.status != 'IN_FINISH' && OrderPurchaseResult.status != 'CANCEL'">添加备注</span>
            <i v-if="isEdit_note == false" class="iconfont iconfontEdit editIcon" @click="editFun('isEdit_note', {key:'innerNote',value:OrderPurchaseResult.innerNote}, {key:'warehouseNote',value:OrderPurchaseResult.warehouseNote})">&#xe622;</i>
            <div v-if="isEdit_note == true" class="editIcon">
              <i class="iconfont iconfontYes" @click="modify('isEdit_note')">&#xe626;</i>
              <i class="iconfont iconfontNo" @click="clearFun('isEdit_note')">&#xe7ca;</i>
            </div>
          </div>
          <div class="col-md-12 bgFFF">
            <div class="form-group">
              <label class="control-label col-sm-2 colorRed">内部留言:</label>
              <div class="col-sm-10" v-if="isEdit_note == true && OrderPurchaseResult.status == 'CHECK_WAIT'">
                <input class="form-control input-sm" type="text" v-model="OrderPurchaseResult.innerNote" />
              </div>
              <span v-if="isEdit_note == false || OrderPurchaseResult.status != 'CHECK_WAIT'" class="control-label col-sm-10 textAlignLeft">{{OrderPurchaseResult.innerNote}}</span>
            </div>
            <div class="form-group">
              <label class="control-label col-sm-2 colorRed">仓库留言:</label>
              <div class="col-sm-10" v-if="isEdit_note == true && (OrderPurchaseResult.status == 'CHECK_WAIT' || OrderPurchaseResult.status == 'CHECK_PASS' || OrderPurchaseResult.status == 'PUSH_FINISH')">
                <input class="form-control input-sm" type="text" v-model="OrderPurchaseResult.warehouseNote" />
              </div>
              <span v-if="isEdit_note == false || (OrderPurchaseResult.status != 'CHECK_WAIT' || OrderPurchaseResult.status != 'CHECK_PASS' || OrderPurchaseResult.status != 'PUSH_FINISH')" class="control-label col-sm-10 textAlignLeft">{{OrderPurchaseResult.warehouseNote}}</span>
            </div>
          </div>
        </div>
        <div class="orderLog noPadding bgFFF">
            <div class="form-group">
                <strong class="col-md-12">订单日志</strong>
            </div>
            <div class="form-group">
                <div class="col-sm-12 tableContent">
                    <table class="table table-hover table-condensed myTable">
                        <thead>
                            <tr>
                                <th width="20%">操作人</th>
                                <th>日志</th>
                                <th width="25%">时间</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, i) in remarkList">
                                <td v-text="item.creator.name"></td>
                                <td v-html="item.content"></td>
                                <td v-text="item.createTime"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
      <div class="row form-horizontal">
        <div class="col-md-12">
          <small>商品信息</small>
          <i v-if="isEdit_goodsInfo == false" class="iconfont iconfontEdit editIcon" @click="editFun('isEdit_goodsInfo', {key:'currency',value:OrderPurchaseResult.currency}, {key:'rebateTotalPrice',value:OrderPurchaseResult.rebateTotalPrice})">&#xe622;</i>
          <div v-if="isEdit_goodsInfo == true" class="editIcon">
            <i class="iconfont iconfontYes" @click="modify('isEdit_goodsInfo')">&#xe626;</i>
            <i class="iconfont iconfontNo" @click="clearFun('isEdit_goodsInfo')">&#xe7ca;</i>
          </div>
        </div>
        <div class="col-md-12 bgFFF">
          <div class="form-group">
            <div class="col-md-4">
              <label class="control-label col-md-3">币种:</label>
              <div class="col-md-8" v-if="isEdit_goodsInfo == true && OrderPurchaseResult.status != 'CANCEL'">
                <select class="form-control select-sm" v-model="OrderPurchaseResult.currency">
                  <option value="RMB">人民币</option>
                </select>
              </div>
              <span v-if="isEdit_goodsInfo == false ||  OrderPurchaseResult.status == 'CANCEL'" class="control-label col-sm-8 textAlignLeft">{{OrderPurchaseResult.currency}}</span>
            </div>
            <div class="col-md-4">
              <label class="control-label col-md-3">返利:</label>
              <div class="col-md-8" v-if="isEdit_goodsInfo == true && OrderPurchaseResult.status != 'CANCEL'">
                <input class="form-control input-sm" type="text" v-model="OrderPurchaseResult.rebateTotalPrice">
              </div>
              <span v-if="isEdit_goodsInfo == false ||  OrderPurchaseResult.status == 'CANCEL'" class="control-label col-sm-8 textAlignLeft">{{OrderPurchaseResult.rebateTotalPrice}}</span>
            </div>
            <div class="col-md-4">
              <label class="control-label col-md-6">设定默认票扣比例:</label>
              <div class="col-md-6">
                <input class="form-control input-sm" type="text">
                <span class="unitIcon" style="right: 16px;">%</span>
              </div>
            </div>
          </div>
          <div class="col-sm-12 tableContent">
            <table class="table table-hover table-condensed myTable">
              <thead>
                <tr>
                  <th>子订单号</th>
                  <th>商品名称/规格</th>
                  <th>商品条形码</th>
                  <th>单价</th>
                  <th>下单数量</th>
                  <th>税率</th>
                  <th>采购金额</th>
                  <th>使用票扣</th>
                  <th>下单单价</th>
                  <th>操作</th>
                  <th>实际入库数</th>
                  <!-- <th>退货数</th> -->
                  <th>已到票数</th>
                  <th>未到票数</th>
                  <th>入库单价</th>
                  <th>实际入库金额</th>
                  <th>关联发票号</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in OrderPurchaseResult.orderPurchaseDetails">
                  <td>{{item.orderGoods.orderGoodsId}}</td>
                  <td>{{item.sku.skuName}}</td>
                  <td>{{item.sku.barcode}}</td>
                  <td>
                    <input v-if="item.isEdit_sku == true" class="form-control input-sm" type="text" v-model="item.unitPrice">
                    <span v-if="item.isEdit_sku == false && OrderPurchaseResult.status != 'CANCEL'">{{item.unitPrice}}</span>
                  </td>
                  <td>
                    <input v-if="item.isEdit_sku == true && OrderPurchaseResult.status == 'CHECK_WAIT'" class="form-control input-sm" type="text" v-model="item.purchaseNumber">
                    <span v-else>{{item.purchaseNumber}}</span>
                  </td>
                  <td>{{item.sku.goods.taxRate}}</td>
                  <td>{{(item.unitPrice * item.purchaseNumber - item.reducePrice).toFixed(2)}}</td>
                  <td>
                    <input v-if="item.isEdit_sku == true && OrderPurchaseResult.status != 'CANCEL'" class="form-control input-sm" type="text" v-model="item.reducePrice">
                    <span v-if="item.isEdit_sku == false">{{item.reducePrice}}</span>
                  </td>
                  <td>{{item.singlePrice}}</td>
                  <td>
                    <i v-if="item.isEdit_sku == false" class="iconfont iconfontEdit" @click="editFun_sku(item)">&#xe622;</i>
                    <div v-if="item.isEdit_sku == true">
                      <i class="iconfont iconfontYes" @click="saveFun_sku(item)">&#xe626;</i>
                      <i class="iconfont iconfontNo" @click="clearFun_sku(item, i)">&#xe7ca;</i>
                    </div>
                    <i class="iconfont iconfontDelete" @click="deleteTr(item.orderPurchaseDetailId)" v-if="OrderPurchaseResult.status == 'CHECK_WAIT'">&#xe613;</i>
                  </td>
                  <td>{{item.actualInNumber}}</td>
                  <!-- <td>{{item.returnNumber}}</td> -->
                  <td>{{item.arrivalInvoiceNumber}}</td>
                  <td>{{item.nonArrivalInvoiceNumber}}</td>
                  <td>{{((item.unitPrice * item.purchaseNumber - item.reducePrice) / item.purchaseNumber).toFixed(2)}}</td>
                  <td>
                    <span v-if="item.actualInNumber">{{((item.unitPrice * item.purchaseNumber - item.reducePrice) / item.purchaseNumber * item.actualInNumber).toFixed(2)}}</span>
                  </td>
                  <td>
                    <div v-for="invoiceNumberItem in item.orderPurchaseInvoices">
                      {{invoiceNumberItem.invoiceNumber | invoiceNumberFilter}}
                    </div>
                  </td>
                </tr>
                <tr v-if="OrderPurchaseResult.status == 'CHECK_WAIT'">
                  <td></td>
                  <td>
                    <search-goods-name id="searchGoods" ref="searchGoods" @selected="selectGoods"></search-goods-name>
                  </td>
                  <td></td>
                  <td>
                    <input class="form-control input-sm" type="text" v-model="addDetailData.unitPrice">
                  </td>
                  <td>
                    <input class="form-control input-sm" type="text" v-model="addDetailData.purchaseNumber">
                  </td>
                  <td></td>
                  <td></td>
                  <td>
                    <input class="form-control input-sm" type="text" v-model="addDetailData.reducePrice">
                  </td>
                  <td></td>
                  <td>
                    <i class="iconfont iconfontAdd" @click="addDetail">&#xe60a;</i>
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colspan="99">
                    <div class="col-sm-4 textAlignLeft">
                      <span style="margin-right: 20px;">下单应付：{{sum.price}}</span>
                      <span>最后应付：{{sum.lastPrice}}</span>
                    </div>
                    <div class="col-sm-8 textAlignRight">
                      <span style="margin-right: 20px;">下单数：{{sum.number}}</span>
                      <span style="margin-right: 20px;">入库数：{{sum.inNumber}}</span>
                      <span style="margin-right: 20px;">退货数：{{sum.returnNumber}}</span>
                      <span style="margin-right: 20px;">已到票：{{sum.arrivalInvoiceNumber}}</span>
                      <span>未到票：{{sum.nonArrivalInvoiceNumber}}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <component is="add-note-modal" v-if="showMessageAddModal" :show-overlay="showOverlay" @cancel="showMessageAddModal = false" @confirm="addRemarkFun"></component>
  </div>
</template>

<script>
import initStyle from '../../../common/initStyle'
import http from '../../../common/http'
import api from '../../../common/api'
import deepClone from '../../../common/deepClone'

import processState from '../../../component/processState'
import addNoteModal from '../../../component/addNoteModal'
import datePicker from '../../../component/datePicker'
import searchGoodsName from '../../../component/searchGoodsName'
import fuzzySearch from '../../../component/fuzzySearch'
import searchWarehouse from '../../../component/searchWarehouse'
var _self = {};
export default {
  components: {
    processState,
    addNoteModal,
    datePicker,
    searchGoodsName,
    fuzzySearch,
    searchWarehouse
  },
  data () {
    return {
      stateData: [{
        state: 'create',
        name:'创建',
        time: ''
      }, {
        state: 'CHECK_WAIT',
        name: '待审核',
        time: ''
      }, {
        state: 'CHECK_PASS',
        name: '已审核',
        time: ''
      }, {
        state: 'PUSH_FINISH',
        name: '已推送',
        time: ''
      }, {
        state: 'IN_START',
        name: '开始入库',
        time: ''
      }, {
        state: 'IN_FINISH',
        name: '入库完成',
        time: ''
      }, {
        state: 'CANCEL',
        name: '作废',
        time: ''
      }],
      curState: {
        state: 'create',
        icon: '/src/img/u1287.png'
      },
      styleObj: {
        'stateItem': 90,
        'topIcon': 40
      },
      showMessageAddModal: false,
      showOverlay: true,
      isEdit_msgInfo: false,
      isEdit_warehouse: false,
      isEdit_note: false,
      isEdit_goodsInfo: false,
      orderPurchaaseId: '',
      OrderPurchaseResult: {
        exceptionLabel: {},
        creator: {},
        provider: {},
        warehouse: {},
        orderPurchaseDetails: []
      },
      exceptionLabelArr: [],
      exceptionLabel: {
        IN_REJECT: '入库驳回',
        CHECK_DENY: '审核否决',
        PUSH_FAIL: '推送失败',
      },
      addDetailData: {
        orderPurchaseId: '',
        orderId: '',
        skuId: '',
        reducePrice: '',
        unitPrice: '',
        purchaseNumber: ''
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
      remarkList: [],
      sku_item_old: {},
      info_old: {},
      party: {},
    }
  },
  mounted () {
    _self = this;
    this.$nextTick(() => {
      initStyle();
      this.getPurchaseDetail();
      this.getPartyDetails();
    });
  },
  computed: {
    sum () {
      const _self = this;
      let sum = {
        price: 0,
        lastPrice: 0,
        number: 0,
        inNumber: 0,
        returnNumber: 0,
        arrivalInvoiceNumber: 0,
        nonArrivalInvoiceNumber: 0,
      }
      _self.OrderPurchaseResult.orderPurchaseDetails.forEach(function (item, i) {
        sum.price += item.singlePrice * item.purchaseNumber;
        if (item.actualInNumber) {
          sum.lastPrice += (item.unitPrice * item.purchaseNumber - item.reducePrice) / item.purchaseNumber * item.actualInNumber;
          sum.inNumber += item.actualInNumber;
        } else {
          sum.lastPrice = 0;
          sum.inNumber = '无';
        }
        if (item.purchaseNumber) {
          sum.number += item.purchaseNumber;
        } else {
          sum.number = '无';
        }
        if (item.arrivalInvoiceNumber) {
          sum.arrivalInvoiceNumber += item.arrivalInvoiceNumber;
        } else {
          sum.arrivalInvoiceNumber = '无';
        }
        if (item.nonArrivalInvoiceNumber) {
          sum.nonArrivalInvoiceNumber += item.nonArrivalInvoiceNumber;
        } else {
          sum.nonArrivalInvoiceNumber = '无';
        }
      });
      sum.price = (sum.price - _self.OrderPurchaseResult.rebateTotalPrice).toFixed(2);
      if (sum.lastPrice) {
        sum.lastPrice = (sum.lastPrice - _self.OrderPurchaseResult.rebateTotalPrice).toFixed(2);
      } else {
        sum.lastPrice = '无';
      }
      return sum;
    }
  },
  filters: {
    invoiceNumberFilter (val) {
      if (val.substring(val.length - 1, val.length) != ',') {
        return val + ',';
      }
    },
    channelTypeFilter (val) {
      var channelTypeObj = {
        DOMESTIC_FLAGSHIP: '国内旗舰店',
        OVERSEAS_FLAGSHIP: '跨境旗舰店',
        TMALL_SUPERMARKET: '猫超',
        DISTRIBUTOR: '分销',
        EKA: 'EKA'
      }
      for (var i in channelTypeObj) {
        if (val == i) {
          return channelTypeObj[i];
        }
      }
    },
    statusFilter (val) {
      for (var i in _self.stateData) {
        if (val == _self.stateData[i].state) {
          return _self.stateData[i].name;
        }
      }
    },
    exceptionLabelFilter (val) {
      for (var i in _self.exceptionLabel) {
        if (val == i) {
          return _self.exceptionLabel[i];
        }
      }
    }
  },
  methods: {
    getPartyDetails() {
      const _self = this;
      http({
            instance: _self,
            url: api.getPartyDetail,
              type: 'post',
              hasLoading: true,
              success (res) {
                _self.party = res.data;
              }
          });
    },
    chooseExpectedStart (time) {
      this.OrderPurchaseResult.expectArrivalTime = time.data;
    },
    getRemark () {
      const _self = this;
      http({
        instance: _self,
        url: api.purchaseRemarkList,
        type: 'post',
        data: {
          data: {
            orderIds: [_self.OrderPurchaseResult.order.orderId]
          }
        },
        success (res) {
          if (res.success) {
            _self.remarkList = res.data[0];
          }
        }
      });
    },
    addRemarkFun (obj) {
      const _self = this;
      if (obj.color) {
        obj.content = '<span style="color:'+ obj.color +';">' + obj.note + '</span>';
        obj.displayContent = obj.note;
      } else {
        obj.content = obj.note;
        obj.displayContent = obj.note;
      }
      http({
        instance: _self,
        url: api.purchaseRemarkAdd,
        type: 'post',
        data: {
          data: {
            orderId: _self.OrderPurchaseResult.order.orderId,
            orderGoodsId: '',
            content: obj.content,
            displayContent: obj.displayContent
          }
        },
        success (res) {
          if (res.success) {
            _self.showMessageAddModal = false;
            _self.getRemark();
          }
        }
      });
    },
    purchaseTerminateFun () {
    	layer.confirm('确认要中止入库吗', function(){
    		http({
    			instance: _self,
    	        url: api.purchaseTerminate,
    	        type : 'post',
    	        hasLoading: true,
    	        data: {
    	        	data : {
    	        		orderIds : [_self.OrderPurchaseResult.order.orderId]
    	        	}
    	        },
    	        success (res) {
    	        	if (res.success) {
    	                layer.closeAll();
    	                _self.getPurchaseDetail();
    	              }
    	        }
    		})
    	}, function() {
			
		})
    },
    purchaseCancelFun () {
      const _self = this;
      layer.confirm('确认要作废订单吗', function(){
        http({
          instance: _self,
          url: api.purchaseCancel,
          type: 'post',
          hasLoading: true,
          data: {
            data: {
              orderIds: [_self.OrderPurchaseResult.order.orderId]
            }
          },
          success (res) {
            if (res.success) {
              layer.closeAll();
              _self.getPurchaseDetail();
            }
          }
        });
      }, function(){
        
      });
    },
    purchaseInRejectFun () {
      const _self = this;
      layer.confirm('确认要出库驳回吗', function(){
        http({
          instance: _self,
          url: api.purchaseInReject,
          type: 'post',
          hasLoading: true,
          data: {
            data: {
              orderIds: [_self.OrderPurchaseResult.order.orderId]
            }
          },
          success (res) {
            if (res.success) {
              layer.closeAll();
              _self.getPurchaseDetail();
            }
          }
        });
      }, function(){
        
      });
    },
    purchaseCheckFun () {
      const _self = this;
      layer.confirm('确认要审核通过吗', function(){
        http({
          instance: _self,
          url: api.purchaseCheck,
          type: 'post',
          hasLoading: true,
          data: {
            data: {
              orderIds: [_self.OrderPurchaseResult.order.orderId]
            }
          },
          success (res) {
            if (res.success) {
              layer.closeAll();
              _self.getPurchaseDetail();
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
          hasLoading: true,
          data: {
            data: {
              orderIds: [_self.OrderPurchaseResult.order.orderId]
            }
          },
          success (res) {
            if (res.success) {
              layer.closeAll();
              _self.getPurchaseDetail();
            }
          }
        });
      }, function(){
        
      });
    },
    modify (type) {
      const _self = this;
      http({
        instance: _self,
        url: api.purchaseModify,
        type: 'post',
        hasLoading: true,
        data: {
          data: {
            orderPurchaseId: _self.OrderPurchaseResult.orderPurchaseId,
            partyId: '',
            providerId: _self.OrderPurchaseResult.provider.providerId,
            warehouseId: _self.OrderPurchaseResult.warehouse.warehouseId,
            providerOrderPurchaseSn: _self.OrderPurchaseResult.providerOrderPurchaseSn,
            providerOrderOutSn: _self.OrderPurchaseResult.providerOrderOutSn,
            channelType: _self.OrderPurchaseResult.channelType,
            rebateTotalPrice: _self.OrderPurchaseResult.rebateTotalPrice,
            currency: _self.OrderPurchaseResult.currency,
            expectArrivalTime: _self.OrderPurchaseResult.expectArrivalTime,
            innerNote: _self.OrderPurchaseResult.innerNote,
            warehouseNote: _self.OrderPurchaseResult.warehouseNote
          }
        },
        success (res) {
          if (res.success) {
            _self[type] = false;
            _self.info_old = {};
            _self.getPurchaseDetail();
            layer.msg('修改成功', {time: 2000});
          }
        }
      });
    },
    addDetail () {
      const _self = this;
      _self.addDetailData.orderId = _self.OrderPurchaseResult.order.orderId;
      _self.addDetailData.orderPurchaseId = _self.OrderPurchaseResult.orderPurchaseId;
      http({
        instance: _self,
        url: api.purchaseDetailAdd,
        type: 'post',
        hasLoading: true,
        data: {
          data: _self.addDetailData
        },
        success (res) {
          if (res.success) {
            _self.getPurchaseDetail();
            layer.msg('添加成功', {time: 2000});
            for (var i in _self.addDetailData) {
              _self.addDetailData[i] = '';
            }
            _self.$refs.searchGoods.key = '';
          }
        }
      });
    },
    selectGoods (data) {
      if (data) {
        _self.addDetailData.skuId = data.id;
      } else {
        _self.addDetailData.skuId = '';
      }
    },
    editFun_sku (item) {
      item.isEdit_sku = true;
      this.sku_item_old = deepClone(item);
    },
    clearFun_sku (i) {
      this.sku_item_old.isEdit_sku = false;
      this.OrderPurchaseResult.orderPurchaseDetails.splice(i, 1, this.sku_item_old);
      this.sku_item_old = {};
    },
    saveFun_sku (item) {
      const _self = this;
      http({
        instance: _self,
        url: api.purchaseDetailModify,
        type: 'post',
        hasLoading: true,
        data: {
          data: {
            orderId: _self.$route.params.id,
            orderPurchaseDetailId: item.orderPurchaseDetailId,
            reducePrice: item.reducePrice,
            unitPrice: item.unitPrice,
            purchaseNumber: item.purchaseNumber
          }
        },
        success (res) {
          if (res.success) {
            item.isEdit_sku = false;
            _self.getPurchaseDetail();
            layer.msg('修改成功', {time: 2000});
          }
        },
        fail () {
          item.isEdit_sku = false;
        }
      });
      this.sku_item_old = {};
    },
    deleteTr (i) {
      const _self = this;
      layer.confirm('确认要删除此子订单吗', function(){
        http({
          instance: _self,
          url: api.purchaseDetailDelete,
          type: 'post',
          hasLoading: true,
          data: {
            data: {
              orderPurchaseDetailId: i
            }
          },
          success (res) {
            if (res.success) {
              _self.getPurchaseDetail();
              layer.closeAll();
            }
          }
        });
      }, function(){
        
      });
    },
    clearExceptionLabel () {
      const _self = this;
      layer.confirm('确认要清楚异常标签吗', function(){
        http({
          instance: _self,
          url: api.purchaseExceptionLabelClear,
          type: 'post',
          hasLoading: true,
          data: {
            data: {
              orderIds: [_self.OrderPurchaseResult.order.orderId]
            }
          },
          success (res) {
            if (res.success) {
              _self.getPurchaseDetail();
              layer.closeAll();
            }
          }
        });
      }, function(){
        
      });
    },
    editFun () {
      if (JSON.stringify(this.info_old) == '{}') {
        this[arguments[0]] = true;
        for (var i = 1; i < arguments.length; i++) {
          this.info_old[arguments[i].key] = arguments[i].value;
        }
      } else {
        layer.msg('先保存，再编辑', {time: 2000});
      }
    },
    clearFun (type) {
      this[type] = false;
      for (var i in this.info_old) {
        this.OrderPurchaseResult[i] = this.info_old[i];
      }
      this.info_old = {};
    },
    getPurchaseDetail () {
      const _self = this;
      http({
        instance: _self,
        url: api.getPurchaseDetail,
        type: 'post',
        data: {
          data: {
            orderId: _self.$route.params.id
          }
        },
        success (res) {
          if (res.success) {
            _self.OrderPurchaseResult = res.data;
            _self.getRemark();
            _self.curState = {
              state: _self.OrderPurchaseResult.status,
              icon: '/src/img/u1287.png'
            };
            _self.stateData[0].time = _self.OrderPurchaseResult.createTime;
            _self.exceptionLabelArr = _self.OrderPurchaseResult.exceptionLabel != undefined ? _self.OrderPurchaseResult.exceptionLabel.split(',') : [];
            for (var i in _self.stateData) {
              if (_self.stateData[i].state == _self.OrderPurchaseResult.status) {
                _self.stateData[i].time = _self.OrderPurchaseResult.lastUpdateTime;
              }
            }
            _self.OrderPurchaseResult.orderPurchaseDetails.forEach(function (item, i) {
              _self.$set(item, 'isEdit_sku', false);
              _self.$set(item, 'singlePrice', deepClone((item.unitPrice * item.purchaseNumber - item.reducePrice) / item.purchaseNumber).toFixed(2));
            });
          }
        }
      });
    },
    chooseSearchProvider(res){
      const _self = this;
      if(res){
        _self.OrderPurchaseResult.provider.providerId = res.providerId;
      } else{
        _self.OrderPurchaseResult.provider.providerId = '';
      }
    },
    selectedWarehouse (data) {
      if (data.warehouseId) {
        _self.OrderPurchaseResult.warehouse.warehouseId = data.warehouseId;
      } else {
        _self.OrderPurchaseResult.warehouse.warehouseId = '';
      }
    },
    actionButtonsShow(data) {
      switch (data) {
        case 'checkOrder':
          if(this.OrderPurchaseResult.status == 'CHECK_WAIT') {
            return true;
          }else {
            return false;
          }
          break;
        case 'rejectOrder':
          if(this.OrderPurchaseResult.status == 'CHECK_WAIT') {
            return true;
          }else {
            return false;
          }
          break;
        case 'outboundReject':
          if(this.OrderPurchaseResult.status == 'CHECK_PASS' || this.OrderPurchaseResult.status == 'PUSH_FINISH'){
            return true;
          }else {
            return false;
          }
          break;
        case 'closeOrder':
          if(this.OrderPurchaseResult.status != 'CANCEL' && this.OrderPurchaseResult.status != 'IN_FINISH') {
            return true;
          }else {
            return false;
          }
          break;
        case 'terminateOrder':
        	return this.OrderPurchaseResult.status == 'IN_START' && 'IN_FINISH' != this.OrderPurchaseResult.status && this.OrderPurchaseResult.status != 'CANCEL';
        default:
        break;

      }
      

    }
  }
}
</script>

<style lang="sass">
.purchaseDetail {
  .noPadding {
    padding-left: 0px;
    padding-right: 0px;
  }
  .form-group {
    margin: 0 0 10px 0;
    font-size: 12px;
  }
  .orderLog {
    width: 100%;
    margin: 0;
    height: 492px;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .longLine {
    border-top: 1px dashed #ccc;
  }
  @media (min-width: 992px) {
    .orderLog {
      float: left;
      width: 100% - 66.666% - 1%;
      margin-left: 1%;
    }
  }
  .colorRed {
    color: #FF0000;
  }
  .editIcon {
    position: absolute;
    top: 14px;
    right: 10px;
    cursor: pointer;
  }
  .clearExceptionLabel {
    color: #ccc;
    vertical-align: middle;
    margin: 0 0 0 10px;
  }
}
</style>