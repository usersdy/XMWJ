$(function(){
    (async function(){
        $("<link rel='stylesheet' href='css/icon/iconfont.css'>").appendTo("head");
        $("<link rel='stylesheet' href='css/header.css'>").appendTo("head");
        var res=await  $.ajax({
            url:"header.html",
            type:"get"
        });
        $("header").replaceWith($(res));
        //用户登录状态验证开始  
        // console.log(sessionStorage.getItem('uid'));
        function isLogin(){
          if(sessionStorage.getItem('uname')!=null){
              $(".header_top>#clue>:first-child").html(`欢迎用户:${sessionStorage.getItem('uname')}`).removeClass("d_none").next().removeClass("d_none").next().addClass("d_none");
              //获取用户商品
              $.ajax({
                url:"http://localhost:3000/car/car",
                data:{uid:sessionStorage.getItem('uid')},
                dataType:"json",
                tyep:'get'
              }).then(res=>{
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
                 $("#car_product").html(html);
              })
          }else{
            $(".header_top>#clue>:first-child").html("").addClass("d_none").next().addClass("d_none").next().removeClass("d_none");
            $("#car_product").html(`<ul><li><a href="login.html"><span class="iconfont icon-icozhuanhuan"></span>购物车</a></li></ul>`);
          };
        };
        isLogin();
        //注销
        $(".header_top>#clue>:nth-child(2)").click(function(event){
           event.preventDefault();
           sessionStorage.clear();
           isLogin();
           $(".hint").removeClass("d_none").animate({
             opacity:1,
           },1000).animate({
              optacity:0 
           },1000,()=>{
             $(".hint").addClass("d_none")
           });
        });
        //用户登录状态结束
        //左侧搜索框开始
        var $input=$("[data-search=search]>input");
        var $sbutton=$("[data-search=search]>img");
        $sbutton.click(function(event){
           event.stopPropagation();
           var $search=$input.val().trim();
           if($search!=""){
            location.href=`products.html?search=${$search}`
           };
        });
        $input.keyup(function(event){
          if(event.keyCode==13){
              $sbutton.click()
          };
        });
        //左侧搜索框结束

       //头部展示商品
        $.ajax({
          url:"http://localhost:3000/index/show_product",
          dataType:"json",
          type:"get"
        }).then(res=>{
          //添加内容开始
          var {domestic,commercial,defend}=res;
          var $domesticProduct=$("#domestic");
          var $commercialProduct=$("#commercial");
          var $defendProduct=$("#defend");
          var add=function(family,product){
             var html=``;
             for(var d of family){
              html+=`
              <div>
                 <img src=${d.src} alt="">
                <p class='show_title'>${d.title}</p>
                <p class='show_price'>￥${d.price}</p>
                <a href=${d.href}>查看详情</a>
             </div>
              `;
              product.html(html);
             };
          };
         add(domestic,$domesticProduct);
         add(commercial,$commercialProduct);
         add(defend,$defendProduct);
          //  添加内容添加

          //展示商品开始
         var timer;
          $("header>.header_nav>ul").on("mouseenter","LI",function(){
             if(timer!= null){(clearTimeout(timer))};
              var div=$(`#${$(this).attr("data-tab")}`);
              div.removeClass("d_none").siblings().addClass("d_none")
          });
          $("header>.header_nav>ul").on("mouseleave","LI",function(){
              var div=$(`#${$(this).attr("data-tab")}`);
              timer=setTimeout(()=>{
              div.addClass("d_none")
            },10)
           });
           $("[data-product=show]").on('mouseenter',"[data-div=parent]",function(){
              clearTimeout(timer);
           });
           $("[data-product=show]").on('mouseleave',"[data-div=parent]",function(){
            $(this).addClass("d_none")
         });
        //展示商品结束

        });
    })();
});
