import { app, config} from './app';

/** Fire up server **/
app.listen(config.app.port, () => {
  console.log("Server started");
});