
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

//type1 a+b=?
function type1(max) {
    let a = -1;
    let b = -1;
    let op = '+';
    let answer = undefined;
    do {
        a = getInt(0, max);
        b = getInt(0, max);
        op = getOp();
        answer = run(`${a} ${op} ${b}`);
    } while (!(0 <= answer && answer <= max))

    return [`${a} ${op} ${b} = ${emptyStr}`, answer];
}

function test(output) {
    let exam = output[0];
    let result = output[1];
    let scriptStr = exam.replace(emptyStr, result).replace('=', '===');
    return eval(`(${scriptStr})`);
}

//type1 a+()=b?
function type2(max) {
    let num = [-1];
    let lastNum = -1;
    let emptyIndex = getInt(0, 2);//0,1
    let op = ['+'];
    let answer = undefined;
    do {
        num[0] = getInt(0, max);
        lastNum = getInt(0, max);
        op[0] = getOp();



        answer = run(`${emptyIndex == 1 ? op : ''}(${lastNum}-(${emptyIndex == 0 ? op : ''}${num[0]}))`);
    } while (!(0 <= answer && answer <= max))


    return [`${emptyIndex == 0 ? emptyStr : num[0]} ${op} ${emptyIndex == 1 ? emptyStr : num[0]} = ${lastNum}`, answer];
}


function page(withAnswer) {


    let total = 100;
    let numPreLine = 4;
    let items = [];
    let uniqueItemMap = {};
    do {
        const problem = run(`type${getInt(1, 3)}(20)`)
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
        let copy = $('input').val();
        $('#config').hide();
        for (var i = 0; i < copy; i++) {
            let p = page(false);
            $(document.body).append(p[0].join(''));
            $(document.body).append(p[1].join(''));
        }
    })

})