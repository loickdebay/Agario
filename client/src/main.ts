import { io } from 'socket.io-client';
import { Player } from './Player';
import { Map } from './Map';
import { Skins } from './Skins';

const socket = io();
const player = new Player();
let scoreboard: Player[] = [];
let map = new Map();
let toggleEndPossibility = false;
const popupContainer = document.querySelector('.popup-container') as HTMLElement;
const usernameInput = document.querySelector('#username-input') as HTMLFormElement;
const startButton = document.querySelector('#start-button') as HTMLElement;

const popupButton = document.getElementById('popup-button') as HTMLElement;
const popupOverlay = document.querySelector('.popup-credits') as HTMLElement;
const closeButton = document.querySelector('.close-button') as HTMLElement;
const title = document.querySelector('.titleStyle') as HTMLElement;

popupButton.addEventListener('click', () => {
	popupOverlay.style.display = 'block';
});

closeButton.addEventListener('click', () => {
	popupOverlay.style.display = 'none';
});

popupContainer.style.display = 'flex';
startButton.addEventListener('click', () => {
	const username = usernameInput.value;
	popupContainer.style.display = 'none';
	title.style.display='none';
	startGame(username);
});
let scaling = 1;
let previousSize = 0;

function startGame(element: string) {
	scaling = 1;
	player.name = element;
	socket.emit('login', player.name);
	socket.once('start', (playerReceived, mapReceived) => {
		player.x = playerReceived.x;
		player.y = playerReceived.y;
		player.name = playerReceived.name;
		player.size = playerReceived.size;
		player.creationDate = playerReceived.creationDate;
		player.color = playerReceived.color;
		map = mapReceived;
		displayScoreboard();
		toggleEndPossibility = true;
	});
}
const canvas = document.querySelector('.gameCanvas') as HTMLCanvasElement,
	context = canvas.getContext('2d') as CanvasRenderingContext2D;
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

function endGame() {
	const endScreen = document.querySelector('#end-screen') as HTMLElement;
	const nameParagraph = document.querySelector('#end-player-name') as HTMLElement;
	const score = document.querySelector('.playerScore') as HTMLElement;
	const timeLivedElement = document.querySelector('#timeLived') as HTMLElement;
	if(!player.dieDate) player.dieDate = Date.now()
	player.size = previousSize
	const lifeTime = player.dieDate - player.creationDate;
	const minutes = Math.floor(lifeTime / 60000);
	const seconds = Math.floor((lifeTime % 60000) / 1000);
	timeLivedElement.innerHTML = `Vous avez survécu ${minutes} minutes et ${seconds} secondes`;
	score.innerHTML = "" + player.score;
	nameParagraph.innerHTML = player.name;
	endScreen.style.display = '';
	toggleEndPossibility = false;
	player.size = 0;
	updateMapBeforeStart(map);
	render();
	const element = document.querySelector('#restart-button') as HTMLElement;
	element.addEventListener('click', () => {
		//const username = usernameInput.value;
		endScreen.style.display = 'none';
		popupContainer.style.display = 'flex';

		//startGame(username);
	});
}
function render() {
	if (!player.isAlive && toggleEndPossibility) {
		player.dieDate = Date.now();
		endGame();
		return;
	}
	previousSize = player.size;
	console.log(player.size);
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	context.scale(scaling, scaling);

	context.save();
	context.translate(canvasWidth / 2 - player.x, canvasHeight / 2 - player.y);
	const gridSpacing = 100;
	context.beginPath();
	for (let x = 0; x < 10000; x += gridSpacing) {
		context.moveTo(x, 0);
		context.lineTo(x, 10000);
	}
	for (let y = 0; y < 10000; y += gridSpacing) {
		context.moveTo(0, y);
		context.lineTo(10000, y);
	}
	//easter egg
	if(player.name.toLowerCase()=='pacman'){
		context.strokeStyle = 'rgba(255, 255, 255, 0.2)';
	}else{
		context.strokeStyle = 'rgba(0, 0, 0, 0.2)';
	}
	context.stroke();

	//easter egg
	if(player.name.toLowerCase()=='pacman'){
		canvas.style.backgroundColor='black';
		map.foods.forEach(element => {
			element.color='yellow';
			const distance = Math.sqrt(
				(element.x - player.x) ** 2 + (element.y - player.y) ** 2
			);
			if (distance < canvasHeight + 200) {
				drawFood(element);
			}
		});
	}else{
		//affichage nourriture
		map.foods.forEach(element => {
			const distance = Math.sqrt(
				(element.x - player.x) ** 2 + (element.y - player.y) ** 2
			);
			if (distance < canvasHeight + 200) {
				drawFood(element);
			}
		});
	}
	//affichage joueurs
	map.players.forEach(element => {
		const distance = Math.sqrt(
			(element.x - player.x) ** 2 + (element.y - player.y) ** 2
		);
		if(distance - element.size < canvasHeight + 200) {
			drawPlayer(element);
			if(Skins[element.name.toLowerCase() as keyof typeof Skins] >=0){
				let img = new Image ();
				img.src=`images/skins/${element.name.toLowerCase()}.png`
				drawPlayerWithSkin(element, img);
			}
			else {
				drawName(element);
			}
		}
		
	});
	context.restore();
	context.setTransform(1, 0, 0, 1, 0, 0);
	displayScoreboard();
	requestAnimationFrame(render);
}

