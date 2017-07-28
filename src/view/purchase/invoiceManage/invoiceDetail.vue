<template>
<div class="content-wrapper">
<section class="content-header">
    <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-desktop"></i>采购</a></li>
        <li>发票管理</li>
        <li class="active">发票清单详情</li>
    </ol>
</section>
<!-- Main content -->
<div class="col-md-12 bgFFF" style="margin-top:10px"> 
        <div class="row form-inline myLabel" style="font-size:14px">
            <div class="col-md-12">
                <div class="form-group col-md-3">
                    <strong>发票编号:{{orderDetail.orderPurchaseInvoiceId}}</strong>
                    <label style="color:green;margin-left:20px">{{invoiceStatusArray[orderDetail.status]}}</label>
                </div>
                <div class="form-group col-md-9" style="text-align:right">
                    <button class="btn btn-primary btn-xs" v-show="!editMessage" @click="editMessage=true">编辑</button>
                    <button class="btn btn-primary btn-xs" v-show="editMessage" @click="saveMessage">保存</button>
                    <button class="btn btn-primary btn-xs" @click="updateOrder('invoiceSubmit')">提交</button>
                    <button class="btn btn-primary btn-xs" @click="updateOrder('invoiceCheckDeny')">发票否决</button>
                    <button class="btn btn-primary btn-xs" @click="updateOrder('invoiceCheckPass')">确认发票</button>
                    <button class="btn btn-primary btn-xs" @click="updateOrder('invoiceRetract')">申请退票</button>
                    <button class="btn btn-primary btn-xs" @click="updateOrder('invoiceRetractCheckPass')">确认退票</button>
                    <button class="btn btn-primary btn-xs" @click="updateOrder('invoiceRetractCheckDeny')">退票否决</button>
                    <button class="btn btn-primary btn-xs" @click="updateOrder('invoiceCancel')">作废</button>
                </div>
            </div>
            <div class="col-md-12">
                <div class="form-group col-md-3">
                    <label class="labelColor">供应商：{{orderDetail.provider.providerName}}</label>
                </div>
                <div class="form-group col-md-3" style="margin-left:1.2%">
                    <label>开票时间：</label>
                    <input v-show="!editMessage" type="text" class="input-sm form-control" :readonly="!editMessage" :class="{'not-editable': !editMessage}" v-model="orderDetail.invoiceTime" style="text-align:left;">
                    <date-picker v-show="editMessage" id="updateInvoiceTime" :placeholder="orderDetail.invoiceTime" @choose="updateInvoiceTime"></date-picker>
                </div>
                <div class="form-group col-md-3">
                    <label class="labelColor">币种：{{currencyArray[orderDetail.provider.currency]}}</label>
                </div>
            </div>
            <div class="col-md-12">
                <div class="form-group col-md-3">
                    <label class="labelColor">采购去税总计：{{purchaseSumWithoutTax}}</label>
                </div>
                <div class="form-group col-md-3" style="margin-left:-1.3%">
                    <label>发票去税金额：</label>
                    <input type="text" class="input-sm form-control" :readonly="!editMessage" :class="{'not-editable': !editMessage}" v-model="orderDetail.sumWithoutTax" style="text-align:left;">
                </div>
                <div class="form-group col-md-3">
                    <label class="labelColor">采购含税总计：{{purchaseSumWithTax}}</label>
                </div>
                <div class="form-group col-md-3">
                    <label>发票含税金额：</label>
                    <input type="text" class="input-sm form-control" :readonly="!editMessage" :class="{'not-editable': !editMessage}" v-model="orderDetail.sumWithTax" style="text-align:left;">
                </div>
            </div>
            <div class="col-md-12">
                <div class="form-group col-md-6">
                    <label class="form-group col-md-4" style="width: 15%">发票号:</label>
                    <input type="text" class="input-sm form-control col-md-8" :readonly="!editMessage" :class="{'not-editable': !editMessage}" v-model="orderDetail.invoiceNumber" style="text-align:left;width:85%">
                </div>
                <div class="form-group col-md-3">
                    <label>最后更新人：{{orderDetail.lastUpdateUser.name}}</label>
                </div>
                <div class="form-group col-md-3">
                    <label>发票创建时间：  2017-03-16 17:11:52</label>
                </div>
            </div>
        </div>  
    <table class="table table-condensed table-bordered goodsTable" style="margin-top:20px">
        <thead>
            <tr class="goodsTableTh">
                <th>商品名称</th>
                <th>商家编码</th>
                <th>采购单号</th>
                <th>去税单价</th>
                <th>含税单价</th>
                <th>当前未到票数量</th>
                <th>维护发票数量</th>
                <th>去税总价</th>
                <th>含税总价</th>
                <th>操作</th>  
            </tr>
        </thead>
        <tbody v-for="(trItem, index) in goodsList"> 
            <tr>
                <td :rowspan="trItem.length" vertical-align="center">{{trItem[0].skuName}}</td>
                <td :rowspan="trItem.length" vertical-align="center">{{trItem[0].goodsCode}}</td>
                <td>{{trItem[0].orderSn}}</td>
                <td>{{getPriceWithoutTax(trItem[0].type,trItem[0].price,trItem[0].taxRate)}}</td>
                <td>{{trItem[0].price}}</td>
                <td>{{trItem[0].nonArrivalInvoiceNumber}}</td>
                <td><input class="form-control input-sm" type="number" min="1" :max="trItem[0].nonArrivalInvoiceNumber"  style="width:60px" v-model="trItem[0].number"/></td>
                <td>{{getPriceWithoutTax(trItem[0].type,trItem[0].price,trItem[0].taxRate,trItem[0].number)}}</td>
                 <td>{{getPriceWithTax(trItem[0].type,trItem[0].price,trItem[0].taxRate,trItem[0].number,index,0)}}</td>
                <td><a @click="deleteOne(index,0)"><i class="iconfont delete-icon" >&#xe613;</i></a></td>
            </tr>
            <tr v-if="trItem.length>1&&childIndex>0" v-for="(childOrder, childIndex) in trItem">
                <td>{{trItem[childIndex].orderSn}}</td>
                <td>{{getPriceWithoutTax(trItem[childIndex].type,trItem[childIndex].price,trItem[childIndex].taxRate)}}</td>
                <td>{{trItem[childIndex].price}}</td>
                <td>{{trItem[childIndex].nonArrivalInvoiceNumber}}</td>
                <td><input class="form-control input-sm" type="number" min="1" style="width:60px" v-model="trItem[childIndex].number"/></td>
                <td>{{getPriceWithoutTax(trItem[childIndex].type,trItem[childIndex].price,trItem[childIndex].taxRate,trItem[childIndex].number)}}</td>
                <td>{{getPriceWithTax(trItem[childIndex].type,trItem[childIndex].price,trItem[childIndex].taxRate,trItem[childIndex].number,index,childIndex)}}</td>
                <td><a @click="deleteOne(index,childIndex)"><i class="iconfont delete-icon" >&#xe613;</i></a></td>
            </tr>{{getTotalPrice()}}
        </tbody>
        <tr height="50px"><td colspan="20" style="text-align:center">
            <button class="btn btn-sm btn-primary" @click="updateInvoice"><i class="fa fa-check"></i>保存</button>
            <button class="btn btn-sm btn-default" @click="setGoodsList"><i class="fa fa-reply"></i>取消</button>
        </td></tr>
    </table>
    <div class="row form-horizontal searchContent" style="margin-bottom:12px">
      <div class="form-group mytitle"><span>筛选采购商品明细</span></div>
      <div class="form-group">
        <!--  <div class="form-group" style="margin-top:18px"> -->
          <div class="col-md-3">
            <label class="col-sm-5 control-label">采购/退货单号</label>
            <div class="col-sm-7">
              <input type="text" v-model="searchData.orderSn" class="form-control input-sm"/>
            </div>
          </div>
          <div class="col-md-4">
            <label class="col-sm-5 control-label">供应商采购单号</label>
            <div class="col-sm-7">
              <input type="text" v-model="searchData.providerPurchaseOrderSn" class="form-control input-sm"/>
            </div>
          </div>
          <div class="col-md-3" style="width: 24%;">
            <label class="col-sm-4 control-label">商品名称</label>
            <div class="col-sm-8">
              <fuzzy-search id='chooseSearchGoods' placeholder='商品名称模糊搜索' :searchfiled="'skuName'" :config="{'apiName':'searchSkuNameList','resultPath':'data.content'}" @choose="chooseSearchGoods"> </fuzzy-search>
            </div>
          </div>
        </div>
        <div class="form-group">
          <div class="col-md-5">
            <label class="col-sm-3 control-label">采购订单时间</label>
            <div class="col-sm-9">
              <date-range-picker id="orderTime" :needhms="true" @get_date="get_order_time" :miniwidth="true" :start-time="searchData.purchaseOrderStartTime" :end-time="searchData.purchaseOrderEndTime"></date-range-picker>
            </div>
          </div>
          <div class="col-md-5">
            <label class="col-sm-4 control-label">退货订单时间</label>
            <div class="col-sm-8">
              <date-range-picker id="finishTime" :needhms="true" @get_date="get_pay_time" :miniwidth="true" :start-time="searchData.gtOrderStartTime" :end-time="searchData.gtOrderEndTime"></date-range-picker>
            </div>
          </div>
          <div class="col-md-1">
            <button class="btn btn-sm btn-primary" @click="getTableList"><i class="fa fa-search"></i>查询</button>
          </div>
          <div class="col-md-1">
            <button class="btn btn-sm btn-default" @click="exportExcel"><i class="fa fa-download"></i>导出</button>
          </div>
        </div>
        <div class="form-group" style="float:right;margin-right:10px">
            <button class="btn btn-primary btn-xs"  @click="selectAll('null','childCheckbox')">全选</button>
            <button class="btn btn-primary btn-xs" @click="selectAll('null','childCheckbox','none')">全不选</button>
            <button class="btn btn-primary btn-xs" @click="addToTable">添加</button>
        </div>
    </div>
    <div class="form-horizontal tableContent">
        <!-- <table class="table table-condensed mySearchTable" style="margin:4px"> -->
        <table class="table">
            <thead>
              <tr>
                <th>订单号</th>
                <th>订单时间</th>
                <th>商品名称</th>
                <th>采购入库价</th>
                <th>已使用票扣</th>
                <th>未到票数量</th>
                <th>选择</th>
              </tr>
            </thead>
            <tbody v-for="(trItem, index) in tableList">
              <tr>
                <td :rowspan="trItem.length" vertical-align="center">
                  <nobr>
                  <input type="checkbox" class="childCheckbox" :id="'selectAll'+index" @click="selectAll('selectAll'+index,trItem[0].orderSn)">
                  <label class="pointer" :for="'selectAll'+index">{{trItem[0].orderSn}}</label>
                  </nobr>
                  </td>
                <td :rowspan="trItem.length" vertical-align="center">{{trItem[0].orderTime}}</td>
                <td><font v-if="trItem[0].sku">{{trItem[0].sku.skuName}}</font></td>
                <td>{{trItem[0].price}}</td>
                <!-- <td>{{getInStoragePrice(trItem.orderPurchaseDetails[0])}}</td> -->
                <td>{{trItem[0].reducePrice}}</td>
                <td>{{trItem[0].nonArrivalInvoiceNumber}}</td>
                <td><input type="checkbox" :class="trItem[0].orderSn" :value="index+'-0'" v-model="indexArray"></td> 
              </tr>
              <tr v-if="trItem.length>1&&childIndex>0" v-for="(childOrder, childIndex) in trItem">
               <td><font v-if="trItem[childIndex].sku">{{trItem[childIndex].sku.skuName}}</font></td>
                <td>{{trItem[childIndex].price}}</td>
                <!-- <td>{{getInStoragePrice(trItem.orderPurchaseDetails[0])}}</td> -->
                <td>{{trItem[childIndex].reducePrice}}</td>
                <td>{{trItem[childIndex].nonArrivalInvoiceNumber}}</td>
                <td><input type="checkbox" :class="trItem[0].orderSn" :value="index+'-'+childIndex" v-model="indexArray"></td>
              </tr>
            </tbody>
          </table>
          <!-- <div class="form-group mytitle" style="margin-top:20px"><span>日志</span></div> -->
    </div>
    </section>
