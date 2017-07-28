
<template>
  <div class="content-wrapper">
    <section class="content-header clearfix">
      <ol class="breadcrumb col-md-6">
          <li><a href="#"><i class="fa fa-desktop"></i> 采购</a></li>
          <li class="active">商品供价管理</li>
      </ol>
      <div class="col-md-6" style="text-align: right; position: relative; top: 10px;">    
          <button class="btn btn-sm btn-primary" @click="isOpen=true"><i class="fa fa-plus"></i>新建供价</button>
      </div>
    </section>
    <!-- Main content -->
    <section class="content shopFile content_yjlu">
      <div class="row form-horizontal searchContent znPadding">
        <div class="form-group">
          <div class="col-sm-3 ">
            <label class="control-label col-sm-4">供应商名称</label>
            <div class="col-sm-8">
              <fuzzy-search id='chooseSearchProvider' placeholder='供应商名称模糊搜索' :searchfiled="'providerName'" :config="{'apiName':'getProviderTableList','keyPath':'data.provider.providerName','resultPath':'data.content'}" :parameter="selectProvider" @choose="chooseSearchProvider"> </fuzzy-search>
            </div>
          </div>
          <div class="col-sm-3">
            <label class="control-label col-sm-4">商品名称</label>
            <div class="col-sm-8">
              <fuzzy-search id='chooseSearchGoods' placeholder='商品名称模糊搜索' :searchfiled="'skuName'" :config="{'apiName':'searchSkuNameList','resultPath':'data.content'}" @choose="chooseSearchGoods"> </fuzzy-search>
            </div>
          </div>
          <div class="col-sm-2">
            <label class="col-sm-4 control-label">商家编码</label>
            <div class="col-sm-8">
              <search-sku-name  ref="childSearchSku" @choose="chooseSkuName" @change="clearSkuMessage"></search-sku-name>
            </div>
          </div>
           <div class="col-sm-2">
            <label class="control-label col-sm-4">状态</label>
            <div class="col-sm-8">
              <select class="form-control select-sm" v-model="searchData.status">
                <option value="">--所有类别--</option>
                <option v-for="(item,index) in statusArray" :value="index">{{item}}</option>
              </select>
            </div>
          </div>
          <div class="col-sm-2">
            <button class="btn btn-sm btn-primary" @click="getTableList"><i class="fa fa-search"></i>查询</button>
            <button class="btn btn-sm btn-default" @click="exportExcel"><i class="fa fa-download"></i>导出</button>
          </div>
        </div>
      </div>
        <div style="margin-top:15px;padding-bottom:5px;background:#fff;padding-top:10px">
          <input type="checkbox" style="position:relative;top:2px;margin:0 5px 0 15px;" @click="setAllCheck">
          <span class="primaryBtn" @click="checkIds(true)">批量审核</span>
        </div>
        <div class="box-body table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th></th>
              <th>供应商</th>
              <th>商品/规格</th>
              <th>币种</th>
              <th>默认供价</th>
              <th>特殊供价</th>
              <th>待审核进价</th>
              <th>操作</th>
              <th>状态</th>
              <th>操作日志</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(trItem, index) in tableList">
              <td>
                <template v-if="trItem.status == 'CHECK_WAIT'">
                   <input type="checkbox" class="waitCheck" :value="index" v-model="checkedIndex">
                </template>
              </td>
              <td>{{trItem.provider.providerName}}</td>
              <td>{{trItem.sku.skuName}}</td>
              <td>{{trItem.provider.currency}}</td>
              <td>{{trItem.sku.providePrice}}</td>
              <td>{{trItem.checkedSpecialPrice}}</td>
              <td>
                <template v-if="isEditArray[index]"><input style="width:50px" v-model="trItem.uncheckedSpecialPrice"/></template>
                <template v-else>{{trItem.uncheckedSpecialPrice}}</template>
              </td>
              <td>
                <a v-if="trItem.status != 'STOP'" @click="edit(index,true)" v-show="!isEditArray[index]">编辑</a>
                <a v-if="trItem.status != 'STOP'" @click="edit(index,false)" v-show="isEditArray[index]">保存</a>
                <a v-if="trItem.status == 'STOP'" class="opreate enable" @click="enablOrDisable(trItem,'NORMAL')">启用</a>
                <a v-else class="opreate disable" @click="enablOrDisable(trItem,'STOP')">停用</a>
              </td>
              <td>
                {{statusArray[trItem.status]}}
                <a v-if="trItem.status == 'CHECK_WAIT'" class="opreate enable" @click="checkOne(trItem,index)" >审核</a>
              </td>
              <td><a @click="showLogs(trItem.providerSpecialPriceId)">查看日志</a></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="box-footer clearfix">
          <div class="col-md-2 no-padding"></div>
            <pagination :offset="searchData.offset" :length="searchData.length" :total-count="totalCount" @paginate="paginate"></pagination>
      </div>
    </section>
        <!-- 日志信息弹窗 -->
        <div class="popup-wrap-zn" v-if="showLogModel">
          <div class="popup-content-log row form-inline">
            <p class="popup-title">操作日志</p>
            <div class="popup-main-log">
                 <table class="table">
                  <tr>
                    <th>操作人</th>
                    <th>操作内容</th>
                    <th>时间</th>
                  </tr>
                  <tr v-for="(trItem, index) in logTable">
                    <td style="width:60px">{{trItem.creator.name}}</td>
                    <td style="width:345px">{{trItem.displayContent}}</td>
                    <td>{{trItem.createTime}}</td>
                  </tr>
              </table>
            </div>
            <div class="popup-footer">
              <button class="btn btn-sm btn-default" @click="showLogModel=false"><i class="fa fa-reply"></i>取消</button>
            </div>
          </div>
        </div>
        <!-- 日志信息弹窗 -->

    <div class="popup-wrap-zn" v-if="isOpen">
          <div class="popup-content row form-inline">
            <p class="popup-title">新建供价</p>
            <div class="popup-main">
                <div class="myRow row">
                    <label class="control-label col-sm-4">供应商名称</label>
                    <div class="col-sm-8">
                     <fuzzy-search id='chooseAddProvider' placeholder='供应商名称模糊搜索' :searchfiled="'providerName'" :config="{'apiName':'getProviderTableList','keyPath':'data.provider.providerName','resultPath':'data.content'}" :parameter="selectProvider" @choose="chooseAddProvider"> </fuzzy-search>
                    </div>
                </div>
                <div class="myRow row">
                  <label class="control-label col-sm-4">商品名称</label>
                  <div class="col-sm-8">
                    <fuzzy-search id='chooseAddGoods' placeholder='商品名称模糊搜索' :searchfiled="'skuName'" :config="{'apiName':'searchSkuNameList','resultPath':'data.content'}" @choose="chooseAddGoods"> </fuzzy-search>
                  </div>
                </div>
                <div class="myRow row">
                  <label class="control-label col-sm-4">特殊供价</label>
                  <div class="col-sm-8">
                    <input class="form-control input-sm" type="text" @keyup="checkPrice" v-model="newProviderData.uncheckedSpecialPrice"/>
                  </div>
                </div>
                <div class="myRow row" v-if="selectedCurrency">
                  <label class="control-label col-sm-4">币种:{{selectedCurrency}}</label>
                </div>
            </div>
            <div class="popup-footer">
              <button class="btn btn-sm btn-primary" @click="addProvider"><i class="fa fa-check"></i>保存</button>
              <button class="btn btn-sm btn-default" @click="isOpen=false"><i class="fa fa-reply"></i>取消</button>
            </div>
          </div>
        </div>
  </div>
