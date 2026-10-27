---
title: "技术栈与项目地图：MCU、工业通信和边缘 AI"
description: "从 GD32/STM32 固件到 Linux 通信网关、RK3588 视觉和本地 AI 应用，整理公开项目中的技术实践。"
date: 2026-10-27 13:08:55 +0800
categories: [技术路线]
tags: [embedded, c, cpp, linux, edge-ai]
permalink: /posts/embedded-technology-map/
toc: true
comments: false
pin: true
---

我的项目主要围绕嵌入式设备展开：底层是 MCU 外设和通信接口，上层延伸到 Linux 网关、摄像头预览、边缘推理和本地 AI 应用。这篇文章把这些方向放到一张项目地图里，作为博客的阅读入口。

## 我在实践中使用的技术

| 方向 | 技术与工具 | 对应的工作 |
|---|---|---|
| MCU 固件 | C、GD32、STM32、CMSIS、Keil MDK | 外设初始化、GPIO 采集、中断与串口观测 |
| 实时系统 | FreeRTOS、SysTick、BSP | 多任务实验与固件工程组织 |
| 工业通信 | CAN、RS485、Modbus、I2C/SMBus、IPMB | 数据采集、协议转换和收发调试 |
| 嵌入式 Linux | Linux、C/C++、CMake、Shell、交叉编译 | 龙芯网关、板端工具和部署脚本 |
| 多媒体与边缘 AI | RK3588、V4L2、RKISP、RGA、Qt、RKNN、YOLOv5 | 多路采集、预处理、目标检测和预览 |
| 本地 AI 应用 | Python、FastAPI、Redis、PostgreSQL、Ollama | RSS 采集、结构化摘要和信息看板 |
| 开发与记录 | Git、GitHub、WSL、Python、Docker Compose | 构建检查、环境复现、版本与问题记录 |

这些技术对应不同层次的实践：有些是最小实验，有些是持续迭代的工程。项目状态和验证条件会在具体文章中分别说明。

## 从哪里开始阅读

### 1. MCU：从输入引脚到通信报文

数字量采集看起来只是读取 GPIO，但完整链路还包括电平语义、状态组织、发送调度、心跳和异常处理。这个方向适合从一个输入变化如何走到上位机开始理解。

阅读：[GD32 数字量采集：把 GPIO、CAN 与验证串起来]({{ '/posts/gd32-di32-can-notes/' | relative_url }})。

### 2. 通信网关：让两种总线按规则协作

LoongArch 网关连接 CAN 与 RS485。这里的重点是路由、请求应答、超时、去重和故障恢复，以及程序在目标 Linux 环境中的构建与部署。

阅读：[LoongArch 通信网关：协议转换之外的工程问题]({{ '/posts/loongarch-protocol-gateway/' | relative_url }})。

### 3. RK3588：把采集、推理和预览连成闭环

多路摄像头项目横跨 V4L2 采集、图像格式、硬件预处理、NPU 推理以及 Qt/Web 显示。它也让我能把“能出图”和“能稳定运行”作为两个独立问题来记录。

阅读：[RK3588 多路视觉：从 V4L2 采集到 Qt 与 Web 预览]({{ '/posts/rk3588-camera-edge-ai/' | relative_url }})。

### 4. 本地 AI：把信息处理流程做成可维护的应用

OSINT 看板把 RSS、消息队列、数据库、本地推理和页面展示组合起来。它更偏向应用集成，与设备侧工程形成互补。

阅读：[本地 AI 信息看板：把采集、分析与展示拆开]({{ '/posts/local-ai-osint-dashboard/' | relative_url }})。

## 项目与笔记的组织方式

[项目索引]({{ '/projects/' | relative_url }})列出公开仓库和各自的侧重点；[关于我]({{ '/about/' | relative_url }})介绍这些方向之间的联系。

后续笔记会围绕具体问题展开：记录环境、现象、定位过程、修改和验证结果。对于尚未完成板端验证的工作，会保留明确的进度说明。
