<template>
	<div>
		<component is="overlay" v-if="showOverlay" :on-click="cancelModify"></component>
		<div class="push-strategy-detail-modal">
			<div>
				<label></label>
			</div>
			<table class="table">
				<thead>
					<tr>
						<th>业务组</th>
						<th width="40%">可发店铺</th>
						<th>今日已推送</th>
						<th>
							当前停止推送
							<a href="#" @click.prevent="batchRecoverToday"><i class="iconfont">&#xe619;</i></a>
							<a href="#" @click.prevent="batchStopToday"><i class="iconfont">&#xe640;</i></a>
						</th>
						<th>
							次日停止推送
							<a href="#" @click.prevent="batchRecoverTomorrow"><i class="iconfont">&#xe619;</i></a>
							<a href="#" @click.prevent="batchStopTomorrow"><i class="iconfont">&#xe640;</i></a></th>
						<th>当前优先级</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(item, index) in pushStrategyDetailList">
						<td>{{item.party.partyName}}</td>
						<td>{{item.shop.shopName}}</td>
						<td>{{item.pushedCount}}</td>
						<td>
							<span :class="{'red': item.todayStatus=='DELETED'}">{{item.todayStatus | statusFilter}}</span>
							<a v-if="item.todayStatus=='DELETED'" href="#" @click.prevent="recoverToday(index)"><i class="iconfont">&#xe619;</i></a>
							<a v-else href="#" @click.prevent="stopToday(index)"><i class="iconfont">&#xe640;</i></a>
						</td>
						<td>
							<span :class="{'red': item.tomorrowStatus=='DELETED'}">{{item.tomorrowStatus | statusFilter}}</span>
							<a v-if="item.tomorrowStatus=='DELETED'" href="#" @click.prevent="recoverTomorrow(index)"><i class="iconfont">&#xe619;</i></a>
							<a v-else href="#" @click.prevent="stopTomorrow(index)"><i class="iconfont">&#xe640;</i></a>
						<td>
							<input type="radio" :name="'prior_'+index" value="1" v-model="item.prior" @change="choosePrior(index,1)"><span :class="{'grey': item.prior=='0'}">高</span>
							&nbsp;<input type="radio" :name="'prior_'+index" value="0" v-model="item.prior" @change="choosePrior(index,0)"><span :class="{'grey': item.prior=='1'}">低</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

	</div>

</template>

<script>
import http from '../../../common/http'
import api from '../../../common/api'
import initStyle from '../../../common/initStyle'
import overlay from '../../../component/overlay'

export default {
	props: {
		showOverlay: {
	      	type: Boolean,
	      	default: true
	    },
	    id: {
	    	default: '',
	    },
	},
	data() {
		return {
			pushStrategyDetailList: [],
		}
	},
	mounted() {
		this.$nextTick(() => {
	      	initStyle();
	      	this.getPushStrategyDeatil(this.id);
	    });
	},
	filters: {
		statusFilter: function(val) {
			if(val == 'NORMAL') {
				return '正常';
			}else if(val == 'DELETED') {
				return '停止';
			}
		}
	},
	components: {overlay,},
	methods: {
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
					_self.pushStrategyDetailList = res.data;
				},
			});
		},
		recoverToday(index) {
			var dataTemp = {
				wmsPushStrategyDetailId: this.pushStrategyDetailList[index].wmsPushStrategyDetailId,
				prior: this.pushStrategyDetailList[index].prior,
				todayStatus: 'NORMAL',
				tomorrowStatus: this.pushStrategyDetailList[index].tomorrowStatus,
			}
			this.modifyPushStrategyDetail(dataTemp);
		},
		stopToday(index) {
			var dataTemp = {
				wmsPushStrategyDetailId: this.pushStrategyDetailList[index].wmsPushStrategyDetailId,
				prior: this.pushStrategyDetailList[index].prior,
				todayStatus: 'DELETED',
				tomorrowStatus: this.pushStrategyDetailList[index].tomorrowStatus,
			}
			this.modifyPushStrategyDetail(dataTemp);
		},
		recoverTomorrow(index) {
			var dataTemp = {
				wmsPushStrategyDetailId: this.pushStrategyDetailList[index].wmsPushStrategyDetailId,
				prior: this.pushStrategyDetailList[index].prior,
				todayStatus: this.pushStrategyDetailList[index].todayStatus,
				tomorrowStatus: 'NORMAL',
			}
			this.modifyPushStrategyDetail(dataTemp);
		},
		stopTomorrow(index) {
			var dataTemp = {
				wmsPushStrategyDetailId: this.pushStrategyDetailList[index].wmsPushStrategyDetailId,
				prior: this.pushStrategyDetailList[index].prior,
				todayStatus: this.pushStrategyDetailList[index].todayStatus,
				tomorrowStatus: 'DELETED',
			}
			this.modifyPushStrategyDetail(dataTemp);
		},
		choosePrior(index,data) {
			var dataTemp = {
				wmsPushStrategyDetailId: this.pushStrategyDetailList[index].wmsPushStrategyDetailId,
				prior: data,
				todayStatus: this.pushStrategyDetailList[index].todayStatus,
				tomorrowStatus: this.pushStrategyDetailList[index].tomorrowStatus,
			}
			this.modifyPushStrategyDetail(dataTemp);
		},
		modifyPushStrategyDetail(data) {
			const _self = this;
			http({
				instance: _self,
				url: api.pushStrategyDetailModify,
				hasLoading: true,
				type: 'post',
				data: {
					data: data
				},
				success(res) {
					layer.msg('修改成功！', {timeout: 2000});
					_self.getPushStrategyDeatil(_self.id);
				}
			})
		},
		batchRecoverToday() {
			var tempData = {
				wmsPushStrategyId: this.id,
				todayStatus: 'NORMAL',
			};
			this.modifyPushStrategyDetailStatus(tempData);
		},
		batchStopToday() {
			var tempData = {
				wmsPushStrategyId: this.id,
				todayStatus: 'DELETED',
			};
			this.modifyPushStrategyDetailStatus(tempData);
		},
		batchRecoverTomorrow() {
			var tempData = {
				wmsPushStrategyId: this.id,
				tomorrowStatus: 'NORMAL',
			};
			this.modifyPushStrategyDetailStatus(tempData);
		},
		batchStopTomorrow() {
			var tempData = {
				wmsPushStrategyId: this.id,
				tomorrowStatus: 'DELETED',
			};
			this.modifyPushStrategyDetailStatus(tempData);
		},
		modifyPushStrategyDetailStatus(data) {
			const _self = this;
			http({
				instance: _self,
				url: api.pushStrategyDetailStatusModify,
				type: 'post',
				hasLoading: true,
				data: {
					data: data
				},
				success(res) {
					layer.msg('修改成功！', {timeout: 2000});
					_self.getPushStrategyDeatil(_self.id);
				}
			});
		},
		cancelModify() {
			this.$emit('cancel', true);
		}
	},
}
</script>

<style scoped>
.push-strategy-detail-modal {
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
	z-index: 1003;

}
.table td {
	text-align: center;
	vertical-align: middle;
}
.grey {
	color: grey;
}
</style>