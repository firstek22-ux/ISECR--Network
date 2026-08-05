const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


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


    res.json(
        posts
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



    posts.push(post);



    res.json({

        success:true,

        post:post

    });


});




// ======================
// 點讚
// ======================

app.post("/api/posts/:id/like",(req,res)=>{


    const post =
    posts.find(
        p =>
        p.id == req.params.id
    );



    if(!post){

        return res.json({

            success:false

        });

    }



    const user =
    req.body.user;



    if(
        post.likedBy.includes(user)
    ){

        post.likedBy =
        post.likedBy.filter(
            u => u !== user
        );


        post.likes--;


    }

    else{


        post.likedBy.push(user);


        post.likes++;


    }



    res.json({

        success:true

    });



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
