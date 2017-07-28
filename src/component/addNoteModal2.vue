<template>
	<div>
		<component is="overlay" v-show="showOverlay" :on-click="cancelNoteAdd"></component>
		<div class="note-add-modal" :style="style">
			<div class="note-add-content">
				<div class="col-md-12 form-horizontal">
					<div class="form-group">
						<label class="col-md-12 control-label">添加备注内容</label>
					</div>
					<div class="form-group">
						<textarea class ="form-control" :cols="cols" :rows="rows" v-model="note" v-model="note"></textarea>
					</div>
					<!-- <div class="form-group">
						<label class="col-md-2 control-label">使用颜色</label>
						<div class="col-md-4 control-label" style="text-align:left;">
							<span class="color-box" style="background-color:blue" @click="color='blue'" :class="{selected: color=='blue'}"></span>
							<span class="color-box" style="background-color:red" @click="color='red'" :class="{selected: color=='red'}"></span>
							<span class="color-box" style="background-color:grey" @click="color='grey'" :class="{selected: color=='grey'}"></span>
						</div>	
					</div> -->
				</div>
				<div class="col-md-12 form-horizontal action-buttons btns">
          			<div class="logBtn falseBtn" @click="cancelNoteAdd">取消</div>
					<div class="logBtn trueBtn" @click="handlerClick">确认</div>
				</div>
			</div>
		</div>
	</div>	
</template>

<script>
import http from '../common/http'
import api from '../common/api'
import overlay from '../component/overlay'

export default {
	data () {
		return {
			note:"",
			color:"",
		}
	},
	props: {
	    showOverlay: {
	      	type: Boolean,
	      	default: true
	    },
	    width: {
	    	type: String,
	      	default: '400px'
	    },
	    cols: {
			type: Number,
	      	default: 30
	    },
	    rows: {
	    	type: Number,
	      	default: 5
	    },
	    canEmpty:{
			type: Boolean,
	      	default: false
	    },
	},
	computed: {
	    style () {
	      	return {
		        'width': this.width,
	      	}
	    }
	},
	methods: {
        cancelNoteAdd () {
        	this.$emit('cancel', false);
        },
        handlerClick () {
        	if(!this.canEmpty&&this.note == '') {
        		layer.msg('备注内容不能为空', {
                    time: 2000
                });
        	}else{
		      	this.$emit('confirm',{
		      		'note': this.note,
		      		// 'color': this.color,
		      	});
        	}
	    }
	},
	components: {overlay}
}
</script>

<style scoped>
.note-add-modal {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;	
	background-color: #fff;
	margin: 60px auto;
	float: none;
	opacity: 1;
	padding: 20px 30px;
	overflow-y: auto;
	overflow-x: hidden;
	max-height: 90%;
	z-index: 1002;
	margin-top: 10%;
	border-radius: 2px;
}
.note-add-modal label {
	padding-left: 0px;
	padding-right: 0px;
	text-align: left;
}
.btn-cancel {
	border-color: #367fa9; 
	color: #367fa9;
}
.color-box {
	display: inline-block;
	width: 16px;
	height: 16px;
	border-radius: 1px;
	background-color: red;
	margin-left: 10px;
	cursor: pointer;
}
.selected {
	border:2px solid #ccc;
}
.btns {
	text-align: center;
}
.logBtn {
  display: inline-block;
  padding: 3px 15px;
  cursor: pointer;
  margin: 10px 0;
}
.trueBtn {
  color: #0066FF;
  border: 1px solid #0066FF;
  margin-left: 30px;
}
.falseBtn {
  color: #FF0000;
  border: 1px solid #FF0000;
}
</style>
