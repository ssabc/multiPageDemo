
    const MENULIST = [
        { title: "概述", href: 'index'},
        // { title: "ChangeLog", href: 'ChangeLog' },
        // { title: "名词解释", href: '名词解释' },
        { title: "数据源管理", href: 'dataSrc' },
        {
            title: "新增API", spread: true, 
            children: [{
                title: "生成API", href: 'addApi/generator/index', spread: true, 
                children: [
                    { title: "基础配置", href: 'addApi/generator/base' },
                    { title: "自定义SQL配置参数", href: 'addApi/generator/code' },
                    { title: "在线测试", href: 'addApi/generator/check' },
                ]
            },{
                title: "注册API", href: 'addApi/register/index', spread: true, 
                children: [
                    { title: "基础配置", href: 'addApi/register/base' },
                    { title: "自定义SQL配置参数", href: 'addApi/register/code' },
                    { title: "在线测试", href: 'addApi/register/check' },
                ]
            }]
        },
        {
            title: "API管理", spread: true,
            children: [{
                title: "类目管理", href: 'apiManage/project'
            },{
                title: "API管理", href: 'apiManage/index',
            }]
        },
        {
            title: "API申请与调用", spread: true, 
            children: [{
                title: "API签名", href: 'apiApplyCall/sign'
            },{
                title: "API测试", href: 'apiApplyCall/check'
            },{
                title: "API申请", href: 'apiApplyCall/apply'
            },{
                title: "API授权", href: 'apiApplyCall/auth'
            },{
                title: "API调用", href: 'apiApplyCall/call'
            }]
        },
        {
            title: "API安全", spread: true, 
            children: [{
                title: "安全组", href: 'apiSafety/group'
            }]
        },
        {
            title: "其他", spread: true, 
            children: [{
                title: "概览", href: 'other/generalView'
            },{
                title: "API返回码释义", href: 'other/rescode'
            }]
        }
    ]

    // 获取当前路由
    function getCurrentUrl() {
        const href = window.location.href
        const startIdx = href.lastIndexOf("views/")
        const endIdx = href.lastIndexOf(".html")
        if (startIdx > -1 && endIdx > -1) {
            return href.substring(startIdx + 6, endIdx)
        }
        return "index"
    }
    const CURRENTURL = getCurrentUrl()
    console.log(CURRENTURL)

    /**
     * 根据当前页面url 和list 获取上一页下一页地址名称信息
     **/
     function getHrefList(list) {
        for(var i=0; i< list.length; i++) {
            if (list[i].href) {
                if (list[i].href == CURRENTURL) {
                    list[i].checked = true
                }
                tmpList.push({ title: list[i].title, href: list[i].href})
            }
            if (list[i].children) {
                getHrefList(list[i].children)
            }
        }
    }
    var tmpList = []
    function getPrevNext() {
        getHrefList(MENULIST)

        // 修改 document.title
        const currdata = tmpList.filter(item=>item.href == CURRENTURL) 
        if (currdata && currdata.length > 0) {
            document.title = currdata[0].title + " - 帮助文档"
        }
        var resdata = {
            prev: null,
            next: null
        }
        const currIdx = tmpList.findIndex(item=>item.href == CURRENTURL)
        if (currIdx > 0) {
            resdata.prev = {title: tmpList[currIdx - 1].title, href: tmpList[currIdx - 1].href}
        }

        if (currIdx < tmpList.length - 1) {
            resdata.next = {title: tmpList[currIdx + 1].title, href: tmpList[currIdx + 1].href}
        }
        return resdata
    }