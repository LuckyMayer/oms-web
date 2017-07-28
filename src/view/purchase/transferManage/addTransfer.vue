<template>
  <div class="content-wrapper">
    <section class="content-header">
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-desktop"></i>采购</a></li>
        <li class="active">调拨单</li>
        <li class="active">新建调拨单</li>
      </ol>
    </section>

    <section class="content addPurchase content_yjlu">
      <div class="row form-horizontal searchContent">
        <div class="form-group">
          <div class="col-md-4">
            <label class="col-sm-4 control-label required">调拨类型</label>
            <div class="col-sm-8">
              <select class="form-control select-sm" v-model="newDt.type">
                <option v-for="(item,index) in typeArray" :value="index">{{item}}</option>
              </select>
            </div>
          </div>
          <div class="col-md-4">
            <label class="col-sm-4 control-label required">出货仓</label>
            <div class="col-sm-8">
              <fuzzy-search id='chooseOutWarehouse' placeholder='出货仓模糊搜索' :searchfiled="'warehouseName'" :config="{'apiName':'getWarehouseNameList'}" @choose="chooseOutWarehouse"> </fuzzy-search>
            </div>
          </div>
          <div class="col-md-4">
            <label class="col-sm-4 control-label required">入货仓</label>
            <div class="col-sm-8">
              <fuzzy-search id='chooseInWarehouse' placeholder='入货仓模糊搜索' :searchfiled="'warehouseName'" :config="{'apiName':'getWarehouseNameList'}" @choose="chooseInWarehouse"> </fuzzy-search>
            </div>
          </div>
        </div>
        <div class="form-group">
          <div class="col-md-4">
            <label class="col-sm-4 control-label">库存状态</label>
            <div class="col-sm-8" style="padding-top:5px">
              <input class="pointer" type="radio" id="one" value="INV_STTS_AVAILABLE" v-model="newDt.statusId">
              <label class="pointer" for="one">全新</label>
              <input class="pointer" type="radio" id="two" value="INV_STTS_USED" v-model="newDt.statusId">
              <label class="pointer" for="two">二手</label>
              <input class="pointer" type="radio" id="three" value="INV_STTS_DEFECTIVE" v-model="newDt.statusId">
              <label class="pointer" for="three">破损</label>
            </div>
          </div>
          <div class="col-md-4">
            <label class="col-sm-4 control-label required">预期入库时间</label>
            <div class="col-sm-8">
              <date-picker id="time" needhms="true" @choose="setPredictInTime"></date-picker>
            </div>
          </div>
          <div class="col-md-4">
            <label class="col-sm-4 control-label" :class="{'required':newDt.type == 'DIFFERENT_WAREHOUSE_DT'}">物流方式</label>
            <div class="col-sm-8">
              <input v-if="newDt.type != 'DIFFERENT_WAREHOUSE_DT'" class="form-control input-sm" type="text" readonly="readonly" placeholder="同仓/虚拟调拨物流方式不可填"/>
              <fuzzy-search v-else id='chooseShipping' placeholder='物流方式模糊搜索'  :searchfiled="'shippingName'" :config="{'apiName':'getShipingList'}" @choose="chooseShipping"> </fuzzy-search>
            </div>
          </div>
        </div>
        <div class="form-group">
          <div class="col-md-4">
            <label class="col-sm-4 control-label">内部留言</label>
            <div class="col-sm-8">
              <textarea class="form-control" v-model="newDt.internalNote"></textarea>
            </div>
          </div>
          <div class="col-md-4">
            <label class="col-sm-4 control-label">出货仓留言</label>
            <div class="col-sm-8">
              <textarea class="form-control" v-model="newDt.sourceWarehouseNote"></textarea>
            </div>
          </div>
          <div class="col-md-4">
            <label class="col-sm-4 control-label">入货仓留言</label>
            <div class="col-sm-8">
              <textarea class="form-control" v-model="newDt.destinationWarehouseNote"></textarea>
            </div>
          </div>
        </div>
        <div class="form-group">
          <div class="col-md-8"></div>
          <div class="col-md-4">
            <label class="col-sm-6 control-label textAlignLeft"><a href="#">采购商品明细模板</a></label>
            <div class="col-sm-6">
              <button class="btn btn-primary btn-sm">批量导入商品</button>
            </div>
          </div>
        </div>


          <div class="form-group">
              <div class="col-md-4">
                <label class="col-sm-3 control-label">商品名称</label>
                <div class="col-sm-8">
                  <fuzzy-search ref="childAddGoods" id='chooseAddGoods' placeholder='商品名称模糊搜索' :searchfiled="'skuName'" :config="{'apiName':'searchSkuNameList','resultPath':'data.content'}" @choose="chooseAddGoods" > </fuzzy-search>
                </div>
              </div>
              <div class="col-md-4">
                <label class="col-sm-6 control-label">商品条码/商家编码</label>
                <div class="col-sm-6">
                 <search-sku-name  ref="childSearchSku" @choose="chooseSkuName" @change="clearSkuMessage"></search-sku-name>
                </div>
              </div>
              <div class="col-md-3">
                <label class="col-sm-6 control-label">调拨数量</label>
                <div class="col-sm-6">
                  <input class="form-control input-sm" type="number" min="1" v-model="addGoods.number">
                </div>
              </div>
              <div class="col-md-1">
                <button class="btn btn-primary btn-sm" @click="addToTable">添加</button>
              </div>
            </div>


      <div class="form-horizontal tableContent">
        <table class="table">
          <thead>
            <tr>
              <th>商品名称</th>
              <th>商品条码</th>
              <th>箱规</th>
              <th>指定批次</th>
              <th>指定生产日期</th>
              <th>调拨数量</th>
              <th>整箱</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(trItem, index) in newDt.orderGoodsList">
              <td>{{trItem.skuName}}</td>
              <td>{{trItem.barcode}}</td>
              <td>{{trItem.boxVolume}}</td>
              <td><input class="form-control input-sm" type="text" v-model="trItem.batchNo"/></td> 
              <td><input class="form-control input-sm" type="text" placeholder="YYYY-MM-DD" v-model="trItem.productDate"/></td> 
              <td><input class="form-control input-sm" style="width:50px" type="number" v-model="trItem.number"/></td> 
              <td>{{getNum(trItem.boxVolume,trItem.number)}}</td>
              <td>
                <a href="javascropt:void(0);" data-toggle="tooltip" data-placement="right" class="text-red" @click="del(index)" ><i class="fa fa-trash"></i></a>

              </td>
            </tr>
          </tbody>
        </table>
        <div style="text-align:center">
            <button class="btn btn-primary btn-sm" @click="createDT" :disabled="newDt.orderGoodsList.length==0">申请调拨</button>
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
import deepClone from '../../../common/deepClone'
import searchSkuName from '../../../component/searchSkuName'

