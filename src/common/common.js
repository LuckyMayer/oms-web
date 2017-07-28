"use strict";

var Common = {};
/*定义了一些全局参数*/
Common.currentSession = {}; //当前的回话, currentSession中包含了当前的party, 用户名称，等信息

Common.Loading = function(param) {
	param = param || {};
	this.css = param.css || {},
	this.target = $(param.target || document.body),
	this.size = param.size || 'tiny',
	this.layer = $("<table class='loading_container'><tbody><tr><td align='center'></td></tr></tbody></table>");
	this.loadingPane = $("<div><div>");
	this.loadingPane.addClass("loading_" + this.size);
	this.layer.find("td").append('<i class="fa fa-spinner fa-pulse fa-2x fa-fw" style="color:#3697DE;"></i>');
}

Common.Loading.positionSelectRight = function(target, size) {
	let offset = target.offset();
	let top = offset.top;
	let left = offset.left;
	let width = target.innerWidth();
	let height = target.innerHeight();
	let preWidth = size.width;
	let preHeight = size.height;
	return {
		top : (top + (height - preHeight) / 2) + 'px',
		left : (left + width - preWidth - 15) + 'px',
		width : preWidth,
		height : preHeight
	}
}

Common.Loading.positionLayerCenter = function(target, size) {
	return {
		top : '0px',
		left : '0px',
		width : "100%",
		height : "100%",
		bottom : "0px",
		right : "0px"
	}
}

Common.Loading.positionCenter = function(target, size) {
	let offset = target.offset();
	let top = offset.top;
	let left = offset.left;
	let width = target.innerWidth();
	let height = target.innerHeight();
	let preWidth = size.width;
	let preHeight = size.height;
	return {
		top : (top + (height - preHeight) / 2) + 'px',
		left : (left + (width - preWidth) / 2) + 'px',
		width : preWidth,
		height : preHeight
	}
}

Common.Loading.positionLeft = function(target, size) {
	let offset = target.offset();
	let top = offset.top;
	let left = offset.left;
	let width = target.innerWidth();
	let height = target.innerHeight();
	let preWidth = size.width;
	let preHeight = size.height;
	return {
		top : (top + (height - preHeight) / 2) + 'px',
		left : left + 'px',
		width : preWidth,
		height : preHeight
	}
}

Common.Loading.positionRight = function(target, size) {
	let offset = target.offset();
	let top = offset.top;
	let left = offset.left;
	let width = target.innerWidth();
	let height = target.innerHeight();
	let preWidth = size.width;
	let preHeight = size.height;
	return {
		top : (top + (height - preHeight) / 2) + 'px',
		left : (left + width - preWidth) + 'px',
		width : preWidth,
		height : preHeight
	}
}

Common.Loading.positionTop = function(target, size) {
	let offset = target.offset();
	let top = offset.top;
	let left = offset.left;
	let height = target.innerHeight();
	let preWidth = size.width;
	let preHeight = size.height;
	return {
		top : top + "px",
		left : (left + (width - preWidth) / 2) + 'px',
		width : preWidth,
		height : preHeight
	}
}

Common.Loading.positionBottom = function(target, size) {
	let offset = target.offset();
	let top = offset.top;
	let left = offset.left;
	let width = target.innerWidth();
	let height = target.innerHeight();
	let preWidth = size.width;
	let preHeight = size.height;
	return {
		top : (top + height - preHeight) + 'px',
		left : (left + (width - preWidth) / 2) + 'px',
		width : preWidth,
		height : preHeight
	}
}



Common.Loading.size = {
    tiny : {
    	width:16,
    	height:16
    },
    small : {
    	width:32,
    	height:32
    },
    large : {
    	width:128,
    	height:128
    }
}

Common.Loading.prototype = {
	
	show : function(css) {
		let cssFn = null;
		if(typeof css === 'string') {
			if(css == 'left') {
				cssFn = Common.Loading.positionLeft;
			} else if(css == 'right') {
				cssFn = Common.Loading.positionRight;
			} else if(css == 'top') {
				cssFn = Common.Loading.positionTop;
			} else if(css == 'bottom') {
				cssFn = Common.Loading.positionBottom;
			} else {
				cssFn = Common.Loading.positionLayerCenter;
			}
		} else {
			cssFn = css || Common.Loading.positionLayerCenter;
		}
		const layer = this.layer;
		const pos = cssFn.call(this, this.target, Common.Loading.size[this.size]);
		layer.css(pos);
		layer.appendTo($(document.body));
	},
	
	hidden : function() {
		this.layer.remove();
	}
}

