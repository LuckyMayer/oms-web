<template>
    <input :id="id||'myFuzzySearch'" class="form-control input-sm" :placeholder="placeholder" v-model="key"/>
</template>

<script>
import api from '../common/api'
import http from '../common/http'
import deepClone from '../common/deepClone'
import autoComplete from '../common/autoComplete'

export default {
    mounted: function() {
        var _self = this;
        this.selectorID = _self.id || 'myFuzzySearch';
        this.myKeyPath=this.config.keyPath||'data.key';
        this.myResultPath=this.config.resultPath||'data';
        this.myParameter=this.parameter||{ data:{ key:'', } };
        // if(typeof(this.config.needKey)!=="undefined"){   
        //     this.myNeedKey=this.config.needKey;
        // }
        // if(!_self.myNeedKey){   //不需要关键词,如果需要关键词就在关键词(userInput)变化的时候再查询
        //     _self.getaaData();
        // } 
        Common.bindInputDownmenuClearEvent("#" + this.selectorID, 
            function() {
                return _self.choosedData;
            },
            function() {
                _self.choosedData = null;
            }
        );
        Common.bindAutoSelect("#" + this.selectorID, function() {
        	_self.searchNameList(function(){
                autoComplete({
                    inputId: "#" + _self.selectorID, 
                    suggestList: _self.nameList, 
                    searchProperty: [_self.searchfiled],
                }, function(row){
                    _self.choosedData = deepClone(row);
                });
            });
        });
    },
    data: function() {
        return {
            key: '',
            nameList: [],

            // myNeedKey:true,
            myKeyPath:'',
            myResultPath:'',
            myParameter:{},
            choosedData : null,
        }
    },
    props: [ "id","placeholder","searchfiled","listarray","config","parameter"],
    methods: {
        searchNameList(callback) {
            var _self = this;
            $("#" + this.selectorID).attr("searched", true);
            http({
                instance: _self,
                url: api[this.config.apiName],
                type: 'post',
                data:this.setValueByObjPath(this.myParameter,this.myKeyPath,this.key),
                loadingParam : {
                    target : '#' + _self.selectorID,
                    position : 'right'
                },
                success: function(res){
                    var resultList=_self.getValueByObjPath(res,_self.myResultPath);
                    _self.$set(_self,'nameList', resultList);
                    
                    if (_self.nameList.length >= 1) {
                        callback();
                    } else{
                        _self.$emit('choose', false);
                        return false;
                    }
                }
            });
        },
        getValueByObjPath(obj,path){    //根据对象属性路径得到属性名，mes：自定义出错返回结果
            var indexArray = path.split('.');
            var value = obj;
            for (var k in indexArray) {
                value = value[indexArray[k]];
                if (typeof(value) == 'undefined') {
                    console.log('下拉列表-路径错误：' + [indexArray[k]] + ' / ' + path);
                    return;
                }
                if (k == indexArray.length - 1) {
                    return value;
                }
            }
        },
        setValueByObjPath(obj,path,newValue){    //根据对象属性路径设置属性值
            var indexArray = path.split('.');
            var value = obj;
            var i;
            for(i=0;i<indexArray.length-1;i++){
                value=value[indexArray[i]];
            }
            value[indexArray[i]]=newValue;
            return obj;
        },
    },
    watch: {
        'key': function (newval) {
            var _self = this;
            _self.$emit('choose', false);
            _self.searchNameList(function(){
                autoComplete({
                    inputId: "#" + _self.selectorID, 
                    suggestList: _self.nameList, 
                    searchProperty: [_self.searchfiled],
                }, function(row){
                    _self.choosedData = deepClone(row);
                });
            });
        },
        choosedData : function() {
            this.$emit('choose', this.choosedData || false);         
        }
    }
}
</script>