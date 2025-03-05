import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/merchant/store-management": {};
  "/merchant/queue-manage": {};
  "/merchant/reminders": {};
  "/merchant/dashboard": {};
  "/merchant/queue": {};
  "/login": {};
  "/home": {};
};