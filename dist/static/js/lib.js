var hideDashboardElements = function() {
    /* Hide all dashboard elements */ 
    $('.dispmeter-sidenav').hide('slide', {direction: 'right'})
    $('#shorthand-tabs').hide('slide', {direction: 'down'})
    $('#dash-control-btn-create-trig').fadeOut()
    $('#dash-control-btn-create-menu').hide()
}

var highlightMenuSelector = function(navkey) {
    $('.mainmenu-navkey').each(function() {
        $(this).removeClass('selected-navkey')
    })
    navkey.addClass('selected-navkey')
}

var hideOtherMenuExcept = function(menu) {
    $.when($('.mainmenu-mainbody').each(function() { $(this).hide('slide', {direction: 'left'}) })).done(function() {
        menu.show('slide', {direction: 'left'})
    })
}
