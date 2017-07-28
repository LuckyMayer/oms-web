<template>
  <div class="content-wrapper">
    <section class="content-header">
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-desktop"></i>发票管理</a></li>
        <li class="active">新建发票清单</li>
      </ol>
    </section>

    <section class="content addPurchase content_yjlu">
      <div class="row form-horizontal searchContent">
        <div class="form-group">
          <div class="col-md-3">
            <label class="col-sm-4 control-label required">供应商</label>
            <div class="col-sm-8">
              <fuzzy-search id='chooseProvider' placeholder='供应商名称模糊搜索' :searchfiled="'providerName'" :config="{'apiName':'getProviderTableList','keyPath':'data.provider.providerName','resultPath':'data.content'}" :parameter="selectProvider" @choose="chooseProvider"> </fuzzy-search>
            </div>
          </div>
          <div class="col-md-9" style="color:#E09D00;text-align:right;margin-top:8px">
            <span>去税总计：{{newInvoice.purchaseSumWithoutTax}}</span>
            <span style="margin-left:40px">含税总计：{{newInvoice.purchaseSumWithTax}}</span>
            <span style="margin-left:40px">币种：{{currency}}</span>
          </div>
        </div>
        <div class="form-horizontal tableContent">
          <table class="table">
            <thead>
              <tr>
                <th>商品名称</th>
                <th>商家编码</th>
                <th>订单号</th>
                <th>税率</th>
                <th>去税单价</th>
                <th>含税单价</th>
                <th>当前未到票数</th>
                <th>维护发票数量</th>
                <th>去税总价</th>
                <th>含税总价</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody v-for="(trItem, index) in goodsList">
              <tr>
                <td :rowspan="trItem.length" vertical-align="center">{{trItem[0].sku.skuName}}</td>
                <td :rowspan="trItem.length" vertical-align="center">{{trItem[0].sku.goods.goodsCode}}</td>
                <td>{{trItem[0].orderSn}}</td>
                <td>{{trItem[0].orderGoods.taxRate}}</td>
                <td>{{getPriceWithoutTax(trItem[0].type,trItem[0].orderGoods.price,trItem[0].orderGoods.taxRate)}}</td><!-- 去税单价 -->
                <td>{{trItem[0].orderGoods.price}}</td><!-- 含税单价 -->
                <td>{{trItem[0].nonArrivalInvoiceNumber}}</td>
                <td><input class="form-control input-sm" type="number" min="1" :max="trItem[0].nonArrivalInvoiceNumber" style="width:60px" v-model="trItem[0].number"/></td>
                <td>{{getPriceWithoutTax(trItem[0].type,trItem[0].orderGoods.price,trItem[0].orderGoods.taxRate,trItem[0].number)}}</td><!-- 去税总价 -->
                 <td>{{getPriceWithTax(trItem[0].type,trItem[0].orderGoods.price,trItem[0].orderGoods.taxRate,trItem[0].number,index,0)}}</td><!-- 含税总价 -->
                <td><a @click="deleteOne(index,0)"><i class="iconfont delete-icon" >&#xe613;</i></a></td>
              </tr>
              <tr v-if="trItem.length>1&&childIndex>0" v-for="(childOrder, childIndex) in trItem">
                <td>{{trItem[childIndex].orderSn}}</td>
                <td>{{trItem[childIndex].orderGoods.taxRate}}</td>
                <td>{{getPriceWithoutTax(trItem[childIndex].type,trItem[childIndex].orderGoods.price,trItem[childIndex].orderGoods.taxRate)}}</td><!-- 去税单价 -->
                <td>{{trItem[childIndex].orderGoods.price}}</td>
                <td>{{trItem[childIndex].nonArrivalInvoiceNumber}}</td>
                <td><input class="form-control input-sm" type="number" min="1" :max="trItem[childIndex].nonArrivalInvoiceNumber" style="width:60px" v-model="trItem[childIndex].number"/></td>
                <td>{{getPriceWithoutTax(trItem[childIndex].type,trItem[childIndex].orderGoods.price,trItem[childIndex].orderGoods.taxRate,trItem[childIndex].number,trItem[childIndex].type)}}</td>
                <td>{{getPriceWithTax(trItem[childIndex].type,trItem[childIndex].orderGoods.price,trItem[childIndex].orderGoods.taxRate,trItem[childIndex].number,index,childIndex)}}</td><!-- 含税总价 -->
                <td><a @click="deleteOne(index,childIndex)"><i class="iconfont delete-icon" >&#xe613;</i></a></td>
              </tr>{{getTotalPrice()}}
            </tbody>
              <tr height="60px"><td colspan="20" style="text-align:center;vertical-align: middle;">
                <button class="btn btn-primary btn-sm" @click="isCreateInvoice=true" :disabled="goodsList.length==0">维护发票</button>
              </td></tr>
          </table>
        </div>
        <div class="form-group" style="margin-top:18px">
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
        <div class="form-group" style="float:right;margin-right:8px">
          <button class="btn btn-primary btn-sm"  @click="selectAll('null','childCheckbox')">全选</button>
          <button class="btn btn-primary btn-sm" @click="selectAll('null','childCheckbox','none')">全不选</button>
          <button class="btn btn-primary btn-sm" @click="addToTable">添加</button>
        </div>
        <div class="form-horizontal tableContent">
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
                <td>{{trItem[0].sku?trItem[0].sku.skuName:'?'}}</td>
                <td>{{trItem[0].price}}</td>
                <!-- <td>{{getInStoragePrice(trItem.orderPurchaseDetails[0])}}</td> -->
                <td>{{trItem[0].reducePrice}}</td>
                <td>{{trItem[0].nonArrivalInvoiceNumber}}</td>
                <td><input type="checkbox" :class="trItem[0].orderSn" :value="index+'-0'" v-model="indexArray"></td> 
              </tr>
              <tr v-if="trItem.length>1&&childIndex>0" v-for="(childOrder, childIndex) in trItem">
               <td>{{trItem[childIndex].sku?trItem[childIndex].sku.skuName:'?'}}</td>
                <td>{{trItem[childIndex].price}}</td>
                <!-- <td>{{getInStoragePrice(trItem.orderPurchaseDetails[0])}}</td> -->
                <td>{{trItem[childIndex].reducePrice}}</td>
                <td>{{trItem[childIndex].nonArrivalInvoiceNumber}}</td>
                <td><input type="checkbox" :class="trItem[0].orderSn" :value="index+'-'+childIndex" v-model="indexArray"></td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </section>

     <!-- 开始弹出框 -->
        <div class="popup-wrap-zn" v-if="isCreateInvoice">
          <div class="popup-content row form-inline">
            <p class="popup-title">发票信息</p>
            <div class="popup-main">
              <div class="myRow row">
                <label class="control-label col-sm-5">供应商名称：{{providerName}}</label>
                <label class="control-label col-sm-4">币种：{{currencyArray[currency]}}</label>
              </div>
              <div class="myRow row">
                <label class="control-label col-sm-3">发票号<font color="red">*</font></label>
                <div class="col-sm-6">
                  <input class="form-control input-sm" style="width:360px" placeholder="多张发票用英文逗号间隔" type="text" v-model="newInvoice.invoiceNumber">
                </div>
              </div>
              <div class="myRow row">
                <label class="control-label col-sm-3">开票时间<font color="red">*</font></label>
                <div class="col-sm-4">
                  <date-picker id="time" @choose="setInvoiceTime"></date-picker>
                </div>
              </div>
              <div class="myRow row">
                <label class="control-label col-sm-3">发票去税金额<font color="red">*</font></label>
                <div class="col-sm-4">
                  <input class="form-control input-sm" type="text" v-model="newInvoice.sumWithoutTax">
                </div>
                <label class="control-label col-sm-4">采购去税金额：{{newInvoice.purchaseSumWithoutTax}}</label>
              </div>
              <div class="myRow row">
                <label class="control-label col-sm-3">发票含税金额<font color="red">*</font></label>
                <div class="col-sm-4">
                  <input class="form-control input-sm" type="text" v-model="newInvoice.sumWithTax">
                </div>
                <label class="control-label col-sm-4">采购含税金额：{{newInvoice.purchaseSumWithTax}}</label>
              </div>
            </div>
            <div class="popup-footer">
              <button class="btn btn-sm btn-primary" @click="submitNewInvoice"><i class="fa fa-check"></i>确认</button>
              <button class="btn btn-sm btn-default" @click="isCreateInvoice=false"><i class="fa fa-reply"></i>取消</button>
            </div>
          </div>
        </div>
        <!-- 结束弹出框 -->
  </div>
