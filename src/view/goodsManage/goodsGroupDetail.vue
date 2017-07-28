<template>
<div class="content-wrapper">
<section class="content-header">
    <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-desktop"></i> 套餐管理</a></li>
        <li class="active">套餐列表</li>
        <li class="active">套餐详情</li>
    </ol>
</section>
<!-- Main content -->
<section class="content" style="background-color:#FFFFFF;margin-top: 12px;overflow:auto;">
<div class="row">
    <div class="col-md-12">
        套餐名称:
        <input type="text" style="width:600px" v-model="tc_detail.goodsGroupName">
        <span style="margin-left:1%;color:red" v-show="tc_detail.status=='DELETED'" >已停用</span>
        <button v-show="tc_detail.status=='NORMAL'" style="float:right;margin-bottom:4px" class="btn btn-sm btn-danger" @click="changeStatus(true,tc_detail.goodsGroupId)">停 用</button>
        <button v-show="tc_detail.status=='DELETED'"  style="float:right;margin-bottom:4px" class="btn btn-sm btn-primary" @click="changeStatus(false,tc_detail.goodsGroupId)">启 用</button>
        <div style="margin-top:20px;padding-top:5px;border-top:1px solid #A8A8A8;">
            <div class="tcMessagea">
                <b> 基本信息</b>
            </div>
            <div class="tcMessage">商家编码：{{tc_detail.goodsGroupCode}}</div>
            <div class="tcMessage">套餐总价：{{formatPrice(tc_detail.goodsGroupPrice)}}</div>
            <div class="tcMessage">拆分套餐：
                <input class="hand" type="radio" id="notAllowSplit" value="false" v-model="tc_detail.allowSplit">
                <label for="notAllowSplit">不允许</label>
                <input class="hand" type="radio" id="allowSplit" value="true" v-model="tc_detail.allowSplit">
                <label for="allowSplit">允许</label>
            </div>
             <div class="tcMessage">分摊类型：
                <input class="hand" type="radio" id="fix" value="FIX_PRICE" v-model="tc_detail.priceDistribyteType">
                <label class="hand" for="fix">按固定售价</label>
                <input class="hand" type="radio" id="rate" value="RATE_PRICE" v-model="tc_detail.priceDistribyteType">
                <label class="hand" for="rate">按比例分摊</label>
            </div>
            <div class="tcMessagea">
                <b> 商品信息：</b>
            </div>
            <button class="btn btn-sm btn-primary" style="margin-top:12px;margin-bottom:5px" @click="showModel=true">添加商品</button>
            <div class="box box-default">
            <div class="box-body">
            <table class="table" style="background-color:#F8F8F8;">
                <thead>
                    <tr>
                        <th>商品名称</th>
                        <th>规格码</th>
                        <th>规格名称</th>
                        <th>商家编码</th>
                        <th>商品条码</th>
                        <th>类型</th>
                        <th>数量</th>
                        <th>固定售价</th>
                        <th>金额占比(%)</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="text-align:center;background:#EFF8FF" v-show="showModel"><!--用于添加或编辑套餐商品-->
                        <td>
                            <fuzzy-search id='chooseSearchGoods' placeholder='商品名称模糊搜索' :searchfiled="'skuName'" :config="{'apiName':'searchSkuNameList','resultPath':'data.content'}" @choose="chooseSearchGoods"> </fuzzy-search>
                        </td>
                        <td>{{newGoods.style_code}}</td>
                        <td>{{newGoods.style_name}}</td>
                        <td>{{newGoods.skuCode}}</td>
                        <td>{{newGoods.barcode}}</td>
                        <td><select v-model="newGoods.type" @change="updatePrice(-1)">
                                <option v-for="(item,index) in goodsTypeArray" :value="index">{{item}}</option>
                            </select>
                        </td>
                        <td><input style="width:50px" type="number" min="1" v-model="newGoods.number"></td>
                        <td><input v-show="newGoods.type=='GOODS'" @input="checkValue(-1)" style="width:60px" type="text" v-model="newGoods.price"></td>
                        <td style="white-space:nowrap;"><input v-show="newGoods.type=='GOODS'" style="width:40px" type="text" v-model="newGoods.rate">%</td>
                        <td style="white-space:nowrap;"><label @click="saveGoods" class="labelButton">保存</label>
                            <label @click="cancelGoods" class="labelButton">取消</label>
                        </td>
                    </tr>
                    <template v-for='(item, index) in goodsList'>
                    <tr style="text-align:center;">
                        <td style="border-top : 1px solid blue" v-text='item.skuName'></td>
                        <td>{{item.style_code}}</td>
                        <td>{{item.style_name}}</td>
                        <td>{{item.skuCode}}</td>
                        <td>{{item.barcod}}</td>
                        <td>
                    <select class="form-control select-sm" style="width:65px" @change="updatePrice(index)" :disabled="!item.isEdit" v-model="item.type"> 
                        <option v-for="(item,index) in goodsTypeArray" :value="index">{{item}}</option>
                    </select>
                        </td>
                        <td><input type="number" min="1" class="input-sm form-control" style="width:50px" :readonly="!item.isEdit" :class="{'not-editable': !item.isEdit}"  v-model="item.number">
                        </td>
                        <td><input v-show="item.type=='GOODS'" type="text" class="input-sm form-control" style="width:50px" :readonly="!item.isEdit" :class="{'not-editable': !item.isEdit}" @input="checkValue(index)" v-model="item.price">
                        </td>
                        <td><input v-show="item.type=='GOODS'" type="text" class="input-sm form-control" style="width:50px" :readonly="!item.isEdit" :class="{'not-editable': !item.isEdit}" v-model="item.rate">
                        </td>
                        <td style="white-space:nowrap;">
                        <a v-show="!item.isEdit" @click="item.isEdit=true"><i class="iconfont">&#xe622;</i></a>
                        <a v-show="item.isEdit" @click="item.isEdit=false"><i class="iconfont confirm-icon">&#xe626;</i></a>  
                        <a @click="delGoods(index)"><i class="iconfont delete-icon" >&#xe613;</i></a>  
                        </td>
                    </tr>
                </tbody>
            </table>
            </div>
            </div>
            <button class="btn btn-sm btn-primary" @click="updateTC">更新套餐</button>
        </div>
        <!--查询条件结束-->
    </div>
    </section>
