<template>
    <div class="content-wrapper">
		<section class="content-header clearfix">
			<ol class="breadcrumb col-md-6">
                <li><i class="fa fa-desktop"></i> 销售</li>
                <li class="active">退换货列表</li>
            </ol>
            <div class="col-md-6" style="text-align: right; position: relative; top: 10px;">
		        <a href="#/ordersManage/afterSaleManage/afterSaleOrderDetail/create/new" target="_blank">
                    <button class="btn btn-sm btn-primary">
    		        	<i class="fa fa-plus"></i> 新建退换
    		        </button>
                </a>
		    </div>  
        </section>
        <section class="content">
        	<div class="search-div col-md-12 form-horizontal">
        		<div class="form-group">
        			<label class="col-md-1 control-label">原始订单号</label>
        			<div class="col-md-2">
        				<input type="text" class="form-control input-sm" v-model.trim="searchData.platformOrderId">
        			</div>
        			<label class="col-md-1 control-label">退换单类型</label>
        			<div class="col-md-2">
        				<component is="select-after-sale-type" @selected="selectedAfterSaleType"></component>
        			</div>
        			<label class="col-md-1 control-label">退换单状态</label>
        			<div class="col-md-2">
        				<component is="select-after-sale-status" @selected="selectedAfterSaleStatus" :default-status="searchData.orderStatus"></component>
        			</div>
        			<label class="col-md-1 control-label">用户ID</label>
        			<div class="col-md-2">
        				<input type="text" class="form-control input-sm" v-model.trim="searchData.buyer">
					</div>		
        		</div>
        		<div class="form-group" v-show="openSearchDiv">
        			<label class="col-md-1 control-label">订单号</label>
        			<div class="col-md-2">
        				<input type="text" class="form-control input-sm" v-model.trim="searchData.omsOrderSn">
        			</div>
        			<label class="col-md-1 control-label">退换单号</label>
        			<div class="col-md-2">
        				<input type="text" class="form-control input-sm" v-model.trim="searchData.orderSn">
        			</div>
        			<label class="col-md-1 control-label">店铺</label>
        			<div class="col-md-2">
        				<component id="searchShop" is="select-shop" v-model="searchData.shopId" @selected="selectedShop" ></component>
        			</div>
        			<label class="col-md-1 control-label">退回仓库</label>
        			<div class="col-md-2">
        				<component id="returnWarehouseSearch" is="search-warehouse" placeholder="模糊搜索" @selected="selectedWarehouse"></component>
        			</div>		
        		</div>
        		<div class="form-group" v-show="openSearchDiv">
        			<label class="col-md-1 control-label">退换原因</label>
        			<div class="col-md-2">
        				<component is="select-after-sale-reason" @selected="selectedAfterSaleReason"></component>
        			</div>
        			<label class="col-md-1 control-label">退回商品</label>
        			<div class="col-md-2">
        				<component is="search-goods-name-for-order" @selected="selectedSkuName"></component>
        			</div>
        			<label class="col-md-1 control-label">建单人</label>
        			<div class="col-md-2">
        				<input type="text" class="form-control input-sm" v-model.trim="searchData.creator">
        			</div>
        			<label class="col-md-1 control-label">申请时间</label>
        			<div class="col-md-2">
        				<component is="date-range-picker" id="apply-time" :needhms="true" @get_date="selectedApplyTime" :start-time="searchData.startTime" :end-time="searchData.endTime"></component>
        			</div>		
        		</div>
        		<div class="form-group">
        			<div class="col-md-12" style="text-align:right">
        				<a href="#" v-if="!openSearchDiv" @click.prevent="openSearchDivFun"><i class="iconfont">&#xe616;</i>展开</a>
        				<a href="#" v-else @click.prevent="closeSearchDivFun"><i class="iconfont">&#xe617;</i>收起</a>
        				&nbsp;&nbsp;
        				<button class="btn btn-sm btn-primary" @click="getAfterSaleOrderLists"><i class="fa fa-search"></i>&nbsp;查询</button>	
        			</div>
        		</div>
        		
        	</div>
        	<div class="clear"></div>
        	<div class="result-list">
        		<div class="buttons">
        			<input type="checkbox" v-model="selectAll" style="position:relative;top:2px;margin:0 5px 0 15px;">
        			<button class="primaryBtn" @click="batchCheckOrder">审核通过</button>
        			<button class="primaryBtn" @click="batchRejectOrder">审核否决</button>
        		</div>
        		<div>
        			<table class="table">
	        			<thead>
	        				<tr>
	        					<th width="4%">选择</th>
	        					<th width="10%">退换单号<br/>退换申请时间</th>
	        					<th width="8%">店铺</th>
	        					<th width="12%">订单号<br/>原始单号</th>
	        					<th width="6%">类型</th>
	        					<th width="6%">状态</th>
	        					<th width="6%">退换原因</th>
	        					<th width="6%">客户ID<br/>/姓名</th>
	        					<th width="10%">退款金额<br/>退款方式</th>
	        					<th width="12%">退回仓库</th>
	        					<th width="12%">换货单</th>
	        					<th width="8%">操作</th>
	        				</tr>
	        			</thead>
	        			<tbody>
	        				<tr v-for="item in afterSaleOrders">
	        					<td style="text-align:center;"><input type="checkbox" :value="item.id" name="afterSaleOrderId" v-model="item.choosen"></td>
	        					<td>
                                    <a :href="'#/ordersManage/afterSaleManage/afterSaleOrderDetail/view/'+item.id" target="_blank">{{item.orderSn}}</a>
	        						<br/>{{item.createTime}}
	        					</td>
	        					<td><template v-if="item.shop">{{item.shop.shopName}}</template></td>
	        					<td style="word-wrap:break-word;word-break:break-all;">
                                    <template v-if="item.omsOrder">
                                    <a :href="'#/ordersManage/omsOrderDetail/orderDetails/'+item.omsOrder.orderId" target="_blank">{{item.omsOrder.orderSn}}</a><template v-if="item.platformOrderIds"><br/>{{item.platformOrderIds.join(',')}}</template>
                                    </template></td>
	        					<td>{{item.orderType | orderTypeFilter}}</td>
	        					<td>{{item.orderStatusValue}}<br/><template v-if="item.orderType=='RETURN' || item.orderType=='EXCHANGE'">{{item.shippingStatusValue}}<br/></template>{{item.settlementStatusValue}}</td>
	        					<td>{{item.reasonValue}}</td>
	        					<td>{{item.buyer}}<br/>{{item.buyerName}}</td>
	        					<td>{{item.refundAmount}}<br/>{{item.refundTypeValue}}</td>
	        					<td>
	        						<template v-if="(item.orderType == 'RETURN' || item.orderType == 'EXCHANGE') && item.returnOrder && item.returnOrder.warehouse">{{item.returnOrder.warehouse.warehouseName}}</template>
	        					</td>
	        					<td style="word-wrap:break-word;word-break:break-all;">
	        						<a v-if="item.orderType == 'EXCHANGE' && item.exchangeOrder" :href="'#/ordersManage/omsOrderDetail/orderDetails/'+item.exchangeOrder.orderId" target="_blank">{{item.exchangeOrder.orderSn}}</a>
	        					</td>
	        					<td>
	        						<a v-if="showEditButton(item.orderStatus, item.shippingStatus, item.settlementStatus)" :href="'#/ordersManage/afterSaleManage/afterSaleOrderDetail/edit/'+item.id" target="_blank" style="display:inline-block;">编辑</a>
                                    <a v-if="item.orderStatus!='FINISHED' && item.orderStatus!='CLOSED' && item.settlementStatus != 'SETTLED'" href="#" @click.prevent="cancelOrder(item.id)"><span class="red" style="display:inline-block;">作废</span></a>
	        						<a v-if="item.orderStatus=='WAIT_CHECK'" href="#" @click.prevent="checkOrder(item.id)" style="display:inline-block;">审核通过</a>
	        						<a v-if="item.orderStatus=='WAIT_CHECK'" href="#" @click.prevent="rejectOrder(item.id)" style="display:inline-block;">审核否决</a>
	        						<a v-if="item.orderStatus=='CHECK_PASS' && item.settlementStatus == 'WAIT_SETTLE'" href="#" @click.prevent="settleAfterSaleOrder(item.id)" style="display:inline-block;">结算</a>

	        					</td>
	        				</tr>
	        			</tbody>
	        		</table>
        		</div>
        		<div class="box-footer clearfix">
                    <div class="col-md-2 no-padding"></div>
                    <component is='pagination' :offset="searchData.offset" :length="searchData.length" :total-count="pageData.totalCount" @paginate="paginate"></component>
                </div>
        	</div>
        </section>
        <!-- <component is="after-sale-order-modal" v-if="afterSaleOrderModal.show" @success="successToDoAfterSaleOrder" @cancel="cancelToDoAfterSaleOrder" :id="afterSaleOrderModal.params.id" :cancel-after-sale-order="cancelAfterSaleOrder" :check-after-sale-order="checkAfterSaleOrder" :reject-after-sale-order="rejectAfterSaleOrder"></component> -->	
        <component is="refund-modal" v-if="refundModal.show" :id="refundModal.params.id" @cancel="cancelRefund" @success="successRefund"></component>

        <div v-if="actionData.actionModalShow" class="action-modal">
        	<div class="action-content">
        		<div class="col-md-12 form-horizontal">
					<div class="form-group">
						<label class="col-md-2 control-label">备注</label>
						<div class="col-md-10">
							<textarea class ="form-control" cols="10" rows="3" v-model="actionData.data.memo"></textarea>
						</div>
					</div>
					<div class="form-group">
						<div class="col-md-3"></div>
						<div class="col-md-3" style="text-align:center;">
							<button class="btn btn-xs btn-info" @click="cancelAction">取消</button>
						</div>
						<div class="col-md-3" style="text-align:center;">
							<button v-if="actionData.actionMethod=='checkAfterSaleOrder'" class="btn btn-xs btn-primary" @click="checkAfterSaleOrder(actionData.data)">{{actionData.actionName}}</button>
							<button v-if="actionData.actionMethod=='cancelAfterSaleOrder'" class="btn btn-xs btn-primary" @click="cancelAfterSaleOrder(actionData.data)">{{actionData.actionName}}</button>
							<button v-if="actionData.actionMethod=='rejectAfterSaleOrder'" class="btn btn-xs btn-primary" @click="rejectAfterSaleOrder(actionData.data)">{{actionData.actionName}}</button>
						</div>
					</div>
					
				</div>
        	</div>
        </div>
    </div>
