RP_METAS = {
	"att" : {
		"curCol" : None,
		"firstCol" : 4
	},
	"score" : {
		"curCol" : None,
		"firstCol" : 3
	},
	"ch" : {
		"numParts" : 2
	}
}

RP_TEMPLATES = {
	"att" : [
		{
			"name" 	: "№",
			"type" 	: "number",
			"enable": False
		},
		{
			"name"	: "ФИО",
			"type"	: "string",
			"enable": False
		},
		{
			"name"  : "÷",
			"type"  : "string",
			"enable": False,

			"formula" : "ratio(4, #curCol)" #?
		},
		{
			"name" 	: "%",
			"type" 	: "number",
			"enable": False,

			"formula" : "percent(4, #curCol)" #?
		},
		{
			"name" 	: "Dates",
			"type" 	: "string",
			"enable": True
		}
	],
	"score" : [
		{
			"name" 	: "№",
			"type" 	: "number",
			"enable": False
		},
		{
			"name"	: "ФИО",
			"type"	: "string",
			"enable": False
		},
		{
			"name" 	: "~",
			"type" 	: "number",
			"enable": False,

			"formula" : "avarage(3, #curCol)" #?
		},
		{
			"name" 	: "Dates",
			"type" 	: "number",
			"enable": True
		}
	],
	"ch" : [
		{
			"name" 	: "№",
			"type" 	: "number",
			"enable": False
		},
		{
			"name"	: "ФИО",
			"type"	: "string",
			"enable": False
		},
		{
			"name"  : "Раздел 1",
			"type"  : "number",
			"enable": True,

			"max"   : 25
		},
		{
			"name"  : "Раздел 2",
			"type"  : "number",
			"enable": True,

			"max"   : 25
		},
		{
			"name" 	: "Σ",
			"type" 	: "number",
			"enable": False,

			"formula" : "summ(2, 3)"
		},
		{
			"name" 	: "Аттестация",
			"type"	: "choose",
			"enable": True,

			"formula" : "trashold(4, 30, а, н/а)"
		},
		{
			"name" 	: "Экзамен",
			"type" 	: "number",
			"enable": True,

			"max"   : 50
		},
		{
			"name" 	: "Итог",
			"type" 	: "number",
			"enable": False,

			"formula" : "summ_separate(4, 6)"
		},
		{
			"name"  : "ECTS",
			"type"  : "string",
			"enable": False,

			"formula" : "convert(7, ECTS)"
		}
	]
}