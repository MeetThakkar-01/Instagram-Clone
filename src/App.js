import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./firebase";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from "react-instagram-embed";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [posts, setPosts] = useState([]);

  const [open, setOpen] = useState(false);
  const [openSignIn, setopenSignIn] = useState(false);
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // Logged In User
        console.log(authUser);
        setUser(authUser);
      } else {
        // loggedOut User
        setUser(null);
      }
    });

    return () => {
      // perform Clean Up Actions
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapShot) => {
        setPosts(
          snapShot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      });
  }, [posts]);

  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setopenSignIn(false);
  };

  return (
    <div className="app">
      <div>
        <Modal open={open} onClose={() => setOpen(false)}>
          <div style={modalStyle} className={classes.paper}>
            <form className="app__signup">
              <center>
                <img
                  className="app__headerImage"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1200px-Instagram_logo_2016.svg.png"
                  alt=""
                />
              </center>
              <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setusername(e.target.value)}
              />
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
              />
              <Button type="submit" onClick={signUp}>
                Sign Up
              </Button>
            </form>
          </div>
        </Modal>
      </div>

      <div>
        <Modal open={openSignIn} onClose={() => setopenSignIn(false)}>
          <div style={modalStyle} className={classes.paper}>
            <form className="app__signup">
              <center>
                <img
                  className="app__headerImage"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1200px-Instagram_logo_2016.svg.png"
                  alt=""
                />
              </center>
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
              />
              <Button type="submit" onClick={signIn}>
                Sign In
              </Button>
            </form>
          </div>
        </Modal>
      </div>

      {/* Header */}
      <div className="app__header">
        <img
          src="https://e7.pngegg.com/pngimages/712/1009/png-clipart-letter-instagram-font-instagram-text-logo.png"
          alt="Logo"
          className="app__headerImage"
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>LogOut</Button>
        ) : (
          <div className="app__logincontainer">
            <Button onClick={() => setopenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      {/* Posts */}
      <div className="app__posts">
        <div className="app__postsleft">
          {posts.map(({ id, post }) => {
            return (
              <Post
                key={id}
                postId={id}
                username={post.username}
                caption={post.caption}
                imageUrl={post.imageUrl}
                user={user}
              />
            );
          })}
        </div>
        <div className="app__postsright">
          <InstagramEmbed
            clientAccessToken="379800919793240|db76ef1e03bd471470bcb877013463ea"
            url="https://www.instagram.com/p/B6LbB-GhOsf/"
            maxWidth={375}
            hideCaption={false}
            containerTagName="div"
            injectScript
            protocol=""
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {/* Posts */}
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry, You nedd to Login to Add New Post</h3>
      )}
    </div>
  );
}

export default App;
