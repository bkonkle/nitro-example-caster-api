import type { Prisma } from "@prisma/client";

export type Show = {
  id: string;
  title: string;
  summary?: string;
  picture?: string;
  content?: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
};

export type ShowsPage = {
  data: Show[];
  count: number;
  total: number;
  page: number;
  pageCount: number;
};

export type ShowCondition = {
  id?: string;
  title?: string;
  summary?: string;
  picture?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export const ShowsOrdering = {
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

export type ShowsOrderBy = (typeof ShowsOrdering)[keyof typeof ShowsOrdering];

export type CreateInput = {
  title: string;
  summary?: string;
  picture?: string;
  content?: Prisma.JsonValue;
};

export type UpdateInput = {
  title?: string;
  summary?: string;
  picture?: string;
  content?: Prisma.JsonValue;
};
