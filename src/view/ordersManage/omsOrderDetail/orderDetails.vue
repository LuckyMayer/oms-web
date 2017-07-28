<template>
	<div class="content-wrapper">
        <section class="content">
        	<div class="content-overflow">
	        	<div class="left-div">
	        		<div class="order-header col-md-12 no-padding form-horizontal">
	        			<div class="col-md-12 order-status form-group">
	        				<div class="col-md-9" >
		        				<label class="order-sn">订单号：</label>
	        					<label class="order-sn">{{orderDetail.orderSn}}({{party.partyName}})</label>
		        				<span class="added-tag" v-if="orderDetail.orderStatus!=undefined">{{orderDetail.orderStatus | orderStatusFilter(orderDetail.shippingStatus)}}</span>
	        					<span class="status-tag" v-if="orderDetail.payStatusValue!=undefined">{{orderDetail.payStatusValue}}</span>
		        				<label class="pay-time">付款时间：{{orderDetail.paytime}}</label>
							</div>
		        			<div class="col-md-3" style="text-align:right;">	
		        				<button v-if="actionButtonsShow('closeOrder')" class="btn btn-xs btn-danger" @click="cancelOrder">作废订单</button>
		        				<button v-if="actionButtonsShow('refund')" class="btn btn-xs btn-primary" ><a href="#/ordersManage/afterSaleManage/afterSaleOrderDetail/create/new1" target="_blank" style="color:#fff;">退款申请</a></button>
		        				<button v-if="actionButtonsShow('checkOrder')" class="btn btn-xs btn-primary" @click="checkOrder">审核通过</button>
		        				<button v-if="actionButtonsShow('outboundReject')" class="btn btn-xs btn-danger" @click="rejectOrder">出库驳回</button>
		        			</div>
	        			</div>
	        			
	        			<div class="order-flow form-group">
	        				<compenont v-if="stateData.length > 0" is="process-state2" class="col-md-12" :statedata="stateData" :curstate="curState" :style-obj="styleObj"></compenont>
	        			</div>
	        			<div class="order-action col-md-12 form-group" style="padding-top:2px;">
	        				<div v-if="orderDetail.orderStatus=='WAIT_CHECK' && orderDetail.shippingStatus == 'INIT'" class="form-group" style="margin-bottom:4px;">
	        					<div v-if="orderDetail.orderProcess.subOrderType=='BOOK' || orderDetail.orderProcess.subOrderType=='NORMAL'" class="col-md-1 control-label">
			        				<a href="#" v-if="orderDetail.orderStatus=='WAIT_CHECK' && orderDetail.orderProcess.subOrderType=='BOOK'" class="btn-a" @click.prevent="changeSubOrderType('NORMAL')">转正常单</a>
									<a href="#" v-else-if="orderDetail.orderStatus=='WAIT_CHECK' && orderDetail.orderProcess.subOrderType=='NORMAL'" class="btn-a" @click.prevent="changeSubOrderType('BOOK')">转预订单</a>
			        			</div>
			        			<label class="control-label col-md-1">无法审核</label>
			        			<div class="control-label col-md-6" style="text-align:left;">
			        				<span v-for="item in checkUnableReasonList" v-if="item.show" @mouseover="showBookActiveTime(item.value)" @mouseout="hiddenBookActiveTime(item.value)" class="abnormal-tag">{{item.name}}</span>
			        			</div>
			        			<div v-if="orderDetail.orderStatus=='WAIT_CHECK' && orderDetail.shippingStatus == 'INIT' && orderDetail.orderProcess.subOrderType=='BOOK'" class="control-label col-md-4 no-padding" style="text-align:right;">
									<label class="control-label col-md-5">预订单激活时间</label>
									<div class="col-md-5">
										<component is="date-picker" id="bookActiveTime" @choose="chooseBooktime" :needhms="true" required></component>
									</div>
									<div class="col-md-2 control-label" style="text-align:left">
										<!-- <button class="btn btn-xs btn-info" @click="releaseInventory" :disabled="orderDetail.orderProcess.reserverStatus=='UNRESERVED'">释放库存</button> -->
										<a href="#" class="btn-a" @click.prevent="releaseInventory">释放库存</a>


									</div>
			        			</div>
	        				</div>

		        			<div v-if="orderDetail.orderProcess && orderDetail.orderProcess.isException && orderDetail.orderProcess.exceptionTagList.length > 0" class="form-group" style="margin-bottom:4px;">
	        					<div class="col-md-1 control-label">
			        				<a href="#" class="btn-a" @click.prevent="showClearExceptionIcon = !showClearExceptionIcon">清除异常</a>
			        			</div>
			        			<label  class="control-label col-md-1">异常标签</label>
			        			<div class="control-label col-md-9" style="text-align:left;">
			        				<div v-for="(item,index) in orderDetail.orderProcess.exceptionTagList" style="float:left">
			        					<span class="added-tag">{{item}}</span>
			        					<span v-if="showClearExceptionIcon" @click="clearException(index,item)" class="iconfont">&#xe61e;</span>
			        				</div>
			        				
			        			</div>
			        			<div v-if="orderDetail.orderStatus=='WAIT_CHECK' && orderDetail.shippingStatus == 'INIT' && !(orderDetail.orderProcess.subOrderType=='BOOK' || orderDetail.orderProcess.reserverStatus!='UNRESERVED' || this.orderDetail.orderProcess.financeCheckStatus == 'WAIT_CHECK')" class="col-md-1 control-label"  style="text-align:left">
			        				<a href="#" class="btn-a" @click.prevent="forceCheckOrder">强制审核</a>
			        			</div>
	        				</div>


	        			</div>
	        		</div>
				    <div class="tabs-list-wrapper">
				        <ul class="tabs-list">
				        	<li v-for="tab in tabList" :class="{'active': tab.active}" @click="clickTab(tab)">{{tab.name}}</li>
				        </ul>
				    </div>
				    <div class="tabs-content-wrapper">
				   		<component v-if="orderId&&orderDetail.orderGoodses"  @reflesh-order="getOrderDetail" @reflesh-actions="getOrderActionList" :is="currentView" keep-alive :order-id="orderId" :order-detail="orderDetail"></component>
				    </div>
	        	</div>
	        	<div class="right-div">
	        		<table class="table">
	        			<thead>
		        			<tr>
		        				<th width="20%">操作人</th>
		        				<th width="50%">操作记录</th>
		        				<th width="30%">时间</th>
		        			</tr>
	        			</thead>
	        			<tbody>
	        				<tr v-for="item in orderActions">
	        					<td v-if="item.creator">{{item.creator.name}}</td>
	        					<td v-else></td>
	        					<td v-if="item.type=='COMMENT'" v-html="item.content+'【添加备注】'" style="word-wrap:break-word;word-break:break-all;"></td>
	        					<td v-else v-html="item.content"  style="word-wrap:break-word;word-break:break-all;"></td>
	        					<td>{{item.createTime}}</td>
	        				</tr>
	        			</tbody>
	        		</table>
	        	</div>
	        </div>


			<div v-if="bookActiveTime.show" class="book-active-time" :style="bookActiveTime.style">
				<div>
					<p>预订单激活时间</p>
					<p>{{orderDetail.bookActivateTime}}</p>
				</div>
			</div>
	        
        </section>
    	
	</div>
