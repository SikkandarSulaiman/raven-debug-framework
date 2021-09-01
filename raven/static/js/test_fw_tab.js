var test_fw_tab = {
		"heater": {
		"material_icon": "local_fire_department",
		"tab_name": "Heater",
		"contents": [
			{
				"btn_id_name": "trig_heater_start",
				"type": "btn",
				"btn_name": "start"
			},
			{
				"btn_id_name": "trig_heater_max_hpad_t1",
				"disp_id_name": "disp_heater_max_hpad_t1",
				"suffix": "<sup>o</sup>C",
				"inp_id_name": "inp_heater_max_hpad_t1",
				"type": "setting",
				"btn_name": "set max heater pad temp",
				"min_val": 15,
				"max_val": 90,
				"init_val": 70
			},
			{
				"btn_id_name": "trig_heater_max_pwm_dc",
				"disp_id_name": "disp_heater_max_pwm_dc",
				"suffix": "%",
				"inp_id_name": "inp_heater_max_pwm_dc",
				"type": "setting",
				"btn_name": "set max heater pwm dc",
				"min_val": 500,
				"max_val": 1000,
				"init_val": 500
			},
			{
				"btn_id_name": "trig_heater_stop",
				"type": "btn",
				"btn_name": "stop"
			},
			{
				"type": "minidash",
				"item_count": 2,
				"items": [
					{
						"disp_id_name": "disp_inlet_temp",
						"item_name": "Inlet fluid",
						"suffix": "<sup>o</sup>C"
					},
					{
						"disp_id_name": "disp_outlet_temp",
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
						"disp_id_name": "disp_hpad_1_temp",
						"item_name": "Heater pad 1",
						"suffix": "<sup>o</sup>C"
					},
					{
						"disp_id_name": "disp_heater_pwm_dc",
						"item_name": "Output PWM DC",
						"suffix": "/10 %"
					},
					{
						"disp_id_name": "disp_hpad_2_temp",
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
				"btn_id_name": "trig_sensor_start",
				"type": "btn",
				"btn_name": "start"
			},
			{
				"btn_id_name": "trig_sensor_stop",
				"type": "btn",
				"btn_name": "stop"
			},
			{
				"type": "minidash",
				"item_count": 3,
				"items": [
					{
						"disp_id_name": "disp_perit_red",
						"item_name": "Peritonitis red",
						"suffix": ""
					},
					{
						"disp_id_name": "disp_perit_green",
						"item_name": "Peritonitis green",
						"suffix": ""
					},
					{
						"disp_id_name": "disp_perit_blue",
						"item_name": "Peritonitis blue",
						"suffix": ""
					}
				]
			},
			{
				"type": "minidash",
				"item_count": 2,
				"items": [
					{
						"disp_id_name": "disp_turb_top",
						"item_name": "Turbidity top ir",
						"suffix": ""
					},
					{
						"disp_id_name": "disp_turb_side",
						"item_name": "Turbidity side ir",
						"suffix": ""
					}
				]
			},
			{
				"type": "minidash",
				"item_count": 2,
				"items": [
					{
						"disp_id_name": "disp_door_st",
						"item_name": "Door opened",
						"suffix": ""
					},
					{
						"disp_id_name": "disp_cassette_st",
						"item_name": "Cassette inserted",
						"suffix": ""
					}
				]
			},
			{
				"type": "minidash",
				"item_count": 2,
				"items": [
					{
						"disp_id_name": "disp_hall_st",
						"item_name": "Hall sensor detected",
						"suffix": ""
					},
					{
						"disp_id_name": "disp_level_st",
						"item_name": "Level fluid detected",
						"suffix": ""
					}
				]
			}
		]
	},
	"pressure": {
		"material_icon": "compress",
		"tab_name": "Pressure",
		"contents": [
			{
				"btn_id_name": "trig_pressure_start",
				"type": "btn",
				"btn_name": "start"
			},
			{
				"type": "minidash",
				"item_count": 3,
				"items": [
					{
						"disp_id_name": "disp_lc1_act",
						"item_name": "Load cell 1 actual",
						"suffix": ""
					},
					{
						"disp_id_name": "disp_airpa_val_act",
						"item_name": "Air pressure actual",
						"suffix": " mbar"
					},
					{
						"disp_id_name": "disp_lc2_act",
						"item_name": "Load cell 2 actual",
						"suffix": ""
					}
				]
			},
			{
				"btn_id_name": "trig_pressure_zero_off",
				"type": "btn",
				"btn_name": "zero offset"
			},
			{
				"type": "minidash",
				"item_count": 3,
				"items": [
					{
						"disp_id_name": "disp_lc1_rel",
						"item_name": "Load cell 1 relative",
						"suffix": ""
					},
					{
						"disp_id_name": "disp_airpa_val_rel",
						"item_name": "Air pressure relative",
						"suffix": " mbar"
					},
					{
						"disp_id_name": "disp_lc2_rel",
						"item_name": "Load cell 2 relative",
						"suffix": ""
					}
				]
			},
			{
				"btn_id_name": "trig_pressure_2pt_calib",
				"type": "btn",
				"btn_name": "2pt calibration"
			},
			{
				"type": "minidash",
				"item_count": 2,
				"items": [
					{
						"disp_id_name": "disp_lc1_pa",
						"item_name": "Load cell 1 pressure",
						"suffix": " mbar"
					},
					{
						"disp_id_name": "disp_lc2_pa",
						"item_name": "Load cell 2 pressure",
						"suffix": " mbar"
					}
				]
			},
			{
				"btn_id_name": "trig_pressure_stop",
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
				"btn_id_name": "trig_sensor_init",
				"type": "btn",
				"btn_name": "open valves"
			},
			{
				"btn_id_name": "trig_sensor_stop",
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
				"btn_id_name": "trig_sensor_init",
				"type": "btn",
				"btn_name": "start pump"
			},
			{
				"btn_id_name": "trig_sensor_stop",
				"type": "btn",
				"btn_name": "stop pump"
			}
		]
	}
}