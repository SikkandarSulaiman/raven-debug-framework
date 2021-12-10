$(document).ready(function() {
	$('.mainmenu-mainbody').hide()
    $.post('/getConfig', {filename: 'test_fw_tab.json'}, function(jsondata) {
        build_test_fw(jsondata)
        M.Collapsible.init(document.querySelectorAll('.collapsible'), {})
    })
    $.post('/getConfig', {filename: 'dashboard_items.json'}, function(jsondata) {
        build_dashboard_display(jsondata['dashitems'])
    })
    $.post('/getConfig', {filename: 'dashboard_buttons.json'}, function(jsondata) {
        build_dashboard_controls(jsondata)
        M.Tabs.init(document.querySelectorAll('.tabs'), {})
    })
    $.post('/getConfig', {filename: 'msg_ids_name_to_val.json'}, function(jsondata) {
    	buildDashboardButtonCreateMenu(jsondata)
    	dash_control_create_send_list = M.FormSelect.init($('select'))
    })

	$('.mainmenu-sidenav').sidenav({edge: 'left'})
	$('.dispmeter-sidenav').sidenav({edge: 'right'}).hide()
	$('#shorthand-tabs').hide()

	$('#connection-trigger').trigger('click')
	$('.btn').addClass('disabled')
	$('#connection-panel .btn').removeClass('disabled')
	$('.conn-port-blocks').hide()
})

$('#config-trigger').on('click', function() {

})

$('#testfw-trigger').on('click', function() {
    if ($(this).hasClass('selected-navkey')) return
    highlightMenuSelector($(this))
    hideDashboardElements()
    hideOtherMenuExcept($('#testfw-mainbody'))
})

$('#shorthand-trigger').on('click', function() {
	if ($(this).hasClass('selected-navkey')) return
    highlightMenuSelector($(this))
    hideDashboardElements()
    hideOtherMenuExcept($('#shorthand-mainbody'))
})

$('#eventlog-trigger').on('click', function() {
    if ($(this).hasClass('selected-navkey')) return
    highlightMenuSelector($(this))
    hideDashboardElements()
    hideOtherMenuExcept($('#eventlog-mainbody'))	
})

$(document).on('click', '.testfw-menu-body-row-cont.btn', function() {
	console.log('test fw btn clicked')
	console.log('setting val '+$(this).parent().next().children('.setting-input').val())
	if ($(this).hasClass('with-payload')) {
	    $.post('/send_ser', {id_name: $(this).attr('id'), val: $(this).data('payload')})
	} else {
	    $.post('/send_ser', {id_name: $(this).attr('id'), val: $(this).parent().next().children('.setting-input').val()})
    }
})

$(document).on('click', '.dash-btn-send', function() {
	console.log('otg send btn clicked')
	console.log()
	console.log($(this).siblings().val())
	$.post('/send_msg_by_name', {msg_name: $('.select-dropdown').find('.selected').children().html(), val: $(this).siblings().val()})
})

setInterval(function() {
	var eventlogbody = $('.eventlog-body')
	$.get('/eventCheck', function(data) {
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
