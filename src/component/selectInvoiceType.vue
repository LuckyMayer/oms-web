<template>
	<select class="form-control input-sm" :disabled="_selfDisabled" v-model="selectedType" @change="selectInvoiceType">
		<option v-for="item in invoiceTypeList" :value="item.value">{{item.name}}</option>
	</select>
</template>

<script>
import http from '../common/http'
import api from '../common/api'

export default {
	props: ['compId', 'disabled', 'defaultInvoiceType'],
	data () {
        return {
           	invoiceTypeList: [{
                name: '增值发票',
                value: '1'
            }, {
                name: '普通发票',
                value: '2'
            }, {
                name: '电子发票',
                value: '3'
            }],

            selectedType: ''
        }
    },
    created () {
    	this.selectedType = this.defaultInvoiceType ||　'1';
    },
    computed: {
        _selfDisabled () {
            return this.disabled || false;
        },
    },
    methods: {
        selectInvoiceType () {
            this.$emit('selected', {
                data: this.selectedType
            });
        }
    }
}
</script>