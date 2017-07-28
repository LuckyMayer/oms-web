<template>
	<select class="form-control input-sm" :disabled="_selfDisabled" v-model="selectedType" @change="selectRefundType">
		<!-- <option value="">{{_selfPlaceholder}}</option> -->
		<option v-for="item in refundTypeList" :value="item.value">{{item.name}}</option>
	</select>
</template>

<script>
export default {
	props: ['compId', 'placeholder', 'disabled', 'defaultRefundType'],
	data () {
        return {
            refundTypeList: [{
                name: '淘宝店铺担保退款',//（淘宝未确认收货前退款）
                value: 'SHOP_REFUND'
            }, {
                name: '网银退款',//（直接转账退款给顾客个人账户）
                value: 'ONLINE_BANK_REFUND'
            }, {
                name: '平台店铺退款',//（非淘各平台的在线退款，包含淘宝确认收货后的售后退款）
                value: 'RECEIPT_REFUND'
            }],

            selectedType: 'SHOP_REFUND'
        }
    },
    computed: {
        _selfPlaceholder () {
            return this.placeholder ||'=== 全部类型 ===';
        },
        _selfDisabled () {
            return this.disabled || false;
        }
    },
    methods: {
        selectRefundType () {
            this.$emit('selected', this.selectedType);
        }
    },
    watch: {
        defaultRefundType: function(){
            if(this.defaultRefundType != undefined && this.defaultRefundType != ''){
                this.selectedType = this.defaultRefundType;
                this.selectRefundType;
            }   
        }
    }
}
</script>