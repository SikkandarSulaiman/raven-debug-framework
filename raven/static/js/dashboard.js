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

dashitems = [
    [
        {
            "name": "Load cell 1 absolute",
            "unit": "",
            "disp_id_name": "disp_lc1_act"
        },
        {
            "name": "Load cell 2 absolute",
            "unit": "",
            "disp_id_name": "disp_lc2_act"
        },
        {
            "name": "Air pressure absolute",
            "unit": "mbar",
            "disp_id_name": "disp_airpa_val_act"
        }
    ],
    [
        {
            "name": "Load cell 1 zero offset",
            "unit": "",
            "disp_id_name": "disp_lc1_rel"
        },
        {
            "name": "Load cell 2 zero offset",
            "unit": "",
            "disp_id_name": "disp_lc2_rel"
        },
        {
            "name": "Air pressure zero offset",
            "unit": "mbar",
            "disp_id_name": "disp_airpa_val_rel"
        },
        {
            "name": "Load cell 1 pressure",
            "unit": "mbar",
            "disp_id_name": "disp_lc1_pa"
        },
        {
            "name": "Load cell 2 pressure",
            "unit": "mbar",
            "disp_id_name": "disp_lc1_pa"
        }
    ]
]

var build_dashboard = function() {
    var dashmainbody = $('#dashboard-mainbody')
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
        dashmainbody.append(sectionrow)
    }
}

