<template>
  <div class="content-wrapper">

    <section class="content-header">
      <h1>商品详情</h1>
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-desktop"></i> 商品管理</a></li>
        <li class="active">商品详情</li>
      </ol>
    </section>

    <section class="content goodsDetail content_yjlu">
      <h4 class="detailTitle">
        <label class="control-label col-md-1 required" style="padding: 6px 0 0 6px; font-size:16px; text-align: right;" v-if="!$route.params.id">商品名称</label>
        <div class="col-md-10">
          <input class="form-control input-sm" type="text" v-if="!$route.params.id" v-model="goodsDetailData.goodsName">
          <span style="position: relative; top: 7px;" v-if="$route.params.id">{{goodsDetailData.goodsName}}</span>
        </div>
        <button type="button" class="btn btn-sm btn-default goodsOpreate" v-show="$route.params.id">
          <i class="glyphicon glyphicon-remove" v-if="goodsDetailData.status == 'NORMAL'"></i>
          <i class="glyphicon glyphicon-ok" v-if="goodsDetailData.status == 'DELETED'"></i>
          <enable-diasble-btn display="inline-block" idname="goodsId" :id="goodsDetailData.id" :status="goodsDetailData.status" enableapi="goodsEnable" disableapi="goodsDisable" :refresh="getGoodsDetailData" ref="child"></enable-diasble-btn>
        </button>
        <button type="button" class="btn btn-sm btn-default goodsSave col-md-1" @click="goodsSave" v-if="$route.params.id">
          <i class="glyphicon glyphicon-save"></i>保存
        </button>
        <button type="button" class="btn btn-sm btn-default goodsSave col-md-1" @click="newSave" v-if="!$route.params.id">
          <i class="glyphicon glyphicon-save"></i>保存
        </button>
      </h4>
      <div class="goodsDetailInfo basicInfo">
        <small>基本信息</small>
        <div class="row form-horizontal">
        <div class="col-md-12 form-group">
          <div class="col-md-4">
            <div class="form-group">
              <label class="col-sm-2 col-md-3 control-label">商品简称</label>
              <div class="col-sm-10 col-md-9">
                <input id="goodsShortName" class="form-control input-sm" type="text" name="" placeholder="商品简称" v-model="goodsDetailData.goodsShortName">
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-2 col-md-3 control-label required">行业类目</label>
              <div class="col-sm-10 col-md-9">
                <!-- <input id="" class="form-control input-sm" type="text" name="" placeholder="行业类目"
                v-model="goodsDetailData.goodsCategory.name"> -->
                <search-goods-category @selected="searchGoodsCategory" :choosed="goodsDetailData.goodsCategory"></search-goods-category>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-2 col-md-3 control-label required">货品单位</label>
              <div class="col-sm-10 col-md-9">
                <input id="" class="form-control input-sm" type="text" name="" placeholder="货品单位" v-model="goodsDetailData.unit">
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label class="col-sm-2 col-md-3 control-label required">品牌</label>
              <div class="col-sm-10 col-md-9">
                <select-goods-brand @selected="selectGoodsBrand"></select-goods-brand>
                <!-- <input id="" class="form-control input-sm" type="text" name="" placeholder="品牌" v-model="goodsDetailData.goodsBrand.goodsBrandName"> -->
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-2 col-md-3 control-label required">分类</label>
              <div class="col-sm-10 col-md-9">
                <!--<input id="" class="form-control input-sm" type="text" name="" placeholder="分类" v-model="goodsDetailData.goodsCustomCategory.name">-->
                <search-custom-category @selected="searchCustomCategory" :choosed="goodsDetailData.goodsCustomCategory"></search-custom-category>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-2 col-md-3 control-label">标签</label>
              <div class="col-sm-10 col-md-9">
                <search-goods-tag-name @selected="selectGoodsTag" :placeholder="goodsDetailData.goodsTagsChecked"></search-goods-tag-name>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label class="col-sm-3 control-label required">类型</label>
              <div class="col-sm-9">
                <select-goods-type @selected="selectGoodsType"></select-goods-type>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-2 col-md-3 control-label required">税率</label>
              <div class="col-sm-10 col-md-9">
                <input id="" class="form-control input-sm" type="text" name="" placeholder="税率" v-model="goodsDetailData.taxRate" >
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-2 col-md-3 control-label required">币种</label>
              <div class="col-sm-10 col-md-9">
                <input id="" class="form-control input-sm" type="text" name="" placeholder="币种" v-model="goodsDetailData.currency" >
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-12 form-group" v-if="!$route.params.id">
          <label class="col-sm-1 control-label specificationCode">规格码:</label>
          <div class="col-sm-11">
            <div class="form-group">
              <label class="control-label checkbox-inline" v-for="spec in goodsDetailSpecData"><input type="checkbox" :value="spec" v-model="spec.specname">{{spec.name}}</label>
              <!-- <div class="addspecificationCodeBtn" @click="addspecItem">添加</div> -->
              <button class="btn btn-default btn-sm" @click="addspecItem" style="margin-left: 20px;"><i class="glyphicon glyphicon-plus"></i></button>
            </div>
            <div class="form-group specItem" v-for="(specGroup, index) in specList">
              <div class="col-sm-3" v-for="specIndex in specGroup">
                <label class="control-label">{{specIndex.name}}</label>
                <select class="form-control specSelectStyle" v-model="specIndex.valueSelected">
                  <option v-for="specOpt in specIndex.values" :value="specOpt.value">{{specOpt.value}}</option>
                </select>
              </div>
              <i class="glyphicon glyphicon-remove myDel" @click="removeSpecItem(index)"></i>
            </div>
            <div>
              <div class="addspecificationCodeBtn" @click="addspec">添加规格码</div>
            </div>
          </div>
        </div>
        <div class="col-md-12 form-group">
          <label class="col-sm-1 control-label">规格列表:</label>
          <div class="col-sm-11">
            <div class="box-body table-responsive">
              <table class="col-sm-10 table table-bordered table-hover myTable">
                <thead>
                  <tr>
                    <th v-if="!goodsDetailData.styleType1">
                      <nobr>操作</nobr>
                    </th>
                    <th v-if="goodsDetailData.styleType1">
                      <nobr>{{goodsDetailData.styleType1.name}}</nobr>
                    </th>
                    <th v-if="goodsDetailData.styleType2">
                      <nobr>{{goodsDetailData.styleType2.name}}</nobr>
                    </th>
                    <th v-if="goodsDetailData.styleType3">
                      <nobr>{{goodsDetailData.styleType3.name}}</nobr>
                    </th>
                    <th>商家编码</th>
                    <th>系统商品编码</th>
                    <th>商品货号</th>
                    <th>条码属性</th>
                    <th>商品条码<i class="glyphicon glyphicon-info-sign"></i></th>
                    <th class="required">商品重要性</th>
                    <th>零售价</th>
                    <th>批发价</th>
                    <th>固定成本价</th>
                    <th>最低成品价</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(sku, index) in goodsDetailData.skus" :class="{'danger':sku.status == 'DELETED'}">
                    <th v-if="!goodsDetailData.styleType1">
                      <enable-diasble-btn idname="skuId" :id="sku.skuId" :status="sku.status" enableapi="goodsDetailEnable" disableapi="goodsDetailDisable" :refresh="getGoodsDetailData" ref="child"></enable-diasble-btn>
                    </th>
                    <td v-if="goodsDetailData.styleType1">
                      <enable-diasble-btn idname="skuId" :id="sku.skuId" :status="sku.status" enableapi="goodsDetailEnable" disableapi="goodsDetailDisable" :refresh="getGoodsDetailData" ref="child"></enable-diasble-btn>
                      {{sku.styleValue1.value}}
                    </td>
                    <td v-if="goodsDetailData.styleType2">{{sku.styleValue2.value}}</td>
                    <td v-if="goodsDetailData.styleType3">{{sku.styleValue3.value}}</td>
                    <td>
                      <input class="form-control" type="text" v-model="sku.skuCode">
                    </td>
                    <td>
                      <input class="form-control" type="text" v-model="sku.skuId" style="width:130px;" disabled="disabled">
                    </td>
                    <td>
                      <input class="form-control" type="text" v-model="sku.skuNumberId">
                    </td>
                    <td>
                      <select class="form-control" v-model="sku.goodsBarcode">
                        <option value="1G1B">一品一码</option>
                        <option value="1GNB">一品多码</option>
                        <option value="NG1B">多品一码</option>
                      </select>
                    </td>
                    <td><input class="form-control barcodeIpt" type="text" v-model="sku.barcode" @keyup="_selfBarcode(sku.barcode, sku.goodsBarcode)"></td>
                    <td>
                      <select class="form-control" v-model="sku.skuLevel">
                        <option value="NORMAL">一般</option>
                        <option value="IMPORTANT">重要</option>
                        <option value="UNIMPORTANT">不重要</option>
                      </select>
                    </td>
                    <td>
                      <input style="width: 90px;" class="form-control" type="text" v-model="sku.retailPrice">
                    </td>
                    <td>
                      <input style="width: 90px;" class="form-control" type="text" v-model="sku.tradePrice">
                    </td>
                    <td>
                      <input style="width: 90px;" class="form-control" type="text" v-model="sku.costPrice">
                    </td>
                    <td>
                      <input style="width: 90px;" class="form-control" type="text" v-model="sku.lowestCostPrice">
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="form-group marginTop">
              <div class="col-sm-3">
                <select class="form-control" v-model='tr_selected'>
                  <option value="skuCode">商家编码</option>
                  <option value="skuId">系统商品编码</option>
                  <option value="skuNumberId">商品货号</option>
                  <option value="goodsBarcode">条码属性</option>
                  <option value="barcode">商品条码</option>
                  <option value="skuLevel">商品重要性</option>
                  <option value="retailPrice">零售价</option>
                  <option value="tradePrice">批发价</option>
                  <option value="costPrice">固定成本价</option>
                  <option value="lowestCostPrice">最低成品价</option>
                </select>
              </div>
              <div class="col-sm-3">
                <input class="form-control" type="text" v-model="tr_selected_value">
              </div>
              <button class="btn btn-primary" @click="batchFilling">批量填充</button>
            </div>
          </div>
        </div>
      </div>
      <div class="goodsDetailInfo transportInfo">
        <small>运输信息</small>
        <div class="row form-horizontal">
          <div class="col-md-6">
            <div class="form-group">
              <div class="col-md-6">
                <label class="col-sm-2 col-md-4 control-label">箱装单位</label>
                <div class="col-sm-10 col-md-8">
                  <input type="text" class="form-control input-sm" v-model="goodsDetailData.boxUnit">
                </div>
              </div>
              <div class="col-md-6">
                <label class="col-sm-2 col-md-4 control-label">箱规/数量</label>
                <div class="col-sm-10 col-md-8">
                  <input type="text" class="form-control input-sm" v-model="goodsDetailData.boxVolume">
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="col-md-4">
                <label class="col-sm-2 col-md-6 control-label">箱长度</label>
                <div class="col-sm-10 col-md-6">
                  <input class="form-control input-sm transportInfoIpt" type="text" name="" v-model="goodsDetailData.boxLength">
                  <span class="unitIcon">cm</span>
                </div>
              </div>
              <div class="col-md-4">
                <label class="col-sm-2 col-md-6 control-label">箱宽度</label>
                <div class="col-sm-10 col-md-6">
                  <input class="form-control input-sm transportInfoIpt" type="text" name="" v-model="goodsDetailData.boxWidth">
                  <span class="unitIcon">cm</span>
                </div>
              </div>
              <div class="col-md-4">
                <label class="col-sm-2 col-md-6 control-label">箱高度</label>
                <div class="col-sm-10 col-md-6">
                  <input class="form-control input-sm transportInfoIpt" type="text" name="" v-model="goodsDetailData.boxHeight">
                  <span class="unitIcon">cm</span>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="col-md-6">
                <label class="col-sm-2 col-md-4 control-label">温度要求</label>
                <div class="col-sm-10 col-md-8">
                  <select name="" id="" class="form-control" v-model="goodsDetailData.temperatureLimit">
                    <option value="NORMAL">常温</option>
                    <option value="LOW">低温</option>
                    <option value="HIGH">高温</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <label class="col-sm-2 col-md-4 control-label">运输要求</label>
                <div class="col-sm-10 col-md-8">
                  <select name="" id="" class="form-control" v-model="goodsDetailData.transportLimit">
                    <option value="">无</option>
                    <option value="AIR_EMBARGO">航空禁运</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <div class="col-md-4">
                <label class="col-sm-2 col-md-6 control-label">商品长度</label>
                <div class="col-sm-10 col-md-6">
                  <input class="form-control input-sm transportInfoIpt" type="text" name="" v-model="goodsDetailData.length">
                  <span class="unitIcon">cm</span>
                </div>
              </div>
              <div class="col-md-4">
                <label class="col-sm-2 col-md-6 control-label">商品宽度</label>
                <div class="col-sm-10 col-md-6">
                  <input class="form-control input-sm transportInfoIpt" type="text" name="" v-model="goodsDetailData.width">
                  <span class="unitIcon">cm</span>
                </div>
              </div>
              <div class="col-md-4">
                <label class="col-sm-2 col-md-6 control-label">商品高度</label>
                <div class="col-sm-10 col-md-6">
                  <input class="form-control input-sm transportInfoIpt" type="text" name="" v-model="goodsDetailData.height">
                  <span class="unitIcon">cm</span>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="col-md-12">
                <label class="col-sm-2 col-md-2 control-label">商品体积</label>
                <div class="col-sm-10 col-md-10">
                  <input type="text" class="form-control input-sm" v-model="goodsDetailData.volumn">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="goodsDetailInfo warehouseInfo">
        <small>仓库管理信息</small>
        <div class="row form-horizontal">
          <div class="col-md-4">
            <div class="form-group">
              <label class="col-sm-2 col-md-6 control-label required">批次号管理</label>
              <div class="col-sm-6">
                <label class="radio-inline"><input type="radio" name="batchNum" value="true" v-model="goodsDetailData.batchNoManage" />是</label>
                <label class="radio-inline"><input type="radio" name="batchNum" value="false" v-model="goodsDetailData.batchNoManage" />否</label>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-2 col-md-6 control-label required">生产日期管理</label>
              <div class="col-sm-6">
                <label class="radio-inline"><input type="radio" name="manufactureDate" value="true" v-model="goodsDetailData.produceDateManage" />是</label>
                <label class="radio-inline"><input type="radio" name="manufactureDate" value="false" v-model="goodsDetailData.produceDateManage" />否</label>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-2 col-md-6 control-label">填充物使用</label>
              <div class="col-sm-6">
                <label class="radio-inline"><input type="radio" name="fillerUse" value="true" v-model="goodsDetailData.fillerManange"/>是</label>
                <label class="radio-inline"><input type="radio" name="fillerUse" value="false" v-model="goodsDetailData.fillerManange" />否</label>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-2 col-md-6 control-label required">序列号管理</label>
              <div class="col-sm-6">
                <label class="radio-inline"><input type="radio" name="serialNum" value="true" v-model="goodsDetailData.serialManange" />是</label>
                <label class="radio-inline"><input type="radio" name="serialNum" value="false" v-model="goodsDetailData.serialManange" />否</label>
              </div>
            </div>
          </div>
          <div class="col-md-8">
            <div class="form-group">
              <label class="col-sm-2 control-label">保质期管理</label>
              <div class="col-sm-6">
                <label class="radio-inline"><input type="radio" name="shelfLife" value="true" v-model="goodsDetailData.shelfLifeManage" />是</label>
                <label class="radio-inline"><input type="radio" name="shelfLife" value="false" v-model="goodsDetailData.shelfLifeManage" />否</label>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-2 control-label required">临期预警天数</label>
              <div class="col-sm-4">
                <input type="text" class="form-control input-sm" v-model="goodsDetailData.shelfLifeWarning" >
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-2 control-label required">禁发效期天数</label>
              <div class="col-sm-4">
                <input type="text" class="form-control input-sm" v-model="goodsDetailData.shelfLifeBan" />
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-2 control-label required">保质期</label>
              <div class="col-sm-4">
                <input type="text" class="form-control input-sm" v-model="goodsDetailData.shelfLife" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import http from '../../common/http'
