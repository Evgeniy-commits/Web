// JavaScript source code
function Factorial() {
	let numberElement = document.getElementById("number");
	let number = numberElement.value;
	let resultElement = document.getElementById("factorial-result");
	resultElement.innerHTML = number;

	let f = BigInt(1);
	for (let i = 1n; i <= number; i++) { f *= i; }

	resultElement.textContent = `${number}! = ${f}`;
	//	resultElement.innerHTML = `${number}! = ${f}`;
}

function setImage() {
	let filename = document.getElementById("image-file");
	let reader = new FileReader();

	reader.onload = function (e) {
		document.getElementById("image").src = e.target.result;
	}
	reader.readAsDataURL(filename.files[0]);
}

/*const bgInput = document.getElementById('background-color');*/
/*const fgInput = document.getElementById('foreground-color');*/

//function setBackgroundColor(event)
//{
//	document.body.style.backgroundColor = event.target.value;
//	console.log(event.target.id);
//	//document.body.style.backgroundColor = document.getElementById("background-color").value;
//}
//function setForegroundColor()
//{
//	document.body.style.color = document.getElementById("foreground-color").value;
//}
//document.getElementById('background-color').addEventListener('input', setColor);
//document.getElementById('foreground-color').addEventListener('input', setColor);

//document.addEventListener('input', (e) => {
//	document.body.style[e.target.id === 'background-color' ? 'backgroundColor' : 'color'] = e.target.value;
//});
//function setColor(e) {
//	//if (event.target.id === 'background-color')
//	//	document.body.style.backgroundColor = event.target.value;
//	//else
//	//	document.body.style.color = event.target.value;
//	document.body.style[e.target.id === 'background-color' ? 'backgroundColor' : 'color'] = e.target.value;
//	console.log(e.target.id);
//}

document.addEventListener('mousemove', e => {
	document.getElementById('mouse').innerHTML = `X = ${e.clientX}, Y = ${e.clientY}`;
});
//function traceMouse(e) {
//	document.getElementById('mouse').innerHTML = `X = ${e.clientX}, Y = ${e.clientY}`;
//}

//document.getElementById('switch-background').addEventListener('click', switchBackground);
//function switchBackground(e) {
//	let switchButton = document.getElementById('switch-background');
//	switchButton.src = "sun.png";
//	document.getElementById('debug-background').innerHTML = switchButton.src;
//}

document.addEventListener('input', (e) => {
	document.body.style[e.target.id === 'background-color' ? 'backgroundColor' : 'color'] = e.target.value;
});
const skinButton = document.getElementById('switch-background');
skinButton.addEventListener('click', () => {
	if (skinButton) {
		document.body.style.backgroundColor = '';
		document.body.style.color = '';
	}
	document.body.className = document.body.className === "dark" ? "light" : "dark";
	//document.body.classList.toggle('dark');
	//document.body.classList.toggle('light');
	//let skin = document.body.className;
	//let switchButton = document.getElementById('switch-background');
	//switchButton.src = skin === "dark" ? "moon.png" : "sun.png";
	//document.body.className = skin === "dark" ? "light" : "dark";
	///*document.getElementById('debug-background').innerHTML = switchButton.src;*/
	//document.getElementById('debug-background').innerHTML = document.body.className;
});

document.getElementById('switch-background-delay').addEventListener('change', setDelay);
function setDelay(e) {
	let delay = e.target.value;
	document.getElementById('switch-background').style.transition =
		document.body.style.transition =
		`color ${delay}s, background-color ${delay}s, background-image ${delay}s`;

}
