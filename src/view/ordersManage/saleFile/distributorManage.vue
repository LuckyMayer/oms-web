<template>
  <div class="content-wrapper">
    <section class="content-header clearfix">
      <ol class="breadcrumb col-md-6">
        <li><a href="#"><i class="fa fa-desktop"></i>店铺</a></li>
        <li class="active">分销商管理</li>
      </ol>
      <div class="col-md-6" style="text-align: right; position: relative; top: 10px;">
        <button class="btn btn-primary btn-sm" @click="addDistributor">
          <i class="fa fa-plus"></i>新建分销商
        </button>
      </div>
    </section>

    <!-- Main content -->
    <section class="content distributorManage content_yjlu">
      <div class="row form-horizontal searchContent">
        <div class="from-group">
          <div class="col-sm-6">
            <label class="col-sm-2 control-label">分销商名称</label>
            <div class="col-sm-8">
              <input class="form-control input-sm" type="text" v-model="searchMsg" placeholder="模糊搜索" />
            </div>
          </div>
          <div class="col-sm-3">
            <button class="btn btn-default btn-sm" @click="getDistributorData(searchMsg)"><i class="fa fa-search"></i>查询</button>
          </div>
        </div>
      </div>
      <div class="box box-default">
        <div class="box-body">
          <table class="table">
            <thead>
              <tr>
                <th>分销商编号</th>
                <th>分销商名称</th>
                <th>合作模式</th>
                <th>币种</th>
                <th>预存款</th>
                <th>预存款预警</th>
                <!-- <th>联系人</th>
                <th>收件信息</th>
                <th>预存款使用</th>
                <th>预警短信/预警金额</th> -->
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(trItem, index) in tableList">
                <td v-text="trItem.distributorId"></td>
                <td v-text="trItem.distributorName"></td>
                <td>{{trItem.cooperationMode | cooperationModeType}}</td>
                <td>{{trItem.currency | currencyType}}</td>
                <td>{{trItem.isPrepayment | booleanVal}}</td>
                <td>{{trItem.isMessageWarning | booleanVal}}</td>
                <!-- <td>{{trItem.contact}} <span v-if="trItem.contact != undefined && trItem.contact != ''">/</span> {{trItem.contactMobile}}<br/>{{trItem.contactPhone}}</td>
                <td>{{trItem.receiverName}} <span v-if="trItem.receiverName != undefined && trItem.receiverName != ''">/</span> {{trItem.receiverMobile}}<br/><span class="test">{{trItem.receiverProvinceName}}{{trItem.receiverCityName}}{{trItem.receiverDistrictName}}{{trItem.receiverAddress}}<span></td>
                <td>{{trItem.isPrepayment | booleanVal}}<br/> --><!-- 余额：{{trItem.remainMoney}} --><!-- </td> -->
                <!-- <td>{{trItem.isMessageWarning | booleanVal}}<br/>预警金额：{{trItem.warningMoney}}</td> -->
                <td>
                  <a class="edit" @click="editDistr(trItem, index)">编辑</a>
                  <!-- <a class="edit" @click="save(trItem)" v-show="trItem.isEdit">保存</a> -->
                  <enable-diasble-btn idname="distributorId" :id="trItem.distributorId" :status="trItem.status" enableapi="distributorEnable" disableapi="distributorDisable" :refresh="getDistributorData" ref="child"></enable-diasble-btn>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="box-footer clearfix">
          <div class="col-md-2 no-padding"></div>
          <!-- <pagination :page-no="pageData.pageNo" :page-size="formData.length" 
          :item-total="pageData.itemTotal" :pages-total="pageData.pagesTotal" 
          :has-prev="pageData.hasPrev" :has-next="pageData.hasNext" @paginate="paginate"></pagination> -->
          <pagination :offset="formData.offset" :length="formData.length" :total-count="pageData.pagesTotal" @paginate="paginate"></pagination>
        </div>
      </div>
    </section>

    <!-- 弹窗 -->
    <div class="popup-wrap-yjlu popup-distributorManage" v-if="isOpen">
      <div class="popup-content row form-inline">
        <p class="popup-title" v-if="covertype === 'update'">更新分销商</p>
        <p class="popup-title" v-if="covertype === 'add'">新建分销商</p>
        <div class="popup-main clearfix">
          <div class="col col-md-12">
            <div class="form-group">
              <label class="popup-laval required">分销商名称</label>
              <input class="form-control input-sm" type="text" v-model="distributorData.distributorName" placeholder="命名唯一" />
            </div>
            <div class="form-group">
              <label class="popup-laval">币种</label>
              <select class="form-control select-sm" v-model="distributorData.currency">
                <option value="RMB">人民币</option>
              </select>
            </div>
            <div class="form-group">
              <label class="popup-laval">联系人</label>
              <input class="form-control input-sm" type="text" v-model="distributorData.contact" />
            </div>
            <div class="form-group">
              <label class="popup-laval">默认收件人</label>
              <input class="form-control input-sm" type="text" v-model="distributorData.receiverName" />
            </div>
            <div class="form-group">
              <label class="popup-laval">联系手机</label>
              <input class="form-control input-sm" type="text" v-model="distributorData.contactMobile" />
            </div>
            <div class="form-group">
              <label class="popup-laval">收件手机</label>
              <input class="form-control input-sm" type="text" v-model="distributorData.receiverMobile" />
            </div>
            <div class="form-group">
              <label class="popup-laval">联系电话</label>
              <input class="form-control input-sm" type="text" v-model="distributorData.contactPhone" />
            </div>
            <div class="form-group">
              <label class="popup-laval required">合作模式</label>
              <select class="form-control select-sm" v-model="distributorData.cooperationMode">
                <option value="DISTRIBUTION">经销</option>
                <option value="PROXY">代销</option>
                <option value="OWE_SALE">赊销</option>
              </select>
            </div>
            <div class="form-group" v-if="distributorData.cooperationMode == 'OWE_SALE'">
              <label class="popup-laval required">赊销回款天数</label>
              <input class="form-control input-sm" type="text" v-model="distributorData.backDay" />
            </div>
            <div class="form-group">
              <label class="checkbox-inline"><input type="checkbox" v-model="distributorData.isPrepayment" />是否使用预存款</label>
            </div>
            <div class="form-group" v-if="distributorData.isPrepayment">
              <label class="popup-laval">预存款预警金额</label>
              <input class="form-control input-sm" type="text" v-model="distributorData.warningMoney" />
            </div>
            <div class="form-group">
              <label class="checkbox-inline"><input type="checkbox" v-model="distributorData.isMessageWarning" />是否发送预存款不足短信</label>
            </div>
            <div class="form-group">
              <label class="popup-laval">收件地址</label>
              <address-folder show-arr-len="3" is-choose-all="true" @choose-region="chooseRegion" :selected-province="regionData.province" :selected-city="regionData.city" :selected-district="regionData.region"></address-folder>
            </div>
            <div class="form-group">
              <label class="popup-laval">具体地址</label>
              <input class="form-control input-sm" type="text" v-model="distributorData.receiverAddress" />
            </div>
          </div>
        </div>
        <div class="popup-footer">
          <button class="btn btn-sm btn-primary" @click="saveDistr(covertype)">
            <i class="fa fa-check"></i>保存
          </button>
          <button class="btn btn-sm btn-default" @click="closePopup($event)"><i class="fa fa-reply"></i>取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import initStyle from '../../../common/initStyle'
