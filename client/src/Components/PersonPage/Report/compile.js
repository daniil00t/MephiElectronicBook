/* 
* Notation:
* 1. summ_range(#1, #2)
* 2. summ_separate(#1, #2)
* 3. procents(#1, #2)
* 4. count(#1, #2)
* 5. average(#1, #2)
*
* @param formula(string)
* return run(function)
*/

const SUMM_RANGE     = "FUNCTION/SUMM_RANGE"
const SUMM_SEPARATE	= "FUNCTION/SUMM_SEPARATE"
const PROCENTS			= "FUNCTION/PROCENTS"
const COUNT				= "FUNCTION/COUNT"
const AVERAGE			= "FUNCTION/AVERAGE"

const DEFAULT			= "DEFAULT"
const UNDEFINED		= "UNDEFINED"

if(typeof(String.prototype.trim) === "undefined"){
	String.prototype.trim = function(){
		return String(this).replace(/^\s+|\s+$/g, '');
	}
}


const compileFormula = (formula) => {
	let alias 			= ""
	let startCol 		= -1
	let endCol 			= -1
	let separateCols 	= []
   switch(formula.split("(")[0]){
		case "summ_range": alias = SUMM_RANGE;break
		case "summ_separate": alias = SUMM_SEPARATE;break
		case "procents": alias = PROCENTS;break
		case "count": alias = COUNT;break
		case "average": alias = AVERAGE;break
		case "default": alias = DEFAULT;break
		default: alias = UNDEFINED
	}
	const arguments = formula.split("(")[1].split(")")[0].split(",").map(el => +el.trim())
	if(arguments.length > 2){
		separateCols = [...arguments]
	}
	else{
		startCol = arguments[0]
		endCol = arguments[1]
	}

	return {
		alias,
		startCol,
		endCol,
		separateCols
	}
}

const compileAndMake = (formula) => {
	const cmp = compileFormula(formula)

	switch(cmp.alias){
		case SUMM_RANGE:
			return (table, i) => {
				let summ = 0
				for (let index = cmp.startCol; index <= cmp.endCol; index++) {
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
				let countCommon = cmp.endCol - cmp.startCol + 1
				let count = 0
				for (let index = cmp.startCol; index <= cmp.endCol; index++) {
					if(!!table[i][index]) count++
				}
				return Math.round(count / countCommon * 100)
			}
		case COUNT:
			return (table, i) => {
				let count = 0
				for (let index = cmp.startCol; index <= cmp.endCol; index++) {
					if(!!table[i][index]) count++
				}
				return count
			}
		case AVERAGE:
			return (table, i) => {
				let count = cmp.endCol - cmp.startCol + 1
				let summ = 0
				for (let index = cmp.startCol; index <= cmp.endCol; index++) {
					if(!!table[i][index]) summ += +table[i][index]
				}
				return Math.round(summ / count)
			}
		case DEFAULT:
			return (table, i) => {
				return table[i][cmp.startCol]
			}
		default:
			return (table, i) => {
				return null
			}
	}
}

// test table
const table = [
	["11", "10", "", "", "41"],
	["25", 0, "11", "", "45"],
	["25", "30", "14", "", "80"],
]
for (let i = 0; i < table.length; i++) {
	table[i][3] = compileAndMake("default(0, 2)")(table, i)
}
console.log(table)

export default compileAndMake