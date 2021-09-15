import {
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
  NEW_TEAM,
  GET_TEAM,
  UPDATE_TEAM,
  DELETE_TEAM,
} from "../../constants/ActionTypes";

import axios from "util/Api";

export const newTeam = (payload) => {
  return (dispatch) => {
    dispatch({ type: FETCH_START });
    axios
      .post("team", payload)
      .then(({ data }) => {
        if (data.result) {
          dispatch({ type: FETCH_SUCCESS });
          dispatch({ type: NEW_TEAM, payload: data.team });
        } else {
          dispatch({ type: FETCH_ERROR, payload: data.error });
        }
      })
      .catch(function (error) {
        dispatch({ type: FETCH_ERROR, payload: error.message });
        console.log("Error****:", error.message);
      });
  };
};

export const updateTeam = (payload) => {
  return (dispatch) => {
    dispatch({ type: FETCH_START });
    axios
      .put("team", payload)
      .then(({ data }) => {
        if (data.result) {
          dispatch({ type: FETCH_SUCCESS });
          dispatch({ type: UPDATE_TEAM, payload: data.team });
        } else {
          dispatch({ type: FETCH_ERROR, payload: data.error });
        }
      })
      .catch(function (error) {
        dispatch({ type: FETCH_ERROR, payload: error.message });
        console.log("Error****:", error.message);
      });
  };
};

export const getTeams = () => {
  return (dispatch) => {
    dispatch({ type: FETCH_START });
    axios
      .get("team")
      .then(({ data }) => {
        if (data.result) {
          dispatch({ type: FETCH_SUCCESS });
          dispatch({ type: GET_TEAM, payload: data.teams });
        } else {
          dispatch({ type: FETCH_ERROR, payload: data.error });
        }
      })
      .catch(function (error) {
        dispatch({ type: FETCH_ERROR, payload: error.message });
        console.log("Error****:", error.message);
      });
  };
};

export const deleteTeam = (id) => {
  return (dispatch) => {
    dispatch({ type: FETCH_START });
    axios
      .delete("team/" + id)
      .then(({ data }) => {
        if (data.result) {
          dispatch({ type: FETCH_SUCCESS });
          dispatch({ type: DELETE_TEAM, payload: id });
        } else {
          dispatch({ type: FETCH_ERROR, payload: data.error });
        }
      })
      .catch(function (error) {
        dispatch({ type: FETCH_ERROR, payload: error.message });
        console.log("Error****:", error.message);
      });
  };
};
