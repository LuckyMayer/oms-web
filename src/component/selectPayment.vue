
<template>
	<select class="form-control input-sm" :disabled="_selfDisabled" v-model="selectedPayment" @change="selectPayment">
		<option value="">{{_selfPlaceholder}}</option>
		<option v-for="item in PaymentList" :value="item.payId">{{item.payName}}</option>
	</select>
</template>

<script>
import http from '../common/http'
import api from '../common/api'

export default {
    mounted () {
        this.fetchPaymentList();
    },
	props: ['partyId', 'placeholder', 'disabled', 'defaultPayment'],
	data () {
        return {
            PaymentList: [],
            selectedPayment: ''
        }
    },
    computed: {
        _selfPlaceholder () {
            return this.placeholder ||'=== 请选择支付方式 ===';
        },
        _selfDisabled () {
            return this.disabled || false;
        }
    },
    methods: {
        fetchPaymentList () {
            const _self = this;
            http({
                instance: _self,
                url: api.getPaymentList,
                type: 'post',
                data:{
                    data:{
                        'partyId': '',
                    }
                },
                hasLoading: false,
                success (res) {
                    _self.PaymentList = res.data;
                }
            });
        },
        selectPayment () {
            if(this.selectedPayment != undefined) {
                this.$emit('selected', {
                    data: this.selectedPayment
                });
            }
        }
    },
    watch: {
        defaultPayment: function(val) {
            if(val != undefined) {
                this.selectedPayment = val;
            }
        },
    },
}
</script>