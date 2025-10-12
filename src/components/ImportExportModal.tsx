'use client';

import { AlertCircle, CheckCircle, Download, Upload, X } from 'lucide-react';
import { useState } from 'react';

interface ImportResult {
  success: number;
  failed: number;
  skipped: number;
  details: Array<{
    name: string;
    key: string;
    status: 'success' | 'failed' | 'skipped';
    reason?: string;
  }>;
}

interface ImportExportModalProps {
  isOpen: boolean;
  mode: 'import' | 'export' | 'result';
  onClose: () => void;
  onImport?: (file: File) => Promise<ImportResult>;
  onExport?: () => void;
  result?: ImportResult;
}

export default function ImportExportModal({
  isOpen,
  mode,
  onClose,
  onImport,
  onExport,
  result,
}: ImportExportModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleFileSelect = async (file: File) => {
    if (!file.name.endsWith('.json')) {
      alert('请选择 JSON 格式的文件');
      return;
    }

    setIsProcessing(true);
    try {
      if (onImport) {
        await onImport(file);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4'>
      <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden'>
        {/* 头部 */}
        <div
          className={`relative p-6 ${
            mode === 'import'
              ? 'bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600'
              : mode === 'export'
              ? 'bg-gradient-to-r from-green-600 via-emerald-500 to-green-600'
              : result && result.failed > 0
              ? 'bg-gradient-to-r from-yellow-600 via-orange-500 to-yellow-600'
              : 'bg-gradient-to-r from-green-600 via-emerald-500 to-green-600'
          }`}
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='bg-white/20 backdrop-blur-sm p-3 rounded-xl'>
                {mode === 'import' ? (
                  <Upload className='w-6 h-6 text-white' />
                ) : (
                  <Download className='w-6 h-6 text-white' />
                )}
              </div>
              <div>
                <h2 className='text-2xl font-bold text-white'>
                  {mode === 'import'
                    ? '导入视频源'
                    : mode === 'export'
                    ? '导出视频源'
                    : '导入结果'}
                </h2>
                <p className='text-white/80 text-sm mt-1'>
                  {mode === 'import'
                    ? '从 JSON 文件导入视频源配置'
                    : mode === 'export'
                    ? '导出为 JSON 文件保存'
                    : '查看导入详情'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className='text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all'
            >
              <X className='w-6 h-6' />
            </button>
          </div>
        </div>

        {/* 内容区 */}
        <div className='flex-1 overflow-y-auto p-6'>
          {mode === 'import' && (
            <div className='space-y-4'>
              {/* 拖放区域 */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                }`}
              >
                <div className='flex flex-col items-center space-y-4'>
                  <div
                    className={`p-4 rounded-full ${
                      isDragging
                        ? 'bg-blue-100 dark:bg-blue-900/40'
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                  >
                    <Upload
                      className={`w-12 h-12 ${
                        isDragging
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-400 dark:text-gray-500'
                      }`}
                    />
                  </div>
                  <div>
                    <p className='text-lg font-medium text-gray-700 dark:text-gray-300'>
                      {isDragging ? '松开以上传文件' : '拖放文件到这里'}
                    </p>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                      或点击下方按钮选择文件
                    </p>
                  </div>
                  <label className='cursor-pointer'>
                    <input
                      type='file'
                      accept='.json'
                      onChange={handleFileInput}
                      className='hidden'
                      disabled={isProcessing}
                    />
                    <div
                      className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                        isProcessing
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isProcessing ? '处理中...' : '选择 JSON 文件'}
                    </div>
                  </label>
                </div>
              </div>

              {/* 说明文档 */}
              <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
                <h4 className='font-semibold text-blue-900 dark:text-blue-200 mb-2'>
                  📝 导入说明
                </h4>
                <ul className='text-sm text-blue-800 dark:text-blue-300 space-y-1'>
                  <li>• 支持标准 JSON 格式的视频源配置文件</li>
                  <li>• 重复的 key 将被跳过，不会覆盖现有配置</li>
                  <li>• 导入完成后会显示详细的导入结果</li>
                  <li>• 建议先导出备份，再进行导入操作</li>
                </ul>
              </div>
            </div>
          )}

          {mode === 'export' && (
            <div className='space-y-4'>
              <div className='text-center py-8'>
                <div className='inline-flex p-4 bg-green-100 dark:bg-green-900/40 rounded-full mb-4'>
                  <CheckCircle className='w-16 h-16 text-green-600 dark:text-green-400' />
                </div>
                <h3 className='text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2'>
                  准备导出
                </h3>
                <p className='text-gray-600 dark:text-gray-400'>
                  点击下方按钮开始导出视频源配置
                </p>
              </div>

              <div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4'>
                <h4 className='font-semibold text-green-900 dark:text-green-200 mb-2'>
                  📦 导出内容
                </h4>
                <ul className='text-sm text-green-800 dark:text-green-300 space-y-1'>
                  <li>• 视频源配置将导出为 JSON 格式</li>
                  <li>• 文件名：video_sources_YYYYMMDD_HHMMSS.json</li>
                  <li>• 包含所有视频源的完整配置信息</li>
                  <li>• 可用于备份或迁移到其他设备</li>
                </ul>
              </div>
            </div>
          )}

          {mode === 'result' && result && (
            <div className='space-y-4'>
              {/* 统计信息 */}
              <div className='grid grid-cols-3 gap-4'>
                <div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center'>
                  <div className='text-3xl font-bold text-green-600 dark:text-green-400'>
                    {result.success}
                  </div>
                  <div className='text-sm text-green-700 dark:text-green-300 mt-1'>
                    成功导入
                  </div>
                </div>
                <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center'>
                  <div className='text-3xl font-bold text-yellow-600 dark:text-yellow-400'>
                    {result.skipped}
                  </div>
                  <div className='text-sm text-yellow-700 dark:text-yellow-300 mt-1'>
                    已跳过
                  </div>
                </div>
                <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center'>
                  <div className='text-3xl font-bold text-red-600 dark:text-red-400'>
                    {result.failed}
                  </div>
                  <div className='text-sm text-red-700 dark:text-red-300 mt-1'>
                    导入失败
                  </div>
                </div>
              </div>

              {/* 详细列表 */}
              <div className='max-h-[300px] overflow-y-auto'>
                <div className='space-y-2'>
                  {result.details.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-start space-x-3 p-3 rounded-lg border ${
                        item.status === 'success'
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          : item.status === 'skipped'
                          ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                      }`}
                    >
                      {item.status === 'success' ? (
                        <CheckCircle className='w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5' />
                      ) : (
                        <AlertCircle
                          className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            item.status === 'skipped'
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        />
                      )}
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center space-x-2'>
                          <span className='font-medium text-gray-900 dark:text-gray-100 truncate'>
                            {item.name}
                          </span>
                          <span className='text-xs text-gray-500 dark:text-gray-400 font-mono'>
                            ({item.key})
                          </span>
                        </div>
                        {item.reason && (
                          <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                            {item.reason}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className='flex-shrink-0 p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-3'>
          {mode === 'export' && (
            <button
              onClick={onExport}
              className='px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg hover:from-green-700 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium text-sm'
            >
              确认导出
            </button>
          )}
          <button
            onClick={onClose}
            className='px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium text-sm'
          >
            {mode === 'result' ? '完成' : '取消'}
          </button>
        </div>
      </div>
    </div>
  );
}
