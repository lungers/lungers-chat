require(`dotenv`).config();

const express = require(`express`);
const http = require(`http`);
const socketIO = require(`socket.io`);
const app = express();
const server = http.Server(app);
const io = socketIO(server);
const users = new Map();

app.use(express.static(`${__dirname}/build`));

io.on(`connection`, socket => {
    socket.once(`join`, ({ name, room }) => {
        name = name && name.trim();
        room = room && room.trim();

        if (!name || !room) {
            return socket.disconnect();
        } else if (
            [...users.values()].find(
                user =>
                    user.room === room &&
                    user.name.toLowerCase() === name.toLowerCase()
            )
        ) {
            socket.emit(`name-taken`);
            return socket.disconnect();
        }

        const user = {
            id: socket.id,
            name: name,
            room: room,
        };

        socket.join(room);
        users.set(socket.id, user);

        io.to(room).emit(`user-connected`, {
            id: socket.id,
            name: name,
        });

        socket.emit(
            `users`,
            [...users.values()].filter(user => user.room === room)
        );
    });

    socket.on(`message`, message => {
        const user = users.get(socket.id);
        message = message.trim();

        if (user && message !== ``) {
            if (message.length > 2000) {
                socket.emit(`message`, message);
            } else {
                io.to(user.room).emit(`message`, {
                    message: message.trim(),
                    date: new Date(),
                    user: {
                        id: user.id,
                        name: user.name,
                    },
                });
            }
        }
    });

    socket.on(`disconnect`, () => {
        users.delete(socket.id);
        io.emit(`user-disconnected`, socket.id);
    });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening: http://localhost:${port}`);
});
