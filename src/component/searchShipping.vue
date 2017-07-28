<template>
    <input :id="id||'searchShipping'" class="form-control input-sm" :placeholder="placeholder" v-model="key" @dblclick="searchShippingList"/>
</template>

<script>
import api from '../common/api'
import http from '../common/http'
import deepClone from '../common/deepClone'
import autoComplete from '../common/autoComplete'

export default {
    mounted: function() {
        var _self = this;
        this.selectorID = _self.id || 'searchShipping';
        Common.bindInputDownmenuClearEvent("#" + this.selectorID, 
            function() {
                return _self.choosedData;
            },
            function() {
            	_self.choosedData = null;
            }
        );
        Common.bindAutoSelect("#" + this.selectorID, function() {
    		_self.searchShippingList();    	
        });
    },
    data: function() {
    	return {
    		key: '',
    		shippingList: [],
            count: 0,
            choosedData : null
    	}
    },
    computed: {
        _selfContainsDeleted () {
            return this.containsDeleted == undefined ? true : this.containsDeleted;
        }
    },
    props: ['id','placeholder','defaultShipping', 'containsDeleted'],
    methods: {
    	searchShippingList: function() {
            var _self = this;
            $("#" + this.selectorID).attr('searched', true);
            http({
                instance: _self,
                url: api.getShipingList,
                type: 'post',
                data: {
                	data: {
                        'key': _self.key,
                        'containsDeleted': _self._selfContainsDeleted,
                    }
                },
                loadingParam : {
                    target : '#' + _self.selectorID,
                    position : 'right'
                },
                hasLoading: false,
                success: function(data){
                	_self.$set(_self,'shippingList', data.data);
                    
                    if (_self.shippingList.length >= 1) {
                       	autoComplete({
                            inputId: "#" + _self.selectorID, 
                            suggestList: _self.shippingList, 
                            searchProperty: ['shippingName']
                        }, function(row){
                            _self.choosedData = deepClone(row);
                        });
                    } else{
                        _self.$emit('selected', {});
                        return false;
                    }
                }
            });
    	}
    },
    watch: {
        'key': function (newval) {
            var _self = this;
            if(_self.defaultShipping == undefined || _self.defaultShipping == {} || _self.count > 0){
                var selectorID = _self.id || 'searchShipping';
                _self.searchShippingList();
            }
            _self.count++;
        },
        
        choosedData : function() {
       		this.$emit('selected', this.choosedData || {});
        },
        
        defaultShipping: function(val){
            var _self = this;
            if(val != undefined && val != '' && !$.isEmptyObject(val)){
                _self.key = val.shippingName;
                _self.choosedData = val;
            }else if(val == '' || $.isEmptyObject(val)) {
                $("#" + _self.selectorID).val('');
            }
        }
    }
}
</script>