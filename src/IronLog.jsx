import React, { useState, useEffect, useMemo } from "react";
import { Dumbbell, Check, ChevronRight, ChevronUp, ChevronDown, Home as HomeIcon, ClipboardList, Trophy, HelpCircle, Wind, Plus, Timer, Calendar as CalendarIcon, X, Pencil, Trash2, Camera, Sparkles, RefreshCw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

const BASE_DAYS = {
  Day1: { label: "Push", sub: "Chest / Shoulders / Triceps", exercises: [
    { group: "Chest", name: "Incline Barbell Press", target: "3 x 6-8" },
    { group: "Chest", name: "Flat Smith Machine Press", target: "3 x 8-10" },
    { group: "Chest", name: "Low-to-High Cable Fly", target: "2 x 12-15" },
    { group: "Shoulders", name: "Seated Shoulder Press Machine", target: "3 x 8-10" },
    { group: "Shoulders", name: "Cable/Dumbbell Lateral Raise", target: "3 x 12-15" },
    { group: "Triceps", name: "Overhead Rope Extension", target: "2 x 10-12" },
    { group: "Triceps", name: "Plate-Loaded Triceps Dip Machine", target: "2 x 8-12" },
  ]},
  Day2: { label: "Pull", sub: "Back / Biceps", exercises: [
    { group: "Back", name: "Pull-Ups", target: "4 x 6-10" },
    { group: "Back", name: "Lat Pulldown", target: "3 x 8-10" },
    { group: "Back", name: "Chest-Supported Row", target: "3 x 8-10" },
    { group: "Back", name: "Close-Grip Cable Row", target: "2 x 10-12" },
    { group: "Back", name: "Face Pull", target: "2 x 12-15" },
    { group: "Biceps", name: "Preacher Curl", target: "3 x 8-10" },
    { group: "Biceps", name: "Dumbbell Hammer Curl", target: "2 x 10-12" },
  ]},
  Day3: { label: "Legs", sub: "Legs / Abs", exercises: [
    { group: "Legs", name: "Smith Machine Squat", target: "3 x 6-8" },
    { group: "Legs", name: "Romanian Deadlift", target: "3 x 8-10" },
    { group: "Legs", name: "Leg Press", target: "2 x 10-12" },
    { group: "Legs", name: "Leg Curl", target: "2 x 10-12" },
    { group: "Legs", name: "Calf Raise", target: "2 x 12-15" },
    { group: "Abs", name: "Hanging Knee/Leg Raise", target: "2 x 10-15" },
    { group: "Abs", name: "Cable Crunch", target: "2 x 12-15" },
    { group: "Hip Flexors", name: "Hip Flexor Machine/Cable Hip Flexion", target: "2 x 12-15/leg" },
  ]},
  Day4: { label: "Upper", sub: "Chest / Back / Shoulders / Arms", exercises: [
    { group: "Chest", name: "Incline DB Press / Chest-Press Machine", target: "3 x 8-10" },
    { group: "Chest", name: "Machine Chest Press", target: "2 x 10-12" },
    { group: "Back", name: "Neutral-Grip Lat Pulldown", target: "3 x 8-10" },
    { group: "Back", name: "Seated Cable Row", target: "2 x 10-12" },
    { group: "Shoulders", name: "Cable Lateral Raise", target: "3 x 12-15" },
    { group: "Shoulders", name: "Reverse Pec Deck", target: "2 x 12-15" },
    { group: "Arms", name: "Straight-Bar Pushdown", target: "2 x 10-12" },
    { group: "Arms", name: "EZ-Bar Curl", target: "2 x 10-12" },
  ]},
  Day5: { label: "Arms", sub: "Biceps / Triceps", exercises: [
    { group: "Biceps", name: "Preacher Curl", target: "3 x 8-10" },
    { group: "Biceps", name: "Incline Dumbbell Curl", target: "2 x 10-12" },
    { group: "Biceps", name: "Cable Hammer Curl", target: "2 x 10-12" },
    { group: "Triceps", name: "Straight-Bar Pushdown", target: "3 x 10-12" },
    { group: "Triceps", name: "Single-Arm Cable Triceps Extension", target: "2 x 10-12/arm" },
  ]},
};

const BREATH = {
  "Incline Barbell Press": { in: "Lower bar to chest", out: "Press up" },
  "Flat Smith Machine Press": { in: "Lower the bar", out: "Push up" },
  "Low-to-High Cable Fly": { in: "Let arms open", out: "Bring arms together" },
  "Seated Shoulder Press Machine": { in: "Lower handles", out: "Press up" },
  "Cable/Dumbbell Lateral Raise": { in: "Lower weights", out: "Raise arms" },
  "Overhead Rope Extension": { in: "Lower weight behind head", out: "Extend arms up" },
  "Plate-Loaded Triceps Dip Machine": { in: "Lower body", out: "Press up" },
  "Pull-Ups": { in: "Lower yourself", out: "Pull yourself up" },
  "Lat Pulldown": { in: "Let bar rise", out: "Pull bar down" },
  "Chest-Supported Row": { in: "Extend arms forward", out: "Pull toward you" },
  "Close-Grip Cable Row": { in: "Extend arms forward", out: "Pull toward you" },
  "Face Pull": { in: "Return cable forward", out: "Pull toward face" },
  "Preacher Curl": { in: "Lower weight", out: "Curl up" },
  "Dumbbell Hammer Curl": { in: "Lower dumbbell", out: "Curl up" },
  "Smith Machine Squat": { in: "Inhale/brace before descending", out: "Exhale as you stand up" },
  "Romanian Deadlift": { in: "Inhale before/while lowering", out: "Exhale as you stand/extend hips" },
  "Leg Press": { in: "Lower platform", out: "Push platform away" },
  "Leg Curl": { in: "Release/lower weight", out: "Curl weight" },
  "Calf Raise": { in: "Lower heels", out: "Raise heels" },
  "Hanging Knee/Leg Raise": { in: "Lower legs", out: "Raise legs" },
  "Cable Crunch": { in: "Return upward", out: "Crunch down" },
  "Hip Flexor Machine/Cable Hip Flexion": { in: "Lower leg", out: "Bring knee upward" },
  "Incline DB Press / Chest-Press Machine": { in: "Lower to chest", out: "Press up" },
  "Machine Chest Press": { in: "Lower the handles", out: "Push up" },
  "Neutral-Grip Lat Pulldown": { in: "Let bar rise", out: "Pull bar down" },
  "Seated Cable Row": { in: "Extend arms forward", out: "Pull toward you" },
  "Cable Lateral Raise": { in: "Lower weights", out: "Raise arms" },
  "Reverse Pec Deck": { in: "Let arms come forward", out: "Open arms back" },
  "Straight-Bar Pushdown": { in: "Let bar come up", out: "Push bar down" },
  "EZ-Bar Curl": { in: "Lower the bar", out: "Curl up" },
  "Incline Dumbbell Curl": { in: "Lower dumbbell", out: "Curl up" },
  "Cable Hammer Curl": { in: "Lower weight", out: "Curl up" },
  "Single-Arm Cable Triceps Extension": { in: "Let cable rise", out: "Extend arm down" },
};

const EXERCISE_PRESETS = {
  Day1: [
    { group: "Chest", name: "Flat Barbell Bench Press" },
    { group: "Chest", name: "Incline Barbell Bench Press" },
    { group: "Chest", name: "Decline Barbell Bench Press" },
    { group: "Chest", name: "Flat Dumbbell Press" },
    { group: "Chest", name: "Incline Dumbbell Press" },
    { group: "Chest", name: "Dips (Chest-Focused)" },
    { group: "Chest", name: "Push-Ups" },
    { group: "Chest", name: "Landmine Press" },
    { group: "Chest", name: "Smith Machine Bench Press" },
    { group: "Chest", name: "Machine Chest Press" },
    { group: "Chest", name: "Hammer Strength Press" },
    { group: "Chest", name: "Flat Dumbbell Fly" },
    { group: "Chest", name: "Incline Dumbbell Fly" },
    { group: "Chest", name: "Cable Fly (Low-to-High)" },
    { group: "Chest", name: "Cable Fly (High-to-Low)" },
    { group: "Chest", name: "Cable Fly (Mid)" },
    { group: "Chest", name: "Pec Deck / Machine Fly" },
    { group: "Chest", name: "Cable Crossover" },
    { group: "Chest", name: "Svend Press" },
    { group: "Chest", name: "Dumbbell Pullover" },
  ],
};

const TAGS = {
  W: { label: "Warm up", dot: "bg-amber-500", desc: "Lighter warm-up set - excluded from PRs and volume." },
  D: { label: "Drop set", dot: "bg-violet-500", desc: "Reduced-weight set performed right after reaching failure." },
  F: { label: "Failure", dot: "bg-rose-500", desc: "Taken to muscular failure." },
};

const LOG_KEY = "iron-log-entries";
const CUSTOM_KEY = "iron-log-custom-exercises";
const REMOVED_KEY = "iron-log-removed-exercises";
const ORDER_KEY = "iron-log-exercise-order";
const PHOTOS_KEY = "iron-log-physique-photos";

function resizeImage(file, maxDim = 640, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("image load failed"));
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDim) {
          height = Math.round(height * (maxDim / width));
          width = maxDim;
        } else if (height >= width && height > maxDim) {
          width = Math.round(width * (maxDim / height));
          height = maxDim;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

async function getPhysiqueAssessment(prevDataUrl, currDataUrl) {
  const strip = (d) => d.split(",")[1];
  const content = [
    { type: "image", source: { type: "base64", media_type: "image/jpeg", data: strip(prevDataUrl) } },
    { type: "image", source: { type: "base64", media_type: "image/jpeg", data: strip(currDataUrl) } },
    {
      type: "text",
      text:
        "The first image is an earlier physique check-in photo and the second is the most recent one, from someone tracking their own training progress. " +
        "Write a brief, neutral 'Physique Trend' comparison, 2-4 sentences, noting any visible changes in muscle definition, shoulder/chest development, or V-taper appearance. " +
        "Do not estimate weight, body fat percentage, or give any numeric claims. If lighting, pose, or camera angle differ between the photos, say that this limits the comparison. " +
        "Keep the tone measured and observational, not hype or overly critical. Start the response with 'Physique Trend:' and output only that paragraph, nothing else.",
    },
  ];
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user", content }] }),
  });
  const data = await res.json();
  const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
  if (!text) throw new Error("empty response");
  return text;
}

