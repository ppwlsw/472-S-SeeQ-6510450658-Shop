import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/forget-password": {};
  "/reset-password": {};
  "/merchant/store-management": {};
  "/merchant/queue/:queue_id": {
    "queue_id": string;
  };
  "/merchant/queue-manage": {};
  "/merchant/reminders": {};
  "/merchant/dashboard": {};
  "/merchant/items": {};
  "/logout": {};
  "/login": {};
  "/home": {};
};