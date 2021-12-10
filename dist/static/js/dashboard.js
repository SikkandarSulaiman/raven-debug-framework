$('#dashboard-trigger').on('click', function() {
    if ($(this).hasClass('selected-navkey')) return
    $('.mainmenu-navkey').each(function() { $(this).removeClass('selected-navkey') })
    $(this).addClass('selected-navkey')

    /* Hide all other mainmenu items then show dashboard meinmenu */
    $.when($('.mainmenu-mainbody').each(function() { $(this).hide('slide', {direction: 'left'}) })).done(function() {
        $('#shorthand-tabs').show('slide', {direction: 'down'})
        $('.dispmeter-sidenav').show('slide', {direction: 'right'})
        $('#dashboard-mainbody').fadeIn()
        $('#dash-control-btn-create-trig').fadeIn()
    })

    var curDashmainPadding = $('#dashboard-mainbody').css('padding-left')
    $('#dashboard-mainbody').css('padding-left', curDashmainPadding + 5)
})

$(document).on('click', '.taba', function() {
    tabname = $(this).data('tabname')
    $.when($('.dispmeter-sidenav > .btn').each(function() {
        if (!$(this).hasClass(tabname)) {
//             $(this).hide('drop', {direction: 'left'}, 'fast')
                $(this).hide()
        }
    })).done(function() {
        $('.dispmeter-sidenav > .btn').each(function() {
            if ($(this).hasClass(tabname)) {
//                $(this).show('drop', {direction: 'right'}, 'fast')
                $(this).show()
            }
        })
    })
})

var buildDashboardButtonCreateMenu = function(msglist) {
    for (var [name, val] of Object.entries(msglist)) {
        var optiontag = $('<option/>', {
            value: val,
            html: name
        })
        $('select').append(optiontag)
    }
}

var build_dashboard_controls = function(dashbtns) {
    var dashtabs = $('#shorthand-tabs')
    for (var tabindex in dashbtns) {
        var newtabli = $('<li/>', {class: 'tab'})
        var newtaba = $('<a/>', {
            href: '#',
            class: 'taba',
            html: dashbtns[tabindex]['tab_name'],
            "data-tabname": dashbtns[tabindex]['tab_name']
        })
        newtabli.append(newtaba)
        dashtabs.append(newtabli)
    }

    for (var tabindex in dashbtns) {
        var sidenav = $('.dispmeter-sidenav')
        for (var btnindex in dashbtns[tabindex]['buttons']) {
            var button_content = dashbtns[tabindex]['buttons'][btnindex]
            var btndiv = $('<div/>', {
                class: dashbtns[tabindex]['tab_name'] + ' testfw-menu-body-row-cont dash-btn btn waves-effect',
                html: button_content['btn_name'],
                id: button_content['btn_id_name']
            })
            if (button_content['btn_id_name'].includes('with-payload')) {
                btndiv.attr('id', button_content['btn_id_name'].replace('with-payload', '').trim())
                btndiv.addClass('with-payload')
                btndiv.data('payload', button_content['payload'])
            }
            sidenav.append(btndiv.hide())
        }
    }

    $('.tab:first-child > a').addClass('active')
    $('.dispmeter-sidenav > .btn').each(function() {
        if ($(this).hasClass(dashbtns[$('.tab:first-child > a').data('tabname')]['tab_name'])) {
            $(this).show()
        }
    })
}

var build_dashboard_display = function(dashitems) {
    var dashpanel = $('#dashboard-panel')
    for (var rowindex in dashitems) {
        var sectionrow = $('<section/>', {class: 'row dash-cards'})
        for (var cardindex in dashitems[rowindex]) {
            var divdashcard = $('<div/>', {class: 'dash-card'})
            if (dashitems[rowindex][cardindex]['width-times'] == 2) {
                divdashcard.addClass('dc-hwx2')
            } else if (dashitems[rowindex][cardindex]['width-times'] == 3) {
                divdashcard.addClass('dc-hwx3')
            }

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

$(document).on('click', '#dash-control-btn-create-trig', function() {

    var menubox = $('#dash-control-btn-create-menu')

    if (menubox.is(':hidden')) {
        menubox.show('slide', {direction: 'right'})
        $('#dash-control-btn-create-trig').animate({
            deg: '-45'
        }, {
            duration: 300,
            step: function(now) {
                $(this).css({ transform: 'rotate(' + now + 'deg)' })
            }
        })        

    } else {
        menubox.hide('slide', {direction: 'right'})
        $('#dash-control-btn-create-trig').animate({
            deg: '0'
        }, {
            duration: 300,
            step: function(now) {
                $(this).css({ transform: 'rotate(' + now + 'deg)' })
            }
        })        
    }
})

