#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { HonoDeployStack } from './cdk-stack';

const app = new cdk.App();

new HonoDeployStack(app, 'HonoDeployStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
  description: 'Hono TypeScript API deployed on AWS ECS with Fargate',
});

app.synth();
