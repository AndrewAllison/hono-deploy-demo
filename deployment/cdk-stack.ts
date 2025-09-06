import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class HonoDeployStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create VPC
    const vpc = new ec2.Vpc(this, 'HonoVpc', {
      maxAzs: 2,
      natGateways: 1,
    });

    // Create ECS Cluster
    const cluster = new ecs.Cluster(this, 'HonoCluster', {
      vpc,
      clusterName: 'hono-cluster',
    });

    // Create Task Definition
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'HonoTaskDef', {
      memoryLimitMiB: 512,
      cpu: 256,
    });

    // Create CloudWatch Log Group
    const logGroup = new logs.LogGroup(this, 'HonoLogGroup', {
      logGroupName: '/ecs/hono-deploy',
      retention: logs.RetentionDays.ONE_WEEK,
    });

    // Add container to task definition
    const container = taskDefinition.addContainer('HonoContainer', {
      image: ecs.ContainerImage.fromAsset('../'),
      memoryLimitMiB: 512,
      cpu: 256,
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'hono',
        logGroup,
      }),
      environment: {
        NODE_ENV: 'production',
        PORT: '3000',
        HOST: '0.0.0.0',
        CORS_ORIGIN: '*',
        RATE_LIMIT_WINDOW: '900000',
        RATE_LIMIT_MAX: '100',
        LOG_LEVEL: 'info',
      },
    });

    container.addPortMappings({
      containerPort: 3000,
      protocol: ecs.Protocol.TCP,
    });

    // Create ECS Service
    const service = new ecs.FargateService(this, 'HonoService', {
      cluster,
      taskDefinition,
      desiredCount: 2,
      serviceName: 'hono-service',
      assignPublicIp: false,
    });

    // Create Application Load Balancer
    const alb = new elbv2.ApplicationLoadBalancer(this, 'HonoALB', {
      vpc,
      internetFacing: true,
      loadBalancerName: 'hono-alb',
    });

    // Create Target Group
    const targetGroup = new elbv2.ApplicationTargetGroup(this, 'HonoTargetGroup', {
      vpc,
      port: 3000,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targetType: elbv2.TargetType.IP,
      healthCheck: {
        enabled: true,
        healthyHttpCodes: '200',
        path: '/health',
        protocol: elbv2.Protocol.HTTP,
        port: '3000',
        interval: cdk.Duration.seconds(30),
        timeout: cdk.Duration.seconds(5),
        healthyThresholdCount: 2,
        unhealthyThresholdCount: 3,
      },
    });

    // Add targets to target group
    service.attachToApplicationTargetGroup(targetGroup);

    // Create ALB Listener
    const listener = alb.addListener('HonoListener', {
      port: 80,
      protocol: elbv2.ApplicationProtocol.HTTP,
      defaultTargetGroups: [targetGroup],
    });

    // Add HTTPS listener (requires SSL certificate)
    // listener.addCertificates('HonoCert', [certificate]);

    // Output ALB DNS name
    new cdk.CfnOutput(this, 'LoadBalancerDNS', {
      value: alb.loadBalancerDnsName,
      description: 'Application Load Balancer DNS name',
    });

    // Output ECS Service ARN
    new cdk.CfnOutput(this, 'ServiceArn', {
      value: service.serviceArn,
      description: 'ECS Service ARN',
    });
  }
}
