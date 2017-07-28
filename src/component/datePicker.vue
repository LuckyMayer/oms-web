<template>
    <input :id="id|| 'datepicker'" style="background-color: transparent" :placeholder="placehold||'请选择时间'" class="form-control input-sm" v-model="dateTime" :disabled="disabled" @click="initDate">
</template>

<script>
export default {
    props: ['id', 'initDateTime', 'format' , 'placehold', 'disabled', 'needTime','needhms'],
   
    mounted () {
    	this.$nextTick(() => {
            this.componentId = this.id || 'datepicker';

            this.dateTime = (this.initDateTime != undefined)? this.initDateTime:'';
        });
    },
    data () {
        return {
            dateTime: '',
            componentId: ''
        }
    },
    methods: {
        initDate () {
            const _self = this;
            
            const dateTime = {
                elem: '#' + _self.componentId,
                format: _self.format || 'YYYY-MM-DD hh:mm:ss',
                min: '2000-01-01', //设定最小日期为当前日期
                max: '2100-01-01', //最大日期
                istoday: false,
                isclear: false, //是否显示清空
                choose: function(data) {
                    _self.chooseDate(data);
                }
            };
            if(_self.needhms){  //是否需要选择时分秒
                dateTime['istime']=true;
            }

            //laydate.skin('molv');
            laydate(dateTime);
            /*
            $('#' + this.componentId).daterangepicker({
            	    autoApply : true,
			        singleDatePicker: true,
			        showDropdowns: true,
			        timePicker: this.needTime,
	                timePicker24Hour: true,
	                timePickerSeconds: this.needTime,
	                startDate: this.dateTime,
			        locale: {
	                    applyLabel: '确认',
	                    cancelLabel: '清空',
	                    fromLabel: '从',
	                    toLabel: '到',
	                    weekLabel: 'W',
	                    customRangeLabel: '选择时间',
	                    daysOfWeek:["日","一","二","三","四","五","六"],
	                    monthNames: ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
	                    format: 'YYYY-MM-DD',
	                },
		        },
		        function(start, end, label) {
		            var years = moment().diff(start, 'years');
		            alert("You are " + years + " years old.");
		        }
            );
            */
        },

        chooseDate (data) {
            this.dateTime = data;

            this.$emit("choose", {
                componentId: this.componentId,
                data: this.dateTime
            });
        }
    },
    watch: {
        initDateTime () {
            this.dateTime = (this.initDateTime != undefined)? this.initDateTime:'';
        },

        dateTime (newVal) {
            this.$emit("choose", {
                componentId: this.componentId,
                data: newVal.trim()
            });
        }
    }
}
</script>