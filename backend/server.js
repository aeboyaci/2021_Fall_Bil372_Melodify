const express = require("express");
const cors = require("cors");
const pool = require("./db");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const PORT = 3001;
const JWT_SECRET = "TOKEN_SECRET_HAHAHAHAHA";

const app = express();

app.use(cookieParser());
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.static(`${__dirname}/uploads`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const GetConsumerID = (req) => {
    console.log(req.cookies["token"]);
    try {
        const token = jwt.verify(req.cookies["token"], JWT_SECRET);
        console.log("token", token);
        return token.UserID;
    } catch {
        return null;
    }
};

app.get("/api/uploads/:fileName", (req, resp, next) => {
    const {fileName} = req.params;
    return resp.sendFile(`${__dirname}/uploads/${fileName}`);
});

app.post("/api/account/login", (req, resp, next) => {
    const {Email, Password} = req.body;
    console.log(req.body);

    pool.query("SELECT * FROM User WHERE Email=?;", [Email], (err, results) => {
        if (err) {
            return resp.status(400).json({
                success: false,
                message: "Cannot get data from database"
            });
        }

        if (results.length === 0) {
            return resp.status(400).json({
                success: false,
                message: "Email or password is wrong"
            });
        }

        const user = results[0];
        bcrypt.compare(Password, user.Password, (err, result) => {
            if (!result) {
                return resp.status(400).json({
                    success: false,
                    message: "Email or password is wrong"
                });
            }

            const token = jwt.sign({
                Email,
                Username: user.Username,
                UserID: user.UserID,
                Role: user.UserType === 0 ? "Consumer" : "Creator"
            }, JWT_SECRET);

            resp.cookie("token", token, {
                httpOnly: true,
                path: "/"
            });
            resp.cookie("user", JSON.stringify({Username: user.Username, Role: user.UserType === 0 ? "Consumer" : "Creator"}), {
                httpOnly: false,
                path: "/"
            });

            return resp.status(200).json({success: true, message: "Login success", Username: user.Username, Role: user.UserType === 0 ? "Consumer" : "Creator"});
        });
    });
});

app.post("/api/account/register", (req, resp, next) => {
    let {Email, Password, UserType, Username} = req.body;
    UserType = UserType === "Creator" ? "0" : "1";
    console.log(req.body);

    pool.query("SELECT * FROM User WHERE Email=?;", [Email], (err, results) => {
        if (err) {
            return resp.status(400).json({
                success: false,
                message: "Cannot get data from database"
            });
        }

        if (results.length > 0) {
            return resp.status(400).json({
                success: false,
                message: "Email exists"
            });
        }

        bcrypt.hash(Password, 10, (err, hashedPassword) => {
            if (err)
                return resp.status(500).json({
                    success: false,
                    message: "Cannot hash Password"
                });

            pool.query("INSERT INTO User(Email, Username, UserType, Password) VALUES(?, ?, ?, ?);", [Email, Username, UserType, hashedPassword], (err, results) => {
                if (err)
                    return resp.status(500).json({
                        success: false,
                        message: "Cannot insert to db"
                    });

                const ConsumerID = results.insertId;
                pool.query("INSERT INTO SongList(Name, Description, SongListPic) VALUES('Liked Songs', 'Songs that you liked before', 'https://misc.scdn.co/liked-songs/liked-songs-640.png');", (err, results) => {
                    if (err)
                        return resp.status(500).json({
                            success: false,
                            message: "Cannot insert to db"
                        });

                    const LikedSongListID = results.insertId;

                    pool.query("INSERT INTO Playlist(SongListID, PlaylistType, ConsumerID) VALUES(?, 1, ?);", [LikedSongListID, ConsumerID], (err, results) => {
                        if (err)
                            return resp.status(500).json({
                                success: false,
                                message: "Cannot insert to db"
                            });

                        pool.query("INSERT INTO SongList(Name, Description) VALUES('Recently Played', 'Songs that you listened recently');", (err, results) => {
                            if (err)
                                return resp.status(500).json({
                                    success: false,
                                    message: "Cannot insert to db"
                                });

                            const RecentlySongListID = results.insertId;
                            pool.query("INSERT INTO Playlist(SongListID, PlaylistType, ConsumerID) VALUES(?, 0, ?);", [RecentlySongListID, ConsumerID], (err, results) => {
                                if (err)
                                    return resp.status(500).json({
                                        success: false,
                                        message: "Cannot insert to db"
                                    });

                                return resp.status(201).json({success: true, message: "User created"});
                            });
                        });
                    });
                });
            });
        });
    });
});

/*
* 0 -> Recently Played
* 1 -> Liked Songs
* 2 -> Normal Playlist
* */
app.get("/api/recently-played", (req, resp, next) => {
    const ConsumerID = GetConsumerID(req);
    const query = "SELECT R.RecordID, R.Name, S.Singer, R.RecordPic FROM Playlist AS P INNER JOIN Contains AS C ON P.SongListID=C.SongListID INNER JOIN Song AS S ON C.SongID=S.RecordID INNER JOIN Record AS R ON S.RecordID=R.RecordID WHERE PlaylistType=0 AND ConsumerID=? ORDER BY C.Time DESC;";
    pool.query(query, [ConsumerID], (err, results) => {
        if (err)
            return resp.status(500).json({
                success: false,
                message: "Server error occurred!"
            });
        return resp.status(200).json({
            success: true,
            results
        });
    });
});
app.get("/api/recently-played/limit", (req, resp, next) => {
    const ConsumerID = GetConsumerID(req);
    const query = "SELECT R.RecordID, R.Name, S.Singer, R.RecordPic FROM Playlist AS P INNER JOIN Contains AS C ON P.SongListID=C.SongListID INNER JOIN Song AS S ON C.SongID=S.RecordID INNER JOIN Record AS R ON S.RecordID=R.RecordID WHERE PlaylistType=0 AND ConsumerID=? ORDER BY C.Time DESC LIMIT 5;";
    pool.query(query, [ConsumerID], (err, results) => {
        console.log(err, results);
        if (err)
            return resp.status(500).json({
                success: false,
                message: "Server error occurred!"
            });
        return resp.status(200).json({
            success: true,
            results
        });
    });
});
app.get("/api/record-file/:RecordID", (req, resp, next) => {
   const {RecordID} = req.params;
   const query = "SELECT RecordFile FROM Record WHERE RecordID=?";
   pool.query(query, [RecordID], (err, results) => {
       if (err)
           return resp.status(500).json({
               success: false,
               message: "Server error occurred!"
           });

       const {RecordFile} = results[0];
       return resp.sendFile(`${__dirname}/uploads/${RecordFile}`);
   });
});

app.get("/api/playlists", (req, resp, next) => {
    const ConsumerID = GetConsumerID(req);
    const query = "SELECT P.SongListID, SongListPic, Name, Description FROM Playlist AS P INNER JOIN SongList AS S ON P.SongListID=S.SongListID WHERE P.PlaylistType=2 AND P.ConsumerID=?;";
    pool.query(query, [ConsumerID], (err, results) => {
        console.log(err, results);
        if (err)
            return resp.status(500).json({
                success: false,
                message: "Server error occurred!"
            });
        return resp.status(200).json({
            success: true,
            results
        });
    });
});
app.get("/api/playlists/user/:Username", (req, resp, next) => {
    const {Username} = req.params;
    const query = "SELECT S.SongListID, S.SongListPic, S.Name, S.Description FROM Playlist AS P INNER JOIN SongList AS S ON P.SongListID=S.SongListID INNER JOIN User AS U ON U.Username=? WHERE P.PlaylistType=2 AND P.ConsumerID=U.UserID;";
    pool.query(query, [Username], (err, results) => {
        console.log(err, results);
        if (err)
            return resp.status(500).json({
                success: false,
                message: "Server error occurred!"
            });
        return resp.status(200).json({
            success: true,
            results
        });
    });
});
app.get("/api/playlists/limit", (req, resp, next) => {
    const ConsumerID = GetConsumerID(req);
    const query = "SELECT S.SongListID, S.SongListPic, S.Name, S.Description FROM Playlist AS P INNER JOIN SongList AS S ON P.SongListID=S.SongListID WHERE P.PlaylistType=2 AND P.ConsumerID=? LIMIT 4;";
    pool.query(query, [ConsumerID], (err, results) => {
        if (err)
            return resp.status(500).json({
                success: false,
                message: "Server error occurred!"
            });
        return resp.status(200).json({
            success: true,
            results
        });
    });
});
app.get("/api/playlists/liked-songs", (req, resp, next) => {
    const ConsumerID = GetConsumerID(req);
    pool.query("SELECT P.SongListID FROM Playlist AS P WHERE P.PlaylistType=1 AND P.ConsumerID=?", [ConsumerID], (err, results) => {
        const {SongListID} = results[0];
        const query = `SELECT SL.Name AS SL_NAME, SL.SongListPic, SL.Description, SL.PublishDate AS SL_PUBLISHDATE FROM SongList AS SL WHERE SL.SongListID=?`;
        pool.query(query, [SongListID], (err, results) => {
            console.log("aaa", err, results);
            if (err)
                return resp.status(500).json({
                    success: false,
                    message: "Server error occurred!"
                });
            return resp.status(200).json({
                success: true,
                results
            });
        });
    });
});
app.get("/api/playlists/:SongListID", (req, resp, next) => {
    const {SongListID} = req.params;
    const query = `SELECT SL.Name AS SL_NAME, SL.SongListPic, SL.Description, SL.PublishDate AS SL_PUBLISHDATE FROM SongList AS SL WHERE SL.SongListID=?`;
    pool.query(query, [SongListID], (err, results) => {
        if (err)
            return resp.status(500).json({
                success: false,
                message: "Server error occurred!"
            });
        return resp.status(200).json({
            success: true,
            results
        });
    });
});
app.get("/api/playlists/liked-songs/songs", (req, resp, next) => {
    const ConsumerID = GetConsumerID(req);

    pool.query("SELECT P.SongListID FROM Playlist AS P WHERE P.PlaylistType=1 AND P.ConsumerID=?", [ConsumerID], (err, results) => {
        console.log(err, results);
        const {SongListID} = results[0];

        const query = `SELECT Song.Singer, Record.Name, Record.PublishDate, Record.Duration FROM Record INNER JOIN Song ON Song.RecordID=Record.RecordID WHERE Song.RecordID IN (SELECT SongID AS RecordID FROM Contains WHERE SongListID=?);`;
        pool.query(query, [SongListID], (err, results) => {
            if (err)
                return resp.status(500).json({
                    success: false,
                    message: "Server error occurred!"
                });
            console.log(err, results);
            return resp.status(200).json({
                success: true,
                results
            });
        });
    });
});
app.get("/api/playlists/:SongListID/songs", (req, resp, next) => {
    const {SongListID} = req.params;
    console.log(SongListID);
    const query = `SELECT Song.Singer, Record.RecordID, Record.Name, Record.PublishDate, Record.Duration FROM Record INNER JOIN Song ON Song.RecordID=Record.RecordID WHERE Song.RecordID IN (SELECT SongID AS RecordID FROM Contains WHERE SongListID=?);`;
    pool.query(query, [SongListID], (err, results) => {
        if (err)
            return resp.status(500).json({
                success: false,
                message: "Server error occurred!"
            });
        console.log(err, results);
        return resp.status(200).json({
            success: true,
            results
        });
    });
});
app.get("/api/songs", (req, resp, next) => {
    const query = "SELECT R.RecordID, S.Singer, R.Name FROM Song AS S INNER JOIN Record AS R ON S.RecordID=R.RecordID;";
    pool.query(query, (err, results) => {
        if (err)
            return resp.status(500).json({
                success: false,
                message: "Server error occurred!"
            });
        return resp.status(200).json({
            success: true,
            results
        });
    });
});
app.get("/api/songs/:RecordID", (req, resp, next) => {
    const {RecordID} = req.params;
    const query = `SELECT R.RecordID, R.RecordPic, R.Name, S.Singer, R.PublishDate, G.Name AS G_NAME, L.Content FROM Record AS R INNER JOIN Song AS S ON R.RecordID=S.RecordID INNER JOIN Genre AS G ON R.GenreID=G.GenreID INNER JOIN Lyrics AS L ON L.LyricsID=S.LyricsID WHERE R.RecordID=?`;
    pool.query(query, [RecordID], (err, results) => {
        if (err)
            return resp.status(500).json({
                success: false,
                message: "Server error occurred!"
            });

        return resp.status(200).json({
            success: true,
            results
        });
    });
});
app.get("/api/songs/:RecordID/comments", (req, resp, next) => {
    const {RecordID} = req.params;
    const query = `SELECT C.Content, C.Date AS CommentDate, U.Username, U.ProfilePic FROM Comment AS C INNER JOIN Record AS R ON C.RecordID=R.RecordID INNER JOIN User AS U ON C.ConsumerID=U.UserID WHERE R.RecordID=? ORDER BY C.Date DESC;`;
    pool.query(query, [RecordID], (err, results) => {
        if (err)
            return resp.status(500).json({
                success: false,
                message: "Server error occurred!"
            });
        return resp.status(200).json({
            success: true,
            results
        });
    });
});

app.get("/api/users/:Username", (req, resp, next) => {
    const {Username} = req.params;
    const query = "SELECT U.Username, U.ProfilePic, (SELECT COUNT(*) AS Following FROM Follows WHERE FollowerID=U.UserID GROUP BY FollowerID) AS Following, (SELECT COUNT(*) AS Followers FROM Follows WHERE FollowedID=U.UserID GROUP BY FollowedID) AS Followers FROM User AS U WHERE U.Username=?;";
    pool.query(query, [Username], (err, results) => {
        console.log(err, results);
        if (err)
            return resp.status(500).json({
                success: false,
                message: "Server error occurred!"
            });
        return resp.status(200).json({
            success: true,
            results
        });
    });
});
app.get("/api/users/:Username/followers", (req, resp, next) => {
    const {Username} = req.params;
    const query = "SELECT U.Username, U.ProfilePic FROM Follows AS F INNER JOIN User AS U ON U.UserID=F.FollowerID WHERE F.FollowedID IN (SELECT UserID FROM User WHERE Username=?);";
    pool.query(query, [Username], (err, results) => {
        console.log(err, results);
        if (err)
            return resp.status(500).json({
                success: false,
                message: "Server error occurred!"
            });
        return resp.status(200).json({
            success: true,
            results
        });
    });
});
app.get("/api/users/:Username/following", (req, resp, next) => {
    const {Username} = req.params;
    const query = "SELECT U.Username, U.ProfilePic FROM Follows AS F INNER JOIN User AS U ON U.UserID=F.FollowedID WHERE F.FollowerID IN (SELECT UserID FROM User WHERE Username=?);";
    pool.query(query, [Username], (err, results) => {
        console.log(err, results);
        if (err)
            return resp.status(500).json({
                success: false,
                message: "Server error occurred!"
            });
        return resp.status(200).json({
            success: true,
            results
        });
    });
});
app.get("/api/search/:Search", (req, resp, next) => {
    const {Search} = req.params;
    let searchResults = {};

    const userQuery = "SELECT U.Username, U.ProfilePic FROM User AS U WHERE U.Username LIKE CONCAT('%', ?,  '%');";
    pool.query(userQuery, [Search], (err, results) => {
        console.log(err, results);
        if (err)
            return resp.status(500).json({
                success: false,
                message: "Server error occurred!"
            });
        searchResults = {users: [...results]};

        const songQuery = "SELECT R.RecordID, R.Name AS R_NAME, R.RecordPic FROM Record AS R WHERE R.Name LIKE CONCAT('%', ?,  '%');";
        pool.query(songQuery, [Search], (err, results) => {
            if (err)
                return resp.status(500).json({
                    success: false,
                    message: "Server error occurred!"
                });

            searchResults = {...searchResults, songs: [...results]};

            const playlistQuery = "SELECT SL.SongListID, SL.Name, SL.SongListPic FROM SongList AS SL WHERE SL.Name LIKE CONCAT('%', ?,  '%');";
            pool.query(playlistQuery, [Search], (err, results) => {
                if (err)
                    return resp.status(500).json({
                        success: false,
                        message: "Server error occurred!"
                    });

                searchResults = {...searchResults, playlists: [...results]};

                return resp.status(200).json({
                    success: true,
                    results: searchResults
                });
            });
        });
    });
});

app.get("/api/users/is-following/:Username", (req, resp, next) => {
    const ConsumerID = GetConsumerID(req);
    const {Username} = req.params;

    const query = "SELECT COUNT(*) AS isFollowing FROM Follows WHERE FollowerID=? AND FollowedID IN (SELECT UserID FROM User WHERE Username=?);";
    pool.query(query, [ConsumerID, Username], (err, results) => {
        if (err)
            return resp.status(500).json({
                success: false,
                message: "Server error occurred!"
            });

        return resp.status(200).json({
            success: true,
            results: results.length > 0 && Boolean(results[0].isFollowing)
        });
    });
});

app.get("/api/songs/is-liked/:RecordID", (req, resp, next) => {
    const ConsumerID = GetConsumerID(req);
    const {RecordID} = req.params;
    const query = "SELECT COUNT(*) AS isLiked FROM Playlist AS P INNER JOIN SongList AS SL ON P.SongListID=SL.SongListID INNER JOIN Contains AS C ON C.SongID=? AND C.SongListID=SL.SongListID WHERE P.PlaylistType=1 AND P.ConsumerID=?;";
    pool.query(query, [RecordID, ConsumerID], (err, results) => {
        console.log(err, results);
        if (err)
            return resp.status(500).json({
                success: false,
                message: "Server error occurred!"
            });

        return resp.status(200).json({
            success: true,
            results: results.length > 0 && Boolean(results[0].isLiked)
        });
    });
});

app.post("/api/comment", (req, resp, next) => {
    const ConsumerID = GetConsumerID(req);
    const {RecordID, Content} = req.body;
    const query = "INSERT INTO Comment(Content, ConsumerID, RecordID) VALUES(?, ?, ?);";
    pool.query(query, [Content, ConsumerID, RecordID], (err, results) => {
        if (err)
            return resp.status(500).json({
                success: false,
                message: "Server error occurred!"
            });

        return resp.status(201).json({
            success: true
        });
    });
});
app.post("/api/playlists", (req, resp, next) => {
    const {SongListID, RecordID} = req.body;
    const query = "INSERT INTO Contains(SongListID, SongID) VALUES(?, ?);";
    pool.query(query, [SongListID, RecordID], (err, results) => {
        if (err)
            return resp.status(500).json({
                success: false,
                message: "Server error occurred!"
            });
        return resp.status(201).json({
            success: true
        });
    });
});
app.post("/api/like", (req, resp, next) => {
    const ConsumerID = GetConsumerID(req);
    const {RecordID} = req.body;
    const query = "SELECT P.SongListID FROM Playlist AS P WHERE P.ConsumerID=? AND P.PlaylistType=1;";
    pool.query(query, [ConsumerID], (err, results) => {
        if (err)
            return resp.status(500).json({
                success: false,
                message: "Server error occurred!"
            });

        const {SongListID} = results[0];
        pool.query("INSERT INTO Contains(SongListID, SongID) VALUES(?, ?);", [SongListID, RecordID], (err, results) => {
            if (err)
                return resp.status(500).json({
                    success: false,
                    message: "Server error occurred!"
                });

            return resp.status(201).json({
                success: true
            });
        });
    });
});
app.post("/api/unlike", (req, resp, next) => {
    const ConsumerID = GetConsumerID(req);
    const {RecordID} = req.body;
    const query = "SELECT P.SongListID FROM Playlist AS P WHERE P.ConsumerID=? AND P.PlaylistType=1;";
    pool.query(query, [ConsumerID], (err, results) => {
        if (err)
            return resp.status(500).json({
                success: false,
                message: "Server error occurred!"
            });

        const {SongListID} = results[0];
        pool.query("DELETE FROM Contains WHERE SongListID=? AND SongID=?;", [SongListID, RecordID], (err, results) => {
            if (err)
                return resp.status(500).json({
                    success: false,
                    message: "Server error occurred!"
                });

            return resp.status(201).json({
                success: true
            });
        });
    });
});

app.post("/api/follow", (req, resp, next) => {
    const ConsumerID = GetConsumerID(req);
    console.log(ConsumerID);
    const {Username} = req.body;
    console.log(req.body);
    pool.query("SELECT UserID FROM User WHERE Username=?", [Username] ,(err, results) => {
        console.log(err);
        if (err)
            return resp.status(500).json({
                success: false,
                message: "Server error occurred!"
            });

        const FollowID = results[0].UserID;
        pool.query("INSERT INTO Follows(FollowerID, FollowedID) VALUES(?, ?);", [ConsumerID, FollowID], (err, results) => {
            console.log(err);
            if (err)
                return resp.status(500).json({
                    success: false,
                    message: "Server error occurred!"
                });

            return resp.status(201).json({
                success: true
            });
        });
    });
});
app.post("/api/unfollow", (req, resp, next) => {
    const ConsumerID = GetConsumerID(req);
    const {Username} = req.body;
    pool.query("SELECT UserID FROM User WHERE Username=?", [Username] ,(err, results) => {
        if (err)
            return resp.status(500).json({
                success: false,
                message: "Server error occurred!"
            });

        const FollowID = results[0].UserID;
        pool.query("DELETE FROM Follows WHERE FollowerID=? AND FollowedID=?", [ConsumerID, FollowID], (err, results) => {
            if (err)
                return resp.status(500).json({
                    success: false,
                    message: "Server error occurred!"
                });

            return resp.status(201).json({
                success: true
            });
        });
    });
});

app.post("/api/played-songs", (req, resp, next) => {
    const ConsumerID = GetConsumerID(req);
    console.log(ConsumerID);
    const {RecordID} = req.body;
    const query = "SELECT COUNT(*) as isFound FROM Playlist INNER JOIN Contains ON Playlist.SongListID=Contains.SongListID WHERE Playlist.PlaylistType=0 AND Playlist.ConsumerID=? AND Contains.SongID=?;";
    pool.query(query, [ConsumerID, RecordID], (err, results) => {
        console.log(err, results);
        if (err)
            return resp.status(500).json({
                success: false,
                message: "Server error occurred!"
            });

        const isFound = Boolean(results[0].isFound);

        pool.query("SELECT SongListID FROM Playlist WHERE ConsumerID=? AND PlaylistType=0;", [ConsumerID], (err, results) => {
            const {SongListID} = results[0];
            console.log("!!!!", SongListID);

            if (isFound) {
                pool.query("UPDATE Contains SET Time=now() WHERE SongID=? AND SongListID=?;", [RecordID, SongListID], (err, results) => {
                    if (err)
                        return resp.status(500).json({
                            success: false,
                            message: "Server error occurred!"
                        });

                    return resp.status(200).json({
                        success: true
                    });
                });
            }
            else {
                console.log("NOT FOUND !!!", SongListID, RecordID)
                pool.query("INSERT INTO Contains(SongListID, SongID) VALUES(?, ?);", [SongListID, RecordID], (err, results) => {
                    if (err)
                        return resp.status(500).json({
                            success: false,
                            message: "Server error occurred!"
                        });

                    return resp.status(200).json({
                        success: true
                    });
                });
            }
        });
    });
});

app.get("/api/genres", (req, resp, next) => {
   pool.query("SELECT GenreID, Name FROM Genre;", (err, results) => {
       if (err)
           return resp.status(500).json({
               success: false,
               message: "Server error occurred!"
           });

       return resp.status(200).json({
           success: true,
           results
       });
   });
});

// Uploads
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${__dirname}/uploads`);
    },
    filename: (req, file, cb) => {
        const fn = file.originalname;
        cb(null, `${new Date().toLocaleString('tr').split(" ")[0].replace(".", "-").replace(".", "-")}_${fn}`);
    },
});
const upload = multer({
    storage: multerStorage
});

app.post("/api/user/update", upload.single("ProfilePic"), (req, resp, next) => {
    const ConsumerID = GetConsumerID(req);
    const fileName = `http://localhost:3001/api/uploads/${req.file.filename}`;

    pool.query("UPDATE User Set ProfilePic=? WHERE UserID=?", [fileName, ConsumerID], (err, results) => {
        if (err)
            return resp.status(500).json({
                success: false,
                message: "Server error occurred!"
            });

        console.log(req.body);
        return resp.status(200).json({
            success: true
        });
    });
});

