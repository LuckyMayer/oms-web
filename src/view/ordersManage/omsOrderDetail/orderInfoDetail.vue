<template>
	<div class="order-info-detail">
		<dl class="order-source">
			<dt style="margin-top:2px;">
				| 来源去向
			</dt>
			<dd>
				<div class="col-md-12 no-padding form-horizontal">
					<div class="form-group">
						<label class="col-md-1 control-label">店&nbsp;&nbsp;&nbsp;铺：</label>
						<div class="col-md-2">
							<input type="text" class="form-control input-sm not-editable" v-model="orderDetail.shop.shopName" readonly>
						</div>
						<label class="col-md-1 control-label">平&nbsp;&nbsp;&nbsp;台：</label>
						<div class="col-md-2">
							<input type="text" class="form-control input-sm not-editable" v-model="orderDetail.shop.shopPlatformValue" readonly>
						</div>
						
						<label class="col-md-1 control-label">分销商：</label>
						<div class="col-md-2">
							<component is="search-distributor" placeholder=" " @selected="selectedDistributor" :disabled="!orderSourceEditable" :class="{'not-editable': !orderSourceEditable}" :init-distributor="orderDetail.distributor"></component>
						</div>
						
						<label class="col-md-1 control-label">用户ID：</label>
						<div class="col-md-2">
							<input type="text" class="form-control input-sm" :readonly="!orderSourceEditable" :class="{'not-editable': !orderSourceEditable}" v-model.trim="orderDetail.buyer">
						</div>

					</div>
				</div>
				<div class="col-md-12 no-padding form-horizontal">
					<div class="form-group">
						<label class="col-md-1 control-label">收件人：</label>
						<div class="col-md-2">
							<input type="text" class="form-control input-sm" :readonly="!orderSourceEditable" :class="{'not-editable': !orderSourceEditable}" v-model.trim="orderDetail.receiverName">
						</div>
						<label class="col-md-1 control-label">手机号：</label>
						<div class="col-md-2">
							<input type="text" class="form-control input-sm" :readonly="!orderSourceEditable" :class="{'not-editable': !orderSourceEditable}" v-model.trim="orderDetail.receiverMobile">
						</div>
						
						<label class="col-md-1 control-label">电&nbsp;&nbsp;&nbsp;话：</label>
						<div class="col-md-2">
							<input type="text" class="form-control input-sm" :readonly="!orderSourceEditable" :class="{'not-editable': !orderSourceEditable}" v-model.trim="orderDetail.receiverPhone">
						</div>
						
						<label class="col-md-1 control-label">发货条件：</label>
						<div class="col-md-2">
							<input class="form-control input-sm not-editable" readonly :class="{'red': orderDetail.sendConditionType=='SELL_ON_CREDIT'}" v-model="_sendConditionType"/>
						</div>
					</div>
				</div>
				<div class="col-md-12 no-padding form-horizontal">
					<div class="form-group">
						<label class="col-md-1 control-label">地&nbsp;&nbsp;&nbsp;址：</label>
						<div class="col-md-6 order-address">
							<div class="col-md-2">
								<component is="select-region" placeholder="省" region-type="1" parent-id=""  @selected="selectedProvince" :disabled="!orderSourceEditable" :class="{'not-editable': !orderSourceEditable}" required :default-region-id="orderDetail.receiverProvince.regionId"></component>
							</div>
							<label class="col-md-1 control-label">省</label>
							<div class="col-md-2">
								<component is="select-region" placeholder="市" region-type="2" :parent-id="orderDetail.receiverProvince.regionId" @selected="selectedCity" :disabled="!orderSourceEditable" :class="{'not-editable': !orderSourceEditable}" required :default-region-id="orderDetail.receiverCity.regionId"></component>
							</div>
							<label class="col-md-1 control-label">市</label>
							<div class="col-md-2">
								<component is="select-region" placeholder="区" region-type="3" :parent-id="orderDetail.receiverCity.regionId" @selected="selectedDistrict" :disabled="!orderSourceEditable" :class="{'not-editable': !orderSourceEditable}" :default-region-id="orderDetail.receiverDistrict.regionId"></component>
							</div>
							<label class="col-md-1 control-label">区</label>
							<template v-if="orderDetail.receiverStreet.regionId || orderSourceEditable">
								<div class="col-md-2">
									<component is="select-region" placeholder="街道" region-type="4" :parent-id="orderDetail.receiverDistrict.regionId" @selected="selectedStreet" :disabled="!orderSourceEditable" :class="{'not-editable': !orderSourceEditable}" :default-region-id="orderDetail.receiverStreet.regionId"></component>
								</div>
								<label class="col-md-1 control-label">街道</label>
							</template>
						</div>
						<div  class="col-md-4">
							<input type="text" class="form-control input-sm" :readonly="!orderSourceEditable" :class="{'not-editable': !orderSourceEditable}" v-model.trim="orderDetail.receiverAddress">
						</div>
						<div v-if="orderDetail.orderStatus=='WAIT_CHECK' && orderDetail.shippingStatus == 'INIT'" class="col-md-1" style="text-align:right;">
							<a href="#" v-if="!orderSourceEditable" @click.prevent="editOrderSource"><i class="iconfont">&#xe622;</i></a>
							<a href="#" v-if="orderSourceEditable" @click.prevent="confirmOrderSource"><i class="iconfont confirm-icon">&#xe626;</i></a>
							<a href="#" v-if="orderSourceEditable" @click.prevent="cancelOrderSource"><i class="iconfont cancel-icon">&#xe7ca;</i></a>
						</div>
					</div>
				</div>
			</dd>
		</dl>
		<dl class="order-message">
			<dt>
				| 留言信息
				<a href="#" class="btn-a" @click.prevent="AddMessage">添加备注</a>
			</dt>
			<dd>
				<div class="col-md-12 no-padding form-horizontal">
					<div class="col-md-6">
						<div class="form-group">
							<label class="col-md-2 control-label">顾客留言：</label>
                            <div class="col-md-10 control-label">
                               <span class="red">{{orderDetail.buyerMemo}}</span>
                            </div>
						</div>
						<div class="form-group">
							<label class="col-md-2 control-label">小二留言：</label>
                            <div class="col-md-10  control-label">
                               <span class="red">{{orderDetail.sellerMemo}}</span>
                            </div>
						</div>
					</div>
				</div>
			</dd>
		</dl>
		<dl class="order-shipment">
			<dt>
				| 配送信息
			</dt>
			<dd>
				<div class="col-md-12 no-padding form-horizontal">
					<div class="form-group">
						<label class="col-md-1 control-label">仓库：</label>
						<div class="col-md-2">
							<component is="select-warehouse" @selected="selectedWarehouse" placeholder="请选择仓库" :shop-id="orderDetail.shop.shopId" :default-warehouse-id="orderDetail.warehouse.warehouseId" :default-warehouse-name="orderDetail.warehouse.warehouseName" :disabled="!orderShipmentEditable" :class="{'not-editable': !orderShipmentEditable}" ></component>
						</div>
						<label class="col-md-1 control-label">仓库类型：</label>
						<div class="col-md-2  control-label">
							<span>{{orderDetail.warehouse.warehouseTypeValue}}</span>
						</div>
						<label class="col-md-1 control-label">快递方式：</label>
						<div class="col-md-2">
							<component is="select-shipment" @selected="selectedShipment" placeholder="请选择快递" :warehouse-id="orderDetail.warehouse.warehouseId" :default-shipping-id="orderDetail.shipping.shippingId" :default-shipping-name="orderDetail.shipping.shippingName" :disabled="!orderShipmentEditable || orderDetail.warehouse.warehouseId == ''" :class="{'not-editable': !orderShipmentEditable}"></component>
						</div>
						<div v-if="orderDetail.orderStatus=='WAIT_CHECK' && orderDetail.shippingStatus == 'INIT'" class="col-md-3 right-align" style="text-align:right">
							<a href="#" v-if="!orderShipmentEditable" @click.prevent="editOrderShipment"><i class="iconfont">&#xe622;</i></a>
							<a href="#" v-if="orderShipmentEditable" @click.prevent="confirmOrderShipment"><i class="iconfont confirm-icon">&#xe626;</i></a>
							<a href="#" v-if="orderShipmentEditable" @click.prevent="cancelOrderShipment"><i class="iconfont cancel-icon">&#xe7ca;</i></a>
						</div>
					</div>
				</div>
			</dd>
		</dl>
		<dl class="order-goods">
			<dt>
				| 商品信息
			</dt>
			<dd>
				
				<div class="col-md-12 no-padding form-horizontal order-sns">
					<div class="form-group">
						<div class="col-md-10">
							<label v-for="(item,index) in orderDetail.originOrderSns" v-if="item"  style="text-align:left; margin-bottom:0px;">原始订单{{index + 1}}：{{item}}</label>
						</div>
						<div class="col-md-2" style="text-align:right">
							<a href="#" v-if="orderDetail.orderStatus=='WAIT_CHECK' && orderDetail.shippingStatus == 'INIT'" class="btn-a" @click.prevent="splitOrder">拆分订单</a>
						</div>
					</div>
				</div>
				<div class="order-goods-table">
					<table class="table">
						<thead>
							<tr>
								<th width="12%">宝贝</th>
								<th width="4%">宝贝数</th>
								<th width="4%">宝贝分摊</th>
								<th width="28%">单品名称</th>
								<th width="4%">拍下数</th>
								<th width="4%">SKU数量</th>
								<th width="4%">系统库存</th>
								<th width="4%">可审库存</th>
								<th width="6%" @mouseover="tips('price',1)" @mouseout="tips('price',0)" id="price">单价</th>
								<th width="6%" @mouseover="tips('goodDiscount',1)" @mouseout="tips('goodDiscount',0)" id="goodDiscount">商品优惠</th>
								<th width="6%" @mouseover="tips('goodTaxFee',1)" @mouseout="tips('goodTaxFee',0)" id="goodTaxFee">商品关税</th>
								<th width="6%" @mouseover="tips('goodFee',1)" @mouseout="tips('goodFee',0)" id="goodFee">货款小计</th>
								<th width="6%" @mouseover="tips('goodTotalFee',1)" @mouseout="tips('goodTotalFee',0)" id="goodTotalFee">应收小计</th>
								<th width="8%">操作</th>
							</tr>
						</thead>
						<tbody v-for="(item, index) in orderDetail.orderGoodses">
							<tr v-for="(item1, index1) in item">
								<td v-if="item1.show" :rowspan="item1.rowspan" style="padding-left:16px;word-wrap:break-word; word-break:break-all">
									<span v-if="item1.gift" class="gift-icon"></span>
									<span style="vertical-align: middle;">{{item1.skuCode}}</span>
									<p v-if="item1.name">{{item1.name}}</p>
								</td>
								<td v-if="item1.show" :rowspan="item1.rowspan" style="text-align:center;">
									<span style="vertical-align: middle;">{{item1.numShow}}</span>
								</td>
								<td></td>
								<td style="word-wrap:break-word; word-break:break-all">
									{{item1.sku.skuName}}
									<template v-if="item1.sku.styleValue1 || item1.sku.styleValue2 || item1.sku.styleValue3">
										<br/>
										<select v-if="item1.sku.styleValue1" v-model="item1.sku.styleValue1.id">
											<option v-if="!item1.editable" :value="item1.sku.styleValue1.id">{{item1.sku.styleValue1.value}}</option>
				                    		<option v-else v-for="item2 in item1.sku.styleType1.values" :value="item2.id">{{item2.value}}</option>
				                    	</select>
				                    	<select v-if="item1.sku.styleValue2" v-model="item1.sku.styleValue2.id">
				                    		<option v-if="!item1.editable" :value="item1.sku.styleValue2.id">{{item1.sku.styleValue2.value}}</option>
				                    		<option v-else v-for="item2 in item1.sku.styleType2.values" :value="item2.id">{{item2.value}}</option>
				                    	</select>
				                    	<select v-if="item1.sku.styleValue3" v-model="item1.sku.styleValue3.id">
				                    		<option v-if="!item1.editable" :value="item1.sku.styleValue3.id">{{item1.sku.styleValue3.value}}</option>
				                    		<option v-else v-for="item2 in item1.sku.styleType3.values" :value="item2.id">{{item2.value}}</option>
				                    	</select>
			                    	</template>
			                    </td>
								<td>
									<input type="text" class="good-edit" :readonly="!item1.editable" :class="{'not-editable': !item1.editable}" v-model="item1.number">
								</td>
								<td>
									<input type="text" class="good-edit not-editable" readonly v-model="item1.number">
								</td>
								<td style="text-align:center;">{{item1.inventoryQuantity}}</td>
								<td style="text-align:center;">{{item1.availableQuantity}}</td>
								<td>
									<input type="text" class="good-edit" :readonly="!item1.editable" :class="{'not-editable': !item1.editable}" v-model="item1.price" style="text-align:center;">
								</td>
								<td>
									<input type="text" class="good-edit" :readonly="!item1.editable" :class="{'not-editable': !item1.editable}" v-model="item1.discountFee" style="text-align:center;">
								</td>
								<td style="text-align:center;">{{item1.taxFee}}</td>
								<td style="text-align:center;">{{item1.goodsFee}}</td>
								<td style="text-align:center;">{{item1.totalFee}}</td>
								<td style="text-align:center;min-width:64px;">
									<template v-if="orderDetail.orderStatus=='WAIT_CHECK' && orderDetail.shippingStatus == 'INIT'">
										<a href="#" v-if="!item1.editable" @click.prevent="editOrderGood(index,index1)"><i class="iconfont">&#xe622;</i></a>
										<a href="#" v-if="item1.editable" @click.prevent="confirmOrderGood(index,index1)"><i class="iconfont confirm-icon">&#xe626;</i></a>
										<a href="#" v-if="item1.editable" @click.prevent="cancelOrderGood(index,index1)"><i class="iconfont cancel-icon">&#xe7ca;</i></a>
										<a href="#" @click.prevent="deleteOrderGood(index,index1)"><i class="iconfont delete-icon" >&#xe613;</i></a>
									</template>
								</td>
							</tr>
						</tbody>
						<tfoot>
							<td colspan="14" style="line-height:20px; color: #111; text-align: right;">
								<span @mouseover="tips('orderDiscountFee',1)" @mouseout="tips('orderDiscountFee',0)" id="orderDiscountFee">订单优惠：</span>
								<input type="text" :readonly="!orderGoodsFeeEditable" :class="{'not-editable': !orderGoodsFeeEditable}" v-model="orderDetail.discountFee">
								邮费：
								<input type="text" :readonly="!orderGoodsFeeEditable" :class="{'not-editable': !orderGoodsFeeEditable}" v-model="orderDetail.postFee">
								货款总额：
								<input type="text" class="not-editable" readonly v-model="orderDetail.goodsFee">
								<span @mouseover="tips('totalDiscountFee',1)" @mouseout="tips('totalDiscountFee',0)" id="totalDiscountFee">总优惠金额：</span>
								<input type="text" class="not-editable" readonly v-model="orderDetail.totalDiscountFee">
								<span @mouseover="tips('totalFee',1)" @mouseout="tips('totalFee',0)" id="totalFee">应收金额：</span>
								<input type="text" class="not-editable" readonly v-model="orderDetail.totalFee">
								<div v-if="orderDetail.orderStatus=='WAIT_CHECK' && orderDetail.shippingStatus == 'INIT'" style="text-align:right; float:right; margin-left:20px;">
									<a href="#" v-if="!orderGoodsFeeEditable" @click.prevent="editOrderGoodsFee"><i class="iconfont">&#xe622;</i></a>
									<a href="#" v-if="orderGoodsFeeEditable" @click.prevent="confirmOrderGoodsFee"><i class="iconfont confirm-icon">&#xe626;</i></a>
									<a href="#" v-if="orderGoodsFeeEditable" @click.prevent="cancelOrderGoodsFee"><i class="iconfont cancel-icon">&#xe7ca;</i></a>
								</div>
							</td>
						</tfoot>
						<tfoot>
							<tr>
								<td style="text-align:center;">总计</td>
								<td style="text-align:center;">{{orderDetail.orderGoodsNum}}</td>
								<td></td>
								<td></td>
								<td style="text-align:center;">
									{{orderDetail.totalSkuNum}}
								</td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td style="text-align:center;">{{orderDetail.totalSkuDiscountFee}}</td>
								<td style="text-align:center;">{{orderDetail.taxFee}}</td>
								<td style="text-align:center;">{{orderDetail.goodsFee}}</td>
								<td style="text-align:center;">{{(Number(orderDetail.totalFee) - Number(orderDetail.postFee)).toFixed(2)}}</td>
								<td></td>
							</tr>
						</tfoot>
						
					</table>
				</div>
				<div  v-if="orderDetail.orderStatus=='WAIT_CHECK' && orderDetail.shippingStatus == 'INIT'" class="order-good-add col-md-12 no-padding form-horizontal">
		    		<div class="form-group" style="margin-top:6px; margin-bottom:4px;">
		    			<div class="col-md-2" style="padding-left:14px;">
	                    	<component is="select-goods-type-add" @selected="changeSingleOrGroup"></component>
	                    </div>
						<div class="col-md-2 goods-padding"> 
		    				<label class="radio-inline col-md-5" style="padding-left:24px;">
		    					<input type="radio" name="isGift"value="0" v-model="addGoods.isGift" @change="changeIsGift"/>商品
		    				</label>
		    				<label class="radio-inline col-md-5" style="padding-left:24px;">
		                    	<input type="radio" name="isGift" value="1" v-model="addGoods.isGift" @change="changeIsGift"/>赠品
		    				</label>
		                </div>
	                </div>
	                <div class="form-group">
		    			<div class="col-md-2 no-padding">
		    				<label class="col-md-5 control-label">商家编码</label>
		                    <div class="col-md-7 no-padding">
		                    	<component v-if="goodsType.currentGoodsType == '1'" is="search-goods-sku-code-for-order"  :init-good="addGoods" @selected="selectGoodsSkuCode"></component>
		                    	<component v-else is="search-group-goods-sku-code-for-order" :init-good="addGoods.addOuterIid" @selected="selectGroupGoodsSkuCode"></component>
		                    </div>
		                </div>
		                <div class="col-md-3 no-padding">
		    				<label class="col-md-3 control-label">商品名称</label>
		                    <div class="col-md-9 no-padding">
		                    	<component v-if="goodsType.currentGoodsType == '1'" is="search-goods-name-for-order" :init-good="addGoods" @selected="fetchGoodSkus"></component>
		                    	<component v-else is="search-group-goods-name-for-order" :init-good="addGoods" @selected="fetchGroupGoodSkus" ></component>
		                    </div>
		                </div>
		                <div v-if="addGoods.styleType1Display==true" class="col-md-1 no-padding">   
		    				<!-- <label class="col-md-5 control-label">{{addGoods.addStyleType1.styleType.name}}</label> -->
		                    <div class="col-md-12">
		                    	<select class="form-control input-sm no-padding" v-model="addGoods.addStyleType1.active">
		                    		<option v-for="item in addGoods.addStyleType1.styleValues" :value="item.id">{{item.value}}</option>
		                    	</select>
		                    </div>
		                </div>
		                <div v-if="addGoods.styleType2Display==true" class="col-md-1 no-padding">   
		    				<!-- <label class="col-md-5 control-label">{{addGoods.addStyleType2.styleType.name}}</label> -->
		                    <div class="col-md-12">
		                    	<select class="form-control input-sm no-padding" v-model="addGoods.addStyleType2.active">
		                    		<option v-for="item in addGoods.addStyleType2.styleValues" :value="item.id">{{item.value}}</option>
		                    	</select>
		                    </div>
		                </div>
		                <div v-if="addGoods.styleType3Display==true" class="col-md-1 no-padding">   
		    				<!-- <label class="col-md-5 control-label">{{addGoods.addStyleType3.styleType.name}}</label> -->
		                    <div class="col-md-12">
		                    	<select class="form-control input-sm no-padding" v-model="addGoods.addStyleType3.active">
		                    		<option v-for="item in addGoods.addStyleType3.styleValues" :value="item.id">{{item.value}}</option>
		                    	</select>
		                    </div>
		                </div>
		                <div class="col-md-1 no-padding">  
		    				<label class="col-md-6 control-label">数量</label>
		                    <div class="col-md-6 no-padding">
		                        <input type="number" min="1" class="form-control input-sm no-padding" v-model="addGoods.addQuantity" />
		                    </div>
		                </div>
		                <div class="col-md-1 no-padding"> 
		    				<label class="col-md-6 control-label">单价</label>
		                    <div class="col-md-6 no-padding">
		                        <input type="text" class="form-control input-sm no-padding" style="text-align:center;" v-model="addGoods.addPrice" :disabled="addGoods.isGift=='1'"/>
		                    </div>
		                </div>
		                <div class="col-md-1 no-padding"> 
		    				<label class="col-md-6 control-label">税费</label>
		                    <div class="col-md-6 no-padding">
		                        <input type="text" class="form-control input-sm no-padding" style="text-align:center;"  v-model="addGoods.addTaxFee" :disabled="addGoods.isGift=='1'"/>
		                    </div>
		                </div>
		                
		                <div class="col-md-1" style="padding-left:10px;"> 
		    				<button class="btn btn-xs btn-info" style="margin-top:4px;"@click.prevent="addGoodsToOrder" :disabled="addGoods.addGoodsDisabled">添加</button>
		    			</div> 
	                </div> 
				</div>
			</dd>
		</dl>
		<!-- <dl class="order-payment">
			<dt>
				| 应收信息
			</dt>
			<dd>
				<div class="pay-list">
					<table class="table">
						<thead>
							<tr>
								<th>应收项目</th>
								<th>应收</th>
							</tr>
						</thead>
						<tbody>
							<tr>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="pay-record">
					<table class="table">
						<thead>
							<tr>
								<th>收款/退款</th>
								<th>支付/退款方式</th>
								<th>金额</th>
								<th>小计</th>
								<th>操作人</th>
								<th>时间</th>
							</tr>
						</thead>
						<tbody>
							<tr>
							</tr>
						</tbody>
					</table>
				</div>
			</dd>
		</dl> -->
		<dl class="order-invoice">
			<dt>
				| 发票信息
				<a href="#" class="btn-a" @click.prevent="applyForInvoice">申请开票</a>
			</dt>
			<dd style="min-height:30px;">
				<div class="col-md-12 no-padding form-horizontal">
					<div class="form-group" v-for="item in invoiceInfo">
						<div class="col-md-11 no-padding">
							<label class="col-md-1 control-label">发票类型：</label>
							<div class="col-md-1 control-label">
								<!-- <component is="select-invoice-type" :disabled="!orderInvoiceEditable" :class="{'not-editable': !orderInvoiceEditable}" ></component> -->
								<span>{{item.type | typeFilter}}</span>
							</div>
							<label class="col-md-1 control-label">抬头：</label>
							<div class="col-md-1 control-label">
								<span>{{item.title}}</span>
							</div>
							<label class="col-md-1 control-label">发票状态：</label>
							<div class="col-md-1 control-label">
								<span>{{item.status | statusFilter}}</span>
							</div>
							<label class="col-md-1 control-label">寄出快递：</label>
							<div class="col-md-1 control-label">
								<span v-if="item.sendShipping!=undefined">{{item.sendShipping.shippingName}}</span>
							</div>
							<label class="col-md-1 control-label">寄出快递单号：</label>
							<div class="col-md-2 control-label">
								<span>{{item.sendLogisticsNumber}}</span>
							</div>
						</div>
						
						<!-- <div v-if="orderDetail.orderStatus=='WAIT_CHECK'" class="col-md-1" style="text-align:right">
							<a href="#" v-if="!orderInvoiceEditable" @click.prevent="editOrderInvoice"><i class="iconfont">&#xe622;</i></a>
							<a href="#" v-if="orderInvoiceEditable" @click.prevent="confirmOrderInvoice"><i class="iconfont confirm-icon">&#xe626;</i></a>
							<a href="#" v-if="orderInvoiceEditable" @click.prevent="cancelOrderInvoice"><i class="iconfont cancel-icon">&#xe7ca;</i></a>
						</div> -->
					</div>
				</div>
			</dd>
		</dl>

		
		<!-- <component is="order-invoice-modal" v-if="showInvoiceModal" :show-overlay="showOverlay" @cancel="cancelInvoice" @confirm=""></component> -->

		<component is="sale-invoice-detail-modal" v-if="showInvoiceModal" :order-sn="orderDetail.orderSn" @cancel="cancelInvoice" ></component>
		
		<component is="order-split-modal" v-if="showSplitOrderModal && orderWarehouseInventory && splitOrderwarehouseAreaList" :stock-out="stockOut" :split-order-goodses="splitOrderGoodses" :warehouse-list="splitOrderwarehouseAreaList" @cancel="cancelSplitOrder" :split-order-detail="splitOrderDetail" @confirm=""></component>

		<component is="add-note-modal" v-if="showMessageAddModal" :show-overlay="showOverlay" @cancel="cancelMessageAdd" @confirm="confirmCommentAction"></component>

	</div>
	
