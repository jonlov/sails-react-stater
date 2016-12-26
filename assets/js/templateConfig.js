import 'jquery-slimscroll';
import '../template/js';

/***** Full height function start *****/
var setHeight = function() {
    var height = $(window).height();
    $('.full-height').css('height', (height));
    $('.page-wrapper').css('min-height', (height));

    /*Vertical Tab Height Cal Start*/
    var verticalTab = $(".vertical-tab");
    if (verticalTab.length > 0) {
        for (var i = 0; i < verticalTab.length; i++) {
            var $this = $(verticalTab[i]);
            $this.find('ul.nav').css('min-height', '');
            $this.find('.tab-content').css('min-height', '');
            height = $this.find('ul.ver-nav-tab').height();
            $this.find('ul.nav').css('min-height', height + 40);
            $this.find('.tab-content').css('min-height', height + 40);
        }
    }
    /*Vertical Tab Height Cal End*/
};
/***** Full height function end *****/

/***** Resize function start *****/
$(window).on("resize", function() {
    setHeight();
}).resize();
/***** Resize function end *****/

/*****Ready function start*****/
let ready = () => {
    /*Resize function*/
    setHeight();

    /*Slimscroll*/
    $('.nicescroll-bar').slimscroll({height: '100%', color: '#3cb878'});
    $('.message-nicescroll-bar').slimscroll({height: '320px', color: '#3cb878'});
}

$(document).ready(function() {
    ready();
});

document.addEventListener('turbolinks:render', (e) => {
    ready();
});
/*****Ready function end*****/
