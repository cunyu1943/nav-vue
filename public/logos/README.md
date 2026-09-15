# 本地 Logo 目录

把网站 logo 图片（png / jpg / svg / webp 均可）放在本目录，然后在 `src/data/sites.json` 中用相对路径引用：

```json
{
  "name": "示例网站",
  "url": "https://example.com",
  "logo": "logos/example.png",
  "description": "这是一个示例网站"
}
```

## logo 字段的三种写法

| 写法 | 示例 | 说明 |
| --- | --- | --- |
| 留空或不填 | `"logo": ""` | 自动通过在线 favicon 服务获取该网站图标 |
| 相对路径 | `"logo": "logos/example.png"` | 使用本目录（`public/logos/`）下的本地图片 |
| 完整 URL | `"logo": "https://example.com/icon.png"` | 直接使用在线图片 |

> 建议尺寸：96×96 以上、正方形。图片加载失败时会自动降级为「首字母头像」。
