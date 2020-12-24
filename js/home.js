let paging = 1;
let username = sessionStorage.getItem("username");

$(function(){
    if(!username){
        alert("请先登录");
        window.location.replace = "/page/users/login.html";
    }

    $(".img").attr("src", "/api/login/"+username);

    $(".user").text(username);

    $(".logout").click(function (){
        sessionStorage.clear();
        window.location.replace("/page/users/login.html");
    })

    pagelist(paging,5);

    $(".publish").click(function(){
        window.location.href = "/page/articles/publish.html";
    });

})

// 分页点击事件
function pageClick(allpage){
    $(".pagination li:first-child").click(function(){
        if(paging > 1){
            paging --;
            pagelist(paging, 5);
        }
    });
    $(".pagination li:last-child").click(function(){
        if(paging < allpage){
            paging ++;
            pagelist(paging, 5);
        }
    });
    for(let i=2; i <= $(".pagination li").length-1; i++){
        $(".pagination li:nth-child("+i+")").click(function(data){
            paging = data.target.innerHTML;
            // data.target.css("background-color", "#ccc");
            // $(".pagination li:not(:nth-child("+i+"))").css("background-color", "#fff");
            pagelist(paging, 5);
        });
    }
}

function pagelist(page, rows){
    $.ajax({
        type: 'POST',
        url: '/api/home/pagelist',
        // dataType: "json",
        // headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': sessionStorage.getItem("token")
        // },
        data: {
            page: page,
            rows: rows
        },
        success: function(data){
            console.log('testhome ', data);

            if(data.code == 200){

                // 分页标签
                let html = "<li><a href=\"#\">&laquo;</a></li>";
                if(data.page < 5){
                    for(let i=1; i<=data.page; i++){
                        html += "<li><a href=\"#\">"+i+"</a></li>";
                    }
                }else{
                    let k;
                    if(page <= 3)
                        k = 0;
                    else if(page+2 <= data.page){
                        k = page-3;
                    }else{
                        k = data.page - 5;
                    }
                    for(let i=1+k; i <= 5+k; i++){
                        html += "<li><a href=\"#\">"+i+"</a></li>";
                    }
                }
                html += "<li><a href=\"#\">&raquo;</a></li>";

                $(".pagination").html(html);

                pageClick(data.page);
                // console.log("page ",paging);
    
                // 信息列表
                $(".container").html("");
                for(let k=0; k<data.list.length; k++){
                    let content = "<div class=\"user-item col-xs-10 col-sm-9 col-md-8 col-lg-8 center-block\">";
                    content += "<div class=\"title\">"+data.list[k].title+"</div>";
                    content += "<div class=\"row box\">";
                    content += "<div class=\"col-xs-5 col-sm-4 col-md-4 col-lg-4 time\">"+data.list[k].time+"</div>";
                    content += "<div class=\"author\">author: "+data.list[k].author+"</div>";
                    content += "</div>";
                    content += "</div>";
                    $(".container").append(content);
                    // console.log($(".user-item:last-child"));
                    $(".user-item:last-child").click(function(){
                        window.location.href = "/page/articles/detail.html?id="+data.list[k]._id;
                    })
                }
            }
        },
        error: function(data){
            console.log('err ', data);
        }
    })
}