</template>

<script>
import initStyle from '../../../common/initStyle'
import http from '../../../common/http'
import api from '../../../common/api'
import fuzzySearch from '../../../component/fuzzySearch'
import datePicker from '../../../component/datePicker'
import deepClone from '../../../common/deepClone'
import searchSkuName from '../../../component/searchSkuName'
import dateRangePicker from '../../../component/dateRangePicker'

var _self = {};
export default {
  components: {
    datePicker,
    fuzzySearch,
    searchSkuName,
    dateRangePicker,
  },
  data () {
    return {
        purchaseSumWithoutTax:'',
        purchaseSumWithTax:'',
        editMessage:false,      //编辑信息

        goodsList:[],   //用于保存显示退货商品
        orderDetail:{    //dt单详情
            lastUpdateUser:'',
            provider:'',
        },  
        searchData:{    //查询采购单
            skuId:'',
            skuCode:'',
            purchaseOrderStartTime:'',
            purchaseOrderEndTime:'',
            gtOrderStartTime:'',
            gtOrderEndTime:'',
            orderSn:'',
            providerPurchaseOrderSn:'',   //供应商采购单号
            providerId:'',
        },
        tableList:[],       //采购单查询结果
        indexArray:[],      //被选择的采购单下标数组
        newItem:{
            number:'1',
            orderPurchaseDetail:{
                sku:{
                    skuName:'',
                    skuId:'',
                    goods:{
                        goodsCode:'',
                    },
                },
                nonArrivalInvoiceNumber:'',
                unitPrice:'',
                orderPurchase:{
                    orderSn:'',
                },
                orderGoods:{
                    orderGoodsId:'',
                },
                taxRate:'',
                orderPurchaseDetailId:'',
            },
        },
        invoiceStatusArray: {  //状态数组
            WAIT_SUBMIT:'待提交',
            WAIT_CHECK:'待审核',
            PASSED:'审核通过',
            DENIED:'审核否决',
            RETRACT_WAIT_CHECK:'退票待审核',
            RETRACT_PASSED:'退票审核通过',
            RETREAT_DENIED:'退票审核否决',
            CANCELLED:'已取消',
        },  
        currencyArray: {  //币种数组
            RMB: '人民币',
            US: '美元',
        }, 
    }
  },
    mounted () {
        _self = this;
        this.$nextTick(() => {
            initStyle();
        });
        _self.getDetailById();
    },
    methods: {
////获得页面显示信息--begin
        getDetailById(){
            // var date = new Date();
            // showMessage("getDetailById函数被调用");
            // showMessage(date);
            http({                  //根据id获取套餐详情
                instance: _self,
                url: api.invoiceGet,     //
                type: 'post',
                data:{ "data": { "orderPurchaseInvoiceId":_self.$route.params.orderId,  }   },
                success (res) {
                    _self.setOrderDetail(res);
                }
            });
        },
        setOrderDetail(res){
            _self.orderDetail=res.data;
            _self.searchData.providerId=_self.orderDetail.provider.providerId;
            _self.setGoodsList();
        },
        setGoodsList(){
            _self.goodsList=[];
            for(var i=0;i<_self.orderDetail.orderPurchaseInvoiceDetails.length;i++){
                _self.insertIntoGoodsList(_self.getGoodsListTritem(_self.orderDetail.orderPurchaseInvoiceDetails[i]));
            }
        },
        insertIntoGoodsList(obj){
            for(var i=0;i<_self.goodsList.length;i++){
                if(_self.goodsList[i][0].skuId==obj.skuId){ //应该加到该数组中
                    _self.goodsList[i].push(obj);
                    return ;
                }
            }
            _self.goodsList.push(new Array(obj));
        },
        getGoodsListTritem(obj){
            var item=new Object();
            item['skuId']=obj.sourceDetail?obj.sourceDetail.sku.skuId:obj.sku.skuId;
            item['skuName']=obj.sourceDetail?obj.sourceDetail.sku.skuName:obj.sku.skuName;
            item['goodsCode']=obj.sourceDetail?obj.sourceDetail.sku.goods.goodsCode:obj.sku.goods.goodsCode;
            item['orderSn']=obj.sourceDetail?obj.sourceDetail.orderSn:obj.orderSn;
            item['taxRate']=obj.sourceDetail?obj.sourceDetail.sku.goods.taxRate:obj.sku.goods.taxRate;
            item['nonArrivalInvoiceNumber']=obj.sourceDetail?obj.sourceDetail.nonArrivalInvoiceNumber:obj.nonArrivalInvoiceNumber;
            item['type']=obj.sourceDetail?obj.sourceDetail.type:obj.type;
            item['price']=obj.sourceDetail?obj.sourceDetail.price||9:obj.price;
            item['number']=obj.sourceDetail?obj.number:1;    
            item['sumWithoutTax']=obj.sourceDetail?obj.sumWithoutTax:'';
            item['sumWithTax']=obj.sourceDetail?obj.sumWithTax:'';
            return item;
        },
////获得页面显示信息--end
        exportExcel(){
            layer.msg("导出功能尚未实现！", {time: 2000});
        },
        updateInvoiceTime (result) {        //选择付款时间
            _self.orderDetail.invoiceTime=result.data;
        },
        saveMessage(){
            http({
                instance: _self,
                url: api.invoiceModify,
                type: 'post',
                data:{
                    data:{
                        orderPurchaseInvoiceId: _self.orderDetail.orderPurchaseInvoiceId,
                        invoiceNumber: _self.orderDetail.invoiceNumber,
                        sumWithoutTax: _self.orderDetail.sumWithoutTax,
                        sumWithTax: _self.orderDetail.sumWithTax,
                        invoiceTime: _self.orderDetail.invoiceTime,
                    },
                },
                success (res) {
                    _self.setOrderDetail(res);
                    _self.editMessage=false;
                }
            });
        },
        updateOrder(apiName){   //审核通过，不通过，作废。。。
            http({
                instance: _self,
                url: api[apiName],     //searchData
                type: 'post',
                data:{"data":{
                   orderPurchaseInvoiceId: _self.orderDetail.orderPurchaseInvoiceId, },},//         
                success (res) {
                    _self.setOrderDetail(res);
                }
            });   
        },
        deleteOne(index,childIndex){    //删除
          var layerIndex = layer.confirm('您确定删除吗?', {
            btn: ['是','否'],
            title: false,
            shadeClose: true,
            closeBtn: 0
          }, () => {
            if(_self.goodsList[index].length>1){
                _self.goodsList[index].splice(childIndex, 1);   
            }else{
                _self.goodsList.splice(index, 1);   
            }
            layer.close(layerIndex);
          });
        },
        // getInStoragePrice(goodsDetail){     //获得采购入库价=  [（单价*下单数）-票扣]/下单数
        //   var p= (goodsDetail.unitPrice*goodsDetail.purchaseNumber-goodsDetail.reducePrice)/goodsDetail.purchaseNumber;
        //   return p.toFixed(2);
        // },
        getPriceWithoutTax(type,price,rate,number){
            if(type=='GT'){
                number=-number;
            }
            var p=(price/rate)*(number||1);
            return p.toFixed(2);
        },
        getPriceWithTax(type,price,rate,number,index,childIndex){
            if(type=='GT'){
                number=-number;
            }
            var p=price*number;
            var pa=(price/rate)*number;
            _self.goodsList[index][childIndex].sumWithTax=p.toFixed(2);
            _self.goodsList[index][childIndex].sumWithoutTax=pa.toFixed(2);
            return p.toFixed(2);
        },
        getTotalPrice(){      //从显示列表中获得需要提交的数据
          var totalPriceWithTax=0;
          var totalPriceWithoutTax=0;
          if(typeof(_self.goodsList)=='undefined'){
            return ;
          }
          for(var i=0;i<_self.goodsList.length;i++){
            for(var j=0;j<_self.goodsList[i].length;j++){
              totalPriceWithTax+=parseFloat(_self.goodsList[i][j].sumWithTax);
              totalPriceWithoutTax+=parseFloat(_self.goodsList[i][j].sumWithoutTax);
            }
          }
          _self.purchaseSumWithoutTax=totalPriceWithoutTax.toFixed(2);
          _self.purchaseSumWithTax=totalPriceWithTax.toFixed(2);
        },
        //采购单查询---begin======================================================================================
        chooseSearchGoods(res){
            if(res){
                _self.searchData.skuId=res.skuId;
                _self.searchData.skuCode=res.skuCode;
            }else{
                _self.searchData.skuId='';
                _self.searchData.skuCode='';
            }
        },
        get_order_time (date) {
            _self.searchData.purchaseOrderStartTime = date.start_time;
            _self.searchData.purchaseOrderEndTime = date.end_time;
        },
        get_pay_time (date) {
            _self.searchData.gtOrderStartTime = date.start_time;
            _self.searchData.gtOrderEndTime = date.end_time;
        },
        chooseSkuName (result) {    //将用户选择的sku信息加入到addGoods中
           _self.searchData.skuId=result.data.skuId;
        },
        clearSkuMessage(){
          _self.searchData.skuId='';
        },
        getOrderTime (date) {
          _self.searchData.startOrderTime = date.start_time;
          _self.searchData.endOrderTime = date.end_time;
        },
        getFinishTime (date) {
          _self.searchData.finishStartTime = date.start_time;
          _self.searchData.finishEndTime = date.end_time;
        },
        getTableList(){     //查询采购单
            _self.tableList=[];
            http({
                instance: _self,
                url: api.getCGAndGTOorderList,     //purchaseList
                type: 'post',
                data:{"data":_self.searchData,},//         
                success (res) {
                    if(res.data.totalCount==0){
                        layer.msg("<span style='color:red'>好像没有查到数据 !</span>", {icon: 5});
                        return ;
                      }
                    _self.tableList=_self.groupByIndex(res.data.content,'orderSn');
                }
            }); 
        },
        selectAll(myid,className,type){    //多选框全选或全不选
          if(myid!='null'&&!$("#"+myid)[0].checked){  //没被选中
            type='none';
          }
          var doms=$('.'+className); 
          for(var i=0;i<doms.length;i++){
            if(!doms[i].checked&&type!='none'){        //全选,如果没有选中
              doms[i].click();
            }else if(doms[i].checked&&type=='none'){   //全不选,如果选中了
              doms[i].click();
            }
          }
        },
        addToTable(){       //将选中的结果添加到表格中
            if(_self.indexArray.length<1){
                layer.msg("请先选择要添加的订单！", {time: 2000});
            }
            for(var i=0;i<_self.indexArray.length;i++){
                var indexa=_self.indexArray[i].split('-')[0];
                var indexb=_self.indexArray[i].split('-')[1];
                _self.insertIntoGoodsList(_self.getGoodsListTritem(_self.tableList[indexa][indexb]));
            }
        },
        setNewItem(addedOrder,cg_orderSn){
            _self.newItem.orderPurchaseDetail.sku.skuName=addedOrder.sku.skuName;
            _self.newItem.orderPurchaseDetail.sku.skuId=addedOrder.sku.skuId;
            _self.newItem.orderPurchaseDetail.sku.goods.goodsCode=addedOrder.sku.goods.goodsCode;
            _self.newItem.orderPurchaseDetail.nonArrivalInvoiceNumber=addedOrder.nonArrivalInvoiceNumber;
            _self.newItem.orderPurchaseDetail.unitPrice=addedOrder.unitPrice;
            _self.newItem.orderPurchaseDetail.orderPurchase.orderSn=cg_orderSn;
            _self.newItem.orderPurchaseDetail.orderGoods.orderGoodsId=addedOrder.orderGoods.orderGoodsId;
            _self.newItem.orderPurchaseDetail.taxRate=addedOrder.sku.goods.taxRate;
            _self.newItem.orderPurchaseDetail.orderPurchaseDetailId=addedOrder.orderPurchaseDetailId;
        },
        updateInvoice(){
            var oldList=new Array();
            var newList=new Array();
            for(var i=0;i<_self.orderDetail.orderPurchaseInvoiceDetails.length;i++){       //得到旧列表
                var oldItem=new Object();
                oldItem['orderPurchaseDetailId']=_self.orderDetail.orderPurchaseInvoiceDetails[i].orderPurchaseDetail.orderPurchaseDetailId;
                oldItem['orderPurchaseInvoiceDetailId']=_self.orderDetail.orderPurchaseInvoiceDetails[i].orderPurchaseInvoiceDetailId;
                oldItem['sumWithoutTax']=_self.orderDetail.orderPurchaseInvoiceDetails[i].sumWithoutTax.toFixed(2).toString();
                oldItem['sumWithTax']=_self.orderDetail.orderPurchaseInvoiceDetails[i].sumWithTax.toFixed(2).toString();
                oldItem['number']=_self.orderDetail.orderPurchaseInvoiceDetails[i].number;
                oldList.push(oldItem);
            }
            for(var i=0;i<_self.goodsList.length;i++){                    //得到新列表
                for(var j=0;j<_self.goodsList[i].length;j++){
                    var newItem=new Object();
                    newItem['orderPurchaseDetailId']=_self.goodsList[i][j].orderPurchaseDetail.orderPurchaseDetailId;
                    newItem['orderPurchaseInvoiceDetailId']=_self.goodsList[i][j].orderPurchaseInvoiceDetailId;
                    newItem['sumWithoutTax']=_self.goodsList[i][j].sumWithoutTax;
                    newItem['sumWithTax']=_self.goodsList[i][j].sumWithTax;
                    newItem['number']=_self.goodsList[i][j].number;
                    newList.push(newItem);
                }
            }
            var arrayChanges=_self.getArrayChanges(oldList,newList,'orderPurchaseDetailId');
            for(var i=0;i<arrayChanges.insert.length;i++){      //刚插入的没有orderPurchaseInvoiceDetailId属性，需要删除
                delete arrayChanges.insert[i]['orderPurchaseInvoiceDetailId'];   
            }
            if(arrayChanges.insert.length==0&&arrayChanges.update.length==0&&arrayChanges.delete.length==0){
                alert("你好像并没有修改什么！！！");
                return ;
            }
            http({
                instance: _self,
                url: api.invoiceModify,
                type: 'post',
                data:{
                    data:{
                        orderPurchaseInvoiceId: _self.orderDetail.orderPurchaseInvoiceId,
                        addOrderPurchaseInvoiceDetails: arrayChanges.insert,
                        modifyOrderPurchaseInvoiceDetails: arrayChanges.update,
                        deletedOrderPurchaseInvoiceDetailIds: arrayChanges.delete,
                    },
                },
                success (res) {
                    if(res.success){
                        layer.msg("操作成功", {time: 2000});
                      }else{
                        layer.msg("操作失败", {time: 2000});
                      }
                    _self.setOrderDetail(res);
                }
            });
        },
        getArrayChanges(oldList,newList,key){
            var arrayChanges={
                insert:[],
                update:[],
                delete:[],
            };
            arrayChanges.insert=newList; 
            for(var i=0;i<oldList.length;i++){
                var index=_self.indexInArray(newList,key,oldList[i][key]);
                if(index>-1){         
                    if(!_self.isObjectEqual(newList[index],oldList[i])){  
                        arrayChanges.update.push(newList[index]);  
                    }
                    var indexa=_self.indexInArray(arrayChanges.insert,key,oldList[i][key]);  
                    arrayChanges.insert.splice(indexa, 1);        
                }else{       
                    arrayChanges.delete.push(oldList[i]['orderPurchaseInvoiceDetailId']);
                }
            }
            return arrayChanges;
        },
        isObjectEqual(obja, objb) {
            var aProps = Object.getOwnPropertyNames(obja);
            var bProps = Object.getOwnPropertyNames(objb);
            if (aProps.length != bProps.length) {
                return false;
            }
            for (var i = 0; i < aProps.length; i++) {
                var propName = aProps[i];
                if (typeof(obja[propName]) == 'object' || typeof(objb[propName]) == 'object') {
                    return isObjectEqual(obja[propName], objb[propName]);
                } else {
                    if (obja[propName] !== objb[propName]) {
                        return false;
                    }
                }
            }
            return true;
        },
        indexInArray(array, path, value) {
            for (let i = 0; i < array.length; i++) {
                if(_self.getValueByPath(array[i],path)==value){
                    return i;
                }
            }
            return - 1;
        },
        groupByIndex(objectArray, path) { 
            var group = new Object();
            var groupArray=new Array();
            for (var i = 0; i < objectArray.length; i++) {
                var index = 'group_'+_self.getValueByPath(objectArray[i], path);
                if (typeof(group[index]) === "undefined") {
                    group[index] = new Array(objectArray[i]);
                } else {
                    group[index].push(objectArray[i]);
                }
            }
            for (var key in group) {
                groupArray.push(group[key]);
            }
            return groupArray;
        },
        insertObjToArrayGroup(group,obj,path,uniquePath){
          for(var i=0;i<group.length;i++){
            if(group[i][0][path]==obj[path]){ //应该加到该数组中
              group[i].push(obj);
              return 'success';
            }
          }
          group.push(new Array(obj));
          return 'success';
        },
        getValueByPath(obj,path){
          var indexArray=path.split('.'); 
          var value=obj;
          for(var k in indexArray){
            value=value[indexArray[k]];
            if(typeof(value)=='undefined'){
              console.log('路径错误：'+[indexArray[k]]+' / '+path);
              return;
            }
            if(k==indexArray.length-1){
              return value;
            }
          }
        },
        //采购单查询---end======================================================================================
      }
    }