</template>

<script >
import {dealWithOrderGoods} from '../../../common/orderGoodses'
import http from '../../../common/http'
import api from '../../../common/api'
import initStyle from '../../../common/initStyle'
import overlay from '../../../component/overlay'
import addNoteModal from '../../../component/addNoteModal'
import selectWarehouse from '../../../component/selectWarehouse'
import selectShipment from '../../../component/selectShipment'
import selectRegion from '../../../component/selectRegion'
import orderSplitModal from './orderSplitModal'
// import orderInvoiceModal from './orderInvoiceModal'
import saleInvoiceDetailModal from '../../finance/saleInvoiceDetailModal'
import searchDistributor from '../../../component/searchDistributor'
import selectInvoiceType from '../../../component/selectInvoiceType'
import searchGoodsSkuCodeForOrder from '../../../component/searchGoodsSkuCodeForOrder'
import searchGroupGoodsSkuCodeForOrder from '../../../component/searchGroupGoodsSkuCodeForOrder'
import searchGoodsNameForOrder from '../../../component/searchGoodsNameForOrder'
import searchGroupGoodsNameForOrder from '../../../component/searchGroupGoodsNameForOrder'
import selectGoodsTypeAdd from '../../../component/selectGoodsTypeAdd'

export default{
	props: ['orderId', 'orderDetail'],
	data () {
		return {
			stockOut: false,
			splitOrderGoodses: {},
			splitOrderDetail: {},
			showOverlay:true,
			showInvoiceModal: false,
			showSplitOrderModal: false,
			showMessageAddModal: false,
			orderSourceEditable: false,
			orderShipmentEditable: false,
			orderGoodsFeeEditable: false,
			orderInvoiceEditable:false,
            orderSource: {},
            orderShipment: {},
            orderGoodsFee: {},
            orderWarehouseInventory: [],
            commentActions: [],
            invoiceInfo: [],
            splitOrderwarehouseAreaList: [],
            orderSource: {
            	orderId: '',
            	distributorId: '',
            	distributorName: '',
            	buyer: '',
            	receiverName : '',
            	receiverMobile: '',
            	receiverPhone: '',
            	receiverProvinceId: '',
            	receiverCityId: '',
            	receiverDistrictId: '',
            	receiverStreetId: '',
            	receiverAddress: ''
            },
            orderShippingFacility: {
            	orderId: '',
            	warehouseId: '',
            	shippingId: ''
            },
            orderFee: {
            	orderId: '',
				postFee: 0,
				discountFee: 0
            },
            orderGood: {
            	orderGoodsId: '',
				goodsId:'',
				styleValue1:'',
				styleValue2:'',
				styleValue3:'',
				number: 0,
				price: 0,
				discountFee: 0
            },
            addGoodToOrder: {
            	orderId: '',
				gift: 0,
				partyId: '',
				skuId: '',
				number: 0,
				price: 0,
				taxFee: 0
            },
            goodsType: {
				currentGoodsType: 1,
            },
            addGoods: {
				addGoodsDisabled: true,
				styleType1Display: false,
				styleType2Display: false,
				styleType3Display: false,
				addStyleType1: {
					active: "",
					styleType:{
						name: "",
						id: ""
					},
					styleValues:[],
				},
				addStyleType2: {
					active: "",
					styleType:{
						name: "",
						id: ""
					},
					styleValues:[],
				},
				addStyleType3: {
					active: "",
					styleType:{
						name: "",
						id: ""
					},
					styleValues:[],
				},
				addOuterSkuId: "",
				addOuterIid: "",
				addGoodsId: "",
				addGoodsName: "",
				addPrice:"",
				addQuantity: "",
				isGift:0,
				addTaxFee: ""
			},
		}
	},
	mounted () {
		this.$nextTick(() => {
	      	initStyle();
	      	this.getInvoiceInfoByOrderId();
	    });
		
	},
	computed: {
		_sendConditionType() {
			const sendConditionTypeMapping = {
    			'PAID': '先款后货',
    			'COD_SHIP': 'COD',
    			'SELL_ON_CREDIT': '赊销',
    		};
    		return sendConditionTypeMapping[this.orderDetail.sendConditionType];
		}
	},
	filters: {
    	sendConditionTypeFilter: function(data) {
    		const sendConditionTypeMapping = {
    			'PAID': '先款后货',
    			'COD_SHIP': 'COD',
    			'SELL_ON_CREDIT': '赊销',
    		};
    		return sendConditionTypeMapping[data];

    	},
    	statusFilter: function(val) {
	      	const typeObj = {
		        INIT: '待开票',
		        INVOICED: '已开票',
		        CANCELLED: '已作废'
	      	};
			for (let i in typeObj) {
				if (i == val) {
					return typeObj[i];
				}
			}
	    },
	    typeFilter: function(val) {
	    	const typeObj = {
	    		ADDED: '增票',
	       		COMMON: '普票',
	     	};
	      	for (let i in typeObj) {
	        	if (i == val) {
	          	return typeObj[i];
	        	}
	      	}
	    },
    },
	methods: {
		/**======各种modal start=======**/
		confirmCommentAction (data) {
        	var htmlContent = "<span style='color:"+data.color+"'>"+data.note+"</span>";
        	const _self = this;
        	http({
	    		instance: _self,
	    		url: api.addOrderAction,
	            type: 'post',
	            data:{
	            	data:{
	            		'orderId': _self.orderId,
	            		'type': 'COMMENT',
	            		'subType': 'ADD',
	            		'orderGoodsId': '',
	            		'content': htmlContent,
	            		'displayContent': data.note, 
	            	},
	            },
	            hasLoading: false,
	            success (res) {
	            	_self.commentActions.push(res.data);
	            	_self.showMessageAddModal = false;
	            	_self.$emit('reflesh-actions', true);
	            },
	            fail () {
	            	layer.msg('添加备注失败，请重试~', {
	                    time: 2000
	                });
	            }
	    	});
        },
		getOrderWarehouseInventory(){
			const _self = this;
			http({
				instance: _self,
				url: api.getOrderWarehouseInventorySummary,
				type: "post",
				data: {
					data: {
						orderId: _self.orderId,
					}
				},
				hasLoading: true,
	            success (res) {
	            	if(!$.isEmptyObject(res.data)){
	            		if(res.data.orderGoodsInventorys.length > 0){
		            		res.data.orderGoodsInventorys.forEach(function(item){
	        					item.summaryResults.sort(function(a,b){
	        						var s = a.warehouse.warehouseArea.toLowerCase();
	        						var t = b.warehouse.warehouseArea.toLowerCase();
	        						if(s < t) 
	        							return -1;
	        						if(s > t)
	        							return 1;
	        					});
	        					
	    						var warehouseAreaListTemp = [];
	    						item.summaryResults.forEach(function(item1){
	    							var warehouseAreaTemp = item1.warehouse.warehouseArea;
				            		var exist = false;
				            		var addIndex1 = 0;
				            		warehouseAreaListTemp.forEach(function(item2,index2){
				            			item2.forEach(function(item3,index3){
				            				if(item3.warehouseArea = warehouseAreaTemp){
				            					addIndex1 = index2;
				            					exist = true;			
				            				}
				            			});
				            		});
				            		if(!exist){
				            			var len = warehouseAreaListTemp.length;
				            			warehouseAreaListTemp[len] = [];
				            			warehouseAreaListTemp[len].push(item1);
				            		}else {
				            			warehouseAreaListTemp[addIndex1].push(item1);
				            		}

	    						});
	    						item.summaryResults = warehouseAreaListTemp;
	        						
	        					
	        				});

		            		var orderGoods = JSON.parse(JSON.stringify(_self.orderDetail.orderGoodses));
		            		orderGoods.forEach(function(item,index){
		            			item.forEach(function(item1,index1){
		            				res.data.orderGoodsInventorys.forEach(function(item2){

		            					
		            					if(item1.orderGoodsId == item2.orderGoodsId){

		            						// _self.orderDetail.orderGoodses[index][index1]['summaryResults'] = item2.summaryResults;
		            						_self.$set(orderGoods[index][index1],'summaryResults', item2.summaryResults);
		            						return false;
		            					}
		            				});
		            			});
		            		});
		            		_self.splitOrderGoodses = orderGoods;
		            		_self.splitOrderwarehouseAreaList = orderGoods[0][0].summaryResults;
		            	}
	            	}
	            }

			});
		},
		getInvoiceInfoByOrderId() {
			const _self = this;
			http({
				instance: _self,
				url: api.getSaleInvoiceByOrderId,
				type: "post",
				data: {
					data: {
						orderId: _self.orderId,
					}
				},
				hasLoading: true,
	            success (res) {
	            	_self.invoiceInfo = res.data;
	            }
	        });
		},
		applyForInvoice () {
			this.showInvoiceModal = true;
		},
		splitOrder () {
			const _self = this;
			_self.stockOut = false;
			this.orderDetail.orderGoodses.forEach(function(item,index){
				item.forEach(function(item1,index1){
					if(item1.availableQuantity < item1.number) {
						_self.stockOut = true;
					}
					if(item1.editable == true){
						_self.cancelOrderGood(index, index1);
					}
				});
			});
			_self.getOrderWarehouseInventory();
			_self.splitOrderDetail = JSON.parse(JSON.stringify(_self.orderDetail));
			_self.showSplitOrderModal = true;
		},
		AddMessage () {
			this.showMessageAddModal = true;
		},
		cancelInvoice () {
        	this.showInvoiceModal = false;
        	this.getSaleInvoiceByOrderId();
        },
        cancelSplitOrder () {
        	this.showSplitOrderModal = false;
        },
        cancelMessageAdd () {
        	this.showMessageAddModal = false;
        },
        /**======各种modal end=======**/

        /**==========获取内部留言 start===========**/
        getCommentActionList () {
        	const _self = this;
        	http({
	    		instance: _self,
	    		url: api.getOrderActionList,
	            type: 'post',
	            data:{
	            	data:{
	            		orderId: _self.orderId, 
	            		type: "COMMENT",
	            	},
	            },
	            hasLoading: false,
	            success (res) {
	            	_self.commentActions = res.data;
	            }
	    	});
        },
        /**==========获取内部留言 end===========**/


      	/**=========配送信息模块 start============**/
      	getWarehouseDetail(data) {
			const _self = this;
        	http({
	    		instance: _self,
	    		url: api.getWarehouseDetail,
	            type: 'post',
	            data:{
	            	data:{
	            		warehouseId: data, 
	            	},
	            },
	            hasLoading: false,
	            success (res) {
	            	_self.orderDetail.warehouse.warehouseTypeValue = res.data.warehouseTypeValue;
	            }
	    	});
      	},
        selectedWarehouse (data) {
        	this.orderDetail.warehouse.warehouseId = data.data;
        	this.orderDetail.shipping.shippingId = '';
        	if(data.data == '') {
        		this.orderDetail.warehouse.warehouseTypeValue = '';
        	}else {
        		this.getWarehouseDetail(data.data);
        	}
        },
        selectedShipment (data) {
        	this.orderDetail.shipping.shippingId = data.data;
        },
        editOrderShipment () {
        	this.orderShippingFacility = {
            	orderId: this.orderId,
            	warehouseId: this.orderDetail.warehouse.warehouseId,
            	shippingId: this.orderDetail.shipping.shippingId,
            };
        	this.orderShipmentEditable = true;
        },
        confirmOrderShipment () {//订单的仓库快递修改
        	//验证是否为空
        	if(this.orderDetail.warehouse.warehouseId == '' || this.orderDetail.shipping.shippingId == '') {
        		layer.msg('发货仓和快递不能为空！', {timeout: 2000});
        		return false;
        	}
        	this.orderShippingFacility = {
            	orderId: this.orderId,
            	warehouseId: this.orderDetail.warehouse.warehouseId,
            	shippingId: this.orderDetail.shipping.shippingId,
            };
        	const _self = this;
        	http({
	    		instance: _self,
	    		url: api.modifyOrderFacilityShipping,
	            type: 'post',
	            data:{
	            	data: _self.orderShippingFacility
	            },
	            hasLoading: true,
	            success (res) {
	            	_self.orderShipmentEditable = false;
	            	_self.$emit('reflesh-actions', true);
	            }
	    	});
        	
        },
        cancelOrderShipment () {
        	this.orderDetail.shipping.shippingId = this.orderShippingFacility.shippingId;
        	this.orderDetail.warehouse.warehouseId = this.orderShippingFacility.warehouseId;
        	this.orderShipmentEditable = false;
        },
        /**=========配送信息模块 end============**/

        /**=========来源去向模块 start============**/
        selectedProvince (data) {
        	this.orderDetail.receiverProvince.regionId = data.data.regionId;
        	this.orderDetail.receiverProvince.regionName = data.data.regionName;
        	this.orderDetail.receiverCity.regionId = "";
        	this.orderDetail.receiverCity.regionName = "";
        	this.orderDetail.receiverDistrict.regionId = "";
        	this.orderDetail.receiverDistrict.regionName = "";

        },
        selectedCity (data) {
        	this.orderDetail.receiverCity.regionId = data.data.regionId;
        	this.orderDetail.receiverCity.regionName = data.data.regionName;
        	this.orderDetail.receiverDistrict.regionId = "";
        	this.orderDetail.receiverDistrict.regionName = "";
        	this.orderDetail.receiverStreet.regionId = "";
        	this.orderDetail.receiverStreet.regionName = "";
        },
        selectedDistrict (data) {
        	this.orderDetail.receiverDistrict.regionId = data.data.regionId
        	this.orderDetail.receiverDistrict.regionName = data.data.regionName;
        	this.orderDetail.receiverStreet.regionId = "";
        	this.orderDetail.receiverStreet.regionName = "";
        },
        selectedStreet(data) {
        	this.orderDetail.receiverStreet.regionId = data.data.regionId
        	this.orderDetail.receiverStreet.regionName = data.data.regionName;
        },
        editOrderSource () {
        	this.orderSource = {
        		orderId: this.orderId,
        		distributorId: this.orderDetail.distributor.distributorId,
            	distributorName: this.orderDetail.distributor.distributorName,
            	buyer: this.orderDetail.buyer,
            	receiverName : this.orderDetail.receiverName,
            	receiverMobile: this.orderDetail.receiverMobile,
            	receiverPhone: this.orderDetail.receiverPhone,
            	receiverProvinceId: this.orderDetail.receiverProvince.regionId,
            	receiverCityId: this.orderDetail.receiverCity.regionId,
            	receiverDistrictId: this.orderDetail.receiverDistrict.regionId || '',
            	receiverStreetId: this.orderDetail.receiverStreet.regionId || '',
            	receiverAddress: this.orderDetail.receiverAddress
        	};
        	this.orderSourceEditable = true;
        },
        confirmOrderSource () {
        	//验证是否为空的问题
        	if(this.orderDetail.distributor.distributorId == '' && this.orderDetail.buyer == '') {
        		layer.msg('用户ID和分销商不能同时为空！', {timeout: 2000});
        		return false;
        	}
        	if(this.orderDetail.receiverName == '' || this.orderDetail.receiverMobile == '' || this.orderDetail.receiverProvince.regionId == '' || this.orderDetail.receiverCity.regionId == '' 
        		|| this.orderDetail.receiverDistrict.regionId == '' || this.orderDetail.receiverAddress == '') {
        		layer.msg('收件人、手机号、省-市-区、详细地址未必填字段，不能为空！', {timeout: 2000});
        		return false;
        	}else {

        	}
        	if(this.orderDetail.receiverMobile != '' && !this.orderDetail.receiverMobile.match(/^1[3-9]\d{9}$/)) {
        		layer.msg('手机号码不符合规定格式！', {timeout: 2000});
        		return false;
        	}
        	if(this.orderDetail.receiverPhone != '' && !this.orderDetail.receiverPhone.match(/^[0-9-]+$/)) {
        		layer.msg('电话号码不符合规定格式！', {timeout: 2000});
        		return false;
        	}
			this.orderSource = {
				orderId: this.orderId,
        		distributorId: this.orderDetail.distributor.distributorId,
            	distributorName: this.orderDetail.distributor.distributorName,
            	buyer: this.orderDetail.buyer,
            	receiverName : this.orderDetail.receiverName,
            	receiverMobile: this.orderDetail.receiverMobile,
            	receiverPhone: this.orderDetail.receiverPhone,
            	receiverProvince: this.orderDetail.receiverProvince.regionId,
            	receiverCity: this.orderDetail.receiverCity.regionId,
            	receiverDistrict: this.orderDetail.receiverDistrict.regionId,
            	receiverStreet: this.orderDetail.receiverStreet.regionId,
            	receiverAddress: this.orderDetail.receiverAddress
        	};
        	const _self = this;
        	http({
	    		instance: _self,
	    		url: api.modifyOrderReceiverInfo,
	            type: 'post',
	            data:{
	            	data: this.orderSource,
	            },
	            hasLoading: true,
	            success (res) {
	            	_self.orderSourceEditable = false;
	            	_self.$emit('reflesh-actions', true);
	            }
	    	});
        },
        cancelOrderSource () { 	
        	this.orderDetail.distributor.distributorId = this.orderSource.distributorId;
        	this.orderDetail.distributor.distributorName = this.orderSource.distributorName;
        	this.orderDetail.buyer = this.orderSource.buyer;
        	this.orderDetail.receiverName = this.orderSource.receiverName;
        	this.orderDetail.receiverMobile = this.orderSource.receiverMobile;
        	this.orderDetail.receiverPhone = this.orderSource.receiverPhone;
        	this.orderDetail.receiverProvince.regionId = this.orderSource.receiverProvinceId;
        	this.orderDetail.receiverCity.regionId = this.orderSource.receiverCityId;
        	this.orderDetail.receiverDistrict.regionId = this.orderSource.receiverDistrictId;
        	this.orderDetail.receiverStreet.regionId = this.orderSource.receiverStreetId;
        	this.orderDetail.receiverAddress = this.orderSource.receiverAddress;
        	this.orderSourceEditable = false;
        },
        /**=========来源去向模块 end============**/
        
        /**=========发票信息模块 start============**/
        editOrderInvoice () {
        	this.orderInvoiceEditable = true;
        },
        confirmOrderInvoice () {
        	this.orderInvoiceEditable = false;
        	_self.$emit('reflesh-actions', true);
        },
        cancelOrderInvoice () {
        	this.orderInvoiceEditable = false;
        },
		/**=========发票信息模块 end============**/

        /**================订单商品修改模块start==================**/
        editOrderGoodsFee () {
        	this.orderFee = {
        		orderId: this.orderDetail.orderId,
        		postFee: this.orderDetail.postFee,
        		discountFee: this.orderDetail.discountFee
        	};
        	this.orderGoodsFeeEditable = true;
        },
        confirmOrderGoodsFee () {//修改订单邮费和订单优惠
        	//验证订单优惠和邮费
        	const _self = this;
        	if(_self.orderDetail.postFee < 0 || _self.orderDetail.discountFee < 0) {
        		layer.msg('订单优惠和订单邮费必须大于等于0！', {timeout: 2000});
        		return false;
        	}
        	const temp = _self.orderDetail.discountFee - _self.orderFee.discountFee;
        	_self.orderFee = {
        		orderId: _self.orderDetail.orderId,
        		postFee: _self.orderDetail.postFee,
        		discountFee: _self.orderDetail.discountFee
        	};
        	http({
	    		instance: _self,
	    		url: api.modifyPostAndDiscountFee,
	            type: 'post',
	            data:{
	            	data: _self.orderFee
	            },
	            hasLoading: true,
	            success (res) {
	       //      	var tempObj = dealWithOrderGoods(res.data.orderGoodses);
				    // _self.orderDetail.orderGoodses = tempObj.orderGoods; 
				    // _self.orderDetail.totalSkuDiscountFee = tempObj.totalSkuDiscountFee; 
				    // _self.orderDetail.totalSkuNum = tempObj.totalSkuNum; 
				    // _self.orderDetail.orderGoodsNum = tempObj.orderGoodsNum; 
				    // _self.orderDetail.originOrderSns = tempObj.originOrderSns; 
				    // _self.orderDetail.totalDiscountFee = (Number(_self.orderDetail.discountFee) + Number(tempObj.totalSkuDiscountFee)).toFixed(2);

				    // _self.orderDetail.goodsFee = res.data.goodsFee.toFixed(2);
				    // _self.orderDetail.totalFee = res.data.totalFee.toFixed(2);
				    // _self.orderDetail.taxFee = res.data.taxFee.toFixed(2);

	            	_self.orderGoodsFeeEditable = false;
				    _self.$emit('reflesh-order', true);
	            	_self.$emit('reflesh-actions', true);
	            }
	    	});
        },
        cancelOrderGoodsFee () {
        	this.orderDetail.postFee = this.orderFee.postFee;
        	this.orderDetail.discountFee = this.orderFee.discountFee;
        	this.orderGoodsFeeEditable = false;
        },
        editOrderGood (val1,val2) {
        	var styleTypeList = [];
        	this.orderGood = {
        		orderGoodsId: this.orderDetail.orderGoodses[val1][val2].orderGoodsId,
				goodsId:this.orderDetail.orderGoodses[val1][val2].sku.goods.id,
				number: this.orderDetail.orderGoodses[val1][val2].number,
				price: this.orderDetail.orderGoodses[val1][val2].price,
				discountFee: this.orderDetail.orderGoodses[val1][val2].discountFee,
				styleValue1: (this.orderDetail.orderGoodses[val1][val2].sku.styleValue1 == undefined) ? '' :　this.orderDetail.orderGoodses[val1][val2].sku.styleValue1.id,
				styleValue2: (this.orderDetail.orderGoodses[val1][val2].sku.styleValue2 == undefined) ? '' :　this.orderDetail.orderGoodses[val1][val2].sku.styleValue2.id,
				styleValue3: (this.orderDetail.orderGoodses[val1][val2].sku.styleValue3 == undefined) ? '' :　this.orderDetail.orderGoodses[val1][val2].sku.styleValue3.id,
        	}

        	if(this.orderDetail.orderGoodses[val1][val2].sku.styleValue1 || this.orderDetail.orderGoodses[val1][val2].sku.styleValue2 || this.orderDetail.orderGoodses[val1][val2].sku.styleValue3){
        		this.fetchOrderGoodSkus(val1,val2);
        	}
        	
        	this.orderDetail.orderGoodses[val1][val2].editable = true;
        	var tempOrderGoodses = this.orderDetail.orderGoodses;
        	this.orderDetail.orderGoodses = [];
        	this.orderDetail.orderGoodses = tempOrderGoodses;

        },
        confirmOrderGood (val1,val2) {
        	const _self = this;
        	if(!_self.orderDetail.orderGoodses[val1][val2].gift) {//非赠品
        		if(_self.orderDetail.orderGoodses[val1][val2].number <= 0 || _self.orderDetail.orderGoodses[val1][val2].price < 0 || _self.orderDetail.orderGoodses[val1][val2].discountFee < 0) {
        			layer.msg('商品数量必须大于0，商品价格和优惠必须大于等于0', {timeout: 2000});
        			return false;
        		}
        	}else {//赠品
        		if(_self.orderDetail.orderGoodses[val1][val2].number <= 0 || _self.orderDetail.orderGoodses[val1][val2].price != 0 || _self.orderDetail.orderGoodses[val1][val2].discountFee != 0) {
					layer.msg('商品数量必须大于0，赠品价格和优惠必须等于0', {timeout: 2000});
        			return false;
        		}
        	}
        	_self.orderGood = {
        		orderGoodsId: _self.orderDetail.orderGoodses[val1][val2].orderGoodsId,
				goodsId:_self.orderDetail.orderGoodses[val1][val2].sku.goods.id,
				number: _self.orderDetail.orderGoodses[val1][val2].number,
				price: Number(_self.orderDetail.orderGoodses[val1][val2].price).toFixed(2),
				discountFee: Number(_self.orderDetail.orderGoodses[val1][val2].discountFee).toFixed(2),
				styleValue1: (this.orderDetail.orderGoodses[val1][val2].sku.styleValue1 == undefined) ? '' :　this.orderDetail.orderGoodses[val1][val2].sku.styleValue1.id,
				styleValue2: (this.orderDetail.orderGoodses[val1][val2].sku.styleValue2 == undefined) ? '' :　this.orderDetail.orderGoodses[val1][val2].sku.styleValue2.id,
				styleValue3: (this.orderDetail.orderGoodses[val1][val2].sku.styleValue3 == undefined) ? '' :　this.orderDetail.orderGoodses[val1][val2].sku.styleValue3.id,
        	};

        	http({
	    		instance: _self,
	    		url: api.modifyOrderGoods,
	            type: 'post',
	            data:{
	            	data: _self.orderGood
	            },
	            hasLoading: true,
	            success (res) {

	       //      	var tempObj = dealWithOrderGoods(res.data.orderGoodses);
				    // _self.orderDetail.orderGoodses = tempObj.orderGoods; 
				    // _self.orderDetail.totalSkuDiscountFee = tempObj.totalSkuDiscountFee; 
				    // _self.orderDetail.totalSkuNum = tempObj.totalSkuNum; 
				    // _self.orderDetail.orderGoodsNum = tempObj.orderGoodsNum; 
				    // _self.orderDetail.originOrderSns = tempObj.originOrderSns; 
				    // _self.orderDetail.totalDiscountFee = (Number(_self.orderDetail.discountFee) + Number(tempObj.totalSkuDiscountFee)).toFixed(2); 
				    // _self.orderDetail.goodsFee = res.data.goodsFee.toFixed(2);
				    // _self.orderDetail.totalFee = res.data.totalFee.toFixed(2);
				    // _self.orderDetail.taxFee = res.data.taxFee.toFixed(2);

				    _self.$emit('reflesh-order', true);
				    _self.$emit('reflesh-actions', true);
	            	layer.msg('修改成功', {
                        time: 2000
                    });
                    
	            }
	    	});
        },
        cancelOrderGood (val1,val2) {
        	this.orderDetail.orderGoodses[val1][val2].sku.goods.id = this.orderGood.goodsId;
        	this.orderDetail.orderGoodses[val1][val2].number = this.orderGood.number;
        	this.orderDetail.orderGoodses[val1][val2].price = this.orderGood.price;
        	this.orderDetail.orderGoodses[val1][val2].discountFee= this.orderGood.discountFee;
        	this.orderDetail.orderGoodses[val1][val2].editable = false;

        	if(this.orderDetail.orderGoodses[val1][val2].sku.styleValue1){
				this.orderDetail.orderGoodses[val1][val2].sku.styleValue1.id = this.orderGood.styleValue1;
        	}
        	if(this.orderDetail.orderGoodses[val1][val2].sku.styleValue2){
        		this.orderDetail.orderGoodses[val1][val2].sku.styleValue2.id = this.orderGood.styleValue2;
        	}
        	if(this.orderDetail.orderGoodses[val1][val2].sku.styleValue3){
        		this.orderDetail.orderGoodses[val1][val2].sku.styleValue3.id = this.orderGood.styleValue3;
        	}

        	var tempOrderGoodses = this.orderDetail.orderGoodses;
        	this.orderDetail.orderGoodses = [];
        	this.orderDetail.orderGoodses = tempOrderGoodses;
        },
        deleteOrderGood (val1,val2){
        	if(this.orderDetail.orderGoodses.length == 1 && this.orderDetail.orderGoodses[0].length == 1) {
        		layer.msg('该订单只有一个商品，不能删除！', {timeout: 2000});
        		return false;
        	}
        	if(confirm("确定删除该商品么？")){
        		const _self = this;
	            http({
	                instance: _self,
	                url: api.deleteOrderGoods,
	                type: 'post',
		            async: false,
	                data:{
	                	data:{
	                		"orderGoodsId":_self.orderDetail.orderGoodses[val1][val2].orderGoodsId, 
	                	},
	                },
	                hasLoading: true,
	                success (res) {
	                	layer.msg("删除成功~", {
                            time: 2000
                        });

	        //         	var tempObj = dealWithOrderGoods(res.data.orderGoodses);
					    // _self.orderDetail.orderGoodses =  tempObj.orderGoods; 
					    // _self.orderDetail.totalSkuDiscountFee =  tempObj.totalSkuDiscountFee; 
					    // _self.orderDetail.totalSkuNum =  tempObj.totalSkuNum; 
					    // _self.orderDetail.orderGoodsNum =  tempObj.orderGoodsNum; 
					    // _self.orderDetail.originOrderSns =  tempObj.originOrderSns; 
					    // _self.orderDetail.totalDiscountFee = (Number(_self.orderDetail.discountFee) + Number(tempObj.totalSkuDiscountFee)).toFixed(2); 
					    // _self.orderDetail.goodsFee = res.data.goodsFee.toFixed(2);
					    // _self.orderDetail.totalFee = res.data.totalFee.toFixed(2);
					    // _self.orderDetail.taxFee = res.data.taxFee.toFixed(2);

					    _self.$emit('reflesh-order', true);
					    _self.$emit('reflesh-actions', true);
	                }
	            });
        	}
        	
        },
        fetchOrderGoodSkus (val1,val2) {
    		const _self = this;
            http({
                instance: _self,
                url: api.getGoodsDetailForOrder,
                type: 'post',
	            async: false,
                data:{
                	data:{
                		"goodsId":_self.orderDetail.orderGoodses[val1][val2].sku.goods.id, 
                	},
                },
                hasLoading: false,
                success (res) {
		    		if(res.data.styleType1){
		    			_self.orderDetail.orderGoodses[val1][val2].sku.styleType1 = res.data.styleType1;
		    		}
		    		if(res.data.styleType2){
		    			_self.orderDetail.orderGoodses[val1][val2].sku.styleType2 = res.data.styleType2;
		    		}
		    		if(res.data.styleType3){
		    			_self.orderDetail.orderGoodses[val1][val2].sku.styleType3 = res.data.styleType3;
		    		}
                }
            });
        },
        getGoodSkuId(val1,val2) {
        	var goodsId = this.orderDetail.orderGoodses[val1][val2].sku.goods.id;
    		var styleValue1 = this.orderDetail.orderGoodses[val1][val2].sku.styleValue1.id || '';
    		var styleValue2 = this.orderDetail.orderGoodses[val1][val2].sku.styleValue2.id || '';
    		var styleValue3 = this.orderDetail.orderGoodses[val1][val2].sku.styleValue3.id || '';
    		var tempObj = {
    			"goodsId": goodsId,
        		"styleValue1": styleValue1,
        		"styleValue2": styleValue2,
        		"styleValue3": styleValue3,
        		"partyId": this.orderDetail.partyId
    		};
        	const _self = this;
        	http({
                instance: _self,
                url: api.getGoodsSku,
                type: 'post',
                async: false,
                data:{
                	data:tempObj,
                },
                hasLoading: false,
                success (res) {
                	_self.orderDetail.orderGoodses[val1][val2].sku.skuId = res.data.skuId;
                }
            });
        },
        tips(val1,val2) {
        	if(val2 == 1) {
        		switch(val1) {
	        		case 'price':
	        		layer.tips('平台拍下的原价平摊到单个SKU的金额', '#' + val1, {
						tips: [1, '#3697DE'],
						time: 0
					});
					return false;
					case 'goodDiscount':
					layer.tips('宝贝打折、宝贝优惠券平摊到单种SKU的金额', '#' + val1, {
						tips: [1, '#3697DE'],
						time: 0
					});
					return false;
					case 'goodTaxFee':
					layer.tips('跨境平台代收的平摊到单种SKU的关税', '#' + val1, {
						tips: [1, '#3697DE'],
						time: 0
					});
					return false;
					case 'goodFee':
					layer.tips('货款小计=单价*数量-商品优惠+商品关税', '#' + val1, {
						tips: [1, '#3697DE'],
						time: 0
					});
					return false;
					case 'goodTotalFee':
					layer.tips('（商品）应收小计=货款小计-平摊订单优惠（不包含邮费）', '#' + val1, {
						tips: [1, '#3697DE'],
						time: 0
					});
					return false;
					case 'orderDiscountFee':
					layer.tips('订单优惠=订单级别优惠券', '#' + val1, {
						tips: [1, '#3697DE'],
						time: 0
					});
					return false;
					case 'totalDiscountFee':
					layer.tips('总优惠金额=订单优惠+商品优惠总和', '#' + val1, {
						tips: [1, '#3697DE'],
						time: 0
					});
					return false;
					case 'totalFee':
					layer.tips('应收金额=应收小计+邮费', '#' + val1, {
						tips: [1, '#3697DE'],
						time: 0
					});
					return false;
					default:
					return false;
	        	}
        	}else {
        		layer.closeAll('tips');
        	}
        	
        },
        /**添加商品模块 start**/
        changeSingleOrGroup (data) {
        	this.goodsType.currentGoodsType = data;
        	this.addGoods = {
				addGoodsDisabled: true,
				styleType1Display: false,
				styleType2Display: false,
				styleType3Display: false,
				addStyleType1: {

				},
				addStyleType2: {

				},
				addStyleType3: {

				},
				addOuterSkuId: "",
				addOuterIid: "",
				addGoodsId: "",
				addGoodsName: "",
				addPrice:"",
				addQuantity: "",
				isGift:0,
				addTaxFee: 0,
			};
    	},
    	selectGoodsSkuCode (data) { 
    		if($.isEmptyObject(data)){
        	}else{
        		for(var key in data){
        			this.addGoods[key] = data[key];
        		}
        	}   		
        },
        selectGroupGoodsSkuCode (data) {
        	if($.isEmptyObject(data)){
        	}else{
        		for(var key in data){
        			this.addGoods[key] = data[key];
        		}
        	}
        },
        fetchGoodSkus (data) {
        	if($.isEmptyObject(data)){
        	}else{
        		for(var key in data){
        			this.addGoods[key] = data[key];
        		}
        	}
        },
        fetchGroupGoodSkus (data) {
        	if($.isEmptyObject(data)){
        	}else{
        		for(var key in data){
        			this.addGoods[key] = data[key];
        		}
        	}
        },
        addGoodsToOrder () {//添加商品
        	//验证字段
        	const _self = this;
        	if(_self.addGoods.addQuantity <= 0) {
        		layer.msg('商品数量必须大于0', {timeout: 2000});
        		return false;
        	}
        	if(_self.addGoods.addPrice < 0 || _self.addGoods.addTaxFee < 0) {
        		layer.msg('商品价格和税费必须大于等于0', {timeout: 2000});
        		return false;
        	}
        	var addGood = true;
        	var goodAdd = {
        		title: "",
        		num: "",
        		outerSkuId: "",
        		outerIid: "",
        		price: "",
        		discountFee: "0.00",
        		taxFee: "0.00",
        		productDate: "",
        		batchNo: "",
        		isGift: false,
        	};
        	if(this.goodsType.currentGoodsType == '1'){
	            http({
	                instance: _self,
	                url: api.addOrderGoods,
	                type: 'post',
	                data:{
	                	data:{
	                		"orderId": _self.orderDetail.orderId,
	                		"gift": _self.addGoods.isGift,
	                		"goodsId": _self.addGoods.addGoodsId,
	                		"styleValue1": _self.addGoods.addStyleType1.active,
	                		"styleValue2": _self.addGoods.addStyleType2.active,
	                		"styleValue3": _self.addGoods.addStyleType3.active,
	                		"partyId": '',
	                		"number": _self.addGoods.addQuantity,
	                		"price": _self.addGoods.addPrice,
	                		"taxFee": _self.addGoods.addTaxFee
	                	},
	                },
	                hasLoading: true,
	                success (res) {
	        //         	var tempObj = dealWithOrderGoods(res.data.orderGoodses);
					    // _self.orderDetail.orderGoodses =  tempObj.orderGoods; 
					    // _self.orderDetail.totalSkuDiscountFee =  tempObj.totalSkuDiscountFee; 
					    // _self.orderDetail.totalSkuNum =  tempObj.totalSkuNum; 
					    // _self.orderDetail.orderGoodsNum =  tempObj.orderGoodsNum; 
					    // _self.orderDetail.originOrderSns =  tempObj.originOrderSns; 
					    // _self.orderDetail.totalDiscountFee = (Number(_self.orderDetail.discountFee) + Number(tempObj.totalSkuDiscountFee)).toFixed(2); 
				    	// _self.orderDetail.goodsFee = res.data.goodsFee.toFixed(2);
				    	// _self.orderDetail.totalFee = res.data.totalFee.toFixed(2);
				    	// _self.orderDetail.taxFee = res.data.taxFee.toFixed(2);
				    	_self.$emit('reflesh-order', true);
					    _self.$emit('reflesh-actions', true);
	                }
	            });
			}else{
				 http({
	                instance: _self,
	                url: api.addOrderGroupGoods,
	                type: 'post',
	                data:{
	                	data:{
	                		"orderId": _self.orderDetail.orderId,
	                		"gift": _self.addGoods.isGift,
	                		"groupId": _self.addGoods.addGoodsId,
	                		"partyId": _self.orderDetail.partyId,
	                		"groupNum": _self.addGoods.addQuantity,
	                		"price": _self.addGoods.addPrice,
	                		"taxFee": _self.addGoods.addTaxFee
	                	},
	                },
	                hasLoading: true,
	                success (res) {
	                	var tempObj = dealWithOrderGoods(res.data.orderGoodses);
					    _self.orderDetail.orderGoodses =  tempObj.orderGoods; 
					    _self.orderDetail.totalSkuDiscountFee =  tempObj.totalSkuDiscountFee; 
					    _self.orderDetail.totalSkuNum =  tempObj.totalSkuNum; 
					    _self.orderDetail.orderGoodsNum =  tempObj.orderGoodsNum; 
					    _self.orderDetail.originOrderSns =  tempObj.originOrderSns; 
					    _self.orderDetail.totalDiscountFee = (Number(_self.orderDetail.discountFee) + Number(tempObj.totalSkuDiscountFee)).toFixed(2)
				    	_self.orderDetail.goodsFee = res.data.goodsFee.toFixed(2); 
				    	_self.orderDetail.totalFee = res.data.totalFee.toFixed(2);
				    	_self.orderDetail.taxFee = res.data.taxFee.toFixed(2);

					    _self.$emit('reflesh-actions', true);

	                }

	            });
                	
			}
        	
        },
        changeIsGift (){
        	if(this.addGoods.isGift == '1'){
        		this.addGoods.addPrice = 0.00;
        		this.addGoods.addTaxFee = 0.00;
        	}
        },
        /**添加商品模块 end**/
        /**================订单商品修改模块end==================**/

        
        selectedDistributor (data) {
        	this.orderDetail.distributor.distributorId = data.data.distributorId;
        	this.orderDetail.distributor.distributorName = data.data.distributorName;
        },
        
	},
	components: {overlay,addNoteModal,selectWarehouse,selectShipment,selectRegion,orderSplitModal,saleInvoiceDetailModal,searchDistributor,selectInvoiceType,searchGoodsSkuCodeForOrder,searchGroupGoodsSkuCodeForOrder,searchGoodsNameForOrder,searchGroupGoodsNameForOrder,selectGoodsTypeAdd}
}
</script>

