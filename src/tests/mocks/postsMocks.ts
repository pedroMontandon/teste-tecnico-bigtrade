import { IPost, IRawPost } from "../../types/IPost";


export const validPosts: IPost[] = [
  {
    id: "65afcaf902208fe6f4ade88b",
    title: "Admin post",
    content: "One admin to impose, one post to rule them all",
    userId: "65afb52622f053a0ffda18a3",
    published: new Date(),
    updated: new Date(),
  },
  {
    id: "65afcaf902208fe6f4ade88d",
    title: "User post",
    content: "One user to find them, one post to bring them all",
    userId: "65afb52922f053a0ffda18a7",
    published: new Date(),
    updated: new Date(),
  },
];

export const rawPost: IRawPost = {
  title: 'Admin post',
  content: 'One admin to impose, one post to rule them all'
};

export const postWithoutTitle: Partial<IRawPost> = {
  content: 'One admin to impose, one post to rule them all'
};

export const postWithoutContent: Partial<IRawPost> = {
  title: 'Admin post',
};

export const postWithShortTitle: Partial<IRawPost> = {
  title: 'Ad',
  content: 'One admin to impose, one post to rule them all'
};

export const postWithShortContent: Partial<IRawPost> = {
  title: 'Admin post',
  content: 'One'
};