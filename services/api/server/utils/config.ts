import convict from "convict";
import json from "json5";

convict.addParser({ extension: "json", parse: json.parse });

export interface Config {
  env: string;

  port: number;

  db: {
    host: string;
    username: string;
    password: string;
    name: string;
    port: number;
    url: string;
    debug: boolean;
    pool: {
      min: number | null;
      max: number | null;
    };
  };

  redis: {
    url: string;
  };

  auth: {
    url: string;
    audience: string;
    client: {
      id: string | null;
      secret: string | null;
    };
  };
}

export const configSchema: convict.Schema<Config> = {
  env: {
    doc: "The application environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV",
  },

  port: {
    doc: "The port to bind to.",
    format: "port",
    default: 4000,
    env: "PORT",
    arg: "port",
  },

  db: {
    host: {
      doc: "Database host name/IP",
      format: String,
      default: "localhost",
      env: "DATABASE_HOSTNAME",
    },
    username: {
      doc: "Database username",
      format: String,
      default: "caster",
      env: "DATABASE_USERNAME",
    },
    password: {
      doc: "Database password",
      format: String,
      default: "caster",
      env: "DATABASE_PASSWORD",
      sensitive: true,
    },
    name: {
      doc: "Database name",
      format: String,
      default: "caster",
      env: "DATABASE_NAME",
    },
    port: {
      doc: "Database port",
      format: "port",
      default: 1701,
      env: "DATABASE_PORT",
    },
    url: {
      doc: "Database url",
      format: String,
      default: "postgresql://caster:caster@localhost:1701/caster",
      env: "DATABASE_URL",
      arg: "db-url",
    },
    debug: {
      doc: "Database debug logging",
      format: Boolean,
      default: false,
      env: "DATABASE_DEBUG_LOGGING",
      arg: "db-debug",
    },
    pool: {
      min: {
        doc: "Database pool min",
        format: "int",
        default: null,
        env: "DATABASE_POOL_MIN",
        arg: "db-min",
      },
      max: {
        doc: "Database pool max",
        format: "int",
        default: null,
        env: "DATABASE_POOL_MAX",
        arg: "db-max",
      },
    },
  },

  redis: {
    url: {
      doc: "Redis url",
      format: String,
      default: "localhost:6379",
      env: "REDIS_URL",
      arg: "redis-url",
    },
  },

  auth: {
    url: {
      doc: "OAuth2 url",
      format: String,
      default: "https://my-domain.us.auth0.com",
      env: "OAUTH2_URL",
    },
    audience: {
      doc: "OAuth2 audience",
      format: String,
      default: "localhost",
      env: "OAUTH2_AUDIENCE",
    },
    client: {
      id: {
        doc: "OAuth2 client id",
        format: String,
        default: null,
        env: "OAUTH2_CLIENT_ID",
      },
      secret: {
        doc: "OAuth2 client secret",
        format: String,
        default: null,
        env: "OAUTH2_CLIENT_SECRET",
        sensitive: true,
      },
    },
  },
};

export const defaultConfig = convict(configSchema);
