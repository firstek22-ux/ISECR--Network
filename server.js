const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


let invites = [
    {
        code:"ISECR001",
        used:false
    },

    {
        code:"ISECR002",
        used:false
    }
];


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


// 測試

app.get("/",(req,res)=>{

    res.send("ISECR Server Online");

});



// ======================
// 登入
// ======================

app.post("/api/login",(req,res)=>{


    const user =
    members.find(

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




// ======================
// 註冊
// ======================

app.post("/api/register",(req,res)=>{


    const {
        invite,
        username,
        password
    } = req.body;



    let code =
    invites.find(
        i=>i.code===invite
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



    if(
        members.some(
            m=>m.username===username
        )
    ){

        return res.json({

            success:false,

            message:"名稱已存在"

        });

    }



    if(
        !username ||
        !password
    ){

        return res.json({

            success:false,

            message:"資料不完整"

        });

    }



    let user={

        username:username,

        password:password,

        level:"C1",

        bio:"ISECR 新成員"

    };



    members.push(user);


    code.used=true;



    res.json({

        success:true,

        user:user

    });



});




// ======================
// 成員
// ======================

app.get("/api/members",(req,res)=>{


    res.json(members);


});




// ======================
// 文章
// ======================

app.get("/api/posts",(req,res)=>{


    res.json(posts);


});





app.post("/api/posts",(req,res)=>{


    let post={


        id:Date.now(),

        author:req.body.author,

        content:req.body.content,

        time:new Date().toLocaleString(),

        likes:0,

        likedBy:[]

    };



    posts.push(post);



    res.json({

        success:true

    });


});





// ======================
// 點讚
// ======================

app.post("/api/posts/:id/like",(req,res)=>{


    let post =
    posts.find(
        p=>p.id==req.params.id
    );



    if(!post)
    return res.json({
        success:false
    });



    let user=req.body.user;



    if(
        post.likedBy.includes(user)
    ){

        post.likedBy =
        post.likedBy.filter(
            u=>u!==user
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

        p=>p.id!=req.params.id

    );


    res.json({

        success:true

    });


});





app.listen(3000,()=>{

    console.log(
        "ISECR Server running"
    );

});
