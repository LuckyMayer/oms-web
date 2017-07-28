<template>
    <input :id="idname||'date'"  readonly="readonly" class="form-control input-sm date-input" :class="{miniwidth:miniwidth}" v-model="date" :placeholder="placeholder||'选择时间范围'">
</template>

<script>

export default {
	mounted: function() {
        var _self = this;
        this.idname = this.id;
        this.isneedhms = this.needhms;
        setTimeout(function(){
            _self.initDateTime();            
        },0)
    },
    data () {
        return {
            idname: "",
            startTimeData: "",
            endTimeData: "",
            isneedhms: ""
        }
    },
    computed : {
        date () { //显示的时间段
            if(this.startTime == undefined || this.endTime == undefined || this.startTime == '' || this.endTime == '' ){
                return '';
            }else{
                return this.startTime + ' - ' + this.endTime;
            }
            
        },
    },
    props: ['startTime', 'endTime','placeholder', 'id', 'needhms','miniwidth','opens'],
    methods: {
        initDateTime: function() {
            var vm = this;
            vm.idname = vm.idname || 'date';
            vm.isneedhms = vm.isneedhms == undefined ? 1 : vm.isneedhms;
            $('#' +  vm.idname).daterangepicker({
                autoUpdateInput: false,
                //自动选择日期间隔
                "ranges": {
                    '今日': [moment().startOf('days'), moment()],
                    '昨日': [moment().subtract(1, 'days').startOf('days'), moment().subtract(1, 'days').endOf('days')],
                    '最近7天': [moment().subtract(7, 'days'), moment()],
                    '最近30天': [moment().subtract(30, 'days'), moment()],
                    '本月': [moment().startOf('month'), moment().endOf('month')],
                    '上个月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                },
                //中文化
                locale: {
                    applyLabel: '确认',
                    cancelLabel: '取消',
                    fromLabel: '从',
                    toLabel: '到',
                    weekLabel: 'W',
                    customRangeLabel: '选择时间',
                    daysOfWeek:["日","一","二","三","四","五","六"],
                    monthNames: ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
                    format: 'YYYY-MM-DD HH:mm:ss',
                },
                opens : vm.opens,
                timePicker: vm.isneedhms==1 ? true : false,
                timePicker24Hour: true,
                timePickerSeconds: true,
                startDate: vm.startTime,
                endDate: vm.endTime,
            });
            
            $('#' +  vm.idname).on('apply.daterangepicker', function(ev, picker) {
                if (vm.isneedhms==1) {
                    vm.startTimeData = picker.startDate.format('YYYY-MM-DD HH:mm:ss');
                    vm.endTimeData = picker.endDate.format('YYYY-MM-DD HH:mm:ss');
                }else{
                    vm.startTimeData = picker.startDate.format('YYYY-MM-DD');
                    vm.endTimeData = picker.endDate.format('YYYY-MM-DD');              
                }
            });
            $('#' +  vm.idname).on('cancel.daterangepicker', function(ev, picker) {
                vm.startTimeData = '';
                vm.endTimeData = '';
            });
        },
        //将数据传递给父组件，这样的耦合度最低。（子组件最好不能直接影响父组件data）
        sendData () {
            var vm = this;
            vm.$emit('get_date', {
                start_time: vm.startTimeData,
                end_time: vm.endTimeData
            });
        }
    },
    watch: {
        startTimeData: {
            handler: function(val, oldVal) {
                this.sendData();
            },
            deep: true
        },
        endTimeData: {
            handler: function(val, oldVal) {
                this.sendData();
            },
            deep: true
        }
    },
}

</script>
<style scoped>
    .date-input{
        /*width: 200px;*/
    }
    .miniwidth{
        width: 265px;
    }
    
</style>