<style scoped>
.order-info-detail {
	float: left;
	width: 100%;
	font-size: 12px;
	color: #444;
}
.order-info-detail dl {
	margin-bottom: 0px;
	/*float: left;*/
}
.order-info-detail dt {
	font-size: 14px;
	color: #555;
	margin-top: 4px;
	margin-bottom: 2px;
	float: left;
}
.order-info-detail dd {
	background-color: #fff;
	width: 100%;
	float: left;
}
.order-info-detail dd .form-group div {
	text-align: left;
	padding-right: 4px;
	padding-left: 4px;
}
label {
	padding-left: 0px;
	padding-right: 0px;
	overflow:hidden;
	white-space:nowrap;
}
.order-source dd .order-address div {
	padding-left: 0px;
	padding-right: 0px;
}
.order-source .order-address label {
	text-align: center;
}
.order-fee {
	border-bottom: solid 1px #d2d6de;
}
.order-fee input {
	padding-left: 1px;
	padding-right: 1px;
}
.order-payment table th {
	height: 30px;
	border-bottom: 2px solid #ccc;
	text-align: center;
}
.order-payment table td {
	text-align: center;
	padding-top: 2px;
	padding-bottom: 2px;
}
.pay-list {
	width: 30%;
	float: left;
	/*background-color: #eee;	*/
}
.pay-record {
	width: 65%;
	float: right;
}
.pay-list table {
	width: 95%;
	margin: 0 auto;
}
.pay-record table{
	width: 100%;
}
.form-group {
	margin-bottom: 2px;
}
.action-buttons {
	margin-top: 14px;
}
.action-button {
	text-align: center;
}
.btn-cancel {
	border-color: #367fa9; 
	color: #367fa9;
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

input.not-editable {
	border:0 solid #d2d6de;
	background:#fff;
}
select.not-editable {
	background-color: #fff;
}
.goods-padding {
	padding-left: 30px;
}
.good-edit {
	text-align: center;
	width: 90%;
	margin-left: 5%;
}
.col-md-4 {
	padding-left: 0px;
	padding-right: 0px;
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
.form-group {
	margin-left: 0px;
	margin-right: 0px;
}
a.btn-a {
	font-weight: normal;
	font-size: 12px;
	border-bottom: 1px solid;
	color: #1788E9;
}
.table tfoot input{
	width: 60px;
}
.order-goods-table th{
	padding-right: 1px;
	padding-left: 1px;
}
.order-goods-table td {
	padding-left: 1px;
	padding-right: 1px;
	vertical-align: middle;
}
.table td {
	position: relative;
}
</style>