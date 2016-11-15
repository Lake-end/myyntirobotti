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

    $(".chat-head").draggable({
        containment: "parent",
        opacity: 0.95,
        scope: "chathead",
        scroll: true

    }).on("dragstop", function (e) {
        var $this = $(this);
        $('#bubble').remove();
        if(middleY < e.pageY){
            box.style.bottom = "600%";
            }
        else
            box.style.bottom = 0;

        if (middle > e.pageX) {
            box.style.left = "20%";
            $this.animate({
                left: -offset
            });
        } else {

            box.style.left ="-450%";
            // Togglet ovat workaround scrollbar-ongelmalle
            $this.toggle();
            $this.toggle();
            $this.animate({
                left: bodyWidth + offset - $this.width()
            });
        }
    });

    $('.chat-head').click(function (e) {
        var chatMessage = $(this).find('.message');
        $('#bubble').remove();
        if (!chatMessage.is(':visible')) {
            $('.message:visible').hide();
            if(e.pageX > middle){
                box.style.left = "-450%";
            }
            else {
                box.style.left = "20%";
            }
        }
            chatMessage.toggle(100);
            $('#bubble').remove();
    });
    $('#msg').on("click", function() {
        return false;
    });
    $('.chat-head').on("drag", function() {
        $('#bubble').remove();
    });


    $(document).ready(function() {
        var chats = $('.chat-head');
        chats.each(function(i) {
            $(chats[i]).css('top', i*60+50);
            $('#bubble').delay(5000).fadeOut();
        });
    });
})(jQuery);