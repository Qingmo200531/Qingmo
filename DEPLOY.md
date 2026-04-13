# 清沫证券交易所 - 部署说明

这是一个基于 Next.js 开发的全球模拟证券交易系统。如果您想让异地的其他人也能使用，请参考以下步骤进行部署：

## 1. 准备代码仓库
将本项目代码上传至 **GitHub**、**GitLab** 或 **Bitbucket**。
> **注意**: 确保不要上传 `.env.local` 文件，该文件包含您的私密 API Key。

## 2. 选择部署平台 (推荐 Vercel)
Next.js 官方推荐使用 **Vercel** 进行一键部署，速度最快且完全免费（个人版）。

### 部署步骤:
1.  在 [Vercel 官网](https://vercel.com/) 注册并关联您的 GitHub 账号。
2.  点击 **"Add New"** -> **"Project"**。
3.  导入您的项目仓库。
4.  **关键步骤**: 在 **"Environment Variables"** (环境变量) 设置中，添加以下三项（对应您的 Alpaca Keys）：
    - `ALPACA_API_KEY`: 您的 API Key ID
    - `ALPACA_API_SECRET`: 您的 Secret Key
    - `ALPACA_BASE_URL`: `https://paper-api.alpaca.markets`
5.  点击 **"Deploy"**。

## 3. 分享链接
部署完成后，Vercel 会为您提供一个以 `.vercel.app` 结尾的公网链接（例如 `qingmo-exchange.vercel.app`）。您可以将这个链接发给任何人，他们就能通过手机或电脑访问您的网站了。

## 4. 后续功能建议
目前网站数据直接对接 Alpaca 模拟账号。如果希望实现多个独立用户拥有各自的初始资金和持仓，后续需要：
- 接入数据库 (如 Prisma + PostgreSQL)
- 完善用户认证系统 (NextAuth.js)

---
由 清沫证券交易所 开发团队提供支持
