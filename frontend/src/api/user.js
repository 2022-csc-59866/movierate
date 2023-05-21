import { catchError, getToken } from "../utils/helper";
import client from "./client";

export const searchUser = async (query) => {
  const token = getToken();

  try {
    const { data } = await client(`/user/search?name=${query}`, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const updateUser = async (id, formData) => {
  const token = getToken();

  try {
    const { data } = await client.post("/user/update/" + id, formData, {
      headers: {
        authorization: "Bearer " + token,
        "content-type": "application/json",
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const deleteUser = async (id) => {
  const token = getToken();

  try {
    const { data } = await client.delete("/user/" + id, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getUsers = async (pageNo, limit) => {
  const token = getToken();

  try {
    const { data } = await client(
      `/user/users?pageNo=${pageNo}&limit=${limit}`,
      {
        headers: {
          authorization: "Bearer " + token,
          "content-type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getUserProfile = async (id) => {
  try {
    const { data } = await client(`/user/single/${id}`);
    return data;
  } catch (error) {
    return catchError(error);
  }
};
