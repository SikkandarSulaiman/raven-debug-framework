var connection_init = function() {

}

var build_connection_page = function(comdata) {
	var msgport_parent = $('.msg-port-block')
	var msgport_header = msgport_parent.find('>:first-child')
	msgport_parent.empty().append(msgport_header)

	var debugport_parent = $('.debug-port-block')
	var debugport_header = debugport_parent.find('>:first-child')
	debugport_parent.empty().append(debugport_header)

	for (var port_index in comdata['ports']) {
		var msgportdisp = $('<div/>', {
			'class': 'tooltipped msg-port-disp btn waves-effect waves-light',
			'data-position': 'right',
			'data-tooltip': comdata['desc'][port_index],
			'html': comdata['ports'][port_index]
		})
		msgport_parent.append(msgportdisp)
		var debugportdisp = $('<div/>', {
			'class': 'tooltipped debug-port-disp btn waves-effect waves-light',
			'data-position': 'left',
			'data-tooltip': comdata['desc'][port_index],
			'html': comdata['ports'][port_index]
		})
		debugport_parent.append(debugportdisp)
	}
	$('.tooltipped').tooltip()
}

$(document).on('click', '.msg-port-disp', function() {
	M.toast({html: 'initiating connection', displayLength: 2000, classes: 'rounded'})
	var clicked_btn = $(this)
	var comport = clicked_btn.text()
	console.log(comport)
	$.post('/connect_to_com', {'connect_to': comport}, function(data) {
		if (data['connection_status'] == 'success') {
			M.toast({html: 'connection successful', displayLength: 2000, classes: 'rounded'})
			$('#conn').trigger('click')
			clicked_btn.animate({
				'background-color': '#26A69A',
				'color': 'white'
			}, 1500)
		} else if (data['connection_status'] == 'failure') {
			M.toast({html: 'connection failure: Port is already open', displayLength: 2000, classes: 'rounded'})
		} else {
			M.toast({html: 'connection failure: Unknown error', displayLength: 2000, classes: 'rounded'})			
		}
	})
})

$('#connection-trigger').on('click', function() {
	if ($(this).hasClass('selected-navkey')) return
	$('.mainmenu-navkey').each(function() { $(this).removeClass('selected-navkey') })
	$(this).addClass('selected-navkey')
	$('.dispmeter-sidenav').hide('slide', {direction: 'right'})
	$('#shorthand-tabs').hide('slide', {direction: 'down'})
	$.get('/get_comports', function(comdata) {
		k = comdata
		$('#comport-loader').hide()
		build_connection_page(comdata)
		$('.conn-port-blocks').show()
		console.log(comdata)
	})
	$.when($('.mainmenu-mainbody').each(function() { $(this).hide('slide', {direction: 'left'}) })).done(function() {
		$('#connection-mainbody').show('slide', {direction: 'left'})
	})
})
