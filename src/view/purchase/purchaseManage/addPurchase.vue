<template>
  <div class="content-wrapper">
    <section class="content-header">
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-desktop"></i>采购</a></li>
        <li>采购订单</li>
        <li class="active">新建采购订单</li>
      </ol>
    </section>

    <section class="content addPurchase content_yjlu">
      <div class="row form-horizontal searchContent">
        <div class="form-group">
          <div class="col-md-4">
            <label class="col-sm-4 control-label required">供应商</label>
            <div class="col-sm-8">
              <fuzzy-search id="chooseSearchProvider" :placeholder="'供应商模糊搜索'"  searchfiled="providerName"  :listarray="['providerName']" :config="{'apiName':'getProviderTableList','needKey':true,'fixWidth':false,'keyPath':'data.provider.providerName','resultPath':'data.content'}" :parameter="selectProvider" @choose="chooseSearchProvider"> </fuzzy-search>
            </div>
          </div>
          <div class="col-md-4">
            <label class="col-sm-4 control-label">供应商出库单号</label>
            <div class="col-sm-8">
              <input class="form-control input-sm" type="text" v-model="addData.providerOrderOutSn" />
            </div>
          </div>
          <div class="col-md-4">
            <label class="col-sm-4 control-label">供应商采购单号</label>
            <div class="col-sm-8">
              <input class="form-control input-sm" type="text" v-model="addData.providerOrderPurchaseSn" />
            </div>
          </div>
        </div>
        <div class="form-group">
          <div class="col-md-4">
            <label class="col-sm-4 control-label required">渠道类型</label>
            <div class="col-sm-8">
              <select class="form-control select-sm" v-model="addData.channelType">
                <option value="DOMESTIC_FLAGSHIP">国内旗舰店</option>
                <option value="OVERSEAS_FLAGSHIP">跨境旗舰店</option>
                <option value="TMALL_SUPERMARKET">猫超</option>
                <option value="DISTRIBUTOR">分销</option>
                <option value="EKA">EKA</option>
              </select>
            </div>
          </div>
          <div class="col-md-4">
            <label class="col-sm-6 control-label required">设定默认票扣比例</label>
            <div class="col-sm-6">
              <input class="form-control input-sm" type="text" v-model="defaultReducePrice" @keyup="getDefaultReducePrice" />
              <span class="unitIcon">%</span>
            </div>
          </div>
          <div class="col-md-4">
            <label class="col-sm-6 control-label textAlignLeft"><a href="#">采购商品明细模板</a></label>
            <div class="col-sm-6 textAlignRight">
              <button class="btn btn-default btn-sm"><i class="fa fa-download"></i>批量导入商品</button>
            </div>
          </div>
        </div>
      </div>
      <div class="box box-default">
        <div class="box-body">
          <div class="form-horizontal tableContent">
            <table class="table table-hover table-condensed myTable">
              <thead>
                <tr>
                  <th>商品名称/规格码</th>
                  <th>数量</th>
                  <th>箱规</th>
                  <th>箱数</th>
                  <th>特殊进价</th>
                  <th>采购单价</th>
                  <th>使用票扣</th>
                  <th>税率</th>
                  <th>采购金额</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in addData.OrderPurchaseDetails" ref="tr">
                  <td>
                    <search-sku :id="'searchGoods_'+i" ref="searchGoods" @selected="selectGoods" :placeholder="'sku模糊搜索'"></search-sku>
                    <!-- <search-goods-name :id="'searchGoods_'+i" ref="searchGoods" @selected="selectGoods"></search-goods-name> -->
                    <!-- {{item.surplusData.goodsName}} -->
                  </td>
                  <td>
                    <input class="form-control input-sm" type="number" v-model="item.purchaseNumber" />
                  </td>
                  <td>{{item.surplusData.boxVolume}}</td>
                  <td>{{item.surplusData.boxVolume ? item.purchaseNumber / item.surplusData.boxVolume : ''}}</td>
                  <td>{{item.surplusData.checkedSpecialPrice}}
                    <!-- <input class="form-control input-sm" type="text" v-model="item.surplusData.checkedSpecialPrice" v-if="!item.surplusData.checkedSpecialPrice"> -->
                  </td>
                  <td><input class="form-control input-sm" type="number" v-model="item.unitPrice" @keyup="getReducePrice(i)" /></td>
                  <td><input class="form-control input-sm" type="text" v-model="item.reducePrice" /></td>
                  <td>{{item.surplusData.taxRate}}</td>
                  <td>{{item.unitPrice * item.purchaseNumber - item.reducePrice}}</td>
                  <td>
                    <span class="addBtn" @click="addFun(i)" v-if="item.state == 'add'">添加</span>
                    <i class="iconfont iconfontEdit" @click="editFun(i)"  v-if="item.state == 'edit'">&#xe622;</i>
                    <div v-if="item.state == 'save'">
                      <i class="iconfont iconfontYes" @click="yesFun(i)">&#xe600;</i>
                      <i class="iconfont iconfontNo" @click="noFun(i)">&#xe686;</i>
                    </div>
                    <i class="iconfont iconfontDelete" v-if="item.state != 'add'" @click="deleteFun(i)">&#xe613;</i>
                  </td>
                </tr>
                <tr ref="addTr" id="test"><td colspan="10"></td></tr>
                <tr>
                  <td colspan="10">
                    <label class="purchaseSmallTitle">小计</label>
                    <div class="tdItem">
                      采购数量：<span>{{addData.purchaseTotalNumber}}</span>
                    </div>
                    <div class="tdItem">
                      币种：
                      <select class="tableIpt" v-model="addData.currency">
                        <option value="RMB">人民币</option>
                      </select>
                    </div>
                    <div class="tdItem">
                      采购金额：<span>{{addData.purchaseTotalPrice}}</span>
                    </div>
                    <div class="tdItem">
                      使用票扣总额：<span>{{addData.reduceTotalPrice}}</span>
                    </div>
                    <div class="tdItem">
                      使用返利：
                      <input class="tableIpt" type="text" v-model="addData.rebateTotalPrice" @keyup="rebateTotalPriceFun" ref="rebateTotalPrice" />
                    </div>
                    <div class="tdItem">
                      应付金额：<span>{{addData.purchaseTotalPrice - addData.rebateTotalPrice}}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="10">
                    <div class="col-md-4">
                      <label class="purchaseSmallTitle required">收货仓</label>
                      <search-warehouse id="searchWarehouse" placeholder="仓库搜索" @selected="selectedWarehouse"></search-warehouse>
                    </div>
                    <div class="col-md-4">
                      <label class="purchaseSmallTitle required">预计到货时间</label>
                      <div class="expectedTimeOfArrival">
                        <date-picker id="expectedTimeOfArrival" @choose="expectedTimeOfArrival"></date-picker>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="10">
                    <div class="col-sm-6">
                      <label class="col-sm-2 purchaseSmallTitle">内部留言</label>
                      <div class="col-sm-8">
                        <textarea class="form-control" v-model="addData.innerNote"></textarea>
                      </div>
                    </div>
                    <div class="col-sm-6">
                      <label class="col-sm-2 purchaseSmallTitle">仓库留言</label>
                      <div class="col-sm-8">
                        <textarea class="form-control" v-model="addData.warehouseNote"></textarea>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="row form-horizontal">
              <div class="col-sm-12 textAlignRight">
                <button class="btn btn-primary btn-sm" @click="addPurchase">生成采购单</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import initStyle from '../../../common/initStyle'
