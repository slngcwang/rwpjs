---
nav:
  title: 组件
  path: /components
group:
  path: /components/display
  title: 数据展现
title: QRCode 二维码
---

# QRCode 二维码

## 代码演示


```tsx
/**
 * title: 常规
 * desc: 一个显示二维码的组件,可用手机扫描二维码 默认为120px 可通过style来进行设置宽高 
 */

import React, { useState } from 'react'
import { QRCode, Input } from '@rwp/react-ui'

export default () => {
    const [value, setValue] = useState('')
    return (
        <>
            <Input
                onChange={(value) => {
                   setValue(value)
                }}
            />
            <QRCode
                value={value || '无法飞翔的翅膀也是有意义的，因为它是曾经翱翔于天空的珍贵的回忆。'}
            />
        </>
    )
}
```


## API


|属性        |说明	       |类型	  |默认属性
|-----      |------       |-----     |-----    
|value       |二维码的内容 |`string`  |-
|style       |当前组件的样式| `CSSProperties`| -
