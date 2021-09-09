require("dotenv").config();
const Express = require("express");
const app = Express();
const dbConnection = require ("./db");

app.use(Express.json());

app.use(require("./middleware/headers"))

const controllers = require("./controllers")

app.use("/rev", controllers.revController);
app.use("/user", controllers.userController);

dbConnection.authenticate()
.then(() => dbConnection.sync())
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`[Server]: App is listening on ${process.env.PORT}`);
    });
})
.catch((err) => {
    console.log(`[Server]: Server crash. Error =${err}`);
});
