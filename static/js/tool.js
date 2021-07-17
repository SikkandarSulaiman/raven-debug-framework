$(document).ready(function() {
	$('.mainmenu-mainbody').hide()
	build_test_fw()
	console.log('document loaded shorthand')
	$('.mainmenu-sidenav').sidenav({edge: 'left'})
	$('.dispmeter-sidenav').sidenav({edge: 'right'}).hide()
	console.log('Loaded DOM')
	var elems = document.querySelectorAll('.collapsible')
	var instances = M.Collapsible.init(elems, {})
	console.log(instances)
	$('#connection-trigger').trigger('click')
})

$('#config-trigger').on('click', function() {

})

$('#connection-trigger').on('click', function() {
	if ($(this).hasClass('selected-navkey')) return
	$('.mainmenu-navkey').each(function() { $(this).removeClass('selected-navkey') })
	$(this).addClass('selected-navkey')
	$.when($('.mainmenu-mainbody').each(function() { $(this).hide('slide', {direction: 'left'}) })).done(function() {
		$('.dispmeter-sidenav').hide('slide', {direction: 'right'})
		$('#connection-mainbody').show('slide', {direction: 'left'})
	})
})

$('#dashboard-trigger').on('click', function() {
	if ($(this).hasClass('selected-navkey')) return
	$('.mainmenu-navkey').each(function() { $(this).removeClass('selected-navkey') })
	$(this).addClass('selected-navkey')
	$.when($('.mainmenu-mainbody').each(function() { $(this).hide('slide', {direction: 'left'}) })).done(function() {
		$('.dispmeter-sidenav').show('slide', {direction: 'right'})
		$('#dashboard-mainbody').show('slide', {direction: 'left'})
	})
})

$('#testfw-trigger').on('click', function() {
	if ($(this).hasClass('selected-navkey')) return
	$('.mainmenu-navkey').each(function() { $(this).removeClass('selected-navkey') })
	$(this).addClass('selected-navkey')
	$('.dispmeter-sidenav').hide('slide', {direction: 'right'})
	$.when($('.mainmenu-mainbody').each(function() { $(this).hide('slide', {direction: 'left'}) })).done(function() {
		$('#testfw-mainbody').show('slide', {direction: 'left'})
	})
})

$('#shorthand-trigger').on('click', function() {
	if ($(this).hasClass('selected-navkey')) return
	$('.mainmenu-navkey').each(function() { $(this).removeClass('selected-navkey') })
	$(this).addClass('selected-navkey')
	$('.dispmeter-sidenav').hide('slide', {direction: 'right'})
	$.when($('.mainmenu-mainbody').each(function() { $(this).hide('slide', {direction: 'left'}) })).done(function() {
		$('#shorthand-mainbody').show('slide', {direction: 'left'})
	})
})

$('#eventlog-trigger').on('click', function() {
	if ($(this).hasClass('selected-navkey')) return
	$('.mainmenu-navkey').each(function() { $(this).removeClass('selected-navkey') })
	$(this).addClass('selected-navkey')
	$('.dispmeter-sidenav').hide('slide', {direction: 'right'})
	$.when($('.mainmenu-mainbody').each(function() { $(this).hide('slide', {direction: 'left'}) })).done(function() {
		$('#eventlog-mainbody').show('slide', {direction: 'left'})
	})		
})

$('#datalog-trigger').on('click', function() {
	if ($(this).hasClass('selected-navkey')) return
	$('.mainmenu-navkey').each(function() { $(this).removeClass('selected-navkey') })
	$(this).addClass('selected-navkey')
	$('.dispmeter-sidenav').hide('slide', {direction: 'right'})
	$.when($('.mainmenu-mainbody').each(function() { $(this).hide('slide', {direction: 'left'}) })).done(function() {
		$('#datalog-mainbody').show('slide', {direction: 'left'})
	})
})

$(document).on('click', '.testfw-menu-body-row-cont', function() {
	$.post('/send_ser', {id_name: $(this).attr('id')})
})

setInterval(function() {
	// $.get('/check', function(data) {
	// 	console.log('ack ajax call')
	// 	for (var key in data) {
	// 		var stylish_toast = $('<div/>', {
	// 			text: data[key]
	// 		})
	// 		M.toast({html: stylish_toast, classes: 'rounded', displayLength: 2000})
	// 	}
	// })
}, 300)

setInterval(function() {
	// $.get('/read_val', function(data) {
	// 	console.log('val ajax call')
	// 	console.log(data)
	// 	for (var key in data) {
	// 		var suffix = $('#'+key).data('suffix')
	// 		var val = data[key]
	// 		$('#'+key).html(val + suffix)
	// 	}
	// })
}, 500)

$('#conn').on('click', function() {
	$('body').animate({
		'background-color': '#ff7f50'
	}, 1500)
})
