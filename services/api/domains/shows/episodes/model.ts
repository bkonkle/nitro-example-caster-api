import type { Prisma } from "@prisma/client";

import type { Show } from "../model";

export type Episode = {
  id: string;
  title: string;
  summary?: string | null;
  picture?: string | null;
  content?: Prisma.JsonValue;
  showId?: string | null;
  show?: Show | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateInput = {
  title: string;
  summary?: string;
  picture?: string;
  content?: Prisma.JsonValue;
  showId: string;
};

export type UpdateInput = {
  title?: string;
  summary?: string;
  picture?: string;
  content?: Prisma.JsonValue;
  showId?: string;
};

export type EpisodesPage = {
  data: Episode[];
  count: number;
  total: number;
  page: number;
  pageCount: number;
};

export type EpisodeCondition = {
  id?: string;
  title?: string;
  summary?: string;
  picture?: string;
  showId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export const EpisodesOrdering = {
  IdAsc: "ID_ASC",
  IdDesc: "ID_DESC",
  TitleAsc: "TITLE_ASC",
  TitleDesc: "TITLE_DESC",
  SummaryAsc: "SUMMARY_ASC",
  SummaryDesc: "SUMMARY_DESC",
  CreatedAtAsc: "CREATED_AT_ASC",
  CreatedAtDesc: "CREATED_AT_DESC",
  UpdatedAtAsc: "UPDATED_AT_ASC",
  UpdatedAtDesc: "UPDATED_AT_DESC",
} as const;

export type EpisodesOrderBy =
  (typeof EpisodesOrdering)[keyof typeof EpisodesOrdering];
