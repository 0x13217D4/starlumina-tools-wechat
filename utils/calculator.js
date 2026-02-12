/**!
 *
 * Copyright(c) boyce and other contributors.
 * MIT Licensed
 *
 * Authors:
 *  boyce <boyce.ywr@gmail.com> (http://www.jianshu.com/users/9b5b907d9bce)
 */

'use strict'

const STATE = {
    INIT: 0,  //初始状态
    RESULT: 1,  //结果状态
    FIRST_UNDOT: 2,  //记录第一个操作数，且该操作数没有小数点
    FIRST_DOT: 3,   //记录第一个操作数，且该操作数有小数点
    SECOND_UNDOT: 4, //记录第二个操作数，且该操作数没有小数点
    SECOND_DOT: 5 //记录第二个操作数，且该操作数有小数点
}

let curState = STATE.INIT  //状态机所在状态
let curResult = 0   //计算结果
let opNum1 = '0'   //操作数1
let opNum2 = ''  //操作数2
let op = ''   //操作符

let displayNum = opNum1 //界面上应当显示的数值
let displayOp = ""  //界面上应当显示的操作符
let fullExpression = "" //完整的表达式显示

/**
 * 重置程序状态
 */
function reset() {
    curState = STATE.INIT
    curResult = 0
    opNum1 = '0'
    opNum2 = ''
    op = ''
}

/**
 * 是否为零
 */
function isZero(code) {
    return code == '0'
}

/**
 * 是否数字
 */
function isNumber(code) {
    return code >= '0' && code <= '9'
}

/**
 * 是否操作符
 */
function isOperator(code) {
    return code == '+' || code == '-'
        || code == 'x' || code == '/' || code == '%'
}

/**
 * 是否小数点
 */
function isDot(code) {
    return code == '.'
}

/**
 * 是否是等号
 */
function isEquel(code) {
    return code == '='
}

/**
 * 是否清楚
 */
function isClear(code) {
    return code == 'c'
}

/**
 * 是否删除
 */
function isDelete(code) {
    return code == 'd'
}

/**
 * 转换为可现实的操作符
 */
function op2Show(code) {
    return code == '/' ? '÷' : (code == 'x' ? '×' : code)
}

/**
 *
 */
function tryAppend(num, code) {
    if (num.length < 15) {
        num += code
    }
    return num
}

function tryTrunc(num) {
    let str = '' + num
    
    // 处理科学计数法
    if (str.includes('e')) {
        const parts = str.split('e')
        const mantissa = parseFloat(parts[0])
        const exponent = parseInt(parts[1])
        
        // 对于极大或极小的数，保持科学计数法但限制精度
        if (Math.abs(exponent) > 10) {
            return mantissa.toExponential(6).substring(0, 15)
        }
        
        // 对于中等大小的科学计数法，转换为普通数字
        const fullNum = parseFloat(str)
        if (Math.abs(fullNum) < 1e-10) {
            return '0'
        }
        str = fullNum.toString()
    }
    
    // 处理普通数字
    if (str.length > 15) {
        // 如果是整数，直接截断
        if (str.indexOf('.') === -1) {
            str = str.substr(0, 15)
        } else {
            // 如果是小数，保留有效数字
            const decimalIndex = str.indexOf('.')
            const integerPart = str.substring(0, decimalIndex)
            const decimalPart = str.substring(decimalIndex + 1)
            
            if (integerPart.length >= 15) {
                str = integerPart.substr(0, 15)
            } else {
                const maxDecimalLength = 15 - integerPart.length - 1
                str = integerPart + '.' + decimalPart.substr(0, maxDecimalLength)
            }
        }
    }
    
    // 移除末尾的零和小数点
    str = str.replace(/\.?0+$/, '')
    
    // 如果结果为空，返回0
    if (str === '' || str === '-' || str === '.') {
        return '0'
    }
    
    return str
}

/**
 *
 */
function tryDelete() {
    if (curState == STATE.SECOND_DOT
        || curState == STATE.SECOND_UNDOT) {
        if (opNum2.length > 0) {
            opNum2 = opNum2.substr(0, opNum2.length - 1)
        }
        if (opNum2 == '') {
            opNum2 = '0'
        }
        return
    } else {
        if (opNum1.length > 0 && opNum1 != '0') {
            opNum1 = opNum1.substr(0, opNum1.length - 1)
        }
        if (opNum1 == '') {
            opNum1 = '0'
        }
        return
    }
}

function tryCalc() {
    let n1 = parseFloat(opNum1)
    let n2 = parseFloat(opNum2)
    switch (op) {
        case '+':
            curResult = n1 + n2
            break
        case '-':
            curResult = n1 - n2
            break
        case 'x':
            curResult = n1 * n2
            break
        case '/':
            if (n2 == 0) {
                reset()
                curResult = 'NaN'
                displayOp = ''
            } else {
                curResult = n1 / n2
            }
            break
        case '%':
            if (n2 == 0) {
                reset()
                curResult = 'NaN'
                displayOp = ''
            } else {
                curResult = n1 % n2
            }
            break
    }
    curResult = tryTrunc(curResult)
}

