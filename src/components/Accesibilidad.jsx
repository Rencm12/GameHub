import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  X,
  ChevronDown,
  Type,
  Contrast,
  MousePointer2,
  Rows3,
  CaseSensitive,
  AlignJustify,
  RotateCcw,
} from "lucide-react";
import i18n from "../i18n";

const STORAGE_KEY = "gamehub-accessibility";

const DEFAULT_SETTINGS = {
  textSize: 0,
  contrast: 0,
  cursor: 0,
  readingMask: false,
  dyslexia: 0,
  lineHeight: 0,
};

const PROFILE_SETTINGS = {
  default: DEFAULT_SETTINGS,
  colorBlind: { ...DEFAULT_SETTINGS, contrast: 1 },
  lowVision: { ...DEFAULT_SETTINGS, textSize: 2, contrast: 2, cursor: 2 },
  adhd: { ...DEFAULT_SETTINGS, readingMask: true, lineHeight: 2 },
  dyslexia: { ...DEFAULT_SETTINGS, dyslexia: 2, lineHeight: 2, textSize: 1 },
};

const ACCESSIBILITY_CLASSES = [
  "a11y-text-1", "a11y-text-2", "a11y-text-3", "a11y-text-4",
  "a11y-contrast-1", "a11y-contrast-2", "a11y-contrast-3",
  "a11y-cursor-1", "a11y-cursor-2", "a11y-cursor-3",
  "a11y-reading-mask",
  "a11y-dyslexia-1", "a11y-dyslexia-2",
  "a11y-line-height-1", "a11y-line-height-2", "a11y-line-height-3", "a11y-line-height-4",
];

const TOOL_CONFIG = [
  { id: "textSize", Icon: Type, levels: 4 },
  { id: "contrast", Icon: Contrast, levels: 3 },
  { id: "cursor", Icon: MousePointer2, levels: 3 },
  { id: "readingMask", Icon: Rows3, levels: 0 },
  { id: "dyslexia", Icon: CaseSensitive, levels: 2 },
  { id: "lineHeight", Icon: AlignJustify, levels: 4 },
];

function getSavedPreferences() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

function savePreferences(preferences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  i18n.changeLanguage(preferences.language);
}

export default function AccessibilityWidget({ open = false, onClose = () => {} }) {
  return <AccessibilityMenu open={open} onClose={onClose} />;
}

