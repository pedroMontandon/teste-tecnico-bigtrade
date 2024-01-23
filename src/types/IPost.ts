export interface IRawPost {
  title: string;
  content: string;
  // published: Date;
  // updated: Date;
}

export interface INewPost extends IRawPost {
  userId: string;
}

export interface IPost extends INewPost {
  id: string;
  published: Date;
  updated: Date;
}
