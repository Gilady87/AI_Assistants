
// A lightweight HTTP server implementing the AI assistant backend.
// FIXED: Route /api/tags is corrected. Centralized Ollama host handling.

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const url = require('url');

// Import memory helper functions
const {
  saveMemory,
  searchMemory,
  createConversationId,
  saveConversationMessage,
  getConversationsList,
  getConversationMessages,
  deleteConversation
} = require('./memory.js');

// --- LOCAL AI CONFIGURATION ---
const PORT = process.env.PORT || 3001;

// Default Settings (Used if no admin_config.json exists)
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.DEFAULT_MODEL || 'gemma3:4b';
const TTS_HOST = process.env.TTS_HOST || 'http://localhost:5002';
const WHISPER_HOST = process.env.WHISPER_HOST || 'http://localhost:9000';

const OPENAI_KEY = process.env.OPENAI_API_KEY || '';
const XAI_API_KEY = process.env.XAI_API_KEY || '';
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || '';

const LISTEN_HOST = process.env.LISTEN_HOST || '127.0.0.1';

// --- ADMIN DATA FILES ---
const CONFIG_FILE = path.join(__dirname, 'admin_config.json');
const TOOLS_FILE = path.join(__dirname, 'admin_tools.json');
const LOGS_FILE = path.join(__dirname, 'admin_logs.txt');

const serverLogs = [];
function adminLog(msg, level = 'INFO') {
  const line = `[${new Date().toISOString()}] [${level}] ${msg}`;
  serverLogs.push(line);
  if (serverLogs.length > 500) serverLogs.shift();
  try { fs.appendFileSync(LOGS_FILE, line + '\n'); } catch (e) {}
}

function loadAdminConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    }
  } catch (error) {
    throw new Error('Cannot read admin_config.json. Check file permissions and JSON syntax.');
  }
  return {};
}
function saveAdminConfig(cfg) {
  getEffectiveConfig(cfg);
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2), 'utf8');
}
function loadTools() {
  try {
    if (fs.existsSync(TOOLS_FILE)) {
      return JSON.parse(fs.readFileSync(TOOLS_FILE, 'utf8'));
    }
  } catch (e) {}
  return [];
}
function saveTools(tools) {
  fs.writeFileSync(TOOLS_FILE, JSON.stringify(tools, null, 2), 'utf8');
}
function loadLogLines() {
  try {
    if (fs.existsSync(LOGS_FILE)) {
      return fs.readFileSync(LOGS_FILE, 'utf8').split('\n').filter(Boolean);
    }
  } catch (e) {}
  return [];
}

function getEffectiveConfig(saved = loadAdminConfig()) {
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) {
    throw new Error('admin_config.json must contain a JSON object.');
  }
  const config = {
    OLLAMA_HOST: saved.OLLAMA_HOST || OLLAMA_HOST,
    DEFAULT_MODEL: saved.DEFAULT_MODEL || DEFAULT_MODEL,
    TTS_HOST: saved.TTS_HOST || TTS_HOST,
    WHISPER_HOST: saved.WHISPER_HOST || WHISPER_HOST,
    OPENAI_KEY: saved.OPENAI_KEY || OPENAI_KEY,
    XAI_API_KEY: saved.XAI_API_KEY || XAI_API_KEY,
    ELEVENLABS_API_KEY: saved.ELEVENLABS_API_KEY || ELEVENLABS_API_KEY,
    LISTEN_HOST: saved.LISTEN_HOST || LISTEN_HOST,
    PORT: Number(saved.PORT ?? PORT),
    MAX_BODY_MB: Number(saved.MAX_BODY_MB ?? process.env.MAX_BODY_MB ?? 10)
  };
  if (!Number.isInteger(config.PORT) || config.PORT < 1 || config.PORT > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }
  if (!Number.isFinite(config.MAX_BODY_MB) || config.MAX_BODY_MB <= 0) {
    throw new Error('MAX_BODY_MB must be a positive number.');
  }
  for (const key of ['OLLAMA_HOST', 'TTS_HOST', 'WHISPER_HOST']) {
    let parsed;
    try { parsed = new URL(config[key]); } catch {}
    if (!parsed || !['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error(`${key} must be an http:// or https:// URL.`);
    }
    config[key] = config[key].replace(/\/+$/, '');
  }
  return config;
}