import api from '../../common/api'
import initStyle from '../../common/initStyle'
import deepClone from '../../common/deepClone'

import searchGoodsTagName from '../../component/searchGoodsTagName'
import selectGoodsBrand from '../../component/selectGoodsBrand'
import enableDiasbleBtn from '../../component/enableOrDisableBtn'
import selectGoodsType from '../../component/selectGoodsType'
import searchCustomCategory from '../../component/searchCustomCategory'
import searchGoodsCategory from '../../component/searchGoodsCategory'
export default {
  components: {
    searchGoodsTagName,
    selectGoodsBrand,
    enableDiasbleBtn,
    selectGoodsType,
    searchCustomCategory,
    searchGoodsCategory
  },
  data () {
    return {
      sendData: {
        id: '',
        goodsName: '',
        goodsShortName: '',
        goodsType: '',
        partyId: '',
        goodsBrandId: '',
        cid: '',  // 类目ID
        unit: '',
        goodsCustomCid: '',
        shelfLife: '',
        shelfLifeWarning: '',
        shelfLifeBan: '',
        currency: '',
        taxRate: '',
        volumn: '',
        length: '',
        width: '',
        height: '',
        boxLength: '',
        boxWidth: '',
        boxHeight: '',
        boxVolume: '',
        boxUnit: '',
        transportLimit: '',
        temperatureLimit: '',
        weightManage: 0,
        batchNoManage: 0,
        produceDateManage: 0,
        serialManange: 0,
        fillerManange: '',
        shelfLifeManage: '',
        userId: '',
        status: '',
        goodTagValues: '',
        skus: []
      },
      goodsDetailData: {
        goodsBrand: {},
        goodsCategory: {},
        goodsCustomCategory: {},
        skus: [],
        temperatureLimit: 'NORMAL',
        transportLimit: '',
        goodsName: ''
      },
      goodsDetailData_old: {},
      initSkuList: {
        // 规格列表用到的字段
        skuCode: "",
        skuId: '',
        skuLevel: "",
        barcode: "",
        skuNumberId: "",
        goodsBarcode: "",
        lowestCostPrice: '',
        retailPrice: '',
        costPrice: '',
        tradePrice: '',
        // 规格列表没有用到的字段
        goods_id: '',
        partyId: '',
        styleId1: '',
        styleId2: '',
        styleId3: '',
        distributorProvidePrice: '',
        goods_value: '',
        custom_price: '',
        weight: '',
        status: ''
      },
      goodsDetailSpecData: {

      },
      specItem: [],  // 当次选择
      specList: [],  // 每次选择的记录
      specItemIndex: 0,
      // goodsBarcode: ''  // 商品和条码的对应关系
      tr_selected: 'skuCode',
      tr_selected_value: '',
      insertedSkus: [],  // 插入的sku列表
      modifiedSkus: [],  // 修改的sku列表
      insertedGoodTagValues: [],  // 插入的标签列表
      deletedGoodTagValues: [],  // 删除的标签列表
      styleTypeNum: [],  // 有几个规格
      localSkus: []
    }
  },
  mounted () {
    this.$nextTick(() => {
      initStyle();
      this.goodsDetailData.skus.push(this.initSkuList)
      this.getGoodsDetailData();
      this.getGoodsDetailSpecData();
    });
  },
  watch: {
    'goodsDetailData.skus': {  // 获取已改动过的sku
      handler: function (newVal, oldVal) {
        const _self = this;
        console.log(newVal);
        newVal.forEach((elem, index) => {
          for(let key in elem){
            try{
              if(elem[key] !== _self.goodsDetailData_old.skus[index][key] && typeof elem[key] != 'object' &&_self.goodsDetailData_old.skus[index][key] !== undefined){
                _self.modifiedSkus.push(elem);
              }
            }catch(err){
              return;
            }
          }
        });
      },
      deep: true
    }
  },
  methods: {
    newSave () {  // 新建保存
      const _self = this;
      _self.getSendData();
      if (_self.check(_self.sendData)) {
        layer.confirm('确认要保存吗', {
          btn: ['保存', '取消'] //按钮
        }, function(){
          http({
            instance: _self,
            url: api.goodsAdd,
            type: 'post',
            data: {
              data: _self.sendData
            },
            hasLoading: false,
            success (res) {
              console.log(res);
              if (res.code == 200) {
                
              }
            }
          });
        });
      }
    },
    check (data) {  // 保存前校验
      let requiredArr = [{
        key: 'goodsName',
        name: '商品名称'
      },{
        key: 'goodsType',
        name: '类型'
      },{
        key: 'cid',
        name: '类目ID'
      },{
        key: 'unit',
        name: '货品单位'
      },{
        key: 'goodsBrandId',
        name: '品牌'
      },{
        key: 'goodsCustomCid',
        name: '分类ID'
      },{
        key: 'shelfLife',
        name: '保质期'
      },{
        key: 'shelfLifeWarning',
        name: '提前多少天预警'
      },{
        key: 'shelfLifeBan',
        name: '提前多少天禁止发货'
      // },{
      //   key: 'status',
      //   name: '状态'
      },{
        key: 'currency',
        name: '币种'
      },{
        key: 'taxRate',
        name: '税率'
      }];
      var isChecked = true;
      for (var i = 0, len = requiredArr.length; i < len; i++) {
        if (!data[requiredArr[i].key]) {
          layer.msg(requiredArr[i].name + '不能为空', {time: 2000});
          isChecked = false;
        }
      }
      return isChecked;
    },
    getSendData () {
      const _self = this;
      // 点击保存的时候，要发到后台的goods字段
      for (const i in _self.sendData) {
        for (const j in _self.goodsDetailData) {
          if (typeof _self.goodsDetailData[i] != Object && i == j) {
            _self.sendData[i] = _self.goodsDetailData[j];
          } else if (i == 'cid') {
            _self.sendData.cid = _self.goodsDetailData.goodsCategory.cid;
          } else if (j == 'goodsBrand') {
            _self.sendData.goodsBrandId = _self.goodsDetailData.goodsBrand.id;
          } else if (i == 'goodsCustomCid') {
            _self.sendData.goodsCustomCid = _self.goodsDetailData.goodsCustomCategory.cid;
          } else if (j == 'styleType1') {
            _self.sendData.styleType1 = _self.goodsDetailData.styleType1.id;
          } else if (j == 'styleType2') {
            _self.sendData.styleType2 = _self.goodsDetailData.styleType2.id;
          } else if (j == 'styleType3') {
            _self.sendData.styleType3 = _self.goodsDetailData.styleType3.id;
          } else if (i == 'skus') {
            _self.sendData.skus = _self.insertedSkus;
          }
        }
      }
    },
    goodsSave () {  // 修改保存
      const _self = this;
      _self.getSendData();
      if (_self.check(_self.sendData)) {
        layer.confirm('确认要保存吗', {
          btn: ['保存', '取消'] //按钮
        }, function(){
          http({
            instance: _self,
            url: api.goodsModify,
            type: 'post',
            data: {
              data: {
                goods: _self.sendData,
                insertedSkus: _self.insertedSkus,
                modifiedSkus: _self.modifiedSkus,
                insertedGoodTagValues: _self.insertedGoodTagValues,
                deletedGoodTagValues: _self.deletedGoodTagValues
              }
            },
            hasLoading: false,
            success (res) {
              console.log(res);
              if (res.code == 200) {
                layer.msg('保存成功', {time: 2000});
                _self.getGoodsDetailData();
              }
            }
          });
          _self.insertedSkus.length = 0;
          _self.modifiedSkus.length = 0;
        });
      }
    },
    batchFilling () {  // 批量填充
      const _self = this;
      _self.goodsDetailData.skus.forEach(function (item, index) {
        for (const j in item) {
          if (_self.tr_selected == j) {
            if (_self.tr_selected == 'goodsBarcode') {
              switch (_self.tr_selected_value) {
                case '一品一码':
                  item[j] = '1G1B';
                  break;
                case '一品多码':
                  item[j] = '1GNB';
                  break;
                case '多品一码':
                  item[j] = 'NG1B';
                  break;
              }
            }else if (_self.tr_selected == 'skuLevel') {
              switch (_self.tr_selected_value) {
                case '一般':
                  item[j] = 'NORMAL';
                  break;
                case '重要':
                  item[j] = 'IMPORTANT';
                  break;
                case '不重要':
                  item[j] = 'UNIMPORTANT';
                  break;
              }
            } else {
              item[j] = _self.tr_selected_value;
            }
          }
        }
      });
      _self.tr_selected_value = '';
    },
    removeSpecItem (index) {
      console.log(index);
      this.specList.splice(index, 1);
      this.specItemIndex --;
    },
    // 当条码属性为一品多码时，商品条码可以以“，”分隔填写多个
    _selfBarcode (thisText, thisGoodsBarcode) {
      if (thisGoodsBarcode != '1GNB' && thisText.indexOf(',') >= 0) {
        layer.msg('该商品没有选择了一品多码', {time: 2000});
        return;
      }
    },
    addspecItem () {
      const _self = this;
      _self.specItem.length = 0;
      for (const i in _self.goodsDetailSpecData) {
        if (_self.goodsDetailSpecData[i].specname) {
          _self.specItem.push(_self.goodsDetailSpecData[i]);
        }
        _self.goodsDetailSpecData[i].specname = '';
      }
      if (_self.specItem.length > 0) {
        _self.$set(_self.specList, _self.specItemIndex, deepClone(_self.specItem));
        _self.specItemIndex ++;
        _self.specItem.forEach(function (item, index) {
          _self.$set(item, 'valueSelected', '111');
        });
      } else {
        layer.msg('请选择规格', {time: 2000});
      }
    },
    addspec () {  // 添加规格码
      const _self = this;
      var addSku = {};
      for (const m in _self.specList) {
        // 点击 添加规格 在规格列表里add
        addSku = {
          skuId: '',
          goodsId: _self.goodsDetailData.id,
          partyId: _self.goodsDetailData.partyId,
          barcode: '',
          retailPrice: '',
          providerPrice: '',
          costPrice: '',
          goodsValue: '',
          customPrice: '',
          lowestCostPrice: '',
          weight: '',
          status: 'NORMAL',
          skuLevel: 'NORMAL',
          tradePrice: '',
          skuCode: '',
          skuNumberId: '',
          styleValue1: {
            id: 0
          },
          styleValue2: {
            id: 0
          },
          styleValue3: {
            id: 0
          }
        };
        for (const i in _self.specList[m]) {
          if (_self.specList[m][i].id == 1) {
            addSku.styleValue1 = {
              createTime: '',
              creator: {
                id: '',
              },
              id: _self.specList[m][i].id,
              value: _self.specList[m][i].valueSelected,
              lastUpdateTime: ''
            }
          }
          if (_self.specList[m][i].id == 2) {
            addSku.styleValue2 = {
              createTime: '',
              creator: {
                id: '',
              },
              id: _self.specList[m][i].id,
              value: _self.specList[m][i].valueSelected,
              lastUpdateTime: ''
            }
          }
          if (_self.specList[m][i].id == 3) {
            addSku.styleValue3 = {
              createTime: '',
              creator: {
                id: '',
              },
              id: _self.specList[m][i].id,
              value: _self.specList[m][i].valueSelected,
              lastUpdateTime: ''
            }
          }
        }
        // 查找是否有相同的规格值
        var skusLen = _self.goodsDetailData.skus.length;
        for (const i in _self.goodsDetailData.skus) {
          if (_self.goodsDetailData.skus[i].styleValue1.value == addSku.styleValue1.value) {
            _self.goodsDetailData.skus.splice(i, 0, addSku);
            break;
          }
        }
        if (skusLen == _self.goodsDetailData.skus.length) {
          _self.goodsDetailData.skus.push(addSku);
        }
        _self.insertedSkus.push(addSku);
      }
      _self.specList.length = 0;
      _self.specItemIndex = 0;
      // 在规格列表中补齐所有规格
      if (_self.goodsDetailSpecData.length >= 1) {
        _self.goodsDetailData.styleType1 = {
          id: 1,
          name: _self.goodsDetailSpecData[1-1].name
        };
      }
      if (_self.goodsDetailSpecData.length >= 2) {
        _self.goodsDetailData.styleType2 = {
          id: 2,
          name: _self.goodsDetailSpecData[2-1].name
        };
      }
      if (_self.goodsDetailSpecData.length >= 3) {
        _self.goodsDetailData.styleType3 = {
          id: 3,
          name: _self.goodsDetailSpecData[3-1].name
        };
      }

    },
    getGoodsDetailSpecData () {  // 查询规格列表
      const _self = this;
      http({
        instance: _self,
        url: api.getGoodsDetailSpecList,
        type: 'post',
        data: {
          data: {
            // partyId: 65577
          }
        },
        hasLoading: false,
        success (res) {
          console.log(res);
          if (res.code == 200) {
            _self.goodsDetailSpecData = res.data.content;
            _self.goodsDetailSpecData.forEach(function (spec, index) {
              _self.$set(spec, 'specname', '');
            });
          }
        }
      });
    },
    getGoodsDetailData () {  // 获取商品详情
      const _self = this;
      if (_self.$route.params.id) {
        http({
          instance: _self,
          url: api.getGoodsDetail_yjlu,
          type: 'post',
          data: {
            data: {
              goodsId: _self.$route.params.id
            }
          },
          hasLoading: false,
          success (res) {
            console.log(res);
            if (res.code == 200) {
              _self.goodsDetailData = res.data;
              _self.goodsDetailData.goodsTagsChecked = '';
              for (var i = 0, len = _self.goodsDetailData.skus.length; i < len; i ++) {
                // for (const n in _self.initSkuList) {
                //   if (!_self.goodsDetailData.skus[i].hasOwnProperty(n)) {
                //     _self.$set(_self.goodsDetailData.skus[i], n, '');
                //   }
                // }
                _self.goodsDetailData.goodsTagsChecked += _self.goodsDetailData.skus[i].barcode + '/';
                _self.$set(_self.goodsDetailData.skus[i], 'goodsBarcode', '1G1B');
                _self.$set(_self.goodsDetailData.skus[i], 'tradePrice', '');
              }
              _self.goodsDetailData_old.skus = deepClone(_self.goodsDetailData.skus);
              _self.goodsDetailData.goodsTagsChecked = _self.goodsDetailData.goodsTagsChecked.substring(0, _self.goodsDetailData.goodsTagsChecked - 1);
              if (_self.goodsDetailData.styleType1) {
                _self.styleTypeNum.push({
                  id: _self.goodsDetailData.styleType1.id,
                  name: _self.goodsDetailData.styleType1.name
                });
                if (_self.goodsDetailData.styleType2) {
                  _self.styleTypeNum.push({
                    id: _self.goodsDetailData.styleType2.id,
                    name: _self.goodsDetailData.styleType2.name
                  });
                  if (_self.goodsDetailData.styleType3) {
                    _self.styleTypeNum.push({
                      id: _self.goodsDetailData.styleType3.id,
                      name: _self.goodsDetailData.styleType3.name
                    });
                  }
                }
              }
            }
          }
        });
      }
    },
    selectGoodsTag (data) {
      if (data) {
        this.$set(this.goodsDetailData, 'goodsTagId', data.id);
      } else {
        delete this.goodsDetailData.goodsTagId;
      }
    },
    selectGoodsBrand (data) {
      console.log(data);
      if (data) {
        this.$set(this.goodsDetailData.goodsBrand, 'id', data);
      } else {
        delete this.goodsDetailData.goodsBrand.id;
      }
    },
    selectGoodsType (data) {
      if (data) {
        this.$set(this.goodsDetailData, 'goodsType', data);
      } else {
        delete this.goodsDetailData.goodsType;
      }
    },
    searchCustomCategory (data) {
      if (data) {
        this.$set(this.goodsDetailData.goodsCustomCategory, 'cid', data);
      } else {
        delete this.goodsDetailData.goodsCustomCategory.cid;
      }
    },
    searchGoodsCategory (data) {
      if (data) {
        this.$set(this.goodsDetailData.goodsCategory, 'cid', data);
      } else {
        delete this.goodsDetailData.goodsCategory.cid;
      }
    }
  }
}
</script>

