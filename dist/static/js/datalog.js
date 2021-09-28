$('#datalog-trigger').on('click', function() {
	if ($(this).hasClass('selected-navkey')) return
	$('.mainmenu-navkey').each(function() { $(this).removeClass('selected-navkey') })
	$(this).addClass('selected-navkey')
	$('.dispmeter-sidenav').hide('slide', {direction: 'right'})
	$('#shorthand-tabs').hide('slide', {direction: 'down'})
	$.when($('.mainmenu-mainbody').each(function() { $(this).hide('slide', {direction: 'left'}) })).done(function() {
		$('#datalog-mainbody').show('slide', {direction: 'left'})
	})
})

var datalogheadbuilt = false
var build_datalog_head = function(log_datakeep) {
    var datalogheadwrap = $('#datalog-head-table-wrap')
    var datalogbodywrap = $('#datalog-body-table-wrap')
    var datalogheadtable = $('<table/>', {'id': 'datalog-head-table'})
    var datalogbodytable = $('<table/>', {'id': 'datalog-body-table'})
    var datalogheadname = $('<tr/>', {'id': 'datalog-head-name'})
    var datalogheadunit = $('<tr/>', {'class': 'datalog-head-unit'})
    for (var i in log_datakeep['name']) {
        var name = $('<td/>', {'class': 'datalog-head-item', 'html': log_datakeep['name'][i]})
        var unit = $('<td/>', {'class': 'datalog-head-item', 'html': log_datakeep['unit'][i]})
        datalogheadname.append(name)
        datalogheadunit.append(unit)
    }
    datalogheadtable.append(datalogheadname, datalogheadunit)
    datalogheadwrap.append(datalogheadtable)
    datalogbodywrap.append(datalogbodytable)
    datalogheadbuilt = true
}

var build_datalog_body = function(log_datakeep) {
    var datalogbodytable = $('#datalog-body-table')
    var datalogbodyval = $('<tr/>', {'id': 'datalog-body-val'})
    for (var i in log_datakeep['disp_id']) {
        var valitem = $('<td/>', {'class': 'datalog-body-item', 'html': log_datakeep['value'][i]})
        // console.log('disp id:---' + '#'+log_datakeep['disp_id'][i])
        $('.'+log_datakeep['disp_id'][i]).each(function() {
            if ($(this).hasClass('display-suffix')) {
                $(this).html(log_datakeep['value'][i] + $(this).data('suffix'))
            } else {
                $(this).html(log_datakeep['value'][i])
            }
        })
        datalogbodyval.append(valitem)
    }
    datalogbodytable.append(datalogbodyval)
}

var get_datalog_head = function() {
    $.get('/datalogHead', function(data) {
        console.log(data)
        build_datalog_head(data)
    })
    datalogheadbuilt = true
}

var check_datalog = function() {
	$.get('/datalogCheck', function(data) {
        console.log(data)
        build_datalog_body(data)
        var datalogbodytablewrap = document.getElementById('datalog-body-table-wrap')
        datalogbodytablewrap.scrollTop = datalogbodytablewrap.scrollHeight;
	}).done(function() {
        console.log( "datalog second success" );
    }).fail(function() {
        console.log( "datalog retrieval error" );
    }).always(function() {
        console.log( "datalog finished" );
    })
    if ($('#datalog-body-table').children().length >= 1500) {
        $('#datalog-body-table').empty()
    }
}

setInterval(function() {
    if (datalogheadbuilt) {
        check_datalog()
    } else {
        get_datalog_head()
    }
}, 30)

// get_datalog_head()
// var log_ws = new WebSocket('ws://localhost:8080/datalogCheck')
// log_ws.onmessage =function(msg) {
//     console.log('Recvd msg in web socket')
//     build_datalog_body(msg.data)
// }

$('#datalog-body-table-wrap').scroll(function() {
	$('#datalog-head-table-wrap').scrollLeft($('#datalog-body-table-wrap').scrollLeft())
})

$('#datalog-head-table-wrap').scroll(function() {
	$('#datalog-body-table-wrap').scrollLeft($('#datalog-head-table-wrap').scrollLeft())
})
