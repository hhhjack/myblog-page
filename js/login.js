$(function(){
    $('form').on('submit', function(event) {

        event.preventDefault();

        let item = $("form input");
        // console.log("test login ", item);

        let user = {
            username: item[0].value,
            password: item[1].value
        }

        if(user.username == ""){
            $("#prompt").text("用户名不能为空");
        }else if(user.password == ""){
            $("#prompt").text("密码不能为空");
        }else{
            $.ajax({
                type: 'POST',
                url: '/api/login',
                data: user,
                success: function(data) {
                    // console.log(data);
                    switch(data.code){
                        case 200:
                             alert("登录成功");
                             sessionStorage.setItem("token",data.data.token);
                             sessionStorage.setItem("username",user.username);
                             window.location.href="/page/articles/home.html";
                             break;
                        case 0:
                             $("#prompt").text("用户不存在");
                             break;
                        case 1:
                             $("#prompt").text("密码错误");
                             break;
                    }
                }
            });
        }

    });
})