(() => {
  "use strict";

  const DATA = window.DP700_DATA;
  const DUMP_DATA = window.DP700_DUMP || { meta: { questionCount: 0, correctSelections: 0, correctedSelections: 0 }, sources: [], questions: [] };
  const DUMP_INTERACTION_DATA = window.DP700_DUMP_INTERACTIONS || { meta: { typeCounts: {}, unscoredQuestions: [] }, questions: {} };
  if (!DATA || !Array.isArray(DATA.questions)) {
    document.getElementById("app").innerHTML = '<div class="empty-state"><h1>The original question bank could not be loaded.</h1><p>Make sure the data folder is next to index.html.</p></div>';
    return;
  }

  const QUESTIONS = DATA.questions;
  const VISUAL_LEARNING = window.DP700_VISUAL_LEARNING || { sources: [], lessons: [] };
  const SOURCES = Object.fromEntries([...DATA.sources, ...(VISUAL_LEARNING.sources || [])].map(source => [source.id, source]));
  const DUMP_SOURCES = Object.fromEntries(DUMP_DATA.sources.map(source => [source.id, source]));
  const DUMP_QUESTIONS = DUMP_DATA.questions;
  const STORAGE_KEY = "dp700-prep-state-v2";
  const LETTERS = ["A", "B", "C", "D"];
  const app = document.getElementById("app");

  const BASE_LESSONS = [
    {
      id: "access", title: "Fabric access and security", subtitle: "Workspace roles, item sharing, RLS, CLS, and OneLake security", minutes: 18, category: "Implement & Manage", sourceIds: ["S2", "S3", "S4", "S23"],
      summary: "Separate workspace access, item access, and data access. No single permission layer replaces the others.",
      points: ["Use Viewer for consumption, Contributor for authoring, and Member/Admin only for broader management.", "Share a single item when the user must not discover the rest of the workspace.", "RLS filters rows, CLS blocks columns, and dynamic data masking changes result display rather than stored values.", "Review every access path because the most permissive effective OneLake access can win."],
      trap: "Masking is not a complete authorization boundary, and a workspace role alone does not describe every data access path."
    },
    {
      id: "governance", title: "Governance, classification, and audit", subtitle: "Sensitivity labels, endorsement, and Microsoft Purview audit", minutes: 14, category: "Implement & Manage", sourceIds: ["S20", "S21", "S22"],
      summary: "Use classification for protection, endorsement for trust, and audit logs to determine who performed an action.",
      points: ["Sensitivity labels classify and protect supported downstream content.", "Certified represents formal organizational review; Promoted is a lighter readiness signal.", "Use Microsoft Purview audit to investigate user and compliance activity."],
      trap: "Certified does not protect data, and Confidential is a sensitivity classification rather than an endorsement."
    },
    {
      id: "cicd", title: "Git and deployment pipelines", subtitle: "Version control, environments, and promotion between stages", minutes: 15, category: "Implement & Manage", sourceIds: ["S5", "S26"],
      summary: "Git manages source history and branches. Deployment pipelines promote supported Fabric items from development to test and production.",
      points: ["Git integration synchronizes supported items with a repository.", "Deployment pipelines move supported content through lifecycle stages.", "Combine code review with controlled deployment between environments."],
      trap: "Git integration is not deployment, and deployment pipelines are not source control."
    },
    {
      id: "workspace-spark", title: "Workspace and Spark settings", subtitle: "Environments, starter pools, custom pools, and resource profiles", minutes: 15, category: "Implement & Manage", sourceIds: ["S6", "S28"],
      summary: "An Environment centralizes runtime settings and libraries, while a pool defines Spark compute and session startup behavior.",
      points: ["Starter pools reduce session startup time for quick experimentation.", "Custom pools provide greater control over compute size and configuration.", "Resource profiles help tune different workloads instead of forcing one configuration on every job."],
      trap: "Selecting a larger pool does not replace correct Spark code and partition design."
    },
    {
      id: "orchestration", title: "Pipelines and Dataflow Gen2", subtitle: "Choose a pipeline, dataflow, notebook, or Copy Job", minutes: 20, category: "Ingest & Transform", sourceIds: ["S27", "S29", "S37", "S38"],
      summary: "Choose by workload: multi-step orchestration, visual transformation, custom Spark logic, or simplified recurring copy.",
      points: ["Data pipelines coordinate activities, dependencies, and triggers.", "Dataflow Gen2 provides low-code transformation; Fast Copy accelerates supported ingestion paths.", "Notebooks suit Spark and custom code.", "Copy Job simplifies repeated full or incremental copy."],
      trap: "Choose from the required operation—not from the most familiar product name."
    },
    {
      id: "incremental", title: "Incremental loading", subtitle: "Watermarks, batch boundaries, and safe restart", minutes: 18, category: "Ingest & Transform", sourceIds: ["S9"],
      summary: "Read old and new watermarks, copy the correct open/closed range, and update the stored watermark only after a successful copy.",
      points: ["A reliable, increasing LastModified value is a common watermark.", "A typical range is watermark > W_old AND watermark <= W_new.", "Do not update W_old before the incremental copy succeeds."],
      trap: "Inclusive bounds on both sides can duplicate rows; an early watermark update can lose data."
    },
    {
      id: "onelake", title: "OneLake shortcuts and mirroring", subtitle: "Zero-copy access, managed replication, and external data", minutes: 19, category: "Ingest & Transform", sourceIds: ["S7", "S8", "S24", "S34"],
      summary: "A shortcut references data without copying it. Mirroring replicates a supported database into OneLake through a managed near-real-time experience.",
      points: ["Deleting a shortcut does not delete its target.", "Database mirroring copies data; metadata mirroring does not mean all data is copied.", "Query acceleration can improve supported KQL queries over shortcuts.", "Check for moved, renamed, or deleted targets when a shortcut stops working."],
      trap: "A shortcut is not a copy, and mirroring is more than a metadata reference."
    },
    {
      id: "medallion-delta", title: "Medallion and Delta Lake", subtitle: "Bronze, Silver, Gold, MERGE, and ACID", minutes: 22, category: "Ingest & Transform", sourceIds: ["S10", "S11", "S17"],
      summary: "Bronze preserves raw data, Silver cleans and standardizes it, and Gold serves consumption-ready models. Delta adds transactions and table history over Parquet.",
      points: ["Keep the original payload in Bronze for replay.", "Deduplicate, validate, and standardize in Silver.", "Design Gold for analytical consumption.", "MERGE performs upsert, OPTIMIZE compacts files, and VACUUM removes obsolete files."],
      trap: "VACUUM can remove files required for time travel; review retention first."
    },
    {
      id: "dimensional", title: "Dimensional modeling", subtitle: "Facts, dimensions, surrogate keys, and SCD", minutes: 18, category: "Ingest & Transform", sourceIds: ["S12", "S30"],
      summary: "A fact table stores measures at a declared grain; dimensions provide descriptive context. Surrogate keys isolate the model from source-key changes.",
      points: ["Declare fact grain before designing measures and relationships.", "SCD Type 1 overwrites history; Type 2 inserts a new version row.", "Validate business meaning before replacing missing values with zero."],
      trap: "A fact table is not merely a large table—it requires a clear grain and measures."
    },
    {
      id: "eventstreams", title: "Eventstreams and Real-Time hub", subtitle: "Real-time ingestion, transformation, and routing", minutes: 22, category: "Ingest & Transform", sourceIds: ["S13", "S14", "S35"],
      summary: "Eventstream ingests, transforms, and routes events. Select Filter, Manage fields, Expand, Aggregate, Join, and branches according to the scenario.",
      points: ["Filter removes events, Manage fields projects or renames fields, and Expand flattens nested data.", "Aggregate plus a window calculates time-based measures; Join enriches a stream.", "Route different branches to different destinations.", "Real-Time hub provides discovery and connection to available streams."],
      trap: "Do not use Aggregate when the requirement is only projection or field renaming."
    },
    {
      id: "eventhouse", title: "Eventhouse and KQL Database", subtitle: "OneLake availability, update policies, and materialized views", minutes: 20, category: "Ingest & Transform", sourceIds: ["S25", "S34", "S36"],
      summary: "An Eventhouse can contain multiple KQL databases. Use update policies for ingestion-time transforms and materialized views for continuously maintained aggregates.",
      points: ["KQL Database suits high-volume time-series analytics.", "OneLake availability exposes Eventhouse data through supported OneLake paths.", "Set retention and cache policies according to required history and the frequently queried hot window."],
      trap: "Retention controls how long data remains; cache controls fast access to the hot portion."
    },
    {
      id: "streaming", title: "Spark Structured Streaming", subtitle: "Checkpoints, event time, watermarks, and windows", minutes: 25, category: "Ingest & Transform", sourceIds: ["S14", "S31", "S32"],
      summary: "A checkpoint enables recovery, a watermark limits late-event state, and event time means when the event occurred—not when it was processed.",
      points: ["Use a unique checkpoint path for each query.", "Tumbling windows do not overlap; hopping windows can overlap; session windows follow activity separated by a gap.", "More late-arrival tolerance retains more state and can increase latency.", "Final window results depend on the watermark passing the window and lateness threshold."],
      trap: "Processing time differs from event time, and sharing a checkpoint across queries is unsafe."
    },
    {
      id: "monitoring", title: "Monitoring and troubleshooting", subtitle: "Monitoring hub, run details, Spark UI, and Dataflow logs", minutes: 22, category: "Monitor & Optimize", sourceIds: ["S15", "S16", "S37", "S38"],
      summary: "Start with the correct monitoring surface, then narrow the investigation to the run, activity, logs, metrics, source, or destination.",
      points: ["Monitoring hub provides a centralized run view.", "Pipeline run details expose the failed activity and error message.", "Dataflow Gen2 exposes recent runs and downloadable detailed logs.", "Spark UI reveals stages, tasks, skew, shuffle, and executor behavior."],
      trap: "Do not rerun an entire pipeline before understanding the failure point."
    },
    {
      id: "spark-opt", title: "Spark optimization", subtitle: "Skew, OOM, repartition, cache, and resource profiles", minutes: 22, category: "Monitor & Optimize", sourceIds: ["S16", "S28"],
      summary: "Inspect partition sizes and task distribution. Fix the data or execution plan before scaling resources blindly.",
      points: ["One much slower task often indicates data skew.", "Executor OOM can result from a huge partition or skew.", "repartition(N) shuffles data to change partition count and distribution.", "Cache only reused DataFrames, then unpersist them."],
      trap: "collect() can overload the driver even when executors are powerful."
    },
    {
      id: "delta-opt", title: "Lakehouse optimization and V-Order", subtitle: "OPTIMIZE, VACUUM, small files, and read layout", minutes: 17, category: "Monitor & Optimize", sourceIds: ["S17", "S18"],
      summary: "OPTIMIZE addresses small files, VACUUM removes obsolete files, and V-Order improves file layout for Fabric read workloads.",
      points: ["Schedule maintenance according to write and read patterns.", "V-Order can improve Fabric-engine reads but adds write cost.", "Choose a workload profile that matches write-heavy or read-heavy behavior."],
      trap: "OPTIMIZE reorganizes active data; VACUUM deletes obsolete files."
    },
    {
      id: "warehouse-opt", title: "Fabric Warehouse optimization", subtitle: "Statistics, query shape, bulk load, and cold cache", minutes: 20, category: "Monitor & Optimize", sourceIds: ["S19", "S33"],
      summary: "Start with the query plan, statistics, and bytes read, then improve load patterns and interpret first-run overhead correctly.",
      points: ["Statistics help the optimizer estimate cardinality.", "Project required columns and filter rows early.", "Batch small writes or use bulk loading such as COPY INTO.", "The first run can be slower because of cold cache or initialization."],
      trap: "Comparing a cold first run with a warm repeat can produce a false conclusion."
    }
  ];

  const LESSONS = Array.isArray(VISUAL_LEARNING.lessons) && VISUAL_LEARNING.lessons.length
    ? VISUAL_LEARNING.lessons
    : BASE_LESSONS;

  const CHEAT_SECTIONS = [
    { title: "Choose an ingestion tool", rows: [["Pipeline", "Activities, dependencies, and triggers"], ["Dataflow Gen2", "Visual low-code transformation"], ["Notebook", "Spark and custom code"], ["Copy Job", "Simplified recurring copy"], ["Eventstream", "Real-time events and routing"]] },
    { title: "Security layers", rows: [["Workspace role", "Broad workspace access"], ["Item permission", "Access to one item"], ["RLS", "Filter rows"], ["CLS", "Block columns"], ["Masking", "Change result display"]] },
    { title: "Medallion", rows: [["Bronze", "Raw as received"], ["Silver", "Cleaned, standardized, deduplicated"], ["Gold", "Consumption-ready analytics"]] },
    { title: "Streaming windows", rows: [["Tumbling", "Fixed and non-overlapping"], ["Hopping", "Fixed and possibly overlapping"], ["Session", "Activity separated by an inactivity gap"], ["Watermark", "Late-data state boundary"]] },
    { title: "Delta maintenance", rows: [["MERGE", "Upsert"], ["OPTIMIZE", "Compact small files"], ["VACUUM", "Delete obsolete files"], ["V-Order", "Read-optimized file layout"]] },
    { title: "Governance", rows: [["Sensitivity label", "Classification and protection"], ["Promoted", "Ready to share"], ["Certified", "Formal approval"], ["Purview audit", "Who did what and when"]] },
    { title: "Streaming recovery", rows: [["Checkpoint", "Offsets, commits, and state"], ["Unique path", "One path per query"], ["Event time", "When the event occurred"], ["Processing time", "When the system handled it"]] },
    { title: "Performance signals", rows: [["Straggler task", "Often data skew"], ["Executor OOM", "Large partition/skew"], ["Driver OOM", "Large collect/result"], ["Small files", "OPTIMIZE or batched writes"]] }
  ];

  const STUDY_PLAN = [
    { day: "Day 1", title: "Solution management and governance", tasks: [["p1-lessons", "Study security, governance, and Git lessons"], ["p1-quiz", "Complete Batch 1 (25 questions)"], ["p1-notes", "Write the RLS/CLS/Masking and Git/Deployment differences"]] },
    { day: "Day 2", title: "Ingestion and architecture", tasks: [["p2-lessons", "Study orchestration, OneLake, and incremental load"], ["p2-quiz", "Complete Batch 2 (25 questions)"], ["p2-review", "Review watermark, medallion, and Delta"]] },
    { day: "Day 3", title: "Real-Time and streaming", tasks: [["p3-lessons", "Study Eventstream, Eventhouse, and Structured Streaming"], ["p3-quiz", "Complete Batch 3 (25 questions)"], ["p3-flash", "Review windows and checkpoints with flashcards"]] },
    { day: "Day 4", title: "Monitoring and optimization", tasks: [["p4-lessons", "Study monitoring and Spark/Delta/Warehouse optimization"], ["p4-quiz", "Complete Batch 4 (25 questions)"], ["p4-review", "Run Smart Review for every current error"]] },
    { day: "Day 5", title: "Simulation and final review", tasks: [["p5-exam", "Take a 40-question, 45-minute simulation"], ["p5-fix", "Review every missed question from its source"], ["p5-cheat", "Print the cheat sheet and take one final Quick Quiz"]] }
  ];

  const COMPARISON_ROWS = [
    ["Data pipeline", "Multi-step orchestration", "Activities + dependencies + triggers", "You need orchestration and run monitoring"],
    ["Dataflow Gen2", "Low-code transformation", "Power Query + destinations", "The team needs maintainable visual cleaning and joins"],
    ["Notebook", "Large-scale coded transform", "Spark / Python / SQL", "You need custom logic, scale, or streaming"],
    ["Copy Job", "Simplified copy", "Full or incremental copy", "You need recurring movement without a complex pipeline"],
    ["Eventstream", "Real-time stream", "Ingest + transform + route", "Events continuously arrive at real-time destinations"],
    ["OneLake shortcut", "Zero-copy access", "Reference to a target", "You need data in place without duplication"],
    ["Mirroring", "Managed database replication", "Replication to OneLake", "You need near-real-time analytics from a supported source"],
    ["Lakehouse", "Spark + files + Delta", "Data-lake flexibility", "Engineering and semi-structured data are central"],
    ["Warehouse", "Analytical T-SQL", "Relational tables and modeling", "You need BI, star schemas, and SQL"],
    ["Eventhouse", "KQL and time series", "High-volume event analytics", "You analyze telemetry and logs"]
  ];

  const DECISIONS = {
    orchestrate: { label: "Coordinate a multi-step process", answer: "Data pipeline", why: "It manages activities, dependencies, triggers, and monitoring in one place.", alternatives: "Run Dataflow inside the pipeline for visual transformation, or Notebook for custom code." },
    lowcode: { label: "Build a visual low-code transform", answer: "Dataflow Gen2", why: "Power Query supports maintainable cleaning, joins, and destination mapping.", alternatives: "Enable Fast Copy for supported paths when ingestion throughput is the bottleneck." },
    batchcode: { label: "Transform large data with Spark code", answer: "Fabric notebook", why: "It provides Spark, Python/SQL, and full control over transformation and partitioning.", alternatives: "Select an Environment and resource profile, then inspect Spark UI." },
    realtime: { label: "Capture and transform real-time events", answer: "Eventstream", why: "It combines ingestion, transformation, and routing without separate infrastructure.", alternatives: "Use Eventhouse/KQL for time-series analysis or Structured Streaming for custom logic." },
    nocopy: { label: "Use existing data without copying it", answer: "OneLake shortcut", why: "It creates a reference to the target while data remains in its original location.", alternatives: "If you need managed replication from a supported database, consider Mirroring." },
    sqlbi: { label: "Build a star schema for T-SQL and BI", answer: "Fabric Warehouse", why: "It provides a relational analytical experience suited to star schemas and SQL tools.", alternatives: "Lakehouse is stronger when Spark and file flexibility are the priority." },
    telemetry: { label: "Analyze high-volume telemetry and logs", answer: "Eventhouse + KQL Database", why: "KQL is optimized for fast exploratory time-series analysis.", alternatives: "Tune retention and cache, and use materialized views or update policies when needed." }
  };

  const defaultState = () => ({
    version: 2,
    theme: "dark",
    answers: {},
    bookmarks: [],
    completedLessons: [],
    lessonChecks: {},
    planCompleted: [],
    sessions: [],
    activeSession: null,
    dumpProgress: {},
    activeDumpSession: null,
    dumpAnswers: {},
    lastRoute: "home",
    firstVisit: new Date().toISOString(),
    lastActivity: null,
    streak: 0
  });

  let state = loadState();
  let activeTimer = null;
  let studyFilter = "All";
  let studySearch = "";
  let flashIndex = 0;
  let flashFlipped = false;
  let decisionChoice = "orchestrate";
  let dumpSearch = "";
  let dumpBatch = "all";
  let dumpStatus = "all";
  let dumpProgressFilter = "all";
  let dumpPage = 1;
  let dumpArmedValue = "";

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return { ...defaultState(), ...saved, answers: saved?.answers || {}, bookmarks: saved?.bookmarks || [], completedLessons: saved?.completedLessons || [], lessonChecks: saved?.lessonChecks || {}, planCompleted: saved?.planCompleted || [], sessions: saved?.sessions || [], dumpProgress: saved?.dumpProgress || {}, dumpAnswers: saved?.dumpAnswers || {}, activeDumpSession: saved?.activeDumpSession || null };
    } catch {
      return defaultState();
    }
  }

  function saveState() {
    state.lastActivity = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    updateGlobalProgress();
  }

  function escapeHtml(value = "") {
    return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
  }

  function shuffle(items) {
    const array = [...items];
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function getQuestion(id) { return QUESTIONS.find(q => q.n === Number(id)); }
  function percent(part, total) { return total ? Math.round((part / total) * 100) : 0; }
  function unique(values) { return [...new Set(values)]; }
  function formatDate(value) { return value ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—"; }
  function formatDuration(seconds) {
    const safe = Math.max(0, Math.floor(seconds));
    return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
  }

  function sourceLinks(ids) {
    return ids.map(id => SOURCES[id]).filter(Boolean).map(source => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.id)} · ${escapeHtml(source.title)} ↗</a>`).join("");
  }

  function dumpSourceLinks(ids) {
    return ids.map(id => DUMP_SOURCES[id]).filter(source => source?.url).map(source => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.id)} · ${escapeHtml(source.title)} ↗</a>`).join("");
  }

  function dumpStats() {
    const values = Object.values(state.dumpProgress);
    const answers = Object.values(state.dumpAnswers || {}).filter(answer => answer?.checked);
    return {
      mastered: values.filter(value => value === "mastered").length,
      review: values.filter(value => value === "review").length,
      tracked: values.filter(value => ["mastered", "review"].includes(value)).length,
      attempted: answers.length,
      correct: answers.filter(answer => answer.correct === true).length,
      incorrect: answers.filter(answer => answer.correct === false).length,
      unscored: answers.filter(answer => answer.correct === null).length
    };
  }

  function getDumpInteraction(question) {
    return DUMP_INTERACTION_DATA.questions?.[question.n] || { type: "single", selectN: 1, correctLabels: [] };
  }

  function defaultDumpAnswer(interaction) {
    if (["single", "multi"].includes(interaction.type)) return { selected: [], checked: false, correct: null };
    if (["dropdown", "dragdrop"].includes(interaction.type)) return { values: new Array(interaction.slots?.length || 0).fill(""), checked: false, correct: null };
    if (interaction.type === "yesno") return { values: new Array(interaction.statements?.length || 0).fill(""), checked: false, correct: null };
    return { checked: false, correct: null };
  }

  function dumpAnswerStore() {
    if (currentRoute() === "dump-drill" && state.activeDumpSession) {
      state.activeDumpSession.answers ||= {};
      return state.activeDumpSession.answers;
    }
    return state.dumpAnswers;
  }

  function ensureDumpAnswer(question) {
    const interaction = getDumpInteraction(question);
    const store = dumpAnswerStore();
    const answer = store[question.n];
    if (!answer || (answer.values && answer.values.length !== (interaction.slots?.length || interaction.statements?.length || 0))) {
      store[question.n] = defaultDumpAnswer(interaction);
    }
    return store[question.n];
  }

  function peekDumpAnswer(question) {
    return dumpAnswerStore()[question.n] || defaultDumpAnswer(getDumpInteraction(question));
  }

  function dumpAnswerComplete(question, answer = peekDumpAnswer(question)) {
    const interaction = getDumpInteraction(question);
    if (interaction.type === "single") return answer.selected?.length === 1;
    if (interaction.type === "multi") return answer.selected?.length === Number(interaction.selectN || interaction.correctLabels?.length || 2);
    if (["dropdown", "dragdrop", "yesno"].includes(interaction.type)) return Boolean(answer.values?.length) && answer.values.every(Boolean);
    return false;
  }

  function dumpAnswerCorrect(question, answer = peekDumpAnswer(question)) {
    const interaction = getDumpInteraction(question);
    if (interaction.unscored) return null;
    if (["single", "multi"].includes(interaction.type)) {
      const actual = [...(answer.selected || [])].sort().join(",");
      const expected = [...(interaction.correctLabels || [])].sort().join(",");
      return Boolean(expected) && actual === expected;
    }
    if (["dropdown", "dragdrop"].includes(interaction.type)) return interaction.slots.every((item, index) => answer.values[index] === item.correct);
    if (interaction.type === "yesno") return interaction.correct.every((value, index) => answer.values[index] === value);
    return false;
  }

  function dumpTypeLabel(interaction) {
    return ({ single: "Single choice", multi: `Multiple choice · Select ${interaction.selectN}`, dragdrop: "Drag & drop", dropdown: "Hotspot / dropdown", yesno: "Hotspot · Yes/No" })[interaction.type] || "Interactive";
  }

  function dumpDisplayPrompt(question, interaction = getDumpInteraction(question)) {
    let text = String(question.question || "")
      .replace(/^DRAG DROP \(Drag and Drop is not supported\)\s*/i, "")
      .replace(/^HOTSPOT \(Drag and Drop is not supported\)\s*/i, "")
      .replace(/^HOTSPOT\s*/i, "");
    if (["single", "multi"].includes(interaction.type)) {
      const lines = text.split("\n");
      const firstOption = lines.findIndex(line => /^\s*A\.\s+/.test(line));
      if (firstOption >= 0) text = lines.slice(0, firstOption).join("\n");
    } else {
      text = text.split("\n").filter(line => !/^\s*(?:Select and Place:|Hot Area:|A\. See Explanation section for answer\.)\s*$/i.test(line)).join("\n");
    }
    return text.replace(/\n{3,}/g, "\n\n").trim();
  }

  function dumpOptions(question, interaction) {
    return interaction.optionsOverride || question.options || [];
  }

  function renderDumpAssets(interaction) {
    if (!interaction.assets?.length) return "";
    return `<section class="dump-exhibits" aria-label="Question exhibit"><div class="dump-exhibits__title">Question exhibit${interaction.assets.length > 1 ? "s" : ""}</div><div class="dump-exhibit-grid">${interaction.assets.map((src, index) => `<button class="dump-exhibit-button" type="button" data-action="open-dump-image" data-src="${escapeHtml(src)}" aria-label="Open question exhibit ${index + 1}"><img src="${escapeHtml(src)}" alt="Question exhibit ${index + 1}" loading="lazy"></button>`).join("")}</div></section>`;
  }

  function renderDumpFeedback(question, answer, interaction) {
    if (!answer.checked) return "";
    const unscored = answer.correct === null;
    const title = unscored ? "Review required — source option set is invalid or incomplete" : answer.correct ? "✓ Correct" : "✕ Incorrect — review the validated answer";
    const className = unscored ? "unscored" : answer.correct ? "correct" : "wrong";
    return `<div class="dump-feedback ${className}"><h3>${title}</h3><p><strong>Correct validated answer:</strong> ${escapeHtml(question.correctAnswer)}</p><p>${escapeHtml(question.explanation)}</p>${question.notes?.length ? `<div class="dump-note"><strong>Current-scope note:</strong> ${question.notes.map(escapeHtml).join(" ")}</div>` : ""}<div class="source-links">${dumpSourceLinks(question.refs)}</div></div>`;
  }

  function renderDumpInteraction(question, context = "library") {
    const interaction = getDumpInteraction(question);
    const answer = peekDumpAnswer(question);
    const locked = answer.checked;
    let controls = "";

    if (["single", "multi"].includes(interaction.type)) {
      controls = `<div class="dump-choice-list" role="group" aria-label="Answer choices">${dumpOptions(question, interaction).map(option => {
        const selected = answer.selected?.includes(option.label);
        const expected = interaction.correctLabels?.includes(option.label);
        let classes = "dump-choice" + (selected ? " selected" : "");
        if (locked && !interaction.unscored) {
          if (expected) classes += " correct";
          if (selected && !expected) classes += " wrong";
        }
        return `<button class="${classes}" type="button" data-action="dump-choice" data-id="${question.n}" data-label="${option.label}" ${locked ? "disabled" : ""}><span>${option.label}</span><strong>${escapeHtml(option.text)}</strong></button>`;
      }).join("")}</div>`;
    }

    if (["dropdown", "dragdrop"].includes(interaction.type)) {
      const pool = unique(interaction.slots.flatMap(item => item.choices));
      const chips = interaction.type === "dragdrop" ? `<div class="dump-chip-pool" aria-label="Draggable values">${pool.map(value => `<button class="dump-chip ${dumpArmedValue === value ? "armed" : ""}" type="button" draggable="true" data-action="dump-chip" data-value="${encodeURIComponent(value)}">${escapeHtml(value)}</button>`).join("")}</div><p class="dump-interaction-hint">Drag a value to a target, or choose it from the accessible dropdown.</p>` : "";
      controls = `${chips}<div class="dump-slot-list">${interaction.slots.map((item, index) => {
        const value = answer.values?.[index] || "";
        const correct = locked && value === item.correct;
        const wrong = locked && value !== item.correct;
        return `<div class="dump-slot ${correct ? "correct" : wrong ? "wrong" : ""}" data-action="dump-place-chip" data-id="${question.n}" data-slot="${index}"><label for="dump-slot-${context}-${question.n}-${index}"><span>${escapeHtml(item.label)}</span><select id="dump-slot-${context}-${question.n}-${index}" data-dump-slot data-id="${question.n}" data-slot="${index}" ${locked ? "disabled" : ""}><option value="">Choose a value…</option>${item.choices.map(choice => `<option value="${escapeHtml(choice)}" ${choice === value ? "selected" : ""}>${escapeHtml(choice)}</option>`).join("")}</select></label>${locked ? `<small>${correct ? "Correct" : `Correct: ${escapeHtml(item.correct)}`}</small>` : ""}</div>`;
      }).join("")}</div>`;
    }

    if (interaction.type === "yesno") {
      controls = `<div class="dump-yn-list">${interaction.statements.map((statement, index) => {
        const value = answer.values?.[index] || "";
        return `<div class="dump-yn-row"><p>${escapeHtml(statement)}</p><div>${["Yes", "No"].map(choice => {
          let classes = "dump-yn" + (value === choice ? " selected" : "");
          if (locked && interaction.correct[index] === choice) classes += " correct";
          if (locked && value === choice && interaction.correct[index] !== choice) classes += " wrong";
          return `<button class="${classes}" type="button" data-action="dump-yesno" data-id="${question.n}" data-slot="${index}" data-value="${choice}" ${locked ? "disabled" : ""}>${choice}</button>`;
        }).join("")}</div></div>`;
      }).join("")}</div>`;
    }

    const complete = dumpAnswerComplete(question, answer);
    const actions = locked
      ? `<button class="btn btn--secondary btn--small" type="button" data-action="dump-retry" data-id="${question.n}">Try again</button>`
      : `<button class="btn btn--primary btn--small" type="button" data-action="dump-check" data-id="${question.n}" ${complete ? "" : "disabled"}>${interaction.unscored ? "Reveal corrected validation" : "Check answer"}</button>`;

    return `<section class="dump-interaction" aria-label="Interactive answer area"><div class="dump-interaction__head"><span class="tag">${dumpTypeLabel(interaction)}</span>${interaction.unscored ? '<span class="status-badge invalid">UNSCORED · INVALID SOURCE OPTIONS</span>' : ""}</div>${renderDumpAssets(interaction)}${controls}<div class="dump-interaction__actions">${actions}</div>${renderDumpFeedback(question, answer, interaction)}</section>`;
  }

  function stats() {
    const entries = Object.values(state.answers);
    const correct = entries.filter(answer => answer.correct).length;
    const wrong = entries.filter(answer => !answer.correct).length;
    const attempted = entries.length;
    return { attempted, correct, wrong, accuracy: percent(correct, attempted), completion: percent(attempted, QUESTIONS.length) };
  }

  function calculateStreak() {
    const days = unique(Object.values(state.answers).map(item => item.lastAt?.slice(0, 10)).filter(Boolean)).sort().reverse();
    if (!days.length) return 0;
    let streak = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    const latest = new Date(`${days[0]}T00:00:00`);
    const gap = Math.round((cursor - latest) / 86400000);
    if (gap > 1) return 0;
    if (gap === 1) cursor.setDate(cursor.getDate() - 1);
    for (const day of days) {
      if (day === cursor.toISOString().slice(0, 10)) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
      }
    }
    return streak;
  }

  function updateGlobalProgress() {
    const s = stats();
    const bar = document.getElementById("globalProgressBar");
    if (bar) bar.style.width = `${s.completion}%`;
  }

  function toast(message) {
    const stack = document.getElementById("toastStack");
    const node = document.createElement("div");
    node.className = "toast";
    node.textContent = message;
    stack.append(node);
    setTimeout(() => node.remove(), 3200);
  }

  function setRoute(route) {
    location.hash = route === "home" ? "#home" : `#${route}`;
  }

  function currentRoute() {
    const raw = location.hash.replace(/^#/, "") || "home";
    return raw.split("/")[0];
  }

  function markActiveNav(route) {
    document.querySelectorAll("[data-route]").forEach(button => button.classList.toggle("active", button.dataset.route === route));
    document.getElementById("primaryNav").classList.remove("open");
    document.getElementById("menuToggle").setAttribute("aria-expanded", "false");
  }

  function pageHead(eyebrow, title, subtitle, action = "") {
    return `<header class="page-head page-head--split"><div><p class="eyebrow">${escapeHtml(eyebrow)}</p><h1 class="page-title">${title}</h1><p class="page-subtitle">${subtitle}</p></div>${action}</header>`;
  }

  function statCard(label, value, detail, icon, accent) {
    return `<article class="stat-card" style="--accent:${accent}"><div class="stat-card__top"><span>${label}</span><span class="stat-card__icon" aria-hidden="true">${icon}</span></div><strong>${value}</strong><small>${detail}</small></article>`;
  }

  function renderHome() {
    const s = stats();
    const streak = calculateStreak();
    const features = [
      ["study", "◫", "Visual Learning", "Memory maps, video chapters, code snapshots, and quick checks", `${LESSONS.length} lessons`, "#22d3ee"],
      ["practice", "◎", "Question Practice", "Instant explanations and official sources", "100 questions", "#4f8cff"],
      ["exam", "◷", "Exam Simulator", "40 questions in 45 minutes with hidden answers", "45 minutes", "#fb923c"],
      ["quick", "ϟ", "Quick Quiz", "10 mixed questions in 5 minutes", "5 minutes", "#22d3ee"],
      ["dump", "⚡", "DUMP — Interactive & Validated", "118 supplied questions rebuilt as choice, drag/drop, and hotspot interactions", "118 questions", "#fbbf24"],
      ["important", "!", "IMPORTANT Practice Bank", "Independent 93-question simulator from the supplied HTML file", "Separate section", "#fb7185"],
      ["review", "↻", "Smart Review", "Automatically focus on errors and bookmarks", `${s.wrong} errors`, "#a78bfa"],
      ["analytics", "▥", "Performance Analytics", "Batch accuracy and recent session history", `${s.accuracy}% accuracy`, "#31d0aa"],
      ["flashcards", "▤", "Flashcards", "Recall the concept, then reveal the answer", "100 cards", "#fbbf24"],
      ["cheatsheet", "≡", "Cheat Sheet", "High-yield comparisons in a printable sheet", "8 topics", "#60a5fa"],
      ["bookmarks", "☆", "Bookmarks", "Return to questions you marked for review", `${state.bookmarks.length} saved`, "#fb7185"],
      ["roadmap", "◉", "100% Study Plan", "A five-day plan with trackable tasks", `${state.planCompleted.length}/15 tasks`, "#f59e0b"],
      ["compare", "▦", "Tool Comparison", "Know when to choose Pipeline, Dataflow, Notebook, and more", "10 tools", "#38bdf8"],
      ["decision", "⌁", "Decision Tree", "Map a requirement to the right Fabric tool", "7 scenarios", "#8b5cf6"],
      ["sources", "↗", "Official Sources", `${Object.keys(SOURCES).length} Microsoft Learn and Azure references`, "Microsoft", "#34d399"]
    ];
    const batchNames = ["Management & Governance", "Ingestion & Architecture", "Real-Time Analytics", "Monitoring & Optimization"];
    const domainCards = [1, 2, 3, 4].map((batch, index) => {
      const ids = QUESTIONS.filter(q => q.batch === batch).map(q => q.n);
      const answered = ids.filter(id => state.answers[id]).length;
      const correct = ids.filter(id => state.answers[id]?.correct).length;
      return `<article class="domain-card"><div class="domain-card__head"><h3>${batchNames[index]}</h3><span>${correct}/${ids.length} correct</span></div><div class="meter"><span style="width:${percent(answered, ids.length)}%"></span></div><small>${answered} of ${ids.length} answered · accuracy ${percent(correct, answered)}%</small></article>`;
    }).join("");

    app.innerHTML = `
      <section class="hero">
        <div>
          <span class="hero__badge">✓ Aligned to the skills outline published for July 21, 2026</span>
          <h1>Prepare for <span class="gradient-text">DP-700</span><br>with real understanding.</h1>
          <p>Learn Microsoft Fabric through ${LESSONS.length} visual lessons, then practice 100 original questions, complete 118 validated interactive DUMP items, and open the separate IMPORTANT simulator with progress saved on your device.</p>
          <div class="hero__actions">
            <button class="btn btn--primary" type="button" data-route="practice">Start practicing →</button>
            <button class="btn btn--secondary" type="button" data-route="study">Open Visual Learning</button>
            ${state.activeSession && !state.activeSession.submitted ? '<button class="btn btn--secondary" type="button" data-action="resume-session">Resume session</button>' : ""}
          </div>
        </div>
        <div class="hero__visual">
          <div class="progress-orbit" aria-label="Question-bank completion">
            <div class="progress-ring" style="--progress:${s.completion * 3.6}deg"><div class="progress-ring__content"><strong>${s.completion}%</strong><span>${s.attempted} / ${QUESTIONS.length} questions</span></div></div>
          </div>
        </div>
      </section>

      <section class="stats-grid" aria-label="Progress summary">
        ${statCard("Overall progress", `${s.completion}%`, `${s.attempted} of ${QUESTIONS.length}`, "▥", "#4f8cff")}
        ${statCard("Accuracy", `${s.accuracy}%`, `${s.correct} correct answers`, "✓", "#31d0aa")}
        ${statCard("Needs review", s.wrong, "Incorrect answers", "!", "#fb7185")}
        ${statCard("Study streak", `${streak} days`, validCompletedLessons().length ? `${validCompletedLessons().length} lessons completed` : "Start today", "♨", "#fbbf24")}
      </section>

      <div class="section-title"><div><h2>Preparation tools</h2><p>Study, practice, simulate, and track from one dashboard</p></div></div>
      <section class="feature-grid">
        ${features.map(([route, icon, title, text, meta, color]) => `<button class="feature-card" type="button" data-route="${route}" style="--card-accent:${color}"><span class="feature-card__meta">${meta}</span><span class="feature-card__icon" aria-hidden="true">${icon}</span><h3>${title}</h3><p>${text}</p></button>`).join("")}
      </section>

      <div class="section-title"><div><h2>Study batches</h2><p>25 original questions in each batch</p></div></div>
      <section class="domain-grid">${domainCards}</section>

      <div class="section-title"><div><h2>Official exam scope</h2><p>Weights published on Microsoft Learn</p></div></div>
      <section class="domain-grid">
        ${DATA.meta.skillsMeasured.map(item => `<article class="domain-card"><div class="domain-card__head"><h3>${escapeHtml(item.name)}</h3><span>${escapeHtml(item.weight)}</span></div><div class="meter"><span style="width:33%"></span></div></article>`).join("")}
      </section>`;
  }

  function dumpRunStats(ids) {
    const answers = ids.map(id => state.dumpAnswers?.[id]).filter(answer => answer?.checked);
    return {
      attempted: answers.length,
      correct: answers.filter(answer => answer.correct === true).length,
      wrong: answers.filter(answer => answer.correct === false).length
    };
  }

  function renderDump() {
    const ds = dumpStats();
    const runs = [1, 2, 3, 4, 5].map(batch => {
      const questions = DUMP_QUESTIONS.filter(question => question.batch === batch);
      const ids = questions.map(question => question.n);
      const progress = dumpRunStats(ids);
      const typeCounts = questions.reduce((counts, question) => {
        const type = getDumpInteraction(question).type;
        counts[type] = (counts[type] || 0) + 1;
        return counts;
      }, {});
      return { batch, questions, ids, progress, typeCounts };
    });

    app.innerHTML = `
      <section class="dump-hero">
        <div><p class="eyebrow">REAL INTERACTIONS · CORRECTED ANSWER KEY</p><h1>DUMP <span class="gradient-text">Exam Runs</span></h1><p>Answer every item yourself. Single choice, multiple choice, Drag & Drop, dropdown Hotspot, and Yes/No Hotspot questions are rendered as real controls. The correct answer and explanation stay hidden until you press <strong>Check answer</strong>.</p><div class="hero__actions"><button class="btn btn--primary" type="button" data-action="dump-start-random">Start random 25 →</button><button class="btn btn--secondary" type="button" data-action="dump-start-full">Start all 118</button><button class="btn btn--secondary" type="button" data-route="dump-library">Browse interactive bank</button>${state.activeDumpSession?.ids?.length && state.activeDumpSession.index < state.activeDumpSession.ids.length ? '<button class="btn btn--secondary" type="button" data-route="dump-drill">Resume current run</button>' : ""}</div></div>
        <div class="dump-score"><div><strong>118</strong><span>INTERACTIVE QUESTIONS</span></div></div>
      </section>
      <section class="stats-grid">
        ${statCard("Answered", ds.attempted, "Across all DUMP runs", "◎", "#4f8cff")}
        ${statCard("Correct", ds.correct, `${percent(ds.correct, Math.max(1, ds.correct + ds.incorrect))}% scored accuracy`, "✓", "#31d0aa")}
        ${statCard("Needs review", ds.incorrect, "Incorrect answers", "!", "#fb7185")}
        ${statCard("Question types", 5, "Choice, Drag & Drop and Hotspots", "↔", "#fbbf24")}
      </section>
      <div class="setup-note"><strong>Scoring rule:</strong> All scored items use the independently corrected answer key. Nothing from the old supplied answer is shown before you submit your choice.</div>
      <div class="section-title"><div><h2>Choose a DUMP run</h2><p>Questions stay in source order inside each run</p></div></div>
      <section class="dump-run-grid">
        ${runs.map(run => {
          const pct = percent(run.progress.attempted, run.questions.length);
          const types = Object.entries(run.typeCounts).map(([type, count]) => `${count} ${dumpTypeLabel({ type, selectN: 2 }).split(" · ")[0]}`).join(" · ");
          return `<article class="dump-run-card"><div class="dump-run-card__top"><span class="dump-run-index">${run.batch}</span><span class="tag">${run.questions.length} questions</span></div><h3>DUMP Run ${run.batch}</h3><p>${types}</p><div class="meter"><span style="width:${pct}%"></span></div><small>${run.progress.attempted}/${run.questions.length} answered · ${run.progress.correct} correct</small><button class="btn btn--primary btn--small" type="button" data-action="dump-start-run" data-batch="${run.batch}">${run.progress.attempted ? "Restart run" : "Start run"} →</button></article>`;
        }).join("")}
      </section>`;
  }

  function renderDumpLibrary() {
    const ds = dumpStats();
    const needle = dumpSearch.trim().toLowerCase();
    const filtered = DUMP_QUESTIONS.filter(question => {
      const matchesSearch = !needle || `${question.n} ${question.question} ${question.correctAnswer} ${question.explanation} ${question.conceptArea}`.toLowerCase().includes(needle);
      const matchesBatch = dumpBatch === "all" || question.batch === Number(dumpBatch);
      const matchesStatus = dumpStatus === "all" || question.status.toLowerCase() === dumpStatus;
      const progress = state.dumpProgress[question.n] || "untracked";
      const matchesProgress = dumpProgressFilter === "all" || progress === dumpProgressFilter;
      return matchesSearch && matchesBatch && matchesStatus && matchesProgress;
    });
    const pageSize = 4;
    const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
    dumpPage = Math.max(1, Math.min(dumpPage, pageCount));
    const pageItems = filtered.slice((dumpPage - 1) * pageSize, dumpPage * pageSize);

    app.innerHTML = `
      <section class="dump-hero">
        <div><p class="eyebrow">INTERACTIVE QUESTION BANK · ANSWERS HIDDEN UNTIL CHECKED</p><h1>DUMP <span class="gradient-text">118</span></h1><p>Use the controls under every question to answer it. The validated answer and explanation appear only after you press <strong>Check answer</strong>.</p><div class="hero__actions"><button class="btn btn--primary" type="button" data-route="dump">Choose an exam run →</button><button class="btn btn--secondary" type="button" data-action="dump-review-filter">Review queue (${ds.review})</button></div></div>
        <div class="dump-score"><div><strong>${DUMP_DATA.meta.questionCount}</strong><span>INTERACTIVE ITEMS</span></div></div>
      </section>
      <section class="stats-grid">
        ${statCard("Attempted", ds.attempted, `${percent(ds.attempted, DUMP_DATA.meta.questionCount)}% of the DUMP bank`, "◎", "#4f8cff")}
        ${statCard("Correct", ds.correct, `${percent(ds.correct, Math.max(1, ds.correct + ds.incorrect))}% scored accuracy`, "✓", "#31d0aa")}
        ${statCard("Incorrect", ds.incorrect, "Automatically added to review", "!", "#fb7185")}
        ${statCard("Unscored", ds.unscored, "Invalid or incomplete source options", "?", "#fbbf24")}
      </section>
      <div class="setup-note"><strong>Validated answer key:</strong> ${escapeHtml(DUMP_DATA.meta.validatedThrough || "18 July 2026")}. Questions 53, 56, 89, 100, and 103 remain unscored because their source choices are missing, invalid, or underspecified.</div>
      <div class="toolbar">
        <label class="search-field"><span aria-hidden="true">⌕</span><input id="dumpSearch" type="search" value="${escapeHtml(dumpSearch)}" placeholder="Search question text, concept, answer, or explanation..." aria-label="Search DUMP questions"></label>
        <select class="select-field" id="dumpBatch" aria-label="Filter by batch"><option value="all">All batches</option>${[1,2,3,4,5].map(batch => `<option value="${batch}" ${dumpBatch === String(batch) ? "selected" : ""}>Batch ${batch}</option>`).join("")}</select>
        <select class="select-field" id="dumpProgress" aria-label="Filter by study progress"><option value="all">All study states</option><option value="untracked" ${dumpProgressFilter === "untracked" ? "selected" : ""}>Untracked</option><option value="mastered" ${dumpProgressFilter === "mastered" ? "selected" : ""}>Mastered</option><option value="review" ${dumpProgressFilter === "review" ? "selected" : ""}>Review queue</option></select>
      </div>
      <div class="section-title"><div><h2>${filtered.length} matching questions</h2><p>Page ${dumpPage} of ${pageCount}</p></div></div>
      <section class="dump-list">
        ${pageItems.map(question => {
          const progress = state.dumpProgress[question.n] || "untracked";
          const interaction = getDumpInteraction(question);
          return `<article class="dump-card" id="dump-${question.n}">
            <div class="dump-card__head"><div class="dump-card__head-group"><span class="dump-card__number">#${question.n}</span><span class="tag">Run ${question.batch}</span><span class="tag">${dumpTypeLabel(interaction)}</span></div><span class="tag">${escapeHtml(question.conceptArea || "DP-700")}</span></div>
            <div class="dump-card__body"><p class="dump-question">${escapeHtml(dumpDisplayPrompt(question, interaction))}</p>
              ${renderDumpInteraction(question, "library")}
              <div class="dump-card__actions"><div></div><div><button class="btn btn--secondary btn--small dump-progress ${progress === "mastered" ? "mastered" : ""}" type="button" data-action="dump-rate" data-value="mastered" data-id="${question.n}">✓ Mastered</button><button class="btn btn--secondary btn--small dump-progress ${progress === "review" ? "review" : ""}" type="button" data-action="dump-rate" data-value="review" data-id="${question.n}">↻ Review later</button></div></div>
            </div></article>`;
        }).join("") || '<div class="empty-state"><span class="empty-state__icon">⌕</span><h2>No matching questions</h2><p>Change the search or filters to display more items.</p></div>'}
      </section>
      <div class="pagination"><button class="btn btn--secondary btn--small" type="button" data-action="dump-page" data-page="${dumpPage - 1}" ${dumpPage === 1 ? "disabled" : ""}>← Previous</button><span>${dumpPage} / ${pageCount}</span><button class="btn btn--secondary btn--small" type="button" data-action="dump-page" data-page="${dumpPage + 1}" ${dumpPage === pageCount ? "disabled" : ""}>Next →</button></div>`;
  }

  function startDumpDrill(ids = null, label = "Random 25") {
    const selectedIds = Array.isArray(ids) && ids.length ? ids : shuffle(DUMP_QUESTIONS.map(question => question.n)).slice(0, 25);
    state.activeDumpSession = { ids: selectedIds, label, index: 0, answers: {}, startedAt: new Date().toISOString() };
    saveState();
    setRoute("dump-drill");
  }

  function renderDumpDrill() {
    const session = state.activeDumpSession;
    if (!session) {
      setRoute("dump");
      return;
    }
    if (session.index >= session.ids.length) {
      const responses = session.ids.map(id => session.answers?.[id]).filter(answer => answer?.checked);
      const correct = responses.filter(answer => answer.correct === true).length;
      const wrong = responses.filter(answer => answer.correct === false).length;
      const unscored = responses.filter(answer => answer.correct === null).length;
      app.innerHTML = `<section class="panel result-hero"><p class="eyebrow">INTERACTIVE DUMP RUN COMPLETE</p><h1 class="page-title">${escapeHtml(session.label || "DUMP run")} complete</h1><p class="page-subtitle" style="margin-inline:auto">Incorrect scored items were added to your review queue. Unscored items contain an invalid or incomplete source answer set.</p><div class="result-grid"><div><strong>${correct}</strong><span>Correct</span></div><div><strong>${wrong}</strong><span>Incorrect</span></div><div><strong>${unscored}</strong><span>Unscored</span></div></div><div class="hero__actions" style="justify-content:center"><button class="btn btn--primary" type="button" data-route="dump">Choose another DUMP run</button><button class="btn btn--secondary" type="button" data-route="dump-library">Open interactive bank</button></div></section>`;
      return;
    }
    const question = DUMP_QUESTIONS.find(item => item.n === session.ids[session.index]);
    const answer = peekDumpAnswer(question);
    const interaction = getDumpInteraction(question);
    const palette = session.ids.map((id, index) => {
      const saved = session.answers?.[id];
      const classes = [index === session.index ? "current" : "", saved?.checked ? "answered" : "", saved?.correct === true ? "correct" : "", saved?.correct === false ? "wrong" : ""].filter(Boolean).join(" ");
      return `<button class="${classes}" type="button" data-action="dump-drill-jump" data-index="${index}" aria-label="Go to question ${index + 1}">${index + 1}</button>`;
    }).join("");
    app.innerHTML = `<section class="quiz-shell"><div class="quiz-top"><div><p class="eyebrow">${escapeHtml(session.label || "INTERACTIVE DUMP RUN")}</p><span class="question-number">Question ${session.index + 1} of ${session.ids.length}</span></div><button class="btn btn--secondary btn--small" type="button" data-route="dump">Exit run</button></div><div class="quiz-progress"><span style="width:${percent(session.index + 1, session.ids.length)}%"></span></div><div class="question-tags"><span class="tag">DUMP #${question.n}</span><span class="tag">Run ${question.batch}</span><span class="tag">${dumpTypeLabel(interaction)}</span><span class="tag">Corrected answer key</span></div><h1 class="question-text" style="white-space:pre-wrap">${escapeHtml(dumpDisplayPrompt(question, interaction))}</h1>${renderDumpInteraction(question, "drill")}<div class="quiz-actions"><button class="btn btn--secondary" type="button" data-action="dump-drill-prev" ${session.index === 0 ? "disabled" : ""}>← Previous</button><button class="btn btn--primary" type="button" data-action="dump-drill-next" ${answer.checked ? "" : "disabled"}>${session.index === session.ids.length - 1 ? "Finish run" : "Next question →"}</button></div><div class="dump-palette" aria-label="DUMP question navigation">${palette}</div></section>`;
  }

  function rateDumpQuestion(id, value) {
    const numericId = Number(id);
    if (state.dumpProgress[numericId] === value) delete state.dumpProgress[numericId];
    else state.dumpProgress[numericId] = value;
    saveState();
  }

  function mutateDumpAnswer(number, mutator) {
    const question = DUMP_QUESTIONS.find(item => item.n === Number(number));
    if (!question) return;
    const answer = ensureDumpAnswer(question);
    if (answer.checked) return;
    mutator(answer, getDumpInteraction(question));
    saveState();
    if (currentRoute() === "dump-drill") renderDumpDrill();
    else {
      renderDumpLibrary();
      requestAnimationFrame(() => document.getElementById(`dump-${question.n}`)?.scrollIntoView({ block: "center" }));
    }
  }

  function checkDumpAnswer(number) {
    const question = DUMP_QUESTIONS.find(item => item.n === Number(number));
    if (!question) return;
    const answer = ensureDumpAnswer(question);
    if (!dumpAnswerComplete(question, answer)) return;
    answer.checked = true;
    answer.correct = dumpAnswerCorrect(question, answer);
    answer.at = new Date().toISOString();
    if (currentRoute() === "dump-drill") state.dumpAnswers[question.n] = JSON.parse(JSON.stringify(answer));
    if (answer.correct === true) state.dumpProgress[question.n] = "mastered";
    if (answer.correct === false) state.dumpProgress[question.n] = "review";
    saveState();
    if (currentRoute() === "dump-drill") renderDumpDrill();
    else {
      renderDumpLibrary();
      requestAnimationFrame(() => document.getElementById(`dump-${question.n}`)?.scrollIntoView({ block: "center" }));
    }
  }

  function retryDumpAnswer(number) {
    const question = DUMP_QUESTIONS.find(item => item.n === Number(number));
    if (!question) return;
    dumpAnswerStore()[question.n] = defaultDumpAnswer(getDumpInteraction(question));
    saveState();
    currentRoute() === "dump-drill" ? renderDumpDrill() : renderDumpLibrary();
  }

  function renderImportant() {
    app.innerHTML = `
      ${pageHead("SEPARATE PRACTICE BANK", "IMPORTANT", "The supplied DP700_Practice_Exam.html is preserved as its own simulator. Its questions and progress are separate from the validated DUMP section.", '<a class="btn btn--primary" href="./important/DP700_Practice_Exam.html" target="_blank" rel="noopener">Open full screen ↗</a>')}
      <div class="setup-note"><strong>Independent section:</strong> This embedded practice bank contains its own runs, grading, custom-question tools, and backup controls. Its answers are not used to score the validated 118-question DUMP bank.</div>
      <section class="important-shell"><iframe class="important-frame" src="./important/DP700_Practice_Exam.html?v=5" title="DP-700 IMPORTANT practice exam" sandbox="allow-scripts allow-same-origin allow-downloads allow-modals"></iframe></section>`;
  }

  function lessonCategoryClass(category) {
    if (category === "Implement & Manage") return "manage";
    if (category === "Monitor & Optimize") return "monitor";
    return "ingest";
  }

  function validCompletedLessons() {
    const ids = new Set(LESSONS.map(lesson => lesson.id));
    return unique(state.completedLessons).filter(id => ids.has(id));
  }

  function renderLessonVisual(lesson) {
    if (!lesson.visual?.items?.length) return "";
    const items = lesson.visual.items.map((item, index) => `
      <div class="memory-node" style="--node-index:${index}">
        <span class="memory-node__icon" aria-hidden="true">${escapeHtml(item.icon || String(index + 1))}</span>
        <strong>${escapeHtml(item.title)}</strong>
        <small>${escapeHtml(item.text)}</small>
      </div>`).join("");
    return `<section class="memory-visual memory-visual--${escapeHtml(lesson.visual.type || "grid")}" aria-label="${escapeHtml(lesson.visual.title)}"><div class="memory-visual__head"><span>VISUAL MAP</span><h2>${escapeHtml(lesson.visual.title)}</h2></div><div class="memory-nodes">${items}</div></section>`;
  }

  function renderLessonCode(lesson) {
    if (!lesson.code?.lines?.length) return "";
    return `<section class="lesson-code"><div><span>CODE SNAPSHOT</span><strong>${escapeHtml(lesson.code.language || "Code")}</strong></div><pre><code>${escapeHtml(lesson.code.lines.join("\n"))}</code></pre></section>`;
  }

  function renderLessonCheck(lesson) {
    if (!lesson.quickCheck) return "";
    const saved = state.lessonChecks?.[lesson.id] || { selected: null, checked: false };
    const selected = Number.isInteger(saved.selected) ? saved.selected : null;
    const checked = Boolean(saved.checked);
    const correct = selected === lesson.quickCheck.answer;
    return `<section class="lesson-check" aria-labelledby="check-${lesson.id}">
      <div class="lesson-check__head"><span class="lesson-check__badge">60-SECOND CHECK</span><h2 id="check-${lesson.id}">${escapeHtml(lesson.quickCheck.question)}</h2></div>
      <div class="lesson-check__options">${lesson.quickCheck.options.map((option, index) => {
        let className = "lesson-check__option" + (selected === index ? " selected" : "");
        if (checked && index === lesson.quickCheck.answer) className += " correct";
        if (checked && selected === index && index !== lesson.quickCheck.answer) className += " wrong";
        return `<button class="${className}" type="button" data-action="lesson-check-select" data-id="${lesson.id}" data-index="${index}" ${checked ? "disabled" : ""}><span>${LETTERS[index] || index + 1}</span><strong>${escapeHtml(option)}</strong></button>`;
      }).join("")}</div>
      <div class="lesson-check__actions">${checked
        ? `<div class="lesson-check__feedback ${correct ? "correct" : "wrong"}"><strong>${correct ? "✓ Correct" : "✕ Not yet"}</strong><p>${escapeHtml(lesson.quickCheck.why)}</p></div><button class="btn btn--secondary btn--small" type="button" data-action="lesson-check-retry" data-id="${lesson.id}">Try again</button>`
        : `<button class="btn btn--primary" type="button" data-action="lesson-check-submit" data-id="${lesson.id}" ${selected === null ? "disabled" : ""}>Check answer</button>`}
      </div>
    </section>`;
  }

  function renderStudy() {
    const categories = ["All", ...unique(LESSONS.map(lesson => lesson.category))];
    const needle = studySearch.trim().toLowerCase();
    const filtered = LESSONS.filter(lesson => (studyFilter === "All" || lesson.category === studyFilter) && (!needle || `${lesson.title} ${lesson.subtitle} ${lesson.summary} ${lesson.memoryHook || ""}`.toLowerCase().includes(needle)));
    const completedIds = validCompletedLessons();
    const completed = completedIds.length;
    const domainOrder = ["Implement & Manage", "Ingest & Transform", "Monitor & Optimize"];
    const totalMinutes = LESSONS.reduce((sum, lesson) => sum + Number(lesson.minutes || 0), 0);
    const domainCards = domainOrder.map((category, index) => {
      const lessons = LESSONS.filter(lesson => lesson.category === category);
      const done = lessons.filter(lesson => completedIds.includes(lesson.id)).length;
      const weights = ["30–35%", "30–35%", "30–35%"];
      return `<button class="learn-domain learn-domain--${lessonCategoryClass(category)}" type="button" data-study-filter="${escapeHtml(category)}"><span>DOMAIN 0${index + 1}</span><h3>${escapeHtml(category)}</h3><p>${done}/${lessons.length} lessons complete</p><div class="meter"><span style="width:${percent(done, lessons.length)}%"></span></div><small>${weights[index]} of the current exam</small></button>`;
    }).join("");

    app.innerHTML = `
      <section class="learn-hero">
        <div><p class="eyebrow">VISUAL LEARNING · JULY 2026 SCOPE</p><h1>Understand Fabric as a <span class="gradient-text">connected system.</span></h1><p>Short explanations, memory hooks, visual maps, code snapshots, and a 60-second check after every lesson. Technical terms stay in English so the wording matches the exam.</p><div class="hero__actions"><button class="btn btn--primary" type="button" data-action="open-lesson" data-id="${escapeHtml(LESSONS.find(lesson => !completedIds.includes(lesson.id))?.id || LESSONS[0].id)}">${completed ? "Continue learning" : "Start the first lesson"} →</button><button class="btn btn--secondary" type="button" data-route="roadmap">Open 5-day plan</button></div></div>
        <div class="learn-hero__score"><strong>${completed}</strong><span>of ${LESSONS.length}</span><small>visual lessons</small></div>
      </section>
      <section class="learn-summary" aria-label="Learning summary"><div><strong>${totalMinutes}</strong><span>minutes of focused content</span></div><div><strong>${LESSONS.length}</strong><span>visual memory maps</span></div><div><strong>${LESSONS.length}</strong><span>quick checks</span></div></section>
      <div class="section-title"><div><h2>The three exam domains</h2><p>Each domain carries the same published weight range</p></div></div>
      <section class="learn-domain-grid">${domainCards}</section>
      <section class="fabric-journey" aria-label="Fabric data journey"><div class="fabric-journey__title"><span>THE BIG PICTURE</span><h2>Source → move → store → transform → serve → operate</h2></div><div class="fabric-journey__track"><div><b>1</b><strong>Source</strong><small>Files · DBs · events</small></div><i>→</i><div><b>2</b><strong>Move</strong><small>Pipeline · Eventstream</small></div><i>→</i><div><b>3</b><strong>Store</strong><small>OneLake</small></div><i>→</i><div><b>4</b><strong>Transform</strong><small>SQL · Spark · KQL</small></div><i>→</i><div><b>5</b><strong>Operate</strong><small>Secure · monitor · optimize</small></div></div></section>
      <div class="toolbar">
        <label class="search-field"><span aria-hidden="true">⌕</span><input id="studySearch" type="search" value="${escapeHtml(studySearch)}" placeholder="Search a concept, tool, or memory hook..." aria-label="Search lessons"></label>
        <div class="filter-pills" aria-label="Filter lessons">${categories.map(category => `<button class="pill ${category === studyFilter ? "active" : ""}" type="button" data-study-filter="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join("")}</div>
      </div>
      <div class="section-title"><div><h2>${studyFilter === "All" ? "Visual lesson path" : escapeHtml(studyFilter)}</h2><p>${filtered.length} lessons · click any lesson to open its visual map</p></div><strong>${completed}/${LESSONS.length} complete</strong></div>
      <div class="meter learn-progress"><span style="width:${percent(completed, LESSONS.length)}%"></span></div>
      <section class="lesson-grid lesson-grid--visual">
        ${filtered.map((lesson, index) => `<button class="lesson-card lesson-card--visual ${state.completedLessons.includes(lesson.id) ? "completed" : ""}" type="button" data-action="open-lesson" data-id="${lesson.id}"><div class="lesson-card__accent lesson-card__accent--${lessonCategoryClass(lesson.category)}"></div><div class="lesson-card__head"><span class="lesson-card__icon" aria-hidden="true">${escapeHtml(lesson.icon || String(index + 1))}</span><span class="lesson-card__number">${state.completedLessons.includes(lesson.id) ? "✓" : String(LESSONS.indexOf(lesson) + 1).padStart(2, "0")}</span></div><h3>${escapeHtml(lesson.title)}</h3><p>${escapeHtml(lesson.subtitle)}</p><div class="lesson-memory"><span>MEMORY HOOK</span>${escapeHtml(lesson.memoryHook || lesson.summary)}</div><div class="lesson-card__foot"><span>${escapeHtml(lesson.category)}</span><span>${lesson.minutes} min →</span></div></button>`).join("") || '<div class="empty-state"><h2>No results</h2><p>Try a different search term or category.</p></div>'}
      </section>`;
  }

  function renderLesson(id) {
    const lesson = LESSONS.find(item => item.id === id);
    if (!lesson) return renderStudy();
    const completed = state.completedLessons.includes(lesson.id);
    const currentIndex = LESSONS.indexOf(lesson);
    const previous = LESSONS[currentIndex - 1];
    const next = LESSONS[currentIndex + 1];
    app.innerHTML = `
      <div class="lesson-breadcrumb"><button type="button" data-route="study">Visual Learning</button><span>›</span><span>${escapeHtml(lesson.category)}</span><span>›</span><strong>Lesson ${currentIndex + 1}</strong></div>
      <section class="lesson-hero lesson-hero--${lessonCategoryClass(lesson.category)}"><div><div class="lesson-hero__meta"><span>${escapeHtml(lesson.category)}</span><span>${lesson.minutes} min</span><span>Lesson ${currentIndex + 1} of ${LESSONS.length}</span></div><h1><span aria-hidden="true">${escapeHtml(lesson.icon || "◫")}</span>${escapeHtml(lesson.title)}</h1><p>${escapeHtml(lesson.subtitle)}</p></div><div class="lesson-hero__status">${completed ? "✓ COMPLETED" : "IN PROGRESS"}</div></section>
      <article class="lesson-detail lesson-detail--visual">
        <section class="lesson-intro"><div><p class="eyebrow">MENTAL MODEL</p><p class="question-text">${escapeHtml(lesson.summary)}</p></div><aside><span>MEMORY HOOK</span><strong>${escapeHtml(lesson.memoryHook || lesson.summary)}</strong></aside></section>
        ${renderLessonVisual(lesson)}
        ${renderLessonCode(lesson)}
        <section class="lesson-points"><div><p class="eyebrow">WHAT TO REMEMBER</p><h2>Four points worth keeping</h2></div><ol>${lesson.points.map((point, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><p>${escapeHtml(point)}</p></li>`).join("")}</ol></section>
        <div class="lesson-trap"><span aria-hidden="true">!</span><div><strong>EXAM TRAP</strong><p>${escapeHtml(lesson.trap)}</p></div></div>
        ${lesson.video ? `<section class="lesson-video"><div><span aria-hidden="true">▶</span><div><strong>Video chapter</strong><p>${escapeHtml(lesson.video.note || "Watch this chapter after the visual lesson.")}</p></div></div><a class="btn btn--secondary" href="${escapeHtml(lesson.video.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(lesson.video.label)} ↗</a></section>` : ""}
        ${renderLessonCheck(lesson)}
        <section class="lesson-sources"><div><p class="eyebrow">VERIFY THE CURRENT BEHAVIOR</p><h2>Official Microsoft sources</h2></div><div class="lesson-links source-links">${sourceLinks(lesson.sourceIds)}</div></section>
        <div class="quiz-actions lesson-finish"><div class="quiz-actions__group">${previous ? `<button class="btn btn--secondary" type="button" data-route="study/lesson/${previous.id}">← Previous</button>` : ""}<button class="btn ${completed ? "btn--secondary" : "btn--success"}" type="button" data-action="toggle-lesson" data-id="${lesson.id}">${completed ? "Mark incomplete" : "✓ Mark lesson complete"}</button></div><div class="quiz-actions__group"><button class="btn btn--secondary" type="button" data-action="practice-lesson" data-id="${lesson.id}">Practice topic</button>${next ? `<button class="btn btn--primary" type="button" data-route="study/lesson/${next.id}">Next lesson →</button>` : '<button class="btn btn--primary" type="button" data-route="quick">Final quick quiz →</button>'}</div></div>
      </article>`;
  }

  function renderPracticeSetup(mode = "practice") {
    const isExam = mode === "exam";
    const isQuick = mode === "quick";
    const title = isExam ? "Exam Simulator" : isQuick ? "Quick Quiz" : "Question Practice";
    const subtitle = isExam ? "Answers stay hidden during the session. Flag questions and return before submitting." : isQuick ? "A focused sprint: 10 mixed questions in 5 minutes." : "Choose a scope and question count. Feedback and sources appear after each answer.";
    const defaultCount = isExam ? 40 : isQuick ? 10 : 25;
    app.innerHTML = `
      ${pageHead(isExam ? "EXAM SIMULATOR" : isQuick ? "QUICK MODE" : "PRACTICE MODE", title, subtitle)}
      <section class="panel">
        <form id="sessionSetup" data-mode="${mode}">
          <h2>Session setup</h2>
          <div class="setup-grid">
            <label class="choice-card"><input type="radio" name="scope" value="all" checked><strong>All batches</strong><small>Mixed questions from the 100-question bank</small></label>
            <label class="choice-card"><input type="radio" name="scope" value="1"><strong>Management & Governance</strong><small>Batch 1 · 25 questions</small></label>
            <label class="choice-card"><input type="radio" name="scope" value="2"><strong>Ingestion & Architecture</strong><small>Batch 2 · 25 questions</small></label>
            <label class="choice-card"><input type="radio" name="scope" value="3"><strong>Real-Time Analytics</strong><small>Batch 3 · 25 questions</small></label>
            <label class="choice-card"><input type="radio" name="scope" value="4"><strong>Monitoring & Optimization</strong><small>Batch 4 · 25 questions</small></label>
            <label class="choice-card"><input type="radio" name="scope" value="wrong" ${stats().wrong ? "" : "disabled"}><strong>Current errors only</strong><small>${stats().wrong} questions need review</small></label>
          </div>
          ${!isQuick ? `<label><strong>Question count</strong><select class="select-field" name="count" aria-label="Question count">${[10, 25, 40, 50, 100].map(count => `<option value="${count}" ${count === defaultCount ? "selected" : ""}>${count} questions</option>`).join("")}</select></label>` : `<input type="hidden" name="count" value="10">`}
          <div class="setup-note"><strong>${isExam ? "Simulation rules" : "How it works"}:</strong> ${isExam ? "45 minutes, shuffled questions and options, a 70% practice target, and free navigation with the question palette." : "Options are reshuffled each session. Use 1–4 to answer, B to bookmark, and arrow keys to navigate."}</div>
          <div class="hero__actions"><button class="btn btn--primary" type="submit">${isExam ? "Start simulation" : "Start session"} →</button>${state.activeSession ? '<button class="btn btn--secondary" type="button" data-action="resume-session">Resume current session</button>' : ""}</div>
        </form>
      </section>`;
  }

  function startSession(mode, count, scope = "all", explicitIds = null) {
    let pool = explicitIds ? explicitIds.map(getQuestion).filter(Boolean) : QUESTIONS;
    if (!explicitIds) {
      if (["1", "2", "3", "4"].includes(String(scope))) pool = pool.filter(q => q.batch === Number(scope));
      if (scope === "wrong") pool = pool.filter(q => state.answers[q.n] && !state.answers[q.n].correct);
      if (scope === "bookmarks") pool = pool.filter(q => state.bookmarks.includes(q.n));
    }
    const selected = shuffle(pool).slice(0, Math.min(Number(count), pool.length));
    if (!selected.length) {
      toast("No questions are available for this filter.");
      return;
    }
    const durationSec = mode === "exam" ? 45 * 60 : mode === "quick" ? 5 * 60 : 0;
    state.activeSession = {
      id: `session-${Date.now()}`,
      mode,
      ids: selected.map(q => q.n),
      index: 0,
      answers: {},
      flags: [],
      optionOrders: Object.fromEntries(selected.map(q => [q.n, shuffle(q.options.map((_, index) => index))])),
      startedAt: new Date().toISOString(),
      durationSec,
      submitted: false
    };
    saveState();
    renderQuiz();
  }

  function renderQuiz() {
    clearInterval(activeTimer);
    const session = state.activeSession;
    if (!session) return renderPracticeSetup("practice");
    if (session.submitted) return renderResult();
    session.index = Math.max(0, Math.min(session.index, session.ids.length - 1));
    const question = getQuestion(session.ids[session.index]);
    const response = session.answers[question.n];
    const reveal = session.mode !== "exam" && Boolean(response);
    const order = session.optionOrders[question.n] || question.options.map((_, index) => index);
    const modeName = session.mode === "exam" ? "Exam simulation" : session.mode === "quick" ? "Quick Quiz" : session.mode === "review" ? "Smart Review" : "Practice";
    const elapsed = Math.floor((Date.now() - new Date(session.startedAt).getTime()) / 1000);
    const remaining = session.durationSec ? Math.max(0, session.durationSec - elapsed) : 0;

    app.innerHTML = `
      <section class="quiz-shell" aria-label="${modeName}">
        <div class="quiz-top">
          <div><p class="eyebrow">${modeName}</p><span class="question-number">Question ${session.index + 1} of ${session.ids.length}</span></div>
          <div class="quiz-top__meta">${session.durationSec ? `<span class="timer ${remaining < 300 ? "warning" : ""}" id="timer" aria-label="Time remaining">${formatDuration(remaining)}</span>` : ""}<button class="btn btn--secondary btn--small bookmark-button ${state.bookmarks.includes(question.n) ? "active" : ""}" type="button" data-action="bookmark" data-id="${question.n}">${state.bookmarks.includes(question.n) ? "★ Bookmarked" : "☆ Bookmark"}</button></div>
        </div>
        <div class="quiz-progress" aria-hidden="true"><span style="width:${percent(session.index + 1, session.ids.length)}%"></span></div>
        <div class="question-tags"><span class="tag">Batch ${question.batch}</span><span class="tag">${escapeHtml(question.area)}</span><span class="tag">Original question #${question.n}</span></div>
        <p class="question-title">${escapeHtml(question.title)}</p>
        <h1 class="question-text">${escapeHtml(question.question)}</h1>
        <div class="options-list" role="group" aria-label="Answer choices">
          ${order.map((originalIndex, displayIndex) => {
            let className = "option";
            if (response?.selectedIndex === originalIndex) className += " selected";
            if (reveal && originalIndex === question.correctIndex) className += " correct";
            if (reveal && response?.selectedIndex === originalIndex && !response.correct) className += " wrong";
            return `<button class="${className}" type="button" data-action="select-option" data-original-index="${originalIndex}" ${reveal ? "disabled" : ""}><span class="option__letter">${LETTERS[displayIndex]}</span><span>${escapeHtml(question.options[originalIndex])}</span></button>`;
          }).join("")}
        </div>
        ${reveal ? `<div class="explanation ${response.correct ? "correct" : "wrong"}"><h3>${response.correct ? "✓ Correct answer" : "✕ Review this answer"}</h3><p><strong>Validated answer:</strong> ${escapeHtml(question.options[question.correctIndex])}</p><p>${escapeHtml(question.explanation)}</p><div class="source-links">${sourceLinks(question.refs)}</div></div>` : session.mode === "exam" ? '<p class="page-subtitle">The answer and explanation remain hidden until submission.</p>' : ""}
        <div class="quiz-actions">
          <div class="quiz-actions__group"><button class="btn btn--secondary" type="button" data-action="prev-question" ${session.index === 0 ? "disabled" : ""}>← Previous</button><button class="btn btn--primary" type="button" data-action="next-question" ${session.index === session.ids.length - 1 ? "disabled" : ""}>Next →</button></div>
          <div class="quiz-actions__group">${session.mode === "exam" ? `<button class="btn btn--secondary ${session.flags.includes(question.n) ? "bookmark-button active" : ""}" type="button" data-action="flag-question">${session.flags.includes(question.n) ? "⚑ Flagged" : "⚐ Flag"}</button>` : ""}<button class="btn btn--danger" type="button" data-action="submit-session">${session.mode === "exam" ? "Submit simulation" : "Finish session"}</button></div>
        </div>
        <div class="palette" aria-label="Question palette">${session.ids.map((id, index) => `<button type="button" data-action="jump-question" data-index="${index}" class="${index === session.index ? "current" : ""} ${session.answers[id] ? "answered" : ""} ${session.flags.includes(id) ? "flagged" : ""}" aria-label="Question ${index + 1}">${index + 1}</button>`).join("")}</div>
      </section>`;

    if (session.durationSec) startTimer();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startTimer() {
    clearInterval(activeTimer);
    const session = state.activeSession;
    const update = () => {
      if (!session || session.submitted) return clearInterval(activeTimer);
      const elapsed = Math.floor((Date.now() - new Date(session.startedAt).getTime()) / 1000);
      const remaining = Math.max(0, session.durationSec - elapsed);
      const timer = document.getElementById("timer");
      if (timer) {
        timer.textContent = formatDuration(remaining);
        timer.classList.toggle("warning", remaining < 300);
      }
      if (remaining <= 0) {
        clearInterval(activeTimer);
        toast("Time expired. The simulation was submitted automatically.");
        submitSession(true);
      }
    };
    update();
    activeTimer = setInterval(update, 1000);
  }

  function selectOption(originalIndex) {
    const session = state.activeSession;
    if (!session || session.submitted) return;
    const question = getQuestion(session.ids[session.index]);
    if (session.mode !== "exam" && session.answers[question.n]) return;
    const correct = Number(originalIndex) === question.correctIndex;
    session.answers[question.n] = { selectedIndex: Number(originalIndex), correct, at: new Date().toISOString() };
    if (session.mode !== "exam") {
      const previous = state.answers[question.n];
      state.answers[question.n] = { selectedIndex: Number(originalIndex), correct, attempts: (previous?.attempts || 0) + 1, lastAt: new Date().toISOString() };
      toast(correct ? "Correct — excellent." : "Review the explanation and source before moving on.");
    }
    saveState();
    renderQuiz();
  }

  function moveQuestion(delta) {
    const session = state.activeSession;
    if (!session) return;
    session.index = Math.max(0, Math.min(session.index + delta, session.ids.length - 1));
    saveState();
    renderQuiz();
  }

  function toggleBookmark(id) {
    const numericId = Number(id);
    state.bookmarks = state.bookmarks.includes(numericId) ? state.bookmarks.filter(item => item !== numericId) : [...state.bookmarks, numericId];
    saveState();
    toast(state.bookmarks.includes(numericId) ? "Question bookmarked for review." : "Question removed from bookmarks.");
    if (state.activeSession && !state.activeSession.submitted) renderQuiz();
    else route();
  }

  function toggleFlag() {
    const session = state.activeSession;
    const id = session.ids[session.index];
    session.flags = session.flags.includes(id) ? session.flags.filter(item => item !== id) : [...session.flags, id];
    saveState();
    renderQuiz();
  }

  function submitSession(auto = false) {
    const session = state.activeSession;
    if (!session || session.submitted) return;
    const unanswered = session.ids.length - Object.keys(session.answers).length;
    if (!auto && session.mode === "exam" && unanswered > 0 && !window.confirm(`${unanswered} questions are unanswered. Submit anyway?`)) return;
    clearInterval(activeTimer);
    if (session.mode === "exam") {
      Object.entries(session.answers).forEach(([id, response]) => {
        const previous = state.answers[id];
        state.answers[id] = { ...response, attempts: (previous?.attempts || 0) + 1, lastAt: new Date().toISOString() };
      });
    }
    const correct = Object.values(session.answers).filter(answer => answer.correct).length;
    const elapsedSec = Math.floor((Date.now() - new Date(session.startedAt).getTime()) / 1000);
    session.submitted = true;
    session.finishedAt = new Date().toISOString();
    session.score = percent(correct, session.ids.length);
    session.elapsedSec = elapsedSec;
    state.sessions.unshift({ id: session.id, mode: session.mode, count: session.ids.length, answered: Object.keys(session.answers).length, correct, score: session.score, startedAt: session.startedAt, finishedAt: session.finishedAt, elapsedSec });
    state.sessions = state.sessions.slice(0, 30);
    saveState();
    renderResult();
  }

  function renderResult() {
    const session = state.activeSession;
    if (!session) return renderHome();
    const correct = Object.values(session.answers).filter(answer => answer.correct).length;
    const answered = Object.keys(session.answers).length;
    const wrongIds = session.ids.filter(id => session.answers[id] && !session.answers[id].correct);
    const unansweredIds = session.ids.filter(id => !session.answers[id]);
    const passed = session.score >= 70;
    app.innerHTML = `
      <section class="panel result-hero">
        <p class="eyebrow">SESSION COMPLETE</p>
        <h1 class="page-title">${passed ? "Strong performance — keep going" : "Your review targets are ready"}</h1>
        <p class="page-subtitle" style="margin-inline:auto">This practice score does not predict an official exam result. Use the breakdown to choose your next review.</p>
        <div class="score-circle" style="--score-angle:${session.score * 3.6}deg;--score-color:${passed ? "var(--green)" : "var(--amber)"}"><div><strong>${session.score}%</strong><span>${passed ? "At or above 70%" : "Below 70%"}</span></div></div>
        <div class="result-grid"><div><strong>${correct}</strong><span>Correct answers</span></div><div><strong>${wrongIds.length}</strong><span>Incorrect answers</span></div><div><strong>${unansweredIds.length}</strong><span>Unanswered</span></div></div>
        <div class="hero__actions" style="justify-content:center"><button class="btn btn--primary" type="button" data-route="review">Review errors</button><button class="btn btn--secondary" type="button" data-action="restart-session">New session</button><button class="btn btn--secondary" type="button" data-route="analytics">Performance Analytics</button></div>
      </section>
      <div class="section-title"><div><h2>Session review</h2><p>${answered} answers of ${session.ids.length}</p></div></div>
      <div class="review-list">
        ${session.ids.map((id, index) => {
          const q = getQuestion(id);
          const response = session.answers[id];
          const status = !response ? "—" : response.correct ? "✓" : "✕";
          return `<details class="review-item"><summary>${status} Question ${index + 1}: ${escapeHtml(q.title)}</summary><p>${escapeHtml(q.question)}</p><p><strong>Your answer:</strong> ${response ? escapeHtml(q.options[response.selectedIndex]) : "Not answered"}</p><p><strong>Validated answer:</strong> ${escapeHtml(q.options[q.correctIndex])}</p><p>${escapeHtml(q.explanation)}</p><div class="source-links">${sourceLinks(q.refs)}</div></details>`;
        }).join("")}
      </div>`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderAnalytics() {
    const s = stats();
    const batchNames = ["Management & Governance", "Ingestion & Architecture", "Real-Time Analytics", "Monitoring & Optimization"];
    const bars = [1, 2, 3, 4].map((batch, index) => {
      const ids = QUESTIONS.filter(q => q.batch === batch).map(q => q.n);
      const entries = ids.map(id => state.answers[id]).filter(Boolean);
      const correct = entries.filter(answer => answer.correct).length;
      const accuracy = percent(correct, entries.length);
      return `<div class="bar-row"><div class="bar-row__top"><span>${batchNames[index]}</span><strong>${accuracy}% <small>(${entries.length}/${ids.length})</small></strong></div><div class="meter"><span style="width:${accuracy}%"></span></div></div>`;
    }).join("");
    const frequentAreas = Object.entries(Object.values(state.answers).reduce((acc, answer) => acc, {}));
    const wrongAreas = Object.entries(QUESTIONS.filter(q => state.answers[q.n] && !state.answers[q.n].correct).reduce((acc, q) => ({ ...acc, [q.area]: (acc[q.area] || 0) + 1 }), {})).sort((a, b) => b[1] - a[1]).slice(0, 6);
    void frequentAreas;

    app.innerHTML = `
      ${pageHead("PERFORMANCE", "Performance Analytics", "Measure coverage and accuracy by batch, then target weak areas instead of practicing blindly.")}
      <section class="stats-grid">
        ${statCard("Attempted", s.attempted, `${s.completion}% of the bank`, "▥", "#4f8cff")}
        ${statCard("Correct answers", s.correct, `${s.accuracy}% accuracy`, "✓", "#31d0aa")}
        ${statCard("Current errors", s.wrong, "Latest attempt per question", "!", "#fb7185")}
        ${statCard("Sessions", state.sessions.length, `Last activity ${formatDate(state.lastActivity)}`, "◷", "#fbbf24")}
      </section>
      <section class="analytics-grid">
        <article class="chart-card"><h3>Accuracy by batch</h3><div class="bar-list">${bars}</div></article>
        <article class="chart-card"><h3>Top review areas</h3>${wrongAreas.length ? `<div class="activity-list">${wrongAreas.map(([area, count]) => `<div class="activity-item"><span>${escapeHtml(area)}</span><strong>${count}</strong></div>`).join("")}</div>` : '<div class="empty-state"><p>No errors recorded yet.</p></div>'}</article>
      </section>
      <div class="section-title"><div><h2>Recent sessions</h2><p>The latest 30 sessions are stored on this device</p></div></div>
      ${state.sessions.length ? `<div class="table-wrap"><table class="data-table"><thead><tr><th>Date</th><th>Mode</th><th>Score</th><th>correct</th><th>Time</th></tr></thead><tbody>${state.sessions.map(session => `<tr><td>${formatDate(session.finishedAt)}</td><td>${session.mode === "exam" ? "Simulation" : session.mode === "quick" ? "Quick" : session.mode === "review" ? "Review" : "Practice"}</td><td><strong>${session.score}%</strong></td><td>${session.correct}/${session.count}</td><td>${formatDuration(session.elapsedSec || 0)}</td></tr>`).join("")}</tbody></table></div>` : '<div class="empty-state"><span class="empty-state__icon">▥</span><h2>No completed sessions</h2><p>Complete a quiz or simulation to populate analytics.</p><button class="btn btn--primary" type="button" data-route="quick">Start Quick Quiz</button></div>'}`;
  }

  function renderReview() {
    const wrongIds = QUESTIONS.filter(q => state.answers[q.n] && !state.answers[q.n].correct).map(q => q.n);
    const combinedIds = unique([...wrongIds, ...state.bookmarks]);
    app.innerHTML = `
      ${pageHead("SMART REVIEW", "Smart Review", "Combines current errors and bookmarks so you can focus on the highest-value review.")}
      <section class="stats-grid">
        ${statCard("Errors", wrongIds.length, "Need another attempt", "!", "#fb7185")}
        ${statCard("Bookmarks", state.bookmarks.length, "Marked for review", "☆", "#fbbf24")}
        ${statCard("Review queue", combinedIds.length, "After removing duplicates", "↻", "#a78bfa")}
        ${statCard("Current accuracy", `${stats().accuracy}%`, `${stats().correct} correct`, "✓", "#31d0aa")}
      </section>
      ${combinedIds.length ? `<section class="panel"><h2>Start a focused session</h2><p class="page-subtitle">Each answer reveals feedback and official sources. Questions and options are shuffled.</p><div class="hero__actions"><button class="btn btn--primary" type="button" data-action="start-review">Start ${combinedIds.length} questions</button><button class="btn btn--secondary" type="button" data-action="review-wrong">Errors only (${wrongIds.length})</button><button class="btn btn--secondary" type="button" data-route="bookmarks">View bookmarks</button></div></section>` : '<div class="empty-state"><span class="empty-state__icon">✓</span><h2>Your review queue is empty</h2><p>Answer or bookmark questions and they will appear here automatically.</p><button class="btn btn--primary" type="button" data-route="practice">Start practice</button></div>'}`;
  }

  function renderFlashcards() {
    flashIndex = Math.max(0, Math.min(flashIndex, QUESTIONS.length - 1));
    const q = QUESTIONS[flashIndex];
    app.innerHTML = `
      ${pageHead("FLASHCARDS", "Flashcards", "Recall the answer first, then reveal it. Use the arrow keys or the controls below.", `<span>${flashIndex + 1}/${QUESTIONS.length}</span>`)}
      <section class="flash-shell">
        <div class="flashcard ${flashFlipped ? "flipped" : ""}" data-action="flip-card" tabindex="0" role="button" aria-label="Reveal answer">
          <div class="flashcard__inner">
            <div class="flashcard__face"><div><p class="eyebrow">${escapeHtml(q.area)}</p><h2>${escapeHtml(q.question)}</h2><p>Click to reveal the answer</p></div></div>
            <div class="flashcard__face flashcard__face--back"><div><p class="eyebrow">Answer</p><h2>${escapeHtml(q.options[q.correctIndex])}</h2><p>${escapeHtml(q.explanation)}</p><div class="source-links" style="justify-content:center">${sourceLinks(q.refs)}</div></div></div>
          </div>
        </div>
        <div class="flash-controls"><button class="btn btn--secondary" type="button" data-action="flash-prev" ${flashIndex === 0 ? "disabled" : ""}>← Previous</button><button class="btn btn--primary" type="button" data-action="flip-card">Reveal answer</button><button class="btn btn--secondary" type="button" data-action="flash-next" ${flashIndex === QUESTIONS.length - 1 ? "disabled" : ""}>Next →</button></div>
      </section>`;
  }

  function renderCheatsheet() {
    app.innerHTML = `
      ${pageHead("HIGH-YIELD", "Cheat Sheet", "A high-yield reference for selecting the right Fabric tool and concept. Print it or save it as PDF.", '<button class="btn btn--secondary" type="button" data-action="print">Print / PDF</button>')}
      <section class="cheat-grid">${CHEAT_SECTIONS.map(section => `<article class="cheat-card"><h3>${escapeHtml(section.title)}</h3><dl>${section.rows.map(([term, meaning]) => `<dt>${escapeHtml(term)}</dt><dd>${escapeHtml(meaning)}</dd>`).join("")}</dl></article>`).join("")}</section>`;
  }

  function renderBookmarks() {
    const bookmarked = state.bookmarks.map(getQuestion).filter(Boolean);
    app.innerHTML = `
      ${pageHead("SAVED", "Bookmarked Questions", "Bookmark questions during practice to build a personal review queue.", bookmarked.length ? `<button class="btn btn--primary" type="button" data-action="practice-bookmarks">Practice bookmarks</button>` : "")}
      ${bookmarked.length ? `<div class="table-wrap"><table class="data-table"><thead><tr><th>#</th><th>Title</th><th>Area</th><th>Status</th><th></th></tr></thead><tbody>${bookmarked.map(q => `<tr><td>${q.n}</td><td><strong>${escapeHtml(q.title)}</strong><br><small>${escapeHtml(q.question)}</small></td><td>${escapeHtml(q.area)}</td><td>${state.answers[q.n] ? state.answers[q.n].correct ? "✓ Correct" : "✕ Incorrect" : "Not attempted"}</td><td><button class="btn btn--secondary btn--small" type="button" data-action="bookmark" data-id="${q.n}">Remove</button></td></tr>`).join("")}</tbody></table></div>` : '<div class="empty-state"><span class="empty-state__icon">☆</span><h2>No bookmarked questions</h2><p>Select Bookmark during practice and the question will appear here.</p><button class="btn btn--primary" type="button" data-route="practice">Start practice</button></div>'}`;
  }

  function renderSources() {
    const allSources = Object.values(SOURCES);
    app.innerHTML = `
      ${pageHead("OFFICIAL SOURCES", "Official Microsoft Sources", "Every original question and lesson is linked to public documentation. Open the source to verify current behavior.")}
      <div class="setup-note"><strong>Content note:</strong> The original question bank was written for learning from public documentation.</div>
      <div class="section-title"><div><h2>${allSources.length} references</h2><p>Microsoft Learn and Azure documentation</p></div></div>
      <section class="source-grid">${allSources.map(source => `<a class="source-card" href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer"><div><strong>${escapeHtml(source.title)}</strong><small>${escapeHtml(source.url.replace(/^https:\/\//, ""))}</small></div><span>${source.id} ↗</span></a>`).join("")}</section>`;
  }

  function renderSettings() {
    const fileSize = new Blob([JSON.stringify(state)]).size;
    app.innerHTML = `
      ${pageHead("SETTINGS", "Settings & Backup", "Progress is stored only in this browser. Export it to restore on another device.")}
      <section class="settings-grid">
        <article class="setting-card"><h3>Appearance</h3><p>Choose a comfortable reading theme.</p><div class="hero__actions"><button class="btn ${state.theme === "dark" ? "btn--primary" : "btn--secondary"}" type="button" data-action="set-theme" data-theme="dark">Dark</button><button class="btn ${state.theme === "light" ? "btn--primary" : "btn--secondary"}" type="button" data-action="set-theme" data-theme="light">Light</button></div></article>
        <article class="setting-card"><h3>Export progress</h3><p>A JSON backup of ${(fileSize / 1024).toFixed(1)} KB containing answers, bookmarks, and sessions.</p><div class="hero__actions"><button class="btn btn--primary" type="button" data-action="export">Download backup</button><button class="btn btn--secondary" type="button" data-action="import">Import backup</button></div></article>
        <article class="setting-card"><h3>Offline access</h3><p>After the first GitHub Pages visit, supported browsers cache the app shell for offline use.</p><span class="tag">PWA Ready</span> <span class="tag">No backend</span></article>
        <article class="setting-card danger-zone"><h3>Reset progress</h3><p>Deletes answers, sessions, bookmarks, and completed lessons from this browser. Export first if you need a backup.</p><button class="btn btn--danger" type="button" data-action="reset">Delete all progress</button></article>
      </section>
      <div class="section-title"><div><h2>Keyboard shortcuts</h2></div></div>
      <div class="table-wrap"><table class="data-table"><tbody><tr><th>1–4</th><td>Choose an answer during a session</td></tr><tr><th>← / →</th><td>Next / Previous</td></tr><tr><th>B</th><td>Bookmark or remove the current question</td></tr><tr><th>Space</th><td>Reveal the flashcard answer</td></tr></tbody></table></div>`;
  }

  function renderRoadmap() {
    const allTasks = STUDY_PLAN.flatMap(day => day.tasks.map(task => task[0]));
    const completed = allTasks.filter(id => state.planCompleted.includes(id)).length;
    app.innerHTML = `
      ${pageHead("100% PLAN", "Five-Day Success Plan", "A focused plan you can adapt. 100% means plan completion—not a guaranteed exam score.", `<strong>${completed}/${allTasks.length} tasks</strong>`)}
      <div class="meter"><span style="width:${percent(completed, allTasks.length)}%"></span></div>
      <section class="lesson-grid" style="margin-top:24px">${STUDY_PLAN.map(day => `<article class="lesson-card"><div class="lesson-card__head"><div><p class="eyebrow">${day.day}</p><h3>${escapeHtml(day.title)}</h3></div><span class="lesson-card__number">${day.tasks.filter(([id]) => state.planCompleted.includes(id)).length}/${day.tasks.length}</span></div><div class="activity-list" style="margin-top:18px">${day.tasks.map(([id, label]) => `<label class="activity-item"><span><input type="checkbox" data-plan-task="${id}" ${state.planCompleted.includes(id) ? "checked" : ""}> ${escapeHtml(label)}</span></label>`).join("")}</div></article>`).join("")}</section>
      <div class="setup-note" style="margin-top:20px"><strong>Final-day rule:</strong> Do not memorize answer letters. Explain why each distractor fails and open the source whenever a behavior is unclear.</div>`;
  }

  function renderCompare() {
    app.innerHTML = `
      ${pageHead("COMPARE", "Microsoft Fabric Tool Comparison", "Choose from workload requirements—not product familiarity. Use the table, then test a scenario in the decision tree.", '<button class="btn btn--primary" type="button" data-route="decision">Open Decision Tree</button>')}
      <div class="table-wrap"><table class="data-table"><thead><tr><th>Tool</th><th>Primary role</th><th>Strength</th><th>Choose it when...</th></tr></thead><tbody>${COMPARISON_ROWS.map(row => `<tr>${row.map((cell, index) => `<td>${index === 0 ? `<strong>${escapeHtml(cell)}</strong>` : escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
      <div class="setup-note" style="margin-top:20px">A solution can combine tools: Pipeline for orchestration, Dataflow/Notebook for transformation, Lakehouse/Warehouse for analytics, and Eventstream/Eventhouse for real time.</div>`;
  }

  function renderDecision() {
    const selected = DECISIONS[decisionChoice];
    app.innerHTML = `
      ${pageHead("DECISION TREE", "Fabric Tool Decision Tree", "Select the required outcome to see the closest tool and the alternatives you should compare.")}
      <div class="filter-pills" aria-label="Choose a scenario">${Object.entries(DECISIONS).map(([key, item]) => `<button class="pill ${key === decisionChoice ? "active" : ""}" type="button" data-decision="${key}">${escapeHtml(item.label)}</button>`).join("")}</div>
      <article class="lesson-detail" style="margin-top:22px"><p class="eyebrow">Closest match</p><h2 class="page-title">${escapeHtml(selected.answer)}</h2><p class="question-text">${escapeHtml(selected.why)}</p><div class="lesson-callout"><strong>Also compare:</strong> ${escapeHtml(selected.alternatives)}</div><div class="hero__actions"><button class="btn btn--primary" type="button" data-route="practice">Practice scenarios</button><button class="btn btn--secondary" type="button" data-route="compare">Full comparison table</button></div></article>`;
  }

  function exportProgress() {
    const payload = { app: DATA.meta.title, exportedAt: new Date().toISOString(), state };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dp700-progress-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast("Progress backup downloaded.");
  }

  function importProgress(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(reader.result);
        const imported = payload.state || payload;
        if (!imported || typeof imported !== "object" || !imported.answers || !Array.isArray(imported.bookmarks)) throw new Error("Invalid backup");
        state = { ...defaultState(), ...imported, answers: imported.answers || {}, bookmarks: imported.bookmarks || [], completedLessons: imported.completedLessons || [], lessonChecks: imported.lessonChecks || {}, planCompleted: imported.planCompleted || [], sessions: imported.sessions || [], dumpProgress: imported.dumpProgress || {}, dumpAnswers: imported.dumpAnswers || {}, activeDumpSession: imported.activeDumpSession || null };
        applyTheme(state.theme);
        saveState();
        toast("Progress imported successfully.");
        renderSettings();
      } catch {
        toast("This is not a valid DP-700 progress backup.");
      }
    };
    reader.readAsText(file);
  }

  function applyTheme(theme) {
    state.theme = theme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = state.theme;
    document.querySelector('meta[name="theme-color"]').setAttribute("content", state.theme === "dark" ? "#07111f" : "#f5f8fc");
  }

  function route() {
    clearInterval(activeTimer);
    const routeName = currentRoute();
    const parts = location.hash.replace(/^#/, "").split("/");
    state.lastRoute = routeName;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    markActiveNav(["dump-drill", "dump-library"].includes(routeName) ? "dump" : routeName);
    switch (routeName) {
      case "study": parts[1] === "lesson" && parts[2] ? renderLesson(parts[2]) : renderStudy(); break;
      case "practice": state.activeSession && !state.activeSession.submitted && ["practice", "review"].includes(state.activeSession.mode) ? renderQuiz() : renderPracticeSetup("practice"); break;
      case "exam": state.activeSession && !state.activeSession.submitted && state.activeSession.mode === "exam" ? renderQuiz() : renderPracticeSetup("exam"); break;
      case "quick": state.activeSession && !state.activeSession.submitted && state.activeSession.mode === "quick" ? renderQuiz() : renderPracticeSetup("quick"); break;
      case "dump": renderDump(); break;
      case "dump-library": renderDumpLibrary(); break;
      case "dump-drill": renderDumpDrill(); break;
      case "important": renderImportant(); break;
      case "analytics": renderAnalytics(); break;
      case "review": renderReview(); break;
      case "flashcards": renderFlashcards(); break;
      case "cheatsheet": renderCheatsheet(); break;
      case "bookmarks": renderBookmarks(); break;
      case "roadmap": renderRoadmap(); break;
      case "compare": renderCompare(); break;
      case "decision": renderDecision(); break;
      case "sources": renderSources(); break;
      case "settings": renderSettings(); break;
      default: renderHome(); break;
    }
    updateGlobalProgress();
    document.title = `${routeName === "home" ? "DP-700 Prep" : app.querySelector("h1")?.textContent || "DP-700"} — DP-700 Prep`;
  }

  document.addEventListener("click", event => {
    const routeButton = event.target.closest("[data-route]");
    if (routeButton) {
      event.preventDefault();
      setRoute(routeButton.dataset.route);
      return;
    }
    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) return;
    const action = actionButton.dataset.action;
    const id = actionButton.dataset.id;
    if (action === "open-lesson") setRoute(`study/lesson/${id}`);
    if (action === "toggle-lesson") {
      state.completedLessons = state.completedLessons.includes(id) ? state.completedLessons.filter(item => item !== id) : [...state.completedLessons, id];
      saveState();
      renderLesson(id);
    }
    if (action === "lesson-check-select") {
      state.lessonChecks[id] = { selected: Number(actionButton.dataset.index), checked: false };
      saveState();
      renderLesson(id);
    }
    if (action === "lesson-check-submit") {
      const savedCheck = state.lessonChecks[id];
      if (savedCheck && Number.isInteger(savedCheck.selected)) {
        state.lessonChecks[id] = { ...savedCheck, checked: true };
        saveState();
        renderLesson(id);
      }
    }
    if (action === "lesson-check-retry") {
      state.lessonChecks[id] = { selected: null, checked: false };
      saveState();
      renderLesson(id);
    }
    if (action === "practice-lesson") {
      const lesson = LESSONS.find(item => item.id === id);
      const batches = lesson.category === "Implement & Manage" ? [1] : lesson.category === "Monitor & Optimize" ? [4] : [2, 3];
      const pool = QUESTIONS.filter(q => batches.includes(q.batch) && (q.area.toLowerCase().includes(lesson.id.split("-")[0]) || q.objective.toLowerCase().split(" ").some(word => lesson.summary.toLowerCase().includes(word))));
      const ids = (pool.length >= 5 ? pool : QUESTIONS.filter(q => batches.includes(q.batch))).map(q => q.n);
      startSession("practice", Math.min(10, ids.length), "all", ids);
    }
    if (action === "resume-session") renderQuiz();
    if (action === "select-option") selectOption(Number(actionButton.dataset.originalIndex));
    if (action === "prev-question") moveQuestion(-1);
    if (action === "next-question") moveQuestion(1);
    if (action === "jump-question") { state.activeSession.index = Number(actionButton.dataset.index); saveState(); renderQuiz(); }
    if (action === "bookmark") toggleBookmark(id);
    if (action === "flag-question") toggleFlag();
    if (action === "submit-session") submitSession(false);
    if (action === "restart-session") {
      const mode = state.activeSession?.mode === "review" ? "practice" : state.activeSession?.mode || "practice";
      state.activeSession = null;
      saveState();
      setRoute(mode);
    }
    if (action === "start-review") {
      const ids = unique([...QUESTIONS.filter(q => state.answers[q.n] && !state.answers[q.n].correct).map(q => q.n), ...state.bookmarks]);
      startSession("review", ids.length, "all", ids);
    }
    if (action === "review-wrong") {
      const ids = QUESTIONS.filter(q => state.answers[q.n] && !state.answers[q.n].correct).map(q => q.n);
      startSession("review", ids.length, "all", ids);
    }
    if (action === "practice-bookmarks") startSession("review", state.bookmarks.length, "all", state.bookmarks);
    if (action === "start-dump-drill" || action === "dump-start-random") startDumpDrill(null, "Random 25");
    if (action === "dump-start-run") {
      const batch = Number(actionButton.dataset.batch);
      startDumpDrill(DUMP_QUESTIONS.filter(question => question.batch === batch).map(question => question.n), `DUMP Run ${batch}`);
    }
    if (action === "dump-start-full") startDumpDrill(DUMP_QUESTIONS.map(question => question.n), "Full DUMP · 118 questions");
    if (action === "dump-review-filter") { dumpProgressFilter = "review"; dumpPage = 1; setRoute("dump-library"); }
    if (action === "dump-rate") { rateDumpQuestion(id, actionButton.dataset.value); renderDumpLibrary(); }
    if (action === "dump-page") { dumpPage = Number(actionButton.dataset.page); renderDumpLibrary(); window.scrollTo({ top: 0, behavior: "smooth" }); }
    if (action === "dump-choice") {
      mutateDumpAnswer(id, (answer, interaction) => {
        const label = actionButton.dataset.label;
        if (interaction.type === "single") answer.selected = [label];
        else if (answer.selected.includes(label)) answer.selected = answer.selected.filter(item => item !== label);
        else if (answer.selected.length < Number(interaction.selectN || 2)) answer.selected.push(label);
        else toast(`Select exactly ${interaction.selectN} answers. Remove one first.`);
      });
    }
    if (action === "dump-yesno") mutateDumpAnswer(id, answer => { answer.values[Number(actionButton.dataset.slot)] = actionButton.dataset.value; });
    if (action === "dump-chip") { dumpArmedValue = decodeURIComponent(actionButton.dataset.value || ""); currentRoute() === "dump-drill" ? renderDumpDrill() : renderDumpLibrary(); }
    if (action === "dump-place-chip" && dumpArmedValue) {
      mutateDumpAnswer(id, answer => { answer.values[Number(actionButton.dataset.slot)] = dumpArmedValue; });
      dumpArmedValue = "";
    }
    if (action === "dump-check") checkDumpAnswer(id);
    if (action === "dump-retry") retryDumpAnswer(id);
    if (action === "dump-drill-prev") { state.activeDumpSession.index = Math.max(0, state.activeDumpSession.index - 1); saveState(); renderDumpDrill(); }
    if (action === "dump-drill-next") { state.activeDumpSession.index += 1; saveState(); renderDumpDrill(); }
    if (action === "dump-drill-jump") { state.activeDumpSession.index = Number(actionButton.dataset.index); saveState(); renderDumpDrill(); }
    if (action === "open-dump-image") window.open(actionButton.dataset.src, "_blank", "noopener,noreferrer");
    if (action === "flip-card") { flashFlipped = !flashFlipped; renderFlashcards(); }
    if (action === "flash-prev") { flashIndex -= 1; flashFlipped = false; renderFlashcards(); }
    if (action === "flash-next") { flashIndex += 1; flashFlipped = false; renderFlashcards(); }
    if (action === "print") window.print();
    if (action === "set-theme") { applyTheme(actionButton.dataset.theme); saveState(); renderSettings(); }
    if (action === "export") exportProgress();
    if (action === "import") document.getElementById("importInput").click();
    if (action === "reset" && window.confirm("Delete all progress from this browser? This cannot be undone.")) {
      state = defaultState();
      applyTheme(state.theme);
      saveState();
      toast("Progress reset complete.");
      renderSettings();
    }
    if (action === "set-theme") return;
  });

  document.addEventListener("submit", event => {
    if (event.target.id !== "sessionSetup") return;
    event.preventDefault();
    const form = new FormData(event.target);
    startSession(event.target.dataset.mode, Number(form.get("count")), form.get("scope"));
  });

  document.addEventListener("input", event => {
    if (event.target.id === "studySearch") {
      studySearch = event.target.value;
      renderStudy();
      requestAnimationFrame(() => {
        const input = document.getElementById("studySearch");
        input?.focus();
        input?.setSelectionRange(studySearch.length, studySearch.length);
      });
    }
    if (event.target.id === "dumpSearch") {
      dumpSearch = event.target.value;
      dumpPage = 1;
      renderDumpLibrary();
      requestAnimationFrame(() => {
        const input = document.getElementById("dumpSearch");
        input?.focus();
        input?.setSelectionRange(dumpSearch.length, dumpSearch.length);
      });
    }
  });

  document.addEventListener("click", event => {
    const filter = event.target.closest("[data-study-filter]");
    if (!filter) return;
    studyFilter = filter.dataset.studyFilter;
    renderStudy();
  });

  document.addEventListener("click", event => {
    const decision = event.target.closest("[data-decision]");
    if (!decision) return;
    decisionChoice = decision.dataset.decision;
    renderDecision();
  });

  document.addEventListener("change", event => {
    const dumpSlot = event.target.closest("[data-dump-slot]");
    if (dumpSlot) {
      mutateDumpAnswer(dumpSlot.dataset.id, answer => { answer.values[Number(dumpSlot.dataset.slot)] = dumpSlot.value; });
      return;
    }
    const task = event.target.closest("[data-plan-task]");
    if (task) {
      state.planCompleted = task.checked ? unique([...state.planCompleted, task.dataset.planTask]) : state.planCompleted.filter(id => id !== task.dataset.planTask);
      saveState();
      renderRoadmap();
    }
    if (event.target.id === "dumpBatch") { dumpBatch = event.target.value; dumpPage = 1; renderDumpLibrary(); }
    if (event.target.id === "dumpStatus") { dumpStatus = event.target.value; dumpPage = 1; renderDumpLibrary(); }
    if (event.target.id === "dumpProgress") { dumpProgressFilter = event.target.value; dumpPage = 1; renderDumpLibrary(); }
  });

  document.addEventListener("dragstart", event => {
    const chip = event.target.closest(".dump-chip[data-value]");
    if (!chip || !event.dataTransfer) return;
    const value = decodeURIComponent(chip.dataset.value || "");
    event.dataTransfer.setData("text/plain", value);
    event.dataTransfer.effectAllowed = "copy";
  });

  document.addEventListener("dragover", event => {
    if (event.target.closest("[data-action='dump-place-chip']")) event.preventDefault();
  });

  document.addEventListener("drop", event => {
    const target = event.target.closest("[data-action='dump-place-chip']");
    if (!target || !event.dataTransfer) return;
    event.preventDefault();
    const value = event.dataTransfer.getData("text/plain");
    if (!value) return;
    mutateDumpAnswer(target.dataset.id, answer => { answer.values[Number(target.dataset.slot)] = value; });
    dumpArmedValue = "";
  });

  document.getElementById("menuToggle").addEventListener("click", () => {
    const nav = document.getElementById("primaryNav");
    const open = nav.classList.toggle("open");
    document.getElementById("menuToggle").setAttribute("aria-expanded", String(open));
  });

  document.getElementById("themeToggle").addEventListener("click", () => {
    applyTheme(state.theme === "dark" ? "light" : "dark");
    saveState();
  });

  document.getElementById("importInput").addEventListener("change", event => {
    if (event.target.files?.[0]) importProgress(event.target.files[0]);
    event.target.value = "";
  });

  document.addEventListener("keydown", event => {
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement) return;
    const session = state.activeSession;
    if (session && !session.submitted && ["1", "2", "3", "4"].includes(event.key)) {
      const q = getQuestion(session.ids[session.index]);
      const order = session.optionOrders[q.n];
      const displayIndex = Number(event.key) - 1;
      if (order?.[displayIndex] !== undefined) selectOption(order[displayIndex]);
    }
    if (session && !session.submitted && event.key === "ArrowRight") moveQuestion(1);
    if (session && !session.submitted && event.key === "ArrowLeft") moveQuestion(-1);
    if (session && !session.submitted && event.key.toLowerCase() === "b") toggleBookmark(session.ids[session.index]);
    if (currentRoute() === "flashcards" && (event.key === " " || event.key === "Enter")) { event.preventDefault(); flashFlipped = !flashFlipped; renderFlashcards(); }
  });

  window.addEventListener("hashchange", route);
  window.addEventListener("beforeunload", saveState);
  applyTheme(state.theme);
  route();

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
  }
})();
