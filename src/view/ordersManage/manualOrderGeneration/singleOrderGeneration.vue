<template>
    <div class="signle-order-generation">
	    <form name="newOrderForm" @submit.prevent="onSubmit" role="form">
	    	<div class="order-info">
		    	<div class="col-md-12 no-padding form-horizontal">
			    	<div class="form-group">
			    		<label class="col-md-1 control-label">OMS订单号</label>
		                <div class="col-md-2" style="padding-right:0px;">
		                    <nobr><input type="text" v-model.trim="orderSn" class="form-control input-sm" style="width:78%;display:inline"/>
		                    <button class="btn btn-xs btn-info" style="margin-bottom:2px;" @click.prevent="fetchOrderInfo" :disabled="!orderSn.trim()">加载</button></nobr>
		                </div>
	                    <label class="col-md-1 control-label">子订单类型<span class="red" >*</span></label>
	                    <div class="col-md-2">
	                    	<select class="form-control input-sm" v-model="formdata.subOrderType"  required>
	                    		<option v-for="item in subOrderTypeList" :value="item.value">{{item.name}}</option>
	                    	</select>
	                    </div>
	                    <label class="col-md-1 control-label">发货条件<span class="red">*</span></label>
	                    <div class="col-md-2">
	                    	<select class="form-control input-sm" v-model="formdata.sendConditionType" required>
	                    		<option v-for="item in sendConditionTypeList" :value="item.value">{{item.name}}</option>
	                    	</select>
	                    </div>
	                    <label class="col-md-1 control-label">原始订单号<span class="red">*</span></label>
	                    <div class="col-md-2">
	                        <input type="text" class="form-control input-sm" v-model.trim="formdata.platformOrderId" pattern="^[\w-]{0,32}$" title="该字段只能包含字母或者数组或者'-'的32位字符" required/>
	                    </div>
		            </div>
		        </div>
		        <div class="col-md-12 no-padding form-horizontal">
		        	<div class="form-group"><label class="col-md-1 control-label">店铺<span class="red">*</span></label>
	                    <div class="col-md-2">
	                        <component is="select-shop" v-model="formdata.shopId" @selected="selectedShop" :default-shop-id="formdata.shopId" :default-shop-name="formdata.shop==undefined?undefined:formdata.shop.shopName" :contains-deleted="false" required></component>
	                    </div>
	                    <label class="col-md-1 control-label">分销商</label>
	                    <div class="col-md-2">
	                        <component comp-id="dustributorId" is="search-distributor" @selected="seletedDistributor" :value="formdata.platformDistributorId" :init-distributor="formdata.distributor" distributor-status="NORMAL"></component>
	                    </div>
	                    <label class="col-md-1 control-label">用户ID</label>
	                    <div class="col-md-2">
	                        <input type="text" class="form-control input-sm" v-model.trim="formdata.buyer" pattern="^\S+$" title="该字段不能有空格"/>
	                    </div>
			    		<label class="col-md-1 control-label">姓名<span class="red">*</span></label>
	                    <div class="col-md-2">
	                        <input type="text" class="form-control input-sm" v-model.trim="formdata.receiverName" required pattern="^\S+$" title="该字段不能有空格"/>
	                    </div>
	                 	<!-- <label class="col-md-1 control-label">分销采购单号</label>
		                    <div class="col-md-2">
		                        <input type="text" class="form-control input-sm" v-model="formdata.distributorPurchaseOrderId"/>
		                    </div> -->
		            </div>
		        </div>
		        <div class="col-md-12 no-padding form-horizontal">
		        	<div class="form-group">
	                    <label class="col-md-1 control-label">手机<span class="red">*</span></label>
	                    <div class="col-md-2">
	                        <input type="text" class="form-control input-sm" v-model.trim="formdata.receiverMobile" pattern="^1[3-9]\d{9}$" required />
	                    </div>
	                    <label class="col-md-1 control-label">固话</label>
	                    <div class="col-md-2">
	                        <input type="text" class="form-control input-sm" v-model.trim="formdata.receiverPhone" pattern="^[0-9-]+$"/>
	                    </div>
	                    <label class="col-md-1 control-label">邮编</label>
	                    <div class="col-md-2">
	                        <input type="text" class="form-control input-sm" v-model.trim="formdata.receiverZip" pattern="^[0-9]+$"/>
	                    </div>
		            </div>
		        </div>
		        <div class="col-md-12 no-padding form-horizontal">
		        	<div class="form-group">
			    		<label class="col-md-1 control-label">省-市-区<span class="red">*</span></label>
	                    <div class="col-md-4">
	                    	<component is="select-region" placeholder="省" region-type="1" parent-id="" :default-region-id="formdata.receiverProvinceId" v-model="formdata.receiverProvinceId" @selected="selectedProvince" required style="width: 24%; display: inline;"></component>
	                    	<component v-if="formdata.receiverProvinceId" is="select-region" placeholder="市" region-type="2" :parent-id="formdata.receiverProvinceId" :default-region-id="formdata.receiverCityId" v-model="formdata.receiverCityId" @selected="selectedCity" required style="width: 24%; display: inline;"></component>
	                    	<component v-if="showDistrictSelect" is="select-region" placeholder="区" region-type="3" :parent-id="formdata.receiverCityId" :default-region-id="formdata.receiverDistrictId" v-model="formdata.receiverDistrictId" @selected="selectedDistrict" style="width: 24%; display: inline;"></component>
	                    	<component v-if="showStreetSelect" is="select-region" placeholder="街道" region-type="4" :parent-id="formdata.receiverDistrictId || formdata.receiverCityId" :default-region-id="formdata.receiverStreetId" v-model="formdata.receiverStreetId" @selected="selectedStreet" style="width: 24%; display: inline;"></component>
	                    </div>
	                    <label class="col-md-1 control-label">具体地址<span class="red">*</span></label>
	                    <div class="col-md-6">
	                        <input type="text" class="form-control input-sm" v-model.trim="formdata.receiverAddress" required pattern="^\S+$"/>
	                    </div>
		            </div>
		        </div>
		        <div class="col-md-12 no-padding form-horizontal">
		        	<div class="form-group">
			    		<label class="col-md-1 control-label">支付方式<span class="red">*</span></label>
	                    <div class="col-md-2">
	                    	<component is="select-payment"  @selected="selectedPayment" :default-payment="formdata.payId" required></component>
	                    </div>
	                    <label class="col-md-1 control-label">支付时间<span class="red" v-if="formdata.isAutoGift">*</span></label>
	                    <div class="col-md-2">
	                       <component is="date-picker" id="payTime" v-model="formdata.payTime" @choose="choosePaytime" :required="formdata.isAutoGift" :init-date-time="formdata.payTime" :needhms="true"></component>
	                    </div>
	                    <label class="col-md-1 control-label">币种</label>
	                    <div class="col-md-2">
	                        <component is="select-currency" v-model="formdata.currency"></component>
	                    </div>
	                    <label class="col-md-1 control-label">赊销预计收款时间<span v-if="formdata.sendConditionType=='SELL_ON_CREDIT'" class="red">*</span></label>
	                    <div class="col-md-2">
	                        <component is="date-picker" id="expectedRepaymentTime" :required="formdata.sendConditionType=='SELL_ON_CREDIT'" @choose="chooseExectedRepaymentTime" :init-date-time="formdata.expectedRepaymentTime" :needhms="true"></component>
	                    </div>
		            </div>
		        </div>
		        <div class="col-md-12 no-padding form-horizontal">
		        	<div class="form-group">
			    		<label class="col-md-1 control-label">指定仓库</label>
	                    <div class="col-md-2">
	                    	<component is="select-warehouse" :shop-id="formdata.shopId"  :disabled="formdata.isAutoWarehouse || !formdata.seller" :default-warehouse-id="formdata.specifiedWarehouseId" v-model="formdata.specifiedWarehouseId" :default-warehouse-name="formdata.specifiedWarehouse==undefined?undefined:formdata.specifiedWarehouse.warehouseName" @selected="selectedWarehouse" :required="!formdata.isAutoWarehouse"></component>
	                    </div>
	                    <label class="col-md-1 control-label">指定快递</label>
	                    <div class="col-md-2">
	                    	<component is="select-shipment" :warehouse-id="formdata.specifiedWarehouseId" :disabled="formdata.isAutoWarehouse || !formdata.seller || !formdata.specifiedWarehouseId" :default-shipping-id="formdata.specifiedShippingId" :default-shipping-name="formdata.specifiedShipping==undefined?undefined:formdata.specifiedShipping.shippingName" v-model="formdata.specifiedShippingId" @selected="selectedShipment" :required="!formdata.isAutoWarehouse"></component>
	                    </div>
	                    <div class="col-md-3">
	                    <div class="checkbox">
					        <label>
					          	<input type="checkbox" id="isAutoWarehouse" v-model="formdata.isAutoWarehouse" @click="selectisAutoWarehouse">按策略选仓
					        </label>
					    </div>
	                    </div>
		            </div>
		        </div>
		        <!-- <div class="col-md-12 no-padding form-horizontal">
		        	<div class="form-group"> -->
	                    <!-- <label class="col-md-1 control-label">预存款</label>
	                    <div class="col-md-2">
	                        <input type="text" class="form-control input-sm"/>
	                    </div> -->
		            <!-- </div>
		        </div> -->
		        <div class="col-md-12 no-padding form-horizontal">
		        	<div class="form-group">
			    		<label class="col-md-1 control-label">身份证号</label>
	                    <div class="col-md-3">
	                        <input type="text" class="form-control input-sm" v-model.trim="formdata.IdNumber" :disabled="!formdata.isDeclare"/>
	                    </div>
	                    <label class="col-md-1 control-label">交易流水号</label>
	                    <div class="col-md-3">
	                        <input type="text" class="form-control input-sm" v-model.trim="formdata.payNumber" :disabled="!formdata.isDeclare">
	                    </div>
	                    <div class="col-md-3 checkbox">
	                    	<label>
		    					<input type="checkbox" id="isDeclare" v-model="formdata.isDeclare" disabled />是否通过海关申报系统
		    				</label>
	                    </div>
		            </div>
					
		    	</div>	
		    </div>
		    <div class="clear"></div>
		    <div class="order-goods-info">
		    	<div class="col-md-12 no-padding form-horizontal">
	                <div class="form-group">
	                    <label class="col-md-1 control-label">添加</label>
	                    <div class="col-md-2">
	                    	<component is="select-goods-type-add" @selected="changeSingleOrGroup"></component>
	                    </div>
	                    <!-- <div class="col-md-6 form-group">
		                    <label class="col-md-2 control-label">批量导入商品</label>
		                    <div class="col-md-5">
		                    	<input  type="file" class="form-control input-sm">		                    	
		                    </div>
		                    <div class="col-md-2">
			                    <button class="btn btn-xs btn-info btn-order" disabled>导入</button>
		                    </div>
		                    <div class="col-md-3">
			                   <label class="control-label"><a href="">商品批量导入模板</a></label>
		                    </div>
		                    
		                </div> -->
		                <div class="col-md-3 checkbox">
			                <label>
			                	<input type="checkbox" id="isAutoGift" v-model="formdata.isAutoGift">应用赠品策略
			                </label>
		                </div>
	                </div>     
		        </div>
		    	<div class="col-md-12 no-padding form-horizontal">
		    		<div class="form-group">
		    			<div class="col-md-2 no-padding">
		    				<label class="col-md-5 control-label">商家编码</label>
		                    <div class="col-md-7 no-padding">
		                    	<component v-if="singleOrGroup == '1'"is="search-goods-sku-code-for-order" :init-good="addGoods" @selected="selectGoodsSkuCode"></component>
		                    	<component v-else is="search-group-goods-sku-code-for-order" :init-good="addGoods" @selected="selectGroupGoodsSkuCode"></component>
		                    </div>
		                </div>
		                <div class="col-md-3 no-padding">
		    				<label class="col-md-3 control-label">商品名称</label>
		                    <div class="col-md-9 no-padding">
		                    	<component v-if="singleOrGroup == '1'" is="search-goods-name-for-order" :init-good="addGoods" @selected="fetchGoodSkus"></component>
		                    	<component v-else is="search-group-goods-name-for-order" :init-good="addGoods" @selected="fetchGroupGoodSkus"></component>
		                    </div>
		                </div>
		                <div v-if="addGoods.styleType1Display==true" class="col-md-1 no-padding">   
		    				<label class="col-md-6 control-label" v-if="addGoods.addStyleType1.styleType">{{addGoods.addStyleType1.styleType.name}}</label>
		    				<label class="col-md-1" v-else></label>
		                    <div class="col-md-6 no-padding">
		                    	<select class="form-control input-sm no-padding" v-model="addGoods.addStyleType1.active">
		                    		<option v-for="item in addGoods.addStyleType1.styleValues" :value="item.id">{{item.value}}</option>
		                    	</select>
		                    </div>
		                </div>
		                <div v-if="addGoods.styleType2Display==true" class="col-md-1 no-padding">   
		    				<label class="col-md-6 control-label" v-if="addGoods.addStyleType2.styleType">{{addGoods.addStyleType2.styleType.name}}</label>
		    				<label class="col-md-1" v-else></label>
		                    <div class="col-md-6 no-padding">
		                    	<select class="form-control input-sm no-padding" v-model="addGoods.addStyleType2.active">
		                    		<option v-for="item in addGoods.addStyleType2.styleValues" :value="item.id">{{item.value}}</option>
		                    	</select>
		                    </div>
		                </div>
		                <div v-if="addGoods.styleType3Display==true" class="col-md-1 no-padding">   
		    				<label class="col-md-6 control-label" v-if="addGoods.addStyleType3.styleType">{{addGoods.addStyleType3.styleType.name}}</label>
		    				<label class="col-md-1" v-else></label>
		                    <div class="col-md-6 no-padding">
		                    	<select class="form-control input-sm no-padding" v-model="addGoods.addStyleType3.active">
		                    		<option v-for="item in addGoods.addStyleType3.styleValues" :value="item.id">{{item.value}}</option>
		                    	</select>
		                    </div>
		                </div>
		                <div class="col-md-1 no-padding">  
		    				<label class="col-md-6 control-label">数量</label>
		                    <div class="col-md-6 no-padding">
		                        <input type="number" min="1" class="form-control input-sm no-padding" v-model.trim="addGoods.addQuantity" pattern="^[1-9]+[0-9]*$" title="必须大于0"/>
		                    </div>
		                </div>
		                <div class="col-md-1 no-padding"> 
		    				<label class="col-md-6 control-label">单价</label>
		                    <div class="col-md-6 no-padding">
		                        <input type="text" class="form-control input-sm no-padding"  v-model.trim="addGoods.addPrice" :disabled="addGoods.isGift=='1'" pattern="^[0-9]+([.]{1}[0-9]+){0,1}$" title="必须大于等于0"/>
		                    </div>
		                </div>
		                <div class="col-md-1 goods-padding"> 
		    				<label class="radio-inline">
		    					<input type="radio" name="isGift" value="0" v-model="addGoods.isGift" @change="changeIsGift"/>商品
		    				</label>
		    				<label class="radio-inline">
		                    	<input type="radio" name="isGift" value="1" v-model="addGoods.isGift" @change="changeIsGift"/>赠品
		    				</label>
		                </div>
		                <div class="col-md-1"> 
		    				<button class="btn btn-xs btn-info btn-order" @click.prevent="addGoodsToOrder" :disabled="addGoods.addGoodsDisabled">加载</button>
		    			</div> 
	                </div> 
		    	</div>
		    	<div class="clear"></div>
		    	<div class="goods-list">
		    		<table class="table">
			    		<thead>
			    			<tr>
		    					<th width="10%">商家编码</th>
		    					<th width="22%">商品名称</th>
		    					<th width="8%">单价</th>
		    					<th width="8%">数量</th>
		    					<th width="8%">单品优惠</th>
		    					<th width="8%">单品税费</th>
		    					<th width="12%">指定生产日期</th>
		    					<th width="12%">指定批次</th>
		    					<th width="12%">操作</th>
		    				</tr>
			    		</thead>
	    				<tbody>	
	    					<tr v-for="(value,key) in formdata.orderGoodses" :id="key">
			    				<td><span v-if="value.isGift" class="gift-icon"></span><span>{{value.outerSkuId || value.outerIid}}</span></td>
			    				<td>{{value.title}}</td>
			    				<td><input type="text" class="input-goods form-control no-padding" pattern="^[0-9]+([.]{1}[0-9]+){0,1}$" title="必须大于等于0" v-model.trim="value.price" :disabled="value.isGift" @keyup="changeFee"></td>
			    				<td><input type="text" class="input-goods form-control no-padding" pattern="^[1-9]+[0-9]*$" v-model.trim="value.num" @keyup="changeFee" title="必须大于0"></td>
			    				<td><input type="text" class="input-goods form-control no-padding" pattern="^[0-9]+([.]{1}[0-9]+){0,1}$" title="必须大于等于0" v-model.trim="value.discountFee" :disabled="value.isGift" @keyup="changeFee"></td>
			    				<td><input type="text" class="input-goods form-control no-padding" pattern="^[0-9]+([.]{1}[0-9]+){0,1}$" v-model.trim="value.taxFee" :disabled="value.isGift" @keyup="changeFee"></td>
			    				<td><!-- <input type="radio" v-model="value.isProductDate">指定  -->
			    					<component is="date-picker" :id="'productDate_'+key" v-model.trim="value.productDate" @choose="chooseProductDate" class="input-goods" :init-date-time="value.productDate"></component>
			    					<!-- <input type="text" class="input-goods form-control no-padding" v-model="value.productDate"> -->
			    				</td>
			    				<td><!-- <input type="radio" v-model="value.isBatchNo">指定  -->
			    					<input type="text" class="input-goods form-control no-padding" v-model.trim="value.batchNo"  pattern="^\S+$" title="该字段不能有空格">
			    				</td>
			    				<td><a href="#" @click.prevent="deleteGood(key)"><i class="iconfont delete-icon" >&#xe613;</i></a></td>
			    			</tr>
	    				</tbody>		
		    		</table>
		    		<div class="col-md-12 no-padding form-horizontal">
		    			<div class="col-md-10">
		    			</div>
		    			<div class="col-md-2">
		    				<label class="col-md-6 control-label goods-amount">商品总金额</label>
		    				<label class="col-md-6 control-label goods-amount">{{formdata.totalAmount}}</label>
		    			</div>
		    			
		    		</div>
		    		
		    	</div>
	    	</div>
	    	<div class="col-md-12 no-padding form-horizontal" style="margin-top:10px;">
		        <div class="col-md-12 no-padding form-horizontal">
		        	<div class="form-group">
	                    <!-- <label class="col-md-1 control-label">本次收款</label>
	                    <div class="col-md-2">
	                        <input type="text" class="form-control input-sm" v-model="formdata.payment" pattern="^[0-9]+([.]{1}[0-9]+){0,1}$"/>
	                    </div> -->
			    		<label class="col-md-1 control-label">订单优惠</label>
	                    <div class="col-md-2">
	                        <input type="text" class="form-control input-sm" v-model="formdata.discountFee" pattern="^[0-9]+([.]{1}[0-9]+){0,1}$" placeholder="0.00" @keyup="changeFee"/>
	                    </div>
	                    <label class="col-md-1 control-label">邮费</label>
	                    <div class="col-md-2">
	                        <input type="text" class="form-control input-sm" v-model="formdata.postFee" pattern="^[0-9]+([.]{1}[0-9]+){0,1}$" placeholder="0.00" @keyup="changeFee"/>
	                    </div>
	                    <label class="col-md-1 control-label">手续费</label>
	                    <div class="col-md-2">
	                        <input type="text" class="form-control input-sm" v-model="formdata.handingFee" pattern="^[0-9]+([.]{1}[0-9]+){0,1}$" placeholder="0.00" @keyup="changeFee"/>
	                    </div>        
		            </div>
		            <div class="form-group">
						<label class="col-md-1 control-label">应收总额</label>
	                    <div class="col-md-2">
	                        <input type="text" class="form-control input-sm" v-model="formdata.totalFee" pattern="^[0-9]+([.]{1}[0-9]+){0,1}$" style="border:0; background-color:transparent;" readonly="readonly" />
	                    	
	                    </div>
		            </div>
		        </div>
		    </div>
		    <div class="clear"></div>
	    	<div class="message-board">
				<ul>
					<li>顾客留言
						<input type="text" class="message-input" v-if="buyerMemomodify" v-model.trim="formdata.buyerMemo">
						<span class="message-show" v-else>{{formdata.buyerMemo}}</span>
						<a href="#" @click.prevent="buyerMemomodify = !buyerMemomodify"><i class="edit-btn iconfont">&#xe622;</i></a>
					</li>
					<li>小二留言
						<input type="text" class="message-input" v-if="sellerMemomodify" v-model.trim="formdata.sellerMemo" >
						<span class="message-show" v-else>{{formdata.sellerMemo}}</span>
						<a href="#" @click.prevent="sellerMemomodify = !sellerMemomodify"><i class="edit-btn iconfont">&#xe622;</i></a>
					</li>
				</ul>
	    		
	    	</div>
	    	<div class="button-div">
	    		<input type="submit" class="btn btn-sm btn-primary"  value="创建新订单">
	    	</div>
	    </form> 
    </div>
