/* 
* Notation:
* 1. summ(#1, #2) 						-> number; from #1 to #2 is range, incuding #2
* 2. summ_separate(#1, #2, ... #n) 	-> number; #i - diff cols
* 3. procents(#1, #2) 					-> number [0..100]; from #1 to #2 is range, including #2
* 4. count(#1, #2) 						-> number; from #1 to #2 is range, including #2
* 5. average(start)	 					-> number; from #1 to #2 is range, including #2
* 6. convert(#1, pattern) 				-> number or string; #1 - col, pattern is "ECTS" or "five" scores tables
* 7. trashold(#1, min, suc, nsuc) 	-> <suc> if true and <nsuc> if false; #1 - col, min - is minimum for col value 
* 8. ratio(#1, #2)						-> string fraction "5/11"
* 9. default(#1) 							-> any; #1 - default value which we want returned
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
const RATIO				= "FUNCTION/RATIO"

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


const compileFormula = (formula, curCol) => {
	let alias 			= ""
	let arg1 			= -1
	let arg2 			= -1
	let separateCols 	= []
   switch(formula.split("(")[0]){
		case "summ": 				alias = SUMM_RANGE;break
		case "summ_separate": 	alias = SUMM_SEPARATE;break
		case "procents": 			alias = PROCENTS;break
		case "count": 				alias = COUNT;break
		case "average": 			alias = AVERAGE;break
		case "convert": 			alias = CONVERT;break
		case "trashold": 			alias = TRASHOLD;break
		case "ratio": 				alias = RATIO;break
		case "default": 			alias = DEFAULT;break
		default: 					alias = UNDEFINED
	}
	const _arguments = formula.split("(")[1].split(")")[0].split(",").map(el => el.trim())
	if(_arguments.length > 2 || _arguments.length < 2){
		separateCols = [..._arguments]
	}
	else{
		arg1 = _arguments[0]
		arg2 = _arguments[1] == "#curCol"? curCol: _arguments[1]
	}

	return {
		alias,
		arg1,
		arg2,
		separateCols
	}
}

const compileAndMake = (formula, curCol) => {
	const cmp = compileFormula(formula, curCol)
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
	const success = "a"
	const notSuccess = "н/а"
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
				cmp.separateCols.length != 0?
					cmp.separateCols.map(col => summ += +table[i][col]):
					summ = +table[i][+cmp.arg1] + (+table[i][+cmp.arg2])
				return summ
			}
		case PROCENTS:
			return (table, i) => {
				let countCommon = +cmp.arg2 - cmp.arg1 + 1
				let count = 0
				for (let index = +cmp.arg1; index <= +cmp.arg2; index++) {
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
				let count = table[i].filter((el, index) => index >= cmp.separateCols[0] && !!el).length
				let summ = table[i].filter((el, index) => index >= cmp.separateCols[0] && !!el).reduce((acc, cur) => acc + (+cur), 0)

				// for (let index = cmp.separateCols[0]; index < table[i].length; index++) {
				// 	if(!!table[i][index]) summ += +table[i][index]
				// }
				return +((summ / count).toFixed(2)) || 0
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
				return +table[i][+cmp.separateCols[0]] >= +cmp.separateCols[1]? cmp.separateCols[2] : cmp.separateCols[3]
			}
		case RATIO:
			return (table, i) => {
				const length = +cmp.arg2 - cmp.arg1 + 1
				// const count =  table[i].filter((el, index) => !!el && index <= cmp.arg2).length
				let count = 0
				for (let index = +cmp.arg1; index <= +cmp.arg2; index++) {
					if(!!table[i][index]) count++
				}
				return `${count}/${length}`
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

// // test table
// const table = [
// 	["+", "10", "", "", "40"],
// 	["25", "", "", "", "91"],
// 	["", "", "14", "", "80"]
// ]
// for (let i = 0; i < table.length; i++) {
// 	// table[i][3] = compileAndMake("trashold(0, 100, a, н/a)")(table, i)
// 	table[i][3] = compileAndMake("ratio(0, #curCol)", 0)(table, i)
// }
// console.log(table)

export default compileAndMake