Common.TreeView = function(param) {
	param = param || {};
	this.param = param;
	this.target = $(param.target || document.body);
	this.width = param.width;
	this.height = param.height;
	this.maxHeight = param.maxHeight || 300;
	this.minHeight = param.minHeight || 200;
	this.view = $("<div style='overflow: auto;background:#FFFFFF;position:absolute;border:1px solid #DDDDDD'></div>");
	var othis = this;
	this.autoHiddenFn = function() {
		othis.hidden();
	}
}

Common.TreeView.downPosition = function(target) {
	let offset = target.offset();
	let top = offset.top;
	let left = offset.left;
	let width = target.innerWidth();
	let height = target.outerHeight();
	return {
		top : top + height,
		left : left,
		width : width,
		height : this.height,
		maxHeight : this.maxHeight,
		minHeight : this.minHeight
	}
}

Common.TreeView.prototype.show = function(position) {
	if(this.showed) return;
	this.showed = true;
	this.treeView = $("<ul class='ztree' id='" + this.param.id + "'>");
	this.treeView.appendTo(this.view);
	this.autoHidden = this.param.autoHidden == false ? false : true;
	this.view.click("focus", function(event) {
		event.stopPropagation();
	});
	var treeObj = $.fn.zTree.init(this.treeView, {
		async : this.param.async,
		callback : this.param.callback,
		check : this.param.check,
		data : this.param.keyMap,
		edit : this.param.edit,
		view : this.param.view
	}, this.param.data);
	this.funcs = {};
	for(let funcName in treeObj) {
		var func = treeObj[funcName];
		if(!func) continue;
		this.funcs[funcName] = func;
		if(func instanceof Function) {
			this[funcName] = function() {
				alert(funcName);
			}
		}
	}
	let positionFn = null;
	if(position == 'bottom') {
		positionFn = Common.TreeView.downPosition;
	} else {
		positionFn = position || Common.TreeView.downPosition;
	}
	var pos = positionFn.call(this, this.target);
	this.view.css(pos);
	this.view.appendTo($(document.body));
	if(this.autoHidden) {
		$(document.body).bind("click", this.autoHiddenFn);
	}
},

Common.TreeView.prototype.hidden = function() {
	this.showed = false;
	this.treeView.remove();
	this.view.remove();
	if(this.autoHidden) {
		$(document.body).unbind("click", this.autoHiddenFn);
	}
}

/**
 * 假如已经选中了某个值:
 * 1. 聚焦时，全选所有
 * 3. 键入任何值时，都会删除所选的值
 * 假如没有选中某个值，点击删除按钮时，正常删除内容
 */
Common.bindInputDownmenuClearEvent = function(input, checkChoosedFn, clearFn) {
	input = $(input);
	input.bind("click", function() {
		if(checkChoosedFn.call(this)) { //假如已经选中了
			input.select(); //选中所有的内容
		}
	});
	input.bind("focus", function() {
		if(checkChoosedFn.call(this)) { //假如已经选中了
			input.select(); //选中所有的内容
		}
	});
	input.bind("keydown", function(event) {
		if(Common.isInputChangeKeyCode(event.keyCode)) {
			if(checkChoosedFn.call(this)) { //已经选中了
				clearFn.call(this); //则清除已经选中的内容
				input.val(""); //并且内容设为空
			}
		}
	});
}

Common.bindAutoSelect = function(input, showFn) {
	var input = $(input);
	input.bind("keydown", function(event) {
		if(input.attr('searched')) return;
		if(event.keyCode == 40) { //向下箭头或者回车键
			showFn();  //展现
		}
	});
}

Common.isInputChangeKeyCode = function(keyCode) {
	console.log(keyCode + " type:" + (typeof keyCode));
	return keyCode == 8 ||  // back space
	       keyCode == 46 ||   //delete按钮
	       keyCode == 32 ||   //空格
	       (keyCode >= 186 && keyCode <= 222) || //？等按钮
	       (keyCode >= 65 && keyCode <= 89) || //字母
	       (keyCode >= 48 && keyCode <= 57); //数字
}