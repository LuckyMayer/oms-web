<template>
  <div class="content-wrapper">
    <section class="content-header clearfix">
      <ol class="breadcrumb col-md-6">
        <li><a href="#"><i class="fa fa-desktop"></i>财务</a></li>
        <li class="active" id="test2">销售发票</li>
      </ol>
      <div class="col-md-6" style="text-align: right; position: relative; top: 10px;">
        <button class="btn btn-sm btn-primary" @click="applyFun()">
          <i class="fa fa-plus"></i>申请销售发票
        </button>
        <button class="btn btn-sm btn-primary" @click="">
          批量开票
        </button>
      </div>
    </section>
    <!-- Main content -->
    <section class="content saleInvoice content_yjlu">
      <div class="row form-horizontal searchContent bgFFF">
        <div class="col-md-3">
          <div class="form-group">
            <label class="control-label col-sm-4">原始订单号</label>
            <div class="col-sm-8">
              <input class="form-control input-sm" type="text" placeholder="用英文逗号隔开" v-model="searchData.platformOrderIds" />
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-4">店铺</label>
            <div class="col-sm-8">
              <select class="form-control select-sm" v-model="searchData.shopId">
                <option value="">==请选择==</option>
                <option v-for="shopItem in shopList":value="shopItem.shopId">{{shopItem.shopName}}</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-4">订单类型</label>
            <div class="col-sm-8">
              <select class="form-control select-sm" v-model="searchData.orderType">
                <option value="">==请选择==</option>
                <option value="DIRECT">网店销售</option>
                <option value="EXCHANGE">换货</option>
                <option value="SUPPLY">补寄</option>
                <option value="DISTRIBUTE_ONLINE">线上分销</option>
                <option value="DISTRIBUTE_OFFLINE">线下分销</option>
                <!-- <option value="">赊销</option> -->
              </select>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="form-group">
            <label class="control-label col-sm-4">OMS订单</label>
            <div class="col-sm-8">
              <input class="form-control input-sm" type="text" placeholder="用英文逗号隔开" v-model="searchData.orderSns" />
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-4">分销商</label>
            <div class="col-sm-8">
              <search-distributor id="searchDistributor" placeholder="分销商搜索" @selected="searchDistributor"></search-distributor>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-4">发货条件</label>
            <div class="col-sm-8">
              <select class="form-control select-sm" v-model="searchData.sendConditionType">
                <option value="">==请选择==</option>
                <option value="PAID">先款后货</option>
                <option value="COD_SHIP">货到快递代收</option>
                <option value="COD">货到付款</option>
              </select>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="form-group">
            <label class="control-label col-sm-4">发票状态</label>
            <div class="col-sm-8">
              <select class="form-control select-sm" v-model="searchData.status">
                <option value="">==请选择==</option>
                <option value="INIT">待开票</option>
                <option value="INVOICED">已开票</option>
                <option value="CANCELLED">已作废</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-4">订单时间</label>
            <div class="col-sm-8">
              <date-range-picker id="orderTime" :needhms="false" @get_date="orderTime" :start-time="searchData.omsCreateStartTime" :end-time="searchData.omsCreateEndTime"></date-range-picker>
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-8 col-sm-offset-4">
              <button class="btn btn-primary btn-sm" @click="getSaleInvoiceLists"><i class="fa fa-search"></i>查询</button>
              <button class="btn btn-default btn-sm" @click="" style="margin: 0 0 0 20px;"><i class="fa fa-download"></i>导出</button>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="form-group">
            <label class="control-label col-sm-4">发票类型</label>
            <div class="col-sm-8">
              <select class="form-control select-sm" v-model="searchData.type">
                <option value="COMMON">普票</option>
                <option value="ADDED">增票</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-4">申请发票时间</label>
            <div class="col-sm-8">
              <date-range-picker id="applyInvoiceTime" :needhms="false" @get_date="applyInvoiceTime" :start-time="searchData.applyInvoiceStartTime" :end-time="searchData.applyInvoiceEndTime"></date-range-picker>
            </div>
          </div>
        </div>
      </div>
      <div class="bgFFF">
        <div id="navTab">
          <div class="tabItem" :class="{active: active}" @click="active = true;">直销({{directList.length}})</div>
          <div class="tabItem" :class="{active: !active}" @click="active = false;">分销({{distributeList.length}})</div>
        </div>
      </div>
      <div class="box box-default">
        <div class="box-body">
          <table class="table">
            <thead>
              <tr>
                <th style="width:83px;">发票申请时间</th>
                <th>OMS订单号<br/>原始订单号</th>
                <th>店铺<br/>分销商</th>
                <th>订单类型<br/>发货条件</th>
                <th>发货时间</th>
                <th>货款金额<br/>实收(含邮)</th>
                <th>发票类型</th>
                <th>开票金额</th>
                <th>发票抬头</th>
                <th>开票内容</th>
                <th>收票人<br/>收票信息</th>
                <th>发票号<br/>补寄运单</th>
                <th>订单状态</th>
                <th>发票状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="directItem in directList" v-if="active == true">
                <td>{{directItem.createTime}}</td>
                <td><a :href="'#/ordersManage/omsOrderDetail/orderDetails/'+directItem.order.orderId" target="_blank">{{directItem.orderSn}}</a><br/>{{directItem.platformOrderId}}</td>
                <td>
                  <span v-if="directItem.shop">{{directItem.shop.shopName}}</span>
                  <br/>
                  <span v-if="directItem.distributor">{{directItem.distributor.distributorName}}</span></td>
                <td>{{directItem.originOrderType | originOrderTypeFilter}}<br/>{{directItem.omsSendConditionType | omsSendConditionTypeFilter}}</td>
                <td>{{directItem.order.shipping_time}}</td>
                <td>
                  {{directItem.order.goodsFee}}
                  <br/>
                  {{directItem.order.payment}}
                </td>
                <td>{{directItem.type | typeFilter}}</td>
                <td>{{directItem.price}}</td>
                <td>{{directItem.title}}</td>
                <td>{{directItem.content}}</td>
                <td>
                  {{directItem.receiverName}}<br/>
                  <button class="btn btn-primary btn-sm miniBtn" @click="itemFun(directItem, null, true)">开票信息</button>
                </td>
                <td>{{directItem.invoiceNo}}<br/>{{directItem.sendLogisticsNumber}}</td>
                <td>{{directItem.order.orderStatus | orderStatusFilter}}</td>
                <td>{{directItem.status | statusFilter}}</td>
                <td style="min-width: 50px;">
                  <button class="btn btn-primary btn-sm miniBtn" v-if="directItem.status == 'INIT'" @click="itemFun(directItem, 'create', false, '开票')">开票</button>
                  <button class="btn btn-primary btn-sm miniBtn" v-if="directItem.status == 'INIT'" @click="itemFun(directItem, 'apply', false, '编辑')">编辑</button>
                  <button class="btn btn-primary btn-sm miniBtn" v-if="directItem.status == 'INIT'" @click="cancel(directItem.orderSaleInvoiceId)">作废</button>
                  <button class="btn btn-primary btn-sm miniBtn" v-if="directItem.status == 'INVOICED'" @click="itemFun(directItem, 'create', false, '编辑开票')">编辑开票</button>
                </td>
              </tr>
              <tr v-for="distributeItem in distributeList" v-if="active == false">
                <td>{{distributeItem.createTime}}</td>
                <td>{{distributeItem.orderSn}}<br/>{{distributeItem.platformOrderId}}</td>
                <td>{{distributeItem.shop}}<br/>{{distributeItem.distributor}}</td>
                <td>{{distributeItem.originOrderType | originOrderTypeFilter}}<br/>{{distributeItem.omsSendConditionType | omsSendConditionTypeFilter}}</td>
                <td><!-- {{distributeItem.orderInfo.shipping_time}} --></td>
                <td>{{distributeItem.createTime}}</td>
                <td>{{distributeItem.type | typeFilter}}</td>
                <td>{{distributeItem.price}}</td>
                <td>{{distributeItem.title}}</td>
                <td>{{distributeItem.content}}</td>
                <td>
                  {{distributeItem.receiverName}}<br/>
                  <button class="btn btn-default btn-sm miniBtn" @click="itemFun(distributeItem, null, true)">开票信息</button>
                </td>
                <td>{{distributeItem.invoiceNo}}<br/>{{distributeItem.sendLogisticsNumber}}</td>
                <td>{{directItem.order.orderStatus | orderStatusFilter}}</td>
                <td>{{distributeItem.status | statusFilter}}</td>
                <td style="min-width: 50px;">
                  <button class="btn btn-primary btn-sm miniBtn" v-if="distributeItem.status == 'INIT'" @click="itemFun(distributeItem, 'create', false, '开票')">开票</button>
                  <button class="btn btn-primary btn-sm miniBtn" v-if="distributeItem.status == 'INIT'" @click="itemFun(distributeItem, 'apply', false, '编辑')">编辑</button>
                  <button class="btn btn-primary btn-sm miniBtn" v-if="distributeItem.status == 'INIT'" @click="cancel(distributeItem.orderSaleInvoiceId)">作废</button>
                  <button class="btn btn-primary btn-sm miniBtn" v-if="directItem.status == 'INVOICED'" @click="itemFun(directItem, 'create', false, '编辑开票')">编辑开票</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="box-footer clearfix">
          <div class="col-md-2 no-padding"></div>
          <pagination :offset="searchData.offset" :length="searchData.length" :total-count="pageData.totalCount" @paginate="paginate"></pagination>
        </div>
      </div>
    </section>
    <!-- 弹窗 -->
    <div class="popup-wrap-yjlu popup-saleInvoice" v-if="isOpen">
      <div class="popup-content row form-inline">
        <p class="popup-title" v-if="covertype === 'apply'">申请销售发票</p>
        <p class="popup-title" v-if="covertype === 'create'">开销售发票</p>
        <div class="popup-main clearfix">
          <div class="col col-md-12">
            <small>订单信息</small>
          </div>
          <div class="col col-md-12">
            <div class="form-group">
              <label class="popup-laval required">OMS订单</label>
              <input class="form-control input-sm" type="text" v-model="applyData.orderSn" :disabled="disabled" />
              <i class="iconfont load" @click="getOrderDetail(applyData.orderSn)">&#xe602;</i>
            </div>
            <div class="form-group orderDetail">
              <label class="popup-laval">订单状态:</label>
              <span>{{orderDetail.orderStatus | orderStatusFilter}}</span>
            </div>
            <div class="form-group orderDetail">
              <label class="popup-laval">原始订单号:</label>
              <span>{{platformOrderIds}}</span>
            </div>
            <div class="form-group" style="width: 315.313px;">
              <label class="popup-laval">店铺:</label>
              <span>{{orderDetail.shop.shopName}}</span>
            </div>
            <div class="form-group orderDetail">
              <label class="popup-laval">分销商:</label>
              <!-- <span>{{orderDetail.distributor.distributorName}}</span> -->
            </div>
            <div class="form-group orderDetail">
              <label class="popup-laval">顾客ID:</label>
              <span>{{orderDetail.buyer}}</span>
            </div>
            <div class="form-group orderDetail" style="width: 315.313px;">
              <label class="popup-laval">含税货款:</label>
              <span>{{orderDetail.goodsFee}}</span>
            </div>
            <div class="form-group orderDetail">
              <label class="popup-laval">应收(含邮):</label>
              <span>{{orderDetail.totalFee}}</span>
            </div>
          </div>
          <div class="col col-md-12">
            <small class="small">开票信息</small>
            <div style="display: inline-block;margin: 0 0 0 30px;">
              <label class="radio-inline"><input type="radio" name="toInvoice" value="DIRECT" v-model="applyData.target" :disabled="disabled" />开给顾客</label>
              <label class="radio-inline"><input type="radio" name="toInvoice" value="DISTRIBUTE" v-model="applyData.target" :disabled="disabled" />开给分销商</label>
            </div>
          </div>
          <div class="col col-md-12">
            <div class="form-group">
              <label class="popup-laval required">发票类型</label>
              <select class="form-control input-sm" v-model="applyData.type" :disabled="disabled">
                <option value="">==请选择==</option>
                <option value="COMMON">普票</option>
                <option value="ADDED">增票</option>
              </select>
            </div>
            <div class="form-group">
              <label class="popup-laval required">开票金额:</label>
              <input class="form-control input-sm" type="text" v-model="applyData.price" :disabled="disabled" />
            </div>
            <div class="form-group">
              <label class="popup-laval required">内容</label>
              <select class="form-control input-sm" v-model="applyData.content" :disabled="disabled">
                <option value="ai">==请选择==</option>
                <option value="GOODS_DETAIL">商品明细</option>
              </select>
            </div>
            <div class="form-group">
              <label class="popup-laval required">抬头</label>
              <input class="form-control input-sm" type="text" v-model="applyData.title" :disabled="disabled" />
            </div>
            <div class="form-group">
              <label class="popup-laval required">收票人</label>
              <input class="form-control input-sm" type="text" v-model="applyData.receiverName" :disabled="disabled" />
            </div>
            <div class="form-group">
              <label class="popup-laval">收票手机</label>
              <input class="form-control input-sm" type="text" v-model="applyData.receiverMobile" :disabled="disabled" />
            </div>
            <div class="form-group">
              <label class="popup-laval">收票电话</label>
              <input class="form-control input-sm" type="text" v-model="applyData.receiverPhone" :disabled="disabled" />
            </div>
            <div class="form-group">
              <label class="popup-laval">收票邮编</label>
              <input class="form-control input-sm" type="text" v-model="applyData.receiverZip" :disabled="disabled" />
            </div>
            <div class="form-group">
              <label class="popup-laval">指定快递</label>
              <fuzzy-search id='chooseShipping' placeholder='快递方式模糊搜索' :searchfiled="'shippingName'" :config="{'apiName':'getShipingList'}" @choose="chooseShipping" :disabled="disabled"></fuzzy-search>
            </div>
            <div class="form-group">
              <label class="popup-laval">收票地址</label>
              <address-folder v-if="regionData.province || covertype === 'apply'" show-arr-len="4"  @choose-region="chooseRegion" :selected-province="regionData.province" :selected-city="regionData.city" :selected-district="regionData.region" :selected-street="regionData.street" :disabled="disabled"></address-folder>
              <input style="width:380px;" class="form-control input-sm" type="text" v-model="applyData.receiverAddress" :disabled="disabled" />
            </div>
            <div class="form-group" style="display: block;">
              <label class="popup-laval">备注说明</label>
              <textarea style="width:824px; resize:horizontal;" class="form-control input-sm" v-model="applyData.remark" :disabled="disabled"></textarea>
            </div>
          </div>
          <div class="col col-md-12" v-show="covertype == 'create'">
            <small class="small">寄票信息</small>
          </div>
          <div class="col col-md-12" v-show="covertype == 'create'">
            <div class="form-group">
              <label class="popup-laval required">寄票快递</label>
              <fuzzy-search id='sendShipping' placeholder='快递方式模糊搜索' :searchfiled="'shippingName'" :config="{'apiName':'getShipingList'}" @choose="sendShipping" :disabled="disabled"> </fuzzy-search>
            </div>
            <div class="form-group">
              <label class="popup-laval required">快递单号</label>
              <input class="form-control input-sm" type="text" v-model="applyData.sendLogisticsNumber" />
            </div>
          </div>
        </div>
        <div class="popup-footer">
          <!-- 申请 -->
          <button class="btn btn-sm btn-primary" @click="addSaleInvoice('add', 'addSaleInvoice')" v-if="btnName == '申请'">
            <i class="fa fa-check"></i>保存
          </button>
          <!-- 开票 -->
          <button class="btn btn-sm btn-primary" @click="addSaleInvoice('other', 'saleInvoiceBilling')" v-if="btnName == '开票'">
            <i class="fa fa-check"></i>保存
          </button>
          <!-- 编辑 -->
          <button class="btn btn-sm btn-primary" @click="addSaleInvoice('other', 'saleInvoiceModigyInit')" v-if="btnName == '编辑'">
            <i class="fa fa-check"></i>保存
          </button>
          <!-- 编辑开票 -->
          <button class="btn btn-sm btn-primary" @click="addSaleInvoice('other', 'saleInvoiceModigyInvoiced')" v-if="btnName == '编辑开票'">
            <i class="fa fa-check"></i>保存
          </button>
          <button class="btn btn-sm btn-default" @click="isOpen = false;"><i class="fa fa-reply"></i>取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import initStyle from '../../common/initStyle'