</script>
<style scoped>
.myInput{
    height: 30px;
    font-size: 12px;
    padding: 5px;
}
.content-wrapper {
    font-size: 12px;
}
  .form-group {
     margin-bottom: 0px; 
     margin-top: 5px;
  }
    .col-sm-4,.col-sm-8{
      padding-left: 1px;
      padding-right: 1px;
    }
  .bgFFF {
    background: #fff;
  }
.content {
  overflow: auto;
}
.content-overflow {
  width: 100%;
  overflow: auto;
  padding: 20px auto;
}
.pointer{
    cursor: pointer;
}
input[type=checkbox] {   
  cursor: pointer;
} 
input[type=number] {   
  width: 72px;
} 
input.not-editable {
    border:0 solid #d2d6de;
    background:#fff;
}
.iconfont{
  cursor: pointer;
  font-size: 20px;
}
.confirm-icon {
  color: #78BF2A;
}
.cancel-icon, .delete-icon {
  color: #F86767;
}
.order-action-record{
  width: 100%;
  margin:4px auto;
  border:0px solid transparent;
}
.order-action-record thead {
  border-bottom: 2px solid #C48900;
}

.order-action-record th {
  color:#C48900;
  text-align: center;
  height: 35px;
}

.order-action-record td {
  position: relative;
  text-align: center;
  border-right: solid 1px #d2d6de;
  border-bottom: solid 1px #d2d6de;
  padding-top: 4px;
  padding-bottom: 4px;
}
.order-action-record td:last-child {
  border-right: solid 1px #fff;
}

.goodsTable td{
    vertical-align: middle;
    border: 1px solid #C1C1C1;
}
.goodsTable{
  border-top: 2px solid #C48900;
  border-bottom: 2px solid #C48900;
}

.goodsTableTh th{
  color:#C48900;
  background-color:#FEFCED;
  text-align: center;
  height: 35px;
  border-bottom:1px solid #C48900;
}
.mytitle{
    border-bottom: 1px dashed #000000;
    padding-left: 4%;
    padding-bottom: 5px;
}
.mytitle span{
    font-size: 20px;
    padding-left: 1%;
    border-left: 3px solid #0066FF;
}

.labelColor{
    color:#E09D00;
}
.col-md-3{
    padding-right: 0px; 
}
.myLabel label{
    margin-top: 7px;
}
</style>