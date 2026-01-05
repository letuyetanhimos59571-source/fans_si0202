# DAG Silicone 网站框架（参考站结构复刻）

## 目标
- 完全复刻参考站的导航栏结构、页面层级关系与跳转逻辑。
- 按相同的样式规范搭建框架：字体、字号、间距、颜色方案。
- 为图片、图标、文档资源提供占位，记录原始尺寸与位置关系。
- 保留并实现参考站的响应式断点占位，后续替换为精确值。

## 文件结构
- 根页面：`/index.html`
- 集合：`/collections/`，包含 `feeding/`、`baby-product/`
- 产品：`/products/` 与示例详情 `/products/silicone-mold-ic005-egg-shape-chocolate-mould/`
- 专题：`/about/`、`/oem-odm/`、`/audit/`、`/environment/`、`/contact/`
- 资源：`/assets/images/`、`/assets/icons/`、`/assets/documents/`
- 样式：`/styles/variables.css`、`base.css`、`layout.css`、`header.css`、`footer.css`、`components.css`、`pages/*.css`、`responsive.css`
- 脚本：`/scripts/main.js`

## CSS 规范
- 变量：颜色（`--color-*`）、字体（`--font-*`）、间距（`--space-*`）。
- 栅格：12 栅格占位，容器宽度 `--container-max`（待替换为参考站值）。
- 模块拆分：头部、底部、通用组件与页面级样式分离，保证可维护性。

## 响应式断点占位
- 预置断点：`>=1200`、`992–1199`、`768–991`、`576–767`、`<576`。
- 在 `responsive.css` 标注各断点的布局变化（导航折叠、栅格调整、主视觉高度）。
- 后续以参考站的实际断点替换，并校准每页的布局与样式变化。

## 占位说明
- 首页主视觉：在 `#hero` 标注原始尺寸与裁剪策略（cover/contain）。
- 价值主张：8 个卡片，文案与顺序与参考站一致。
- 集合与产品页：网格卡片的主图尺寸、卡片宽度与间距待测量记录。
- 产品详情：主图与缩略图尺寸、画廊交互占位；规格与描述结构与参考站一致。
- 联系页面：字段与布局与参考站一致；验证码组件占位。
- 图标与文档：在 `assets/*/README.md` 中说明尺寸与用途，并在页面注释标注。

## 待补充清单
- 字体家族、字号层级、行高与字重的精确值。
- 颜色值（主色、强调色、文本、弱化、背景）与对比度校验。
- 容器宽度、栅格列数与各断点下的精确布局规则。
- 所有图片与图标的原始尺寸与裁剪策略记录。
- 导航与页脚链接的完整性核对（与参考站一致）。
- 集合与产品类别的完整列表、详情页字段映射。

## 国际化与字体
- 国际化：使用 i18next，资源文件位于 `assets/locales/messages_*.json`，支持 `zh/en/ja`；右上角选择器联动字体与语言。
- 字体：按参考站字体栈设置，并提供 WebFont 回退（Noto 系列）。

## 运行与验证
- 使用任意静态服务器在项目根目录运行，打开 `/index.html` 验证导航与路由。
- 在不同视窗宽度下验证响应式占位是否工作。
- 切换 CN/EN/JP 验证全站文本与字体是否即时更新；缺失键在控制台以 `[i18n] missing key` 记录。
- 后续将逐页测量参考站并替换占位为精确值，确保尺寸与位置完全一致。

## 部署指南

### 本地运行
- 使用 Python: `python -m http.server 8000`
- 使用 Node.js: `npx serve .`

### Vercel 部署
本项目已配置 `vercel.json`，支持一键部署到 Vercel 平台：
1. 将项目代码推送到 GitHub/GitLab/Bitbucket。
2. 在 Vercel 控制台导入项目。
3. 保持默认配置（Output Directory 为根目录），点击 Deploy。
4. 部署完成后即可访问生产环境链接。

## 版权与资产替换
- 文字与图片、图标与商标均可能受版权保护，仅在授权情况下复制与分发。
- 如已获得使用许可：将原站图片与文案替换到 `assets/images` 与 `assets/locales/messages_*.json`；否则继续保留占位资源。
- 在替换过程中保持原始尺寸与裁剪策略一致（cover/contain），并在注释中记录来源与用途。

