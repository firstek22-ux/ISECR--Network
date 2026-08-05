const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

db.run(`

CREATE TABLE IF NOT EXISTS posts(

id INTEGER PRIMARY KEY,

author TEXT,

content TEXT,

time TEXT,

likes INTEGER,

likedBy TEXT

)

`);


// ======================
// 臨時資料
// ======================

let invites = [
    {
        code: "ISECR001",
        used: false
    },

    {
        code: "ISECR002",
        used: false
    },

    {
        code: "ISECR003",
        used: false
    }
];


let members = [

    {
        username: "LKSK",
        password: "ARLY",
        level: "A6",
        bio: "ISECR 核心成員"
    },

    {
        username: "R.exe",
        password: "RWW",
        level: "B2",
        bio: "ISECR 技術部"
    }

];


let posts = [];

let comments = [];

// ======================
// 回覆文章
// ======================

app.post("/api/posts/:id/comments",(req,res)=>{

    const {
        author,
        content
    } = req.body;


    const comment = {

        id: Date.now(),

        postId: req.params.id,

        author,

        content,

        time:new Date().toLocaleString()

    };


    comments.push(comment);


    res.json({

        success:true,

        comment

    });


});



// ======================
// 取得文章回覆
// ======================

app.get("/api/posts/:id/comments",(req,res)=>{


    const result =
    comments.filter(
        c =>
        c.postId == req.params.id
    );


    res.json(result);


});



// ======================
// 測試
// ======================

app.get("/", (req,res)=>{

    res.send(
        "ISECR Server Online"
    );

});




// ======================
// 登入
// ======================

app.post("/api/login",(req,res)=>{


    const {
        username,
        password
    } = req.body;



    const user =
    members.find(
        m =>
        m.username === username &&
        m.password === password
    );



    if(user){

        res.json({

            success:true,

            user:user

        });

    }

    else{

        res.json({

            success:false,

            message:"帳號或密碼錯誤"

        });

    }


});




// ======================
// 註冊
// ======================

app.post("/api/register",(req,res)=>{


    const {

        invite,
        username,
        password

    } = req.body;



    if(
        !invite ||
        !username ||
        !password
    ){

        return res.json({

            success:false,

            message:"資料不完整"

        });

    }



    const code =
    invites.find(
        i =>
        i.code === invite
    );



    if(!code){

        return res.json({

            success:false,

            message:"邀請碼錯誤"

        });

    }



    if(code.used){

        return res.json({

            success:false,

            message:"邀請碼已使用"

        });

    }



    const exists =
    members.some(
        m =>
        m.username === username
    );



    if(exists){

        return res.json({

            success:false,

            message:"使用者名稱已存在"

        });

    }



    const newUser = {


        username:username,


        password:password,


        level:"C1",


        bio:"ISECR 新成員"


    };



    members.push(newUser);



    code.used=true;



    res.json({

        success:true,

        user:newUser

    });



});




// ======================
// 成員列表
// ======================

app.get("/api/members",(req,res)=>{


    res.json(
        members
    );


});




// ======================
// 文章列表
// ======================

app.get("/api/posts",(req,res)=>{

    db.all(
        "SELECT * FROM posts",
        [],
        (err,rows)=>{

            if(err){

                return res.json([]);

            }


            rows.forEach(p=>{

                p.likedBy =
                JSON.parse(p.likedBy || "[]");

            });


            res.json(rows);

        }
    );

});




// ======================
// 發布文章
// ======================

app.post("/api/posts",(req,res)=>{


    const {

        author,

        content

    } = req.body;



    if(!author || !content){

        return res.json({

            success:false

        });

    }



    const post = {


        id:Date.now(),


        author:author,


        content:content,


        time:new Date().toLocaleString(),


        likes:0,


        likedBy:[]


    };



    db.run(

`
INSERT INTO posts
(id,author,content,time,likes,likedBy)
VALUES(?,?,?,?,?,?)
`,

[
post.id,
post.author,
post.content,
post.time,
post.likes,
JSON.stringify(post.likedBy)
]

);



    res.json({

        success:true,

        post:post

    });


});




// ======================
// 點讚
// ======================

app.post("/api/posts/:id/like",(req,res)=>{


    const id = req.params.id;

    const user = req.body.user;


    db.get(
        "SELECT * FROM posts WHERE id=?",
        [id],
        (err,post)=>{


            if(!post){

                return res.json({
                    success:false
                });

            }


            let likedBy =
            JSON.parse(post.likedBy || "[]");


            let likes =
            post.likes;


            if(likedBy.includes(user)){


                likedBy =
                likedBy.filter(
                    u=>u!==user
                );


                likes--;


            }
            else{


                likedBy.push(user);

                likes++;

            }



            db.run(
            `
            UPDATE posts

            SET likes=?,
            likedBy=?

            WHERE id=?

            `,
            [
                likes,
                JSON.stringify(likedBy),
                id
            ]);


            res.json({
                success:true
            });


        }

    );


});




// ======================
// 刪除文章
// ======================

app.delete("/api/posts/:id",(req,res)=>{


    posts =
    posts.filter(

        p =>
        p.id != req.params.id

    );



    res.json({

        success:true

    });



});




// ======================
// 啟動
// ======================

const PORT =
process.env.PORT || 3000;


app.listen(PORT,()=>{


    console.log(

        "ISECR Server running on "
        + PORT

    );


});