async function readStore(key, fallback = []) {
  try {
    const r = await window.storage.get(key);
    return r ? JSON.parse(r.value) : fallback;
  } catch {
    return fallback;
  }
}

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function daysAgoLabel(dateStr) {
  if (!dateStr) return "Never";
  const then = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.setHours(0, 0, 0, 0) - new Date(then).setHours(0, 0, 0, 0)) / 86400000);
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

function keyId(day, name) { return `${day}::${name}`; }

function parseTarget(target) {
  const m = (target || "").match(/(\d+)\s*x\s*(\d+)(?:[-\u2013](\d+))?/i);
  if (!m) return { count: 3, repLow: 8 };
  return { count: parseInt(m[1], 10), repLow: parseInt(m[2], 10) };
}

function setCountOf(ex) {
  if (ex.setsCount) return ex.setsCount;
  return parseTarget(ex.target).count;
}
function repLowOf(ex) {
  return parseTarget(ex.target).repLow ?? 8;
}

function formatClock(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d) { return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999); }
function formatDuration(ms) {
  const totalMin = Math.round(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h === 0 ? `${m}m` : `${h}h ${m}m`;
}

export default function IronLog() {
  const [log, setLog] = useState([]);
  const [customExercises, setCustomExercises] = useState([]);
  const [removed, setRemoved] = useState([]);
  const [order, setOrder] = useState({});
  const [ready, setReady] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [tab, setTab] = useState("Home");
  const [dayMode, setDayMode] = useState({});
  const [session, setSession] = useState({});
  const [sessionSets, setSessionSets] = useState({});
  const [tagMenu, setTagMenu] = useState(null);
  const [tagHelp, setTagHelp] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [toast, setToast] = useState("");
  const [infoFor, setInfoFor] = useState(null);
  const [formFor, setFormFor] = useState(null);

  useEffect(() => {
    (async () => {
      const [logData, customData, removedData, orderData] = await Promise.all([
        readStore(LOG_KEY, []),
        readStore(CUSTOM_KEY, []),
        readStore(REMOVED_KEY, []),
        readStore(ORDER_KEY, {}),
      ]);
      setLog(logData);
      setCustomExercises(customData);
      setRemoved(removedData);
      setOrder(orderData);
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (Object.keys(session).length === 0) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [session]);

  const getDayData = (day) => {
    const base = BASE_DAYS[day].exercises;
    const custom = customExercises.filter((c) => c.day === day);
    const removedNames = new Set(removed.filter((r) => r.day === day).map((r) => r.name));
    let combined = [...base, ...custom].filter((ex) => !removedNames.has(ex.name));
    const ord = order[day];
    if (ord && ord.length) {
      combined = [...combined].sort((a, b) => {
        const ia = ord.indexOf(a.name);
        const ib = ord.indexOf(b.name);
        return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
      });
    }
    return { ...BASE_DAYS[day], exercises: combined };
  };

  const getBreath = (name) => {
    if (BREATH[name]) return BREATH[name];
    const c = customExercises.find((e) => e.name === name);
    return c && (c.breathIn || c.breathOut) ? { in: c.breathIn || "-", out: c.breathOut || "-" } : null;
  };

  const addEntry = async (entry) => {
    const current = await readStore(LOG_KEY, []);
    const next = [...current, entry];
    try {
      const res = await window.storage.set(LOG_KEY, JSON.stringify(next), false);
      if (!res) throw new Error("no result");
      setLog(next);
      setSaveError(false);
      return true;
    } catch (e) {
      console.error("save failed", e);
      setSaveError(true);
      setToast("Could not save - check connection and try again");
      setTimeout(() => setToast(""), 2500);
      return false;
    }
  };

  const removeEntry = async (id) => {
    const current = await readStore(LOG_KEY, []);
    const next = current.filter((e) => e.id !== id);
    try {
      await window.storage.set(LOG_KEY, JSON.stringify(next), false);
      setLog(next);
    } catch (e) {
      console.error("remove failed", e);
    }
  };

  const updateEntryType = async (id, setType) => {
    const current = await readStore(LOG_KEY, []);
    const next = current.map((e) => (e.id === id ? { ...e, setType } : e));
    try {
      await window.storage.set(LOG_KEY, JSON.stringify(next), false);
      setLog(next);
    } catch (e) {
      console.error("update failed", e);
    }
  };

  const saveExercise = async (day, obj, editingId) => {
    const current = await readStore(CUSTOM_KEY, []);
    let next;
    if (editingId) {
      next = current.map((e) => (e.id === editingId ? { ...e, ...obj } : e));
    } else {
      next = [...current, { id: genId(), day, ...obj }];
    }
    try {
      await window.storage.set(CUSTOM_KEY, JSON.stringify(next), false);
      setCustomExercises(next);
      setToast(editingId ? `Updated ${obj.name}` : `Added ${obj.name} to ${BASE_DAYS[day].label}`);
      setTimeout(() => setToast(""), 1800);
    } catch (e) {
      console.error("save exercise failed", e);
      setToast("Could not save - try again");
      setTimeout(() => setToast(""), 2000);
    }
  };

  const deleteExercise = async (day, ex) => {
    if (ex.id) {
      const current = await readStore(CUSTOM_KEY, []);
      const next = current.filter((e) => e.id !== ex.id);
      try {
        await window.storage.set(CUSTOM_KEY, JSON.stringify(next), false);
        setCustomExercises(next);
      } catch (e) {
        console.error("delete failed", e);
        return;
      }
    } else {
      const current = await readStore(REMOVED_KEY, []);
      const next = [...current, { day, name: ex.name }];
      try {
        await window.storage.set(REMOVED_KEY, JSON.stringify(next), false);
        setRemoved(next);
      } catch (e) {
        console.error("remove failed", e);
        return;
      }
    }
    setToast(`Removed ${ex.name}`);
    setTimeout(() => setToast(""), 1500);
  };

  const moveExercise = async (day, name, dir) => {
    const current = getDayData(day).exercises.map((e) => e.name);
    const idx = current.indexOf(name);
    const swap = dir === "up" ? idx - 1 : idx + 1;
    if (idx === -1 || swap < 0 || swap >= current.length) return;
    const next = [...current];
    [next[idx], next[swap]] = [next[swap], next[idx]];
    const nextOrder = { ...order, [day]: next };
    try {
      await window.storage.set(ORDER_KEY, JSON.stringify(nextOrder), false);
      setOrder(nextOrder);
    } catch (e) {
      console.error("reorder failed", e);
    }
  };

  const prFor = (name) => {
    const entries = log.filter((e) => e.name === name && e.setType !== "W");
    if (!entries.length) return null;
    return Math.max(...entries.map((e) => e.kg));
  };

  const lastPerformedForDay = (day) => {
    const entries = log.filter((e) => e.day === day).sort((a, b) => new Date(b.date) - new Date(a.date));
    return entries[0]?.date || null;
  };

  const getPreviousSet = (name, setNumber, excludeSessionId) => {
    const entries = log
      .filter((e) => e.name === name && e.setNumber === setNumber && e.sessionId !== excludeSessionId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    return entries[0] || null;
  };

  const mostRecentAnyKg = (name) => {
    const entries = log.filter((e) => e.name === name).sort((a, b) => new Date(b.date) - new Date(a.date));
    return entries[0]?.kg;
  };

  const initRowsForExercise = (ex, sessionId) => {
    const count = setCountOf(ex);
    const repLow = repLowOf(ex);
    return Array.from({ length: count }, (_, i) => {
      const prev = getPreviousSet(ex.name, i + 1, sessionId);
      const fallbackKg = mostRecentAnyKg(ex.name);
      return {
        kg: prev ? prev.kg : fallbackKg ?? "",
        reps: prev ? prev.reps : repLow,
        done: false,
        entryId: null,
        type: null,
        prevLabel: prev ? `${prev.kg} kg x ${prev.reps}` : "-",
      };
    });
  };

  const startWorkout = (day) => {
    const id = genId();
    const rows = {};
    getDayData(day).exercises.forEach((ex) => { rows[ex.name] = initRowsForExercise(ex, id); });
    setSession((p) => ({ ...p, [day]: { id, startTime: Date.now() } }));
    setSessionSets((p) => ({ ...p, [day]: rows }));
    setDayMode((p) => ({ ...p, [day]: "active" }));
  };

  const finishWorkout = (day) => {
    setSession((p) => { const c = { ...p }; delete c[day]; return c; });
    setSessionSets((p) => { const c = { ...p }; delete c[day]; return c; });
    setTagMenu(null);
    setDayMode((p) => ({ ...p, [day]: "overview" }));
  };

  const updateRow = (day, name, index, patch) => {
    setSessionSets((p) => {
      const dayRows = { ...(p[day] || {}) };
      const rows = [...(dayRows[name] || [])];
      rows[index] = { ...rows[index], ...patch };
      dayRows[name] = rows;
      return { ...p, [day]: dayRows };
    });
  };

  const addSetRow = (day, ex) => {
    setSessionSets((p) => {
      const dayRows = { ...(p[day] || {}) };
      const rows = [...(dayRows[ex.name] || [])];
      const last = rows[rows.length - 1];
      const setNumber = rows.length + 1;
      const prev = getPreviousSet(ex.name, setNumber, session[day]?.id);
      rows.push({
        kg: prev ? prev.kg : last?.kg ?? "",
        reps: prev ? prev.reps : last?.reps ?? "",
        done: false, entryId: null, type: null,
        prevLabel: prev ? `${prev.kg} kg x ${prev.reps}` : "-",
      });
      dayRows[ex.name] = rows;
      return { ...p, [day]: dayRows };
    });
  };

  const toggleSet = async (day, ex, index) => {
    const row = sessionSets[day]?.[ex.name]?.[index];
    if (!row) return;
    if (!row.done) {
      const kg = Number(row.kg) || 0;
      const reps = Number(row.reps) || 0;
      const entry = {
        id: genId(), day, dayLabel: BASE_DAYS[day].label, group: ex.group, name: ex.name,
        date: new Date().toISOString(), sessionId: session[day]?.id, setNumber: index + 1,
        kg, reps, setType: row.type,
      };
      const ok = await addEntry(entry);
      if (ok) updateRow(day, ex.name, index, { done: true, entryId: entry.id, kg, reps });
    } else {
      if (row.entryId) await removeEntry(row.entryId);
      updateRow(day, ex.name, index, { done: false, entryId: null });
    }
  };

  const setRowTag = async (day, ex, index, type) => {
    const row = sessionSets[day]?.[ex.name]?.[index];
    const nextType = row?.type === type ? null : type;
    updateRow(day, ex.name, index, { type: nextType });
    if (row?.entryId) await updateEntryType(row.entryId, nextType);
    setTagMenu(null);
    setTagHelp(null);
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="text-stone-500 font-mono text-sm">loading log...</div>
      </div>
    );
  }

  const goDay = (id) => {
    setTab(id);
    setDayMode((p) => ({ ...p, [id]: p[id] || "overview" }));
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-50 pb-24" style={{ fontFamily: "system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .display-font { font-family: 'Oswald', system-ui, sans-serif; }
        .mono-font { font-family: 'IBM Plex Mono', monospace; }
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>

      <div className="sticky top-0 z-20 bg-stone-950/95 backdrop-blur border-b border-stone-800 px-4 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-md bg-orange-800 flex items-center justify-center">
            <Dumbbell size={18} className="text-stone-50" />
          </div>
          <div>
            <div className="display-font text-xl tracking-wide uppercase leading-none">Iron Log</div>
            <div className="text-stone-500 text-xs mt-0.5">
              52 kg &rarr; 55 kg &middot; 166 cm &middot; V-taper
              {saveError && <span className="text-red-500 ml-2">&middot; save error</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar border-b border-stone-900">
        {[
          { id: "Home", label: "Home", icon: HomeIcon },
          ...Object.entries(BASE_DAYS).map(([id, d]) => ({ id, label: d.label, icon: ClipboardList })),
          { id: "Report", label: "Monthly", icon: CalendarIcon },
          { id: "Physique", label: "Physique", icon: Camera },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => (Object.keys(BASE_DAYS).includes(id) ? goDay(id) : setTab(id))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap border ${
              tab === id ? "bg-orange-800 border-orange-800 text-stone-50" : "bg-transparent border-stone-700 text-stone-400"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      <div className="px-4 pt-4">
        {tab === "Home" && <HomeView goDay={goDay} setTab={setTab} log={log} lastPerformedForDay={lastPerformedForDay} />}

        {Object.keys(BASE_DAYS).includes(tab) && dayMode[tab] === "overview" && (
          <DayOverview
            day={tab}
            data={getDayData(tab)}
            lastPerformedForDay={lastPerformedForDay}
            onStart={() => startWorkout(tab)}
            infoFor={infoFor}
            setInfoFor={setInfoFor}
            getBreath={getBreath}
            formFor={formFor}
            setFormFor={setFormFor}
            saveExercise={saveExercise}
            deleteExercise={deleteExercise}
            moveExercise={moveExercise}
          />
        )}

        {Object.keys(BASE_DAYS).includes(tab) && dayMode[tab] === "active" && session[tab] && (
          <DayActive
            day={tab}
            data={getDayData(tab)}
            rows={sessionSets[tab] || {}}
            startTime={session[tab].startTime}
            now={now}
            tagMenu={tagMenu}
            setTagMenu={setTagMenu}
            tagHelp={tagHelp}
            setTagHelp={setTagHelp}
            prFor={prFor}
            getBreath={getBreath}
            toggleSet={toggleSet}
            updateRow={updateRow}
            addSetRow={addSetRow}
            setRowTag={setRowTag}
            onFinish={() => finishWorkout(tab)}
          />
        )}

        {tab === "Report" && <MonthlyReportView log={log} />}
        {tab === "Physique" && <PhysiqueView />}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-stone-50 text-stone-900 px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2 z-30 max-w-[90%] text-center">
          <Check size={14} className="shrink-0" /> {toast}
        </div>
      )}
    </div>
  );
}

function HomeView({ goDay, setTab, log, lastPerformedForDay }) {
  const week = useMemo(() => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000);
    const w = log.filter((e) => new Date(e.date) >= weekAgo);
    const sessions = new Set(w.map((e) => e.sessionId || e.day + e.date.slice(0, 10))).size;
    const volume = Math.round(w.filter((e) => e.setType !== "W").reduce((s, e) => s + e.kg * e.reps, 0));
    return { sessions, volume };
  }, [log]);

  return (
    <div className="space-y-4">
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
        <div className="text-stone-400 text-xs uppercase tracking-wide mb-1">This week so far</div>
        <div className="flex items-end gap-4">
          <div>
            <div className="mono-font text-3xl font-semibold">{week.sessions}</div>
            <div className="text-stone-500 text-xs">sessions</div>
          </div>
          <div>
            <div className="mono-font text-3xl font-semibold">{week.volume.toLocaleString()}</div>
            <div className="text-stone-500 text-xs">kg volume</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {Object.entries(BASE_DAYS).map(([id, d]) => (
          <button key={id} onClick={() => goDay(id)} className="flex items-center justify-between bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 active:bg-stone-800">
            <div className="text-left">
              <div className="display-font text-lg uppercase tracking-wide">{id.replace("Day", "Day ")}</div>
              <div className="text-stone-500 text-xs">{d.label} &middot; {d.sub}</div>
              <div className="text-stone-600 text-xs mt-0.5">Last: {daysAgoLabel(lastPerformedForDay(id))}</div>
            </div>
            <ChevronRight size={18} className="text-stone-600" />
          </button>
        ))}
      </div>

      <button onClick={() => setTab("Report")} className="w-full flex items-center justify-center gap-2 bg-orange-800 rounded-xl py-3 font-medium">
        <CalendarIcon size={16} /> View monthly report
      </button>
    </div>
  );
}

function DayOverview({ day, data, lastPerformedForDay, onStart, infoFor, setInfoFor, getBreath, formFor, setFormFor, saveExercise, deleteExercise, moveExercise }) {
  const last = lastPerformedForDay(day);
  const [manage, setManage] = useState(false);
  const isAddingHere = formFor && formFor.day === day;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="display-font text-2xl uppercase tracking-wide">{day.replace("Day", "Day ")} - {data.label}</div>
          <div className="text-stone-500 text-sm mt-0.5">Last Performed: {daysAgoLabel(last)}</div>
        </div>
        <button onClick={() => setManage((m) => !m)} className={`text-sm px-3 py-1.5 rounded-full border ${manage ? "bg-orange-800 border-orange-800 text-white" : "border-stone-700 text-stone-400"}`}>
          {manage ? "Done" : "Edit"}
        </button>
      </div>

      <div className="divide-y divide-stone-900 border-t border-b border-stone-900">
        {data.exercises.map((ex, idx) => {
          const cue = getBreath(ex.name);
          const isOpen = infoFor === keyId(day, ex.name);
          const isCustom = !!ex.id;
          return (
            <div key={ex.name} className="py-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center shrink-0 text-stone-500 text-xs display-font">
                  {ex.group.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium leading-snug">
                    <span className="text-stone-400">{setCountOf(ex)} &times;</span> {ex.name}
                  </div>
                  <div className="text-stone-500 text-xs">{ex.group}</div>
                </div>

                {!manage && (
                  <button onClick={() => setInfoFor(isOpen ? null : keyId(day, ex.name))} className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center text-orange-500 shrink-0">
                    <HelpCircle size={16} />
                  </button>
                )}

                {manage && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => moveExercise(day, ex.name, "up")} disabled={idx === 0} className="w-7 h-7 rounded-md bg-stone-800 text-stone-400 disabled:opacity-30 flex items-center justify-center">
                      <ChevronUp size={14} />
                    </button>
                    <button onClick={() => moveExercise(day, ex.name, "down")} disabled={idx === data.exercises.length - 1} className="w-7 h-7 rounded-md bg-stone-800 text-stone-400 disabled:opacity-30 flex items-center justify-center">
                      <ChevronDown size={14} />
                    </button>
                    {isCustom && (
                      <button onClick={() => setFormFor({ day, editing: ex })} className="w-7 h-7 rounded-md bg-stone-800 text-sky-400 flex items-center justify-center">
                        <Pencil size={13} />
                      </button>
                    )}
                    <button onClick={() => deleteExercise(day, ex)} className="w-7 h-7 rounded-md bg-stone-800 text-rose-400 flex items-center justify-center">
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>
              {!manage && isOpen && cue && (
                <div className="mt-2 ml-14 bg-stone-900 border border-stone-800 rounded-lg p-3 text-xs space-y-1">
                  <div className="flex items-center gap-2 text-stone-400">
                    <Wind size={12} /> <span className="text-stone-300 font-medium">Inhale:</span> {cue.in}
                  </div>
                  <div className="flex items-center gap-2 text-stone-400">
                    <Wind size={12} className="text-orange-500" /> <span className="text-stone-300 font-medium">Exhale:</span> {cue.out}
                  </div>
                </div>
              )}
              {!manage && isOpen && !cue && <div className="mt-2 ml-14 text-xs text-stone-600">No breathing cue set for this exercise.</div>}
            </div>
          );
        })}
      </div>

      {isAddingHere ? (
        <ExerciseForm
          initial={formFor.editing}
          presets={EXERCISE_PRESETS[day] || []}
          existingNames={new Set(data.exercises.map((e) => e.name))}
          onCancel={() => setFormFor(null)}
          onSave={(obj) => {
            saveExercise(day, obj, formFor.editing?.id);
            setFormFor(null);
          }}
        />
      ) : (
        <button onClick={() => setFormFor({ day, editing: null })} className="w-full flex items-center justify-center gap-1 text-stone-400 text-sm py-3 rounded-xl border border-dashed border-stone-800">
          <Plus size={14} /> Add Exercise
        </button>
      )}

      <button onClick={onStart} className="w-full bg-sky-500 active:bg-sky-600 rounded-xl py-3.5 font-semibold text-white">
        Start Workout
      </button>
    </div>
  );
}

function ExerciseForm({ initial, presets = [], existingNames = new Set(), onCancel, onSave }) {
  const [group, setGroup] = useState(initial?.group || "");
  const [name, setName] = useState(initial?.name || "");
  const [sets, setSets] = useState(initial ? setCountOf(initial) : 4);
  const [breathIn, setBreathIn] = useState(initial?.breathIn || "");
  const [breathOut, setBreathOut] = useState(initial?.breathOut || "");

  const availablePresets = presets.filter((p) => !existingNames.has(p.name));
  const canSave = group.trim() && name.trim() && sets > 0;

  const pickPreset = (p) => {
    setName(p.name);
    setGroup(p.group);
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-medium text-sm">{initial ? "Edit Exercise" : "New Exercise"}</div>
        <button onClick={onCancel} className="text-stone-500">
          <X size={16} />
        </button>
      </div>

      {!initial && availablePresets.length > 0 && (
        <div>
          <div className="text-stone-500 text-xs mb-1.5">Quick Pick</div>
          <div className="max-h-40 overflow-y-auto space-y-1 rounded-lg border border-stone-800 bg-stone-950 p-2">
            {availablePresets.map((p) => (
              <button
                key={p.name}
                onClick={() => pickPreset(p)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between ${
                  name === p.name ? "bg-orange-800 text-white" : "bg-stone-900 text-stone-300 active:bg-stone-800"
                }`}
              >
                <span>{p.name}</span>
                <span className="text-xs text-stone-500">{p.group}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <Field label="Body Part" placeholder="e.g. Chest" value={group} onChange={setGroup} />
      <Field label="Exercise Name" placeholder="e.g. Incline Dumbbell Press" value={name} onChange={setName} />

      <div>
        <div className="text-stone-500 text-xs mb-1">Number of Sets</div>
        <div className="flex items-center bg-stone-950 border border-stone-700 rounded-lg overflow-hidden w-32">
          <button onClick={() => setSets((s) => Math.max(1, s - 1))} className="px-3 py-2 text-stone-400">-</button>
          <input
            type="number"
            value={sets}
            onChange={(e) => setSets(Math.max(1, Number(e.target.value) || 1))}
            className="w-full bg-transparent text-center text-stone-50 text-sm mono-font outline-none"
          />
          <button onClick={() => setSets((s) => s + 1)} className="px-3 py-2 text-stone-400">+</button>
        </div>
      </div>

      <Field label="Breathing In" placeholder="e.g. Lowering phase" value={breathIn} onChange={setBreathIn} />
      <Field label="Breathing Out" placeholder="e.g. Pressing phase" value={breathOut} onChange={setBreathOut} />

      <button
        disabled={!canSave}
        onClick={() =>
          onSave({
            group: group.trim(),
            name: name.trim(),
            setsCount: sets,
            target: `${sets} sets`,
            breathIn: breathIn.trim(),
            breathOut: breathOut.trim(),
          })
        }
        className="w-full bg-orange-800 disabled:bg-stone-800 disabled:text-stone-600 rounded-lg py-2.5 text-sm font-medium"
      >
        {initial ? "Save Changes" : "Save Exercise"}
      </button>
    </div>
  );
}

function Field({ label, placeholder, value, onChange }) {
  return (
    <div>
      <div className="text-stone-500 text-xs mb-1">{label}</div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-50 outline-none placeholder:text-stone-600"
      />
    </div>
  );
}

function DayActive({ day, data, rows, startTime, now, tagMenu, setTagMenu, tagHelp, setTagHelp, prFor, getBreath, toggleSet, updateRow, addSetRow, setRowTag, onFinish }) {
  const elapsed = now - startTime;
  return (
    <div className="space-y-4 -mx-4">
      <div className="sticky top-[104px] z-10 bg-stone-950/95 backdrop-blur px-4 py-3 border-b border-stone-800 flex items-center justify-between">
        <div>
          <div className="display-font text-lg uppercase tracking-wide leading-none">{day.replace("Day", "Day ")}- {data.label}</div>
          <div className="flex items-center gap-1 text-stone-400 text-xs mt-1 mono-font">
            <Timer size={12} /> {formatClock(elapsed)}
          </div>
        </div>
        <button onClick={onFinish} className="bg-emerald-600 active:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg">
          Finish
        </button>
      </div>

      <div className="px-4 space-y-5">
        {data.exercises.map((ex) => {
          const exRows = rows[ex.name] || [];
          const pr = prFor(ex.name);
          const cue = getBreath(ex.name);
          return (
            <div key={ex.name} className="bg-stone-900 border border-stone-800 rounded-xl p-3">
              <div className="flex items-start justify-between gap-2 mb-1 px-1">
                <div>
                  <span className="text-orange-500 text-xs uppercase tracking-wide">{ex.group}</span>
                  <div className="font-medium leading-snug">{ex.name}</div>
                </div>
                {pr !== null && (
                  <div className="flex items-center gap-1 bg-stone-800 rounded-full px-2 py-1 text-xs text-amber-400 shrink-0">
                    <Trophy size={12} /> {pr}kg
                  </div>
                )}
              </div>
              {cue && (
                <div className="text-[11px] text-stone-500 px-1 mb-2 flex flex-wrap gap-x-3">
                  <span><Wind size={10} className="inline mr-1" />In: {cue.in}</span>
                  <span><Wind size={10} className="inline mr-1 text-orange-500" />Out: {cue.out}</span>
                </div>
              )}

              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-stone-500 text-[11px] uppercase border-b border-stone-800">
                    <th className="text-center py-1.5 font-medium w-9">Set</th>
                    <th className="text-left py-1.5 font-medium pl-2">Previous</th>
                    <th className="text-center py-1.5 font-medium w-14">Kg</th>
                    <th className="text-center py-1.5 font-medium w-14">Reps</th>
                    <th className="text-center py-1.5 font-medium w-9">&#10003;</th>
                  </tr>
                </thead>
                <tbody>
                  {exRows.map((row, i) => {
                    const isTagOpen = tagMenu && tagMenu.day === day && tagMenu.name === ex.name && tagMenu.index === i;
                    const tag = row.type ? TAGS[row.type] : null;
                    return (
                      <React.Fragment key={i}>
                        <tr className={`border-b border-stone-900/60 ${row.done ? "bg-stone-950/40" : ""}`}>
                          <td className="py-1.5 text-center">
                            <button
                              onClick={() => setTagMenu(isTagOpen ? null : { day, name: ex.name, index: i })}
                              className={`w-7 h-7 rounded-md text-xs font-semibold flex items-center justify-center mx-auto ${tag ? `${tag.dot} text-stone-950` : "bg-stone-800 text-stone-200"}`}
                            >
                              {tag ? row.type : i + 1}
                            </button>
                          </td>
                          <td className="py-1.5 pl-2 text-stone-400 text-xs mono-font">{row.prevLabel}</td>
                          <td className="py-1.5">
                            <input
                              type="number"
                              inputMode="decimal"
                              disabled={row.done}
                              value={row.kg}
                              onChange={(e) => updateRow(day, ex.name, i, { kg: e.target.value === "" ? "" : Number(e.target.value) })}
                              className="w-full bg-stone-800 disabled:bg-stone-800/50 disabled:text-stone-500 text-stone-50 text-center text-sm mono-font rounded-md py-1.5 outline-none border border-stone-700"
                            />
                          </td>
                          <td className="py-1.5">
                            <input
                              type="number"
                              inputMode="numeric"
                              disabled={row.done}
                              value={row.reps}
                              onChange={(e) => updateRow(day, ex.name, i, { reps: e.target.value === "" ? "" : Number(e.target.value) })}
                              className="w-full bg-stone-800 disabled:bg-stone-800/50 disabled:text-stone-500 text-stone-50 text-center text-sm mono-font rounded-md py-1.5 outline-none border border-stone-700"
                            />
                          </td>
                          <td className="py-1.5 text-center">
                            <button
                              onClick={() => toggleSet(day, ex, i)}
                              className={`w-7 h-7 rounded-md flex items-center justify-center mx-auto ${row.done ? "bg-emerald-600 text-white" : "bg-stone-800 text-stone-500 border border-stone-700"}`}
                            >
                              <Check size={14} />
                            </button>
                          </td>
                        </tr>
                        {isTagOpen && (
                          <tr>
                            <td colSpan={5} className="pb-2">
                              <div className="bg-stone-800 border border-stone-700 rounded-lg p-2 space-y-1">
                                {Object.entries(TAGS).map(([code, t]) => (
                                  <div key={code} className="flex items-center gap-2">
                                    <button
                                      onClick={() => setRowTag(day, ex, i, code)}
                                      className={`flex-1 flex items-center gap-2 px-2 py-1.5 rounded-md text-sm ${row.type === code ? "bg-stone-700" : ""}`}
                                    >
                                      <span className={`w-5 h-5 rounded-md ${t.dot} text-stone-950 text-[11px] font-bold flex items-center justify-center`}>{code}</span>
                                      <span className="text-stone-100">{t.label}</span>
                                    </button>
                                    <button onClick={() => setTagHelp(tagHelp === code ? null : code)} className="w-6 h-6 rounded-full bg-stone-700 text-stone-300 text-xs flex items-center justify-center shrink-0">
                                      ?
                                    </button>
                                  </div>
                                ))}
                                {tagHelp && <div className="text-[11px] text-stone-400 px-2 pt-1">{TAGS[tagHelp].desc}</div>}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>

              <button onClick={() => addSetRow(day, ex)} className="w-full mt-2 flex items-center justify-center gap-1 text-stone-400 text-xs py-2 rounded-lg border border-dashed border-stone-800">
                <Plus size={12} /> Add Set
              </button>
            </div>
          );
        })}

        <button onClick={onFinish} className="w-full bg-emerald-600 active:bg-emerald-700 rounded-xl py-3.5 font-semibold text-white">
          Finish Workout
        </button>
      </div>
    </div>
  );
}

function MonthlyReportView({ log }) {
  const data = useMemo(() => {
    const today = new Date();
    const mStart = startOfMonth(today);
    const mEnd = endOfMonth(today);
    const daysInMonth = mEnd.getDate();
    const monthLabel = mStart.toLocaleString("en-US", { month: "long", year: "numeric" });

    const monthEntries = log.filter((e) => { const d = new Date(e.date); return d >= mStart && d <= mEnd; });
    const working = monthEntries.filter((e) => e.setType !== "W");

    const sessionMap = new Map();
    monthEntries.forEach((e) => {
      const sid = e.sessionId || `${e.day}-${e.date.slice(0, 10)}`;
      if (!sessionMap.has(sid)) sessionMap.set(sid, { day: e.day, times: [] });
      sessionMap.get(sid).times.push(new Date(e.date).getTime());
    });
    let totalDurationMs = 0;
    sessionMap.forEach((s) => { totalDurationMs += Math.max(...s.times) - Math.min(...s.times); });
    const sessionsCount = sessionMap.size;
    const totalSets = monthEntries.length;
    const totalVolume = Math.round(working.reduce((s, e) => s + e.kg * e.reps, 0));

    const daysElapsed = Math.min(today.getDate(), daysInMonth);
    const targetSessions = Math.max(1, Math.round((daysElapsed / 7) * 5));
    const consistencyPct = Math.min(100, Math.round((sessionsCount / targetSessions) * 100));
    const avgDurationMin = sessionsCount ? Math.round(totalDurationMs / sessionsCount / 60000) : 0;

    const beforeMonth = (name) => log.filter((e) => e.name === name && e.setType !== "W" && new Date(e.date) < mStart);
    const exNames = [...new Set(working.map((e) => e.name))];
    const weightPRs = [];
    const repPRs = [];
    exNames.forEach((name) => {
      const before = beforeMonth(name);
      const beforeMaxKg = before.length ? Math.max(...before.map((e) => e.kg)) : null;
      const monthFor = working.filter((e) => e.name === name);
      const monthMaxKg = Math.max(...monthFor.map((e) => e.kg));
      if (beforeMaxKg !== null && monthMaxKg > beforeMaxKg) {
        const day = monthFor.find((e) => e.kg === monthMaxKg)?.day;
        weightPRs.push({ name, from: beforeMaxKg, to: monthMaxKg, day });
      }
      const weights = [...new Set(monthFor.map((e) => e.kg))];
      weights.forEach((w) => {
        const beforeAtW = before.filter((e) => e.kg === w).map((e) => e.reps);
        if (!beforeAtW.length) return;
        const bestBefore = Math.max(...beforeAtW);
        const bestNow = Math.max(...monthFor.filter((e) => e.kg === w).map((e) => e.reps));
        if (bestNow > bestBefore) {
          const day = monthFor.find((e) => e.kg === w && e.reps === bestNow)?.day;
          repPRs.push({ name, kg: w, from: bestBefore, to: bestNow, day });
        }
      });
    });
    const totalPRs = weightPRs.length + repPRs.length;
    const biggest = [...weightPRs].sort((a, b) => (b.to - b.from) - (a.to - a.from))[0];

    const dayStats = Object.keys(BASE_DAYS).map((d) => {
      const dEntries = monthEntries.filter((e) => e.day === d);
      const dWorking = dEntries.filter((e) => e.setType !== "W");
      const dSessions = new Set(dEntries.map((e) => e.sessionId || `${e.day}-${e.date.slice(0, 10)}`)).size;
      const dVolume = Math.round(dWorking.reduce((s, e) => s + e.kg * e.reps, 0));
      const dPRs = weightPRs.filter((p) => p.day === d).length + repPRs.filter((p) => p.day === d).length;
      return { day: d, label: BASE_DAYS[d].label, sessions: dSessions, sets: dEntries.length, volume: dVolume, prs: dPRs };
    });

    const freq = {};
    working.forEach((e) => { freq[e.name] = (freq[e.name] || 0) + 1; });
    const topExercises = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5).map((x) => x[0]);
    const strengthRows = topExercises.map((name) => {
      const entries = working.filter((e) => e.name === name).sort((a, b) => new Date(a.date) - new Date(b.date));
      const first = entries[0];
      const last = entries[entries.length - 1];
      return {
        name,
        start: first ? `${first.kg} kg x ${first.reps}` : "-",
        end: last ? `${last.kg} kg x ${last.reps}` : "-",
        delta: first && last ? Math.round((last.kg - first.kg) * 10) / 10 : 0,
        single: entries.length === 1,
      };
    });

    const weekBuckets = [0, 0, 0, 0, 0];
    working.forEach((e) => {
      const dayNum = new Date(e.date).getDate();
      const idx = Math.min(4, Math.floor((dayNum - 1) / 7));
      weekBuckets[idx] += e.kg * e.reps;
    });
    const weeksToShow = Math.ceil(daysInMonth / 7);
    const weekData = weekBuckets.slice(0, weeksToShow).map((v, i) => ({ week: `Wk ${i + 1}`, volume: Math.round(v) }));

    const trainedDaysSet = new Set(monthEntries.map((e) => new Date(e.date).getDate()));
    const calendarDays = Array.from({ length: daysElapsed }, (_, i) => i + 1);

    return { monthLabel, sessionsCount, targetSessions, consistencyPct, totalDurationMs, totalSets, totalVolume, totalPRs, avgDurationMin, weightPRs, repPRs, biggest, dayStats, strengthRows, weekData, trainedDaysSet, calendarDays };
  }, [log]);

  const hasAnyData = data.totalSets > 0;

  return (
    <div className="space-y-6 pb-4">
      <div>
        <div className="display-font text-2xl uppercase tracking-wide flex items-center gap-2">
          <CalendarIcon size={20} className="text-orange-500" /> Monthly Report
        </div>
        <div className="text-stone-500 text-sm">{data.monthLabel}</div>
      </div>

      {!hasAnyData && <div className="text-stone-600 text-sm bg-stone-900 border border-stone-800 rounded-xl p-4">No sets logged this month yet - your report fills in as you train.</div>}

      <Section title="1. Monthly Overview">
        <TableRows
          rows={[
            ["Workouts Completed", `${data.sessionsCount} / ${data.targetSessions}`],
            ["Consistency", `${data.consistencyPct}%`],
            ["Total Training Time", formatDuration(data.totalDurationMs)],
            ["Total Sets", `${data.totalSets}`],
            ["Total Volume", `${data.totalVolume.toLocaleString()} kg`],
            ["New PRs", `${data.totalPRs}`],
            ["Avg. Workout Duration", `${data.avgDurationMin} min`],
          ]}
        />
        <div className="text-[11px] text-stone-600 mt-1">Target pace assumes ~5 sessions/week. Volume and PRs exclude warm-up sets.</div>
      </Section>

      <Section title="2. Day-wise Performance">
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr className="text-stone-500 text-xs uppercase">
                <th className="text-left px-1 py-1.5">Workout</th>
                <th className="text-right px-1 py-1.5">Sessions</th>
                <th className="text-right px-1 py-1.5">Sets</th>
                <th className="text-right px-1 py-1.5">Volume</th>
                <th className="text-right px-1 py-1.5">PRs</th>
              </tr>
            </thead>
            <tbody>
              {data.dayStats.map((d) => (
                <tr key={d.day} className="border-t border-stone-900">
                  <td className="px-1 py-2 text-stone-200">{d.day.replace("Day", "Day ")} &ndash; {d.label}</td>
                  <td className="px-1 py-2 text-right mono-font">{d.sessions}</td>
                  <td className="px-1 py-2 text-right mono-font">{d.sets}</td>
                  <td className="px-1 py-2 text-right mono-font">{d.volume.toLocaleString()} kg</td>
                  <td className="px-1 py-2 text-right mono-font text-amber-400">{d.prs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="3. Strength Progress" subtitle="Beginning vs. end of month for your most-trained lifts">
        {data.strengthRows.length === 0 ? (
          <div className="text-stone-600 text-sm">Not enough data yet this month.</div>
        ) : (
          <div className="space-y-2">
            {data.strengthRows.map((r) => (
              <div key={r.name} className="bg-stone-900 border border-stone-800 rounded-lg p-3">
                <div className="text-sm font-medium mb-1">{r.name}</div>
                {r.single ? (
                  <div className="text-xs text-stone-500">Only one session logged so far - {r.start}</div>
                ) : (
                  <div className="flex items-center justify-between text-xs mono-font">
                    <span className="text-stone-400">{r.start}</span>
                    <ChevronRight size={12} className="text-stone-600" />
                    <span className="text-stone-100">{r.end}</span>
                    <span className={`ml-2 font-semibold ${r.delta > 0 ? "text-emerald-400" : r.delta < 0 ? "text-rose-400" : "text-stone-500"}`}>
                      {r.delta > 0 ? "+" : ""}{r.delta} kg
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="4. PR Summary">
        <div className="bg-gradient-to-br from-amber-900/30 to-stone-900 border border-amber-900/40 rounded-xl p-4 mb-3">
          <div className="flex items-center gap-2 text-amber-400 font-semibold">
            <Trophy size={16} /> {data.totalPRs} PRs achieved this month
          </div>
          {data.biggest && (
            <div className="text-stone-300 text-sm mt-1">
              Biggest improvement: {data.biggest.name} +{Math.round((data.biggest.to - data.biggest.from) * 10) / 10} kg
            </div>
          )}
        </div>
        <TableRows
          rows={[
            ["New Weight PRs", `${data.weightPRs.length}`],
            ["New Rep PRs", `${data.repPRs.length}`],
            ["Best-performing exercise", data.biggest ? data.biggest.name : "-"],
          ]}
        />
      </Section>

      <Section title="5. Volume Trend" subtitle="Total training volume by week this month">
        {data.weekData.every((w) => w.volume === 0) ? (
          <div className="text-stone-600 text-sm">Not enough data yet.</div>
        ) : (
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.weekData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: "#78716c", fontSize: 11 }} axisLine={{ stroke: "#292524" }} tickLine={false} />
                <YAxis tick={{ fill: "#78716c", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1c1917", border: "1px solid #292524", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "#e7e5e4" }} />
                <Bar dataKey="volume" fill="#c2410c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Section>

      <Section title="6. Workout Consistency">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {data.calendarDays.map((d) => {
            const trained = data.trainedDaysSet.has(d);
            return (
              <div key={d} className={`w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-medium ${trained ? "bg-emerald-700 text-emerald-50" : "bg-stone-900 border border-stone-800 text-stone-600"}`} title={`Day ${d}`}>
                {trained ? <Check size={12} /> : d}
              </div>
            );
          })}
        </div>
        <div className="text-sm text-stone-300">
          <span className="mono-font font-semibold">{data.sessionsCount}/{data.targetSessions}</span> workouts completed &mdash; <span className="text-orange-400 font-semibold">{data.consistencyPct}% consistency</span>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <div>
      <div className="text-stone-200 font-semibold text-sm mb-1">{title}</div>
      {subtitle && <div className="text-stone-500 text-xs mb-2">{subtitle}</div>}
      {!subtitle && <div className="mb-2" />}
      {children}
    </div>
  );
}

function PhysiqueView() {
  const [photos, setPhotos] = useState([]);
  const [ready, setReady] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const data = await readStore(PHOTOS_KEY, []);
      setPhotos(data);
      setReady(true);
    })();
  }, []);

  const sorted = [...photos].sort((a, b) => new Date(b.date) - new Date(a.date));
  const current = sorted[0] || null;
  const previous = sorted[1] || null;
  const hasThisWeek = current && Date.now() - new Date(current.date).getTime() <= 7 * 24 * 3600 * 1000;

  const runAssessment = async (prevEntry, currEntry, baseList) => {
    setAnalyzing(true);
    setError("");
    try {
      const text = await getPhysiqueAssessment(prevEntry.image, currEntry.image);
      const updated = baseList.map((p) => (p.id === currEntry.id ? { ...p, assessment: text } : p));
      await window.storage.set(PHOTOS_KEY, JSON.stringify(updated), false);
      setPhotos(updated);
    } catch (e) {
      console.error("assessment failed", e);
      setError("Could not generate assessment - you can retry below.");
    }
    setAnalyzing(false);
  };

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const dataUrl = await resizeImage(file);
      const before = await readStore(PHOTOS_KEY, []);
      const entry = { id: genId(), date: new Date().toISOString(), image: dataUrl, assessment: null };
      const nextList = [...before, entry];
      await window.storage.set(PHOTOS_KEY, JSON.stringify(nextList), false);
      setPhotos(nextList);
      setUploading(false);

      const prevEntry = [...before].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
      if (prevEntry) await runAssessment(prevEntry, entry, nextList);
    } catch (e) {
      console.error("upload failed", e);
      setError("Could not process that photo - try a different image.");
      setUploading(false);
    }
  };

  const retry = () => {
    if (current && previous) runAssessment(previous, current, photos);
  };

  if (!ready) {
    return <div className="text-stone-500 text-sm font-mono">loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="display-font text-2xl uppercase tracking-wide flex items-center gap-2">
          <Camera size={20} className="text-orange-500" /> Physique Check
        </div>
        <div className="text-stone-500 text-sm">Private to you - photos are never shared</div>
      </div>

      <label className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 font-medium cursor-pointer ${uploading ? "bg-stone-800 text-stone-500" : "bg-orange-800 text-white"}`}>
        <Camera size={16} /> {uploading ? "Processing..." : "Upload Check-in Photo"}
        <input type="file" accept="image/*" capture="environment" className="hidden" disabled={uploading} onChange={(e) => handleFile(e.target.files?.[0])} />
      </label>

      {error && <div className="text-rose-400 text-xs">{error}</div>}

      {!hasThisWeek && (
        <div className="text-stone-500 text-sm bg-stone-900 border border-stone-800 rounded-xl p-4">No physique check-in uploaded this week.</div>
      )}

      {current && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-stone-500 text-xs uppercase mb-1 text-center">Previous</div>
              {previous ? (
                <img src={previous.image} alt="Previous check-in" className="w-full rounded-lg border border-stone-800 object-cover aspect-[3/4]" />
              ) : (
                <div className="w-full aspect-[3/4] rounded-lg border border-dashed border-stone-800 flex items-center justify-center text-stone-600 text-xs text-center px-2">No earlier photo yet</div>
              )}
              {previous && <div className="text-stone-600 text-[10px] text-center mt-1">{new Date(previous.date).toLocaleDateString()}</div>}
            </div>
            <div>
              <div className="text-stone-500 text-xs uppercase mb-1 text-center">Current</div>
              <img src={current.image} alt="Current check-in" className="w-full rounded-lg border border-stone-800 object-cover aspect-[3/4]" />
              <div className="text-stone-600 text-[10px] text-center mt-1">{new Date(current.date).toLocaleDateString()}</div>
            </div>
          </div>

          {previous ? (
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
              <div className="text-orange-500 text-xs uppercase tracking-wide mb-1.5 flex items-center gap-1">
                <Sparkles size={12} /> Physique Trend
              </div>
              {analyzing ? (
                <div className="text-stone-500 text-sm">Analyzing your check-in...</div>
              ) : current.assessment ? (
                <div className="text-stone-200 text-sm leading-relaxed">{current.assessment}</div>
              ) : (
                <button onClick={retry} className="text-sky-400 text-sm flex items-center gap-1">
                  <RefreshCw size={12} /> Generate assessment
                </button>
              )}
            </div>
          ) : (
            <div className="text-stone-600 text-xs text-center">Baseline saved. Your next check-in will include a trend comparison.</div>
          )}
        </div>
      )}
    </div>
  );
}

function TableRows({ rows }) {
  return (
    <div className="border-t border-stone-900">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-center justify-between py-2 border-b border-stone-900 text-sm">
          <span className="text-stone-400">{label}</span>
          <span className="mono-font text-stone-100 font-medium">{value}</span>
        </div>
      ))}
    </div>
  );
}
