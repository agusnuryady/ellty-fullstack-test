export type PostTree = {
  id: string;
  value: number;
  parentId: string | null;
  userId: string;
  children: PostTree[];
};
