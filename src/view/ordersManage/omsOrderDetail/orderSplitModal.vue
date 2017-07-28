<template>
	<div>
		<component is="overlay" v-show="showOverlay" :on-click="cancelSplitOrder"></component>
    	<div class="order-detail-modal order-split-modal">
    		<div class="order-split-content">
    			<div class="col-md-12 form-horizontal">
					<div class="form-group">
						<label class="col-md-1 control-label">收件人地址：</label>
						<div class="col-md-2 control-label" style="text-align:left;">
							<span>{{splitOrderDetail.receiverAddress}}</span>
						</div>
						<label class="col-md-1 control-label">原仓仓库：</label>
						<div class="col-md-2 control-label" style="text-align:left;">
							<span>{{splitOrderDetail.warehouse.warehouseName}}</span>
						</div>
						<label class="col-md-1 control-label">原仓类型：</label>
						<div class="col-md-1 control-label" style="text-align:left;">
							<span>{{splitOrderDetail.warehouse.warehouseTypeValue}}</span>
						</div>
						<label class="col-md-1 control-label">原仓地区：</label>
						<div class="col-md-1 control-label" style="text-align:left;">
							<span>{{splitOrderDetail.warehouse.warehouseArea | warehouseAreaFilter(facilityArea.facilityAreaList)}}</span>
						</div>
						<label class="col-md-1 control-label">原快递：</label>
						<div class="col-md-1 control-label"  style="text-align:left;">
							<span>{{splitOrderDetail.shipping.shippingName}}</span>
						</div>	
					</div>
				</div>
				<div class="col-md-12 no-padding form-horizontal order-sns">
					<div class="form-group">
						<div class="col-md-12" style="text-align:right;">
							<button v-if="splitOrderGoodses.length > 1" class="btn btn-xs btn-primary" style="margin-top:5px;margin-left:10px;" @click="splitOriginOrder">拆分原单</button>
							<button v-if="stockOut" class="btn btn-xs btn-primary" style="margin-top:5px;margin-left:10px;" @click="splitStockOutOrder">拆分缺货</button>
						</div>
					</div>
				</div>
				<div class="order-goods-table">
					<table class="table">
						<thead>
							<tr>
								<th style="min-width:160px" rowspan="2">商家编码</th>
								<th style="min-width:200px" rowspan="2">商品名称/规格码</th>
								<th rowspan="2" style="min-width:50px">SKU数量</th>
								<template v-for="(item,index) in warehouseList">
									<th :colspan="item.length">
										{{item[0].warehouseArea | warehouseAreaFilter(facilityArea.facilityAreaList)}}
									
									</th>
								</template>
								
								<th rowspan="2" style="min-width:50px">分摊后应收</th>
								<th rowspan="2" style="min-width:50px">操作</th>
							</tr>
							<tr>

								<template v-for="item in warehouseList">
									<th v-for="item1 in item">
										{{item1.warehouse.warehouseName}}<br/>
										<input type="radio" name="all" :value="item1.warehouse.warehouseId" v-model="allWarehouseId" @click="chooseAllWarehouse" >
									</th>
								</template>

							</tr>
						</thead>
						<tbody v-for="(item, index) in splitOrderGoodses">
							<tr v-for="(item1, index1) in item">
								<td v-if="item1.show" :rowspan="item1.rowspan" style="word-wrap:break-word;word-break:break-all;">
									<span v-if="item1.gift" class="gift-icon"></span>
									<span style="padding-left:16px;">{{item1.skuCode}} <br/>* {{item1.numShow}}</span>
									<p>{{item1.name}}</p>
								</td>
								<td style="word-wrap:break-word;word-break:break-all;">
									{{item1.sku.skuName}}
									<br/>
									<select v-if="item1.sku.styleValue1" v-model="item1.sku.styleValue1.id">
										<option v-if="!item1.editable" :value="item1.sku.styleValue1.id">{{item1.sku.styleValue1.value}}</option>
			                    	</select>
			                    	<select v-if="item1.sku.styleValue2" v-model="item1.sku.styleValue2.id">
			                    		<option v-if="!item1.editable" :value="item1.sku.styleValue2.id">{{item1.sku.styleValue2.value}}</option>
			                    	</select>
			                    	<select v-if="item1.sku.styleValue3" v-model="item1.sku.styleValue3.id">
			                    		<option v-if="!item1.editable" :value="item1.sku.styleValue3.id">{{item1.sku.styleValue3.value}}</option>
			                    	</select>
			                    </td>
								<td style="text-align: center;">{{item1.number}}</td>
								<template v-if="item1.summaryResults != undefined">
									<template v-for="warehouseAreaList in item1.summaryResults">
										<td v-for="warehouse in warehouseAreaList" style="text-align: center;">
											{{warehouse.availableQuantity}}<br/>
											<input type="radio" :name="index+'_'+index1" :value="warehouse.warehouse.warehouseId" v-model="item1.choosewarehouseId" @change=" _checkedAll">
										</td>
									</template>
								</template>								
								<template v-else>
									<template v-for="warehouses in warehouseList">
										<td v-for="warehouse in warehouses"></td>
									</template>
								</template>
								<td style="text-align: center;">{{item1.totalFee}}</td>
								<td>
									<input v-if="item1.splitable" type="text" style="width:40px;" :id="index+'_'+index1">
									<a href="#" v-if="!item1.splitable" @click.prevent="editsplitOrderGoodNum(index,index1)"><i class="iconfont">&#xe622;</i>分拆数量</a>
									<a href="#" v-if="item1.splitable" @click.prevent="confirmsplitOrderGoodNum(index,index1)"><i class="iconfont confirm-icon">&#xe626;</i></a>
									<a href="#" v-if="item1.splitable" @click.prevent="cancelsplitOrderGoodNum(index,index1)"><i class="iconfont cancel-icon">&#xe7ca;</i></a>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="col-md-12 form-horizontal action-buttons">
    				<div class="col-md-3 action-button"></div>
    				<div class="col-md-3 action-button">
    					<button class="btn btn-xs btn-default btn-cancel" @click="cancelSplitOrder">取消</button>
    				</div>
    				<div class="col-md-3 action-button">
    					<button class="btn btn-xs btn-primary" @click="confirmSplitOrder">拆分订单</button>
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

