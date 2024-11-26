// לתרגול בעלמא. אפשר למחוק

import User from "../models/user.model";
import Chat from "../models/chat.model";
import Group from "../models/group.model";
import messageModel from "../models/message.model";

export const seedMessages = async () => {
  const user1 = await new User({
    name: "Yosi",
    password: "1234",
    phone_number: "05333",
  }).save();
  const user2 = await new User({
    name: "Omri",
    password: "1234",
    phone_number: "05444",
  }).save();
  const user3 = await new User({
    name: "Zion",
    password: "1234",
    phone_number: "05555",
  }).save();

  const chat = await new Chat({ members: [user1.id, user2.id] }).save();

  const group = await new Group({ name: "group1", admins: [user1.id] }).save();
  const chatGroup = await new Chat({
    members: [user1.id, user2.id, user3.id],
    group: group.id,
  }).save();

  user1.chats.push(chat.id, chatGroup.id);
  await user1.save();
  user2.chats.push(chat.id, chatGroup.id);
  await user2.save();
  user3.chats.push(chatGroup.id);
  await user3.save();

  const msg1 = await new messageModel({
    content: "Hi, how are you?",
    author: user1.id,
  }).save();

  const msg2 = await new messageModel({
    content: "OK",
    author: user2.id,
  }).save();
  const msg3 = await new messageModel({
    content: "Bye",
    author: user3.id,
  }).save();
  const msg4 = await new messageModel({
    content: "I'm ready",
    author: user1.id,
  }).save();
  const msg5 = await new messageModel({
    content: "When?",
    author: user2.id,
  }).save();
  const msg6 = await new messageModel({
    content: "Now!!!",
    author: user3.id,
  }).save();
  chatGroup.messages.push(msg1.id);
  chatGroup.messages.push(msg2.id);
  chatGroup.messages.push(msg3.id);
  chatGroup.messages.push(msg4.id);
  chatGroup.messages.push(msg5.id);
  chatGroup.messages.push(msg6.id);
  await chatGroup.save();
  chat.messages.push(msg1.id)
  chat.messages.push(msg2.id)
  chat.messages.push(msg4.id)
  chat.messages.push(msg5.id)
  await chat.save()
};

export const seed = async () => {
  const user1 = await new User({
    name: "user1",
    password: "1111",
    phone_number: "11111",
  }).save();
  const user2 = await new User({
    name: "user2",
    password: "2222",
    phone_number: "22222",
  }).save();
  const user3 = await new User({
    name: "user3",
    password: "3333",
    phone_number: "33333",
  }).save();
  const user4 = await new User({
    name: "user4",
    password: "4444",
    phone_number: "44444",
  }).save();
  const user5 = await new User({
    name: "user5",
    password: "1115",
    phone_number: "55555",
  }).save();
  const user6 = await new User({
    name: "user6",
    password: "1116",
    phone_number: "66666",
  }).save();
  const user7 = await new User({
    name: "user7",
    password: "1117",
    phone_number: "77777",
  }).save();
  const user8 = await new User({
    name: "user8",
    password: "1118",
    phone_number: "88888",
  }).save();

  const chat1 = await new Chat({ members: [user1.id, user2.id] }).save();
  const chat2 = await new Chat({ members: [user2.id, user3.id] }).save();
  const chat3 = await new Chat({ members: [user1.id, user3.id] }).save();

  const group1 = await new Group({ name: "group1", admins: [user1.id] }).save();
  const group2 = await new Group({ name: "group2", admins: [user4.id] }).save();

  const chatGroup1 = await new Chat({
    members: [user1.id],
    group: group1.id,
  }).save();
  const chatGroup2 = await new Chat({
    members: [user4.id],
    group: group2.id,
  }).save();

  user1.chats.push(chat1.id, chat3.id, chatGroup1.id);
  await user1.save();

  user2.chats.push(chat1.id, chat2.id);
  await user2.save();

  user3.chats.push(chat2.id, chat3.id);
  await user3.save();

  user4.chats.push(chatGroup2.id);
  await user4.save();

  const groupChat1 = await new Chat({
    members: [user4.id, user5.id, user6.id],
    group: group2.id,
  }).save();
};
