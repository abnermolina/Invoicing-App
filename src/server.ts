import { app } from "./app";

// When running the server, it will listen on port 3333
app
  .listen({
    host: "0.0.0.0",
    port: 3333,
  })
  .then(() => {
    console.log("Server has Started............");
  });
