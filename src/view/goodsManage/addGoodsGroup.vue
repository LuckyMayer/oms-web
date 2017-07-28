<template>
<div class="content-wrapper">
<section class="content-header">
    <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-desktop"></i>商品管理</a></li>
        <li class="active">套餐列表</li>
        <li class="active">新建套餐</li>
    </ol>
</section>
<!-- Main content -->
<section class="content" style="background-color:#FFFFFF;margin-top:12px;overflow:auto;">
<div class="row">
    <div class="col-md-12">
        套餐名称:
        <input type="text" placeholder="请输入套餐名称" style="width:600px" v-model="newTC.name">
        <div style="margin-top:20px;padding-top:5px;border-top:1px solid #A8A8A8;">
            <div class="tcMessagea">
                <b> 基本信息</b>
            </div>
            <div class="tcMessage">套餐总价：{{formatPrice(newTC.price)}}
            </div>
            <div class="tcMessage">拆分套餐：
                <input class="hand" type="radio" id="notAllowSplit" value="false" v-model="newTC.allowSplit">
                <label for="notAllowSplit">不允许</label>
                <input class="hand" type="radio" id="allowSplit" value="true" v-model="newTC.allowSplit">
                <label for="allowSplit">允许</label>
            </div>
             <div class="tcMessage">分摊类型：
                <input class="hand" type="radio" id="fix" value="FIX_PRICE" v-model="newTC.distributeType">
                <label class="hand" for="fix">按固定售价</label>
                <input class="hand" type="radio" id="rate" value="RATE_PRICE" v-model="newTC.distributeType">
                <label class="hand" for="rate">按比例分摊</label>
            </div>
           <div class="tcMessagea">
                <b> 商品信息</b>
            </div>
            <button class="btn btn-sm btn-primary" style="margin-top:20px;margin-bottom:20px" @click="showModel=true">添加商品</button>
            <table class="table" style="background-color:#F8F8F8;">
                <thead>
                    <tr>
                        <th>商品名称</th><!-- 
                        <th>商品简称</th> -->
                        <th>规格码</th>
                        <th>规格名称</th>
                        <th>商家编码</th>
                        <th>商品条码</th>
                        <th>类型</th>
                        <th>数量</th>
                        <th>固定售价</th>
                        <th>金额占比</th>
                        <th>操作</th> 
                    </tr>
                </thead>
                <tbody>
                    <tr style="text-align:center;vertical-align: middle;" v-show="showModel"><!--用于添加或编辑套餐商品-->
                        <td>
                            <fuzzy-search id='chooseSearchGoods' placeholder='商品名称模糊搜索' :searchfiled="'skuName'" :config="{'apiName':'searchSkuNameList','resultPath':'data.content'}" @choose="chooseSearchGoods"> </fuzzy-search>
                        </td>
                        <td v-text='addGoods.style_code'></td>
                        <td v-text='addGoods.style_name'></td>
                        <td class="addBorder" v-text='addGoods.shop_code'></td>
                        <td v-text='addGoods.goods_code'></td>
                        <td>
                            <select v-model="addGoods.type" @change="updatePrice(-1)">
                                <option v-for="(item,index) in goodsTypeArray" :value="index">{{item}}</option>
                            </select>
                        </td>
                        <td style="border-top : 1px solid blue"><input style="width:50px" type="number" min="1" v-model="addGoods.number"></td>
                        <td>
                            <input v-show="addGoods.type=='GOODS'" @input="checkValue(-1)" style="width:60px" type="text" v-model="addGoods.price">
                        </td>
                        <td style="white-space:nowrap;">
                            <input v-show="addGoods.type=='GOODS'" style="width:40px" type="text" v-model="addGoods.rate">%
                        </td>
                        <td><label @click="saveGoods" class="labelButton">保存</label>
                            <label @click="cancelGoods" class="labelButton">取消</label>
                        </td>
                    </tr>
                    <template v-for='(item, index) in goodsList'>
                    <tr>
                        <td v-text='item.goods_name'></td><!-- 
                        <td v-text='item.goods_short_name'></td> -->
                        <td>{{item.style_name}}</td>
                        <td>{{item.style_code}}</td>
                        <td v-text='item.shop_code'></td><!---->
                        <td v-text='item.goods_code'></td>
                        
                        <td>
                    <select class="form-control select-sm" @change="updatePrice(index)" style="width:65px" :disabled="!item.isEdit" v-model="item.type"> 
                        <option v-for="(item,index) in goodsTypeArray" :value="index">{{item}}</option>
                    </select>
                        </td>
                        <td><input type="number" min="1" class="input-sm form-control" style="width:50px" :readonly="!item.isEdit" :class="{'not-editable': !item.isEdit}"  v-model="item.number">
                        </td>
                        <td><input v-show="item.type=='GOODS'" type="text" @input="checkValue(index)" class="input-sm form-control" style="width:50px" :readonly="!item.isEdit" :class="{'not-editable': !item.isEdit}" v-model="item.price">
                        </td>
                        <td><input v-show="item.type=='GOODS'" type="text" class="input-sm form-control" style="width:50px" :readonly="!item.isEdit" :class="{'not-editable': !item.isEdit}" v-model="item.rate"></td>
                        <td>
                            <a v-show="!item.isEdit" @click="item.isEdit=true"><i class="iconfont">&#xe622;</i></a>
                            <a v-show="item.isEdit" @click="confirmEditGoods(index)"><i class="iconfont confirm-icon">&#xe626;</i></a>  
                            <a v-show="item.isEdit" @click="cancellEditGoods(index)"><i class="iconfont cancel-icon">&#xe7ca;</i></a>      
                            <a @click="delGoods(index)"><i class="iconfont delete-icon" >&#xe613;</i></a>               
                            
                        </td>
                    </tr>
                </tbody>
            </table>
            <button class="btn btn-sm btn-primary" :disabled="newTC.name==''"  @click="addNewTC">创建套餐</button>
        </div>
        <!--查询条件结束-->
    </div>
    </section>