import http from '../../common/http'
import api from '../../common/api'

import dateRangePicker from '../../component/dateRangePicker'
import searchDistributor from '../../component/searchDistributor'
import addressFolder from '../../component/addressFolder'
import fuzzySearch from '../../component/fuzzySearch'
import pagination from '../../component/pagination'
export default {
  components: {
    dateRangePicker,
    searchDistributor,
    addressFolder,
    fuzzySearch,
    pagination
  },
  mounted () {
    this.$nextTick(() => {
      this.getShopList();
      this.getSaleInvoiceList();
    });
  },
  data () {
    return {
      isOpen: false,
      covertype: 'apply',
      disabled: false,
      active: true,
      pageData: {
        totalCount: ''
      },
      regionData: {
        province: '',
        city: '',
        region: '',
        street: '',
      },
      platformOrderIds: '',
      shopList: [],
      directList: [],
      distributeList: [],
      applyData: {
        shopId: '',
        distributorId: '',
        orderId: '',
        orderSn: '',
        omsSendConditionType: '',
        omsCreateTime: '',
        originOrderId: '',
        platformOrderId: '',
        originOrderType: '',
        originSubOrderType: '',
        target: '',
        type: '',
        price: '',
        title: '',
        content: 'GOODS_DETAIL',
        receiverName: '',
        receiverProvince: '',
        receiverCity: '',
        receiverDistrict: '',
        receiverStreet: '',
        receiverAddress: '',
        receiverZip: '',
        receiverMobile: '',
        receiverPhone: '',
        receiverEmail: '',
        nominatedShippingId: '',
        remark: '',
        sendShippingId: '',
        sendLogisticsNumber: ''
      },
      orderDetail: {
        originOrder: {},
        shop: {},
        distributor: {}
      },
      searchData: {
        orderSns: '',
        platformOrderIds: '',
        status: '',
        type: 'COMMON',
        shopId: '',
        distributorId: '',
        omsCreateStartTime: '',
        omsCreateEndTime: '',
        applyInvoiceStartTime: '',
        applyInvoiceEndTime: '',
        orderType: '',
        sendConditionType: '',
        offset: 0,
        length: 10
      },
      OrderSaleInvoiceResult: [],
      orderSaleInvoiceId: '',
      btnName: ''
    }
  },
  filters: {
    statusFilter (val) {
      const typeObj = {
        INIT: '待开票',
        INVOICED: '已开票',
        CANCELLED: '已作废'
      };
      for (let i in typeObj) {
        if (i == val) {
          return typeObj[i];
        }
      }
    },
    typeFilter (val) {
      const typeObj = {
        ADDED: '增票',
        COMMON: '普票',
      };
      for (let i in typeObj) {
        if (i == val) {
          return typeObj[i];
        }
      }
    },
    omsSendConditionTypeFilter (val) {
      const omsSendConditionType = {
        PAID: '款到发货',
        COD_SHIP: '货到快递代收',
        COD: '货到付款'
      };
      for (let i in omsSendConditionType) {
        if (i == val) {
          return omsSendConditionType[i];
        }
      }
    },
    originOrderTypeFilter (val) {
      const orderType = {
        SALE: '销售',
        EXCHANGE: '换货',
        SUPPLY: '补寄'
      };
      for (let i in orderType) {
        if (i == val) {
          return orderType[i];
        }
      }
    },
    orderStatusFilter (val) {
      const orderStatusMapping = {
        'WAIT_CHECK': '待审核',
        'CHECK_PASS': '已审核',
        'REJECT': '已驳回',
        'CLOSE_PLATFORM': '已作废',
        'CLOSED_MANUAL': '已作废',
        'INVALID': '无效',
      };
      for (let i in orderStatusMapping) {
        if (i == val) {
          return orderStatusMapping[i];
        }
      }
    }
  },
  methods: {
    cancel (id) {
      const _self = this;
      layer.confirm('确认要作废此销售发票吗', function(){
        http({
          instance: _self,
          url: api.saleInvoiceCancel,
          type: 'post',
          hasLoading: true,
          data: {
            data: {
              orderSaleInvoiceId: id
            }
          },
          success (res) {
            if (res.success) {
             layer.msg('作废销售发票成功', {time: 2000});
             _self.getSaleInvoiceList();
            }
          }
        });
      }, function(){
        
      });
    },
    applyFun () {
      this.isOpen = true;
      this.covertype = 'apply';
      this.btnName = '申请';
      this.clearData();
    },
    clearData () {
      for (var i in this.applyData) {
        this.applyData[i] = '';
      }
      this.applyData.receiverProvince = {};
      this.applyData.receiverCity = {};
      this.applyData.receiverDistrict = {};
      this.applyData.receiverStreet = {};
      for (var n in this.regionData) {
        this.regionData[n] = '';
      }
      for (var j in this.orderDetail) {
        this.orderDetail[j] = '';
      }
      this.orderDetail.ship = {};
      this.orderDetail.originOrder = {};
      this.orderDetail.distributor = {};
      this.platformOrderIds = '';
    },
    itemFun (msg, type, disabled, btnName) {
      this.isOpen = true;
      this.orderSaleInvoiceId = msg.orderSaleInvoiceId;
      if (type) {
        this.covertype = type;
      } else {
        if (msg.status == 'INIT') {
          this.covertype = 'apply';
        } else if (msg.status == 'INVOICED') {
          this.covertype = 'create';
        }
      }
      this.disabled = disabled;
      this.getOrderDetail(msg.orderSn);
      for (var i in msg) {
        for (var  j in this.applyData) {
          if (i == j) {
            this.applyData[i] = msg[i];
          }
        }
      }
      this.btnName = btnName;
      // 地址
      this.regionData.province = msg.receiverProvince;
      this.regionData.city = msg.receiverCity;
      this.regionData.region = msg.receiverDistrict;
      this.regionData.street = msg.receiverStreet;
      // 指定快递
      if(msg.nominatedShipping != undefined) {
        this.applyData.nominatedShippingId = msg.nominatedShipping.shippingId;

        $('#chooseShipping').val(msg.nominatedShipping.shippingName);
        
      }else {
        this.applyData.nominatedShippingId = '';

        $('#chooseShipping').val('');
        
      }

      if(msg.sendShipping != undefined){
        // 寄票快递
        this.applyData.sendShippingId = msg.sendShipping.shippingId;
        $('#sendShipping').val(msg.sendShipping.shippingName);
      }else {
        // 寄票快递
        this.applyData.sendShippingId = '';
        $('#sendShipping').val('');
      }

    },
    check () {
      var isSave = true;
      var checkObj = [{
        key: 'orderSn',
        name: 'OMS订单'
      }, {
        key: 'type',
        name: '发票类型'
      }, {
        key: 'price',
        name: '开票金额'
      }, {
        key: 'content',
        name: '内容'
      }, {
        key: 'title',
        name: '抬头'
      }, {
        key: 'receiverName',
        name: '收票人'
      }];
      for (var i = 0; i < checkObj.length; i++) {
        if (!this.applyData[checkObj[i].key]) {
          layer.msg('请填写'+checkObj[i].name, {time: 2000});
          isSave = false;
          return;
        }
      }
      return isSave;
    },
    addSaleInvoice (type, apiName) {
      const _self = this;
      if (_self.check()) {
        if (type == 'add') {
          delete _self.applyData.orderSaleInvoiceId
          http({
            instance: _self,
            url: api[apiName],
            type: 'post',
            hasLoading: true,
            data: {
              data: _self.applyData
            },
            success (res) {
              if (res.success) {
                layer.msg('申请销售发票成功', {time: 2000});
                _self.isOpen = false;
                _self.getSaleInvoiceList();
              }
            }
          });
        } else {
          let isSave = true;
          if (apiName == 'saleInvoiceBilling') {
            if (!_self.applyData.sendShippingId) {
              layer.msg('请填写寄票快递', {time: 2000});
              isSave = false;
              return;
            } else if (!_self.applyData.sendLogisticsNumber) {
              layer.msg('请填写快递单号', {time: 2000});
              isSave = false;
              return; 
            }
          }
          if (isSave) {
            _self.$set(_self.applyData, 'orderSaleInvoiceId', _self.orderSaleInvoiceId);
            http({
              instance: _self,
              url: api[apiName],
              type: 'post',
              hasLoading: true,
              data: {
                data: _self.applyData
              },
              success (res) {
                if (res.success) {
                  // layer.msg('申请销售发票成功', {time: 2000});
                  _self.isOpen = false;
                  _self.getSaleInvoiceList();
                }
              }
            });
          }
        }
      }
    },
    getShopList () {
      const _self = this;
      http({
        instance: _self,
        url: api.getShopList,
        type: 'post',
        hasLoading: true,
        data: {
          data: {}
        },
        success (res) {
          if (res.success) {
            _self.shopList = res.data;
          }
        }
      });
    },
    getSaleInvoiceLists() {
      this.searchData.offset = 0;
      this.getSaleInvoiceList();
    },
    getSaleInvoiceList () {
      const _self = this;
      http({
        instance: _self,
        url: api.getSaleInvoiceList,
        type: 'post',
        hasLoading: true,
        data: {
          data: _self.searchData
        },
        success (res) {
          _self.directList = [];
          _self.distributeList = [];
          if (res.success) {
            _self.OrderSaleInvoiceResult = res.data.content;
            _self.pageData.totalCount = res.data.totalCount;
            for (var i = 0, len = _self.OrderSaleInvoiceResult.length; i < len; i++) {
              if (_self.OrderSaleInvoiceResult[i].target == 'DIRECT') {
                _self.directList.push(_self.OrderSaleInvoiceResult[i]);
              } else if (_self.OrderSaleInvoiceResult[i].target == 'DISTRIBUTE') {
                _self.distributeList.push(_self.OrderSaleInvoiceResult[i]);
              }
            }
          }
        }
      });
    },
    removeRepea (ar) {
      var tmp = {},
          ret = [];
      for (var i = 0, j = ar.length; i < j; i++) {
        if (!tmp[ar[i]]) {
          tmp[ar[i]] = 1;
          ret.push(ar[i]);
        }
      }
      return ret;
    },
    getOrderDetail (orderSn) {
      const _self = this;
      http({
        instance: _self,
        url: api.getOrderDetailOrderSn,
        type: 'post',
        hasLoading: true,
        data: {
          data: {
            orderSn: orderSn  //201702210259010334684
          }
        },
        success (res) {
          if (res.success) {
            _self.orderDetail = res.data;
            for (var i = 0, len = _self.orderDetail.orderGoodses.length; i < len; i++) {
              if (_self.orderDetail.orderGoodses[i].originOrder.platformOrderId) {
                _self.platformOrderIds += _self.orderDetail.orderGoodses[i].originOrder.platformOrderId + ',';
              }
            }
            let platformOrderIdsArr = _self.platformOrderIds.split(',');
            platformOrderIdsArr.length = platformOrderIdsArr.length - 1;
            _self.platformOrderIds = _self.removeRepea(platformOrderIdsArr).join(',');
            _self.applyData.shopId = _self.orderDetail.shop.shopId;
            if (_self.orderDetail.distributor) {
              _self.applyData.distributorId = _self.orderDetail.distributor.distributorId;
            }
            _self.applyData.orderId = _self.orderDetail.orderId;
            _self.applyData.orderSn = _self.orderDetail.orderSn;
            _self.applyData.omsSendConditionType = _self.orderDetail.sendConditionType;
            _self.applyData.omsCreateTime = _self.orderDetail.createTime;
            _self.applyData.originOrderType = _self.orderDetail.originOrder.orderType;
            _self.applyData.originSubOrderType = _self.orderDetail.originOrder.subOrderType;
            _self.applyData.receiverEmail = _self.orderDetail.receiverEmail;
            _self.applyData.receiverName = _self.orderDetail.receiverName;
            _self.applyData.receiverMobile = _self.orderDetail.receiverMobile;
            _self.applyData.receiverPhone = _self.orderDetail.receiverPhone;
            _self.regionData.province = _self.orderDetail.receiverProvince;
            _self.regionData.city = _self.orderDetail.receiverCity;
            _self.regionData.region = _self.orderDetail.receiverDistrict;
            _self.regionData.street = _self.orderDetail.receiverStreet;
            if (_self.orderDetail.receiverProvince) {
              _self.applyData.receiverProvince = _self.orderDetail.receiverProvince.regionId;
            }
            if (_self.orderDetail.receiverCity) {
              _self.applyData.receiverCity =  _self.orderDetail.receiverCity.regionId;
            }
            if (_self.orderDetail.receiverDistrict) {
              _self.applyData.receiverDistrict = _self.orderDetail.receiverDistrict.regionId;
            }
            if (_self.orderDetail.receiverStreet) {
              _self.applyData.receiverStreet = _self.orderDetail.receiverStreet.regionId;
            }
            _self.applyData.receiverAddress = _self.orderDetail.receiverAddress;
            _self.applyData.receiverZip = _self.orderDetail.receiverZip;
          }
        }
      });
    },
    chooseRegion (val) {
      const _self = this;
      _self.applyData.receiverProvince = val.province.regionId;
      _self.applyData.receiverCity = val.city.regionId;
      _self.applyData.receiverDistrict = val.region.regionId;
      _self.applyData.receiverStreet = val.street.regionId;
    },
    orderTime (time) {
      this.searchData.omsCreateStartTime = time.start_time;
      this.searchData.omsCreateEndTime = time.end_time;
    },
    applyInvoiceTime (time) {
      this.searchData.applyInvoiceStartTime = time.start_time;
      this.searchData.applyInvoiceEndTime = time.end_time;
    },
    searchDistributor (data) {
      if (!$.isEmptyObject(data)) {
        this.searchData.distributorId = data.data.distributorId;
      } else {
        this.searchData.distributorId = '';
      }
    },
    chooseShipping(res){   //选择了快递方式
      if(res){
        this.applyData.nominatedShippingId = res.shippingId;
      }else{
        this.applyData.nominatedShippingId = '';
      }
    },
    sendShipping(res){   //寄票快递
      if(res){
        this.applyData.sendShippingId = res.shippingId;
      }else{
        this.applyData.sendShippingId = '';
      }
    },
    paginate (data) {
      this.searchData.offset = data.offset;
      this.searchData.length = data.length;
      this.getSaleInvoiceList();
    }
  }
}
</script>

