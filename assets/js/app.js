(() => {
  "use strict";

  const DATA = window.DP700_DATA;
  const DUMP_DATA = window.DP700_DUMP || { meta: { questionCount: 0, correctSelections: 0, correctedSelections: 0 }, sources: [], questions: [] };
  const DUMP_INTERACTION_DATA = window.DP700_DUMP_INTERACTIONS || { meta: { typeCounts: {}, unscoredQuestions: [] }, questions: {} };
  const UPLOADED_DATA = window.DP700_UPLOADED || { questions: [], meta: {} };
  const UPLOADED_INTERACTIONS = window.DP700_UPLOADED_INTERACTIONS || {};
  const DUMP_PAGE_FALLBACKS = window.DP700_DUMP_PAGE_FALLBACKS || {};
  if (!DATA || !Array.isArray(DATA.questions)) {
    document.getElementById("app").innerHTML = '<div class="empty-state"><h1>The original question bank could not be loaded.</h1><p>Make sure the data folder is next to index.html.</p></div>';
    return;
  }

  const QUESTIONS = DATA.questions;
  const VISUAL_LEARNING = window.DP700_VISUAL_LEARNING || { sources: [], lessons: [] };
  const ARABIC_LEARNING = window.DP700_ARABIC_LESSONS || { resources: { official: [], videos: [] }, lessons: {} };
  const COURSE = window.DP700_COURSE || { meta: {}, modules: [] };
  const COURSE_CONTENT = window.DP700_COURSE_CONTENT || null;
  const PRO_PATH = window.DP700_PROFESSIONAL_PATH || { bootcamp: [], diagnostic: { questions: [] }, masteryLevels: [], challengeLabs: [], troubleshootingLabs: [], decisionScenarios: [], projects: [], assessments: {} };
  const SOURCES = Object.fromEntries([...DATA.sources, ...(VISUAL_LEARNING.sources || [])].map(source => [source.id, source]));
  const DUMP_SOURCES = Object.fromEntries(DUMP_DATA.sources.map(source => [source.id, source]));
  const PDF_SOURCE_ORDER = { "DP-700N1.pdf": 1, "DP-700N2.pdf": 2, "DP-700N3.pdf": 3 };
  const PDF_SOURCE_LABELS = { "DP-700N1.pdf": "DP-700N1", "DP-700N2.pdf": "DP-700N2", "DP-700N3.pdf": "DP-700N3" };
  const importedQuestions = [...(UPLOADED_DATA.questions || [])].sort((a, b) => (PDF_SOURCE_ORDER[a.sourceFile] || 99) - (PDF_SOURCE_ORDER[b.sourceFile] || 99) || (a.sourceQuestion || 0) - (b.sourceQuestion || 0));
  // The DUMP experience is the three uploaded PDF files only, in N1 → N2 → N3 order.
  const DUMP_QUESTIONS = importedQuestions;
  // Practice Exam uses every single-answer uploaded question whose real choices
  // are available either on the question record or in the corrected interaction metadata.
  const EXAM_QUESTIONS = DUMP_QUESTIONS.map(q => {
    const interaction = UPLOADED_INTERACTIONS[String(q.n)] || {};
    const validQuestionOptions = Array.isArray(q.options) ? q.options.map(option => typeof option === "string" ? option : option?.text).filter(Boolean) : [];
    const rawOptions = validQuestionOptions.length >= 2 ? validQuestionOptions : interaction.optionsOverride;
    const options = Array.isArray(rawOptions) ? rawOptions.map(option => typeof option === "string" ? option : option?.text).filter(Boolean) : [];
    const labels = Array.isArray(interaction.correctLabels) ? interaction.correctLabels : String(q.correctAnswer || "").split(/\s*,\s*/).filter(Boolean);
    const singleAnswer = labels.length === 1 && ["A", "B", "C", "D", "E", "F", "G"].includes(labels[0]);
    return options.length >= 2 && singleAnswer ? {
      ...q,
      question: String(q.question || "").replace(/\n\s+A[.)]\s*[\s\S]*$/," ").trim(),
      options,
      correctIndex: Math.max(0, options.findIndex((_, i) => ["A", "B", "C", "D", "E", "F", "G"][i] === labels[0])),
      title: q.title || `DP-700 ${PDF_SOURCE_LABELS[q.sourceFile] || "Question"}`,
      area: q.conceptArea || "DP-700 concept area",
      refs: q.refs || []
    } : null;
  }).filter(Boolean);
  const STORAGE_KEY = "dp700-prep-state-v2";
  const PROFESSIONAL_STORAGE_KEY = "dp700-professional-path-v9";
  const LETTERS = ["A", "B", "C", "D", "E", "F", "G"];
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
    { title: "Performance signals", rows: [["Straggler task", "Often data skew"], ["Executor OOM", "Large partition/skew"], ["Driver OOM", "Large collect/result"], ["Small files", "OPTIMIZE or batched writes"]] },
    { title: "Direct Lake guardrails", rows: [["Direct Lake on OneLake", "Reads supported Delta data through OneLake"], ["Direct Lake on SQL", "Can fall back to DirectQuery for unsupported access paths"], ["Framing", "Refreshes Delta metadata references; not an Import copy"], ["Capacity guardrail", "Capacity-specific limits can trigger errors or fallback"], ["Cold vs warm", "First load is slower; warm data is faster"]] },
    { title: "Direct Lake optimization", rows: [["Large row groups", "Prefer healthy, larger groups over tiny fragments"], ["V-Order", "Read optimization with write-time cost"], ["Small files", "Batch writes, auto-compaction, and OPTIMIZE"], ["Cardinality", "Reduce unnecessary high-cardinality columns"], ["Fallback check", "Investigate SQL views, unsupported objects, and RLS paths"]] },
    { title: "Exam traps", rows: [["OPTIMIZE vs VACUUM", "Compact active files vs remove obsolete files"], ["RLS vs masking", "Filter rows vs obscure returned values"], ["Git vs deployment", "Version history vs environment promotion"], ["Viewer vs Contributor", "Consume vs author"], ["Event time", "When event happened, not processing time"]] }
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
    arabicOpenLessons: [],
    courseLectureProgress: {},
    courseCompletedLabs: [],
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

  const defaultProfessionalState = () => ({
    version: 9,
    diagnosticAnswers: {},
    diagnosticResult: null,
    bootcampCompleted: [],
    lessonLevels: {},
    lessonPractice: {},
    lessonScenario: {},
    lessonRationales: {},
    moduleReflections: {},
    challengeProgress: {},
    troubleshootingProgress: {},
    decisionProgress: {},
    decisionIndex: 0,
    projectProgress: {},
    assessmentDrafts: {},
    assessmentAttempts: {},
    assessmentRetake: {}
  });

  function loadProfessionalState() {
    try {
      const saved = JSON.parse(localStorage.getItem(PROFESSIONAL_STORAGE_KEY));
      const base = defaultProfessionalState();
      return {
        ...base,
        ...saved,
        diagnosticAnswers: saved?.diagnosticAnswers || {},
        bootcampCompleted: Array.isArray(saved?.bootcampCompleted) ? saved.bootcampCompleted : [],
        lessonLevels: saved?.lessonLevels || {},
        lessonPractice: saved?.lessonPractice || {},
        lessonScenario: saved?.lessonScenario || {},
        lessonRationales: saved?.lessonRationales || {},
        moduleReflections: saved?.moduleReflections || {},
        challengeProgress: saved?.challengeProgress || {},
        troubleshootingProgress: saved?.troubleshootingProgress || {},
        decisionProgress: saved?.decisionProgress || {},
        projectProgress: saved?.projectProgress || {},
        assessmentDrafts: saved?.assessmentDrafts || {},
        assessmentAttempts: saved?.assessmentAttempts || {},
        assessmentRetake: saved?.assessmentRetake || {}
      };
    } catch {
      return defaultProfessionalState();
    }
  }

  function saveProfessionalState() {
    localStorage.setItem(PROFESSIONAL_STORAGE_KEY, JSON.stringify(professionalState));
  }

  let state = loadState();
  // Discard an old exam session if its question IDs are no longer in the validated
  // answerable DUMP-derived pool; this prevents stale multi-answer UI from resurfacing.
  if (state.activeSession?.mode === "exam" && state.activeSession.ids?.some(id => !EXAM_QUESTIONS.some(q => q.n === Number(id)))) {
    state.activeSession = null;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  let professionalState = loadProfessionalState();
  let activeTimer = null;
  let studyFilter = "All";
  let studySearch = "";
  let courseFilter = "All";
  let courseSearch = "";
  let flashIndex = 0;
  let flashFlipped = false;
  let decisionChoice = "orchestrate";
  let dumpSearch = "";
  let dumpBatch = "all";
  let dumpSource = "all";
  let dumpStatus = "all";
  let dumpProgressFilter = "all";
  let dumpPage = 1;
  let dumpArmedValue = "";

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      const restored = { ...defaultState(), ...saved, answers: saved?.answers || {}, bookmarks: saved?.bookmarks || [], completedLessons: saved?.completedLessons || [], lessonChecks: saved?.lessonChecks || {}, arabicOpenLessons: saved?.arabicOpenLessons || [], courseLectureProgress: saved?.courseLectureProgress || {}, courseCompletedLabs: saved?.courseCompletedLabs || [], planCompleted: saved?.planCompleted || [], sessions: saved?.sessions || [], dumpProgress: saved?.dumpProgress || {}, dumpAnswers: saved?.dumpAnswers || {}, activeDumpSession: saved?.activeDumpSession || null };
      // A previous build stored image-only review results for items that now have
      // real source choices. Clear only those stale answer objects so the new
      // controls start unanswered instead of remaining locked on Review required.
      const clearStale = answers => Object.fromEntries(Object.entries(answers || {}).filter(([id, answer]) => {
        const question = DUMP_QUESTIONS.find(item => item.n === Number(id));
        const interaction = question ? getDumpInteraction(question) : null;
        return !(interaction && !interaction.unscored && answer?.checked && answer?.correct === null);
      }));
      restored.dumpAnswers = clearStale(restored.dumpAnswers);
      if (restored.activeDumpSession?.answers) restored.activeDumpSession.answers = clearStale(restored.activeDumpSession.answers);
      return restored;
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
  function getSessionQuestion(id) { return state.activeSession?.mode === "exam" ? EXAM_QUESTIONS.find(q => q.n === Number(id)) : getQuestion(id); }
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
    const base = UPLOADED_INTERACTIONS[String(question.n)] || DUMP_INTERACTION_DATA.questions?.[question.n] || { type: "single", selectN: 1, correctLabels: [] };
    const fallback = DUMP_PAGE_FALLBACKS[String(question.n)] || {};
    const assets = [...new Set([...(base.assets || []), ...(fallback.assets || [])])];
    return { ...base, assets };
  }

  function defaultDumpAnswer(interaction) {
    if (["single", "multi", "letter-choice"].includes(interaction.type)) return { selected: [], checked: false, correct: null };
    if (["dropdown", "dragdrop"].includes(interaction.type)) return { values: new Array(interaction.slots?.length || 0).fill(""), checked: false, correct: null };
    if (interaction.type === "yesno") return { values: new Array(interaction.statements?.length || 0).fill(""), checked: false, correct: null };
    if (interaction.type === "review") return { checked: false, correct: null };
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
    if (["single", "letter-choice"].includes(interaction.type)) return answer.selected?.length === 1;
    if (interaction.type === "multi") return answer.selected?.length === Number(interaction.selectN || interaction.correctLabels?.length || 2);
    if (["dropdown", "dragdrop", "yesno"].includes(interaction.type)) return Boolean(answer.values?.length) && answer.values.every(Boolean);
    if (interaction.type === "review") return true;
    return false;
  }

  function dumpAnswerCorrect(question, answer = peekDumpAnswer(question)) {
    const interaction = getDumpInteraction(question);
    if (interaction.unscored) return null;
    if (["single", "multi", "letter-choice"].includes(interaction.type)) {
      const actual = [...(answer.selected || [])].sort().join(",");
      const expected = [...(interaction.correctLabels || [])].sort().join(",");
      return Boolean(expected) && actual === expected;
    }
    if (["dropdown", "dragdrop"].includes(interaction.type)) return interaction.slots.every((item, index) => answer.values[index] === item.correct);
    if (interaction.type === "yesno") return interaction.correct.every((value, index) => answer.values[index] === value);
    return null;
  }

  function dumpTypeLabel(interaction) {
    return ({ single: "Single choice", multi: `Multiple choice · Select ${interaction.selectN}`, dragdrop: "Drag & drop", dropdown: "Hotspot / dropdown", yesno: "Hotspot · Yes/No", review: "Source review · image-backed", "letter-choice": "Choice from source screenshot" })[interaction.type] || "Interactive";
  }

  function dumpDisplayPrompt(question, interaction = getDumpInteraction(question)) {
    let text = String(question.question || "")
      .replace(/^DRAG DROP \(Drag and Drop is not supported\)\s*/i, "")
      .replace(/^HOTSPOT \(Drag and Drop is not supported\)\s*/i, "")
      .replace(/^HOTSPOT\s*/i, "");
    if (["single", "multi", "letter-choice"].includes(interaction.type)) {
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
    return `<section class="dump-exhibits" aria-label="Question screenshot"><div class="dump-exhibits__title">Question screenshot${interaction.assets.length > 1 ? "s · split for readability" : ""}</div><div class="dump-exhibit-grid">${interaction.assets.map((src, index) => `<button class="dump-exhibit-button" type="button" data-action="open-dump-image" data-src="${escapeHtml(src)}" aria-label="Open question screenshot ${index + 1}"><span class="dump-exhibit-label">${interaction.assets.length > 1 ? `Panel ${String.fromCharCode(65 + index)}` : "Source page"}</span><img src="${escapeHtml(src)}" alt="Question screenshot ${index + 1}" loading="lazy"></button>`).join("")}</div></section>`;
  }

  function renderDumpFeedback(question, answer, interaction) {
    if (!answer.checked) return "";
    const unscored = answer.correct === null;
    const title = unscored ? "Review required — source option set is invalid or incomplete" : answer.correct ? "✓ Correct" : "✕ Incorrect — review the validated answer";
    const className = unscored ? "unscored" : answer.correct ? "correct" : "wrong";
    const answerText = ["single", "letter-choice"].includes(interaction.type) ? question.correctAnswer : interaction.type === "multi" ? (interaction.correctLabels || []).join(", ") : interaction.type === "yesno" ? (interaction.correct || []).join(", ") : (interaction.slots || []).map(item => `${item.label}: ${item.correct}`).join(" · ");
    const answerLabel = ["single", "letter-choice", "multi"].includes(interaction.type) ? "Correct validated answer:" : "Correct validated mapping:";
    return `<div class="dump-feedback ${className}"><h3>${title}</h3><p><strong>${answerLabel}</strong> ${escapeHtml(answerText || "See the validated mapping above.")}</p><p>${escapeHtml(question.explanation)}</p>${question.notes?.length ? `<div class="dump-note"><strong>Current-scope note:</strong> ${question.notes.map(escapeHtml).join(" ")}</div>` : ""}<div class="source-links">${dumpSourceLinks(question.refs)}</div></div>`;
  }

  function renderDumpInteraction(question, context = "library") {
    const interaction = getDumpInteraction(question);
    const answer = peekDumpAnswer(question);
    const locked = answer.checked;
    let controls = "";

    if (["single", "multi", "letter-choice"].includes(interaction.type)) {
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

    if (interaction.type === "review") {
      controls = `<div class="dump-source-review"><p><strong>Image-backed question.</strong> Review the complete source screenshot above, then reveal the independently corrected validation below. The original PDF answer is not used as the grading key for this item.</p></div>`;
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
      ["exam", "◷", "Practice Exam", "Real timed 40-question Microsoft-style exam with hidden answers until submission", "45 minutes", "#fb923c"],
      ["dump", "⚡", "DUMP Question Bank", `${DUMP_QUESTIONS.length} PDF-backed questions with source exhibits and interactive controls`, `${DUMP_QUESTIONS.length} questions`, "#fbbf24"],
      ["review", "↻", "Review Mistakes", "Focus on incorrect answers and saved questions", `${s.wrong} errors`, "#a78bfa"],
      ["analytics", "▥", "Exam Analytics", "Accuracy, attempts, timing, and progress by topic", `${s.accuracy}% accuracy`, "#31d0aa"],
      ["cheatsheet", "≡", "High-Yield Cheat Sheet", "Repeated concepts, guardrails, and exam hints", "Direct Lake + pitfalls", "#60a5fa"],
      ["bookmarks", "☆", "Saved Questions", "Return to questions you marked for review", `${state.bookmarks.length} saved`, "#fb7185"],
      ["sources", "↗", "Official Sources", `${Object.keys(SOURCES).length} Microsoft Learn references`, "Microsoft", "#34d399"]
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
          <p>Simulate the Microsoft DP-700 exam, practice the complete PDF-backed question bank, review mistakes, and use the focused cheat sheet with progress saved on your device.</p>
          <div class="hero__actions">
            <button class="btn btn--primary" type="button" data-route="exam">Start Practice Exam →</button>
            <button class="btn btn--secondary" type="button" data-route="dump">Open PDF question bank</button>
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
    const runs = Object.keys(PDF_SOURCE_LABELS).map(source => {
      const questions = DUMP_QUESTIONS.filter(question => question.sourceFile === source);
      const ids = questions.map(question => question.n);
      const progress = dumpRunStats(ids);
      const typeCounts = questions.reduce((counts, question) => {
        const type = getDumpInteraction(question).type;
        counts[type] = (counts[type] || 0) + 1;
        return counts;
      }, {});
      return { source, questions, ids, progress, typeCounts };
    });

    app.innerHTML = `
      <section class="dump-hero">
        <div><p class="eyebrow">REAL INTERACTIONS · CORRECTED ANSWER KEY</p><h1>DUMP <span class="gradient-text">Exam Runs</span></h1><p>Answer every item yourself. Single choice, multiple choice, Drag & Drop, dropdown Hotspot, and Yes/No Hotspot questions are rendered as real controls. The correct answer and explanation stay hidden until you press <strong>Check answer</strong>.</p><div class="hero__actions"><button class="btn btn--primary" type="button" data-action="dump-start-random">Start random 25 →</button><button class="btn btn--secondary" type="button" data-action="dump-start-full">Start all ${DUMP_QUESTIONS.length}</button><button class="btn btn--secondary" type="button" data-route="dump-library">Browse interactive bank</button>${state.activeDumpSession?.ids?.length && state.activeDumpSession.index < state.activeDumpSession.ids.length ? '<button class="btn btn--secondary" type="button" data-route="dump-drill">Resume current run</button>' : ""}</div></div>
        <div class="dump-score"><div><strong>${DUMP_QUESTIONS.length}</strong><span>INTERACTIVE QUESTIONS</span></div></div>
      </section>
      <section class="stats-grid">
        ${statCard("Answered", ds.attempted, "Across all DUMP runs", "◎", "#4f8cff")}
        ${statCard("Correct", ds.correct, `${percent(ds.correct, Math.max(1, ds.correct + ds.incorrect))}% scored accuracy`, "✓", "#31d0aa")}
        ${statCard("Needs review", ds.incorrect, "Incorrect answers", "!", "#fb7185")}
        ${statCard("Question types", 5, "Choice, Drag & Drop and Hotspots", "↔", "#fbbf24")}
      </section>
      <div class="setup-note"><strong>Scoring rule:</strong> All scored items use the independently corrected answer key. Nothing from the old supplied answer is shown before you submit your choice.</div>
      <div class="section-title"><div><h2>Choose a DUMP run</h2><p>Imported PDF questions are ordered DP-700N1 → DP-700N2 → DP-700N3; each item includes its source exhibit.</p></div></div>
      <section class="dump-run-grid">
        ${runs.map(run => {
          const pct = percent(run.progress.attempted, run.questions.length);
          const types = Object.entries(run.typeCounts).map(([type, count]) => `${count} ${dumpTypeLabel({ type, selectN: 2 }).split(" · ")[0]}`).join(" · ");
          return `<article class="dump-run-card"><div class="dump-run-card__top"><span class="dump-run-index">${PDF_SOURCE_LABELS[run.source]}</span><span class="tag">${run.questions.length} questions</span></div><h3>${PDF_SOURCE_LABELS[run.source]}</h3><p>${types}</p><div class="meter"><span style="width:${pct}%"></span></div><small>${run.progress.attempted}/${run.questions.length} answered · ${run.progress.correct} correct</small><button class="btn btn--primary btn--small" type="button" data-action="dump-start-run" data-source="${run.source}">${run.progress.attempted ? "Restart run" : "Start run"} →</button></article>`;
        }).join("")}
      </section>`;
  }

  function renderDumpLibrary() {
    const ds = dumpStats();
    const needle = dumpSearch.trim().toLowerCase();
    const filtered = DUMP_QUESTIONS.filter(question => {
      const matchesSearch = !needle || `${question.n} ${question.question} ${question.correctAnswer} ${question.explanation} ${question.conceptArea}`.toLowerCase().includes(needle);
      const matchesBatch = dumpBatch === "all" || question.batch === Number(dumpBatch);
      const matchesSource = dumpSource === "all" || question.sourceFile === dumpSource;
      const matchesStatus = dumpStatus === "all" || question.status.toLowerCase() === dumpStatus;
      const progress = state.dumpProgress[question.n] || "untracked";
      const matchesProgress = dumpProgressFilter === "all" || progress === dumpProgressFilter;
      return matchesSearch && matchesBatch && matchesSource && matchesStatus && matchesProgress;
    });
    const pageSize = 4;
    const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
    dumpPage = Math.max(1, Math.min(dumpPage, pageCount));
    const pageItems = filtered.slice((dumpPage - 1) * pageSize, dumpPage * pageSize);

    app.innerHTML = `
      <section class="dump-hero">
        <div><p class="eyebrow">INTERACTIVE QUESTION BANK · ANSWERS HIDDEN UNTIL CHECKED</p><h1>DUMP <span class="gradient-text">${DUMP_QUESTIONS.length}</span></h1><p>Use the controls under every question to answer it. The validated answer and explanation appear only after you press <strong>Check answer</strong>.</p><div class="hero__actions"><button class="btn btn--primary" type="button" data-route="dump">Choose an exam run →</button><button class="btn btn--secondary" type="button" data-action="dump-review-filter">Review queue (${ds.review})</button></div></div>
        <div class="dump-score"><div><strong>${DUMP_QUESTIONS.length}</strong><span>INTERACTIVE ITEMS</span></div></div>
      </section>
      <section class="stats-grid">
        ${statCard("Attempted", ds.attempted, `${percent(ds.attempted, DUMP_QUESTIONS.length)}% of the imported bank`, "◎", "#4f8cff")}
        ${statCard("Correct", ds.correct, `${percent(ds.correct, Math.max(1, ds.correct + ds.incorrect))}% scored accuracy`, "✓", "#31d0aa")}
        ${statCard("Incorrect", ds.incorrect, "Automatically added to review", "!", "#fb7185")}
        ${statCard("Unscored", ds.unscored, "Invalid or incomplete source options", "?", "#fbbf24")}
      </section>
      <div class="setup-note"><strong>Validated answer key:</strong> ${escapeHtml(DUMP_DATA.meta.validatedThrough || "18 July 2026")}. Questions 53, 56, 89, 100, and 103 remain unscored because their source choices are missing, invalid, or underspecified.</div>
      <div class="toolbar">
        <label class="search-field"><span aria-hidden="true">⌕</span><input id="dumpSearch" type="search" value="${escapeHtml(dumpSearch)}" placeholder="Search question text, concept, answer, or explanation..." aria-label="Search DUMP questions"></label>
        <select class="select-field" id="dumpBatch" aria-label="Filter by batch"><option value="all">All batches</option>${[1,2,3,4,5].map(batch => `<option value="${batch}" ${dumpBatch === String(batch) ? "selected" : ""}>Batch ${batch}</option>`).join("")}</select>
        <select class="select-field" id="dumpSource" aria-label="Filter by source file"><option value="all">All PDF files</option>${Object.keys(PDF_SOURCE_LABELS).map(source => `<option value="${source}" ${dumpSource === source ? "selected" : ""}>${PDF_SOURCE_LABELS[source]}</option>`).join("")}</select>
        <select class="select-field" id="dumpProgress" aria-label="Filter by study progress"><option value="all">All study states</option><option value="untracked" ${dumpProgressFilter === "untracked" ? "selected" : ""}>Untracked</option><option value="mastered" ${dumpProgressFilter === "mastered" ? "selected" : ""}>Mastered</option><option value="review" ${dumpProgressFilter === "review" ? "selected" : ""}>Review queue</option></select>
      </div>
      <div class="section-title"><div><h2>${filtered.length} matching questions</h2><p>Page ${dumpPage} of ${pageCount}</p></div></div>
      <section class="dump-list">
        ${pageItems.map(question => {
          const progress = state.dumpProgress[question.n] || "untracked";
          const interaction = getDumpInteraction(question);
          return `<article class="dump-card" id="dump-${question.n}">
            <div class="dump-card__head"><div class="dump-card__head-group"><span class="dump-card__number">#${question.n}</span><span class="tag">${question.sourceFile ? PDF_SOURCE_LABELS[question.sourceFile] : `Run ${question.batch}`}</span><span class="tag">${dumpTypeLabel(interaction)}</span></div><span class="tag">${escapeHtml(question.conceptArea || "DP-700")}</span></div>
            <div class="dump-card__body"><p class="dump-question">${escapeHtml(dumpDisplayPrompt(question, interaction))}</p>
              ${renderDumpInteraction(question, "library")}
              <div class="dump-card__actions"><div><button class="btn btn--secondary btn--small bookmark-button ${state.bookmarks.includes(question.n) ? "active" : ""}" type="button" data-action="bookmark" data-id="${question.n}">${state.bookmarks.includes(question.n) ? "★ Saved" : "☆ Save question"}</button></div><div><button class="btn btn--secondary btn--small dump-progress ${progress === "mastered" ? "mastered" : ""}" type="button" data-action="dump-rate" data-value="mastered" data-id="${question.n}">✓ Mastered</button><button class="btn btn--secondary btn--small dump-progress ${progress === "review" ? "review" : ""}" type="button" data-action="dump-rate" data-value="review" data-id="${question.n}">↻ Review later</button></div></div>
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
    app.innerHTML = `<section class="quiz-shell"><div class="quiz-top"><div><p class="eyebrow">${escapeHtml(session.label || "INTERACTIVE DUMP RUN")}</p><span class="question-number">Question ${session.index + 1} of ${session.ids.length}</span></div><div class="hero__actions"><button class="btn btn--secondary btn--small bookmark-button ${state.bookmarks.includes(question.n) ? "active" : ""}" type="button" data-action="bookmark" data-id="${question.n}">${state.bookmarks.includes(question.n) ? "★ Saved" : "☆ Save question"}</button><button class="btn btn--secondary btn--small" type="button" data-route="dump">Exit run</button></div></div><div class="quiz-progress"><span style="width:${percent(session.index + 1, session.ids.length)}%"></span></div><div class="question-tags"><span class="tag">DUMP #${question.n}</span><span class="tag">${question.sourceFile ? PDF_SOURCE_LABELS[question.sourceFile] : `Run ${question.batch}`}</span><span class="tag">${dumpTypeLabel(interaction)}</span><span class="tag">Corrected answer key</span></div><h1 class="question-text" style="white-space:pre-wrap">${escapeHtml(dumpDisplayPrompt(question, interaction))}</h1>${renderDumpInteraction(question, "drill")}<div class="quiz-actions"><button class="btn btn--secondary" type="button" data-action="dump-drill-prev" ${session.index === 0 ? "disabled" : ""}>← Previous</button><button class="btn btn--primary" type="button" data-action="dump-drill-next" ${answer.checked ? "" : "disabled"}>${session.index === session.ids.length - 1 ? "Finish run" : "Next question →"}</button></div><div class="dump-palette" aria-label="DUMP question navigation">${palette}</div></section>`;
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
      <div class="setup-note"><strong>Independent section:</strong> This embedded practice bank contains its own runs, grading, custom-question tools, and backup controls. Its answers are not used to score the imported PDF question bank.</div>
      <section class="important-shell"><iframe class="important-frame" src="./important/DP700_Practice_Exam.html?v=7" title="DP-700 IMPORTANT practice exam" sandbox="allow-scripts allow-same-origin allow-downloads allow-modals"></iframe></section>`;
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

  function renderArabicResources() {
    const official = ARABIC_LEARNING.resources?.official || [];
    const videos = ARABIC_LEARNING.resources?.videos || [];
    if (!official.length && !videos.length) return "";
    return `<section class="arabic-support" dir="rtl" aria-labelledby="arabic-support-title">
      <div class="arabic-support__mark" aria-hidden="true">ع</div>
      <div class="arabic-support__content">
        <p class="arabic-kicker">دعم الشرح بالعربي</p>
        <h2 id="arabic-support-title">افهمي بالعربي، واحفظي المصطلحات بالإنجليزي</h2>
        <p>كل درس يحتوي على زر <strong>شرح عربي</strong> يوضح الفكرة والـExam trap، بينما تظل أسماء الأدوات والأسئلة بالإنجليزي لتطابق صياغة الاختبار.</p>
        <div class="arabic-support__groups">
          <div><strong>مصادر Microsoft الرسمية</strong><div class="arabic-resource-links">${official.map(item => `<a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.title)} ↗</a>`).join("")}</div></div>
          <div><strong>فيديوهات عربية مساعدة</strong><div class="arabic-resource-links">${videos.map(item => `<a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.title)} ↗</a>`).join("")}</div></div>
        </div>
      </div>
    </section>`;
  }

  function renderArabicExplanation(lesson) {
    const content = ARABIC_LEARNING.lessons?.[lesson.id];
    if (!content || !state.arabicOpenLessons.includes(lesson.id)) return "";
    return `<section class="arabic-explanation" id="arabic-${lesson.id}" dir="rtl" lang="ar">
      <div class="arabic-explanation__head"><div><span>شرح عربي مبسط</span><h2>${escapeHtml(content.title)}</h2></div><button class="btn btn--secondary btn--small" type="button" data-action="toggle-arabic" data-id="${lesson.id}">إخفاء الشرح</button></div>
      <p class="arabic-explanation__summary">${escapeHtml(content.summary)}</p>
      <div class="arabic-memory"><span>طريقة سهلة للحفظ</span><strong>${escapeHtml(content.memoryHook)}</strong></div>
      <div class="arabic-explanation__grid"><div><h3>النقط المهمة</h3><ul>${content.points.map(point => `<li>${escapeHtml(point)}</li>`).join("")}</ul></div><aside><span>انتبهِي في الامتحان</span><p>${escapeHtml(content.trap)}</p></aside></div>
      <p class="arabic-explanation__note">الـQuick Check والمصطلحات الأساسية يظلان بالإنجليزي حتى تتعودي على صياغة الامتحان.</p>
    </section>`;
  }

  function courseModuleClass(domain) {
    if (domain === "Implement & Manage") return "manage";
    if (domain === "Ingest & Transform") return "ingest";
    if (domain === "Monitor & Optimize") return "monitor";
    if (domain === "Mixed") return "mixed";
    return "foundation";
  }

  function parseCourseActivity(entry) {
    const separator = entry.lastIndexOf("|");
    return separator === -1 ? { title: entry, duration: "" } : { title: entry.slice(0, separator), duration: entry.slice(separator + 1) };
  }

  function validCourseProgress(module) {
    const saved = Array.isArray(state.courseLectureProgress?.[module.id]) ? state.courseLectureProgress[module.id] : [];
    return unique(saved.map(Number)).filter(index => Number.isInteger(index) && index >= 0 && index < module.lectures.length);
  }

  function courseStats() {
    const activities = COURSE.modules.reduce((sum, module) => sum + module.lectures.length, 0);
    const completed = COURSE.modules.reduce((sum, module) => sum + validCourseProgress(module).length, 0);
    const modulesComplete = COURSE.modules.filter(module => validCourseProgress(module).length === module.lectures.length).length;
    const minutes = COURSE.modules.reduce((sum, module) => sum + module.lectures.reduce((moduleSum, entry) => {
      const duration = parseCourseActivity(entry).duration;
      if (!/^\d+:\d+$/.test(duration)) return moduleSum;
      const [minute, second] = duration.split(":").map(Number);
      return moduleSum + minute + (second / 60);
    }, 0), 0);
    return { activities, completed, modulesComplete, minutes: Math.round(minutes), percent: percent(completed, activities) };
  }

  function relatedQuestionMetrics(module) {
    const ids = unique((module?.questionIds || []).filter(questionId => getQuestion(questionId)));
    const attempted = ids.filter(questionId => state.answers[questionId]);
    const correct = attempted.filter(questionId => state.answers[questionId]?.correct);
    return {
      total: ids.length,
      attempted: attempted.length,
      correct: correct.length,
      accuracy: attempted.length ? Math.round((correct.length / attempted.length) * 100) : 0,
      required: Math.min(5, ids.length)
    };
  }

  function bestAssessmentScore(moduleId) {
    const attempts = professionalState.assessmentAttempts?.[moduleId] || [];
    return attempts.reduce((best, attempt) => Math.max(best, Number(attempt.score || 0)), 0);
  }

  function challengeComplete(moduleId) {
    return Boolean(professionalState.challengeProgress?.[moduleId]?.completed);
  }

  function moduleMasterySummary(module) {
    const activityProgress = validCourseProgress(module);
    const activityPercent = percent(activityProgress.length, module.lectures.length);
    const guidedLab = state.courseCompletedLabs.includes(module.id);
    const challenge = challengeComplete(module.id);
    const assessment = bestAssessmentScore(module.id);
    const questions = relatedQuestionMetrics(module);
    const reflection = String(professionalState.moduleReflections?.[module.id] || "").trim();
    const questionReady = questions.total === 0 || (questions.attempted >= questions.required && questions.accuracy >= 80);
    let level = "not-started";
    if (activityPercent > 0) level = "studied";
    if (activityPercent === 100 && guidedLab) level = "practiced";
    if (activityPercent === 100 && guidedLab && assessment >= 80 && questionReady) level = "exam-ready";
    if (activityPercent === 100 && guidedLab && assessment >= 80 && questionReady && challenge && reflection.length >= 40) level = "professional";
    const levelData = (PRO_PATH.masteryLevels || []).find(item => item.id === level) || { label: level, description: "" };
    return { activityPercent, guidedLab, challenge, assessment, questions, reflection, level, label: levelData.label, description: levelData.description };
  }

  function lessonMasterySummary(module, lesson, completed) {
    const questions = relatedQuestionMetrics(module);
    const practice = Boolean(professionalState.lessonPractice?.[lesson.id]);
    const scenario = Boolean(professionalState.lessonScenario?.[lesson.id]);
    const rationale = String(professionalState.lessonRationales?.[lesson.id] || "").trim();
    const questionReady = questions.total === 0 || (questions.attempted >= questions.required && questions.accuracy >= 80);
    let level = "not-started";
    if (completed) level = "studied";
    if (completed && practice) level = "practiced";
    if (completed && practice && questionReady) level = "exam-ready";
    if (completed && practice && questionReady && scenario && rationale.length >= 30) level = "professional";
    const levelData = (PRO_PATH.masteryLevels || []).find(item => item.id === level) || { label: level, description: "" };
    return { completed, practice, scenario, rationale, questions, questionReady, level, label: levelData.label, description: levelData.description };
  }

  function masteryBadge(level, label) {
    return `<span class="mastery-badge mastery-badge--${escapeHtml(level)}">${escapeHtml(label)}</span>`;
  }

  function professionalStats() {
    const bootcampTotal = PRO_PATH.bootcamp?.length || 0;
    const bootcampDone = (PRO_PATH.bootcamp || []).filter(item => professionalState.bootcampCompleted.includes(item.id)).length;
    const challengeTotal = PRO_PATH.challengeLabs?.length || 0;
    const challengeDone = (PRO_PATH.challengeLabs || []).filter(item => challengeComplete(item.moduleId)).length;
    const troubleTotal = PRO_PATH.troubleshootingLabs?.length || 0;
    const troubleDone = (PRO_PATH.troubleshootingLabs || []).filter(item => professionalState.troubleshootingProgress?.[item.id]?.completed).length;
    const decisionsTotal = PRO_PATH.decisionScenarios?.length || 0;
    const decisionsDone = Object.values(professionalState.decisionProgress || {}).filter(item => item?.correct).length;
    const projectTotal = PRO_PATH.projects?.length || 0;
    const projectDone = (PRO_PATH.projects || []).filter(item => professionalState.projectProgress?.[item.id]?.completed).length;
    const assessmentsPassed = COURSE.modules.filter(module => bestAssessmentScore(module.id) >= 80).length;
    const modulesMastered = COURSE.modules.filter(module => moduleMasterySummary(module).level === "professional").length;
    return { bootcampTotal, bootcampDone, challengeTotal, challengeDone, troubleTotal, troubleDone, decisionsTotal, decisionsDone, projectTotal, projectDone, assessmentsPassed, modulesMastered };
  }

  function diagnosticRecommendation(score) {
    if (score < Number(PRO_PATH.diagnostic?.thresholds?.foundation || 50)) return { id: "foundation", label: "Foundation Path", text: "Complete the full prerequisite bootcamp before Module 1." };
    if (score < Number(PRO_PATH.diagnostic?.thresholds?.standard || 75)) return { id: "standard", label: "Standard Path", text: "Review the weak prerequisite topics, then follow all 15 modules in order." };
    return { id: "fast", label: "Fast Track", text: "Start the professional course and use the bootcamp only for topics identified as weak." };
  }

  function renderProfessionalPath() {
    const statsV9 = professionalStats();
    const score = professionalState.diagnosticResult?.score;
    const recommendation = score === undefined || score === null ? null : diagnosticRecommendation(score);
    app.innerHTML = `
      ${pageHead("V9 PROFESSIONAL PATH", "From Foundation to Professional Mastery", "Study, build, diagnose, decide, and defend complete Microsoft Fabric solutions—not only exam answers.")}
      <section class="pro-path-hero"><div><p class="eyebrow">YOUR RECOMMENDED PATH</p><h2>${recommendation ? escapeHtml(recommendation.label) : "Start with the diagnostic"}</h2><p>${recommendation ? escapeHtml(recommendation.text) : "The diagnostic checks SQL, Python, Spark, KQL, data engineering, Fabric, security, and Git foundations."}</p><div class="hero__actions"><button class="btn btn--primary" type="button" data-route="bootcamp">${recommendation ? "Review bootcamp" : "Take diagnostic"} →</button><button class="btn btn--secondary" type="button" data-route="mastery">Open mastery dashboard</button></div></div><div class="pro-path-score"><strong>${score ?? "—"}${score !== undefined && score !== null ? "%" : ""}</strong><span>diagnostic score</span></div></section>
      <section class="pro-path-grid">
        <button type="button" data-route="bootcamp"><span>01</span><h3>Foundation Bootcamp</h3><p>Diagnostic plus SQL, Python, Spark, KQL, Fabric, data engineering, and Git prerequisites.</p><strong>${statsV9.bootcampDone}/${statsV9.bootcampTotal} complete →</strong></button>
        <button type="button" data-route="mastery"><span>02</span><h3>Mastery Gates</h3><p>Track Studied, Practiced, Exam Ready, and Professionally Mastered evidence.</p><strong>${statsV9.modulesMastered}/${COURSE.modules.length} modules mastered →</strong></button>
        <button type="button" data-route="challenges"><span>03</span><h3>Independent Challenges</h3><p>One non-guided architecture or implementation challenge for every course module.</p><strong>${statsV9.challengeDone}/${statsV9.challengeTotal} complete →</strong></button>
        <button type="button" data-route="troubleshooting"><span>04</span><h3>Troubleshooting Labs</h3><p>Investigate symptoms, logs, root cause, repair, and prevention.</p><strong>${statsV9.troubleDone}/${statsV9.troubleTotal} complete →</strong></button>
        <button type="button" data-route="decision-lab"><span>05</span><h3>Decision Simulator</h3><p>Choose stores, engines, triggers, security layers, and optimization actions.</p><strong>${statsV9.decisionsDone}/${statsV9.decisionsTotal} solved →</strong></button>
        <button type="button" data-route="projects"><span>06</span><h3>End-to-End Projects</h3><p>Batch platform, enterprise Warehouse, and Real-Time Intelligence portfolio projects.</p><strong>${statsV9.projectDone}/${statsV9.projectTotal} complete →</strong></button>
      </section>
      <section class="mastery-scale"><div><p class="eyebrow">EVIDENCE-BASED PROGRESSION</p><h2>Reading is only the first gate</h2></div><div>${(PRO_PATH.masteryLevels || []).map((item, index) => `<article><span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(item.label)}</strong><p>${escapeHtml(item.description)}</p></article>`).join("")}</div></section>
      <section class="professional-journey"><p class="eyebrow">RECOMMENDED LEARNING ORDER</p><div>${["Diagnostic", "Prerequisites", "Lesson", "Guided Lab", "Independent Challenge", "Mapped Questions", "Module Assessment", "Project", "Weak-Area Review", "DUMP", "IMPORTANT", "Full Mock"].map((item, index, list) => `<span>${escapeHtml(item)}</span>${index < list.length - 1 ? "<i>→</i>" : ""}`).join("")}</div></section>`;
  }

  function diagnosticGroupScores() {
    const questions = PRO_PATH.diagnostic?.questions || [];
    return (PRO_PATH.diagnostic?.groups || []).map(group => {
      const correct = group.indexes.filter(index => Number(professionalState.diagnosticAnswers?.[index]) === questions[index]?.answer).length;
      return { ...group, correct, total: group.indexes.length, score: percent(correct, group.indexes.length) };
    });
  }

  function renderBootcamp() {
    const questions = PRO_PATH.diagnostic?.questions || [];
    const answered = Object.keys(professionalState.diagnosticAnswers || {}).length;
    const result = professionalState.diagnosticResult;
    const recommendation = result ? diagnosticRecommendation(result.score) : null;
    const groupScores = result ? diagnosticGroupScores() : [];
    app.innerHTML = `
      ${pageHead("PREREQUISITES", "DP-700 Foundation Bootcamp", "Use the diagnostic to select a Foundation, Standard, or Fast-Track path before advanced Fabric lessons.", '<button class="btn btn--secondary" type="button" data-route="professional">Professional path</button>')}
      <section class="diagnostic-panel"><div class="course-section-head"><div><p class="eyebrow">18-QUESTION DIAGNOSTIC</p><h2>${escapeHtml(PRO_PATH.diagnostic?.title || "Foundation diagnostic")}</h2><p>Answers are stored locally and do not affect the protected Practice, DUMP, or IMPORTANT banks.</p></div><strong>${answered}/${questions.length} answered</strong></div>
        ${result ? `<div class="diagnostic-result"><strong>${result.score}%</strong><div><h3>${escapeHtml(recommendation.label)}</h3><p>${escapeHtml(recommendation.text)}</p><div class="diagnostic-skills">${groupScores.map(group => `<span class="${group.score >= 75 ? "strong" : group.score >= 50 ? "review" : "weak"}">${escapeHtml(group.label)} ${group.score}%</span>`).join("")}</div></div><button class="btn btn--secondary btn--small" type="button" data-action="diagnostic-reset">Retake</button></div>` : ""}
        <div class="diagnostic-questions">${questions.map((item, questionIndex) => `<fieldset><legend><span>${String(questionIndex + 1).padStart(2, "0")}</span>${escapeHtml(item.question)}</legend><div>${item.options.map((option, optionIndex) => `<label><input type="radio" name="diagnostic-${questionIndex}" value="${optionIndex}" data-diagnostic-index="${questionIndex}" ${Number(professionalState.diagnosticAnswers?.[questionIndex]) === optionIndex ? "checked" : ""} ${result ? "disabled" : ""}> <span>${LETTERS[optionIndex]}</span>${escapeHtml(option)}</label>`).join("")}</div>${result ? `<p class="diagnostic-explanation ${Number(professionalState.diagnosticAnswers?.[questionIndex]) === item.answer ? "correct" : "wrong"}"><strong>${Number(professionalState.diagnosticAnswers?.[questionIndex]) === item.answer ? "✓ Correct" : `Correct: ${LETTERS[item.answer]}`}</strong> ${escapeHtml(item.why)}</p>` : ""}</fieldset>`).join("")}</div>
        <div class="hero__actions"><button class="btn btn--primary" type="button" data-action="diagnostic-submit" ${answered < questions.length ? "disabled" : ""}>Calculate my path</button><button class="btn btn--secondary" type="button" data-route="course">Open course</button></div>
      </section>
      <div class="section-title"><div><h2>Prerequisite learning blocks</h2><p>Complete all blocks for the Foundation Path, or only identified gaps for Standard/Fast Track.</p></div><strong>${professionalState.bootcampCompleted.length}/${PRO_PATH.bootcamp?.length || 0}</strong></div>
      <section class="bootcamp-grid">${(PRO_PATH.bootcamp || []).map(item => { const done = professionalState.bootcampCompleted.includes(item.id); return `<article class="${done ? "completed" : ""}"><div class="bootcamp-card__head"><span>${escapeHtml(item.icon)}</span><div><h3>${escapeHtml(item.title)}</h3><small>${item.minutes} min</small></div></div><p>${escapeHtml(item.description)}</p><ul>${item.skills.map(skill => `<li>${escapeHtml(skill)}</li>`).join("")}</ul><div class="bootcamp-challenge"><strong>Exit challenge</strong><p>${escapeHtml(item.challenge)}</p></div><button class="btn ${done ? "btn--success" : "btn--secondary"}" type="button" data-action="bootcamp-toggle" data-id="${item.id}">${done ? "✓ Completed" : "Mark prerequisite complete"}</button></article>`; }).join("")}</section>`;
  }

  function renderMasteryDashboard() {
    const summaries = COURSE.modules.map(module => ({ module, mastery: moduleMasterySummary(module) }));
    const mastered = summaries.filter(item => item.mastery.level === "professional").length;
    app.innerHTML = `
      ${pageHead("MASTERY", "Evidence-Based Mastery Dashboard", "A module is Professionally Mastered only after study, guided practice, mapped-question performance, an independent challenge, and a written design rationale.", '<button class="btn btn--secondary" type="button" data-route="professional">Professional path</button>')}
      <section class="mastery-overview"><div><strong>${mastered}</strong><span>professionally mastered</span></div><div><strong>${summaries.filter(item => ["exam-ready","professional"].includes(item.mastery.level)).length}</strong><span>exam ready</span></div><div><strong>${summaries.filter(item => item.mastery.guidedLab).length}</strong><span>guided labs complete</span></div><div><strong>${summaries.filter(item => item.mastery.challenge).length}</strong><span>independent challenges</span></div></section>
      <section class="mastery-module-list">${summaries.map(({ module, mastery }) => `<article><div class="mastery-module__head"><div><span>MODULE ${String(module.number).padStart(2, "0")}</span><h3>${escapeHtml(module.title)}</h3></div>${masteryBadge(mastery.level, mastery.label)}</div><div class="mastery-evidence"><span class="${mastery.activityPercent === 100 ? "done" : ""}">Study ${mastery.activityPercent}%</span><span class="${mastery.guidedLab ? "done" : ""}">Guided lab</span><span class="${mastery.questions.accuracy >= 80 && mastery.questions.attempted >= mastery.questions.required ? "done" : ""}">Questions ${mastery.questions.accuracy}% (${mastery.questions.attempted}/${mastery.questions.total})</span><span class="${mastery.assessment >= 80 ? "done" : ""}">Assessment ${mastery.assessment}%</span><span class="${mastery.challenge ? "done" : ""}">Challenge</span><span class="${mastery.reflection.length >= 40 ? "done" : ""}">Rationale</span></div><div class="mastery-actions"><button class="btn btn--secondary btn--small" type="button" data-route="course/module/${module.id}">Open module</button><button class="btn btn--secondary btn--small" type="button" data-route="challenge/${module.id}">Challenge</button><button class="btn btn--primary btn--small" type="button" data-route="module-assessment/${module.id}">Assessment</button></div><label class="mastery-reflection"><span>Why would you choose this module’s tools in a real solution?</span><textarea id="module-reflection-${module.id}" rows="2" placeholder="Write at least 40 characters explaining requirements and trade-offs...">${escapeHtml(mastery.reflection)}</textarea><button class="btn btn--secondary btn--small" type="button" data-action="module-reflection-save" data-id="${module.id}">Save rationale</button></label></article>`).join("")}</section>`;
  }

  function renderChallenges() {
    const challenges = PRO_PATH.challengeLabs || [];
    app.innerHTML = `
      ${pageHead("INDEPENDENT PRACTICE", "Module Challenge Labs", "The guided lab teaches the steps. These challenges provide requirements and deliverables without showing the implementation sequence.", '<button class="btn btn--secondary" type="button" data-route="professional">Professional path</button>')}
      <section class="challenge-grid">${challenges.map((challenge, index) => { const progress = professionalState.challengeProgress?.[challenge.moduleId] || {}; return `<button type="button" data-route="challenge/${challenge.moduleId}" class="${progress.completed ? "completed" : ""}"><span>${String(index + 1).padStart(2, "0")}</span><h3>${escapeHtml(challenge.title)}</h3><p>${escapeHtml(challenge.scenario)}</p><strong>${progress.completed ? "✓ Completed" : `${(progress.steps || []).length}/${challenge.deliverables.length} deliverables`} →</strong></button>`; }).join("")}</section>`;
  }

  function renderChallenge(moduleId) {
    const challenge = (PRO_PATH.challengeLabs || []).find(item => item.moduleId === moduleId);
    const module = COURSE.modules.find(item => item.id === moduleId);
    if (!challenge || !module) return renderChallenges();
    const progress = professionalState.challengeProgress?.[moduleId] || { steps: [], completed: false, hint: false, solution: false };
    app.innerHTML = `
      <div class="lesson-breadcrumb"><button type="button" data-route="challenges">Challenges</button><span>›</span><button type="button" data-route="course/module/${module.id}">${escapeHtml(module.title)}</button><span>›</span><strong>${escapeHtml(challenge.title)}</strong></div>
      <section class="challenge-hero"><div><p class="eyebrow">INDEPENDENT CHALLENGE · MODULE ${String(module.number).padStart(2, "0")}</p><h1>${escapeHtml(challenge.title)}</h1><p>${escapeHtml(challenge.scenario)}</p></div>${masteryBadge(progress.completed ? "professional" : "practiced", progress.completed ? "Completed" : "In progress")}</section>
      <section class="challenge-layout"><article><p class="eyebrow">REQUIREMENTS</p><h2>What the solution must achieve</h2><ul>${challenge.requirements.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article><article><p class="eyebrow">DELIVERABLES</p><h2>Evidence to produce</h2><div class="challenge-checklist">${challenge.deliverables.map((item, index) => `<label><input type="checkbox" data-challenge-step="${index}" data-id="${moduleId}" ${progress.steps?.includes(index) ? "checked" : ""}> <span>${escapeHtml(item)}</span></label>`).join("")}</div></article></section>
      <section class="challenge-assistance"><div><p class="eyebrow">OPTIONAL SUPPORT</p><h2>Use support only after attempting</h2><div class="hero__actions"><button class="btn btn--secondary" type="button" data-action="challenge-hint" data-id="${moduleId}">${progress.hint ? "Hide hints" : "Reveal hints"}</button><button class="btn btn--secondary" type="button" data-action="challenge-solution" data-id="${moduleId}" ${(progress.steps || []).length === 0 ? "disabled" : ""}>${progress.solution ? "Hide reference solution" : "Reveal reference solution"}</button></div></div>${progress.hint ? `<aside><strong>Hints</strong><ul>${challenge.hints.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></aside>` : ""}${progress.solution ? `<aside class="solution"><strong>Reference approach</strong><p>${escapeHtml(challenge.solution)}</p></aside>` : ""}</section>
      <div class="quiz-actions lesson-finish"><button class="btn btn--secondary" type="button" data-route="challenges">← All challenges</button><button class="btn ${progress.completed ? "btn--success" : "btn--primary"}" type="button" data-action="challenge-complete" data-id="${moduleId}" ${(progress.steps || []).length < challenge.deliverables.length ? "disabled" : ""}>${progress.completed ? "✓ Challenge completed" : "Complete challenge"}</button></div>`;
  }

  function renderTroubleshooting() {
    const labs = PRO_PATH.troubleshootingLabs || [];
    app.innerHTML = `
      ${pageHead("DEBUGGING", "Troubleshooting Labs", "Start from symptoms and evidence, identify the most likely root cause, then repair and prevent recurrence.", '<button class="btn btn--secondary" type="button" data-route="professional">Professional path</button>')}
      <section class="trouble-grid">${labs.map((lab, index) => { const progress = professionalState.troubleshootingProgress?.[lab.id] || {}; return `<button type="button" data-route="troubleshooting/${lab.id}" class="${progress.completed ? "completed" : ""}"><span>${String(index + 1).padStart(2, "0")}</span><h3>${escapeHtml(lab.title)}</h3><p>${escapeHtml(lab.symptom)}</p><small>${lab.moduleIds.map(id => COURSE.modules.find(module => module.id === id)?.title).filter(Boolean).join(" · ")}</small><strong>${progress.completed ? "✓ Repaired" : "Investigate →"}</strong></button>`; }).join("")}</section>`;
  }

  function renderTroubleshootingLab(labId) {
    const lab = (PRO_PATH.troubleshootingLabs || []).find(item => item.id === labId);
    if (!lab) return renderTroubleshooting();
    const progress = professionalState.troubleshootingProgress?.[labId] || { selected: null, checked: false, completed: false, solution: false };
    app.innerHTML = `
      <div class="lesson-breadcrumb"><button type="button" data-route="troubleshooting">Troubleshooting Labs</button><span>›</span><strong>${escapeHtml(lab.title)}</strong></div>
      <section class="trouble-hero"><p class="eyebrow">BROKEN SOLUTION</p><h1>${escapeHtml(lab.title)}</h1><p>${escapeHtml(lab.symptom)}</p></section>
      <section class="trouble-evidence"><div><p class="eyebrow">EVIDENCE</p><h2>What you can observe</h2><ul>${lab.evidence.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div><div><p class="eyebrow">INVESTIGATION TASKS</p><h2>What you must prove</h2><ol>${lab.tasks.map((item, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(item)}</li>`).join("")}</ol></div></section>
      <section class="root-cause-panel"><p class="eyebrow">ROOT CAUSE</p><h2>Select the most likely cause</h2><div>${lab.causes.map((cause, index) => { let cls = ""; if (progress.checked) cls = index === lab.answer ? "correct" : Number(progress.selected) === index ? "wrong" : ""; return `<label class="${cls}"><input type="radio" name="trouble-${lab.id}" value="${index}" data-trouble-id="${lab.id}" ${Number(progress.selected) === index ? "checked" : ""} ${progress.checked ? "disabled" : ""}><span>${LETTERS[index]}</span>${escapeHtml(cause)}</label>`; }).join("")}</div>${progress.checked ? `<p class="root-cause-result ${Number(progress.selected) === lab.answer ? "correct" : "wrong"}"><strong>${Number(progress.selected) === lab.answer ? "✓ Correct root cause" : `Correct cause: ${LETTERS[lab.answer]}`}</strong></p>` : `<button class="btn btn--primary" type="button" data-action="trouble-submit" data-id="${lab.id}" ${progress.selected === null || progress.selected === undefined ? "disabled" : ""}>Check root cause</button>`}</section>
      ${progress.checked ? `<section class="challenge-assistance"><div><p class="eyebrow">REPAIR AND PREVENTION</p><h2>Compare your approach</h2><button class="btn btn--secondary" type="button" data-action="trouble-solution" data-id="${lab.id}">${progress.solution ? "Hide solution" : "Reveal solution"}</button></div>${progress.solution ? `<aside class="solution"><p>${escapeHtml(lab.solution)}</p></aside>` : ""}</section><div class="quiz-actions lesson-finish"><button class="btn btn--secondary" type="button" data-route="troubleshooting">← All labs</button><button class="btn ${progress.completed ? "btn--success" : "btn--primary"}" type="button" data-action="trouble-complete" data-id="${lab.id}">${progress.completed ? "✓ Lab completed" : "Mark repaired"}</button></div>` : ""}`;
  }

  function renderDecisionLab() {
    const scenarios = PRO_PATH.decisionScenarios || [];
    if (!scenarios.length) return renderProfessionalPath();
    const index = Math.min(Math.max(0, Number(professionalState.decisionIndex || 0)), scenarios.length - 1);
    const scenario = scenarios[index];
    const progress = professionalState.decisionProgress?.[scenario.id] || { selected: null, checked: false, correct: false };
    app.innerHTML = `
      ${pageHead("ARCHITECTURE DECISIONS", "Fabric Decision Simulator", "Identify the requirement keyword, choose the nearest tool, and explain why every alternative solves the wrong layer.", '<button class="btn btn--secondary" type="button" data-route="professional">Professional path</button>')}
      <section class="decision-progress"><span>Scenario ${index + 1} of ${scenarios.length}</span><div class="meter"><span style="width:${percent(index + 1, scenarios.length)}%"></span></div></section>
      <section class="decision-scenario"><p class="eyebrow">${escapeHtml(scenario.title)}</p><h1>${escapeHtml(scenario.scenario)}</h1><div class="decision-options">${scenario.options.map((option, optionIndex) => { let cls = Number(progress.selected) === optionIndex ? "selected" : ""; if (progress.checked) cls += optionIndex === scenario.answer ? " correct" : Number(progress.selected) === optionIndex ? " wrong" : ""; return `<button class="${cls}" type="button" data-action="decision-lab-select" data-id="${scenario.id}" data-value="${optionIndex}" ${progress.checked ? "disabled" : ""}><span>${LETTERS[optionIndex]}</span><strong>${escapeHtml(option)}</strong></button>`; }).join("")}</div>${progress.checked ? `<div class="decision-explanation ${progress.correct ? "correct" : "wrong"}"><strong>${progress.correct ? "✓ Correct decision" : `Correct: ${LETTERS[scenario.answer]} · ${escapeHtml(scenario.options[scenario.answer])}`}</strong><p>${escapeHtml(scenario.why)}</p><ul>${scenario.wrong.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>` : ""}<div class="quiz-actions"><button class="btn btn--secondary" type="button" data-action="decision-lab-prev" ${index === 0 ? "disabled" : ""}>← Previous</button>${progress.checked ? `<button class="btn btn--primary" type="button" data-action="decision-lab-next">${index === scenarios.length - 1 ? "Restart simulator" : "Next scenario →"}</button>` : `<button class="btn btn--primary" type="button" data-action="decision-lab-submit" data-id="${scenario.id}" ${progress.selected === null || progress.selected === undefined ? "disabled" : ""}>Check decision</button>`}</div></section>`;
  }

  function renderProjects() {
    const projects = PRO_PATH.projects || [];
    app.innerHTML = `
      ${pageHead("PORTFOLIO", "End-to-End Professional Projects", "Complete three projects to prove batch engineering, enterprise Warehouse, and Real-Time Intelligence capability.", '<button class="btn btn--secondary" type="button" data-route="professional">Professional path</button>')}
      <section class="project-grid">${projects.map(project => { const progress = professionalState.projectProgress?.[project.id] || { milestones: [], completed: false }; return `<button type="button" data-route="project/${project.id}" class="${progress.completed ? "completed" : ""}"><span>${escapeHtml(project.level)}</span><h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.summary)}</p><div class="meter"><span style="width:${percent(progress.milestones?.length || 0, project.milestones.length)}%"></span></div><strong>${progress.milestones?.length || 0}/${project.milestones.length} milestones ${progress.completed ? "· ✓ Complete" : "→"}</strong></button>`; }).join("")}</section>`;
  }

  function renderProject(projectId) {
    const project = (PRO_PATH.projects || []).find(item => item.id === projectId);
    if (!project) return renderProjects();
    const progress = professionalState.projectProgress?.[projectId] || { milestones: [], completed: false };
    app.innerHTML = `
      <div class="lesson-breadcrumb"><button type="button" data-route="projects">Projects</button><span>›</span><strong>${escapeHtml(project.title)}</strong></div>
      <section class="project-hero"><div><p class="eyebrow">${escapeHtml(project.level)}</p><h1>${escapeHtml(project.title)}</h1><p>${escapeHtml(project.scenario)}</p></div><div><strong>${percent(progress.milestones?.length || 0, project.milestones.length)}%</strong><span>milestones</span></div></section>
      <section class="project-detail"><article><p class="eyebrow">BUILD MILESTONES</p><h2>Produce working evidence</h2><div class="project-milestones">${project.milestones.map((item, index) => `<label><input type="checkbox" data-project-step="${index}" data-id="${project.id}" ${progress.milestones?.includes(index) ? "checked" : ""}> <span><strong>${String(index + 1).padStart(2, "0")}</strong>${escapeHtml(item)}</span></label>`).join("")}</div></article><aside><p class="eyebrow">SKILLS</p><div class="project-tags">${project.skills.map(skill => `<span>${escapeHtml(skill)}</span>`).join("")}</div><p class="eyebrow">DEFINITION OF DONE</p><ul>${project.definitionOfDone.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></aside></section>
      <div class="quiz-actions lesson-finish"><button class="btn btn--secondary" type="button" data-route="projects">← All projects</button><button class="btn ${progress.completed ? "btn--success" : "btn--primary"}" type="button" data-action="project-complete" data-id="${project.id}" ${(progress.milestones || []).length < project.milestones.length ? "disabled" : ""}>${progress.completed ? "✓ Project completed" : "Complete project"}</button></div>`;
  }

  function renderModuleAssessment(moduleId) {
    const module = COURSE.modules.find(item => item.id === moduleId);
    const questions = PRO_PATH.assessments?.[moduleId] || [];
    if (!module || !questions.length) return renderMasteryDashboard();
    const draft = professionalState.assessmentDrafts?.[moduleId] || {};
    const attempts = professionalState.assessmentAttempts?.[moduleId] || [];
    const lastAttempt = professionalState.assessmentRetake?.[moduleId] ? null : attempts[attempts.length - 1];
    const best = bestAssessmentScore(moduleId);
    app.innerHTML = `
      <div class="lesson-breadcrumb"><button type="button" data-route="mastery">Mastery Dashboard</button><span>›</span><button type="button" data-route="course/module/${module.id}">${escapeHtml(module.title)}</button><span>›</span><strong>Assessment</strong></div>
      <section class="assessment-hero"><div><p class="eyebrow">MODULE ${String(module.number).padStart(2, "0")} · MASTERY ASSESSMENT</p><h1>${escapeHtml(module.title)}</h1><p>Five original professional scenarios plus the existing mapped Practice bank. Passing target: 80%.</p></div><div><strong>${best}%</strong><span>best score</span></div></section>
      ${lastAttempt ? `<div class="assessment-result ${lastAttempt.score >= 80 ? "correct" : "wrong"}"><strong>${lastAttempt.score}% · ${lastAttempt.score >= 80 ? "PASS" : "REVIEW REQUIRED"}</strong><p>${lastAttempt.correct}/${questions.length} original scenarios correct. Continue with mapped Practice questions for broader coverage.</p></div>` : ""}
      <section class="assessment-questions">${questions.map((item, questionIndex) => `<fieldset><legend><span>${String(questionIndex + 1).padStart(2, "0")}</span>${escapeHtml(item.question)}</legend><div>${item.options.map((option, optionIndex) => { let cls = ""; if (lastAttempt) cls = optionIndex === item.answer ? "correct" : Number(lastAttempt.answers?.[questionIndex]) === optionIndex ? "wrong" : ""; return `<label class="${cls}"><input type="radio" name="assessment-${moduleId}-${questionIndex}" value="${optionIndex}" data-assessment-module="${moduleId}" data-assessment-index="${questionIndex}" ${Number(draft[questionIndex]) === optionIndex ? "checked" : ""} ${lastAttempt ? "disabled" : ""}><span>${LETTERS[optionIndex]}</span>${escapeHtml(option)}</label>`; }).join("")}</div>${lastAttempt ? `<p><strong>${Number(lastAttempt.answers?.[questionIndex]) === item.answer ? "✓ Correct" : `Correct: ${LETTERS[item.answer]}`}</strong> ${escapeHtml(item.why)}</p>` : ""}</fieldset>`).join("")}</section>
      <div class="quiz-actions lesson-finish"><div class="quiz-actions__group"><button class="btn btn--secondary" type="button" data-route="course/module/${module.id}">Module overview</button><button class="btn btn--secondary" type="button" data-action="practice-course-module" data-id="${module.id}">Mapped Practice questions</button></div><div class="quiz-actions__group">${lastAttempt ? `<button class="btn btn--secondary" type="button" data-action="assessment-reset" data-id="${module.id}">Try again</button>` : `<button class="btn btn--primary" type="button" data-action="assessment-submit" data-id="${module.id}" ${Object.keys(draft).length < questions.length ? "disabled" : ""}>Submit assessment</button>`}</div></div>`;
  }

  function renderLearningDepth(lesson) {
    const selected = professionalState.lessonLevels?.[lesson.id] || "foundation";
    const levels = [
      ["foundation", "Foundation", "Understand the concept and vocabulary"],
      ["exam", "Exam Level", "Recognize requirements, clues, and distractors"],
      ["professional", "Professional Level", "Implement, verify, and operate"],
      ["deep", "Deep Dive", "Explain performance, failure, and trade-offs"]
    ];
    let body = "";
    if (selected === "foundation") body = `<div dir="rtl" lang="ar"><h3>الفكرة الأساسية</h3><p>${escapeHtml(lesson.focusAr)}</p><p>${escapeHtml(lesson.arabicParagraphs[0] || lesson.whyAr)}</p></div><ul>${lesson.concepts.slice(0, 4).map(item => `<li><strong>${escapeHtml(item[0])}</strong> — ${escapeHtml(item[1])}</li>`).join("")}</ul>`;
    if (selected === "exam") body = `<div><h3>DP-700 recognition pattern</h3><p>${escapeHtml(lesson.englishSummary)}</p></div><ul>${lesson.examFocus.slice(0, 6).map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
    if (selected === "professional") body = `<div><h3>Build and verify</h3><p>${escapeHtml(lesson.expectedOutput)}</p></div><ol>${lesson.practice.slice(0, 5).map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`;
    if (selected === "deep") body = `<div><h3>Failure and trade-off analysis</h3><p>Explain how this design behaves when scale, schema, security, or availability changes.</p></div><ul>${[...lesson.mistakes.slice(0, 3), ...lesson.troubleshooting.slice(0, 3)].map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
    return `<section class="course-lesson-section learning-depth"><div class="course-section-head"><div><p class="eyebrow">LEARNING DEPTH</p><h2>Study this topic at the right level</h2></div><span>${escapeHtml(levels.find(item => item[0] === selected)?.[1] || "Foundation")}</span></div><div class="learning-depth__tabs">${levels.map(item => `<button class="${selected === item[0] ? "active" : ""}" type="button" data-action="course-set-level" data-id="${lesson.id}" data-value="${item[0]}"><strong>${item[1]}</strong><small>${item[2]}</small></button>`).join("")}</div><div class="learning-depth__body">${body}</div></section>`;
  }

  function renderTopicMasteryGate(module, lesson, completed) {
    const mastery = lessonMasterySummary(module, lesson, completed);
    return `<section class="course-lesson-section topic-mastery"><div class="course-section-head"><div><p class="eyebrow">TOPIC MASTERY GATE</p><h2>${escapeHtml(mastery.label)}</h2><p>${escapeHtml(mastery.description)}</p></div>${masteryBadge(mastery.level, mastery.label)}</div><div class="topic-mastery__evidence"><article class="${mastery.completed ? "done" : ""}"><span>01</span><strong>Study</strong><p>Mark the lesson complete intentionally.</p></article><article class="${mastery.practice ? "done" : ""}"><span>02</span><strong>Guided practice</strong><p>Complete the Fabric practice and verify its output.</p><button class="btn btn--secondary btn--small" type="button" data-action="lesson-mastery-toggle" data-id="${lesson.id}" data-kind="practice">${mastery.practice ? "✓ Verified" : "Mark verified"}</button></article><article class="${mastery.questionReady ? "done" : ""}"><span>03</span><strong>Exam evidence</strong><p>${mastery.questions.accuracy}% accuracy · ${mastery.questions.attempted}/${mastery.questions.total} mapped questions.</p><button class="btn btn--secondary btn--small" type="button" data-action="practice-course-module" data-id="${module.id}">Practice</button></article><article class="${mastery.scenario ? "done" : ""}"><span>04</span><strong>Independent scenario</strong><p>Apply the topic without following the guided steps.</p><button class="btn btn--secondary btn--small" type="button" data-action="lesson-mastery-toggle" data-id="${lesson.id}" data-kind="scenario">${mastery.scenario ? "✓ Completed" : "Mark completed"}</button></article></div><label class="topic-rationale"><span>Professional rationale · explain why this approach fits and what trade-off you accept</span><textarea id="lesson-rationale-${lesson.id}" rows="3" placeholder="Write at least 30 characters...">${escapeHtml(mastery.rationale)}</textarea><button class="btn btn--secondary btn--small" type="button" data-action="lesson-rationale-save" data-id="${lesson.id}">Save rationale</button></label></section>`;
  }


  function renderCourse() {
    const stats = courseStats();
    const filters = ["All", "Foundation", "Implement & Manage", "Ingest & Transform", "Monitor & Optimize", "Mixed"];
    const needle = courseSearch.trim().toLowerCase();
    const filtered = COURSE.modules.filter(module => {
      const searchable = `${module.title} ${module.subtitle} ${module.summary} ${module.outcomes.join(" ")} ${module.lectures.join(" ")}`.toLowerCase();
      return (courseFilter === "All" || module.domain === courseFilter) && (!needle || searchable.includes(needle));
    });
    const nextModule = COURSE.modules.find(module => validCourseProgress(module).length < module.lectures.length) || COURSE.modules[0];
    app.innerHTML = `
      <section class="course-hero"><div><p class="eyebrow">PROFESSIONAL TRAINING PATH · 2026</p><h1>Learn DP-700 as a <span class="gradient-text">working data engineer.</span></h1><p>The original long-form outline is reorganized into a deliberate path: concepts first, guided labs second, exam patterns third, and similar-question practice last. Answers remain hidden until you submit them.</p><div class="hero__actions"><button class="btn btn--primary" type="button" data-route="course/module/${nextModule.id}">${stats.completed ? "Continue course" : "Start module 1"} →</button><button class="btn btn--secondary" type="button" data-route="professional">Professional Mastery v9</button><button class="btn btn--secondary" type="button" data-route="study">Open visual lessons</button></div></div><div class="course-hero__meter"><strong>${stats.percent}%</strong><span>${stats.completed} / ${stats.activities}</span><small>activities complete</small></div></section>
      <section class="course-stats" aria-label="Course summary"><div><strong>${COURSE.modules.length}</strong><span>professional modules</span></div><div><strong>${(stats.minutes / 60).toFixed(1)}h</strong><span>source learning time</span></div><div><strong>${stats.activities}</strong><span>lectures, tests & projects</span></div><div><strong>${stats.modulesComplete}</strong><span>modules completed</span></div></section>
      <section class="course-method" aria-label="Training method"><div><span>01</span><strong>Understand</strong><small>Concept and visual map</small></div><i>→</i><div><span>02</span><strong>Build</strong><small>Guided hands-on lab</small></div><i>→</i><div><span>03</span><strong>Recognize</strong><small>Exam patterns and traps</small></div><i>→</i><div><span>04</span><strong>Prove</strong><small>Similar-question practice</small></div><i>→</i><div><span>05</span><strong>Master</strong><small>Challenge, troubleshoot, defend</small></div></section>
      <section class="course-v9-grid"><button type="button" data-route="bootcamp"><span>START HERE</span><strong>Foundation Bootcamp</strong><small>Diagnostic and prerequisites</small></button><button type="button" data-route="mastery"><span>TRACK</span><strong>Mastery Dashboard</strong><small>Evidence-based readiness</small></button><button type="button" data-route="challenges"><span>BUILD</span><strong>Independent Challenges</strong><small>15 module labs</small></button><button type="button" data-route="troubleshooting"><span>DEBUG</span><strong>Troubleshooting Labs</strong><small>Root-cause practice</small></button><button type="button" data-route="decision-lab"><span>DECIDE</span><strong>Decision Simulator</strong><small>Architecture choices</small></button><button type="button" data-route="projects"><span>PORTFOLIO</span><strong>3 End-to-End Projects</strong><small>Professional evidence</small></button></section>
      <section class="course-note"><span aria-hidden="true">◎</span><div><strong>How exam hints work</strong><p>Each module highlights the scenario patterns you should recognize—such as choosing a shortcut versus mirroring—without revealing a memorized answer. The practice button then opens related questions from the validated learning bank.</p></div></section>
      <div class="toolbar"><label class="search-field"><span aria-hidden="true">⌕</span><input id="courseSearch" type="search" value="${escapeHtml(courseSearch)}" placeholder="Search a module, tool, or lecture..." aria-label="Search course modules"></label><div class="filter-pills" aria-label="Filter course modules">${filters.map(filter => `<button class="pill ${courseFilter === filter ? "active" : ""}" type="button" data-course-filter="${escapeHtml(filter)}">${escapeHtml(filter)}</button>`).join("")}</div></div>
      <div class="section-title"><div><h2>Course curriculum</h2><p>${filtered.length} modules · structured from foundation to exam readiness</p></div><strong>${stats.percent}% complete</strong></div>
      <div class="meter course-progress"><span style="width:${stats.percent}%"></span></div>
      <section class="course-module-grid">${filtered.map(module => {
        const done = validCourseProgress(module).length;
        const modulePercent = percent(done, module.lectures.length);
        return `<button class="course-module-card course-module-card--${courseModuleClass(module.domain)}" type="button" data-route="course/module/${module.id}"><div class="course-module-card__top"><span class="course-module-card__icon">${escapeHtml(module.icon)}</span><span>MODULE ${String(module.number).padStart(2, "0")}</span></div><h3>${escapeHtml(module.title)}</h3><p>${escapeHtml(module.subtitle)}</p><div class="course-module-card__tags"><span>${escapeHtml(module.domain)}</span><span>${escapeHtml(module.level)}</span></div><div class="meter"><span style="width:${modulePercent}%"></span></div><div class="course-module-card__foot"><span>${done}/${module.lectures.length} activities</span><strong>${modulePercent}% →</strong></div></button>`;
      }).join("") || '<div class="empty-state"><h2>No modules found</h2><p>Try a different search or domain filter.</p></div>'}</section>`;
  }

  function renderCourseModule(id) {
    const module = COURSE.modules.find(item => item.id === id);
    if (!module) return renderCourse();
    const moduleIndex = COURSE.modules.indexOf(module);
    const previous = COURSE.modules[moduleIndex - 1];
    const next = COURSE.modules[moduleIndex + 1];
    const progress = validCourseProgress(module);
    const modulePercent = percent(progress.length, module.lectures.length);
    const labComplete = state.courseCompletedLabs.includes(module.id);
    const relatedLessons = module.visualLessonIds.map(lessonId => LESSONS.find(lesson => lesson.id === lessonId)).filter(Boolean);
    const mastery = moduleMasterySummary(module);
    const challenge = (PRO_PATH.challengeLabs || []).find(item => item.moduleId === module.id);
    app.innerHTML = `
      <div class="lesson-breadcrumb"><button type="button" data-route="course">Professional Course</button><span>›</span><span>${escapeHtml(module.domain)}</span><span>›</span><strong>Module ${module.number}</strong></div>
      <section class="course-module-hero course-module-hero--${courseModuleClass(module.domain)}"><div><div class="lesson-hero__meta"><span>${escapeHtml(module.domain)}</span><span>${escapeHtml(module.level)}</span><span>${module.lectures.length} activities</span></div><p class="eyebrow">MODULE ${String(module.number).padStart(2, "0")}</p><h1><span aria-hidden="true">${escapeHtml(module.icon)}</span>${escapeHtml(module.title)}</h1><p>${escapeHtml(module.subtitle)}</p></div><div class="course-module-hero__score"><strong>${modulePercent}%</strong><span>${progress.length}/${module.lectures.length}</span></div></section>
      <article class="course-module-detail">
        <section class="course-module-intro"><div><p class="eyebrow">WHY THIS MODULE MATTERS</p><p>${escapeHtml(module.summary)}</p></div><aside><span>LEARNING OUTCOMES</span><ul>${module.outcomes.map(outcome => `<li>${escapeHtml(outcome)}</li>`).join("")}</ul></aside></section>
        <section class="module-mastery-strip"><div><p class="eyebrow">MODULE MASTERY GATE</p><h2>${escapeHtml(mastery.label)}</h2><p>${escapeHtml(mastery.description)}</p></div><div class="mastery-evidence"><span class="${mastery.activityPercent === 100 ? "done" : ""}">Study ${mastery.activityPercent}%</span><span class="${mastery.guidedLab ? "done" : ""}">Guided Lab</span><span class="${mastery.questions.accuracy >= 80 && mastery.questions.attempted >= mastery.questions.required ? "done" : ""}">Questions ${mastery.questions.accuracy}%</span><span class="${mastery.assessment >= 80 ? "done" : ""}">Assessment ${mastery.assessment}%</span><span class="${mastery.challenge ? "done" : ""}">Challenge</span></div><div class="hero__actions">${challenge ? `<button class="btn btn--secondary btn--small" type="button" data-route="challenge/${module.id}">Independent challenge</button>` : ""}<button class="btn btn--primary btn--small" type="button" data-route="module-assessment/${module.id}">Module assessment</button></div></section>
        <section class="course-concept-map" aria-label="Module concept map"><div><p class="eyebrow">CONCEPT MAP</p><h2>See the flow before the details</h2></div><div class="course-concept-map__track">${module.conceptMap.map((item, index) => `<div><span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(item)}</strong></div>${index < module.conceptMap.length - 1 ? "<i>→</i>" : ""}`).join("")}</div></section>
        <section class="course-activity-section"><div class="course-section-head"><div><p class="eyebrow">GUIDED LEARNING PATH</p><h2>${module.lectures.length} activities in order</h2><p>Check an activity after watching, reading, or completing it. Progress is saved on this device.</p></div><button class="btn btn--secondary btn--small" type="button" data-action="course-complete-module" data-id="${module.id}">${progress.length === module.lectures.length ? "Reset module progress" : "Mark all complete"}</button></div><div class="course-activity-list">${module.lectures.map((entry, index) => {
          const activity = parseCourseActivity(entry);
          const done = progress.includes(index);
          return `<div class="course-activity-row ${done ? "completed" : ""}"><button class="course-activity course-activity--open" type="button" data-route="course/module/${module.id}/lesson/${index}"><span class="course-activity__check">${done ? "✓" : String(index + 1).padStart(2, "0")}</span><span class="course-activity__body"><strong>${escapeHtml(activity.title)}</strong><small>${activity.duration === "quiz" ? "Knowledge check" : activity.duration === "project" ? "Hands-on project" : escapeHtml(activity.duration)} · Open full lesson</small></span><span class="course-activity__arrow" aria-hidden="true">→</span></button><button class="course-activity-complete ${done ? "completed" : ""}" type="button" data-action="course-toggle-activity" data-id="${module.id}" data-index="${index}" aria-label="${done ? "Mark lesson incomplete" : "Mark lesson complete"}" title="${done ? "Mark incomplete" : "Mark complete"}">${done ? "✓" : "○"}</button></div>`;
        }).join("")}</div></section>
        <section class="course-lab ${labComplete ? "completed" : ""}"><div class="course-lab__head"><div><span>GUIDED LAB</span><h2>${escapeHtml(module.lab.title)}</h2></div><button class="btn ${labComplete ? "btn--secondary" : "btn--success"}" type="button" data-action="course-toggle-lab" data-id="${module.id}">${labComplete ? "✓ Lab completed" : "Mark lab complete"}</button></div><ol>${module.lab.steps.map((step, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><p>${escapeHtml(step)}</p></li>`).join("")}</ol></section>
        <section class="course-exam"><div><p class="eyebrow">EXAM PATTERNS · NO ANSWERS REVEALED</p><h2>Scenarios to recognize</h2><p>These are decision patterns similar to the questions you will meet. Use them as clues for what to understand—not answer letters to memorize.</p></div><div class="course-exam__patterns">${module.examPatterns.map((pattern, index) => `<article><span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(pattern)}</strong></article>`).join("")}</div><button class="btn btn--primary" type="button" data-action="practice-course-module" data-id="${module.id}">Practice similar questions →</button></section>
        ${relatedLessons.length ? `<section class="course-related"><div><p class="eyebrow">VISUAL REINFORCEMENT</p><h2>Review these visual lessons</h2></div><div>${relatedLessons.map(lesson => `<button class="btn btn--secondary" type="button" data-route="study/lesson/${lesson.id}">${escapeHtml(lesson.icon || "◫")} ${escapeHtml(lesson.title)}</button>`).join("")}</div></section>` : ""}
        <div class="quiz-actions lesson-finish"><div class="quiz-actions__group">${previous ? `<button class="btn btn--secondary" type="button" data-route="course/module/${previous.id}">← Previous module</button>` : ""}</div><div class="quiz-actions__group"><button class="btn btn--secondary" type="button" data-route="course">Course overview</button>${next ? `<button class="btn btn--primary" type="button" data-route="course/module/${next.id}">Next module →</button>` : '<button class="btn btn--primary" type="button" data-action="practice-course-module" data-id="capstone">Final mixed practice →</button>'}</div></div>
      </article>`;
  }


  function renderCourseLesson(moduleId, activityIndex) {
    const module = COURSE.modules.find(item => item.id === moduleId);
    const index = Number(activityIndex);
    const lesson = COURSE_CONTENT?.getLesson?.(moduleId, index);
    if (!module || !lesson) return renderCourseModule(moduleId);

    const progress = validCourseProgress(module);
    const completed = progress.includes(index);
    const activity = parseCourseActivity(module.lectures[index]);
    const previousIndex = index > 0 ? index - 1 : null;
    const nextIndex = index < module.lectures.length - 1 ? index + 1 : null;
    const moduleIndex = COURSE.modules.indexOf(module);
    const previousModule = COURSE.modules[moduleIndex - 1];
    const nextModule = COURSE.modules[moduleIndex + 1];
    const previousRoute = previousIndex !== null
      ? `course/module/${module.id}/lesson/${previousIndex}`
      : previousModule ? `course/module/${previousModule.id}/lesson/${previousModule.lectures.length - 1}` : "course";
    const nextRoute = nextIndex !== null
      ? `course/module/${module.id}/lesson/${nextIndex}`
      : nextModule ? `course/module/${nextModule.id}/lesson/0` : "course";
    const relatedQuestions = (lesson.relatedQuestionIds || []).filter(questionId => getQuestion(questionId));
    const relatedVisuals = (lesson.relatedVisualLessonIds || []).map(lessonId => LESSONS.find(item => item.id === lessonId)).filter(Boolean);
    const durationLabel = activity.duration === "quiz" ? "Knowledge check" : activity.duration === "project" ? "Hands-on project" : activity.duration || `${lesson.readingMinutes} min`;

    app.innerHTML = `
      <div class="lesson-breadcrumb"><button type="button" data-route="course">Professional Course</button><span>›</span><button type="button" data-route="course/module/${module.id}">Module ${module.number}</button><span>›</span><strong>${escapeHtml(lesson.title)}</strong></div>
      <section class="course-lesson-hero course-module-hero--${courseModuleClass(module.domain)}">
        <div><div class="lesson-hero__meta"><span>${escapeHtml(module.domain)}</span><span>${escapeHtml(module.level)}</span><span>${escapeHtml(lesson.type)}</span><span>${escapeHtml(durationLabel)}</span></div><p class="eyebrow">MODULE ${String(module.number).padStart(2, "0")} · LESSON ${String(index + 1).padStart(2, "0")}</p><h1>${escapeHtml(lesson.title)}</h1><p>${escapeHtml(module.title)} — ${escapeHtml(module.subtitle)}</p></div>
        <div class="course-lesson-hero__actions"><span>Validated ${escapeHtml(lesson.lastValidated)}</span><button class="btn ${completed ? "btn--success" : "btn--primary"}" type="button" data-action="course-toggle-activity" data-id="${module.id}" data-index="${index}">${completed ? "✓ Lesson completed" : "Mark lesson complete"}</button></div>
      </section>
      <div class="course-lesson-layout">
        <aside class="course-lesson-sidebar" aria-label="Module lessons"><div class="course-lesson-sidebar__head"><span>MODULE ${String(module.number).padStart(2, "0")}</span><strong>${escapeHtml(module.title)}</strong><small>${progress.length}/${module.lectures.length} completed</small></div><div class="meter"><span style="width:${percent(progress.length, module.lectures.length)}%"></span></div><div class="course-lesson-sidebar__list">${module.lectures.map((entry, lessonIndex) => {
          const item = parseCourseActivity(entry);
          const done = progress.includes(lessonIndex);
          return `<button class="${lessonIndex === index ? "active" : ""} ${done ? "completed" : ""}" type="button" data-route="course/module/${module.id}/lesson/${lessonIndex}"><span>${done ? "✓" : String(lessonIndex + 1).padStart(2, "0")}</span><small>${escapeHtml(item.title)}</small></button>`;
        }).join("")}</div></aside>
        <article class="course-lesson-content">
          ${renderLearningDepth(lesson)}
          <section class="course-lesson-section course-lesson-focus"><div><p class="eyebrow">WHY THIS MATTERS</p><h2>${escapeHtml(lesson.focusLabel)}</h2><p dir="rtl" lang="ar">${escapeHtml(lesson.whyAr)}</p></div><aside dir="rtl" lang="ar"><span>تركيز هذا النشاط</span><p>${escapeHtml(lesson.focusAr)}</p></aside></section>

          <section class="course-lesson-section"><p class="eyebrow">LEARNING OBJECTIVES</p><h2>What you should be able to do</h2><ul class="course-objective-list">${lesson.objectives.map(objective => `<li>${escapeHtml(objective)}</li>`).join("")}</ul></section>

          <section class="course-lesson-section course-arabic-study" dir="rtl" lang="ar"><div class="course-section-head"><div><p class="eyebrow">الشرح العربي</p><h2>شرح الدرس خطوة بخطوة</h2></div><span class="course-language-badge">Arabic explanation · English terms</span></div>${lesson.arabicParagraphs.map((paragraph, paragraphIndex) => `<div class="course-arabic-paragraph"><span>${String(paragraphIndex + 1).padStart(2, "0")}</span><p>${escapeHtml(paragraph)}</p></div>`).join("")}<div class="course-topic-focus"><strong>${escapeHtml(lesson.title)}</strong><p>${escapeHtml(lesson.focusAr)}</p></div></section>

          <section class="course-lesson-section course-english-summary"><p class="eyebrow">ENGLISH REVISION SUMMARY</p><h2>Exam-language recap</h2><p>${escapeHtml(lesson.englishSummary)}</p></section>

          <section class="course-lesson-section"><p class="eyebrow">KEY CONCEPTS</p><h2>Meaning, use, limitation, exam clue</h2><div class="course-concept-cards">${lesson.concepts.map(concept => `<article><span>${escapeHtml(concept[0])}</span><p><strong>Meaning</strong>${escapeHtml(concept[1])}</p><p><strong>Use</strong>${escapeHtml(concept[2])}</p><p><strong>Watch</strong>${escapeHtml(concept[3])}</p></article>`).join("")}</div></section>

          <section class="course-lesson-section course-visual-study"><p class="eyebrow">VISUAL EXPLANATION</p><h2>${escapeHtml(module.title)} flow</h2><div class="course-visual-flow">${lesson.visualSteps.map((step, stepIndex) => `<div><span>${String(stepIndex + 1).padStart(2, "0")}</span><strong>${escapeHtml(step)}</strong></div>${stepIndex < lesson.visualSteps.length - 1 ? '<i aria-hidden="true">→</i>' : ""}`).join("")}</div><p>${escapeHtml(lesson.focusEn)}</p></section>

          <section class="course-lesson-section"><p class="eyebrow">DECISION TABLE</p><h2>Choose by requirement</h2><div class="table-wrap"><table class="course-decision-table"><thead><tr>${lesson.decisionTable[0].map(cell => `<th>${escapeHtml(cell)}</th>`).join("")}</tr></thead><tbody>${lesson.decisionTable.slice(1).map(row => `<tr>${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div></section>

          ${lesson.code ? `<section class="course-lesson-section course-code-study"><div class="course-section-head"><div><p class="eyebrow">VALIDATED CODE EXAMPLE</p><h2>${escapeHtml(lesson.code.language)}</h2></div><button class="btn btn--secondary btn--small" type="button" data-action="course-copy-code" data-id="${module.id}" data-index="${index}">Copy code</button></div><pre><code>${escapeHtml(lesson.code.value)}</code></pre><div class="course-code-notes"><p><strong>Explanation</strong>${escapeHtml(lesson.code.explanation)}</p><p><strong>Expected result</strong>${escapeHtml(lesson.code.expected)}</p><p><strong>Common error</strong>${escapeHtml(lesson.code.error)}</p><p><strong>Exam relevance</strong>${escapeHtml(lesson.code.relevance)}</p></div></section>` : ""}

          <section class="course-lesson-section course-guided-practice"><div class="course-section-head"><div><p class="eyebrow">GUIDED MICROSOFT FABRIC PRACTICE</p><h2>Perform this in a real Fabric environment</h2></div><span>${lesson.labMinutes} min</span></div><div class="course-practice-grid"><ol>${lesson.practice.map((step, stepIndex) => `<li><span>${String(stepIndex + 1).padStart(2, "0")}</span><p>${escapeHtml(step)}</p></li>`).join("")}</ol><aside><strong>Expected output</strong><p>${escapeHtml(lesson.expectedOutput)}</p><small>The website does not execute Fabric code. Validate the result inside your own Fabric workspace.</small></aside></div></section>

          <section class="course-lesson-section course-two-column"><div><p class="eyebrow">COMMON MISTAKES</p><h2>Avoid these errors</h2><ul>${lesson.mistakes.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div><div><p class="eyebrow">TROUBLESHOOTING</p><h2>How to investigate</h2><ul>${lesson.troubleshooting.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div></section>

          <section class="course-lesson-section course-exam-focus"><div><p class="eyebrow">DP-700 EXAM FOCUS</p><h2>What to recognize</h2><div>${lesson.examFocus.map((item, examIndex) => `<article><span>${String(examIndex + 1).padStart(2, "0")}</span><strong>${escapeHtml(item)}</strong></article>`).join("")}</div></div><aside><span>MEMORY HOOK</span><strong>${escapeHtml(lesson.memoryHook)}</strong></aside></section>

          <section class="course-lesson-section course-related-practice"><div><p class="eyebrow">RELATED EXISTING PRACTICE</p><h2>${relatedQuestions.length} mapped questions</h2><p>The original Practice, DUMP, and IMPORTANT banks remain separate and unchanged. Answers stay hidden until submission.</p></div><div class="course-related-practice__actions"><button class="btn btn--primary" type="button" data-action="practice-course-module" data-id="${module.id}">Practice related questions →</button><button class="btn btn--secondary" type="button" data-route="quick">Open Quick Quiz</button><button class="btn btn--secondary" type="button" data-route="review">Review mistakes</button><button class="btn btn--secondary" type="button" data-route="dump">Open DUMP</button><button class="btn btn--secondary" type="button" data-route="important">Open IMPORTANT</button></div>${relatedVisuals.length ? `<div class="course-related-visuals">${relatedVisuals.map(item => `<button class="btn btn--secondary btn--small" type="button" data-route="study/lesson/${item.id}">${escapeHtml(item.icon || "◫")} ${escapeHtml(item.title)}</button>`).join("")}</div>` : ""}</section>

          ${renderTopicMasteryGate(module, lesson, completed)}

          <section class="course-lesson-section course-sources"><div><p class="eyebrow">OFFICIAL SOURCES</p><h2>Validate current product behavior</h2><p>Fabric changes frequently. These Microsoft sources are the authority for current behavior.</p></div><div>${lesson.sources.map(source => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer"><strong>${escapeHtml(source.title)}</strong><span>Microsoft Learn ↗</span></a>`).join("")}</div></section>

          <div class="quiz-actions lesson-finish"><div class="quiz-actions__group"><button class="btn btn--secondary" type="button" data-route="${previousRoute}">← Previous lesson</button><button class="btn btn--secondary" type="button" data-route="course/module/${module.id}">Module overview</button></div><div class="quiz-actions__group"><button class="btn ${completed ? "btn--success" : "btn--primary"}" type="button" data-action="course-toggle-activity" data-id="${module.id}" data-index="${index}">${completed ? "✓ Completed" : "Mark complete"}</button><button class="btn btn--primary" type="button" data-route="${nextRoute}">Next lesson →</button></div></div>
        </article>
      </div>`;
  }

  function renderStudy() {
    const categories = ["All", ...unique(LESSONS.map(lesson => lesson.category))];
    const needle = studySearch.trim().toLowerCase();
    const filtered = LESSONS.filter(lesson => {
      const arabic = ARABIC_LEARNING.lessons?.[lesson.id];
      const searchable = `${lesson.title} ${lesson.subtitle} ${lesson.summary} ${lesson.memoryHook || ""} ${arabic?.title || ""} ${arabic?.summary || ""} ${arabic?.memoryHook || ""}`.toLowerCase();
      return (studyFilter === "All" || lesson.category === studyFilter) && (!needle || searchable.includes(needle));
    });
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
      ${renderArabicResources()}
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
    const hasArabic = Boolean(ARABIC_LEARNING.lessons?.[lesson.id]);
    const arabicOpen = state.arabicOpenLessons.includes(lesson.id);
    app.innerHTML = `
      <div class="lesson-breadcrumb"><button type="button" data-route="study">Visual Learning</button><span>›</span><span>${escapeHtml(lesson.category)}</span><span>›</span><strong>Lesson ${currentIndex + 1}</strong></div>
      <section class="lesson-hero lesson-hero--${lessonCategoryClass(lesson.category)}"><div><div class="lesson-hero__meta"><span>${escapeHtml(lesson.category)}</span><span>${lesson.minutes} min</span><span>Lesson ${currentIndex + 1} of ${LESSONS.length}</span></div><h1><span aria-hidden="true">${escapeHtml(lesson.icon || "◫")}</span>${escapeHtml(lesson.title)}</h1><p>${escapeHtml(lesson.subtitle)}</p></div><div class="lesson-hero__actions"><div class="lesson-hero__status">${completed ? "✓ COMPLETED" : "IN PROGRESS"}</div>${hasArabic ? `<button class="btn btn--arabic" type="button" data-action="toggle-arabic" data-id="${lesson.id}" aria-expanded="${arabicOpen}">${arabicOpen ? "إخفاء العربي" : "شرح عربي"} <span aria-hidden="true">ع</span></button>` : ""}</div></section>
      <article class="lesson-detail lesson-detail--visual">
        <section class="lesson-intro"><div><p class="eyebrow">MENTAL MODEL</p><p class="question-text">${escapeHtml(lesson.summary)}</p></div><aside><span>MEMORY HOOK</span><strong>${escapeHtml(lesson.memoryHook || lesson.summary)}</strong></aside></section>
        ${renderArabicExplanation(lesson)}
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
            ${isExam ? `<label class="choice-card"><input type="radio" name="scope" value="all" checked><strong>All three PDF runs</strong><small>${EXAM_QUESTIONS.length} answerable questions from DP-700N1, N2, and N3</small></label>${Object.entries(PDF_SOURCE_LABELS).map(([source,label]) => { const count=EXAM_QUESTIONS.filter(q=>q.sourceFile===source).length; return `<label class="choice-card"><input type="radio" name="scope" value="${label.toLowerCase()}"><strong>${label}</strong><small>${count} answerable questions from this PDF source</small></label>`; }).join("")}` : `<label class="choice-card"><input type="radio" name="scope" value="all" checked><strong>All question practice</strong><small>Mixed questions from the validated bank</small></label><label class="choice-card"><input type="radio" name="scope" value="wrong" ${stats().wrong ? "" : "disabled"}><strong>Current errors only</strong><small>${stats().wrong} questions need review</small></label>`}
          </div>
          ${!isQuick ? `<label><strong>Question count</strong><select class="select-field" name="count" aria-label="Question count">${[10, 25, 40, 50, 100].map(count => `<option value="${count}" ${count === defaultCount ? "selected" : ""}>${count} questions</option>`).join("")}</select></label>` : `<input type="hidden" name="count" value="10">`}
          <div class="setup-note"><strong>${isExam ? "Simulation rules" : "How it works"}:</strong> ${isExam ? "45 minutes, shuffled questions and options, a 70% practice target, and free navigation with the question palette." : "Options are reshuffled each session. Use 1–4 to answer, B to bookmark, and arrow keys to navigate."}</div>
          <div class="hero__actions"><button class="btn btn--primary" type="submit">${isExam ? "Start simulation" : "Start session"} →</button>${state.activeSession ? '<button class="btn btn--secondary" type="button" data-action="resume-session">Resume current session</button>' : ""}</div>
        </form>
      </section>`;
  }

  function startSession(mode, count, scope = "all", explicitIds = null) {
    const sourceExam = mode === "exam";
    let pool = explicitIds ? explicitIds.map(id => sourceExam ? EXAM_QUESTIONS.find(q => q.n === Number(id)) : getQuestion(id)).filter(Boolean) : (sourceExam ? EXAM_QUESTIONS : QUESTIONS);
    if (!explicitIds) {
      if (sourceExam && ["dp-700n1", "dp-700n2", "dp-700n3"].includes(String(scope))) pool = pool.filter(q => PDF_SOURCE_LABELS[q.sourceFile].toLowerCase() === String(scope));
      if (!sourceExam && scope === "wrong") pool = pool.filter(q => state.answers[q.n] && !state.answers[q.n].correct);
      if (!sourceExam && scope === "bookmarks") pool = pool.filter(q => state.bookmarks.includes(q.n));
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
    const question = getSessionQuestion(session.ids[session.index]);
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
        <div class="question-tags"><span class="tag">${escapeHtml(PDF_SOURCE_LABELS[question.sourceFile] || `Batch ${question.batch}`)}</span><span class="tag">${escapeHtml(question.area)}</span><span class="tag">Original question #${question.n}</span></div>
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
    const question = getSessionQuestion(session.ids[session.index]);
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
        <div class="hero__actions" style="justify-content:center"><button class="btn btn--primary" type="button" data-route="review">Review errors</button><button class="btn btn--secondary" type="button" data-action="restart-session">New session</button><button class="btn btn--secondary" type="button" data-route="analytics">Performance Statistics</button></div>
      </section>
      <div class="section-title"><div><h2>Session review</h2><p>${answered} answers of ${session.ids.length}</p></div></div>
      <div class="review-list">
        ${session.ids.map((id, index) => {
          const q = getSessionQuestion(id);
          const response = session.answers[id];
          const status = !response ? "—" : response.correct ? "✓" : "✕";
          return `<details class="review-item"><summary>${status} Question ${index + 1}: ${escapeHtml(q.title)}</summary><p>${escapeHtml(q.question)}</p><p><strong>Your answer:</strong> ${response ? escapeHtml(q.options[response.selectedIndex]) : "Not answered"}</p><p><strong>Validated answer:</strong> ${escapeHtml(q.options[q.correctIndex])}</p><p>${escapeHtml(q.explanation)}</p><div class="source-links">${sourceLinks(q.refs)}</div></details>`;
        }).join("")}
      </div>`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderAnalytics() {
    const s = stats();
    const sourceBars = Object.entries(PDF_SOURCE_LABELS).map(([source, label]) => {
      const ids = DUMP_QUESTIONS.filter(q => q.sourceFile === source).map(q => q.n);
      const entries = ids.map(id => state.answers[id]).filter(Boolean);
      const correct = entries.filter(answer => answer.correct).length;
      const accuracy = percent(correct, entries.length);
      return `<div class="bar-row"><div class="bar-row__top"><span>${label}</span><strong>${accuracy}% <small>(${entries.length}/${ids.length})</small></strong></div><div class="meter"><span style="width:${accuracy}%"></span></div></div>`;
    }).join("");
    const frequentAreas = Object.entries(Object.values(state.answers).reduce((acc, answer) => acc, {}));
    const wrongAreas = Object.entries(DUMP_QUESTIONS.filter(q => state.answers[q.n] && !state.answers[q.n].correct).reduce((acc, q) => ({ ...acc, [q.area]: (acc[q.area] || 0) + 1 }), {})).sort((a, b) => b[1] - a[1]).slice(0, 6);
    void frequentAreas;

    app.innerHTML = `
      ${pageHead("PERFORMANCE", "Performance Statistics", "Track accuracy, completion, timing, weak areas, and repeated mistakes across your Practice Exam and DUMP sessions.")}
      <section class="stats-grid">
        ${statCard("Attempted", s.attempted, `${s.completion}% of the bank`, "▥", "#4f8cff")}
        ${statCard("Correct answers", s.correct, `${s.accuracy}% accuracy`, "✓", "#31d0aa")}
        ${statCard("Current errors", s.wrong, "Latest attempt per question", "!", "#fb7185")}
        ${statCard("Sessions", state.sessions.length, `Last activity ${formatDate(state.lastActivity)}`, "◷", "#fbbf24")}
      </section>
      <section class="analytics-grid">
        <article class="chart-card"><h3>Accuracy by PDF run</h3><div class="bar-list">${sourceBars}</div></article>
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
      ${pageHead("EXAM-DAY REFERENCE", "DP-700 Cheat Sheet", "Repeated concepts, decision rules, Direct Lake guardrails, performance alerts, and Microsoft-style exam hints. Print or save as PDF.", '<button class="btn btn--secondary" type="button" data-action="print">Print / PDF</button>')}
      <section class="cheat-grid">${CHEAT_SECTIONS.map(section => `<article class="cheat-card"><h3>${escapeHtml(section.title)}</h3><dl>${section.rows.map(([term, meaning]) => `<dt>${escapeHtml(term)}</dt><dd>${escapeHtml(meaning)}</dd>`).join("")}</dl></article>`).join("")}</section>`;
  }

  function renderBookmarks() {
    const bookmarked = state.bookmarks.map(id => getQuestion(id) || DUMP_QUESTIONS.find(q => q.n === Number(id))).filter(Boolean);
    const dumpBookmarked = state.bookmarks.filter(id => DUMP_QUESTIONS.some(q => q.n === Number(id)));
    const legacyBookmarked = state.bookmarks.filter(id => QUESTIONS.some(q => q.n === Number(id)));
    const practiceSavedAction = dumpBookmarked.length ? `<button class="btn btn--primary" type="button" data-action="practice-dump-bookmarks">Practice saved DUMP questions (${dumpBookmarked.length})</button>` : legacyBookmarked.length ? `<button class="btn btn--primary" type="button" data-action="practice-bookmarks">Practice bookmarks</button>` : "";
    app.innerHTML = `
      ${pageHead("SAVED", "Bookmarked Questions", "Bookmark questions during practice to build a personal review queue.", practiceSavedAction)}
      ${bookmarked.length ? `<div class="table-wrap"><table class="data-table"><thead><tr><th>#</th><th>Title</th><th>Area</th><th>Status</th><th></th></tr></thead><tbody>${bookmarked.map(q => `<tr><td>${q.n}</td><td><strong>${escapeHtml(q.title)}</strong><br><small>${escapeHtml(q.question)}</small></td><td>${escapeHtml(q.area)}</td><td>${(state.answers[q.n] || state.dumpAnswers[q.n]) ? (state.answers[q.n] || state.dumpAnswers[q.n]).correct === true ? "✓ Correct" : (state.answers[q.n] || state.dumpAnswers[q.n]).correct === false ? "✕ Incorrect" : "Answered" : "Not attempted"}</td><td><button class="btn btn--secondary btn--small" type="button" data-action="bookmark" data-id="${q.n}">Remove</button></td></tr>`).join("")}</tbody></table></div>` : '<div class="empty-state"><span class="empty-state__icon">☆</span><h2>No bookmarked questions</h2><p>Select Bookmark during practice and the question will appear here.</p><button class="btn btn--primary" type="button" data-route="practice">Start practice</button></div>'}`;
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
        <article class="setting-card"><h3>Export progress</h3><p>A JSON backup of ${(fileSize / 1024).toFixed(1)} KB containing answers, bookmarks, sessions, and v9 professional mastery progress.</p><div class="hero__actions"><button class="btn btn--primary" type="button" data-action="export">Download backup</button><button class="btn btn--secondary" type="button" data-action="import">Import backup</button></div></article>
        <article class="setting-card"><h3>Offline access</h3><p>After the first GitHub Pages visit, supported browsers cache the app shell for offline use.</p><span class="tag">PWA Ready</span> <span class="tag">No backend</span></article>
        <article class="setting-card danger-zone"><h3>Reset progress</h3><p>Deletes answers, sessions, bookmarks, completed lessons, challenges, projects, and mastery evidence from this browser. Export first if you need a backup.</p><button class="btn btn--danger" type="button" data-action="reset">Delete all progress</button></article>
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
    const payload = { app: DATA.meta.title, exportedAt: new Date().toISOString(), state, professionalState };
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
        state = { ...defaultState(), ...imported, answers: imported.answers || {}, bookmarks: imported.bookmarks || [], completedLessons: imported.completedLessons || [], lessonChecks: imported.lessonChecks || {}, arabicOpenLessons: imported.arabicOpenLessons || [], courseLectureProgress: imported.courseLectureProgress || {}, courseCompletedLabs: imported.courseCompletedLabs || [], planCompleted: imported.planCompleted || [], sessions: imported.sessions || [], dumpProgress: imported.dumpProgress || {}, dumpAnswers: imported.dumpAnswers || {}, activeDumpSession: imported.activeDumpSession || null };
        professionalState = payload.professionalState ? { ...defaultProfessionalState(), ...payload.professionalState } : loadProfessionalState();
        applyTheme(state.theme);
        saveState();
        saveProfessionalState();
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
    const professionalRoutes = ["professional", "bootcamp", "mastery", "challenges", "challenge", "troubleshooting", "decision-lab", "projects", "project", "module-assessment"];
    markActiveNav(["dump-drill", "dump-library"].includes(routeName) ? "dump" : professionalRoutes.includes(routeName) ? "course" : routeName);
    switch (routeName) {
      case "course": parts[1] === "module" && parts[2] ? (parts[3] === "lesson" && parts[4] !== undefined ? renderCourseLesson(parts[2], Number(parts[4])) : renderCourseModule(parts[2])) : renderCourse(); break;
      case "professional": renderProfessionalPath(); break;
      case "bootcamp": renderBootcamp(); break;
      case "mastery": renderMasteryDashboard(); break;
      case "challenges": renderChallenges(); break;
      case "challenge": parts[1] ? renderChallenge(parts[1]) : renderChallenges(); break;
      case "troubleshooting": parts[1] ? renderTroubleshootingLab(parts[1]) : renderTroubleshooting(); break;
      case "decision-lab": renderDecisionLab(); break;
      case "projects": renderProjects(); break;
      case "project": parts[1] ? renderProject(parts[1]) : renderProjects(); break;
      case "module-assessment": parts[1] ? renderModuleAssessment(parts[1]) : renderMasteryDashboard(); break;
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
    if (action === "toggle-arabic") {
      state.arabicOpenLessons = state.arabicOpenLessons.includes(id) ? state.arabicOpenLessons.filter(item => item !== id) : unique([...state.arabicOpenLessons, id]);
      saveState();
      renderLesson(id);
      if (state.arabicOpenLessons.includes(id)) requestAnimationFrame(() => {
        const panel = document.getElementById(`arabic-${id}`);
        if (panel?.scrollIntoView) panel.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    if (action === "course-set-level") {
      professionalState.lessonLevels[id] = actionButton.dataset.value || "foundation";
      saveProfessionalState();
      const parts = id.split("-");
      const lesson = COURSE_CONTENT?.getAllLessons?.().find(item => item.id === id);
      if (lesson) renderCourseLesson(lesson.moduleId, lesson.activityIndex);
    }
    if (action === "lesson-mastery-toggle") {
      const kind = actionButton.dataset.kind;
      const target = kind === "scenario" ? professionalState.lessonScenario : professionalState.lessonPractice;
      target[id] = !target[id];
      saveProfessionalState();
      const lesson = COURSE_CONTENT?.getAllLessons?.().find(item => item.id === id);
      if (lesson) renderCourseLesson(lesson.moduleId, lesson.activityIndex);
    }
    if (action === "lesson-rationale-save") {
      const input = document.getElementById(`lesson-rationale-${id}`);
      professionalState.lessonRationales[id] = input?.value || "";
      saveProfessionalState();
      const lesson = COURSE_CONTENT?.getAllLessons?.().find(item => item.id === id);
      if (lesson) { toast("Professional rationale saved."); renderCourseLesson(lesson.moduleId, lesson.activityIndex); }
    }
    if (action === "module-reflection-save") {
      const input = document.getElementById(`module-reflection-${id}`);
      professionalState.moduleReflections[id] = input?.value || "";
      saveProfessionalState();
      toast("Module rationale saved.");
      renderMasteryDashboard();
    }
    if (action === "diagnostic-submit") {
      const questions = PRO_PATH.diagnostic?.questions || [];
      const correct = questions.filter((item, index) => Number(professionalState.diagnosticAnswers?.[index]) === item.answer).length;
      professionalState.diagnosticResult = { score: percent(correct, questions.length), correct, completedAt: new Date().toISOString() };
      saveProfessionalState();
      renderBootcamp();
    }
    if (action === "diagnostic-reset") {
      professionalState.diagnosticAnswers = {};
      professionalState.diagnosticResult = null;
      saveProfessionalState();
      renderBootcamp();
    }
    if (action === "bootcamp-toggle") {
      professionalState.bootcampCompleted = professionalState.bootcampCompleted.includes(id) ? professionalState.bootcampCompleted.filter(item => item !== id) : unique([...professionalState.bootcampCompleted, id]);
      saveProfessionalState();
      renderBootcamp();
    }
    if (action === "challenge-hint" || action === "challenge-solution") {
      const progress = professionalState.challengeProgress[id] || { steps: [], completed: false, hint: false, solution: false };
      const key = action === "challenge-hint" ? "hint" : "solution";
      progress[key] = !progress[key];
      professionalState.challengeProgress[id] = progress;
      saveProfessionalState();
      renderChallenge(id);
    }
    if (action === "challenge-complete") {
      const progress = professionalState.challengeProgress[id] || { steps: [] };
      progress.completed = !progress.completed;
      professionalState.challengeProgress[id] = progress;
      saveProfessionalState();
      renderChallenge(id);
    }
    if (action === "trouble-submit") {
      const lab = (PRO_PATH.troubleshootingLabs || []).find(item => item.id === id);
      const progress = professionalState.troubleshootingProgress[id] || { selected: null };
      progress.checked = true;
      progress.correct = Number(progress.selected) === lab?.answer;
      professionalState.troubleshootingProgress[id] = progress;
      saveProfessionalState();
      renderTroubleshootingLab(id);
    }
    if (action === "trouble-solution") {
      const progress = professionalState.troubleshootingProgress[id] || {};
      progress.solution = !progress.solution;
      professionalState.troubleshootingProgress[id] = progress;
      saveProfessionalState();
      renderTroubleshootingLab(id);
    }
    if (action === "trouble-complete") {
      const progress = professionalState.troubleshootingProgress[id] || {};
      progress.completed = !progress.completed;
      professionalState.troubleshootingProgress[id] = progress;
      saveProfessionalState();
      renderTroubleshootingLab(id);
    }
    if (action === "decision-lab-select") {
      const progress = professionalState.decisionProgress[id] || {};
      progress.selected = Number(actionButton.dataset.value);
      progress.checked = false;
      professionalState.decisionProgress[id] = progress;
      saveProfessionalState();
      renderDecisionLab();
    }
    if (action === "decision-lab-submit") {
      const scenario = (PRO_PATH.decisionScenarios || []).find(item => item.id === id);
      const progress = professionalState.decisionProgress[id] || {};
      progress.checked = true;
      progress.correct = Number(progress.selected) === scenario?.answer;
      professionalState.decisionProgress[id] = progress;
      saveProfessionalState();
      renderDecisionLab();
    }
    if (action === "decision-lab-prev") {
      professionalState.decisionIndex = Math.max(0, Number(professionalState.decisionIndex || 0) - 1);
      saveProfessionalState();
      renderDecisionLab();
    }
    if (action === "decision-lab-next") {
      const total = PRO_PATH.decisionScenarios?.length || 1;
      professionalState.decisionIndex = Number(professionalState.decisionIndex || 0) >= total - 1 ? 0 : Number(professionalState.decisionIndex || 0) + 1;
      saveProfessionalState();
      renderDecisionLab();
    }
    if (action === "project-complete") {
      const progress = professionalState.projectProgress[id] || { milestones: [] };
      progress.completed = !progress.completed;
      professionalState.projectProgress[id] = progress;
      saveProfessionalState();
      renderProject(id);
    }
    if (action === "assessment-submit") {
      const questions = PRO_PATH.assessments?.[id] || [];
      const answers = professionalState.assessmentDrafts?.[id] || {};
      const correct = questions.filter((item, index) => Number(answers[index]) === item.answer).length;
      const attempt = { score: percent(correct, questions.length), correct, answers: { ...answers }, completedAt: new Date().toISOString() };
      professionalState.assessmentAttempts[id] = [...(professionalState.assessmentAttempts[id] || []), attempt];
      professionalState.assessmentRetake[id] = false;
      saveProfessionalState();
      renderModuleAssessment(id);
    }
    if (action === "assessment-reset") {
      professionalState.assessmentDrafts[id] = {};
      professionalState.assessmentRetake[id] = true;
      saveProfessionalState();
      renderModuleAssessment(id);
    }
    if (action === "course-toggle-activity") {
      const module = COURSE.modules.find(item => item.id === id);
      const index = Number(actionButton.dataset.index);
      if (module && Number.isInteger(index) && index >= 0 && index < module.lectures.length) {
        const progress = validCourseProgress(module);
        state.courseLectureProgress[id] = progress.includes(index) ? progress.filter(item => item !== index) : [...progress, index].sort((a, b) => a - b);
        saveState();
        const routeParts = location.hash.replace(/^#/, "").split("/");
        if (routeParts[0] === "course" && routeParts[1] === "module" && routeParts[2] === id && routeParts[3] === "lesson") renderCourseLesson(id, index);
        else renderCourseModule(id);
      }
    }
    if (action === "course-copy-code") {
      const index = Number(actionButton.dataset.index);
      const lesson = COURSE_CONTENT?.getLesson?.(id, index);
      const code = lesson?.code?.value || "";
      if (code && navigator.clipboard?.writeText) navigator.clipboard.writeText(code).then(() => toast("Code copied to clipboard.")).catch(() => toast("Copy failed. Select the code manually."));
      else toast("Copy is unavailable in this browser. Select the code manually.");
    }
    if (action === "course-complete-module") {
      const module = COURSE.modules.find(item => item.id === id);
      if (module) {
        const complete = validCourseProgress(module).length === module.lectures.length;
        state.courseLectureProgress[id] = complete ? [] : module.lectures.map((_, index) => index);
        saveState();
        renderCourseModule(id);
      }
    }
    if (action === "course-toggle-lab") {
      state.courseCompletedLabs = state.courseCompletedLabs.includes(id) ? state.courseCompletedLabs.filter(item => item !== id) : unique([...state.courseCompletedLabs, id]);
      saveState();
      renderCourseModule(id);
    }
    if (action === "practice-course-module") {
      const module = COURSE.modules.find(item => item.id === id);
      const ids = (module?.questionIds || []).filter(questionId => getQuestion(questionId));
      if (ids.length) startSession("practice", Math.min(10, ids.length), "all", ids);
      else toast("No mapped practice questions are available for this module yet.");
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
    if (action === "practice-dump-bookmarks") { const dumpIds = state.bookmarks.filter(id => DUMP_QUESTIONS.some(q => q.n === Number(id))); if (dumpIds.length) startDumpDrill(dumpIds, `Saved DUMP questions · ${dumpIds.length}`); }
    if (action === "practice-bookmarks") { const legacyIds = state.bookmarks.filter(id => QUESTIONS.some(q => q.n === Number(id))); if (legacyIds.length) startSession("review", legacyIds.length, "all", legacyIds); }
    if (action === "start-dump-drill" || action === "dump-start-random") startDumpDrill(null, "Random 25");
    if (action === "dump-start-run") {
      const source = actionButton.dataset.source;
      const questions = DUMP_QUESTIONS.filter(question => question.sourceFile === source);
      startDumpDrill(questions.map(question => question.n), `${PDF_SOURCE_LABELS[source]} · ${questions.length} questions`);
    }
    if (action === "dump-start-full") startDumpDrill(DUMP_QUESTIONS.map(question => question.n), `Full DUMP · ${DUMP_QUESTIONS.length} questions`);
    if (action === "dump-review-filter") { dumpProgressFilter = "review"; dumpPage = 1; setRoute("dump-library"); }
    if (action === "dump-rate") { rateDumpQuestion(id, actionButton.dataset.value); renderDumpLibrary(); }
    if (action === "dump-page") { dumpPage = Number(actionButton.dataset.page); renderDumpLibrary(); window.scrollTo({ top: 0, behavior: "smooth" }); }
    if (action === "dump-choice") {
      mutateDumpAnswer(id, (answer, interaction) => {
        const label = actionButton.dataset.label;
        if (["single", "letter-choice"].includes(interaction.type)) answer.selected = [label];
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
      professionalState = defaultProfessionalState();
      applyTheme(state.theme);
      saveState();
      saveProfessionalState();
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
    if (event.target.id === "courseSearch") {
      courseSearch = event.target.value;
      renderCourse();
      requestAnimationFrame(() => {
        const input = document.getElementById("courseSearch");
        input?.focus();
        input?.setSelectionRange(courseSearch.length, courseSearch.length);
      });
    }
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
    const filter = event.target.closest("[data-course-filter]");
    if (!filter) return;
    courseFilter = filter.dataset.courseFilter;
    renderCourse();
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
    if (event.target.matches("[data-diagnostic-index]")) {
      professionalState.diagnosticAnswers[event.target.dataset.diagnosticIndex] = Number(event.target.value);
      saveProfessionalState();
      const count = Object.keys(professionalState.diagnosticAnswers).length;
      const submit = document.querySelector('[data-action="diagnostic-submit"]');
      if (submit) submit.disabled = count < (PRO_PATH.diagnostic?.questions?.length || 0);
      const summary = document.querySelector('.diagnostic-panel .course-section-head > strong');
      if (summary) summary.textContent = `${count}/${PRO_PATH.diagnostic?.questions?.length || 0} answered`;
      return;
    }
    if (event.target.matches("[data-assessment-module]")) {
      const moduleId = event.target.dataset.assessmentModule;
      professionalState.assessmentDrafts[moduleId] = professionalState.assessmentDrafts[moduleId] || {};
      professionalState.assessmentDrafts[moduleId][event.target.dataset.assessmentIndex] = Number(event.target.value);
      saveProfessionalState();
      const submit = document.querySelector('[data-action="assessment-submit"]');
      if (submit) submit.disabled = Object.keys(professionalState.assessmentDrafts[moduleId]).length < (PRO_PATH.assessments?.[moduleId]?.length || 0);
      return;
    }
    if (event.target.matches("[data-challenge-step]")) {
      const moduleId = event.target.dataset.id;
      const step = Number(event.target.dataset.challengeStep);
      const progress = professionalState.challengeProgress[moduleId] || { steps: [], completed: false, hint: false, solution: false };
      progress.steps = event.target.checked ? unique([...(progress.steps || []), step]).sort((a, b) => a - b) : (progress.steps || []).filter(item => item !== step);
      professionalState.challengeProgress[moduleId] = progress;
      saveProfessionalState();
      renderChallenge(moduleId);
      return;
    }
    if (event.target.matches("[data-project-step]")) {
      const projectId = event.target.dataset.id;
      const step = Number(event.target.dataset.projectStep);
      const progress = professionalState.projectProgress[projectId] || { milestones: [], completed: false };
      progress.milestones = event.target.checked ? unique([...(progress.milestones || []), step]).sort((a, b) => a - b) : (progress.milestones || []).filter(item => item !== step);
      professionalState.projectProgress[projectId] = progress;
      saveProfessionalState();
      renderProject(projectId);
      return;
    }
    if (event.target.matches("[data-trouble-id]")) {
      const labId = event.target.dataset.troubleId;
      const progress = professionalState.troubleshootingProgress[labId] || {};
      progress.selected = Number(event.target.value);
      progress.checked = false;
      professionalState.troubleshootingProgress[labId] = progress;
      saveProfessionalState();
      const submit = document.querySelector('[data-action="trouble-submit"]');
      if (submit) submit.disabled = false;
      return;
    }
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
    if (event.target.id === "dumpSource") { dumpSource = event.target.value; dumpPage = 1; renderDumpLibrary(); }
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
