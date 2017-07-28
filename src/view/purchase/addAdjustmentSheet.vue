<template>
    <div class="content-wrapper">
       <div class="content-header">
       		<ol class="breadcrumb">
                <li><a><i class="fa fa-desktop"></i>采购</a></li>
                <li class="active">添加调整单</li>
            </ol>
       </div>
       <div class="content">
            <div class="box" style="min-width:960px;padding-top:20px;">
                <div class="box-body">
                    <div class="sale-orders-search-form row form-inline">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="">仓库</label>
                                <search-warehouse-by-type id="searchWarehouseByType" placeholder="仓库模糊搜索" @selected="selectedAddWarehouse"></search-warehouse-by-type>
                                <input type="hidden" id="hidden-search-warehouseId" v-model="singleAddData.data.warehouseId">
                            </div>
                            <div class="form-group">
                                <label for="">调整前</label>
                                <select name="" id="" class="form-control input-sm" v-model="singleAddData.data.beforeType">
                                    <option value="">-- 全部 --</option>
                                    <option value="INV_STTS_AVAILABLE">全新</option>
                                    <option value="INV_STTS_USED">二手</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="">调整后</label>
                                <select name="" id="" class="form-control input-sm" v-model="singleAddData.data.afterType">
                                    <option value="">-- 全部 --</option>
                                    <option value="VARIANCE_ADD">盘盈</option>
                                    <option value="VARIANCE_MINUS">盘亏</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="">商品名称</label>
                                <search-sku id="searchSku" placeholder="商品名称搜索" @selected="selectedAddSku"></search-sku>
                                <input type="hidden" id="hidden-search-skuid" v-model="singleAddData.data.skuId">
                            </div>
                            <div class="form-group">
                                <label for="">商品条码</label>
                                <input type="text" class="form-control input-sm" v-model="singleAddData.data.barCode">
                            </div>
                            <div class="form-group">
                                <label for="">数量</label>
                                <input type="text" class="form-control input-sm" v-model="singleAddData.data.number">
                            </div>
                            <div class="form-group">
                                <div class="form-group">
                                    <button class="btn btn-sm btn-primary" id="btn-add" @click="addSingleV">
                                        <i class="fa fa-plus"></i>添加
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="box" style="min-width:960px;" v-if="addList.length">
                <div class="box-body">
                    <table class="table" style="min-width:960px;">
                        <thead>
                            <th style="width:150px;">商品名称</th>
                            <th style="width:150px;">商品条码</th>
                            <th style="width:100px;">数量</th>
                            <th style="width:150px;">调整类型</th>
                            <th style="width:200px;" colspan="2">单品库存折现</th>
                            <th style="width:150px;">赢亏小计</th>
                            <th style="width:150px;">备注</th>
                            <th style="width:100px;">操作</th>
                        </thead>
                        <tbody>
                            <tr v-for="(v,index) in addList">
                                <td>{{v.skuName}}</td>
                                <td>{{v.barCode}}</td>
                                <td>{{v.number}}</td>
                                <td>{{beforeTypeRelation[v.beforeType]}}转{{afterTypeRelation[v.afterType]}}</td>
                                <td>{{v.goodsValue}}</td>
                                <td>{{v.afterValue}}</td>
                                <td>{{v.totalValue}}</td>
                                <td><input type="text" class="form-control input-sm" v-model="v.note"></td>
                                <td>
                                    <span class="btn-delete" @click="deleteSingleV(index)">删除</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="box-footer" v-if="addList.length">
                    <button class="btn btn-sm btn-primary" id="btn-submit" @click="createV">
                        <i class="fa fa-check"></i>创建
                    </button>
                </div>
            </div>
       </div>
    </div>
</template>

<script>

import initStyle from '../../common/initStyle'
import http from '../../common/http'
import api from '../../common/api'
import deepClone from '../../common/deepClone'

import searchSku from '../../component/searchSku'
import searchWarehouseByType from '../../component/searchWarehouseByType'

var VM = {};