</template>

<script>
import initStyle from '../../common/initStyle'
import http from '../../common/http'
import api from '../../common/api'
import pagination from '../../component/pagination'
import datePicker from '../../component/datePicker'
import fuzzySearch from '../../component/fuzzySearch'
import searchSkuName from '../../component/searchSkuName'

var _self = {};
export default {
  components: {
    datePicker,
    pagination,
    fuzzySearch,
    searchSkuName,
  },
  data () {
    return {
      isOpen:false,
      searchData:{
        skuId:'',         //商品名称(id)
        skuCode:'',       //商家编码
        providerId:'',    //供应商名称(id)
        status:"NORMAL",
        offset: 0,
        length: 20,
      },
      logTable:[],
      tableList:[],       //保存查询结果
      totalCount:'',      //查询记录条数
      newProviderData:{ 
        providerId:'',         //供应商名称
        skuId:'',             //商品名称
        uncheckedSpecialPrice:'',         //特殊供价
        status:"CHECK_WAIT",
      },
      selectedCurrency:'',

      checkedIdsAndPrice: [],    //批量审批
      checkedIndex:[],          //选择的下标
      checkAll:false,     //全选
      isEditArray:[],
      statusArray: {  //状态数组
        NORMAL: '正常',     //可以编辑、停用
        STOP: '停用',       //可以启用
        CHECK_WAIT: '待审核',  //可以编辑停用，权限下审核
      },  
      showLogModel: false,

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
  },
  methods: {
    exportExcel(){
      layer.msg("导出功能尚未实现！", {time: 2000});
    },
    setAllCheck(){            //全选
      _self.checkedIndex=[];
      if(_self.checkAll){   //此时全选
        $(".waitCheck").prop("checked",false);  
      }else{
        $(".waitCheck").prop("checked",true); 
        _self.tableList.forEach(function(item,index) {
          if(item.status == 'CHECK_WAIT'){
             _self.checkedIndex.push(index);
          }
        });
      }
      _self.checkAll=!_self.checkAll;
    },
    chooseAddProvider(res){
      if(res){   //选择
        _self.newProviderData.providerId=res.providerId;
        _self.selectedCurrency=res.currency;
      }else{    //清空
         _self.newProviderData.providerId='';
         _self.selectedCurrency='';
      }
    },
    chooseSearchProvider(res){
      if(res){
        _self.searchData.providerId=res.providerId;
      }else{
        _self.searchData.providerId='';
      }
    },
    chooseSearchGoods(res){
      if(res){
        _self.searchData.skuId=res.skuId;
      }else{
        _self.searchData.skuId='';
      }
    },
    chooseSkuName(res){
      _self.searchData.skuId=res.data.skuId;
      _self.$refs.childSearchSku.goodsCode=res.data.skuName;    
    },
    clearSkuMessage(){
      //_self.searchData.skuId='';
    },
    chooseAddGoods(res){
      if(res){
        _self.newProviderData.skuId=res.skuId;
      }else{
        _self.newProviderData.skuId='';
      }
    },
    showLogs(id){     
      _self.showLogModel = true;
      http({
        instance: _self,
        url: api.getSpecialPriceManageLog,     //待修改。。。
        type: 'post',
        data:{"data":{'providerSpecialPriceId':id},},//         
        success (res) {
          _self.logTable=res.data;
        }
      });  
    },
    checkOne(trItem,index){     //单个审核,是否立即审核true,false
      _self.checkedIdsAndPrice=[];
      _self.checkedIdsAndPrice.push({'providerSpecialPriceId':trItem.providerSpecialPriceId,'uncheckedSpecialPrice':trItem.uncheckedSpecialPrice});
      _self.checkedIndex.push(index);
      _self.checkIds(false);
    },
    checkIds(type){       //批量审核,
      if(type){
        _self.checkedIdsAndPrice=[];
        for(let i=0;i<_self.checkedIndex.length;i++){
          _self.checkedIdsAndPrice.push({'providerSpecialPriceId':_self.tableList[_self.checkedIndex[i]].providerSpecialPriceId,'uncheckedSpecialPrice':_self.tableList[_self.checkedIndex[i]].uncheckedSpecialPrice});
        }
      }
      if(_self.checkedIdsAndPrice.length==0){
        layer.msg("请先选择", {time: 2000});
        return ;
      }
      http({
        instance: _self,
        url: api.checkList,     //searchData
        type: 'post',
        data:{"data":{"providerSpecialPrices":_self.checkedIdsAndPrice,},},//       
        success (res) {
          if(type){ //批量审核
            _self.checkedIdsAndPrice=[];
            for(let i=0;i<_self.checkedIndex.length;i++){
              _self.$set(_self.tableList[_self.checkedIndex[i]], 'status', 'NORMAL');
               _self.$set(_self.tableList[_self.checkedIndex[i]], 'checkedSpecialPrice',_self.tableList[_self.checkedIndex[i]].uncheckedSpecialPrice);
              _self.$set(_self.tableList[_self.checkedIndex[i]], 'uncheckedSpecialPrice', '');
            }
          }else{
            _self.$set(_self.tableList[_self.checkedIndex[0]], 'status', 'NORMAL');
            _self.$set(_self.tableList[_self.checkedIndex[0]], 'checkedSpecialPrice',_self.tableList[_self.checkedIndex[0]].uncheckedSpecialPrice);
            _self.$set(_self.tableList[_self.checkedIndex[0]], 'uncheckedSpecialPrice', '');
          }
          _self.checkedIndex=[];
          _self.checkedIdsAndPrice=[];
        }
      });  
    },
    paginate (data) {
      _self.searchData.offset = data.offset;
      _self.searchData.length = data.length;
      _self.getTableList();
    },
    getTableList(){
      http({
        instance: _self,
        url: api.getProviderSpecialPriceList,     //待修改。。。
        type: 'post',
        data:{"data":_self.searchData,},//         
        success (res) {
          _self.tableList=res.data.content;
          _self.totalCount=res.data.totalCount;
          _self.isEditArray=[];
          _self.tableList.forEach(function (item) {
            _self.isEditArray.push(false);
          });
          if(res.data.totalCount==0){
            layer.msg("<span style='color:red'>好像没有查到数据 !</span>", {icon: 5});
          }
        }
      });  
    },   
    addProvider(){        //添加
      if(_self.newProviderData.providerId==''){
        layer.msg("供应商名称不能为空！", {time: 2000});
        return ;
      }else if(_self.newProviderData.skuId==''){
        layer.msg("商品名称名称不能为空！", {time: 2000});
        return ;
      }else if(_self.newProviderData.uncheckedSpecialPrice==''){
        layer.msg("特殊供价不能为空！", {time: 2000});
        return ;
      }
      http({
        instance: _self,
        url: api.addSpecialPriceProvider,     
        type: 'post',
        data:{"data":_self.newProviderData,},
        success (res) {
          if(res.msg=='success'){
            layer.msg("添加成功！", {time: 2000});
            _self.isOpen=false;
          }else{
            layer.msg("添加失败！"+res.msg, {time: 2000});
          }
        }
      });   
    },
    edit(index,type){   //下标，true or false
      this.$set(this.isEditArray, index, type);
      if(!type){
        http({
          instance: _self,
          url: api.modifySpecialPriceProvider,     
          type: 'post',
          data:{"data":{
              providerSpecialPriceId:_self.tableList[index].providerSpecialPriceId,
              uncheckedSpecialPrice:_self.tableList[index].uncheckedSpecialPrice,
            },
          },
          success (res) {
            _self.$set(_self.tableList[index], 'status', 'CHECK_WAIT');
            console.log(res);
          }
        });  
      }
    },
    enablOrDisable(trItem,status){    //启用或停用
      var apiName='disableSpecialPrice';
      if(status=='NORMAL'){
        apiName='enableSpecialPrice';
      }
      http({
        instance: _self,
        url: api[apiName],     
        type: 'post',
        data:{"data":{
          providerSpecialPriceId:trItem.providerSpecialPriceId,
        },},
        success (res) {
          trItem.status=status;
        }
      });   
    },
    checkPrice(){ //检查特殊供价是否正确
      var v=_self.newProviderData.uncheckedSpecialPrice;
      v = v.replace(/[^\d.]/g,"");        //清除"数字"和"."以外的字符 
      v = v.replace(/^\./g,"");           //验证第一个字符是数字而不是逗号 
      v = v.replace(".","$#$").replace(/\./g,"").replace("$#$","."); //只能输入一个逗号
      v = v.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数  
      _self.newProviderData.uncheckedSpecialPrice=v;
    }
  }
}
</script>

<style scoped>
.cover{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 9999;
}
.hand,a{cursor: pointer;}
.enable {
  color: green;
}
.disable {
  color: red;
}
.log{
  color:#00FF00;
}
.col-sm-1, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9{
  padding-right: 1px; 
  padding-left: 1px;
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
    top: 18%;
    left: 50%;
    width: 380px;
    min-height: 260px;
    margin-left: -230px;
    background-color: #fff;
    border-radius: 5px;
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
  .popup-main {
      padding-left: 20px;
      padding-top: 15px;
      height: 200px;
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
      height: 200px;
      overflow:auto;
  }
  .popup-content-log {
    position: absolute;
    top: 18%;
    left: 50%;
    width: 580px;
    min-height: 260px;
    margin-left: -230px;
    background-color: #fff;
    border-radius: 5px;
    z-index: 999;
  }
</style>