function extractTag(text, tag) {
  if (!text) return null;
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}

function parseTaggedToolResponse(text) {
  const toolName = extractTag(text, 'tool');
  if (!toolName) return null;
  const argsBlock = extractTag(text, 'args');
  const args = {};
  if (argsBlock) {
    argsBlock.split('\n').forEach(line => {
      line = line.trim();
      if (!line) return;
      const [key, ...valueParts] = line.split('=');
      if (!key) return;
      const value = valueParts.join('=').trim();
      args[key.trim()] = value;
    });
  }
  return { tool: toolName, args };
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.js': return 'application/javascript; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.svg': return 'image/svg+xml';
    case '.ico': return 'image/x-icon';
    case '.woff': return 'font/woff';
    case '.woff2': return 'font/woff2';
    case '.ttf': return 'font/ttf';
    default: return 'application/octet-stream';
  }
}

function parseJsonBody(req) {
  const maxBodySize = getEffectiveConfig().MAX_BODY_MB * 1024 * 1024;
  return new Promise((resolve, reject) => {
    let body = '';
    let size = 0;
    req.on('data', chunk => {
      size += chunk.length;
      if (size > maxBodySize) {
        req.destroy();
        reject(new Error('Payload too large'));
        return;
      }
      body += chunk;
    });
    req.on('end', () => {
      if (!body) { resolve({}); return; }
      try { resolve(JSON.parse(body)); } catch (err) { reject(err); }
    });
  });
}

function serveStaticFile(filePath, res) {
  const publicFiles = new Set(['index.html', 'admin.html', 'voice-chat.html', 'i18n.js', 'i18n.css']);
  if (!publicFiles.has(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
    return;
  }
  const resolved = path.join(__dirname, filePath);
  fs.readFile(resolved, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': getContentType(resolved) });
    res.end(data);
  });
}

function httpRequest(urlString, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(urlString);
    const isHttps = parsed.protocol === 'https:';
    const lib = isHttps ? https : http;
    const requestOptions = {
      method: options.method || 'GET',
      hostname: parsed.hostname,
      port: parsed.port || (isHttps ? 443 : 80),
      path: parsed.pathname + parsed.search,
      headers: options.headers || {}
    };
    const req = lib.request(requestOptions, res => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const body = Buffer.concat(chunks);
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ status: res.statusCode, headers: res.headers, body });
        } else {
          const err = new Error(`Request failed with status ${res.statusCode}`);
          err.status = res.statusCode;
          err.headers = res.headers;
          err.body = body;
          reject(err);
        }
      });
    });
    req.on('error', reject);
    if (options.body) { req.write(options.body); }
    req.end();
  });
}

