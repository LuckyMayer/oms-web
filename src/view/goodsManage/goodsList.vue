<template>
    <div class="content-wrapper">
        <section class="content-header clearfix">
          <ol class="breadcrumb col-md-6">
            <li><a href="#"><i class="fa fa-desktop"></i>商品管理</a></li>
            <li class="active">商品列表</li>
          </ol>
          <div class="col-md-6" style="text-align: right; position: relative; top: 10px;">
            <button class="btn btn-sm btn-primary" @click="addNewGoods">
                <i class="fa fa-plus"></i>新建商品
            </button>
          </div>
        </section>

        <!-- Main content -->
        <section class="content content_yjlu">
            <div class="row form-horizontal searchContent bgFFF">
                <div class="col-md-4">
                    <div class="form-group">
                        <label class="col-sm-4 control-label">商品名称:</label>
                        <div class="col-sm-8">
                           <search-goods-name @selected="selectGoods"></search-goods-name>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">类型:</label>
                        <div class="col-sm-8">
                           <select-goods-type @selected="selectGoodsType"></select-goods-type>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label class="col-sm-4 control-label">商品分类:</label>
                        <div class="col-sm-8">
                            <search-custom-category @selected="searchCustomCategory"></search-custom-category>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">商家编码:</label>
                        <div class="col-sm-8">
                            <input type="text" class="form-control input-sm" v-model="formData.skuCode" placeholder="输入商家编码" />
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="form-group">
                        <label class="col-sm-4 control-label">SKU状态:</label>
                        <div class="col-sm-8">
                           <select-status @selected="selectStatus"></select-status>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">商品条码:</label>
                        <div class="col-sm-8">
                           <input type="text" class="form-control input-sm" placeholder="输入商品条码" v-model="formData.barcode"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-4 col-sm-offset-4">
                            <button class="btn btn-sm btn-primary" @click="fetchTableList"><i class="fa fa-search"></i> 查询</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="box box-default">
                <div class="box-body">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>商品名称</th>
                                <th>行业类目</th>
                                <th>品牌</th>
                                <th>规格</th>
                                <!-- <th>商品编码</th> -->
                                <th>商家编码</th>
                                <th>商品条码</th>
                                <th style="min-width: 50px;">操作</th>
                            </tr>                                    
                        </thead>
                        <tbody>
                            <tr v-if='tableList.length==0'>
                                <td colspan="100">
                                    <h4 class='text-center text-gray'>什么也没有...</h4>
                                </td>
                            </tr>
                            <template v-for="(goods, i) in tableList">
                                <!-- <tr v-if="!goods.skus.length">
                                    <td>
                                        <a :href="'#/index/goodsManage/goodsDetail/'+goods.id">{{goods.goodsName.trim()}}</a>
                                    </td>
                                    <td v-text='(goods.goodsCategory)?goods.goodsCategory.name:""'></td>
                                    <td v-text='(goods.goodsBrand)?goods.goodsBrand.goodsBrandName:""'></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr> -->
                                <tr v-for="(sku, j) in goods.skus" :class="{'deleteStyle':sku.status == 'DELETED'}">
                                    <td :rowspan="goods.skus.length" v-if="j == 0">
                                        <a :href="'#/index/goodsManage/goodsDetail/'+goods.id">{{goods.goodsName.trim()}}</a>
                                    </td>
                                    <td :rowspan="goods.skus.length" v-if="j == 0" v-text='(goods.goodsCategory)?goods.goodsCategory.name:""'></td>
                                    <td :rowspan="goods.skus.length" v-if="j == 0" v-text='(goods.goodsBrand)?goods.goodsBrand.goodsBrandName:""'></td>
                                    <td>
                                        <span v-if="sku.styleValue1.value" v-text="sku.styleValue1.value"></span>
                                        <span v-if="sku.styleValue2.value" v-text="sku.styleValue2.value"></span>
                                    </td> <!-- 规格 -->
                                    <!-- <td v-text='sku.skuId'></td> -->
                                    <td v-text='sku.skuCode'></td>
                                    <td v-text='sku.barcode'></td>
                                    <td>
                                        <enable-diasble-btn idname="skuId" :id="sku.skuId" :status="sku.status" enableapi="goodsDetailEnable" disableapi="goodsDetailDisable" margin-left="0px" :refresh="fetchTableList" ref="child"></enable-diasble-btn>
                                    </td>
                                </tr>
                            </template>                               
                        </tbody>
                    </table>
                </div>
                <div class="box-footer clearfix">
                    <div class="col-md-2 no-padding"></div>
                    <pagination :offset="formData.offset" :length="formData.length" :total-count="pageData.totalCount" @paginate="paginate"></pagination>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import initStyle from '../../common/initStyle'
