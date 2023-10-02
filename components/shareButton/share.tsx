"use client";
import React from "react";
import { FacebookShareButton, TwitterShareButton } from "react-share";

const ShareComponent = ({ url, title }) => {
  return (
    <div className="flex flex-row gap-2 text-light-2">
      <FacebookShareButton url={url} quote={title}>
      
        Share on Facebook
      </FacebookShareButton>
      <TwitterShareButton url={url} title={title}>
        Share on Twitter
      </TwitterShareButton>
    </div>
  );
};

export default ShareComponent;
