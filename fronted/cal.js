var historyData = []; // 存放历史记录
var results = []; // 用于存放结果与历史数据拼接的记录

function append_number(num) {
    // 追加数字到显示框
    document.form.show.value += num;
    return document.form.show.value;
}

function append_operator(op) {
    var text = document.form.show.value;
    var length = text.length;

    // 如果最后一个字符不是数字，则删除最后一个字符
    if (text[length - 1] < '0' || text[length] > '9') {
        document.form.show.value = text.substring(0, length - 1);
    }

    // 追加运算符到显示框
    document.form.show.value += op;
}

function display_special(op) {
    var text = document.form.show.value;
    text += op;
    document.form.show.value = text;
}

function perform_calculation() {
    try {
        var expression = document.form.show.value;

        if (expression) {
            document.form.show.value = eval(expression);

            // 处理除以零的情况
            if (eval(expression) === Infinity) {
                document.form.show.value = "error";
            }

            var result = eval(expression);

            // 发送历史记录到服务器
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://127.0.0.1:5000/get_history', true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    console.log(xhr.responseText);
                }
            };
            const data = {
                expression: expression,
                result: result
            };
            xhr.send(JSON.stringify(data));
        }
    } catch {
        document.form.show.value = "error";
    }
}

function clear_display() {
    // 清空显示框
    document.form.show.value = "";
}

function calculate_sin() {
    perform_calculation();
    var angle = document.form.show.value;
    var sinValue = Math.sin(angle / 180 * Math.PI);
    sinValue = sinValue.toFixed(2);
    clear_display();
    document.form.show.value += sinValue;
}

function calculate_cos() {
    perform_calculation();
    var angle = document.form.show.value;
    var cosValue = Math.cos(angle / 180 * Math.PI);
    cosValue = cosValue.toFixed(2);
    clear_display();
    document.form.show.value += cosValue;
}

function calculate_tan() {
    perform_calculation();
    var angle = document.form.show.value;
    var tanValue = Math.tan(angle / 180 * Math.PI);
    tanValue = tanValue.toFixed(2);
    clear_display();
    document.form.show.value += tanValue;
}

function calculate_ln() {
    perform_calculation();
    document.form.show.value = Math.log10(document.form.show.value);
}

function remove_last_character() {
    // 删除最后一个字符
    var text = document.form.show.value;
    var length = text.length;
    document.form.show.value = text.substring(0, length - 1);
}

function calculate_sqrt() {
    perform_calculation();
    document.form.show.value = Math.sqrt(document.form.show.value);
}

function calculate_factorial(n) {
    let result = 1;
    for (let i = 1; i <= n; i++) {
        result *= i;
    }
    return result;
}

function calculate_factorial_and_display() {
    perform_calculation();
    document.form.show.value = calculate_factorial(document.form.show.value);
}

function handle_operation(str) {
    if (str >= '0' && str <= '9') {
        append_number(str);
    }
    if (str === '+' || str === '*' || str === '/' || str === '-' || str === '.' || str === '%') {
        append_operator(str);
    }
    if (str === 'sin') {
        calculate_sin();
    }
    if (str === 'cos') {
        calculate_cos();
    }
    if (str === 'tan') {
        calculate_tan();
    }
    if (str === 'ln') {
        calculate_ln();
    }
    if (str === 'x!') {
        calculate_factorial_and_display();
    }
    if (str === '=') {
        perform_calculation();
    }
    if (str === 'AC') {
        clear_display();
    }
    if (str === 'sqrt') {
        calculate_sqrt();
    }
    if (str === 'BACK') {
        remove_last_character();
    }
    return document.form.show.value;
}

function fetch_history() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://127.0.0.1:5000/get_calculation', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                data = JSON.parse(xhr.responseText);
                records = data['data'];
                let historyText = "";
                for (let i = 0; i < records.length; i++) {
                    historyText += records[i][0] + " = " + records[i][1] + "\n";
                }
                document.form.show.value = historyText;
            }
        }
    };
    xhr.send();
}
