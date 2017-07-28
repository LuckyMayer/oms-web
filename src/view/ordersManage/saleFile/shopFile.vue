<template>
  <div class="content-wrapper">
    <section class="content-header clearfix">
      <ol class="breadcrumb col-md-6">
          <li><a href="#"><i class="fa fa-desktop"></i>销售档案</a></li>
          <li class="active">店铺建档</li>
      </ol>
      <div class="col-md-6" style="text-align: right; position: relative; top: 10px;">    
        <button class="btn btn-sm btn-primary" @click="openCover">
        <i class="fa fa-plus"></i>新建店铺</button>
      </div>
    </section>
    <!-- Main content -->
    <section class="content content_yjlu shopFile">
      <div class="row form-horizontal searchContent">
        <div class="form-group">
          <div class="col-sm-4">
            <label class="control-label col-sm-4">店铺名称</label>
            <div class="col-sm-8">
              <input class="form-control input-sm" type="text" placeholder="模糊搜索" v-model="searchData.shop.shopName"/>
            </div>
          </div>
          <div class="col-sm-3">
            <label class="control-label col-sm-4">店铺类型</label>
            <div class="col-sm-8">
              <select class="form-control select-sm" v-model="searchData.shop.shopType">
                <option value="">--所有类别--</option>
                <option v-for="(item,index) in shopTypeArray" :value="index">{{item}}</option>
              </select>
            </div>
          </div>
          <div class="col-sm-3">
            <label class="control-label col-sm-4">合作模式</label>
            <div class="col-sm-8">
              <select class="form-control select-sm" v-model="searchData.shop.cooperationMode">
                <option value="">--所有模式--</option>
                <option v-for="(item,index) in cooperationModeArray" :value="index">{{item}}</option>
              </select>
            </div>
          </div>
          <div class="col-sm-2">
            <button class="btn btn-sm btn-primary" id="btn-search" @click="searchTableList">
              <i class="fa fa-search"></i>查询</button>
          </div>
        </div>
      </div>
      <div class="box-body table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>店铺名称</th>
              <th>店铺类型</th>
              <th>平台</th>
              <th>运营开始年月</th>
              <th>渠道类型</th>
              <th>跨境/国内</th>
              <th>合作模式</th>
              <th>主体公司</th>
              <!-- <th>店铺对接</th> -->
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(trItem, index) in tableList">
              <td>{{trItem.shopName}}</td>
              <td>{{shopTypeArray[trItem.shopType]}}</td>
              <td>{{shopPlatformArray[trItem.shopPlatform]}}</td>
              <td>{{trItem.operationStartTime}}</td>
              <td>{{channelTypeArrayz[trItem.channelType]||channelTypeArrayf[trItem.channelType]}}</td>
              <td>{{shopRegionArray[trItem.shopRegion]}}</td>
              <td>{{cooperationModeArray[trItem.cooperationMode]}}</td>
              <td>{{mainCompanyArray[trItem.mainCompany]}}</td>
              <!-- <td>{{shopButtArray[trItem.shopButt]}}</td> -->
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
      <!-- </div> -->
    </section>
    <!-- 开始弹出框 -->
        <div class="popup-wrap-zn" v-if="isCreateShop">
          <div class="popup-content row form-inline">
            <p class="popup-title" v-if="updateIndex==-1">新建店铺</p>
            <p class="popup-title" v-if="updateIndex>-1">更新店铺</p>
            <div class="popup-main">
              <div class="myRow row">
                <label class="control-label col-sm-2 required">店铺名称</label>
                <div class="col-sm-4">
                  <input class="form-control input-sm shopNameIpt" type="text" @focus="createShopNameTip" placeholder="命名唯一，不支持特殊字符" v-model="newShopData.shopName"/>
                </div>
                <label class="control-label col-sm-2 required">店铺类别</label>
                <div class="col-sm-4">
                  <select class="form-control"  v-model="newShopData.shopType">
                   <option v-for="(item,index) in shopTypeArray" :value="index">{{item}}</option>
                  </select>
                </div>
              </div>
              <div class="myRow row">
                <label class="control-label col-sm-2 required">项目名称</label>
                <div class="col-sm-4">
                  <input class="form-control input-sm shopNameIpt" type="text" v-model="newShopData.projectName"/>
                </div>
                <label class="control-label col-sm-2 required">所属类目</label>
                <div class="col-sm-4">
                  <input class="form-control input-sm shopNameIpt" type="text" placeholder="包裹所属类目" v-model="newShopData.packageCategory"/>
                </div>
              </div>
              <div class="myRow row">
                <label class="control-label col-sm-2 required">店铺昵称</label>
                <div class="col-sm-4">
                  <input class="form-control input-sm shopNameIpt" type="text" v-model="newShopData.shopNick"/>
                </div>
                <label class="control-label col-sm-2 required">支付方式</label>
                <div class="col-sm-4">
                  <select class="form-control" v-model="newShopData.paymentType">
                    <option v-for="(item,index) in paymentTypeArray" :value="index">{{item}}</option>
                  </select>
                </div>
              </div>
              <div class="myRow row">
                <label class="control-label col-sm-2 required">渠道类型</label>
                <div class="col-sm-4">
                  <select class="form-control" v-model="newShopData.channelType">
                    <template v-if="newShopData.shopType == 'DIRECT'">
                      <option v-for="(item,index) in channelTypeArrayz" :value="index">{{item}}</option>
                    </template>
                    <template v-else>
                      <option v-for="(item,index) in channelTypeArrayf" :value="index">{{item}}</option>
                    </template>
                  </select>
                </div>
                <label class="control-label col-sm-2 required">所属平台</label>
                <div class="col-sm-4">
                  <select class="form-control" v-model="newShopData.shopPlatform">
                    <option v-for="(item,index) in shopPlatformArray" :value="index">{{item}}</option>
                  </select>
                </div>
              </div>
              <div class="myRow row">
                <label class="control-label col-sm-2 required">跨境/国内</label>
                <div class="col-sm-4">
                  <select class="form-control" v-model="newShopData.shopRegion">
                    <option v-for="(item,index) in shopRegionArray" :value="index">{{item}}</option>
                  </select>
                </div>
                <label class="control-label col-sm-2 required">合作模式</label>
                <div class="col-sm-4">
                  <select class="form-control" v-model="newShopData.cooperationMode">
                    <option v-for="(item,index) in cooperationModeArray" :value="index">{{item}}</option>
                  </select>
                </div>
              </div>
              <div class="myRow row">
                <label class="control-label col-sm-2 required">品牌</label>
                <div class="col-sm-4">
                  <input class="form-control input-sm" type="text" placeholder="该店专营品牌" v-model="newShopData.shopBrand"/>
                </div>
                <label class="control-label col-sm-2 required">集团</label>
                <div class="col-sm-4">
                  <input class="form-control input-sm" type="text" placeholder="子品牌所属的大集团" v-model="newShopData.shopGroup"/>
                </div>
              </div>
              <div class="myRow row">
                <label class="control-label col-sm-2 required">主体公司</label>
                <div class="col-sm-4">
                  <select class="form-control" v-model="newShopData.mainCompany">
                    <option v-for="(item,index) in mainCompanyArray" :value="index">{{item}}</option>
                  </select>
                </div>
                <label class="control-label col-sm-2 required">一级类目</label>
                <div class="col-sm-4">
                  <input class="form-control input-sm" type="text" placeholder="按天猫规则归属" v-model="newShopData.shopCategory1"/>
                </div>
              </div>
              <div class="myRow row">
                <label class="control-label col-sm-2 required">开始运营年月</label>
                <div class="col-sm-4">
                  <date-picker @choose="setTime" :placeholder="newShopData.operationStartTime||'请选择时间'"></date-picker>
                </div>
                <label class="control-label col-sm-2 required">售后电话</label>
                <div class="col-sm-4">
                  <input class="form-control input-sm shopNameIpt" type="text" onkeyup="this.value=this.value.replace(/[^\d]+/g,'');" v-model="newShopData.afterSalePhone"/>
                </div>
              </div>
              <div class="myRow row">
                <label class="control-label col-sm-2 required">币种</label>
                <div class="col-sm-4">
                  <select class="form-control" v-model="newShopData.currency">
                    <option v-for="(item,index) in currencyArray" :value="index">{{item}}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="popup-footer">
              <button v-show="updateIndex>-1" class="btn btn-sm btn-primary" @click="updateShop">
                <i class="fa fa-check"></i>保存</button>
              <button v-show="updateIndex==-1" class="btn btn-sm btn-primary" @click="newShop">
                <i class="fa fa-check"></i>创建</button>
              <button class="btn btn-sm btn-default" @click="cancel"><i class="fa fa-reply"></i>取消</button>
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
import pagination from '../../../component/pagination'
import datePicker from '../../../component/datePicker'