<style>
/*.goodsDetail .goodsDetailInfo {
  padding: 0 10px;
  background: #fff;
}
.goodsDetail .form-control {
  padding: 6px;
}
.goodsDetail .detailTitle {
  position: relative;
  background: #fff;
  padding: 5px;
  height: 40px;
}
.goodsDetail .goodsOpreate {
  margin: 0 0 0 20px;
}
.goodsDetail .goodsSave {
  position: absolute;
  top: 5px;
  right: 15px;
}
.goodsDetail small {
  display: inline-block;
  position: relative;
  font-size: 14px;
  font-weight: bold;
  margin: 5px 0 15px 0;
}
.goodsDetail small:before {
  position: absolute;
  top: 3px;
  left: -10px;
  display: inline-block;
  content: '';
  width: 3px;
  height: 14px;
  background: #0081c2;
}
.goodsDetail .col-md-12 {
  margin: 0 0 15px 0;
}
.goodsDetail .colorItem {
  display: inline-block;
  padding: 3px 8px;
  border: 1px solid #d2d6de;
  margin: 0 20px 10px 0;
  cursor: pointer;
}
.goodsDetail .colorCheck i {
  color: #0095cb;
}
.goodsDetail .specItem {
  position: relative;
  background: #f2f2f2;
  padding: 5px;
}
.goodsDetail .myDel {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 18px;
  color: red;
  cursor: pointer;
}
.goodsDetail .goodsDetailSize {
  padding: 3px 15px;
  border: 1px solid #d2d6de;
  margin: 5px 0 0 0;
}
.goodsDetail .specificationCodeBtn {
  margin: 0 0 0 20px;
}
.goodsDetail .specSelectStyle {
  display: inline-block;
  width: auto;
}
.goodsDetail .addspecificationCodeBtn {
  display: inline-block;
  padding: 5px 20px;
  background: #0083b3;
  color: #fff;
  margin: 10px 0 0 0;
  cursor: pointer;
}
.goodsDetail table .form-control {
  width: auto;
}
.goodsDetail .marginTop {
  margin-top: 15px;
}
.goodsDetail .transportInfoIpt {
  padding: 6px 5px;
}
.goodsDetail .transportInfo .col-sm-4, .goodsDetail .transportInfo .col-sm-6, .goodsDetail .transportInfo .col-sm-8, .goodsDetail .transportInfo .col-sm-2, .goodsDetail .transportInfo .col-sm-10 {
  padding-left: 5px;
  padding-right: 5px;
}*/
</style>