import http from '../../common/http'
import api from '../../common/api'

import pagination from '../../component/pagination'
import searchGoodsName from '../../component/searchGoodsName'
import searchGoodsTagValue from '../../component/searchGoodsTagValue'
import selectGoodsBrand from '../../component/selectGoodsBrand'
import selectGoodsType from '../../component/selectGoodsType'
import selectStatus from '../../component/selectStatus'
import searchGoodsCategory from '../../component/searchGoodsCategory'
import searchCustomCategory from '../../component/searchCustomCategory'
import enableDiasbleBtn from '../../component/enableOrDisableBtn'

export default {
    components: {
        pagination,
        searchGoodsName,
        searchGoodsTagValue,
        selectGoodsBrand,
        selectGoodsType,
        selectStatus,
        searchGoodsCategory,
        searchCustomCategory,
        enableDiasbleBtn
    },
    mounted () {
        this.$nextTick(() => {
            initStyle();
            this.fetchTableList();
            // this.selectAll();
        });
    },
    data () {
        return {
            tableList: [], 
            formData: {
                // goodsId: '1577',
                offset: 0,
                length: 20
            },
            pageData: {
                totalCount: ''
            },
            selectAll: false
        }
    },
    filters: {
        statusFilter (val) {
            var statusObj = {
                NORMAL: '正常',
                DELETED: '停用'
            }
            for (var i in statusObj) {
                if (i == val) {
                    return statusObj[i];
                }
            }
        }
    },
    methods: {
        // selectAllFun () {
        //     const _self = this;
        //     _self.tableList.forEach(function (item, index) {
        //         _self.$set(item, 'selected', _self.selectAll);
        //     });
        // },
        addNewGoods () {
            var _self = this;
            _self.$router.push({name: 'goodsDetail'});
        },
        fetchTableList () {
            const _self = this;
            for (var i in _self.formData) {
                if (_self.formData[i] == '' && i != 'offset' && i != 'length') {
                    delete _self.formData[i];
                }
            }
            http({
                instance: _self,
                url: api.getGoodsList,
                type: 'post',
                data: {
                    data: _self.formData
                },
                hasLoading: true,
                success (res) {
                    console.log(res);
                    _self.tableList = res.data.content;
                    _self.pageData.totalCount = res.data.totalCount;
                    if (res.data.totalCount) {
                        _self.tableList.forEach(function (item, index) {
                            _self.$set(item, 'selected', _self.selectAll);
                        });
                    } else {
                        _self.tableList = [];
                    }
                }
            });
        },
        paginate (data) {
            this.formData.offset = data.offset;
            this.formData.length = data.length;
            this.fetchTableList();
        },
        selectGoods (data) {
            if (data) {
                this.$set(this.formData, 'goodsId', data.id);
            } else {
                delete this.formData.goodsId;
            }
        },
        selectGoodsTagValue (data) {
            if (data) {
                this.$set(this.formData, 'goodsTagValueId', data.id);
            } else {
                delete this.formData.goodsTagValueId;
            }
        },
        selectGoodsBrand (data) {
            if (data) {
                this.$set(this.formData, 'goodsBrandId', data);
            } else {
                delete this.formData.goodsBrandId;
            }
        },
        selectGoodsType (data) {
            if (data) {
                this.$set(this.formData, 'goodsType', data);
            } else {
                delete this.formData.goodsType;
            }
        },
        selectStatus (data) {
            if (data) {
                this.$set(this.formData, 'skuStatus', data);
            } else {
                delete this.formData.skuStatus;
            }
        },
        searchCustomCategory (data) {
            if (data) {
                this.$set(this.formData, 'goodsCustomCategoryId', data);
            } else {
                delete this.formData.goodsCustomCategoryId;
            }
        },
        searchGoodsCategory (data) {
            if (data) {
                this.$set(this.formData, 'goodsCategoryId', data);
            } else {
                delete this.formData.goodsCategoryId;
            }
        }
    }
}
</script>
<style scoped>
    .deleteStyle{
       color:#A6A6A6; 
    }
</style>