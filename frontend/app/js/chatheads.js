/**

 * Created by Sampsa on 23.10.2016.

 */

(function($) {

    var bodyWidth = $(document.body).width(),
    middle = bodyWidth / 2,
    offset = -10,
    box = document.getElementById("msg");
    /* Chathead JS */

    $(".chat-head").draggable({
        opacity: 0.95,
        scope: "chathead",
        scroll: true

    }).on("dragstop", function (e) {
           var $this = $(this);

        if (middle > e.pageX) {

            box.style.left = "20%";
            $this.animate({
                left: -offset
            });
        } else {

            box.style.left ="-450%";
            $this.animate({
                left: bodyWidth + offset - $this.width()
            });
        }
    });

    $('.chat-head').click(function (e) {
        var chatMessage = $(this).find('.message');
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
    });
    $('#msg').on("click", function() {
        return false;
    });

    $(document).ready(function() {
        var chats = $('.chat-head');
        chats.each(function(i) {
            $(chats[i]).css('top', i*60);
        });
    });
})(jQuery);