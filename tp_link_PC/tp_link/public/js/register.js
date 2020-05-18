$(function(){

    (function(){
         //定义验证禁用函数
         var forbidden=function($inp,html){
             // console.log($inp)
             $inp.next().addClass('failed').html(html)
             .parent().nextAll().children('input').prop('disabled',true).addClass('disabled');
             $('#register button').prop('disabled',true).addClass('disabled');
             $inp.focus();
         };
         // 定义可用函数
         var useable=function($inp,html){
             $inp.next().addClass('success').removeClass('failed').html(html)
             .parent().nextAll().children('input').prop('disabled',false).removeClass('disabled') 
             $('#register button').prop('disabled',false).removeClass('disabled') ;
             $inp.parent().next().children('input').focus();
         };
         // 获取焦点弹出自动提示
         $('#register').on('focus',"INPUT",function(){
             $(this).next().removeClass('d_none');
         });
         // 自动获取焦点
         $('[data-title=username]').children('input').focus();
         //用户名验证   
           $('[data-title=username]').children('input').blur(function(){
               var reg=/^[A-Za-z0-9]{6,8}$/;
               var $inp=$(this)
               var uname=$inp.val().trim()
               if(!reg.test(uname)){
                     //按值传递
                     forbidden($inp,'用户名格式不正确————请输入6~8用户名 可含字母和数字 不能包含特殊符号')
                     //再次获得焦点
                     // $('[data-title=username]').children('input').focus();
               }else{
                     $.ajax({
                         url:"http://localhost:3000/user/uname",
                         data:{uname},
                         dataType:"json",
                         type:"get"
                     }).then(res=>{
                         // console.log(res)
                         if(res.code==0){
                             forbidden($inp,res.msg)
                             // $('[data-title=username]').children('input').focus();
                         }else{
                             useable($inp,res.msg)
                             // $('[data-title=phone]').children('input').focus()
                              //手机号验证
                               $('[data-title=phone]').children('input').blur(function(){
                                   var reg=/^1[3-9]\d{9}$/
                                   var $inp=$(this)
                                   var phone=$(this).val().trim()
                                    if(!reg.test(phone)){
                                     //    $('[data-title=phone]').children('input').focus()
                                        forbidden($inp,'手机号格式不正确')
                                    }else{
                                        useable($inp,'手机号格式正确，可以使用')
                                     //    $('[data-title=password]').children('input').focus()
                                    };
                                });
                             //手机号验证完成
                         };
                     });
               };
           });
         //用户名验证结束
         // //手机号验证
         //     $('[data-title=phone]').children('input').blur(function(){
         //        var reg=/^1[3-9]\d{9}$/
         //        var $inp=$(this)
         //        var phone=$(this).val().trim()
         //         if(!reg.test(phone)){
         //             $('[data-title=phone]').children('input').focus()
         //         }else{
         //             useable($inp,'手机号格式正确，可以使用')
         //         };
         //     });
         // //手机号验证完成
         //密码框验证
         $('[data-title=password]').children('input').blur(function(){
             var reg=/^(?![a-zA-Z]+$)(?![0-9a-z]+$)(?![A-Z0-9]+$)[A-Za-z0-9]{6,8}$/
             var $inp=$(this);
             var upwd=$(this).val().trim()
             if(!reg.test(upwd)){
                 // $('[data-title=password]').children('input').focus()
                 forbidden($inp,'请输入6~8位密码,至少包含一个大写字母，至少包含一个小写字母，至少包含一个数字，不能里面有特殊符号')
             }else{
                 useable($inp,'密码格式正确，可以使用')
                 // $('[data-title=msg_password]').children('input').focus()
             };
         });
         //两次密码验证
         $('[data-title=msg_password]').children('input').blur(function(){
             var $inp=$(this)
             var upwd=$('[data-title=password]').children(1).val().trim();
             var conupwd=$(this).val().trim();
             if(upwd!==conupwd){
                 $inp.next().addClass('failed').html('两次密码不一致')
                 $('#register button').prop('disabled',true).addClass('disabled') 
                 $inp.focus()
             }else{
                 $inp.next().addClass('success').removeClass('failed').html('密码一致')
                 $('#register button').prop('disabled',false).removeClass('disabled')
             };
         });
         //密码验证完成
         //开始注册
        $('#btn').click(function(){
            //this指向
            //  (async ()=>{

                 var $btn=$(this)
                 console.log($btn)
                 var uname=$('[data-title=username]').children('input').val().trim();
                 var upwd=$('[data-title=password]').children('input').val().trim();
                 var phone= $('[data-title=phone]').children('input').val().trim();
              $.ajax({
                     url:"http://localhost:3000/user/register",
                     type:"post",
                     dateType:"json",
                     data:{uname,upwd,phone}
                  }).then(res=>{
                          //  console.log(res)
                          if(res.code==1){
                            $('#hint').removeClass('d_none').children(":first").html(res.msg);
                            $btn.prop('disabled',true).addClass('disabled');
                           $('#register input').prop('disabled',true);
                            $('#hint>p:last-child>button:first').click(function(){
                               $('#register input').prop('disabled',false);
                               $btn.prop('disabled',false).removeClass('disabled');
                                location.href='login.html'
                            });
                            $('#hint>p:last-child>button:last-child').click(function(){
                               $('#register input').prop('disabled',false);
                               $btn.prop('disabled',false).removeClass('disabled');
                               location.href='register.html';
                            });
                        }else{
                            alert(res.msg);
                        };
                  })
            //  })();
         });
    })();     


});
