import React from "react";
import UserContext from "./UserContext";

export default function() {
  return (
    <UserContext.Consumer> {user => 
        <>
            <h1>Welcome back {user.username}</h1>
        </> 
    }</UserContext.Consumer>
  );
}
