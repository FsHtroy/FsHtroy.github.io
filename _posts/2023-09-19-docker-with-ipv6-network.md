---
title: 'Docker使用ipv6小记'
layout: post
tags: []
category:
---

**记录一下折腾在不同的服务提供商使用ipv6跑docker容器的惨痛教训**

##### 1.服务提供商有提供/64地址使用，但不是整个地址块指向你

**此类型已知厂商:vultr/scaleway**

###### 步骤1.打开Linux的内核参数文件

修改 /etc/sysctl.conf,新增

```
#接受IPv6 默认路由
net.ipv6.conf.all.accept_ra=2
#打开ipv6的内核转发
net.ipv6.conf.all.forwarding=1
#暂时不确定是否有效，先写着
net.ipv6.conf.all.proxy_ndp=1
```

###### 步骤2.安装软件包ndppd，把ipv6的prefix告诉你的服务商都在你这

```
#Rhel
yum install ndppd -y
#Debian
apt install ndppd -y
```

修改ndppd的配置文件/etc/ndppd.conf (没有就直接创建)

```
route-ttl 30000
proxy 你的外网接口 {
    router no
    timeout 500
    ttl 30000
    rule 你的整个/64(比如aabb:ccdd:114:514::/64) {
        static
    }
}
```

然后重启及设置开机启动

```
systemctl restart ndppd.service
systemctl enable ndppd.service
```

###### 步骤3.打开Docker的ipv6功能

修改/etc/docker/daemon.json，没有就新建

```
{
  "ipv6": true,
  "fixed-cidr-v6": "一段ipv6"
}
```

这里的ipv6有两种玩法，假设运营商给你的是aabb:ccdd:114:514::/64
0.docker貌似要求最小/80
1.fixed-cidr-v6直接给他整一段服务商给你的地址块，比如aabb:ccdd:114:514:1919::/80，然后你的docker跑在默认的bridge网络下的就会拿到这里面的地址。如果要指定ip的，再抠一段出来自己搞network
2.fixed-cidr-v6给他整一段私有地址，fd00::/8，但是不用默认的bridge，自己建一个新的network，整段拿进去用

**这种玩法相当于把整个容器暴露在公网，自己想办法防护**

##### 2.服务提供商有提供/64地址使用，而且把整个地址块指向你了

**此类型已知厂商:Linode**

参考第一节，不用配置ndppd就可以了


##### 3.服务提供商只给你一个ipv6地址使用

**此类型已知厂商:aws/qcloud**

###### 直接打开Docker的ipv6功能，nat6搞起

修改/etc/docker/daemon.json，没有就新建

```
{
  "ipv6": true,
  "fixed-cidr-v6": "一段ipv6",
  "ip6tables": true,
  "experimental": true
}
```

这里的ipv6因为没有运营商给你的地址块，只能用fd00::/8了，加上"ip6tables": true和"experimental": true，开启ipv6的nat

**这种玩法需要通过docker-proxy去nat，或者你可以自己想别的办法映射到外网ip去**
2023.09.15
