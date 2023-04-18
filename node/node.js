// Simple HTTP server to handle few req & responses
const fs = require("fs");
const path = require("path");
const http = require("http");
const EventEmitter = require("events");

const filePath = (path.join(__dirname, 'db.json')).toString();

const server = http.createServer()
const handleRequests = new EventEmitter(); // creating a event emitter instance for "handleRequests"
const newPath='E:\react\react-commerce\react-redux-demo-master\react-redux-demo-master\node\db.json'
handleRequests.on('AllArticles', (req, res) => {
    console.log('enterded');
    console.log('filePath',filePath);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {

            console.log('erorr',err);
            if (err.code === 'ENOENT') { // Error NO ENTry
                fs.writeFile(filePath, JSON.stringify({
                    articles: []
                }), (err) => {
                    if (err) {
                        console.log(err)
                        res.statusCode = 500;
                        res.end(JSON.stringify(err));
                    } else {
                       // res.write(JSON.stringify([]))
                        res.end()
                    }
                })
            } else {
                console.log(err)
                res.statusCode = 500;
                res.end(JSON.stringify(err));
            }
        } else {
            console.log(('successfully GET all articles'));
            const result = JSON.parse(data);
            res.write(JSON.stringify(result?.articles))
            res.end()
        }
    })
})

// registering a custom event using handleRequests eventEmitter Instance
handleRequests.on('POST:articles', (req, res) => {
    const dataFromJsonFile = fs.readFileSync(filePath, 'utf8')
    const fileData = JSON.parse(dataFromJsonFile);
    let reqData = {};
    req.on("data", (body) => {
        reqData = JSON.parse(body.toString())
    })

    // this will get triggered once the request is over - we read all the req data
    req.on('end', () => {
        if (Array.isArray(fileData?.articles)) {
            fileData.articles.push(reqData);
            fs.writeFile(filePath, JSON.stringify(fileData), (err) => {
                if (err) {
                    res.statusCode = 500;
                    res.end();
                } else {
                    res.write(JSON.stringify({ status: 'success', message: 'Article added successfully' }))
                    res.end()
                }
            })
        }
    })
})

handleRequests.on('deleteArticle', (req, res) => {
    const current_url = new URL(`http://localhost:4004/${req.url}`);
    const search_Params = current_url.searchParams;
    if (search_Params.has('id')) {
        const id = search_Params.get('id');
        const jsonFile_Data = fs.readFileSync(filePath, 'utf8');
        const json_Data = JSON.parse(jsonFile_Data);

        console.log('article',json_Data)
       // const article = json_Data.filter(x => x.id != id);
       const article= json_Data.filter(x => x.id != id);
        console.log(article);
        fs.writeFile(filePath, JSON.stringify(article), (err) => {
            if (err) {
                res.statusCode = 500;
                return res.end(JSON.stringify(err));
            }
            else {
                res.statusCode = 200;
                return res.end('Successfully Deleted...');
            }
        })
    }
})


handleRequests.on('getArticle', (req, res) => {
    const current_url = new URL(`http://localhost:4004/${req.url}`);
    const search_Params = current_url.searchParams;
    if (search_Params.has('id')) {
        const id = search_Params.get('id');
        const jsonFile_Data = fs.readFileSync(filePath, 'utf8');
        const json_Data = JSON.parse(jsonFile_Data);

        console.log('article',json_Data)
       // const article = json_Data.filter(x => x.id != id);
       const article= json_Data.filter(x => x.id == id);
        console.log(article,'get Arricle');
            if (article) {
                res.statusCode = 200;
                res.write(JSON.stringify(article));
                return res.end()
            }
            else {
                res.write("No Id ")
            }
        
    }
})

// registering a custom event using handleRequests eventEmitter Instance
handleRequests.on('users', (req, res) => {
    console.log('USERS API')
    res.end('<h1>USERS API</h1>')
})

// using a pre-defined event "request" from server instance (internally uses event-emitter)
server.on('request', (req, res) => {
    // Mandatory Things in Request
    /**
     * - URL
     * - Method (GET / POST / PUT / PATCH / DELETE)
     * - Headers (Content-Type, Authorization, Accept, Content-Length, ...)
     * - Body
     */
    // Mandatory things in Response
    /**
     * - Status Code
     * - Headers (Content-Type, Content-Length, ...)
     * - Body
     * 
     */
    let Full_url = `${req.method}:${req.url}`;
    // delete article
    if (req.url.includes('/deleteArticle?id')) {
        console.log("Hi")
        handleRequests.emit('deleteArticle', req, res);
    }
    // get all article
    else if (req.url == '/articles') {
        console.log('articles GET API')
        handleRequests.emit('AllArticles', req, res)
    }
    // add article 
    else if (Full_url === 'POST:articles') {
        console.log('articles POST API')
        handleRequests.emit('POST:articles', req, res)
    }
    // get paticular article
    else if(req.url.includes('/getArticle?id')){
        console.log('articles POST API')
        handleRequests.emit('getArticle', req, res)
    }

    else {
        res.statusCode = 404;
        res.end('<h1>Page Not Found: 404</h1>')
    }

})

server.listen(4004, () => {
    console.log('Server is running on port 4004');
})