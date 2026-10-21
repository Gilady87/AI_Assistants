(() => {
  'use strict';

  const translations = {
    "en": {
      "common.model": "Model",
      "common.voiceChat": "Voice chat",
      "common.history": "History",
      "common.settings": "Settings",
      "common.admin": "Admin",
      "admin.title": "System administration",
      "chat.placeholder": "Type a message...",
      "mic.off": "Microphone off",
      "mic.recording": "Recording",
      "history.title": "Conversation history",
      "history.loading": "Loading conversations...",
      "history.new": "New conversation",
      "tts.settings": "Text-to-speech settings",
      "tts.voice": "Voice:",
      "tts.speed": "Speed:",
      "common.modelLabel": "Model:",
      "tts.loading": "Loading voices...",
      "tts.enable": "Enable text-to-speech",
      "common.cancel": "Cancel",
      "common.save": "Save",
      "models.select": "Select model",
      "models.help": "Choose the model used to generate responses",
      "models.provider": "Provider:",
      "models.ollama": "Ollama (local)",
      "models.text": "Text model (chat):",
      "models.loading": "Loading models...",
      "models.refresh": "Refresh models",
      "models.image": "Multimodal model (images):",
      "models.xaiHelp": "Uses XAI's advanced Grok-2 model",
      "models.size": "Size:",
      "models.params": "Parameters:",
      "models.family": "Family:",
      "models.quantization": "Quantization:",
      "history.delete": "Delete conversation",
      "history.deleteConfirm": "Permanently delete this conversation?",
      "common.delete": "Delete",
      "screen.engine": "Analysis engine determined by:",
      "screen.share": "Share screen",
      "common.stop": "Stop",
      "screen.capture": "Capture and ask",
      "screen.selectModel": "Choose model",
      "screen.continuous": "Continuous chat while sharing your screen",
      "common.off": "Off",
      "screen.inactive": "Screen sharing is inactive",
      "speech.unsupported": "Speech recognition is not supported in this browser. Try Chrome.",
      "models.noneSelected": "No model selected",
      "chat.sentImage": "Sent image",
      "models.unreachable": "Cannot connect to Ollama. Make sure the server is running.",
      "models.none": "No installed models found",
      "common.unavailable": "Unavailable",
      "tts.failed": "Text-to-speech failed",
      "tts.elevenFailed": "ElevenLabs text-to-speech failed",
      "tts.noVoices": "No supported voices found",
      "models.xaiSelected": "XAI Grok selected",
      "chat.sendFailed": "Failed to send message",
      "image.tooLarge": "The image is too large (maximum 5 MB).",
      "image.sent": "I sent an image",
      "image.describe": "Describe the attached image in English in as much detail as possible: colors, objects, scene, small details, and the state of the equipment or surroundings.",
      "image.describeShort": "Describe this image in English in detail:",
      "chat.invalidResponse": "❌ No valid response received",
      "history.loadFailed": "Failed to load conversations",
      "history.empty": "No saved conversations",
      "history.conversationFailed": "Failed to load conversation",
      "history.deleteFailed": "Failed to delete conversation",
      "screen.started": "✅ Screen sharing started! Click \"Capture and ask\" or enable automatic mode.",
      "screen.stopped": "⏹ Screen sharing stopped.",
      "screen.noImage": "No image to capture. Make sure screen sharing is active.",
      "screen.analyzing": "📸 Image sent for analysis...",
      "screen.describe": "Describe this screen briefly in English using bullet points",
      "common.serverError": "Server error",
      "common.active": "Active",
      "voice.title": "Interactive voice chat",
      "voice.pageTitle": "Voice chat - AI Assistant",
      "common.back": "Back to chat",
      "voice.inactive": "Inactive",
      "voice.startThreshold": "Speech start threshold (RMS)",
      "voice.endThreshold": "Speech end threshold (RMS)",
      "voice.silence": "Silence before stopping (seconds)",
      "voice.minimum": "Minimum duration (seconds)",
      "speech.language": "Speech language",
      "speech.hebrew": "Hebrew",
      "speech.auto": "Automatic",
      "common.loading": "Loading...",
      "tts.engine": "TTS engine",
      "tts.windows": "Windows TTS (local)",
      "tts.coqui": "Coqui TTS (server)",
      "common.disabled": "Off",
      "voice.maximum": "Maximum duration (seconds)",
      "tts.windowsVoice": "Windows voice:",
      "tts.refresh": "Refresh voices",
      "tts.autoSwitch": "Automatic voice switching (Avri Hebrew / Ava English)",
      "voice.empty": "Click the button below to start a conversation",
      "voice.orbTitle": "Click to start or stop",
      "voice.ready": "Click the circle to start a conversation",
      "voice.start": "Start conversation",
      "voice.stopSpeech": "Stop speaking immediately",
      "voice.clear": "Clear conversation",
      "tts.noSuitableVoices": "No suitable voices found",
      "voice.speaking": "🔊 Speaking...",
      "voice.listening": "🎤 Listening... (speak to begin)",
      "models.loadFailed": "Failed to load models",
      "voice.listeningBadge": "Listening",
      "voice.processingBadge": "Processing",
      "voice.speakingBadge": "Speaking",
      "chat.you": "You",
      "chat.assistant": "Assistant",
      "voice.waiting": "⏸️ The assistant is speaking, waiting...",
      "voice.recording": "🔴 Recording... (pause to stop)",
      "voice.started": "Conversation started - speak normally",
      "voice.transcribing": "⏳ Transcribing...",
      "voice.transcribeFailed": "Transcription server error",
      "voice.noSpeech": "🔇 No speech detected, trying again...",
      "voice.generating": "🤖 Generating a response...",
      "voice.aiFailed": "AI server error",
      "admin.pageTitle": "Administration - AI Assistant",
      "admin.dashboard": "Dashboard",
      "admin.api": "API settings",
      "admin.services": "Services",
      "admin.tools": "Tools",
      "admin.logs": "Logs",
      "admin.back": "Back to the main chat",
      "admin.checking": "Checking...",
    "admin.installedModels": "Installed models",
    "admin.modelCount": "{count} models",
    "admin.modelCountOne": "1 model",
      "admin.registeredTools": "Registered tools",
      "admin.localServices": "Local services",
      "admin.defaultModel": "Default model",
      "admin.externalKeys": "External API keys",
      "admin.general": "General settings",
      "admin.port": "Server port",
      "admin.maxRequest": "Maximum request size (MB)",
      "admin.saveSettings": "Save settings",
      "admin.reset": "Reset to defaults",
      "admin.status": "Service status",
      "admin.llm": "Local LLM server",
      "admin.tts": "Text-to-speech",
      "admin.stt": "Speech recognition",
      "admin.checkAll": "Check all services",
      "admin.addExample": "Add example tool",
      "admin.newTool": "New tool",
      "admin.toolsHelp": "These tools are available to the AI agent for working with files and folders.",
      "common.refresh": "Refresh",
      "common.clear": "Clear",
      "admin.loadingLogs": "Loading logs...",
      "admin.toolName": "Tool name",
      "admin.description": "Description",
      "admin.descriptionPlaceholder": "Short tool description",
      "admin.parameters": "Parameters (JSON)",
      "admin.code": "PowerShell code",
      "admin.toolEnabled": "Tool enabled",
      "admin.saved": "Saved successfully",
      "admin.configSaved": "Settings saved! Restart the server for changes to take effect.",
      "admin.configFailed": "Failed to save settings",
      "admin.resetConfirm": "Reset all settings to defaults?",
      "admin.configReset": "Settings reset",
      "admin.resetFailed": "Failed to reset settings",
      "admin.online": "✓ Active",
      "admin.offline": "✗ Unavailable",
      "admin.noToolsYet": "No tools configured yet",
      "common.edit": "Edit",
      "admin.showCode": "Show code",
      "admin.noTools": "No tools configured",
      "admin.exampleDescription": "Search for text in files within a specified folder",
      "admin.exampleAdded": "Example tool \"Search-Text\" added successfully",
      "admin.exampleFailed": "Failed to add example tool",
      "admin.deleted": "Tool deleted",
      "admin.deleteFailed": "Failed to delete tool",
      "admin.nameRequired": "Tool name is required",
      "admin.codeRequired": "Tool code is required",
      "admin.invalidParams": "Invalid parameters JSON",
      "admin.updated": "Tool updated",
      "admin.added": "Tool added",
      "admin.saveFailed": "Failed to save",
      "admin.noLogs": "No logs yet",
      "admin.logsFailed": "Failed to load logs",
      "admin.clearLogsConfirm": "Clear all logs?",
      "admin.logsCleared": "Logs cleared",
      "common.error": "Error",
      "admin.noModels": "No installed models",
      "admin.modelsFailed": "Unable to load models",
      "speech.startError": "Cannot start speech recognition: {detail}",
      "speech.error": "Speech recognition error: {detail}",
      "common.errorDetail": "Error: {detail}",
      "tts.error": "Text-to-speech error: {detail}",
      "models.selected": "Chat model selected: {name}",
      "chat.sendError": "Failed to send message: {detail}",
      "image.httpError": "Error {status}",
      "image.error": "Image processing error: {detail}",
      "history.loadError": "Failed to load conversations: {detail}",
      "history.conversationError": "Failed to load conversation: {detail}",
      "history.deleteError": "Failed to delete conversation: {detail}",
      "screen.startError": "❌ Screen sharing failed: {detail}",
      "screen.response": "📝 Response: {text}",
      "screen.imageError": "Failed to send image: {detail}",
      "screen.micError": "Cannot access microphone: {detail}",
      "screen.heard": "⤷ Heard: {text}",
      "screen.reply": "🗣️ Response: {text}",
      "voice.micError": "❌ Failed to start microphone: {detail}",
      "voice.error": "⚠️ Error: {detail}",
      "admin.editTool": "Edit tool: {name}",
      "admin.deleteConfirm": "Delete tool \"{name}\"?",
      "admin.more": "+{count} more",
      "ui.language": "Interface language",
      "ui.english": "English",
      "ui.hebrew": "Hebrew",
      "chat.send": "Send message",
      "chat.attach": "Attach image",
      "common.close": "Close",
      "tts.replay": "Play again",
      "screen.title": "Screen assistant"
    },
    "he": {
      "common.model": "מודל",
      "common.voiceChat": "שיחת קול",
      "common.history": "היסטוריה",
      "common.settings": "הגדרות",
      "common.admin": "ניהול",
      "admin.title": "ניהול מערכת",
      "chat.placeholder": "הקלד...",
      "mic.off": "מיקרופון כבוי",
      "mic.recording": "מקליט",
      "history.title": "היסטוריית שיחות",
      "history.loading": "טוען שיחות...",
      "history.new": "שיחה חדשה",
      "tts.settings": "הגדרות TTS",
      "tts.voice": "קול:",
      "tts.speed": "מהירות:",
      "common.modelLabel": "מודל:",
      "tts.loading": "טוען קולות...",
      "tts.enable": "הפעל TTS",
      "common.cancel": "ביטול",
      "common.save": "שמור",
      "models.select": "בחירת מודל",
      "models.help": "בחר את המודל שישמש ליצירת תשובות",
      "models.provider": "ספק:",
      "models.ollama": "Ollama (מקומי)",
      "models.text": "מודל טקסט (צ'אט):",
      "models.loading": "טוען מודלים...",
      "models.refresh": "רענן מודלים",
      "models.image": "מודל מולטימודלי (תמונות):",
      "models.xaiHelp": "משתמש במודל Grok-2 המתקדם של XAI",
      "models.size": "גודל:",
      "models.params": "פרמטרים:",
      "models.family": "משפחה:",
      "models.quantization": "קוונטיזציה:",
      "history.delete": "מחיקת שיחה",
      "history.deleteConfirm": "האם למחוק את השיחה הזו לצמיתות?",
      "common.delete": "מחק",
      "screen.engine": "מנוע הפיענוח יקבע לפי:",
      "screen.share": "שיתוף מסך",
      "common.stop": "עצור",
      "screen.capture": "צלם ושאל",
      "screen.selectModel": "בחר מודל",
      "screen.continuous": "שיחה רציפה בזמן שיתוף מסך",
      "common.off": "כיבוי",
      "screen.inactive": "שיתוף מסך לא פעיל",
      "speech.unsupported": "זיהוי דיבור לא נתמך בדפדפן זה. נסה Chrome.",
      "models.noneSelected": "לא נבחר מודל",
      "chat.sentImage": "תמונה שנשלחה",
      "models.unreachable": "לא ניתן להתחבר לשרת Ollama. ודא שהשרת פעיל",
      "models.none": "לא נמצאו מודלים מותקנים",
      "common.unavailable": "לא זמין",
      "tts.failed": "שגיאה ב-TTS",
      "tts.elevenFailed": "שגיאה ב-ElevenLabs TTS",
      "tts.noVoices": "לא נמצאו קולות תומכים",
      "models.xaiSelected": "נבחר מודל XAI Grok",
      "chat.sendFailed": "שגיאה בשליחת ההודעה",
      "image.tooLarge": "התמונה גדולה מדי (מקסימום 5MB).",
      "image.sent": "שלחתי תמונה",
      "image.describe": "הנה תמונה מצורפת. תאר אותה בעברית בפירוט רב ככל האפשר: צבעים, אובייקטים, סצנה, פרטים קטנים, מצב החומרה/הסביבה.",
      "image.describeShort": "תאר את התמונה הזו בעברית בפירוט:",
      "chat.invalidResponse": "❌ לא התקבלה תגובה תקינה",
      "history.loadFailed": "שגיאה בטעינת השיחות",
      "history.empty": "אין שיחות שמורות",
      "history.conversationFailed": "שגיאה בטעינת השיחה",
      "history.deleteFailed": "שגיאה במחיקת השיחה",
      "screen.started": "✅ שיתוף מסך התחיל! אפשר ללחוץ \"צלם ושאל\" או להפעיל מצב אוטומטי.",
      "screen.stopped": "⏹ שיתוף מסך הופסק.",
      "screen.noImage": "אין תמונה לתפוס. ודא ששיתוף מסך פעיל.",
      "screen.analyzing": "📸 נשלחה תמונה לניתוח...",
      "screen.describe": "תאר את המסך הזה בעברית בקצרה ובנקודות",
      "common.serverError": "שגיאה בשרת",
      "common.active": "פעיל",
      "voice.title": "שיחה אינטראקטיבית",
      "voice.pageTitle": "שיחה אינטראקטיבית - AI Assistant",
      "common.back": "חזרה לצ'אט",
      "voice.inactive": "לא פעיל",
      "voice.startThreshold": "סף התחלת דיבור (RMS)",
      "voice.endThreshold": "סף סיום דיבור (RMS)",
      "voice.silence": "זמן שקט לעצירה (שניות)",
      "voice.minimum": "משך מינימלי (שניות)",
      "speech.language": "שפה",
      "speech.hebrew": "עברית",
      "speech.auto": "אוטומטי",
      "common.loading": "טוען...",
      "tts.engine": "מנוע TTS",
      "tts.windows": "Windows TTS (מקומי)",
      "tts.coqui": "Coqui TTS (שרת)",
      "common.disabled": "כבוי",
      "voice.maximum": "משך מקסימלי (שניות)",
      "tts.windowsVoice": "קול Windows:",
      "tts.refresh": "רענן קולות",
      "tts.autoSwitch": "החלפה אוטומטית (Avri עברית / Ava אנגלית)",
      "voice.empty": "לחץ על הכפתור למטה כדי להתחיל שיחה",
      "voice.orbTitle": "לחץ להתחלה/עצירה",
      "voice.ready": "לחץ על העיגול להתחלת שיחה",
      "voice.start": "התחל שיחה",
      "voice.stopSpeech": "עצור דיבור מיידית",
      "voice.clear": "נקה שיחה",
      "tts.noSuitableVoices": "לא נמצאו קולות מתאימים",
      "voice.speaking": "🔊 מדבר...",
      "voice.listening": "🎤 מקשיב... (דבר כדי להתחיל)",
      "models.loadFailed": "שגיאה בטעינת מודלים",
      "voice.listeningBadge": "מקשיב",
      "voice.processingBadge": "מעבד",
      "voice.speakingBadge": "מדבר",
      "chat.you": "אתה",
      "chat.assistant": "עוזר",
      "voice.waiting": "⏸️ ה-agent מדבר, ממתין...",
      "voice.recording": "🔴 מקליט... (השתתק לעצירה)",
      "voice.started": "שיחה התחילה - דבר כרגיל",
      "voice.transcribing": "⏳ מתמלל...",
      "voice.transcribeFailed": "שגיאה בשרת התמלול",
      "voice.noSpeech": "🔇 לא זוהה דיבור, מנסה שוב...",
      "voice.generating": "🤖 מייצר תשובה...",
      "voice.aiFailed": "שגיאה בשרת ה-AI",
      "admin.pageTitle": "ניהול מערכת - AI Assistant",
      "admin.dashboard": "לוח בקרה",
      "admin.api": "הגדרות API",
      "admin.services": "שירותים",
      "admin.tools": "כלים (Tools)",
      "admin.logs": "לוגים",
      "admin.back": "חזרה לממשק הצ'אט הראשי",
      "admin.checking": "בודק...",
    "admin.installedModels": "מודלים מותקנים",
    "admin.modelCount": "{count} מודלים",
    "admin.modelCountOne": "מודל אחד",
      "admin.registeredTools": "כלים רשומים",
      "admin.localServices": "שירותים מקומיים",
      "admin.defaultModel": "מודל ברירת מחדל",
      "admin.externalKeys": "מפתחות API חיצוניים",
      "admin.general": "הגדרות כלליות",
      "admin.port": "פורט שרת",
      "admin.maxRequest": "גודל מקסימלי לבקשה (MB)",
      "admin.saveSettings": "שמור הגדרות",
      "admin.reset": "אפס לברירת מחדל",
      "admin.status": "סטטוס שירותים",
      "admin.llm": "שרת LLM מקומי",
      "admin.tts": "המרת טקסט לדיבור",
      "admin.stt": "זיהוי דיבור",
      "admin.checkAll": "בדוק את כל השירותים",
      "admin.addExample": "הוסף כלי לדוגמה",
      "admin.newTool": "כלי חדש",
      "admin.toolsHelp": "כלים אלו זמינים לסוכן ה-AI לביצוע פעולות על קבצים ותיקיות.",
      "common.refresh": "רענן",
      "common.clear": "נקה",
      "admin.loadingLogs": "טוען לוגים...",
      "admin.toolName": "שם הכלי",
      "admin.description": "תיאור",
      "admin.descriptionPlaceholder": "תיאור קצר של הכלי",
      "admin.parameters": "פרמטרים (JSON)",
      "admin.code": "קוד PowerShell",
      "admin.toolEnabled": "כלי פעיל",
      "admin.saved": "נשמר בהצלחה",
      "admin.configSaved": "ההגדרות נשמרו! יש לאתחל את השרת כדי שהשינויים ייכנסו לתוקף.",
      "admin.configFailed": "שגיאה בשמירת ההגדרות",
      "admin.resetConfirm": "לאפס את כל ההגדרות לברירת המחדל?",
      "admin.configReset": "ההגדרות אופסו",
      "admin.resetFailed": "שגיאה באיפוס",
      "admin.online": "✓ פעיל",
      "admin.offline": "✗ לא זמין",
      "admin.noToolsYet": "אין כלים מוגדרים עדיין",
      "common.edit": "ערוך",
      "admin.showCode": "הצג קוד",
      "admin.noTools": "אין כלים מוגדרים",
      "admin.exampleDescription": "חיפוש טקסט בתוך קבצים בתיקייה נתונה",
      "admin.exampleAdded": "כלי לדוגמה \"Search-Text\" נוסף בהצלחה",
      "admin.exampleFailed": "שגיאה בהוספת כלי לדוגמה",
      "admin.deleted": "הכלי נמחק",
      "admin.deleteFailed": "שגיאה במחיקה",
      "admin.nameRequired": "שם הכלי הוא שדה חובה",
      "admin.codeRequired": "קוד הכלי הוא שדה חובה",
      "admin.invalidParams": "JSON פרמטרים לא תקין",
      "admin.updated": "הכלי עודכן",
      "admin.added": "הכלי נוסף",
      "admin.saveFailed": "שגיאה בשמירה",
      "admin.noLogs": "אין לוגים עדיין",
      "admin.logsFailed": "שגיאה בטעינת לוגים",
      "admin.clearLogsConfirm": "לנקות את כל הלוגים?",
      "admin.logsCleared": "הלוגים נוקו",
      "common.error": "שגיאה",
      "admin.noModels": "אין מודלים מותקנים",
      "admin.modelsFailed": "לא ניתן לטעון מודלים",
      "speech.startError": "לא ניתן להתחיל זיהוי דיבור: {detail}",
      "speech.error": "שגיאה בזיהוי דיבור: {detail}",
      "common.errorDetail": "שגיאה: {detail}",
      "tts.error": "שגיאה בהמרה לדיבור: {detail}",
      "models.selected": "מודל צ'אט נבחר: {name}",
      "chat.sendError": "שגיאה בשליחת ההודעה: {detail}",
      "image.httpError": "שגיאה {status}",
      "image.error": "שגיאה בעיבוד התמונה: {detail}",
      "history.loadError": "שגיאה בטעינת השיחות: {detail}",
      "history.conversationError": "שגיאה בטעינת השיחה: {detail}",
      "history.deleteError": "שגיאה במחיקת השיחה: {detail}",
      "screen.startError": "❌ שיתוף מסך נכשל: {detail}",
      "screen.response": "📝 תשובה: {text}",
      "screen.imageError": "שגיאה בשליחת התמונה: {detail}",
      "screen.micError": "לא ניתן לגשת למיקרופון: {detail}",
      "screen.heard": "⤷ שמעתי: {text}",
      "screen.reply": "🗣️ תגובה: {text}",
      "voice.micError": "❌ שגיאה בהפעלת המיקרופון: {detail}",
      "voice.error": "⚠️ שגיאה: {detail}",
      "admin.editTool": "עריכת כלי: {name}",
      "admin.deleteConfirm": "למחוק את הכלי \"{name}\"?",
      "admin.more": "עוד {count}",
      "ui.language": "שפת ממשק",
      "ui.english": "אנגלית",
      "ui.hebrew": "עברית",
      "chat.send": "שלח הודעה",
      "chat.attach": "צרף תמונה",
      "common.close": "סגור",
      "tts.replay": "השמע שוב",
      "screen.title": "עוזר מסך"
    }
  };
  const storageKey = 'aiAssistants.uiLanguage';
  let language = 'en';
  try {
    language = localStorage.getItem(storageKey) === 'he' ? 'he' : 'en';
  } catch {}
  const root = document.documentElement;
  root.lang = language;
  root.dir = language === 'he' ? 'rtl' : 'ltr';
  if (language === 'he') root.classList.add('i18n-loading');

  function message(key, params = {}) {
    return { key, params };
  }

  function resolve(value) {
    return value && typeof value === 'object' && value.key
      ? t(value.key, value.params)
      : String(value ?? '');
  }

  function t(key, params = {}) {
    const template = translations[language][key] ?? translations.en[key] ?? key;
    return template.replace(/\{(\w+)\}/g, (_, name) => resolve(params[name]));
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  function error(key, params = {}) {
    const failure = new Error(t(key, params));
    failure.uiMessage = message(key, params);
    return failure;
  }

  function errorDetail(failure) {
    return failure?.uiMessage || failure?.message || String(failure);
  }

  function html(value, params = {}) {
    const descriptor = typeof value === 'string' ? message(value, params) : value;
    return '<span data-i18n="' + escapeHtml(descriptor.key) +
      '" data-i18n-params="' + escapeHtml(JSON.stringify(descriptor.params)) +
      '">' + escapeHtml(resolve(descriptor)) + '</span>';
  }

  function setText(element, value) {
    if (!element) return;
    if (value && typeof value === 'object' && value.key) {
      element.dataset.i18n = value.key;
      element.dataset.i18nParams = JSON.stringify(value.params);
    } else {
      delete element.dataset.i18n;
      delete element.dataset.i18nParams;
    }
    const text = resolve(value);
    if (element.textContent !== text) element.textContent = text;
  }

  function paramsFor(element) {
    try { return JSON.parse(element.dataset.i18nParams || '{}'); } catch { return {}; }
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat(language === 'he' ? 'he-IL' : 'en-US', {
      dateStyle: 'short', timeStyle: 'short'
    }).format(date);
  }

  function applyElement(element) {
    if (element.closest('[data-user-content]')) return;
    if (element.dataset.i18n) {
      const text = t(element.dataset.i18n, paramsFor(element));
      if (element.textContent !== text) element.textContent = text;
    }
    for (const attribute of ['title', 'placeholder', 'aria-label', 'alt']) {
      const key = element.getAttribute('data-i18n-' + attribute);
      if (key) {
        const value = t(key, paramsFor(element));
        if (element.getAttribute(attribute) !== value) element.setAttribute(attribute, value);
      }
    }
    if (element.dataset.i18nDate) {
      const value = formatDate(element.dataset.i18nDate);
      if (element.textContent !== value) element.textContent = value;
    }
    if (element.hasAttribute('data-ui-language')) {
      element.setAttribute('aria-pressed', String(element.dataset.uiLanguage === language));
    }
  }

  const selector = '[data-i18n], [data-i18n-title], [data-i18n-placeholder], [data-i18n-aria-label], [data-i18n-alt], [data-i18n-date], [data-ui-language]';

  function apply(container = document) {
    if (container.nodeType === 1 && container.matches(selector)) applyElement(container);
    container.querySelectorAll?.(selector).forEach(applyElement);
  }

  function setLanguage(value, persist = true) {
    language = value === 'he' ? 'he' : 'en';
    root.lang = language;
    root.dir = language === 'he' ? 'rtl' : 'ltr';
    if (persist) {
      try { localStorage.setItem(storageKey, language); } catch {}
    }
    apply();
    window.dispatchEvent(new CustomEvent('uilanguagechange', { detail: { language } }));
  }

  window.I18n = {
    t, message, resolve, html, setText, apply, escapeHtml, formatDate, setLanguage, error, errorDetail,
    get language() { return language; },
    get locale() { return language === 'he' ? 'he-IL' : 'en-US'; }
  };

  window.addEventListener('storage', event => {
    if (event.key === storageKey || event.key === null) setLanguage(event.newValue, false);
  });

  function initialize() {
    document.querySelectorAll('[data-language-toggle]').forEach(container => {
      container.classList.add('ui-language-toggle');
      container.setAttribute('role', 'group');
      container.setAttribute('data-i18n-aria-label', 'ui.language');
      container.dir = 'ltr';
      for (const value of ['he', 'en']) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = value.toUpperCase();
        button.dataset.uiLanguage = value;
        button.setAttribute('data-i18n-aria-label', value === 'he' ? 'ui.hebrew' : 'ui.english');
        button.addEventListener('click', () => setLanguage(value));
        container.appendChild(button);
      }
    });
    for (const identifier of ['languageSelect', 'voiceLang']) {
      const select = document.getElementById(identifier);
      if (!select) continue;
      const preferenceKey = 'aiAssistants.speech.' + identifier;
      try {
        const saved = localStorage.getItem(preferenceKey);
        if (saved !== null && [...select.options].some(option => option.value === saved)) {
          select.value = saved;
          select.dispatchEvent(new Event('change'));
        }
      } catch {}
      select.addEventListener('change', () => {
        try { localStorage.setItem(preferenceKey, select.value); } catch {}
      });
    }
    apply();
    root.classList.remove('i18n-loading');
    const observer = new MutationObserver(records => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node.nodeType === 1) apply(node);
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize);
  else initialize();
})();
