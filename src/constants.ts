import 'dotenv/config';
import fs from 'fs';
import { parse } from 'yaml';

export type UTMKeys = {
  campaign: string;
  medium: string;
  source: string;
};

export type EmailVariation = {
  key: string;
} & UTMKeys;

export type EmailTestGroup = {
  outlook?: string[];
  draft?: string[];
  prototype?: string[];
  production?: string[];
  client?: string[];
};

export type EmailJob = {
  email: string;
  subject: string;
  variations: EmailVariation[];
};

export type TestConfig = {
  client: string;
  jobs: EmailJob[];
  test_group: keyof EmailTestGroup;
  testers: EmailTestGroup[];
};

export type GCEmailRenderMode = 'all' | 'new' | 'updated';

export type GCEmailConfig = {
  root: string;
  mjml: string;
  html: string;
  mode: GCEmailRenderMode;
  email: TestConfig;
};

export const ROOT = process.env.PWD ?? process.cwd();

export const UTM_REGEX = /\?UTMLINK/g;

export const RENDER_MODE_OPTIONS: GCEmailRenderMode[] = ['all', 'new', 'updated'];

if (!fs.existsSync(`${ROOT}/config.yml`)) {
  throw new Error('config.yml file not found');
}

if (!fs.existsSync(`${ROOT}/.env`)) {
  throw new Error('.env file not found');
}

export const CONFIG: GCEmailConfig = {
  root: ROOT,
  mjml: process.env.DIR_MJML ?? 'mjml',
  html: process.env.DIR_HTML ?? 'html',
  mode: process.env.RENDER_MODE
    ? RENDER_MODE_OPTIONS.includes(process.env.RENDER_MODE as GCEmailRenderMode)
      ? (process.env.RENDER_MODE as GCEmailRenderMode)
      : 'updated'
    : 'updated',
  email: parse(fs.readFileSync(`${ROOT}/config.yml`, 'utf8')),
};

export const ROOT_MJML = `${CONFIG.root}/${CONFIG.mjml}`;
export const ROOT_HTML = `${CONFIG.root}/${CONFIG.html}`;