</div>
</template>

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
        this.getTCDetail(this.$route.params.tc_id);
    },
    data () {
        return {
            newGoods:{
                skuId:'',   
                skuName:'',     //商品名称
                style_code:'',  //规格码
                style_name:'',  //规格名称
                skuCode:'',     //商家编码 
                barcode:'',     //商品条码 
                type:'GOODS',   //类型 
                number:'1',      //数量 
                price:'',       //固定售价 
                rate:'',        //金额占比 
                isEdit:false,   //是否处于编辑状态
            },
            goodsList:[],       //保存套餐的商品信息（用于显示）
            tc_detail:[],       //套餐详情
            showModel:false,    //是否显示商品编辑框
            submitData:{
                id:'',
                distributeType:'FIX_PRICE',     
                allowSplit:false,
                name:'',
                price:'',
                updatedDetails:[],
                insertDetails:[],
                deletedDetailIds:[]
            },
            goodsTypeArray: {  
                GOODS: '商品',
                GIFT: '赠品',
            }, 
        }
               
    },
    updated : function () {     //在vue变化时计算套餐总价,只有增加,删除,或修改商品时才会影响套餐总价
        var total=0;    
        _self.goodsList.forEach(function (item) {
            total=total+parseFloat(item.price)*parseInt(item.number);
        });
        _self.tc_detail.goodsGroupPrice= total.toFixed(2);
        _self.submitData.price=total.toFixed(2);
    },
    methods: {
////获得页面需要显示的内容--begin
        getTCDetail(id){ //根据id获取套餐详情
            http({              
                instance: _self,
                url: api.getTCDetail,
                type: 'post',
                data:{ "data": { "id":id,  }   },
                success (res) {
                    _self.tc_detail=res.data;
                    _self.setGoodsList();
                }
            });
        },
        setGoodsList(){//给套餐详情goodsList赋值
            _self.goodsList=[];
            _self.tc_detail.details.forEach(function (item) {
                _self.goodsList.push({
                    skuId:item.sku.skuId,   
                    skuName:item.sku.skuName, 
                    style_code:_self.getValueByPath(item,'sku.styleValue1.styleType.name')+'-'+
                               _self.getValueByPath(item,'sku.styleValue2.styleType.name')+'-'+
                               _self.getValueByPath(item,'sku.styleValue3.styleType.name'),
                    style_name:_self.getValueByPath(item,'sku.styleValue1.value')+'-'+
                               _self.getValueByPath(item,'sku.styleValue2.value')+'-'+
                               _self.getValueByPath(item,'sku.styleValue3.value'),
                    skuCode:item.sku.skuCode,
                    barcode:item.sku.barcode,
                    type:item.type,
                    number:item.number,
                    price:item.price,
                    rate:item.rate,
                    isEdit:false,   //是否处于编辑状态
                });                           
            });
        },
        formatPrice(price){    return '￥'+parseFloat(price).toFixed(2);    },
////获得页面需要显示的内容--end
////给套餐增加商品--begin
        chooseSearchGoods(result){  //选择要增加的商品
            if(result){
                _self.newGoods.skuId=result.skuId;
                _self.newGoods.skuName=result.skuName;
                // _self.newGoods.style_code:'',  //规格码     查询sku的接口并未赋值
                // _self.newGoods.style_name:'',  //规格名称
                _self.newGoods.skuCode=result.skuCode;
                _self.newGoods.barcode=result.barcode;
            }else{
                this.clearNewGoods();
            }
        },
        updatePrice(index){  //如果商品被设置为赠品，则价格为零
            if(index==-1 && _self.newGoods.type=='GIFT'){
                _self.newGoods.price=0;
            }else if(_self.goodsList[index].type=='GIFT'){
                _self.goodsList[index].price=0;
            }
        },
        hasSkuId(skuId,skuList){  //判断goodsList列表是否有skuId--禁止重复添加
            for(let i=0;i<skuList.length;i++){
                if(skuList[i].skuId==skuId){     
                    return true;    //有skuId
                }
            }
            return false;   //没有skuId
        },
        saveGoods(){ //将要添加的商品增加到goodsList中
            if(_self.newGoods.skuId!=''){
                if(_self.hasSkuId(_self.newGoods.skuId,_self.goodsList)){    //插入列表中或套餐原来有sku
                    layer.msg("已经添加了，请勿重复添加！", {time: 2000});
                    return ;
                }
                _self.goodsList.push(deepClone(_self.newGoods));    //将新建的商品类添加到套餐商品显示列表中
                _self.showModel=false;  //隐藏商品编辑框
            }else{
                layer.msg("请先输入要增加的商品信息！", {time: 2000});
            }
            _self.clearNewGoods();
        },
        clearNewGoods(){  //清空要增加的商品
            _self.newGoods.skuId='';
            _self.newGoods.skuName='';
            _self.newGoods.style_code='';
            _self.newGoods.style_name='';
            _self.newGoods.skuCode='';           //商品条码
            _self.newGoods.barcode='';  
            _self.newGoods.type='GOODS';  
            _self.newGoods.number='1';
            _self.newGoods.price='';
            _self.newGoods.rate='';
        },
        cancelGoods(){  //取消增加商品
            this.clearNewGoods();
            this.showModel=false;           //隐藏商品编辑框
        },
////给套餐增加商品--end  
        delGoods(index){                    //删除套餐中商品
            if(_self.goodsList.length==1){
                layer.msg("请勿将套餐的所有商品都删除！", {time: 2000});
                return ;
            }
            var layerIndex = layer.confirm('您确定删除吗?', {
                btn: ['是','否'],
                title: false,
                shadeClose: true,
                closeBtn: 0
            }, () => {
                _self.goodsList.splice(index, 1);   
                layer.close(layerIndex);
            });
        },
        changeStatus (type,tcId) {          //停用或启用
            var url=api.enableTC;
            if(type){
                url=api.disableTC;
            }
            http({
                instance: _self,
                url: url,
                type: 'post',
                data: {
                    "data":{   "id":tcId    }
                },
                success (res) {
                    _self.tc_detail.status=res.data.status;
                }
            });
        },
        updateTC(){             //更新套餐，将要提交数据
            _self.submitData.id=_self.tc_detail.goodsGroupId;
            _self.submitData.name=_self.tc_detail.goodsGroupName;
            _self.submitData.distributeType=_self.tc_detail.priceDistribyteType;
            _self.submitData.allowSplit=_self.tc_detail.allowSplit;
            var oldList=new Array();
            var newList=new Array();
            _self.tc_detail.details.forEach(function (item) { 
                oldList.push({
                    number:item.number,
                    price:item.price,
                    skuId:item.sku.skuId,
                    rate:item.rate,         
                    status:'NORMAL',
                    type:item.type, 
                });
            });
            _self.goodsList.forEach(function (item) { 
                newList.push({
                    number:item.number,
                    price:item.price,
                    skuId:item.skuId,
                    rate:item.rate,         
                    status:'NORMAL',
                    type:item.type, 
                });
            });
            var arrayChanges=_self.getArrayChanges(oldList,newList,'skuId');
            _self.submitData.updatedDetails=arrayChanges.update;
            _self.submitData.insertDetails=arrayChanges.insert;
            _self.submitData.deletedDetailIds=arrayChanges.delete;
            //return ;
            http({                  //根据id获取套餐详情
                instance: _self,
                url: api.modifyTC,
                type: 'post',
                data:{"data":_self.submitData,},
                success (res) {
                    if(res.msg=='success'){
                        layer.msg("更新成功！", {time: 2000});
                        _self.getTCDetail(res.data.goodsGroupId);
                    }else{
                        layer.msg("更新失败！", {time: 2000});
                    }
                }
            });
        },
        getArrayChanges(oldList,newList,key){
            var arrayChanges={
                insert:[],
                update:[],
                delete:[],
            };
            arrayChanges.insert=newList; 
            for(var i=0;i<oldList.length;i++){
                var index=_self.inArray(newList,key,oldList[i][key]);
                if(index>-1){         
                    if(!_self.isObjectValueEqual(newList[index],oldList[i])){    
                        arrayChanges.update.push(newList[index]);  
                    }
                    var indexa=_self.inArray(arrayChanges.insert,key,oldList[i][key]);  
                    arrayChanges.insert.splice(indexa, 1);        
                }else{        
                    arrayChanges.delete.push(oldList[i][key]);
                }
            }
            return arrayChanges;
        },
        isObjectValueEqual(obja, objb ,strict) {
          var aProps = Object.getOwnPropertyNames(obja);
          var bProps = Object.getOwnPropertyNames(objb);
          if (aProps.length != bProps.length) {
              return false;
          }
          for (var i = 0; i < aProps.length; i++) {
              var propName = aProps[i];
              if(strict){
                if (obja[propName] !== objb[propName]) {
                  return false;
                }
              }else{
                if (obja[propName] != objb[propName]) {
                  return false;
                }
              }
          }
          return true;
        },
        inArray(array,index,value){   
            for(let i=0;i<array.length;i++){
                if(array[i][index]==value){
                    return i;
                }
            }
            return -1;
        },
        getValueByPath(obj,path){
          var indexArray=path.split('.'); 
          var value=obj;
          for(var k in indexArray){
            value=value[indexArray[k]];
            if(typeof(value)=='undefined'){
              console.log('套餐-getValueByPath函数-路径错误：'+[indexArray[k]]+' / '+path);
              return '-';
            }
            if(k==indexArray.length-1){
              return value;
            }
          }
        },
        checkValue(index){   //应收金额只能是正整数，一位小数，两位小数
            var v=(index==-1)?_self.newGoods.price:_self.goodsList[index].price;
            v = v.replace(/[^\d.]/g,"");                //清除"数字"和"."以外的字符 
            v = v.replace(/^\./g,"");                   //验证第一个字符是数字而不是逗号 
            v = v.replace(".","$#$").replace(/\./g,"").replace("$#$","."); //只能输入一个逗号
            v = v.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数  
            (index==-1)?_self.newGoods.price=v:_self.goodsList[index].price=v;
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
    }

    .not-editable {
        border:0 solid #d2d6de;      
        background:#F8F8F8;
    }
</style>