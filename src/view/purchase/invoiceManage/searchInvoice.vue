<template>
  <div class="content-wrapper">
    <section class="content-header clearfix">
      <ol class="breadcrumb col-md-6">
          <li><a href="#"><i class="fa fa-desktop"></i> 发票管理</a></li>
          <li class="active">发票列表</li>
      </ol>
      <div class="col-md-6" style="text-align: right; position: relative; top: 10px;">    
        <button class="btn btn-sm btn-primary" @click="addNewInvoice"><i class="fa fa-plus"></i>新建发票</button>
      </div>
    </section>

    <!-- Main content -->
    <section class="content purchaseDetail content_yjlu">
      <div class="row form-horizontal searchContent bgFFF" style="padding: 15px 60px 0 0;">
        <div class="col-md-4" style="margin-left:-20px">
          <div class="form-group">
            <label class="control-label col-sm-3">发票号</label>
            <div class="col-sm-8">
              <input class="form-control input-sm" type="text" v-model="searchData.invoiceNumber">
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-3">供应商</label>
            <div class="col-sm-8">
              <fuzzy-search id='chooseSearchProvider' placeholder='供应商名称模糊搜索' :searchfiled="'providerName'" :config="{'apiName':'getProviderTableList','keyPath':'data.provider.providerName','resultPath':'data.content'}" :parameter="selectProvider" @choose="chooseSearchProvider"> </fuzzy-search>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-3">开票时间</label>
            <div class="col-sm-8">
              <date-range-picker id="createTime" :needhms="true" @get_date="getCreateTime" :miniwidth="true" :start-time="searchData.invoiceStartTime" :end-time="searchData.invoiceEndTime"></date-range-picker>
            </div>
          </div>
         
        </div>
        <div class="col-md-4" style="margin-left:-15px">
          <div class="form-group">
            <label class="col-sm-4 control-label">发票状态</label>
            <div class="col-sm-8">
              <select class="form-control select-sm" v-model="searchData.status">
                <option value="">--所有--</option>
                <option v-for="(item,index) in invoiceStatusArray" :value="index">{{item}}</option>
              </select>
            </div>
          </div>
            <div class="form-group">
              <label class="control-label col-sm-4">采购差异</label>
              <div class="col-sm-8">
                <select class="form-control select-sm" v-model="searchData.isPurchaseDiff">
                  <option value="">--所有--</option>
                  <option :value="true">有差异</option>
                  <option :value="false">无差异</option>
                </select>
              </div>
            </div>
          <div class="form-group">
             <label class="control-label col-sm-4">维护时间</label>
            <div class="col-sm-8">
              <date-range-picker id="updateTime" :needhms="true" @get_date="getUpdateTime" :miniwidth="true" :start-time="searchData.lastUpdateStartTime" :end-time="searchData.lastUpdateEndTime"></date-range-picker>
            </div>
          </div>
        </div>
        <div class="col-md-4" style="margin-top:40px">
          <div class="form-group">
             <label class="col-sm-4 control-label">提交人</label>
            <div class="col-sm-8">
              <input class="form-control input-sm" type="text" v-model="searchData.name">
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-4">提交时间</label>
            <div class="col-sm-8">
              <date-range-picker id="submitTime" :needhms="true" @get_date="getSubmitTime" :miniwidth="true" :start-time="searchData.submitStartTime" :end-time="searchData.submitEndTime"></date-range-picker>
            </div>
          </div>

          <div class="form-group" style="margin-right:10px;float:right">
            <div class="col-sm-12">
              <button class="btn btn-sm btn-primary" @click="getTableLists"><i class="fa fa-search"></i>查询</button>
              <button class="btn btn-sm btn-default" @click="exportExcel"><i class="fa fa-download"></i>导出</button>
            </div>
          </div>
        </div>
        <div>
      </div>
     </div>
    </section> 
    <section class="content purchaseDetail content_yjlu" style="margin-top:-77px">
      <div class="row form-horizontal tableContent bgFFF">
      <div class="form-group">
        <div class="col-sm-10" style="margin-bottom:10px">
          <input type="checkbox" id="selectAllIds" @click="selectAll('selectAllIds','checkIds')">
          <span class="primaryBtn" @click="batchCheck">批量确认发票</span>
          <span class="primaryBtn" @click="batchReject">批量否决发票</span>
        </div>
        <table class="table table-hover table-condensed myTable">
          <thead>
            <tr>
              <th>选择</th>
              <th>发票号</th>
              <th>供应商</th>
              <th>开票时间</th>
              <th>维护时间</th>
              <th>发票去税金额</th>
              <th>发票含税金额</th>
              <th>采购差异</th>
              <th>发票状态</th>
              <th>提交人</th>
              <th>提交时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody v-for="(trItem, index) in tableList">
            <tr>
              <td><input type="checkbox" class="checkIds" :value="trItem.orderPurchaseInvoiceId" v-model="checkedIds"></td>
              <td>
                <a :href="'#/index/purchase/invoiceManage/invoiceDetail/'+trItem.orderPurchaseInvoiceId">{{trItem.invoiceNumber}}</a>
              </td>
              <td>{{trItem.provider.providerName}}</td>
              <td>{{formatTime(trItem.invoiceTime)}}</td>
              <td>{{formatTime(trItem.lastUpdateTime)}}</td>
              <td>￥{{trItem.sumWithoutTax}}</td>
              <td>￥{{trItem.sumWithTax}}</td>
              <td>{{isPurchaseDiffArray[trItem.isPurchaseDiff]}}</td>
              <td>{{invoiceStatusArray[trItem.status]}}</td>
              <td>{{getName(trItem.submitUser)}}</td>
              <td>{{formatTime(trItem.submitTime)}}</td>
              <td><a @click="updateOrder('invoiceCancel',trItem.orderPurchaseInvoiceId)">作废</a>
                  <a @click="updateOrder('invoiceRetract',trItem.orderPurchaseInvoiceId)">退票</a></td>
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
        invoiceNumber:'',
        status:'',
        providerId:'',
        isPurchaseDiff:'',
        name:'',
        invoiceStartTime:'',
        invoiceEndTime:'',
        lastUpdateStartTime:'',
        lastUpdateEndTime:'',
        submitStartTime:'',
        submitEndTime:'',

        offset: 0,
        length:10,   
      },
      tableList:[],       //查询结果
      totalCount:'',      //总页数
      checkedIds:[],      //选中的订单id
      invoiceStatusArray: {  //状态数组
        WAIT_SUBMIT:'待提交',
        WAIT_CHECK:'待审核',
        PASSED:'审核通过',
        DENIED:'审核失败',
        RETRACT_WAIT_CHECK:'退票待审核',
        RETRACT_PASSED:'退票审核通过',
        RETREAT_DENIED:'退票审核失败',
        CANCELLED:'已取消',
      },  
      isPurchaseDiffArray:{
        true:'有差异',
        false:'无差异',
      },
  //模糊搜索参数
      selectProvider:{    //模糊查询参数
        data:{
          provider:{
            providerName:'',  //供应商名称
          },
          offset: 0,
          length: 50,
        }
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
    addNewInvoice(){
      this.$router.push({name: 'addInvoice'});
    },
    chooseSearchProvider(res){
      if(res){
        _self.searchData.providerId=res.providerId;
      }else{
        _self.searchData.providerId='';
      }
    },
    getCreateTime(date){
      _self.searchData.invoiceStartTime = date.start_time;
      _self.searchData.invoiceEndTime = date.end_time;
    },
    getUpdateTime(date){
      _self.searchData.lastUpdateStartTime = date.start_time;
      _self.searchData.lastUpdateEndTime = date.end_time;
    },
    getSubmitTime(date){
      _self.searchData.submitStartTime = date.start_time;
      _self.searchData.submitEndTime = date.end_time;
    },
     paginate (data) {
      this.searchData.offset = data.offset;
      this.searchData.length = data.length;
      this.getTableList();
    },
    getTableLists() {
      this.searchData.offset = 0;
      this.getTableList();
    },
    getTableList(){
      http({
        instance: _self,
        url: api.invoiceList,     
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
        layer.msg("请先选择！", {time: 2000});
        return;
      }
      http({
        instance: _self,
        url: api.invoiceBatchCheckPass,     
        type: 'post',
        data: {  "data": {
          orderPurchaseInvoiceIds:_self.checkedIds,
        }  },     
        success (res) {
          console.log(res);
        }
      });  
    },
    batchReject(){
      if(_self.checkedIds.length==0){
        layer.msg("请先选择！", {time: 2000});
        return;
      }
      http({
        instance: _self,
        url: api.invoiceBatchCheckDeny,     
        type: 'post',
        data: {  "data": {
          orderPurchaseInvoiceIds:_self.checkedIds,
        }  },     
        success (res) {
          console.log(res);
        }
      });  
    },
    updateOrder(apiName,orderId){ 
      http({
        instance: _self,
        url: api[apiName],     //searchData
        type: 'post',
        data:{"data":{
          orderPurchaseInvoiceId: orderId, },},//         
        success (res) {
          console.log(res);
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
      return typeof(time)==="undefined" ? '' : time.substr(0,10).replace(/-/g,'/');
    },
    getName(user){
      return typeof(user)==="undefined" ? '' : user.name;
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
.content_yjlu .form-control {
    padding: 3px;
    height: 30px;
}
</style>