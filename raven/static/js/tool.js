$(document).ready(function() {
	$('.mainmenu-mainbody').hide()
	build_test_fw()
	build_dashboard()

	$('.mainmenu-sidenav').sidenav({edge: 'left'})
	$('.dispmeter-sidenav').sidenav({edge: 'right'}).hide()
	$('#shorthand-tabs').hide()

	$('#connection-trigger').trigger('click')
	$('.btn').addClass('disabled')
	$('#connection-panel .btn').removeClass('disabled')

	M.Collapsible.init(document.querySelectorAll('.collapsible'), {})
	M.Tabs.init(document.querySelectorAll('.tabs'), {})
	$('.conn-port-blocks').hide()
})

$('#config-trigger').on('click', function() {

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

$(document).on('click', '.testfw-menu-body-row-cont.btn', function() {
	console.log('test fw btn clicked')
	console.log('setting val '+$(this).parent().next().children('.setting-input').val())
	$.post('/send_ser', {id_name: $(this).attr('id'), val: $(this).parent().next().children('.setting-input').val()})
})

setInterval(function() {
	var eventlogbody = $('.eventlog-body')
	$.get('/eventCheck', function(data) {
		console.log(data)
		if (data['event'] != null) {
			M.toast({html: data['event'][2], classes: 'rounded', displayLength: 2000})
			var eventlogbody_row = $('<div/>', {class: 'eventlog-body-row row'})
			var newevent_ts = $('<div/>', {class: 'eventlog-ts col s3', text: data['event'][0]})
			var newevent_ms = $('<div/>', {class: 'eventlog-ms col s3', text: data['event'][1]})
			var newevent_msg = $('<div/>', {class: 'eventlog-msg col s6', text: data['event'][2]})
			if (data['event'][3] < 0) {
				newevent_ts.animate({'border-left-color': 'red'}, 1500)
				newevent_ms.animate({'border-left-color': 'red'}, 1500)
				newevent_msg.animate({'border-left-color': 'red'}, 1500)
			}
			eventlogbody_row.append(newevent_ts, newevent_ms, newevent_msg)
			eventlogbody.append(eventlogbody_row)
			eventlogbody.scrollTop(eventlogbody.scrollHeight)			
		}
	})
}, 300)
