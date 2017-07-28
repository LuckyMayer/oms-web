<template>
    <div class="content-wrapper">
		<div class="popup-wrap" id="pw-reserve-list">
			<div class="popup-content">
				<p class="popup-title">
					查看占用
				</p>
				<div class="popup-main clearfix">
					<table class="table">
						<thead>
							<th style="width:20%;">订单类型</th>
							<th style="width:20%;">订单号</th>
							<th style="width:20%;">订单状态</th>
							<th style="width:20%;">订单时间</th>
							<th style="width:20%;">商品数量</th>
						</thead>
						<tbody>
							<tr v-for="r in reserveList">
								<td>{{orderVTypeRelation[r.orderType]}}</td>
								<td>{{r.orderSn}}</td>
								<td>{{orderVStatusRelation[r.orderStatus]}}</td>
								<td>{{r.createTime}}</td>
								<td>{{r.number}}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="popup-footer">
					<button class="btn btn-sm btn-default" @click="closePopup($event)"><i class="fa fa-reply"></i>取消</button>
				</div>
			</div>
		</div>
       	<div class="content-header">
       		<ol class="breadcrumb">
                <li><a><i class="fa fa-desktop"></i>采购</a></li>
                <li class="active">调整单列表</li>
                <li class="breadbtn">
                    <button class="btn btn-sm btn-primary" id="btn-add" @click="addAdjustmentSheet">
                        <i class="fa fa-plus"></i>新建
                    </button>
                </li>
            </ol>
       	</div>
       	<div class="content">
       		<div class="box" style="min-width:960px;padding-top:20px;">
                <div class="box-body">
	                <div class="sale-orders-search-form row form-inline">
		       			<div class="col-md-12">
		       				<div class="form-group">
		       					<label for="">调整单号</label>
		       					<input type="text" class="form-control input-sm" placeholder="可输入多个，英文逗号隔开" v-model="searchFormData.data.orderSn">
		       				</div>
		       				<div class="form-group">
		       					<label for="">调整前</label>
		       					<select name="" id="" class="form-control input-sm" v-model="searchFormData.data.beforeType">
		       						<option value="">-- 全部 --</option>
		       						<option value="INV_STTS_AVAILABLE">全新</option>
		       						<option value="INV_STTS_USED">二手</option>
		       					</select>
		       				</div>
		       				<div class="form-group">
		       					<label for="">调整后</label>
		       					<select name="" id="" class="form-control input-sm" v-model="searchFormData.data.afterType">
		       						<option value="">-- 全部 --</option>
		       						<!-- 
		       						<option value="INV_STTS_AVAILABLE">全新</option>
		       						<option value="INV_STTS_USED">二手</option>
		       						 -->
		       						<option value="VARIANCE_ADD">盘盈</option>
		       						<option value="VARIANCE_MINUS">盘亏</option>
		       					</select>
		       				</div>
		       				<div class="form-group">
		       					<label for="">订单状态</label>
		       					<select name="" id="" class="form-control input-sm" v-model="searchFormData.data.orderVStatus">
		       						<option value="">-- 全部 --</option>
		       						<option value="WAIT_CHECK">待审核</option>
		       						<option value="CHECK_PASS">已审核未推送</option>
		       						<option value="PART_RESERVED">部分预定</option>
		       						<option value="FAIL_RESERVED">预定失败</option>
		       						<option value="OMS_ADJUST">OMS已调整</option>
		       						<option value="CANCEL">已作废</option>
		       						<option value="PUSHED">已推送</option>
		       						<option value="WMS_ADJUST">WMS已调整</option>
		       					</select>
		       				</div>
                            <div class="form-group">
                                <label for="">仓库</label>
                                <search-warehouse id="searchWarehouse" placeholder="仓库模糊搜索" @selected="selectedSearchWarehouse"></search-warehouse>
                                <input type="hidden" id="hidden-search-warehouseId" v-model="searchFormData.data.warehouseId">
                            </div>
		       			</div>
		       			<div class="col-md-12">
		       				<div class="form-group">
		       					<label for="">商家编码</label>
		       					<input type="text" class="form-control input-sm" v-model="searchFormData.data.skuCode">
		       				</div>
		       				<div class="form-group">
		       					<label for="">商品条码</label>
		       					<input type="text" class="form-control input-sm" v-model="searchFormData.data.barCode">
		       				</div>
		       				<div class="form-group">
		       					<label for="">商品名称</label>
		       					<search-sku id="searchSku" placeholder="商品名称搜索" @selected="selectedSearchSku"></search-sku>
		                        <input type="hidden" id="hidden-search-skuid" v-model="searchFormData.data.skuId">
		       				</div>
                            <div class="form-group">
                                <label for="">发起人</label>
                                <search-user-name id="searchUserName" placeholder="发起人模糊搜索" @selected="selectedUserName"></search-user-name>
                                <input type="hidden" id="hidden-search-userId" v-model="searchFormData.data.userId">
                            </div>
                            <div class="form-group">
                                <label for="">备注</label>
                                <input type="text" class="form-control input-sm" v-model="searchFormData.data.note">
                            </div>
		       			</div>
                        <div class="col-md-12">
                            <div class="form-group">
                                <label for="">订单时间</label>
                                <date-range-picker id="order-time" opens="left" :needhms="false" @get_date="get_create_time" :start-time="searchFormData.data.createStartTime" :end-time="searchFormData.data.createEndTime"></date-range-picker>
                            </div>
                            <div class="form-group">
                                <div class="form-group">
                                    <button class="btn btn-sm btn-primary" id="btn-search" @click="searchVList">
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
                    <button class="primaryBtn" id="btn-batch-apply" @click="applyV">
                        批量审核
                    </button>
                    <span>盈亏总计：<span id="total-money"></span></span>
                    <table class="table" style="min-width:960px;">
                        <thead>
                            <th style="text-align:center;width:50px;"></th>
                            <th style="width:150px;">调整单号</th>
                            <th style="width:150px;">订单时间</th>
                            <th style="width:100px;">发起人</th>
                            <th style="width:150px;">仓库</th>
                            <th style="width:150px;">商品名称</th>
                            <th style="width:150px;">商家编码</th>
                            <th style="width:200px;">商品条码</th>
                            <th style="width:150px;">调整类型</th>
                            <th style="width:100px;">数量</th>
                            <th style="width:200px;" colspan="2">单品状态折现</th>
                            <th style="width:150px;">赢亏小计</th>
                            <th style="width:100px;">状态</th>
                            <th style="width:150px;">备注</th>
                            <th style="width:150px;">操作</th>
                        </thead>
                        <tbody>
                            <tr v-for="v in VList">
                            	<td style="text-align:center;">
                                    <template v-if="couldCheck(v)">
                                        <input type="checkbox" :value="v.orderId" v-model="selectedOrderList">
                                    </template>
                                </td>
                            	<td>{{v.orderSn}}</td>
                            	<td>{{v.createTime}}</td>
                            	<td>{{v.userName}}</td>
                            	<td>{{v.warehouseName}}</td>
                            	<td>{{v.skuName}}</td>
                            	<td>{{v.skuCode}}</td>
                            	<td>{{v.barCode}}</td>
                            	<td>{{beforeTypeRelation[v.beforeType]}}转{{afterTypeRelation[v.afterType]}}</td>
                            	<td>{{v.number}}</td>
                            	<td style="width:100px;"><template v-if="v.goodsValue">{{v.goodsValue}}</template></td>
                            	<td style="width:100px;"><template v-if="v.afterValue">{{v.afterValue}}</template></td>
                            	<td>{{v.totalValue}}</td>
                            	<td>{{getStatus(v.orderVstatus)}}</td>
                            	<td><input type="text" class="form-control input-sm" readonly="true" style="width:150px !important;" v-model="v.note"></td>
                            	<td>
                            		<template v-if="v.souece == 'OMS'">
                                        <template v-if="v.orderProcess.reserverStatus=='PART_RESERVED'">
                                            <span class="btn-reserve-list" @click="getReserveList($event,v)">查看占用</span></br>
                                        </template>
                                        <template v-if="v.orderVstatus=='WAIT_CHECK'">
                                            <span class="btn-delete" @click="deleteV($event,v)">作废</span></br>
                                            <span class="btn-edit" @click="editNote($event)">编辑</span>
                                            <span class="btn-ok-edit" @click="editNoteOk($event,v)">确认</span>
                                            <span class="btn-cancel-edit" @click="editNoteCancel($event,v)">取消</span>
                                            </br>
                                        </template>
                            		</template>
                                    <template v-if="v.souece !== 'OMS'">
                                        <template v-if="v.orderVstatus=='FAIL_RESERVED' || v.orderVstatus=='PART_RESERVED'">
                                            <span class="btn-reserve-list" @click="getReserveList($event,v)">查看占用</span></br>
                                            <span class="btn-reverse" @click="reserveV($event,v)">重新预定</span>
                                        </template>
                                        <template v-if="v.orderVstatus=='WAIT_CHECK' || v.orderVstatus=='FAIL_RESERVED' || v.orderVstatus=='PART_RESERVED'">
                                            <span class="btn-edit" @click="editNote($event)">编辑</span>
                                            <span class="btn-ok-edit" @click="editNoteOk($event,v)">确认</span>
                                            <span class="btn-cancel-edit" @click="editNoteCancel($event,v)">取消</span>
                                            </br>
                                        </template>
                                    </template>
                            	</td>
                            </tr>
                        </tbody>
                    </table>
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
import searchWarehouse from '../../component/searchWarehouse'
import searchUserName from '../../component/searchUserName'
import dateRangePicker from '../../component/dateRangePicker'

