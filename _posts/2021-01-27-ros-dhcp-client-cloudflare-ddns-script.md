---
title: 'RouterOS 更新vlan46网络(dhcp-client)IP在Cloudflare解析的脚本'
layout: post
tags: []
category: 
---
分享一下根据网上+自己小改 适用于RouterOS 更新vlan46网络IP在Cloudflare解析的脚本(好拗口，语文不好)，也就是vlan46的DDNS脚本
```
{
   :local count [/ip route print count-only where comment="ct-tr069-route"]
   :if ($bound=1) do={
       :if ($count = 0) do={
            /ip route add gateway=$"gateway-address" comment="ct-tr069-route" dst-address=10.0.0.0/7 distance=10
        } else={
           :if ($count = 1) do={
               :local test [/ip route find where comment="ct-tr069-route"]
               :if ([/ip route get $test gateway]!= $"gateway-address") do={
                    /ip route set $test gateway=$"gateway-address"
                }
            } else={
               :error "Multiple routes found"
            }
        }
        /tool fetch mode=https http-method=put url="https://api.cloudflare.com/client/v4/zones/****你的zone ID***/dns_records/****你的记录ID****" http-header-field="content-type:application/json,X-Auth-Email:****cf的邮箱****,X-Auth-Key:****cf的key****" http-data="{\"type\":\"A\",\"name\":\"****域名****\",\"content\":\"$"lease-address"\",\"ttl\":120,\"proxied\":false}" output=none
    } else={
        /ip route remove [find comment="ct-tr069-route"]
    }
}
```
食用位置:
![食用位置](https://i.loli.net/2021/01/27/j4vst1WloBAfnFI.png "食用位置")

解释一下原理：
进来先找一下有多少条记录的comment也就是备注是“ct-tr069-route”的，ros貌似没有太好的办法去固定着id，路由有变动就会改id，很烦，貌似通过comment去找最好了
如果是分配到地址的状态，则增加一条10.0.0.0/7路由到tr069的网关上，据观察，电信的这个网从10.0.0.0-11.255.255.255都会分配到，如果不加到/7很可能访问不到别人。。
电信分给你的ip，是/21的网段，所以每次gateway都会变，要通过$"gateway-address"获取
![电信分配的IP](https://i.loli.net/2021/01/27/Ohb6W7NCz5yE81v.png "电信分配的IP")
然后加完路由之后，去通过cf的api更新一下地址，不在详细赘述了，要您自己改下cf api的参数，你问我怎么改？[Cloudflare API v4 Documentation](https://api.cloudflare.com/ "Cloudflare API v4 Documentation") 请

最后，如果执行的时候，如果不是bound状态的，就把这个路由删掉

欢迎在我的github page的issue区探讨一下更好的实现方式
[https://github.com/FsHtroy/FsHtroy.github.io/issues](https://github.com/FsHtroy/FsHtroy.github.io/issues)

2021.01.27