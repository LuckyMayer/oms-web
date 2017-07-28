<template>
	<select class="form-control input-sm" :disabled="_selfDisabled" v-model="selectedType" @change="selectType">
		<option value="">{{_placeholder}}</option>
		<option v-for="item in afterSaleTypeList" :value="item.id">{{item.name}}</option>
	</select>
</template>

<script>
import http from '../common/http'
import api from '../common/api'


export default {
	props: ['compId', 'placeholder', 'disabled', 'defaultOrderType'],
	data () {
        return {
            afterSaleTypeList: [{
                id: 'REFUND_ORDER_CANCEL',
                name: '废单退款'
            }, {
                id: 'REFUND_ONLY',
                name: '仅退款'
            }, {
                id: 'REFUND',
                name: '退款不退货'
            }, {
                id: 'RETURN',
                name: '退货'
            }, {
                id: 'EXCHANGE',
                name: '换货'
            }], 
            selectedType: '',
           
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
        selectType () {
            this.$emit('selected', {
                data: this.selectedType
            });
        }
    },
    watch: {
       defaultOrderType: function() {
            if(this.defaultOrderType != undefined && this.defaultOrderType != ''){
                this.selectedType = this.defaultOrderType;
            }
       }
    }
}
</script>