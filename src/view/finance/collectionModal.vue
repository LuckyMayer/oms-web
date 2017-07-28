<template>
	<div>
		<component is="overlay" v-if="showOverlay" :on-click="cancelCollection"></component>
		<div class="collection-modal">
			<div class="collection-content">
				<h5>财务收款</h5>
				<div class="col-md-12 form-horizontal no-padding">
					<div class="form-group">
						<label class="col-md-2 control-label">订单号：</label>
						<div class="col-md-3 control-label left-align">
							{{orderDetail.orderSn}}
						</div>
						<label class="col-md-2 control-label">原始单号：</label>
						<div class="col-md-5 control-label left-align">
							{{orderDetail.platformOrderIds}}
						</div>
					</div>
				</div>
				<div class="col-md-12 form-horizontal no-padding">
					<div class="form-group">
						<label class="col-md-2 control-label">应收：</label>
						<div class="col-md-3 control-label left-align">
							{{orderDetail.totalFee}}
						</div>
						<label class="col-md-2 control-label">待收金额：</label>
						<div class="col-md-5 control-label left-align">
							{{getRemainPayment()}}
						</div>
					</div>
				</div>
				<div class="col-md-12 form-horizontal no-padding">
					<div class="form-group">
						<label class="col-md-2 control-label">已实收：</label>
						<div class="col-md-3 control-label left-align">
							{{orderDetail.receiptFee}}
						</div>
						<label class="col-md-2 control-label">已使用预存款：</label>
						<div class="col-md-5 control-label left-align">
							{{orderDetail.prePayment}}
						</div>
					</div>
				</div>
				<div class="col-md-12 form-horizontal no-padding">
					<div class="form-group">
						<label class="col-md-2 control-label">本次收款：</label>
						<div class="col-md-3 control-label left-align">
							{{formData.payment}}
						</div>
						<label class="col-md-2 control-label">本次使用预存款：</label>
						<div class="col-md-5 control-label left-align">
							{{formData.prePayment}}
						</div>
					</div>
				</div>
				<div class="col-md-12 form-horizontal no-padding">
					<div class="form-group">
						<label class="col-md-2 control-label">本次实收：</label>
						<div class="col-md-2">
							<input type="text" class="form-control input-sm" v-model="formData.payment">
						</div>
						<label class="col-md-2 control-label">收款方式：</label>
						<div class="col-md-2">
							<component is="select-payment" placeholder="请选择支付方式" @selected="selectedPayment"></component>
						</div>
						<label class="col-md-2 control-label">收款流水：</label>
						<div class="col-md-2">
							<input type="text" class="form-control input-sm" v-model="formData.receiptSn">
						</div>
					</div>
				</div>
				<div class="col-md-12 form-horizontal no-padding" v-if="orderDetail.distributor">
					<div class="form-group">
						<label class="col-md-2 control-label">预存款余额：</label>
						<div class="col-md-2 control-label left-align">
							{{orderDetail.distributor.remainMoney}}
						</div>
						<label class="col-md-2 control-label">使用预存款：</label>
						<div class="col-md-2">
							<input type="text" class="form-control input-sm" v-model="formData.prePayment"  :disabled="orderDetail.distributor.remainMoney == 0">
						</div>
					</div>
				</div>
				<div class="col-md-12 form-horizontal buttons">
					<div class="form-group" style="text-align:center;">
						<button class="btn btn-sm btn-primary" @click="confirmCollection">确认</button>
						<button class="btn btn-sm btn-default" @click="cancelCollection">取消</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import http from '../../common/http'
import api from '../../common/api'
import overlay from '../../component/overlay'
import selectPayment from '../../component/selectPayment'

export default {
	data () {
		return {
			invoice: {
            	invoiceType: "1",
            },
            orderDetail: {
            	originOrders:[],
            	distributor: {}
            },
            formData: {
            	orderId: '',
            	payment: 0,
            	prePayment: 0,
            	receiptSn: '',
            	payCode: '',
            }
		}
	},
	props: {
	    showOverlay: {
	      	type: Boolean,
	      	default: true
	    },
	    orderId: {
	    	default: '',
	    }
	},
	created () {
		if(this.orderId != ''){
			this.formData.orderId = this.orderId;
			this.getOrderDetail();
		}
	},
	computed: {
	    
	},
	methods: {
		getRemainPayment() {
			if(!this.orderDetail) return "";
			var totalFee = this.orderDetail.totalFee || 0;
			var receiptFee = this.orderDetail.receiptFee || 0;
			var prePayment = this.orderDetail.prePayment || 0;
			return parseInt(totalFee) - parseInt(receiptFee) - parseInt(prePayment);
		},
		getOrderDetail(){
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
	            	var platformOrderIds = [];
	            	_self.orderDetail = res.data;
	            	//alert(_self.orderDetail.receiptFee + "," + _self.orderDetail.prePayment);
	            	if(!_self.orderDetail.distributor){
	            		_self.orderDetail.distributor = {
	            			distributorName: '',
	            			distributorId: '',
	            			remainMoney: 0,
	            		}
	            	}else if(_self.orderDetail.distributor.remainMoney == undefined){
	            		_self.orderDetail.distributor.remainMoney = 0;
	            	}
	            	if(res.data.originOrders){
	            		res.data.originOrders.forEach(function(item){
	            			platformOrderIds.push(item.platformOrderId);
	            		});
	            		_self.orderDetail.platformOrderIds = platformOrderIds.join(',');
	            	}else if(res.data.originOrder){
	            		_self.orderDetail.platformOrderIds = res.data.originOrder.platformOrderId;
	            	}
	            	_self.orderDetail.remainPayment = (Number(res.data.totalFee)-Number(res.data.payment)).toFixed(2);
	            	_self.orderDetail.preDepositFee = res.data.prePayment || res.data.preDepositFee || 0;
	            }
	    	});
		},
        cancelCollection () {
        	this.$emit('cancel', false);
        },
        confirmCollection() {
        	const _self = this;
        	if((_self.formData.payment == '0' && _self.formData.prePayment == '0') || _self.formData.payment < 0 || _self.formData.payment < 0)  {
        		layer.msg('本次收款必须大于0', {timeout: 2000});
        		return false;
        	}
	    	http({
	    		instance: _self,
	    		url: api.receiptFinanceSale,
	            type: 'post',
	            data:{
	            	data: _self.formData,
	            },
	            hasLoading: true,
	            success (res) {
	            	layer.msg('收款成功！', {timeout: 2000});
	            	_self.$emit('success', true);
	            }
	    	});
        },
        selectedPayment(data){
        	this.formData.payCode = data.data;
        }
	},
	components: {overlay,selectPayment}
}
</script>

<style scoped>
.collection-modal {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;	
	background-color: #fff;
	margin: 60px auto;
	float: none;
	opacity: 1;
	padding: 20px 5px;
	overflow-y: auto;
	overflow-x: hidden;
	max-height: 90%;
	z-index: 1002;
	width: 760px;
	padding-right: 16px; 
}

label.control-label {
	padding-right: 1px;
	padding-left: 1px;
}
h5 {
	font-weight: 600;
	font-size: 16px;
	text-align: center;
}
.buttons button {
	margin-right: 40px;
}
div.col-md-3, div.col-md-5, div.col-md-2 {
	padding-left: 0px;
	padding-right: 0px;
}
.left-align{
	text-align: left;
}
.form-group {
	margin-left: 0px;
	margin-right: 0px;
}
</style>