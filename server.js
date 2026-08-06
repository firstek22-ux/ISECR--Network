const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());




// ======================
// 建立資料表
// ======================


db.query(`
CREATE TABLE IF NOT EXISTS users(

id BIGSERIAL PRIMARY KEY,

username TEXT UNIQUE,

password TEXT,

level TEXT DEFAULT 'C1',

bio TEXT DEFAULT 'ISECR 新成員'

)
`)
.then(()=>{
    console.log("Users table ready");
})
.catch(err=>{
    console.log(err);
});



db.query(`
CREATE TABLE IF NOT EXISTS posts(

id BIGINT PRIMARY KEY,

author TEXT,

content TEXT,

time TEXT,

likes INTEGER DEFAULT 0,

likedby TEXT DEFAULT '[]'

)
`)
.then(()=>{
    console.log("Posts table ready");
})
.catch(err=>{
    console.log(err);
});



db.query(`
CREATE TABLE IF NOT EXISTS comments(

id BIGINT PRIMARY KEY,

postid BIGINT,

author TEXT,

content TEXT,

time TEXT

)
`)
.then(()=>{
    console.log("Comments table ready");
})
.catch(err=>{
    console.log(err);
});



db.query(`
CREATE TABLE IF NOT EXISTS invites(

id BIGSERIAL PRIMARY KEY,

code TEXT UNIQUE,

used BOOLEAN DEFAULT false

)
`)
.then(()=>{
    console.log("Invites table ready");
})
.catch(err=>{
    console.log(err);
});



// ======================
// 預設邀請碼
// ======================


db.query(`
INSERT INTO invites(code)
VALUES

('ISECR-A9fK72QmX4'),

('ISECR-Z8Lp31NvR6'),

('ISECR-M5Hd92WxT7'),

('ISECR-Q4Bt86YsP3')

ON CONFLICT DO NOTHING
`)
.then(()=>{
    console.log("Invites added");
})
.catch(err=>{
    console.log(err);
});



// ======================
// 預設管理員
// ======================


db.query(`
INSERT INTO users(username,password,level,bio)

VALUES(
'admin',
'ISECR-admin-2026',
'ADMIN',
'ISECR 管理者'
)

ON CONFLICT(username) DO NOTHING

`)
.then(()=>{
    console.log("Admin ready");
})
.catch(err=>{
    console.log(err);
});



// ======================
// 測試
// ======================


app.get("/",(req,res)=>{

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
}=req.body;


db.query(
`
SELECT *

FROM users

WHERE username=$1

AND password=$2

`,
[
username,
password
],

(err,result)=>{


if(err){

console.log(err);

return res.json({
success:false
});

}



if(result.rows.length===0){

return res.json({

success:false,

message:"帳號或密碼錯誤"

});

}



res.json({

success:true,

user:result.rows[0]

});


});


});




// ======================
// 註冊
// ======================

app.post("/api/register",(req,res)=>{


const {

invite,

username,

password

}=req.body;



if(!invite || !username || !password){

return res.json({

success:false,

message:"資料不完整"

});

}



db.query(
`
SELECT *

FROM invites

WHERE code=$1

`,
[
invite
],

(err,result)=>{


if(err){

console.log(err);

return res.json({

success:false,

message:"資料庫錯誤"

});

}



if(result.rows.length===0){

return res.json({

success:false,

message:"邀請碼錯誤"

});

}



let inviteData=result.rows[0];



if(inviteData.used){

return res.json({

success:false,

message:"邀請碼已使用"

});

}




// ======================
// 隨機成員等級
// ======================

const levels = [

"C1",

"C2",

"B1",

"B2"

];


const randomLevel =

levels[Math.floor(Math.random()*levels.length)];





// ======================
// 建立帳號
// ======================


db.query(
`
INSERT INTO users

(username,password,level,bio)

VALUES($1,$2,$3,'ISECR 新成員')

`,
[
username,

password,

randomLevel

],

(err)=>{


if(err){

console.log(err);

return res.json({

success:false,

message:"帳號建立失敗"

});

}



db.query(
`
UPDATE invites

SET used=true

WHERE id=$1

`,
[
inviteData.id
],

(updateErr)=>{


if(updateErr){

console.log(updateErr);

return res.json({

success:false,

message:"邀請碼更新失敗"

});

}



res.json({

success:true,

level:randomLevel

});


}

);



}

);



}

);



});



    // ======================
