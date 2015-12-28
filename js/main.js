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

            open($(this));
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

        $(link.attr('href')).addClass('is--active');

        main.addClass('is--open');

        if ($(content).find('iframe').length) {

            $(content).find('iframe').attr('src', $(link).attr('data-src'));
        }
    };

    var close = function() {
        main.removeClass('is--open');
        content.removeClass('is--active');

        if ($(content).find('iframe').length) {

            $(content).find('iframe').attr('src', '');
        }
    };

    init();
};