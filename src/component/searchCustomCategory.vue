<template>
    <input :id="_selfCompId" type="text" class="form-control input-sm" v-model="key" @keyup="inputOnChange" @click="click($event)" placeholder="单击、输入名称" @blur="clearData"/>
</template>

<script>
import http from '../common/http'
import api from '../common/api'

export default {
  props : ['choosed', 'id'],
  data () {
    return {
      key: '', // 搜索关键字
      categoryList: [], // 搜索商品分类列表
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
            this.$emit("selected", node.cid, this.key);
        } else {
            this.$emit("selected", undefined, undefined);
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
      return this.id || 'searchGustomCategory';
    }
  },
  methods: {
    click : function(event) {
        this.inputOnChange();
        event.stopPropagation();
    },
    inputOnChange : function() {
        let key = this.key || "";
    	if(this.preKey != key.trim()) {
            this.getGoodsCategoryList();
            this.preKey = key.trim();
        } else {
            if(this.tree) {
                this.tree.show();
            }
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
        url: api.getCustomCategoryList,
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
          _self.categoryList = res.data.content;
          let datas = _self.categoryList;
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
          if (res.data.totalCount > 0) {
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

<style>
.categoryIcon {
  margin: 0 10px 0 5px;
}
</style>