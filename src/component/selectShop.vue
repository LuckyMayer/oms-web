<template>
	<select class="form-control input-sm" :disabled="_selfDisabled" v-model="selectedShop" @change="selectShop">
		<option value="">{{_selfPlaceholder}}</option>
		<option v-for="item in ShopList" :value="item.shopId" >{{item.shopName}}</option>
	</select>
</template>

<script>
import http from '../common/http'
import api from '../common/api'

export default {
    mounted () {
        this.fetchShopList();
    },
	props: ['partyId', 'placeholder', 'disabled', 'seller', 'defaultShopId', 'containsDeleted','defaultShopName'],
	data () {
        return {
            ShopList: [],
            selectedShop: '',
        }
    },
    computed: {
        _selfPlaceholder () {
            return this.placeholder ||'=== 请选择店铺 ===';
        },
        _selfDisabled () {
            return this.disabled || false;
        }
    },
    methods: {
        fetchShopList () {
            const _self = this;
            http({
                instance: _self,
                url: api.getShopList,
                data: {
                    data:{
                        "partyId":_self.partyId,
                        "containsDeleted": _self.containsDeleted == undefined ? true : _self.containsDeleted
                    },
                },
                type: 'post',
                hasLoading: false,
                success (res) {
                    _self.ShopList = res.data;
                    if(_self.defaultShopId != undefined && _self.defaultShopId != ''){
                        var isExist = false;
                        _self.ShopList.forEach((fshop) => {
                            if(fshop.shopId == _self.defaultShopId){
                                isExist = true;
                                _self.selectedShop = fshop.shopId;
                                _self.$emit('selected', {
                                    data: fshop
                                });
                                return false;
                            }
                        });
                        if(!isExist && _self.defaultShopName != undefined) {
                            _self.ShopList.push({'shopId': _self.defaultShopId, 'shopName': _self.defaultShopName});
                        }
                    }else if(_self.seller != '' && _self.seller != undefined){
                        _self.ShopList.forEach((fshop) => {
                            if(fshop.shopNick == _self.seller){
                                _self.selectedShop = fshop.shopId;
                                _self.$emit('selected', {
                                    data: fshop
                                });
                                return false;
                            }
                        })
                    }else{
                        _self.selectedShop = '';
                    }
                }
            });
        },
        selectShop () {
            if(this.selectedShop != undefined) {
                var found = false;
                this.ShopList.forEach((fshop) => {
                    if(fshop.shopId == this.selectedShop){
                        this.$emit('selected', {
                            data: fshop
                        });
                        found = true;
                        return false;
                    }
                });
                if(!found) {
                    this.$emit('selected', {});
                }
            }
        	
        }
    },
    watch: {
        seller: function() {
            this.fetchShopList();
            if(this.seller != undefined && this.seller != ''){
                this.ShopList.forEach((fshop) => {
                    if(fshop.shopNick == this.seller){
                        this.selectedShop = fshop.shopId;
                        this.$emit('selected', {
                            data: fshop
                        });
                        return false;
                    }
                })
            }
        },
        defaultShopId: function() {
            if(this.defaultShopId != undefined){
                this.selectedShop = this.defaultShopId;
                if(this.defaultShopName != undefined) {
                    var isExist = false;
                    this.ShopList.forEach((fshop) => {
                        if(fshop.shopId == this.defaultShopId){
                            isExist = true;
                            this.selectedShop = fshop.shopId;
                            this.$emit('selected', {
                                data: fshop
                            });
                            return false;
                        }
                    });
                    if(!isExist) {
                        this.ShopList.push({'shopId': this.defaultShopId, 'shopName': this.defaultShopName});
                    }
                } 
            }
        }
    }
}
</script>