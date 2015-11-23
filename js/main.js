$(function(){

    if ($('.overlay').length) {
        Overlay();
    }

});

var Overlay = function() {

    var main = $('.overlay')
    var content = main.find('.overlay__content');

    var init = function() {

        $('.has--overlay').click(function(e){
            e.preventDefault();

            open($(this).attr('href'));
        });

        //click on overlay, not the content > close overlay
        main.click(function(event){
            var closeOverlay = true;

            $(event.target).parents().each(function(){
                if ($(this).hasClass('overlay')){
                    closeOverlay = false;
                }
            });

            if (closeOverlay) {
                close();
            }

        })

        main.find('.overlay__close').click(function(e){
            e.preventDefault();

            close();
        });
    };

    var open = function(link) {

        $(link).addClass('is--active');

        main.addClass('is--open');

        if ($(link).find('iframe').length) {
            $(link).find('iframe').attr('src', $(link).find('iframe').attr('data-src'));
        }
    };

    var close = function() {
        main.removeClass('is--open');
        content.removeClass('is--active');
    };

    init();
};