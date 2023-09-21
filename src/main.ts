import app from "./app";

const port = 3000;

try {
  console.log(`Trying to run in ${process.env["NODE_ENV"]?.trim()} enviroment`);
  app.listen(port, (): void => {
    console.log(`Listening on port ${port}`);
  });
} catch (error) {
  console.error(`Error occured: ${error}`);
}