import http from '../../../common/http'
import api from '../../../common/api'
import deepClone from '../../../common/deepClone'

// import searchGoodsName from '../../../component/searchGoodsName'
import searchSku from '../../../component/searchSku'
import fuzzySearch from '../../../component/fuzzySearch'
import datePicker from '../../../component/datePicker'
import searchWarehouse from '../../../component/searchWarehouse'
export default {
  components: {
    searchSku,
    fuzzySearch,
    datePicker,
    searchWarehouse
  },
  data () {
    return {
      defaultReducePrice: 100,
      addData: {
        orderPurchaseId: '',
        partyId: '',
        orderId: '',
        providerId: '',
        warehouseId: '',
        providerPartyMappingId: '',  // 供应商在业务组下的返利和票扣余额映射
        orderSn: '',
        providerOrderPurchaseSn: '',
        providerOrderOutSn: '',
        channelType: 'DOMESTIC_FLAGSHIP',
        payTotalPrice: '',
        reduceTotalPrice: 0,
        rebateTotalPrice: '',
        purchaseTotalPrice: 0,
        currency: 'RMB',
        purchaseTotalNumber: 0,
        expectArrivalTime: '',
        status: '',
        applyNumber: '',
        actualInNumber: '',
        availableInNumber: '',
        usedInNumber: '',
        defectiveInNumber: '',
        innerNote: '',
        warehouseNote: '',
        OrderPurchaseDetails: []
      },
      surplusData: {},
      addTr: {
        surplusData: {},
        state: 'add',
        orderPurchaseDetailId: '',
        orderPurchaseId: '',
        partyId: '',
        orderId: '',
        orderGoodsId: '',
        skuId: '',
        providerSpecialPriceId: '',
        orderSn: '',
        reducePrice: '',
        purchaseNumber: '',
        unitPrice: '',
        purchasePrice: '',
        applyNumber: '',
        actualInNumber: '',
        availableInNumber: '',
        usedInNumber: '',
        defectiveInNumber: '',
        returnNumber: '',
        arrivalInvoiceNumber: '',
        nonArrivalInvoiceNumber: '',
      },
      addTrIndex: 0,
      selectProvider:{    //模糊查询参数
        data:{
          provider:{
            providerName:'',  //供应商名称
          },
          offset: 0,
          length: 10,
        }
      },
      ProviderPartyMappingResult: {
        rebateBalance: '',
        reduceBalance: ''
      },
      logTr: {}
    }
  },
  mounted () {
    this.$nextTick(() => {
      initStyle();
    });
  },
  created () {
    const _self = this;
    _self.addData.OrderPurchaseDetails.push(deepClone(_self.addTr));
  },
  methods: {
    rebateTotalPriceFun () {
      if (Number(this.addData.rebateTotalPrice) > Number(this.ProviderPartyMappingResult.rebateBalance)) {
        layer.msg('使用返利已超额', {time: 2000});
        this.addData.rebateTotalPrice = '';
      }
    },
    getBalance (providerId) {
      const _self = this;
      http({
        instance: _self,
        url: api.getBalance,
        type: 'post',
        data: {
          data: {
            partyId: '',
            providerId: providerId
          }
        },
        success (res) {
          if (res.data) {
            _self.ProviderPartyMappingResult.rebateBalance = res.data.rebateBalance;
            _self.ProviderPartyMappingResult.reduceBalance = res.data.reduceBalance;
            _self.addData.providerPartyMappingId = res.data.providerPartyMappingId;
          } else {
            layer.msg('该供应商在某业务组下,没有返利余额和票扣余额', {time: 2000});
          }
        }
      });
    },
    getDefaultReducePrice () {
      const _self = this;
      _self.addData.OrderPurchaseDetails.forEach(function (item, index) {
        _self.addData.OrderPurchaseDetails[index].reducePrice = _self.ForDight(Number(_self.addData.OrderPurchaseDetails[index].unitPrice) * Number(_self.addData.OrderPurchaseDetails[index].purchaseNumber) * (1 - Number(_self.defaultReducePrice) / 100), 2);
      });
    },
    getReducePrice (i) {
      const _self = this;
      if (Number(_self.addData.OrderPurchaseDetails[i].unitPrice).toString().split('.').length > 1) {
        if (Number(_self.addData.OrderPurchaseDetails[i].unitPrice).toString().split('.')[1].length > 2) {
          layer.msg('只能精确到两位小数', {time: 2000});
          _self.addData.OrderPurchaseDetails[i].unitPrice = _self.ForDight(_self.addData.OrderPurchaseDetails[i].unitPrice, 2);
          return false;
        }
      } else {
        _self.addData.OrderPurchaseDetails[i].reducePrice = _self.ForDight(Number(_self.addData.OrderPurchaseDetails[i].unitPrice) * Number(_self.addData.OrderPurchaseDetails[i].purchaseNumber) * (1 - Number(_self.defaultReducePrice) / 100), 2);
      }
    },
    ForDight (Dight, How){
      var Dight = Math.round (Dight*Math.pow(10,How))/Math.pow(10,How); 
      return Dight; 
    },
    deleteFun (i) {
      this.addData.OrderPurchaseDetails.splice(i, 1);
      $(this.$refs.tr).eq(i).find('input').attr('disabled', false);
      this.$refs.searchGoods[this.addTrIndex].key = '';
      console.log(deepClone(this.addData.OrderPurchaseDetails));
      this.fetchTableSum(i);
      console.log('i:' + i, this.addTrIndex);
      this.addTrIndex --;
    },
    noFun (i) {
      this.addData.OrderPurchaseDetails.splice(this.addTrIndex, 1, this.logTr);
      $(this.$refs.tr).eq(i).find('input').attr('disabled', true);
      this.addData.OrderPurchaseDetails[i].state = 'edit';
    },
    yesFun (i) {
      $(this.$refs.tr).eq(i).find('input').attr('disabled', true);
      this.addData.OrderPurchaseDetails[i].state = 'edit';
    },
    editFun (i) {
      $(this.$refs.tr).eq(i).find('input').attr('disabled', false);
      this.addData.OrderPurchaseDetails[i].state = 'save';
      this.logTr = deepClone(this.addData.OrderPurchaseDetails[this.addTrIndex]);
    },
    fetchTableSum (i) {
      const _self = this;
      _self.addData.purchaseTotalNumber = 0;
      _self.addData.purchaseTotalPrice = 0;
      _self.addData.reduceTotalPrice = 0;
      deepClone(_self.addData.OrderPurchaseDetails).forEach(function (item, i) {
        _self.addData.purchaseTotalNumber += Number(item.purchaseNumber);
        _self.addData.purchaseTotalPrice += Number(item.unitPrice * item.purchaseNumber - item.reducePrice);
        _self.addData.reduceTotalPrice += Number(item.reducePrice);
      });
    },
    addFun (i) {
      const _self = this;
      if (_self.addData.OrderPurchaseDetails[_self.addTrIndex].skuId && _self.addData.OrderPurchaseDetails[i].purchaseNumber) {
        _self.fetchTableSum(i);
        if (Number(_self.addData.reduceTotalPrice) > Number(_self.ProviderPartyMappingResult.reduceBalance)) {
          layer.msg('使用票扣总额已超额', {time: 2000});
        } else {  // 添加一行
          _self.addData.OrderPurchaseDetails.push(deepClone(_self.addTr));
          _self.addData.OrderPurchaseDetails[i].state = 'edit';
          $(_self.$refs.tr).eq(i).find('input').attr('disabled', true);
        }
        _self.addData.OrderPurchaseDetails[i].surplusData = _self.surplusData;
        _self.addTrIndex = i+1;
      } else {
        layer.msg('商品名称、数量不能为空', {time: 2000});
      }
    },
    addCheck () {
      let isAdd = true;
      if (this.addData.OrderPurchaseDetails[0].state !== 'edit') {
        isAdd = false;
        layer.msg('请添加商品', {time: 2000});
      } else if (this.addData.warehouseId == '') {
        isAdd = false;
        layer.msg('请添加收货仓', {time: 2000});
      }  else if (this.addData.expectArrivalTime == '') {
        isAdd = false;
        layer.msg('预计到货时间', {time: 2000});
      }
      return isAdd;
    },
    addPurchase () {
      const _self = this;
      let addData = deepClone(_self.addData);
      addData.OrderPurchaseDetails.pop();
      if (_self.addCheck()) {
        http({
          instance: _self,
          url: api.purchaseAdd,
          type: 'post',
          data: {
            data: addData
          },
          success (res) {
            console.log(res);
            layer.msg('新建成功，订单号：'+res.data.orderSn, {time: 2000}, function(){
                _self.$router.push({name: 'purchaseList'});
            });
          }
        });
      }
    },
    selectGoods (data) {
      const _self = this;
      console.log(data);
      if (data.skuId) {
        _self.addData.OrderPurchaseDetails[_self.addTrIndex].skuId = data.skuId;
        // 通过sku中的goodsId查goods中的taxRate
        http({
          instance: _self,
          url: api.getGoodsDetail,
          type: 'post',
          data: {
            data: {
              goodsId: data.goods.id
            }
          },
          success (res) {
            if (res.data) {
              _self.$set(_self.addData.OrderPurchaseDetails[_self.addTrIndex].surplusData, 'taxRate', res.data.taxRate);
            }
          }
        });
        _self.$set(_self.surplusData, 'goodsName', data.goodsName);
        _self.$set(_self.addData.OrderPurchaseDetails[_self.addTrIndex].surplusData, 'boxVolume', data.boxVolume);
        http({
          instance: _self,
          url: api.getProviderSpecialPriceList,
          type: 'post',
          data: {
            data: {
              providerSpecialPrice: {
                providerId: _self.addData.providerId,
                skuId: _self.addData.OrderPurchaseDetails[_self.addTrIndex].skuId
              },
              offset: 0,
              length: 999
            }
          },
          success (res) {
            if (res.data.content.length) {
                _self.$set(_self.addData.OrderPurchaseDetails[_self.addTrIndex].surplusData, 'checkedSpecialPrice', res.data.content[0].checkedSpecialPrice);
            }
          }
        });
      } else {
        this.addData.OrderPurchaseDetails[_self.addTrIndex].skuId = '';
      }
    },
    chooseSearchProvider(res){
      const _self = this;
      if(res){
        _self.addData.providerId = res.providerId;
        _self.$set(_self.addData.OrderPurchaseDetails[_self.addTrIndex].surplusData, 'specialSupply', res.specialSupply);
        _self.getBalance(_self.addData.providerId);
      } else{
        _self.addData.providerId = '';
      }
    },
    selectedWarehouse (data) {
      if (data.warehouseId) {
        this.addData.warehouseId = data.warehouseId;
      } else {
        this.addData.warehouseId = '';
      }
    },
    expectedTimeOfArrival (time) {
      this.addData.expectArrivalTime = time.data;
    },
  }
}
</script>

<style lang="sass">
.addPurchase {
  #searchWarehouse {
    display: inline-block;
    width: 215px;
  }
  .purchaseSmallTitle {
    display: inline-block;
    margin: 0 20px;
    color: #333;
  }
  .tableIpt {
    width: initial;
    border: 1px solid #d2d6de;
    padding: 3px;
    vertical-align: middle;
  }
  .tdItem {
    display: inline-block;
    margin: 0 10px;
  }
  .addBtn {
    color: #3399FF;
    cursor: pointer;
  }
  .expectedTimeOfArrival {
    display: inline-block;
    width: initial;
  }
}
</style>


<!-- 备注 -->
<!-- 1、仓库类型（根据渠道类型锁定仓库类型选项）
2、收货仓（在指定的仓库类型下进行选择） -->