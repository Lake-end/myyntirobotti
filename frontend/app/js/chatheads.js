/**
 * Created by Sampsa on 23.10.2016.
 */
(function($) {

    /* Chathead JS */
    $(".chat-head").draggable({
        opacity: 0.95,
        scope: "chathead",
        scroll: true
    }).on("dragstop", function (e) {
        var bodyWidth = $(document.body).width(),
            middle = bodyWidth / 2,
            $this = $(this),
            offset = -10;
        if (middle > e.pageX) {
            $this.animate({
                left: -offset
            });
        } else {
            $this.animate({
                left: bodyWidth + offset - $this.width()
            });
        }
    });

    $('.chat-head').click(function (e) {

            var chatMessage = $(this).find('.message');
            if (!chatMessage.is(':visible')) {
                $('.message:visible').hide();

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