async function callOllama(payload) {
  const cfg = getEffectiveConfig();
  const res = await httpRequest(`${cfg.OLLAMA_HOST}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: Buffer.from(JSON.stringify(payload))
  });
  return JSON.parse(res.body.toString());
}

function convertToolsToOllamaSchema() {
  const adminTools = loadTools().filter(t => t.enabled !== false);
  return adminTools.map(tool => {
    const properties = {};
    const required = [];
    (tool.params || []).forEach(p => {
      let jsonType = 'string';
      const t = (p.type || '').toLowerCase();
      if (t === 'int' || t === 'integer' || t === 'number') jsonType = 'number';
      else if (t === 'bool' || t === 'boolean' || t === 'switch') jsonType = 'boolean';
      else if (t === 'array') jsonType = 'array';
      properties[p.name] = { type: jsonType, description: p.description || p.name };
      if (p.required) required.push(p.name);
    });
    return {
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description || tool.name,
        parameters: { type: 'object', properties, required }
      }
    };
  });
}

function executePowerShellTool(toolName, args) {
  return new Promise((resolve, reject) => {
    const adminTools = loadTools();
    const tool = adminTools.find(t => t.name === toolName && t.enabled !== false);
    if (!tool) return resolve(`[Error] Tool "${toolName}" not found or disabled.`);

    const argEntries = Object.entries(args || {});
    const paramStr = argEntries.map(([k, v]) => {
      if (typeof v === 'boolean') return `-${k}:${v}`;
      if (typeof v === 'number') return `-${k} ${v}`;
      const escaped = String(v).replace(/'/g, "''");
      return `-${k} '${escaped}'`;
    }).join(' ');

    const script = [
      'function Write-Log { param([string]$Msg,[string]$Level="INFO") Write-Host "[$Level] $Msg" }',
      tool.code,
      `${tool.name} ${paramStr}`
    ].join('\n');

    adminLog(`Executing tool: ${toolName}(${JSON.stringify(args)})`);
    const executable = process.platform === 'win32' ? 'powershell.exe' : 'pwsh';
    const ps = spawn(executable, ['-NoProfile', '-NonInteractive', '-Command', script], { timeout: 30000, windowsHide: true });
    let stdout = '';
    let stderr = '';
    ps.stdout.on('data', d => stdout += d.toString());
    ps.stderr.on('data', d => stderr += d.toString());
    ps.on('close', code => {
      const output = stdout.trim() || stderr.trim() || `(exit code ${code})`;
      adminLog(`Tool ${toolName} result: ${output.substring(0, 200)}`);
      resolve(output);
    });
    ps.on('error', err => {
      adminLog(`Tool ${toolName} spawn error: ${err.message}`, 'ERROR');
      resolve(`[Error] Failed to run PowerShell: ${err.message}`);
    });
  });
}

async function ollamaChatRequest(cfg, payload) {
  try {
    const res = await httpRequest(`${cfg.OLLAMA_HOST}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: Buffer.from(JSON.stringify(payload))
    });
    return { data: JSON.parse(res.body.toString()), toolsSupported: true };
  } catch (err) {
    if (err.status === 400 && payload.tools && payload.tools.length > 0) {
      adminLog(`Model "${payload.model}" returned 400 with tools — retrying without tools`, 'WARN');
      const fallbackPayload = { ...payload };
      delete fallbackPayload.tools;
      const res = await httpRequest(`${cfg.OLLAMA_HOST}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: Buffer.from(JSON.stringify(fallbackPayload))
      });
      return { data: JSON.parse(res.body.toString()), toolsSupported: false };
    }
    throw err;
  }
}

async function callOllamaChatWithTools(messages, modelName) {
  const ollamaTools = convertToolsToOllamaSchema();
  const hasTools = ollamaTools.length > 0;
  const maxIterations = 5;
  const allToolCalls = [];
  let modelSupportsTools = true;

  for (let i = 0; i < maxIterations; i++) {
    const payload = { model: modelName, messages, stream: false };
    if (hasTools && modelSupportsTools) payload.tools = ollamaTools;
    const cfg = getEffectiveConfig();
    const { data, toolsSupported } = await ollamaChatRequest(cfg, payload);
    if (!toolsSupported) modelSupportsTools = false;
    const msg = data.message || {};

    if (msg.tool_calls && msg.tool_calls.length > 0) {
      messages.push({ role: 'assistant', content: msg.content || '', tool_calls: msg.tool_calls });
      for (const tc of msg.tool_calls) {
        const fn = tc.function || {};
        const toolName = fn.name;
        const toolArgs = fn.arguments || {};
        const result = await executePowerShellTool(toolName, toolArgs);
        allToolCalls.push({ name: toolName, args: toolArgs, result });
        messages.push({ role: 'tool', content: result });
      }
      continue;
    }

    if (msg.content) {
      const parsed = parseTaggedToolResponse(msg.content);
      if (parsed && parsed.tool) {
        const result = await executePowerShellTool(parsed.tool, parsed.args);
        allToolCalls.push({ name: parsed.tool, args: parsed.args, result });
        messages.push({ role: 'assistant', content: msg.content });
        messages.push({ role: 'tool', content: result });
        continue;
      }
    }
    return { content: (msg.content || '').trim(), toolCalls: allToolCalls };
  }
  return { content: 'Tool calling limit reached.', toolCalls: allToolCalls };
}

async function callCoquiTTS(text) {
  const cfg = getEffectiveConfig();
  const encodedText = encodeURIComponent(text);
  const res = await httpRequest(`${cfg.TTS_HOST}/api/tts?text=${encodedText}`, { method: 'GET' });
  return res.body;
}

async function callLocalWhisper(dataUrl, language) {
  const cfg = getEffectiveConfig();
  const base64 = dataUrl.split(',')[1];
  const audioBuffer = Buffer.from(base64, 'base64');
  const mimeMatch = dataUrl.match(/^data:(audio\/[^;]+)/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'audio/webm';
  const extMap = { 'audio/webm': 'webm', 'audio/wav': 'wav', 'audio/mp3': 'mp3', 'audio/mpeg': 'mp3', 'audio/ogg': 'ogg' };
  const ext = extMap[mimeType] || 'webm';
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  const CRLF = '\r\n';
  const buffers = [];
  buffers.push(Buffer.from(`--${boundary}${CRLF}Content-Disposition: form-data; name="audio_file"; filename="audio.${ext}"${CRLF}Content-Type: ${mimeType}${CRLF}${CRLF}`));
  buffers.push(audioBuffer);
  buffers.push(Buffer.from(CRLF));
  if (language) {
    buffers.push(Buffer.from(`--${boundary}${CRLF}Content-Disposition: form-data; name="language"${CRLF}${CRLF}${language}${CRLF}`));
  }
  buffers.push(Buffer.from(`--${boundary}--${CRLF}`));
  const body = Buffer.concat(buffers);
  const whisperBase = cfg.WHISPER_HOST.replace(/\/transcribe\/?$/, '');
  const res = await httpRequest(`${whisperBase}/transcribe`, {
    method: 'POST',
    headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}`, 'Content-Length': body.length },
    body
  });
  return JSON.parse(res.body.toString()).text || '';
}