import http from '../../../common/http'
import api from '../../../common/api'

import addressFolder from '../../../component/addressFolder'
import pagination from '../../../component/pagination'
import enableDiasbleBtn from '../../../component/enableOrDisableBtn'
export default {
  components: {
    addressFolder,
    pagination,
    enableDiasbleBtn
  },
  data () {
    return {
      distributorData: {
        distributorName: '',
        currency: 'RMB',
        contact: '',
        contactPhone: '',
        contactMobile: '',  // 联系手机
        receiverName: '',
        receiverMobile: '',
        cooperationMode: 'DISTRIBUTION',
        isPrepayment: false,
        isMessageWarning: false,
        backDay: '',
        warningMoney: '',
        receiverProvince: '',
        receiverCity: '',
        receiverDistrict: '',
        receiverAddress: '',
      },
      regionData: {
        province: {},
        city: {},
        region: {}
      },
      tableList: [],
      searchMsg: '',
      formData: {       //
        name: '',
        containsGoodsId: '',
        containsGoodsCode:'',
        status:'',
        offset: 0,
        length: 20,   
      },
      pageData: {
        pageNo:1,       //用于存放当前页码
        itemTotal: 0,
        hasPrev: false,
        hasNext: false,
        pagesTotal: 0
      },
      isOpen: false,
      covertype: '',
      curTrIndex: ''
    }
  },
  mounted () {
    this.$nextTick( () => {
      initStyle();
      this.getDistributorData('');
    });
  },
  filters: {
    booleanVal (val) {
      switch (val) {
        case false:
          return '否';
          break;
        case true:
          return '是';
          break;
      }
    },
    cooperationModeType (val) {
      switch (val) {
        case 'DISTRIBUTION':
          return '经销';
          break;
        case 'PROXY':
          return '代销';
          break;
        case 'OWE_SALE':
          return '赊销';
          break;
      }
    },
    currencyType (val) {
      switch (val) {
        case 'RMB':
        return '人民币';
        break;
      }
    }
  },
  methods: {
    // 查询
    getDistributorData (keyWords) {
      const _self = this;
      http({
        instance: _self,
        url: api.getDistributorData,
        type: 'post',
        hasLoading: true,
        data: {
          data: {
            partyId: '',
            offset: _self.formData.offset,
            length: _self.formData.length,
            keyWords: keyWords
          }
        },
        success (res) {
          console.log(res);
          if (res.code == 200) {
            _self.tableList = res.data.content;
            if (_self.tableList.length) {
              _self.tableList.forEach(function (item, index) {
                if (item.receiverProvince) {
                  _self.$set(item, 'receiverProvinceName', item.receiverProvince.regionName);
                }
                if (item.receiverCity) {
                  _self.$set(item, 'receiverCityName', item.receiverCity.regionName);
                }
                if (item.receiverDistrict) {
                  _self.$set(item, 'receiverDistrictName', item.receiverDistrict.regionName);
                }
              });
            }
            _self.pageData.pagesTotal = res.data.totalCount;
          }
        }
      });
    },
    addCheck () {
      var isAdd = true;
      if (!this.distributorData.distributorName.trim()) {
        layer.msg('请填写分销商名称', {time: 2000});
        isAdd = false;
      } else if (this.distributorData.contactMobile.trim()) {
        if (!(/^1[34578]\d{9}$/.test(this.distributorData.contactMobile))) {
          layer.msg('请填写正确的联系手机', {time: 2000});
          isAdd = false;
        }
      } else if (this.distributorData.receiverMobile.trim()) {
        if (!(/^1[34578]\d{9}$/.test(this.distributorData.receiverMobile))) {
          layer.msg('请填写正确的收件手机', {time: 2000});
          isAdd = false;
        }
      } else if (this.distributorData.cooperationMode == 'OWE_SALE' && this.distributorData.backDay == '') {
        layer.msg('请填写赊销回款天数', {time: 2000});
        isAdd = false;
      }
      return isAdd;
    },
    saveDistr (type) {
      const _self = this;
      if (_self.addCheck()) {
        if (type === 'add') {
          http({
            instance: _self,
            url: api.addDistributor,
            type: 'post',
            data: {
              data: _self.distributorData
            },
            hasLoading: false,
            success (res) {
              console.log(res);
              if (res.code == 200) {
                layer.msg('新建成功', {time: 2000});
                _self.isOpen = false;
                _self.getDistributorData();
              }
            }
          });
        } else if (type === 'update') {
          // _self.distributorData.receiverProvince = _self.distributorData.receiverProvince.regionId;
          // _self.distributorData.receiverCity = _self.distributorData.receiverCity.regionId;
          // _self.distributorData.receiverDistrict = _self.distributorData.receiverDistrict.regionId;
          http({
            instance: _self,
            url: api.distributorModify,
            type: 'post',
            data: {
              data: _self.distributorData
            },
            hasLoading: false,
            success (res) {
              console.log(res);
              if (res.code == 200) {
                layer.msg('修改成功', {time: 2000});
                _self.isOpen = false;
                _self.getDistributorData();
              }
            }
          });
        }
      }
    },
    addDistributor () {
      const _self = this;
      _self.isOpen = true;
      _self.covertype = 'add';
      _self.celarDistributorData();
    },
    celarDistributorData(){     //将distributorData恢复为最初的状态
      // this.distributorData.partyId='';
      this.distributorData.distributorName='';
      this.distributorData.currency='RMB';
      this.distributorData.contact='';
      this.distributorData.contactPhone='';
      this.distributorData.contactMobile='';
      this.distributorData.receiverName='';
      this.distributorData.receiverMobile='';
      this.distributorData.cooperationMode='DISTRIBUTION';
      this.distributorData.isPrepayment=false;
      this.distributorData.isMessageWarning=false;
      this.distributorData.backDay='';
      this.distributorData.warningMoney='';
      this.distributorData.receiverProvince='';
      this.distributorData.receiverCity='';
      this.distributorData.receiverDistrict='';
      this.distributorData.receiverAddress='';
    },
    editDistr (msg, i) {
      const _self = this;
      _self.isOpen = true;
      _self.covertype = 'update';
      _self.curTrIndex = i;
      _self.celarDistributorData();
      _self.distributorData['distributorId'] = msg.distributorId;
      for (const i in msg) {
        for (const j in _self.distributorData) {
          if (i == j) {
            _self.distributorData[j] = msg[i];
          }
        }
      }
      _self.regionData.province = msg.receiverProvince;
      _self.regionData.city = msg.receiverCity;
      _self.regionData.region = msg.receiverDistrict;
      console.log(_self.regionData.region);
    },
    chooseRegion (val) {
      const _self = this;
      _self.distributorData.receiverProvince = val.province.regionId;
      _self.distributorData.receiverCity = val.city.regionId;
      _self.distributorData.receiverDistrict = val.region.regionId;
      // _self.regionData.province = val.province;
      // _self.regionData.city = val.city;
      // _self.regionData.region = val.region;
    },
    // 分页
    paginate (data) {
      this.formData.offset = data.offset;
      this.formData.length = data.length;
      this.getDistributorData('');
    },
    closePopup (e) {
      this.isOpen = false;
    }
  }
}
</script>

