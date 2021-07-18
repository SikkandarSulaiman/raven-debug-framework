$(document).ready(function() {
	$('.mainmenu-mainbody').hide()
	build_test_fw()

	$('.mainmenu-sidenav').sidenav({edge: 'left'})
	$('.dispmeter-sidenav').sidenav({edge: 'right'}).hide()
	$('#shorthand-tabs').hide()

	$('#connection-trigger').trigger('click')
	// setTimeout(function() {
	// 	$('#conn').trigger('click')
	// }, 3000)
	// $('.tabs').tabs()
	$('.btn').addClass('disabled')
	$('#connection-panel .btn').removeClass('disabled')

	M.Collapsible.init(document.querySelectorAll('.collapsible'), {})
	M.Tabs.init(document.querySelectorAll('.tabs'), {})
	

	$('.conn-port-blocks').hide()
})

$('#config-trigger').on('click', function() {

})

$('#dashboard-trigger').on('click', function() {
	if ($(this).hasClass('selected-navkey')) return
	$('.mainmenu-navkey').each(function() { $(this).removeClass('selected-navkey') })
	$(this).addClass('selected-navkey')
	$.when($('.mainmenu-mainbody').each(function() { $(this).hide('slide', {direction: 'left'}) })).done(function() {
		$('#shorthand-tabs').show('slide', {direction: 'down'})
		$('.dispmeter-sidenav').show('slide', {direction: 'right'})
		$('#dashboard-mainbody').show('slide', {direction: 'left'})
	})
})

$('#testfw-trigger').on('click', function() {
	if ($(this).hasClass('selected-navkey')) return
	$('.mainmenu-navkey').each(function() { $(this).removeClass('selected-navkey') })
	$(this).addClass('selected-navkey')
	$('.dispmeter-sidenav').hide('slide', {direction: 'right'})
	$('#shorthand-tabs').hide('slide', {direction: 'down'})
	$.when($('.mainmenu-mainbody').each(function() { $(this).hide('slide', {direction: 'left'}) })).done(function() {
		$('#testfw-mainbody').show('slide', {direction: 'left'})
	})
})

$('#shorthand-trigger').on('click', function() {
	if ($(this).hasClass('selected-navkey')) return
	$('.mainmenu-navkey').each(function() { $(this).removeClass('selected-navkey') })
	$(this).addClass('selected-navkey')
	$('.dispmeter-sidenav').hide('slide', {direction: 'right'})
	$('#shorthand-tabs').hide('slide', {direction: 'down'})
	$.when($('.mainmenu-mainbody').each(function() { $(this).hide('slide', {direction: 'left'}) })).done(function() {
		$('#shorthand-mainbody').show('slide', {direction: 'left'})
	})
})

$('#eventlog-trigger').on('click', function() {
	if ($(this).hasClass('selected-navkey')) return
	$('.mainmenu-navkey').each(function() { $(this).removeClass('selected-navkey') })
	$(this).addClass('selected-navkey')
	$('.dispmeter-sidenav').hide('slide', {direction: 'right'})
	$('#shorthand-tabs').hide('slide', {direction: 'down'})
	$.when($('.mainmenu-mainbody').each(function() { $(this).hide('slide', {direction: 'left'}) })).done(function() {
		$('#eventlog-mainbody').show('slide', {direction: 'left'})
	})		
})

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

$(document).on('click', '.testfw-menu-body-row-cont', function() {
	$.post('/send_ser', {id_name: $(this).attr('id')})
})

setInterval(function() {
	var eventlogbody = $('.eventlog-body')
	$.get('/check', function(data) {
		console.log(data)
		if (data['event'] == null) return
		M.toast({html: data['event'][1], classes: 'rounded', displayLength: 2000})
		var eventlogbody_row = $('<div/>', {class: 'eventlog-body-row row'})
		var newevent_ts = $('<div/>', {class: 'eventlog-ts col s3', text: data['event'][2]})
		var newevent_ms = $('<div/>', {class: 'eventlog-ms col s3', text: '0'})
		var newevent_msg = $('<div/>', {class: 'eventlog-msg col s6', text: data['event'][1]})
		eventlogbody_row.append(newevent_ts, newevent_ms, newevent_msg)
		eventlogbody.append(eventlogbody_row)
		eventlogbody.scrollTop(eventlogbody.scrollHeight)
	})
}, 300)

// setInterval(function() {
// 	$.get('/read_val', function(data) {
// 		console.log('val ajax call')
// 		console.log(data)
// 		for (var key in data) {
// 			var suffix = $('#'+key).data('suffix')
// 			var val = data[key]
// 			$('#'+key).html(val + suffix)
// 		}
// 	})
// }, 500)

$('#conn').on('click', function() {
	$('body').animate({
		'background-color': '#FF7F50'
	}, 1500)
	$('.mainmenu-sidenav').animate({
		'background-color': '#2F4F4F'
	}, 1500)
	$('.mainmenu-navkey').animate({
		'color': '#F1F2F3'
	}, 1500)
	$('.btn').removeClass('disabled')
})
