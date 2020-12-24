$(function(){
    
    var formData = new FormData();
    $('form').on('submit', function(event) {
        event.preventDefault();
        var item = $('form input');

        formData.append('test', item[3].files[0]);

        let user = {
            username: item[0].value,
            email: item[1].value,
            password: item[2].value
        }

        $.ajax({
            type: 'POST',
            url: 'http://127.0.0.1:8080/api/reg',
            data: user,
            success: function(data) {
                console.log(data);
                if(data.code == 200){
                    // 上传头像
                    $.ajax({
                        type: 'POST',
                        url: '/api/upload/'+item[0].value,
                        data: formData,
                        contentType: false, // 告诉jQuery不要去设置Content-Type请求头
                        processData: false, // 告诉jQuery不要去处理发送的数据
                        success: function(data){
                            if(data.code == 0){
                                console.log("上传失败");
                                alert("头像上传失败");
                            }else if(data.code == 1){
                                console.log("写入失败");
                                alert("头像上传失败");
                            }else if(data.code == 200){
                                console.log("上传成功");
                            }
                            alert('注册成功');
                            window.location.href="/page/users/login.html";
                        }
                    })
                }else{
                    switch(data.code){
                        case 0:
                             $("#addmsg").text("用户名不能为空");
                             break;
                        case 1:
                             $("#addmsg").text("邮箱不能为空");
                             break;
                        case 2:
                             $("#addmsg").text("密码不能为空");
                             break;
                        case 3:
                             $("#addmsg").text("数据库发生错误，请重新注册");
                             break;
                        case 500:
                             $("#addmsg").text("用户名已存在");
                             break;
                    }
                }
                // window.location.href('./../page/users/login.html');
            }
        });

    });

})

function changeImg(obj){
    $(".img").attr('src', getObjectURL(obj.files[0]));
    $(".img").css('display', 'flex');
}

function getObjectURL(file) {  
    var url = null;   
    if (window.createObjectURL!=undefined) {  
     url = window.createObjectURL(file) ;  
    } else if (window.URL!=undefined) { // mozilla(firefox)  
     url = window.URL.createObjectURL(file) ;  
    } else if (window.webkitURL!=undefined) { // webkit or chrome  
     url = window.webkitURL.createObjectURL(file) ;  
    }  
    return url ;  
}