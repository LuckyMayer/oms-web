<template>
  <input :id="_selfCompId" type="text" class="form-control input-sm" v-model="key" @keyup="inputOnChange" @click="click($event)" placeholder="单击、输入名称"/>
</template>

<script>
import http from '../common/http'
import api from '../common/api'

export default {
  props : ['choosed'],
  data () {
    return {
      key: '', // 搜索关键字
      tagList: [], // 搜索商品分类列表
      choosedData : null
    }
  },
  mounted () {
    const _self = this;
    Common.bindInputDownmenuClearEvent("#" + this._selfCompId, 
        function() {
            return _self.choosedData;
        },
        function() {
            _self.choosedData = null;
        }
    );
    Common.bindAutoSelect("#" + this._selfCompId, function() {
		_self.getTagList();    	
    });
  },
  computed: {
    _selfCompId () {
      return this.compId || 'searchTagName';
    }
  },
  // watch : {
  //     choosedData() {
  //         if(this.choosedData) {
  //             let node = this.choosedData;
  //             let key = node.name;
  //             let parent = node.parent && node.parent();
  //             while(parent) {
  //                 if(parent.name) {
  //                     key = parent.name + "->" + key;
  //                 }
  //                 parent = parent.parent && parent.parent();
  //             }
  //             this.key = key;
  //             this.$emit("selected", node.cid, this.key);
  //         } else {
  //             this.$emit("selected", undefined, undefined);
  //         }
  //     },
  //     choosed() {
  //         if(!this.initChoosed) {
  //             this.choosedData = this.choosed;
  //             this.initChoosed = true;
  //         }
  //     }
  // },
  methods: {
    click (event) {
      this.inputOnChange();
      event.stopPropagation();
    },
    inputOnChange () {
      if(this.preKey != this.key.trim()) {
        this.getTagList();
        this.preKey = this.key.trim();
      } else {
        if(this.tree) {
          this.tree.show();
        }
      }
    },
    getTagList () {
      const _self = this;
      $("#" + this._selfCompId).attr('searched', true);
      http({
        instance: _self,
        url: api.getGoodsTagNameList,
        type: 'post',
        loadingParam : {
            target : "#" + _self._selfCompId,
            position: 'right'              
        },
        data: {
          data: {
            'key': _self.key
          }
        },
        success (res) {
          if(_self.tree) {
            _self.tree.hidden();
          }
          _self.tagList = res.data;
          let datas = _self.tagList;
          var adapter = function(datas, parent) {
            for(let i = 0; i < datas.length; i++) {
              let data = datas[i];
              data.isParent = true;
              data.open = true;
              if (data.values) {
                for (let j = 0; j < data.values.length; j++) {
                  data.values[j].isParent = false;
                  data.values[j].leaf = true;
                  data.values[j].open = true;
                  data.values[j].name = data.values[j].value;
                }
              }
            }
          }
          if (_self.tagList.length > 0) {
            adapter(datas);
            console.log(datas);
            _self.tree = new Common.TreeView({
              id : _self._selfCompId + "_tree",
              maxHeight : 500,
              minHeight : 200,
              data : datas,
              target : $("#" + _self._selfCompId),
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
  }
}
</script>











<!-- <template>
	<input :id="_selfCompId" type="text" class="form-control input-sm" :placeholder="_selfPlaceholder" v-model="key" :disabled="_selfDisabled" @dblclick="fetchGoodsList" />
</template>

<script>
import http from '../common/http'
import api from '../common/api'

import autocomplete from '../common/autoComplete'

export default {
	props: ['compId', 'placeholder', 'disabled', 'choosed'],
	data () {
        return {
        	key: '', // 搜索关键字
            goodsTagList: [], // 搜索商品标签列表
            choosedData : null
        }
    },
    mounted() {
      this.choosedData = this.choosed;
      const _self = this;
      Common.bindInputDownmenuClearEvent("#" + this._selfCompId, 
        function() {
            return _self.choosedData;
        },
        function() {
            _self.choosedData = null;
        }
      );
    },
    computed: {
    	_selfCompId () {
    		return this.compId || 'searchGoodsTagName';
    	},
        _selfPlaceholder () {
            return this.placeholder ||'搜索标签名称';
        },
        _selfDisabled () {
            return this.disabled || false;
        }
    },
    methods: {
        fetchGoodsList () {
        	const _self = this;

            http({
                instance: _self,
                url: api.getGoodsTagNameList,
                type: 'post',
                loadingParam : {
                    target : "#" + _self._selfCompId,
                    position: 'right'              
                },
                data: {
                    data: {
                        'key': _self.key
                    }
                },
                success (res) {
                    _self.goodsTagList = res.data;
                    if (_self.goodsTagList.length > 0) {
                        $("#"+_self._selfCompId).trigger("autocomplete").trigger("focus").trigger("showSelect");
                         _self.initAutocomplete("#" + _self._selfCompId, _self.goodsTagList, ['name']);
                    }
                }
            });
        },
        initAutocomplete (inputId, suggestList, searchProperty) {
        	const _self = this;

        	autocomplete({
        		inputId: inputId,
        		suggestList: suggestList,
        		searchProperty: searchProperty
        	}, (data) => {
        	    _self.choosedData = data;
        	});
        }
    },
    watch: {
    	key (newVal) {
    		if (newVal.trim()) {
    			this.fetchGoodsList();
    		}
    	},
    	choosedData() {
    	   if(this.choosedData) {
    	       this.$emit("selected", this.choosedData);
    	   } else {
    	       this.$emit("selected", {});
    	   }
    	},
    	choosed() {
    	   if(!this.initChoosed) {
                this.choosedData = this.choosed;
                this.initChoosed = true;
            }
    	}
    }
}
</script> -->