function AccessibilityMenu({ open = false, onClose = () => {} }) {
  const { t } = useTranslation();
  const savedPreferences = useMemo(() => getSavedPreferences(), []);
  const [language, setLanguage] = useState(savedPreferences?.language ?? "es");
  const [profile, setProfile] = useState(savedPreferences?.profile ?? "default");
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 120 });
  const [settings, setSettings] = useState({
    ...DEFAULT_SETTINGS,
    ...(savedPreferences?.settings ?? {}),
  });

  const levels = t("accessibility.levels", { returnObjects: true });
  const languages = t("accessibility.languages", { returnObjects: true });
  const profiles = t("accessibility.profiles", { returnObjects: true });
  const tools = t("accessibility.tools", { returnObjects: true });
  const languageOptions = Object.keys(languages);
  const profileOptions = Object.keys(profiles);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.classList.remove(...ACCESSIBILITY_CLASSES);
    body.classList.remove(...ACCESSIBILITY_CLASSES);

    const activeClasses = [
      settings.textSize > 0 ? `a11y-text-${settings.textSize}` : "",
      settings.contrast > 0 ? `a11y-contrast-${settings.contrast}` : "",
      settings.cursor > 0 ? `a11y-cursor-${settings.cursor}` : "",
      settings.readingMask ? "a11y-reading-mask" : "",
      settings.dyslexia > 0 ? `a11y-dyslexia-${settings.dyslexia}` : "",
      settings.lineHeight > 0 ? `a11y-line-height-${settings.lineHeight}` : "",
    ].filter(Boolean);

    root.classList.add(...activeClasses);
    body.classList.add(...activeClasses);
    savePreferences({ language, profile, settings });
  }, [language, profile, settings]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!settings.readingMask && settings.cursor === 0) return undefined;
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
      document.body.style.setProperty("--a11y-mask-y", `${event.clientY}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [settings.cursor, settings.readingMask]);

  const toggleTool = (tool) => {
    setProfile("default");
    setSettings((prev) => {
      if (tool.levels === 0) return { ...prev, [tool.id]: !prev[tool.id] };
      return { ...prev, [tool.id]: (prev[tool.id] + 1) % (tool.levels + 1) };
    });
  };

  const selectProfile = (nextProfile) => {
    setProfile(nextProfile);
    setProfileOpen(false);
    setSettings(PROFILE_SETTINGS[nextProfile] ?? DEFAULT_SETTINGS);
  };

  const reset = () => {
    setSettings(DEFAULT_SETTINGS);
    setProfile("default");
    setLanguage("es");
    localStorage.removeItem(STORAGE_KEY);
  };

  const isActive = (tool) =>
    tool.levels > 0 ? settings[tool.id] > 0 : settings[tool.id];

  return (
    <>
      {settings.cursor > 0 && (
        <span
          className={`a11y-custom-cursor a11y-custom-cursor-${settings.cursor}`}
          style={{ left: `${mousePosition.x}px`, top: `${mousePosition.y}px` }}
        />
      )}

      <section
        aria-label={t("accessibility.title")}
        className={`
          fixed
          top-24
          right-4
          md:right-8
          z-[10000]
          w-[calc(100%-2rem)]
          max-w-sm
          bg-slate-100
          rounded-xl
          overflow-hidden
          shadow-xl
          font-sans
          transition-transform
          duration-500
          ease-in-out
          ${open ? "translate-x-0" : "translate-x-[120%]"}
        `}
      >
        <div className="bg-blue-900 text-white flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <AccessibilityIcon className="w-5 h-5" />
            <span className="font-semibold text-sm">{t("accessibility.title")}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("accessibility.close")}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-white/70 hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-1">
          <Dropdown
            label={t("accessibility.language")}
            value={languages[language]}
            options={languageOptions}
            getLabel={(option) => languages[option]}
            open={langOpen}
            onToggle={() => { setLangOpen((o) => !o); setProfileOpen(false); }}
            onSelect={(value) => { setLanguage(value); setLangOpen(false); }}
          />

          <Dropdown
            label={t("accessibility.profile")}
            value={profiles[profile]}
            options={profileOptions}
            getLabel={(option) => profiles[option]}
            open={profileOpen}
            onToggle={() => { setProfileOpen((o) => !o); setLangOpen(false); }}
            onSelect={selectProfile}
          />

          <div className="grid grid-cols-2 gap-3 pt-3">
            {TOOL_CONFIG.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                label={tools[tool.id]}
                active={isActive(tool)}
                level={settings[tool.id]}
                levelLabel={levels[settings[tool.id] || 0]}
                onClick={() => toggleTool(tool)}
              />
            ))}
          </div>

          <div className="border-t border-slate-300 mt-4 pt-3 flex justify-center">
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-2 text-sm text-slate-700 hover:text-blue-900 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              {t("accessibility.reset")}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

function Dropdown({ label, value, options, getLabel, open, onToggle, onSelect }) {
  return (
    <div className="relative bg-white rounded-xl px-4 py-3 shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left"
        aria-expanded={open}
      >
        <span className="text-sm text-slate-700">
          {label}: <span className="font-medium text-slate-900">{value}</span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ul className="mt-2 border-t border-slate-200 pt-2 space-y-1">
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                onClick={() => onSelect(option)}
                className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${
                  getLabel(option) === value
                    ? "bg-blue-50 text-blue-900 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {getLabel(option)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ToolCard({ tool, label, active, level, levelLabel, onClick }) {
  const { Icon, levels } = tool;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={`${label}: ${levelLabel}`}
      title={levelLabel}
      className={`flex min-h-32 flex-col items-center justify-center gap-2 rounded-xl p-4 shadow-sm transition-colors text-center ${
        active ? "bg-blue-50 ring-2 ring-blue-900" : "bg-white hover:bg-slate-50"
      }`}
    >
      <Icon
        className={`w-6 h-6 ${active ? "text-blue-900" : "text-slate-800"}`}
        strokeWidth={2}
      />
      <span className="text-sm text-slate-800">{label}</span>
      {levels > 0 ? (
        <div className="flex gap-1 mt-1" aria-hidden="true">
          {Array.from({ length: levels }).map((_, index) => (
            <span
              key={index}
              className={`h-1.5 w-4 rounded-full ${index < level ? "bg-blue-900" : "bg-slate-200"}`}
            />
          ))}
        </div>
      ) : (
        <span
          aria-hidden="true"
          className={`h-1.5 w-8 rounded-full mt-1 ${active ? "bg-blue-900" : "bg-slate-200"}`}
        />
      )}
    </button>
  );
}

function AccessibilityIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="12" cy="4" r="2" />
      <path d="M19 6.5c-2.1.6-4.6.9-7 .9s-4.9-.3-7-.9L4.5 8c1.9.6 4 1 6 1.1V12l-2 7 1.9.5L12 14l1.6 5.5 1.9-.5-2-7V9.1c2-.1 4.1-.5 6-1.1L19 6.5z" />
    </svg>
  );
}
