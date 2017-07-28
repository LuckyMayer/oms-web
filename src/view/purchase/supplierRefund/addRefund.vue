<template>
  <div class="content-wrapper">
    <section class="content-header">
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-desktop"></i>采购</a></li>
        <li class="active">退货订单</li>
        <li class="active">退货列表</li>
        <li class="active">新建退货单</li>
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
          <div class="col-md-3">
            <label class="col-sm-4 control-label required">退货仓库</label>
            <div class="col-sm-8">
              <fuzzy-search id='chooseWarehouse' placeholder='退货仓库模糊搜索' :searchfiled="'warehouseName'" :config="{'apiName':'getWarehouseNameList'}" @choose="chooseWarehouse"> </fuzzy-search>
            </div>
          </div>
          <div class="col-md-3">
            <label class="col-sm-4 control-label">物流方式</label>
            <div class="col-sm-8">
             <fuzzy-search id='chooseShipping' placeholder='物流方式模糊搜索' :searchfiled="'shippingName'" :config="{'apiName':'getShipingList'}" @choose="chooseShipping"> </fuzzy-search>
            </div>
          </div>
          <div class="col-md-3"></div>
        </div>
        <div class="form-group">
          <div class="col-md-3">
            <label class="col-sm-4 control-label">库存状态</label>
            <div class="col-sm-8" style="padding-top:5px">
              <input type="radio" id="one" value="INV_STTS_AVAILABLE" v-model="newGt.statusId">
              <label class="pointer" for="one">全新</label>
              <input type="radio" id="two" value="INV_STTS_USED" v-model="newGt.statusId">
              <label class="pointer" for="two">二手</label>
            </div>
          </div>
          <div class="col-md-3">
            <label class="col-sm-4 control-label">退款类型</label>
            <div class="col-sm-8">
              <select class="form-control select-sm" v-model="newGt.returnType">
                <option v-for="(item,index) in returnTypeArray" :value="index">{{item}}</option>
              </select>
            </div>
          </div>
          <div class="col-md-3">
            <label class="col-sm-4 control-label">退款方式</label>
            <div class="col-sm-8">
              <select class="form-control select-sm" v-model="newGt.refundType">
                <option v-for="(item,index) in refundTypeArray" :value="index">{{item}}</option>
              </select>
            </div>
          </div>
          <div class="col-md-2"><label class="control-label">币种:{{currency}}</label></div>
        </div>
        <div class="form-group">
          <div class="col-md-6">
            <label class="col-sm-4 control-label">内部留言</label>
            <div class="col-sm-8">
              <textarea class="form-control" v-model="newGt.intervalNote"></textarea>
            </div>
          </div>
          <div class="col-md-6" style="margin-left: -8.45%;">
            <label class="col-sm-4 control-label">仓库留言</label>
            <div class="col-sm-8">
              <textarea class="form-control" v-model="newGt.warehouseNote"></textarea>
            </div>
          </div>
        </div>
        <div class="form-group">
          <div class="col-md-8"></div>
          <div class="col-md-4">
            <label class="col-sm-6 control-label textAlignLeft"><a href="#">采购商品明细模板</a></label>
            <div class="col-sm-6">
              <button class="btn btn-primary btn-sm" @click="batchImport">批量导入商品</button>
            </div>
          </div>
        </div>
        <div class="form-horizontal tableContent">
          <table class="table table-condensed">
            <thead>
              <tr>
                <th>商品名称</th>
                <th>指定批次</th>
                <th>指定生产日期</th>
                <th>申请退货数量数</th>
                <th>退货单价</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody v-for="(trItem, index) in gtGoodsList">
              <tr>
                <td vertical-align="center">{{trItem.skuName}}</td>
                <td vertical-align="center">
                  <input class="form-control input-sm" type="text" placeholder="指定批次" v-model="trItem.batchNo"/></td> 
                <td vertical-align="center">
                  <date-picker class="timeStyle" :id="'productDate_'+index" @choose="setTime" :init-date-time="trItem.productDate" :placeholder="'请选择生产日期'" :format="'YYYY-MM-DD'"></date-picker></td>
                <td>
                  <input class="form-control input-sm" type="number" min="1" v-model="trItem.number"/>
                 
                </td>
                <td vertical-align="center">
                  <input class="form-control input-sm" type="text" placeholder="价格必填" v-model="trItem.price"/>
                </td>
                <td>
                   <a @click="deleteOne(index)" style="display: inline-block;"><i class="iconfont delete-icon" >&#xe613;</i></a>
                </td>
              </tr>
            </tbody>
              <tr height="60px"><td colspan="20" style="text-align:center;vertical-align: middle;">
                <button class="btn btn-primary btn-sm" @click="createGT" :disabled="gtGoodsList.length==0||newGt.providerId==''||newGt.warehouseId==''">申请退货</button>
              </td></tr>
          </table>
        </div>
        <div class="form-group" style="margin-top:18px;padding-top:20px;border-top: 20px solid #F0F3F4; ">
          <div class="col-md-3">
            <label class="col-sm-4 control-label">商品名称</label>
            <div class="col-sm-8">
              <fuzzy-search id='chooseAddGoods' placeholder='商品名称模糊搜索' :searchfiled="'skuName'" :config="{'apiName':'searchSkuNameList','resultPath':'data.content'}" @choose="chooseAddGoods"> </fuzzy-search>
            </div>
          </div>
          <div class="col-md-3">
            <label class="col-sm-5 control-label">商品条码</label>
            <div class="col-sm-7">
               <search-sku-name  ref="childSearchSku" @choose="chooseSkuName" @change="clearSkuMessage"></search-sku-name>
            </div>
          </div> 
          <div class="col-md-2" style="padding: 0px;">
            <label class="col-sm-4 control-label">退货数量</label>
            <div class="col-sm-8">
              <input type="number" min="1" v-model="addGoods.number" class="form-control input-sm"/>
            </div>
          </div>
          <div class="col-md-2" style="padding: 0px;">
            <label class="col-sm-4 control-label">退货金额</label>
            <div class="col-sm-8">
              <input type="text" v-model="addGoods.price" class="form-control input-sm"/>
            </div>
          </div>
          <div class="col-md-2">
           <button class="btn btn-primary btn-sm" @click="addSingleGoodsToTable">添加</button>
          </div>
        </div>
        <div class="form-group nopadding">
          <div class="col-md-3">
            <label class="col-sm-4 control-label">采购单号</label>
            <div class="col-sm-8">
              <input type="text" v-model="searchData.orderSn" class="form-control input-sm"/>
            </div>
          </div>
          <div class="col-md-3">
            <label class="col-sm-5 control-label">供应商采购单号</label>
            <div class="col-sm-7">
              <input type="text" v-model="searchData.providerOrderPurchaseSn" class="form-control input-sm"/>
            </div>
          </div>
          <div class="col-md-2">
           <button class="btn btn-sm btn-primary" :disabled="searchData.orderSn==''&&searchData.providerOrderPurchaseSn==''" @click="getTableList">引用采购单</button>
          </div>
          <div class="col-md-2">
           <button class="btn btn-primary btn-sm" @click="addToTable">添加</button>
          </div>
        </div>
        <div class="form-horizontal tableContent">
          <table class="table table-condensed">
            <thead>
              <tr>
                <th><input type="checkbox" :id="'selectAll'" @click="selectAll('selectAll','childCheckbox')"></th>
                <th>商品名称</th>
                <th>采购入库单价</th>
                <th>使用票扣</th>
                <th>采购单价</th>
                <th>采购到货数量</th>
                <th>退货数量</th>
                <th>退货单价</th>
              </tr>
            </thead>
            <tbody v-for="(goods, index) in tableList">
              <tr>
                <td><input type="checkbox" class="childCheckbox" :value="index" v-model="indexArray"></td> 
                <td>{{goods.sku.skuName}}</td> 
                <td>{{getInStoragePrice(goods)}}</td>
                <td>{{goods.reducePrice}}</td>
                <td>{{goods.unitPrice}}</td>
                <td>{{goods.purchaseNumber}}</td>
                <td> <input type="number" min="1" class="form-control input-sm" v-model="goods.add_number"/></td>
                <td> <input type="text" class="form-control input-sm" v-model="goods.add_price"/></td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </section>
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
      newGt:{
        providerId:'',    //供应商id
        warehouseId:'',   //退货仓id
        shippingId:'',    //物流方式
        statusId:'INV_STTS_AVAILABLE',      //库存状态
        returnType:'SUPPLIER_RETURN',    //退款类型
        refundType:'BANK',    //退款方式
        intervalNote:'',   //内部留言
        warehouseNote:'',   //仓库留言
        orderGtDetails:[],
      },
      gtGoodsList:[],   //用于显示
      currency:'',      //币种

      searchData:{    //查询采购单
        orderSn:'',
        providerOrderPurchaseSn:'',   //供应商采购单号
        offset: 0,
        length: 50,
      },

      addGoods:{
        skuName:'',
        skuId:'',
        number:'',
        price:'',
      },

      tableList:[],
      indexArray:[],
      returnTypeArray: {        //退款类型
        SUPPLIER_RETURN:'供应商退货',  
        INCORRECT_WAREHOUSE:'仓库错入库',
        TURN_INTO_OTHER_GOODS:'转为其他品',
      }, 
      refundTypeArray: {        //退款方式
        BANK:'银行',
        CASH:'现金',   
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
  },
  methods: {
    exportExcel(){
      layer.msg("导出功能尚未实现！", {time: 2000});
    },
    chooseSkuName (result) {    //将用户选择的sku信息加入到addGoods中
       _self.addGoods.skuId=result.data.skuId;
       _self.addGoods.skuName=result.data.skuName;
    },
    clearSkuMessage(){
      _self.addGoods.skuId='';
      _self.addGoods.skuName='';
    },
    setTime(res){
      //console.log(res);
      var index=res.componentId.split('_')[1];
      _self.$set(_self.gtGoodsList[index], 'productDate', res.data);
    },
    chooseProvider(res){  //选择新建供应商退货的供应商id
      if(res){   //选择
        _self.newGt.providerId=res.providerId;
        _self.currency=res.currency;
      }else{    //清空
        _self.newGt.providerId='';
        _self.currency='';
      }
    },
    chooseWarehouse(res){         //选择退货仓库
        if(res){
          _self.newGt.warehouseId=res.warehouseId;
        }else{
          _self.newGt.warehouseId='';
        }
    },
    chooseShipping(res){      //选择了快递方式
      if(res){
        _self.newGt.shippingId=res.shippingId;
      }else{
        _self.newGt.shippingId='';
      }
    },  
    chooseAddGoods(res){
      if(res){
        _self.addGoods.skuId=res.skuId;
        _self.addGoods.skuName=res.skuName;
      }else{
        _self.addGoods.skuId='';
        _self.addGoods.skuName='';
      }
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
    addToTable(){       //将选中的结果添加到表格中    CG2017041617721879
      if(_self.indexArray.length==0){
        layer.msg("请先在下表中选择商品！", {time: 2000});
      }
      for(var i=0;i<_self.indexArray.length;i++){
        if(_self.isSkuInArray(_self.tableList[_self.indexArray[i]].sku.skuId)){
          layer.msg("请勿重复添加："+_self.tableList[_self.indexArray[i]].sku.skuName+"！", {time: 2000});
          return ;
        }
        _self.gtGoodsList.push({
          skuName:_self.tableList[_self.indexArray[i]].sku.skuName,
          skuId:_self.tableList[_self.indexArray[i]].sku.skuId,
          batchNo:'',
          productDate:'',
          price:_self.tableList[_self.indexArray[i]].add_price,
          number:_self.tableList[_self.indexArray[i]].add_number,
        });
      }
    },
    addSingleGoodsToTable(){
      if(_self.addGoods.skuId==''){
        layer.msg("请先在左边输入框选择商品！", {time: 2000});
        return ;
      }
      if(_self.isSkuInArray(_self.addGoods.skuId)){
        layer.msg("请勿重复添加："+_self.addGoods.skuName+"！", {time: 2000});
        return ;
      }
      _self.gtGoodsList.push({
        skuName:_self.addGoods.skuName,
        skuId:_self.addGoods.skuId,
        batchNo:'',
        productDate:'',
        price:_self.addGoods.price,
        number:_self.addGoods.number,
      });
    },
    isSkuInArray(addedSkuId){
      for(var i=0;i<_self.gtGoodsList.length;i++){
        if(_self.gtGoodsList[i]['skuId']==addedSkuId){
          return true;
        }
      }
      return false;
    },
    deleteOne(index){      //删除商品
      _self.gtGoodsList.splice(index, 1);  
    },
    getReturnNum(trItem){     //获得仓库应退数量
      var num=0;
      for(var i=0;i<trItem.goodsDetail.length;i++){
        num+=parseInt(trItem.goodsDetail[i].number);
      }
      return num;
    },
    getInStoragePrice(goodsDetail){     //获得采购入库价=  [（单价*下单数）-票扣]/下单数
      var p= (goodsDetail.unitPrice*goodsDetail.purchaseNumber-goodsDetail.reducePrice)/goodsDetail.purchaseNumber;
      return p.toFixed(2);
    },
//查询采购单并添加到提交列表中----结束
    getOrderGtDetails(){      //从显示列表中获得需要提交的数据
      _self.newGt.orderGtDetails=[];
      for(var i=0;i<_self.gtGoodsList.length;i++){
        _self.newGt.orderGtDetails.push({
          skuId:_self.gtGoodsList[i].skuId,
          number:_self.gtGoodsList[i].number,
          price:_self.gtGoodsList[i].price,
          productDate:_self.gtGoodsList[i].productDate,  
          batchNo:_self.gtGoodsList[i].batchNo,
        });
      }
    },
    getTableList(){     //查询采购单
      _self.tableList=[];
      _self.indexArray=[];
      http({
        instance: _self,
        url: api.purchaseList,     
        type: 'post',
        data:{"data":_self.searchData,},//         
        success (res) {
          if(res.data.totalCount>0){
            _self.tableList=res.data.content[0].orderPurchaseDetails;
            _self.tableList.forEach(function (item,index) {
              _self.$set(item, 'add_number', item.purchaseNumber);
              _self.$set(item, 'add_price', item.unitPrice);
            });
          }else{
            layer.msg("<span style='color:red'>好像没有查到数据 !</span>", {icon: 5});
          }
        }
      }); 
    },
    batchImport(){
      layer.msg("导入功能尚未实现！", {time: 2000});
    },
    createGT(){        
      _self.getOrderGtDetails();
      http({
        instance: _self,
        url: api.createGt,     //searchData
        type: 'post',
        data:{"data":_self.newGt,},//         shop/search
        success (res) {
          if(res.success){
            layer.alert('退货单创建成功！退货单号为：' + res.data.orderSn, {icon: 6});
            _self.newGt.orderGtDetails=[];
            _self.gtGoodsList=[];
          }else{
            layer.msg("创建失败！", {time: 2000});
          }
        }
      });   
    }
  }
}
   

</script>

<style scoped>
.pointer{
  cursor: pointer;
}
input[type=checkbox] {  
  cursor: pointer;
}  
input[type=radio] {  
  cursor: pointer;
} 


.timeStyle{
    padding-left: 0px;
    padding-right: 0px;
}
</style>