$(function(){
    (async function(){

        var res=await $.ajax({
            url:'footer.html',
            type:'get'
        })
        $("<link rel='stylesheet' href='css/footer.css'>").appendTo("head");
        $("footer").replaceWith($(res))
    })();
});