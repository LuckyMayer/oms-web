export default function(paramsObj, callback) {
    /**
     * [paramsObj 对象字面量必填参数说明]
     * {
     *     inputId: @type[string], 要自动补全的输入框id,
     *     suggestList: @type[Array], 推荐列表,
     *     searchProperty: @type[Array], 搜索字段范围
     * }
     */
	var inputId = (typeof paramsObj.inputId == undefined)? '':paramsObj.inputId,
		suggestList = (typeof paramsObj.suggestList == undefined)? []:paramsObj.suggestList,
		searchProperty = (typeof paramsObj.searchProperty == undefined)? '':paramsObj.searchProperty;
    $(inputId).autocomplete(suggestList, {
        minChars: 0,
        max: 100,
        matchContains: true,
        autoFill: false,
        autoFocus: true,
        // 搜索字段
        formatItem: function(row, i, max) {
            var result = '';
            for(let i=0;i<searchProperty.length;i++){
                result += row[searchProperty[i]];
                if(i<searchProperty.length-1){
                    result += ' | ';
                }
            }
            return result ;
        },
        // input 框内显示的格式
        formatResult: function(row) {
            var result = '';
            for(let i=0;i<searchProperty.length;i++){
                result += row[searchProperty[i]];
                if(i<searchProperty.length-1){
                    result += ' | ';
                }
            }
            return result ;
        }
    }).result(function(event, row, formatted) {
        callback(row);
    });
    $(inputId).showSelect();
}

(function($) {
	$.fn.extend({
		myAutoComplete : function(params) {
		}
	});
})(jQuery)