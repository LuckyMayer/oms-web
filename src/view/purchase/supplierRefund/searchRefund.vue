<template>
  <div class="content-wrapper">
    <section class="content-header clearfix">
      <ol class="breadcrumb col-md-6">
          <li><a href="#"><i class="fa fa-desktop"></i> 采购</a></li>
          <li class="active">退货订单</li>
          <li class="active">退货列表</li>
      </ol>
      <div class="col-md-6" style="text-align: right; position: relative; top: 10px;">    
        <button class="btn btn-sm btn-primary" @click="addNewRefund"><i class="fa fa-plus"></i>新建退货单</button>
      </div>
    </section>
    <!-- Main content -->
    <section class="content purchaseDetail content_yjlu">
      <div class="row form-horizontal searchContent bgFFF">
        <div class="col-md-4">
          <div class="form-group">
            <label class="control-label col-sm-4">退货单号</label>
            <div class="col-sm-8">
              <input class="form-control input-sm" type="text" v-model="searchData.orderSn">
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-4">商品条码</label>
            <div class="col-sm-8">
              <input class="form-control input-sm" type="text" v-model="searchData.barcode">
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-4">退货类型</label>
            <div class="col-sm-8">
              <select class="form-control" v-model="searchData.returnType">
                <option value="">--所有类型--</option>
                <option v-for="(item,index) in returnTypeArray" :value="index">{{item}}</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-4">订单时间</label>
            <div class="col-sm-8">
              <date-range-picker id="orderTime" :needhms="true" @get_date="getOrderTime" :miniwidth="true" :start-time="searchData.startTime" :end-time="searchData.endTime"></date-range-picker>
            </div>
          </div>
        </div>
        <div class="col-md-4">
           <div class="form-group">
            <label class="control-label col-sm-4">退货状态</label>
            <div class="col-sm-8">
              <select class="form-control" v-model="searchData.status">
                <option value="">--所有状态--</option>
                <option v-for="(item,index) in orderStatusArray" :value="index">{{item}}</option>
              </select>
            </div>
          </div>
            <div class="form-group">
              <label class="control-label col-sm-4">商品名称</label>
              <div class="col-sm-8">
                <fuzzy-search ref="childAddGoods" id='chooseSearchGoods' placeholder='商品名称模糊搜索' :searchfiled="'skuName'" :config="{'apiName':'searchSkuNameList','resultPath':'data.content'}" @choose="chooseSearchGoods" > </fuzzy-search>
              </div>
            </div>
          <div class="form-group">
            <label class="control-label col-sm-4">发起人</label>
            <div class="col-sm-8">
              <input class="form-control input-sm" type="text" v-model="searchData.creatorName">
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="form-group">
            <label class="col-sm-4 control-label">退货仓</label>
            <div class="col-sm-8">
              <fuzzy-search id='chooseWarehouse' placeholder='出货仓模糊搜索' :searchfiled="'warehouseName'" :config="{'apiName':'getWarehouseNameList'}" @choose="chooseWarehouse"> </fuzzy-search>
            </div>
          </div>
          <div class="form-group">
             <label class="col-sm-4 control-label">供应商</label>
            <div class="col-sm-8">
               <fuzzy-search id='chooseSearchProvider' placeholder='供应商名称模糊搜索' :searchfiled="'providerName'" :config="{'apiName':'getProviderTableList','keyPath':'data.provider.providerName','resultPath':'data.content'}" :parameter="selectProvider" @choose="chooseSearchProvider"> </fuzzy-search>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-4">备注内容</label>
            <div class="col-sm-8">
              <input class="form-control input-sm" type="text" v-model="searchData.note">
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
    <section class="content purchaseDetail content_yjlu" style="margin-top:-90px">
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
              <th><div>退货单号</div><div>订单时间</div></th>
              <th>退货类型</th>
              <th>供应商</th>
              <th>退货仓</th>
              <th>币种</th>
              <th>库存状态</th>
              <th>申请数</th>
              <th>出库数</th>
              <th>状态</th>
              <th>操作</th>
              <th>指定单品申请数</th>
              <th>指定单品出库数</th>
              <th>退货单价</th>
              <th>退货盈亏金额</th>
            </tr>
          </thead>
          <tbody v-for="(trItem, index) in tableList">
            <tr>
              <td rowspan="2">
                <input type="checkbox" class="checkIds" :value="trItem.orderGtId" v-model="checkedIds">
              </td>
              <td>
                <div>
               <!--  <a :href="'#/purchase/supplierRefund/refundDetail/'+trItem.orderGtId" target="_blank">{{trItem.orderSn}}</a>-- -->
                <router-link  target="_blank" :to="{name: 'refundDetail', params: {gt_id: trItem.orderGtId, party_name:partyName}}">{{trItem.orderSn}}</router-link>
                </div>
                <div>{{trItem.createTime}}</div>
              </td>
              <td>{{returnTypeArray[trItem.returnType]}}</td>
              <td>{{trItem.provider.providerName}}</td>
              <td>{{trItem.warehouse.warehouseName}}</td>
              <td>{{trItem.provider.currency}}</td>
              <td>{{inventroyStatusArray[trItem.statusId]}}</td>
              <td>{{trItem.applyNum}}</td>
              <td>{{trItem.inventoryOutNum}}</td>
              <td>{{orderStatusArray[trItem.status]}}</td>
              <td><!-- 审核通过或已推送才能驳回 -->
                <a v-show="trItem.status=='CHECK_PASS'||trItem.status=='PUSH_FINISH'" @click="updateOrder('rejectGt',trItem.orderGtId)">出库驳回</a>
                <!-- 待审核，审核通过或已推送才能作废 -->
                <a v-show="trItem.status=='WAIT_CHECK'||trItem.status=='CHECK_PASS'||trItem.status=='PUSH_FINISH'" @click="updateOrder('gtCancel',trItem.orderGtId)">作废订单</a>
              </td>
              <td>{{trItem.specifiedSkuApplyNum}}</td>
              <td>{{trItem.specifiedSkuInventoryOutNum}}</td>
              <td>{{trItem.specifiedSkuReturnPrice}}</td>
              <td>{{trItem.specifiedSkuWinLossTotalPrice}}</td>
            </tr>
            <tr v-show="showNote">
              <td colspan="14" class="textAlignLeft">
                <div class="col-md-6">
                  <span class="smallTitle">内部备注</span>
                  <span>{{trItem.intervalNote}}</span>
                </div>
                <div class="col-md-6">
                  <span class="smallTitle">仓库备注</span>
                  <span>{{trItem.warehouseNote}}</span>
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
    </section>
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
  //查询
      searchData:{
        orderSn:'',
        status:'',
        returnType:'',
        warehouseId:'',
        barcode:'',
        providerId:'',
        skuId:'',
        creatorName:'',
        note:'',
        startTime:'',
        endTime:'',

        offset: 0,
        length:10,   
      },
  //显示
      tableList:[],       //查询结果
      showNote:false,     //是否显示备注
      totalCount:'',      //总页数
  //处理
      checkedIds:[],      //选中的订单id
  //键值数组
      orderStatusArray: {   //订单状态数组
        WAIT_CHECK: '待审核',
        CHECK_PASS: '审核通过',
        CHECK_DENY: '审核否决',
        CANCELL: '作废',
        REJECT: '驳回',
        PUSH_FINISH:'已推送',
        GT_DONE: '出库完成',
      }, 
      inventroyStatusArray:{  //库存状态
        INV_STTS_AVAILABLE:'全新',
        INV_STTS_USED:'二手',
        INV_STTS_DEFECTIVE:'破损',
      },
      returnTypeArray: {        //退货类型
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
    addNewRefund(){
      this.$router.push({name: 'addRefund'});
    },
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
    chooseSearchProvider(res){
      if(res){
        _self.searchData.providerId=res.providerId;
      }else{
        _self.searchData.providerId='';
      }
    },
    getOrderTime(date){
      _self.searchData.startTime = date.start_time;
      _self.searchData.endTime = date.end_time;
    },
     paginate (data) {
      this.searchData.offset = data.offset;
      this.searchData.length = data.length;
      this.getTableList();
    },
    getTableList(type){
      _self.checkedIds=[];
      if(type){
        _self.searchData.offset=0;
      }
      http({
        instance: _self,
        url: api.getGtList,     
        type: 'post',
        data: {  "data": _self.searchData  },     
        success (res) {
          if(res.data.totalCount==0){
            _self.tableList=[];
            _self.totalCount=0;
            layer.msg("<span style='color:red'>好像没有查到数据 !</span>", {icon: 5});
            return ;
          }
          _self.tableList=res.data.content;
          _self.totalCount=res.data.totalCount;
        }
      });  
    },
    exportExcel(){
      layer.msg("导出功能尚未实现！", {time: 2000});
    },
    batchCheck(){ 
      if(_self.checkedIds.length==0){
        layer.msg("请先选择订单！", {time: 2000});
        return;
      }
      http({
        instance: _self,
        url: api.batchCheckGt,     
        type: 'post',
        data: {  "data": {
          batchCheckOrderGtIds:_self.checkedIds,
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
        url: api.batchRejectGt,     
        type: 'post',
        data: {  "data": {
          batchRejectOrderGtIds:_self.checkedIds,
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
        if($.inArray(item.orderGtId, data.failList)>-1){
          result.failList.push(item.orderSn);
        }    
        if($.inArray(item.orderGtId, data.succList)>-1){
          result.succList.push(item.orderSn);
        }        
      });
      layer.alert("操作成功:["+result.succList+'];操作失败:['+result.failList+"]", {icon: 9});
    },
    updateOrder(apiName,orderId){ //reject驳回,cancel作废
      http({
        instance: _self,
        url: api[apiName],     
        type: 'post',
        data: {  "data": {
          orderGtId:orderId,
        }  },     
        success (res) {
          if(res.success){
            layer.msg("操作成功！", {time: 2000});
          }else{
            layer.msg("操作失败！", {time: 2000});
          }
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
    formatTime(time){
      if(typeof(time)==="undefined"){
        return '';
      }else{
        var t=time.substr(0,10);
        t=t.replace(/-/g,'/');
        return t;
      }
    },
  }
} 
</script>

<style scoped>
input[type=checkbox] {   
  cursor: pointer;
}  
a{
  white-space:nowrap;
}
.content {
  padding:15px 15px 0 15px;
}

</style>