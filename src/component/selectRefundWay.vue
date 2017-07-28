<template>
	<select class="form-control input-sm" :disabled="_selfDisabled" v-model="selectedWay" @change="selectRefundWay">
		<!-- <option value="">{{_selfPlaceholder}}</option> -->
		<option v-for="item in refundWayList" :value="item.bankName">{{item.bankName}}</option>
	</select>
</template>

<script>
import http from '../common/http'
import api from '../common/api'

export default {
    mounted() {
        this.fetchRefundWayList();
    },
	props: ['compId',  'disabled', 'defaultRefundWay'],
	data () {
        return {
            refundWayList: [],
            selectedWay: ''
        }
    },
    computed: {
        _selfDisabled () {
            return this.disabled || false;
        }
    },
    methods: {
        fetchRefundWayList () {
            const _self = this;
            http({
                instance: _self,
                url: api.getBankOnlinePaymentList,
                type: 'post',
                hasLoading: false,
                success (res) {
                    _self.refundWayList = res.data;
                    _self.selectedWay = res.data[0].bankName;
                }
            });
        },
        selectRefundWay () {
            this.$emit('selected', this.selectedWay);
        }
    },
    watch: {
        defaultRefundWay: function(val){
            if(val != '' && val != undefined){
                this.selected = val;
                this.selectRefundWay();
            }
        }
    }
}
</script>