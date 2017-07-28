<template>
<div class="content-wrapper">
<section class="content-header clearfix">
    <ol class="breadcrumb col-md-6">
        <li><a href="#"><i class="fa fa-desktop"></i> 商品管理</a></li>
        <li class="active">套餐列表</li>
    </ol>
    <div class="col-md-6" style="text-align: right; position: relative; top: 10px;">    
        <button class="btn btn-sm btn-primary" @click="gotoNewPage"><i class="fa fa-plus"></i>新建套餐</button>
    </div>
</section>
<!-- Main content -->
<section class="content mySection">

    <div class="row form-horizontal searchContent">
        <div class="form-group">
            <div class="col-sm-3">
                <label class="control-label col-sm-4">套餐名称：</label>
                <div class="col-sm-8">
                  <input class="form-control input-sm" type="text" v-model="searchFormData.name">
                </div>
            </div>
            <div class="col-sm-3">
                <label class="control-label col-sm-4">包含单品：</label>
                <div class="col-sm-8">
                    <fuzzy-search ref="childAddGoods" id='chooseSearchGoods' placeholder='商品名称模糊搜索' :searchfiled="'skuName'" :config="{'apiName':'searchSkuNameList','resultPath':'data.content'}" @choose="chooseSearchGoods" > </fuzzy-search>
                </div>
            </div>
            <div class="col-sm-3">
                <label class="control-label col-sm-4">商家编码:</label>
                <div class="col-sm-8">
                    <input class="form-control input-sm" type="text" v-model="searchFormData.skuCode">
                </div>
            </div>
            <div class="col-sm-3" style="margin-left:-34px">
                <label class="control-label col-sm-4">状态</label>
                <div class="col-sm-8">
                  <select class="form-control select-sm" v-model="searchFormData.status">
                    <option value="">--所有状态--</option>
                    <option value="NORMAL">使用中</option>
                    <option value="DELETED">已停用</option>
                  </select>
               </div>
            </div>
        </div>
        <div class="form-group" style="text-align:right">
            <button class="btn btn-sm btn-primary" @click="getTableList(true)"> <i class="fa fa-search"></i> 查询</button>
            <button class="btn btn-sm btn-default" style="margin-right:33px;" @click="exportAll"><i class="fa fa-download"></i>全部导出</button>
        </div>
            <div class="box-body table-responsive">
                <table class="table">
                    <thead>
                        <tr style="text-align:center;valign:middle">
                            <th>套餐名称</th>
                            <th>套餐编码</th>
                            <th>套餐总价</th>
                            <th class="nowrap">分摊类型</th>
                            <th>允许拆分</th>
                            <th>状态</th>
                            <th colspan="2">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if='GoodsGroup.length==0'>
                            <td colspan="100"><h4 class='text-center text-gray'>什么也没有...</h4></td>
                        </tr>
                        <template v-for='(item, index) in GoodsGroup'>
                        <tr :class="{'deleteStyle':item.status == 'DELETED'}">
                            <td v-text='item.goodsGroupName'></td>
                            <td v-text='item.goodsGroupCode'></td>
                            <td>{{formatPrice(item.goodsGroupPrice)}}</td>
                            <td v-text='priceDistribyteType[item.priceDistribyteType]'></td>
                            <td align="center"><template v-if="(item.allowSplit)">是</template> <template v-else>否</template> </td>
                            <td><template v-if="(item.status=='NORMAL')">使用中</template> 
                                <template v-else><font color='red'>已停用</font></template> </td>
                            <td>
                            <label v-show="!item.showChild" style="color:#00CCFF;cursor: pointer;" class="nowrap" @click="showDetail(index,item.goodsGroupId)">展开<i class="fa fa-chevron-down"></i></label>
                            <label v-show="item.showChild" style="color:#00CCFF;cursor: pointer;" class="nowrap" @click="item.showChild=false">收起<i class="fa fa-chevron-down"></i></label>
                            </td>
                            <td>
                            <a style="color:#00CCFF;" :href="'#/index/goodsManage/goodsGroupDetail/'+item.goodsGroupId"><i class="fa fa-pencil fa-fw"></i>编辑</a>
                            </td>
                        </tr>
                        <tr v-show="item.showChild" style="background-color:#EFF8FF;">
                            <td colspan="8" style="padding:1px"><table width="100%" style="border: 1px solid #F8F8F8;">
                                    <thead>
                                        <tr class="trHeight" >
                                            <th>包含商品</th>
                                            <th>商品名称</th>
                                            <th>类型</th>
                                            <th>商家编码</th>
                                            <th>规格名称</th>
                                            <th>规格码</th>
                                            <th>数量</th>
                                            <th>固定售价</th>
                                            <th>金额占比</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <!--套餐详情，商品列表-->
                                        <tr class="trHeight" v-for='(goods, index) in item.details'>
                                            <td class="tCenter">商品{{index+1}}</td>
                                            <td class="tCenter" v-text='goods.sku.skuName'></td>
                                            <td class="tCenter">
                                                <label v-show="goods.type=='GOODS'">商品</label>
                                                <label v-show="goods.type=='GIFT'">赠品</label>
                                            </td>
                                            <td class="tCenter" v-text='goods.sku.skuCode'></td>
                                            <td class="tCenter">{{getStyleNameFromSku(goods.sku)}}</td>
                                            <td class="tCenter">{{getStyleValueFromSku(goods.sku)}}</td>
                                            <td class="tCenter" v-text='goods.number'></td>
                                            <td class="tCenter">{{formatPrice(goods.price)}}</td>
                                            <td class="tCenter">{{goods.rate}}%</td>
                                        </tr>
                                    </tbody>
                                </table></td>
                        </tr>
                        </template>
                    </tbody>
                </table>
            </div>
            <div class="box-footer clearfix">
                <div class="col-md-2 no-padding"></div>
                <pagination :offset="searchFormData.offset" :length="searchFormData.length" :total-count="pageData.totalCount" @paginate="paginate"></pagination>
            </div>
    </section>