</div>
</template>mdcmd

<script>
import initStyle from '../../common/initStyle'
import http from '../../common/http'
import api from '../../common/api'
import deepClone from '../../common/deepClone'
import searchSkuName from '../../component/searchSkuName'
import fuzzySearch from '../../component/fuzzySearch'

var _self = {};
export default {
    components: {
        searchSkuName,
        fuzzySearch,
    },
    mounted () {
        _self = this;
        this.$nextTick(() => {
            initStyle();
        });
    },
    data () {
        return {
            addGoods: {       //用于记录套餐中要增加的或要修改的商品信息
                goods_name: '',
                shop_code: '',
                goods_code: '',
                style_name:'',
                style_code:'',
                type:'GOODS',
                skuId:'',
                number:'1',
                price:'',
                rate:'',
                isEdit:false,
            },
            copyGoodsList:[],
            goodsList:[],       //保存套餐的sku列表，用于显示
            showModel:false,    //是否显示商品编辑框
            newTC:{             //保存新建套餐的信息，用于提交
                name:'',
                distributeType:'FIX_PRICE',
                allowSplit:false,
                price:'',
                details:[]
            },
            goodsTypeArray: {  
                GOODS: '商品',
                GIFT: '赠品',
            }, 
        }
               
    },
    updated : function () {     //在vue变化时计算套餐总价,只有增加,删除,或修改商品时才会影响套餐总价
        const list=_self.goodsList;
        var total=0;    
        for(let i=0;i<list.length;i++){
            total=total+parseFloat(list[i].price)*parseInt(list[i].number);
        }
        _self.newTC.price= total.toFixed(2);
    },
    methods: {
        updatePrice(index){
            if(index==-1&&_self.addGoods.type=='GIFT'){
                _self.addGoods.price=0;
            }else if(_self.goodsList[index].type=='GIFT'){
                _self.goodsList[index].price=0;
            }
        },
        chooseSearchGoods(result){
            if(result){
                this.addGoods.goods_name=result.skuName;
                this.addGoods.shop_code=result.barcode;
                this.addGoods.goods_code=result.skuCode;
                this.addGoods.style_name=this.getStyleNameFromSku(result);
                this.addGoods.style_code=this.getStyleValueFromSku(result);  
                this.addGoods.skuId=result.skuId;  
            }else{
                this.clearAddGoods();
            }
        },
        formatPrice(price){    return '￥'+(price ? parseFloat(price).toFixed(2) : '');    },
        getStyleNameFromSku(sku){       //获得sku规格名
            var styleName='';
            try{
                if(sku.styleValue1.hasOwnProperty("styleType")){
                    styleName=sku.styleValue1.styleType.name;
                }
                if(sku.styleValue2.hasOwnProperty("styleType")){
                    styleName=styleName+'-'+sku.styleValue2.styleType.name;
                }
                if(sku.styleValue3.hasOwnProperty("styleType")){
                    styleName=styleName+'-'+sku.styleValue3.styleType.name;
                }
            }catch(e){}finally{
                return styleName;
            }
        },
        getStyleValueFromSku(sku){      //获得sku规格名
            var styleValue='';
            try{
                if(sku.styleValue1.hasOwnProperty("value")){
                    styleValue=sku.styleValue1.value+' ';
                }
                if(sku.styleValue2.hasOwnProperty("value")){
                    styleValue+=sku.styleValue2.value+' ';
                }
                if(sku.styleValue3.hasOwnProperty("value")){
                    styleValue+=sku.styleValue3.value+' ';
                }
            }catch(e){}finally{
                return styleValue;
            }
        },
        hasSkuId(skuId,skuList){    //可用于判断插入列表是否有skuId
            for(let i=0;i<skuList.length;i++){
                if(skuList[i].skuId==skuId){     
                    return true;    //有skuId
                }
            }
            return false;   //没有skuId
        },
        saveGoods(){        //更新或新建商品
            if(_self.addGoods.skuId!=''){
                if(_self.hasSkuId(_self.addGoods.skuId,_self.goodsList)){    //插入列表中或套餐原来有sku
                    layer.msg('已经添加了，请勿重复添加！', {time: 2000});
                    return ;
                }
                _self.goodsList.push(deepClone(_self.addGoods));    //将新建的商品类添加到套餐商品显示列表中
                _self.copyGoodsList.push(deepClone(_self.addGoods)); 
                _self.showModel=false;  //隐藏商品编辑框
            }else{
                 layer.msg('请先输入要增加的商品信息', {time: 2000});
            }
            _self.clearAddGoods();
        },
        cancelGoods(){                      //取消增加商品
            this.clearAddGoods();
            this.showModel=false;           //隐藏商品编辑框
        },
        ////////
        delGoods(index){                    //删除套餐中商品
            var layerIndex = layer.confirm('您确定删除吗?', {
                btn: ['是','否'],
                title: false,
                shadeClose: true,
                closeBtn: 0
            }, () => {
                _self.goodsList.splice(index, 1);              //从显示列表中删除
                _self.copyGoodsList.splice(index, 1);              //从显示列表中删除
                layer.close(layerIndex);
            });
        },
        cancellEditGoods(index){                   //编辑商品
            _self.$set(_self.goodsList,index,deepClone(_self.copyGoodsList[index]));
            _self.goodsList[index]['isEdit']=false;
        },
        confirmEditGoods(index){                   //编辑商品
            _self.$set(_self.copyGoodsList,index,deepClone(_self.goodsList[index]));
            _self.goodsList[index]['isEdit']=false;
        },
        clearAddGoods(){                    //清空要增加的商品------------------？？？？待修改
            this.addGoods.skuId='';
            this.addGoods.goods_name='';
            this.addGoods.shop_code='';
            this.addGoods.goods_code='';
            this.addGoods.style_name='';
            this.addGoods.style_code='';
            this.addGoods.number='1';
            this.addGoods.price='';
            this.addGoods.rate='';
        },
        setSubmitGoods(){        //根据显示列表构造要提交的数据
            _self.newTC.details=[];
            for(let i=0;i<_self.goodsList.length;i++){
                _self.newTC.details.push({
                    number:_self.goodsList[i].number,
                    price:_self.goodsList[i].price,
                    skuId:_self.goodsList[i].skuId,
                    rate:_self.goodsList[i].rate,         
                    status:'NORMAL',
                    type:_self.goodsList[i].type, 
                });
            }
        },
        addNewTC(){             //更新套餐，将要提交数据
            if(_self.goodsList.length==0){
                layer.msg("请添加套餐商品！", {time: 2000});
                return ;
            }
            _self.setSubmitGoods();     //设置要提交的sku
            http({                      //根据id获取套餐详情
                instance: _self,
                url: api.addTC,
                type: 'post',
                data:{"data":_self.newTC,},
                success (res) {
                    if(res.msg=='success'){     //如果添加成功，跳转至详情页
                        _self.$router.push({name: 'goodsGroupDetail', params: { tc_id: res.data.goodsGroupId}});
                    }else{
                        layer.msg("添加失败！", {time: 2000});
                    }
                }
            });
        },
        checkValue(index){   //应收金额只能是正整数，一位小数，两位小数
            var v=(index==-1)?_self.addGoods.price:_self.goodsList[index].price;
            v = v.replace(/[^\d.]/g,"");                //清除"数字"和"."以外的字符 
            v = v.replace(/^\./g,"");                   //验证第一个字符是数字而不是逗号 
            v = v.replace(".","$#$").replace(/\./g,"").replace("$#$","."); //只能输入一个逗号
            v = v.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数  
            (index==-1)?_self.addGoods.price=v:_self.goodsList[index].price=v;
        },
    }
}

</script>
<style scoped>
    .hand,.iconfont{cursor: pointer;} 
    .label{font-weight:600;}
    .tcMessage{
        height: 25px;
        margin-left:10px;
        padding: 5px;
        margin: 5px;
    }
    .tcMessagea{
        border-left:4px solid #367FA9;
        margin-top:6px;
        padding-left:5px;
    }
    .table>tbody>tr>td {
        font-size: 13px;
        padding: 5px;
        vertical-align: middle;    
        text-align: center;    
    }

    .not-editable {
        border:0 solid #d2d6de;            
        background:#F8F8F8;
    }
</style>