export interface Version {
  id: string;
  timeStamp: string;
  userId: string;
  content: string;
  summary?: VersionChangeSummary;
  /** AI-generated narrative summary written by the Cloudflare Worker */
  aiSummary?: string;
  /** Owner-set chapter label, e.g. "First draft", "After client feedback" */
  chapterLabel?: string;
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
