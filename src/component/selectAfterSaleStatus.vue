<template>
	<select class="form-control input-sm" :disabled="_selfDisabled" v-model="selectedStatus" @change="selectStatus">
		<option value="">{{_placeholder}}</option>
		<option v-for="item in afterSaleStatusList" :value="item.id">{{item.name}}</option>
	</select>
</template>

<script>
import http from '../common/http'
import api from '../common/api'


export default {
	props: ['compId', 'placeholder', 'disabled', 'defaultStatus'],
	data () {
        return {
            afterSaleStatusList: [{
                id: 'NOT_FINISHED',
                name: '未完成'
            }, {
                id: 'INVALID',
                name: '无效，待编辑'
            }, {
                id: 'WAIT_CHECK',
                name: '待审核'
            }, {
                id: 'CHECK_PASS',
                name: '审核通过'
            }, {
                id: 'CHECK_REJECT',
                name: '审核否决'
            }, {
                id: 'CLOSED',
                name: '已作废'
            }, {
                id: 'FINISHED',
                name: '已完成'
            }, {
                id: 'INIT',
                name: '待推送'
            }, {
                id: 'PUSH',
                name: '已推送待退货'
            }, {
                id: 'OPERATED',
                name: '已经操作/入库'
            }, {
                id: 'WAIT_SETTLE',
                name: '待结算'
            }, {
                id: 'SETTLED',
                name: '已结算'
            }, {
                id: 'REJECT',
                name: '结算驳回'
            }, {
                id: 'GENERATED',
                name: '已生成换货订单'
            }], 
            selectedStatus: '',
           
        }
    },
    computed: {
        _placeholder() {
            return this.placeholder || '=== 全部类型 ===';
        },
        _selfDisabled () {
            return this.disabled || false;
        }
    },
    methods: {
        selectStatus () {
            if(this.selectedStatus != undefined) {
                this.$emit('selected', {
                    data: this.selectedStatus
                });
            } 
        }
    },
    watch: {
        defaultStatus(val) {
            if(val != undefined) {
                this.selectedStatus = val;
            }
        }
    }
}
</script>