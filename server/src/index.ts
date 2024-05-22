import express from 'express';
import http from 'http';
import { Server as IOServer, Socket } from "socket.io";
import { Player } from './classes/Player';
import { Map as GameMap } from './classes/Map';
import addWebpackMiddleware from './addWebpackMiddleware';
import { writeFileSync, readFileSync } from 'fs';
import { scoreboard } from "./scoreboard"

scoreboard.scoreboard = Player.createPlayerArrayFromObjectArray(JSON.parse(readFileSync("./scoreboard.json", "utf-8")).scoreboard)


const app = express();
const httpServer = http.createServer(app);
addWebpackMiddleware(app)

const port = process.env.PORT || 8000;
httpServer.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});

const io = new IOServer(httpServer)

const mapLength = parseInt(process.env.MAP_LENGTH || "10000" as string)
const mapWidth = parseInt(process.env.MAP_WIDTH || "10000" as string) 

const players = new Map<string, Player>()
const sockets = new Map<string, Socket>()
const map = new GameMap(mapLength, mapWidth)


io.on('connection', socket => {

	console.log(`Nouvelle connexion du client ${socket.id}`);

	socket.on("login", (name: string) => {
		const player = new Player(mapLength / 2, mapWidth / 2, name, socket.id);
		while(map.playerIsInAnOtherPlayer(player)) {
			player.x = Math.floor(Math.random() * map.length)
			player.y = Math.floor(Math.random() * map.width);
		}
		players.set(socket.id, player)
		map.addPlayer(player)
		sockets.set(socket.id, socket)
		socket.emit("start", player, map)
	})

	socket.on("movement", (deltaX: number, deltaY: number) => {
		deltaX = checkDelta(deltaX)
		deltaY = checkDelta(deltaY)
		const player = players.get(socket.id)
		if(!player) return
		player.deltaX = deltaX;
		player.deltaY = deltaY;
	})

	socket.on("disconnect", () => {
		console.log(`Déconnexion du client ${socket.id}`);
		const player = players.get(socket.id);
		if(!player) return
		players.delete(socket.id);
		const index = map.players.indexOf(player);
		if(index === -1) return
		map.players.splice(index, 1);		
		player.addToScoreBoard()
	})

	/*setInterval(() => {
		map.movePlayers();
		map.collision();
		scoreboardUtilities();
		if(map.players.indexOf(players.get(socket.id) as Player) == -1) {
			players.delete(socket.id);
		}
		socket.emit("game", players.get(socket.id), map)
	}, 1000/60)*/
})



setInterval(() => {
	map.movePlayers();
	map.collision();
	scoreboardUtilities();
	map.players.forEach(player => {
		const socket = sockets.get(player.socketID as string)
		socket?.emit("game", player, map)
	})
	io.emit("scoreboard", scoreboard.scoreboard)
	io.emit("map", map)
}, 1000/60)

function scoreboardUtilities() {
	scoreboard.sort()
}

app.use(express.static("client/public"))

/*app.get("/", (req, res) => {
	return res.send(Player.createFood(map))
	res.send(players)
})*/

function checkDelta(delta: number): number {
	if(delta > 1) return 1;
	if(delta < -1) return -1;
	return delta
}

function saveScoreboard() {
	setTimeout(() => {
		writeFileSync("scoreboard.json", JSON.stringify(scoreboard, null, 4))
		saveScoreboard()
	}, 1000 * 60 * 1)
}

saveScoreboard()

process.on('warning', console.warn);
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);
process.on('removeListener', console.log);
process.on('rejectionHandled', console.error);