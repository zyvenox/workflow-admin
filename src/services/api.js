const API_BASE_URL = "https://dummyjson.com";

const request = async (endpoint, options = {}) => {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      data?.message ||
        `Request failed with status ${response.status}`
    );

    error.status = response.status;

    throw error;
  }

  return data;
};

export const loginUser = async (
  username,
  password,
  signal
) => {
  return request("/auth/login", {
    method: "POST",
    signal,
    credentials: "include",
    body: JSON.stringify({
      username,
      password,
      expiresInMins: 30,
    }),
  });
};

export const getCurrentUser = async (
  accessToken,
  signal
) => {
  return request("/auth/me", {
    method: "GET",
    signal,
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getUsers = async ({
  limit = 10,
  skip = 0,
  search = "",
  role = "",
  signal,
}) => {
  const params = new URLSearchParams();

  params.set("limit", limit);
  params.set("skip", skip);

  params.set(
    "select",
    "id,firstName,lastName,email,age,image,role,company,username"
  );

  let endpoint = "/users";

  if (search.trim()) {
    endpoint = "/users/search";

    params.set("q", search.trim());
  } else if (role) {
    endpoint = "/users/filter";

    params.set("key", "role");
    params.set("value", role);
  }

  return request(`${endpoint}?${params.toString()}`, {
    signal,
  });
};

export const getUserById = async (
  userId,
  signal
) => {
  const params = new URLSearchParams();

  params.set(
    "select",
    [
      "id",
      "firstName",
      "lastName",
      "email",
      "age",
      "image",
      "role",
      "company",
      "username",
      "phone",
      "birthDate",
      "height",
      "weight",
      "address",
    ].join(",")
  );

  return request(
    `/users/${userId}?${params.toString()}`,
    {
      signal,
    }
  );
};

export const createUser = async (
  userData,
  signal
) => {
  return request("/users/add", {
    method: "POST",
    signal,
    body: JSON.stringify(userData),
  });
};