var _self = {};
export default {
  components: {
    datePicker,
    pagination,
  },
  data () {
    return {
      searchData:{
        shop:{
          shopName:'',    //店铺名称
          shopType:'',     //店铺类别
          cooperationMode:'', //合作模式
        },
        offset: 0,
        length: 20,
        needPage:true,
      },
      tableList:[],       //保存查询结果
      totalCount:'',      //查询记录条数
      newShopData:{ 
        shopName:'',         //店铺名称
        shopNick:'',  //店铺昵称
        shopType:'',          //店铺类型
        channelType:'',         //渠道类型
        shopPlatform:'',         //所属平台
        shopRegion:'',         //跨境/国内
        shopBrand:'',         //品牌
        cooperationMode:'',  //合作模式
        shopGroup:'',         //集团
        shopCategory1:'',         //一级类目
        currency:'',         //币种
        operationStartTime:'',         //开始运营年月
        mainCompany:'',         //主体公司
        status:"NORMAL",        //启用：NORMAL；停用：DELETED
        paymentType:'',           
        packageCategory:'',     //包裹所属类目 
        afterSalePhone:'',     //售后电话
        projectName:'',        //项目名称
      },
      updateIndex:-1,   //表示模态框是用于新建店铺-1,还是更新店铺大于1，此时

      shopTypeArray: {  //店铺类型数组
        DIRECT: '直销',
        DISTRIBUTE: '分销',
      },  
      cooperationModeArray: {  //合作模式数组
        DEALER: '经销',
        AGENT: '代销',
        SERVER: '服务',
        SELF: '自营',
      },  
      paymentTypeArray:{  //店铺对接数组
        银行转账:'银行转账',
        支付宝:'支付宝',
        微信支付:'微信支付',
      },
      // shopButtArray: {  //店铺对接数组,被删除了
      //   ON: '对接',
      //   OFF: '不对接',
      // },  
      channelTypeArrayz: {  //直销-渠道类型数组
        TMALL_FLAGSHIP: '天猫旗舰店',
        POP: 'POP',
        BRAND_OFFICIAL: '品牌官网',
        CUN_TAO: '村淘',
        GROUP_BUY: '团购',
      },
      channelTypeArrayf:{  //分销-渠道类型数组
          MARKET_DISTRIBUTOR: '集市分销商',
          TMALL_DISTRIBUTOR: '天猫分销商',
          OTHER_DISTRIBUTOR: '其他分销商',
          TAOWAI_DISTRIBUTOR: '淘外分销',
          EKA: 'EKA',
          TMALL_SUPERMARKET: '猫超',
      },
      shopPlatformArray: {  //所属平台数组
        TMALL: '天猫',
        TMALL_I18N: '天猫国际',
        TMALL_SUPERMARKET_OFFLINE: '线下猫超',
        DISTRIBUTOR_OFFLINE: '线下分销',
        EKA_OFFLINE: '线下EKA',
      },
      shopRegionArray: {  //跨境/国内数组
        DOMESTIC: '国内',
        OVERSEAS: '跨境',
      }, 
      mainCompanyArray: {  //主体公司数组
        LEMALL_SHANGHAI: '上海乐麦',
        LEQEE_DONGGUAN: '东莞乐其',
        BELRED: 'belred',
        LEMALL_HANGZHOU: '杭州乐麦',
        LEPEE_BEIJING: '北京乐品',
        LEBEE_SUZHOU: '苏州乐贝',
      },
      currencyArray: {  //币种数组
        RMB: '人民币',
        US: '美元',
      }, 
      isCreateShop: false,
    }
  },
  mounted () {
    _self = this;
    this.$nextTick(() => {
      initStyle();
    });
  },
  methods: {
    openCover () {
      _self.updateIndex = -1;
      _self.isCreateShop = true;
    },
    closeCover (event) {
      event.preventDefault();
      _self.isCreateShop = false;
      _self.updateIndex = -1;
    },
    setTime(result){
      _self.newShopData.operationStartTime=result.data;
    },
    paginate (data) {
      _self.searchData.offset = data.offset;
      _self.searchData.length = data.length;
      _self.searchTableList();
    },
    searchTableList(){
      http({
        instance: _self,
        url: api.getShopTableList,     //searchData
        type: 'post',
        data:{"data":_self.searchData,},//         shop/search
        success (res) {
          _self.tableList=res.data.content;
          _self.totalCount=res.data.totalCount;
        }
      });   
    },    
    clearNewShopData(){
      for (let i in _self.newShopData) {      //将要编辑的店铺信息复制到newShopData中
        if(i=="status"){
          _self.newShopData[i]='NORMAL';
        }else{
          _self.newShopData[i]='';
        }      
      }
    },
    cancel(){
      _self.clearNewShopData();
      _self.isCreateShop=false;
    },
    edit(trItem,index){
      for (let i in _self.newShopData) {      //将要编辑的店铺信息复制到newShopData中
        if(typeof(trItem[i])==="undefined"){
          _self.newShopData[i]='';
        }else{
          _self.newShopData[i]=trItem[i];
        }      
      }
      _self.newShopData['shopId']=trItem.shopId;  
      _self.updateIndex = index; //此时的模态框是用来更新店铺信息的
      _self.isCreateShop = true;   //显示模态框
    },
    updateShop(){
      if(!_self.checkUserInput()){
        return;
      }
       http({
        instance: _self,
        url: api.modifyShop,     //searchData
        type: 'post',
        data:{"data":_self.newShopData,},//         shop/search
        success (res) {
          _self.tableList[_self.updateIndex]=res.data;
          _self.isCreateShop = false;
          _self.clearNewShopData();
        }
      });   
    },
    enablOrDisable(trItem,status){    //启用或停用
       http({
        instance: _self,
        url: api.modifyShop,     
        type: 'post',
        data:{"data":{
          shopId:trItem.shopId,
          status:status
        },},
        success (res) {
          trItem.status=status;
        }
      });   
    },
    checkUserInput(){     //
      for (let index in _self.newShopData){  //新建店铺时每个字段都不能为空
        if(!_self.newShopData[index]){
          layer.msg("店铺的每个字段都是必填的！("+index+")字段不能为空", {time: 2000});
          return false;
        }
      }
      return true;
    },
    newShop(){
      if(!_self.checkUserInput()){
        return;
      }
      http({
        instance: _self,
        url: api.addShop,
        type: 'post',
        data:{"data":_self.newShopData,},//testData  searchData
          success (res) {
            layer.msg("创建成功", {time: 2000});
            _self.isCreateShop = false;
            _self.clearNewShopData();
          }
      });   
    },
    createShopNameTip () {  // 创建店铺名字的提示
      layer.tips('若为旗舰店或POP,则使用“店铺名称(平台)”,如“Huggies好奇官方旗舰店(天猫)”或“高洁丝官方旗舰店(拼多多)”;<br/>若为EKA,则使用“品牌-平台”,如“确美同-唯品会”;<br/>若为分销店,则使用“品牌-分销”,如“好奇-分销”', '.shopNameIpt', {
        tips: [3, '#c00']
      });
    }
  }
}
</script>

<style scoped>
  .col-sm-2, .col-sm-3,.col-sm-4.col-sm-6,{
    padding-left:0px;
  }
  .hand{cursor: pointer;}
  .enable {
    color: green;
  }
  .disable {
    color: red;
  }

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
      height: 366px;
  }
  .popup-footer {
      width: 100%;
      text-align: right;
      padding: 10px;
      border-top: 1px solid #d2d6de;
  }
</style>