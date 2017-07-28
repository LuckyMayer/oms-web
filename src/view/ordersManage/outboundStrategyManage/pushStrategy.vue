<template>
	<div class="content-wrapper">
		<section class="content-header clearfix">
			<ol class="breadcrumb col-md-6">
                <li><i class="fa fa-desktop"></i> 销售</li>
                <li class="active">推送策略</li>
            </ol>
        </section>
        <section class="content">
        	<div class="search-div col-md-12 form-horizontal">
				<div class="form-group">
					<label class="col-md-1 control-label">选择店铺</label>
					<div class="col-md-2 no-padding">
						<component id="searchShop" is="select-shop" v-model="searchData.shopId" @selected="selectedShop" ></component>
					</div>
					<div class="col-md-2">
						<button class="btn btn-sm btn-primary" @click="getpushStrategyList"><i class="fa fa-search"></i>&nbsp;查询</button>	
					</div>
				</div>
        	</div>
        	<div class="result-div">
        		<table class="table">
        			<thead>
        				<th>仓库类型</th>
        				<th>逻辑仓</th>
        				<th>当天推送阈值</th>
        				<th>次日推送阈值</th>
        				<th>当天推送时间</th>
        				<th>次日推送时间</th>
        				<th>操作</th>
        				<th>今日已推送</th>
        				<th>停止推送店铺</th>
        				<th>店铺明细</th>
        			</thead>
        			<tbody>
        				<template v-for="(value, key) in resultList">
        					<tr v-for="(item, index) in value">
	        					<td v-if="index==0" :rowspan="value.length">{{key}}</td>
	        					<td>{{item.warehouse.warehouseName}}</td>
	        					<td><input type="text" v-model="item.todayThrehold" :class="{'not-editable':!item.isEditable}"></td>
	        					<td><input type="text" v-model="item.tomorrowThrehold" :class="{'not-editable':!item.isEditable}"></td>
	        					<td>
	        						<template v-if="!item.isEditable">{{item.todayStartTime}}-{{item.todayEndTime}}</template>
	        						<template v-else>
	        							<input type="time" v-model="item.todayStartTime" :class="{'not-editable':!item.isEditable}">
			        					-
			        					<input type="time" v-model="item.todayEndTime" :class="{'not-editable':!item.isEditable}"></td>
	        						</template>
		        					
	        					<td>
	        						<template v-if="!item.isEditable">{{item.tomorrowStartTime}}-{{item.tomorrowEndTime}}</template>
	        						<template v-else>
		        						<input type="time" v-model="item.tomorrowStartTime" :class="{'not-editable':!item.isEditable}">
			        					-
			        					<input type="time" v-model="item.tomorrowEndTime" :class="{'not-editable':!item.isEditable}">
			        				</template>
			        			</td>
	        					<td>
	        						<a href="#" v-if="!item.isEditable" @click.prevent="editPushStrategy(key,index)"><i class="iconfont">&#xe622;</i></a>
									<a href="#" v-if="item.isEditable" @click.prevent="confirmPushStrategy(key,index)"><i class="iconfont confirm-icon">&#xe626;</i></a>
									<a href="#" v-if="item.isEditable" @click.prevent="cancelPushStrategy(key,index)"><i class="iconfont cancel-icon">&#xe7ca;</i></a>
	        					</td>
	        					<td>{{item.pushedCount}}</td>
	        					<td><span style="color:red" v-if="item.invalidShopNick">{{item.invalidShopNick}}......</span></td>
	        					<td><a href="#" @click.prevent="showPushStrategyDeatil(item.wmsPushStrategyId)">查看店铺明细</a></td>
	        				</tr>
        				</template>
        			</tbody>
        		</table>
        	</div>
        </section>
        <component is="push-strategy-detail-modal" v-if="pushStrategyDetailModal.show" :id="pushStrategyDetailModal.id" @cancel="cancelPushStrategyDetailModify"></component>
	
    </div>
</template>




<script>
import http from '../../../common/http'
import api from '../../../common/api'
import {getDateStr} from '../../../common/getDateStr'
import initStyle from '../../../common/initStyle'
import datePicker from '../../../component/datePicker'
import selectShop from '../../../component/selectShop'
import pushStrategyDetailModal from './pushStrategyDetailModal'

