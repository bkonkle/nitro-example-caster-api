export interface Role {
  key: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface Permission {
  key: string;
  name: string;
  description: string;
}