</template>

<script>
import initStyle from '../../../common/initStyle'
import http from '../../../common/http'
import api from '../../../common/api'
import datePicker from '../../../component/datePicker'
import fuzzySearch from '../../../component/fuzzySearch'
import searchSkuName from '../../../component/searchSkuName'
import deepClone from '../../../common/deepClone'
import dateRangePicker from '../../../component/dateRangePicker'
import {getDateStr} from '../../../common/getDateStr'

var _self = {};
export default {
  components: {
    datePicker,
    fuzzySearch,
    dateRangePicker,
    searchSkuName,
  },
  data () {
    return {
      isCreateInvoice:false,
      currency:'',      //币种
      providerName:'',  
      newInvoice:{
        invoiceNumber:'',   //发票号
        providerId:'',    //供应商id
        sumWithoutTax:'',
        sumWithTax:'',
        purchaseSumWithoutTax:'',
        purchaseSumWithTax:'',
        invoiceTime:'',
        OrderPurchaseInvoiceDetails:[],
      },
      goodsList:[],   //用于显示
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
      tableList:[],
      indexArray:[],
      currencyArray: {  //币种数组
        RMB: '人民币',
        US: '美元',
      }, 
      //模糊搜索参数
      selectProvider:{    //模糊查询参数
        data:{
          provider:{
            providerName:'',  //供应商名称
          },
          offset: 0,
          length: 10,
        }
      }
    }
  },
  mounted () {
    _self = this;
    this.$nextTick(() => {
        initStyle();
    });
    _self.searchData.purchaseOrderStartTime=getDateStr(-90,true);     //设置默认时间
    _self.searchData.purchaseOrderEndTime=getDateStr(0,true);
  },
  methods: {
    //未到票数量=
    exportExcel(){
      layer.msg("导出功能尚未实现！", {time: 2000});
    },
    chooseProvider(res){  //选择新建供应商退货的供应商id
      if(res){   //选择
        _self.searchData.providerId=res.providerId;
        _self.newInvoice.providerId=res.providerId;
        _self.currency=res.currency;
        _self.providerName=res.providerName;
      }else{    //清空
        _self.newInvoice.providerId='';
         _self.searchData.providerId='';
        _self.providerName='';
        _self.currency='';
      }
    },
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
    setInvoiceTime(result) {        //预期入库时间
      _self.newInvoice.invoiceTime = result.data;
    },
//查询采购单并添加到提交列表中----开始
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
      _self.newInvoice.purchaseSumWithTax=totalPriceWithTax.toFixed(2);
      _self.newInvoice.purchaseSumWithoutTax=totalPriceWithoutTax.toFixed(2);
    },
    addToTable(){       //将选中的结果添加到表格中
      if(_self.indexArray.length<1){
        layer.msg("请先选择要添加的订单！", {time: 2000});
      }
      var result=new Array();
      for(var i=0;i<_self.indexArray.length;i++){
        var indexa=_self.indexArray[i].split('-')[0];
        var indexb=_self.indexArray[i].split('-')[1];
        var skuId='skuId_'+_self.tableList[indexa][indexb].sku.skuId;
        var goods=new Object();
          goods=deepClone(_self.tableList[indexa][indexb]);
          // showMessage("deepClone---(_self.tableList[indexa][indexb])");
          // showMessage(_self.tableList[indexa][indexb]);
          // return ;
          goods['skuId']=_self.tableList[indexa][indexb].sku.skuId;
          goods['number']='1';     //申请退货数量
          goods['sumWithoutTax']='';
          goods['sumWithTax']='';
        var s=_self.insertObjToSimpleArrayGroup(_self.goodsList,goods,'skuId','orderSn');
        if(s!='success'){
          layer.alert(s, {icon: 10});
        }
      }
      //_self.getTotalPrice();
    },
    deleteOne(index,childIndex){      //删除商品
      if(_self.goodsList[index].length>1){
        _self.goodsList[index].splice(childIndex, 1);   
      }else{
        _self.goodsList.splice(index, 1);   
      }
    },
    getInStoragePrice(goodsDetail){     //获得采购入库价=  [（单价*下单数）-票扣]/下单数
      var p= (goodsDetail.unitPrice*goodsDetail.purchaseNumber-goodsDetail.reducePrice)/goodsDetail.purchaseNumber;
      return p.toFixed(2);
    },
//查询采购单并添加到提交列表中----结束
    getOrderPurchaseInvoiceDetails(){      //从显示列表中获得需要提交的数据
      _self.newInvoice.OrderPurchaseInvoiceDetails=[];
      for(var i=0;i<_self.goodsList.length;i++){
        for(var j=0;j<_self.goodsList[i].length;j++){
          _self.newInvoice.OrderPurchaseInvoiceDetails.push({
            sourceDetailId:_self.goodsList[i][j].sourceDetailId,
            type:_self.goodsList[i][j].type,
            skuId:_self.goodsList[i][j].sku.skuId,
            skuCode:_self.goodsList[i][j].sku.skuCode,
            number:_self.goodsList[i][j].number,
            sumWithTax:_self.goodsList[i][j].sumWithTax,
            sumWithoutTax:_self.goodsList[i][j].sumWithoutTax,
          });
        }
      }
    },
    getTableList(){     //查询采购单
      // if(_self.searchData.providerId==''){
      //   layer.tips('请先选择供应商！', '#chooseProvider',{tips:[2,'red'], time: 2000});
      //   $("#chooseProvider").focus();
      //   return ;
      // }
      _self.tableList=[];
      _self.selectAll('null','childCheckbox','none');
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
    //////////////
    submitNewInvoice(){        
      if(_self.newInvoice.invoiceNumber==''||_self.newInvoice.providerId==''
        ||_self.newInvoice.invoiceTime==''||_self.newInvoice.sumWithoutTax==''
        ||_self.newInvoice.sumWithTax==''){
        layer.msg("请填完所有的必填项！", {time: 2000});
        return ;
      }
      _self.getOrderPurchaseInvoiceDetails();
      _self.isCreateInvoice = false;
// showMessage("新建发票");
// showMessage(_self.newInvoice);
//       return ;
      http({
        instance: _self,
        url: api.invoiceAdd,    
        type: 'post',
        data:{"data":_self.newInvoice,},//         shop/search
        success (res) {
          if(res.success){
            layer.alert('发票创建成功！发票号为：' + res.data.orderPurchaseInvoiceId, {icon: 6});
            _self.newInvoice.OrderPurchaseInvoiceDetails=[];
            _self.goodsList=[];
          }else{
            layer.msg("操作失败！", {time: 2000});
          }
        }
      });   
    },
    groupByIndex(objectArray, path) { 
      var group = new Object();
      var groupArray=new Array();
      for (var i = 0; i < objectArray.length; i++) {
        var index = 'group_'+objectArray[i][path];
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
    insertObjToSimpleArrayGroup(group,obj,path,uniquePath){
      for(var i=0;i<group.length;i++){
        if(group[i][0][path]==obj[path]){ //应该加到该数组中
          if(typeof(uniquePath)=='undefined'){
            group[i].push(obj);
            return 'success';
          }
          for(let k=0;k<group[i].length;k++){
            if(group[i][k][uniquePath]==obj[uniquePath]){
              return "请勿重复添加！"+obj[uniquePath];
            }
          }//该数组没有重复的
          group[i].push(obj);
          return 'success';
        }
      }
      group.push(new Array(obj));
      return 'success';
    }
  }
}
</script>

<style scoped>
.pointer{cursor: pointer;} 
.tableContent{
    margin: 10px 0 0 0;
}
.form-inline .form-control {
      display: inline-block;
      width: 175px;
      vertical-align: middle;
  }
  .form-inline .control-label {
      margin-top: 6px;
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
  .popup-content {
    position: absolute;
    top: 12%;
    left: 44%;
    width: 570px;
    /*min-height: 366px;*/
    margin-left: -230px;
    background-color: #fff;
    border-radius: 5px;
    z-index: 999;
  }
  .myRow{
      margin-bottom: 10px;
    }
  .control-label{
    text-align: right;
  }
  .popup-title {
      text-align: left;
      border-bottom: 1px solid #d2d6de;
      padding:10px;
      font-size: 16px;
      margin-bottom: 0;
  }
  .popup-main {
      padding-left: 20px;
      padding-top: 15px;
      height: 215px;
  }
  .popup-footer {
      width: 100%;
      text-align: right;
      padding: 10px;
      border-top: 1px solid #d2d6de;
  }
</style>