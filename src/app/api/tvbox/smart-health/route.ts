/* eslint-disable no-console, @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

import { getSpiderJar, getSpiderStatus } from '@/lib/spiderJar';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * 智能TVBox健康检查API
 * 提供全面的诊断信息和优化建议，解决 "spider unreachable" 问题
 */

// 网络环境检测
function detectNetworkEnvironment(req: NextRequest): {
  isDomestic: boolean;
  region: string;
  userAgent: string;
  acceptLanguage: string;
} {
  const headers = req.headers;
  const userAgent = headers.get('user-agent') || '';
  const acceptLanguage = headers.get('accept-language') || '';
  const cfCountry = headers.get('cf-ipcountry') || '';
  const xForwardedFor = headers.get('x-forwarded-for') || '';

  // 检测是否为国内网络环境
  let isDomestic = false;
  let region = 'international';

  if (cfCountry === 'CN' || cfCountry === 'HK' || cfCountry === 'TW') {
    isDomestic = true;
    region = cfCountry;
  } else if (
    acceptLanguage.includes('zh-CN') ||
    acceptLanguage.includes('zh-Hans')
  ) {
    isDomestic = true;
    region = 'cn-detected';
  } else if (xForwardedFor) {
    // 简单的IP地址判断（国内常见IP段）
    const ip = xForwardedFor.split(',')[0].trim();
    if (
      ip.startsWith('116.') ||
      ip.startsWith('117.') ||
      ip.startsWith('118.') ||
      ip.startsWith('119.') ||
      ip.startsWith('121.') ||
      ip.startsWith('122.') ||
      ip.startsWith('123.') ||
      ip.startsWith('124.')
    ) {
      isDomestic = true;
      region = 'cn-ip-detected';
    }
  }

  return {
    isDomestic,
    region,
    userAgent,
    acceptLanguage,
  };
}

// 测试单个URL的可达性
async function testUrlReachability(
  url: string,
  timeoutMs = 5000
): Promise<{
  success: boolean;
  responseTime: number;
  statusCode?: number;
  error?: string;
  size?: number;
}> {
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(url, {
      method: 'HEAD', // 只获取头部信息，节省带宽
      signal: controller.signal,
      headers: {
        'User-Agent': 'DecoTV-HealthCheck/2.0',
        Accept: '*/*',
        'Cache-Control': 'no-cache',
      },
    });

    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;

    if (response.ok) {
      const contentLength = response.headers.get('content-length');
      return {
        success: true,
        responseTime,
        statusCode: response.status,
        size: contentLength ? parseInt(contentLength) : undefined,
      };
    } else {
      return {
        success: false,
        responseTime,
        statusCode: response.status,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    return {
      success: false,
      responseTime,
      error: error.message || 'Network error',
    };
  }
}

// 生成针对性的优化建议
function generateRecommendations(
  networkEnv: any,
  spiderStatus: any,
  testResults: any[]
): string[] {
  const recommendations: string[] = [];

  // 基于网络环境的建议
  if (networkEnv.isDomestic) {
    recommendations.push('🏠 检测到国内网络环境，已优化JAR源选择策略');

    const successfulDomesticSources = testResults.filter(
      (r) =>
        r.success &&
        (r.url.includes('gitee') ||
          r.url.includes('gitcode') ||
          r.url.includes('agit'))
    );

    if (successfulDomesticSources.length === 0) {
      recommendations.push(
        '⚠️ 国内主要源不可用，建议检查网络连接或尝试使用代理'
      );
    }
  } else {
    recommendations.push('🌍 检测到国际网络环境，已启用全球CDN加速');

    const successfulCdnSources = testResults.filter(
      (r) =>
        r.success &&
        (r.url.includes('jsdelivr') ||
          r.url.includes('fastly') ||
          r.url.includes('unpkg'))
    );

    if (successfulCdnSources.length === 0) {
      recommendations.push('⚠️ 主要CDN源不可用，建议检查DNS设置或网络防火墙');
    }
  }

  // 基于Spider状态的建议
  if (!spiderStatus?.success) {
    recommendations.push(
      '🔧 当前使用备用JAR，功能可能受限，建议重试或联系管理员'
    );
  } else if (spiderStatus.tried > 5) {
    recommendations.push(
      '📡 多个源尝试后才成功，建议检查网络稳定性或切换网络环境'
    );
  }

  // 基于响应时间的建议
  const avgResponseTime =
    testResults
      .filter((r) => r.success)
      .reduce((sum, r) => sum + r.responseTime, 0) /
    Math.max(1, testResults.filter((r) => r.success).length);

  if (avgResponseTime > 3000) {
    recommendations.push(
      '🐌 网络响应较慢，建议选择延迟较低的网络或使用有线连接'
    );
  } else if (avgResponseTime < 1000) {
    recommendations.push('🚀 网络响应良好，配置加载应该很流畅');
  }

  // TVBox特定建议
  recommendations.push('📱 建议在TVBox中启用"智能解析"和"自动重试"选项');
  recommendations.push('🔄 如遇到加载问题，可尝试在TVBox中手动刷新配置');

  return recommendations;
}

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now();

    // 检测网络环境
    const networkEnv = detectNetworkEnvironment(request);

    // 获取当前Spider状态
    const spiderStatus = getSpiderStatus();

    // 强制刷新获取最新JAR状态
    const freshSpider = await getSpiderJar(true);

    // 测试关键源的可达性（选择代表性的源进行测试）
    const testSources = [
      'https://gitee.com/q215613905/TVBoxOS/raw/main/JAR/XC.jar',
      'https://cdn.jsdelivr.net/gh/hjdhnx/dr_py@main/js/drpy.jar',
      'https://ghproxy.com/https://raw.githubusercontent.com/hjdhnx/dr_py/main/js/drpy.jar',
      'https://pan.shangui.cc/f/VGyEIg/XC.jar',
    ];

    // 并发测试多个源的可达性
    const reachabilityTests = await Promise.allSettled(
      testSources.map(async (url) => ({
        url,
        ...(await testUrlReachability(url, 8000)),
      }))
    );

    const testResults = reachabilityTests
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value);

    // 生成智能建议
    const recommendations = generateRecommendations(
      networkEnv,
      spiderStatus,
      testResults
    );

    // 计算总体健康分数
    const successfulTests = testResults.filter((r) => r.success).length;
    const healthScore = Math.round(
      (successfulTests / testSources.length) * 100
    );

    const response = {
      success: true,
      timestamp: Date.now(),
      executionTime: Date.now() - startTime,

      // 网络环境信息
      network: {
        environment: networkEnv.isDomestic ? 'domestic' : 'international',
        region: networkEnv.region,
        optimized: true,
      },

      // Spider JAR 状态
      spider: {
        current: {
          success: freshSpider.success,
          source: freshSpider.source,
          size: freshSpider.size,
          md5: freshSpider.md5,
          cached: freshSpider.cached,
          tried_sources: freshSpider.tried,
        },
        cached: spiderStatus,
      },

      // 可达性测试结果
      reachability: {
        total_tested: testSources.length,
        successful: successfulTests,
        health_score: healthScore,
        tests: testResults,
      },

      // 智能建议
      recommendations,

      // 状态评估
      status: {
        overall:
          healthScore >= 75
            ? 'excellent'
            : healthScore >= 50
            ? 'good'
            : 'needs_attention',
        spider_available: freshSpider.success,
        network_stable: successfulTests >= 2,
        recommendations_count: recommendations.length,
      },
    };

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Health check failed',
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}
