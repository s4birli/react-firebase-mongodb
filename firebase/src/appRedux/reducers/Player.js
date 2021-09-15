import {
  NEW_PLAYER,
  GET_PLAYER,
  UPDATE_PLAYER,
  DELETE_PLAYER,
  UPDATE_NONE_PLAYERS
} from "../../constants/ActionTypes";

const INIT_STATE = {
  players: [],
  nonePlayers: []
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case NEW_PLAYER: {
      return { ...state, players: [...state.players, action.payload] };
    }

    case GET_PLAYER: {
      return { ...state, players: [...action.payload] };
    }

    case UPDATE_NONE_PLAYERS :{
      return { ...state, nonePlayers: [...action.payload] };
    }

    case UPDATE_PLAYER: {
      const data = state.players.map((player) => {
        if (player?._id === action?.payload?._id) {
          return action.payload;
        }

        return player;
      });

      return { ...state, players: data };
    }

    case DELETE_PLAYER: {
      const data = state.players.filter((player) => {
        if (player?._id === action?.payload) {
          return false;
        }

        return true;
      });

      return { ...state, players: data };
    }

    default:
      return state;
  }
};
