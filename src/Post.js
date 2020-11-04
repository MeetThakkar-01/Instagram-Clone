import React from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';


function Post({username, caption, imageUrl}) {
    return (
        <div className="post">
            <div className="post__header">
                <Avatar alt="Meet Thakkar" src="/static/images/avatar/1.jpg" className="post__avatar" />
    <h3>{username}</h3>
            </div>
            
            {/* header -> avatar and username */}
            <img className="post__image" src={imageUrl} alt=""/>
            {/* image */}
    <h3 className="post__text"><b>{username}</b> This is My Caption For The Post</h3>
            {/* username + caption */}
        </div>
    )
}

export default Post
