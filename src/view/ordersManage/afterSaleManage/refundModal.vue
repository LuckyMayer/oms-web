<template>
	<div>
		<component is="overlay" v-if="showOverlay" :on-click="cancelCreate"></component>
		<div class="refund-modal">
			<h4>退款结算
				<button class="btn btn-xs btn-danger" @click="rejectAfterSaleOrder">驳回</button>
				<button class="btn btn-xs btn-primary" @click="settleAfterSaleOrder">确认</button>
			</h4>
			<div class="col-md-12 no-padding form-horizontal">
				<div class="form-group">
					<label class="col-md-1 control-label">退换单号</label>
					<div class="col-md-2">
						<input type="text" class="input-sm form-control not-editable" readonly="readonly" v-model="formData.id">
					</div>
					<label class="col-md-1 control-label">退换类型</label>
					<div class="col-md-2">
						<component is="select-after-sale-type" :disabled="true" :default-order-type="formData.orderType"></component>
					</div>
					<label class="col-md-1 control-label">退换原因</label>
					<div class="col-md-2">
						<component is="select-after-sale-reason" :disabled="true" placeholder="请选择退换原因" :default-reason-type="formData.reasonType"></component>
						<!-- <input type="text" class="input-sm form-control not-editable" readonly="readonly" v-model="formData.reasonValue"> -->
					</div>
					
				</div>
				<div class="form-group">
					<label class="col-md-1 control-label">系统订单</label>
					<div class="col-md-2">
						<input type="text" class="input-sm form-control not-editable" readonly="readonly" v-model="formData.omsOrderSn">
					</div>
					<label class="col-md-1 control-label">原始订单</label>
					<div class="col-md-2">
						<input type="text" class="input-sm form-control not-editable" readonly="readonly" v-model="formData.platformOrderIdsString">
					</div>
				</div>
				<div class="form-group">
					<label class="col-md-1 control-label">客户ID</label>
					<div class="col-md-2">
						<input type="text" class="input-sm form-control not-editable" readonly="readonly" v-model="formData.buyer">
					</div>
					<label class="col-md-1 control-label">客户姓名</label>
					<div class="col-md-2">
						<input type="text" class="input-sm form-control not-editable" readonly="readonly" v-model="formData.buyerName">
					</div>
					<label class="col-md-1 control-label">店铺</label>
					<div class="col-md-2">
						<input type="text" class="input-sm form-control not-editable" readonly="readonly" v-model="formData.seller">
					</div>
					<label class="col-md-1 control-label" style="text-align:left;">{{formData.platformName}}</label>
				</div>
				<div class="form-group">
					<label class="col-md-1 control-label">原单应收</label>
					<div class="col-md-2 control-label" style="text-align:left;">
					{{originalOrder.totalFee}}
					</div>
					<label class="col-md-1 control-label">原单预存款</label>
					<div class="col-md-2 control-label" style="text-align:left;">
					{{formData.preDepositFee}}
					</div>
					<label class="col-md-1 control-label">损失金额</label>
					<div class="col-md-2 control-label" style="text-align:left;">
					{{formData.lossAmount}}
					</div>
				</div>
			</div>
			<div class="col-md-12 no-padding form-horizontal">
				<h5><span class="h5-tag">|</span>退款明细</h5>
				<div class="col-md-12 form-horizontal refund">
					<div class="form-group">
						<label class="col-md-1 control-label">|退款总金额</label>
						<div class="col-md-1 control-label" style="text-align:left">
							<span>{{_refundAmount}}</span>
						</div>
						<template v-if="formData.orderType=='RETURN' || formData.orderType=='EXCHANGE'">
							<label class="col-md-1 control-label">|退货金额</label>
							<div class="col-md-1 control-label" style="text-align:left">
								<span>{{formData.returnAmount}}</span>
							</div>
							<label class="col-md-1 control-label">退货邮费</label>
							<div class="col-md-1 control-label" style="text-align:left">
								<span>{{formData.returnPostFee}}</span>
							</div>
						</template>
						<template v-if="formData.orderType=='EXCHANGE'">
							<label class="col-md-1 control-label">|换货金额</label>
							<div class="col-md-1 control-label" style="text-align:left">
								<span>{{formData.exchangeAmount}}</span>
							</div>
							<label class="col-md-1 control-label">换货邮费</label>
							<div class="col-md-1 control-label" style="text-align:left">
								<span>{{formData.exchangePostFee}}</span>
							</div>
						</template>
					</div>
					<div class="form-group" v-if="formData.refundPreDepositFeeOld!=0">
						<div class="col-md-5 no-padding">
							<label class="col-md-2 control-label">退预存款申请</label>
							<div class="col-md-4">
								<input type="text" class="input-sm form-control not-editable" readonly="readonly" v-model="formData.refundPreDepositFeeOld">
							</div>
							<label class="col-md-2 control-label">预存款退货</label>
							<div class="col-md-4">
								<input type="text" class="input-sm form-control not-editable" readonly="readonly" v-model="formData.refundPreDepositFeeOld">
							</div>
						</div>
						<label class="col-md-1 control-label">本次退预存款</label>
						<div class="col-md-2">
							<input type="text" class="input-sm form-control" readonly placeholder="暂不支持" v-model="formData.refundPreDepositFee">
						</div>
					</div>
					<div class="form-group">
						<div class="col-md-5 no-padding">
							<label class="col-md-2 control-label">退款方式</label>
							<div class="col-md-4">
								<input type="text" class="input-sm form-control not-editable" readonly="readonly" v-model="formData.refundTypeValue">
								<!-- <component is="select-refund-type" @selected="selectedRefundType"></component> -->
							</div>
							<label class="col-md-2 control-label">
								退款金额<span class="red">*</span>
							</label>
							<div class="col-md-4">
								<input type="text" class="input-sm form-control not-editable" readonly="readonly" v-model="formData.refundNormalAmountOld">
							</div>
						</div>
						<div class="col-md-5 no-padding" v-if="formData.refundType=='ONLINE_BANK_REFUND'">
							<label class="col-md-2 control-label">网银渠道</label>
							<div class="col-md-4">
								<input type="text" class="input-sm form-control not-editable" readonly="readonly" v-model="formData.refundWay">
								<!-- <component is="select-refund-way" @selected="selectedRefundWay"></component> -->
							</div>
							<label class="col-md-2 control-label">买家账号</label>
							<div class="col-md-4">
								<input type="text" class="input-sm form-control not-editable" readonly="readonly" v-model="formData.buyerAccountNum">
							</div>
						</div>	
						<div class="col-md-2 no-padding">
							<label class="col-md-4 control-label">本次退款</label>
							<div class="col-md-8">
								<input type="text" class="input-sm form-control" v-model="formData.refundNormalAmount">
							</div>
						</div>
						
					</div>
					<div class="form-group">
						<label class="col-md-1 control-label">退换备注</label>
						<div class="col-md-10">
							<input type="text" class="input-sm form-control" v-model="formData.AfterSalememo" readonly>
						</div>
					</div>
					<div class="form-group">
						<label class="col-md-1 control-label">财务备注</label>
						<div class="col-md-10">
							<input type="text" class="input-sm form-control" v-model="formData.memo">
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
import overlay from '../../../component/overlay'
import selectAfterSaleType from '../../../component/selectAfterSaleType'
import selectAfterSaleReason from '../../../component/selectAfterSaleReason'