<style scoped lang="sass">
.col-md-3 {
  padding: 0;
}
.miniBtn {
  display: block;
  padding: 2px 3px;
  margin: 2px auto;
}
.content_yjlu table tr td,  .content_yjlu table tr th{
  padding: 2px;
}
#navTab {
  border-bottom: 1px solid #6799FF;
  width: 350px;
  .tabItem {
    position: relative;
    top: 1px;
    display: inline-block;
    color: #333;
    padding: 10px 20px;
    background: #fff;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    cursor: pointer;
  }
  .active {
    border-left: 1px solid #6799FF;
    border-top: 1px solid #6799FF;
    border-right: 1px solid #6799FF;
    border-bottom: 1px solid #fff;
  }
}
.popup-saleInvoice {
  .orderDetail {
    width: 270px;
  }
  .popup-content {
    width: 970px;
    margin-left: -485px;
  }
  .popup-laval {
    width: 6em;
    text-align: right;
  }
  small {
    display: inline-block;
    position: relative;
    font-size: 14px;
    font-weight: bold;
  }
  small:before {
    position: absolute;
    top: 3px;
    left: -10px;
    display: inline-block;
    content: '';
    width: 3px;
    height: 14px;
    background: #0081c2;
  }
  .small {
    margin-top: 10px;
    margin-bottom: 5px;
  }
  .form-group {
    display: inline-block;
  }
  .load {
    font-size: 18px;
    color: #0099FF;
    margin-left: 5px;
    cursor: pointer;
  }
}
</style>