
let emptyStr = '(&nbsp;&nbsp;&nbsp;&nbsp;)'

function getInt(min, max) {
    return min + parseInt(Math.random() * (max - min));
}

function getOp() {
    return (getInt(0, 10) > 4) ? '+' : '-';
}

function run(test) {
    return eval(`(${test})`);
}

const expStr = function (adderArr, opArr) {
    let rt = [adderArr[0]];
    for (let i = 1; i < opArr.length; i++) {
        rt.push(` ${opArr[i]} ${adderArr[i]}`);
    }
    return rt.join('');
}

// a+b+c+d=?
function baseType1(max, adderNum) {

    const adder_num = adderNum;
    let adderArr = [];// a,b,c
    let opArr = ['+'];// +,+
    let answer = undefined;
    do {
        for (let i = 0; i < adder_num; i++) {
            adderArr[i] = a = getInt(0, max);
        }
        for (let i = 1; i < adder_num; i++) {
            opArr[i] = getOp();
        }
        answer = run(expStr(adderArr, opArr));// a + b + c
    } while (!(0 <= answer && answer <= max))

    return [`${expStr(adderArr, opArr)} = ${emptyStr}`, answer];
}

// a+?+c+d=e
function baseType2(max, adderNum) {
    let num = [];
    let lastNum = -1;
    let emptyIndex = getInt(0, adderNum);//0,1,2
    let op = ['+'];
    let answer = undefined;
    do {
        num[0] = getInt(0, max);
        for (let i = 0; i < adderNum; i++) {
            num[i] = (i == emptyIndex) ? '0' : getInt(0, max);// 暂时让填空的数字为0，则左边加减乘除均无影响
        }
        for (let i = 1; i < adderNum; i++) {
            op[i] = getOp();
        }
        lastNum = getInt(0, max);



        answer = run(`${op[emptyIndex]}(${lastNum} - (${expStr(num, op)}))`);
    } while (!(0 <= answer && answer <= max))

    num[emptyIndex] = emptyStr;
    return [`${expStr(num, op)} = ${lastNum}`, answer];
}


function test(output) {
    let exam = output[0];
    let result = output[1];
    let scriptStr = exam.replace(emptyStr, result).replace('=', '===');
    return eval(`(${scriptStr})`);
}





function page(withAnswer, max, adderNum) {


    let total = 100;
    let numPreLine = 4;
    let items = [];
    let uniqueItemMap = {};
    do {
        const problem = run(`baseType${getInt(1, 3)}(${max},${adderNum})`)
        if (!uniqueItemMap[problem[0]]) {
            uniqueItemMap[problem[0]] = true;
            items.push(problem);
        } else {
            console.log(`重复:${JSON.stringify(problem)}`)
        }
    } while (items.length < total)


    let buffer = [`<div class="record">得分： ______________</div>`];
    buffer.push('<table>');
    for (var i = 0; i < items.length; i++) {
        if ((i + 1) % numPreLine == 1) {
            buffer.push('<tr>');
        }
        buffer.push(`<td class='exam-item item'>${items[i][0]}</td>`);
        if ((i + 4) % numPreLine == 4) {
            buffer.push('</tr>');
        }
    }
    buffer.push('</table>');
    // $("#content").html(buffer.join(''))

    let buffer2 = [];
    if (withAnswer) {
        buffer2.push(`<div class="header">-------------------答案-------------------</div>`);
        buffer2.push('<table>');
        for (var i = 0; i < total; i++) {
            if ((i + 1) % numPreLine == 1) {
                buffer2.push('<tr>');
            }
            let withAnswer = items[i][0].replace(emptyStr, '(&nbsp;' + items[i][1] + '&nbsp;)');
            buffer2.push(`<td class='exam-item item'>${withAnswer}</td>`);
            if ((i + 4) % numPreLine == 4) {
                buffer2.push('</tr>');
            }
        }
        buffer2.push('</table>');
    }

    // $("#content2").html(buffer2.join(''))

    return [buffer, buffer2];
}


$(function () {
    $('button').on('click', function () {
        let copy = $($('input')[0]).val();
        let max = $($('input')[1]).val();
        let adderNum = $($('input')[2]).val();
        let printAnswer = $('select').val();
        $('#config').hide();
        for (var i = 0; i < copy; i++) {
            let p = page(printAnswer == 'true', max, adderNum);
            $(document.body).append(p[0].join(''));
            $(document.body).append(p[1].join(''));
        }
    })

})