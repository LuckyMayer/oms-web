<template>
  <div class="content-wrapper">
    <section class="content-header">
      <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-desktop"></i> 商品管理</a></li>
        <li class="active">商品列表</li>
        <li v-if="!$route.params.id" class="active">新建商品</li>
        <li v-if="$route.params.id" class="active">商品详情</li>
      </ol>
    </section>

    <section class="content content_yjlu goodsDetail">
      <div class="row form-horizontal">
        <div class="col-md-12">
          <small>基本信息</small>
        </div>
        <div class="col-md-12 bgFFF">
          <div class="form-group">
            <div class="col-md-8">
              <label class="col-sm-2 control-label required">商品名称</label>
              <div class="col-sm-10">
                <input class="form-control input-sm" type="text" placeholder="该业务组下商品名称唯一" v-model="goodsAddVO.goodsName">
              </div>
            </div>
          </div>
          <div class="form-group">
            <div class="col-md-4">
              <label class="col-sm-4 control-label required">商品类型</label>
              <div class="col-sm-8">
                <select-goods-type @selected="selectGoodsType" :select="goodsAddVO.goodsType"></select-goods-type>
              </div>
            </div>
            <div class="col-md-4">
              <label class="col-sm-4 control-label required">币种</label>
              <div class="col-sm-8">
                <select class="form-control" v-model="goodsAddVO.currency">
                  <option value="RMB">人民币</option>
                </select>
              </div>
            </div>
            <div class="col-md-4">
              <label class="col-sm-4 control-label required">税率</label>
              <div class="col-sm-8">
                <input class="form-control input-sm" type="text" placeholder="" v-model="goodsAddVO.taxRate">
              </div>
            </div>
          </div>
        </div><div class="col-md-12">
          <small>商品分类</small>
        </div>
        <div class="col-md-12 bgFFF">
          <div class="form-group">
            <div class="col-md-4">
              <label class="col-sm-4 control-label required">商品分类</label>
              <div class="col-sm-8">
                <search-custom-category @selected="searchCustomCategory" :choosed="goodsAddVO.goodsCustomCategory"></search-custom-category>
              </div>
            </div>
            <div class="col-md-4">
              <label class="col-sm-4 control-label">行业类目</label>
              <div class="col-sm-8">
                <search-goods-category @selected="searchGoodsCategory" :choosed="goodsAddVO.goodsCategory"></search-goods-category>
              </div>
            </div>
            <div class="col-md-4">
              <label class="col-sm-4 control-label">商品品牌</label>
              <div class="col-sm-8">
                <select-goods-brand @selected="selectGoodsBrand" :select="goodsAddVO.goodsBrandId"></select-goods-brand>
              </div>
            </div>
          </div>
          <div class="form-group">
            <div class="col-md-4">
              <label class="col-sm-4 control-label">添加标签项目</label>
              <div class="col-sm-8">
                <search-goods-tag-value @selected="selectGoodsTagValue"></search-goods-tag-value>
                <span class="addIcon" @click="addTagValue">+添加</span>
              </div>
            </div>
            <div class="col-md-7 col-md-offset-1">
              <span class="specItemName" v-for="(tagValItem, i) in goodsAddVO.goodsTagValues">
                <label class="control-label" v-if="tagValItem.goodsTagV">{{tagValItem.goodsTagV}}</label>
                <label class="control-label" v-if="tagValItem.value">{{tagValItem.value}}</label>
                <i class="iconfont iconfontDelete" @click="delGoodTagValues(i, tagValItem)">&#xe63c;</i>
              </span>
            </div>
          </div>
        </div>
        <div class="col-md-12">
          <small>规格选择</small>
        </div>
        <div class="col-md-12 bgFFF">
          <div v-if="!$route.params.id" class="form-group">
            <div class="col-md-4">
              <label class="col-sm-4 control-label">添加规格项目</label>
              <div class="col-sm-8">
                <select class="form-control getUlWidth" v-model="selectedSpecListItem" :disabled="$route.params.id && typeof goodsAddVO.styleType1 == 'undefined'">
                  <option v-for="specListItem in specList" :value="specListItem">{{specListItem.name}}</option>
                </select>
                <div class="addIcon" @click="addSpecListItem">+添加</div>
              </div>
            </div>
            <div class="col-md-4 col-md-offset-1">
              <label class="col-sm-6 control-label goodsDetailTip textAlignLeft">(最多支持两级规格)</label>
            </div>
          </div>
          <template v-if="!$route.params.id" v-for="(selectedSpecListItem, i) in selectedSpecListItems">
            <div class="form-group">
              <!-- <selected-spec-list-item :data='selectedSpecListItem' :index='i'></selected-spec-list-item> -->
              <div class="col-md-4">
                <label class="col-sm-4 control-label">{{selectedSpecListItem.name}}</label>
                <div class="col-sm-8" @mouseleave="valuesShowClose">
                  <input class="form-control input-sm" type="text" v-model="selectedSpecListItem.specValueKey" @focus="selectedSpecListItem.valuesShow = true" @keyup="getSelectValue(selectedSpecListItem.specValueKey, selectedSpecListItem)" @mouseover="selectedSpecListItem.valuesShow = true"/>
                  <i class="iconfont iconfontSearch">&#xe662;</i>
                  <ul v-if="selectedSpecListItem.valuesShow" class="valuesShow" :style="{minWidth: getUlWidth}" @mouseover="selectedSpecListItem.valuesShow = true;">
                    <li :class="{specSelected: specItem.specSelected}" v-show="specItem.specSelected || selectedSpecListItem.specValueKey == ''" v-for="(specItem, j) in selectedSpecListItem.values" @click="specLi(specItem, selectedSpecListItem)">{{specItem.value}}</li>
                  </ul>
                  <!-- <select class="form-control" v-model="selectedSpecListItem.selectedSpecItem">
                    <option v-for="(specItem, j) in selectedSpecListItem.values" :value="specItem">{{specItem.value}}</option>
                  </select> -->
                  <span class="addIcon" @click="addSpecItems(selectedSpecListItem, i)">+添加</span>
                  <i class="iconfont iconfontDelete iconfontLJT" @click="delSpecListItems(i)">&#xe613;</i>
                </div>
              </div>
              <div class="col-md-7 col-md-offset-1">
                <span class="specItemName" v-for="(specItemName, n) in selectedSpecListItem.specItemNames">
                  <label class="control-label">{{specItemName.value}}</label>
                  <i class="iconfont iconfontDelete" @click="delSpecItemNames(n, selectedSpecListItem)">&#xe63c;</i>
                </span>
              </div>
            </div>
          </template>
        </div>
        <table class="table table-hover table-condensed myTable">
          <thead>
            <tr>
              <th v-if="haveStyle.length !== 0">
                <template v-for="(selectedSpecListItem, i) in selectedSpecListItems">
                  <span v-if="i !== 0">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                  <span>{{selectedSpecListItem.name}}</span>
                </template>
              </th>
              <th>
                <span>商家编码</span>
              </th>
              <!-- <th>商品编码</th> -->
              <th>
                <span class="required">商品条码</span>
                <i class="iconfont" id="barcode" @mouseover="barcodeTip">&#xe69a;</i>
                </th>
              <th>
                <span class="required">商品重要性</span>
                <i class="iconfont" id="goodsLevel" @mouseover="goodsLevelTip">&#xe69a;</i>
              </th>
              <th>商品货号</th>
              <th>零售价</th>
              <th>最低成本价</th>
              <th>商品价值</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sku in goodsAddVO.skus">
              <td v-if="haveStyle.length !== 0"> <!-- 规格 -->
                <template v-for="(styleItem, i) in haveStyle">
                  <span v-if="i !== 0">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <span>{{sku['styleId' + (i+1)].value}}</span>
                </template>
              </td>
              <!-- <td v-if="$route.params.id">
                <span v-if="goodsAddVO.styleType1">{{sku.styleValue1.value}}</span>
                <span v-if="goodsAddVO.styleType2">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                <span v-if="goodsAddVO.styleType2">{{sku.styleValue2.value}}</span>
                <span v-if="goodsAddVO.styleType3">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                <span v-if="goodsAddVO.styleType3">{{sku.styleValue3.value}}</span>
              </td> -->
              <td> <!-- 商家编码 -->
                <!-- <input style="width: 100px;" class="form-control" type="text" v-model="sku.skuCode"> -->
                {{sku.skuCode}}
              </td>
             <!--  <td>{{sku.skuId}}</td> --> <!-- 商品编码 -->
              <td> <!-- 商品条码 -->
                <input style="width: 150px;" class="form-control" type="text" v-model="sku.barcode">
              </td>
              <td> <!-- 商品重要性 -->
                <select class="form-control" v-model="sku.skuLevel">
                  <option value="UNIMPORTANT">1级</option>
                  <option value="NORMAL">2级</option>
                  <option value="IMPORTANT">3级</option>
                </select>
              </td>
              <td> <!-- 商品货号 -->
                <input style="width: 130px;" class="form-control" type="text" v-model="sku.skuNumberId">
              </td>
              <td> <!-- 零售价 -->
                <input style="width: 100px;" class="form-control" type="text" v-model="sku.retailPrice">
              </td>
              <td> <!-- 最低成本价 -->
                <input style="width: 100px;" class="form-control" type="text" v-model="sku.lowestCostPrice">
              </td>
              <td> <!-- 商品价值 -->
                <input style="width: 100px;" class="form-control" type="text" v-model="sku.goodsValue">
              </td>
            </tr>
            <tr>
              <td colspan="99">
                <label class="col-sm-1 control-label">选择项目</label>
                <div class="col-sm-2">
                  <select class="form-control" v-model='tr_selected'>
                    <option value="">==请选择==</option>
                    <option value="barcode">商品条码</option>
                    <option value="skuLevel">商品重要性</option>
                    <option value="skuNumberId">商品货号</option>
                    <option value="retailPrice">零售价</option>
                    <!-- <option value="tradePrice">批发价</option> -->
                    <!-- <option value="costPrice">固定成本价</option> -->
                    <option value="lowestCostPrice">最低成本价</option>
                    <option value="goodsValue">商品价值</option>
                  </select>
                </div>
                <div class="col-sm-2">
                  <input class="form-control input-sm" type="text" placeholder="" v-model="tr_selected_value">
                </div>
                <div class="col-sm-1">
                  <button class="btn btn-primary btn-sm" @click="batchFilling">批量设置</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="col-md-12">
          <small>运输信息</small>
        </div>
        <div class="col-md-12 bgFFF">
          <div class="form-group">
            <div class="col-sm-3">
              <label class="col-sm-4 control-label required">商品单位</label>
              <div class="col-sm-8">
                <input class="form-control input-sm" type="text" placeholder="" v-model="goodsAddVO.unit">
              </div>
            </div>
            <div class="col-sm-3">
              <label class="col-sm-4 control-label">箱规单位</label>
              <div class="col-sm-8">
                <input class="form-control input-sm" type="text" placeholder="" v-model="goodsAddVO.boxUnit">
              </div>
            </div>
            <div class="col-sm-3">
              <label class="col-sm-4 control-label">箱规</label>
              <div class="col-sm-8">
                <input class="form-control input-sm" type="text" placeholder="输入数量" v-model="goodsAddVO.boxVolume">
              </div>
            </div>
            <div class="col-md-3">
              <label class="col-sm-6 control-label goodsDetailTip textAlignLeft">(每箱单品数量)</label>
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-3">
              <label class="col-sm-4 control-label">商品重量</label>
              <div class="col-sm-8">
                <input class="form-control input-sm" type="text" placeholder="" v-model="goodsAddVO.weight">
                <span class="unitIcon" style="padding: 6px">g</span>
              </div>
            </div>
            <div class="col-sm-3">
              <label class="col-sm-4 control-label">商品长度</label>
              <div class="col-sm-8">
                <input class="form-control input-sm" type="text" placeholder="" v-model="goodsAddVO.length">
                <span class="unitIcon" style="padding: 6px">cm</span>
              </div>
            </div>
            <div class="col-sm-3">
              <label class="col-sm-4 control-label">商品宽度</label>
              <div class="col-sm-8">
                <input class="form-control input-sm" type="text" placeholder="" v-model="goodsAddVO.width">
                <span class="unitIcon" style="padding: 6px">cm</span>
              </div>
            </div>
            <div class="col-sm-3">
              <label class="col-sm-4 control-label">商品高度</label>
              <div class="col-sm-8">
                <input class="form-control input-sm" type="text" placeholder="" v-model="goodsAddVO.height">
                <span class="unitIcon" style="padding: 6px">cm</span>
              </div>
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-3">
              <label class="col-sm-4 control-label">整箱重量</label>
              <div class="col-sm-8">
                <input class="form-control input-sm" type="text" placeholder="" v-model="goodsAddVO.boxWeight">
                <span class="unitIcon" style="padding: 6px">g</span>
              </div>
            </div>
            <div class="col-sm-3">
              <label class="col-sm-4 control-label">整箱长度</label>
              <div class="col-sm-8">
                <input class="form-control input-sm" type="text" placeholder="" v-model="goodsAddVO.boxLength">
                <span class="unitIcon" style="padding: 6px">cm</span>
              </div>
            </div>
            <div class="col-sm-3">
              <label class="col-sm-4 control-label">整箱宽度</label>
              <div class="col-sm-8">
                <input class="form-control input-sm" type="text" placeholder="" v-model="goodsAddVO.boxWidth">
                <span class="unitIcon" style="padding: 6px">cm</span>
              </div>
            </div>
            <div class="col-sm-3">
              <label class="col-sm-4 control-label">整箱高度</label>
              <div class="col-sm-8">
                <input class="form-control input-sm" type="text" placeholder="" v-model="goodsAddVO.boxHeight">
                <span class="unitIcon" style="padding: 6px">cm</span>
              </div>
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-3">
              <label class="col-sm-4 control-label">温度要求</label>
              <div class="col-sm-8">
                <select class="form-control" v-model="goodsAddVO.temperatureLimit">
                  <option value="NORMAL">常温</option>
                  <option value="LOW">低温</option>
                  <option value="HIGH">高温</option>
                </select>
              </div>
            </div>
            <div class="col-sm-3">
              <label class="col-sm-4 control-label">运输要求</label>
              <div class="col-sm-8">
                <select class="form-control" v-model="goodsAddVO.transportLimit">
                  <option value="">无</option>
                  <option value="AIR_EMBARGO">航空禁运</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-12">
          <small>仓库管理信息</small>
        </div>
        <div class="col-md-12 bgFFF">
          <div class="form-group">
            <div class="col-sm-4">
              <label class="col-sm-4 control-label required">生产日期管理</label>
              <div class="col-sm-8">
                <label class="radio-inline"><input type="radio" name="produceDateManage" value="1" v-model="goodsAddVO.produceDateManage" />是</label>
                <label class="radio-inline"><input type="radio" name="produceDateManage" value="0" v-model="goodsAddVO.produceDateManage" />否</label>
              </div>
            </div>
            <div class="col-sm-4">
              <label class="col-sm-4 control-label required">批次号管理</label>
              <div class="col-sm-8">
                <label class="radio-inline"><input type="radio" name="batchNoManage" value="1" v-model="goodsAddVO.batchNoManage" />是</label>
                <label class="radio-inline"><input type="radio" name="batchNoManage" value="0" v-model="goodsAddVO.batchNoManage" />否</label>
              </div>
            </div>
            <div class="col-sm-4">
              <label class="col-sm-4 control-label required">序列号管理</label>
              <div class="col-sm-8">
                <label class="radio-inline"><input type="radio" name="serialManange" value="1" v-model="goodsAddVO.serialManange" />是</label>
                <label class="radio-inline"><input type="radio" name="serialManange" value="0" v-model="goodsAddVO.serialManange" />否</label>
              </div>
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-4" v-if="goodsAddVO.produceDateManage == '1'">
              <label class="col-sm-4 control-label required">保质期天数</label>
              <div class="col-sm-8">
                <input class="form-control input-sm" type="text" placeholder="" v-model="goodsAddVO.shelfLife">
                <span class="unitIcon" style="padding: 6px">天</span>
              </div>
            </div>
            <div class="col-sm-4" v-if="goodsAddVO.produceDateManage == '1'">
              <label class="col-sm-4 control-label required">临期预警天数</label>
              <div class="col-sm-8">
                <input class="form-control input-sm" type="text" placeholder="" v-model="goodsAddVO.shelfLifeWarning">
                <span class="unitIcon" style="padding: 6px">天</span>
              </div>
            </div>
            <div class="col-sm-4" v-if="goodsAddVO.produceDateManage == '1'">
              <label class="col-sm-4 control-label required">禁发效期天数</label>
              <div class="col-sm-8">
                <input class="form-control input-sm" type="text" placeholder="" v-model="goodsAddVO.shelfLifeBan">
                <span class="unitIcon" style="padding: 6px">天</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-12 textAlignCenter">
          <button v-if="!$route.params.id" class="btn btn-primary createBtn" @click="newSave">创建保存</button>
          <button v-if="$route.params.id" class="btn btn-primary createBtn" @click="oldSave">更新保存</button>
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

