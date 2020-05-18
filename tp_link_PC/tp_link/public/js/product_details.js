$(function(){

window.setTimeout(() => {//解决引入头部异步
    (function(){
        // console.log($('header>.header_top'))
        var pid=decodeURI(location.search.split('=')[1]);
        $.ajax({
            url:'http://localhost:3000/product_details/',
            type:'get',
            dataType:'json',
            data:{pid}
        }).then(res=>{
                    // var {product,picture,detial_picture,recommend}=res;
                var  product=res.product;
                var  picture=res.picture;
                var  detial_picture=res.detial_picture;
                var  recommend=res.recommend;
               //定义切图函数
                 var P_add=function(product,picture,detial_picture,recommend){
                    // console.log(pid)
                    //图片及详情
                   $('#main>:first>:last').html(product.title);
                   $('#main>[data-title=product_title]>:first>img').attr('src',picture[0].lg);
                   $('#main>:nth-child(2)>:nth-child(2)>:nth-child(1)').html(product.title);
                   $('#main>:nth-child(2)>:nth-child(2)>:nth-child(2)>.price').html(`活动价:￥${product.price}`).next().html(`原价:￥${product.price+50}`);
                   $('#main>:nth-child(2)>:nth-child(2)>.details').html(product.details);
                   $('#main>:nth-child(2)>:nth-child(2)>.ifstock>>.address').html(`发货地址:${product.address}`).next().html(product.isAvailable);
                   
                    //相关推荐
                   var html=``; 
                   for(var c of recommend){
                        html+=`
                        <div data-P=${c.pid}>
                            <img src=${c.src} alt="">
                            <p>${c.title}</p>
                            <p>￥${c.price}</p>
                         </div>
                        `
                    };//for
                    $('[data-title=p_more]').html(html);
                    //推荐结束
                    //详情图片
                    var html1=``
                    for(var d of detial_picture){
                        html1+=`
                        <img src=${d.src} alt="">
                        `
                    };//for
                    $('#img_details').html(html1);
                    //详情图片结束
                    //小图片
                    var html2=``;
                    for(var p of picture){
                        html2+=`
                        <li><img src=${p.sm}  data-lg=${p.lg}></li>
                        `
                    };//for
                    $('#main>:nth-child(3)>div>ul').html(html2).css('width',picture.length*100);
                    
                    //小图片
                };//function p_add
                //定义结束
                P_add(product,picture,detial_picture,recommend);//调用
            
            
            //相关推荐
            $('[data-title=p_more]').on('click','DIV',function(){
                pid=$(this).attr('data-p')
                $.ajax({
                    url:'http://localhost:3000/product_details/',
                    type:'get',
                    dataType:'json',
                    data:{pid}
                }).then(res=>{
                    // var {product,picture,detial_picture,recommend}=res;
                     product=res.product;
                     picture=res.picture;
                     detial_picture=res.detial_picture;
                     recommend=res.recommend;
                    $('#main>:nth-child(3)>div>ul').css('margin-left',0)
                    P_add(product,picture,detial_picture,recommend);
                });
            });
            //相关推荐
           
            
            // 首页链接
            $('#main>:first>:first').click(function(){
               location.href='index.html'
            });
            //首页链接结束

            //购买数量及购买和跳转购物车
                //用户uid
                var uid=sessionStorage.getItem('uid');
                //节流阀
                var canAdd=true;
                //按钮选择数量点击事件
                var num=1;//记录数量
                var numInp=$('#main>:nth-child(2)>:nth-child(2)>:last-child>:first-child>.num');
                function disabled(){
                    num==1?  $('#main>:nth-child(2)>:nth-child(2)>:last-child>:first-child>:first-child').addClass('disabled').prop('disabled',true) :  $('#main>:nth-child(2)>:nth-child(2)>:last-child>:first-child>:first-child').removeClass('disabled').prop('disabled',false);
                }
                $('#main>:nth-child(2)>:nth-child(2)>:last-child>:first-child>button').click(function(){
                    if($(this).text().trim()=='+'){
                        num++;
                        numInp.val(num);
                        disabled();
                    }else{
                        num--;
                        if(num<1){
                            num=1;
                        }
                        disabled();
                        numInp.val(num);
                    };
                });
                //按钮选择数量点击事件结束

                //加入购物车按钮开始
                $('#main>:nth-child(2)>:nth-child(2)>:last-child>.btn_addcar').click(function(){
                     if(!sessionStorage.getItem('uid')){
                        $('#hint').removeClass('d_none')
                        $('#hint>p:last-child>button:first').click(function(){
                            location.href='login.html';
                            $('#hint').removeClass('d_none')
                        });
                        $('#hint>p:last-child>button:last-child').click(function(){
                            $('#hint').addClass('d_none')
                        });
                     }else{
                         if(canAdd){
                             canAdd=false;
                             //  console.log(1)
                             $.ajax({
                                url:'http://localhost:3000/car/pAdd',
                                type:'post',
                                data:{pid,uid,num}
                             }).then(res=>{
                                canAdd=true;
                                numInp.val(1);
                                 if(res.code==1){
                                     alert("添加成功")
                                     console.log(1)
                                    /****待改 *//******************/
                                                $.ajax({
                                                    url:"http://localhost:3000/car/car",
                                                    data:{uid:sessionStorage.getItem('uid')},
                                                    dataType:"json",
                                                    tyep:'get'
                                                  }).then(res=>{
                                                    //存入localStorage
                                                        // console.log(res)	
                                                         var html=`<ul><li><a href="car.html"><span class="iconfont icon-icozhuanhuan"></span>购物车</a></li></ul><ul class='product'>`;
                                                         for(var p of res){
                                                           html+=`
                                                           <li data-cid=${p.cid}>
                                                              <a href="car.html">
                                                                <img class="img" src=${p.src} alt="">
                                                                <div>${p.title}</div>
                                                              </a>
                                                          </li>
                                                           `;
                                                         }
                                                         html+=`</ul>`   
                                                         $("#car_product").html(html)
                                                    });
                                                 /******************/
                                    //  location.href=`product_details.html?pid=${pid}`
                                     /****待改 */
                                 }else{
                                     alert('添加失败')
                                 };
                             });
                         };       
                     };//else
                });
                //加入购物车按钮结束

                //跳转购物车页面
                $('#main>:nth-child(2)>:nth-child(2)>:last-child>.btn_tobuy').click(function(){
                    if(!uid){
                        $('#hint').removeClass('d_none')
                        $('#hint>p:last-child>button:first').click(function(){
                            location.href='login.html';
                            $('#hint').removeClass('d_none')
                        });
                        $('#hint>p:last-child>button:last-child').click(function(){
                            $('#hint').addClass('d_none')
                        });
                    }else{
                        location.href='car.html'
                    }
                });
                //跳转购物车页面
       
            //购买数量及购买和跳转购物车
            //左边图片详情
            //放大镜
                // console.log($("[data-product=show]"))
                $('#main>:nth-child(2)>:first-child>.msk').mouseenter(function(e){
                        e.stopPropagation()
                        $('#main>:nth-child(2)>:first-child>img').css('width','150%').prev().removeClass('d_none')
                 });
                 $('#main>:nth-child(2)>:first-child>.msk').mouseleave(function(e){
                        e.stopPropagation()
                        $('#main>:nth-child(2)>:first-child>img').css('width','100%').css('marginLeft',0).css('marginTop',0).prev().addClass('d_none').css('top',0).css('left',0)
                 });
                 $('#main>:nth-child(2)>:first-child>.msk').mousemove(function(e){
                        e.stopPropagation()
                        var glass=  $('#main>:nth-child(2)>:first-child>.glass')
                        var width=parseInt(glass.css('width'));
                        var height=parseInt(glass.css('height'));
                        var x=(e.offsetX-width/2),y=(e.offsetY-height/2);
                        var Pwidth=parseInt($(this).parent().css('width'));
                        var Pheight=parseInt($(this).parent().css('height'));
                       //  console.log(width)
                       //  console.log(height)
                        x<0&&(x=0);
                        y<0&&(y=0);
                        x>Pwidth-width&&(x=Pwidth-width);
                        y>Pheight-height&&(y=Pheight-height);
                        $('#main>:nth-child(2)>:first-child>img').css('marginLeft',-(x/2)).css('marginTop',-(y/2)).prev().css('top',y).css('left',x);
                });     
                    //放大镜

                //左边图片详情
                //小图片切换
                 $('#main>:nth-child(3)>div>ul').on('mouseenter','IMG',function(){
                     $(this).parent().addClass("active").siblings().removeClass("active");
                     var src=$(this).attr('data-lg');
                     $('#main>:nth-child(2)>:first-child>img').attr({src})
                 })
                 //小图片左右按钮
                 var i=0;
                 var $ul=$('#main>:nth-child(3)>div>ul');
                 $('#main>:nth-child(3)>.img_icon_left').click(function(){
                     i--;
                     i<0&&(i=0);
                    //  console.log(i)
                     $ul.css('margin-left',-i*parseInt( $('#main>:nth-child(3)>div>ul>li').css('width')))
                 });
                 $('#main>:nth-child(3)>.img_icon_right').click(function(){
                     i<(picture.length-3)&&(i++);
                    //  console.log(picture.length)
                     $ul.css('margin-left',-i*parseInt( $('#main>:nth-child(3)>div>ul>li').css('width')))
                 });
                 //小图片左右按钮
                //小图片切换
        });    
    })();//加载页面结束    
}, 100);

});//