var _self = {};
export default {
  components: {
    datePicker,
    fuzzySearch,
    searchSkuName,
  },
  data () {
    return {
      newDt:{
        sourceWarehouseId:'',   //出货仓
        destinationWarehouseId:'',   //入货仓
        sourceWarehouseNote:'',   //出货仓留言
        destinationWarehouseNote:'',   //入货仓留言
        type:'SAME_WAREHOUSE_DT',   //调拨类型
        shippingId:'',   //物流方式
        statusId:'INV_STTS_AVAILABLE',   //库存状态
        internalNote:'',   //内部留言
        predictInTime:'',   //预期入库时间
        orderGoodsList:[],    //商品列表
      },  
      addGoods:{
        skuName:'',     //提交前需要删除
        barcode:'',    //商品条码
        boxVolume:'',  //箱规

        skuId:'',  
        batchNo:'',               //批次
        productDate:'',               //日期
        number:'',           //数量
      },

      typeArray: {  //调拨类型数组
        SAME_WAREHOUSE_DT: '同仓调拨',
        DIFFERENT_WAREHOUSE_DT: '异仓调拨',
        VIRTUAL_WAREHOUSE_DT: '虚拟调拨',
      },  
      
    }
  },
  mounted () {
    _self = this;
    this.$nextTick(() => {
        initStyle();
    });
  },
  methods: {
    setPredictInTime(result) {        //预期入库时间
      _self.newDt.predictInTime = result.data;
    },
    chooseOutWarehouse(res){         //选择出库仓
        if(res){
          _self.newDt.sourceWarehouseId=res.warehouseId;
        }else{
          _self.newDt.sourceWarehouseId='';
        }
    },
    chooseInWarehouse(res){         //选择入库仓
        if(res){
          _self.newDt.destinationWarehouseId=res.warehouseId;
        }else{
          _self.newDt.destinationWarehouseId='';
        }
    },
    chooseShipping(res){      //选择了快递方式
      if(res){
        _self.newDt.shippingId=res.shippingId;
      }else{
        _self.newDt.shippingId='';
      }
    },  
    getNum(boxVolume,goodsNumber){
      if(typeof(boxVolume)=='undefined'||boxVolume==0){
        return '？';
      }else{
        var boxNum=Math.floor(goodsNumber / boxVolume);
        var rest=goodsNumber-boxNum*boxVolume;
        return (rest==0) ? boxNum+"箱": boxNum+"箱又"+rest+"件";
      }
    },
    chooseSkuName (result) {    //将用户选择的sku信息加入到addGoods中
      _self.addGoods.boxVolume=result.data.goods.boxVolume;      //得到箱规
      _self.addGoods.barcode=result.data.barcode;               //得到商品条码
      _self.addGoods.skuId=result.data.skuId;
      _self.addGoods.skuName=result.data.skuName;
      _self.$refs.childSearchSku.goodsCode=result.data.skuName;  
    },
    clearSkuMessage(){
      // _self.addGoods.skuName='';
      // _self.addGoods.skuId='';
      // _self.addGoods.barcode='';
      // _self.addGoods.boxVolume='';
      // _self.addGoods.number='';
    },
    chooseAddGoods(res){
      if(res){
        _self.addGoods.skuName=res.skuName;
        _self.addGoods.skuId=res.skuId;
        _self.addGoods.barcode=res.barcode;
        var goodsId=res.goods.id;
        http({
          instance: _self,
          url: api.getGoodsDetail_yjlu,     //得到商品信息
          type: 'post',
          data:{"data":{goodsId:goodsId,},},  //         
          success (res) {
            _self.addGoods.boxVolume=res.data.boxVolume;      //得到箱规
          }
        });   
      }else{
        _self.clearSkuMessage();
      }
    },
    clearAddGoods(){
      _self.$refs.childAddGoods.userInput='';    //清空子组件的用户输入
      _self.$refs.childSearchSku.goodsCode='';    //清空子组件的用户输入
      _self.clearSkuMessage();
    },
    addToTable(){
      if(_self.addGoods.skuId==''){
        layer.msg("请先选择商品!", {time: 2000});
        return;
      }
      for(var i=0;i<_self.newDt.orderGoodsList.length;i++){
        if(_self.newDt.orderGoodsList[i].skuId==_self.addGoods.skuId){
          layer.msg("请勿重复添加!", {time: 2000});
          return ;
        }   
      }
      _self.newDt.orderGoodsList.push(deepClone(_self.addGoods));
      _self.clearAddGoods();
    },
    del(index){
      _self.newDt.orderGoodsList.splice(index, 1);
    },
    checkUserInput(){
      if(_self.newDt.sourceWarehouseId==''){
        layer.msg("请先选择出货仓！", {time: 2000});
        return true;
      }else if(_self.newDt.destinationWarehouseId==''){
        layer.msg("请先选择入货仓！", {time: 2000});
        return true;
      }else if(_self.newDt.shippingId==''&&_self.newDt.type=='DIFFERENT_WAREHOUSE_DT'){
        layer.msg("请先选择物流方式！", {time: 2000});
        return true;
      }
      return false
    },
    createDT(){            //全选
      // if(_self.newDt.type=='SAME_WAREHOUSE_DT'){
      //   _self.newDt.destinationWarehouseId=_self.newDt.sourceWarehouseId;
      // }
      if(_self.checkUserInput()){
        return;
      };
      http({
        instance: _self,
        url: api.createDt,     //searchData
        type: 'post',
        data:{"data":_self.cloneSku(_self.newDt),},//         shop/search
        success (res) {
          if(res.success){
            layer.alert('调拨单创建成功！调拨单号为：' + res.data.orderSn, {icon: 6});
            _self.$router.push({name: 'searchTransfer'});
            //_self.newDt.orderGoodsList=[];
          }else{
            layer.msg("操作失败", {time: 2000});
          }
        }
      });   
    },
    cloneSku(obj){
      if (obj === null || typeof obj !== 'object') {
        return obj;
      }
      var temp = obj.constructor();
      for (var key in obj) {
        if(key!='skuName'&key!='barcode'&key!='boxVolume'){
          temp[key] = this.cloneSku(obj[key]);
        }
      }
      return temp;
    }
  }
}

</script>
<style scoped>
.pointer{cursor: pointer;} 
</style>