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

CREATE TABLE IF NOT EXISTS posts(

id BIGINT PRIMARY KEY,

author TEXT,

content TEXT,

time TEXT,

likes INTEGER,

likedby TEXT

)

`)
.then(()=>{

    console.log("Posts table ready");

})
.catch(err=>{

    console.log(err);

});



db.query(`

CREATE TABLE IF NOT EXISTS users(

id BIGSERIAL PRIMARY KEY,

username TEXT UNIQUE,

password TEXT,

level TEXT,

bio TEXT

)

`)
.then(()=>{

    console.log("Users table ready");

})
.catch(err=>{

    console.log(err);

});



db.query(`

CREATE TABLE IF NOT EXISTS comments(

id BIGINT PRIMARY KEY,

postId BIGINT,

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




db.query(`
INSERT INTO invites(code)
VALUES

('ISECR-7fK9@Qm2#Lx84'),

('ISECR-Xp47!vN9$Ra62'),

('ISECR-M3z8^Hd51&Yu90'),

('ISECR-Pq26*Ws73!Bn45'),

('ISECR-Kv91#Jd48@Tx63'),

('ISECR-Ra57$Lm84^Qc29')

ON CONFLICT DO NOTHING
`)
.then(()=>{

    console.log("Default invites added");

})
.catch(err=>{

    console.log(err);

});
    



// ======================
// 臨時資料
// ======================

       




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
    } = req.body;


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


    if(result.rows.length>0){

        res.json({

            success:true,

            user:result.rows[0]

        });

    }

    else{

        res.json({

            success:false,

            message:"帳號或密碼錯誤"

        });

    }


});


});


//累死我了幹

// ======================
// 註冊
// ======================


//昔人已乘黃鶴去，此地空餘備註欄


// ======================
// 建立資料表
// ======================



db.query(`

CREATE TABLE IF NOT EXISTS posts(

id BIGINT PRIMARY KEY,

author TEXT,

content TEXT,

time TEXT,

likes INTEGER,

likedby TEXT

)

`)
.then(()=>{

    console.log("Posts table ready");

})
.catch(err=>{

    console.log(err);

});



db.query(`

CREATE TABLE IF NOT EXISTS users(

id BIGSERIAL PRIMARY KEY,

username TEXT UNIQUE,

password TEXT,

level TEXT,

bio TEXT

)

`)
.then(()=>{

    console.log("Users table ready");

})
.catch(err=>{

    console.log(err);

});



db.query(`

CREATE TABLE IF NOT EXISTS comments(

id BIGINT PRIMARY KEY,

postId BIGINT,

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




db.query(`
INSERT INTO invites(code)
VALUES

('ISECR-7fK9@Qm2#Lx84'),

('ISECR-Xp47!vN9$Ra62'),

('ISECR-M3z8^Hd51&Yu90'),

('ISECR-Pq26*Ws73!Bn45'),

('ISECR-Kv91#Jd48@Tx63'),

('ISECR-Ra57$Lm84^Qc29')

ON CONFLICT DO NOTHING
`)
.then(()=>{

    console.log("Default invites added");

})
.catch(err=>{

    console.log(err);

});
    



// ======================
// 臨時資料
// ======================

       




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
    } = req.body;


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


    if(result.rows.length>0){

        res.json({

            success:true,

            user:result.rows[0]

        });

    }

    else{

        res.json({

            success:false,

            message:"帳號或密碼錯誤"

        });

    }


});


});


//累死我了幹

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




//我真服了，有bug為什麼代碼不能自己把自己修好啊

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
// 文章列表
// ======================

app.get("/api/posts",(req,res)=>{


    db.query(
        "SELECT * FROM posts ORDER BY id DESC",
        (err,result)=>{


            if(err){

                console.log(err);

                return res.json([]);

            }



            const posts =
            result.rows;

console.log(posts);



            posts.forEach(p=>{

                p.likedBy =
                JSON.parse(
                    p.likedby || "[]"
                );

            });



            res.json(posts);


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

`,

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



    console.log(
        "文章已保存",
        post.id
    );



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

    const id = req.params.id;
    const user = req.body.user;


    db.query(
        "SELECT * FROM posts WHERE id=$1",
        [id],
        (err,result)=>{


            if(err || result.rows.length===0){

                return res.json({
                    success:false
                });

            }


            const post =
            result.rows[0];


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
            `,
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

            });

        }
    );

});




// ======================
// 評論系統
// ======================


app.post("/api/posts/:id/comments",(req,res)=>{


    const {
        author,
        content
    } = req.body;


    const comment = {

        id:Date.now(),

        postId:req.params.id,

        author,

        content,

        time:new Date().toLocaleString()

    };


    db.query(
`
INSERT INTO comments
(id,postId,author,content,time)
VALUES($1,$2,$3,$4,$5)
`,
[
comment.id,
comment.postId,
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


});


});





app.get("/api/posts/:id/comments",(req,res)=>{


    db.query(
`
SELECT *
FROM comments
WHERE postId=$1
`,
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


});


});




// ======================
// 刪除文章
// ======================

app.delete("/api/posts/:id",(req,res)=>{


    const id =
    req.params.id;



    db.query(

        "DELETE FROM posts WHERE id=$1",

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





//我真服了，有bug為什麼代碼不能自己把自己修好啊

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
// 文章列表
// ======================

app.get("/api/posts",(req,res)=>{


    db.query(
        "SELECT * FROM posts ORDER BY id DESC",
        (err,result)=>{


            if(err){

                console.log(err);

                return res.json([]);

            }



            const posts =
            result.rows;

console.log(posts);



            posts.forEach(p=>{

                p.likedBy =
                JSON.parse(
                    p.likedby || "[]"
                );

            });



            res.json(posts);


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

`,

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



    console.log(
        "文章已保存",
        post.id
    );



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

    const id = req.params.id;
    const user = req.body.user;


    db.query(
        "SELECT * FROM posts WHERE id=$1",
        [id],
        (err,result)=>{


            if(err || result.rows.length===0){

                return res.json({
                    success:false
                });

            }


            const post =
            result.rows[0];


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
            `,
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

            });

        }
    );

});




// ======================
// 評論系統
// ======================


app.post("/api/posts/:id/comments",(req,res)=>{


    const {
        author,
        content
    } = req.body;


    const comment = {

        id:Date.now(),

        postId:req.params.id,

        author,

        content,

        time:new Date().toLocaleString()

    };


    db.query(
`
INSERT INTO comments
(id,postId,author,content,time)
VALUES($1,$2,$3,$4,$5)
`,
[
comment.id,
comment.postId,
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


});


});





app.get("/api/posts/:id/comments",(req,res)=>{


    db.query(
`
SELECT *
FROM comments
WHERE postId=$1
`,
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


});


});




// ======================
// 刪除文章
// ======================

app.delete("/api/posts/:id",(req,res)=>{


    const id =
    req.params.id;



    db.query(

        "DELETE FROM posts WHERE id=$1",

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




// ======================
// 啟動
// ======================

const PORT =
process.env.PORT || 3000;
