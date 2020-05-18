$(function(){

    (function(){
        $('[data-title=username]').children('input').focus();
        var canLogin=true;
        //登录验证
        $('#btn').click(function(){
            var $btn=$(this);
            var $unameInput=$('[data-title=username]').children('input');
            var $upwdInput=$('[data-title=password]').children('input');
            var uname=$unameInput.val().trim();
            var upwd=$upwdInput.val().trim();
            $.ajax({
                url:"http://localhost:3000/user/login",
                type:"post",
                data:{uname,upwd},
                dataType:"json",
            }).then(res=>{
                if(res.code==0){
                    $('[data-title=username]').children('input').focus();
                    $('#failed').removeClass('d_none').animate({opacity:1},1500,()=>{
                     $('#failed').addClass('d_none');
                    })
                }else{
                    canLogin=false;
                    // 放入存储用户信息
                    sessionStorage.setItem('uid',res.msg[0]);
                    sessionStorage.setItem('uname',res.msg[1]);
                    // console.log( sessionStorage.getItem('user')[0])
                    $unameInput.prop('readonly',true);
                    $upwdInput.prop('readonly',true);
                    $btn.addClass('disabled').prop('disabled',true);
                    $('#hint').removeClass('d_none');
                    $('#hint>p:last-child>button:first-child').click(function(){
                        location.href='index.html'
                         $('#hint').addClass('d_none');
                         $btn.removeClass('disabled').prop('disabled',false);
                         $unameInput.prop('readonly',false);
                         $upwdInput.prop('readonly',false);
                    });
                };
            });
        });
          //在密码框回车登录
          $('[data-title=password]').children('input').keyup(function(e){
                 if(canLogin){
                    //如果按的是回车键(按键号==13)时
                    if(e.keyCode==13){
                      //找到按钮，触发按钮身上的单击事件处理函数，就可以执行和单击按钮完全相同的效果了
                      //$("button").trigger("click");
                      $("#btn").click();
                    }
                }
            });
            $("#login").keyup(function(e){
                if(e.keyCode==13){
                     $('#hint>p:last-child>button').click()
                }
            });
    })();


});