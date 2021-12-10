$('#simvals-trigger').on('click', function() {
    if ($(this).hasClass('selected-navkey')) return
    highlightMenuSelector($(this))
    hideDashboardElements()
    hideOtherMenuExcept($('#simvals-mainbody'))
})