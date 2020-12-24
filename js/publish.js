$(function(){
    // console.log($("form p input").innerHTML);

    let username = sessionStorage.getItem("username");

    // console.log('token ', sessionStorage.getItem("token"));

    $(".home").click(function (){
        window.location.href = "/page/articles/home.html";
    });

    $('form').on('submit', function(event) {
        event.preventDefault();
        var item = $('form input');
        // var todo = { item: item.val().trim() };

        console.log(item[0].value);
        console.log(item[1].value);

        $.ajax({
            url: "/api/home/publish",
            method: "POST",
            // dataType: "json",
            headers: {
                'authorization': sessionStorage.getItem("token")
            },
            data: {
                title: item[0].value,
                content: item[1].value,
                username: username
            },
            success: function(data){
                // console.log('success ', data);
                switch(data.code){
                    case 200:
                         alert("发布成功");
                         window.location.href="/page/articles/home.html";
                         break;
                    case 0:
                         $("#textWrong").text("文章名不能为空");
                         break;
                    case 1:
                         $("#textWrong").text("内容不能为空");
                         break;
                    case 2:
                         $("#textWrong").text("数据库发生错误，请重新提交");
                         break;
                    case 3:
                         alert("请先登录！");
                         window.location.href="/page/users/login.html";
                         break;
                }
            }
        })

    });
});