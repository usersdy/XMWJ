$(function(){
//轮播事件
//轮播图
    (function(){
          $.ajax({
              url:'http://localhost:3000/index/banner',
              type:'get',
              dataType:"json"
          }).then(res=>{
              // console.log(res)
       
             var $banner_list=$("[data-title=banner]>.banner_list");
             var html=``;
             for(var r of res){
                 html+=`
                 <li class='banner_item'><a href=${r.href}><img src=${r.src}></a></li>
                 `
             };
             $banner_list.css('width',parseInt(res.length)*1200);
             $banner_list.html(html);
             //轮播效果
             var i=0;//滚动次数;
             var Length=1200;
             var count=parseInt(res.length);
             var timer;//自动轮播
          //    console.log(count)
             function moveTo(){
                  (i==-1)&&(i=(count-1));
                  (i==count)&&(i=0);
                  // console.log(i)
                  $banner_list.css("marginLeft",-i*Length+"px");
                  $(`.banner_guide>li:eq(${i})`).addClass("active").siblings().removeClass("active");
               };
               //防抖 
               var canIcon=true
             $(".icon_left").click(function(){
                 if(canIcon){
                     canIcon=false
                    i--;
                    moveTo();
                    setTimeout(() => {
                        canIcon=true
                    }, 800);
                 }
             });
             $(".icon_right").click(function(){
                if(canIcon){
                    canIcon=false
                   i++;
                   moveTo();
                   setTimeout(() => {
                       canIcon=true
                   }, 800);
                }
             });
             $(".banner_guide").on("mouseenter","LI",function(){
                  i=$(this).index();
                  moveTo()
             });
             timer=setInterval(() => {
                 i++;
                 moveTo();
              },3000);
             $("[data-title=banner]").mouseleave(function(){
                 timer=setInterval(() => {
                       i++;
                       moveTo();
                  },4000);
                  $("[data-title=banner]>span").removeClass('canSee')
             });
             $("[data-title=banner]").mouseenter(function(){
                if(timer!=null){
                    clearInterval(timer)
                };
                $("[data-title=banner]>span").addClass('canSee');
            });

          });
    })();     
//轮播事件结束
    /****************主页商品*************** */
    (function(){
        $.ajax({
            url:'http://localhost:3000/index/product',
            type:'get',
            dataType:'json'
        }).then(res=>{
            // console.log(res);
            var {domestic,commercial,defend}=res;
            // console.log(domestic,commercial,defend)
            var productAdd=function($div,res){
                var html=``;
                for(var r of res){
                    html+=`
                    <div>
                        <a  href=${r.href}>
                            <p>
                                <img src=${r.src} alt="">
                            </p>
                            <p class="p_title">${r.title}</p>
                            <p class="p_detalis">${r.details}</p>
                            <p class="p_price">￥${r.price}</p>
                        </a>
                    </div>
                    `
                };
                html+=`<div class='go_more'>
                <a href="products.html?search=product">
                    <span>了解更多</span>
                    <img src="img/product_title/go_more.png" alt="">
                 </a>
                </div>`
                $div.html(html)
            };
            productAdd($('#domestic_F>:last'),domestic)
            productAdd($('#defend_F>:last'),defend)
            productAdd($('#commercial_F>:last'),commercial)
        });
    })();
    /****************商品nav*************** */
    (function(){
       $('.product_nav>li>a').click(function(){
            var $search=$(this).text().trim();
            location.href=`products.html?search=${$search}`;
       }) 
    })();
    /****************商品nav*************** */
    /****************主页商品*************** */
    // 右侧滑梯
   (function(){
      // 节流阀
      var flag = true;
      function toggleTool() {
          if($(document).scrollTop() > $("[data-title=banner]").offset().top - 1) {
              $(".slider_bar").fadeIn();  
          } else {
              $(".slider_bar").fadeOut(); 
          }
      }
      // each()遍历所有模块，让电梯导航和对应模块保持一致
      function eachTool() {
          if(flag) {
            $("[data-srcoll=srcoll]").each(function(i, ele) { 
                // console.log( $(ele).offset().top)
                  if($(document).scrollTop() > $(ele).offset().top - 1) {
                      $("ul.slider_bar>li").eq(i).addClass("current").siblings().removeClass();
                  } else if($(window).scrollTop() + $(window).height() >= $(document).height() - 1) {
                      var footIndex = $("ul.slider_bar>li").length - 1;
                      $("ul.slider_bar>li").eq(footIndex).addClass("current").siblings().removeClass();
                  }
              })
          }
      }
    //页面滚动时执行
      $(window).scroll(function(e) {
          toggleTool();
          eachTool();
      })
      // 用户点击导航，让滚动条滚到相应模块
      $("ul.slider_bar>li").click(function(e) {
          flag = false;
          var current = $("[data-srcoll=srcoll]").eq($(this).index()).offset().top;  
          $("html").stop().animate({  
              scrollTop: current
          }, function() {   
              flag = true;   
          })
          $(this).addClass("current").siblings().removeClass();
      })
   })();
});