// JavaScript source code
function Factorial()
{
	let numberElement = document.getElementById("number");
	let number = numberElement.value;
	let resultElement = document.getElementById("factorial-result");
	resultElement.innerHTML = number;

	let f = BigInt(1);
	for (let i = 1n; i <= number; i++) { f *= i; }

	resultElement.textContent = `${number}! = ${f}`;
//	resultElement.innerHTML = `${number}! = ${f}`;
}