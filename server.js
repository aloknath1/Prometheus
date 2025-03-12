const express = require('express');
const client = require("prom-client");  //Metric Collection
const {doSomeHeavyTask} = require("./util");

const app = express();
const PORT = process.env.PORT || 8000;

const clientDefaultMetrics = client.collectDefaultMetrics;
clientDefaultMetrics({register: client.register});

app.get("/", (req, res) => {
    return res.json({message: `Hello from express server`});
});

app.get("/slow", async (req, res) => {
    try{
        const timeTaken = await doSomeHeavyTask();
        return res.json({
            status: "Success",
            message: `Heavy task completed in ${timeTaken} ms`
        });
    }catch(error){
        return res.status(500).json({status:"Error", error:"Internal Server Error"})
    }
});


app.get('/metrics', async(req, res) => {
    res.setHeader('Content-Type', client.register.contentType);
    const metrics = await client.register.metrics();
    res.send(metrics);
});

app.listen(PORT, () => {
    console.log(`Express server started at http://localhost:${PORT}`);
})