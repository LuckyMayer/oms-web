<template>
    <div class="signle-order-generation">
	    <form name="newOrderForm" @submit.prevent="onSubmit" role="form">
	    	<div class="order-info">
		    	<div class="col-md-12 no-padding form-horizontal">
			    	<div class="form-group">
			    		<label class="col-md-1 control-label">OMS订单号</label>
		                <div class="col-md-2" style="padding-right:0px;">
		                    <nobr><input type="text" v-model.trim="formdata.parentOrderSn" class="form-control input-sm" style="width:78%;display:inline"/>
		                    <button class="btn btn-xs btn-info" style="margin-bottom:2px;" @click.prevent="fetchOrderInfo" :disabled="!formdata.parentOrderSn.trim()">加载</button></nobr>
		                </div>
		                <label class="col-md-1 control-label">店铺<span class="red">*</span></label>
	                    <div class="col-md-2">
	                        <component is="select-shop" v-model="formdata.shopId" @selected="selectedShop" :default-shop-id="formdata.shopId" required :contains-deleted="false"></component>
	                    </div>
	                    <label class="col-md-1 control-label">分销商</label>
	                    <div class="col-md-2">
	                        <component comp-id="dustributorId" is="search-distributor" v-model="formdata.distributorName" @selected="seletedDistributor" :init-distributor="formdata.distributor" distributor-status="NORMAL"></component>
	                    </div>
	                    <label class="col-md-1 control-label">用户ID</label>
	                    <div class="col-md-2">
	                        <input type="text" class="form-control input-sm" v-model="formdata.buyer"/>
	                    </div>
		            </div>
		        </div>
		        <div class="col-md-12 no-padding form-horizontal">
		        	<div class="form-group">
			    		<label class="col-md-1 control-label">姓名<span class="red">*</span></label>
	                    <div class="col-md-2">
	                        <input type="text" class="form-control input-sm" v-model.trim="formdata.receiverName" required/>
	                    </div>
	                    <label class="col-md-1 control-label">手机<span class="red">*</span></label>
	                    <div class="col-md-2">
	                        <input type="text" class="form-control input-sm" v-model.trim="formdata.receiverMobile" pattern="^1[3-9]\d{9}$" required />
	                    </div>
	                    <label class="col-md-1 control-label">固话</label>
	                    <div class="col-md-2">
	                        <input type="text" class="form-control input-sm" v-model.trim="formdata.receiverPhone"/>
	                    </div>
	                    <label class="col-md-1 control-label">邮编</label>
	                    <div class="col-md-2">
	                        <input type="text" class="form-control input-sm" v-model.trim="formdata.receiverZip"/>
	                    </div>
		            </div>
		        </div>
		        <div class="col-md-12 no-padding form-horizontal">
		        	<div class="form-group">
			    		<label class="col-md-1 control-label">省-市-区<span class="red">*</span></label>
	                    <div class="col-md-4">
	                    	<component is="select-region" placeholder="省" region-type="1" parent-id="" :default-region-id="formdata.receiverProvince" v-model="formdata.receiverProvince" @selected="selectedProvince" required style="width: 24%; display: inline;"></component>
	                    	<component v-if="formdata.receiverProvince" is="select-region" placeholder="市" region-type="2" :parent-id="formdata.receiverProvince" :default-region-id="formdata.receiverCity" v-model="formdata.receiverCity" @selected="selectedCity" required style="width: 24%; display: inline;"></component>
	                    	<component v-if="showDistrictSelect" is="select-region" placeholder="区" region-type="3" :parent-id="formdata.receiverCity" :default-region-id="formdata.receiverDistrict" v-model="formdata.receiverDistrict" @selected="selectedDistrict" style="width: 24%; display: inline;"></component>
	                    	<component v-if="showStreetSelect" is="select-region" placeholder="街道" region-type="4" :parent-id="formdata.receiverDistrict || formdata.receiverCity" :default-region-id="formdata.receiverStreet" v-model="formdata.receiverStreet" @selected="selectedStreet" style="width: 24%; display: inline;"></component>
	                    </div>
	                    <label class="col-md-1 control-label">具体地址<span class="red">*</span></label>
	                    <div class="col-md-6">
	                        <input type="text" class="form-control input-sm" v-model.trim="formdata.receiverAddress" required/>
	                    </div>
		            </div>
		        </div>
		        <div class="col-md-12 no-padding form-horizontal">
		        	<div class="form-group">
			    		<label class="col-md-1 control-label">支付方式<span class="red">*</span></label>
	                    <div class="col-md-2">
	                    	<component is="select-payment" v-model="formdata.payId" @selected="selectedPayment" :default-payment="formdata.payId" required></component>
	                    </div>
	                    <label class="col-md-1 control-label">支付时间<span class="red">*</span></label>
	                    <div class="col-md-2">
	                       <component is="date-picker" id="payTime" v-model="formdata.payTime" @choose="choosePaytime" :init-date-time="formdata.payTime" required :needhms="true"></component>
	                    </div>
	                    <label class="col-md-1 control-label">指定仓库</label>
	                    <div class="col-md-2">
	                    	<component is="select-warehouse" :shop-id="formdata.shopId"  :disabled="!formdata.shopId" :default-warehouse-id="formdata.warehouseId" v-model="formdata.warehouseId" @selected="selectedWarehouse" required></component>
	                    </div>
	                    <label class="col-md-1 control-label">指定快递</label>
	                    <div class="col-md-2">
	                    	<component is="select-shipment" :warehouse-id="formdata.warehouseId" :disabled="!formdata.shopId || !formdata.warehouseId" :default-shipping-id="formdata.shippingId" v-model="formdata.shippingId" @selected="selectedShipment" required></component>
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
		                <!-- <div class="col-md-2 checkbox">
			                <label>
			                	<input type="checkbox" id="isAutoGift" v-model="formdata.isAutoGift">应用赠品策略(以成交时间为准)
			                </label>
		                </div> -->
	                </div>     
		        </div>
		    	<div class="col-md-12 no-padding form-horizontal aa">
		    		<div class="form-group">
		    			<div class="col-md-2 no-padding">
		    				<label class="col-md-5 control-label">商家编码</label>
		                    <div class="col-md-7">
		                    	<component v-if="singleOrGroup == '1'"is="search-goods-sku-code-for-order" v-model="addGoods.addOuterSkuId" @selected="selectGoodsSkuCode"></component>
		                    	<component v-else is="search-group-goods-sku-code-for-order" v-model="addGoods.addOuterIid" @selected="selectGroupGoodsSkuCode"></component>
		                    </div>
		                </div>
		                <div class="col-md-3 no-padding">
		    				<label class="col-md-3 control-label">商品名称</label>
		                    <div class="col-md-9">
		                    	<component v-if="singleOrGroup == '1'" is="search-goods-name-for-order" v-model="addGoods.addGoodsName" @selected="fetchGoodSkus"></component>
		                    	<component v-else is="search-group-goods-name-for-order" v-model="addGoods.addGoodsName" @selected="fetchGroupGoodSkus"></component>
		                    </div>
		                </div>
		                <div v-if="addGoods.styleType1Display==true" class="col-md-1 no-padding">   
		    				<label class="col-md-6 control-label" v-if="addGoods.addStyleType1.styleType">{{addGoods.addStyleType1.styleType.name}}</label>
		    				<label class="col-md-1" v-else></label>
		                    <div class="col-md-6">
		                    	<select class="form-control input-sm no-padding" v-model="addGoods.addStyleType1.active">
		                    		<option v-for="item in addGoods.addStyleType1.styleValues" :value="item.id">{{item.value}}</option>
		                    	</select>
		                    </div>
		                </div>
		                <div v-if="addGoods.styleType2Display==true" class="col-md-1 no-padding">   
		    				<label class="col-md-6 control-label" v-if="addGoods.addStyleType2.styleType">{{addGoods.addStyleType2.styleType.name}}</label>
		    				<label class="col-md-1" v-else></label>
		                    <div class="col-md-6">
		                    	<select class="form-control input-sm no-padding" v-model="addGoods.addStyleType2.active">
		                    		<option v-for="item in addGoods.addStyleType2.styleValues" :value="item.id">{{item.value}}</option>
		                    	</select>
		                    </div>
		                </div>
		                <div v-if="addGoods.styleType3Display==true" class="col-md-1 no-padding">   
		    				<label class="col-md-6 control-label" v-if="addGoods.addStyleType3.styleType">{{addGoods.addStyleType3.styleType.name}}</label>
		    				<label class="col-md-1" v-else></label>
		                    <div class="col-md-6">
		                    	<select class="form-control input-sm no-padding" v-model="addGoods.addStyleType3.active">
		                    		<option v-for="item in addGoods.addStyleType3.styleValues" :value="item.id">{{item.value}}</option>
		                    	</select>
		                    </div>
		                </div>
		                <div class="col-md-1 no-padding">  
		    				<label class="col-md-6 control-label">数量</label>
		                    <div class="col-md-6">
		                        <input type="number" min="1" class="form-control input-sm no-padding" v-model.trim="addGoods.addQuantity" />
		                    </div>
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
		    					<th width="8%">数量</th>
		    					<th width="12%">操作</th>
		    				</tr>
			    		</thead>
	    				<tbody>	
	    					<tr v-for="(value,key) in formdata.orderGoodses" :id="key">
			    				<td><span v-if="value.isGift" class="gift-icon"></span><span>{{value.outerSkuId || value.outerIid}}</span></td>
			    				<td>{{value.title}}</td>
			    				<td><input type="text" class="input-goods form-control no-padding" v-model="value.num"></td>
			    				<td><a href="#" @click.prevent="deleteGood(key)"><i class="iconfont delete-icon" >&#xe613;</i></a></td>
			    			</tr>
	    				</tbody>		
		    		</table>
		    		
		    	</div>
	    	</div>
		    <div class="clear"></div>
	    	<div class="message-board">
				<ul>
					<li>顾客留言
						<input type="text" class="message-input" v-if="buyerMemomodify" v-model="formdata.buyerMemo">
						<span class="message-show" v-else>{{formdata.buyerMemo}}</span>
						<a href="#" @click.prevent="buyerMemomodify = !buyerMemomodify"><i class="edit-btn iconfont">&#xe622;</i></a>
					</li>
					<li>小二留言
						<input type="text" class="message-input" v-if="sellerMemomodify" v-model="formdata.sellerMemo" >
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
				"parentOrderSn": "",
				"shopId": "",
				"partyId": "",
				"distributorId": "",
				"distributorName": "",
				"buyer":"",
				"payTime":"",
				"payId": "",
				"warehouseId": "",
				"shippingId": "",
				"receiverProvince":"",
				"receiverCity":"",
				"receiverDistrict":"",
				"receiverStreet":"",
				"receiverAddress":"",
				"receiverName":"",
				"receiverZip":"",
				"receiverMobile":"",
				"receiverPhone":"",
				"buyerMemo":"",
				"sellerMemo":"",
				"orderGoodses":[],
			}
		}
	},
	mounted() {
		this.$nextTick(() => {
	      	initStyle();
	      	if(this.omsOrderSn != '' && this.omsOrderSn != undefined && this.omsOrderSn != '0') {
	      		this.formdata.parentOrderSn = this.omsOrderSn;
	      		this.fetchOrderInfo();
	      	}
	    });
	},
    components: {datePicker,selectShop,selectOrderType,searchDistributor,selectPayment,selectWarehouse,selectCurrency,selectRegion,searchGoodsNameForOrder,searchGroupGoodsNameForOrder,searchGoodsSkuCodeForOrder,searchGroupGoodsSkuCodeForOrder,selectShipment,selectGoodsTypeAdd},
    methods: {
    	fetchOrderInfo () {//加载订单
    		const _self = this;
    		var orderSnTemp = _self.formdata.parentOrderSn;
            http({
                instance: _self,
                url: api.getOriginOrder,
                type: 'post',
                data:{
                	data:{
                		"partyId":'', 
                		"orderSn":orderSnTemp,
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

                    _self.formdata.parentOrderSn = orderSnTemp;
                    _self.loadOrder = true;
                    _self.formdata.receiverProvince = res.data.receiverProvinceId;
                    _self.formdata.receiverCity = res.data.receiverCityId;
                    _self.formdata.receiverDistrict = res.data.receiverDistrictId;
                    _self.formdata.receiverStreet = res.data.receiverStreetId;
                    _self.formdata.distributorName = res.data.platformDistributorId;
                    _self.formdata.warehouseId = res.data.specifiedWarehouseId;
                    _self.formdata.shippingId = res.data.specifiedShippingId;
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
				goodAdd.title = _self.addGoods.addGoodsName;
	            goodAdd.num = _self.addGoods.addQuantity;
	            goodAdd.outerSkuId = "";
	            goodAdd.outerIid = _self.addGoods.addOuterIid;
	            goodAdd.price = _self.addGoods.addPrice;
				
        		if(addGood){
        			_self.formdata.orderGoodses.push(goodAdd);
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
        deleteGood (data){
        	this.formdata.orderGoodses.splice(data,1);
        },
        selectedProvince (data) {
        	this.formdata.receiverProvince = data.data.regionId;
        	this.formdata.receiverCity = "";
        	this.formdata.receiverStreet = "";
        	this.formdata.receiverDistrict = "";        	
        	this.formdata.warehouseId = "";
        	this.formdata.shippingId = "";
        	this.showStreetSelect = false;
        	this.showDistrictSelect = false;
        	
        },
        selectedCity (data) {
        	this.formdata.receiverCity = data.data.regionId;
        	this.formdata.receiverDistrict = "";
        	this.formdata.receiverStreet = "";	
        	var isSpecial = false;
        	const _self = this;
       		this.showDistrictSelect = true;
       		this.showStreetSelect = false;
			
        },
        selectedDistrict (data) {
        	this.formdata.receiverDistrict = data.data.regionId
        	this.formdata.receiverStreet = "";	
        	this.showStreetSelect = true;
        },
        selectedStreet (data) {
        	this.formdata.receiverStreet = data.data.regionId
        },
        selectedPayment (data) {
        	this.formdata.payId = data.data;
        },
        selectedShop (data) {
        	if(data && data.data) {
	        	this.formdata.shopId = data.data.shopId;
	        	if(!this.loadOrder){
					this.formdata.warehouseId = "";
	        		this.formdata.shippingId = "";
	        	}
	        	this.loadOrder = false;
        	} else {
        		this.formdata.shopId = "";
        		this.formdata.warehouseId = "";
                this.formdata.shippingId = "";
        	}
        },
        seletedDistributor (data) {
        	this.formdata.distributorId = data.data.distributorId;
        	this.formdata.distributorName = data.data.distributorName;
        },
        choosePaytime (data) {
        	this.formdata.payTime = data.data;
        },
        selectedWarehouse (data) {
        	this.formdata.warehouseId = data.data;
        },
        selectedShipment (data) {
        	this.formdata.shippingId = data.data;
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
    		if(!this.showDistrictSelect){
    			formData.receiverDistrict = formData.receiverStreet;
    		}
            const _self = this;
            http({
                instance: _self,
                url: api.addSupplyOrder,
                type: 'post',
                data:{
                	data: formData,
                },
                hasLoading: true,
                success (res) {
            		Object.assign(_self.$data, _self.$options.data());
            		layer.alert('订单创建成功！订单号为：<a target="_blank" href="#/ordersManage/omsOrderDetail/orderDetails/' + res.data.id + '">' + res.data.orderSn + '</a>', {icon: 6});

                },
                fail (res) {
                	layer.msg(res.subMsg, {
                        time: 2000
                    });
                }
            });
    	}
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
.aa .form-group div div {
	padding-left: 2px;
	padding-right: 0px;
}
</style>