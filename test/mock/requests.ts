import mock from "xhr-mock";
import { urlAbsolute } from "src";
import { JWT_VALID_TOKEN, USER_DATA } from "./localStorage";

export function authMe(status: number = 200) {
  if (status === 200) mock.get(urlAbsolute("/auth/me"), (req, res) => {
    expect(req.header("Authorization")).toEqual(`Bearer ${JWT_VALID_TOKEN}`);
    res.status(200);
    res.header("Content-Type", "application/json");
    res.body(USER_DATA);
    return res;
  });

  if (status === 401) mock.get(urlAbsolute("/auth/me"), (req, res) => {
    res.status(401);
    res.header("Content-Type", "application/json");
    res.body("401 Unauthorized");
    return res;
  });
}
