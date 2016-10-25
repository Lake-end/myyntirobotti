/**
 * Created by Sampsa on 23.10.2016.
 */
(function($) {

    $('.chat-head').draggable({
        axis: "y",
        opacity: 0.8,
        scroll: false,
        start: function(event, ui) {
            ui.helper.bind("click.prevent",
                function(event) { event.preventDefault(); });
        },
        stop: function(event, ui) {
            setTimeout(function(){
                ui.helper.unbind("click.prevent");}, 300);
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