$(function(){

    let id = window.location.search.substr(4);
    let username = sessionStorage.getItem("username");

    $(".home").click(function (){
        window.location.href = "/page/articles/home.html";
    });

    $.ajax({
        url: "/api/home/detail/"+id,
        method: "GET",
        success: function(data){
            
            let msg = data.data;

            $(".title").text(msg.title);
            $(".time").text(msg.time);
            $(".author").text(msg.author);
            $(".content").text(msg.content);

            let com = msg.comments;
            
            $(".comment-list").html("");
            for(let i=0; i<com.length; i++){
                // let content = "<div class=\"comment-item\">";
                // content += "<div class=\"user\">user: "+com[i].user+"</div>";
                // content += "<div class=\"time\">time: "+com[i].comTime+"</div>";
                // content += "<div class=\"message\">message: "+com[i].message+"</div>";
                // content += "</div>";
                let content = "<div class=\"comment-item col-xs-10 col-sm-10 col-md-10 col-lg-10\">";
                content += "<div class=\"user col-xs-6 col-sm-6 col-md-6 col-lg-6\">user: "+com[i].user+"</div>";
                content += "<div class=\"time\">"+com[i].comTime+"</div>";
                content += "<div class=\"message\">"+com[i].message+"</div>";
                content += "</div>";
                $(".comment-list").append(content);
            }

            if(msg.author === username){
                $(".edit-title").val(msg.title);
                $(".edit-content").val(msg.content);
                
                $(".edit-submit").click(function(){
                    let item = $(".modal-body input");
                    let title = item[0].value;
                    let content = item[1].value;
                    
                    if(title == ""){
                        $(".wrong-msg").text("标题不能为空");
                    }else if(content == ""){
                        $(".wrong-msg").text("内容不能为空");
                    }else{
                        $.ajax({
                            url: "/api/home/edit",
                            method: "POST",
                            headers: {
                                'authorization': sessionStorage.getItem("token")
                            },
                            data:{
                                title: title,
                                content: content,
                                id: id
                            },
                            success: function(data){
                                console.log('data', data);
                                if(data.code == 0 || data.code == 1){
                                    $(".wrong-msg").text("修改失败，请稍后重试");
                                }else if(data.code == 2 || data.code == 3){
                                    $(".wrong-msg").text("修改失败，没有修改权限");
                                }else{
                                    alert("修改成功！");
                                    $('#myModal').modal('hide');
                                    $(".title").text(title);
                                    $(".content").text(content);
                                }
                            }
                        })
                    }
                })
                $(".del").click(function(){
                    $.ajax({
                        url: "/api/home/del/"+id,
                        method: "GET",
                        headers: {
                            'authorization': sessionStorage.getItem("token")
                        },
                        success: function(data){
                            console.log('data ', data);
                            if(data.code == 0 || data.code == 1){
                                alert("删除失败，请稍后重试");
                            }else if(data.code == 2 || data.code == 3){
                                alert("删除失败，没有修改权限");
                            }else{
                                alert("删除成功！");
                                window.location.href = "/page/articles/home.html";
                            }
                        }
                    });
                });
            }else{
                console.log('wrong');
                $(".edit").css('display','none');
                $(".del").css('display','none');
            }

            $(".send").click(function(){
                // console.log('value', $(".comment-input")[0].value);

                $.ajax({
                    url: "/api/home/comment/"+id+"/"+username,
                    method: "post",
                    data:{
                        id: id,
                        username: username,
                        message: $(".comment-input")[0].value
                    },
                    success: function(data){
                        if(data.code == 0){
                            alert("评论失败，请稍后重试");
                        }else if(data.code == 200){
                            let date = new Date();
                            let s = date.getFullYear()+"-";
                            if(date.getMonth()<9)
                                s += '0';
                            s+= (date.getMonth()+1) + "-";
                            if(date.getDate()<10)
                                s += '0';
                            s += date.getDate() + " ";
                            if(date.getHours()<10)
                                s += '0';
                            s += date.getHours() + ":";
                            if(date.getMinutes()<10)
                                s += '0';
                            s += date.getMinutes() + ":";
                            if(date.getSeconds()<10)
                                s += '0';
                            s += date.getSeconds();
                            console.log('comment time', s);
                            let content = "<div class=\"comment-item col-xs-10 col-sm-10 col-md-10 col-lg-10\">";
                            content += "<div class=\"user col-xs-6 col-sm-6 col-md-6 col-lg-6\">user: "+username+"</div>";
                            content += "<div class=\"time\">"+s+"</div>";
                            content += "<div class=\"message\">"+$(".comment-input")[0].value+"</div>";
                            content += "</div>";
                            $(".comment-list").append(content);
                        }
                    }
                })
            });
        }
    });

});