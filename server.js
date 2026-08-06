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

return res.json({

success:false

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




db.query(
`
INSERT INTO users
(username,password)

VALUES($1,$2)

`,
[
username,
password
],

(err)=>{


if(err){

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
]

);



res.json({

success:true

});


}

);



}

);



});



// ======================
// 啟動伺服器
// ======================

const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{

    console.log(
        "ISECR Server running on " + PORT
    );

});
