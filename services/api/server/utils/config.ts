import convict from "convict";
import json from "json5";

convict.addParser({ extension: "json", parse: json.parse });

export interface Config {
  env: string;

  port: number;

  db: {
    url: string;
    debug: boolean;
    pool: {
      min: number | null;
      max: number | null;
    };
  };

  auth: {
    url: string;
    audience: string;
    secret: string | null;
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

  auth: {
    url: {
      doc: "OAuth url",
      format: String,
      default: "https://my-domain.us.auth0.com",
      env: "AUTH_URL",
    },
    audience: {
      doc: "OAuth audience",
      format: String,
      default: "localhost",
      env: "AUTH_AUDIENCE",
    },
    secret: {
      doc: "Session secret",
      format: String,
      default: null,
      env: "AUTH_SECRET",
      sensitive: true,
    },
  },
};

export const config = convict(configSchema);

export default config;
