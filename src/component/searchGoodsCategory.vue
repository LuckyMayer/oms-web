<template>
  <!-- <input :id="_selfCompId" type="text" class="form-control input-sm" :placeholder="_selfPlaceholder" v-model="key" :disabled="_selfDisabled"/> -->
  <div>
    <input :id="_selfCompId" type="text" class="form-control input-sm" v-model="key" placeholder="输入名称模糊搜索" @blur="clearData" @keyup="inputOnChange"/>
  </div>
</template>

<script>
import http from '../common/http'
import api from '../common/api'
// import autoComplete from '../common/autoComplete'
// import deepClone from '../common/deepClone'

export default {
  props : ['choosed'],
  data () {
    return {
      categoryList: [], // 搜索商品分类列表
      preKey : '',
      key : '',
      choosedData : null
    }
  },
  mounted () {
    this.choosedData = this.choosed;
    const _self = this;
    Common.bindInputDownmenuClearEvent("#" + this._selfCompId, 
        function() {
            return _self.choosedData;
        },
        function() {
            _self.choosedData = null;
            _self.$emit("selected", undefined);
        }
      );
    Common.bindAutoSelect("#" + this._selfCompId, function() {
    	_self.getGoodsCategoryList();
    });
  },
  watch : {
    choosedData() {
        if(this.choosedData) {
            let node = this.choosedData;
            let key = node.name;
            let parent = node.parent && node.parent();
            while(parent) {
                if(parent.name) {
                    key = parent.name + "->" + key;
                }
                parent = parent.parent && parent.parent();
            }
            this.key = key;
            this.$emit("selected", node.cid);
        } else {
            this.$emit("selected", undefined);
        }
    },
    choosed() {
        if(!this.initChoosed) {
            this.choosedData = this.choosed;
            this.initChoosed = true;
        }
    }
  },
  computed: {
    _selfCompId () {
      return this.compId || 'searchGoodsCategory';
    }
  },
  methods: {
    inputOnChange : function() {
        if(!this.key.trim()) {
            if(this.tree) {
               this.tree.hidden(); 
            }
            this.preKey = this.key.trim();
            return;
        }
        if(this.preKey != this.key.trim()) {
            this.getGoodsCategoryList();
            this.preKey = this.key.trim();
        }
    },
    clearData () {
      const _self = this;
      if (!_self.key) {
        _self.$emit('selected', _self.key);
      }
    },
    getGoodsCategoryList () {
      const _self = this;
      $("#" + this._selfCompId).attr("searched", true);
      http({
        instance: _self,
        url: api.getGoodsCategoryList,
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
            let datas = res.data;
            var adapter = function(datas, parent) {
                for(let i = 0; i < datas.length; i++) {
                    let data = datas[i];
                    data.isParent = !data.leaf || (data.children && data.children.length > 0);
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

<style>
.categoryList {
  max-height: 500px; 
  overflow: scroll;
}
.categoryItem_yjlu {
  margin: 0 0 15px 0;
}
.categoryUl_yjlu {
  display: inline-block;
  vertical-align: middle;
}
.categoryLi_yjlu {
  cursor: pointer;
}
.categoryIcon {
  margin: 0 10px 0 5px;
  color: #ccc;
}
</style>