#!/usr/bin/env bash
# 一键将 WebM 录音转换为 320k 高保真 MP3
set -e

DOWNLOADS_DIR="$HOME/Downloads"

if [ -n "$1" ]; then
  # 转换指定文件
  TARGET="$1"
  if [ ! -f "$TARGET" ]; then
    echo "❌ 文件不存在: $TARGET"
    exit 1
  fi
  OUTPUT="${TARGET%.*}.mp3"
  echo "🎵 正在转换: $TARGET -> $OUTPUT"
  ffmpeg -y -i "$TARGET" -vn -c:a libmp3lame -b:a 320k "$OUTPUT"
  echo "✅ 转换完成: $OUTPUT"
else
  # 批量转换 Downloads 目录下的 audio_record_*.webm
  echo "🔍 扫描下载目录: $DOWNLOADS_DIR"
  shopt -s nullglob
  FILES=("$DOWNLOADS_DIR"/audio_record_*.webm)
  
  if [ ${#FILES[@]} -eq 0 ]; then
    echo "ℹ️ 未在 $DOWNLOADS_DIR 中发现以 audio_record_ 开头的 webm 文件。"
    echo "💡 用法: ./convert_to_mp3.sh [可选的录音文件路径.webm]"
    exit 0
  fi

  for f in "${FILES[@]}"; do
    OUT="${f%.webm}.mp3"
    echo "🎵 正在转码: $(basename "$f") -> $(basename "$OUT")"
    ffmpeg -y -i "$f" -vn -c:a libmp3lame -b:a 320k "$OUT"
  done
  echo "🎉 全部转码完成！"
fi
