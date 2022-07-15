const express = require('express')
const userRouter = require('./routers/users')
const taskRouer = require('./routers/tasks')
require('./db/mongoose')

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter)
app.use(taskRouer)


app.listen(port, () => {
    console.log('Server started on port ' + port);
})