<template>
	<div class="content-wrapper">
		<section class="content-header clearfix">
			<ol class="breadcrumb">
                <li><i class="fa fa-desktop"></i> 财务</li>
                <li class="active">销售财审</li>
            </ol>
        </section>
        <section class="content">
        	<div class="search-div col-md-12 form-horizontal">
        		<div class="form-group">
        			<label class="col-md-1 control-label">订单号</label>
        			<div class="col-md-5">
        				<input type="text" class="form-control input-sm" placeholder="原始单号/OMS单号，多个用‘逗号’分隔" v-model="searchData.orderIdsString">
        			</div>
        			<label class="col-md-1 control-label">发货条件</label>
        			<div class="col-md-2">
        				<select class="form-control input-sm" v-model="searchData.sendConditionType">
        					<option value="">=== 请选择发货条件 ===</option>
                    		<option v-for="item in sendConditionTypeList" :value="item.value">{{item.name}}</option>
                    	</select>
        			</div>
        		</div>
        		<div class="form-group">
        			<label class="col-md-1 control-label">店铺</label>
        			<div class="col-md-2">
        				<component is="select-shop" v-model="searchData.shopId" @selected="selectedShop"></component>
        			</div>
        			<label class="col-md-1 control-label">分销商</label>
        			<div class="col-md-2">
        				<component comp-id="dustributorId" is="search-distributor" v-model="searchData.distributorId" @selected="seletedDistributor"></component>
        			</div>
        			<label class="col-md-1 control-label">订单类型</label>
        			<div class="col-md-2">
        				<select class="form-control input-sm" v-model="searchData.orderType">
        				<option value="">=== 请选择订单类型 ===</option>
                    		<option v-for="item in orderTypeList" :value="item.value">{{item.name}}</option>
                    	</select>
        			</div>
        		</div>
        		<div class="form-group">
        			<label class="col-md-1 control-label">财审原因</label>
        			<div class="col-md-2">
        				<select class="form-control input-sm" v-model="searchData.reasonCode" required>
        					<option value="">=== 请选择财审原因 ===</option>
                    		<option v-for="item in financeCheckReasonList" :value="item.value">{{item.name}}</option>
                    	</select>
        			</div>
        			<label class="col-md-1 control-label">订单时间</label>
        			<div class="col-md-3">
        				<component is="date-range-picker" id="apply-time" :needhms="true" @get_date="selectedApplyTime" :start-time="searchData.startCreateTime" :end-time="searchData.endCreateTime"></component>
        			</div>
        		</div>
        		<div class="form-group">
		            <div class="col-sm-12" style="text-align:right;">
		              	<button class="btn btn-sm btn-primary" @click="getFinanceSaleCheckLists"><i class="fa fa-search"></i> 查询</button>
		              	<button class="btn btn-sm btn-default" style="margin: 0 0 0 20px;"><i class="fa fa-download"></i> 导出</button>
		            </div>
	          	</div>
        	</div>
        	<div class="result-div col-md-12">
        		<div class="buttons">
        			<input type="checkbox" v-model="selectAll" style="position:relative;top:2px;margin:0 5px 0 15px;">
        			<button class="primaryBtn" @click="batchCheckOrder">财审通过</button>
        			<!-- <button class="primaryBtn" @click="batchRejectOrder">财审驳回</button> -->
        		</div>
        		<div>
        			<table class="table">
	        			<thead>
	        				<tr>
	        					<th width="4%">选择</th>
	        					<th width="10%">系统订单</th>
	        					<th width="8%">订单时间</th>
	        					<th width="12%">原始单号</th>
	        					<th width="6%">店铺/<br/>分销商</th>
	        					<th width="6%">订单类型</th>
	        					<th width="6%">发货条件</th>
	        					<th width="4%">平台退款</th>
	        					<th width="10%">财审原因</th>
	        					<th width="4%">应收</th>
	        					<th width="4%">实收</th>
	        					<th width="4%">担保</th>
	        					<th width="4%">预存款</th>
	        					<th width="8%">操作</th>
	        					<th width="10%">客审留言</th>
	        				</tr>
	        			</thead>
	        			<tbody>
	        				<tr v-for="item in orderList">
	        					<td style="text-align:center;word-wrap:break-word;word-break:break-all;"><input type="checkbox" :value="item.orderId" name="orderIdChoose" v-model="item.choosen"></td>
	        					<td><a :href="'#/ordersManage/omsOrderDetail/orderDetails/'+item.orderId" target="_blank">{{item.orderSn}}</a></td>
	        					<td>{{item.createTime}}</td>
	        					<td style="word-wrap:break-word;word-break:break-all;">{{item.platformOrderIds}}</td>
	        					<td>{{item.shop.shopName}}<template v-if="item.distributor!=undefined">/<br/>{{item.distributor.distributorName}}</template></td>
	        					<td>{{item.orderType | orderTypeFilter}}</td>
	        					<td>{{item.sendConditionType | sendConditionTypeFilter}}</td>
	        					<td>{{item.platformRefund ? '平台退款' : ''}}</td>
	        					<td>{{item.reasonCodes | reasonCodeFilter}}</td>
	        					<td>{{item.totalFee}}</td>
	        					<td>{{item.orderInfo.receiptFee}}</td>
	        					<td>{{item.guarantor | guarantorFilter}}</td>
	        					<td>{{item.orderInfo.prePayment}}</td>
	        					<td>
	        						<a href="#" @click.prevent="showCollectionModalFun(item.orderId)">收款</a>
	        						<a href="#" @click.prevent="showAddNoteModal(item.orderId)">留言</a>
	        					</td>
	        					<td>{{item.memoString}}</td>
	        				</tr>
	        			</tbody>
	        		</table>
        		</div>
        		<div class="box-footer clearfix">
                    <div class="col-md-2 no-padding"></div>
                    <component is='pagination' :offset="searchData.offset" :length="searchData.length" :total-count="pageData.totalCount" @paginate="paginate"></component>
                </div>
        	</div>
        </section>
        <component is="collection-modal" :order-id="modifyOrderId" @cancel="hiddenCollectionModalFun" v-if="showCollectionModal" @success="collectionSuccess"></component>

        <component is="add-note-modal2" v-if="showMessageAddModal" @cancel="cancelMessageAdd" @confirm="confirmCommentAction"></component>
	</div>

