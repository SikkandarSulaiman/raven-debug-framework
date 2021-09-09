$('#dashboard-trigger').on('click', function() {
	if ($(this).hasClass('selected-navkey')) return
	$('.mainmenu-navkey').each(function() { $(this).removeClass('selected-navkey') })
	$(this).addClass('selected-navkey')
	$.when($('.mainmenu-mainbody').each(function() { $(this).hide('slide', {direction: 'left'}) })).done(function() {
		$('#shorthand-tabs').show('slide', {direction: 'down'})
		$('.dispmeter-sidenav').show('slide', {direction: 'right'})
		$('#dashboard-mainbody').show('slide', {direction: 'left'})
	})

    var curDashmainPadding = $('#dashboard-mainbody').css('padding-left')
    $('#dashboard-mainbody').css('padding-left', curDashmainPadding + 5)
})

var build_dashboard = function(dashitems) {
    var dashpanel = $('#dashboard-panel')
    for (var rowindex in dashitems) {
        var sectionrow = $('<section/>', {class: 'row dash-cards'})
        for (var cardindex in dashitems[rowindex]) {
            var divdashcard = $('<div/>', {class: 'dash-card'})

            var divvwrap1 = $('<div/>', {class: 'vwrap'})
            var divdashitemname = $('<div/>', {
                class: 'velem dash-item-name',
                html: dashitems[rowindex][cardindex]['name']
            })
            divvwrap1.append(divdashitemname)
            divdashcard.append(divvwrap1)

            var divvwrap2 = $('<div/>', {class: 'vwrap'})
            var divdashitemvalue = $('<div/>', {
                class: 'velem setting-cur-val ' + dashitems[rowindex][cardindex]['disp_id_name'],
                'data-suffix': ''
            })
            divvwrap2.append(divdashitemvalue)
            divdashcard.append(divvwrap2)

            var divvwrap3 = $('<div/>', {class: 'vwrap'})
            var divdashitemunit = $('<div/>', {
                class: 'velem dash-item-unit',
                html: dashitems[rowindex][cardindex]['unit']
            })
            divvwrap3.append(divdashitemunit)
            divdashcard.append(divvwrap3)

            sectionrow.append(divdashcard)
        }
        dashpanel.append(sectionrow)
    }
}

