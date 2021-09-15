import {
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
  NEW_PLAYER,
  GET_PLAYER,
  UPDATE_PLAYER,
  DELETE_PLAYER,
  UPDATE_NONE_PLAYERS
} from '../../constants/ActionTypes';

import axios from 'util/Api';

export const newPlayer = (payload) => {
  return (dispatch) => {
    dispatch({ type: FETCH_START });
    axios
      .post('player', payload)
      .then(({ data }) => {
        if (data.result) {
          dispatch({ type: FETCH_SUCCESS });
          dispatch({ type: NEW_PLAYER, payload: data.player });
        } else {
          dispatch({ type: FETCH_ERROR, payload: data.error });
        }
      })
      .catch(function (error) {
        dispatch({ type: FETCH_ERROR, payload: error.message });
        console.log('Error****:', error.message);
      });
  };
};

export const updatePlayer = (payload) => {
  return (dispatch) => {
    dispatch({ type: FETCH_START });
    axios
      .put('player', payload)
      .then(({ data }) => {
        if (data.result) {
          dispatch({ type: FETCH_SUCCESS });
          dispatch({ type: UPDATE_PLAYER, payload: data.player });
        } else {
          dispatch({ type: FETCH_ERROR, payload: data.error });
        }
      })
      .catch(function (error) {
        dispatch({ type: FETCH_ERROR, payload: error.message });
        console.log('Error****:', error.message);
      });
  };
};

export const getPlayers = () => {
  return (dispatch) => {
    dispatch({ type: FETCH_START });
    axios
      .get('player')
      .then(({ data }) => {
        if (data.result) {
          dispatch({ type: FETCH_SUCCESS });
          dispatch({ type: GET_PLAYER, payload: data.players });
        } else {
          dispatch({ type: FETCH_ERROR, payload: data.error });
        }
      })
      .catch(function (error) {
        dispatch({ type: FETCH_ERROR, payload: error.message });
        console.log('Error****:', error.message);
      });
  };
};

export const getNonePlayers = () => {
  return (dispatch) => {
    dispatch({ type: FETCH_START });
    axios
      .get('player/players')
      .then(({ data }) => {
        if (data.result) {
          dispatch({ type: FETCH_SUCCESS });
          dispatch({ type: UPDATE_NONE_PLAYERS, payload: data.nonePlayers });
        } else {
          dispatch({ type: FETCH_ERROR, payload: data.error });
        }
      })
      .catch(function (error) {
        dispatch({ type: FETCH_ERROR, payload: error.message });
        console.log('Error****:', error.message);
      });
  };
};

export const deletePlayer = (id) => {
  return (dispatch) => {
    dispatch({ type: FETCH_START });
    axios
      .delete('player/' + id)
      .then(({ data }) => {
        if (data.result) {
          dispatch({ type: FETCH_SUCCESS });
          dispatch({ type: DELETE_PLAYER, payload: id });
        } else {
          dispatch({ type: FETCH_ERROR, payload: data.error });
        }
      })
      .catch(function (error) {
        dispatch({ type: FETCH_ERROR, payload: error.message });
        console.log('Error****:', error.message);
      });
  };
};
