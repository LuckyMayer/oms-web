<template>
    <div class="content-wrapper">
       	<div class="content-header">
       		<ol class="breadcrumb">
                <li><a><i class="fa fa-desktop"></i>财务</a></li>
                <li class="active">采购退货财审</li>
            </ol>
       	</div>
       	<div class="content">
       		<div class="box" style="min-width:960px;padding-top:20px;">
                <div class="box-body">
	                <div class="sale-orders-search-form row form-inline">
		       			<div class="col-md-12">
		       				<div class="form-group">
		       					<label for="">退货单号</label>
		       					<input type="text" class="form-control input-sm" v-model="searchFormData.data.orderSns">
		       				</div>
		       				<div class="form-group">
                                <label for="">供应商</label>
                                <input type="text" class="form-control input-sm">
                            </div>
                            <div class="form-group">
                                <label for="">订单时间</label>
                                <date-range-picker id="order-time" opens="left" :needhms="true" @get_date="get_create_time" :start-time="searchFormData.data.startCreateTime" :end-time="searchFormData.data.endCreateTime"></date-range-picker>
                            </div>
                            <div class="form-group">
                                <div class="form-group">
                                    <button class="btn btn-sm btn-primary" id="btn-search" @click="searchGtFinanceCheckList">
                                        <i class="fa fa-search"></i>查询
                                    </button>
                                </div>
                            </div>
		       			</div>
	       			</div>
                </div>
            </div>
       		
            <div class="box box-primary" style="min-width:960px;">
                <div class="box-body">
                    <input type="checkbox" style="margin-left:15px;" @click="checkAll($event)">
                    <button class="primaryBtn" id="btn-batch-apply" @click="batchApplyGt">
                        财审通过
                    </button>
                    <button class="primaryBtn" id="btn-batch-reject" @click="batchRejectGt">
                        财审驳回
                    </button>
                    <table class="table" style="min-width:960px;" v-if="gtList.length">
                        <thead>
                            <th style="text-align:center;width:50px;"></th>
                            <th>退货单号</th>
                            <th>订单时间</th>
                            <th>供应商</th>
                            <th>原采购价总计</th>
                            <th>退货价总计</th>
                            <th>赢亏金额</th>
                            <th>操作</th>
                        </thead>
                        <tbody>
                            <tr v-for="gt in gtList">
                            	<td style="text-align:center;"><input type="checkbox" :value="gt.orderGtId" v-model="selectedGtList"></td>
                                <td>{{gt.orderSn}}</td>
                                <td>{{gt.createTime}}</td>
                                <td>{{gt.provider.providerName}}</td>
                                <td>{{gt.purchaseTotalFee}}</td>
                                <td>{{gt.returnTotalFee}}</td>
                            	<td>{{(Number(gt.returnTotalFee) - Number(gt.purchaseTotalFee)).toFixed(2)}}</td>
                            	<td>
                            		<span class="btn-apply" @click="applyGt(gt.orderGtId)">通过</span>
                            		<span class="btn-reject" @click="rejectGt(gt.orderGtId)">驳回</span>
                            	</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="box-footer clearfix">
                    <div class="col-md-2 no-padding"></div>
                    <pagination :offset="searchFormData.data.offset" :length="searchFormData.data.length" :total-count="pageData.totalCount" @paginate="paginate"></pagination>
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
import {getDateStr} from '../../common/getDateStr'

import dateRangePicker from '../../component/dateRangePicker'
import pagination from '../../component/pagination'

var VM = {};

export default {
    mounted () {
    	VM = this;

        VM.searchFormData.data.startCreateTime = getDateStr(-30);
        VM.searchFormData.data.endCreateTime = getDateStr(0,true);

    	initStyle();
    },
    data () {
    	return {
            pageData: {
                totalCount: ''
            },
    		searchFormData : {
                data : {
                    offset: 0,
                    length: 10,
                	orderSns : '',
                	providerId : '',
                	startCreateTime : '',
                	endCreateTime : ''
                }
    		},
    		gtList : [],
    		selectedGtList : []
    	}
    },
    components : {
    	dateRangePicker,
        pagination
    },
    methods : {
        paginate (data) {
            VM.formData.data.offset = data.offset;
            VM.formData.data.length = data.length;
            VM.searchGtFinanceCheckList();
        },
    	searchGtFinanceCheckList () {
    		let data = deepClone(VM.searchFormData);
    		if (data.data.orderSns) {
    			data.data.orderSns = data.data.orderSns.split(',');
    		} else {
    			data.data.orderSns = [];
    		}
    		http({
                instance: VM,
                url: api.getGtFinanceCheckList,
                type: 'post',
                data: data,
                hasLoading: true,
                success (res) {
	                VM.gtList = res.data.content;
                }   
            });
    	},
        get_create_time (date) {
            VM.searchFormData.data.startCreateTime = date.start_time;
            VM.searchFormData.data.endCreateTime = date.end_time;
        },
        checkAll (e) {
            let checkAll = $(e.target).eq(0).prop('checked');
            if (checkAll) {
                VM.selectedGtList = [];
                for (let order in VM.gtList) {
                    VM.selectedGtList.push(VM.gtList[order].orderGtId);
                }
            } else {
                VM.selectedGtList = [];
            }
        },
        batchApplyGt () {
            http({
                instance: VM,
                url: api.gtFinanceCheck,
                type: 'post',
                data: {
                    data : {
                        orderGtIds : VM.selectedGtList
                    }
                },
                hasLoading: true,
                success (res) {
                    layer.msg('操作成功', {
                        time: 1000
                    },function(){
                        VM.searchGtFinanceCheckList();
                    });
                }   
            });
        },
        batchRejectGt () {
            http({
                instance: VM,
                url: api.gtFinanceReject,
                type: 'post',
                data: {
                    data : {
                        orderGtIds : VM.selectedGtList
                    }
                },
                hasLoading: true,
                success (res) {
                    layer.msg('操作成功', {
                        time: 1000
                    },function(){
                        VM.searchGtFinanceCheckList();
                    });
                }   
            });
        },
        applyGt (orderGtId) {
            http({
                instance: VM,
                url: api.gtFinanceCheck,
                type: 'post',
                data: {
                    data : {
                        orderGtIds : [orderGtId]
                    }
                },
                hasLoading: true,
                success (res) {
                    layer.msg('操作成功', {
                        time: 1000
                    },function(){
                        VM.searchGtFinanceCheckList();
                    });
                }   
            });
        },
        rejectGt (orderGtId) {
            http({
                instance: VM,
                url: api.gtFinanceReject,
                type: 'post',
                data: {
                    data : {
                        orderGtIds : [orderGtId]
                    }
                },
                hasLoading: true,
                success (res) {
                    layer.msg('操作成功', {
                        time: 1000
                    },function(){
                        VM.searchGtFinanceCheckList();
                    });
                }   
            });
        }
    }
}
</script>

<style scoped>
.form-group {
	/*margin-right: 20px;*/
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
.btn i.fa {
	margin-right: .5em;
}
#btn-search {
	position: relative;
    top: 5px;
}
.btn-apply {
    cursor: pointer;
    margin-right: 5px;
    color: #337ab7;
}
.btn-reject {
    cursor: pointer;
    color: #d9534f;
}
#btn-batch-apply {
    margin-top: 10px;
    margin-left: 10px;
    margin-bottom: 10px;
}
</style>