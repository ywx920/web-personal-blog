---
title: Projects
icon: fas fa-layer-group
order: 4
permalink: /projects/
---

这里按工程方向整理我的公开仓库。每个项目的构建环境、使用方式和当前限制，以对应仓库中的说明为准。

## 主要项目

### GD32 数字量采集与 CAN 固件

围绕 GPIO 输入采集、状态编码、CAN 周期上报、心跳与参数处理组织固件，并使用主机测试检查协议和发送队列逻辑。

**技术：** C、GD32F450、CAN、Keil MDK、Python。  
**当前状态：** 已有编译和主机测试记录，对应版本仍待板端联调。

[代码仓库](https://github.com/ywx920/gd32f450-di32-can-firmware) · [项目笔记]({{ '/posts/gd32-di32-can-notes/' | relative_url }})

### LoongArch CAN / RS485 网关

在 Linux/龙芯平台上实现通信路由、Modbus 转换、去重、超时和恢复相关逻辑，并组织交叉编译与部署配置。

**技术：** C11、Linux、LoongArch、CAN、RS485、Modbus、CMake。  
**当前状态：** 开发版本，完整硬件组合与长期稳定性仍需继续验证。

[代码仓库](https://github.com/ywx920/loongarch-can-rs485-gateway) · [项目笔记]({{ '/posts/loongarch-protocol-gateway/' | relative_url }})

### RK3588 多路摄像头与边缘推理

从最小 V4L2 采集闭环出发，接入 RGA 图像处理、RKNN 检测与 Qt/Web 预览，记录多路调度、缓冲管理和编码回退。

**技术：** C++、RK3588、V4L2、RKISP、RGA、Qt、RKNN、YOLOv5。  
**当前状态：** 持续迭代，公开文档包含已验证路径和硬件加速的限制。

[代码仓库](https://github.com/ywx920/rk3588-multi-camera-demo) · [项目笔记]({{ '/posts/rk3588-camera-edge-ai/' | relative_url }})

### 本地 AI 信息看板

把公开 RSS 采集、队列处理、结构化摘要、数据库和网页展示组合成一个本地应用。

**技术：** Python、FastAPI、Redis、PostgreSQL、Ollama、Docker Compose、Chart.js。  
**当前状态：** 学习与工程实验，告警、聚类与趋势分析仍是后续方向。

[代码仓库](https://github.com/ywx920/osint-local-ai-dashboard) · [项目笔记]({{ '/posts/local-ai-osint-dashboard/' | relative_url }})

## 固件基础与协议实验

| 仓库 | 方向 |
|---|---|
| [gd32f407-mdk-template](https://github.com/ywx920/gd32f407-mdk-template) | GD32 标准库与 MDK 工程模板 |
| [gd32f407-up-lite-firmware](https://github.com/ywx920/gd32f407-up-lite-firmware) | 板级驱动与外设相关固件 |
| [gd32f407-freertos-demo](https://github.com/ywx920/gd32f407-freertos-demo) | FreeRTOS 多任务与基础外设实验 |
| [gd32f407-freertos-firmware](https://github.com/ywx920/gd32f407-freertos-firmware) | RTOS 与网络相关工程实践 |
| [stm32f103-ipmb-freertos-firmware](https://github.com/ywx920/stm32f103-ipmb-freertos-firmware) | I2C/IPMB、USART 与中断收发实验 |
| [gd32f407-zx2103-firmware](https://github.com/ywx920/gd32f407-zx2103-firmware) | 板级固件与器件通信适配记录 |
| [stm32f103-zx2505-bmc-firmware](https://github.com/ywx920/stm32f103-zx2505-bmc-firmware) | BMC 场景中的外设与 IPMB 相关实验 |

## 网站与记录

- [web-personal-blog](https://github.com/ywx920/web-personal-blog)：本站的文章、项目索引和配置。
- [web-personal-site](https://github.com/ywx920/web-personal-site)：个人网页实验。

[回到技术栈总览]({{ '/posts/embedded-technology-map/' | relative_url }})。
