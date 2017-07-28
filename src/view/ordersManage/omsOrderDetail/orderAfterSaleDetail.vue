<template>
	<div class="order-after-sale-detail">
		<dl class="order-brief-info">
			<dt>
				| 订单简介

			</dt>
			<dd>
				<div class="col-md-12 no-padding form-horizontal">
					<div class="form-group">
						<label class="col-md-1 control-label">店铺：</label>
						<div class="col-md-2">
							<input class="form-control input-sm not-editable" readonly v-model="orderDetail.shop.shopNick">
						</div>
						<label class="col-md-1 control-label">分销商：</label>
						<div class="col-md-2">
						<input class="form-control input-sm not-editable" readonly v-model="orderDetail.distributor.distributorName">
						</div>
						
						<label class="col-md-1 control-label">仓库：</label>
						<div class="col-md-2">
						<input class="form-control input-sm not-editable" readonly v-model="orderDetail.warehouse.warehouseName">
						</div>
						
						<label class="col-md-1 control-label">快递：</label>
						<div class="col-md-2">
							<input class="form-control input-sm not-editable" readonly v-model="orderDetail.shipping.shippingName">
						</div>
					</div>
				</div>
			</dd>
		</dl>
		<dl class="order-after-sale">
			<dt>
				| 关联售后
				<button class="btn btn-xs btn-primary" ><a :href="'#/ordersManage/afterSaleManage/afterSaleOrderDetail/create/' + orderDetail.orderSn" target="_blank" style="color:#fff;">新建售后单</a></button>
				<button class="btn btn-xs btn-primary" ><a :href="'#/ordersManage/manualOrderGeneration/ordersGeneration/singleOrderGeneration/'+orderDetail.orderSn" target="_blank" style="color:#fff;">复制订单</a></button>
				<button class="btn btn-xs btn-primary" ><a :href="'#/ordersManage/manualOrderGeneration/ordersGeneration/shipOnlyOrderGeneration/'+orderDetail.orderSn" target="_blank" style="color:#fff;">补寄</a></button>
			</dt>
			<dd>
				<table class="table">
					<thead>
						<tr>
							<th>订单号</th>
							<th>售后类型</th>
							<th>状态</th>
							<th>操作</th>
							<th>应退金额</th>
							<th>已退金额</th>
							<th>亏损金额</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item,index) in afterSaleOrderList.orderAfterSales">
							<td><a :href="'#/ordersManage/afterSaleManage/afterSaleOrderDetail/view/'+item.id" target="_blank">{{item.id}}</a></td>
							<td>{{item.orderType | orderTypeFilter}}</td>
							<td>{{item.orderStatusValue}}</td>
							<td>
								<template v-if="item.orderStatus!='FINISHED' && item.orderStatus!='CLOSED'">
									<a href="#" @click.prevent="closeAfterSaleOrder(item.id)"><span class="red">作废&nbsp;</span></a>
									<a v-if="showEditButton(item.orderStatus)" :href="'#/ordersManage/afterSaleManage/afterSaleOrderDetail/edit/'+item.id" target="_blank">编辑</a>
								</template>
							</td>
							<td>{{item.refundAmount}}</td>
							<td>
								<template v-if="item.settlementStatus=='SETTLED'">{{item.returnAmount}}</template>
								<template v-else>0</template>
							</td>
							<td>{{item.lossAmount}}</td>
						</tr>
						<tr v-for="(item,index) in afterSaleOrderList.supplyOrders">
							<td><a :href="'#/ordersManage/omsOrderDetail/orderDetails/'+item.orderId" target="_blank">{{item.orderSn}}</a></td>
							<td>{{item.orderTypeValue}}</td>
							<td>{{item.orderStatus | orderStatusFilter}}</td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
					</tbody>
				</table>
			</dd>
		</dl>
		<!-- <dl class="order-communication">
			<dt>
				| 内部沟通
				<button class="btn btn-xs btn-primary" >发起沟通</button>
				<button class="btn btn-xs btn-primary" >批量定案</button>
			</dt>
			<dd>
				<table class="package-list">
					<thead>
						<tr>
							<th></th>
							<th>沟通分类</th>
							<th>沟通类型</th>
							<th>沟通发起时间</th>
							<th>倒计时</th>
							<th>沟通状态</th>
							<th>操作</th>
							<th>最新留言</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><input type="checkbox"></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
					</tbody>
				</table>
			</dd>
		</dl> -->
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
							<button v-if="actionData.actionMethod=='cancelAfterSaleOrder'" class="btn btn-xs btn-primary" @click="cancelAfterSaleOrder(actionData.data)">{{actionData.actionName}}</button>
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

export default {
	props: ['orderId','orderDetail'],
	data () {
		return {
			afterSaleOrderList: [],
			actionData: {
				data: {}
			},

		}
	},
	mounted () {
    	this.getAfterSaleOrderByOrder();
    },
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
    	},
        orderStatusFilter: function(val) {
            var orderStatusMapping = {
                'WAIT_CHECK': '待审核',
                'CHECK_PASS': '已审核',
                'REJECT': '已驳回',
                'CLOSE_PLATFORM': '已作废',
                'CLOSED_MANUAL': '已作废',
                'INVALID': '无效',
            };

            
            for(let key in orderStatusMapping ){
                if(key == val){
                    return orderStatusMapping[key];
                }
            }               
            
        },
    },
	methods: {
		getAfterSaleOrderByOrder() {
			const _self = this;
	    	http({
	    		instance: _self,
	    		url: api.getAfterSaleOrderByOrder,
	            type: 'post',
	            hasLoading: true,
	            data:{
	            	data:{
	            		"orderId": _self.orderId, 
	            	},
	            },
	            success (res) {
	            	_self.afterSaleOrderList = res.data;
	            }
	    	});
		},
		closeAfterSaleOrder(data){
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

	            	_self.getAfterSaleOrderByOrder();
	            	_self.actionData.actionModalShow = false;
	            }
	        });
          
    	},
    	cancelAction() {
    		this.actionData.actionModalShow = false;
    	},
    	showEditButton(val){
    		var specialOrderSatus = ['WAIT_CHECK','INVALID','CHECK_PASS','CHECK_REJECT','REJECT','INIT','PUSH','OPERATED'];
			var sign = false;
			
			const _self = this;
			specialOrderSatus.forEach(function(item, index){
				if(val == item){
					sign = true;
				}
			});
			
			return sign;
    	},

	},
}	
</script>

<style scoped>
.order-after-sale-detail {
	float: left;
	width: 100%;
	font-size: 12px;
}
.order-after-sale-detail dl {
	margin-bottom: 0px;
}
.order-after-sale-detail dt {
	font-size: 14px;
	color: #555;
	margin-top: 4px;
	margin-bottom: 2px;
	float: left;
}
.order-after-sale-detail dd {
	padding: 10px 0px 10px 0px;
	background-color: #fff;
	width: 100%;
	color: #666;	
	float: left;
}
.order-after-sale-detail dd .form-group div {
	text-align: left;
	padding-right: 0px;
	padding-left: 0px;
}
label {
	padding-left: 0px;
	padding-right: 0px;
	overflow:hidden;
	white-space:nowrap;
}
table {
	width: 100%;
}
table th {
	border-bottom: 1px solid #ccc;
	height: 35px;
	text-align: center;
}
table td {
	padding-top: 2px;
	padding-bottom: 2px;
	text-align: center;
}
.form-group {
	margin-right: 0px;
	margin-left: 0px;
}
.not-editable{
	border: 0px;
	background-color: #fff;
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
</style>