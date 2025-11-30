import "dotenv/config";

interface Config {
  JWT_SECRET: string;
}

const config: Config = {
  JWT_SECRET: process.env.JWT_SECRET!,
};

export default config;
