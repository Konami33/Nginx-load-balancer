const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");

// Create a VPC
const vpc = new aws.ec2.Vpc("my-vpc", {
    cidrBlock: "10.0.0.0/16",
    tags: {
        Name: "my-vpc"
    }
});

exports.vpcId = vpc.id;

// Create a public subnet
const publicSubnet = new aws.ec2.Subnet("public-subnet", {
    vpcId: vpc.id,
    cidrBlock: "10.0.1.0/24",
    availabilityZone: "ap-southeast-1a",
    mapPublicIpOnLaunch: true,
    tags: {
        Name: "public-subnet"
    }
});

exports.publicSubnetId = publicSubnet.id;

// Create an Internet Gateway
const igw = new aws.ec2.InternetGateway("internet-gateway", {
    vpcId: vpc.id,
    tags: {
        Name: "igw"
    }
});

exports.igwId = igw.id;

// Create a route table
const publicRouteTable = new aws.ec2.RouteTable("public-route-table", {
    vpcId: vpc.id,
    tags: {
        Name: "rt-public"
    }
});

// Create a route in the route table for the Internet Gateway
const route = new aws.ec2.Route("igw-route", {
    routeTableId: publicRouteTable.id,
    destinationCidrBlock: "0.0.0.0/0",
    gatewayId: igw.id
});

// Associate the route table with the public subnet
const routeTableAssociation = new aws.ec2.RouteTableAssociation("public-route-table-association", {
    subnetId: publicSubnet.id,
    routeTableId: publicRouteTable.id
});

exports.publicRouteTableId = publicRouteTable.id;

// Create a security group for the public instance allowing all inbound traffic
const publicSecurityGroup = new aws.ec2.SecurityGroup("public-secgrp", {
    vpcId: vpc.id,
    description: "Allow all inbound traffic for public instance for testing purpose",
    ingress: [
        { protocol: "-1", fromPort: 0, toPort: 0, cidrBlocks: ["0.0.0.0/0"] }
    ],
    egress: [
        { protocol: "-1", fromPort: 0, toPort: 0, cidrBlocks: ["0.0.0.0/0"] }
    ]
});

// Use the specified Ubuntu 24.04 LTS AMI
const amiId = "ami-060e277c0d4cce553";

// Create an EC2 instance in the public subnet
const nginxInstance = new aws.ec2.Instance("nginx-instance", {
    instanceType: "t2.micro",
    vpcSecurityGroupIds: [publicSecurityGroup.id],
    ami: amiId,
    subnetId: publicSubnet.id,
    keyName: "nginx",
    associatePublicIpAddress: true,
    tags: {
        Name: "nginx-lb"
    }
});

exports.nginxInstanceId = nginxInstance.id;
exports.nginxInstanceIp = nginxInstance.publicIp;

const masterInstance = new aws.ec2.Instance("master-instance", {
    instanceType: "t3.small",
    vpcSecurityGroupIds: [publicSecurityGroup.id],
    ami: amiId,
    subnetId: publicSubnet.id,
    keyName: "k3sCluster",
    associatePublicIpAddress: true,
    tags: {
        Name: "master"
    }
});

exports.masterInstanceId = masterInstance.id;
exports.masterInstanceIp = masterInstance.publicIp;

const worker1Instance = new aws.ec2.Instance("worker1-instance", {
    instanceType: "t3.small",
    vpcSecurityGroupIds: [publicSecurityGroup.id],
    ami: amiId,
    subnetId: publicSubnet.id,
    keyName: "k3sCluster",
    associatePublicIpAddress: true,
    tags: {
        Name: "worker1"
    }
});

exports.worker1InstanceId = worker1Instance.id;
exports.worker1InstanceIp = worker1Instance.publicIp;

const worker2Instance = new aws.ec2.Instance("worker2-instance", {
    instanceType: "t3.small",
    vpcSecurityGroupIds: [publicSecurityGroup.id],
    ami: amiId,
    subnetId: publicSubnet.id,
    keyName: "k3sCluster",
    associatePublicIpAddress: true,
    tags: {
        Name: "worker2"
    }
});

exports.worker2InstanceId = worker2Instance.id;
exports.worker2InstanceIp = worker2Instance.publicIp;
