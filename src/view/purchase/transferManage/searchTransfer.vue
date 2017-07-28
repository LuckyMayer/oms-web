<template>
  <div class="content-wrapper">
    <section class="content-header clearfix">
      <ol class="breadcrumb col-md-6">
          <li><a href="#"><i class="fa fa-desktop"></i>采购</a></li>
          <li class="active">调拨列表</li>
      </ol>
      <div class="col-md-6" style="text-align: right; position: relative; top: 10px;">    
        <button class="btn btn-sm btn-primary" @click="addNewRefund"><i class="fa fa-plus"></i>新建调拨单</button>
      </div>
    </section>

    <!-- Main content -->
    <section class="content purchaseDetail content_yjlu">
      <div class="row form-horizontal searchContent bgFFF">
        <div class="col-md-4">
          <div class="form-group">
            <label class="control-label col-sm-4">调拨单号</label>
            <div class="col-sm-8">
              <input class="form-control input-sm" type="text" v-model="searchData.orderSn">
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-4">订单状态</label>
            <div class="col-sm-8">
              <select class="form-control select-sm" v-model="searchData.status">
                <option value="">--所有--</option>
                <option v-for="(item,index) in orderStatusArray" :value="index">{{item}}</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-4">调拨类型</label>
            <div class="col-sm-8">
              <select class="form-control select-sm" v-model="searchData.type">
                <option value="">--所有--</option>
                <option v-for="(item,index) in transferTypeArray" :value="index">{{item}}</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-4">订单时间</label>
            <div class="col-sm-8">
              <date-range-picker id="updateTime" :needhms="true" @get_date="getUpdateTime" :miniwidth="true" :start-time="searchData.startTime" :end-time="searchData.endTime"></date-range-picker>
            </div>
          </div>
        </div>
        <div class="col-md-4">
           <div class="form-group">
            <label class="control-label col-sm-4">商品名称</label>
            <div class="col-sm-8">
               <fuzzy-search ref="childAddGoods" id='chooseAddGoods' placeholder='商品名称模糊搜索' :searchfiled="'skuName'"  :config="{'apiName':'searchSkuNameList','resultPath':'data.content'}" @choose="chooseAddGoods" > </fuzzy-search>
            </div>
          </div>
            <div class="form-group">
              <label class="control-label col-sm-4">商品条码</label>
              <div class="col-sm-8">
                <input class="form-control input-sm" type="text" v-model="searchData.barcode">
              </div>
            </div>
          <div class="form-group">
            <label class="control-label col-sm-4">物流方式</label>
            <div class="col-sm-8">
              <fuzzy-search id='chooseShipping' placeholder='物流方式模糊搜索' :searchfiled="'shippingName'" :config="{'apiName':'getShipingList'}" @choose="chooseShipping"> </fuzzy-search>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-4">在途数量</label>
            <div class="col-sm-8">
              <select class="form-control select-sm" v-model="searchData.onWayNum">
                <option value="0">在途数量为0</option>
                <option value="1">在途数量不为0</option>
              </select>
            </div>
          </div>
          
        </div>
        <div class="col-md-4">
          <div class="form-group">
            <label class="col-sm-4 control-label">出货仓</label>
            <div class="col-sm-8">
              <fuzzy-search id='chooseOutWarehouse' placeholder='出货仓模糊搜索' :searchfiled="'warehouseName'" :config="{'apiName':'getWarehouseNameList'}" @choose="chooseOutWarehouse"> </fuzzy-search>
            </div>
          </div>
          <div class="form-group">
             <label class="col-sm-4 control-label">入货仓</label>
            <div class="col-sm-8">
              <fuzzy-search id='chooseInWarehouse' placeholder='入货仓模糊搜索' :searchfiled="'warehouseName'" :config="{'apiName':'getWarehouseNameList'}" @choose="chooseInWarehouse"> </fuzzy-search>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-4">预期调入时间</label>
            <div class="col-sm-8">
              <date-picker format="YYYY-MM-DD" @choose="setPredictInTime" id="predictInTime" ></date-picker>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-3">留言</label>
            <div class="col-sm-3">
              <select class="form-control select-sm" v-model="noteIndex">
                <option value="note">-所有-</option>
                <option value="internalNote">内部留言</option>
                <option value="sourceWarehouseNote">出货仓留言</option>
                <option value="destinationWarehouseNote">入货仓留言</option>
              </select>
            </div>
            <div class="col-sm-6">
              <input class="form-control input-sm" placeholder="模糊搜索备注内容" type="text" v-model="noteValue">
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-8 col-sm-offset-4">
              <button class="btn btn-sm btn-primary" @click="getTableList(true)"><i class="fa fa-search"></i>查询</button>
              <button class="btn btn-sm btn-default" @click="exportExcel"><i class="fa fa-download"></i>导出</button>
            </div>
          </div>
        </div>
        <div>
      </div>
     </div>
    </section> 
    <section class="content purchaseDetail content_yjlu" style="margin-top:-40px">
        <div class="box box-default">
        <div style="margin-top:15px;padding-bottom:8px;background:#fff;padding-top:10px">
          <div class="col-sm-10">
            <input type="checkbox" id="selectAllIds" @click="selectAll('selectAllIds','checkIds')">
            <span class="primaryBtn" @click="batchCheck">批量审核</span>
            <span class="primaryBtn" @click="batchReject">批量驳回</span>
          </div>
          <div class="col-sm-2">增加显示:
              <input type="checkbox" id="showNote" @click="showNote=!showNote">
              <label for="showNote">订单留言</label>
          </div>
        </div>
        <div class="box-body">
        <table class="table table-hover table-condensed myTable">
          <thead>
            <tr>
              <th>选择</th>
              <th>调拨单号</th>
              <th>订单时间</th>
              <th>调拨类型</th>
              <th>出货仓</th>
              <th>入货仓</th>
              <th>出库库存状态</th>
              <th>调拨申请数</th>
              <th>订单状态</th>
              <th>预期调入时间</th>
              <th>实际出库数</th>
              <th>在途数量</th>
              <th>实际入库数</th>
              <th>操作</th>
              <th>指定商品申请数量</th>
              <th>指定单品出库数量</th>
              <th>指定商品在途数量</th>
              <th>指定单品入库数量</th>
              <th>商品总数</th>
            </tr>
          </thead>
          <tbody v-for="(trItem, index) in tableList">
            <tr>
              <td v-if="showNote" rowspan="2">
                <input v-if="trItem.status=='INIT'||trItem.status=='REJECT'" type="checkbox" class="checkIds" :value="trItem.id" v-model="checkedIds">
              </td>
              <td v-else>
                <input v-if="trItem.status=='INIT'||trItem.status=='REJECT'" type="checkbox" class="checkIds" :value="trItem.id" v-model="checkedIds">
              </td>
              <td>
 <!-- <a :href="'#/purchase/transferManage/transferDetail/'+trItem.id" target="_blank">{{trItem.orderSn}}</a> -->
 <router-link  target="_blank" :to="{name: 'transferDetail', params: {dt_id: trItem.id, party_name:partyName}}">{{trItem.orderSn}}</router-link>
              </td>
              <td>{{trItem.createTime}}</td>
              <td>{{transferTypeArray[trItem.type]}}</td><!--调拨类型-->
              <td>{{trItem.sourceWarehouse.warehouseName}}</td>
              <td>{{trItem.destinationWarehouse.warehouseName}}</td>
              <td>{{inventroyStatusArray[trItem.statusId]}}</td>
              <td>{{trItem.applyDtNum}}</td>
              <td>{{orderStatusArray[trItem.status]}}</td><!--订单状态-->
              <td>{{formatTime(trItem.predictInTime)}}</td>
              <td>{{trItem.actuallyTransferOutCount}}</td>
              <td>{{trItem.onWayCount}}</td>
              <td>{{trItem.actuallyTransferInCount}}</td><!---->
              <td style="text-align:center">
                <nobr><a v-show="trItem.status=='DT_DONE'||trItem.status=='DC_EXECUTING'" @click="terminate(trItem.id)">中止入库</a></nobr>
              	<!-- 
			 	<nobr><a v-show="trItem.status!='CANCELLED'&&trItem.statusId!='DT_DONE'&&trItem.statusId!='FINISHED'" 
                        @click="newCompensate(trItem.id)">新建理赔</a></nobr> -->
              </td>
               <template v-if="searchData.barcode||searchData.skuId"><!-- 指定了商品 -->
                <td>{{trItem.goodsContentList[0].specifiedSkuApplyNum}}</td>
                <td>{{trItem.goodsContentList[0].actuallyTransferOutCount}}</td>
                <td>{{trItem.goodsContentList[0].onWayCount}}</td>
                <td>{{trItem.goodsContentList[0].actuallyTransferInCount}}</td>
              </template>
              <template v-else> 
                <td></td><td></td><td></td><td></td>
              </template>
               <td>{{trItem.diffrentSkuNum}}</td>
            </tr>
            <tr v-show="showNote">
              <td colspan="99" class="textAlignLeft">
                <div class="col-md-4">
                  <span class="smallTitle">内部留言:</span>
                  <span>{{trItem.internalNote}}</span>
                </div>
                <div class="col-md-4">
                  <span class="smallTitle">出货仓留言:</span>
                  <span>{{trItem.sourceWarehouseNote}}</span>
                </div>
                <div class="col-md-4">
                  <span class="smallTitle">入货仓留言:</span>
                  <span>{{trItem.destinationWarehouseNote}}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="box-footer clearfix">
        <div class="col-md-2 no-padding"></div>
        <pagination :offset="searchData.offset" :length="searchData.length" :total-count="totalCount" @paginate="paginate"></pagination>
      </div>
      </div>
    </section>
    <!-- 开始弹出框 -->
        <div class="popup-wrap-zn" v-if="showSelectModel">
          <div class="popup-content row form-inline">
            <p class="popup-title">选择中止入库仓库</p>
            <div class="popup-main">
              <div class="myRow row">
                <label class="control-label col-sm-4 required">中止入库仓</label>
                <div class="col-sm-4">
                  <fuzzy-search id='chooseTerminateWarehouse' placeholder='仓库模糊搜索' :searchfiled="'warehouseName'" :config="{'apiName':'getWarehouseNameList'}" @choose="chooseTerminateWarehouse"> </fuzzy-search>
                </div>
              </div>
            </div>
            <div class="popup-footer">
              <button class="btn btn-sm btn-primary" :disabled="terminateWarehouseId==''" @click="commitTerminate"><i class="fa fa-check"></i>确认</button>
              <button class="btn btn-sm btn-default" @click="showSelectModel=false"><i class="fa fa-reply"></i>取消</button>
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
import {getDateStr} from '../../../common/getDateStr'
import fuzzySearch from '../../../component/fuzzySearch'
import datePicker from '../../../component/datePicker'
import searchGoodsName from '../../../component/searchGoodsName'
import pagination from '../../../component/pagination'
import dateRangePicker from '../../../component/dateRangePicker'

