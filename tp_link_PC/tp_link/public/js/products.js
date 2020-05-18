$(function(){
    (function(){
      // console.log(location.href)
      var $search=decodeURI(location.search).split('=')[1]
      console.log($search);
      //默认第一页
      var $page=1;
      //展示商品的父元素
      var $searchDiv=$("[data-title=search]")
      //保存一个副本，以便于价格排序
      var arrProduct;
        $.ajax({
            url:'http://localhost:3000/product/product',
            type:'get',
            dataType:'json',
            data:{search:$search,page:$page}
        }).then(res=>{
           if(res.data.length==0){
                  $('[data-title=hint]').removeClass('d_none');
                  $('[data-title=page]>button').addClass('d_none');
           }else{
            $('[data-title=page]>button').removeClass('d_none')
              var {data,pageCount}=res;
            //   console.log(pageCount)
               arrProduct=JSON.parse(JSON.stringify(data));
               //定义渲染页面函数
               function p_add(data){
                   var html=``;
                   for(var d of data){
                       html+=`
                       <div>
                       <a href=${d.href}>
                           <img src=${d.src} alt="">     
                           <div class='title'>${d.title}</div>
                           <div>
                               <span class='price'>￥${d.price}</span><span class="iconfont icon-icozhuanhuan"></span>
                           </div>
                       </a>
                    </div>
                       `;  
                   };
                   $searchDiv.html(html);
                   if($('[data-title=page]>:nth-child(2)').text().trim()=="下一页"){
                           var $ul=$(`<ul></ul>`)
                           var html=``;
                          for(var i=1;i<=pageCount;i++){
                              html+=`
                              <li ${i==$page&&'class=active'}>${i}</li>
                              `; 
                           };
                           $ul.html(html);
                           $(' [data-title=page]>:first').after($ul)
                       };
                     pageCount==1? $(' [data-title=page]>button').prop('disabled',true).addClass('disabled'):$(' [data-title=page]>:button').prop('disabled',false).removeClass('disabled')
                     $(' [data-title=page]>:first').addClass('disabled').prop('disabled',true);   
                    };//function
               //初次渲染页面
               p_add(data);
               
                  //创建分页按钮;
                 // 判断是不是加入新的分页
                 // console.log($('[data-title=page]>:nth-child(2)').text().trim())
               
                 //页数点击事件;
                    $('[data-title=page]>ul>li').click(function(){
                      $page=$(this).text().trim();
                      // console.log($page)
                       $.ajax({
                          url:'http://localhost:3000/product/product',
                          type:'get',
                          dataType:'json',
                          data:{search:$search,page:$page}
                       }).then(res=>{
                              var {data}=res;
                              arrProduct=JSON.parse(JSON.stringify(data));
                              p_add(data);
                              $(this).addClass('active').siblings().removeClass("active");
                              if($page==1){
                                  $(' [data-title=page]>:first').prop('disabled',true).addClass('disbaled');
                                  $(' [data-title=page]>:last').prop('disabled',false).removeClass('disbaled');
                              }else if($page==pageCount){
                                  $(' [data-title=page]>:first').prop('disabled',false).removeClass('disbaled');
                                  $(' [data-title=page]>:last').prop('disabled',true).addClass('disbaled');
                              }else{
                                  $(' [data-title=page]>:first').prop('disabled',false).removeClass('disbaled').next().next().prop('disabled',false).removeClass('disbaled');
                              };
                       });  
                  });
                  //页数点击事件结束   
                  //上下页按钮点击事件
                  $("[data-title=page]").on("click","BUTTON",function(){
                      if($(this).text().trim()=="上一页"){
                          if($page>=2){
                              $page--;
                              $.ajax({
                                  url:'http://localhost:3000/product/product',
                                  type:'get',
                                  dataType:'json',
                                  data:{search:$search,page:$page}
                               }).then(res=>{
                                      var {data}=res;
                                      arrProduct=JSON.parse(JSON.stringify(data));
                                      p_add(data);
                                      $('[data-title=page]>ul>li').each((i,emel)=>{
                                            $(emel).text().trim()==$page&& $(emel).addClass('active').siblings().removeClass('active');  
                                      })
                                      if($page==1){
                                          $(' [data-title=page]>:first').prop('disabled',true).addClass('disbaled');
                                          $(' [data-title=page]>:last').prop('disabled',false).removeClass('disbaled');
                                      }else if($page==pageCount){
                                          $(' [data-title=page]>:first').prop('disabled',false).removeClass('disbaled');
                                          $(' [data-title=page]>:last').prop('disabled',true).addClass('disbaled');
                                      }else{
                                          $(' [data-title=page]>:first').prop('disabled',false).removeClass('disbaled').next().next().prop('disabled',false).removeClass('disbaled');
                                      };
                              });
                          };
                      }else{
                          if($page<pageCount){
                              $page++;
                              $.ajax({
                                  url:'http://localhost:3000/product/product',
                                  type:'get',
                                  dataType:'json',
                                  data:{search:$search,page:$page}
                               }).then(res=>{
                                      var {data}=res;
                                      p_add(data);
                                      $('[data-title=page]>ul>li').each((i,emel)=>{
                                          console.log($(emel))
                                          $(emel).text().trim()==$page&& $(emel).addClass('active').siblings().removeClass('active');  
                                      });
                                      if($page==1){
                                          $(' [data-title=page]>:first').prop('disabled',true).addClass('disbaled');
                                          $(' [data-title=page]>:last').prop('disabled',false).removeClass('disbaled');
                                      }else if($page==pageCount){
                                          $(' [data-title=page]>:first').prop('disabled',false).removeClass('disbaled');
                                          $(' [data-title=page]>:last').prop('disabled',true).addClass('disbaled');
                                      }else{
                                          $(' [data-title=page]>:first').prop('disabled',false).removeClass('disbaled').next().next().prop('disabled',false).removeClass('disbaled');
                                      };
                              });
                          };
                      };
                  });
                  //上下页结束
                  //价格排序开始
                  $(".product_search_sort").on("click","LI",function(){
                      $(this).addClass('active').siblings().removeClass('active')
                      if($(this).text().trim()=="综合排序"){
                          arrProduct.sort((a,b)=>Math.random()<0.5?-1:1);
                          p_add(arrProduct);
                      }else if($(this).text().trim()=="价格从高到低↓"){
                          arrProduct.sort((a,b)=>{return b.price-a.price});
                          p_add(arrProduct)
                      }else{
                          arrProduct.sort((a,b)=>{return a.price-b.price});
                          p_add(arrProduct)
                      };
                  });
                  //价格排序结束
         };//else
      });//ajax
      
    })();//


});  
  
  





  