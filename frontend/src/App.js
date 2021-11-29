import React, {useEffect, useState} from 'react';
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {PageContext} from "./Components/PageContext";
import SongListDetail from "./Components/SongListDetail";
import UserProfile from "./Pages/UserProfile";
import Home from "./Pages/Home";
import FollowRelation from "./Pages/FollowRelation";
import Profile from "./Pages/Profile";
import RecentlyPlayed from "./Pages/RecentlyPlayed";
import Playlists from "./Pages/Playlists";
import Search from "./Pages/Search";
import SongDetail from "./Components/SongDetail";
import {PlayAudioContext} from "./Components/PlayAudioContext";
import CreatorPanel from "./Pages/CreatorPanel";
import {AuthContext} from "./Components/AuthContext";

const App = () => {
    const [page, setPage] = useState("");
    const [audio, setAudio] = useState(new Audio(""));
    const [element, setElement] = useState(null);
    const [playing, setPlaying] = useState({isPlaying: false});
    const [auth, setAuth] = useState({Username: "", Role: ""});

    useEffect(() => {
        audio.addEventListener('ended', () => setPlaying({isPlaying: false}));
        return () => {
            audio.removeEventListener('ended', () => setPlaying({isPlaying: false}));
        };
    }, [audio]);
    useEffect(() => {
        console.log("playing", playing);
        playing.isPlaying ? audio.play() : audio.pause();
    },[playing]);

    return (
        <PageContext.Provider value={[page, setPage]}>
            <PlayAudioContext.Provider value={[audio, element, playing, setAudio, setElement, setPlaying]}>
                <AuthContext.Provider value={[auth, setAuth]}>
                    <Router>
                        <Switch>
                            <Route path={"/"} exact={true}>
                                <Redirect to={"/home"} />
                            </Route>
                            <Route path={"/home"} exact={true}>
                                <Home />
                            </Route>
                            <Route path={"/search"} exact={true}>
                                <Search />
                            </Route>
                            <Route path={"/users/:Username"} exact={true}>
                                <UserProfile />
                            </Route>
                            <Route path={"/users/:Username/followers"} exact={true}>
                                <FollowRelation Type={"Followers"} />
                            </Route>
                            <Route path={"/users/:Username/following"} exact={true}>
                                <FollowRelation Type={"Following"} />
                            </Route>
                            <Route path={"/profile"} exact={true}>
                                <Profile />
                            </Route>
                            <Route path={"/recently-played"} exact={true}>
                                <RecentlyPlayed />
                            </Route>
                            <Route path={"/playlists"} exact={true}>
                                <Playlists />
                            </Route>
                            <Route path={"/playlists/:SongListID"} exact={true}>
                                <SongListDetail />
                            </Route>
                            <Route path={"/songs/:RecordID"} exact={true}>
                                <SongDetail />
                            </Route>
                            <Route path={"/creator-panel"} exact={true}>
                                <CreatorPanel />
                            </Route>
                            <Route path={"/account/login"} component={Login} exact={true} />
                            <Route path={"/account/register"} component={Register} exact={true} />
                        </Switch>
                    </Router>
                </AuthContext.Provider>
            </PlayAudioContext.Provider>
        </PageContext.Provider>
    );
};

export default App;