export default {
	data() {
		return {
			pushStrategyDetailModal: {
				show: false,
				id: '',
			},
			searchData: {
				shopId: '',
			},
			resultList: [],
			pushStrategyDetail: {},
			pushStrategyModifyData: {},

		}
	},
	mounted () {
	    this.$nextTick(() => {
	      	initStyle();
	    });
	},
	components: {datePicker,selectShop,pushStrategyDetailModal},
	methods: {
		dealWithStrategyList(data) {
			var result = {};
			data.forEach(function(item, index) {
				item.isEditable = false;
				if(item.todayStartTime != '' && item.todayStartTime != undefined) {
					item.todayStartTime = item.todayStartTime.substr(0,5);
				}
				if(item.todayEndTime != '' && item.todayEndTime != undefined) {
					item.todayEndTime = item.todayEndTime.substr(0,5);
				}
				if(item.tomorrowStartTime != '' && item.tomorrowStartTime != undefined) {
					item.tomorrowStartTime = item.tomorrowStartTime.substr(0,5);
				}
				if(item.tomorrowEndTime != '' && item.tomorrowEndTime != undefined) {
					item.tomorrowEndTime = item.tomorrowEndTime.substr(0,5);
				}
				if(item.invalidShops != null && item.invalidShops != undefined && item.invalidShops.length > 0) {
					item.invalidShopNick = item.invalidShops[0].shopNick;
				}
				if(item.warehouse == undefined) {
					item.warehouse = {};
				}
				if(item.warehouse.warehouseTypeValue in result) {
					result[item.warehouse.warehouseTypeValue].push(item);
				}else {
					result[item.warehouse.warehouseTypeValue] = [];
					result[item.warehouse.warehouseTypeValue].push(item);
				}

			});
			return result;
		},
		selectedShop(data) {
			this.searchData.shopId = data.data.shopId;
		},
		getpushStrategyList() {
			const _self = this;
			http({
				instance: _self,
				url: api.pushStrategyListByShop,
				type: 'post',
				hasLoading: true,
				data: {
					data: _self.searchData
				},
				success(res) {
					_self.resultList = _self.dealWithStrategyList(res.data);
				},
			})
		},
		showPushStrategyDeatil(id) {
			this.pushStrategyDetailModal.show = true;
			this.pushStrategyDetailModal.id = id;
		},
		getPushStrategyDeatil(id) {
			const _self = this;
			http({
				instance: _self,
				url: api.pushStrategyDetailList,
				type: 'post',
				hasLoading: true,
				data: {
					data: {wmsPushStrategyId: id},
				},
				success(res) {
					_self.pushStrategyDetail = res.data;
				},
			});
		},
		editPushStrategy(key,index) {
			this.pushStrategyModifyData.wmsPushStrategyId = this.resultList[key][index].wmsPushStrategyId;
			this.pushStrategyModifyData.todayThrehold = this.resultList[key][index].todayThrehold;
			this.pushStrategyModifyData.tomorrowThrehold = this.resultList[key][index].tomorrowThrehold;
			this.pushStrategyModifyData.todayStartTime = this.resultList[key][index].todayStartTime;
			this.pushStrategyModifyData.todayEndTime = this.resultList[key][index].todayEndTime;
			this.pushStrategyModifyData.tomorrowStartTime = this.resultList[key][index].tomorrowStartTime;
			this.pushStrategyModifyData.tomorrowEndTime = this.resultList[key][index].tomorrowEndTime;

			this.resultList[key][index].isEditable = true;
		},
		confirmPushStrategy(key,index) {
			var pushStrategyModifyDataTemp = {};
			var today = new Date();
			var h = today.getHours();
			var m = today.getMinutes();
			var time = this.checkTime(h) + ':' + this.checkTime(m);
			if(this.resultList[key][index].todayThrehold != '') {
				pushStrategyModifyDataTemp.todayThrehold = this.resultList[key][index].todayThrehold;
			}
			if(this.resultList[key][index].tomorrowThrehold != '') {
				pushStrategyModifyDataTemp.tomorrowThrehold = this.resultList[key][index].tomorrowThrehold;
			}
			if(this.resultList[key][index].todayStartTime != '') {
				if(this.resultList[key][index].todayStartTime <= time) {
					layer.msg('当天推送时间必须大于现在！', {timeout: 2000});
					return false;
				}
				pushStrategyModifyDataTemp.todayStartTime = this.resultList[key][index].todayStartTime + ':00';
			}
			if(this.resultList[key][index].todayEndTime != '') {
				if(this.resultList[key][index].todayEndTime <= time) {
					layer.msg('当天推送时间必须大于现在！', {timeout: 2000});
					return false;
				}
				pushStrategyModifyDataTemp.todayEndTime = this.resultList[key][index].todayEndTime + ':00';
			}
			if(this.resultList[key][index].todayStartTime != '' && this.resultList[key][index].todayEndTime != '') {
				if(this.resultList[key][index].todayEndTime < this.resultList[key][index].todayStartTime) {
					layer.msg('结束时间必须大于开始时间！', {timeout: 2000});
					return false;
				}
			}
			if(this.resultList[key][index].tomorrowStartTime != '' && this.resultList[key][index].tomorrowEndTime != '') {
				if(this.resultList[key][index].tomorrowEndTime < this.resultList[key][index].tomorrowStartTime) {
					layer.msg('结束时间必须大于开始时间！', {timeout: 2000});
					return false;
				}
			}
			if(this.resultList[key][index].tomorrowStartTime != '') {
				pushStrategyModifyDataTemp.tomorrowStartTime = this.resultList[key][index].tomorrowStartTime + ':00';
			}
			if(this.resultList[key][index].tomorrowEndTime != '') {
				pushStrategyModifyDataTemp.tomorrowEndTime = this.resultList[key][index].tomorrowEndTime + ':00';
			}
			if($.isEmptyObject(pushStrategyModifyDataTemp)) {
				layer.msg('您未修改任何信息', {timeout: 2000});
				return false;
			}
			pushStrategyModifyDataTemp.wmsPushStrategyId = this.resultList[key][index].wmsPushStrategyId;
			const _self = this;
			http({
				instance: _self,
				url: api.pushStrategyModify,
				hasLoading: true,
				type: 'post',
				data: {
					data: pushStrategyModifyDataTemp
				},
				success(res) {
					layer.msg('修改成功！', {timeout: 2000});
					_self.resultList[key][index].isEditable = false;
				},
			});
			
		},
		cancelPushStrategy(key,index) {
			this.resultList[key][index].wmsPushStrategyId = this.pushStrategyModifyData.wmsPushStrategyId;
			this.resultList[key][index].todayThrehold = this.pushStrategyModifyData.todayThrehold;
			this.resultList[key][index].tomorrowThrehold = this.pushStrategyModifyData.tomorrowThrehold;
			this.resultList[key][index].todayStartTime = this.pushStrategyModifyData.todayStartTime;
			this.resultList[key][index].todayEndTime = this.pushStrategyModifyData.todayEndTime;
			this.resultList[key][index].tomorrowStartTime = this.pushStrategyModifyData.tomorrowStartTime;
			this.resultList[key][index].tomorrowEndTime = this.pushStrategyModifyData.tomorrowEndTime;

			this.resultList[key][index].isEditable = false;
		},
		cancelPushStrategyDetailModify() {
			this.pushStrategyDetailModal.show = false;
			this.getpushStrategyList();
		},
		checkTime(i){
			if (i < 10) {
				i = "0" + i
			}
			return i
		},
	}
}	

</script>

<style scoped>
.search-div {
	background-color: #fff;
}
.form-group {
	margin-top: 10px;
	margin-bottom: 10px;
}
.result-div {
	margin-top: 10px;
	background-color: #fff;
	float: left;
	width: 100%;
	padding-top: 10px;
}
.table td{
	vertical-align: middle;
	text-align: center;
	padding-left: 2px;
	padding-right: 2px;
}
.table input {
	width: 80px;
	text-align: center;
}
.not-editable {
	background-color: transparent;
	border: 0;
}
.confirm-icon {
	color: #78BF2A;
}
.cancel-icon, .delete-icon {
	color: #F86767;
}
</style>