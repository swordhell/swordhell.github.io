let mediaRecorder = null;
let recordedChunks = [];
let audioContext = null;
let timerInterval = null;
let secondsElapsed = 0;

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusDiv = document.getElementById('status');
const timerDiv = document.getElementById('timer');

function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const secs = (totalSeconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

startBtn.onclick = () => {
  // 1. 截取当前激活标签页的音频流
  chrome.tabCapture.capture({ audio: true, video: false }, (stream) => {
    if (!stream) {
      statusDiv.innerText = "❌ 捕获失败，请刷新目标页面重试";
      return;
    }

    // 2. 音频穿透监听（解决 tabCapture 默认使当前标签页静音的问题）
    audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(audioContext.destination);

    // 3. 启动 MediaRecorder 编码流
    recordedChunks = [];
    
    // 优先使用 audio/webm;codecs=opus
    let mimeType = 'audio/webm;codecs=opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '';
    }

    const options = mimeType ? { mimeType } : {};
    mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      // 停止计时器
      clearInterval(timerInterval);
      timerDiv.classList.remove('active');

      // 组装 Blob 并触发浏览器下载
      const blob = new Blob(recordedChunks, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `audio_record_${timestamp}.webm`;

      chrome.downloads.download({
        url: url,
        filename: filename
      }, (downloadId) => {
        if (chrome.runtime.lastError) {
          statusDiv.innerText = "⚠️ 下载提示: " + chrome.runtime.lastError.message;
        } else {
          statusDiv.innerHTML = `✅ 已导出: <code>${filename}</code>`;
        }
      });

      // 释放流与上下文资源
      stream.getTracks().forEach(track => track.stop());
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
    };

    // 启动录制并每秒切片一次
    mediaRecorder.start(1000);
    startBtn.disabled = true;
    stopBtn.disabled = false;

    // 启动计时器
    secondsElapsed = 0;
    timerDiv.innerText = "00:00";
    timerDiv.classList.add('active');
    timerInterval = setInterval(() => {
      secondsElapsed++;
      timerDiv.innerText = formatTime(secondsElapsed);
    }, 1000);

    statusDiv.innerHTML = '<span class="pulse"></span> 正在录制当前标签页...';
  });
};

stopBtn.onclick = () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    startBtn.disabled = false;
    stopBtn.disabled = true;
    statusDiv.innerText = "💾 正在打包并保存录音文件...";
  }
};