</template>

<script>
import {dealWithOrderGoods} from '../../../common/orderGoodses'
import initStyle from '../../../common/initStyle'
import http from '../../../common/http'
import api from '../../../common/api'
import orderInfoDetail from './orderInfoDetail'
import orderShippingDetail from './orderShippingDetail'
import orderAfterSaleDetail from './orderAfterSaleDetail'
import processState2 from '../../../component/processState2'
import datePicker from '../../../component/datePicker'
import overlay from '../../../component/overlay'

export default {
    data () {
    	return {
    		tabList: [{
            	"name": "订单详情",
            	"view": "orderInfoDetail",
            	"active": true,
            }, {
            	"name": "发货",
            	"view": "orderShippingDetail",
            	"active": false,
            }, {
            	"name": "售后",
            	"view": "orderAfterSaleDetail",
            	"active": false,

            }],
            currentView: "orderInfoDetail",
            orderId: "",
            showOverlay: false,
            orderDetail: {
            	shop: {},
            	distributor: {},
            	receiverProvince: {
            		regionId: "",
            		regionName: "",
            	},
            	receiverCity: {
            		regionId: "",
            		regionName: "",
            	},
            	receiverDistrict: {
            		regionId: "",
            		regionName: "",
            	},
            	receiverStreet: {
            		regionId: "",
            		regionName: "",
            	},
            	shipping: {},
            	warehouse: {},
            	orderGoodses: [],
            	packages: {},
            	orderProcess: {},
            	invoiceInfo: [],
            },
            party: {},
            stateData: [],
	      	curState: {
		    	state: 'create',
		    	icon: '/src/img/u1287.png'
		    },
		    checkUnableReasonList: [],
            orderActions: [],
            orginOrderSn: [],
            styleObj: {
            	'stateItem': 130,
            },
            bookActiveTime: {
            	show: false,
            	style: "",
            },
            showClearExceptionIcon: false,

    	}
    },
    created () {
    	this.orderId = this.$route.params.orderId;
	    this.getOrderDetail();
	    this.getPartyDetails();
	},
    mounted () {
    	this.getOrderActionList();

    },
    filters: {
    	orderStatusFilter: function(val1,val2) {
    		const orderStatusMapping = {
    			'WAIT_CHECK': '待审核',
    			'CHECK_PASS': '已审核',
    			'REJECT': '已驳回',
    			'CLOSE_PLATFORM': '已作废',
    			'CLOSED_MANUAL': '已作废',
    			'INVALID': '无效',
    		};
    		const shippingStatusMapping = {
    			'INIT': '待处理',
    			'PUSH': '已推送',
    			'OPERATED': '已发货',
    			'PLATFORM_OPERATED': '平台已发货',
    			'OLD_SYSTEM_OPERATED': '老系统已发货',
    		};
    		if(val2 != 'INIT' && val2 != undefined){
    			for(let key in shippingStatusMapping ){
    				if(key == val2){
    					return shippingStatusMapping[key];
    				}
    			}
    		}else if(val2 == 'INIT'){
    			for(let key in orderStatusMapping ){
    				if(key == val1){
    					return orderStatusMapping[key];
    				}
    			}    			
    		}
    	}
    },
    components: {orderInfoDetail,orderShippingDetail,orderAfterSaleDetail,processState2,datePicker,overlay},
    methods: {
    	getPartyDetails() {
			const _self = this;
			http({
		    		instance: _self,
		    		url: api.getPartyDetail,
		            type: 'post',
		            hasLoading: true,
		            success (res) {
		            	_self.party = res.data;
		            }
		        });
		},
    	getOrderDetail () {
    		const _self = this;
	    	http({
	    		instance: _self,
	    		url: api.getOrderDetail,
	            type: 'post',
	            data:{
	            	data:{
	            		orderId: _self.orderId, 
	            	},
	            },
	            hasLoading: true,
	            success (res) {
	            	_self.orderDetail = res.data;
	            	if(!_self.orderDetail.receiverProvince){
	            		_self.orderDetail.receiverProvince = {
	            			regionName: '',
	            			regionId: ''
	            		}
	            	}
	            	if(!_self.orderDetail.receiverCity){
	            		_self.orderDetail.receiverCity = {
	            			regionName: '',
	            			regionId: ''
	            		}
	            	}
	            	if(!_self.orderDetail.receiverDistrict){
	            		_self.orderDetail.receiverDistrict = {
	            			regionName: '',
	            			regionId: ''
	            		}
	            	}
	            	if(!_self.orderDetail.receiverStreet){
	            		_self.orderDetail.receiverStreet = {
	            			regionName: '',
	            			regionId: ''
	            		}
	            	}
	            	if(!_self.orderDetail.distributor){
	            		_self.orderDetail.distributor = {
	            			distributorName: '',
	            			distributorId: ''
	            		}
	            	}
	            	if(!_self.orderDetail.warehouse){
	            		_self.orderDetail.warehouse = {
	            			warehouseName: '',
	            			warehouseId: ''
	            		}
	            	}
	            	if(!_self.orderDetail.shipping){
	            		_self.orderDetail.shipping = {
	            			warehouseName: '',
	            			warehouseId: ''
	            		}
	            	}

	            	//订单流程图
	            	_self.getOrderProcess();

	            	//订单无法审核列表
	            	_self.getCheckUnableReasonList();

				    //订单商品
				    var tempObj = dealWithOrderGoods(_self.orderDetail.orderGoodses);
				    _self.orderDetail.orderGoodses =  tempObj.orderGoods; 
				    _self.orderDetail.totalSkuDiscountFee =  tempObj.totalSkuDiscountFee; 
				    _self.orderDetail.totalSkuNum =  tempObj.totalSkuNum; 
				    _self.orderDetail.orderGoodsNum =  tempObj.orderGoodsNum; 
				    _self.orderDetail.originOrderSns =  tempObj.originOrderSns; 
				    _self.orderDetail.totalDiscountFee = (_self.orderDetail.discountFee + Number(tempObj.totalSkuDiscountFee)).toFixed(2); 

				    _self.orderDetail.goodsFee = _self.orderDetail.goodsFee == undefined ? 0.00 : _self.orderDetail.goodsFee.toFixed(2);
				    _self.orderDetail.postFee = _self.orderDetail.postFee == undefined ? 0.00 : _self.orderDetail.postFee.toFixed(2);
				    _self.orderDetail.discountFee = _self.orderDetail.discountFee == undefined ? 0.00 : _self.orderDetail.discountFee.toFixed(2);
				    _self.orderDetail.taxFee = _self.orderDetail.taxFee == undefined ? 0.00 : _self.orderDetail.taxFee.toFixed(2);
				    _self.orderDetail.totalFee = _self.orderDetail.totalFee == undefined ? 0.00 : _self.orderDetail.totalFee.toFixed(2);

	            }
	    	});
    	},
    	getOrderActionList () {
    		const _self = this;
	    	http({
	    		instance: _self,
	    		url: api.getOrderActionList,
	            type: 'post',
	            data:{
	            	data:{
	            		orderId: _self.orderId, 
	            		type: "",
	            	},
	            },
	            hasLoading: false,
	            success (res) {
	            	_self.orderActions = res.data;
	            }
	    	});
    	},
    	getCheckUnableReasonList() {
    		if(this.orderDetail.orderProcess) {
    			this.checkUnableReasonList = [{
			    	value: 'shortageStatus',
			    	name: '缺货',
			    	show: (this.orderDetail.orderProcess.shortageStatus == 'ALL_SHORTAGE' || this.orderDetail.orderProcess.shortageStatus == 'PART_SHORTAGE') ? true : false,
			    }, {
			    	value: 'financeCheckStatus',
			    	name: '待财审',
			    	show: (this.orderDetail.orderProcess.financeCheckStatus == 'WAIT_CHECK') ? true : false,
			    }, {
			    	value: 'bookSubOrderType',
			    	name: '预订单',
			    	show: (this.orderDetail.orderProcess.subOrderType == 'BOOK') ? true : false,
			    }, {
			    	value: 'NormalSubOrderType',
			    	name: '正常单',
			    	show: (this.orderDetail.orderProcess.subOrderType == 'NORMAL') ? true : false,
			    }];
    		}else {
    			this.checkUnableReasonList = [];
    		}
    		
    	},
    	getOrderProcess () {
    		this.stateData = [{
		        state: 'create',
		        name:'创建',
		        time: this.orderDetail.createTime,
		    }, {
		        state: 'check',
		        name: '审核',
		        time: this.orderDetail.orderProcess == undefined ? '' : this.orderDetail.orderProcess.checkTime,
		    }, {
		        state: 'push',
		        name: '推送',
		        time: this.orderDetail.wmsOrder == undefined ? '' : this.orderDetail.wmsOrder.pushTime,
		    }, {
		        state: 'shipping',
		        name: '发货',
		        time:this.orderDetail.shippingTime,
		    }, {
		        state: 'finish',
		        name: '完成',
		        time: '',
		    }];

        	if(this.orderDetail.orderStatus == 'CLOSED_MANUAL' || this.orderDetail.orderStatus == 'CLOSE_PLATFORM' || this.orderDetail.orderStatus == 'INVALID') {
        		this.curState = {
			    	state: '',
			    	icon: ''
			    };
        	}else if(this.orderDetail.shippingStatus == 'PUSH'){
        		this.curState = {
			    	state: 'push',
			    	icon: '/src/img/u1287.png'
			    };
        	}else if(this.orderDetail.shippingStatus == 'OPERATED' || this.orderDetail.shippingStatus == 'RECEIVED'){
        		this.curState = {
			    	state: 'shipping',
			    	icon: '/src/img/u1289.png'
			    };
        	}else if(this.orderDetail.shippingStatus == 'PLATFORM_OPERATED'){
        		this.curState = {
			    	state: 'finish',
			    	icon: '/src/img/u1291.png'
			    };
        	}else if(this.orderDetail.orderStatus == 'CHECK_PASS'){
        		this.curState = {
			    	state: 'check',
			    	icon: '/src/img/u1283.png'
			    };
        	}
    	},
    	clickTab (tab) {
    		if (tab && !tab.active) {
                this.select(tab)
            }
        },
        select (tab) {
            if (!tab) {
                return
            }
            this.currentView = tab.view;
            this.$set(tab, 'active', true);
            this.tabList.forEach((ftab) => {
                if (ftab.name !== tab.name) {
                    this.$set(ftab, 'active', false);
                }
            })
        },
        cancelOrder () {
        	const _self = this;
        	http({
	    		instance: _self,
	    		url: api.cancelOrders,
	            type: 'post',
	            data:{
	            	data:{
	            		orderIds: [_self.orderId], 
	            	},
	            },
	            hasLoading: false,
	            success (res) {
	            	layer.msg(res.msg, {
                        time: 2000
                    });
                    
	            	_self.orderDetail.orderStatus = 'CLOSED_MANUAL';
	            	//订单无法审核列表
	            	// _self.stateData = [];

	            	_self.getCheckUnableReasonList();

	            	_self.getOrderProcess();

	            	//刷新操作记录
	            	_self.getOrderActionList();

	            }
	    	});
        },
        checkOrder () {
        	const _self = this;
        	http({
	    		instance: _self,
	    		url: api.checkOrders,
	            type: 'post',
	            data:{
	            	data:{
	            		orderIds: [_self.orderId], 
	            	},
	            },
	            hasLoading: false,
	            success (res) {
	            	layer.msg(res.msg, {
                        time: 2000
                    });

                    _self.orderDetail.orderStatus = 'CHECK_PASS';

	            	//订单流程图
	            	_self.getOrderProcess();

	            	//订单无法审核列表
	            	_self.getCheckUnableReasonList();

	            	//刷新操作记录
	            	_self.getOrderActionList();

	            }
	    	});
        },
        rejectOrder() {
        	const _self = this;
        	http({
	    		instance: _self,
	    		url: api.rejectOrders,
	            type: 'post',
	            data:{
	            	data:{
	            		orderIds: [_self.orderId], 
	            	},
	            },
	            hasLoading: false,
	            success (res) {
	            	layer.msg(res.msg, {
                        time: 2000
                    });

	            	_self.orderDetail.orderStatus = 'WAIT_CHECK';
	            	//订单流程图
	            	_self.getOrderProcess();

	            	//订单无法审核列表
	            	_self.getCheckUnableReasonList();

	            	//刷新操作记录
	            	_self.getOrderActionList();

	            }
	    	});
        },
        forceCheckOrder () {
        	const _self = this;
        	http({
	    		instance: _self,
	    		url: api.forceCheckOrders,
	            type: 'post',
	            data:{
	            	data:{
	            		orderIds: [_self.orderId], 
	            	},
	            },
	            hasLoading: false,
	            success (res) {
	            	layer.msg(res.msg, {
                        time: 2000
                    });

	            	_self.orderDetail.orderStatus = 'CHECK_PASS';

	            	//订单流程图
	            	_self.getOrderProcess();

	            	//订单无法审核列表
	            	_self.getCheckUnableReasonList();

	            	_self.orderDetail.orderProcess.exceptionTagList = [];

	            	//刷新操作记录
	            	_self.getOrderActionList();


	            }
	    	});
        },
        changeSubOrderType (data) {
    		const _self = this;
        	http({
	    		instance: _self,
	    		url: api.changeOrdersType,
	            type: 'post',
	            data:{
	            	data:{
	            		orderIds: [_self.orderId], 
	            		subOrderType: data,
	            	},
	            },
	            hasLoading: false,
	            success (res) {
	            	layer.msg(res.msg, {
                        time: 2000
                    });
                    _self.orderDetail.orderProcess.subOrderType = data;
                    _self.getCheckUnableReasonList();

                    //刷新操作记录
	            	_self.getOrderActionList();
	            }
	    	});       	
        	
        },
        actionButtonsShow (data) {
        	if(this.orderDetail.shippingStatus == 'PLATFORM_OPERATED' || this.orderDetail.shippingStatus == 'OLD_SYSTEM_OPERATED') {
        		return false;
        	}
        	switch (data) {
        		case 'refund':
        		if(this.orderDetail.orderStatus == 'CLOSED_MANUAL' || this.orderDetail.orderStatus == 'CLOSE_PLATFORM') {
        			return true;
        		}else {
        			return false;
        		}
        		break;
        		case 'closeOrder':
        		if(this.orderDetail.orderStatus != 'CLOSED_MANUAL' && this.orderDetail.orderStatus != 'CLOSE_PLATFORM' 
        			&& (this.orderDetail.shippingStatus == 'INIT' || this.orderDetail.shippingStatus == 'PUSH')) {
        			return true;
        		}else {
        			return false;
        		}
        		break;
        		case 'checkOrder':
        		if(this.orderDetail.orderStatus == 'WAIT_CHECK'){
        			return true;
        		}else {
        			return false;
        		}
        		break;
        		case 'outboundReject':
        		if((this.orderDetail.orderStatus == 'CHECK_PASS' || this.orderDetail.shippingStatus == 'PUSH') && this.orderDetail.shippingStatus != 'OPERATED'){
        			return true;
        		}else {
        			return false;
        		}
        	}
        },
        chooseBooktime (data) {
        	var obj = {
        		orderId: this.orderDetail.orderId,
        		bookActivateTime: data.data,
        		releaseInventory: ''
        	}
        	this.confirmModifyBook(obj);

        	//刷新操作记录
	        _self.getOrderActionList();

        },
        releaseInventory () {
        	var obj = {
        		orderId: this.orderDetail.orderId,
        		bookActivateTime: '',
        		releaseInventory: true
        	}
        	this.confirmModifyBook(obj);
        	this.orderDetail.orderProcess.reserverStatus = 'UNRESERVED';

        },
        showBookActiveTime (data) {
        	
        	if(data == "bookSubOrderType"){
        		var x = event.clientX + "px";
        		var y = event.clientY + "px";
        		this.bookActiveTime.style = "top: " + y + "; left: " + x;
        		this.bookActiveTime.show = true;

        	}
        },
        hiddenBookActiveTime (data) {
        	this.bookActiveTime.show = false;
        },
        confirmModifyBook (data) {
        	const _self = this;
        	http({
	    		instance: _self,
	    		url: api.modifyOrderBook,
	            type: 'post',
	            data:{
	            	data: data,
	            },
	            hasLoading: false,
	            success (res) {
	            	layer.msg(res.msg, {
                        time: 2000
                    });

                    //刷新操作记录
	            	_self.getOrderActionList();
	            }
	    	});
        },
        clearException(index,data){
        	const _self = this;
        	http({
	    		instance: _self,
	    		url: api.clearExceptionTag,
	            type: 'post',
	            data:{
	            	data: {
	            		orderId: _self.orderDetail.orderId,
	            		exceptionTag: data,
	            	}
	            },
	            hasLoading: false,
	            success (res) {
	            	layer.msg(res.msg, {
                        time: 2000
                    });
                    _self.orderDetail.orderProcess.exceptionTagList.splice(index,1);

                    //刷新操作记录
	            	_self.getOrderActionList();
	            }
	    	});
        }

    }
}
</script>

