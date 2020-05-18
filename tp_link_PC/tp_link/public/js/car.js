$(function(){
     window.setTimeout(()=>{
         $.ajax({
             url:'http://localhost:3000/car/c_product',
             data:{uid:sessionStorage.getItem('uid')},
             dataType:'json',
             type:'get'
         }).then(res=>{
             console.log(res);
             var html=``;
             //第一次总价
             var subtitle=res.reduce(
                function(prev,elem){
                    // console.log(elem.price)
                  //把当前元素值和截止到目前旧的汇总值相加，计算出新的汇总值，返回给reduce函数
                  return prev+elem.price;
                  
                },
                0 //从0开始累加
              );
             //第一次总价 
             for(var r of res){
                 html+=`
                 <ul class='shopping_car_product' data-cid=${r.cid}>
                     <li><label><input type="checkbox" class="checkSelf" checked><img src=${r.src} alt=""></label></li>
                     <li>${r.title}</li>
                     <li>¥${r.price}</li>
                     <li><button>-</button><input type="text" class="InpWidth" value=${r.num}  readonly><button>+</button></li>
                     <li class="subtitle">小计：￥${r.price*r.num}</li>
                     <li><a href="javascript:;">删除</a></li>
                 </ul>
                 `;
             };//for
             $("[data-title=car_product]").html(html);
             $(".show_car_menu_fee>:first-child>span").html(res.length);
             $(".show_car_menu_fee>:last-child>span").html(`￥${subtitle}`);
             //创建被选择商品总价函数
             var total=function(){
                var total=0;
                $("[data-title=car_product]>ul>li>label>input").each((index,emel)=>{
                  // console.log($(emel))
                  if($(emel).prop('checked')==true){
                       total+=parseInt(($(emel).parent().parent().next().next().text().slice(1)))*parseInt($(emel).parent().parent().next().next().next().children('input').val())
                  };
                });
                return total
             };
              //创建被选择商品总价函数
              //创建被选择件数函数
              var  quantity =function(){
                var quantity=0;
                $("[data-title=car_product]>ul>li>label>input").each((index,emel)=>{
                  // console.log($(emel))
                  if($(emel).prop('checked')==true){
                      quantity+=1
                  };
                });
                return quantity
             };
              //创建被选择件数函数
             //全选点击事件
             $("#main>.shopping_car_menu_title>li>label>input").click(function(){
                 $(this).prop('checked')==true? $("[data-title=car_product]>ul>li>label>input").prop('checked',true): $("[data-title=car_product]>ul>li>label>input").prop('checked',false)
                 $(".show_car_menu_fee>:last-child>span").html(`￥${total()}`);
                 $(".show_car_menu_fee>:first-child>span:first").html(quantity());
            });
            //全选结束
            //商品选择
            $("[data-title=car_product]>ul>li>label>input").click(function(){
                var bool=true;
                $("[data-title=car_product]>ul>li>label>input").each((index,emel)=>{
                        
                        if($(emel).prop('checked')!=true){
                             bool=false;
                             return
                        };
                  });
                  bool==true?$("#main>.shopping_car_menu_title>li>label>input").prop('checked',true):$("#main>.shopping_car_menu_title>li>label>input").prop('checked',false);
                  $(".show_car_menu_fee>:last-child>span").html(`￥${total()}`);
                  $(".show_car_menu_fee>:first-child>span:first").html(quantity());

            });
            //商品选择
            //商品数量选择
            $('.shopping_car_product>li').on("click","BUTTON",function() {
              var num=$(this).parent().children().eq(1).val();
              if($(this).text().trim()=="+"){
              num++;
              $(this).parent().children().eq(1).val(num);
              $(this).parent().next().html(`小计：￥ ${parseInt($(this).parent().children().eq(1).val())*$(this).parent().prev().html().slice(1)}`)
              $(".show_car_menu_fee>:last-child>span").html(`￥${total()}`);
              }else{
              num--;
              num<1&&(num=1);
              $(this).parent().children().eq(1).val(num);
              $(this).parent().next().html(`小计：￥ ${parseInt($(this).parent().children().eq(1).val())*$(this).parent().prev().html().slice(1)}`)
              $(".show_car_menu_fee>:last-child>span").html(`￥${total()}`);
              };
              });
            //商品数量选择
            //删除
            $(".shopping_car_product>li:last-child>a").click(function(){
                var cid=$(this).parent().parent().attr("data-cid");
                 $.ajax({
                     url:"http://localhost:3000/car/delete_product",
                     type:'get',
                     data:{cid:cid,uid:sessionStorage.getItem("uid")},
                     dataType:'json'
                 }).then(res=>{
                     if(res.code==1){
                         /****待改 *//******************/
                         $.ajax({
                            url:"http://localhost:3000/car/car",
                            data:{uid:sessionStorage.getItem('uid')},
                            dataType:"json",
                            tyep:'get'
                          }).then(res=>{
                            //存入localStorage
                                console.log(res)	
                                localStorage.setItem(sessionStorage.getItem('uid'),JSON.stringify(res));
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
                                 alert('删除成功');
                                 $(this).parent().parent().remove();
                                 $(".show_car_menu_fee>:last-child>span").html(`￥${total()}`);
                                 $(".show_car_menu_fee>:first-child>span:first").html(quantity());
                                 $(".show_car_menu_fee>:first-child>span:last").html(res.length);
                            });
                         /******************/
                     }else{
                         alert("删除失败")
                     };
                 });//ajax
            });
            //删除



         });    
     },100);
})