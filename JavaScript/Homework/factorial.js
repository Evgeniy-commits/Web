// JavaScript source code
function calcFact() {
    let input = document.getElementById('numInput');
    let res = document.getElementById('result');

    let n = Number(input.value);

    res.className = '';
    res.textContent = '';

    if (!Number.isInteger(n)) {
        res.className = 'error';
        res.textContent = 'Число должно быть целым';
        return;
    }

    if (n < 0) {
        res.className = 'error';
        res.textContent = 'Число должно быть положительным';
        return;
    }

    let fact = BigInt(1);
    for (let i = 2n; i <= n; i++) {
        fact *= i;
    }

    res.textContent = `${n}! = ${fact}.`
}