<style scoped>
.fixed .content-wrapper, .fixed .right-side {
	padding-top: 0 !important;
}
.content-wrapper, .right-side, .main-footer {
	margin-left: 0 !important;
}
.content {
	overflow: auto;
}
.content-overflow {
	width: 100%;
	overflow: auto;
	padding: 20px auto;
}
.left-div {
	width: 70%;
	float: left;
}
.right-div {
	width: 29%;
	background-color: #FFF;
	float: right;
	font-size: 14px;
}
.order-header {
	background-color: #FFF;
	width: 100%;
	float:left;
}
.order-status {
	padding: 5px 5px;
	border-bottom: solid 1px #d2d6de;
}
.order-status label,.order-status button{
	margin-left: 10px;
}
.order-sn {
	font-weight: bold;
	font-size: 15px;
}
.pay-time {
	color: #aaa;
	font-size: 11px;
}
.order-btn button{
	margin-left: 20px;
}
.order-flow{
	padding-left:10px;
	padding-bottom: 5px;
	padding-top: 5px;
	width: 100%;
	vertical-align: middle;
	float:left;
}
.order-action {
	border-top: solid 1px #d2d6de;
}

.tabs-list-wrapper {
	width: 100%;
	float: left;
	margin-top: 10px;
}
.tabs-list {
	width: 100%;
	float: left;
	padding-left: 10px;
	border-bottom: 1px solid #3697DE;
}
.tabs-list li {
	float: left;
	margin-bottom: -1px;
	margin-right: 5px;
	padding: 5px 20px;
	text-align: center;
	color: #333;
	cursor: pointer;
	background-color: #F2F2F2;
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;
	border-top:1px solid transparent;
	border-left:1px solid transparent;
	border-right:1px solid transparent;
}

