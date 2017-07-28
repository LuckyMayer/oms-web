<template>
    <div>
        <div class="col-md-5 text-center clearfix">
            <div class="pull-left">
                <select v-model="lengthCurrent" class="form-control input-sm" @change="pageSizeChanged">
                    <option v-for='item in pageList' :value="item" v-text='item'></option>
                </select>
            </div>
            
            <div class="pull-left" style="margin:8px 0 0 10px;">
                <span>共<strong v-text='totalCount' class="text-light-blue"></strong>条记录</span>&nbsp;|&nbsp;
                <span>共<strong v-text='totalPage' class="text-light-blue"></strong>页</span>&nbsp;|&nbsp;
                <span>当前位于第<strong v-text='currentPage' class="text-light-blue"></strong>页</span>

            </div>
        </div>
        <div class="col-md-5 no-padding">
            <div class="pull-right">
                <button class="btn btn-sm btn-default" :disabled="hasPrev==false" @click="firstPage">第一页</button>
                <button class="btn btn-sm btn-default" :disabled="hasPrev==false" @click="prePage"><i class="fa fa-chevron-left"></i> 上一页</button>
                <button class="btn btn-sm btn-default" :disabled="hasNext==false" @click="nextPage">下一页 <i class="fa fa-chevron-right"></i></button>  
                <button class="btn btn-sm btn-default" :disabled="hasNext==false" @click="lastPage">最后一页</button> 
                到第
                <input type="text" style="width:30px;" id="to-page">
                页
                <button class="btn btn-sm btn-default"  @click="toPage">确定</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["offset", "length", "totalCount"],

    data: function() {
        return {
            pageList: [5,10,20,50],

            offsetCurrent: '',
            lengthCurrent: '',
        }
    },
    mounted () {
        this.offsetCurrent = this.offset;
        this.lengthCurrent = this.length; 
    },

    computed: {
        totalPage () {
            return Math.ceil(this.totalCount/this.length);
        },
        currentPage () {
            return (this.offset/this.length)+1;
        },
        hasPrev () {
            return (this.currentPage>1)?true:false;
        },
        hasNext () {
            return (this.currentPage<this.totalPage)?true:false;
        }
    },
    methods: {
        firstPage (){
            this.offsetCurrent = 0;
            this.$emit('paginate', {
                offset: this.offsetCurrent,
                length: this.lengthCurrent
            });
        },
        lastPage (){
            this.offsetCurrent = (this.totalPage-1)*this.length;
            this.$emit('paginate', {
                offset: this.offsetCurrent,
                length: this.lengthCurrent
            });
        },
        prePage (){
            this.offsetCurrent -= this.length;
            this.$emit('paginate', {
                offset: this.offsetCurrent,
                length: this.lengthCurrent
            });
        },
        nextPage (){
            this.offsetCurrent += this.length;
            this.$emit('paginate', {
                offset: this.offsetCurrent,
                length: this.lengthCurrent
            });
        },
        toPage () {
            var toPage = $("#to-page").val();
            if(toPage < 0 || toPage > this.totalPage || !toPage.match(/^\d$/)) {
                layer.msg('输入数字非法', {timeout:2000});
                return false;
            }
            this.offsetCurrent = toPage;
            this.$emit('paginate', {
                offset: this.offsetCurrent,
                length: this.lengthCurrent
            });
        },
        pageSizeChanged (){
            this.offsetCurrent = 0;
            this.$emit('paginate', {
                offset: this.offsetCurrent,
                length: this.lengthCurrent
            });
        }
    },
    watch: {
        offset: function(val) {
            this.offsetCurrent = val;
        }
    }
}
</script>