export default {
	props: {
	    showOverlay: {
	      	type: Boolean,
	      	default: true
	    },
	    id: {
	    	default: ''
	    }
	},
	data() {
		return {
			formData: {

			},
			originalOrder: {

			}
		}
		
	},
	mounted() {
		if(this.id != ''){
			this.getAfterSaleOrderDetail();
		}
	},
	computed: {
		_refundAmount() {
			if(this.formData.refundPreDepositFee == undefined){
				this.formData.refundPreDepositFee = 0;
			}
			if(this.formData.refundNormalAmount == undefined){
				this.formData.refundNormalAmount = 0;
			}
			this.formData.refundAmount = Number(this.formData.refundPreDepositFee) + Number(this.formData.refundNormalAmount);
			return this.formData.refundAmount ;
		},
	},
	components: {overlay,selectAfterSaleType,selectAfterSaleReason},
	methods: {
		getAfterSaleOrderDetail() {
			const _self = this;
			http({
		    		instance: _self,
		    		url: api.getAfterSaleOrderDetail,
		            type: 'post',
		            data: {
		            	data: {
		            		id: _self.id
		            	},
		            },
		            hasLoading: true,
		            success (res) {
		            	_self.formData = res.data;
		            	_self.originalOrder = res.data.omsOrder;

		            	// _self.formData.orderType = res.data.orderType;
		            	_self.formData.id = res.data.id;
						_self.formData.omsOrderSn = res.data.omsOrder.orderSn;
		            	_self.formData.platformOrderIdsString = res.data.platformOrderIds.join(',');
		            	_self.formData.shopId = res.data.shop.shopId;
		            	_self.formData.platformName = res.data.shop.shopPlatformValue;
		            	_self.formData.totalFee = res.data.omsOrder.totalFee;
		            	_self.formData.preDepositFee = (res.data.omsOrder.preDepositFee == undefined) ? '' : 0;
		            	_self.formData.shopNick = res.data.shop.shopNick;
		            	_self.formData.seller = res.data.shop.shopNick;
		            	_self.formData.refundPreDepositFeeOld = res.data.refundPreDepositFee;
		            	_self.formData.refundNormalAmountOld = res.data.refundNormalAmount;
		            	_self.formData.AfterSalememo = res.data.memo;
		            	_self.formData.memo = '';

						
		            },
		        });
		},
		cancelCreate () {
        	this.$emit('cancel', false);
        },
        settleAfterSaleOrder() {
        	const _self = this;
	    	http({
	    		instance: _self,
	    		url: api.settleAfterSaleOrder,
	            type: 'post',
	            data: {
	            	data: {
		            	id: _self.formData.id,
		            	memo: _self.formData.memo,
		            	refundNormalAmount: _self.formData.refundNormalAmount,
		            	refundPreDepositFee: _self.formData.refundPreDepositFee,
		            },
	            },
	            hasLoading: true,
	            success (res) {
	            	layer.msg('结算成功', {
	            		time: 2000
	            	});
	            	_self.$emit('cancel', false);
	            }
	        });
        },
        rejectAfterSaleOrder() {
        	const _self = this;
	    	http({
	    		instance: _self,
	    		url: api.rejectAfterSaleOrderSettle,
	            type: 'post',
	            data: {
	            	data: {
		            	id: _self.formData.id,
		            	memo: _self.formData.memo
		            },
	            },
	            hasLoading: true,
	            success (res) {
	            	layer.msg('结算驳回', {
	            		time: 2000
	            	});
	            	_self.$emit('cancel', false);
	            }
	        });
        },
        selectedRefundType() {

        }
	}
}
</script>

<style scoped>
.refund-modal {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;	
	width: 1100px;
	background-color: #fff;
	margin: 60px auto;
	float: none;
	opacity: 1;
	padding: 20px 20px;
	overflow-y: auto;
	overflow-x: hidden;
	max-height: 90%;
	z-index: 1006;

}
h4 {
	font-weight: bold;
}
label.control-label {
	padding-left: 0px;
	padding-right: 0px;
}
h5 {
	font-weight: 900;
}
.h5-tag {
	color:#0099FF;
	font-weight:bold;
	margin-right:10px;
}
.refund, .back-order-goods, .change-order-goods {
	border-top:1px dashed #797979; 
	padding-top:10px;
}
button {
	margin-left: 10px;
}
.btn {
	padding-left: 16px;
	padding-right: 16px;
}
.not-editable {
	/*background-color: transparent;*/
	/*border-top: */
}
label {
	overflow:hidden;
	white-space:nowrap;
}
</style>