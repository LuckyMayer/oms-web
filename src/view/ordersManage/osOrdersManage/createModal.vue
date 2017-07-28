<template>
	<div>
		<component is="overlay" v-if="showOverlay" :on-click="cancelCreate"></component>
		<div class="create-modal">
			<h4>创建原ERP销售单</h4>
			<div class="col-md-12 no-padding form-horizontal">
				<div class="form-group">
					<label class="col-md-1 control-label">原ERP销售单号</label>
					<div class="col-md-2" style="text-align:left;">
						<input type="text" class="input-sm form-control not-editable"  v-model="formData.orderSn">
					</div>
					<div class="col-md-1" style="line-height:28px;">
						<button class="btn btn-xs btn-primary" @click="loadOrderInfo">加载</button>
					</div>
				</div>
				<div class="form-group">
					<label class="col-md-1 control-label">原始订单号</label>
					<div class="col-md-3 control-label" style="text-align:left;">
						{{formData.taobaoOrderSn}}
					</div>
					<label class="col-md-1 control-label">业务组</label>
					<div class="col-md-3 control-label" style="text-align:left;">
						{{formData.partyName}}
					</div>
					<label class="col-md-1 control-label">平台</label>
					<div class="col-md-3 control-label" style="text-align:left;">
						{{formData.sourceType}}
					</div>
				</div>
				<div class="form-group">
					<label class="col-md-1 control-label">老系统分销商</label>
					<div class="col-md-3 control-label" style="text-align:left;">
						{{formData.distributorName}}
					</div>
					<label class="col-md-1 control-label">所属店铺</label>
					<div class="col-md-3">
						<component id="selectShop" is="select-shop" v-model="formData.shopId" @selected="selectedShop" :contains-deleted="false" ></component>
					</div>
					<label class="col-md-1 control-label">分销商</label>
					<div class="col-md-3">
						<component comp-id="dustributorId" is="search-distributor" @selected="seletedDistributor" distributor-status="NORMAL" ></component>
					</div>
				</div>
				<div class="form-group">
					<div class="col-md-4">
						
					</div>
					<div class="col-md-4">
						<button class="btn btn-sm btn-default" @click="cancelCreate">取消</button>
						<button class="btn btn-sm btn-primary" @click="confirmCreate">确认</button>
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
import selectShop from '../../../component/selectShop'
import searchDistributor from '../../../component/searchDistributor'

export default {
	props: {
	    showOverlay: {
	      	type: Boolean,
	      	default: true
	    },
	},
	data() {
		return {
			formData: {
				orderSn: '',
				taobaoOrderSn: '',
				distributorName: '',//老系统分销商名称
				sourceType: '',
				partyName: '',
				shopId: '',
				distributorId: '',//新系统分销商id
			},
		}
		
	},
	components: {overlay,searchDistributor,selectShop},
	methods: {
		loadOrderInfo() {//加载订单信息
        	const _self = this;
	    	http({
	    		instance: _self,
	    		url: api.loadOldShippedOrder,
	            type: 'post',
	            data: {
	            	data: {
	            		orderSn: _self.formData.orderSn,
	            	},
	            },
	            hasLoading: true,
	            success (res) {
	            	_self.formData.orderSn = res.data.orderSn;
	            	_self.formData.distributorName = res.data.distributorName;
	            	_self.formData.partyName = res.data.partyName;
	            	_self.formData.taobaoOrderSn = res.data.taobaoOrderSn;
	            	_self.formData.sourceType = res.data.sourceType;
	            }
	        });
        },
		cancelCreate () {
        	this.$emit('cancel', true);
        },
        confirmCreate() {
        	if(this.formData.partyName == '' || this.formData.partyName == undefined) {
        		layer.msg('老系统订单加载成功之后方可创建！', {timeout:2000});
        		return false;
        	}
        	const _self = this;
	    	http({
	    		instance: _self,
	    		url: api.addOldShippedOrder,
	            type: 'post',
	            data: {
	            	data: {
	            		'orderSn': _self.formData.orderSn,
	            		'shopId': _self.formData.shopId,
	            		'distributorId': _self.formData.distributorId,
	            	},
	            },
	            hasLoading: true,
	            success (res) {
	            	layer.alert('创建成功！系统订单号为<a target="_blank" href="#/ordersManage/omsOrderDetail/orderDetails/' + res.data.orderId + '">' + res.data.orderSn + '</a>', {icon: 6, closeBtn: 0});
	            }
	        });
        },
        selectedShop(data) {
        	if($.isEmptyObject(data)) {
                this.formData.shopId = '';
            }else {
                this.formData.shopId = data.data.shopId;
            }
        },
        seletedDistributor(data) {
        	this.formData.distributorId = data.data.distributorId;
        }
	}
}
</script>

<style scoped>
.create-modal {
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
	text-align: center;
	font-weight: bold;
}
label.control-label {
	padding-left: 0px;
	padding-right: 0px;
}
button {
	margin-left: 20%;
}
.btn {
	padding-left: 16px;
	padding-right: 16px;
}
label {
	overflow:hidden;
	white-space:nowrap;
}
</style>