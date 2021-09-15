import {combineReducers} from "redux";
import Settings from "./Settings";
import Auth from "./Auth";
import Common from "./Common";
import Player from "./Player";
import {connectRouter} from 'connected-react-router'
import Team from "./Team";

export default (history) => combineReducers({
  router: connectRouter(history),
  settings: Settings,
  auth: Auth,
  common: Common,
  player: Player,
  team: Team
});
