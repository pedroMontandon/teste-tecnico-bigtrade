export interface IRawPost {
  title: string;
  content: string;
}

export interface INewPost extends IRawPost {
  userId: string;
}

export interface IPost extends INewPost {
  id: string;
  published: Date;
  updated: Date;
}
