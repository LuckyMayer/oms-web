<template>
  <div class="content-wrapper">
    <section class="content-header">
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-desktop"></i>库存管理</a></li>
        <li class="active">库存查询</li>
      </ol>
    </section>

    <!-- Main content -->
    <section class="content purchaseDetail content_yjlu">
      <div class="row form-horizontal searchContent bgFFF" style="padding-right:20px">
        <div class="col-md-4" style="margin-left:-70px">
          <div class="form-group">
            <label class="control-label col-sm-6">商品分类</label>
            <div class="col-sm-6">
              <search-custom-category @selected="searchCustomCategory"></search-custom-category>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-6">商品名称</label>
            <div class="col-sm-6">
              <!-- <search-goods-name :id="'searchGoods'" ref="searchGoods" @selected="selectGoods"></search-goods-name> -->
              <fuzzy-search ref="childAddGoods" id='chooseSearchGoods' placeholder='商品名称模糊搜索' :searchfiled="'skuName'" :config="{'apiName':'searchSkuNameList','resultPath':'data.content'}" @choose="chooseSearchGoods" > </fuzzy-search>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-6">库存状态</label>
            <div class="col-sm-6">
              <select class="form-control" v-model="searchData.statusId">
                <option v-for="(item,index) in statusIdArray" :value="index">{{item}}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="col-md-4">
           <div class="form-group">
            <label class="control-label col-sm-6">品牌</label>
            <div class="col-sm-6">
              <select-goods-brand @selected="selectGoodsBrand"></select-goods-brand>
            </div>
          </div>
            <div class="form-group">
              <label class="control-label col-sm-6">商家编码/商品条码</label>
              <div class="col-sm-6">
                <search-sku-name ref="childSearchSku" @choose="chooseSkuName" @change="clearSkuMessage"></search-sku-name>
              </div>
            </div>
          <div class="form-group">
            <label class="control-label col-sm-6">数量区分</label>
            <div class="col-sm-6">
              <select class="form-control" v-model="searchData.quantityStatus">
                <option v-for="(item,index) in quantityStatusArray" :value="index">{{item}}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="form-group">
            <label class="col-sm-6 control-label">仓库类型</label>
            <div class="col-sm-6">
              <multiple-select-list id='selectIds' placeholder='请选择仓库类型' :listarray="warehouseTypes" @choose="getSelectedWareHouseIds"> </multiple-select-list>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-6 control-label">仓库名称</label>
            <div class="col-sm-6">
              <fuzzy-search id='chooseWarehouse' placeholder='出货仓模糊搜索' :searchfiled="'warehouseName'" :config="{'apiName':'getWarehouseNameList'}" @choose="chooseWarehouse"> </fuzzy-search>
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-4"></div><div class="col-sm-3">
            <button class="btn btn-sm btn-primary" :disabled="disabledSearch" @click="getTableList"><i class="fa fa-search"></i>查询</button>
            </div><div class="col-sm-3">
            <button class="btn btn-sm btn-default" @click="exportExcel"><i class="fa fa-download"></i>导出</button></div>
          </div>
        </div>
        <div>
      </div>
     </div>
    </section> 
    <section class="content purchaseDetail content_yjlu" style="margin-top:-112px">

    <div v-show="showCopyHead" id="copyTableHead" class="copyHead"></div>
      <div class="box-body table-responsive" style="overflow:auto;margin-bottom:30px:">
        <table class="table" id="myTable" style="background:#FFFFFF;">
          <thead id="myTableHead">
            <tr>
                <th colspan="3">商品信息</th>
                <th colspan="3">小计</th>
                <th colspan="2">仓库</th>
                <th colspan="2">库存实况</th>
                <th>锁定</th>
                <th colspan="3">销售单占用</th>
                <th colspan="2">非销售单占用</th>
                <th colspan="2">库存调整占用</th>
                <th colspan="3">待入库（不占用）</th>
            </tr>
            <tr>
                <th>商品名称</th>
                <th>商品条码</th>
                <th>商家编码</th>
                <th>库存状态</th>
                <th>系统库存</th>
                <th>可用库存</th>
                <th>仓库</th>
                <th>库存状态</th>
                <th>系统库存</th>
                <th>可用库存</th>
                <th>锁定库存</th>
                <th>待审核</th>
                <th>已审核</th>
                <th>已推送</th>
                <th>供应商待退货</th>
                <th>调拨待出库</th>
                <th>盘亏预定</th>
                <th>冻结预定</th>
                <th>采购待入库</th>
                <th>采购今明到货</th>
                <th>调拨待入库</th>
            </tr>
          </thead>
          <tbody v-for="(trItem, index) in tableList">
            <tr>
              <td class="wordBreak" style="vertical-align:text-top;" :rowspan="trItem.inventoryWarehouseStatistics.length">
              {{trItem.sku.skuName}}</td>
              <td class="wordBreak" style="vertical-align:text-top;" :rowspan="trItem.inventoryWarehouseStatistics.length">
              {{trItem.sku.barcode}}</td>
              <td class="wordBreak" style="vertical-align:text-top;" :rowspan="trItem.inventoryWarehouseStatistics.length">{{trItem.sku.skuCode}}</td>
              <td>{{statusIdArray[trItem.inventorySkuStatistics[0].statusId]}}</td>
              <td>{{trItem.inventorySkuStatistics[0].systemInventoryNumber}}</td>
              <td>{{trItem.inventorySkuStatistics[0].availableInventoryNumber}}</td>
              <td class="wordBreak">
              {{trItem.inventoryWarehouseStatistics[0].warehouseName}}
              </td><!-- 仓库 -->
              <td>{{statusIdArray[trItem.inventoryWarehouseStatistics[0].statusId]}}</td><!-- 库存状态 -->
              <td>{{trItem.inventoryWarehouseStatistics[0].systemInventoryNumber}}</td><!-- 系统库存 -->
              <td>{{trItem.inventoryWarehouseStatistics[0].availableInventoryNumber}}</td><!-- 可用库存 -->
              <td>{{trItem.inventoryWarehouseStatistics[0].lockInventoryNumber}}</td><!--锁定库存 -->
              <td>
                <a v-if="trItem.inventoryWarehouseStatistics[0].saleCheckWaitWaitOutInventoryNumber!=''" @click="setShowDetailTable('saleCheckWaitWaitOutOrders',index,0)">{{trItem.inventoryWarehouseStatistics[0].saleCheckWaitWaitOutInventoryNumber}}</a>
                  <font v-else>{{trItem.inventoryWarehouseStatistics[0].saleCheckWaitWaitOutInventoryNumber}}</font>
              </td><!--待审核 -->
              <td>
                <a v-if="trItem.inventoryWarehouseStatistics[0].saleCheckPassWaitOutInventoryNumber!=''" @click="setShowDetailTable('saleCheckPassWaitOutOrders',index,0)">{{trItem.inventoryWarehouseStatistics[0].saleCheckPassWaitOutInventoryNumber}}</a>
                  <font v-else>{{trItem.inventoryWarehouseStatistics[0].saleCheckPassWaitOutInventoryNumber}}</font>
              </td><!--已审核 -->
              <td>
                <a v-if="trItem.inventoryWarehouseStatistics[0].salePushFinishWaitOutInventoryNumber!=''" @click="setShowDetailTable('salePushFinishWaitOutOrders',index,0)">{{trItem.inventoryWarehouseStatistics[0].salePushFinishWaitOutInventoryNumber}}</a>
                <font v-else>{{trItem.inventoryWarehouseStatistics[0].salePushFinishWaitOutInventoryNumber}}</font>
              </td><!--已推送 -->
              <td>
                <a v-if="trItem.inventoryWarehouseStatistics[0].supplierReturnWaitOutInventoryNumber!=''" @click="setShowDetailTable('supplierReturnWaitOutOrders',index,0)">{{trItem.inventoryWarehouseStatistics[0].supplierReturnWaitOutInventoryNumber}}</a>
                  <font v-else>{{trItem.inventoryWarehouseStatistics[0].supplierReturnWaitOutInventoryNumber}}</font>
              </td><!--供应商待退货 -->
              <td>
                <a v-if="trItem.inventoryWarehouseStatistics[0].transferOutWaitOutInventoryNumber!=''" @click="setShowDetailTable('transferOutWaitOutOrders',index,0)">{{trItem.inventoryWarehouseStatistics[0].transferOutWaitOutInventoryNumber}}</a>
                  <font v-else>{{trItem.inventoryWarehouseStatistics[0].transferOutWaitOutInventoryNumber}}</font>
              </td><!--调拨待出库 -->
              <td>
                  <a v-if="trItem.inventoryWarehouseStatistics[0].varianceMinusWaitOutInventoryNumber!=''" @click="setShowDetailTable('varianceMinusWaitOutOrders',index,0)">{{trItem.inventoryWarehouseStatistics[0].varianceMinusWaitOutInventoryNumber}}</a>
                  <font v-else>{{trItem.inventoryWarehouseStatistics[0].varianceMinusWaitOutInventoryNumber}}</font>
              </td><!--盘亏预定 -->
              <td><!-- {{trItem.inventoryWarehouseStatistics[0].frozenFreezeInventoryNumber}} -->
                <a v-if="trItem.inventoryWarehouseStatistics[0].frozenFreezeInventoryNumber!=''" @click="setShowDetailTable('frozenFreezeOrders',index,0)">{{trItem.inventoryWarehouseStatistics[0].frozenFreezeInventoryNumber}}</a>
                  <font v-else>{{trItem.inventoryWarehouseStatistics[0].frozenFreezeInventoryNumber}}</font>
              </td><!--冻结预定 -->
              <td>
                <a v-if="trItem.inventoryWarehouseStatistics[0].purchaseWaitInNumber!=''" @click="setShowDetailTable('purchaseWaitInOrders',index,0)">{{trItem.inventoryWarehouseStatistics[0].purchaseWaitInNumber}}</a>
                  <font v-else>{{trItem.inventoryWarehouseStatistics[0].purchaseWaitInNumber}}</font>
              </td><!--采购待入库 -->
              <td>
                <a v-if="trItem.inventoryWarehouseStatistics[0].purchaseExpectTodayTomorrowArrivalWaitInNumber!=''" @click="setShowDetailTable('purchaseExpectTodayTomorrowArrivalWaitInOrders',index,itemIndex)">{{trItem.inventoryWarehouseStatistics[0].purchaseExpectTodayTomorrowArrivalWaitInNumber}}</a>
                  <font v-else>{{trItem.inventoryWarehouseStatistics[0].purchaseExpectTodayTomorrowArrivalWaitInNumber}}</font>
              </td><!--采购今明到货 -->
              <td>
                <a v-if="trItem.inventoryWarehouseStatistics[0].transferInWaitInNumber!=''" @click="setShowDetailTable('transferInWaitInOrders',index,0)">{{trItem.inventoryWarehouseStatistics[0].transferInWaitInNumber}}</a>
                  <font v-else>{{trItem.inventoryWarehouseStatistics[0].transferInWaitInNumber}}</font>
              </td><!--调拨待入库 -->
            </tr>
            <tr v-for="(item, itemIndex) in trItem.inventoryWarehouseStatistics" v-if="itemIndex!=0">
                <td :class="{'noR':itemIndex>1,'noB':itemIndex>1 && itemIndex!=trItem.inventoryWarehouseStatistics.length-1}"><label v-if="itemIndex==1 && trItem.inventorySkuStatistics[1]">{{statusIdArray[trItem.inventorySkuStatistics[1].statusId]}}</label>
                </td>
                <td :class="{'noR':itemIndex>1,'noB':itemIndex>1 && itemIndex!=trItem.inventoryWarehouseStatistics.length-1}"><label v-if="itemIndex==1 && trItem.inventorySkuStatistics[1]">{{trItem.inventorySkuStatistics[1].systemInventoryNumber}}</label></td>
                <td :class="{'noB':itemIndex>1 && itemIndex!=trItem.inventoryWarehouseStatistics.length-1}"><label v-if="itemIndex==1 && trItem.inventorySkuStatistics[1]">{{trItem.inventorySkuStatistics[1].availableInventoryNumber}}</label></td>
                <td>{{item.warehouseName}}</td><!-- 仓库 -->
                <td>{{statusIdArray[item.statusId]}}</td><!-- 库存状态 -->
                <td>{{item.systemInventoryNumber}}</td><!-- 系统库存 -->
                <td>{{item.availableInventoryNumber}}</td><!-- 可用库存 -->
                <td>{{item.lockInventoryNumber}}</td><!--锁定库存 -->
                <td>
                  <a v-if="item.saleCheckWaitWaitOutInventoryNumber!=''" @click="setShowDetailTable('saleCheckWaitWaitOutOrders',index,itemIndex)">{{item.saleCheckWaitWaitOutInventoryNumber}}</a>
                  <font v-else>{{item.saleCheckWaitWaitOutInventoryNumber}}</font>
                </td><!--待审核 -->
                <td>
                  <a v-if="item.saleCheckPassWaitOutInventoryNumber!=''" @click="setShowDetailTable('saleCheckPassWaitOutOrders',index,itemIndex)">{{item.saleCheckPassWaitOutInventoryNumber}}</a>
                  <font v-else>{{item.saleCheckPassWaitOutInventoryNumber}}</font>
                </td><!--已审核 -->
                <td>
                  <a v-if="item.salePushFinishWaitOutInventoryNumber!=''" @click="setShowDetailTable('salePushFinishWaitOutOrders',index,itemIndex)">{{item.salePushFinishWaitOutInventoryNumber}}</a>
                  <font v-else>{{item.salePushFinishWaitOutInventoryNumber}}</font>
                </td><!--已推送 -->
                <td>
                  <a v-if="item.supplierReturnWaitOutInventoryNumber!=''" @click="setShowDetailTable('supplierReturnWaitOutOrders',index,itemIndex)">{{item.supplierReturnWaitOutInventoryNumber}}</a>
                  <font v-else>{{item.supplierReturnWaitOutInventoryNumber}}</font>
                </td><!--供应商待退货 -->
                <td>
                  <a v-if="item.transferOutWaitOutInventoryNumber!=''" @click="setShowDetailTable('transferOutWaitOutOrders',index,itemIndex)">{{item.transferOutWaitOutInventoryNumber}}</a>
                  <font v-else>{{item.transferOutWaitOutInventoryNumber}}</font>
                </td><!--调拨待出库 -->
                <td>
                  <a v-if="item.varianceMinusWaitOutInventoryNumber!=''" @click="setShowDetailTable('varianceMinusWaitOutOrders',index,itemIndex)">{{item.varianceMinusWaitOutInventoryNumber}}</a>
                  <font v-else>{{item.varianceMinusWaitOutInventoryNumber}}</font>
                </td><!--盘亏预定 -->
                <td>
                  <a v-if="item.frozenFreezeInventoryNumber!=''" @click="setShowDetailTable('frozenFreezeOrders',index,itemIndex)">{{item.frozenFreezeInventoryNumber}}</a>
                  <font v-else>{{item.frozenFreezeInventoryNumber}}</font>
                </td><!--冻结预定 -->
                <td>
                  <a v-if="item.purchaseWaitInNumber!=''" @click="setShowDetailTable('purchaseWaitInOrders',index,itemIndex)">{{item.purchaseWaitInNumber}}</a>
                  <font v-else>{{item.purchaseWaitInNumber}}</font>
                </td><!--采购待入库 -->
                <td>
                  <a v-if="item.purchaseExpectTodayTomorrowArrivalWaitInNumber!=''" @click="setShowDetailTable('purchaseExpectTodayTomorrowArrivalWaitInOrders',index,itemIndex)">{{item.purchaseExpectTodayTomorrowArrivalWaitInNumber}}</a>
                  <font v-else>{{item.purchaseExpectTodayTomorrowArrivalWaitInNumber}}</font>
                </td><!--采购今明到货 -->
                <td>
                  <a v-if="item.transferInWaitInNumber!=''" @click="setShowDetailTable('transferInWaitInOrders',index,itemIndex)">{{item.transferInWaitInNumber}}</a>
                  <font v-else>{{item.transferInWaitInNumber}}</font>
                </td><!--调拨待入库 -->
            </tr>
          </tbody>
        </table>
      </div>
    </section>
        <div class="popup-wrap-zn" v-if="showDetail">
         <div class="popup-content-log row form-inline">
            <p class="popup-title">库存详情</p>
            <div class="popup-main-log">
                 <table class="table">
                  <tr>
                    <th style="white-space:nowrap;">订单类型&nbsp;&nbsp;<i @click="orderByxxx('orderType','orderByType')" :class="orderBy.orderByType == 1 ? 'fa fa-chevron-down' : 'fa fa-chevron-up' "></i></th>
                    <th>订单号</th>
                    <th>订单状态</th>
                    <th style="white-space:nowrap;">订单时间&nbsp;&nbsp;<i @click="orderByxxx('createTime','orderByTime')" :class="orderBy.orderByTime == 1 ? 'fa fa-chevron-down' : 'fa fa-chevron-up' "></i></th>
                    <th style="white-space:nowrap;">包含指定商品数量&nbsp;&nbsp;<i @click="orderByxxx('number','orderByNum')" :class="orderBy.orderByNum == 1 ? 'fa fa-chevron-down' : 'fa fa-chevron-up' "></i></th>
                  </tr>
                  <tr v-for="(trItem, index) in showDetailTable">
                    <td>{{orderTypeArray[trItem.orderType]}}</td>
                    <td>{{trItem.orderSn}}</td>
                    <td>{{orderStatusArray[trItem.orderStatus]}}</td>
                    <td>{{trItem.createTime}}</td>
                    <td>{{trItem.number}}</td>
                  </tr>
              </table>
            </div>
            <div class="popup-footer">
              <button class="btn btn-sm btn-default" @click="showDetail=false"><i class="fa fa-reply"></i>取消</button>
            </div>
          </div>
        </div>
        
  </div>
