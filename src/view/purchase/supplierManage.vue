<template>
  <div class="content-wrapper">
    <section class="content-header clearfix">
      <ol class="breadcrumb col-md-6">
          <li><a href="#"><i class="fa fa-desktop"></i> 系统</a></li>
          <li class="active">供应商管理（全局）</li>
      </ol>
      <div class="col-md-6" style="text-align: right; position: relative; top: 10px;">    
        <button class="btn btn-sm btn-primary" @click="showModel"><i class="fa fa-plus"></i>新建供应商</button>
      </div>
    </section>

    <section class="content suppManage content_yjlu">
      <div class="row form-horizontal searchContent">
        <div class="col-md-4">
          <div class="form-group">
            <label class="col-sm-4 control-label">供应商名称</label>
            <div class="col-sm-8">
              <input class="form-control input-sm" type="text" v-model="searchData.provider.providerName"/>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">是否停用</label>
            <div class="col-sm-8">
              <select class="form-control select-sm" v-model="searchData.provider.status">
               <option value="">--所有--</option>
                <option value="NORMAL">否</option>
                <option value="DELETED">是</option>
              </select>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="form-group">
            <label class="col-sm-4 control-label">供应商类别</label>
            <div class="col-sm-8">
              <select class="form-control select-sm" v-model="searchData.provider.providerType">
                <option value="">--所有类别--</option>
                <option v-for="(item,index) in providerTypeArray" :value="index">{{item}}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="form-group">
            <label class="col-sm-4 control-label">合作模式</label>
            <div class="col-sm-8">
              <select class="form-control select-sm" v-model="searchData.provider.cooperationMode">
                <option value="">--所有模式--</option>
                <option v-for="(item,index) in cooperationModeArray" :value="index">{{item}}</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-12 btnRight">
              <button class="btn btn-sm btn-primary" @click="getTableList"><i class="fa fa-search"></i>查询</button>
            </div>
          </div>
        </div>
      </div>
      <div class="form-horizontal tableContent bgFFF" style="padding:0px">
      <div class="box-body table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>供应商编号</th>
              <th>供应商名称</th>
              <th>区域</th>
              <th>合作模式</th>
              <th>类别</th>
              <th>供价</th>
              <th>币种</th>
              <th>联系人</th>
              <th>境外银行付款</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(trItem, index) in tableList">
              <td>{{trItem.providerId}}</td>
              <td>{{trItem.providerName}}</td>
              <td>{{providerRegionArray[trItem.providerRegion]}}</td>
              <td>{{cooperationModeArray[trItem.cooperationMode]}}</td>
              <td>{{providerTypeArray[trItem.providerType]}}</td>
              <td>{{specialSupplyArray[trItem.specialSupply]}}</td>
              <td>{{currencyArray[trItem.currency]}}</td>
              <td>{{trItem.contactName}}</td>
              <td>{{overseasStatusArray[trItem.overseasPayStatus]}}</td>
              <td><a class="hand" @click="edit(trItem,index)">编辑</a>
                  <template v-if="trItem.status == 'DELETED'">
                    <a class="hand opreate enable" @click="enablOrDisable(trItem,'NORMAL')" >启用</a>
                  </template>
                  <template v-else>
                    <a class="hand opreate disable" @click="enablOrDisable(trItem,'DELETED')">停用</a>
                  </template>
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

   <!-- 开始弹出框 -->
        <div class="popup-wrap-zn" v-if="isCreateSupp">
          <div class="popup-content row form-inline">
            <p class="popup-title" v-if="updateIndex==-1">新建供应商</p>
            <p class="popup-title" v-if="updateIndex>-1">编辑供应商
             <!--  <label style="color:green;float:right;margin-right:30px" @mousemove="showEditLogTable=true">查看日志</label> -->
            </p>
            <div class="popup-main">
              <div class="myRow row">
                <label class="control-label col-sm-2 required">供应商名称</label>
                <div class="col-sm-4">
                  <input class="form-control input-sm shopNameIpt" type="text" placeholder="命名唯一" v-model="newProviderData.providerName"/>
                </div>
                <label class="control-label col-sm-2 required">合作模式</label>
                <div class="col-sm-4">
                  <select class="form-control" v-model="newProviderData.cooperationMode">
                    <option v-for="(item,index) in cooperationModeArray" :value="index">{{item}}</option>
                  </select>
                </div>
              </div>
              <div class="myRow row">
                <label class="control-label col-sm-2 required">类别</label>
                <div class="col-sm-4">
                  <select class="form-control" v-model="newProviderData.providerType">
                    <option v-for="(item,index) in providerTypeArray" :value="index">{{item}}</option>
                  </select>
                </div>
                <label class="control-label col-sm-2 required" v-if="newProviderData.providerType=='BOOK'">是否特殊供价</label>
                <div class="col-sm-4" v-if="newProviderData.providerType=='BOOK'">
                  <select class="form-control" v-model="newProviderData.specialSupply">
                    <option v-for="(item,index) in specialSupplyArray" :value="index">{{item}}</option>
                  </select>
                </div>
              </div>
              <div class="myRow row">
                <label class="control-label col-sm-2 required">供应商级别</label>
                <div class="col-sm-4">
                  <select class="form-control" v-model="newProviderData.providerLevel">
                    <option v-for="(item,index) in providerLevelArray" :value="index">{{item}}</option>
                  </select>
                </div>
                <label class="control-label col-sm-2 required">区域</label>
                <div class="col-sm-4">
                  <select class="form-control" v-model="newProviderData.providerRegion">
                    <option v-for="(item,index) in providerRegionArray" :value="index">{{item}}</option>
                  </select>
                </div>
              </div>
              <div class="myRow row">
                <label class="control-label col-sm-2 required">币种</label>
                <div class="col-sm-4">
                  <select class="form-control" v-model="newProviderData.currency">
                    <option v-for="(item,index) in currencyArray" :value="index">{{item}}</option>
                  </select>
                </div>
                <!-- <label class="control-label col-sm-2 required">所属平台</label>
                <div class="col-sm-4">
                  <select class="form-control" v-model="newShopData.shopPlatform">
                    <option v-for="(item,index) in shopPlatformArray" :value="index">{{item}}</option>
                  </select>
                </div> -->
              </div>
              <div class="myRow row">
                <label class="control-label col-sm-2">开户行</label>
                <div class="col-sm-4">
                  <input class="form-control input-sm" type="text" v-model="newProviderData.bankName"/>
                </div>
                <label class="control-label col-sm-2">银行地址</label>
                <div class="col-sm-4">
                  <input class="form-control input-sm" type="text" placeholder="境外银行付款必填" v-model="newProviderData.bankAddress"/>
                </div>
              </div>
              <div class="myRow row">
                <label class="control-label col-sm-2">账号</label>
                <div class="col-sm-4">
                  <input class="form-control input-sm" type="text" v-model="newProviderData.bankAccountNumber"/>
                </div>
                <label class="control-label col-sm-2">SWIFT码</label>
                <div class="col-sm-4">
                  <input class="form-control input-sm" type="text" placeholder="境外银行付款必填" v-model="newProviderData.swiftCode"/>
                </div>
              </div>
              <div class="myRow row">
                <label class="control-label col-sm-2">公司地址</label>
                <div class="col-sm-4">
                  <input class="form-control input-sm" type="text" placeholder="境外银行付款必填" v-model="newProviderData.companyAddress"/>
                </div>
                <label class="control-label col-sm-2">支付方式</label>
                <div class="col-sm-4">
                  <select class="form-control" v-model="newProviderData.onlinePayType">
                    <option v-for="(item,index) in onlinePayTypeArray" :value="index">{{item}}</option>
                  </select>
                </div>
              </div>
              <div class="myRow row">
                <label class="control-label col-sm-2">收款账号</label>
                <div class="col-sm-4">
                  <input class="form-control input-sm" type="text" v-model="newProviderData.onlineReceiveAccount"/>
                </div>
               <!--  <label class="control-label col-sm-2 required">售后电话</label>
                <div class="col-sm-4">
                  <input class="form-control input-sm shopNameIpt" type="text" onkeyup="this.value=this.value.replace(/[^\d]+/g,'');" v-model="newShopData.afterSalePhone"/>
                </div> -->
              </div>
              <div class="myRow row">
                <label class="control-label col-sm-2">联系人</label>
                <div class="col-sm-4">
                  <input class="form-control input-sm" type="text" v-model="newProviderData.contactName"/>
                </div>
                <label class="control-label col-sm-2">联系电话</label>
                <div class="col-sm-4">
                  <input class="form-control input-sm" type="text" v-model="newProviderData.contactPhone"/>
                </div>
              </div>
              <div class="myRow row">
                <label class="control-label col-sm-2">email</label>
                <div class="col-sm-4">
                  <input class="form-control input-sm" type="text" v-model="newProviderData.contactEmail"/>
                </div>
                <label class="control-label col-sm-2">描述</label>
                <div class="col-sm-4">
                  <textarea class="form-control" v-model="newProviderData.contactDescription"></textarea>
                </div>
              </div>
            </div>
            <div class="popup-footer">
              <button v-show="updateIndex>-1" class="btn btn-sm btn-primary" @click="updatePrivider">
                <i class="fa fa-check"></i>保存</button>
              <button v-show="updateIndex==-1" class="btn btn-sm btn-primary" @click="newPrivider">
                <i class="fa fa-check"></i>创建</button>
              <button class="btn btn-sm btn-default" @click="isCreateSupp = false"><i class="fa fa-reply"></i>取消</button>
            </div>
            

          </div>
        </div>
        <!-- 结束弹出框 -->
         <table id="logTable" v-show="showEditLogTable" class="table table-hover table-condensed logTable">
                <tr>
                  <th>操作人</th>
                  <th>操作内容</th>
                  <th>时间</th>
                </tr>
                <tr>
                  <td>1</td>
                  <td style="width:200px">2gawgawgwgggggggggggggg1ggggggggggggggggg</td>
                  <td>3</td>
                </tr>
            </table>

  </div>
