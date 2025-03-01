const express = require('express')
const rootRouter = require("./Routes/index")
const app = express()
app.use(express.json())

app.use("/api/v1" , rootRouter)

app.post("/" , (req , res) => {

    res.send({
        msg : "Hello server started"
    })
})


//https:localhost:3000/api/v1
app.listen(3000)