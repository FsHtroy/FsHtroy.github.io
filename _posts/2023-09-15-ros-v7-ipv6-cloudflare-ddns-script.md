---
title: 'RouterOS v7更新ipv6在Cloudflare解析的脚本'
layout: post
tags: []
category:
---

分享一下适用于RouterOS v7更新ipv6在Cloudflare解析的脚本
目前做得很戳，由于RouterOS v7上游更新ip后不会删掉老ip，目前采取关闭接口重新打开的方式，将导致网络断开，恢复时间取决于重新通过SLAAC拿到地址的时间。
**TODO🐦:记录ip到本地，后续先确定老地址id，直接删除老地址。**

脚本1(接口关闭脚本):

```
:local v6addrCount [/ipv6/address print count-only where interface=接口名称 and global];
:if ($"v6addrCount" > 1) do={
    :log info message="detect more than one v6 address,remove it";
    /interface/ethernet/disable 接口名称;
    /interface/ethernet/enable 接口名称;
    :delay 10000ms;
}
```

脚本2(ddns脚本,魔改别人的,别骂):

```
:global cfu do={\
    :local date [/system clock get date];\
    :local time [/system clock get time];\
    :local cfi "域名的id";\
    :local cfr "记录的id";\
    :local cfe "cloudflare的邮箱";\
    :local cfk "cloudflare的key";\
    :local cfd "ddns完整域名";\
    :local currentIP [/ipv6/address/get [find interface=接口名称 and global] address];\
    :local cfa [:pick $currentIP 0 [:find $currentIP "/"]];\
    :local cfp false;\
    /tool fetch mode=https\
    http-method=put\
    url="https://api.cloudflare.com/client/v4/zones/$cfi/dns_records/$cfr"\
    http-header-field="content-type:application/json,X-Auth-Email:$cfe,X-Auth-Key:$cfk"\
    http-data="{\"type\":\"AAAA\",\"name\":\"$cfd\",\"content\":\"$cfa\",\"ttl\":120,\"proxied\":$cfp,\"comment\":\"LastReport:$date $time\"}"\
    output=none\
}
:delay 1
$cfu
```

食用位置:
![新增Script](https://s2.loli.net/2023/09/15/4Z58WjsKcAQLXag.png "新增Script")
![新增Scheduler](https://s2.loli.net/2023/09/15/SmZvgNQHF1bIjsh.png "新增Scheduler")

解释一下原理：
脚本1,统计某个接口类型为global的ipv6有多少个,大于1个的关闭接口然后立刻打开,达到清理老地址的目的,然后hang 10s,目的是保证拿到了新的ip.
脚本2,根据接口读出来ipv6地址，然后去掉掩码,最后拼接下参数,去通过cf的api更新一下地址，不在详细赘述了，要自己改下cf api的参数，你问我怎么改？[Cloudflare API v4 Documentation](https://api.cloudflare.com/ "Cloudflare API v4 Documentation") 请

欢迎在我的github page的issue区探讨一下更好的实现方式
[https://github.com/FsHtroy/FsHtroy.github.io/issues](https://github.com/FsHtroy/FsHtroy.github.io/issues)

2023.09.15
