var build_test_fw = function(test_fw_tab) {
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
		// tabicon_i2 = $('<i/>', {class: 'material-icons right', html: 'play_arrow'})

		for (var contindex in tab['contents']) {
			content = tab['contents'][contindex]
			menubodyrow_div = $('<div/>', {class: 'testfw-menu-body-row row'})
			col1_div = $('<div/>', {class: 'col s3'})
			col2_div = $('<div/>', {class: 'col s6'})
			col3_div = $('<div/>', {class: 'col s3'})
			btn_span = $('<span/>', {
				class: 'testfw-menu-body-row-cont single-item waves-effect waves-light btn',
				html: content['btn_name'],
				id: content['btn_id_name'],
				"data-msg": content['msg']
			})
			col2_div.append(btn_span)
			if ('setting' === content['type']) {
				var suffix = content['suffix']
				val_span = $('<span/>', {
					class: content['disp_id_name'] + ' testfw-menu-body-row-cont single-item setting-cur-val display-suffix',
					"data-suffix": suffix
				})
				col1_div.append(val_span)
				input_span = $('<input/>', {
					class: content['inp_id_name'],
					type: 'number',
					min: content['min_val'],
					max: content['max_val'],
					class: 'testfw-menu-body-row-cont setting-input',
				}).val(content['init_val'])
				col3_div.append(input_span)
			} else if ('minidash' === content['type']) {
				var id = content['items'][0]['disp_id_name']
				var suffix = content['items'][0]['suffix']
				itemname_span = $('<span/>', {
					class: 'testfw-menu-body-row-cont minidash-item-name',
					html: content['items'][0]['item_name']
				})
				itemval_div_default_classes = 'testfw-menu-body-row-cont single-item minidash-item-val setting-cur-val display-suffix'
				col1_div.append(itemname_span, $('<div/>', {'data-suffix': suffix, html: ''}).addClass(itemval_div_default_classes).addClass(id))
				col2_div.empty()
				id = content['items'][1]['disp_id_name']
				suffix = content['items'][1]['suffix']
				itemname_span.clone().text(content['items'][1]['item_name']).appendTo(col2_div)
				col2_div.append($('<div/>', {'data-suffix': suffix, html: ''}).addClass(itemval_div_default_classes).addClass(id))
				try {
					id = content['items'][2]['disp_id_name']
					suffix = content['items'][2]['suffix']
					itemname_span.clone().text(content['items'][2]['item_name']).appendTo(col3_div)
					col3_div.append($('<div/>', {'data-suffix': suffix, html: ''}).addClass(itemval_div_default_classes).addClass(id))
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
					id = content['items'][3]['disp_id_name']
					suffix = content['items'][3]['suffix']
					itemname_span.clone().text(content['items'][3]['item_name']).appendTo(col4_div)
					col4div.append($('<div/>', {'data-suffix': suffix, html: ''}).addClass(itemval_div_default_classes).addClass(id))
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

