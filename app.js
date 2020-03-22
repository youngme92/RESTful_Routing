var   bodyParser       = require("body-parser"),
      mongoose         = require("mongoose"),
      express          = require("express"),
      methodOverride   = require('method-override'),
      expressSanitizer = require('express-sanitizer'),
      app              = express(),
      port             = 3000

mongoose.connect('mongodb://localhost/restful_blog_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.set("view engine", "ejs")
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended : true}))
app.use(methodOverride('_method'))
app.use(expressSanitizer())

// mongoose Schema, modeling
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
})

var Blog = mongoose.model("Blog", blogSchema)

//     Blog.create({
//     title: "The Life of Pablo",
//     image: "https://upload.wikimedia.org/wikipedia/ko/4/4d/The_life_of_pablo_alternate.jpg",
//     body: "The Life of Pablo는 2016년 2월 14일 GOOD 뮤직과 데프 잼 레코딩스에서 발매된 미국의 래퍼, 프로듀서 카니예 웨스트의 7번째 정규 음반이다. 이 음반은 2013년 11월 부터 2016년 2월 까지라는 긴 기간 동안 제작되었으며, 이탈리아, 멕시코, 캐나다, 미국 등 다양한 나라의 다양한 스튜디오 안에서 작업이 되었다. 이 음반은 카니예 웨스트의 주도 하에 많은 프로듀서들이 참여했으며, 릭 루빈, 노아 골드스테인, 마이크 딘, 메트로 붐인, 허드슨 모호크, 플레인 팻, 매들립 등의 프로듀서진이 음반 제작에 참여했다. 또한 다양한 스타일을 가지고 있는 가수들 역시 피처링에 참여했는데, 크리스 브라운, 타이 달라 사인, 위켄드, 디자이너, 키드 커디, 더 드림, 켈리 프라이스, 커크 프랭클린, 찬스 더 래퍼, 리한나, 시아, 프랭크 오션, 샘파, 빅 멘사, 포스트 말론, 켄드릭 라마, 영 서그, 캐롤라인 쇼 등이 참여했다."

// })

// LANDING Page!
app.get('/', function(req, res){
    res.redirect('index')
})
// INDEX Route!
app.get('/index', function(req, res){
    Blog.find({}, function(err, Blog){
        if(err){
            console.log(err)
        } else {
            res.render('index', {Blog : Blog})
        }
    })  
})

// NEW Route! 
app.get('/index/new', function(req, res){
    res.render('new')
})

// CREATE Route!
app.post('/index', function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render('new')
        } else {
            res.redirect('/index')
        }
    })
})

// SHOW Route!
app.get('/index/:id', function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect('/index')
        } else {
            res.render('show', {blog : foundBlog})
        }
    })
})

// EDIT Route!
app.get('/index/:id/edit', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect('/index')
        } else {
            res.render('edit', {blog : foundBlog})
        }
    })
})

// UPDATE Route!
app.put('/index/:id', function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateBlog){
        if(err){
            res.redirect('/index')
        } else {
            res.redirect("/index/"+ req.params.id)
        }
    })
})

// DELETE Route!
app.delete('/index/:id', function(req, res){
    Blog.findByIdAndRemove(req.params.id, req.body.blog, function(err){
        if(err){
            res.redirect('/index')
        } else {
            res.redirect('/index')
        }
    })
})

app.listen(port, function(){
    console.log("server connected!!")
})
    
    