</div>
</template>

<script>
import initStyle from '../../common/initStyle'
import pagination from '../../component/pagination'
import http from '../../common/http'
import api from '../../common/api'
import fuzzySearch from '../../component/fuzzySearch'
var _self = {};
export default {
    components: {
        pagination,
        fuzzySearch,
    },
    mounted () {
        _self = this;
        this.$nextTick(() => { 
            initStyle(); 
        });
        _self.getTableList(false);
    },
    data () {
        return {
            searchFormData: {       //
                name: '',
                skuId: '',
                skuCode:'',
                status:'',

                offset: 0,
                length: 20,   
            },
            pageData: {
                totalCount: '',
            },
            GoodsGroup: [],     //套餐列表
            priceDistribyteType: {
                FIX_PRICE: '固定价格',
                RATE_PRICE: '比例分摊'
            },
        }
    },
    methods: {
        getTableList(type){
            if(type){
                _self.searchFormData.offset=0;
            }
            http({
                instance: _self,
                url: api.getGoodsGroupList,
                type: 'post',
                data: {
                    "data": _self.searchFormData
                },
                success (res) {
                    _self.GoodsGroup=res.data.content;
                    _self.pageData.totalCount=res.data.totalCount;
                    _self.GoodsGroup.forEach(function (item) {
                        _self.$set(item, 'showChild', false);
                    });
                    if(res.data.totalCount==0){
                        layer.msg("<span style='color:red'>好像没有查到数据 !</span>", {icon: 5});
                    }
                }
            });
        },
        chooseSearchGoods(res){     //选择商品名称
            if(res){
                _self.searchFormData.skuId=res.skuId;
            }else{
                _self.searchFormData.skuId='';
            } 
        },
        formatPrice(price){    return '￥'+parseFloat(price).toFixed(2);    },
        paginate (data) {
            this.searchFormData.offset = data.offset;
            this.searchFormData.length = data.length;
            this.getTableList(false);
        },
        showDetail(detailIndex,tc_id){
            if(_self.GoodsGroup[detailIndex].details.length<1){     //如果没有查询过就查询
                http({                  //根据id获取套餐详情
                    instance: _self,
                    url: api.getTCDetail,
                    type: 'post',
                    data:{ "data": { "id":tc_id,  }   },
                    success (res) {
                        _self.GoodsGroup[detailIndex].details=res.data.details;
                        _self.GoodsGroup[detailIndex].showChild=true;
                    }
                });
            }else{
                _self.GoodsGroup[detailIndex].showChild=true;
            }
        },
        exportAll(){
            layer.msg("导出功能尚未实现！", {time: 2000});
        },
        gotoDetail(tc_id){        //进入详情页并传递参数
            this.$router.push({name: 'goodsGroupDetail', params: { tc_id: tc_id}});
        },
        gotoNewPage(tc_id){        //进入新建套餐页面
            this.$router.push({name: 'addGoodsGroup'});
        },
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
                    styleValue=styleValue+sku.styleValue1.value+' ';
                }
                if(sku.styleValue2.hasOwnProperty("value")){
                    styleValue=styleValue+sku.styleValue2.value+' ';
                }
                if(sku.styleValue3.hasOwnProperty("value")){
                    styleValue=styleValue+sku.styleValue3.value+' ';
                }
            }catch(e){}finally{
                return styleValue;
            }
        }
    }
}
</script>
<style scoped>
th{ text-align: center;  }
.nowrap{white-space:nowrap;}
.tCenter{text-align: center;}
.trHeight{height:30px;text-align: center;}
.mySection{
    margin:15px;
    background:#ffffff;
}
.col-sm-3,.col-sm-4,.col-sm-8 {
    padding-right: 0px;
}
.deleteStyle{
   color:#A6A6A6; 
}
.table>tbody>tr>td,.table>thead>tr>th {
    vertical-align: middle;    
    text-align: center;    
}
</style>