import {
  NEW_TEAM,
  GET_TEAM,
  UPDATE_TEAM,
  DELETE_TEAM
} from "../../constants/ActionTypes";

const INIT_STATE = {
  data: [],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case NEW_TEAM: {
      return { ...state, data: [...state.data, action.payload] };
    }

    case GET_TEAM: {
      return { ...state, data: [...action.payload] };
    }

    case UPDATE_TEAM: {
      const data = state.data.map((team) => {
        if (team?._id === action?.payload?._id) {
          return action.payload;
        }

        return team;
      });

      return { ...state, data: data };
    }

    case DELETE_TEAM: {
      const data = state.data.filter((team) => {
        if (team?._id === action?.payload) {
          return false;
        }

        return true;
      });

      return { ...state, data: data };
    }

    default:
      return state;
  }
};
