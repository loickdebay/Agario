"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const Player_1 = require("./classes/Player");
const Map_1 = require("./classes/Map");
const addWebpackMiddleware_1 = __importDefault(require("./addWebpackMiddleware"));
const fs_1 = require("fs");
const scoreboard_1 = require("./scoreboard");
scoreboard_1.scoreboard.scoreboard = Player_1.Player.createPlayerArrayFromObjectArray(JSON.parse((0, fs_1.readFileSync)("./scoreboard.json", "utf-8")).scoreboard);
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
(0, addWebpackMiddleware_1.default)(app);
const port = process.env.PORT || 8000;
httpServer.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
const io = new socket_io_1.Server(httpServer);
const mapLength = parseInt(process.env.MAP_LENGTH || "10000");
const mapWidth = parseInt(process.env.MAP_WIDTH || "10000");
const players = new Map();
const sockets = new Map();
const map = new Map_1.Map(mapLength, mapWidth);
io.on('connection', socket => {
    console.log(`Nouvelle connexion du client ${socket.id}`);
    socket.on("login", (name) => {
        const player = new Player_1.Player(mapLength / 2, mapWidth / 2, name, socket.id);
        while (map.playerIsInAnOtherPlayer(player)) {
            player.x = Math.floor(Math.random() * map.length);
            player.y = Math.floor(Math.random() * map.width);
        }
        players.set(socket.id, player);
        map.addPlayer(player);
        sockets.set(socket.id, socket);
        socket.emit("start", player, map);
    });
    socket.on("movement", (deltaX, deltaY) => {
        deltaX = checkDelta(deltaX);
        deltaY = checkDelta(deltaY);
        const player = players.get(socket.id);
        if (!player)
            return;
        player.deltaX = deltaX;
        player.deltaY = deltaY;
    });
    socket.on("disconnect", () => {
        console.log(`Déconnexion du client ${socket.id}`);
        const player = players.get(socket.id);
        if (!player)
            return;
        players.delete(socket.id);
        const index = map.players.indexOf(player);
        if (index === -1)
            return;
        map.players.splice(index, 1);
        player.addToScoreBoard();
    });
    /*setInterval(() => {
        map.movePlayers();
        map.collision();
        scoreboardUtilities();
        if(map.players.indexOf(players.get(socket.id) as Player) == -1) {
            players.delete(socket.id);
        }
        socket.emit("game", players.get(socket.id), map)
    }, 1000/60)*/
});
setInterval(() => {
    map.movePlayers();
    map.collision();
    scoreboardUtilities();
    map.players.forEach(player => {
        const socket = sockets.get(player.socketID);
        socket === null || socket === void 0 ? void 0 : socket.emit("game", player, map);
    });
    io.emit("scoreboard", scoreboard_1.scoreboard.scoreboard);
    io.emit("map", map);
}, 1000 / 60);
function scoreboardUtilities() {
    scoreboard_1.scoreboard.sort();
}
app.use(express_1.default.static("client/public"));
/*app.get("/", (req, res) => {
    return res.send(Player.createFood(map))
    res.send(players)
})*/
function checkDelta(delta) {
    if (delta > 1)
        return 1;
    if (delta < -1)
        return -1;
    return delta;
}
function saveScoreboard() {
    setTimeout(() => {
        (0, fs_1.writeFileSync)("scoreboard.json", JSON.stringify(scoreboard_1.scoreboard, null, 4));
        saveScoreboard();
    }, 1000 * 60 * 1);
}
saveScoreboard();
process.on('warning', console.warn);
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);
process.on('removeListener', console.log);
process.on('rejectionHandled', console.error);
//# sourceMappingURL=index.js.map