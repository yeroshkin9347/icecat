import uuid from "uuid-random";

export const newRandomInt = () => Math.floor(Math.random() * 100);

export const newUuid = () => uuid();
