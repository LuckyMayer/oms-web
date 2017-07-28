<template>
    <div class="content-wrapper">
        <div class="popup-wrap" id="pw-addEditStrategy">
            <div class="popup-content row form-inline">
                <p class="popup-title">商品选仓策略 {{editAddData.data.id}}</p>
                <div class="popup-main clearfix">
                    <div class="col col-md-12">
                        <div class="form-group">
                            <label style="position:relative;top:5px;float:left" for="">生效时间</label>
                            <div class="col col-md-6" style="position:relative;left:4px;">
                            <date-range-picker id="editAdd-effective-time" :needhms="true" @get_date="get_editAdd_effective_time" :start-time="editAddData.data.startTime" :end-time="editAddData.data.endTime"></date-range-picker>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="">选仓类型</label>
                            <select name="" id="" class="form-control input-sm" v-model="editAddData.data.algorithm">
                                <option value="">-- 全部 --</option>
                                <option value="ONCE_CONTAIN">一旦包含</option>
                                <option value="ALL_CONTAIN">全包含</option>
                                <option value="ONE_EQUAL">全等于且数量为1</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="">选择店铺</label>
                            <select class="form-control input-sm" v-model="editAddData.data.shopId" @change="getWarehouseListByShopId">
                                <option value="">-- 请选择 --</option>
                                <option v-for="s in shopList" :value="s.shopId">{{s.shopName}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="">指定仓库</label>
                            <select class="form-control input-sm" id="searchWarehouseAddOrEdit" v-model="editAddData.data.warehouseId" @change="getShippingListBySWId">
                                <option value="">-- 请选择 --</option>
                                <option v-for="w in warehouseListByShopId" :value="w.warehouseId">{{w.warehouseName}}</option>
                            </select>
                            <!-- <search-warehouse id="searchWarehouseAddOrEdit" placeholder="仓库 ( 模糊搜索 )" @selected="selectedWarehouseAddOrEdit"></search-warehouse>
                            <input type="hidden" id="hidden-warehouseAddOrEditId" v-model="editAddData.data.warehouseId"> -->
                        </div>
                        <div class="form-group">
                            <label for="">快递方式</label>
                            <select class="form-control input-sm" id="searchShipping" v-model="editAddData.data.shippingId">
                                <option value="">-- 请选择 --</option>
                                <option v-for="s in shippingListBySWId" :value="s.shippingId">{{s.shippingName}}</option>
                            </select>
                            <!-- <search-shipping id="searchShipping" placeholder="快递方式模糊搜索" @selected="selectedShipping"></search-shipping>
                            <input type="hidden" id="hidden-shippingId" v-model="editAddData.data.shippingId"> -->
                        </div>
                        <div class="form-group">
                            <label for="">选择地区</label>
                            <input type="text" placeholder="地区 ( 多选 )" id="selectedRegionInput" class="form-control input-sm" readonly="true" @focus="showRegion">
                            <input type="hidden" id="hidden-selectedRegionInput" v-model="editAddData.data.provinceIds">
                        </div>
                        <div class="form-group">
                            <label for="">商品列表</label>
                            <input type="text" placeholder="商品 ( 商家编码 ) 列表" class="form-control input-sm" id="goodsCodeInput">
                            <span class="btn btn-sm btn-default btn-icon" @click="addGoodsCode">添加</span>
                            <input type="hidden" v-model="editAddData.data.goodsCodes">
                            <ul class="goodsCodes clearfix" v-if="editAddData.data.goodsCodes.length">
                                <li>清空<span class="btn-delete-goodsCodes" @click="clearGoodsCodes"><i class="fa fa-times"></i></span></li>
                                <li v-for="(g,index) in editAddData.data.goodsCodes">
                                    {{g}}
                                    <span class="btn-delete-goodsCodes" @click="deleteGoodsCodes(index)"><i class="fa fa-times"></i></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="popup-footer">
                    <button class="btn btn-sm btn-primary" v-if="strategyPopupType=='add'" @click="submitAddStrategy">
                        <i class="fa fa-check"></i>保存
                    </button>
                    <button class="btn btn-sm btn-primary" v-if="strategyPopupType=='edit'" @click="submitEditStrategy">
                        <i class="fa fa-check"></i>保存
                    </button>
                    <button class="btn btn-sm btn-default" @click="closePopup($event)"><i class="fa fa-reply"></i>取消</button>
                </div>
                
                <div class="popup-region">
                    <p class="popup-title">
                        地区设置
                    </p>
                    <div class="popup-main">
                        <ul class="selected-region-list" v-if="selectedRegionList.length">
                            <li>清空<span class="btn-delete-region" @click="clearRegion"><i class="fa fa-times"></i></span></li>
                            <li v-for="(r,index) in selectedRegionList">
                                {{r.regionName}}
                                <span class="btn-delete-region" @click="deleteRegion(index)"><i class="fa fa-times"></i></span>
                            </li>
                        </ul>
                        <div class="pcd-wrap clearfix">
                            <ul class="province-list">
                                <li v-for="p in provinceListForPopup">
                                    <input type="checkbox" :value="{'regionId':p.regionId,'regionName':p.regionName}" v-model="selectedRegionList">
                                    <span @click="searchCity(p.regionId)">{{p.regionName}}</span>
                                </li>
                            </ul>
                            <ul class="city-list">
                                <li v-for="c in cityListForPopup">
                                    <input type="checkbox" :value="{'regionId':c.regionId,'regionName':c.regionName}" v-model="selectedRegionList">
                                    <span @click="searchDistrict(c.regionId)">{{c.regionName}}</span>
                                </li>
                            </ul>
                            <ul class="district-list">
                                <li v-for="d in districtListForPopup">
                                    <input type="checkbox" :value="{'regionId':d.regionId,'regionName':d.regionName}" v-model="selectedRegionList">
                                    <span>{{d.regionName}}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="popup-footer">
                        <button class="btn btn-sm btn-primary" @click="confirmRegion"><i class="fa fa-check"></i>保存</button>
                        <button class="btn btn-sm btn-default" @click="cancelRegion"><i class="fa fa-reply"></i>取消</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="content-header">
            <ol class="breadcrumb">
                <li><a><i class="fa fa-desktop"></i>店铺</a></li>
                <li class="active">商品转仓策略</li>
                <li class="breadbtn">
                    <button class="btn btn-sm btn-primary" id="btn-add" @click="addStrategy">
                        <i class="fa fa-plus"></i>新建策略
                    </button>
                </li>
            </ol>
        </div>
        <div class="content">
            <div class="box box-default" style="min-width:960px;">
                <div class="box-body" style="min-width:960px;padding-top:20px;padding-bottom:10px;">
                    <div class="row form-inline">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="">选仓类型</label>
                                <select name="" id="" class="form-control input-sm" v-model="formData.data.algorithm">
                                    <option value="">-- 全部 --</option>
                                    <option value="ONCE_CONTAIN">一旦包含</option>
                                    <option value="ALL_CONTAIN">全包含</option>
                                    <option value="ONE_EQUAL">全等于且数量为1</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="">店铺</label>
                                <select class="form-control input-sm" v-model="formData.data.shopId">
                                    <option value="">-- 全部 --</option>
                                    <option v-for="s in shopList" :value="s.shopId">{{s.shopName}}</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label style="position:relative;top:5px;float:left" for="">生效时间</label>
                                <div class="col-md-6" style="position:relative;left:-11px;">
                                <date-range-picker id="search-effective-time" opens="left" :needhms="true" @get_date="get_search_effective_time" :start-time="formData.data.startTime" :end-time="formData.data.endTime"></date-range-picker>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="">策略状态</label>
                                <select class="form-control input-sm" v-model="formData.data.status">
                                    <option value="">-- 全部 --</option>
                                    <option value="NORMAL">NORMAL</option>
                                    <option value="DELETED">DELETED</option>
                                    <option value="EXPIRED">EXPIRED</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="">指定仓库</label>
                                <search-warehouse id="searchWarehouse" placeholder="仓库 ( 模糊搜索 )" @selected="selectedWarehouse"></search-warehouse>
                                <input type="hidden" id="hidden-warehouseId" v-model="formData.data.warehouseId">
                            </div>
                            <div class="form-group">
                                <label for="">商品套餐</label>
                                <search-goods-or-group id="searchGoodsOrGroup" placeholder="商品套餐模糊搜索" @selected="selectedGoodsOrGroup"></search-goods-or-group>
                                <input type="hidden" id="hidden-goodsId" v-model="formData.data.goodsId">
                                <input type="hidden" id="hidden-goodsType" v-model="formData.data.goodsType">
                            </div>
                            <div class="form-group">
                                <button class="btn btn-sm btn-primary" id="btn-search" @click="searchStrategy">
                                    <i class="fa fa-search"></i>查询
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="box box-default" style="min-width:960px;">
                <div class="box-body" style="min-width:960px;">             
                    <table class="table" style="min-width:960px;">
                        <thead>
                            <th style="width:100px;">策略编号</th>
                            <th style="width:100px;">业务组</th>
                            <th style="width:150px;">策略类型</th>
                            <th style="width:200px;">策略生效时间</th>
                            <th style="width:200px;">店铺</th>
                            <th style="width:200px;">省份</th>
                            <th style="width:200px;">仓库</th>
                            <th style="width:100px;">快递</th>
                            <th style="width:100px;">状态</th>
                            <th style="width:150px;">操作</th>
                        </thead>
                        <tbody>
                            <tr v-for="item in goodsWarehouseStrategyList">
                                <td>{{item.id}}</td>
                                <td>{{item.partyId}}</td>
                                <td>{{algorithmRelation[item.algorithm]}}</td>
                                <td>{{item.startTime}} - {{item.endTime}}</td>
                                <td>{{item.shop.shopName}}</td>
                                <td><span v-for="province in item.provinces">{{province.regionName}} , </span></td>
                                <td>{{item.warehouse.warehouseName}}</td>
                                <td>{{item.shipping.shippingName}}</td>
                                <td>{{item.status}}</td>
                                <td>
                                    <span class="btn-edit" @click="editStrategy(item)">编辑</span>
                                    <span class="btn-copy" @click="copyStrategy(item)">复制</span>
                                    <span class="btn-disable" v-if="item.status != 'DELETED'" @click="disableStrategy(item.id)">停用</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="box-footer clearfix">
                    <div class="col-md-2 no-padding"></div>
                    <pagination :offset="formData.data.offset" :length="formData.data.length" :total-count="pageData.totalCount" @paginate="paginate"></pagination>
                </div>
            </div>
       </div>
    </div>
</template>

<script>

import initStyle from '../../common/initStyle'
import http from '../../common/http'
import api from '../../common/api'
import {getDateStr} from '../../common/getDateStr'


import dateRangePicker from '../../component/dateRangePicker'
import pagination from '../../component/pagination'
import searchWarehouse from '../../component/searchWarehouse'
import searchShipping from '../../component/searchShipping'
import searchGoodsOrGroup from '../../component/searchGoodsOrGroup'

var VM = {};

export default {
    mounted () {
    	VM = this;
    	initStyle();
        VM.getShopList();
        VM.getProvinceList();
    },
    data () {
    	return {
            strategyPopupType : '',
            shopList : [],
            searchShopList : [],
            addShopList : [],
            editShopList : [],
            pageData: {
                totalCount: ''
            },
            formData : {
                data : {
                    offset: 0,
                    length: 5,
                    algorithm: '',
                    shopId : '',
                    startTime : '',
                    endTime : '',
                    status: '',
                    warehouseId : '',
                    goodsType : '',
                    goodsId : ''
                }
            },
            goodsWarehouseStrategyList : [],
            editAddData : {
                data : {
                    id : '',
                    algorithm : '',
                    shopId : '',
                    provinceIds : [],
                    startTime : '',
                    endTime : '',
                    warehouseId : '',
                    shippingId : '',
                    goodsCodes : []
                }
            },
            warehouseListByShopId : [],
            shippingListBySWId : [],
            provinceListForPopup : [],
            cityListForPopup: [],
            districtListForPopup : [],
            selectedRegionList : [],
            algorithmRelation : {
                ONCE_CONTAIN : '一旦包含',
                ALL_CONTAIN : '全包含',
                ONE_EQUAL : '全等于且数量为1'
            }
        }
    },
    components : {
        dateRangePicker,
        pagination,
        searchWarehouse,
        searchShipping,
        searchGoodsOrGroup
    },
    methods : {
        getWarehouseListByShopId (callback) {
            http({
                instance: VM,
                url: api.getWarehouseListByShopId,
                type: 'post',
                data : {
                    data : {
                        shopId : VM.editAddData.data.shopId
                    }
                },
                success (res) {
                    VM.warehouseListByShopId = res.data;
                    VM.editAddData.data.warehouseId = '';
                    VM.editAddData.data.shippingId = '';
                    if (callback) {
                        callback();
                    }
                }
            });
        },
        getShippingListBySWId (callback) {
            http({
                instance: VM,
                url: api.getShippingListBySWId,
                type: 'post',
                data : {
                    data : {
                        shopId : VM.editAddData.data.shopId,
                        warehouseId : VM.editAddData.data.warehouseId
                    }
                },
                success (res) {
                    VM.shippingListBySWId = res.data;
                    if (callback) {
                        VM.editAddData.data.shippingId = '';
                        callback();
                    }
                }
            });
        },
        getShopList () {
            http({
                instance: VM,
                url: api.getShopList,
                type: 'post',
                success (res) {
                    VM.shopList = res.data;
                }
            });
        },
        closePopup (e) {
            $(e.target).parents('.popup-wrap').fadeOut(200);
        },
        paginate (data) {
            VM.formData.data.offset = data.offset;
            VM.formData.data.length = data.length;
            VM.searchStrategy();
        },
        searchStrategy () {
            VM.checkFuzzySearch();
            http({
                instance: VM,
                url: api.getGoodsWarehouseStrategyList,
                type: 'post',
                data: VM.formData,
                hasLoading: true,
                success (res) {
                    VM.goodsWarehouseStrategyList = res.data.content;
                    VM.pageData.totalCount = res.data.totalCount;
                }
            });
        },
        selectedWarehouse (data) {
            if (data.warehouseId) {
                VM.$set(VM.formData.data,'warehouseId', data.warehouseId);
            } else {
                VM.$set(VM.formData.data,'warehouseId', "");
            }
        },
        // selectedWarehouseAddOrEdit (data) {
        //     if (data.warehouseId) {
        //         VM.$set(VM.editAddData.data,'warehouseId', data.warehouseId);
        //     } else {
        //         VM.$set(VM.editAddData.data,'warehouseId', "");
        //     }
        // },
        selectedGoodsOrGroup (data) {
            if (data.goodsId && data.goodsName) {
                VM.$set(VM.formData.data,'goodsId', data.goodsId);
                VM.$set(VM.formData.data,'goodsType', data.goodsType);
            } else {
                VM.$set(VM.formData.data,'goodsId', "");
                VM.$set(VM.formData.data,'goodsType', "");
            }
        },
        // selectedShipping (data) {
        //     if (data.shippingId) {
        //         VM.$set(VM.editAddData.data,'shippingId', data.shippingId);
        //     } else {
        //         VM.$set(VM.editAddData.data,'shippingId', "");
        //     }
        // },
        get_search_effective_time (date) {
            VM.formData.data.startTime = date.start_time;
            VM.formData.data.endTime = date.end_time;
        },
        get_editAdd_effective_time (date) {
            VM.editAddData.data.startTime = date.start_time;
            VM.editAddData.data.endTime = date.end_time;
        },
        checkFuzzySearch () {
            if (VM.formData.data.warehouseId == '' || $('#searchWarehouse').val() == '') {
                $('#searchWarehouse').val('');
                VM.formData.data.warehouseId = '';
            }
            if (VM.formData.data.goodsId == '' || $('#searchGoodsOrGroup').val() == '') {
                $('#searchGoodsOrGroup').val('');
                VM.formData.data.goodsId = '';
            }
            if (VM.formData.data.goodsType == '' || $('#searchGoodsOrGroup').val() == '') {
                $('#searchGoodsOrGroup').val('');
                VM.formData.data.goodsType = '';
            }
        },
        addStrategy () {
            VM.strategyPopupType = 'add';
            VM.editAddData.data = {
                id : '',
                algorithm : '',
                shopId : '',
                provinceIds : [],
                startTime : '',
                endTime : '',
                warehouseId : '',
                shippingId : '',
                goodsCodes : []
            };
            VM.selectedRegionList = [];
            VM.warehouseListByShopId = [];
            VM.shippingListBySWId = [];
            $('#selectedRegionInput').val('');
            $('#goodsCodeInput').val('');
            $('.popup-wrap').fadeIn();
        },
        submitAddStrategy () {
            http({
                instance: VM,
                url: api.addStrategy,
                type: 'post',
                data: VM.editAddData,
                hasLoading: true,
                success (res) {
                    if (res.code == 200) {
                        $('#pw-addEditStrategy').fadeOut(200);
                        layer.msg('新建成功', {
                            time: 1000
                        },function(){
                            VM.searchStrategy();         
                        });
                    }
                }   
            });
        },
        disableStrategy (id) {
            http({
                instance: VM,
                url: api.disableStrategy,
                type: 'post',
                data: {
                    data : {
                        id : id
                    }
                },
                hasLoading: true,
                success (res) {
                    if (res.code == 200) {
                        layer.msg('停用成功', {
                            time: 1000
                        },function(){
                            VM.searchStrategy();
                        });
                    }
                }   
            });
        },
        editStrategy (strategy) {
            $('.popup-wrap').fadeIn();
            VM.strategyPopupType = 'edit';
            let provinceIds = [], provinceNames = [], goodsCodes = [], selectedRegionList = [];
            for (let i in strategy.provinces) {
                provinceIds.push(strategy.provinces[i].regionId);
                provinceNames.push(strategy.provinces[i].regionName);
                selectedRegionList.push({
                    regionId : strategy.provinces[i].regionId,
                    regionName : strategy.provinces[i].regionName
                });
            }
            VM.selectedRegionList = selectedRegionList;
            for (let i in strategy.goodsGroups) {
                goodsCodes.push(strategy.goodsGroups[i].goodsGroupCode);
            }
            VM.editAddData.data = {
                id : strategy.id,
                algorithm : strategy.algorithm,
                shopId : strategy.shop.shopId,
                provinceIds : provinceIds,
                startTime : strategy.startTime,
                endTime : strategy.endTime,
                warehouseId : '',
                shippingId : '',
                goodsCodes : goodsCodes
            };
            VM.getWarehouseListByShopId(function(){
                VM.editAddData.data.warehouseId = strategy.warehouse.warehouseId;
                VM.getShippingListBySWId(function(){
                    VM.editAddData.data.shippingId = strategy.shipping.shippingId;
                });
            });
            $('#selectedRegionInput').val(provinceNames);
            $('#goodsCodeInput').val('');
        },
        copyStrategy (strategy) {
            VM.strategyPopupType = 'add';
            let provinceIds = [], provinceNames = [], goodsCodes = [], selectedRegionList = [];
            for (let i in strategy.provinces) {
                provinceIds.push(strategy.provinces[i].regionId);
                provinceNames.push(strategy.provinces[i].regionName);
                selectedRegionList.push({
                    regionId : strategy.provinces[i].regionId,
                    regionName : strategy.provinces[i].regionName
                });
            }
            for (let i in strategy.goodsGroups) {
                goodsCodes.push(strategy.goodsGroups[i].goodsGroupCode);
            }
            VM.editAddData.data = {
                id : '',
                algorithm : strategy.algorithm,
                shopId : strategy.shop.shopId,
                provinceIds : provinceIds,
                startTime : '',
                endTime : '',
                warehouseId : strategy.warehouse.warehouseId,
                shippingId : strategy.shipping.shippingId,
                goodsCodes : goodsCodes
            };
            VM.selectedRegionList = selectedRegionList;
            $('#selectedRegionInput').val(provinceNames);
            $('#goodsCodeInput').val('');
            $('.popup-wrap').fadeIn();
        },
        submitEditStrategy () {
            http({
                instance: VM,
                url: api.editStrategy,
                type: 'post',
                data: VM.editAddData,
                hasLoading: true,
                success (res) {
                    if (res.code == 200) {
                        $('#pw-addEditStrategy').fadeOut(200);
                        layer.msg('编辑成功', {
                            time: 1000
                        },function(){
                            VM.searchStrategy();
                        });
                    }
                }   
            });
        },
        showRegion () {
            $('.popup-region').fadeIn(500);
        },
        getProvinceList () {
            http({
                instance: VM,
                url: api.regionList,
                type: 'post',
                data: {
                  data: {
                    parentId:'',
                    regionType: 1
                  }
                },
                hasLoading: false,
                success (res) {
                  if (res.code == 200) {
                    VM.provinceListForPopup = res.data;
                  }
                }   
            });
        },
        searchCity (regionId) {
            http({
                instance: VM,
                url: api.regionList,
                type: 'post',
                data: {
                  data: {
                    parentId: regionId,
                    regionType: 2
                  }
                },
                hasLoading: false,
                success (res) {
                  if (res.code == 200) {
                    VM.cityListForPopup = res.data;
                  }
                }   
            });
        },
        searchDistrict (regionId) {
            http({
                instance: VM,
                url: api.regionList,
                type: 'post',
                data: {
                  data: {
                    parentId: regionId,
                    regionType: 3
                  }
                },
                hasLoading: false,
                success (res) {
                  if (res.code == 200) {
                    VM.districtListForPopup = res.data;
                  }
                }   
            });
        },
        deleteRegion (index) {
            VM.selectedRegionList.splice(index,1);
            for (let r in VM.selectedRegionList) {
                VM.editAddData.data.provinceIds.push(VM.selectedRegionList[r].regionId);
            }
        },
        clearRegion () {
            VM.selectedRegionList = [];
            VM.editAddData.data.provinceIds = [];
        },
        confirmRegion () {
            let v = [], provinceIds = [];
            for (let r in VM.selectedRegionList) {
                v.push(VM.selectedRegionList[r].regionName);
                provinceIds.push(VM.selectedRegionList[r].regionId);
            }
            VM.editAddData.data.provinceIds = provinceIds;
            $('#selectedRegionInput').val(v);
            $('.popup-region').fadeOut(500);
        },
        cancelRegion () {
            $('.popup-region').fadeOut(500);
        },
        addGoodsCode () {
            if ($('#goodsCodeInput').val()) {
                let v = $('#goodsCodeInput').val().split(',');
                for (let i in v) {
                    VM.editAddData.data.goodsCodes.push(v[i]);
                }
                $('#goodsCodeInput').val('').focus();
            }
        },
        deleteGoodsCodes (index) {
            VM.editAddData.data.goodsCodes.splice(index,1);
        },
        clearGoodsCodes () {
            VM.editAddData.data.goodsCodes = [];
        }
    }
}
</script>

<style scoped>
.form-group {
    margin-right: 20px;
    margin-bottom: 10px;
}
label {
    margin-right: 5px;
    width: 4.5em;
    text-align: right;
}
.radio-wrap, input[type='checkbox'] {
    cursor: pointer;
}
.form-control {
    width: 200px !important;
}
select[multiple="multiple"] {
    height: 100px;
}
/*.table-bordered,th,td{
    border: 1px solid #ddd !important;
    text-align: left;
}*/
/*#btn-search {
    margin-left: 5.85em;
}*/
/*.btn {
    padding-left: 16px;
    padding-right: 16px;
}*/
.btn i.fa {
    margin-right: .5em;
}
.popup-wrap {
    display: none;
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
    top: 100px;
    left: 50%;
    width: 380px;
    min-height: 460px;
    margin-left: -230px;
    background-color: #fff;
    border-radius: 5px;
    z-index: 999;
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
    height: 370px;
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
    left: 390px;
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
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}
.selected-region-list {
    width: 100%;
    border:1px solid #ccc;
    overflow: hidden;
    padding: 10px 10px 0 10px;
    margin-bottom: 10px;
    border-radius: 3px;
}
.selected-region-list li {
    float: left;
    border:1px solid #ccc;
    margin-right:10px;
    margin-bottom:10px;
    padding:2px 0 2px 6px;
    border-radius: 3px;
}
.btn-delete-region {
    display: inline-block;
    width: 26px;
    text-align: center; 
    cursor: pointer;
    color: #666;
}
.popup-region .province-list {
    float: left;
    margin-right: 15px;
    border:1px solid #ccc;
    width: 183px;
    height: 350px;
    overflow-x: hidden;
    overflow-y: scroll;
    border-radius: 3px;
}
.popup-region .city-list {
    float: left;
    margin-right: 15px;
    border:1px solid #ccc;
    width: 183px;
    height: 350px;
    overflow-x: hidden;
    overflow-y: scroll;
    border-radius: 3px;
}
.popup-region .district-list {
    float: left;
    border:1px solid #ccc;
    width: 183px;
    height: 350px;
    overflow-x: hidden;
    overflow-y: scroll;
    border-radius: 3px;
}
.popup-region .province-list li,
.popup-region .city-list li,
.popup-region .district-list li {
    padding:5px 10px;
    cursor: pointer;
    border-bottom: 1px solid #ccc;
}
.popup-region .province-list li:last-child,
.popup-region .city-list li:last-child,
.popup-region .district-list li:last-child {
    border-bottom: none;
}
.goodsCodes {
    width: 100%;
    border:1px solid #ccc;
    overflow: hidden;
    padding: 10px 10px 5px 10px;
    margin: 10px auto;
    border-radius: 3px;
}
.goodsCodes li {
    float: left;
    border:1px solid #ccc;
    margin-right:5px;
    margin-bottom:5px;
    padding:2px 0 2px 6px;
    border-radius: 3px;
}
.btn-delete-goodsCodes {
    display: inline-block;
    width: 26px;
    text-align: center; 
    cursor: pointer;
    color: #666;
}
.btn-edit, .btn-copy, .btn-disable {
    cursor: pointer;
    margin-right: 5px;
}
.btn-edit {
    color: #337ab7;
}
.btn-copy {
    color: #f0ad4e;
}
.btn-disable {
    color: #d9534f;
}
.btn-ghost {
    display: inline-block;
    border:1px solid black;
    outline: none;
    cursor: pointer;
    color:black;
    background-color: #fff;
    border-radius: 3px;
    padding:5px 16px;
    font-size: 12px; 
}
.btn-ghost.success {
    border-color: #4cae4c;
    color: #4cae4c;
}
.btn-ghost.danger {
    border-color: #d43f3a;
    color: #d43f3a;
}
.btn-confirm-popup {
    margin:0 10px;
}
li.breadbtn {
    float:right;
    margin-right:15px;
}
li.breadbtn:before {
    display: none;
}
</style>