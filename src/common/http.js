import {deleteCookie} from './cookie'

export default (params) => {
	const regionSubCode = {
		"session-expired" : 1,
		"user-error-unlogin" : 1,
		"session-not-exists" : 1,
		"session-invalid" : 1
	}
	
    if (!params.instance) {
        console.warn("请传入vue实例");
        return;
    }
    if (!params.url) {
        console.warn("请传入请求地址");
        return;
    }

    const instance = params.instance,
        url = params.url,
        type = (params.type == undefined) ? "get" : params.type,
        data = (params.data == undefined) ? '' : JSON.stringify(params.data),
        dataType = (params.dataType == undefined) ? 'json' : params.dataType,
        contentType = (params.contentType == undefined) ? 'application/json' : params.contentType,
        loadingParam = params.loadingParam || {},
        hasLoading = params.hasLoading || params.loadingParam,
        loadingTarget = loadingParam.target,
        timeout = params.timeout || 60000,
        async = (params.async == undefined) ? true : params.async;
    if (hasLoading) {
        var loading = new Common.Loading(loadingParam);
        loading.show(loadingParam.position);
    }
    $.ajax({
        type: type,
        url: url,
        data: data,
        dataType: dataType,
        contentType: contentType,
        async:async, 
        success (res) {
            if (hasLoading) {
                loading.hidden();
            }

            if (res.code==200) {
                if (params.success) {
                    params.success(res);
                }
            } else {
                if (regionSubCode[res.subCode]) {
                	 deleteCookie(() => {
                         instance.$router.push({
                             name: 'login'
                         });
                     });
                } else {
                    if (params.fail) {
                        params.fail(res);
                    } else {
                        layer.msg(res.subMsg, {
                            time: 2000
                        });
                    }
                }
            }
        },
        error (res) {
            if (hasLoading) {
                loading.hidden();
            }

            layer.msg("接口请求失败", {
                time: 1200
            }, () => {
                if (params.error) {
                    params.error();
                }
            });
        },
        timeout: timeout
    });
}