<template>
    <input type="text" class="form-control input-sm" placeholder="单击、输入名称" :id="_compId" :disabled="_disabled" v-model="value" @click="click($event)" @keyup="fetchData" />
</template>

<script>
import http from '../common/http'
import api from '../common/api'

export default {
    props : ['disabled', 'compId', 'initData'],
    data() {
    	return {
    		choosedData : null,
    		value : ""
    	}
    },
    mounted() {
    	const _self = this;
    	this.choosedData = this.initData;
    	Common.bindInputDownmenuClearEvent("#" + this._compId, 
   	        function() {
   	            return _self.choosedData;
   	        },
   	        function() {
   	            _self.choosedData = null;
   	        }
   	    );
    	Common.bindAutoSelect("#" + this._compId, function() {
    		_self.fetchData();    	
        });
    },
    computed : {
    	_compId() {
    		return this.compId || "searchGoodsTagValueInput";
    	},
    	_disabled() {
    		return this.disabled || false;
    	}
    },
    methods : {
    	click(event) {
    	    this.fetchData();
    	    event.stopPropagation();
    	},
    	fetchData() {
    		if(this.preValue == this.value.trim()) {
    			if(this.tree) {
    				this.tree.show();
    			}
    		} else {
    			this.fetchDataFromRemote();
    		}
    		this.preValue = this.value.trim();
    	},
    	
    	fetchDataFromRemote() {
    		const _self = this;
    		$("#" + this._compId).attr('searched', true);
    		http({
    	        instance: _self,
    	        url: api.getGoodsTagTree,
    	        type: 'post',
    	        loadingParam : {
    	            target : "#" + _self._compId,
    	            position: 'right'              
    	        },
    	        data: {
    	          data: {
    	            'name': _self.value
    	          }
    	        },
    	        success (res) {
    	            if(_self.tree) {
    	                _self.tree.hidden();
    	            }
    	            let datas = res.data;
    	            var adapter = function(datas, parent) {
    	                for(let i = 0; i < datas.length; i++) {
    	                    let data = datas[i];
    	                    data.isParent = data.type == 0;
    	                    data.tid = data.id;
    	                    data.parent = function() {
    	                        return parent;
    	                    }
    	                    if(data.isParent) {
    	                        data.open = true;
    	                    }
    	                    data.id = data.cid;
    	                    if(data.children) {
    	                        adapter(data.children, data);
    	                    }
    	                }
    	            }
    	            if(datas && datas.length > 0) {
    	                adapter(datas);
    	                _self.tree = new Common.TreeView({
    	                    id : _self._selfCompId + "_tree",
    	                    maxHeight : 300,
    	                    minHeight : 200,
    	                    data : datas,
    	                    target : $("#" + _self._compId),
    	                    callback : {
    	                        onClick : function(event, treeId, node) {
    	                            if(node.isParent) return;
    	                            _self.tree.hidden();
    	                            _self.choosedData = node;
    	                        }
    	                    }
    	                });
    	                _self.tree.show();
    	            }
    	        }
    	      });
    	}
    },
    watch : {
    	choosedData() { //当选择的数据发生变化
    		this.value = this.choosedData ? this.choosedData.name : "";
    		if(this.choosedData) {
    			this.$emit("selected", {
    				id : this.choosedData.tid,
    				name : this.choosedData.name
    			});
    		} else {
    			  this.$emit("selected", null);
    		}
    	}
    }
}
</script>