// 文章列表
// ======================

app.get("/api/posts",(req,res)=>{


db.query(
`
SELECT *

FROM posts

ORDER BY id DESC
`
,

(err,result)=>{


if(err){

console.log(err);

return res.json([]);

}



const posts=result.rows;


posts.forEach(post=>{

post.likedBy =
JSON.parse(
post.likedby || "[]"
);

});



res.json(posts);


});


});




// ======================
// 發布文章
// ======================


app.post("/api/posts",(req,res)=>{


const {

author,

content

}=req.body;



if(!author || !content){

return res.json({

success:false,

message:"資料不完整"

});

}



const post={


id:Date.now(),


author,


content,


time:new Date().toLocaleString(),


likes:0,


likedBy:[]


};



db.query(

`
INSERT INTO posts

(id,author,content,time,likes,likedby)

VALUES($1,$2,$3,$4,$5,$6)

`
,

[

post.id,

post.author,

post.content,

post.time,

post.likes,

JSON.stringify(post.likedBy)

],


(err)=>{


if(err){

console.log(err);


return res.json({

success:false

});

}



res.json({

success:true,

post

});


}

);


});





// ======================
// 點讚
// ======================


app.post("/api/posts/:id/like",(req,res)=>{


const id=req.params.id;

const user=req.body.user;



db.query(

`
SELECT *

FROM posts

WHERE id=$1

`

,

[id],

(err,result)=>{


if(err || result.rows.length===0){

return res.json({

success:false

});

}



const post=result.rows[0];



let likedBy =
JSON.parse(post.likedby || "[]");



let likes =
post.likes || 0;



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




db.query(

`
UPDATE posts

SET likes=$1,

likedby=$2

WHERE id=$3

`

,

[

likes,

JSON.stringify(likedBy),

id

],

()=>{


res.json({

success:true,

likes,

likedBy

});


}

);



});


});




// ======================
// 發布評論
// ======================

app.post("/api/posts/:id/comments",(req,res)=>{


const {

author,

content

}=req.body;



if(!author || !content){

return res.json({

success:false,

message:"資料不完整"

});

}



const comment={

id:Date.now(),

postid:req.params.id,

author,

content,

time:new Date().toLocaleString()

};



db.query(

`
INSERT INTO comments

(id,postid,author,content,time)

VALUES($1,$2,$3,$4,$5)

`,

[

comment.id,

comment.postid,

comment.author,

comment.content,

comment.time

],


(err)=>{


if(err){

console.log(err);

return res.json({

success:false

});

}



res.json({

success:true,

comment

});


}


);


});





// ======================
// 取得評論
// ======================


app.get("/api/posts/:id/comments",(req,res)=>{


db.query(

`
SELECT *

FROM comments

WHERE postid=$1

ORDER BY id ASC

`

,

[

req.params.id

],


(err,result)=>{


if(err){

console.log(err);

return res.json([]);

}



res.json(

result.rows

);


}


);


});





// ======================
// 刪除文章
// ======================


app.delete("/api/posts/:id",(req,res)=>{


const username=req.body.username;


checkAdmin(username,(isAdmin)=>{


if(!isAdmin){

return res.json({

success:false,

message:"權限不足"

});

}



const id=req.params.id;



db.query(

`
DELETE FROM posts
WHERE id=$1
`

,

[id],

(err)=>{


if(err){

return res.json({

success:false

});

}



res.json({

success:true

});


}


);


});


});




// ======================
// 成員列表
// ======================

app.get("/api/members",(req,res)=>{


db.query(
`
SELECT username,level,bio
FROM users
`,
[],
(err,result)=>{


if(err){

console.log(err);

return res.json([]);

}


res.json(
result.rows
);


});


});




// ======================
// 權限檢查
// ======================

function checkAdmin(username, callback){

    db.query(
    `
    SELECT level
    FROM users
    WHERE username=$1
    `,
    [
        username
    ],
    (err,result)=>{


        if(err || result.rows.length===0){

            return callback(false);

        }


        if(result.rows[0].level==="ADMIN"){

            return callback(true);

        }


        callback(false);


    });

}




// ======================
// 啟動伺服器
// ======================

const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{

    console.log(
        "ISECR Server running on " + PORT
    );

});
