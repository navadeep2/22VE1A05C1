const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

let n=1
const links=[]



//create short url
app.post('/shorturls', (req, res) => {
    const { url, validity = 30, shortcode } = req.body;

    let code = shortcode;
    function generate_code(){
    return 'abcd'+n;
    n+=1;
    }

    if (code) {
        
        if (links.some(link => link.code === code)) {
            return res.json({ error: 'Shortcode already exists.' });
        }
    } 
    else {
        do {
            code = generate_code();
        } while (links.some(link => link.code === code));
    }

    const expiry = Date.now() + validity * 60 * 1000;
    links.push({ code, url, expiry });

    res.json({
        shortLink: `http://${req.hostname}:${PORT}/${code}`,
        expiry: new Date(expiry).toISOString()
    });
});



//opening link
// app.get('/', (req.res)=>{});


//retrieve short url
app.get('/shorturls')

app.listen(PORT,()=>{
    console.log(`server listening on ${PORT} port number`)
})


