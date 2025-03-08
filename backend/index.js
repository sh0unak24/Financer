const express = require('express')
const rootRouter = require("./Routes/index")
const app = express()
const cors = require("cors")
app.use(cors())
app.use(express.json())

app.use("/api/v1" , rootRouter)

app.post("/" , (req , res) => {

    res.send({
        msg : "Hello server started"
    })
})



app.listen(3000)