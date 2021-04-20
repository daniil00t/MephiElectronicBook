/* 
* Notation:
* 1. summ_range(#1, #2) 				-> number; from #1 to #2 is range, incuding #2
* 2. summ_separate(#1, #2, ... #n) 	-> number; #i - diff cols
* 3. procents(#1, #2) 					-> number [0..100]; from #1 to #2 is range, including #2
* 4. count(#1, #2) 						-> number; from #1 to #2 is range, including #2
* 5. average(#1, #2) 					-> number; from #1 to #2 is range, including #2
* 6. convert(#1, pattern) 				-> number or string; #1 - col, pattern is ECTS or five scores tables
* 7. trashold(#1, min) 					-> bool; #1 - col, min - is minimum for col value 
* 8. default(#1) 							-> any; #1 - default value which we want returned
*
* @param formula(string)
* @return run(function)
*/

// Functions
const SUMM_RANGE     = "FUNCTION/SUMM_RANGE"
const SUMM_SEPARATE	= "FUNCTION/SUMM_SEPARATE"
const PROCENTS			= "FUNCTION/PROCENTS"
const COUNT				= "FUNCTION/COUNT"
const AVERAGE			= "FUNCTION/AVERAGE"
const CONVERT			= "FUNCTION/CONVERT"

// Others
const TRASHOLD 		= "OTHER/TRASHOLD"

// default and undefined
const DEFAULT			= "DEFAULT"
const UNDEFINED		= "UNDEFINED"




if(typeof(String.prototype.trim) === "undefined"){
	String.prototype.trim = function(){
		return String(this).replace(/^\s+|\s+$/g, '');
	}
}


const compileFormula = (formula) => {
	let alias 			= ""
	let arg1 			= -1
	let arg2 			= -1
	let separateCols 	= []
   switch(formula.split("(")[0]){
		case "summ_range": 		alias = SUMM_RANGE;break
		case "summ_separate": 	alias = SUMM_SEPARATE;break
		case "procents": 			alias = PROCENTS;break
		case "count": 				alias = COUNT;break
		case "average": 			alias = AVERAGE;break
		case "convert": 			alias = CONVERT;break
		case "trashold": 			alias = TRASHOLD;break
		case "default": 			alias = DEFAULT;break
		default: 					alias = UNDEFINED
	}
	const arguments = formula.split("(")[1].split(")")[0].split(",").map(el => el.trim())
	if(arguments.length > 2 || arguments.length < 2){
		separateCols = [...arguments]
	}
	else{
		arg1 = arguments[0]
		arg2 = arguments[1]
	}

	return {
		alias,
		arg1,
		arg2,
		separateCols
	}
}

const compileAndMake = (formula) => {
	const cmp = compileFormula(formula)
	const convert = [
		{
			ECTS: "A",
			five: 5,
			hundred: 100
		},
		{
			ECTS: "A",
			five: 5,
			hundred: 90
		},
		{
			ECTS: "B",
			five: 4,
			hundred: 85
		},
		{
			ECTS: "C",
			five: 4,
			hundred: 75
		},
		{
			ECTS: "D",
			five: 4,
			hundred: 70
		},
		{
			ECTS: "E",
			five: 3,
			hundred: 60
		},
		{
			ECTS: "F",
			five: 2,
			hundred: 59
		},
		{
			ECTS: "F",
			five: 2,
			hundred: 0
		}
	]
	switch(cmp.alias){
		case SUMM_RANGE:
			return (table, i) => {
				let summ = 0
				for (let index = cmp.arg1; index <= cmp.arg2; index++) {
					summ += +table[i][index]
				}
				return summ
			}
		case SUMM_SEPARATE:
			return (table, i) => {
				let summ = 0
				cmp.separateCols.map(col => summ += +table[i][col])
				return summ
			}
		case PROCENTS:
			return (table, i) => {
				let countCommon = cmp.arg2 - cmp.arg1 + 1
				let count = 0
				for (let index = cmp.arg1; index <= cmp.arg2; index++) {
					if(!!table[i][index]) count++
				}
				return Math.round(count / countCommon * 100)
			}
		case COUNT:
			return (table, i) => {
				let count = 0
				for (let index = cmp.arg1; index <= cmp.arg2; index++) {
					if(!!table[i][index]) count++
				}
				return count
			}
		case AVERAGE:
			return (table, i) => {
				let count = cmp.arg2 - cmp.arg1 + 1
				let summ = 0
				for (let index = cmp.arg1; index <= cmp.arg2; index++) {
					if(!!table[i][index]) summ += +table[i][index]
				}
				return Math.round(summ / count)
			}
		case CONVERT:
			return (table, i) => {
				for (let score = convert.length-1; score > 0; score--) {
					if(convert[score].hundred <= (+table[i][+cmp.arg1] || 0) && (+table[i][+cmp.arg1] || 0) < convert[score-1].hundred)
						return convert[score][cmp.arg2]
				}
				return convert[convert.length - 1][cmp.arg2]
			}
		case TRASHOLD:
			return (table, i) => {
				return +table[i][+cmp.arg1] >= +cmp.arg2
			}
		case DEFAULT:
			return (table, i) => {
				return table[i][cmp.separateCols[0]]
			}
		default:
			return (table, i) => {
				return null
			}
	}
}

// test table
const table = [
	["11", "10", "", "", "64"],
	["25", 0, "75", "", "91"],
	["25", "30", "14", "", "80"]
]
for (let i = 0; i < table.length; i++) {
	table[i][3] = compileAndMake("trashold(0, 25)")(table, i)
}
console.log(table)

// export default compileAndMake