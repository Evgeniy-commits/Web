// JavaScript source code
function calc()
{
	let base = parseFloat(document.getElementById('base').value);
	let exponent = parseFloat(document.getElementById('exponent').value);

	if (isNaN(base) || isNaN(exponent)) {
		document.getElementById('result').textContent = 'Пожалуйста, введите корректные числа.';
		return;
	}

	let result = BigInt(Math.pow(base, exponent));
	document.getElementById('result').innerHTML = `${base} <sup> <em>${exponent}</em> </sup> = ${result}`;
}