import axios from "axios";
import { USER_API_END_POINT } from "./constants";
import { setAuthReady, setUser } from "@/redux/authSlice";

export const loadUser = async (dispatch) => {
  try {
    const response = await axios.get(USER_API_END_POINT + "/me", { withCredentials: true });
    dispatch(setUser(response.data.user || null));
  } catch (error) {
    dispatch(setUser(null));
  } finally {
    dispatch(setAuthReady(true));
  }
};
