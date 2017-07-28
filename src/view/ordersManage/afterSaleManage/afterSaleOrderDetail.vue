<template>
	<div class="content-wrapper">
        <section class="content">
			<div class="after-sale-order">
				<h4 v-if="actionType=='create'">新建退换单</h4>
				<h4 v-else>退换单 {{formData.orderSn}}({{party.partyName}})
					<span style="font-weight:100;font-size:14px;">{{formData.orderStatusValue}}<template v-if="formData.orderType=='RETURN' || formData.orderType=='EXCHANGE'">&nbsp;{{formData.shippingStatusValue}}</template>&nbsp;{{formData.settlementStatusValue}}</span> 
					<template v-if="actionType == 'edit'">
						<button v-if="formData.orderStatus!='CLOSED'" class="btn btn-xs btn-danger" style="float:right;" @click="cancelAfterSaleOrder({'id':id,'memo':newMemo.data})">作废订单</button>
						<button v-if="formData.orderStatus=='WAIT_CHECK'" style="float:right;" class="btn btn-xs btn-primary" @click="checkAfterSaleOrder({'id':id,'memo':newMemo.data})">审核通过</button>
						<button v-if="formData.orderStatus=='WAIT_CHECK'" style="float:right;" class="btn btn-xs btn-primary" @click="rejectAfterSaleOrder({'id':id,'memo':newMemo.data})">审核否决</button>
					</template>
				</h4>
				<div class="col-md-12 no-padding form-horizontal">
					<div class="form-group">
						<div class="col-md-3 control-label" style="text-align:right; padding-right:15px;">
							<template v-if="formData.omsOrderStatus == 'CLOSE_PLATFORM' || formData.omsOrderStatus == 'CLOSED_MANUAL'">
								<input type="radio" class="radio-inline" value="REFUND_ORDER_CANCEL" :disabled="actionType!='create'" v-model="formData.orderType" @change="changeType">废单退款
							</template>
							<template v-if="((formData.omsOrderStatus == 'WAIT_CHECK' || formData.omsOrderStatus == 'CHECK_PASS') && formData.omsShippingStatus == 'INIT') || formData.omsShippingStatus == 'PUSH'">
								<input type="radio" class="radio-inline" name="afterSaleType"  value="REFUND_ONLY" :disabled="actionType!='create'" v-model="formData.orderType" @change="changeType">仅退款
							</template>
							<template v-if="formData.omsShippingStatus == 'OPERATED' || formData.omsShippingStatus == 'PLATFORM_OPERATED' || formData.omsShippingStatus == 'OLD_SYSTEM_OPERATED' ">
								<input type="radio" class="radio-inline" name="afterSaleType" :disabled="formData.orderStatus!='INVALID' && actionType!='create'" value="REFUND" v-model="formData.orderType" @change="changeType">退款不退货
							</template>
							<template v-if="formData.omsShippingStatus == 'OPERATED' || formData.omsShippingStatus == 'PLATFORM_OPERATED' || formData.omsShippingStatus == 'OLD_SYSTEM_OPERATED' || formData.omsOrderId == ''">
								<input type="radio" class="radio-inline" name="afterSaleType" :disabled="orderTypeChangeDisabled" value="RETURN" v-model="formData.orderType" @change="changeType">退货
								<input type="radio" class="radio-inline" name="afterSaleType" :disabled="orderTypeChangeDisabled" value="EXCHANGE" v-model="formData.orderType" @change="changeType">换货
							</template>
						</div>
						<label class="col-md-1 control-label">退换原因</label>
						<div class="col-md-2">
							<component is="select-after-sale-reason" placeholder="请选择退换原因" @selected="selectedReasonType" :default-reason-type="formData.reasonType"></component>
						</div>
						<div class="col-md-3 control-label">
							<input type="checkbox" class="checkbox-inline" id="isPayFirst" :value="true" v-model="formData.isPayFirst" :disabled="!formData.isPayFirstEditable">先行赔付
							<input type="checkbox" class="checkbox-inline" id="isExchangeFirst" :value="true" v-model="formData.isExchangeFirst" :disabled="!formData.isExchangeFirstEditable">未退先换
						</div>
						
					</div>
					<div class="form-group">
						<label class="col-md-1 control-label">系统订单</label>
						<div class="col-md-2">
							<input type="text" class="input-sm form-control" id="omsOrderId" v-model="formData.omsOrderSn" :readonly="actionType!='create' && formData.orderStatus!='INVALID'">
						</div>
						<label class="col-md-1 control-label">原始订单</label>
						<div class="col-md-2">
							<input type="text" class="input-sm form-control" v-model="formData.platformOrderIdsString" :readonly="actionType!='create' && formData.orderStatus!='INVALID'">
						</div>
						<div  v-if="(actionType=='create' || formData.orderStatus=='INVALID') && actionType!='view'" class="col-md-3 control-label" style="text-align:left" >
							<button class="btn btn-xs btn-primary" @click="loadOrderInfo">加载</button>
							<button class="btn btn-xs btn-info" @click="formReset">重置</button>
						</div>

						
					</div>
					<div class="form-group">
						<label class="col-md-1 control-label">客户ID</label>
						<div class="col-md-2">
							<input type="text" class="input-sm form-control" v-model="formData.buyer" :readonly="actionType!='create' && formData.orderStatus!='INVALID'">
						</div>
						<label class="col-md-1 control-label">客户姓名</label>
						<div class="col-md-2">
							<input type="text" class="input-sm form-control" v-model="formData.buyerName" :readonly="actionType!='create' && formData.orderStatus!='INVALID'">
						</div>
						<label class="col-md-1 control-label">店铺</label>
						<div class="col-md-2">
							<component is="select-shop"  @selected="selectedShop" placeholder="请选择店铺" :default-shop-id="formData.shopId" :disabled="actionType!='create' && formData.orderStatus!='INVALID'"></component>
						</div>
						<label class="col-md-1 control-label" style="text-align:left;">{{formData.platformName}}</label>
						
						
					</div>
					<div class="form-group">
						<label class="col-md-1 control-label">退换备注</label>
						<div class="col-md-10">
							<input type="text" class="input-sm form-control" v-model="formData.memo"  :readonly="actionType!='create' && formData.orderStatus!='INVALID'">
						</div>
						<div class="col-md-1" v-if="actionType!='create' && !newMemo.show && formData.orderStatus!='INVALID'">
							<a href="#" @click.prevent="newMemo.show=true"><i class="iconfont">&#xe60a;</i></a>
						</div>
					</div>
					<div class="form-group" v-if="newMemo.show">
						<label class="col-md-1 control-label">退换备注</label>
						<div class="col-md-10">
							<input type="text" class="input-sm form-control" v-model="newMemo.data" >
						</div>
					</div>
					<div class="form-group">
						<label class="col-md-1 control-label">原单应收</label>
						<div class="col-md-2 control-label" style="text-align:left">
						<span>{{formData.totalFee}}</span>
						</div>
						<template v-if="formData.preDepositFee > 0">
							<label class="col-md-1 control-label">原单预存款</label>
							<div class="col-md-2 control-label" style="text-align:left">
							<span>{{formData.preDepositFee}}</span>
							</div>
						</template>
						<label class="col-md-1 control-label">损失金额</label>
						<div class="col-md-2 control-label" style="text-align:left">
						<span>{{_lossAmount}}</span>
						</div>
					</div>
				</div>
				<div class="col-md-12 no-padding form-horizontal">
					<h5 @click.prevent="openRefundDiv=!openRefundDiv" style="cursor:pointer;">
						<span class="h5-tag">|</span>退款
						<a href="#" v-if="!openRefundDiv"><i class="iconfont">&#xe616;</i></a>
		        		<a href="#" v-else ><i class="iconfont">&#xe617;</i></a>
		        	</h5>
					<div class="col-md-12 form-horizontal refund" v-show="openRefundDiv">
						<div class="form-group">
							<label class="col-md-1 control-label">|退款总金额</label>
							<div class="col-md-1 control-label" style="text-align:left">
								<span>{{_refundAmount}}</span>
							</div>
							<template v-if="formData.orderType=='RETURN' || formData.orderType=='EXCHANGE'">
								<label class="col-md-1 control-label">|退货金额</label>
								<div class="col-md-1 control-label" style="text-align:left">
									<span>{{_returnAmount}}</span>
								</div>
								<label class="col-md-1 control-label">退货邮费</label>
								<div class="col-md-1 control-label" style="text-align:left">
									<span>{{formData.returnOrder.postFee}}</span>
								</div>
							</template>
							<template v-if="formData.orderType=='EXCHANGE'">
								<label class="col-md-1 control-label">|换货金额</label>
								<div class="col-md-1 control-label" style="text-align:left">
									<span>{{_exchangeAmout}}</span>
								</div>
								<label class="col-md-1 control-label">换货邮费</label>
								<div class="col-md-1 control-label" style="text-align:left">
									<span>{{formData.exchangeOrder.postFee}}</span>
								</div>
							</template>
						</div>	
						<div class="form-group" v-if="formData.preDepositFee > 0">
							<label class="col-md-1 control-label">退预存款</label>
							<div class="col-md-2">
								<input type="text" class="input-sm form-control" :readonly="refundOrderDisable" v-model="formData.refundPreDepositFee">
							</div>
							<label class="col-md-1 control-label">实收预存款</label>
							<div class="col-md-2">
								<span>{{formData.originalOrder.preDepositFee}}</span>
							</div>
						</div>
						<div class="form-group">
							<label class="col-md-1 control-label">
								退款金额<span class="red">*</span>
							</label>
							<div class="col-md-2">
								<input type="text" class="input-sm form-control" :readonly="refundOrderDisable" v-model="formData.refundNormalAmount">
							</div>
							<label class="col-md-1 control-label">退款方式</label>
							<div class="col-md-2">
								<component is="select-refund-type" @selected="selectedRefundType" :disabled="refundOrderDisable" :default-refund-type="formData.refundType"></component>
							</div>
							<label class="col-md-3 control-label" style="text-align:left; color:#666;">{{formData.refundType | refundTypeNoteFilter}}</label>
						</div>
						<div class="form-group" v-if="formData.refundType=='ONLINE_BANK_REFUND'">
							<label class="col-md-1 control-label">网银渠道</label>
							<div class="col-md-2">
								<component is="select-refund-way" :disabled="refundOrderDisable" @selected="selectedRefundWay"></component>
							</div>
							<label class="col-md-1 control-label">开户行</label>
							<div class="col-md-2">
								<input type="text" class="input-sm form-control" :readonly="refundOrderDisable" v-model="formData.accountBank">
							</div>
							<label class="col-md-1 control-label">姓名</label>
							<div class="col-md-2">
								<input type="text" class="input-sm form-control" :readonly="refundOrderDisable" v-model="formData.accountName">
							</div>
							<label class="col-md-1 control-label">账号</label>
							<div class="col-md-2">
								<input type="text" class="input-sm form-control" :readonly="refundOrderDisable" placeholder="例：13131311@qq.com" v-model="formData.buyerAccountNum">
							</div>
						</div>
					</div>	
				</div>
				<div class="col-md-12 no-padding form-horizontal">
					<h5 @click.prevent="openBackOrderGoods" style="cursor:pointer;">
						<span class="h5-tag">|</span>退货明细
						<a href="#" v-if="!openBackOrderGoodsDiv"><i class="iconfont">&#xe616;</i></a>
		        		<a href="#" v-else><i class="iconfont">&#xe617;</i></a>
					</h5>
					<div class="col-md-12 form-horizontal back-order-goods" v-show="openBackOrderGoodsDiv">
						<div class="form-group">
							<label class="col-md-1 control-label">退回仓库</label>
							<div class="col-md-2">
								<component v-if="formData.orderType == 'EXCHANGE' || formData.orderType == 'RETURN'" id="returnWarehouse" :disabled="returnOrderDisable" :contains-deleted="returnOrderDisable" is="search-warehouse" placeholder="模糊搜索" @selected="selectedRetrunWarehouse" :default-warehouse="formData.returnOrder.warehouse"></component>
							</div>
							<label class="col-md-1 control-label">原单邮费</label>
							<div class="col-md-2 control-label" style="text-align:left" >
							<span v-if="originalOrder">{{originalOrder.postFee}}</span>
							</div>
							<div class="col-md-6 control-label">
								<!-- <input type="checkbox" class="checkbox-inline" value="lessShip">漏发 -->
								<!-- <input type="checkbox" class="checkbox-inline" v-model="formData.returnOrder.backAllGoods" @click="backAllGoods">全部退还 -->
								<button class="btn btn-xs btn-info" @click="backAllGoods" :disabled="returnOrderDisable">全部退还</button>
								<button class="btn btn-xs btn-info" @click="backOriginOrder" :disabled="returnOrderDisable">原单退回</button>
								<!-- <input type="checkbox" class="checkbox-inline" v-model="formData.returnOrder.backOriginOrder" @click="backOriginOrder">原单退回 -->
							</div>
							
							
						</div>
						<div class="form-group">
							<table class="table">
								<thead>
									<tr>
										<th width="10%">宝贝</th>
										<th width="5%">数量</th>
										<th width="5%">宝贝分摊</th>
										<th width="5%">平台退款</th>
										<th width="25">单品名称</th>
										<th width="5%">拍下数</th>
										<th width="5%">实发数</th>
										<th width="10%">单价</th>
										<th width="10%">应收小计</th>
										<th width="5%">可退数量</th>
										<th width="5%">申请退货</th>
										<th width="10%">建议退货金额</th>
									</tr>
								</thead>
								<template v-if="originalOrder">
								<tbody v-for="(item, index) in originalOrder.orderGoodses">
									<tr v-for="(item1, index1) in item">
										<td v-if="item1.show" :rowspan="item1.rowspan" style="word-wrap:break-word;word-break:break-all">
											<span v-if="item1.gift" class="gift-icon"></span>
											<span style="padding-left:16px;">{{item1.skuCode}}</span>
											<p v-if="item1.name">{{item1.name}}</p>
										</td>
										<td v-if="item1.show" :rowspan="item1.rowspan" style="text-align:center">
											{{item1.numShow}}
										</td>
										<td></td>
										<td></td>
										<td style="word-wrap:break-word;word-break:break-all">
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
										<td style="text-align:center;">{{item1.number}}</td>
										<td style="text-align:center;">{{item1.number}}</td>
					                    <td style="text-align:center;">{{item1.price}}</td>
										<td style="text-align:center;">{{item1.totalFee}}</td>
										<td style="text-align:center;">{{item1.restReturnNum}}</td>
										<td>
											<input type="text" v-model="item1.returnNum" @keyup="modifyReturnGoodsNum" style="width: 90%; text-align:center;" :readonly="returnOrderDisable">
										</td>
										<td style="text-align:center;">{{(Number(item1.totalFee)*Number(item1.returnNum)/Number(item1.number)).toFixed(2)}}</td>
									</tr>
								</tbody>
								</template>
							</table>
						</div>
						
						<div class="col-md-12 no-padding form-horizontal">
							<div class="form-group">
								<label class="col-md-1 control-label">退货人</label>
								<div class="col-md-2">
									<input type="text" class="input-sm form-control" :readonly="returnOrderDisable" v-model="formData.returnOrder.receiverName">
								</div>
								<label class="col-md-1 control-label">退货电话</label>
								<div class="col-md-2">
									<input type="text" class="input-sm form-control" :readonly="returnOrderDisable" v-model="formData.returnOrder.receiverMobile">
								</div>
								<label class="col-md-1 control-label">退货地址</label>
								<div class="col-md-5">
									<component is="select-region" comp-id="returnProvince"　placeholder="省" region-type="1" parent-id="" @selected="selectedReturnProvince" :disabled="returnOrderDisable" style="width: 16%; display: inline;" :default-region-id="formData.returnOrder.receiverProvince"></component>
			                    	<component is="select-region" comp-id="returnCity" :init="false" placeholder="市" region-type="2" :parent-id="formData.returnOrder.receiverProvince" :disabled="returnOrderDisable" @selected="selectedReturnCity" style="width: 16%; display: inline;" :default-region-id="formData.returnOrder.receiverCity"></component>
			                    	<component is="select-region" comp-id="returnDistrict" :init="false" placeholder="区" region-type="3" :parent-id="formData.returnOrder.receiverCity" :disabled="returnOrderDisable" @selected="selectedReturnDistrict" style="width: 16%; display: inline;" :default-region-id="formData.returnOrder.receiverDistrict"></component>
			                    	<input type="text" class="input-sm form-control" :readonly="returnOrderDisable" style="width: 46%; display: inline;" v-model="formData.returnOrder.receiverAddress">
			                    	
								</div>
							</div>
							<div class="form-group">
								<label class="col-md-1 control-label">退回快递</label>
								<div class="col-md-2">
									<component v-if="formData.orderType == 'EXCHANGE' || formData.orderType == 'RETURN'" is="search-shipping" placeholder="模糊搜索" :disabled="returnOrderDisable" @selected="selectedReturnShipping" :default-shipping="formData.returnOrder.shipping" :contains-deleted="returnOrderDisable"></component>
								</div>
								<label class="col-md-1 control-label">退回面单</label>
								<div class="col-md-2">
									<input type="text" class="input-sm form-control" :readonly="returnOrderDisable" v-model="formData.returnLogisticsNumber">
								</div>
								<label class="col-md-1 control-label">退回邮费</label>
								<div class="col-md-2">
									<input type="text" class="input-sm form-control" :readonly="returnOrderDisable" v-model="formData.returnOrder.postFee">
								</div>
							</div>
							
						</div>
						
					</div>	
				</div>
				<div class="col-md-12 no-padding form-horizontal">
					<h5 @click.prevent="openChangeOrderGoods" style="cursor:pointer;">
						<span class="h5-tag">|</span>换货明细
						<a href="#" v-if="!openChangeOrderGoodsDiv"><i class="iconfont">&#xe616;</i></a>
		        		<a href="#" v-else><i class="iconfont">&#xe617;</i></a>
					</h5>
					<div class="col-md-12 form-horizontal change-order-goods" v-show="openChangeOrderGoodsDiv">
						<div class="form-group">
							<label class="col-md-1 control-label">发货仓<span class="red">*</span></label>
							<div class="col-md-2">
								<component is="select-warehouse" :shop-id="formData.shopId" placeholder="请选择仓库" @selected="selectedChangeWarehouse" :default-warehouse-id="formData.exchangeOrder.warehouseId" :default-warehouse-id="formData.exchangeOrder.warehouseName" :disabled="exchangeOrderDisable"></component>
							</div>
							<div class="col-md-6">
								
							</div>
							<div class="col-md-3 control-label">
								<button class="btn btn-xs btn-info" @click="copyReturnGoods" :disabled="exchangeOrderDisable">复制退回货品</button>
							</div>
							
						</div>
						<div class="form-group add-good">
							<label class="col-md-1 control-label">商品类型</label>
							<div class="col-md-5 no-padding">
								<div class="col-md-3">
									<component is="select-goods-type-add" @selected="changeSingleOrGroup" :disabled="exchangeOrderDisable"></component>
								</div>
								<div class="col-md-3 control-label">
									<input type="radio" class="radio-inline" name="isGift" value="0" v-model="addGoods.isGift">商品
									<input type="radio" class="radio-inline" name="isGift" value="1" v-model="addGoods.isGift">赠品
								</div>
								<div class="col-md-6 no-padding">
									<label class="col-md-4 control-label">商品名称</label>
									<div class="col-md-8">
										<component v-if="addGoods.singleOrGroup == '1'" is="search-goods-name-for-order" comp-id="addGoodsName" :init-good="addGoods" @selected="fetchGoodSkus" :disabled="exchangeOrderDisable"></component>
				                    	<component comp-id="addGroupGoodsName" v-else is="search-group-goods-name-for-order" :init-good="addGoods" @selected="fetchGroupGoodSkus" :disabled="exchangeOrderDisable"></component>
									</div>
								</div>
							</div>
							<div class="col-md-5 no-padding">
								<div v-if="addGoods.styleType1Display==true" class="col-md-2">   
			                    	<select class="form-control input-sm no-padding" v-model="addGoods.addStyleType1.active">
			                    		<option v-for="item in addGoods.addStyleType1.styleValues" :value="item.id">{{item.value}}</option>
			                    	</select>
				                </div>
				                <div v-if="addGoods.styleType2Display==true" class="col-md-2">   
			                    	<select class="form-control input-sm no-padding" v-model="addGoods.addStyleType2.active">
			                    		<option v-for="item in addGoods.addStyleType2.styleValues" :value="item.id">{{item.value}}</option>
			                    	</select>
				                </div>
				                <div v-if="addGoods.styleType3Display==true" class="col-md-2">   
			                    	<select class="form-control input-sm no-padding" v-model="addGoods.addStyleType3.active">
			                    		<option v-for="item in addGoods.addStyleType3.styleValues" :value="item.id">{{item.value}}</option>
			                    	</select>
				                </div>
				                <div class="col-md-3 no-padding">
				                	<label class="col-md-5 control-label">数量</label>
									<div class="col-md-7">
										<input type="text" class="input-sm form-control" v-model="addGoods.addQuantity">
									</div>
				                </div>
								<div class="col-md-3 no-padding">
									<label class="col-md-5 control-label">单价</label>
									<div class="col-md-7">
										<input type="text" class="input-sm form-control" v-model="addGoods.addPrice">
									</div>
								</div>
								
								
							</div>
							<div class="col-md-1 control-label">
								<button class="btn btn-xs btn-info" @click="addGoodsToChange" :disabled="addGoods.addGoodsDisabled || exchangeOrderDisable">添加</button>
							</div>
							
						</div>
						<div class="form-group">
							<table class="table">
								<thead>
									<tr>
										<th width="18%">换货宝贝</th>
										<th width="30%">宝贝名称</th>
										<th width="12%">规格</th>
										<th width="10%">宝贝单价</th>
										<th width="10%">换出数量</th>
										<th width="10%">实际换货金额（参考）</th>
										<th width="10%">操作</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(item, index) in formData.exchangeOrder.orderGoodses">
										<td>
											<span v-if="item.gift" class="gift-icon"></span>
											<span style="padding-left:16px;">{{item.skuOrGroupCode}}</span>
										</td>
										<td>
											{{item.skuOrGroupName}}
										</td>
										<td>
											<span v-if="item.sku.styleValue1">{{item.sku.styleValue1.value}}</span>
											<span v-if="item.sku.styleValue2">{{item.sku.styleValue2.value}}</span>
											<span v-if="item.sku.styleValue3">{{item.sku.styleValue3.value}}</span>
											<!-- <select v-if="item.sku.styleValue1" v-model="item.sku.styleValue1.id" disabled>
												<option v-if="!item.editable" :value="item.sku.styleValue1.id">{{item.sku.styleValue1.value}}</option>
					                    		<option v-else v-for="item1 in item.sku.styleType1.values" :value="item1.id">{{item1.value}}</option>
					                    	</select>
					                    	<select v-if="item.sku.styleValue2" v-model="item.sku.styleValue2.id" disabled>
					                    		<option v-if="!item.editable" :value="item.sku.styleValue2.id">{{item.sku.styleValue2.value}}</option>
					                    		<option v-else v-for="item1 in item.sku.styleType2.values" :value="item1.id">{{item1.value}}</option>
					                    	</select>
					                    	<select v-if="item.sku.styleValue3" v-model="item.sku.styleValue3.id" disabled>
					                    		<option v-if="!item.editable" :value="item.sku.styleValue3.id">{{item.sku.styleValue3.value}}</option>
					                    		<option v-else v-for="item1 in item.sku.styleType3.values" :value="item1.id">{{item1.value}}</option>
					                    	</select> -->
					                    </td>
					                    <td>
											<input type="text" style="text-align:center;" v-model="item.price" style="width:90%" :readonly="!item.priceEditable || exchangeOrderDisable" :class="{'not-editable': !item.priceEditable}" style="text-align:center"/>
					                    </td>
										<td>
											<input type="text" v-model="item.number" style="width:90%; text-align:center;" :readonly="exchangeOrderDisable"/>
										</td>
										<td style="text-align:center;">
											<template v-if="item.originNum==0">
												{{(Number(item.price)*Number(item.number)).toFixed(2)}}
											</template>
											<template v-else>
												{{(Number(item.totalFee)*Number(item.number)/Number(item.originNum)).toFixed(2)}}
										
											</template>
										</td>
										<td style="text-align:center;">
											<!-- <a href="#" v-if="!item.editable" @click.prevent="editOrderGood(index)"><i class="iconfont">&#xe622;</i></a>
											<a href="#" v-if="item.editable" @click.prevent="confirmOrderGood(index)"><i class="iconfont confirm-icon">&#xe626;</i></a>
											<a href="#" v-if="item.editable" @click.prevent="cancelOrderGood(index)"><i class="iconfont cancel-icon">&#xe7ca;</i></a> -->
											<a href="#" v-if="!exchangeOrderDisable" @click.prevent="deleteOrderGood(index)"><i class="iconfont delete-icon" >&#xe613;</i></a>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="form-group">
							<div class="col-md-2">
								<!-- <input type="checkbox" class="checkbox-inline" v-model="formData.exchangeOrder.changeToOriginalAddress" @click="changeToOriginalAddress">换到原地址 -->
								<button class="btn btn-xs btn-info" :disabled="exchangeOrderDisable" @click="changeToOriginalAddress">换到原地址</button>
							</div>
						</div>
						<div class="form-group">
							<label class="col-md-1 control-label">收件人<span class="red">*</span></label>
							<div class="col-md-2">
								<input type="text" class="input-sm form-control" v-model="formData.exchangeOrder.receiverName" :readonly="exchangeOrderDisable">
							</div>
							<label class="col-md-1 control-label">收件电话<span class="red">*</span></label>
							<div class="col-md-2">
								<input type="text" class="input-sm form-control" v-model="formData.exchangeOrder.receiverMobile" :readonly="exchangeOrderDisable">
							</div>
							<label class="col-md-1 control-label">收件地址<span class="red">*</span></label>
							<div class="col-md-5">
								<component is="select-region" comp-id="changeProvince" placeholder="省" region-type="1" parent-id="" :default-region-id="formData.exchangeOrder.receiverProvince" @selected="selectedChangeProvince" style="width: 16%; display: inline;" :disabled="exchangeOrderDisable"></component>
		                    	<component is="select-region" comp-id="changeCity" :init="false" placeholder="市" region-type="2" :parent-id="formData.exchangeOrder.receiverProvince" :default-region-id="formData.exchangeOrder.receiverCity" @selected="selectedChangeCity" style="width: 16%; display: inline;" :disabled="exchangeOrderDisable"></component>
		                    	<component is="select-region" comp-id="changeDistrict" :init="false" placeholder="区" region-type="3" :parent-id="formData.exchangeOrder.receiverCity" :default-region-id="formData.exchangeOrder.receiverDistrict" @selected="selectedChangeDistrict" style="width: 16%; display: inline;" :disabled="exchangeOrderDisable"></component>
		                    	<input type="text" class="input-sm form-control" style="width: 46%; display: inline;" v-model="formData.exchangeOrder.receiverAddress" :readonly="exchangeOrderDisable">
							</div>
						</div>
						<div class="form-group">
							<label class="col-md-1 control-label">发货快递</label>
							<div class="col-md-2">
								<component is="search-shipping" id="exchangeShipping" placeholder="模糊搜索" @selected="selectedChangeShipping" :default-shipping="formData.exchangeOrder.shipping" :disabled="exchangeOrderDisable" :contains-deleted="exchangeOrderDisable"></component>
							</div>
							<label class="col-md-1 control-label">换出邮费</label>
							<div class="col-md-2">
								<input type="text" class="input-sm form-control" v-model="formData.exchangeOrder.postFee" :readonly="exchangeOrderDisable">
							</div>
						</div>
							
						
					</div>	
				</div>
				<div class="col-md-12 form-horizontal action-buttons" v-if="actionType=='create'">
					<div class="form-group">
						<div class="col-md-3"></div>
						<div class="col-md-6" style="text-align:center;">
							<button class="btn btn-sm btn-primary" @click="create">创建</button>
						</div>
					</div>
					
				</div>
				<div class="col-md-12 form-horizontal action-buttons" v-if="showUpdateButton()">
					<div class="form-group">
						<div class="col-md-3"></div>
						<div class="col-md-6" style="text-align:center;">
							<button  class="btn btn-sm btn-primary" @click="update">更新</button>
						</div>
					</div>
					
				</div>
				<div v-if="actionType!='create'" class="col-md-12 no-padding form-horizontal">
					<h5 @click.prevent="openLogDiv=!openLogDiv" style="cursor:pointer;">
						<span class="h5-tag">|</span>日志
						<a href="#" v-if="!openLogDiv"><i class="iconfont">&#xe616;</i></a>
		        		<a href="#" v-else><i class="iconfont">&#xe617;</i></a>
					</h5>
					<div class="col-md-12 form-horizontal back-order-goods" v-show="openLogDiv">
						<div class="form-group">
							<table class="table">
								<thead>
									<tr>
										<th width="30%">售后单状态</th>
										<th width="30%">操作</th>
										<th width="20">操作人</th>
										<th width="20%">时间</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(item, index) in formData.logs">
										<td>{{item.orderStatus}}</td>
										<td>{{item.logInfo}}</td>
					                    <td>{{item.creator.name}}</td>
										<td>{{item.createTime}}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>	
				</div>
			</div>
		</section>
	</div>
