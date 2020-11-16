import React, { useState, useEffect } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db, firebase } from "./firebase";

function Post({ username, caption, imageUrl, postId, user }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setComment("");
  };
  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          alt={username}
          src="/static/images/avatar/1.jpg"
          className="post__avatar"
        />
        <h3>{username}</h3>
      </div>

      {/* header -> avatar and username */}
      <img className="post__image" src={imageUrl} alt="" />
      {/* image */}
      <h3 className="post__text">
        <b>{username}</b> {caption}
      </h3>
      {/* username + caption */}
      {
        <div className="post__comments">
          {comments.map((comment) => {
            return (
              <p>
                <b>{comment.username}</b> {comment.text}
              </p>
            );
          })}
        </div>
      }
      {user && (
        <form action="" className="post__commentbox">
          <input
            className="post__input"
            placeholder="Add a Comment... "
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            type="text"
          />
          <button
            disabled={!comment}
            className="post__button"
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