function addOp(code) {
    switch (curState) {
        case STATE.RESULT:
        case STATE.INIT:
            if (isNumber(code) && !isZero(code)) {
                curState = STATE.FIRST_UNDOT
                opNum1 = code
                fullExpression = code
            } else if (isDot(code)) {
                curState = STATE.FIRST_DOT
                opNum1 = '0.'
                fullExpression = '0.'
            } else if (isOperator(code)) {
                curState = STATE.SECOND_UNDOT
                opNum1 = '0'
                opNum2 = ''
                op = code
                fullExpression = '0' + op2Show(code)
            }
            displayNum = opNum1
            displayOp = ''
            break
        case STATE.FIRST_UNDOT:
            displayOp = ''
            if (isNumber(code)) {
                if (!isZero(opNum1)) {
                    opNum1 = tryAppend(opNum1, code)
                    fullExpression = tryAppend(fullExpression, code)
                } else {
                    opNum1 = code
                    fullExpression = code
                }
            } else if (isDot(code)) {
                curState = STATE.FIRST_DOT
                opNum1 = opNum1 == '' ? '0' : tryAppend(opNum1, '.')
                fullExpression = tryAppend(fullExpression, '.')
            } else if (isDelete(code)) {
                tryDelete()
                fullExpression = opNum1
            } else if (isOperator(code)) {
                curState = STATE.SECOND_UNDOT
                op = code
                opNum2 = ''
                displayOp = op
                fullExpression = opNum1 + op2Show(code)
            }
            displayNum = opNum1
            break
        case STATE.FIRST_DOT:
            displayOp = ''
            if (isNumber(code)) {
                opNum1 = tryAppend(opNum1, code)
                fullExpression = tryAppend(fullExpression, code)
            } else if (isDelete(code)) {
                tryDelete()
                fullExpression = opNum1
                if (opNum1.indexOf('.') < 0)
                    curState = STATE.FIRST_UNDOT
            } else if (isOperator(code)) {
                curState = STATE.SECOND_UNDOT
                op = code
                opNum2 = ''
                displayOp = op
                fullExpression = opNum1 + op2Show(code)
            }
            displayNum = opNum1
            break
        case STATE.SECOND_UNDOT:
            if (isNumber(code)) {
                if (!isZero(opNum2)) {
                    opNum2 = tryAppend(opNum2, code)
                    fullExpression = tryAppend(fullExpression, code)
                } else {
                    opNum2 = code
                    fullExpression = fullExpression.slice(0, -1) + code
                }
                displayNum = opNum2
            } else if (isDot(code)) {
                curState = STATE.SECOND_DOT
                opNum2 = opNum2 == '' ? '0' : tryAppend(opNum2, '.')
                fullExpression = tryAppend(fullExpression, '.')
                displayNum = opNum2
            } else if (isDelete(code)) {
                tryDelete()
                fullExpression = opNum1 + op2Show(op) + opNum2
                displayNum = opNum2
            } else if (isOperator(code)) {
                if (opNum2 != '') {
                    //直接计算
                    tryCalc()
                    curState = STATE.SECOND_UNDOT
                    opNum1 = curResult
                    opNum2 = ''
                    displayNum = curResult
                    fullExpression = curResult + op2Show(code)
                }
                op = code
                displayOp = op
                fullExpression = opNum1 + op2Show(code)
            } else if (isEquel(code)) {
                if (opNum2 != '') {
                    tryCalc()
                    curState = STATE.RESULT
                    opNum1 = '0'
                    opNum2 = ''
                    displayNum = curResult
                    fullExpression = opNum1 + op2Show(op) + opNum2 + '=' + curResult
                }
                op = code
                displayOp = op
            }
            break
        case STATE.SECOND_DOT:
            if (isNumber(code)) {
                opNum2 = tryAppend(opNum2, code)
                fullExpression = tryAppend(fullExpression, code)
                displayNum = opNum2
            } else if (isDelete(code)) {
                tryDelete()
                fullExpression = opNum1 + op2Show(op) + opNum2
                if (opNum2.indexOf('.') < 0)
                    curState = STATE.SECOND_UNDOT
                displayNum = opNum2
            } else if (isOperator(code)) {
                if (opNum2 != '') {
                    //直接计算
                    tryCalc()
                    curState = STATE.SECOND_UNDOT
                    opNum1 = curResult
                    opNum2 = ''
                    displayNum = curResult
                    fullExpression = curResult + op2Show(code)
                }
                op = code
                displayOp = op
                fullExpression = opNum1 + op2Show(code)
            } else if (isEquel(code)) {
                if (opNum2 != '') {
                    tryCalc()
                    curState = STATE.RESULT
                    opNum1 = '0'
                    opNum2 = ''
                    displayNum = curResult
                    fullExpression = opNum1 + op2Show(op) + opNum2 + '=' + curResult
                }
                op = code
                displayOp = op
            }
            break
    }
    if (isClear(code)) {
        reset()
        displayNum = opNum1
        displayOp = ''
        fullExpression = ''
    }
    displayOp = op2Show(displayOp)
}

reset()

module.exports = {
    reset, addOp, getVars(){
        return {curState, curResult, opNum1, opNum2, op, displayNum, displayOp, fullExpression}
    }
}