</template>

<script>
import http from '../../../common/http'
import api from '../../../common/api'
import {getDateStr} from '../../../common/getDateStr'
import initStyle from '../../../common/initStyle'
import datePicker from '../../../component/datePicker'
import selectShop from '../../../component/selectShop'
import selectAfterSaleType from '../../../component/selectAfterSaleType'
import selectAfterSaleReason from '../../../component/selectAfterSaleReason'
import selectAfterSaleStatus from '../../../component/selectAfterSaleStatus'
// import afterSaleOrderModal from './afterSaleOrderModal'
import refundModal from './refundModal'
import searchWarehouse from '../../../component/searchWarehouse'
import searchGoodsNameForOrder from '../../../component/searchGoodsNameForOrder'
import dateRangePicker from '../../../component/dateRangePicker'
import pagination from '../../../component/pagination'


export default {
    data () {
    	return {
    		selectAll: false,
    		openSearchDiv: false,
    		pageData: {
                totalCount: ''
            },
    		searchData: {
    			platformOrderId: "",
    			orderType: "",
    			orderStatus: "",
    			buyer: "",
    			omsOrderSn: "",
                orderSn: "",
    			//orderAfterSaleId: "",
    			shopId: "",
    			warehouseId: "",
    			reasonType: "",
    			skuName: "",
    			creator: "",
    			startTime: "",
    			endTime: "",
    			offset: 0,
    			length: 50
    		},
    		afterSaleOrders: [],
    		// afterSaleOrderModal: {
    		// 	show: false,
    		// 	params: {
    		// 		id: '',
    		// 	}
    		// },
    		refundModal: {
    			show: false,
    			params: {
    				id: ''
    			}
    		},
    		actionData: {
    			data: {
    				id: '',
    				memo: '',
    			},
    			actionName: '',
    			actionMethod: '',
    			actionModalShow: false,
    		}
    	}
    },
    mounted () {
	    this.$nextTick(() => {
	      	initStyle();
            this.searchData.orderStatus = 'NOT_FINISHED';
            this.getAfterSaleOrderList();
	      	
	    });
	},
    components: {datePicker,selectShop,refundModal,selectAfterSaleType,selectAfterSaleReason,searchWarehouse,selectAfterSaleStatus,searchGoodsNameForOrder,pagination,dateRangePicker},
    filters: {
    	orderTypeFilter: function(val){
    		const orderTypeMapping = {
    			'RETURN': '退货',
    			'REFUND': '退款不退货', 
    			'EXCHANGE': '换货',
                'REFUND_ONLY': '仅退款',
                'REFUND_ORDER_CANCEL': '废单退款'
    		};
    		return orderTypeMapping[val];
    	}
    },
    watch: {
    	selectAll: function(val){
    		this.afterSaleOrders.forEach(function(item,index){
    			item.choosen = val;
    		});
    	}
    },
    methods: {
    	showEditButton(val1,val2,val3){//val1 订单状态 val2推送状态 val3结算状态
            if(val1 != 'FINISHED' && val1 != 'CLOSED' && (val1 == 'WAIT_CHECK' || val1 == 'INVALID' || val1 == 'CHECK_PASS' || val1 == 'CHECK_REJECT' || val2 == 'PUSH' || val2 == 'OPERATED' || val3 == 'REJECT')) {
                return true;
            }else {
                return false;
            }

    	},
    	paginate(data) {
    		this.searchData.offset = data.offset;
    		this.searchData.length = data.length;
    		this.getAfterSaleOrderList();
    	},
        getAfterSaleOrderLists() {
            var isEmpty = true;
            for(var i in this.searchData) {
                if (this.searchData.hasOwnProperty(i) && i != 'offset' && i != 'length') { 
                    if(this.searchData[i] != '' ) {
                        isEmpty = false;
                        break;
                    }
                };
            }
            if(isEmpty) {
                this.searchData.startTime = getDateStr(-30);
                this.searchData.endTime = getDateStr(0,true);
                this.openSearchDiv = true;
            } 
            this.searchData.offset = 0;
            this.getAfterSaleOrderList();
        },
    	getAfterSaleOrderList() {          
    		const _self = this;
	    	http({
	    		instance: _self,
	    		url: api.getAfterSaleOrderList,
	            type: 'post',
	            data: {data: _self.searchData},
	            hasLoading: true,
	            success (res) {
	            	if(res.data.totalCount > 0){
	            		_self.afterSaleOrders = res.data.content;
	            		_self.pageData.totalCount = res.data.totalCount;
	            	}else{
	            		_self.afterSaleOrders = [];
	            		_self.pageData.totalCount = res.data.totalCount;
	            	}
	            }
	        });
    	},
    	selectedAfterSaleType(data) {
    		this.searchData.orderType = data.data;
    	},
    	selectedAfterSaleStatus(data){
    		this.searchData.orderStatus = data.data;
    	},
    	selectedShop(data) {
            if($.isEmptyObject(data)) {
                this.searchData.shopId = '';
            }else {
                this.searchData.shopId = data.data.shopId;
            }
    	},
    	selectedAfterSaleReason(data) {
    		this.searchData.reasonType = data.reasonType;
    	},
    	selectedSkuName(data) {
    		this.searchData.skuName = data.addGoodsName;
    	},
    	selectedApplyTime (date) {
            this.searchData.startTime = date.start_time;
            this.searchData.endTime = date.end_time;
        },
        selectedWarehouse(data) {
            if(!$.isEmptyObject(data) && data) {
                this.searchData.warehouseId = data.warehouseId;
            }else {
                this.searchData.warehouseId = '';
            }
            
        },
        // createAfterSaleOrder() {
        // 	this.$router.push({name: 'afterSaleOrderDetail'});
        // },
    	// showAfterSaleOrderModal() {
    	// 	this.afterSaleOrderModal.show = true;
    	// 	this.afterSaleOrderModal.params.id = '';
    	// },
    	// cancelToDoAfterSaleOrder(data) {
    	// 	this.afterSaleOrderModal.show = data;
    	// },
    	// successToDoAfterSaleOrder() {
    	// 	this.afterSaleOrderModal.show = false;
    	// 	this.getAfterSaleOrderList();
    	// },
    	openSearchDivFun() {
    		this.openSearchDiv = true;
    		// this.searchData.startTime = getDateStr(-30);
      //   	this.searchData.endTime = getDateStr(0);
    	},
    	closeSearchDivFun() {
    		this.openSearchDiv = false;
    		this.searchData.startTime = '';
        	this.searchData.endTime = '';
    	},
    	cancelRefund(data) {
    		this.refundModal.show = false;
            this.getAfterSaleOrderList();
    		
    	},
    	successRefund() {
    		this.refundModal.show = false;
    		this.getAfterSaleOrderList();
    	},
    	//
    	checkOrder(data) {
    		this.actionData = {
    			data: {
    				id: data,
    				memo: '',
    			},
    			actionName: '审核通过',
    			actionMethod: 'checkAfterSaleOrder',
    			actionModalShow: true,
    		};
    	},
    	rejectOrder(data) {
    		this.actionData = {
    			data: {
    				id: data,
    				memo: '',
    			},
    			actionName: '审核否决',
    			actionMethod: 'rejectAfterSaleOrder',
    			actionModalShow: true,
    		};
    	},
    	cancelOrder(data) {
			this.actionData = {
    			data: {
    				id: data,
    				memo: '',
    			},
    			actionName: '作废',
    			actionMethod: 'cancelAfterSaleOrder',
    			actionModalShow: true,
    		};
    	},
    	cancelAction() {
    		this.actionData = {
    			data: {
    				id: '',
    				memo: '',
    			},
    			actionName: '',
    			actionMethod: '',
    			actionModalShow: false,
    		};
    	},
    	checkAfterSaleOrder(data) {//审核通过
    		const _self = this;
	    	http({
	    		instance: _self,
	    		url: api.checkAfterSaleOrder,
	            type: 'post',
	            data: {
	            	data: {
		            	id: data.id,
		            	memo: data.memo,
		            },
	            },
	            hasLoading: true,
	            success (res) {
	            	layer.msg(res.msg, {
	            		time: 2000
	            	});
	            	_self.getAfterSaleOrderList();
	            	_self.actionData.actionModalShow = false;
	            	// _self.afterSaleOrderModal.show = false;
	            }
	        });
    	},
    	cancelAfterSaleOrder(data) {//作废
    		const _self = this;
	    	http({
	    		instance: _self,
	    		url: api.cancelAfterSaleOrder,
	            type: 'post',
	            data: {
	            	data: {
		            	id: data.id,
		            	memo: data.memo,
		            },
	            },
	            hasLoading: true,
	            success (res) {
	            	layer.msg(res.msg, {
	            		time: 2000
	            	});

	            	_self.getAfterSaleOrderList();
	            	_self.actionData.actionModalShow = false;
	            	// _self.afterSaleOrderModal.show = false;
	            }
	        });
          
    	},
    	rejectAfterSaleOrder(data){//审核否决
    		const _self = this;
	    	http({
	    		instance: _self,
	    		url: api.rejectAfterSaleOrderCheck,
	            type: 'post',
	            data: {
	            	data: {
		            	id: data.id,
		            	memo: data.memo,
		            },
	            },
	            hasLoading: true,
	            success (res) {
	            	layer.msg(res.msg, {
	            		time: 2000
	            	});

	            	_self.getAfterSaleOrderList();
	            	_self.actionData.actionModalShow = false;
	            	// _self.afterSaleOrderModal.show = false;
	            }
	        });
    	},
    	// modifyAfterSaleOrder(data){
    	// 	this.afterSaleOrderModal.show = true;
    	// 	this.afterSaleOrderModal.params.id = data;
    	// },
    	settleAfterSaleOrder(data){
    		this.refundModal.show = true;
    		this.refundModal.params.id = data;
    	},
    	batchCheckOrder() {
    		var ids = [];
    		$('input[name="afterSaleOrderId"]:checked').each(function(item,index){
    			ids.push($(this).val());
    		});

    		if(ids.length == 0){
    			layer.msg('请先选择售后单！', {time: 1000});
    			return false;
    		}
    		const _self = this;
	    	http({
	    		instance: _self,
	    		url: api.checkAfterSaleOrder,
	            type: 'post',
	            data: {
	            	data: {
		            	id: '',
		            	ids: ids,
		            	memo: '',
		            },
	            },
	            hasLoading: true,
	            success (res) {
	            	layer.msg(res.msg, {
	            		time: 2000
	            	});
	            	_self.getAfterSaleOrderList();
	            	$('input[name="afterSaleOrderId"]:checked').each(function(item,index){
		    			$(this).attr('checked',false);
		    		});
	            }
	        });
    	},
    	batchRejectOrder(){
    		var ids = [];
    		$('input[name="afterSaleOrderId"]:checked').each(function(item,index){
    			ids.push($(this).val());
    		});
    		if(ids.length == 0){
    			layer.msg('请先选择售后单！', {time: 1000});
    			return false;
    		}
    		const _self = this;
	    	http({
	    		instance: _self,
	    		url: api.rejectAfterSaleOrderCheck,
	            type: 'post',
	            data: {
	            	data: {
		            	id: '',
		            	ids: ids,
		            	memo: '',
		            },
	            },
	            hasLoading: true,
	            success (res) {
	            	layer.msg(res.msg, {
	            		time: 2000
	            	});
	            	_self.getAfterSaleOrderList();
	            	$('input[name="afterSaleOrderId"]:checked').each(function(item,index){
		    			$(this).attr('checked',false);
		    		});
	            }
	        });
    	},


    }
}
</script>

<style scoped>
.table {
	margin-bottom: 0px;
}
.search-div {
	padding-top: 20px;
	background-color: #fff;
}
.result-list {
	background-color: #fff;
	margin-top: 10px;
	/*padding: 6px 10px;*/
}
.buttons {
	padding: 10px 10px;
}
.buttons button {
	margin-right: 10px;
}
.btn-xs {
	padding-right: 10px;
	padding-left: 10px;
}
.action-modal{
	position: fixed;
	left: 0;
	right: 0;
	top: 0;	
	background-color: #fff;
	margin: 60px auto;
	float: none;
	opacity: 1;
	padding: 20px 10px;
	overflow-y: auto;
	overflow-x: hidden;
	max-height: 90%;
	z-index: 1002;
	margin-top: 10%;
	border-radius: 3px;
	width: 400px;
	border: 1px solid #666;

}
.control-label {
	padding-right: 0px;
	padding-left: 0px;
}
label {
	overflow:hidden;
	white-space:nowrap;
}
</style>