async function callOpenAITTS(text, voice, speed) {
  const cfg = getEffectiveConfig();
  if (!cfg.OPENAI_KEY) throw new Error('OpenAI API key not configured');
  const res = await httpRequest('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cfg.OPENAI_KEY}` },
    body: Buffer.from(JSON.stringify({ model: 'tts-1', input: text, voice: voice || 'alloy', speed: speed || 1 }))
  });
  return res.body;
}

async function callXai(prompt) {
  const cfg = getEffectiveConfig();
  if (!cfg.XAI_API_KEY) throw new Error('XAI API key not configured');
  const res = await httpRequest('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cfg.XAI_API_KEY}` },
    body: Buffer.from(JSON.stringify({ model: 'grok-4-1-fast', messages: [ { role: 'user', content: prompt } ], temperature: 0.7 }))
  });
  return JSON.parse(res.body.toString()).choices[0].message.content.trim();
}

async function handler(req, res) {
  const { method } = req;
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname || '/';

  try {
    if (method === 'GET') {
      if (pathname === '/conversations') {
        const list = await getConversationsList();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ conversations: list }));
        return;
      }
      if (pathname.startsWith('/conversations/')) {
        const id = decodeURIComponent(pathname.split('/')[2] || '');
        const messages = await getConversationMessages(id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ messages }));
        return;
      }

      // FIXED ROUTE FOR DROP-DOWN
      if (pathname === '/api/tags') {
        try {
          const cfg = getEffectiveConfig();
          const data = await httpRequest(`${cfg.OLLAMA_HOST}/api/tags`);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(data.body);
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to fetch models: ' + err.message }));
        }
        return;
      }

      if (pathname === '/admin') { serveStaticFile('admin.html', res); return; }
      if (pathname === '/admin/config') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(getEffectiveConfig()));
        return;
      }
      if (pathname.startsWith('/admin/health/')) {
        const svc = pathname.split('/')[3];
        const saved = loadAdminConfig();
        let targetUrl = '';
        try {
          if (svc === 'ollama') {
            targetUrl = saved.OLLAMA_HOST || OLLAMA_HOST;
            const r = await httpRequest(`${targetUrl}/api/tags`);
            const data = JSON.parse(r.body.toString());
            res.writeHead(200, { 'Content-Type': 'application/json' });
            const modelCount = (data.models || []).length;
            res.end(JSON.stringify({ status: 'online', modelCount, info: modelCount + ' models', url: targetUrl }));
          } else if (svc === 'tts') {
            targetUrl = saved.TTS_HOST || TTS_HOST;
            await httpRequest(`${targetUrl}/api/tts?text=test`);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'online', info: 'Active', url: targetUrl }));
          } else if (svc === 'whisper') {
            targetUrl = (saved.WHISPER_HOST || WHISPER_HOST).replace(/\/transcribe\/?$/, '');
            await httpRequest(`${targetUrl}/health`).catch(() => httpRequest(`${targetUrl}/`)).catch(() => httpRequest(`${targetUrl}/transcribe`));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'online', info: 'Active', url: targetUrl }));
          } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Unknown service' }));
          }
        } catch (e) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'offline', info: e.message, url: targetUrl }));
        }
        return;
      }
      if (pathname === '/admin/tools') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(loadTools()));
        return;
      }
      if (pathname === '/admin/logs') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ logs: loadLogLines().slice(-200) }));
        return;
      }
      if (pathname === '/' || pathname === '/index.html') { serveStaticFile('index.html', res); return; }
      serveStaticFile(pathname.slice(1), res);
      return;
    }

    if (method === 'DELETE') {
      if (pathname.startsWith('/conversations/')) {
        const id = decodeURIComponent(pathname.split('/')[2] || '');
        const deleted = await deleteConversation(id);
        res.writeHead(deleted ? 200 : 404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(deleted ? { success: true } : { error: 'Not found' }));
        return;
      }
      if (pathname.match(/^\/admin\/tools\/\d+$/)) {
        const idx = parseInt(pathname.split('/')[3]);
        const toolsList = loadTools();
        if (idx < 0 || idx >= toolsList.length) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Not found' }));
          return;
        }
        const removed = toolsList.splice(idx, 1);
        saveTools(toolsList);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
        return;
      }
      if (pathname === '/admin/logs') {
        try { fs.writeFileSync(LOGS_FILE, '', 'utf8'); } catch (e) {}
        serverLogs.length = 0;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
        return;
      }
    }

    if (method === 'PUT') {
      let body;
      try { body = await parseJsonBody(req); } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
        return;
      }
      if (pathname.match(/^\/admin\/tools\/\d+$/)) {
        const idx = parseInt(pathname.split('/')[3]);
        const toolsList = loadTools();
        if (idx < 0 || idx >= toolsList.length) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Not found' }));
          return;
        }
        toolsList[idx] = body;
        saveTools(toolsList);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
        return;
      }
    }

    if (method === 'POST') {
      let body;
      try { body = await parseJsonBody(req); } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
        return;
      }

      if (pathname === '/chat') {
        const cfg = getEffectiveConfig();
        const { prompt, model, conversationId, image } = body;
        if (!prompt) { res.writeHead(400, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'missing prompt' })); return; }
        const convId = conversationId || createConversationId();
        const recalls = await searchMemory(prompt);
        const memoryContext = recalls.length ? `Context/Memories:\n- ${recalls.join('\n- ')}\n---\n` : '';
        try {
          const modelToUse = model || cfg.DEFAULT_MODEL;
          const hasTools = loadTools().some(tool => tool.enabled !== false);
          const systemPrompt = hasTools
            ? 'You have access to PowerShell tools. respond ONLY using: <tool>Name</tool><args>P=V</args>. Respond in user\'s language.'
            : 'You are a helpful AI assistant. Respond in the user\'s language.';
          const chatMessages = [{ role: 'system', content: systemPrompt + (memoryContext ? '\n\n' + memoryContext : '') }];
          const history = await getConversationMessages(convId);
          for (const msg of history.slice(-20)) { chatMessages.push({ role: msg.role, content: msg.content }); }

          let responseText;
          let result;
          if (image) {
            const base64Data = image.includes(',') ? image.split(',')[1] : image;
            const ollamaRes = await httpRequest(`${cfg.OLLAMA_HOST}/api/generate`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: Buffer.from(JSON.stringify({ model: modelToUse, prompt: prompt, images: [base64Data], stream: false }))
            });
            const data = JSON.parse(ollamaRes.body.toString());
            responseText = (data.response || '').trim();
            result = { content: responseText, toolCalls: [] };
          } else {
            chatMessages.push({ role: 'user', content: prompt });
            result = await callOllamaChatWithTools(chatMessages, modelToUse);
            responseText = result.content || '(no response)';
          }
          saveMemory('user', prompt);
          saveMemory('assistant', responseText);
          await saveConversationMessage(convId, 'user', prompt, image || null);
          await saveConversationMessage(convId, 'assistant', responseText);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: responseText, conversationId: convId, toolCalls: result.toolCalls }));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Ollama failed: ' + err.message }));
        }
        return;
      }

      if (pathname === '/image') {
        const cfg = getEffectiveConfig();
        const { image, prompt, model, conversationId } = body;
        if (!image || !prompt) { res.writeHead(400, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'Missing image/prompt' })); return; }
        const convId = conversationId || createConversationId();
        try {
          const base64Data = image.includes(',') ? image.split(',')[1] : image;
          const modelToUse = model || cfg.DEFAULT_MODEL;
          const ollamaRes = await httpRequest(`${cfg.OLLAMA_HOST}/api/generate`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: Buffer.from(JSON.stringify({ model: modelToUse, prompt: prompt, images: [base64Data], stream: false }))
          });
          const responseText = JSON.parse(ollamaRes.body.toString()).response || '';
          await saveConversationMessage(convId, 'user', prompt, image);
          await saveConversationMessage(convId, 'assistant', responseText);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: responseText, conversationId: convId }));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Image failed: ' + err.message }));
        }
        return;
      }

      if (pathname === '/tts') {
        const cfg = getEffectiveConfig();
        const { text, useCloud } = body;
        try {
          let audioBuffer = (useCloud && cfg.OPENAI_KEY) ? await callOpenAITTS(text) : await callCoquiTTS(text);
          res.writeHead(200, { 'Content-Type': useCloud ? 'audio/mpeg' : 'audio/wav' });
          res.end(audioBuffer);
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'TTS failed' }));
        }
        return;
      }

      if (pathname === '/tts/elevenlabs') {
        const cfg = getEffectiveConfig();
        const { text, voice_id, model_id } = body;
        try {
          const res = await httpRequest(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id || '21m00Tcm4TlvDq8ikWAM'}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'xi-api-key': cfg.ELEVENLABS_API_KEY },
            body: Buffer.from(JSON.stringify({ text: text, model_id: model_id || 'eleven_monolingual_v1' }))
          });
          res.writeHead(200, { 'Content-Type': 'audio/mpeg' });
          res.end(res.body);
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'ElevenLabs failed' }));
        }
        return;
      }

      if (pathname === '/transcribe') {
        const { audio, language } = body;
        try {
          const text = await callLocalWhisper(audio, language);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ text }));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Transcription failed' }));
        }
        return;
      }

      if (pathname === '/voice') {
        const cfg = getEffectiveConfig();
        const { audio, language } = body;
        try {
          const transcribedText = await callLocalWhisper(audio, language);
          if (!transcribedText) throw new Error('No speech detected');
          const ollamaRes = await callOllama({
            prompt: `You are a helpful voice assistant. Reply in 1 short sentence. User said: ${transcribedText}`,
            model: cfg.DEFAULT_MODEL,
            stream: false
          });
          const aiResponse = (ollamaRes.response || '').trim();
          const audioBuffer = await callCoquiTTS(aiResponse);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            transcription: transcribedText,
            response: aiResponse,
            audio: `data:audio/wav;base64,${audioBuffer.toString('base64')}`
          }));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Voice pipeline failed', detail: err.message }));
        }
        return;
      }

      if (pathname === '/chat/xai') {
         const { prompt } = body;
         try {
            const reply = await callXai(prompt);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: reply }));
         } catch(e) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: e.message }));
         }
         return;
      }

      if (pathname === '/admin/config') {
        try {
          saveAdminConfig(body);
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
        return;
      }
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  } catch (err) {
    console.error('ServerError:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}

const server = http.createServer(handler);
const startupConfig = getEffectiveConfig();
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE'
    ? `Port ${startupConfig.PORT} is already in use. Change PORT in admin_config.json or stop the other server.`
    : `Server failed to start: ${error.message}`);
  process.exit(1);
});
server.listen(startupConfig.PORT, startupConfig.LISTEN_HOST, () => {
  console.log(`🚀 AI Server running at http://${startupConfig.LISTEN_HOST}:${startupConfig.PORT}`);
  adminLog('Server started');
});
