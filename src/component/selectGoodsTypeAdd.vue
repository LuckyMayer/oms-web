<template>
    <select class="form-control input-sm" v-model="singleOrGroup" @change="changeSingleOrGroup">
        <option v-for="item in addGoodsTypeList" :value="item.value">{{item.name}}</option>
    </select>
</template>

<script>
import http from '../common/http'
import api from '../common/api'


export default {
	props: ['compId', 'disabled'],
	data () {
        return {
            addGoodsTypeList: [{
                "name": "单品商品",
                "value": "1",
            },{
                "name": "套餐商品",
                "value": "2",   
            }],
            singleOrGroup: '1',
           
        }
    },
    computed: {
        _selfDisabled () {
            return this.disabled || false;
        }
    },
    methods: {
        changeSingleOrGroup () {
            this.$emit('selected', this.singleOrGroup);
        }
    }
}
</script>