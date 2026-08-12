export interface Category {
  _id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  children?: Category[];
}
