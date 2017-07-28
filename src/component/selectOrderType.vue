
<template>
	<select class="form-control input-sm" :disabled="_selfDisabled" v-model="selectedOrderType" @change="selectOrderType">
		<option value="">{{_selfPlaceholder}}</option>
		<option v-for="item in OrderTypeList" :value="item.value">{{item.name}}</option>
	</select>
</template>

<script>
export default {
    mounted () {
        this.fetchOrderTypeList();
    },
	props: ['partyId', 'placeholder', 'disabled'],
	data () {
        return {
            OrderTypeList: [],
            selectedOrderType: ''
        }
    },
    computed: {
        _selfPlaceholder () {
            return this.placeholder ||'';
        },
        _selfDisabled () {
            return this.disabled || false;
        }
    },
    methods: {
        fetchOrderTypeList () {
            const _self = this;
            // http({
            //     instance: _self,
            //     url: api.getShopList,
            //     type: 'post',
            //     hasLoading: false,
            //     success (res) {
            //         _self.ShopList = res.data;
            //     }
            // });
        },
        selectOrderType () {
            this.$emit('selected', {
                data: this.selectedOrderType
            });
        }
    }
}
</script>