export interface Version {
  id: string;
  timeStamp: string;
  userId: string;
  content: string;
  summary?: VersionChangeSummary;
}

export interface VersionChangeSummary {
  addedBlocks: number;
  updatedBlocks: number;
  removedBlocks: number;
}

export interface ReplayUserProfile {
  avatar: string;
  id: string;
  name: string;
}

export type ReplayProfilesByUserId = Record<string, ReplayUserProfile>;

export interface ReplayTimeline {
  roomId: string;
  title: string;
  shareId?: string;
  sharedAt?: string;
  profilesByUserId: ReplayProfilesByUserId;
  versions: Version[];
}