export default {
	data () {
		return {
			facilityArea: {
				facilityAreaList: [{
					value: "CENTRAL_CHINA",
					name: "华中",
				},{
					value: "SOUTH_CHINA",
					name: "华南",
				},{
					value: "NORTH_CHINA",
					name: "华北",
				},{
					value: "EAST_CHINA",
					name: "华东",
				},{
					value: "NORTH_WEST",
					name: "西北",
				},{
					value: "NORTH_EAST",
					name: "东北",
				},{
					value: "SOUTH_WEST",
					name: "西南",
				}],
				active: "CENTRAL_CHINA",
			},
			allWarehouseId: "",
		}
	},
	props: {
	    showOverlay: {
	      	type: Boolean,
	      	default: true
	    },
	    splitOrderDetail: {
	    	type: Object,
	    },
	    splitOrderGoodses: {
	    	// type: Array,
	    },
	    warehouseList: {
	    	type: Array,
	    },
	    stockOut: {
	    	type: Boolean,
	    }
	},
	computed: {

	},
	filters: {
		warehouseAreaFilter: function(data, list) {
			var name = '';
			list.forEach(function(item){
				if(data == item.value){
					name =  item.name;
					return false;
				}
			});
			return name;
		}
	},
	methods: {
		 _checkedAll() {
	    	var chooseAll = true;
	    	var val = $("input[name='all']:checked").val()
	    	this.splitOrderGoodses.forEach(function(item) {
	    		item.forEach(function(item1) {
	    			if(item.choosewarehouseId != val) {
	    				chooseAll = false;
	    			}
	    		})
	    	})
	    	if(!chooseAll) {
	    		$("input[name='all']:checked").attr('checked', false);
	    	}
	    },
        cancelSplitOrder () {
        	this.$emit('cancel', false);
        },
        splitOriginOrder () {
        	var SplitOrderVo = {};
        	var orders = [];
        	var splitObj = {};
        	var warehouseId = this.splitOrderDetail.warehouse.warehouseId;
        	var orderId = this.splitOrderDetail.orderId
        	this.splitOrderDetail.orderGoodses.forEach(function(item){
        		var orderGoodsSplitVos = [];
        		item.forEach(function(item1){
        			var OrderGoodsSplitVo  = {
        				orderGoodsId: item1.orderGoodsId, 
        				number: item1.number
        			};

        			orderGoodsSplitVos.push(OrderGoodsSplitVo);
        		});
        		SplitOrderVo = {
        			warehouseId: warehouseId,
        			orderGoodses: orderGoodsSplitVos
        		};
        		orders.push(SplitOrderVo);

        	
        	});

        	splitObj = {
        		orderId: orderId,
        		orders: orders,
        	};

        	this.splitOrder(splitObj);
	    },
	    splitStockOutOrder () {
	    	if(this.splitOrderDetail.orderGoodses.length == 1 && this.splitOrderDetail.orderGoodses[0].length == 1) {
	    		layer.msg('订单只有一个商品，无法缺货拆分！', {timeout:2000});
	    		return false;
	    	}
        	var orders = [];
        	var stockoutOrder = [];
        	var notStockoutOrder = [];
        	var stockoutSplitOrderVo = {};
        	var notStockoutSplitOrderVo = {};
        	var warehouseId = this.splitOrderDetail.warehouse.warehouseId;
        	var orderId = this.splitOrderDetail.orderId
        	this.splitOrderDetail.orderGoodses.forEach(function(item){
        		item.forEach(function(item1){
        			var OrderGoodsSplitVo  = {
        				orderGoodsId: item1.orderGoodsId, 
        				number: item1.number
        			};

        			if(item1.number <= item1.availableQuantity){
        				notStockoutOrder.push(OrderGoodsSplitVo);
        			} else {
        				stockoutOrder.push(OrderGoodsSplitVo);
        			}
        			
        		});
        	});
        	if(stockoutOrder.length > 0){
        		stockoutSplitOrderVo = {
	    			warehouseId: warehouseId,
	    			orderGoodses: stockoutOrder
	    		};
	    		orders.push(stockoutSplitOrderVo);
        	}
        	
        	if(notStockoutOrder.length > 0){
        		notStockoutSplitOrderVo = {
	    			warehouseId: warehouseId,
	    			orderGoodses: notStockoutOrder
	    		};
	    		orders.push(notStockoutSplitOrderVo);
        	}

        	var splitObj = {
        		orderId: orderId,
        		orders: orders,
        	};
        	
        	this.splitOrder(splitObj);
	    },
	    editsplitOrderGoodNum(val1, val2) {
	    	this.splitOrderGoodses[val1][val2].splitable = true;
	    	this.splitOrderGoodses[val1].splice(val2,0);

	    },
	    confirmsplitOrderGoodNum(val1, val2) {
	    	const _self = this;
	    	this.splitOrderGoodses[val1][val2].splitable = false;
	    	var goodTotalNum = this.splitOrderGoodses[val1][val2].number;
	    	var splitGoodsNum = $("#"+val1+"_"+val2).val();
	    	if(Number(splitGoodsNum) >= Number(goodTotalNum) || Number(splitGoodsNum) <= 0) {
	    		layer.msg('拆分数量需大于0且小于SKU数量', {timeout: 2000});
	    		return false;
	    	}
	    	var splitGoods = Object.assign({},this.splitOrderGoodses[val1][val2]);
	    	splitGoods.number = Number(goodTotalNum) - Number(splitGoodsNum);
	    	splitGoods.totalFee = (splitGoods.number/goodTotalNum * splitGoods.totalFee).toFixed(2);
	    	this.splitOrderGoodses[val1][val2].number = splitGoodsNum;
	    	this.splitOrderGoodses[val1][val2].totalFee = (this.splitOrderGoodses[val1][val2].totalFee - splitGoods.totalFee).toFixed(2);
	    	if(splitGoods.group == undefined) {
	    			splitGoods.numShow = Number(goodTotalNum) - Number(splitGoodsNum);
	    			this.splitOrderGoodses[val1][val2].numShow = splitGoodsNum;
	    	}else {
	    		this.splitOrderGoodses[val1][0].rowspan += 1;
	    	}
	    	this.splitOrderGoodses[val1].splice(val2, 0, splitGoods);
	    },
	    cancelsplitOrderGoodNum(val1, val2) {
	    	this.splitOrderGoodses[val1][val2].splitable = false;
	    	this.splitOrderGoodses[val1].splice(val2,0);

	    },

	    splitOrder(data) {
	    	const _self = this;
	    	http({
        		instance: _self,
        		url: api.splitOrder,
                type: 'post',
	            async: false,
                data:{
                	data: data,
                },
                hasLoading: false,
                success (res) {
                    if(res.data.orders.length > 0){
                    	var html = '';
                    	res.data.orders.forEach(function(item, index){
                    		if(index !== 0){
                    			html += '， '
                    		}
                    		html += "<a href='#/ordersManage/omsOrderDetail/orderDetails/"+item.orderId+"' target='_blank'>"+item.orderSn+"</a>";
                    	});
                    }
                    layer.open({
						type: 1,
						title:'拆分成功',
						skin: 'layui-layer-rim', //加上边框
						area: ['420px', '240px'], //宽高
						content: '<p>拆分后订单为:</p><p>'+html+'</p>',
						cancel: function(){
							location.reload();
						}
					});
                },
        	});
	    },
	    chooseAllWarehouse() {
	    	const _self = this;
	    	this.splitOrderGoodses.forEach(function(item){
	    		item.forEach(function(item1){
	    			item1.choosewarehouseId = _self.allWarehouseId;
	    		});
	    	})
	    },
	    confirmSplitOrder() {
	    	var OrderGoodsSplitVo = {};
	    	var orderGoodsSplitVos = [];
	    	var SplitOrderVO = {};
	    	var orders = [];
	    	var orderId = this.splitOrderDetail.orderId;
	    	var BreakException= {};
	    	const _self = this;
	    	try {
				_self.splitOrderGoodses.forEach(function(item){
	    		item.forEach(function(item1){
	    			if(item1.choosewarehouseId == '' ||　item1.choosewarehouseId == undefined){
	    				throw BreakException;
	    			}else {
	    				OrderGoodsSplitVo = {
		    				orderGoodsId: item1.orderGoodsId,
		    				number: item1.number,
		    			}
		    			var exist = false;
		    			orders.forEach(function(item2){
		    				if(item2.warehouseId == item1.choosewarehouseId){
		    					item2.orderGoodses.push(OrderGoodsSplitVo);
		    					exist = true;
		    				}
	   				
		    			});
		    			if(!exist){
		    				SplitOrderVO = {
		    					warehouseId: item1.choosewarehouseId,
		    					orderGoodses: []
		    				};
		    				SplitOrderVO.orderGoodses.push(OrderGoodsSplitVo);
		    				orders.push(SplitOrderVO);
		    			}
	    			}

	    		});

	    	});

	    	var data = {
	    		orderId: orderId,
	    		orders: orders,
	    	}

	    	this.splitOrder(data);
	    	} catch(e){
	    		if(e == BreakException){
	    			layer.msg("请选择仓库", {time:2000});
	    		}
	    	}
	    	
	    }
	},
	components: {overlay}
}
</script>

<style scoped>
.order-detail-modal {
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
}
.order-goods-table {
	overflow-x: auto;
	width: 100%;
}
.order-split-modal {
	width: 1200px;
}
.edit-icon-size {
	font-size: 1.9rem;
}
.fa-check {
	color: #78BF2A;
}
.fa-close {
	color: #F86767;
}
.control-label {
	padding-left: 0px;
	padding-right: 0px;
}
.action-buttons {
	margin-top: 20px;
	margin-bottom: 20px;
}
.action-buttons button{
	padding-right: 12px;
	padding-left: 12px;
	margin-left: 50px;
}
.action-buttons .btn-cancel{
	border-color: #367fa9
}
i {
	font-size: 20px;
}
.confirm-icon {
	color: #78BF2A;
}
.cancel-icon, .delete-icon {
	color: #F86767;
}
.table {
	margin-bottom: 0px;
}
.table td {
	position: relative;
	padding: 4px;
}

</style>