</template>

<script>
import {getDateStr} from '../../common/getDateStr'
import initStyle from '../../common/initStyle'
import http from '../../common/http'
import api from '../../common/api'
import searchDistributor from '../../component/searchDistributor'
import selectShop from '../../component/selectShop'
import collectionModal from './collectionModal'
import dateRangePicker from '../../component/dateRangePicker'
import pagination from '../../component/pagination'
import addNoteModal2 from '../../component/addNoteModal2'



export default{
	data() {
		return {
			selectAll: false,
			showMessageAddModal: false,
			modifyOrderId: '',
			pageData: {
                totalCount: ''
            },
            showCollectionModal: false,
			searchData: {
				orderIdsString: '',
				orderIds: [],
				sendConditionType: '',
				orderType: '',
				length: 50,
				offset: 0,
				shopId: '',
				distributorId: '',
				orderType: '',
				reasonCode: '',
				startCreateTime: '',
				endCreateTime: '',
			},
			sendConditionTypeList: [{
				"name": "=== 先款后货 ===",
				"value": "PAID",
			}, {
				"name": "=== COD ===",
				"value": "COD_SHIP",
			}, {
			// 	"name": "=== 货到付款 ===",
			// 	"value": "COD",
			// }, {
				"name": "=== 赊销 ===",
				"value": "SELL_ON_CREDIT",
			}],
			orderTypeList: [{
				"name": "=== 线上分销 ===",
				"value": "DISTRIBUTE_ONLINE"
			}, {
				"name": "=== 线下分销 ===",
				"value": "DISTRIBUTE_OFFLINE"
			}, {
				"name": "=== 直销 ===",
				"value": "DIRECT"
			}, {	
				"name": "=== 换货 ===",
				"value": "EXCHANGE"
			}, {	
				"name": "=== 补寄 ===",
				"value": "SHIP_ONLY"
			}],
			financeCheckReasonList: [{
				"name": "=== 手工建单 ===",
				"value": "MANUAL"
			}, {
				"name": "=== 订单金额变动 ===",
				"value": "PRICE_CHANGE"
			}, {
				"name": "=== 应付金额为0 ===",
				"value": "ZERO_FEE"
			}],
			orderList: [],
		}
	},
	mounted () {
	    this.$nextTick(() => {
	      	initStyle();
	      	this.searchData.startCreateTime = getDateStr(-30,true);
        	this.searchData.endCreateTime = getDateStr(0,true);
	    });
	},
	watch: {
		selectAll: function(val){
			this.orderList.forEach(function(item,index){
    			item.choosen = val;
    		});
		}
	},
	filters: {
		reasonCodeFilter: function(val) {
			var reasonCodeMapping = {
				'MANUAL': '手工建单',
				'PRICE_CHANGE': '订单金额变动',
				'ZERO_FEE': '应付金额为0'
			};
			var reasonCodeString = [];
			val.forEach(function(item, index){
				reasonCodeString[index] = reasonCodeMapping[item];
			});

			return reasonCodeString.join(',');
		},
		guarantorFilter: function(val) {
			var guarantorMapping = {
				'ALIPAY': '支付宝',
			};

			return guarantorMapping[val];
		},
		sendConditionTypeFilter: function(val) {
			var sendConditionTypeMapping =  {
				"PAID": "先款后货",
				"COD_SHIP": "COD",
				"SELL_ON_CREDIT": "赊销",
			};
			return sendConditionTypeMapping[val];
		},
		orderTypeFilter: function(val) {
			var orderTypeMapping = {
				'SUPPLY': '补寄',
				'SALE': '销售',
				'EXCHANGE': '换货',
			};
			return orderTypeMapping[val];

		}
	},
	components: {
		searchDistributor,selectShop,dateRangePicker,pagination,collectionModal,addNoteModal2
	},
	methods: {
		getReceipt(order) {
			var receiptFee = order.receiptFee || 0;
			var prePayment = order.prePayment || 0;
			return receiptFee + prePayment;
		},
		seletedDistributor(data) {
			this.searchData.distributorId = data.data.distributorId;
		},
		selectedShop(data) {
			if(data.data) {
				this.searchData.shopId = data.data.shopId;
			}else {
				this.searchData.shopId = '';
			}
			
		},
		selectedApplyTime(data) {
			this.searchData.startCreateTime = data.start_time;
            this.searchData.endCreateTime = data.end_time;
		},
		batchCheckOrder() {
			var orderIdsTemp = [];
			$("input[name='orderIdChoose']:checked").each(function(item, index){
				orderIdsTemp.push($(this).val());
			});
			if(orderIdsTemp.length > 0) {
				const _self = this;
				http({
					instance: _self,
					url: api.checkFinanceCheck,
					type: 'post',
					data: {
						data: {
							orderIds: orderIdsTemp,
						}
					},
					success(res){
						layer.msg("财审通过！", {timeout: 2000});
						_self.getFinanceSaleCheckList();
					},
				});
			}else {
				layer.msg('请先选择订单!', {time: 2000});
			}

		},
		// batchRejectOrder() {

		// },
		paginate(data) {
    		this.searchData.offset = data.offset;
    		this.searchData.length = data.length;
    		this.getFinanceSaleCheckList();
    	},
    	getFinanceSaleCheckLists() {
    		this.searchData.offset = 0;
    		this.getFinanceSaleCheckList();
    	},
    	getFinanceSaleCheckList(){
    		const _self = this;
    		if((_self.searchData.orderIdsString).trim() == ''){
    			_self.searchData.orderIds = [];
    		}else {
    			_self.searchData.orderIds = _self.searchData.orderIdsString.split(',');
    		}	
    		
    		http({
    			instance: _self,
    			url: api.getFinanceSaleCheckList,
    			type: 'post',
                data:{
                	data: _self.searchData,
                },
                hasLoading: true,
                success (res) {
                	_self.orderList = res.data.content;
                	if(res.data.totalCount > 0) {
                		_self.orderList.forEach(function(item){
                			if(item.originOrders){
                				item.platformOrderIds = '';
                				var platformArr = [];
                				item.originOrders.forEach(function(item1){
                					platformArr.push(item1.platformOrderId);
	                				if(item1.refundStatus != 'NONE'){
	                					item.platformRefund = '平台退款';
	                				}
	                			});
	                			item.platformOrderIds = platformArr.join(',');
                			}
                			if(item.memos){
                				item.memoString = '';
                				var memoArr = [];
                				item.memos.forEach(function(item1){
                					memoArr.push(item1.content);

	                			});
	                			item.memoString = memoArr.join(',');
                			}
                			
                		})
                	}
                	_self.pageData.totalCount = res.data.totalCount;
                }
    		});
    	},
    	showCollectionModalFun(data){
    		this.showCollectionModal = true;
    		this.modifyOrderId = data;
    	},
    	hiddenCollectionModalFun(){
			this.showCollectionModal = false;
    		this.modifyOrderId = '';
    	},
    	collectionSuccess(data) {
    		this.showCollectionModal = false;
    		this.modifyOrderId = '';
    		this.getFinanceSaleCheckList();
    	},
    	showAddNoteModal(data){
    		this.showMessageAddModal = true;
    		this.modifyOrderId = data;
    	},
    	cancelMessageAdd(){
    		this.showMessageAddModal = false;
    		this.modifyOrderId = '';
    	},
    	confirmCommentAction (data) {
        	const _self = this;
        	if(_self.modifyOrderId == ''){
        		layer.msg('orderId为空，请重试~', {
                    time: 2000
                });
        		return false;
        	}
        	http({
	    		instance: _self,
	    		url: api.addOrderAction,
	            type: 'post',
	            data:{
	            	data:{
	            		'orderId': _self.modifyOrderId,
	            		'type': 'FINANCE_MEMO',
	            		'subType': 'ADD_MEMO',
	            		'orderGoodsId': '',
	            		'content': data.note,
	            		'displayContent': data.note, 
	            	},
	            },
	            hasLoading: false,
	            success (res) {
	            	_self.getFinanceSaleCheckList();
	            	_self.showMessageAddModal = false;
	            	_self.modifyOrderId = '';
	            },
	            fail () {
	            	layer.msg('添加留言失败，请重试~', {
	                    time: 2000
	                });
	                _self.modifyOrderId = '';
	            }
	    	});
        },
	}
}
</script>
<style scoped>
.search-div{
	padding-top: 8px;
	padding-bottom: 6px;
	background-color: #fff;
}
.result-div{
	margin-top: 8px;
	background: #fff;
	padding-top: 8px;

}
.search-div .form-group{
	margin-left: 0px;
	margin-right: 0px;
	margin-bottom: 4px;
}
.buttons{
	margin-bottom: 8px;
}
.table {
	margin-bottom: 0px;
}
.col-md-12 {
	padding-left: 0px;
	padding-right: 0px;
}
.table td {
	vertical-align: middle;
	padding-right: 2px;
	padding-left: 2px;
	text-align: center;
}
.table th {
	padding-left: 2px;
	padding-right: 2px;
}
label.control-label {
	padding-right: 0px;
	padding-left: 0px;
}
.col-md-5, .col-md-2 {
	padding-right: 1px;
	padding-left: 6px;
}
</style>