export interface Version {
  id: string;
  timeStamp: Date | string | { toDate: () => Date };
  userId: string;
  content: unknown;
}
