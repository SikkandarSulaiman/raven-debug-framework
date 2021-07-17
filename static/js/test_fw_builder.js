var build_test_fw = function() {
	console.log(test_fw_tab)
	var mainparent_div = $('#testfw-mainbody')
	var ulparent_div = $('<ul/>', {class: 'collapsible popout coll-testfw-cont'})

	for (var tabname in test_fw_tab) {
		tab = test_fw_tab[tabname]
		var newtab_li = $('<li/>', {
			id: tabname+'-menu',
			class: 'testfw-menu'
		})
		tablisthead_div = $('<div/>', {class: 'collapsible-header testfw-menu-header', html: tab['tab_name']})
		tablistbody_div = $('<div/>', {class: 'collapsible-body testfw-menu-body'})
		tabicon_i = $('<i/>', {class: 'material-icons', html: tab['material_icon']})
		tabicon_i2 = $('<i/>', {class: 'material-icons right', html: 'play_arrow'})

		for (var contindex in tab['contents']) {
			content = tab['contents'][contindex]
			menubodyrow_div = $('<div/>', {class: 'testfw-menu-body-row row'})
			col1_div = $('<div/>', {class: 'col s3'})
			col2_div = $('<div/>', {class: 'col s6'})
			col3_div = $('<div/>', {class: 'col s3'})
			btn_span = $('<span/>', {
				class: 'testfw-menu-body-row-cont single-item waves-effect waves-light btn',
				html: content['btn_name'],
				id: content['id_name'],
				"data-msg": content['msg']
			})
			col2_div.append(btn_span)
			if ('setting' === content['type']) {
				val_span = $('<span/>', {class: 'testfw-menu-body-row-cont single-item setting-cur-val', html:75})
				col1_div.append(val_span)
				input_span = $('<input/>', {
					type: 'number',
					min: content['min_val'],
					max: content['max_val'],
					class: 'testfw-menu-body-row-cont setting-input',
				}).val(content['init_val'])
				col3_div.append(input_span)
			} else if ('minidash' === content['type']) {
				var id = content['items'][0]['id_name']
				var suffix = content['items'][0]['suffix']
				itemname_span = $('<span/>', {
					class: 'testfw-menu-body-row-cont minidash-item-name',
					html: content['items'][0]['item_name']
				})
				itemval_div = $('<div/>', {
					class: 'testfw-menu-body-row-cont single-item minidash-item-val setting-cur-val',
					"data-suffix": suffix,
					html: '' + suffix,
					id: id
				}).val(1)
				col1_div.append(itemname_span, itemval_div)
				col2_div.empty()
				id = content['items'][1]['id_name']
				suffix = content['items'][1]['suffix']
				itemname_span.clone().text(content['items'][1]['item_name']).appendTo(col2_div)
				itemval_div.clone().val(1).html('' + suffix).attr("data-suffix", suffix).attr('id', id).appendTo(col2_div)
				try {
					id = content['items'][2]['id_name']
					suffix = content['items'][2]['suffix']
					itemname_span.clone().text(content['items'][2]['item_name']).appendTo(col3_div)
					itemval_div.clone().val(1).html(75 + suffix).attr("data-suffix", suffix).attr('id', id).appendTo(col3_div)
				} catch(err) {

				}
				if (2 === content['item_count']) {
					col1_div.removeClass('s3').addClass('s6')
					col3_div.removeClass('s3')
				} else if (3 === content['item_count']) {
					col1_div.removeClass('s3').addClass('s4')
					col2_div.removeClass('s6').addClass('s4')
					col3_div.removeClass('s3').addClass('s4')
				} else if (4 === content['item_count']) {
					col2_div.removeClass('s6').addClass('s3')
					col4_div = $('<div/>', {class: 'col s3'}) 
					itemname_span.clone().text(content['items'][3]['item_name']).appendTo(col4_div)
					itemval_div.clone().val(35).html(35 + content['items'][3]['suffix']).appendTo(col4_div)
					menubodyrow_div.append(col4_div)
				}
			}
			menubodyrow_div.prepend(col1_div, col2_div, col3_div)
			divider_div = $('<div/>', {class: 'divider'})
			tablistbody_div.append(menubodyrow_div, divider_div)
		}
		tablistbody_div.children().last().remove()

		tablisthead_div.prepend(tabicon_i)
		// tablisthead_div.append(tabicon_i2)
		newtab_li.append(tablisthead_div, tablistbody_div)
		ulparent_div.append(newtab_li)
	}
	mainparent_div.append(ulparent_div)
}