var _self = {};
export default {
  components: {
    datePicker,
    searchGoodsName,
    fuzzySearch,
    pagination,
    dateRangePicker,
  },
  data () {
    return {
     // selectAll: false,
      showSelectModel:false,
      terminateWarehouseId:'',
      terminateDtId:'',
      searchData:{
        sourceWarehouseId:'',         //出货仓
        destinationWarehouseId:'',    //入货仓
        orderSn:'',           
        type:'',              //调拨类型
        shippingId:'',        //物流方式
        status:'',         
        predictInTime:'',     //预期调入时间
        startTime:'',         //订单开始时间
        endTime:'',           //订单结束时间
        skuId:'',         //商品名称
        barcode:'',         //商品条码6923589427508
        onWayNum:'',          //在途数量
        offset: 0,
        length:10,   
      },
      totalCount:'',  //总页数
      noteIndex:'note',       //选择了哪个修改
      noteValue:'',           //留言内容
      showNote:false,         //显示留言
      tableList:[],       //查询结果
      checkedIds:[],      //选中的订单id

      orderStatusArray: {   //订单状态数组
        INIT: '待审核',
        PASSED: '审核通过',
        DENIED: '审核否决',
        CANCELLED: '作废',
        REJECT: '被驳回',
        TERMINATED: '中止入库',
        DT_DONE: '调拨出库完成',
        DC_EXECUTING: '调拨入库中',
        DC_DONE: '调拨入库完成',
        FINISHED: '调拨完结',
      }, 
      transferTypeArray: {    //调拨类型数组
        SAME_WAREHOUSE_DT: '仓内调拨',
        DIFFERENT_WAREHOUSE_DT: '异地调拨',
        VIRTUAL_WAREHOUSE_DT: '虚拟调拨',
      }, 
      inventroyStatusArray:{  //库存状态
        INV_STTS_AVAILABLE:'全新',
        INV_STTS_USED:'二手',
        INV_STTS_DEFECTIVE:'破损',
      },
    }
  },
  mounted () {
    _self = this;
    this.$nextTick(() => {
      initStyle();
    });
    _self.partyName=$("#currentPartyNameSpan").text();
  },
  methods: {
     getUpdateTime(date){
      _self.searchData.startTime = date.start_time;
      _self.searchData.endTime = date.end_time;
    },
    setPredictInTime(result){   //预期调入时间
      _self.searchData.predictInTime=result.data;
    },
    chooseOutWarehouse(res){         //选择出库仓
      if(res){
        _self.searchData.sourceWarehouseId=res.warehouseId;
      }else{
        _self.searchData.sourceWarehouseId='';
      }
    },
    chooseInWarehouse(res){         //选择入库仓
      if(res){
        _self.searchData.destinationWarehouseId=res.warehouseId;
      }else{             
        _self.searchData.destinationWarehouseId='';
      }
    },
    chooseTerminateWarehouse(res){         
      if(res){
        _self.terminateWarehouseId=res.warehouseId;
      }else{
        _self.terminateWarehouseId='';
      }
    },
    chooseShipping(res){      //选择了快递方式
      if(res){
        _self.searchData.shippingId=res.shippingId;
      }else{
        _self.searchData.shippingId='';
      }
    },  
    chooseAddGoods(res){
      if(res){
        _self.searchData.skuId=res.skuId;
      }else{
        _self.searchData.skuId='';
      }
    },
    addNewRefund(){
      this.$router.push({name: 'addTransfer'});
    },
    paginate (data) {
      this.searchData.offset = data.offset;
      this.searchData.length = data.length;
      this.getTableList();
    },
    batchCheck(){ 
      if(_self.checkedIds.length==0){
        layer.msg("请先选择订单！", {time: 2000});
        return;
      }
      http({
        instance: _self,
        url: api.batchCheckDt,     
        type: 'post',
        data: {  "data": {
          batchCheckOrderDtIds:_self.checkedIds,
        }  },     
        success (res) {
          _self.showResult(res);
        }
      });  
    },
    batchReject(){
      if(_self.checkedIds.length==0){
        layer.msg("请先选择订单！", {time: 2000});
        return;
      }
      http({
        instance: _self,
        url: api.batchRejectDt,     
        type: 'post',
        data: {  "data": {
          batchRejectOrderDtIds:_self.checkedIds,
        }  },     
        success (res) {
           _self.showResult(res);
        }
      });  
    },
    showResult(res){
      if(res.success){
          _self.getOrderSnByIds(res.data);
      }else{
        layer.msg("操作失败！", {time: 2000});
      }
    },
    getOrderSnByIds(data){
      var result={
        failList:[],
        succList:[],
      };
      _self.tableList.forEach(function (item, index) {  
        if($.inArray(item.id, data.failList)>-1){
          result.failList.push(item.orderSn);
        }    
        if($.inArray(item.id, data.succList)>-1){
          result.succList.push(item.orderSn);
        }        
      });
      layer.alert("操作成功:["+result.succList+'];操作失败:['+result.failList+"]", {icon: 9});
    
    },
    getTableList(type){
      _self.searchData[_self.noteIndex]=_self.noteValue;  //添加属性
      if(type){
        _self.searchData.offset=0;
      }
      http({
        instance: _self,
        url: api.getDtList,     
        type: 'post',
        data: {  "data": _self.searchData  },     
        success (res) {
          _self.tableList=res.data.content;
          _self.totalCount=res.data.totalCount||0;
          delete _self.searchData[_self.noteIndex];   //查询之后删除属性
          if(_self.totalCount==0){
            layer.msg("<span style='color:red'>好像没有查到数据 !</span>", {icon: 5});
          }
        }
      });  
    },
    terminate(id){//中止入库
      _self.showSelectModel=true;
      _self.terminateDtId=id;
    },
    commitTerminate(){
      http({
        instance: _self,
        url: api.terminateDt,     
        type: 'post',
        data: {  "data": {
          id:_self.terminateDtId,
          terminateWarehouseId:_self.terminateWarehouseId,
        }  },     
        success (res) {
          _self.showSelectModel=false;
          _self.terminateWarehouseId='';
          _self.terminateDtId='';
        }
      });  
    },
    newCompensate(id){
      console.log("新建理赔，id="+id);
    },
    exportExcel(){
      layer.msg("导出功能尚未实现！", {time: 2000});
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
    formatTime(time){
      if(typeof(time)==="undefined"){
        return '';
      }else{
        var t=time.substr(0,10);
        t=t.replace(/-/g,'/');
        return t;
      }
    }
  }
} 

</script>
<style scoped>
  .select-sm{
    padding: 2px;
    height: 30px;
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
    top: 30%;
    left: 52%;
    width: 420px;
    /*min-height: 366px;*/
    margin-left: -230px;
    background-color: #fff;
    border-radius: 5px;
    z-index: 999;
  }
  .myRow{
      margin-bottom: 10px;
    }
  .myRow .control-label{
    margin-top: 5px;
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
      height: 65px;
  }
  .popup-footer {
      width: 100%;
      text-align: right;
      padding: 10px;
      border-top: 1px solid #d2d6de;
  }
</style>