app.post("/api/playlists/create", upload.single("SongListPic"),(req, resp, next) => {
    const ConsumerID = GetConsumerID(req);
    const fileName = `http://localhost:3001/api/uploads/${req.file.filename}`;
    const {Name, Description} = req.body;

    const query = "INSERT INTO SongList(Name, Description, SongListPic) VALUES(?, ?, ?);";
    pool.query(query, [Name, Description, fileName], (err, results) => {
        if (err)
            return resp.status(500).json({
                success: false,
                message: "Server error occurred!"
            });

        const SongListID = results.insertId;

        const query = "INSERT INTO Playlist(SongListID, PlaylistType, ConsumerID) VALUES(?, 2, ?);";
        pool.query(query, [SongListID, ConsumerID], (err, results) => {
            if (err)
                return resp.status(500).json({
                    success: false,
                    message: "Server error occurred!"
                });
            return resp.status(200).json({
                success: true
            });
        });
    });
});

app.post("/api/songs/create", upload.array("multi", 2), (req, resp, next) => {
    const ConsumerID = GetConsumerID(req);
    const {Name, Singer, Duration, GenreID, LyricsContent} = req.body;

    const audioFileName = `${req.files[0].filename}`;
    const posterImageFileName = `http://localhost:3001/api/uploads/${req.files[1].filename}`;

    console.log(req.body, audioFileName, posterImageFileName);

    pool.query("INSERT INTO Record(RecordFile, Name, Duration, GenreID, CreatorID, RecordPic) VALUES(?, ?, ?, ?, ?, ?);", [audioFileName, Name, Duration, GenreID, ConsumerID, posterImageFileName], (err, results) => {
        console.log(err);
        if (err)
            return resp.status(500).json({
                success: false,
                message: "Server error occurred!"
            });

        const RecordID = results.insertId;

        if (LyricsContent) {
            pool.query("INSERT INTO Lyrics(Content) VALUES(?);", [LyricsContent], (err, results) => {
                console.log(err);
                if (err)
                    return resp.status(500).json({
                        success: false,
                        message: "Server error occurred!"
                    });

                const LyricsID = results.insertId;

                pool.query("INSERT INTO Song(RecordID, Singer, LyricsID) VALUES(?, ?, ?);", [RecordID, Singer, LyricsID], (err, results) => {
                    console.log(err);
                    if (err)
                        return resp.status(500).json({
                            success: false,
                            message: "Server error occurred!"
                        });

                    return resp.status(200).json({
                        success: true
                    });
                });
            });
        }
        else {
            pool.query("INSERT INTO Song(RecordID, Singer) VALUES(?, ?, ?);", [RecordID, Singer], (err, results) => {
                console.log(err);
                if (err)
                    return resp.status(500).json({
                        success: false,
                        message: "Server error occurred!"
                    });

                return resp.status(200).json({
                    success: true
                });
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});