</template>

<script>
import initStyle from '../../common/initStyle'
import http from '../../common/http'
import api from '../../common/api'
import pagination from '../../component/pagination'
var _self = {};
export default {
  components: {
    pagination,
  },
  data () {
    return {
      searchData:{
        provider:{
          providerName:'',  //供应商名称
          providerType:'',  //供应商类别
          cooperationMode:'', //合作模式
          status:'',  //是否停用
        },
        offset: 0,
        length: 20,
      },
      tableList:[],       //保存查询结果
      totalCount:'',      //查询记录条数
      newProviderData:{ 
        status:'NORMAL',
        providerName:'',         //供应商名称
        cooperationMode:'',          //合作模式
        providerType:'',         //供应商类别
        specialSupply:'',   //是否特殊供价
        providerLevel:'',         //供应商级别
        providerRegion:'',         //区域
        currency:'',         //币种
        bankName:'',         //开户行
        bankAddress:'',         //银行地址
        bankAccountNumber:'',         //账号
        swiftCode:'',         //SWIFT码
        companyAddress:'',  //公司地址
        onlinePayType:'',         //在线支付方式
        onlineReceiveAccount:'',         //在线支付收款账号
        contactName:'',         //联系人
        contactPhone:'',         //联系电话
        contactEmail:'',        //email
        contactDescription:'',            //描述
      },
      updateIndex:-1,   //表示模态框是用于新建供应商-1,还是更新供应商大于1
      showEditLogTable:false,   //是否显示编辑日志
      // showEditLog:false,

      cooperationModeArray: {  //合作模式数组
        DEALER: '经销',
        AGENT: '代销',
        OTHER: '其他',
      },  
      providerTypeArray: {  //类别数组
        STORAGE: '仓储',
        BOOK: '订货',
        PROMOTION: '推广',
        GIFT_BOOK: '赠品采购',
        OTHER: '其他',
      },  
      specialSupplyArray: {  //是否特殊供价数组
        SPECIAL: '特殊',
        NORMAL: '正常',
      }, 
      providerLevelArray: {  //供应商级别数组
        BRAND: '品牌商',
        COUNTRY_AGENT: '全国总代',
        PROVINCE_AGENT: '省代',
        REGION_AGENT: '区域代理',
        OTHER: '其他',   
      }, 
      providerRegionArray: {  //区域数组
        DOMESTIC: '国内',
        OVERSEAS: '跨境',
      }, 
      currencyArray: {  //币种数组
        RMB: '人民币',
        US: '美元',
      }, 
      onlinePayTypeArray: {  //币种数组
        ALIPAY: '支付宝',
        WEIXIN: '微信支付',
      }, 
      overseasStatusArray:{
        UNDO: '未维护',
        DONE: '已维护',
      }, 

      isCreateSupp: false,
    }
  },
  mounted () {
    _self = this;
    this.$nextTick(() => {
      initStyle();
    });
  },
  methods: {
    paginate (data) {
      _self.searchData.offset = data.offset;
      _self.searchData.length = data.length;
      _self.getTableList();
    },
    getTableList(){
      http({
        instance: _self,
        url: api.getProviderTableList,     //searchData
        type: 'post',
        data:{"data":_self.searchData,},//         shop/search
        success (res) {
          _self.tableList=res.data.content;
          _self.totalCount=res.data.totalCount;
          if(res.data.totalCount==0){
            layer.msg("<span style='color:red'>好像没有查到数据 !</span>", {icon: 5});
          }
        }
      });   
    },  
    edit(trItem,index){
      for (let i in _self.newProviderData) {      //将要编辑的店铺信息复制到newShopData中
        if(typeof(trItem[i])==="undefined"){
          _self.newProviderData[i]='';
        }else{
          _self.newProviderData[i]=trItem[i];
        }      
      }
      _self.updateIndex = index; //此时的模态框是用来更新店铺信息的
      _self.isCreateSupp = true;   //显示模态框
    },
    checkUserInput(){     //
      var checkedPropertys=new Array('providerName','cooperationMode','providerLevel','providerRegion','currency');
      for(var i=0;i<checkedPropertys.length;i++){
        if(!_self.newProviderData[checkedPropertys[i]]){
          layer.msg(checkedPropertys[i]+"字段不能为空", {time: 2000});
          return false;
        }
      }
      if(_self.newProviderData.specialSupply==''){
        if(_self.newProviderData.providerType=='BOOK'){
          layer.msg("当选择订货时,请选择是否特殊供价", {time: 2000});
          return false;
        }
      }
      if(_self.newProviderData.providerType!='BOOK'){
        _self.newProviderData.specialSupply=null;
      }
      return true;
    },
    showModel(){
      _self.clearnewProviderData();
      _self.isCreateSupp = true;
    },
    clearnewProviderData(){
       for (let index in _self.newProviderData){ 
         _self.newProviderData[index]='';
       }
       _self.newProviderData.status='NORMAL';
    },
    newPrivider(){
      if(!_self.checkUserInput()){
        return;
      }
      http({
        instance: _self,
        url: api.addProvider,
        type: 'post',
        data:{"data":_self.newProviderData,},//testData  searchData
          success (res) {
            if(res.success){
              layer.msg("创建成功", {time: 2000});
              _self.clearnewProviderData();
              _self.isCreateSupp = false;
            }
          }
      });   
    },
    updatePrivider(){
      if(!_self.checkUserInput()){
        return;
      }
      _self.newProviderData['providerId']=_self.tableList[_self.updateIndex].providerId; 
       http({
        instance: _self,
        url: api.modifyProvider,     //searchData
        type: 'post',
        data:{"data":_self.newProviderData,},//         shop/search
        success (res) {
          if(res.success){
            layer.msg("操作成功", {time: 2000});
          }
          _self.tableList[_self.updateIndex]=res.data;
          _self.isCreateSupp = false;
          _self.updateIndex =-1;
          _self.clearnewProviderData();
        }
      });   
    },
    enablOrDisable(trItem,status){    //启用或停用
      http({
        instance: _self,
        url: api.modifyProvider,     
        type: 'post',
        data:{"data":{
          providerId:trItem.providerId,
          status:status
        },},
        success (res) {
          trItem.status=status;
        }
      });   
    }, 
  }
}
</script>

<style scoped>
.suppManage {
  .btnRight {
    text-align: right;
  }
}
.modeTitle{
  font-weight:900;
}
/*.logTable{
  position: absolute;
  width:500px;
  background:#FFFBDF;
  td{ border:solid 1px #FFFBDF}
}*/
.required:after {
    content: '*';
    color: #f00;
    margin: 0 0 0 3px;
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
    width: 700px;
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
      height: 425px;
  }
  .popup-footer {
      width: 100%;
      text-align: right;
      padding: 10px;
      border-top: 1px solid #d2d6de;
  }
</style>