</template>

<script>
import {dealWithOrderGoods} from '../../../common/orderGoodses'
import autoComplete from '../../../common/autoComplete'
import deepClone from '../../../common/deepClone'
import http from '../../../common/http'
import api from '../../../common/api'
import initStyle from '../../../common/initStyle'
import selectAfterSaleReason from '../../../component/selectAfterSaleReason'
import selectGoodsTypeAdd from '../../../component/selectGoodsTypeAdd'
import searchGoodsNameForOrder from '../../../component/searchGoodsNameForOrder'
import searchGroupGoodsNameForOrder from '../../../component/searchGroupGoodsNameForOrder'
import selectRegion from '../../../component/selectRegion'
import selectShop from '../../../component/selectShop'
import searchWarehouse from '../../../component/searchWarehouse'
import searchShipping from '../../../component/searchShipping'
import selectWarehouse from '../../../component/selectWarehouse'
import selectRefundType from '../../../component/selectRefundType'
import selectRefundWay from '../../../component/selectRefundWay'

export default {
	data() {
		return {
			id: 'new',
			actionType: 'create',
			returnOrderDisable: false,
			exchangeOrderDisable: false,
			refundOrderDisable: false,
			orderTypeChangeDisabled: false,
			openRefundDiv: false,
			openBackOrderGoodsDiv: false,
			openChangeOrderGoodsDiv: false,
			openLogDiv: false,
			newMemo: {
				show: false,
				data: '',
			},
			addGoods: {
				singleOrGroup: '1',
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
			originalOrder: {},
			party: {},
			formData: {
				orderSn: '',
				omsOrderStatus: '',
				omsShippingStatus: '',
				orderStatus: '',
				orderStatusValue: '',
				shippingStatus: '',
				shippingStatusValue: '',
				settlementStatus: '',
				settlementStatusValue: '',
				logs: [],
				platformName: '',
				seller: '',
				orderType: 'RETURN',
				reasonType: '',
				isPayFirst: false,
				isExchangeFirst: false,
				isPayFirstEditable: false,
				isExchangeFirstEditable: false,
				omsOrderId: '',
				omsOrderSn: '',
				platformOrderIds: [],
				platformOrderIdsString: '',
				shopId: '',
				buyer: '',
				buyerName: '',
				memo: '',
				totalFee: 0,
				preDepositFee: 0,
				lossAmount: 0,
				refundAmount: 0,
				returnAmount: 0,
				exchangeAmount: 0,
				refundNormalAmount: 0,
				refundPreDepositFee: 0,
				refundType: 'SHOP_REFUND',
				refundWay: '',
				accountBank: '',
				accountName: '',
				buyerAccountNum: '',
				returnLogisticsNumber: '',
				returnOrder: {
					discountFee: 0,
					orderId: '',
					originOrderId: '',
					parentOrderId: '',
					warehouseId: '',
					warehouseName: '',
					warehouse: {},
					shippingId: '',
					shippingName: '',
					shipping: {},
					buyer: '',
					receiverProvince: '',
					receiverCity: '',
					receiverDistrict: '',
					receiverAddress: '',
					receiverName: '',
					receiverMobile: '',
					postFee: 0,
					orderGoodses: [],

				},
				exchangeOrder: {
					discountFee: 0,
					orderId: '',
					originOrderId: '',
					parentOrderId: '',
					warehouseId: '',
					warehouseName: '',
					shipping: {},
					shippingId: '',
					shippingName: '',
					buyer: '',
					receiverProvince: '',
					receiverCity: '',
					receiverDistrict: '',
					receiverAddress: '',
					receiverName: '',
					receiverMobile: '',
					postFee: 0,
					orderGoodses: [],
				}
			},

		}
	},
	created () {
    	this.id = this.$route.params.orderId;
    	this.actionType = this.$route.params.actionType;
    	if(this.actionType != 'create') {
    		this.getAfterSaleOrderDetail();
    	}else if(this.actionType == 'create' && this.id != 'new') {
    		this.formData.omsOrderSn = this.id;
    		this.loadOrderInfo();
    	}
	},
	mounted() {
	    this.$nextTick(() => {
	      	initStyle();
	      	this.getPartyDetails();	
	    });	
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
			return this.formData.refundAmount;
		},
		_lossAmount() {
			var lossAmountTemp = 0;
			var originPostFee = $.isEmptyObject(this.originalOrder) ? 0 : this.originalOrder.postFee;
			var exchangePostFee = $.isEmptyObject(this.formData.exchangeOrder) ? 0 : this.formData.exchangeOrder.postFee;
			var returnPostFee = $.isEmptyObject(this.formData.returnOrder) ? 0 : this.formData.returnOrder.postFee;
			lossAmountTemp = Number(this.formData.returnAmount) - Number(originPostFee) - Number(returnPostFee) - Number(this.formData.exchangeAmount) - Number(exchangePostFee) - Number(this.formData.refundAmount);
			this.formData.lossAmount = Math.floor(lossAmountTemp*100)/100;
			return this.formData.lossAmount;
		},
		_returnAmount() {
			const _self = this;
			var returnAmountTemp = 0;
			if(_self.originalOrder && _self.originalOrder.orderGoodses){
				_self.originalOrder.orderGoodses.forEach(function(item, index){
					item.forEach(function(item1, index1){
						if(item1.returnNum == item1.restReturnNum){
							returnAmountTemp += Number(item1.totalFee)-Number(item1.totalFee)/Number(item1.number)*(Number(item1.number)-Number(item1.returnNum));
						}else{
							returnAmountTemp += Number(item1.totalFee)/Number(item1.number)*Number(item1.returnNum);
						}
					});
				});
				this.formData.returnAmount = Math.floor(returnAmountTemp*100)/100;
				return this.formData.returnAmount;
			}else{
				return 0;
			}
		},
		_exchangeAmout() {
			const _self = this;
			var exchangeAmountTemp = 0;
			if(_self.formData.exchangeOrder.orderGoodses){
				_self.formData.exchangeOrder.orderGoodses.forEach(function(item, index){
					if(item.originNum == 0){
						exchangeAmountTemp += Number(item.price) * Number(item.number);
						item.totalFee = (Number(item.price) * Number(item.number)).toFixed(2);
					}else{
						exchangeAmountTemp += Number(item.totalFee)*Number(item.number)/Number(item.originNum);
					}
				});
				this.formData.exchangeAmount =  Math.floor(exchangeAmountTemp*100)/100;
				return this.formData.exchangeAmount;
			}else {
				return 0;
			}
			
		}
	},
	filters: {
		refundTypeNoteFilter(val) {
			var refundTypeNoteMapping = {
				'SHOP_REFUND': '淘宝未确认收货前退款',
				'ONLINE_BANK_REFUND': '直接转账退款给顾客个人账户',
				'RECEIPT_REFUND': '非淘各平台的在线退款，包含淘宝确认收货后的售后退款'
			};
			return refundTypeNoteMapping[val];
		}
	},
	components: {selectAfterSaleReason,selectGoodsTypeAdd,searchGoodsNameForOrder,searchGroupGoodsNameForOrder,selectRegion,selectShop,searchWarehouse,searchShipping,selectWarehouse,selectRefundType,selectRefundWay},
	methods: {
		disabled() {
			if(this.actionType == 'create') {//新建退换货
				this.returnOrderDisable = false;
				this.exchangeOrderDisable = false;
				this.refundOrderDisable = false;
				this.orderTypeChangeDisabled = false;
			}else if(this.actionType == 'view') {//查看退换货
				this.returnOrderDisable = true;
				this.exchangeOrderDisable = true;
				this.refundOrderDisable = true;
				this.orderTypeChangeDisabled = true;
			} else {
				//待编辑 待审核 审核否决 财神驳回时可修改退款信息
				this.refundOrderDisable = !(this.formData.settlementStatus == 'REJECT' || this.formData.orderStatus == 'INVALID' || this.formData.orderStatus == 'WAIT_CHECK' || this.formData.orderStatus == 'CHECK_REJECT');
				//审核通过状态下  退换货可以互转
				this.orderTypeChangeDisabled = !(this.formData.orderStatus == 'INVALID' || ((this.formData.orderStatus == 'WAIT_CHECK' || this.formData.orderStatus == 'CHECK_PASS') && (this.formData.orderType == 'RETURN' || this.formData.orderType == 'EXCHANGE')));

				if(this.formData.orderType == 'EXCHANGE' && this.oldOrderType == 'RETURN') {//退货单转换货单
					this.exchangeOrderDisable = false;
					this.returnOrderDisable = !(this.formData.orderStatus=='INVALID' || this.formData.orderStatus=='CHECK_REJECT' || this.formData.orderStatus=='WAIT_CHECK');
				}else if((this.formData.orderType == 'RETURN' || this.formData.orderType == 'EXCHANGE') && this.oldOrderType == 'REFUND') {//退款单转为退货换货单
					this.returnOrderDisable = false;
					this.exchangeOrderDisable = false;
				}else {
					this.exchangeOrderDisable = !(this.formData.orderStatus=='INVALID' || this.formData.orderStatus=='CHECK_REJECT'  || this.formData.orderStatus == 'WAIT_CHECK');
					this.returnOrderDisable = !(this.formData.orderStatus=='INVALID' || this.formData.orderStatus=='CHECK_REJECT' || this.formData.orderStatus == 'WAIT_CHECK');
				}
			}	
			if(this.formData.orderType == 'RETURN') {
				this.exchangeOrderDisable = true;
			}else if(this.formData.orderType == 'REFUND' || this.formData.orderType == 'REFUND_ONLY' || this.formData.orderType == 'REFUND_ORDER_CANCEL') {
				this.exchangeOrderDisable = true;
				this.returnOrderDisable = true;
			}
		},
		showUpdateButton() {
			if(this.actionType == 'edit' && (this.formData.orderStatus == 'WAIT_CHECK' || this.formData.orderStatus == 'INVALID' || this.formData.orderStatus == 'CHECK_PASS' || this.formData.orderStatus == 'CHECK_REJECT' || this.formData.shippingStatus == 'PUSH' || this.formData.shippingStatus == 'OPERATED' || this.formData.settlementStatus == 'REJECT')) {
                return true;
            }else {
                return false;
            }
		},
		getPartyDetails() {
			const _self = this;
			http({
		    		instance: _self,
		    		url: api.getPartyDetail,
		            type: 'post',
		            hasLoading: true,
		            success (res) {
		            	_self.formData.isExchangeFirstEditable = res.data.isExchangeFirst;
		            	_self.formData.isPayFirstEditable = res.data.isPayFirst;
		            	_self.party = res.data;
		            }
		        });
		},
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
		            	// _self.formData = res.data;
		            	if(res.data.orderType == 'RETURN') {
		            		for(var i in _self.formData) {
			            		if(i != 'exchangeOrder' && i != 'returnOrder'){
			            			if(res.data[i] != undefined){
			            				_self.formData[i] = res.data[i];
			            			}
		            			}else if(i == 'returnOrder') {
		            				for(var j in _self.formData[i]){
			            				if(res.data[i] != undefined && res.data[i][j] != undefined) {
			            					_self.formData[i][j] = res.data[i][j];
			            					if((j == 'receiverProvince' || j == 'receiverCity' || j == 'receiverDistrict') && res.data[i][j] != undefined) {
			            						_self.formData[i][j] = res.data[i][j]['regionId'];
			            					}
			            				}
			            			}
		            			}
			            	}
		            	}else if(res.data.orderType == 'EXCHANGE') {
		            		for(var i in _self.formData) {
		            			if(i == 'returnOrder' || i == 'exchangeOrder') {
		            				for(var j in _self.formData[i]){
			            				if(res.data[i] != undefined && res.data[i][j] != undefined) {
			            					_self.formData[i][j] = res.data[i][j];
			            					if((j == 'receiverProvince' || j == 'receiverCity' || j == 'receiverDistrict') && res.data[i][j] != undefined) {
			            						_self.formData[i][j] = res.data[i][j]['regionId'];
			            					}
			            				}
			            			}
		            			}else {
		            				if(res.data[i] != undefined){
			            				_self.formData[i] = res.data[i];

			            			}
		            			}	
			            	}
		            	}else {
		            		for(var i in _self.formData) {
			            		if(i != 'returnOrder' && i != 'exchangeOrder'){
			            			if(res.data[i] != undefined){
			            				_self.formData[i] = res.data[i];
			            			}
		            			}
			            	}
		            	}
		            	_self.oldOrderType = res.data.orderType;
		            	_self.originalOrder = res.data.omsOrder;

		            	_self.formData.id = res.data.id;
		            	_self.formData.omsOrderId = res.data.omsOrder == undefined ? '' : res.data.omsOrder.orderId;
						_self.formData.omsOrderSn = res.data.omsOrder == undefined ? '' : res.data.omsOrder.orderSn;
		            	_self.formData.platformOrderIdsString = res.data.platformOrderIds == undefined ? '' : res.data.platformOrderIds.join(',');
		            	_self.formData.shopId = res.data.shop.shopId;
		            	_self.formData.platformName = res.data.shop.shopPlatformValue;
		            	_self.formData.totalFee = res.data.omsOrder == undefined ? '' : res.data.omsOrder.totalFee;
		            	_self.formData.preDepositFee = res.data.omsOrder == undefined ? 0: res.data.omsOrder.preDepositFee;

		            	if(res.data.orderType == 'REFUND'){
							_self.openRefundDiv = true;
							// _self.formData.returnOrder.discountFee = 0;
							// _self.formData.returnOrder.postFee = 0;
							// _self.formData.returnOrder.orderGoodses = [];

							// _self.formData.exchangeOrder.discountFee = 0;
							// _self.formData.exchangeOrder.postFee = 0;
							// _self.formData.exchangeOrder.orderGoodses = [];
						}
						if((res.data.orderType == 'RETURN' || res.data.orderType == 'EXCHANGE') && res.data.returnOrder){
							_self.openRefundDiv = true;
							_self.openBackOrderGoodsDiv = true;
							_self.formData.returnOrder.warehouseId = (res.data.returnOrder.warehouse == undefined) ? '' : res.data.returnOrder.warehouse.warehouseId;
							_self.formData.returnOrder.warehouseName = (res.data.returnOrder.warehouse == undefined) ? '' : res.data.returnOrder.warehouse.warehouseName;
		            		_self.formData.returnOrder.shippingId = (res.data.returnOrder.shipping == undefined) ? '' : res.data.returnOrder.shipping.shippingId;
		            		_self.formData.returnOrder.shippingName = (res.data.returnOrder.shipping == undefined) ? '' : res.data.returnOrder.shipping.shippingName;

		            		_self.formData.returnOrder.originOrderId = res.data.omsOrder == undefined || res.data.omsOrder.originOrder == undefined ? '' : res.data.omsOrder.originOrder.id;
							_self.formData.returnOrder.parentOrderId = res.data.omsOrder == undefined ? '' : res.data.omsOrder.orderId;

							if(res.data.returnOrder.orderGoodses && res.data.returnOrder.orderGoodses.length > 0){
								if(res.data.omsOrder != undefined) {
									res.data.omsOrder.orderGoodses.forEach(function(item,key){
				            			res.data.returnOrder.orderGoodses.forEach(function(item1){
				            				if(item1.parent.orderGoodsId == item.orderGoodsId){
				            					item.returnNum = item1.number;
				            				}
				            			});
				            			if(!item.returnNum) {
				            				item.returnNum = 0;
				            			}
				            		});
								}
							}
							// if(res.data.orderType == 'RETURN'){
							// 	_self.formData.exchangeOrder.discountFee = 0;
							// 	_self.formData.exchangeOrder.postFee = 0;
							// 	_self.formData.exchangeOrder.orderGoods = [];
							// }
							
						}
						if(res.data.orderType == 'EXCHANGE' && res.data.exchangeOrder){
							_self.openRefundDiv = true;
							_self.openBackOrderGoodsDiv = true;
							_self.openChangeOrderGoodsDiv = true;

		            		_self.formData.exchangeOrder.originOrderId = res.data.omsOrder.originOrder.id;
							_self.formData.exchangeOrder.parentOrderId = res.data.omsOrder.orderId;

							_self.formData.exchangeOrder.warehouseId = (res.data.exchangeOrder.warehouse == undefined) ? '' : res.data.exchangeOrder.warehouse.warehouseId;
							_self.formData.exchangeOrder.warehouseName = (res.data.exchangeOrder.warehouse == undefined) ? '' : res.data.exchangeOrder.warehouse.warehouseName;
							_self.formData.exchangeOrder.shippingId = (res.data.exchangeOrder.shipping == undefined) ? '' : res.data.exchangeOrder.shipping.shippingId;
							_self.formData.exchangeOrder.shippingName = (res.data.exchangeOrder.shipping == undefined) ? '' : res.data.exchangeOrder.shipping.shippingName;
							if(res.data.exchangeOrder.orderGoodses && res.data.exchangeOrder.orderGoodses.length > 0){
								res.data.exchangeOrder.orderGoodses.forEach(function(item,key){
									var temp = false;
			            			res.data.omsOrder.orderGoodses.forEach(function(item1, key1){
			            				item.skuOrGroupCode = item.sku.skuCode;
	            						item.skuOrGroupName = item.sku.skuName;
	            						item.skuId = item.sku.skuId;
	            						
			            				if(item.parent.orderGoodsId == item1.orderGoodsId){
			            					item.originNum = item1.number;
			            					item.totalFee = item1.totalFee;	
			            					temp = true;
			            				}
			            			});
			            			if(!temp){
			            				item.originNum = 0;
			            				item.totalFee = 0;	
			            			}
	            					
		            			
			            		});
							}
						}

						if(res.data.omsOrder != undefined && res.data.omsOrder.orderGoodses){
							var tempObj = dealWithOrderGoods(res.data.omsOrder.orderGoodses);
		            		_self.originalOrder.orderGoodses = tempObj.orderGoods;
						}

						_self.disabled();
		            },
		        });
		},
        create () {
        	const _self = this;
        	_self.formData.returnOrder.orderGoodses = [];
        	if(_self.formData.omsOrderId == '' && _self.formData.memo == ''){
        		layer.msg('创建失败！【原单加载】和【备注】必填一项', {
            		time: 2000
            	});
            	return false;
        	}
        
        	if(_self.originalOrder.orderGoodses != undefined && _self.originalOrder.orderGoodses.length > 0) {
        		_self.originalOrder.orderGoodses.forEach(function(item, index){
	        		item.forEach(function(item1, index1){
	        			if(item1.returnNum > 0){
	        				var good = {
	        					editable: false,
	        					gift: item1.gift,
	        					sku: item1.sku,
	        					skuId: item1.sku.skuId,
	        					skuOrGroupCode: item1.sku.skuCode,
	        					skuOrGroupName: item1.sku.skuName,
	        					number: item1.returnNum,
	        					statusId: item1.statusId,
	        					price: item1.price,
	        					originOrderId: item1.originOrder.id,
	        					originOrderGoodsId: item1.originOrderGoods.id,
	        					parentOrderGoodsId: item1.orderGoodsId,
	        					groupNum: item1.groupNum || '',
	        					groupId: (item1.group == undefined) ? '' : item1.group.goodsGroupId,
	        					diffKey: item1.diffKey,
	        				};
	        				_self.formData.returnOrder.orderGoodses.push(good);
	        			}
	        		});

	        	});
        	}
        	

        	if(_self.formData.omsOrderSn != '' && _self.formData.returnOrder.orderGoodses.length == 0 && _self.formData.orderType == 'RETURN'){
        		layer.msg('创建失败！【退货商品】必填', {
            		time: 2000
            	});
        	}else if(_self.formData.omsOrderSn != '' && _self.formData.exchangeOrder.orderGoodses.length == 0 && _self.formData.orderType == 'EXCHANGE') {
        		layer.msg('创建失败！【换货商品】必填', {
            		time: 2000
            	});
        	}else {
		    	http({
		    		instance: _self,
		    		url: api.addAfterSaleOrder,
		            type: 'post',
		            data: {
		            	data: _self.formData,
		            },
		            hasLoading: true,
		            success (res) {
		            	// layer.msg(res.msg, {
		            	// 	time: 2000
		            	// });
		            	Object.assign(_self.$data, _self.$options.data());
            			layer.alert('订单创建成功！售后单号为：<a href="#/ordersManage/afterSaleManage/afterSaleOrderDetail/view/' + res.data.id + '" target="_blank">' + res.data.orderSn + '</a>', {icon: 6});
		            }
		        });
		    }
        },
        update() {
        	const _self = this;
        	_self.formData.returnOrder.orderGoodses = [];
        	_self.originalOrder.orderGoodses.forEach(function(item, index){
        		item.forEach(function(item1, index1){
        			if(item1.returnNum > 0){
        				var good = {
        					editable: false,
        					gift: item1.gift,
        					sku: item1.sku,
        					skuId: item1.sku.skuId,
        					skuOrGroupCode: item1.sku.skuCode,
        					skuOrGroupName: item1.sku.skuName,
        					number: item1.returnNum,
        					statusId: item1.statusId,
        					price: item1.price,
        					originOrderId: item1.originOrder.id,
        					originOrderGoodsId: item1.originOrderGoods.id,
        					parentOrderGoodsId: item1.orderGoodsId,
        					groupNum: item1.groupNum || '',
        					groupId: (item1.group == undefined) ? '' : item1.group.goodsGroupId,
        					diffKey: item1.diffKey,
        				};
        				_self.formData.returnOrder.orderGoodses.push(good);
        			}
        		});

        	});

        	if(_self.formData.omsOrderSn != '' && _self.formData.returnOrder.orderGoodses.length == 0 && _self.formData.orderType == 'RETURN'){
        		layer.msg('更新失败！【退货商品】必填', {
            		time: 2000
            	});
        	}else if(_self.formData.omsOrderSn != '' && _self.formData.exchangeOrder.orderGoodses.length == 0 && _self.formData.orderType == 'EXCHANGE') {
        		layer.msg('更新失败！【换货商品】必填', {
            		time: 2000
            	});
        	}else {
        		if(_self.formData.orderType != 'INVALID') {
        			var memotemp = _self.formData.memo;
        			_self.formData.memo = _self.newMemo.data;
        		}
        		
		    	http({
		    		instance: _self,
		    		url: api.updateAfterSaleOrder,
		            type: 'post',
		            data: {
		            	data: _self.formData,
		            },
		            hasLoading: true,
		            success (res) {
		            	layer.msg(res.msg, {
		            		time: 2000
		            	});
		            	_self.getAfterSaleOrderDetail();
		            },
		            fail(res) {
		            	layer.msg(res.subMsg, {
		            		time: 2000
		            	});
						_self.formData.memo = memotemp;
		            }
		        });
		    }
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
	            	_self.getAfterSaleOrderDetail();
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

	            	_self.getAfterSaleOrderDetail();
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

	            	_self.getAfterSaleOrderDetail();
	            }
	        });
    	},

        loadOrderInfo() {//加载订单信息
        	const _self = this;
        	if(_self.formData.platformOrderIdsString == '' && _self.formData.omsOrderSn == ""){
        		layer.msg("系统单号和原始单号必填一项", {
        			time: 1000
        		});
        		return false;
        	}
	    	http({
	    		instance: _self,
	    		url: api.loadAfterSaleOrder,
	            type: 'post',
	            data: {
	            	data: {
	            		orderSn: _self.formData.omsOrderSn,
	            		platformOrderId: _self.formData.platformOrderIdsString,
	            	},
	            },
	            hasLoading: true,
	            success (res) {
	            	if(res.data.orderSns && res.data.orderSns.length > 0){

	            		$("#omsOrderId").autocomplete(res.data.orderSns, {
					        minChars: 0,
					        max: 100,
					        matchContains: true,
					        autoFill: false,
					        autoFocus: true,
					    }).result(function(event, row, formatted) {
					    	_self.formData.omsOrderSn = formatted;

					    });
					    $("#omsOrderId").showSelect();

					    layer.msg('该原始订单对应了对个系统订单，请选择其中一个系统订单', {
		            		time: 1000
		            	});

	            	}else if(res.data.order){
	            		
	            		var tempObj = dealWithOrderGoods(res.data.order.orderGoodses);
	            		res.data.order.orderGoodses = tempObj.orderGoods;
	            		_self.originalOrder = res.data.order;
	            		_self.formData.omsOrderId = res.data.order.orderId;
	            		_self.formData.platformOrderIds = res.data.platformOrderIds;
	            		_self.formData.platformOrderIdsString = res.data.platformOrderIds == undefined ? '' : res.data.platformOrderIds.join(',');
	            		_self.formData.platformName = res.data.order.shop.shopPlatformValue;
						_self.formData.seller = res.data.order.shop.shopNick;
						_self.formData.shopId = res.data.order.shop.shopId;
						_self.formData.buyer = res.data.order.buyer;
						_self.formData.buyerName = res.data.order.receiverName;
						_self.formData.totalFee = res.data.order.totalFee;
						_self.formData.omsOrderStatus = res.data.order.orderStatus;
						_self.formData.omsShippingStatus = res.data.order.shippingStatus;
						_self.formData.preDepositFee = res.data.order.preDepositFee == undefined ? 0 : res.data.order.preDepositFee;
						
						_self.formData.returnOrder.originOrderId = res.data.order.originOrder.id;
						_self.formData.returnOrder.parentOrderId = res.data.order.orderId;
						_self.formData.returnOrder.orderGoodses = res.data.order.orderGoodses;
						_self.formData.returnOrder.discountFee = res.data.order.discountFee;

						_self.formData.exchangeOrder.originOrderId = res.data.order.originOrder.id;
						_self.formData.exchangeOrder.parentOrderId = res.data.order.orderId;
						if(_self.formData.omsOrderStatus == 'CLOSE_PLATFORM' || _self.formData.omsOrderStatus == 'CLOSED_MANUAL') {
							_self.formData.orderType = 'REFUND_ORDER_CANCEL';
						}else if(((_self.formData.omsOrderStatus == 'WAIT_CHECK' || _self.formData.omsOrderStatus == 'CHECK_PASS') && _self.formData.omsShippingStatus == 'INIT') || _self.formData.omsShippingStatus == 'PUSH') {
							_self.formData.orderType = 'REFUND_ONLY';
						} else{
							_self.formData.orderType = 'RETURN';
						}

						if(_self.formData.orderType == 'REFUND' || _self.formData.orderType == 'REFUND_ONLY' || _self.formData.orderType == 'REFUND_ORDER_CANCEL'){
							_self.openRefundDiv = true;
						}
						if(_self.formData.orderType == 'RETURN'){
							_self.openRefundDiv = true;
							_self.openBackOrderGoodsDiv = true;
						}
						if(_self.formData.orderType == 'EXCHANGE'){
							_self.openRefundDiv = true;
							_self.openBackOrderGoodsDiv = true;
							_self.openChangeOrderGoodsDiv = true;
						}
						_self.formData.returnOrder.orderGoodses.forEach(function(item){
							item.forEach(function(item1){
								item1.returnNum = 0;
							});
						});
	            	}
	            	
	            }
	        });
        },
        formReset() {//重置
        	this.originalOrder = {};
        	this.formData.omsOrderSn = '';
        	this.formData.platformName = '';
        	this.formData.seller = '';
        	this.formData.isPayFirst = false;
			this.formData.isExchangeFirst = false;
        	this.formData.omsOrderId = '';
        	this.formData.platformOrderIds = [];
        	this.formData.platformOrderIdsString = '';
        	this.formData.shopId = '';
        	this.formData.seller = '';
        	this.formData.buyer = '';
        	this.formData.buyerName = '';
        	this.formData.memo = '';
        	this.formData.totalFee = 0;
        	this.formData.preDepositFee = 0;
        	this.formData.lossAmount = 0;
        	this.formData.refundNormalAmount = 0;
        	this.formData.refundAmount = 0;
        	this.formData.returnAmount = 0;
        	this.formData.exchangeAmount = 0;
        	this.formData.shopRefundAmount = 0;
        	this.formData.refundPreDepositFee = 0;
        	this.formData.refundOnlineBank = 0;
        	this.formData.refundWay = '';
        	this.formData.accountBank = '';
        	this.formData.accountName = '';
        	this.formData.buyerAccountNum = '';
        	this.formData.returnLogisticsNumber = '';
        	this.formData.refundType = 'SHOP_REFUND';
        	this.formData.returnOrder = {
        		discountFee: 0,
				orderId: '',
				originOrderId: '',
				parentOrderId: '',
				warehouse: {},
				warehouseId: '',
				warehouseName: '',
				shipping: {},
				shippingId: '',
				shippingName: '',
				buyer: '',
				receiverProvince: '',
				receiverCity: '',
				receiverDistrict: '',
				receiverAddress: '',
				receiverName: '',
				receiverMobile: '',
				postFee: 0,
				orderGoodses: [],

			};

			this.formData.exchangeOrder = {
				discountFee: 0,
				orderId: '',
				originOrderId: '',
				parentOrderId: '',
				warehouseId: '',
				warehouseName: '',
				shipping: {},
				shippingId: '',
				shippingName: '',
				buyer: '',
				receiverProvince: '',
				receiverCity: '',
				receiverDistrict: '',
				receiverAddress: '',
				receiverName: '',
				receiverMobile: '',
				postFee: 0,
				orderGoodses: [],
			};

			
        },
        
        selectedReturnProvince(data) {
        	this.formData.returnOrder.receiverProvince = data.data.regionId;
        	this.formData.returnOrder.receiverCity = '';
        	this.formData.returnOrder.receiverDistrict = '';
        },
        selectedReturnCity(data) {
        	this.formData.returnOrder.receiverCity = data.data.regionId;
        	this.formData.returnOrder.receiverDistrict = '';
        },
        selectedReturnDistrict(data) {
        	this.formData.returnOrder.receiverDistrict = data.data.regionId;
        },
        selectedChangeProvince(data) {
        	this.formData.exchangeOrder.receiverProvince = data.data.regionId;
        	this.formData.exchangeOrder.receiverCity = '';
        	this.formData.exchangeOrder.receiverDistrict = '';
        },
        selectedChangeCity(data) {
        	this.formData.exchangeOrder.receiverCity = data.data.regionId;
        	this.formData.exchangeOrder.receiverDistrict = '';
        },
        selectedChangeDistrict(data) {
        	this.formData.exchangeOrder.receiverDistrict = data.data.regionId;
        },
        selectedReasonType(data) {
        	this.formData.reasonType = data.reasonType;
        },
        selectedShop(data) {
        	if($.isEmptyObject(data)){
        		this.formData.shopId = '';
	        	this.formData.seller = '';
	        	this.formData.platformName = '';
        	}else {
        		this.formData.shopId = data.data.shopId;
        		this.formData.seller = data.data.shopNick;
        		this.formData.platformName = data.data.shopPlatformValue;
        	}
        	

        },
        /**退款部分*/
        selectedRefundType(data) {
        	this.formData.refundType = data;
        },
		selectedRefundWay(data) {
			this.formData.refundWay = data;
		},
		
        /*退货部分*/
        selectedRetrunWarehouse(data) {
        	if(!$.isEmptyObject(data) && data) {
        		this.formData.returnOrder.warehouseId = data.warehouseId;
        	}else {
        		this.formData.returnOrder.warehouseId = '';
        	}
        	
        },
        selectedReturnShipping(data) {
        	if(!$.isEmptyObject(data) && data) {
        		this.formData.returnOrder.shippingId = data.shippingId;
        	} else {
        		this.formData.returnOrder.shippingId = '';
        	}
        	
        },
        backAllGoods() {
        	const _self = this;
        	_self.originalOrder.orderGoodses.forEach(function(item, index){
        		        		console.log(item);

        		item.forEach(function(item1, index1){
        			item1.returnNum = item1.restReturnNum;
        		})
        	});
        	_self.originalOrder.orderGoodses.splice(0,0);
    	
        },
        modifyReturnGoodsNum() {
			this.originalOrder.orderGoodses.splice(0,0);
		},
        backOriginOrder() {
        	if(!$.isEmptyObject(this.originalOrder)){
        		this.formData.returnOrder.receiverName = this.originalOrder.receiverName;
	        	this.formData.returnOrder.receiverMobile = this.originalOrder.receiverMobile;
	        	this.formData.returnOrder.receiverProvince = this.originalOrder.receiverProvince.regionId;
	        	this.formData.returnOrder.receiverCity = this.originalOrder.receiverCity.regionId;
	        	this.formData.returnOrder.receiverDistrict = (this.originalOrder.receiverDistrict == undefined) ? '' : this.originalOrder.receiverDistrict.regionId;
	        	this.formData.returnOrder.receiverAddress = this.originalOrder.receiverAddress;
	        	this.backAllGoods();
        	}else{
        		layer.msg('未加载原单~', {time:2000});
        	}
        	
	        
        },

        /*换货部分*/
        changeSingleOrGroup(data) {
        	this.addGoods = {
        		singleOrGroup: data,
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
        addGoodsToChange() {
        	const _self = this;
        	var goodAdd = {
        		editable: false,
				gift: (_self.addGoods.isGift=='0') ? false : true,
				sku: {},
				skuId: '',
				skuOrGroupCode: '',
				skuOrGroupName: '',
				number: '',
				statusId: '',
				price: _self.addGoods.addPrice,
				originOrderId: '',
				originOrderGoodsId: '',
				parentOrderGoodsId: '',
				groupNum: '',
				groupId: '',
				diffKey: '',
				originNum: 0,
				totalFee: 0,
				priceEditable: true,
        	};
        	
        	if(_self.addGoods.singleOrGroup == '1'){//单品
	            http({
	                instance: _self,
	                url: api.getGoodsSku,
	                type: 'post',
	                data:{
	                	data:{
	                		"goodsId": _self.addGoods.addGoodsId,
	                		"styleValue1": _self.addGoods.addStyleType1.active,
	                		"styleValue2": _self.addGoods.addStyleType2.active,
	                		"styleValue3": _self.addGoods.addStyleType3.active,
	                		"partyId": ''
	                	},
	                },
	                hasLoading: false,
	                success (res) {
                		goodAdd.skuOrGroupName = _self.addGoods.addGoodsName;
                		goodAdd.skuOrGroupCode = res.data.skuCode;
                		goodAdd.skuId = res.data.skuId;
                		goodAdd.sku = res.data;
                		goodAdd.number = _self.addGoods.addQuantity;
		        		_self.formData.exchangeOrder.orderGoodses.push(goodAdd);

		        		_self.addGoods = {
		        			singleOrGroup: 1,
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
						};	
	                	
	                }
	            });
			}else{//套餐
				goodAdd.skuOrGroupName = _self.addGoods.addGoodsName;
				goodAdd.skuOrGroupCode = _self.addGoods.addOuterIid;
	            goodAdd.groupId = _self.addGoods.addOuterIid;
	            goodAdd.groupNum = _self.addGoods.addQuantity;

        		_self.formData.exchangeOrder.orderGoodses.push(goodAdd);

        		_self.addGoods = {
        			singleOrGroup: 0,
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
				};
        		                	
			}


        },
        copyReturnGoods() {
        	const _self = this;
        	_self.formData.exchangeOrder.orderGoodses = [];
        	_self.formData.exchangeOrder.discountFee = _self.formData.returnOrder.discountFee;
        	_self.originalOrder.orderGoodses.forEach(function(item, index){
        		item.forEach(function(item1, index1){
        			if(item1.returnNum > 0){
        				var good = {
        					editable: false,
        					gift: item1.gift,
        					sku: item1.sku,
        					skuId: item1.sku.skuId,
        					skuOrGroupCode: item1.sku.skuCode,
        					skuOrGroupName: item1.sku.skuName,
        					number: item1.returnNum,
        					statusId: item1.statusId,
        					price: item1.price,
        					originOrderId: item1.originOrder.id,
        					originOrderGoodsId: item1.originOrderGoods.id,
        					parentOrderGoodsId: item1.orderGoodsId,
        					groupNum: item1.groupNum,
        					groupId: (item1.group == undefined) ? '' : item1.group.goodsGroupId,
        					diffKey: item1.diffKey,
        					totalFee: item1.totalFee,
        					originNum: item1.number,
        					priceEditable: false

        				};
        				_self.formData.exchangeOrder.orderGoodses.push(good);
        			}
        		});

        	});
        },
        
        // editOrderGood(index){
        // 	this.formData.exchangeOrder.orderGoodses[index].editable = true;
        // },
        deleteOrderGood(index){
        	this.formData.exchangeOrder.orderGoodses.splice(index, 1);
        },
        changeToOriginalAddress() {
        	if(!$.isEmptyObject(this.originalOrder)){
	    		this.formData.exchangeOrder.receiverName = this.originalOrder.receiverName;
	    		this.formData.exchangeOrder.receiverMobile = this.originalOrder.receiverMobile;
	    		this.formData.exchangeOrder.receiverAddress = this.originalOrder.receiverAddress;
	    		this.formData.exchangeOrder.receiverProvince = this.originalOrder.receiverProvince.regionId;
	    		this.formData.exchangeOrder.receiverCity = this.originalOrder.receiverCity.regionId;
	    		this.formData.exchangeOrder.receiverDistrict = (this.originalOrder.receiverDistrict == undefined) ? '' : this.originalOrder.receiverDistrict.regionId;
	    	}else {
	    		layer.msg('未加载原单~', {time:2000});
	    	}
        	
        	
        },
        selectedChangeWarehouse(data) {
        	this.formData.exchangeOrder.warehouseId = data.data;
        },
        selectedChangeShipping(data) {
        	if(!$.isEmptyObject(data) && data) {
        		this.formData.exchangeOrder.shippingId = data.shippingId;
        	}else {
        		this.formData.exchangeOrder.shippingId = '';
        	}
        },
        openBackOrderGoods() {
        	if(this.openBackOrderGoodsDiv == false) {
        		if(!(this.formData.orderType == 'EXCHANGE' || this.formData.orderType == 'RETURN')){
        			layer.msg('选择的售后类型不是退换货，无法修改退货信息~', {timeout: 2000});
        			return false;
        		}
        	}
        	this.openBackOrderGoodsDiv = !this.openBackOrderGoodsDiv;
        },
        openChangeOrderGoods() {
        	if(this.openChangeOrderGoodsDiv == false) {
        		if(this.formData.orderType != 'EXCHANGE'){
        			layer.msg('选择的售后类型不是换货，无法修改换货信息~', {timeout: 2000});
        			return false;
        		}
        	}
        	this.openChangeOrderGoodsDiv = !this.openChangeOrderGoodsDiv;
        },
        changeType() {
        	if(this.formData.orderType == 'EXCHANGE') {
        		this.openBackOrderGoodsDiv = true;
        		this.openChangeOrderGoodsDiv = true;
        		this.openRefundDiv = true;
        	}else if(this.formData.orderType == 'RETURN') {
        		this.openRefundDiv = true;
        		this.openBackOrderGoodsDiv = true;
        		this.openChangeOrderGoodsDiv = false;

	        	this.formData.exchangeAmount = 0;
	        	this.formData.exchangeOrder = {
					discountFee: 0,
					orderId: '',
					originOrderId: '',
					parentOrderId: '',
					warehouseId: '',
					warehouseName: '',
					shipping: {},
					shippingId: '',
					shippingName: '',
					buyer: '',
					receiverProvince: '',
					receiverCity: '',
					receiverDistrict: '',
					receiverAddress: '',
					receiverName: '',
					receiverMobile: '',
					postFee: 0,
					orderGoodses: [],
				};
        	}else {
        		this.openRefundDiv = true;
        		this.openBackOrderGoodsDiv = false;
        		this.openChangeOrderGoodsDiv = false;

        		if(this.originalOrder.orderGoodses) {
        			this.originalOrder.orderGoodses.forEach(function(item){
	        			item.forEach(function(item1){
	        				item1.returnNum = 0;
	        			})
	        		});
        		}
        		
        		this.formData.returnAmount = 0;
	        	this.formData.exchangeAmount = 0;
	        	this.formData.returnLogisticsNumber = '';
	        	this.formData.returnOrder = {
	        		discountFee: 0,
					orderId: '',
					originOrderId: '',
					parentOrderId: '',
					warehouse: {},
					warehouseId: '',
					warehouseName: '',
					shipping: {},
					shippingId: '',
					shippingName: '',
					buyer: '',
					receiverProvince: '',
					receiverCity: '',
					receiverDistrict: '',
					receiverAddress: '',
					receiverName: '',
					receiverMobile: '',
					postFee: 0,
					orderGoodses: [],

				};

				this.formData.exchangeOrder = {
					discountFee: 0,
					orderId: '',
					originOrderId: '',
					parentOrderId: '',
					warehouseId: '',
					warehouseName: '',
					shipping: {},
					shippingId: '',
					shippingName: '',
					buyer: '',
					receiverProvince: '',
					receiverCity: '',
					receiverDistrict: '',
					receiverAddress: '',
					receiverName: '',
					receiverMobile: '',
					postFee: 0,
					orderGoodses: [],
				};
        	}
        	this.disabled();
        }
	}
}
</script>

<style scoped>
.after-sale-order {
	background-color: #fff;
	float: left;
	width: 100%;
	min-height: 100%;
}
h4 {
	font-weight: bold;
	margin-left: 6px;
	margin-right: 6px;
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
.refund, .back-order-goods, .change-order-goods, .action-buttons {
	border-top:1px dashed #797979; 
	padding-top:10px;
}
button {
	margin-left: 10px;
	padding-right: 10px;
	padding-left: 10px;
}
i {
	/*padding-top: 2px;*/
	font-size: 20px;
}
h5 i{
	font-size: 16px;
}
.add-good div {
	padding-right: 3px;
	padding-left: 3px;
}
.add-good label{
	color: #666;
}
input, select {
	padding-left: 2px;
	padding-right: 2px;
}
.confirm-icon {
	color: #78BF2A;
}
.cancel-icon, .delete-icon {
	color: #F86767;
}
.btn {
	padding-right: 20px;
	padding-left: 20px;
}
.not-editable {
	border:0px solid transparent;
}
label {
	overflow:hidden;
	white-space:nowrap;
}
.table td {
	position: relative;
	vertical-align: middle;
}
.content-wrapper {
	padding-top: 0px;
	margin-left: 0px;
}
</style>