export default {
    mounted () {
    	VM = this;
    	initStyle();
    },
    data () {
    	return {
    		singleAddData : {
                data : {
                    warehouseId : '',
                	beforeType : '',
                	afterType : '',
                    skuId : '',
                    barCode : '',
                    number : '',
                    note : ''
                }
    		},
    		beforeTypeRelation : {
                INV_STTS_AVAILABLE : '全新',
                INV_STTS_USED : '二手'
            },
            afterTypeRelation : {
                VARIANCE_ADD : '盘盈',
                VARIANCE_MINUS : '盘亏'
            },
    		orderVStatusRelation : {
    			WAIT_CHECK : '待审核',
    			CHECK_PASS : '审核通过为推送',
    			PART_RESERVED : '部分预定',
    			FAIL_RESERVED : '预定失败',
    			OMS_ADJUST : 'OMS已调整',
    			CANCEL : '已作废',
    			PUSHED : '已推送',
    			WMS_ADJUST : 'WMS已调整'
    		},
            addList : [],
    	}
    },
    components : {
        searchSku,
        searchWarehouseByType
    },
    methods : {
        selectedAddWarehouse (data) {
            if (data.warehouseId) {
                VM.$set(VM.singleAddData.data,'warehouseId', data.warehouseId);
            } else {
                VM.$set(VM.singleAddData.data,'warehouseId', "");
            }
        },
        selectedAddSku (data) {
            if (data.skuId) {
                VM.$set(VM.singleAddData.data,'skuId', data.skuId);
            } else {
                VM.$set(VM.singleAddData.data,'skuId', "");
            }
        },
        checkAddData () {
            let flag = true, msg = '';
        	if (VM.singleAddData.data.warehouseId == '') {
                $('#searchWarehouse').val('');
                flag = false;
                msg = '请输入正确的仓库名称';
                return {
                    flag : flag,
                    msg : msg
                };
            }
            if (VM.singleAddData.data.beforeType == '') {
                flag = false;
                msg = '请输入调整前类型';
                return {
                    flag : flag,
                    msg : msg
                };
            }
            if (VM.singleAddData.data.afterType == '') {
                flag = false;
                msg = '请输入调整后类型';
                return {
                    flag : flag,
                    msg : msg
                };
            }
            if (VM.singleAddData.data.beforeType == VM.singleAddData.data.afterType) {
                flag = false;
                msg = '调整前类型和调整后类型不能一样';
                return {
                    flag : flag,
                    msg : msg
                };
            }
            if (VM.singleAddData.data.skuId == '' && VM.singleAddData.data.barCode == '') {
                $('#searchSku').val('');
                flag = false;
                msg = '请输入正确的商品名称或商品条码';
                return {
                    flag : flag,
                    msg : msg
                };
            }
            if (VM.singleAddData.data.number == '') {
                flag = false;
                msg = '请输入数量';
                return {
                    flag : flag,
                    msg : msg
                };
            }
            return {
                flag : true,
                msg : ''
            };
        },
        addSingleV () {
            let checkResult = VM.checkAddData();
            if (checkResult.flag) {
                http({
                    instance: VM,
                    url: api.addSingleV,
                    type: 'post',
                    data: VM.singleAddData,
                    hasLoading: true,
                    success (res) {
                        let currentTag = res.data.skuId + res.data.beforeType + res.data.afterType, exitTags = [], flag = true;
                        for (let i in VM.addList) {
                            if (currentTag == VM.addList[i].skuId + VM.addList[i].beforeType + VM.addList[i].afterType) {
                                flag = false;
                            }
                        }
                        console.log(flag);
                        if (flag) {
                            layer.msg('添加成功', {
                                time: 1000
                            }, function(){
                                VM.addList.push({
                                    skuId : res.data.skuId,
                                    warehouseId : res.data.warehouseId,
                                    skuName : res.data.skuName,
                                    barCode : res.data.barCode,
                                    number : res.data.number,
                                    beforeType : res.data.beforeType,
                                    afterType : res.data.afterType,
                                    goodsValue : res.data.goodsValue,
                                    afterValue : res.data.afterValue,
                                    totalValue : res.data.totalValue,
                                    note : res.data.note
                                });
                            });
                        } else {
                            layer.msg('您已添加过相同SKU相同调整类型的调整单', {
                                time: 1000
                            });
                        }
                    }   
                });
            } else {
                layer.msg(checkResult.msg, {
                    time: 1000
                });
            }
        },
        deleteSingleV (index) {
            VM.addList.splice(index,1);
        },
        createV () {
            http({
                instance: VM,
                url: api.createV,
                type: 'post',
                data: {
                    data : {
                        orderVVoList : VM.addList
                    }
                },
                hasLoading: true,
                success (res) {
                    layer.msg('创建成功', {
                        time: 1000
                    });
                }   
            });
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
	width: 5.5em;
	text-align: right;
}
.form-control {
	width: 200px !important;
}
.btn i.fa {
	margin-right: .5em;
}
#btn-add {
    margin-top: 10px;
}
.btn-delete {
    cursor: pointer;
    margin-right: 5px;
    color: #d9534f;
}
#btn-submit {
    float: right;
}
</style>