<style lang="sass">
.popup-distributorManage {
  .popup-content {
    width: 475px !important;
  }
  .popup-laval {
    width: 7em;
    text-align: right;
  }
  .checkbox-inline {
    margin-left: 6em;
  }
}

// distributorManage by yjlu ==> common.css  (唉~显示不出注释~我也很无奈。。。)
@mixin center($width: null, $height: null) {
  position: absolute;
  top: 50%;
  left: 50%;
  @if not $width and not $height {
    transform: translate(-50%, -50%);
  } @else if $width and $height {
    width: $width;
    height: $height;
    margin: -($height / 2) #{0 0} -($width / 2);
  } @else if not $height {
    width: $width;
    margin-left: -($width / 2);
    transform: translateY(-50%);
  } @else {
    height: $height;
    margin-top: -($height / 2);
    transform: translateX(-50%);
  }
}
@mixin default_col-sm () {
  $colNum: 12;
  @for $i from 1 through $colNum {
    .col-sm-#{$i} {
      padding-left: 6px;
      padding-right: 6px;
    }
  }
}
$textAlignRight: right;
$textAlignLeft: left;
$textAlignCenter: center;
.content_yjlu {
  @include default_col-sm();
  .row, .form-horizontal .form-group {
    margin-left: 0;
    margin-right: 0;
  }
  .form-group {
    margin-bottom: 10px;
  }
  .searchContent {
    background: #fff;
    padding: 10px 0;
    margin-bottom: 10px;
  }
  .required:after {
    content: '*';
    color: #f00;
    margin: 0 0 0 3px;
  }
  // .form-control {
  //   padding: 6px;
  // }
  .smSelect {
    display: inline-block;
    width: auto;
  }
  .btns {
    padding: 5px 0 5px 0;
    background-color: #fff;
    button {
      margin: 0 10px 0 0;
    }
  }
  .fa {
    margin-right: 6px;
  }
  table {
    a {
      cursor: pointer;
    }
    tr td {
      vertical-align: middle;
      text-align: center;
    }
  }
  .textAlignRight {
    text-align: $textAlignRight;
  }
  .textAlignLeft {
    text-align: $textAlignLeft;
  }
  .textAlignCenter {
    text-align: $textAlignCenter;
  }
  /** icon样式 **/
  .iconfontEdit {
    color: #6799FF;
    font-size: 18px;
    cursor: pointer;
  }
  .iconfontYes {
    color: #77BF28;
    font-size: 18px;
    cursor: pointer;
  }
  .iconfontNo {
    color: #F86767;
    font-size: 18px;
    cursor: pointer;
  }
  .iconfontDelete {
    color: #F86767;
    font-size: 18px;
    cursor: pointer;
  }
  .bgFFF {
    padding: 15px 0 0 0;
    background: #fff;
  }
  .iconfontAdd {
    color: #696969;
    font-size: 15px;
    cursor: pointer;
  }
  small {
    display: inline-block;
    position: relative;
    font-size: 14px;
    font-weight: bold;
    margin: 15px 0 5px 0;
  }
  small:before {
    position: absolute;
    top: 3px;
    left: -10px;
    display: inline-block;
    content: '';
    width: 3px;
    height: 14px;
    background: #0081c2;
  }
  select, input {
    font-size: 12px;
  }
}
.popup-wrap-yjlu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.5);
  z-index: 999;
  .popup-content {
    position: absolute;
    top: 100px;
    left: 50%;
    width: 380px;
    min-height: 460px;
    margin-left: -230px;
    background-color: #fff;
    border-radius: 5px;
    z-index: 999;
    .form-group {
      display: block;
      margin-right: 20px;
      margin-bottom: 10px;
    }
    .form-control {
      width: 200px;
    }
    .required:after {
      content: '*';
      color: #f00;
      margin: 0 0 0 3px;
    }
  }
  .popup-content .col {
      padding-left: 0 !important;
      padding-right: 0 !important;
  }
  .popup-title {
      text-align: left;
      border-bottom: 1px solid #d2d6de;
      padding:10px;
      font-size: 16px;
      margin-bottom: 0;
  }
  .popup-main {
      overflow:hidden;
      padding: 10px;
      height: 400px;
      overflow-y: scroll;
  }
  .popup-footer {
      width: 100%;
      text-align: right;
      padding: 10px;
      border-top: 1px solid #d2d6de;
  }
  .popup-region {
      display: none;
      position: absolute;
      top: 0;
      left: 380px;
      width: 616px;
      height: 463px;
      background-color: #fff;
      border-radius: 5px;
      z-index: 999;
      overflow-x: hidden;
      overflow-y: hidden;
  }
  .popup-region .popup-title {
      width: 100%;
      text-align: left;
      padding:10px;
      font-size: 16px;
      border-bottom: 1px solid #d2d6de;
  }
  .popup-region .popup-main {
      height: 370px;
      overflow-y: scroll;
  }
  .popup-region .popup-footer {
      position: absolute;
      left: 0;
      bottom: 0;
      background-color: #fff;
  }
}
</style>