import searchCustomCategory from '../../component/searchCustomCategory'
import searchGoodsCategory from '../../component/searchGoodsCategory'
import selectGoodsBrand from '../../component/selectGoodsBrand'
import searchGoodsTagValue from '../../component/searchGoodsTagValue'
import selectGoodsType from '../../component/selectGoodsType'
// import selectedSpecListItem from '../../component/selectedSpecListItem'
export default {
  components: {
    searchCustomCategory,
    searchGoodsCategory,
    selectGoodsBrand,
    searchGoodsTagValue,
    selectGoodsType
  },
  data () {
    return {
      goodsAddVO: {
        goodsName: '',
        goodsShortName: '',
        goodsCode: '',
        goodsType: '',
        partyId: '',
        goodsBrandId: '',
        cid: '',  // 行业类目
        unit: '',
        goodsLevel: '',
        goodsCustomCid: '',  // 商品分类ID
        // shelfLife: '',
        // shelfLifeWarning: '',
        // shelfLifeBan: '',
        volumn: '',
        length: '',
        width: '',
        height: '',
        weight: '',
        boxUnit: '',
        boxVolume: '',
        boxLength: '',
        boxWidth: '',
        boxHeight: '',
        boxWeight: '',
        taxRate: '',
        currency: '',
        transportLimit: '',
        temperatureLimit: 'NORMAL',
        weightManage: '',
        batchNoManage: '',
        produceDateManage: '',
        serialManange: '',
        fillerManange: '',
        // shelfLifeManage: '',
        styleType1: '',
        styleType2: '',
        styleType3: '',
        status: '',
        skus: [],
        goodsTagValues: [],
      },
      sku: {
          skuId: '',
          skuCode: '',
          goodsId: '',
          partyId: '',
          barcode: '',
          skuLevel: '',
          skuNumberId: '',
          retailPrice: '',
          providePrice: '',
          costPrice: '',
          goodsValue: '',
          customPrice: '',
          lowestCostPrice: '',
          tradePrice: '',
          weight: '',
          status: '',
          styleId1: '',
          styleId2: '',
          styleId3: '',
          goodsValue: ''
      },
      goodsAddVO_old: {},
      specList: {},  // 规格列表
      selectedSpecListItem: {}, // 选取的规格
      selectedSpecListItems: [],  // 选取的规格List 
      selectedSpecItem: {},
      haveStyle: [],
      tr_selected: '',
      tr_selected_value: '',
      modifiedSkus: [],
      insertedSkus: [],
      insertedGoodTagValues: [],
      deletedGoodTagValues: [],
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
        weight: '',
        boxLength: '',
        boxWidth: '',
        boxHeight: '',
        boxVolume: '',
        boxWeight: '',
        boxUnit: '',
        goodsValue: '',
        transportLimit: '',
        temperatureLimit: '',
        weightManage: 0,
        batchNoManage: 0,
        produceDateManage: 0,
        serialManange: 0,
        fillerManange: '',
        // shelfLifeManage: '',
        userId: '',
        status: '',
        goodsTagValues: [],
        skus: []
      },
      isNewSpecValue: true,
      selectTagItem: {
        id: '',
        goodsTagV: ''
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      initStyle();
      this.getGoodsDetailSpecList();
      this.goodsAddVO.skus.push(deepClone(this.sku));
      if (this.$route.params.id) {
        this.getGoodsDetail();
      }
    });
  },
  watch: {
    'goodsAddVO.skus': {  // 获取已改动过的sku
      handler: function (newVal, oldVal) {
        const _self = this;
        _self.modifiedSkus = [];
        newVal.forEach((elem, index) => {
          for(let key in elem){
            try{
              if(elem[key] !== _self.goodsAddVO_old.skus[index][key] && typeof elem[key] != 'object' &&_self.goodsAddVO_old.skus[index][key] !== undefined){
                _self.modifiedSkus.push(elem);
              }
            }catch(err){
              return;
            }
          }
        });
      },
      deep: true
    },
  },
  computed: {
    getUlWidth () {
      console.log($('.valuesShow'));
      return (Number($('.getUlWidth').width()) + 14) + 'px';
    }
  },
  methods: {
    delGoodTagValues (i, tagValItem) {
      this.goodsAddVO.goodsTagValues.splice(i, 1);
      this.deletedGoodTagValues.push(deepClone(tagValItem));
    },
    addTagValue () {
      const _self = this;
      if (_self.selectTagItem.id) {
        _self.goodsAddVO.goodsTagValues.push(deepClone(_self.selectTagItem));
        _self.insertedGoodTagValues.push(deepClone(_self.selectTagItem));
      }
    },
    valuesShowClose () {
      this.selectedSpecListItems.forEach(function (item, i) {
        item.valuesShow = false;
      });
    },
    specLi (specItem, selectedSpecListItem) {
      this.selectedSpecListItem.values.forEach(function (item, i) {
        delete item.specSelected;
      });
      selectedSpecListItem.specValueKey = specItem.value;
      this.isNewSpecValue = false;
      this.$set(specItem, 'specSelected', true);
      this.selectedSpecListItems.forEach(function (item, i) {
        item.valuesShow = false;
      });
    },
    checkArr (arr) {
      var isReplace = false;
      var mySrr = [];
      for (var i in arr){
        mySrr.push(arr[i].id);
      }
      console.log(mySrr);
      var string = mySrr.join(",")+",";
      for(var i=0; i < mySrr.length; i++) {
        if(string.replace(mySrr[i]+",","").indexOf(mySrr[i]+",")>-1) {
          layer.msg('不能重复选规格', {time: 2000});
          isReplace = true;
        }
      }
      return isReplace;
    },
    getSelectValue (key, selectedSpecListItem) {
      const _self = this;
      _self.selectedSpecListItem = selectedSpecListItem;
      _self.selectedSpecListItem.values.forEach(function (item, i) {
        delete item.specSelected;
      });
      if (typeof selectedSpecListItem.values !== 'undefined' && key) {
        for (var i = 0; i < selectedSpecListItem.values.length; i++) {
          if (key == selectedSpecListItem.values[i].value) {  // 有规格值时
            _self.$set(selectedSpecListItem.values[i], 'specSelected', true);
            _self.isNewSpecValue = false;
            selectedSpecListItem.valuesShow = true;
            return;
          } else {
            selectedSpecListItem.values[i].specSelected = false;
            delete selectedSpecListItem.values[i].specSelected;
            _self.isNewSpecValue = true;
            selectedSpecListItem.valuesShow = false;
          }
        }
      }
    },
    getGoodsDetail () {
      const _self = this;
      http({
        instance: _self,
        url: api.getGoodsDetail,
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
            _self.goodsAddVO = res.data;
            _self.haveStyle = [];
            _self.selectedSpecListItems = [];
            if (typeof _self.goodsAddVO.goodsBrand != 'undefined') {
              // _self.goodsAddVO.goodsBrandId = _self.goodsAddVO.goodsBrand.id;
              _self.$set(_self.goodsAddVO, 'goodsBrandId', _self.goodsAddVO.goodsBrand.id);
            }
            if (typeof _self.goodsAddVO.styleType1 != 'undefined') {
              _self.haveStyle.push('styleId1');
              _self.selectedSpecListItems.push(_self.goodsAddVO.styleType1);
            }
            if (typeof _self.goodsAddVO.styleType2 != 'undefined') {
              _self.haveStyle.push('styleId2');
              _self.selectedSpecListItems.push(_self.goodsAddVO.styleType2);
            }
            if (typeof _self.goodsAddVO.styleType3 != 'undefined') {
              _self.haveStyle.push('styleId3');
              _self.selectedSpecListItems.push(_self.goodsAddVO.styleType3);
            }
            _self.selectedSpecListItems.forEach(function (item, i) {
              _self.$set(item, 'specItemNames', []);  // 选上的规格值List
            });
            for (var i = 0; i < _self.goodsAddVO.skus.length; i++) {
              for (var j = 0; j < _self.haveStyle.length; j++) {
                _self.$set(_self.goodsAddVO.skus[i], _self.haveStyle[j], _self.goodsAddVO.skus[i]['styleValue' + (Number(j) + 1)]);
                _self.selectedSpecListItems[j].specItemNames.push(_self.goodsAddVO.skus[i]['styleValue' + (Number(j) + 1)]);
              }
            }
            _self.goodsAddVO_old.skus = deepClone(_self.goodsAddVO.skus);
          }
        }
      });
    },
    getSendData () {
      const _self = this;
      // 点击保存的时候，要发到后台的goods字段
      for (const i in _self.sendData) {
        for (const j in _self.goodsAddVO) {
          if (typeof _self.goodsAddVO[i] != Object && i == j) {
            _self.sendData[i] = _self.goodsAddVO[j];
          // } else if (i == 'cid') {
          //   _self.sendData.cid = _self.goodsAddVO.goodsCategory.cid;
          // } else if (j == 'goodsBrand') {
          //   _self.sendData.goodsBrandId = _self.goodsAddVO.goodsBrand.id;
          // } else if (i == 'goodsCustomCid') {
          //   _self.sendData.goodsCustomCid = _self.goodsAddVO.goodsCustomCategory.cid;
          } else if (j == 'styleType1') {
            _self.sendData.styleType1 = _self.goodsAddVO.styleType1.id;
          } else if (j == 'styleType2') {
            _self.sendData.styleType2 = _self.goodsAddVO.styleType2.id;
          } else if (j == 'styleType3') {
            _self.sendData.styleType3 = _self.goodsAddVO.styleType3.id;
          } else if (i == 'skus') {
            _self.sendData.skus = _self.goodsAddVO.skus;
          }
        }
      }
    },
    updateHandle (skus) {
      const _self = this;
      _self.getSkusStyleId(skus);
      skus.forEach(function (sku, index) {
        for (var i in sku) {
          if (typeof _self.sku[i] == 'undefined') {
            console.log(i);
            delete sku[i];
          }
        }
      });
      return skus;
    },
    oldSave () {
      const _self = this;
      _self.getSendData();
      _self.sendData.skus = [];
      if (_self.saveCheck()) {
        layer.confirm('确认要更新商品吗', function(){
          http({
            instance: _self,
            url: api.goodsModify,
            type: 'post',
            data: {
              data: {
                goods: _self.sendData,
                insertedSkus: _self.insertedSkus,
                modifiedSkus: _self.updateHandle(_self.modifiedSkus),
                insertedGoodTagValues: _self.insertedGoodTagValues,
                deletedGoodTagValues: _self.deletedGoodTagValues,
              }
            },
            success (res) {
              if (res.success) {
                layer.msg('更新成功', {time: 2000});
                _self.$router.push({name: 'goodsList'});
                // _self.getGoodsDetail();
                // this.deletedGoodTagValues = [];
                // this.insertedGoodTagValues = [];
                // this.modifiedSkus = [];
                // this.insertedSkus = [];
              }
            }
          });
        }, function(){});
      }
    },
    getSkusStyleId (val) {
      const _self = this;
      if (val.length && _self.haveStyle.length) {
        if (typeof val[0][_self.haveStyle[0]].id != 'undefined') {
          val.forEach(function (sku, i) {
            for (var j in _self.haveStyle) {
              sku[_self.haveStyle[j]] = sku[_self.haveStyle[j]].id;
            }
          });
        }
      }
    },
    newSave () {
      const _self = this;
      _self.getSkusStyleId(_self.goodsAddVO.skus);
      if (_self.saveCheck()) {
        layer.confirm('确认要创建商品吗', function(){
          http({
            instance: _self,
            url: api.goodsAdd,
            type: 'post',
            data: {
              data: _self.goodsAddVO
            },
            success (res) {
              if (res.success) {
                layer.msg('创建成功', {time: 2000});
                _self.$router.push({name: 'goodsList'});
              }
            }
          });
        }, function(){});
      }
    },
    saveCheck () {
      const _self = this;
      let isSave = true;
      let requiredObj = [{
        key: 'serialManange',
        name: '序列号管理'
      }, {
        key: 'batchNoManage',
        name: '批次号管理'
      }, {
        key: 'produceDateManage',
        name: '生产日期管理'
      }, {
        key: 'unit',
        name: '商品单位'
      }, {
        key: 'taxRate',
        name: '税率'
      }, {
        key: 'currency',
        name: '币种'
      }, {
        key: 'goodsCustomCid',
        name: '商品分类'
      }, {
        key: 'goodsType',
        name: '商品类型'
      }, {
        key: 'goodsName',
        name: '商品名称'
      }];
      requiredObj = requiredObj.reverse();
      if (_self.goodsAddVO.produceDateManage == '1') {
        requiredObj.push({
          key: 'shelfLifeBan',
          name: '禁发效期天数'
        }, {
          key: 'shelfLifeWarning',
          name: '临期预警天数'
        }, {
          key: 'shelfLife',
          name: '保质期天数'
        });
      }
      for (var i in _self.goodsAddVO) {
        for (var j = 0, len = requiredObj.length; j < len; j++) {
          if (_self.goodsAddVO[requiredObj[j].key] === '') {
            isSave = false;
            layer.msg('请填写' + requiredObj[j].name, {time: 2000});
            return isSave;
          }
        }
      }
      for (var n = 0, len = _self.goodsAddVO.skus.length; n < len; n++) {
        if (_self.goodsAddVO.skus[n].barcode == '') {
          isSave = false;
          layer.msg('请填写商品条码', {time: 2000});
          return isSave;
        } else if (_self.goodsAddVO.skus[n].skuLevel == '') {
          isSave = false;
          layer.msg('请填写商品重要性', {time: 2000});
          return isSave;
        }
      }
      return isSave;
    },
    batchFilling () {  // 批量填充
      const _self = this;
      _self.goodsAddVO.skus.forEach(function (item, index) {
        for (const j in item) {
          if (_self.tr_selected == j) {
            if (_self.tr_selected == 'skuLevel') {
              switch (_self.tr_selected_value) {
                case '1级':
                  item[j] = 'UNIMPORTANT';
                  break;
                case '2级':
                  item[j] = 'NORMAL';
                  break;
                case '3级':
                  item[j] = 'IMPORTANT';
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
    delSpecItemNames (n, selectedSpecListItem) {  // 小圆圈的删除
      selectedSpecListItem.specItemNames.splice(n, 1);
      this.getTableTr();
      if (this.goodsAddVO.skus.length === 0) {
        this.goodsAddVO.skus.push(deepClone(this.sku));
      }
    },
    delSpecListItems (i) {  // 垃圾桶的删除
      this.selectedSpecListItems[i].specValueKey = '';
      this.selectedSpecListItems.splice(i, 1);
      this.getTableTr();
      if (this.selectedSpecListItems.length === 0) {
        this.goodsAddVO.skus.push(deepClone(this.sku));
      }
    },
    addSpecItems (selectedSpecListItem, i) {   // 选上的规格值List
      const _self = this;
      _self.goodsAddVO['styleType' + (Number(i) + 1)] = selectedSpecListItem.id;
      if (selectedSpecListItem.specValueKey !== '') {
        // 添加新的规格值
        if (_self.isNewSpecValue) {
          http({
            instance: _self,
            url: api.addStyleValue,
            type: 'post',
            hasLoading: true,
            data: {
              data: {
                styleId: selectedSpecListItem.id,
                value: selectedSpecListItem.specValueKey
              }
            },
            success (res) {
              console.log(res);
              if (res.success) {
                layer.msg('规格值创建成功', {time: 2000});
                selectedSpecListItem.selectedSpecItem = res.data;
                selectedSpecListItem.specValueKey = '';
                selectedSpecListItem.specItemNames.push(selectedSpecListItem.selectedSpecItem);
                _self.selectedSpecListItem.values.push(selectedSpecListItem.selectedSpecItem);
                _self.getTableTr();
              }
            }
          });
        } else {
          selectedSpecListItem.specValueKey = '';
          for (var n = 0; n < selectedSpecListItem.values.length; n++) {
            if (selectedSpecListItem.values[n].specSelected) {
              selectedSpecListItem.selectedSpecItem = selectedSpecListItem.values[n];
            }
          }
          selectedSpecListItem.specItemNames.push(selectedSpecListItem.selectedSpecItem);
          if (_self.checkArr(selectedSpecListItem.specItemNames)) {
            selectedSpecListItem.specItemNames.splice(selectedSpecListItem.specItemNames.length - 1, 1);
          }
          _self.getTableTr();
        }
      } else {
        layer.msg('请选择规格值', {time: 2000});
      }
    },
    getTableTr () {
      const _self = this;
      let tableTrNum = 0;
      _self.getHaveStyle();
      for (var i = 0; i < _self.selectedSpecListItems.length; i ++) {
        if (i == 0) {
          tableTrNum = _self.selectedSpecListItems[i].specItemNames.length;
          console.log(_self.selectedSpecListItems[i]);
        }else if (i == 1) {
          tableTrNum = tableTrNum * _self.selectedSpecListItems[i].specItemNames.length;
        }
      }
      _self.goodsAddVO.skus = [];
      for (var n = 0; n < tableTrNum; n++) {
        _self.goodsAddVO.skus.push(deepClone(_self.sku));
      }
      if (_self.haveStyle.length == 1) {
        for (var n = 0; n < tableTrNum; n++) {
          for (var i = 0; i < _self.selectedSpecListItems.length; i ++) {
            _self.goodsAddVO.skus[n][_self.haveStyle[0]] = _self.selectedSpecListItems[i].specItemNames[n];
          }
        }
      } else if (_self.haveStyle.length == 2) {
        var n = 0;
        for (var j = 0; j < _self.selectedSpecListItems[0].specItemNames.length; j++) {
          for (var i = 0; i < _self.selectedSpecListItems[1].specItemNames.length; i ++) {
            _self.goodsAddVO.skus[n][_self.haveStyle[0]] = _self.selectedSpecListItems[0].specItemNames[j];
            _self.goodsAddVO.skus[n][_self.haveStyle[1]] = _self.selectedSpecListItems[1].specItemNames[i];
            n++;
          }
        }
      }
    },
    getHaveStyle () {
      this.haveStyle = [];
      for (var i in this.selectedSpecListItems) {
        this.haveStyle.push('styleId' + (Number(i) + 1));
      }
    },
    addSpecListItem () {  // 选上的规格List
      const _self = this;
      if (_self.$route.params.id && typeof _self.goodsAddVO.styleType1 == 'undefined') {

      } else {
        if (typeof _self.selectedSpecListItem.id == 'undefined') {
          layer.msg('请选择规格', {time: 2000});
        } else if (_self.selectedSpecListItems.length < 2) {
          _self.$set(_self.selectedSpecListItem, 'selectedSpecItem', '');
          _self.$set(_self.selectedSpecListItem, 'valuesShow', 'false');
          _self.$set(_self.selectedSpecListItem, 'specValueKey', '');
          _self.$set(_self.selectedSpecListItem, 'specItemNames', []);  // 选上的规格值List
          _self.selectedSpecListItems.push(_self.selectedSpecListItem);
          if (_self.checkArr(_self.selectedSpecListItems)) {
            _self.selectedSpecListItems.splice(_self.selectedSpecListItems.length - 1, 1);
          }
        } else {
          layer.msg('最多支持两级规格', {time: 2000});
        }
      }
    },
    getGoodsDetailSpecList () {  // 查询规格列表
      const _self = this;
      http({
        instance: _self,
        url: api.getGoodsDetailSpecList,
        type: 'post',
        data: {
          data: {}
        },
        hasLoading: false,
        success (res) {
          console.log(res);
          if (res.code == 200) {
            _self.specList = res.data.content;
          }
        }
      });
    },
    barcodeTip () {
      layer.tips('商品严格遵循一品一码，当存在一品多码，请直接英文逗号维护多个；当存在一码多品，则需要维护虚拟条码，WMS也需要贴码入库', '#barcode');
    },
    goodsLevelTip () {
      layer.tips('级数越大表示商品越重要!', '#goodsLevel');
    },
    searchCustomCategory (data) {
      if (data) {
        this.goodsAddVO.goodsCustomCid = data;
      } else {
        this.goodsAddVO.goodsCustomCid = '';
      }
    },
    searchGoodsCategory (data) {
      if (data) {
        this.goodsAddVO.cid = data;
      } else {
        this.goodsAddVO.cid = '';
      }
    },
    selectGoodsBrand (data) {
      if (data) {
        this.goodsAddVO.goodsBrandId = data;
      } else {
        this.goodsAddVO.goodsBrandId = '';
      }
    },
    selectGoodsTagValue (data) {
      if (data) {
        this.selectTagItem.id = data.id;
        this.selectTagItem.goodsTagV = data.name;
      } else {
        this.selectTagItem.id = '';
        this.selectTagItem.goodsTagV = '';
      }
    },
    selectGoodsType (data) {
      if (data) {
        this.goodsAddVO.goodsType = data;
      } else {
        this.goodsAddVO.goodsType = '';
      }
    }
  }
}
</script>

<style lang="sass">
.goodsDetail {
  .iconfontSearch {
    position: absolute;
    top: 6px;
    right: 12px;
    font-size: 15px;
    color: #d2d6de;
  }
  .valuesShow {
    position: absolute;
    border: 1px solid #d2d6de;
    background: #fff;
    z-index: 99;
    li {
      line-height: 30px;
      // border-bottom: 1px solid #d2d6de;
      padding: 0 6px;
      cursor: pointer;
    }
    .specSelected {
      color: #6799FF;
      background: #f2f2f2;
    }
  }
  .specItemName {
    margin-right: 10px;
  }
  .iconfontLJT {
    position: absolute;
    top: 3px;
    right: -70px;
  }
  .addIcon {
    display: inline-block;
    position: absolute;
    top: 6px;
    right: -40px;
    color: #0066FF;
    cursor: pointer;
  }
  .goodsDetailTip {
    color: #999;
  }
  table {
    margin-bottom: 0px;
  }
  .createBtn {
    margin-top: 15px;
  }
  select, input {
    font-size: 12px;
  }
}
</style>