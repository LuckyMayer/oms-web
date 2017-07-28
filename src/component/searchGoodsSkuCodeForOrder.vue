<template>
	<input :id="_selfCompId" type="text" class="form-control input-sm no-padding" :placeholder="_selfPlaceholder" v-model="key" :disabled="_selfDisabled" @keyup.17="fetchGoodsSkuCodeList"/>
</template>

<script>
import http from '../common/http'
import api from '../common/api'

export default {
	props: ['compId', 'placeholder', 'disabled', 'partyId' , 'initGood'],
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
        outerSkuId () {
            return this.initGood == undefined ? '' : this.initGood.addOuterSkuId;
        }
    },
    methods: {
        fetchGoodsSkuCodeList () {
        	const _self = this;

            http({
                instance: _self,
                url: api.getGoodsSkuCodeListForOrder,
                type: 'post',
                loadingParam : {
                    target : '#' + _self._selfCompId,
                    position : 'right'
                },
                data: {
                    data: {
                        'skuCode': _self.key,
                        'partyId': _self.partyId || '',
                    }
                },
                success (res) {
                    _self.goodsSkuCode = res.data;

                    _self.selectGoodsSkuCode(_self.goodsSkuCode);

                    _self.$emit("selected", _self.addGoods);
                }
            });
        },
        selectGoodsSkuCode (data) { 
            Object.assign(this.$data.addGoods, this.$options.data.addGoods);
            if(data.skuCode != "" && data.skuCode != null){
                this.addGoods.addOuterSkuId = data.skuCode;
                this.addGoods.addGoodsId = data.goods.id;
                this.addGoods.addGoodsName = data.skuName == undefined ? '' : data.skuName;
                this.addGoods.addPrice = data.retailPrice == undefined ? 0 : data.retailPrice;
                this.addGoods.addTaxFee = "0.00";
                this.addGoods.addQuantity = 1;
                this.addGoods.styleType1Display = false;
                this.addGoods.styleType2Display = false;
                this.addGoods.styleType3Display = false;
                this.addGoods.addStyleType1 = {
                    active: "",
                    styleType:{
                        name: "",
                        id: ""
                    },
                    styleValues:[],
                };
                this.addGoods.addStyleType2 = {
                    active: "",
                    styleType:{
                        name: "",
                        id: ""
                    },
                    styleValues:[],
                };
                this.addGoods.addStyleType3 = {
                    active: "",
                    styleType:{
                        name: "",
                        id: ""
                    },
                    styleValues:[],
                };
                if(data.styleValue1){
                    this.addGoods.addStyleType1.active = data.styleValue1.id;
                    this.addGoods.addStyleType1.styleType = data.styleValue1.styleType;
                    this.addGoods.addStyleType1.styleValues.push(data.styleValue1);
                    this.addGoods.styleType1Display = true;
                }
                if(data.styleValue2){
                    this.addGoods.addStyleType2.active = data.styleValue2.id;
                    this.addGoods.addStyleType2.styleType = data.styleValue2.styleType;
                    this.addGoods.addStyleType2.styleValues.push(data.styleValue2);
                    this.addGoods.styleType2Display = true;
                }
                if(data.styleValue3){
                    this.addGoods.addStyleType3.active = data.styleValue3.id;
                    this.addGoods.addStyleType3.styleType = data.styleValue3.styleType;
                    this.addGoods.addStyleType3.styleValues.push(data.styleValue3);
                    this.addGoods.styleType3Display = true;
                }
                this.addGoods.addGoodsDisabled = false;
            }else{
                this.addGoods.addGoodsDisabled = true;
            }
            
        },
        
    },
    watch: {
        outerSkuId (newVal) {
            if(newVal != undefined && newVal == '') {
                this.key = '';
            }
        }
    }
}
</script>