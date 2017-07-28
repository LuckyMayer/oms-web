
<template>
	<select class="form-control input-sm" :disabled="_selfDisabled" v-model="selectedCurrency" @change="selectCurrency">
		<option value="">{{_selfPlaceholder}}</option>
		<option v-for="item in CurrencyList" :value="item.value">{{item.name}}</option>
	</select>
</template>

<script>
export default {
	props: ['partyId', 'placeholder', 'disabled'],
	data () {
        return {
            CurrencyList: [
            {
                'name': '=== 人民币 ===',
                'value': 'RMB',
            }],
            selectedCurrency: 'RMB'
        }
    },
    computed: {
        _selfPlaceholder () {
            return this.placeholder ||'=== 请选择币种 ===';
        },
        _selfDisabled () {
            return this.disabled || false;
        }
    },
    methods: {
        selectCurrency () {
            this.$emit('selected', {
                data: this.selectedCurrency
            });
        }
    }
}
</script>