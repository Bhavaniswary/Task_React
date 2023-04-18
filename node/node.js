
const fs = require("fs");
const path = require("_path");
const http = require("http");
const EventEmitter = require("events");

 const _path = (path.join(__dirname, 'db.json')).toString();
 console.log('file_pathName',_path);

const server = http.createServer()
const handleEvents = new EventEmitter(); 
handleEvents.on('AllArticles', (req, res) => {
    console.log('enterded');
    fs.readFile(_path, 'utf8', (err, data) => {
        if (err) {

            console.log('erorr',err);
            if (err.code === 'ENOENT') {
                fs.writeFile(_path, JSON.stringify({
                    articles: []
                }), (err) => {
                    if (err) {
                        console.log(err)
                        res.statusCode = 500;
                        res.end(JSON.stringify(err));
                    } else {
                        res.end()
                    }
                })
            } else {
                console.log(err)
                res.statusCode = 500;
                res.end(JSON.stringify(err));
            }
        } else {
            const result = JSON.parse(data);
            res.write(JSON.stringify(result))
            console.log(('successfully GET all articles'));
            res.end()
        }
    })
})

handleEvents.on('POST:articles', (req, res) => {
    const data_FromJsonFile = fs.readFileSync(_path, 'utf8')
    const fileData = JSON.parse(data_FromJsonFile);
    let reqData = {};
    req.on("data", (body) => {
        reqData = JSON.parse(body.toString())
    })

    req.on('end', () => {
        if (Array.isArray(fileData?.articles)) {
            fileData.articles.push(reqData);
            fs.writeFile(_path, JSON.stringify(fileData), (err) => {
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

handleEvents.on('deleteArticle', (req, res) => {
    const url = new URL(`http://localhost:4004/${req.url}`);
    const Params = url.searchParams;
    if (Params.has('id')) {
        const id = Params.get('id');
        const jsonFileData = fs.readFileSync(_path, 'utf8');
        const data = JSON.parse(jsonFileData);

        console.log('article',data)
       const article= data.filter(x => x.id != id);
        console.log(article);
        fs.writeFile(_path, JSON.stringify(article), (err) => {
            if (err) {
                res.statusCode = 500;
                return res.end(JSON.stringify(err));
            }
            else {
                res.statusCode = 200;
                return res.end('Successfully Deleted');
            }
        })
    }
})


handleEvents.on('getArticle', (req, res) => {
    const url = new URL(`http://localhost:4004/${req.url}`);
    const searchParams = url.searchParams;
    if (searchParams.has('id')) {
        const id = searchParams.get('id');
        const jsonFile_Data = fs.readFileSync(_path, 'utf8');
        const data = JSON.parse(jsonFile_Data);

        console.log('article',data)
       const article= data.filter(x => x.id == id);
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


server.on('request', (req, res) => {

    let Full_url = `${req.method}:${req.url}`;
    // delete article
    if (req.url.includes('/deleteArticle?id')) {
        console.log("Hi")
        handleEvents.emit('deleteArticle', req, res);
    }
    // get all article
    else if (req.url == '/articles') {
        console.log('articles GET API')
        handleEvents.emit('AllArticles', req, res)
    }
    // add article 
    else if (Full_url === 'POST:articles') {
        console.log('articles POST API')
        handleEvents.emit('POST:articles', req, res)
    }
    // get paticular article
    else if(req.url.includes('/getArticle?id')){
        console.log('articles POST API')
        handleEvents.emit('getArticle', req, res)
    }

    else {
        res.statusCode = 404;
        res.end('<h1>Page Not Found: 404</h1>')
    }

})

server.listen(4004, () => {
    console.log('Server is currently running on port 4004');
})