function drawFood(element: Player) {
	const size = element.size;
	context.fillStyle = element.color;
	context.beginPath();
	context.arc(element.x, element.y, size, 0, 2 * Math.PI);
	context.closePath();
	context.fill();
}

function drawPlayer(element: Player) {
	const size = element.size;
	context.fillStyle = element.color;
	context.beginPath();
	context.arc(element.x, element.y, size, 0, 2 * Math.PI);
	context.closePath();
	context.fill();
}

function drawPlayerWithSkin(element: Player, skinImage: HTMLImageElement) {
	const size = element.size;
	context.save();
	context.beginPath();
	context.arc(element.x, element.y, size, 0, 2 * Math.PI);
	context.closePath();
	context.clip();
	context.drawImage(skinImage, element.x - size, element.y - size, size * 2, size * 2);
	context.restore();
  }

function drawName(element: Player) {
	context.font = `${
		element.size - 10 < 40 ? (element.size - 10) / scaling : 40 / scaling
	}px sans-serif`;
	context.strokeStyle = 'black';
	context.textAlign = 'center';
	context.strokeText(element.name, element.x, element.y);
	context.fillStyle = 'white';
	context.fillText(element.name, element.x, element.y);
}

function updatePlayerSize(newSize: number) {
	if(!newSize || player.size === newSize) return
	const multiplier = Math.floor(newSize / 50);
	if (scaling < 0.25) return;
	scaling = 1 - multiplier * 0.04;
	canvasHeight = canvas.height / scaling;
	canvasWidth = canvas.width / scaling;
}

window.addEventListener('mousemove', event => {
	let x = event.clientX;
	let y = event.clientY;
	let newX = convertOldValueToNewScale(
		x,
		window.innerWidth * 0.25,
		window.innerWidth * 0.75,
		-1,
		1
	);
	let newY = convertOldValueToNewScale(
		y,
		window.innerHeight * 0.25,
		window.innerHeight * 0.75,
		-1,
		1
	);

	socket.emit('movement', newX, newY);
});

function convertOldValueToNewScale(
	old_value : number,
	old_min : number,
	old_max : number,
	new_min : number,
	new_max : number
) {
	if (old_value > old_max) {
		old_value = old_max;
	}
	if (old_value < old_min) {
		old_value = old_min;
	}
	let new_value =
		((old_value - old_min) / (old_max - old_min)) * (new_max - new_min) +
		new_min;
	return new_value;
}

socket.on('game', (newPlayer: Player, newMap: Map) => {
	if (player.size) updatePlayerSize(newPlayer?.size);
	player.x = newPlayer?.x;
	player.y = newPlayer?.y;
	player.size = newPlayer?.size;
	player.name = newPlayer?.name;
	newMap.players.sort((a, b) => {
		return a.size - b.size;
	});
	map = newMap;
});

socket.once('map', (newMap: Map) => {
	updateMapBeforeStart(newMap);
});

function updateMapBeforeStart(newMap: Map) {
	map = newMap;
	if (!player.isAlive) {
		socket.once('map', newMap => {
			updateMapBeforeStart(newMap);
		});
	}
}

socket.on('scoreboard', (givenScoreboard: Player[]) => {
	scoreboard = givenScoreboard.slice(0, 10);

	scoreboard.forEach(player => {
		if (!player.name) {
			player.name = 'Unnamed Player';
		}
		Object.defineProperty(player, 'score', {
			get: () => {
				if (!player.dieDate) return 0;
				const timeValue = (player.dieDate - player.creationDate) / 1000 / 60;
				const score = Math.floor(timeValue * player.size);
				return score;
			},
		});
	});
});

function displayScoreboard() {
	let html = `
	<thead>
				<tr>
				  <th>Rank</th>
				  <th>Score</th>
				  <th>Name</th>
				</tr>
			  </thead>
	`;
	html += `<tbody>`;
	for (let cpt = 0; cpt < scoreboard.length; cpt++) {
		html += `<tr>
	<td>${cpt + 1}</td>
	<td>${scoreboard[cpt].score}</td>
	<td>${scoreboard[cpt].name}</td>
  </tr>
	`;
	}
	html += `</tbody>`;
	const scoresContainer = document.querySelector('.scoresContainer') as HTMLElement
	scoresContainer.innerHTML = html;
}

render();
