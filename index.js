const express = require('express');
const app = express();
const port = 3000;
const productRouter = require('./product.js');
app.use(express.json());

app.use('/product', productRouter);

app.use((req, res)=>{
    res
    .status(404)
    .json({message:"not found"})
});

app.listen(port, _=> console.log(`server is up and listening on port ${port}`));
