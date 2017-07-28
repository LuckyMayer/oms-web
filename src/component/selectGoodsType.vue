
<template>
	<select class="form-control input-sm" :disabled="_selfDisabled" v-model="selectedType" @change="selectGoodsType">
		<option value="">{{_selfPlaceholder}}</option>
		<option v-for="item in goodsTypeList" :value="item.value">{{item.name}}</option>
	</select>
</template>

<script>
export default {
	props: ['compId', 'placeholder', 'disabled', 'select'],
	data () {
        return {
            goodsTypeList: [{
                name: '普通商品',
                value: 'GOODS'
            }, {
                name: '包材',
                value: 'FILL_GOODS'
            }, {
                name: '耗材',
                value: 'PACK_GOODS'
            }],

            selectedType: ''
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
    watch: {
        select () {
            if (this.select) {
                this.selectedType = this.select;
            }
        }
    },
    methods: {
        selectGoodsType () {
            this.$emit('selected', this.selectedType);
        }
    }
}
</script>