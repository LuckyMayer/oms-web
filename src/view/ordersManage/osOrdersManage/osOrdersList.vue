<template>
    <div class="content-wrapper">
		<section class="content-header clearfix">
			<ol class="breadcrumb col-md-6">
                <li><i class="fa fa-desktop"></i> 销售</li>
                <li class="active">原ERP销售单</li>
            </ol>
            <div class="col-md-6" style="text-align: right; position: relative; top: 10px;">
                <button class="btn btn-sm btn-primary" @click="createOrderModal.show = true">
		        	<i class="fa fa-plus"></i> 创建原ERP销售单
		        </button>
		    </div>  
        </section>
        <section class="content">
        	<div class="search-div col-md-12 form-horizontal">
        		<div class="form-group">
        			<label class="col-md-1 control-label">订单号</label>
        			<div class="col-md-2">
        				<input type="text" class="form-control input-sm" v-model.trim="searchData.orderSn">
        			</div>
        			<label class="col-md-1 control-label">店铺</label>
        			<div class="col-md-2">
        				<component id="searchShop" is="select-shop" v-model="searchData.shopId" @selected="selectedShop" ></component>
        			</div>
        			<label class="col-md-1 control-label">订单时间</label>
        			<div class="col-md-3">
        				<component is="date-range-picker" id="apply-time" :needhms="true" @get_date="selectedOrderTime" :start-time="searchData.startTime" :end-time="searchData.endTime"></component>
        			</div>
                    <div class="col-md-2">
                        <button class="btn btn-sm btn-primary" @click="getOsOrderLists"><i class="fa fa-search"></i>&nbsp;查询</button>
                    </div>	
        		</div>
        	</div>
        	<div class="clear"></div>
        	<div class="result-list">
    			<table class="table">
        			<thead>
        				<tr>
        					<th width="10%">系统订单号</th>
        					<th width="10%">订单时间</th>
        					<th width="14%">原始订单号</th>
        					<th width="12%">店铺</th>
        					<th width="12%">分销商</th>
        					<th width="10%">订单类型</th>
        					<th width="10%">发货条件</th>
        					<th width="10%">订单状态</th>
        					<th width="6%">应收</th>
        					<th width="6%">实收</th>
        				</tr>
        			</thead>
        			<tbody>
        				<tr v-for="item in osOrders">
        					<td>
                                <a :href="'#/ordersManage/omsOrderDetail/orderDetails/'+item.orderId" target="_blank">{{item.orderSn}}</a>
        					</td>
        					<td>{{item.createTime}}</td>
        					<td style="word-wrap:break-word;word-break:break-all;"><template v-if="item.originOrder">{{item.originOrder.platformOrderId}}</template></td>
        					<td><template v-if="item.shop">{{item.shop.shopName}}</template></td>
        					<td><template v-if="item.distributor">{{item.distributor.distributorName}}</template></td>
        					<td>{{item.orderTypeValue}}</td>
        					<td>{{item.sendConditionType | sendConditionTypeFilter}}</td>
        					<td>{{item.orderStatus | orderStatusFilter(item.shippingStatus)}}</td>
        					<td>{{item.totalFee}}</td>
        					<td>{{item.payment}}</td>
        				</tr>
        			</tbody>
        		</table>
                <div class="box-footer clearfix">
                    <div class="col-md-2 no-padding"></div>
                    <component is='pagination' :offset="searchData.offset" :length="searchData.length" :total-count="pageData.totalCount" @paginate="paginate"></component>
                </div>
        	</div>
        </section>
        <component is="create-modal" v-if="createOrderModal.show"  @cancel="cancelCreate" @success="successCreate"></component>
    </div>
</template>

<script>
import http from '../../../common/http'
import api from '../../../common/api'
import {getDateStr} from '../../../common/getDateStr'
import initStyle from '../../../common/initStyle'
import selectShop from '../../../component/selectShop'
import createModal from './createModal'
import dateRangePicker from '../../../component/dateRangePicker'
import pagination from '../../../component/pagination'