</template>

<script>
import initStyle from '../../../common/initStyle'
import http from '../../../common/http'
import api from '../../../common/api'

import datePicker from '../../../component/datePicker'
import selectShop from '../../../component/selectShop'
import selectOrderType from '../../../component/selectOrderType'
import searchDistributor from '../../../component/searchDistributor'
import selectPayment from '../../../component/selectPayment'
import selectWarehouse from '../../../component/selectWarehouse'
import selectCurrency from '../../../component/selectCurrency'
import selectRegion from '../../../component/selectRegion'
import searchGoodsSkuCodeForOrder from '../../../component/searchGoodsSkuCodeForOrder'
import searchGroupGoodsSkuCodeForOrder from '../../../component/searchGroupGoodsSkuCodeForOrder'
import searchGoodsNameForOrder from '../../../component/searchGoodsNameForOrder'
import searchGroupGoodsNameForOrder from '../../../component/searchGroupGoodsNameForOrder'
import selectShipment from '../../../component/selectShipment'
import selectGoodsTypeAdd from '../../../component/selectGoodsTypeAdd'

export default {
	props: ['omsOrderSn'],
	data () {
		return {
			showDistrictSelect: false,
			showStreetSelect:false,
			specialProvince: ['2','3','10','23','3688'], //北京 天津 上海 重庆
			partyId: "",
			orderSn: "",
			loadOrder: false,
			buyerMemomodify: false,
			sellerMemomodify: false,
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
			},
			orderTypeList: [{
				"name": "=== 销售 ===",
				"value": "SALE"
			// }, {	
			// 	"name": "=== 补寄 ===",
			// 	"value": "SHIP_ONLY"
			}],
			subOrderTypeList: [{	
				"name": "=== 直销 ===",
				"value": "DIRECT",
			}, {
				"name": "=== 线上分销 ===",
				"value": "DISTRIBUTE_ONLINE",
			}, {	
				"name": "=== 线下分销 ===",
				"value": "DISTRIBUTE_OFFLINE",
			}],
			sendConditionTypeList: [{
				"name": "=== 先款后货 ===",
				"value": "PAID",
			}, {
				"name": "=== COD ===",
				"value": "COD_SHIP",
			}, {
				"name": "=== 赊销 ===",
				"value": "SELL_ON_CREDIT",
			}],
			singleOrGroup: "1",
			formdata: { 
				"shopId": "",
				"platformOrderId":"",
				"platform":"TAOBAO",
				"seller":"",
				// "distributorPurchaseOrderId":"",
				"distributor":{},
				"platformDistributorId":"",
				"buyer":"",
				"orderType":"SALE",
				"subOrderType":"DIRECT",
				"sendConditionType":"PAID",
				"payTime":"",
				"pay": {
					"payId":"",
				},
				"payId": "",
				"payment":"0.00",
				"totalFee":"0.00",
				"totalAmount":"0.00",
				"discountFee":"0.00",
				"taxFee":"0.00",
				"postFee":"0.00",
				"isAutoWarehouse":false,
				"specifiedWarehouseId":"",
				"specifiedWarehouse": {},
				"specifiedShipping": {},
				"shop":{},
				"specifiedShippingId":"",
				"isAutoGift":false,
				"expectedRepaymentTime":"",
				"receiverProvince":"",
				"receiverCity":"",
				"receiverDistrict":"",
				"receiverStreet":"",
				"receiverProvinceId": "",
				"receiverCityId": "",
				"receiverDistrictId": "",
				"receiverStreetId":"",
				"receiverAddress":"",
				"receiverName":"",
				"receiverZip":"",
				"receiverMobile":"",
				"receiverPhone":"",
				"buyerMemo":"",
				"sellerMemo":"",
				"currency":"RMB",
				"orderGoodses":[],
				"isDeclare":false,
				"IdNumber":"",
				"payNumber":"",
				"handingFee":"0.00",
			}
		}
	},
	mounted() {
		this.$nextTick(() => {
	      	initStyle();

	      	if(this.omsOrderSn != '' && this.omsOrderSn != undefined && this.omsOrderSn != '0') {
	      		this.orderSn = this.omsOrderSn;
	      		this.fetchOrderInfo();
	      	}
	    });
	},
    components: {datePicker,selectShop,selectOrderType,searchDistributor,selectPayment,selectWarehouse,selectCurrency,selectRegion,searchGoodsNameForOrder,searchGroupGoodsNameForOrder,searchGoodsSkuCodeForOrder,searchGroupGoodsSkuCodeForOrder,selectShipment,selectGoodsTypeAdd},
    methods: {
    	fetchOrderInfo () {//加载订单
    		const _self = this;
    		var orderSnTemp = _self.orderSn;
            http({
                instance: _self,
                url: api.getOriginOrder,
                type: 'post',
                data:{
                	data:{
                		"partyId":'', 
                		"orderSn":_self.orderSn,
                	},
                },
                hasLoading: true,
                success (res) {
                    Object.assign(_self.$data, _self.$options.data());
                    for(var key in _self.formdata){
                    	if(res.data[key] != undefined) {
							_self.formdata[key] = res.data[key];
                    	}					
	        		}
                    _self.formdata.payment = 0;
                    _self.formdata.orderType = "SALE";
                    _self.orderSn = orderSnTemp;
                    _self.loadOrder = true;
                    _self.formdata.platform = res.data.shop == undefined ? '' : res.data.shop.shopPlatform;

                    var isSpecial = false;
                    _self.specialProvince.forEach(function(item){
		        		if(_self.formdata.receiverProvinceId == item){
		        			isSpecial = true;
		        		}
		        	})
	        		_self.showStreetSelect = true;
	        		_self.showDistrictSelect = true;
                }
            });

    	},
    	changeSingleOrGroup (data) {
    		this.singleOrGroup = data;
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
        addGoodsToOrder () {//加载商品
        	const _self = this;
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
        	if(this.singleOrGroup == '1'){
        		// if(_self.addGoods)
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
	                	_self.changeFee();
                		goodAdd.title = _self.addGoods.addGoodsName;
	                	goodAdd.num = _self.addGoods.addQuantity;
	                	if (_self.addGoods.isGift == '0') {
	                		goodAdd.isGift = false;
	                	}else{
	                		goodAdd.isGift = true;
	                	}
                		goodAdd.outerSkuId = res.data.skuCode;
                		goodAdd.outerIid = "";
                		goodAdd.price = _self.addGoods.addPrice;

		        		if(addGood){
		        			_self.formdata.orderGoodses.push(goodAdd);
		        			_self.changeFee();
		        		}

		        		_self.addGoods = {
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
			}else{
				_self.changeFee();
				goodAdd.title = _self.addGoods.addGoodsName;
	            goodAdd.num = _self.addGoods.addQuantity;
	            goodAdd.outerSkuId = "";
	            goodAdd.outerIid = _self.addGoods.addOuterIid;
	            goodAdd.price = _self.addGoods.addPrice;
				
        		if(addGood){
        			_self.formdata.orderGoodses.push(goodAdd);
        			_self.changeFee();
        		}

        		_self.addGoods = {
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
        changeFee () {
        	var totalFee = 0;
        	var totalAmount = 0;
    		if(this.formdata.orderGoodses.length > 0){
				this.formdata.orderGoodses.forEach((fgood) => {
        			totalFee += Number(fgood.price) * Number(fgood.num) + Number(fgood.taxFee) - Number(fgood.discountFee);
        			totalAmount += Number(fgood.price) * Number(fgood.num);
        		});
			}
			totalFee += Number(this.formdata.postFee) - Number(this.formdata.discountFee);
			totalFee = totalFee.toFixed(2);
			totalAmount = totalAmount.toFixed(2);
			this.formdata.totalFee = totalFee;
			this.formdata.totalAmount = totalAmount;
        },
        changeIsGift (){
        	if(this.addGoods.isGift == '1'){
        		this.addGoods.addPrice = 0.00;
        	}
        },
        deleteGood (data){
        	this.formdata.orderGoodses.splice(data,1);
        	this.changeFee();
        },
        selectisAutoWarehouse () {
        	if(this.formdata.isAutoWarehouse){
        		this.formdata.specifiedWarehouseId = "";
        		this.formdata.specifiedShippingId = "";
        	}
        },
        selectedProvince (data) {
        	this.formdata.receiverProvinceId = data.data.regionId;
        	this.formdata.receiverProvince = data.data.regionName;
        	this.formdata.receiverCityId = "";
        	this.formdata.receiverCity = "";
        	this.formdata.receiverDistrictId = "";
        	this.formdata.receiverStreet = "";
        	this.formdata.receiverStreetId = "";       	
        	this.formdata.receiverDistrict = "";        	
        	this.formdata.specifiedWarehouseId = "";
        	this.formdata.specifiedShippingId = "";
        	this.showStreetSelect = false;
        	this.showDistrictSelect = false;
        	
        },
        selectedCity (data) {
        	this.formdata.receiverCityId = data.data.regionId;	
        	this.formdata.receiverCity = data.data.regionName;
        	this.formdata.receiverDistrictId = "";
        	this.formdata.receiverDistrict = "";
        	this.formdata.receiverStreetId = "";
        	this.formdata.receiverStreet = "";	
       		this.showDistrictSelect = true;
       		this.showStreetSelect = false;
			
        },
        selectedDistrict (data) {
        	this.formdata.receiverDistrictId = data.data.regionId
        	this.formdata.receiverDistrict = data.data.regionName;
        	this.formdata.receiverStreetId = "";
        	this.formdata.receiverStreet = "";	
        	this.showStreetSelect = true;
        },
        selectedStreet (data) {
        	this.formdata.receiverStreetId = data.data.regionId
        	this.formdata.receiverStreet = data.data.regionName;
        },
        selectedPayment (data) {
        	this.formdata.payId = data.data;
        },
        selectedShop (data) {
        	if(data && data.data) {
	        	this.formdata.shopId = data.data.shopId;
	        	this.formdata.seller = data.data.shopNick;
	        	this.formdata.platform = data.data.shopPlatform;
	        	if(!this.loadOrder){
					this.formdata.specifiedWarehouseId = "";
	        		this.formdata.specifiedShippingId = "";
	        	}
	        	this.loadOrder = false;
        	} else {
        		this.formdata.shopId = "";
        		this.formdata.seller = "";
        		this.formdata.platform = "";
        		this.formdata.specifiedWarehouseId = "";
                this.formdata.specifiedShippingId = "";
        	}
        },
        seletedDistributor (data) {
        	this.formdata.platformDistributorId = data.data.distributorName;
        },
        choosePaytime (data) {
        	this.formdata.payTime = data.data;
        },
		chooseProductDate (data) {
			var arr = data.componentId.split('_');
			var key = arr[1];
			this.formdata.orderGoodses[key].productDate = data.data;
		},
		chooseExectedRepaymentTime (data) {
			this.formdata.expectedRepaymentTime = data.data;
		},
        selectedWarehouse (data) {
        	this.formdata.specifiedWarehouseId = data.data;
        },
        selectedShipment (data) {
        	this.formdata.specifiedShippingId = data.data;
        },
    	onSubmit: function(event) {
    		var formData = Object.assign({},this.formdata);
    		if(formData.orderGoodses.length == 0){
    			layer.msg('请添加商品！',{
    				time: 2000
    			});
    			return false;
    		}
    		if(formData.platformDistributorId == '' && formData.buyer == ''){
    			layer.msg('分销商和用户必填一项！', {timeout: 2000});
    			return false;
    		}

    		formData.pay = {
    			'payId': formData.payId
    		};
    		formData.pay = JSON.stringify(formData.pay);

    		if(!this.showDistrictSelect){
    			formData.receiverDistrictId = formData.receiverStreetId;
    			formData.receiverDistrict = formData.receiverStreet;
    		}
            const _self = this;
            http({
                instance: _self,
                url: api.addOrder,
                type: 'post',
                data:{
                	data: formData,
                },
                hasLoading: true,
                success (res) {
            		Object.assign(_self.$data, _self.$options.data());
            		layer.alert('订单创建成功！原始订单号为：' + res.data.platformOrderId, {icon: 6});

                },
                fail (res) {
                	layer.msg(res.subMsg, {
                        time: 2000
                    });
                }
            });
    	},
    },
}
</script>

<style scoped>
.signle-order-generation{
	padding:14px 14px;
	font-size:12px;
	color:#666666;
	font-weight: normal;
}
.order-info{
	margin-right: 10px;
}
.btn-order{
	margin-top:3px;	
}
input[type=checkbox],input[type=radio]{
	margin:3px 0 0 -20px;
}
.button-div {
	text-align: center;
}
.message-board ul{
	/*margin-top: 10px;*/
	padding-left: 30px;
}
.message-board ul li{
	height: 30px;
	line-height: 30px;
	vertical-align: middle;
}
.modify-img{
	margin-bottom: 1px;
	margin-left: 10px;
	width: 16px;
	height: 16px;
}
.table{
	margin-bottom: 0px;
}
.goods-amount{
	color:#3697DE;
	text-align: center;
	height: 35px;
	line-height: 35px;
	font-weight: bold;
}

.goods-padding{
	padding-left: 7px;
	padding-right: 0px;
}

.input-goods {
	height: 23px;
	/*width: 60px;*/
	margin:auto auto;
	display:inline;
}

.message-input{
	margin-left: 5px;
	box-shadow: none;
	height: 20px;
	border: 1px solid #ccc;
	border-radius: 0;
}

.message-show{
	margin-left: 5px;
	color:#000;
}
.control-label {
	padding-right: 1px;
	padding-left: 1px;
}
i {
	font-size: 20px;
}
.delete-icon {
	color: #F86767;
}
.table td {
	vertical-align: middle;
}
</style>