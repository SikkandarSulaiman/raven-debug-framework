var test_fw_tab = {
		"heater": {
		"material_icon": "local_fire_department",
		"tab_name": "Heater",
		"contents": [
			{
				"id_name": "heater_start",
				"type": "btn",
				"msg": "55 00 00 00 00 00 01 00 00 03 00 00 00 00 00 AA",
				"btn_name": "start"
			},
			{
				"id_name": "heater_max_hpad_t1",
				"type": "setting",
				"btn_name": "set max heater pad temp",
				"min_val": 15,
				"max_val": 90,
				"init_val": 70
			},
			{
				"id_name": "heater_stop",
				"type": "btn",
				"msg": "55 00 00 00 00 00 03 00 00 03 00 00 00 00 00 AA",
				"btn_name": "stop"
			},
			{
				"type": "minidash",
				"item_count": 2,
				"items": [
					{
						"id_name": "inlet_temp",
						"item_name": "Inlet fluid",
						"suffix": "<sup>o</sup>C"
					},
					{
						"id_name": "outlet_temp",
						"item_name": "Outlet fluid",
						"suffix": "<sup>o</sup>C"
					}
				]
			},
			{
				"type": "minidash",
				"item_count": 3,
				"items": [
					{
						"id_name": "hpad_1_temp",
						"item_name": "Heater pad 1",
						"suffix": "<sup>o</sup>C"
					},
					{
						"id_name": "heater_pwm_dc",
						"item_name": "Output PWM DC",
						"suffix": "%"
					},
					{
						"id_name": "hpad_2_temp",
						"item_name": "Heater pad 2",
						"suffix": "<sup>o</sup>C"
					}
				]
			}
		]
	},
	"sensors": {
		"material_icon": "sensors",
		"tab_name": "Sensors",
		"contents": [
			{
				"id_name": "sensor_start",
				"type": "btn",
				"btn_name": "start"
			},
			{
				"id_name": "sensor_stop",
				"type": "btn",
				"btn_name": "stop"
			}
		]
	},
	"valves": {
		"material_icon": "merge_type",
		"tab_name": "Valves",
		"contents": [
			{
				"id_name": "sensor_init",
				"type": "btn",
				"btn_name": "open valves"
			},
			{
				"id_name": "sensor_stop",
				"type": "btn",
				"btn_name": "close valves"
			}
		]
	},
	"mainpump": {
		"material_icon": "loop",
		"tab_name": "Mainpump",
		"contents": [
			{
				"id_name": "sensor_init",
				"type": "btn",
				"btn_name": "start pump"
			},
			{
				"id_name": "sensor_stop",
				"type": "btn",
				"btn_name": "stop pump"
			}
		]
	}
}