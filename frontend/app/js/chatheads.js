/**

 * Created by Sampsa on 23.10.2016.

 */

(function($) {


    var bodyWidth = $(document.body).width(),
    bodyHeight = $(document.body).height(),
    middle = bodyWidth / 2,
    middleY = bodyHeight / 2,
    offset = -10,
    box = document.getElementById("msg");
    /* Chathead JS */

    $('.chat-head').on("drag", function() {
        console.log('dragi alkaa')
        $('#bubble').remove();
        dragCheck = true;
        console.log(dragCheck)
    });

    $(".chat-head").draggable({
        containment: "parent",
        opacity: 0.95,
        scope: "chathead",
        scroll: true,
        refreshPositions: true,
        snap: true,
        drag: (function(){
            dragCheck = true;
        })


    }).on("dragstop", function (e) {
        console.log('dragi loppuu')
        console.log(dragCheck)


        var $this = $(this);
        $('#bubble').remove();
        if(middleY < e.pageY){
            box.style.bottom = "600%";
            }
        else
            box.style.bottom = 0;
        if (window.innerWidth/2 > e.pageX) {

        } else {
            box.style.left ="-450%"
        };

      /* Alku puolenvaihtoanimaatiolle.
       if (window.innerWidth/2 > e.pageX) {

            $("#msg").animate({
                left: "+=250"
            });
        } else {
            $("#msg").animate({
                left: "-=250"
            });
        }; */
        if (window.innerWidth/7 > e.pageX) {
            $this.animate({
                left: -offset
            });
        } if(window.innerWidth-(window.innerWidth /7) < e.pageX) {

            $this.animate({
                left: bodyWidth + offset - $this.width()
            });
        }
        function dragChange(){
            dragCheck = false;
        }
        setTimeout(dragChange, 1);
        console.log(dragCheck)
    });

    $('.chat-close').click(function (e) {

         var chatMessage = $('.message');
        $('#bubble').remove();
        if (dragCheck == false) {
        if (!chatMessage.is(':visible')) {
            $('.message:visible').hide();
            if(e.pageX > middle){
                box.style.left = "-450%";
                box.style.top = "10%";
            }
            else {
                box.style.left = "20%";
                box.style.top = "10%";
            }
        }

            chatMessage.fadeToggle("slow");
            $('#bubble').remove();
        }
    });


    $(document).ready(function() {
        var chats = $('.chat-head');
        chats.each(function(i) {
            $(chats[i]).css('top', i*60+50);
            $('#bubble').delay(8000).fadeOut();
        });
    });
})(jQuery);