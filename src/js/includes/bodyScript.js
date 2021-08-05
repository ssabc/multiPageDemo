// 返回首页按钮
const homeUrl = window.location.protocol + "//" + window.location.host
$("#backHome").on("click", function(){
    if (homeUrl) {
        window.location.href = homeUrl
    }
})

// 渲染页面底部的上一页下一页
$("#mainContent article").append('<div class="article-navigation"><div id="btn-previous" class="btn-previous"></div><div id="btn-next" class="btn-next"></div></div>')
const prevNextData = getPrevNext()
function getHref(path) {
    const href = window.location.href
    let startIdx = href.lastIndexOf("views/")
    if (startIdx > -1) {
    return href.substring(0, startIdx + 6) + path + ".html"
    }
    return ""
}
if (prevNextData.prev) {
    $("#btn-previous").html('<a href="'+ getHref(prevNextData.prev.href)+'">←'+prevNextData.prev.title+'</a>')
}
if (prevNextData.next) {
    $("#btn-next").html('<a href="'+getHref(prevNextData.next.href)+'">'+ prevNextData.next.title +'→</a>')
}


// 渲染锚点列表
const h2List = $("#mainContent").find("h2") // 第二层标题
if (h2List && h2List.length > 0) {
    $("#toc nav").css("display", "block")

    // 第一层标题
    $("#toc-title").html( $("#mainContent").find("h1").html() || "" )
    // 根据帮助文档内容，渲染锚点列表
    let sectionListHtml = ""
    $("#mainContent").find("h2").each(function() {
        let tempLi = '<a dataTop="'+$(this).offset().top+'" href="#'+ ($(this).attr("id") || "") +'" class="anctor-a">'+($(this).html() || "--")+'</a>'
        // 第三层标题
        const h3List = $(this).parent().find("h3")
        if (h3List && h3List.length > 0) {
            let h3ListHtml = ""
            h3List.each(function(){
                h3ListHtml += '<li class="subheading-item"><a href="#'+($(this).attr("id") || "")+'" class="">'+($(this).html() || "--")+'</a></li>'
            })
            const subListHtml = h3ListHtml ? '<ul class="subheading-list">' + h3ListHtml + '</ul>' : ""
            tempLi = tempLi + subListHtml
        }
        sectionListHtml += '<li>' + tempLi + '</li>'
    })
    $("#sectionList").html(sectionListHtml)
} else {
    $("#toc").css("display", "none")
}

/**
 * 页面滚动则更新锚点值
 */
window.onscroll = setTocActive
function setTocActive() {
    const scrollTop = document.documentElement.scrollTop
    const tocDom = document.getElementById("toc");
    if (!tocDom) {
        return
    }
    const topList = []
    $("#toc").find(".anctor-a").each(function(){
        topList.push(parseInt( $(this).attr("datatop") ));
        $(this).removeClass("active")
    })
    let auctorIdx = -1
    topList.map((item, idx) => {
        if (scrollTop > item || scrollTop == item) {
            auctorIdx = idx
        }
    })
   
    $("#toc").find(".anctor-a").each(function(idx){
        // console.log(scrollTop, $(this).attr("datatop"), auctorIdx, idx)
        if ( auctorIdx == idx) {
            $(this).addClass("active")
        }
    })
}