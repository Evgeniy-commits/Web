// JavaScript source code
function Fib()
{
	let input = document.getElementById('number');
	let res = document.getElementById('result');

	let n = Number(input.value);

	res.innerHTML = '';

	if (isNaN(n) || n <= 0)
	{
		res.textContent = "Введите целое положительное число"
		return
	}

	let seq = [];
	seq[0] = 0;
	seq[1] = 1;

	for (let i = 2; i < n; i++)
	{
		seq[i] = seq[i - 1] + seq[i - 2];
	}

	let result = `Ряд Фибоначчи до элемента номер ${n} => ${seq.join(', ')}`;
	res.textContent = result;
}