export default {
    data () {
    	return {
    		searchData: {
    			orderSn: "",
    			shopId: "",
    			startTime: "",
    			endTime: "",
                offset: 0,
                length: 50
    		},
            pageData: {
                totalCount: ''
            },
    		osOrders: [],
    		createOrderModal: {
    			show: false,
    		},
    	}
    },
    mounted () {
	    this.$nextTick(() => {
	      	initStyle();
            this.searchData.startTime = getDateStr(-30,true);
            this.searchData.endTime = getDateStr(0,true);
	      	
	    });
	},
    components: {selectShop,dateRangePicker,createModal,pagination},
    filters: {
        orderStatusFilter: function(val1,val2) {
            const orderStatusMapping = {
                'WAIT_CHECK': '待审核',
                'CHECK_PASS': '已审核',
                'REJECT': '已驳回',
                'CLOSE_PLATFORM': '已作废',
                'CLOSED_MANUAL': '已作废',
                'INVALID': '无效',
            };
            const shippingStatusMapping = {
                'INIT': '待处理',
                'PUSH': '已推送',
                'OPERATED': '已发货',
                'PLATFORM_OPERATED': '平台已发货',
                'OLD_SYSTEM_OPERATED': '老系统已发货',
            };
            if(val2 != 'INIT' && val2 != undefined){
                for(let key in shippingStatusMapping ){
                    if(key == val2){
                        return shippingStatusMapping[key];
                    }
                }
            }else if(val2 == 'INIT'){
                for(let key in orderStatusMapping ){
                    if(key == val1){
                        return orderStatusMapping[key];
                    }
                }               
            }
        },
        sendConditionTypeFilter(val) {
            const sendConditionTypeMapping = {
                "PAID": "先款后货",
                "COD_SHIP": "COD",
                "SELL_ON_CREDIT": "赊销",
            };
            return sendConditionTypeMapping[val];
        }
    },
    watch: {
    	
    },
    methods: {
        getOsOrderLists() {
            this.searchData.offset = 0;
            this.getOsOrderList();
        },
    	getOsOrderList() {          
    		const _self = this;
	    	http({
	    		instance: _self,
	    		url: api.getOldShippedOrderList,
	            type: 'post',
	            data: {data: _self.searchData},
	            hasLoading: true,
	            success (res) {
	            	if(res.data.totalCount > 0){
	            		_self.osOrders = res.data.content;
	            	}else{
	            		_self.osOrders = [];
	            	}
                    _self.pageData.totalCount = res.data.totalCount;
	            }
	        });
    	},
        paginate(data) {
            this.searchData.offset = data.offset;
            this.searchData.length = data.length;
            this.getOsOrderList();
        },
    	selectedShop(data) {
            if($.isEmptyObject(data)) {
                this.searchData.shopId = '';
            }else {
                this.searchData.shopId = data.data.shopId;
            }
    	},
    	selectedOrderTime (date) {
            this.searchData.startTime = date.start_time;
            this.searchData.endTime = date.end_time;
        },
    	cancelCreate(data) {
    		this.createOrderModal.show = false;    		
    	},
    	successCreate() {
    		this.createOrderModal.show = false;
    		this.getOsOrderList();
    	},

    }
}
</script>

<style scoped>
.table {
	margin-bottom: 0px;
}
.search-div {
	padding-top: 20px;
	background-color: #fff;
}
.result-list {
	background-color: #fff;
	margin-top: 10px;
}
.buttons {
	padding: 10px 10px;
}
.buttons button {
	margin-right: 10px;
}
.btn-xs {
	padding-right: 10px;
	padding-left: 10px;
}
.control-label {
	padding-right: 0px;
	padding-left: 0px;
}
label {
	overflow:hidden;
	white-space:nowrap;
}
.table td {
    text-align: center;
    vertical-align: middle;
}
</style>