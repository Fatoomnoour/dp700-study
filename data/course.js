window.DP700_COURSE = {
  meta: {
    title: "DP-700 Professional Training Course",
    sourceOutlineActivities: 213,
    moduleCount: 15,
    approach: "Full lesson → Arabic explanation → Visual map → Code → Guided lab → Exam patterns → Existing-question practice"
  },
  modules: [
    {
      id: "foundations", number: 1, icon: "◫", title: "Data Engineering Foundations", subtitle: "Build the mental model before opening Fabric", domain: "Foundation", level: "Beginner", questionIds: [28, 41, 42, 43, 44], visualLessonIds: ["fabric-map", "lakehouse-delta"],
      summary: "Understand the data-engineering lifecycle, why Lakehouse architecture emerged, and how Medallion and Delta Lake turn raw data into reliable analytical products.",
      outcomes: ["Explain the data-engineering lifecycle and stakeholder needs", "Compare warehouse, data lake, and lakehouse architectures", "Connect Medallion layers to Delta Lake reliability features"],
      conceptMap: ["Sources", "Raw data", "Bronze", "Silver", "Gold", "Analytics"],
      examPatterns: ["Choose the correct Medallion layer for a requirement", "Identify what Delta adds above Parquet", "Separate architecture concepts from Fabric product names"],
      lab: { title: "Design a first Medallion solution", steps: ["Choose a public dataset", "Define Bronze, Silver, and Gold responsibilities", "Write three data-quality rules", "Draw the consumer path from source to report"] },
      lectures: [
        "Course Overview|2:42", "Make BEST use of this course|7:02", "What is Data Engineering?|13:15", "Evolution of Data Engineering|8:47", "What is Lakehouse?|6:23", "Medallion Architecture Explained|3:17", "Delta Lake: the reliability layer|10:27", "Azure Free Account|11:18", "Azure Fundamentals|34:28", "Resources: project files|0:04", "Resources: T-SQL scripts|0:03", "Resources: Spark notebooks|0:03", "Course slides|0:03"
      ]
    },
    {
      id: "fabric-onelake", number: 2, icon: "◉", title: "Fabric Platform & OneLake", subtitle: "Tenant, capacity, workspace, roles, and the shared data foundation", domain: "Implement & Manage", level: "Beginner", questionIds: [1, 2, 3, 14, 15, 22, 23, 24], visualLessonIds: ["fabric-map", "workspace-settings", "security-layers"],
      summary: "Learn how the Fabric hierarchy fits together and why OneLake acts as the tenant-wide logical data lake across workloads.",
      outcomes: ["Navigate the Fabric hierarchy and portal", "Explain capacity, workspace, and role boundaries", "Use OneLake and File Explorer with the correct access mental model"],
      conceptMap: ["Tenant", "Capacity", "Workspace", "Item", "OneLake", "User"],
      examPatterns: ["Choose the least-privilege workspace role", "Distinguish capacity administration from workspace access", "Recognize OneLake as shared storage rather than compute"],
      lab: { title: "Map a Fabric tenant", steps: ["Create a tenant-to-item hierarchy diagram", "Assign four personas to workspace roles", "Locate OneLake paths for two items", "Document one access risk and mitigation"] },
      lectures: [
        "Why Microsoft Fabric?|6:08", "What is Microsoft Fabric?|10:12", "Hierarchy in Microsoft Fabric|9:17", "Roles in Microsoft Fabric|11:10", "Fabric Free Account|17:02", "Fabric Portal Overview|10:50", "What is OneLake?|6:59", "Why OneLake?|9:58", "Manage data with OneLake File Explorer|3:09", "Module knowledge test|quiz"
      ]
    },
    {
      id: "lakehouse-shortcuts", number: 3, icon: "△", title: "Lakehouse, Tables & Shortcuts", subtitle: "Files, Delta tables, schemas, SQL endpoints, and zero-copy access", domain: "Ingest & Transform", level: "Intermediate", questionIds: [26, 27, 28, 29, 30, 31, 32, 33, 44], visualLessonIds: ["shortcuts-mirroring", "lakehouse-delta"],
      summary: "Build a Lakehouse, choose between Files and Tables, and use internal or external shortcuts when data should remain in place.",
      outcomes: ["Create and load a Lakehouse", "Choose managed tables, external data, or shortcuts", "Explain shortcut caching, schemas, and SQL endpoint limitations"],
      conceptMap: ["Source", "Shortcut", "Files", "Delta table", "SQL endpoint", "Consumer"],
      examPatterns: ["Decide whether data should be copied, mirrored, or referenced", "Choose Tables versus Files", "Diagnose a shortcut target or permission failure"],
      lab: { title: "Build a shortcut-enabled Lakehouse", steps: ["Create Bronze and Silver Lakehouses", "Load CSV and Parquet files", "Create an internal table shortcut", "Query the result through the SQL endpoint"] },
      lectures: [
        "What is a Fabric Lakehouse?|11:47", "Create your first Lakehouse|11:51", "Load data to Lakehouse|7:12", "OneLake File Explorer with Lakehouse|3:07", "Create tables in Lakehouse|6:27", "Parquet files with Lakehouse|5:45", "Shortcuts in Fabric|3:26", "Internal shortcuts explained|4:41", "External shortcuts explained|2:46", "Internal shortcuts with Files|6:03", "Internal shortcuts with Tables|14:24", "External shortcut walkthrough|16:15", "Caching in shortcuts|8:00", "Lakehouse with schema|8:08", "Lakehouse SQL endpoint|8:02", "Module knowledge test|quiz"
      ]
    },
    {
      id: "data-factory", number: 4, icon: "⌘", title: "Data Factory & Orchestration", subtitle: "Copy, metadata-driven pipelines, parameters, triggers, and monitoring", domain: "Ingest & Transform", level: "Intermediate", questionIds: [17, 20, 21, 34, 35, 37, 38, 39, 40, 77, 78], visualLessonIds: ["orchestration", "loading-patterns", "monitoring-map"],
      summary: "Build maintainable Fabric pipelines that ingest data, coordinate dependencies, handle parameters, notify failures, and restart safely.",
      outcomes: ["Build Copy activities and metadata-driven loops", "Use parameters, variables, conditions, and child pipelines", "Configure triggers, monitoring, and safe incremental boundaries"],
      conceptMap: ["Trigger", "Pipeline", "Metadata", "Loop", "Copy", "Monitor"],
      examPatterns: ["Select Pipeline versus Dataflow Gen2 versus Notebook", "Place the watermark update after successful copy", "Locate and retry a failed pipeline activity"],
      lab: { title: "Metadata-driven incremental pipeline", steps: ["Read source folder metadata", "Filter supported files", "Loop through files with parameters", "Copy to Bronze and update watermark after success", "Add a failure-notification path"] },
      lectures: [
        "Data ingestion in Fabric|2:40", "What is Fabric Data Factory?|6:48", "Fabric Data Factory overview|11:02", "Copy Activity|18:06", "Ingest from ADLS Gen2|12:42", "Loops and parameters|20:17", "Metadata Activity|9:06", "Filter Activity|8:55", "If Condition|4:16", "Delete Activity|2:58", "Variables|4:08", "Failure email notification|5:16", "Parent and child pipelines|6:07", "Triggers|3:45", "Pipeline monitoring|5:01", "Module knowledge test|quiz"
      ]
    },
    {
      id: "dataflow-gen2", number: 5, icon: "⌁", title: "Dataflow Gen2", subtitle: "Low-code cleaning, joins, destinations, scheduling, and orchestration", domain: "Ingest & Transform", level: "Intermediate", questionIds: [18, 36, 37, 46, 47, 79], visualLessonIds: ["orchestration", "batch-tool-choice"],
      summary: "Use the Power Query experience for repeatable low-code transformations and integrate Dataflows into wider pipeline orchestration.",
      outcomes: ["Clean, cast, and transform columns", "Join queries and configure Lakehouse destinations", "Schedule and orchestrate Dataflows through pipelines"],
      conceptMap: ["Source", "Power Query", "Transform", "Join", "Destination", "Refresh"],
      examPatterns: ["Choose Dataflow Gen2 for maintainable visual transformation", "Separate Fast Copy from transformation steps", "Use detailed run logs for Dataflow failures"],
      lab: { title: "Customer enrichment Dataflow", steps: ["Import customer and order data", "Correct types and missing values", "Merge queries using CustomerId", "Publish to a Silver Lakehouse table", "Run the Dataflow from a pipeline"] },
      lectures: [
        "Dataflow Gen2 overview|6:29", "Type casting|10:49", "Replace values|2:17", "String transformations|3:52", "Statistical functions|4:00", "Diagram view|4:56", "Joins in Dataflow Gen2|6:34", "Add a Lakehouse destination|5:18", "Schedule Dataflows|2:38", "Integrate Dataflow Gen2 with Data Factory|5:42"
      ]
    },
    {
      id: "spark-pyspark", number: 6, icon: "ϟ", title: "Spark, PySpark & Notebooks", subtitle: "Distributed processing, transformations, environments, jobs, and diagnostics", domain: "Ingest & Transform", level: "Intermediate", questionIds: [14, 15, 19, 80, 86, 87, 88, 89, 90, 96], visualLessonIds: ["pyspark-engineering", "spark-optimization"],
      summary: "Develop distributed transformations with PySpark, organize runtime dependencies with Environments, and diagnose stages, tasks, shuffle, skew, and memory.",
      outcomes: ["Write practical DataFrame and Spark SQL transformations", "Choose starter pools, custom pools, and Environments", "Monitor notebook runs and diagnose Spark execution"],
      conceptMap: ["Notebook", "Driver", "Executors", "Partitions", "Shuffle", "Spark UI"],
      examPatterns: ["Recognize skew from a straggler task", "Separate Executor OOM from Driver OOM", "Choose a workload-specific Environment or resource profile"],
      lab: { title: "PySpark Silver transformation", steps: ["Read Bronze Parquet data", "Cast and clean columns", "Handle nulls and conditional flags", "Repartition by a useful key", "Write a Delta Silver table and inspect Spark UI"] },
      lectures: [
        "Understand Spark|12:04", "Fabric node sizes|2:25", "Starter pools versus custom pools|7:15", "Fabric notebooks overview|17:14", "PySpark fundamentals|18:42", "Type casting in PySpark|6:29", "Transform date columns|10:43", "Replace values in PySpark|11:01", "Intermediate PySpark functions|20:51", "Timestamp functions|6:16", "Spark SQL in PySpark|6:09", "Notebook data visualization|7:29", "External versus managed tables|26:19", "NotebookUtils (MSSparkUtils)|23:34", "Delta Lake tables|2:42", "Time travel|10:10", "Delta optimization strategies|9:39", "VACUUM and Optimize Write|4:54", "Spark streaming with Delta|12:26", "Isolated Spark Environments|5:03", "Create a Fabric Environment|18:24", "Monitor and schedule notebooks|9:51", "Spark Job Definition|6:14", "Import notebooks|0:53", "Module knowledge test|quiz"
      ]
    },
    {
      id: "warehouse-tsql", number: 7, icon: "▦", title: "Warehouse, T-SQL & Semantic Models", subtitle: "Dimensional modeling, loading, security, monitoring, and Direct Lake", domain: "Ingest & Transform", level: "Intermediate", questionIds: [5, 6, 48, 49, 50, 97, 98, 99, 100], visualLessonIds: ["warehouse-modeling", "warehouse-pipeline-opt", "security-layers"],
      summary: "Design relational analytical models, load them efficiently, build Gold views, secure rows and columns, and monitor Warehouse query behavior.",
      outcomes: ["Design Facts, Dimensions, grain, and SCD behavior", "Use COPY INTO, CTAS, views, functions, and procedures", "Apply Warehouse security and build a semantic model"],
      conceptMap: ["Source", "Stage", "Warehouse", "Star schema", "Semantic model", "Report"],
      examPatterns: ["Choose an SCD type and surrogate-key strategy", "Distinguish RLS, CLS, and Dynamic Data Masking", "Reduce trickle DML and improve query cardinality estimates"],
      lab: { title: "Gold star schema", steps: ["Declare Sales fact grain", "Create Date, Customer, and Product dimensions", "Load with CTAS or COPY INTO", "Create Gold analytical views", "Apply a row or column security rule"] },
      lectures: [
        "Data Warehouse fundamentals|23:15", "Fabric Data Warehouse overview|17:06", "Load data to Warehouse|6:22", "COPY INTO|7:35", "CTAS|11:02", "Gold aggregated view with T-SQL|20:36", "Gold business view with T-SQL|9:09", "T-SQL functions|7:50", "Stored procedures|5:57", "Dynamic Management Views|10:16", "Query Insights views|5:49", "Visual Query Editor|7:35", "Integrate T-SQL with Notebook|4:47", "SSMS setup|12:24", "Warehouse access control|11:48", "Dynamic Data Masking|8:20", "Column-Level Security|7:56", "Row-Level Security|14:36", "Semantic models|10:38", "Direct Lake|5:42", "Module knowledge test|quiz"
      ]
    },
    {
      id: "governance-monitoring", number: 8, icon: "▣", title: "Security, Governance & Monitoring", subtitle: "Least privilege, lineage, endorsement, admin, gateways, and capacity", domain: "Implement & Manage", level: "Intermediate", questionIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 22, 23, 24, 25, 76, 84, 85], visualLessonIds: ["security-layers", "monitoring-map", "workspace-settings"],
      summary: "Protect Fabric at the workspace, item, and data layers; govern trust and classification; and monitor operational activity separately from audit evidence.",
      outcomes: ["Apply least privilege across Fabric access layers", "Use lineage, endorsement, labels, and audit correctly", "Monitor workloads, gateways, and capacity pressure"],
      conceptMap: ["Identity", "Workspace", "Item", "Data", "Govern", "Monitor"],
      examPatterns: ["Choose workspace, item, row, column, object, or file controls", "Separate endorsement from sensitivity classification", "Choose Monitoring hub versus audit logs versus Capacity Metrics"],
      lab: { title: "Govern a production workspace", steps: ["Create a persona-to-permission matrix", "Apply an endorsement and sensitivity classification", "Trace lineage for a Gold table", "Review operational runs", "Document an audit investigation path"] },
      lectures: [
        "Why Fabric access control?|2:17", "Workspace-level access|4:09", "Item-level access|7:35", "OneLake-level access|7:06", "Data lineage|7:23", "Endorsements|9:05", "Monitoring in Fabric|4:07", "Fabric admin access|4:05", "Connections and gateways|2:08", "Fabric Capacity Metrics app|3:46"
      ]
    },
    {
      id: "realtime-kql", number: 9, icon: "≈", title: "Real-Time Intelligence & KQL", subtitle: "Windows, Eventstream, Eventhouse, KQL DB, dashboards, and Activator", domain: "Ingest & Transform", level: "Intermediate", questionIds: [51, 52, 53, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75], visualLessonIds: ["realtime-map", "streaming-windows"],
      summary: "Ingest continuous events, transform and route them with Eventstream, analyze them in Eventhouse using KQL, and trigger action from real-time conditions.",
      outcomes: ["Choose the correct streaming window", "Build Eventstream transformations and routes", "Write KQL filters, summaries, functions, and dashboard queries"],
      conceptMap: ["Event source", "Eventstream", "Eventhouse", "KQL", "Dashboard", "Activator"],
      examPatterns: ["Choose Filter, Manage fields, Expand, Aggregate, or Join", "Distinguish retention from cache", "Choose update policy or materialized view for repeated transformations"],
      lab: { title: "Live telemetry solution", steps: ["Create an Eventstream source", "Filter and aggregate in a window", "Route to a KQL Database", "Build a KQL dashboard tile", "Create an Activator condition"] },
      lectures: [
        "What is Real-Time Analytics?|6:57", "Tumbling windows|1:37", "Hopping windows|1:58", "Sliding windows|1:58", "Session windows|1:32", "Snapshot windows|1:39", "Eventstream in Fabric|6:33", "Transform real-time data|8:25", "Eventhouse and KQL DB|13:49", "KQL overview|2:15", "KQL basics|4:43", "Filtering and date functions|7:45", "Aggregation in KQL|4:14", "Materialized views in KQL|8:02", "KQL functions|4:23", "Real-Time dashboards|7:26", "Dashboard base queries|4:00", "Fabric Activator|8:14", "Module knowledge test|quiz"
      ]
    },
    {
      id: "cicd", number: 10, icon: "⑂", title: "CI/CD & Lifecycle", subtitle: "Git integration, Azure DevOps, branches, pull requests, and deployment stages", domain: "Implement & Manage", level: "Intermediate", questionIds: [10, 11, 12, 13], visualLessonIds: ["cicd-lifecycle"],
      summary: "Use Git for controlled collaboration and Deployment pipelines for safe promotion of supported Fabric items across environments.",
      outcomes: ["Configure Git integration and branching", "Use feature branches and pull requests", "Promote supported items through Dev, Test, and Production"],
      conceptMap: ["Feature branch", "Pull request", "Main", "Dev", "Test", "Production"],
      examPatterns: ["Separate source control from deployment", "Choose database projects for SQL objects as code", "Recognize unsupported-item deployment limitations"],
      lab: { title: "Controlled Fabric release", steps: ["Connect a Dev workspace to a repository", "Create and merge a feature branch", "Configure Dev, Test, and Prod stages", "Deploy selected items", "Record and resolve a deployment difference"] },
      lectures: [
        "What is CI/CD?|2:37", "Continuous Integration in Fabric|9:35", "Azure DevOps setup|13:49", "Feature branches and pull requests|7:32", "Continuous Deployment|2:04", "Deployment pipelines setup|3:15", "Synchronize stages|3:42", "End-to-end CI/CD pipeline|10:39", "Deployment errors and limitations|8:53", "Module knowledge test|quiz"
      ]
    },
    {
      id: "m-language", number: 11, icon: "M", title: "Power Query M Language", subtitle: "Syntax, data objects, transformations, and reusable functions", domain: "Ingest & Transform", level: "Intermediate", questionIds: [18, 36, 46, 47], visualLessonIds: ["batch-tool-choice", "orchestration"],
      summary: "Move beyond the visual interface and understand how Power Query transformations are represented as ordered, reusable M expressions.",
      outcomes: ["Read let/in expressions and evaluation order", "Transform Tables, Lists, Records, and scalar values", "Create reusable custom M functions"],
      conceptMap: ["Source", "let", "Step", "Function", "in", "Result"],
      examPatterns: ["Choose M/Dataflow for maintainable low-code transformations", "Understand step dependencies and type conversion", "Separate list, record, and table operations"],
      lab: { title: "Reusable M cleaning function", steps: ["Import a dirty CSV", "Create typed transformation steps", "Build a custom text-cleaning function", "Apply it to a Table column", "Load the result to a Lakehouse destination"] },
      lectures: [
        "M section introduction|1:57", "What is M Language?|2:16", "M Language use cases|2:49", "M syntax|9:43", "let and in|2:20", "Order of execution|2:47", "Custom M code|5:09", "SELECT|5:07", "FILTER|1:57", "ADDCOLUMN|2:08", "REMOVECOLUMN|2:00", "TYPE CASTING|2:24", "SORTING|3:00", "AGGREGATION|2:57", "EACH object|4:13", "LIST object|2:00", "RECORD object|3:48", "TABLE object|1:51", "Text functions|7:11", "Number functions|6:30", "Date functions|3:24", "List functions|2:20", "Table functions|3:21", "Custom M functions|3:57", "Module knowledge test|quiz"
      ]
    },
    {
      id: "optimization", number: 12, icon: "◎", title: "Performance Optimization", subtitle: "Lakehouse, pipelines, Warehouse, Spark, Eventstream, and accelerated shortcuts", domain: "Monitor & Optimize", level: "Advanced", questionIds: [86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100], visualLessonIds: ["spark-optimization", "lakehouse-optimization", "warehouse-pipeline-opt"],
      summary: "Diagnose the signal first, reduce unnecessary work second, and scale resources only after fixing data layout and execution design.",
      outcomes: ["Optimize Delta file layout and retention", "Improve pipeline, Warehouse, and Spark execution", "Choose standard or query-accelerated shortcuts"],
      conceptMap: ["Measure", "Locate bottleneck", "Reduce work", "Improve layout", "Tune compute", "Verify"],
      examPatterns: ["Map a performance symptom to its likely layer", "Choose OPTIMIZE, VACUUM, V-Order, or statistics", "Separate cold-cache effects from design improvements"],
      lab: { title: "Performance investigation notebook", steps: ["Capture a baseline", "Inspect Spark or query diagnostics", "Apply one design change", "Repeat under comparable cache conditions", "Document result and trade-off"] },
      lectures: [
        "Optimization introduction|1:18", "Optimize Lakehouse|5:00", "Optimize pipelines|6:24", "Optimize Warehouse|5:26", "Optimize Spark and queries|5:44", "Set Spark configurations|3:39", "Optimize Eventstream|3:46", "Accelerated versus standard shortcuts|14:03", "Create an accelerated KQL shortcut|6:39"
      ]
    },
    {
      id: "structured-streaming", number: 13, icon: "⌚", title: "Spark Structured Streaming", subtitle: "State, checkpoints, output modes, event time, and recoverable processing", domain: "Ingest & Transform", level: "Advanced", questionIds: [54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64], visualLessonIds: ["streaming-windows", "spark-optimization"],
      summary: "Build streaming queries that recover correctly, bound state with watermarks, and emit results according to the chosen output mode.",
      outcomes: ["Separate stateless and stateful operations", "Configure unique checkpoints and output modes", "Process event-time windows and late data"],
      conceptMap: ["Source", "Event time", "State", "Watermark", "Checkpoint", "Sink"],
      examPatterns: ["Explain what a checkpoint stores", "Choose a unique checkpoint per query", "Reason about Append mode and watermark finalization"],
      lab: { title: "Recoverable Delta stream", steps: ["Read a streaming Delta source", "Apply an event-time window", "Configure watermark and checkpoint", "Write to a Delta destination", "Stop and restart to verify recovery"] },
      lectures: [
        "Structured Streaming introduction|1:30", "Spark streaming structure|6:43", "Stateless versus stateful transforms|6:31", "Checkpoint location|3:10", "Output modes|3:42", "Process stream data|8:14"
      ]
    },
    {
      id: "materialized-lake-views", number: 14, icon: "MLV", title: "Materialized Lake Views", subtitle: "Declarative pipelines, CDF, automated refresh, quality, lineage, and debugging", domain: "Ingest & Transform", level: "Advanced", questionIds: [41, 42, 43, 46, 47, 73, 74], visualLessonIds: ["lakehouse-delta", "monitoring-map"],
      summary: "Understand the new MLV framework as a declarative approach to maintaining Bronze, Silver, and Gold transformations with refresh, lineage, and quality controls.",
      outcomes: ["Explain MLV architecture and refresh behavior", "Use Change Data Feed in incremental processing", "Design quality checks, lineage, schedules, and troubleshooting"],
      conceptMap: ["Source", "CDF", "Bronze MLV", "Silver MLV", "Gold MLV", "Quality report"],
      examPatterns: ["Compare declarative MLV pipelines with imperative notebooks", "Recognize CDF and refresh dependencies", "Treat preview or new features according to current Microsoft documentation"],
      lab: { title: "Bronze-to-Gold MLV design", steps: ["Define source and target contracts", "Enable required Change Data Feed settings", "Create Bronze, Silver, and Gold view definitions", "Add a data-quality rule", "Test refresh, lineage, and failure diagnostics"] },
      lectures: [
        "MLV section introduction|1:44", "What is MLV?|3:37", "MLV core concepts|3:46", "Why use MLVs?|5:28", "Automatic refresh|3:24", "How MLVs work|3:38", "Enable CDF for MLVs|9:00", "Build Bronze with MLVs|11:05", "Build Silver with MLVs|10:32", "Build Gold with MLVs|12:13", "Data-quality checks and SQL MLV|5:16", "MLV lineage|2:00", "Optimal refresh|1:02", "Schedule MLVs|2:12", "Debug MLVs|1:59", "Data-quality report|2:07", "MLV limitations|2:14"
      ]
    },
    {
      id: "capstone", number: 15, icon: "✓", title: "Capstone & Exam Readiness", subtitle: "Build one complete solution and translate requirements into exam decisions", domain: "Mixed", level: "Exam Ready", questionIds: [10, 17, 26, 31, 38, 41, 45, 48, 51, 56, 60, 65, 71, 76, 77, 80, 86, 91, 97, 100], visualLessonIds: ["exam-strategy", "fabric-map", "monitoring-map"],
      summary: "Join the modules into one end-to-end engineering story, then practice identifying the workload, latency, store, language, security layer, and operational requirement in every scenario.",
      outcomes: ["Design and explain an end-to-end Fabric solution", "Defend tool choices using requirements and trade-offs", "Complete timed mixed practice and close weak areas"],
      conceptMap: ["Requirement", "Architecture", "Build", "Secure", "Operate", "Defend"],
      examPatterns: ["Need → layer → tool → trade-off", "Eliminate options that solve the wrong architectural layer", "Verify new or changed behavior against current Microsoft Learn"],
      lab: { title: "Professional DP-700 capstone", steps: ["Ingest batch and streaming sources", "Build Bronze, Silver, and Gold outputs", "Serve SQL and real-time consumers", "Apply least privilege and governance", "Monitor, troubleshoot, and optimize", "Present architecture decisions in five minutes"] },
      lectures: [
        "Architecture decision worksheet|project", "End-to-end Fabric capstone|project", "Security and governance review|project", "Monitoring and optimization review|project", "Timed mixed practice|quiz", "Final readiness check|quiz"
      ]
    }
  ]
};
