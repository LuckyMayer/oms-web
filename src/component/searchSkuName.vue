<template>
    <div id="searchSkuName" @mouseleave="showDivList=false" @mousemove="showDiv" >
        <input type="text" id="goodsCodeInput" v-model="goodsCode" placeholder="模糊搜索" class="form-control input-sm">
         <div id="goodsList" v-show="showDivList" align="left" style="min-width:150px;background-color:white;white-space:nowrap;border:1px solid #C0C0C0;font-size:10px;position:absolute;z-index:999">
            <template v-for='(item, index) in idNameList'>
                <li @click="getSelectedSku(item.skuId,item.skuName)">{{item.skuName}}</li>
            </template>
        </div> 
    </div>
</template>
<style type="text/css">
#searchSkuName li:hover{cursor: pointer;background:#C0C0C0;color:blue;}
#searchSkuName li{     
    list-style-type:none;
}
</style>
<script>
import http from '../common/http'
import api from '../common/api'
import {setCookie, getCookie} from '../common/cookie'

export default {
  
    data () {
        return {
            resultList: [],     //搜索的结果列表
            idNameList: [],     //用于显示的下拉列表数据skuId,skuName
            goodsCode: '',       //要搜索的goodsCode
            showDivList:false,
        }
    },
    methods: {
        setIdNameList(data){            //获得要显示的sku下拉列表数据
            const _self = this;
            _self.idNameList.splice(0,_self.idNameList.length);
            for(let i=0;i<data.length;i++){
                _self.idNameList.push({skuId:data[i].skuId,skuName:data[i].skuName});
            }
        },
        showDiv(){                      //显示sku下拉列表
            var input = document.getElementById("goodsCodeInput");  
            $("#goodsList").css({"left":input.offsetLeft,'min-width':input.offsetWidth+'px' });
            if(this.idNameList.length>0){       //下拉列表有数据才显示
                this.showDivList=true;
            }
        },
        getSelectedSku(skuId,name){     //返回选择的sku
            const _self = this;
            for(let i=0;i<_self.resultList.length;i++){
                if(_self.resultList[i].skuId==skuId){
                    _self.$emit('choose', {
                        data: _self.resultList[i]
                    });
                    break;
                }
            }
            this.showDivList=false;
        },
    },
    watch: {
        goodsCode (newVal) {        //如果输入变化则查询数据库
            const _self = this;
            _self.$emit('change');      //触发改变事件，将addGoods清空
            if(_self.goodsCode!=''){
                http({
                    instance: _self,
                    url: api.getSkuList,
                    type: 'post',
                    data: {
                        "data": {   "code":_self.goodsCode,"partyId":getCookie('partyId')   }
                    },
                    success (res) {
                        if(res.data.length>0){      //如果查询到sku
                            _self.resultList=res.data;          //保存查询结果
                            _self.setIdNameList(res.data);      //获得下拉列表数据
                            _self.showDiv();                    //显示下拉列表
                        }else{
                            console.log("没有查到数据");
                        }
                    }
                });
            }
        }
    }
}
</script>