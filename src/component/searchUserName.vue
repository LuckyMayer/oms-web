<template>
    <input :id="id||'searchUserName'" class="form-control input-sm" :placeholder="placeholder" v-model="key"/>
</template>

<script>
import api from '../common/api'
import http from '../common/http'
import deepClone from '../common/deepClone'
import autoComplete from '../common/autoComplete'

export default {
    mounted: function() {
        var _self = this;
        this.selectorID = _self.id || 'searchUserName';
    },
    data: function() {
    	return {
    		key: '',
    		userNameList: []
    	}
    },
    props: ['id','placeholder'],
    methods: {
    	searchUserNameList: function(callback) {
            var _self = this;
            http({
                instance: _self,
                url: api.searchUserNameList,
                type: 'post',
                data: {
                	data: {
                        'key': _self.key
                    }
                },
                loadingParam : {
                    target : '#' + _self.selectorID,
                    position : 'right'
                },
                success: function(data){
                	_self.$set(_self,'userNameList', data.data);
                    
                    if (_self.userNameList.length >= 1) {
                       	callback();
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

	        _self.searchUserNameList(function(){
	            autoComplete({
	                inputId: "#" + _self.selectorID, 
	                suggestList: _self.userNameList, 
	                searchProperty: ['name']
	            }, function(row){
	                _self.$emit('selected', deepClone(row));
	            });
	        });
        }
    }
}
</script>