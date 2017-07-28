<template>
	<input :id="_selfCompId" type="text" class="form-control input-sm no-padding" :placeholder="_selfPlaceholder" v-model="key" :disabled="_selfDisabled" @keyup.17="fetchGoodsSkuCodeList"/>
</template>

<script>
import http from '../common/http'
import api from '../common/api'

export default {
	props: ['compId', 'placeholder', 'disabled', 'partyId', 'initGood'],
	data () {
        return {
        	key: '', // 搜索关键字
            goodsSkuCode: {}, // 搜索商品列表   
            addGoods: {
                addGoodsDisabled: true,
                styleType1Display: false,
                styleType2Display: false,
                styleType3Display: false,
                addStyleType1: {
                    active: "",
                    styleType:{
                        name: "",
                        id: ""
                    },
                    styleValues:[],
                },
                addStyleType2: {
                    active: "",
                    styleType:{
                        name: "",
                        id: ""
                    },
                    styleValues:[],
                },
                addStyleType3: {
                    active: "",
                    styleType:{
                        name: "",
                        id: ""
                    },
                    styleValues:[],
                },
                addOuterSkuId: "",
                addOuterIid: "",
                addGoodsId: "",
                addGoodsName: "",
                addPrice:"",
                addQuantity: "",
                addTaxFee: ""
            },
        }
    },
    computed: {
    	_selfCompId () {
    		return this.compId || 'searchGoodsSkuCode';
    	},
        _selfPlaceholder () {
            return this.placeholder ||'按【ctrl】搜索';
        },
        _selfDisabled () {
            return this.disabled || false;
        },
        outerIid () {
            return this.initGood == undefined ? '' : this.initGood.addOuterIid;
        }
    },
    methods: {
        fetchGoodsSkuCodeList () {
        	const _self = this;

            http({
                instance: _self,
                url: api.getGroupGoodsSkuCodeListForOrder,
                type: 'post',
                loadingParam : {
                    target : '#' + _self._selfCompId,
                    position : 'right'
                },
                data: {
                    data: {
                        'goodsGroupCode': _self.key,
                        'partyId': _self.partyId || '',
                    }
                },
                success (res) {
                    _self.goodsSkuCode = res.data;
                    _self.selectGroupGoodsSkuCode(_self.goodsSkuCode);

                    _self.$emit("selected", _self.addGoods);
                }
            });
        },
        selectGroupGoodsSkuCode (data) {
            if(data && data.goodsGroupCode != "" && data.goodsGroupCode != null){
                this.addGoods.addOuterIid = data.goodsGroupCode;
                this.addGoods.addGoodsId = data.goodsGroupId;
                this.addGoods.addGoodsName = data.goodsGroupName;
                this.addGoods.addPrice = data.goodsGroupPrice;
                this.addGoods.addTaxFee = "0.00";
                this.addGoods.addQuantity = 1;
                this.addGoods.addGoodsDisabled = false;
            }else{
                this.addGoods.addGoodsDisabled = true;
            }
        },
        
    },
    watch: {
        outerIid (newVal) {
            if(newVal != undefined && newVal == '') {
                this.key = '';
            }
        }
    }
}
</script>