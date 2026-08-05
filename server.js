const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


let members = [
    {
        username:"LKSK",
        password:"ARLY",
        level:"A6",
        bio:"ISECR 核心成員"
    },

    {
        username:"R.exe",
        password:"RWW",
        level:"B2",
        bio:"ISECR 技術部"
    }
];


let posts = [];


// 測試伺服器

app.get("/",(req,res)=>{

    res.send("ISECR Server Online");

});



// 登入

app.post("/api/login",(req,res)=>{


    const user = members.find(

        m =>
        m.username === req.body.username &&
        m.password === req.body.password

    );


    if(user){

        res.json({

            success:true,

            user:user

        });

    }

    else{

        res.json({

            success:false

        });

    }


});




// 成員列表

app.get("/api/members",(req,res)=>{

    res.json(members);

});




// 取得文章

app.get("/api/posts",(req,res)=>{

    res.json(posts);

});




// 發文章

app.post("/api/posts",(req,res)=>{


    let post = {

        id:Date.now(),

        author:req.body.author,

        content:req.body.content,

        time:new Date().toLocaleString(),

        likes:0,

        likedBy:[]

    };


    posts.push(post);


    res.json({

        success:true,

        post:post

    });


});




// 點讚

app.post("/api/posts/:id/like",(req,res)=>{


    let post =
    posts.find(
        p=>p.id==req.params.id
    );


    if(!post){

        return res.json({
            success:false
        });

    }


    let user=req.body.user;


    if(!post.likedBy.includes(user)){

        post.likedBy.push(user);

        post.likes++;

    }


    else{

        post.likedBy =
        post.likedBy.filter(
            u=>u!==user
        );

        post.likes--;

    }


    res.json({

        success:true

    });


});




// 刪除文章

app.delete("/api/posts/:id",(req,res)=>{


    posts =
    posts.filter(

        p=>p.id!=req.params.id

    );


    res.json({

        success:true

    });


});





app.listen(3000,()=>{

    console.log(
        "ISECR Server running on port 3000"
    );

});