.tabs-list li.active {
	color: #333;
	background-color: #fff;
	border-top:1px solid #3697DE;
	border-right: 1px solid #3697DE;
	border-left: 1px solid #3697DE;
	border-bottom: 1px solid transparent;
}
.tabs-content-wrapper {
	float: left;
	width: 100%;
	background-color: #fff;
}
.order-process-time {
	color: #aaa;
	font-size: 11px;
}
.form-horizontal .form-group {
	margin-right: 0px;
	margin-left: 0px;
	margin-bottom: 0px;
}
.col-md-12, .col-md-8, .col-md-1, .col-md-2, .col-md-9{
	padding-left: 1px;
	padding-right: 1px;
}
.book-modal {
	width: 350px;
	position: fixed;
	left: 0;
	right: 0;
	top: 0;	
	background-color: #fff;
	margin: 200px auto;
	float: none;
	opacity: 1;
	padding: 20px 10px;
	overflow-y: auto;
	overflow-x: hidden;
	max-height: 90%;
	z-index: 1002;
	border: 1px solid #797979;
	/*border-radius: 4px;*/
}
.book-active-time {
	width: 165px;
	position: fixed;
	left: 0;
	top: 0;	
	background-color: #fff;
	float: none;
	opacity: 1;
	padding: 10px 10px;
	z-index: 1002;
	border: 1px solid #797979;
	border-radius: 4px;
	color: #797979;
	-webkit-box-shadow: 0 0 4px 4px rgba(121, 121, 121, .3);  
  	-moz-box-shadow: 0 0 4px 4px rgba(121, 121, 121, .3);  
  	box-shadow: 0 0 4px 4px rgba(121, 121, 121, .3);
}
.action-buttons {
	margin-top: 10px;
}
.col-md-3, .col-md-4, .col-md-5, .col-md-6 {
	padding-left: 1px;
	padding-right: 1px;
}
.iconfont {
	font-size: 14px;
	color: #666;
	cursor: pointer;
}
.btn-a {
	border-bottom: 1px solid;
	color: #1788E9;
}
/*label {
	overflow:hidden;
	white-space:nowrap;
}*/
</style>