var VM = {};

export default {
    mounted () {
    	VM = this;
    	initStyle();
    },
    data () {
    	return {
    		searchFormData : {
                data : {
                	orderSn : '',
                	beforeType : '',
                	afterType : '',
                	orderVStatus : '',
                	userId : '',
                    warehouseId : '',
                    createStartTime : '',
                    createEndTime : '',
                    skuCode : '',
                    barCode : '',
                    skuId : '',
                    note : ''
                }
    		},
    		VList : [],
    		selectedOrderList : [],
    		beforeTypeRelation : {
    			INV_STTS_AVAILABLE : '全新',
    			INV_STTS_USED : '二手'
    		},
    		afterTypeRelation : {
    			INV_STTS_AVAILABLE : '全新',
    			INV_STTS_USED : '二手',
    			VARIANCE_ADD : '盘盈',
    			VARIANCE_MINUS : '盘亏'
    		},
    		orderVStatusRelation : {
    			WAIT_CHECK : '待审核',
    			CHECK_PASS : '审核通过 待推送',
    			PART_RESERVED : '部分预定',
    			FAIL_RESERVED : '预定失败',
    			OMS_ADJUST : 'OMS已调整',
    			CANCEL : '已作废',
    			PUSHED : '已推送',
    			WMS_ADJUST : 'WMS已调整'
    		},
    		orderVTypeRelation : {
    			SALE : '销售',
    			REFUND : '退货',
    			EXCHANGE : '换货',
    			SUPPLY : '补寄',
    			TRANSFER_OUT : '调拨出库',
    			TRANSFER_IN : '调拨入库',
    			VARIANCE_ADD : '盘盈',
    			VARIANCE_MINUS : '盘亏',
    			PURCHASE : '采购',
    			SUPPLIER_RETURN : '供应商退货',
    			FROZEN : '冻结',
    			ADJUST : '供价调整',
    			VARIANCE_TRANSFORM : '盘点单',
    		},
    		reserveList : []
    	}
    },
    components : {
        searchSku,
        searchWarehouse,
    	dateRangePicker,
        searchUserName
    },
    methods : {
    	couldCheck(order) {
			if('VARIANCE_MINUS' == order.afterType) {
				return 'WAIT_CHECK' == order.orderVStatus && order.orderProcess.reserverStatus == 'ALL_RESERVED';
			} else {
				return 'WAIT_CHECK' == order.orderVStatus;
			}
    	},
    	getStatus(order) {
    		if('WAIT_CHECK' == order.orderVStatus && 'VARIANCE_MINUS' == order.afterType) {
    			if(order.orderProcess.reserverStatus == 'PART_RESERVED') {
    				return "部分预定";
    			} else if(order.orderProcess.reserverStatus = 'ALL_RESERVED') {
    				return "全部预定，待审核"
    			} else {
    				return "待预定"
    			}
    		}
    		return this.orderVStatusRelation[order.orderVStatus];
    	},
    	closePopup (e) {
            $(e.target).parents('.popup-wrap').fadeOut(200);
        },
    	searchVList () {
    		let data = deepClone(VM.searchFormData);
    		if (data.data.orderSn) {
    			data.data.orderSn = data.data.orderSn.split(',');
    		} else {
    			data.data.orderSn = [];
    		}
    		http({
                instance: VM,
                url: api.getVList,
                type: 'post',
                data: data,
                hasLoading: true,
                success (res) {
                    if (res.data.length) {
                       VM.VList = res.data;
                       let totalMoney = 0;
                       for (let i in VM.VList) {
                            totalMoney +=  Number(VM.VList[i].totalValue);
                       }
                       $('#total-money').text(totalMoney);  
                    } else {
                        VM.VList = [];
                    }
                }   
            });
    	},
        selectedSearchWarehouse (data) {
            if (data.warehouseId) {
                VM.$set(VM.searchFormData.data,'warehouseId', data.warehouseId);
            } else {
                VM.$set(VM.searchFormData.data,'warehouseId', "");
            }
        },
        selectedUserName (data) {
            if (data.account) {
                VM.$set(VM.searchFormData.data,'userId', data.account);
            } else {
                VM.$set(VM.searchFormData.data,'userId', "");
            }
        },
        get_create_time (date) {
            VM.searchFormData.data.createStartTime = date.start_time;
            VM.searchFormData.data.createEndTime = date.end_time;
        },
        selectedSearchSku (data) {
            if (data.skuId) {
                VM.$set(VM.searchFormData.data,'skuId', data.skuId);
            } else {
                VM.$set(VM.searchFormData.data,'skuId', "");
            }
        },
        checkFuzzySearch () {
        	if (VM.searchFormData.data.warehouseId == '') {
                $('#searchWarehouse').val('');
            }
            if (VM.searchFormData.data.skuId == '') {
                $('#searchSku').val('');
            }
        },
        checkAll (e) {
            let checkAll = $(e.target).eq(0).prop('checked');
            if (checkAll) {
                VM.selectedOrderList = [];
                for (let order in VM.VList) {
                    if (VM.VList[order].orderVstatus == 'WAIT_CHECK') {
                        VM.selectedOrderList.push(VM.VList[order].orderId);
                    }
                }
            } else {
                VM.selectedOrderList = [];
            }
        },
        addAdjustmentSheet () {
        	VM.$router.push({name: 'addAdjustmentSheet'});
        },
        editNote (e) {
        	$(e.target).hide().next().show().next().show();
        	$(e.target).parent().prev().find('input').prop('readonly',false);
        },
        editNoteCancel (e,v) {
        	$(e.target).hide().prev().hide().prev().show();
        	$(e.target).parent().prev().find('input').prop('readonly',true);
        },
        editNoteOk (e,v) {
        	http({
                instance: VM,
                url: api.editNote,
                type: 'post',
                data: {
                	data : {
                		orderId : v.orderId,
                		note : v.note
                	}
                },
                hasLoading: true,
                success (res) {
	                layer.msg('修改成功', {
                        time: 1000
                    }, function(){
                    	VM.searchVList();
                    });
                }   
            });
        	$(e.target).hide().prev().show();
        	$(e.target).next().hide();
        	$(e.target).parent().prev().find('input').prop('readonly',true);
        },
        deleteV (e,v) {
        	http({
                instance: VM,
                url: api.deleteV,
                type: 'post',
                data: {
                	data : {
                		orderId : v.orderId
                	}
                },
                hasLoading: true,
                success (res) {
	                layer.msg('作废成功', {
                        time: 1000
                    }, function(){
                    	VM.searchVList();
                    });
                }   
            });
        },
        reserveV (e,v) {
        	http({
                instance: VM,
                url: api.reserveV,
                type: 'post',
                data: {
                	data : {
                		orderId : v.orderId
                	}
                },
                hasLoading: true,
                success (res) {
	                layer.msg('重新预定成功', {
                        time: 1000
                    }, function(){
                    	VM.searchVList();
                    });
                }   
            });
        },
        getReserveList (e,v) {
        	http({
                instance: VM,
                url: api.reserveList,
                type: 'post',
                data: {
                	data : {
                		skuId : v.skuId,
                		warehouseId : v.warehouseId,
                		beforeType : v.beforeType
                	}
                },
                hasLoading: true,
                success (res) {
	                VM.reserveList = res.data;
	                if (VM.reserveList.length) {
	                	$('#pw-reserve-list').fadeIn(200);
	                } else {
	                	layer.msg('没有数据', {
		            		time: 1000
		                });
	                }
                }   
            });
        },
        applyV () {
        	if (VM.selectedOrderList.length) {
        		http({
	                instance: VM,
	                url: api.applyV,
	                type: 'post',
	                data: {
	                	data : {
	                		orderId : VM.selectedOrderList
	                	}
	                },
	                hasLoading: true,
	                success (res) {
		                layer.msg('批量审核成功', {
	                        time: 1000
	                    }, function(){
	                    	VM.searchVList();
	                    	VM.selectedOrderList = [];
	                    });
	                }   
	            });
        	} else {
        		layer.msg('请至少选择一条记录', {
            		time: 1000
                });
        	}
        },
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
	width: 160px !important;
}
.btn i.fa {
	margin-right: .5em;
}
#btn-search {
	position: relative;
    top: 5px;
}
.btn-edit, .btn-ok-edit, .btn-cancel-edit, .btn-delete,
.btn-reverse,.btn-reserve-list {
    cursor: pointer;
    margin-right: 5px;
}
.btn-edit {
    color: #337ab7;
}
.btn-ok-edit {
	display: none;
    color: #4cae4c;
}
.btn-cancel-edit {
	display: none;
    color: #d9534f;
}
.btn-delete {
    color: #d9534f;
}
.btn-reverse,.btn-reserve-list {
	color: #4cae4c;
}
#btn-batch-apply {
    margin-top: 10px;
    margin-left: 10px;
    margin-bottom: 10px;
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
    width: 600px;
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
    padding: 10px 10px 0 10px;
}
.popup-footer {
    width: 100%;
    text-align: right;
    padding: 10px;
    border-top: 1px solid #d2d6de;
}
li.breadbtn {
    float:right;
    margin-right:15px;
}
li.breadbtn:before {
    display: none;
}
</style>