</template>

<script>
import initStyle from '../../../common/initStyle'
import http from '../../../common/http'
import api from '../../../common/api'
import fuzzySearch from '../../../component/fuzzySearch'
import multipleSelectList from '../../../component/multipleSelectList'
import datePicker from '../../../component/datePicker'
import searchGoodsName from '../../../component/searchGoodsName'
import searchSkuName from '../../../component/searchSkuName'
import deepClone from '../../../common/deepClone'
import selectGoodsBrand from '../../../component/selectGoodsBrand'
import searchCustomCategory from '../../../component/searchCustomCategory'

var _self = {};
export default {
  components: {
    datePicker,
    searchGoodsName,
    fuzzySearch,
    multipleSelectList,
    searchSkuName,

    selectGoodsBrand,
    searchCustomCategory,
  },
  data () {
    return {
  //查询
      showCopyHead:false,
      disabledSearch:false,
      showDetail:false,
      orderBy:{
        orderByType:1,
        orderByTime:1,
        orderByNum:1,
      },
      showDetailTable:[],
      searchData:{
        cid:'',       //商品分类id，是自定义分类
        goodsBrandId:'',    //商品品牌id
        warehouseId:'',   
        warehouseTypes:[],
        skuId:'',//4422
        statusId:'ALL',     //库存状态
        quantityStatus:'SYSTEM_INVENTORY_POSITIVE',    //数量区分
      },
  //显示
      //searchResult:[],
      tableList:[],       //查询结果
      totalCount:'',      //总页数
      statusIdArray:{  //库存状态
        ALL:'所有状态',
        INV_STTS_AVAILABLE:'全新',
        INV_STTS_USED:'二手',
      //  INV_STTS_DEFECTIVE:'破损',
      },
      quantityStatusArray:{
        SYSTEM_INVENTORY_POSITIVE:'库存大于0',
        AVAILABLE_INVENTORY_NEGATIVE:'库存小于0',
        ALL:'所有',
      },
      warehouseTypes:{
        CAINIAO:'菜鸟仓',
        WMS:'WMS仓',
        OMS:'OMS仓',
        VIRTUAL:'虚拟仓',
        ON_WAY:'在途仓',
        DIFF:'差异仓',
        PHYSICAL:'物理仓',
      },
      orderTypeArray:{
        SALE:'销售', 
        REFUND:'退货', 
        EXCHANGE:'换货', 
        SUPPLY:'补寄', 
        TRANSFER_OUT:'调拨出库',
        TRANSFER_IN:'调拨入库', 
        VARIANCE_ADD:'盘盈', 
        VARIANCE_MINUS:'盘亏', 
        PURCHASE:'采购', 
        SUPPLIER_RETURN:'供应商退货', 
        FROZEN:'冻结', 
        ADJUST:'供价调整',
      },
      orderStatusArray:{
        WAIT_CHECK:'待审核',
        CHECK_PASS:'审核通过',
        PUSH:'已推送', 
        INIT:'待审核',
        PASSED:'已审核',
        DENIED:'审核否决',
        REJECT:'出库驳回',
        ALL_RESERVED:'全部预订',
        PART_RESERVED:'部分预订',
        FAIL_RESERVED:'预定失败',
        WMS_ADJUST:'WMS已调整',
        CHECK_WAIT:'待审核',
        PUSH_FINISH:'已推送',
        IN_START:'开始入库',
        DT_DONE:'调拨出库完成',
        DC_EXECUTING:'调拨入库中',
      }
    }
  },
  mounted () {
    _self = this;
    this.$nextTick(() => {
      initStyle();
      window.onscroll=function(){
        if($(window).scrollTop()>200){
          _self.showCopyHead=true;
        }else{
          _self.showCopyHead=false;
        }
      }
    });
  },
  methods: {
    getSelectedWareHouseIds(res){
      _self.searchData.warehouseTypes= res.data.selectedIds;
    },
    // chooseSkuName (result) {  
    //   _self.searchData.skuId=result.data.skuId;
    // },
    chooseSkuName (result) {    //将用户选择的sku信息加入到addGoods中
      _self.searchData.skuId=result.data.skuId;
      _self.$refs.childSearchSku.goodsCode=result.data.skuName;  
    },
    clearSkuMessage(){
      //_self.searchData.skuId= '';
    },
    selectGoodsBrand (data) {
      if (data) {
        _self.searchData.goodsBrandId=data;
      } else {
        _self.searchData.goodsBrandId='';
      }
    },
    searchCustomCategory (data) {
      if (data) {
        _self.searchData.cid=data;
      } else {
        _self.searchData.cid='';
      }
    },
    // selectGoods (data) {
    //   if (data) {
    //     _self.searchData.skuId= data.id;
    //   } else {
    //     _self.searchData.skuId= '';
    //   }
    // },
    chooseSearchGoods(res){     //选择商品名称
      if(res){
        _self.searchData.skuId=res.skuId;
      }else{
        _self.searchData.skuId='';
      }
    },
    chooseWarehouse(res){         //选择退货仓
      if(res){
        _self.searchData.warehouseId=res.warehouseId;
      }else{
        _self.searchData.warehouseId='';
      }
    },
    getTableList(){
      _self.tableList=[];
      _self.disabledSearch=true;
      http({
        instance: _self,
        url: api.singleGoodsInventorySearch,     
        type: 'post',
        hasLoading: true,
        data: {  "data": _self.searchData  }, 
        success (res) {
          res.data.forEach(function (trItem,index){
            _self.tableList.push(_self.getTrItem(trItem,index));
            
          });
          if(_self.tableList.length==0){
            layer.msg("<span style='color:red'>好像没有查到数据 !</span>", {icon: 5});
          }
          //_self.setCopyHead();
          setTimeout(function(){_self.setCopyHead();},1000);
          _self.disabledSearch=false;
        }
      });  
    },
    getTrItem(obj,index){
      var trItem = new Object();
      trItem.sku={  skuName: obj.sku.skuName,   //sku-商品名称
                    barcode: obj.sku.barcode,   //sku-商品条码
                    skuCode: obj.sku.skuCode,}; //sku-商家编码
      trItem.inventorySkuStatistics=new Array();
      trItem.inventoryWarehouseStatistics=new Array();
      obj.inventorySkuStatistics.forEach(function (sumItem){  //小计
        trItem.inventorySkuStatistics.push({ 
          statusId:sumItem.statusId,                                  //小计-库存状态
          systemInventoryNumber:(sumItem.systemInventoryNumber!=0) ? sumItem.systemInventoryNumber : '',  //小计-系统库存
          availableInventoryNumber:(sumItem.availableInventoryNumber!=0) ? sumItem.availableInventoryNumber : '',// 小计-可用库存
        });
      });  
      //仓库,库存实况,锁定,销售单占用,非销售单占用,库存调整占用,待入库（不占用）
      obj.inventoryWarehouseStatistics.forEach(function (item){ 
        trItem.inventoryWarehouseStatistics.push({ 
          //仓库
          warehouseName:item.warehouse.warehouseName,     
          //库存状态                                      
          statusId:item.statusId,  
          //系统库存                                                            
          systemInventoryNumber:(item.systemInventoryNumber!=0) ? item.systemInventoryNumber : '', 
          //可用库存
          availableInventoryNumber:(item.availableInventoryNumber!=0) ? item.availableInventoryNumber : '', 
          //锁定库存                            
          lockInventoryNumber:(item.lockInventoryNumber!=0) ? item.lockInventoryNumber : '',  
          //待审核                                      
          saleCheckWaitWaitOutInventoryNumber:(item.saleCheckWaitWaitOutInventoryNumber!=0) ? item.saleCheckWaitWaitOutInventoryNumber : '',         
          saleCheckWaitWaitOutOrders:item.saleCheckWaitWaitOutOrders,
          //已审核
          saleCheckPassWaitOutInventoryNumber:(item.saleCheckPassWaitOutInventoryNumber!=0) ? item.saleCheckPassWaitOutInventoryNumber : '',         
          saleCheckPassWaitOutOrders:item.saleCheckPassWaitOutOrders,
          //已推送
          salePushFinishWaitOutInventoryNumber:(item.salePushFinishWaitOutInventoryNumber!=0) ? item.salePushFinishWaitOutInventoryNumber : '',         
          salePushFinishWaitOutOrders:item.salePushFinishWaitOutOrders,
          //供应商待退货
          supplierReturnWaitOutInventoryNumber:(item.supplierReturnWaitOutInventoryNumber!=0) ? item.supplierReturnWaitOutInventoryNumber : '',       
          supplierReturnWaitOutOrders:item.supplierReturnWaitOutOrders,
          //调拨待出库
          transferOutWaitOutInventoryNumber:(item.transferOutWaitOutInventoryNumber!=0) ? item.transferOutWaitOutInventoryNumber : '',            
          transferOutWaitOutOrders:item.transferOutWaitOutOrders,
          //盘亏预定
          varianceMinusWaitOutInventoryNumber:(item.varianceMinusWaitOutInventoryNumber!=0) ? item.varianceMinusWaitOutInventoryNumber : '',           
          varianceMinusWaitOutOrders:item.varianceMinusWaitOutOrders,
          //冻结预定
          frozenFreezeInventoryNumber:(item.frozenFreezeInventoryNumber!=0) ? item.frozenFreezeInventoryNumber : '',
          frozenFreezeOrders:item.frozenFreezeOrders,
          //采购待入库
          purchaseWaitInNumber:(item.purchaseWaitInNumber!=0) ? item.purchaseWaitInNumber : '',
          purchaseWaitInOrders:item.purchaseWaitInOrders,
          //采购今明到货
          purchaseExpectTodayTomorrowArrivalWaitInNumber:(item.purchaseExpectTodayTomorrowArrivalWaitInNumber!=0) ? item.purchaseExpectTodayTomorrowArrivalWaitInNumber : '',   
          purchaseExpectTodayTomorrowArrivalWaitInOrders:item.purchaseExpectTodayTomorrowArrivalWaitInOrders,
          //调拨待入库
          transferInWaitInNumber:(item.transferInWaitInNumber!=0) ? item.transferInWaitInNumber : '',          
          transferInWaitInOrders:item.transferInWaitInOrders,
        });
      });  
      //因为合并单元格是以inventoryWarehouseStatistics为准的,如果它较小,就增加它的长度
      var length=trItem.inventorySkuStatistics.length-trItem.inventoryWarehouseStatistics.length;
      if(trItem.inventoryWarehouseStatistics.length<trItem.inventorySkuStatistics.length){
        for(var i=0;i<length;i++){
          trItem.inventoryWarehouseStatistics.push({});
        }
      }
      return trItem;
    },
    setShowDetailTable(objName,f_index,c_index){  //显示库存详情
      _self.showDetailTable=deepClone(_self.tableList[f_index].inventoryWarehouseStatistics[c_index][objName]);
      _self.showDetail=true;
    },
    orderByxxx(index,type){
      _self.sortByIndex(_self.showDetailTable,index,_self.orderBy[type]);
      _self.orderBy[type]=-_self.orderBy[type];
    },
    sortByIndex(objectArray,index,type){    //type小于零->从大到小，大于零->从小到大
      objectArray.sort(function(a,b){
        return (b[index] > a[index]) ? -type : type; 
      });
    },
    setCopyHead(){
      var s=$("#myTableHead").html();  
      $("#copyTableHead").html("<table class=\"table\"><thead>"+s+"</thead></table>");
      for(var i=0;i<30;i++){
        $("#copyTableHead th").eq(i).width($("#myTableHead th").eq(i).width());
      }
    },
    exportExcel(){
      layer.msg("导出功能尚未实现！", {time: 2000});
    },
  }
} 

