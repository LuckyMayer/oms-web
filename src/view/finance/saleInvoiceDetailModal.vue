<template>
  <div>
    <component is="overlay" v-if="showOverlay" :on-click="cancelInvoice"></component>
    <!-- <div class="popup-saleInvoice"> -->
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
              <address-folder v-if="regionData.province" show-arr-len="4" @choose-region="chooseRegion" :selected-province="regionData.province" :selected-city="regionData.city" :selected-district="regionData.region" :selected-street="regionData.street" :disabled="disabled"></address-folder>
              <input style="width:380px;" class="form-control input-sm" type="text" v-model="applyData.receiverAddress" :disabled="disabled" />
            </div>
            <div class="form-group" style="display: block;">
              <label class="popup-laval">备注说明</label>
              <textarea style="width:822px; resize:horizontal;" class="form-control input-sm" v-model="applyData.remark" :disabled="disabled"></textarea>
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
          <button class="btn btn-sm btn-default" @click="cancelInvoice"><i class="fa fa-reply"></i>取消</button>
        </div>
      </div>
    <!-- </div> -->
  </div>
  
</template>

<script>
import initStyle from '../../common/initStyle'
import http from '../../common/http'
import api from '../../common/api'
import overlay from '../../component/overlay'
import addressFolder from '../../component/addressFolder'
import fuzzySearch from '../../component/fuzzySearch'

export default{
  props: {
    'orderSn': {
      type: String,
      default: '',
    },
    showOverlay: {
      type: Boolean,
      default: true
    },
    btnName: {
      type: String,
      default: '申请',
    }
  },
  mounted() {
    this.getOrderDetail(this.orderSn);
  },
  components: {overlay,addressFolder,fuzzySearch},
  data() {
    return {
      covertype: 'apply',
      disabled: false,
      platformOrderIds: '',
      regionData: {},
      orderDetail: {
        originOrder: {},
        shop: {},
        distributor: {}
      },
      regionData: {
        province: '',
        city: '',
        region: '',
        street: '',
      },
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
    }
  },
  filters: {
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
    },
  },
  methods: {
    cancelInvoice () {
      this.$emit('cancel', false);
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
                _self.$emit('cancel', false);
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
                  _self.$emit('cancel', false);
                }
              }
            });
          }
        }
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
  }

}
</script>

<style scoped lang="sass">
.popup-content {
  position: fixed;
  left: 0;
  right: 0;
  top: 0; 
  background-color: #fff;
  margin: 60px auto;
  float: none;
  opacity: 1;
  min-height: 460px;
  max-height: 90%;
  z-index: 1002;
  width: 970px;
  border-radius: 5px;
  font-size: 14px;
  line-height: 1.42857143;
  color: #333;

  .popup-title {
    text-align: left;
    border-bottom: 1px solid #d2d6de;
    padding: 10px;
    font-size: 16px;
    margin-bottom: 0;
  }

  .popup-main {
    overflow: hidden;
    padding: 10px;
    height: 400px;
    overflow-y: scroll;
  }
  .form-control {
    width: 200px;
  }
  .orderDetail {
    width: 270px;
  }
  .popup-content {
    width: 970px;
    margin-left: -485px;
    z-index:10000;
    position: absolute;
    top: 100px;
    left: 50%;
    min-height: 460px;
    background-color: #fff;
    border-radius: 5px;
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
    margin-right: 20px;
    margin-bottom: 10px;

  }
  .load {
    font-size: 18px;
    color: #0099FF;
    margin-left: 5px;
    cursor: pointer;
  }

  .form-control {
    display: inline-block;
    vertical-align: middle;
  }

  .required:after {
    content: '*';
    color: #f00;
    margin: 0 0 0 3px;
  }
.popup-footer {
    width: 100%;
    text-align: right;
    padding: 10px;
    border-top: 1px solid #d2d6de;
  }
  .col {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}
</style>