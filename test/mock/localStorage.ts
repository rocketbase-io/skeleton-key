export const JWT_EXPIRED_TOKEN =
  "eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjU2NjI5NDUzNCwiZXhwIjo1NjYyOTgxMzQsInN1YiI6InRlc3QudXNlciIsInNjb3BlcyI6WyJST0xFX1VTRVIiXSwidXNlcl9pZCI6IjBjOWUxYzBkLTFiY2ItNDdlMy05ZDQzLWNhOGQ1YmI3MmVkZCIsImVtYWlsIjoiaGFucy5wZXRlckByb2NrZXRiYXNlLmlvIiwicGljdHVyZSI6Imh0dHBzOi8vcGljc3VtLnBob3Rvcy9pZC8zMjIvNTEyLzUxMi5qcGciLCJrdl9jdXN0b21lcl9pZCI6IjVkNTI1ODJjM2Q5OWYwODZiZjc5Mjk0ZSIsImt2X2NsaWVudF9pZCI6IjVkNDk2ZWU1ZjdjODUzMmQwNzczY2E2NCJ9.-aUIuWumHs37w6MkFvIBueun5ktHgHfPDoHjv9Gw6zQCvBR93yMMzCa_94br081bXZv3C0QXRT5ZzBSMMxre4Q";
export const JWT_VALID_TOKEN =
  "eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjU2NjI5NDUzNCwiZXhwIjoyNTMzOTYyOTgxMzQsInN1YiI6InRlc3QudXNlciIsInNjb3BlcyI6WyJST0xFX1VTRVIiXSwidXNlcl9pZCI6IjBjOWUxYzBkLTFiY2ItNDdlMy05ZDQzLWNhOGQ1YmI3MmVkZCIsImVtYWlsIjoiaGFucy5wZXRlckByb2NrZXRiYXNlLmlvIiwicGljdHVyZSI6Imh0dHBzOi8vcGljc3VtLnBob3Rvcy9pZC8zMjIvNTEyLzUxMi5qcGciLCJrdl9jdXN0b21lcl9pZCI6IjVkNTI1ODJjM2Q5OWYwODZiZjc5Mjk0ZSIsImt2X2NsaWVudF9pZCI6IjVkNDk2ZWU1ZjdjODUzMmQwNzczY2E2NCJ9.VNAP1Yp2oHB8y5N3PPnACdjVz3OXu2F3b8izppKe2muuchvklTkkxQfbxvIOoj-yixRw2HIDfqfIVmnArXbMbQ";

export const JWT_EXPIRED_REFRESH =
  "eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjU2NjI5NDUzNCwiZXhwIjo1Njg4ODY1MzQsInN1YiI6InRlc3QudXNlciIsInVzZXJfaWQiOiIwYzllMWMwZC0xYmNiLTQ3ZTMtOWQ0My1jYThkNWJiNzJlZGQiLCJzY29wZXMiOlsiUkVGUkVTSF9UT0tFTiJdfQ.4hE7Cs6W6XvKYB7WrSHHi8e1a_ji5ZFuWwIQiV7Pe5OsDOFHHFIdfhQkhnuWZGiusaPRuxsTWt2J-Xtvfbbn3A";
export const JWT_VALID_REFRESH =
  "eyJhbGciOiJIUzUxMiJ9.eyJpYXQiOjU2NjI5NDUzNCwiZXhwIjoyNTMzOTYyOTgxMzQsInN1YiI6InRlc3QudXNlciIsInVzZXJfaWQiOiIwYzllMWMwZC0xYmNiLTQ3ZTMtOWQ0My1jYThkNWJiNzJlZGQiLCJzY29wZXMiOlsiUkVGUkVTSF9UT0tFTiJdfQ.x8-tmuL1J47Pqg4ccNxV-ruajHUmNLZ-dozmXn0hz6YXdV3oYNOLBuOhbN2aUJPOmKa6dx-tWXYKEH7Pvcx0Mw";

export const USER_DATA = `{"id":"0c9e1c0d-1bcb-47e3-9d43-ca8d5bb72edd","username":"test.user","email":"hans.peter@rocketbase.io","avatar":"https://www.gravatar.com/avatar/1ed3eb609873a647a1fb94b3af24b556.jpg?s=160&d=retro","roles":["USER"],"keyValues":{"customer_id":"5d52582c3d99f086bf79294e","client_id":"5d496ee5f7c8532d0773ca64"},"enabled":true,"created":"2019-08-13T06:26:52.348Z","lastLogin":"2019-08-20T09:48:54.790Z"}`;

export const STORAGE_VALID_TOKEN = `{"jwtBundle":{"token":"${JWT_VALID_TOKEN}","refreshToken":"${JWT_VALID_REFRESH}"},"user": ${USER_DATA}}`;
export const STORAGE_EXPIRED_TOKEN = `{"jwtBundle":{"token":"${JWT_EXPIRED_TOKEN}","refreshToken":"${JWT_VALID_REFRESH}"},"user": ${USER_DATA}}`;
export const STORAGE_EXPIRED_REFRESH = `{"jwtBundle":{"token":"${JWT_EXPIRED_TOKEN}","refreshToken":"${JWT_EXPIRED_REFRESH}"},"user": ${USER_DATA}}`;