</script>

<style scoped>
#copyTableHead{
  position: fixed;
  margin-top: -200px;
  z-index: 999;
}
.copyHead th{
  padding: 8px;
}

td,th{
  padding: 3px;
}
.wordBreak{
  word-break:break-all;
}
input[type=checkbox],i {   
  cursor: pointer;
}  
a{
  white-space:nowrap;
}
.content {
  padding:15px 15px 0 15px;
}
.col-md-4{
  padding-left: 0px;
  padding-right: 0px;
}
.noBRborder{
  border-bottom:1px solid #FFFFFF;
  border-right:1px solid #FFFFFF
}
.noBborder{
  border-bottom:1px solid #FFFFFF;
}
.noB{
  border-bottom:1px solid #FFFFFF;
}
.noR{
  border-right:1px solid #FFFFFF;
}
.bTop{
  border-top:1px solid #CCCCCC;
}
th {
  text-align: center;
}
.popup-wrap-zn {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.5);
    z-index: 999;
}
  .myRow{
      margin-bottom: 15px;
    }
  .myRow .control-label{
    text-align: center;
    margin-top: 5px;

  }
   .myRow .input-sm{
    width: 200px;
  }
  .popup-title {
      text-align: left;
      border-bottom: 1px solid #d2d6de;
      padding:10px;
      font-size: 16px;
      margin-bottom: 0;
  }
  .popup-footer {
      width: 100%;
      text-align: right;
      padding: 10px;
      border-top: 1px solid #d2d6de;
  }

  .popup-main-log {
      padding-left: 10px;
      padding-right: 10px;
      height: 320px;
      overflow:auto;
  }
  .popup-content-log {
    position: absolute;
    top: 15%;
    left: 50%;
    width: 800px;
    min-height: 260px;
    margin-left: -350px;
    background-color: #fff;
    border-radius: 5px;
    z-index: 999;
  }
</style>