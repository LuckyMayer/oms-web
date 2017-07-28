<template>
	<div class="order-shipping-detail">
		<dl class="shipping-info">
			<dt>
				| 发货信息
			</dt>
			<dd>
				<div class="col-md-12 no-padding form-horizontal">
					<div class="form-group">
						<div class="col-md-11 no-padding">
							<label class="col-md-1 control-label">发货仓库：</label>
							<div class="col-md-2">
								<input class="form-control input-sm not-editable" readonly v-model="orderDetail.warehouse.warehouseName">
							</div>
							<label class="col-md-1 control-label">仓库类型：</label>
							<div class="col-md-2">
								<input class="form-control input-sm not-editable" readonly v-model="orderDetail.warehouse.warehouseTypeValue">
							</div>
							
							<label class="col-md-1 control-label">指定快递：</label>
							<div class="col-md-2">
								<input class="form-control input-sm not-editable" readonly v-model="orderDetail.shipping.shippingName">
							</div>
							
							<label class="col-md-1 control-label">收件人：</label>
							<div class="col-md-2">
								<input class="form-control input-sm not-editable" readonly v-model="orderDetail.receiverName">
							</div>
						</div>
						<!-- <div class="col-md-1 control-label" style="padding-left:0px; padding-right:0px;">
							<a href="#" @click.prevent="showShippingDetail" style="white-space:nowrap;"><i class="fa fa-angle-down fa-lg"></i>收件详情</a>
						</div> -->
					</div>
				</div>
			</dd>
		</dl>
		<dl class="package-info">
			<dt>
				| 包裹信息
			</dt>
			<dd>
				<table class="table">
					<thead>
						<tr>
							<th>包裹</th>
							<th>快递公司</th>
							<th>快递单号</th>
							<th>商品预估重量</th>
							<th>外箱预估</th>
							<th>实际称重</th>
							<!-- <th width="25%">商品明细</th> -->
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, key) in orderDetail.packages">
							<td>{{key + 1}}</td>
							<td>{{item.shippingName}}</td>
							<td>{{item.logisticsNumber}}</td>
							<td>{{item.goodsEstimateWeight}}</td>
							<td>{{item.boxEstimateWeight}}</td>
							<td>{{item.weight}}</td>
							<!-- <td></td> -->
						</tr>
					</tbody>
				</table>
			</dd>
		</dl>
	</div>
</template>

<script>
import http from '../../../common/http'
import api from '../../../common/api'

export default {
	props: ['orderId','orderDetail'],
	data () {
		return {
			// wmsPackages: [],

		}
	},
	mounted () {
   	
    },
	methods: {
		// getWmsPackage () {
		// 	const _self = this;
	 //    	http({
	 //    		instance: _self,
	 //    		url: api.getWmsPackageByOrderId,
	 //            type: 'post',
	 //            data:{
	 //            	data:{
	 //            		"orderId": _self.orderId, 
	 //            	},
	 //            },
	 //            hasLoading: false,
	 //            success (res) {
	 //            	_self.wmsPackages = res.data;
	 //            }
	 //    	});
		// },
		showShippingDetail() {

		}
	},
}	
</script>

<style scoped>
.order-shipping-detail {
	float: left;
	width: 100%;
	font-size: 12px;
}
.order-shipping-detail dl {
	margin-bottom: 0px;
}
.order-shipping-detail dt {
	font-size: 14px;
	color: #555;
	margin-top: 4px;
	margin-bottom: 2px;
	float: left;
}
.order-shipping-detail dd {
	padding: 10px 0px 10px 0px;
	background-color: #fff;
	width: 100%;
	color: #666;	
	float: left;
}
.order-shipping-detail dd .form-group div {
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
.package-list {
	width: 100%;
}
.package-list th {
	height: 35px;
	text-align: center;
	border-bottom: 1px solid #ccc;
}
.package-list td {
	padding-top: 4px;
	padding-bottom: 4px;
	text-align: center;
}
.form-group {
	margin-left: 0px;
	margin-right: 0px;
}
.form-group div {
	padding-right: 1px;
	padding-left: 0px;
}
.not-editable {
	border: 0px;
	background-color: #fff;
}
</style>