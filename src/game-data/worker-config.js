import config from '../config';

const testing = config.test;

export const worker = {
  speed: testing ? 0.4 : 1,
  salary: 500,
  payTime: 180,
};
