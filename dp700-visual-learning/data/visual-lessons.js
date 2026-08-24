window.DP700_VISUAL_LEARNING = {
  sources: [
    { id: "V1", title: "What is Microsoft Fabric?", url: "https://learn.microsoft.com/en-us/fabric/fundamentals/microsoft-fabric-overview" },
    { id: "V2", title: "Domains in Microsoft Fabric", url: "https://learn.microsoft.com/en-us/fabric/governance/domains" },
    { id: "V3", title: "OneLake workspace settings", url: "https://learn.microsoft.com/en-us/fabric/onelake/onelake-workspace-settings" },
    { id: "V4", title: "Fabric Git integration", url: "https://learn.microsoft.com/en-us/fabric/cicd/git-integration/intro-to-git-integration" },
    { id: "V5", title: "Database projects for Fabric Warehouse", url: "https://learn.microsoft.com/en-us/fabric/data-warehouse/sql-database-projects" },
    { id: "V6", title: "Schedule and run a data pipeline", url: "https://learn.microsoft.com/en-us/fabric/data-factory/pipeline-runs" },
    { id: "V7", title: "Parameters in Data Factory for Fabric", url: "https://learn.microsoft.com/en-us/fabric/data-factory/parameters" },
    { id: "V8", title: "Choose a Fabric data store", url: "https://learn.microsoft.com/en-us/fabric/fundamentals/decision-guide-data-store" },
    { id: "V9", title: "Use KQL to query data", url: "https://learn.microsoft.com/en-us/kusto/query/tutorials/learn-common-operators" },
    { id: "V10", title: "Configure alerts in Fabric", url: "https://learn.microsoft.com/en-us/fabric/data-activator/data-activator-get-data-real-time-hub" },
    { id: "V11", title: "Monitor semantic model refresh", url: "https://learn.microsoft.com/en-us/power-bi/connect-data/refresh-summaries" },
    { id: "V12", title: "Optimize Fabric data pipelines", url: "https://learn.microsoft.com/en-us/fabric/data-factory/copy-activity-performance-and-scalability-guide" },
    { id: "V13", title: "T-SQL troubleshooting in Fabric Warehouse", url: "https://learn.microsoft.com/en-us/fabric/data-warehouse/tsql-surface-area" }
  ],
  lessons: [
    {
      id: "fabric-map", icon: "◫", title: "The Fabric mental map", subtitle: "See the whole platform before memorizing its tools", minutes: 12, category: "Implement & Manage", sourceIds: ["S1", "V1"],
      summary: "Microsoft Fabric is one analytics platform. Workspaces organize items, OneLake is the shared data foundation, and different experiences solve different parts of the same data journey.",
      memoryHook: "Think of Fabric as one city: OneLake is the land, workspaces are neighborhoods, and Fabric experiences are specialist buildings.",
      points: ["A workspace is the collaboration and security boundary for Fabric items.", "OneLake provides one logical data lake across the tenant.", "Data Factory moves data, Data Engineering transforms it, Warehouse serves relational analytics, and Real-Time Intelligence handles events."],
      trap: "Do not treat every Fabric experience as a separate cloud product with a separate storage island.",
      video: { label: "Will Needham — course introduction", url: "https://www.youtube.com/watch?v=KiB4eAeFRsw&t=0s", note: "Start here, then use the official sources for July 2026 changes." },
      visual: { title: "One platform, one journey", type: "flow", items: [
        { icon: "⇥", title: "Sources", text: "Apps · files · databases · events" },
        { icon: "⚙", title: "Ingest", text: "Pipeline · Dataflow · Eventstream" },
        { icon: "◉", title: "OneLake", text: "Shared governed storage" },
        { icon: "⌁", title: "Process", text: "Spark · SQL · KQL" },
        { icon: "▥", title: "Serve", text: "Lakehouse · Warehouse · Eventhouse" }
      ]},
      quickCheck: { question: "Which statement is the best mental model for OneLake?", options: ["A separate lake for every Fabric experience", "A tenant-wide logical data lake shared by Fabric experiences", "A backup service for Power BI only", "A Spark cluster used by notebooks"], answer: 1, why: "OneLake is the shared logical data foundation across Fabric, not a compute engine or a Power BI-only feature." }
    },
    {
      id: "workspace-settings", icon: "⚙", title: "Workspace settings", subtitle: "Spark, domains, OneLake, and Apache Airflow", minutes: 18, category: "Implement & Manage", sourceIds: ["S1", "S6", "S28", "V2", "V3"],
      summary: "Workspace settings control how items in that workspace compute, organize, access data, and run orchestration workloads.",
      memoryHook: "Four control rooms: Spark controls compute, Domain controls business ownership, OneLake controls data access behavior, and Airflow controls DAG execution.",
      points: ["Spark settings define pools, runtimes, environments, and resource behavior.", "Domains group workspaces by business ownership and support governance at scale.", "OneLake workspace settings affect how workspace data is exposed and secured.", "Apache Airflow job settings configure the environment used to run DAG-based orchestration."],
      trap: "A domain is not a workspace role, and a Spark pool is not a security boundary.",
      video: { label: "Will Needham — Admin Settings", url: "https://www.youtube.com/watch?v=KiB4eAeFRsw&t=1098s", note: "Verify screenshots and settings against Microsoft Learn because the UI evolves quickly." },
      visual: { title: "Remember S-D-O-A", type: "grid", items: [
        { icon: "ϟ", title: "Spark", text: "Compute and runtime" },
        { icon: "◇", title: "Domain", text: "Business ownership" },
        { icon: "◉", title: "OneLake", text: "Data access behavior" },
        { icon: "↻", title: "Airflow", text: "DAG orchestration" }
      ]},
      quickCheck: { question: "You need to group Finance workspaces under one governed business area. What should you configure?", options: ["A Spark starter pool", "A Fabric domain", "A deployment pipeline", "A OneLake shortcut"], answer: 1, why: "Domains organize workspaces around business ownership and governance." }
    },
    {
      id: "cicd-lifecycle", icon: "⑂", title: "Lifecycle and CI/CD", subtitle: "Git, database projects, and deployment pipelines", minutes: 20, category: "Implement & Manage", sourceIds: ["S1", "S5", "S26", "V4", "V5"],
      summary: "Use Git to remember and review changes, database projects to define SQL objects as code, and deployment pipelines to promote supported Fabric content between environments.",
      memoryHook: "Git remembers. Database projects define. Deployment pipelines move.",
      points: ["Git integration provides source history, branching, and collaboration for supported items.", "A database project stores the declarative SQL schema and can produce a deployable artifact.", "Deployment pipelines promote content through development, test, and production stages.", "Use deployment rules and environment-specific parameters instead of hardcoding values."],
      trap: "A Git branch is not an environment, and committing code does not automatically promote it to production.",
      video: { label: "Will Needham — CI/CD & Lifecycle", url: "https://www.youtube.com/watch?v=KiB4eAeFRsw&t=2906s", note: "Pair the video with the July 2026 database-project objective." },
      visual: { title: "Three different jobs", type: "flow", items: [
        { icon: "⑂", title: "Git", text: "Version and review" },
        { icon: "▤", title: "DB project", text: "Define SQL schema" },
        { icon: "DEV", title: "Development", text: "Build and validate" },
        { icon: "TEST", title: "Test", text: "Verify safely" },
        { icon: "PROD", title: "Production", text: "Release controlled content" }
      ]},
      quickCheck: { question: "Which capability primarily promotes supported Fabric items from Development to Test and Production?", options: ["Git commit history", "Deployment pipelines", "OneLake shortcuts", "Dynamic data masking"], answer: 1, why: "Deployment pipelines manage promotion across lifecycle stages; Git manages source history." }
    },
    {
      id: "security-layers", icon: "▣", title: "Security and governance layers", subtitle: "Workspace, item, data, labels, endorsement, and audit", minutes: 24, category: "Implement & Manage", sourceIds: ["S2", "S3", "S4", "S20", "S21", "S22", "S23"],
      summary: "Fabric security is layered. Decide who enters the workspace, who can open the item, which rows or columns they can read, and how content is classified, trusted, and audited.",
      memoryHook: "Door → Room → Row → Column → Display. Then Label → Trust → Audit.",
      points: ["Workspace roles provide broad workspace access; item permissions can share one item more narrowly.", "RLS filters rows, CLS blocks columns, and object/folder/file permissions protect specific data objects.", "Dynamic data masking changes displayed values but is not a complete authorization boundary.", "Sensitivity labels classify, endorsement signals trust, and audit logs answer who did what and when."],
      trap: "Certified does not secure data, masking does not replace permissions, and Viewer does not describe every OneLake access path.",
      video: { label: "Will Needham — Security & Governance", url: "https://www.youtube.com/watch?v=KiB4eAeFRsw&t=4950s", note: "Draw the layers before answering any security scenario." },
      visual: { title: "Security is a stack", type: "stack", items: [
        { icon: "1", title: "Workspace", text: "Admin · Member · Contributor · Viewer" },
        { icon: "2", title: "Item", text: "Share only the required item" },
        { icon: "3", title: "Data", text: "RLS · CLS · object · folder · file" },
        { icon: "4", title: "Display", text: "Dynamic data masking" },
        { icon: "5", title: "Govern", text: "Label · endorse · audit" }
      ]},
      quickCheck: { question: "A user can query a table but must never see the Salary column. Which control is the closest match?", options: ["Row-level security", "Column-level security", "Promoted endorsement", "Dynamic data masking only"], answer: 1, why: "CLS blocks access to the column. Masking changes display and can be bypassed by privileged users." }
    },
    {
      id: "orchestration", icon: "⌘", title: "Orchestration choices", subtitle: "Pipeline, Dataflow Gen2, notebook, schedules, and parameters", minutes: 22, category: "Implement & Manage", sourceIds: ["S27", "S29", "S37", "S38", "V6", "V7"],
      summary: "Choose the tool by the job: a pipeline coordinates, Dataflow Gen2 visually transforms, a notebook runs custom code, and a schedule or event trigger decides when the process starts.",
      memoryHook: "The pipeline is the conductor; Dataflow and Notebook are musicians.",
      points: ["Pipelines manage activities, dependencies, failure paths, parameters, and monitoring.", "Dataflow Gen2 is suited to maintainable low-code Power Query transformations.", "Notebooks suit Spark, custom code, and complex transformation logic.", "Use parameters and dynamic expressions to reuse one design across dates, tables, and environments."],
      trap: "Do not put every transformation inside a pipeline activity just because the pipeline starts the process.",
      video: { label: "Will Needham — Orchestration", url: "https://www.youtube.com/watch?v=KiB4eAeFRsw&t=6653s", note: "Focus on tool choice, parameters, triggers, and failure handling." },
      visual: { title: "Conductor and workers", type: "branch", items: [
        { icon: "⌘", title: "Pipeline", text: "Coordinate and monitor" },
        { icon: "▧", title: "Dataflow Gen2", text: "Visual Power Query" },
        { icon: "⌁", title: "Notebook", text: "Spark and custom code" },
        { icon: "⇥", title: "Copy Job", text: "Simplified recurring copy" }
      ]},
      quickCheck: { question: "You must run a Copy activity, then a notebook, then notify on failure. What should coordinate the workflow?", options: ["A OneLake shortcut", "A data pipeline", "A sensitivity label", "A KQL materialized view"], answer: 1, why: "A pipeline coordinates ordered activities, dependencies, monitoring, and failure paths." }
    },
    {
      id: "loading-patterns", icon: "⇥", title: "Loading patterns", subtitle: "Full, incremental, dimensional, and streaming loads", minutes: 22, category: "Ingest & Transform", sourceIds: ["S9", "S12", "S30"],
      summary: "Choose a loading pattern from data volume, change behavior, latency, and target model—not from habit.",
      memoryHook: "Snapshot everything, watermark the changes, stream the events.",
      points: ["A full load replaces or reloads the complete dataset and is simplest for small volumes.", "An incremental load captures only new or changed rows using a reliable watermark or change mechanism.", "Dimensional loading must preserve fact grain and apply the required SCD behavior.", "Streaming loading continuously processes events and must define event time, late data, and recovery."],
      trap: "Updating the stored watermark before a successful load can permanently skip data.",
      video: { label: "Will Needham — Architectural Decision-Making", url: "https://www.youtube.com/watch?v=KiB4eAeFRsw&t=8367s", note: "Use the decision questions, not memorized product names." },
      visual: { title: "Four load patterns", type: "grid", items: [
        { icon: "ALL", title: "Full", text: "Reload everything" },
        { icon: "+Δ", title: "Incremental", text: "Only new or changed" },
        { icon: "★", title: "Dimensional", text: "Facts, dimensions, SCD" },
        { icon: "≈", title: "Streaming", text: "Continuous events" }
      ]},
      code: { language: "SQL", lines: ["WHERE LastModified > @OldWatermark", "  AND LastModified <= @NewWatermark", "-- Save @NewWatermark only after success"] },
      quickCheck: { question: "What is the safest time to update the stored watermark?", options: ["Before reading the source", "Immediately after calculating the new watermark", "After the incremental copy succeeds", "Only after a full reload"], answer: 2, why: "Saving it after success prevents skipped rows when a load fails." }
    },
    {
      id: "batch-tool-choice", icon: "⌁", title: "Batch transformation decisions", subtitle: "Dataflows, notebooks, T-SQL, KQL, and the right store", minutes: 22, category: "Ingest & Transform", sourceIds: ["V8", "S27", "S11", "S12", "V9"],
      summary: "Match language and store to the workload: SQL for relational analytics, Spark for large flexible engineering, Power Query for low-code preparation, and KQL for fast event and telemetry analysis.",
      memoryHook: "SQL = structure. Spark = scale. Power Query = visual. KQL = speed over events.",
      points: ["Use Warehouse when relational modeling and T-SQL are central.", "Use Lakehouse when files, Delta tables, notebooks, and Spark are central.", "Use Eventhouse/KQL Database for high-volume time-series or log analytics.", "Handle duplicates, missing values, late arrivals, grouping, and denormalization according to business meaning."],
      trap: "The easiest language is not always the right execution engine or target store.",
      video: { label: "Will Needham — Hands-on T-SQL", url: "https://www.youtube.com/watch?v=KiB4eAeFRsw&t=9560s", note: "Compare this with the PySpark chapter before choosing." },
      visual: { title: "Choose by workload", type: "compare", items: [
        { icon: "SQL", title: "Warehouse", text: "Relational model · BI · T-SQL" },
        { icon: "SP", title: "Lakehouse", text: "Files · Delta · Spark" },
        { icon: "PQ", title: "Dataflow", text: "Low-code data preparation" },
        { icon: "KQL", title: "Eventhouse", text: "Telemetry · logs · time series" }
      ]},
      quickCheck: { question: "Which combination best fits interactive analysis of high-volume telemetry?", options: ["Warehouse + DAX", "Eventhouse + KQL", "Lakehouse + dynamic data masking", "Deployment pipeline + Git"], answer: 1, why: "Eventhouse and KQL are designed for fast time-series and telemetry analytics." }
    },
    {
      id: "shortcuts-mirroring", icon: "↗", title: "Shortcuts and mirroring", subtitle: "Point to data or replicate it into OneLake", minutes: 18, category: "Ingest & Transform", sourceIds: ["S7", "S8", "S24", "S34"],
      summary: "A OneLake shortcut references data in place; mirroring maintains a managed near-real-time replica from a supported source.",
      memoryHook: "A shortcut points. A mirror copies and keeps up.",
      points: ["Shortcuts reduce duplication and can reference internal or supported external locations.", "Deleting a shortcut does not delete the target data.", "Mirroring is managed replication into OneLake for supported databases.", "Real-Time Intelligence can use standard or query-accelerated shortcuts depending on the scenario."],
      trap: "A shortcut is not a backup, and mirroring is not only a metadata pointer.",
      video: { label: "Will Needham — Architectural Decision-Making", url: "https://www.youtube.com/watch?v=KiB4eAeFRsw&t=8367s", note: "Remember point versus copy before reading the options." },
      visual: { title: "Point versus copy", type: "split", items: [
        { icon: "↗", title: "Shortcut", text: "Reference · zero-copy access · target stays in place" },
        { icon: "⧉", title: "Mirroring", text: "Managed replication · near real time · OneLake replica" }
      ]},
      quickCheck: { question: "You need zero-copy access to existing supported data. Which feature is the closest match?", options: ["Mirroring", "OneLake shortcut", "COPY INTO", "OPTIMIZE"], answer: 1, why: "A shortcut references existing data without creating a new copy." }
    },
    {
      id: "lakehouse-delta", icon: "△", title: "Lakehouse, Delta, and medallion", subtitle: "Bronze, Silver, Gold, ACID, MERGE, and replay", minutes: 24, category: "Ingest & Transform", sourceIds: ["S10", "S11", "S17", "S18"],
      summary: "The medallion pattern separates raw, cleaned, and consumption-ready data. Delta tables add transactions, schema, history, and reliable upserts over files.",
      memoryHook: "Bronze keeps. Silver cleans. Gold serves.",
      points: ["Bronze preserves source fidelity so the pipeline can replay data.", "Silver validates, standardizes, deduplicates, and handles missing or late data.", "Gold is shaped for reporting, aggregates, and downstream consumption.", "MERGE upserts, OPTIMIZE compacts small files, VACUUM removes obsolete files, and V-Order improves read layout."],
      trap: "VACUUM can remove files required for older time travel, so retention is a deliberate choice.",
      video: { label: "Aleksi Partanen — full DP-700 course", url: "https://www.youtube.com/watch?v=jTDSP7KBavI", note: "Use for a deeper hands-on Lakehouse walkthrough." },
      visual: { title: "The data gets more useful", type: "stack", items: [
        { icon: "B", title: "Bronze", text: "Raw · complete · replayable" },
        { icon: "S", title: "Silver", text: "Clean · typed · deduplicated" },
        { icon: "G", title: "Gold", text: "Business-ready · modeled · aggregated" }
      ]},
      quickCheck: { question: "Where should you normally preserve the original source payload for replay?", options: ["Gold", "Silver", "Bronze", "A semantic model only"], answer: 2, why: "Bronze preserves raw source fidelity and supports replay." }
    },
    {
      id: "warehouse-modeling", icon: "▦", title: "Warehouse and dimensional modeling", subtitle: "Fact grain, dimensions, surrogate keys, and SCD", minutes: 22, category: "Ingest & Transform", sourceIds: ["S12", "S19", "S30", "S33"],
      summary: "A Warehouse is strongest when relational modeling and T-SQL are central. Declare the fact grain first, then connect descriptive dimensions with stable surrogate keys.",
      memoryHook: "Facts are the numbers. Dimensions tell their story.",
      points: ["Fact grain defines what one fact row represents.", "Dimensions store descriptive context such as customer, product, and date.", "Surrogate keys protect the analytical model from source-key changes.", "SCD Type 1 overwrites history; Type 2 adds a new version row."],
      trap: "A large table is not automatically a fact table; it needs a clear grain and measurable events.",
      video: { label: "Will Needham — Hands-on T-SQL", url: "https://www.youtube.com/watch?v=KiB4eAeFRsw&t=9560s", note: "Practice identifying fact grain before writing SQL." },
      visual: { title: "A star is easier to query", type: "star", items: [
        { icon: "DATE", title: "Date dimension", text: "Calendar context" },
        { icon: "CUST", title: "Customer dimension", text: "Who bought" },
        { icon: "FACT", title: "Sales fact", text: "Quantity · amount · one declared grain" },
        { icon: "PROD", title: "Product dimension", text: "What was bought" },
        { icon: "STORE", title: "Store dimension", text: "Where it happened" }
      ]},
      quickCheck: { question: "Which SCD type preserves historical versions by inserting a new dimension row?", options: ["Type 0", "Type 1", "Type 2", "Type 3 only"], answer: 2, why: "SCD Type 2 creates a new version row and preserves history." }
    },
    {
      id: "pyspark-engineering", icon: "ϟ", title: "PySpark engineering", subtitle: "Partitions, joins, caching, and safe distributed thinking", minutes: 24, category: "Ingest & Transform", sourceIds: ["S16", "S28"],
      summary: "Spark performance depends on how data is partitioned and moved across the cluster. Fix the execution plan before blindly adding compute.",
      memoryHook: "Partition first, then power.",
      points: ["A shuffle redistributes data and can dominate job time.", "A very slow task often signals skew or one oversized partition.", "Cache only data reused across actions and unpersist it when finished.", "Avoid collect() on large data because it moves results to the driver."],
      trap: "More executors cannot fully rescue a skewed key or a single huge partition.",
      video: { label: "Will Needham — Hands-on PySpark", url: "https://www.youtube.com/watch?v=KiB4eAeFRsw&t=11563s", note: "Watch with Spark UI open during practice." },
      visual: { title: "Balanced work wins", type: "compare", items: [
        { icon: "✓", title: "Balanced", text: "Similar partition sizes · parallel tasks finish together" },
        { icon: "!", title: "Skewed", text: "One key owns most rows · one task becomes a straggler" },
        { icon: "OOM", title: "Oversized", text: "Huge partition can exhaust executor memory" }
      ]},
      code: { language: "PySpark", lines: ["df = df.repartition(64, \"CustomerId\")", "result = df.groupBy(\"Region\").sum(\"Amount\")", "# Inspect Spark UI before scaling compute"] },
      quickCheck: { question: "One Spark task runs far longer than every other task. What is the first likely cause to investigate?", options: ["Sensitivity labels", "Data skew", "Deployment pipeline stages", "Dynamic data masking"], answer: 1, why: "A single straggler is a classic signal of skew or an oversized partition." }
    },
    {
      id: "realtime-map", icon: "≈", title: "Real-Time Intelligence map", subtitle: "Eventstream, Eventhouse, KQL Database, and routing", minutes: 24, category: "Ingest & Transform", sourceIds: ["S13", "S25", "S34", "S35", "S36"],
      summary: "Eventstream ingests, transforms, and routes events. Eventhouse contains KQL databases for fast time-series analytics. KQL queries, aggregates, and explores those events.",
      memoryHook: "Eventstream moves. Eventhouse stores. KQL asks.",
      points: ["Use Eventstream operators such as Filter, Manage fields, Expand, Aggregate, Join, and branches.", "Use native Eventhouse tables for directly ingested high-performance event data.", "Use OneLake shortcuts when data should remain elsewhere; compare standard and query-accelerated shortcuts.", "Tune retention for history and cache for the frequently queried hot window."],
      trap: "Retention controls how long data exists; cache controls how much is kept hot for fast access.",
      video: { label: "Will Needham — Real-time introduction", url: "https://www.youtube.com/watch?v=KiB4eAeFRsw&t=12605s", note: "Continue through Eventstreams and the Eventhouse/KQL deep dive." },
      visual: { title: "The real-time path", type: "flow", items: [
        { icon: "≈", title: "Events", text: "Telemetry · logs · clicks" },
        { icon: "⇥", title: "Eventstream", text: "Ingest · transform · route" },
        { icon: "▣", title: "Eventhouse", text: "KQL databases" },
        { icon: "KQL", title: "Query", text: "Explore · aggregate · detect" },
        { icon: "!", title: "Act", text: "Dashboard · alert · downstream route" }
      ]},
      quickCheck: { question: "Which component primarily ingests, transforms, and routes events to destinations?", options: ["Eventstream", "Deployment pipeline", "Warehouse statistics", "Sensitivity label"], answer: 0, why: "Eventstream is the real-time ingestion, transformation, and routing layer." }
    },
    {
      id: "streaming-windows", icon: "⌚", title: "Streaming, watermarks, and windows", subtitle: "Event time, late data, checkpoints, tumbling, hopping, and session", minutes: 25, category: "Ingest & Transform", sourceIds: ["S14", "S31", "S32"],
      summary: "Streaming systems must know when an event occurred, how late it may arrive, how state is bounded, and how processing can recover after failure.",
      memoryHook: "Checkpoint remembers. Watermark decides how late. Window groups time.",
      points: ["Event time is when the source event happened; processing time is when the platform handled it.", "A checkpoint stores offsets, commits, and state so a query can recover.", "A watermark limits how long the engine waits for late events and how much state it retains.", "Tumbling windows do not overlap, hopping windows can overlap, and session windows follow activity separated by inactivity."],
      trap: "A larger lateness tolerance can improve completeness but retain more state and delay final results.",
      video: { label: "Will Needham — Eventstreams & Structured Streaming", url: "https://www.youtube.com/watch?v=KiB4eAeFRsw&t=12995s", note: "Sketch the three window shapes while watching." },
      visual: { title: "Three window shapes", type: "windows", items: [
        { icon: "▯▯▯", title: "Tumbling", text: "Fixed · adjacent · no overlap" },
        { icon: "▰▰▰", title: "Hopping", text: "Fixed · slides · may overlap" },
        { icon: "••  •••", title: "Session", text: "Activity groups separated by a gap" }
      ]},
      quickCheck: { question: "Which window type groups activity until an inactivity gap occurs?", options: ["Tumbling", "Hopping", "Session", "Snapshot"], answer: 2, why: "A session window closes after the configured inactivity gap." }
    },
    {
      id: "monitoring-map", icon: "◎", title: "Monitoring map", subtitle: "Ingestion, transformation, refreshes, and alerts", minutes: 20, category: "Monitor & Optimize", sourceIds: ["S15", "S37", "S38", "V10", "V11"],
      summary: "Start with the monitoring surface that owns the workload, then drill from the overall run to the failing activity, logs, metrics, source, or destination.",
      memoryHook: "Hub → Run → Activity → Logs.",
      points: ["Monitoring hub gives a centralized view of Fabric run activity.", "Pipeline details identify failed activities and their error messages.", "Dataflow Gen2 provides run history and detailed diagnostics.", "Monitor semantic model refreshes and configure alerts when conditions need automated attention."],
      trap: "Rerunning before reading the failure detail can hide the pattern and waste capacity.",
      video: { label: "Will Needham — Monitoring & Optimization intro", url: "https://www.youtube.com/watch?v=KiB4eAeFRsw&t=17213s", note: "Learn the drill-down order, not only the screen names." },
      visual: { title: "Drill down, do not guess", type: "flow", items: [
        { icon: "◎", title: "Monitoring hub", text: "Which run failed?" },
        { icon: "RUN", title: "Run details", text: "Where did it fail?" },
        { icon: "ACT", title: "Activity", text: "What operation failed?" },
        { icon: "LOG", title: "Logs", text: "Why did it fail?" },
        { icon: "FIX", title: "Correct", text: "Then rerun safely" }
      ]},
      quickCheck: { question: "A pipeline fails. What should you normally inspect first?", options: ["Increase capacity immediately", "The failed run and activity error details", "Delete the pipeline", "Change every timeout"], answer: 1, why: "Run and activity details identify the failure point before you change the design." }
    },
    {
      id: "troubleshooting", icon: "!", title: "Troubleshoot by layer", subtitle: "Pipelines, Dataflows, notebooks, Eventstreams, Eventhouse, T-SQL, and shortcuts", minutes: 22, category: "Monitor & Optimize", sourceIds: ["S16", "S36", "S37", "S38", "V13"],
      summary: "Identify the failing layer before choosing a fix: connection, permissions, orchestration, transformation, storage, query, or capacity.",
      memoryHook: "Find the layer before fixing the error.",
      points: ["Pipeline errors often expose a failed activity, connector, expression, parameter, or timeout.", "Notebook errors may involve code, libraries, Spark resources, partitions, or permissions.", "Eventstream and Eventhouse errors can involve schema, ingestion mapping, transformation, retention, cache, or KQL.", "Shortcut errors often come from moved targets, changed credentials, permissions, or unsupported paths."],
      trap: "One generic fix—such as adding compute—cannot solve every class of failure.",
      video: { label: "Will Needham — Monitor & Optimize Processing Tools", url: "https://www.youtube.com/watch?v=KiB4eAeFRsw&t=18305s", note: "Classify the error before selecting the tool or log." },
      visual: { title: "Seven places to look", type: "grid", items: [
        { icon: "↔", title: "Connection", text: "Reachability and credentials" },
        { icon: "▣", title: "Permission", text: "Identity and access" },
        { icon: "⌘", title: "Orchestration", text: "Activity and expression" },
        { icon: "⌁", title: "Transform", text: "Code, schema, mapping" },
        { icon: "◉", title: "Storage", text: "Path, table, shortcut" },
        { icon: "?", title: "Query", text: "Syntax and plan" },
        { icon: "ϟ", title: "Capacity", text: "Resource pressure" }
      ]},
      quickCheck: { question: "A OneLake shortcut worked yesterday but its target was renamed. What should you investigate first?", options: ["The shortcut target path", "Spark executor memory", "A deployment stage", "Warehouse statistics"], answer: 0, why: "Renaming or moving the target can break the shortcut reference." }
    },
    {
      id: "spark-optimization", icon: "ϟ", title: "Optimize Spark", subtitle: "Skew, shuffle, OOM, partitions, cache, and resource profiles", minutes: 22, category: "Monitor & Optimize", sourceIds: ["S16", "S28"],
      summary: "Use Spark UI to inspect stages, tasks, shuffle, skew, and memory. Fix data distribution and the execution plan before scaling resources.",
      memoryHook: "Slow task = check skew. OOM = check partition. Driver crash = check collect().",
      points: ["A single slow task often indicates skew.", "Executor OOM often indicates a huge partition or memory-heavy transformation.", "Driver OOM can result from collect() or an oversized result.", "Resource profiles tune compute for different workloads but do not replace good partition design."],
      trap: "Blindly increasing executor size may cost more without removing the bottleneck.",
      video: { label: "Will Needham — Monitor & Optimize Processing Tools", url: "https://www.youtube.com/watch?v=KiB4eAeFRsw&t=18305s", note: "Use the diagnostic signal to choose the fix." },
      visual: { title: "Signal → likely cause → first action", type: "stack", items: [
        { icon: "1", title: "One straggler", text: "Skew → inspect partition sizes and keys" },
        { icon: "2", title: "Executor OOM", text: "Huge partition → repartition or reduce memory pressure" },
        { icon: "3", title: "Driver OOM", text: "Large collect/result → keep processing distributed" }
      ]},
      quickCheck: { question: "Which action is most dangerous on a very large DataFrame?", options: ["Filter before a join", "Inspect Spark UI", "collect() all rows to the driver", "Repartition by a useful key"], answer: 2, why: "collect() moves all rows to the driver and can exhaust driver memory." }
    },
    {
      id: "lakehouse-optimization", icon: "△", title: "Optimize Lakehouse tables", subtitle: "Small files, OPTIMIZE, VACUUM, V-Order, and retention", minutes: 20, category: "Monitor & Optimize", sourceIds: ["S17", "S18"],
      summary: "Use OPTIMIZE to compact active files, VACUUM to delete obsolete files after the retention window, and V-Order to improve Fabric read layout when its write cost is justified.",
      memoryHook: "OPTIMIZE packs. VACUUM removes. V-Order arranges.",
      points: ["Frequent small writes create many small files and increase read overhead.", "OPTIMIZE compacts small files and can improve read efficiency.", "VACUUM physically removes obsolete files and affects time-travel availability.", "V-Order improves read layout for Fabric engines but adds work during writes."],
      trap: "OPTIMIZE and VACUUM are not synonyms: one reorganizes active data; the other deletes obsolete files.",
      video: { label: "Will Needham — Monitor & Optimize Data Stores", url: "https://www.youtube.com/watch?v=KiB4eAeFRsw&t=19364s", note: "Memorize the verbs: pack, remove, arrange." },
      visual: { title: "Three maintenance verbs", type: "flow", items: [
        { icon: "▦", title: "Small files", text: "High metadata and read overhead" },
        { icon: "PACK", title: "OPTIMIZE", text: "Compact active files" },
        { icon: "ARR", title: "V-Order", text: "Improve read layout" },
        { icon: "DEL", title: "VACUUM", text: "Remove obsolete files after retention" }
      ]},
      quickCheck: { question: "Which command removes obsolete Delta files after the retention period?", options: ["MERGE", "OPTIMIZE", "VACUUM", "COPY INTO"], answer: 2, why: "VACUUM physically removes obsolete files; OPTIMIZE compacts active files." }
    },
    {
      id: "warehouse-pipeline-opt", icon: "▦", title: "Optimize Warehouse, pipelines, and queries", subtitle: "Statistics, pruning, bulk load, parallelism, and cold cache", minutes: 22, category: "Monitor & Optimize", sourceIds: ["S19", "S33", "V12"],
      summary: "Reduce work before adding resources: read fewer rows and columns, maintain useful statistics, batch small writes, and design pipelines for safe parallelism.",
      memoryHook: "Estimate well, read less, write in batches.",
      points: ["Statistics help the optimizer estimate cardinality and select a better plan.", "Project only required columns and filter early to reduce bytes read.", "Batch small writes or use bulk patterns such as COPY INTO.", "A cold first run can be slower than a warm repeat; compare performance fairly."],
      trap: "A faster second run may reflect warm cache rather than a better query design.",
      video: { label: "Will Needham — Monitor & Optimize Data Stores", url: "https://www.youtube.com/watch?v=KiB4eAeFRsw&t=19364s", note: "Separate query-plan improvements from cache effects." },
      visual: { title: "Performance funnel", type: "stack", items: [
        { icon: "1", title: "Read less", text: "Filter early · select needed columns" },
        { icon: "2", title: "Estimate well", text: "Useful statistics · sensible query shape" },
        { icon: "3", title: "Move efficiently", text: "Bulk loads · safe parallel copy" },
        { icon: "4", title: "Scale last", text: "Increase resources after design fixes" }
      ]},
      quickCheck: { question: "Why might the first execution of a query be slower than the second?", options: ["The first run can use a cold cache", "RLS disables statistics", "Git blocks the first query", "A shortcut always duplicates data"], answer: 0, why: "Initialization and cold-cache overhead can make the first run slower." }
    },
    {
      id: "exam-strategy", icon: "✓", title: "Exam strategy and final memory map", subtitle: "Translate the requirement, eliminate traps, and verify the latest behavior", minutes: 16, category: "Monitor & Optimize", sourceIds: ["S1"],
      summary: "DP-700 questions are decision questions. Identify the workload, latency, language, storage, security boundary, and operational requirement before choosing a tool.",
      memoryHook: "Need → layer → tool → trade-off.",
      points: ["Underline the required outcome and constraints before reading product names.", "Eliminate options that solve a different layer of the architecture.", "Expect scenario questions that combine storage, ingestion, security, and operations.", "Use the official Microsoft Learn behavior as the final authority when videos or dumps disagree."],
      trap: "Do not memorize answer letters or assume the longest option is correct.",
      video: { label: "Will Needham — Exam Technique and Tips", url: "https://www.youtube.com/watch?v=KiB4eAeFRsw&t=20630s", note: "Use after finishing the lessons and practice banks." },
      visual: { title: "The five-question decision loop", type: "cycle", items: [
        { icon: "1", title: "Workload", text: "Batch, stream, SQL, Spark, or KQL?" },
        { icon: "2", title: "Latency", text: "Full, incremental, or real time?" },
        { icon: "3", title: "Store", text: "Lakehouse, Warehouse, or Eventhouse?" },
        { icon: "4", title: "Protect", text: "Workspace, item, row, column, or file?" },
        { icon: "5", title: "Operate", text: "Monitor, recover, and optimize how?" }
      ]},
      quickCheck: { question: "A video and Microsoft Learn disagree about a current Fabric capability. Which source should control your exam preparation?", options: ["The oldest video", "The dump answer", "Current official Microsoft Learn documentation", "The most repeated social-media answer"], answer: 2, why: "Fabric changes quickly; current official documentation is the source of truth." }
    }
  ]
};
