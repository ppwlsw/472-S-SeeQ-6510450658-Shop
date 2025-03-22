import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/merchant/store-management": {};
  "/merchant/queue/:queue_id": {
    "queue_id": string;
  };
  "/merchant/queue-manage": {};
  "/merchant/reminders": {};
  "/merchant/dashboard": {};
  "/logout": {};
  "/login": {};
  "/home": {};
};