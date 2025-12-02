import axios from "axios";
import { USER_API_END_POINT } from "./constants";
import { setUser } from "@/redux/authSlice";

export const loadUser = async (dispatch) => {
  try {
    const res = await axios.get(`${USER_API_END_POINT}/me`, {
      withCredentials: true,
    });

    if (res.data.success) {
      dispatch(setUser(res.data.user));
    }
  } catch (error) {
    dispatch(setUser(null));
  }
};
