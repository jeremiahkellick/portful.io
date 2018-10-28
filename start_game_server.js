const getId = require('./get_id');

const randomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const randomVectorInMap = () => {
  const x = randomInt(0, 2500);
  const y = randomInt(0, 2500);
  return { x, y };
};

const startGameServer = io => {
  let objectsByOwnerId, objectCreationOptions, gameInProgress, state;
  const lobby = {};

  const restartGame = () => {
    objectsByOwnerId = {};
    objectCreationOptions = {};
    gameInProgress = false;
    state = { data: {}, actions: [] };

    for (let i = 0; i < 10; i++) {
      let id = getId();
      objectCreationOptions[id] = {
        id,
        type: 'tree',
        position: randomVectorInMap(),
        health: 100
      };

      id = getId();
      objectCreationOptions[id] = {
        id,
        type: 'explosiveCircle',
        position: randomVectorInMap(),
        health: 50
      };

      id = getId();
      objectCreationOptions[id] = {
        id,
        type: 'lootCrate',
        position: randomVectorInMap(),
        health: 50
      };

      id = getId();
      objectCreationOptions[id] = {
        id,
        type: 'medKit',
        position: randomVectorInMap(),
        health: 50
      };
    }
  };

  restartGame();

  const clearState = () => (state = { data: {}, actions: [] });
  io.on('connection', function(socket) {
    socket.on('join', name => {
      lobby[socket.id] = { name, ready: false };
      const players = {};
      Object.keys(lobby).forEach(id => {
        players[id] = { id, name: lobby[id].name };
      });
      socket.emit('players index', players);
      io.sockets.emit('player joined', { id: socket.id, name });
    });

    socket.on('ready', () => {
      if (lobby[socket.id] !== undefined) lobby[socket.id].ready = true;

      if (Object.values(lobby).every(player => player.ready)
          && Object.keys(lobby).length > 1 && !gameInProgress) {

        gameInProgress = true;
        Object.keys(lobby).forEach(socketId => {
          const socket = io.sockets.connected[socketId];
          if (socket) {
            socket.emit('start', Object.values(objectCreationOptions));
          }
        });
      }
    });

    socket.on('create', options => {
      if (options.ownerId !== undefined) {
        if (objectsByOwnerId[options.ownerId] === undefined) {
          objectsByOwnerId[options.ownerId] = [];
        }
        objectsByOwnerId[options.ownerId].push(options.id);
      }
      if (options.shouldSave !== false) {
        objectCreationOptions[options.id] = options;
      }
      io.sockets.emit('create', options);
    });

    socket.on('state', packet => {
      state.data = Object.assign(state.data, packet.data);
      packet.actions.forEach(action => {
        const syncronizerId = action.syncronizerId;
        const objectId = syncronizerId.slice(0, syncronizerId.length - 1);
        const options = objectCreationOptions[objectId];
        if (options !== undefined) handleAction(action, options);
      });
      state.actions = state.actions.concat(packet.actions);
    });

    socket.on('win', () => restartGame());

    socket.on('disconnect', () => {
      if (lobby[socket.id] !== undefined) {
        delete lobby[socket.id];
        io.sockets.emit('player left', socket.id);
        const playerIds = Object.keys(lobby);
        if (playerIds.length === 0) restartGame();
      }

      if (objectsByOwnerId[socket.id] !== undefined &&
          objectsByOwnerId[socket.id].length > 0) {

        Object.keys(objectCreationOptions).forEach(id => {
          if (objectsByOwnerId[socket.id].includes(id)) {
            delete objectCreationOptions[id];
          }
        });
        io.sockets.emit('destroy', objectsByOwnerId[socket.id]);
      }
    });
  });

  setInterval(() => {
    io.sockets.emit('state', state);
    clearState();
  }, 100);

  const handleAction = (action, options) => {
    switch (action.type) {
      case 'DAMAGE':
        options.health -= action.damage;
        if (options.health <= 0) delete objectCreationOptions[options.id];
        break;
      case 'HEAL':
        options.health = Math.min(options.health + action.amount, 100);
        break;
      default:
    }
  };
};

module.exports = startGameServer;
