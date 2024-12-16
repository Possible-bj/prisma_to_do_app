import startServer from "./app.js";

(async()=>{
    const {PORT, app}= startServer();
    app.listen(PORT,()=>console.log(`app listening on ${PORT}`))
})()

