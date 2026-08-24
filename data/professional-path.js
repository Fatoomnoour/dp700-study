window.DP700_PROFESSIONAL_PATH = {
  "version": "9.0.0",
  "diagnostic": {
    "title": "DP-700 Foundation Diagnostic",
    "questions": [
      {
        "question": "Which SQL clause filters groups after aggregation?",
        "options": [
          "WHERE",
          "HAVING",
          "ORDER BY",
          "DISTINCT"
        ],
        "answer": 1,
        "why": "HAVING filters aggregated groups; WHERE filters rows before grouping."
      },
      {
        "question": "A LEFT JOIN returns which rows?",
        "options": [
          "Only matched rows",
          "All right rows",
          "All left rows plus matches",
          "Only unmatched rows"
        ],
        "answer": 2,
        "why": "LEFT JOIN preserves every row from the left input."
      },
      {
        "question": "What is the primary purpose of a window function?",
        "options": [
          "Delete duplicates automatically",
          "Calculate across related rows without collapsing them",
          "Create indexes",
          "Encrypt columns"
        ],
        "answer": 1,
        "why": "Window functions preserve row detail while calculating over a defined window."
      },
      {
        "question": "Which Python structure stores key/value pairs?",
        "options": [
          "tuple",
          "set",
          "dictionary",
          "generator"
        ],
        "answer": 2,
        "why": "A dictionary stores key/value pairs."
      },
      {
        "question": "What does try/except provide?",
        "options": [
          "Parallelism",
          "Error handling",
          "Schema evolution",
          "Caching"
        ],
        "answer": 1,
        "why": "try/except catches and handles runtime exceptions."
      },
      {
        "question": "Spark transformations are usually lazy. What does this mean?",
        "options": [
          "They never run",
          "They execute only after an action requires a result",
          "They use one thread",
          "They skip validation"
        ],
        "answer": 1,
        "why": "Spark builds a logical plan and executes it when an action is called."
      },
      {
        "question": "Which operation commonly causes a Spark shuffle?",
        "options": [
          "selecting one column",
          "renaming a column",
          "groupBy aggregation",
          "reading one file"
        ],
        "answer": 2,
        "why": "groupBy redistributes rows by key and normally causes a shuffle."
      },
      {
        "question": "What does a Delta MERGE commonly implement?",
        "options": [
          "Only full overwrite",
          "Upsert logic",
          "File encryption",
          "Capacity scaling"
        ],
        "answer": 1,
        "why": "MERGE can update matched rows and insert unmatched rows."
      },
      {
        "question": "Which KQL operator performs aggregation?",
        "options": [
          "project",
          "extend",
          "summarize",
          "sort"
        ],
        "answer": 2,
        "why": "summarize groups and aggregates rows."
      },
      {
        "question": "Which KQL function commonly creates time buckets?",
        "options": [
          "bin()",
          "take()",
          "parse_json()",
          "tolower()"
        ],
        "answer": 0,
        "why": "bin() groups datetime or numeric values into fixed buckets."
      },
      {
        "question": "Which layer should preserve source data for replay?",
        "options": [
          "Bronze",
          "Silver",
          "Gold",
          "Semantic model"
        ],
        "answer": 0,
        "why": "Bronze is the raw, replayable layer."
      },
      {
        "question": "What makes an incremental process idempotent?",
        "options": [
          "It uses the largest cluster",
          "Repeated execution produces the same correct final state",
          "It always appends",
          "It disables retries"
        ],
        "answer": 1,
        "why": "Idempotency means safe repeat execution without duplicate or corrupt results."
      },
      {
        "question": "In Fabric, which object supplies compute resources?",
        "options": [
          "Workspace",
          "Capacity",
          "OneLake",
          "Domain"
        ],
        "answer": 1,
        "why": "Capacity supplies compute; workspaces organize items."
      },
      {
        "question": "Which Fabric item is most natural for high-volume telemetry queried with KQL?",
        "options": [
          "Warehouse",
          "Eventhouse",
          "Dataflow Gen2",
          "Deployment pipeline"
        ],
        "answer": 1,
        "why": "Eventhouse and KQL Database are optimized for real-time and time-series analytics."
      },
      {
        "question": "A shortcut primarily does what?",
        "options": [
          "Copies data nightly",
          "References existing data without moving it",
          "Creates a semantic model",
          "Scales Spark"
        ],
        "answer": 1,
        "why": "A shortcut is a reference to existing data."
      },
      {
        "question": "What is the safest role principle?",
        "options": [
          "Always use Admin",
          "Grant the broadest role to avoid errors",
          "Use least privilege",
          "Use one shared account"
        ],
        "answer": 2,
        "why": "Least privilege grants only the access required."
      },
      {
        "question": "What is a pull request mainly used for?",
        "options": [
          "Capacity monitoring",
          "Reviewing and merging changes",
          "Refreshing data",
          "Running KQL"
        ],
        "answer": 1,
        "why": "A pull request supports review before merging changes."
      },
      {
        "question": "Git integration and deployment pipelines are best described as:",
        "options": [
          "The same feature",
          "Source control and environment promotion",
          "Two query engines",
          "Two storage formats"
        ],
        "answer": 1,
        "why": "Git controls versions; deployment pipelines promote supported items across stages."
      }
    ],
    "thresholds": {
      "foundation": 50,
      "standard": 75
    },
    "groups": [
      {
        "id": "sql",
        "label": "SQL",
        "indexes": [
          0,
          1,
          2
        ]
      },
      {
        "id": "python",
        "label": "Python",
        "indexes": [
          3,
          4
        ]
      },
      {
        "id": "spark",
        "label": "Spark & Delta",
        "indexes": [
          5,
          6,
          7
        ]
      },
      {
        "id": "kql",
        "label": "KQL",
        "indexes": [
          8,
          9
        ]
      },
      {
        "id": "engineering",
        "label": "Data Engineering",
        "indexes": [
          10,
          11
        ]
      },
      {
        "id": "fabric",
        "label": "Fabric & Security",
        "indexes": [
          12,
          13,
          14,
          15
        ]
      },
      {
        "id": "git",
        "label": "Git & CI/CD",
        "indexes": [
          16,
          17
        ]
      }
    ]
  },
  "bootcamp": [
    {
      "id": "sql-core",
      "title": "SQL Fundamentals",
      "icon": "SQL",
      "minutes": 120,
      "description": "Build the relational and analytical SQL foundation required for Fabric Warehouse and SQL analytics endpoints.",
      "skills": [
        "SELECT, WHERE, GROUP BY, HAVING",
        "INNER/LEFT joins and set operations",
        "CTEs and window functions",
        "INSERT, UPDATE, DELETE, MERGE",
        "Star-schema terminology and grain"
      ],
      "challenge": "Write one query that joins Orders, Customers, and Products, calculates monthly revenue, and ranks products inside each category."
    },
    {
      "id": "python-core",
      "title": "Python for Data Engineering",
      "icon": "Py",
      "minutes": 90,
      "description": "Learn the Python patterns used in notebooks, transformation functions, validation, and debugging.",
      "skills": [
        "Variables, collections, and control flow",
        "Functions and error handling",
        "Working with dates and JSON",
        "List/dictionary comprehensions",
        "Readable logging and assertions"
      ],
      "challenge": "Create a function that validates an order dictionary, normalizes its fields, and returns rejected-record reasons."
    },
    {
      "id": "spark-core",
      "title": "Spark & PySpark Foundations",
      "icon": "⚡",
      "minutes": 150,
      "description": "Understand distributed execution before learning Fabric-specific Spark pools, notebooks, and Delta patterns.",
      "skills": [
        "Driver, executors, jobs, stages, and tasks",
        "DataFrames and lazy evaluation",
        "Partitions, shuffle, cache, and broadcast",
        "Read/write Parquet and Delta",
        "Transformations versus actions"
      ],
      "challenge": "Read a partitioned dataset, remove duplicates, aggregate by date, and explain where a shuffle occurs."
    },
    {
      "id": "kql-core",
      "title": "KQL Foundations",
      "icon": "KQL",
      "minutes": 100,
      "description": "Prepare for Eventhouse, KQL Database, Real-Time dashboards, and telemetry analysis.",
      "skills": [
        "where, project, extend, summarize",
        "join and union",
        "datetime and bin functions",
        "Time-series exploration",
        "Reading KQL execution intent"
      ],
      "challenge": "Write a KQL query that calculates five-minute error rates by service and returns the worst three services."
    },
    {
      "id": "de-core",
      "title": "Data Engineering Concepts",
      "icon": "DE",
      "minutes": 120,
      "description": "Create the mental models needed to choose stores, loading patterns, quality layers, and serving models.",
      "skills": [
        "Batch versus streaming",
        "ETL versus ELT",
        "Data lake, warehouse, and lakehouse",
        "Medallion architecture",
        "Incremental, CDC, watermark, and idempotency"
      ],
      "challenge": "Design a source-to-consumption flow for daily ERP data plus real-time IoT events."
    },
    {
      "id": "fabric-core",
      "title": "Microsoft Fabric Fundamentals",
      "icon": "F",
      "minutes": 120,
      "description": "Learn the platform hierarchy and core experiences before advanced implementation.",
      "skills": [
        "Tenant, capacity, workspace, and item",
        "OneLake and shortcuts",
        "Lakehouse, Warehouse, and Eventhouse",
        "Pipeline, Dataflow Gen2, and Notebook",
        "Workspace and item permissions"
      ],
      "challenge": "Map five business requirements to the correct Fabric item and administrative layer."
    },
    {
      "id": "git-core",
      "title": "Git & Delivery Basics",
      "icon": "⑂",
      "minutes": 75,
      "description": "Understand version control and environment promotion before Fabric CI/CD lessons.",
      "skills": [
        "Repository, commit, branch, and merge",
        "Feature branches and pull requests",
        "Conflict resolution basics",
        "Source control versus deployment",
        "Dev, Test, and Production separation"
      ],
      "challenge": "Describe a safe workflow for changing a Warehouse object and promoting it to Production."
    }
  ],
  "masteryLevels": [
    {
      "id": "not-started",
      "label": "Not Started",
      "description": "No study evidence yet."
    },
    {
      "id": "studied",
      "label": "Studied",
      "description": "Lesson content completed."
    },
    {
      "id": "practiced",
      "label": "Practiced",
      "description": "Guided practice or lab evidence completed."
    },
    {
      "id": "exam-ready",
      "label": "Exam Ready",
      "description": "Assessment and mapped-question performance are at least 80%."
    },
    {
      "id": "professional",
      "label": "Professionally Mastered",
      "description": "Independent scenario completed and design rationale recorded."
    }
  ],
  "challengeLabs": [
    {
      "id": "foundations",
      "moduleId": "foundations",
      "title": "Design a Medallion Data Product",
      "scenario": "A retailer receives daily CSV sales files and occasional correction files. Analysts need trusted daily and monthly metrics.",
      "requirements": [
        "Preserve every received payload",
        "Remove duplicate orders",
        "Apply product and customer reference data",
        "Support replay after logic changes",
        "Publish a monthly sales model"
      ],
      "deliverables": [
        "Architecture diagram",
        "Bronze/Silver/Gold table contract",
        "Three data-quality rules",
        "Replay and idempotency explanation"
      ],
      "hints": [
        "Keep ingestion metadata in Bronze.",
        "Define the fact grain before building Gold.",
        "Use deterministic business keys for deduplication."
      ],
      "solution": "Land immutable source files in Bronze with ingestion metadata, transform and deduplicate in Silver, and publish star-schema or aggregate Gold tables. Reprocessing starts from Bronze and uses idempotent writes or MERGE."
    },
    {
      "id": "fabric-onelake",
      "moduleId": "fabric-onelake",
      "title": "Design Tenant-to-Item Access",
      "scenario": "A central platform team owns capacities. Finance engineers build in one workspace while auditors need read-only access to one Warehouse.",
      "requirements": [
        "Avoid broad workspace access for auditors",
        "Keep platform and data responsibilities separate",
        "Document capacity, workspace, item, and data-level controls"
      ],
      "deliverables": [
        "Responsibility matrix",
        "Least-privilege access design",
        "Hierarchy diagram"
      ],
      "hints": [
        "Capacity access does not automatically grant item access.",
        "Use item sharing when only one item is needed."
      ],
      "solution": "Platform admins manage capacity, workspace admins manage collaboration, engineers receive authoring roles, and auditors receive item-level read access plus any required row/column security."
    },
    {
      "id": "lakehouse-shortcuts",
      "moduleId": "lakehouse-shortcuts",
      "title": "Zero-Copy Lakehouse Integration",
      "scenario": "Marketing data already exists in ADLS Gen2 and must be queried in Fabric without duplicating storage.",
      "requirements": [
        "Avoid copying data",
        "Expose curated files as Delta tables where needed",
        "Handle credential rotation",
        "Document failure behavior"
      ],
      "deliverables": [
        "Shortcut design",
        "Security checklist",
        "Fallback plan",
        "Validation query"
      ],
      "hints": [
        "A shortcut depends on target availability and permissions.",
        "Decide whether the target is files or tables."
      ],
      "solution": "Create an external shortcut to the governed ADLS path, validate identity and network access, expose only supported table layouts, and monitor target path or credential changes."
    },
    {
      "id": "data-factory",
      "moduleId": "data-factory",
      "title": "Metadata-Driven Incremental Pipeline",
      "scenario": "Twenty source tables must load daily. Each has a different watermark column and target table.",
      "requirements": [
        "One reusable parent pipeline",
        "Per-table metadata",
        "Safe retries",
        "Watermark update only after success",
        "Failure notification"
      ],
      "deliverables": [
        "Control-table schema",
        "Pipeline activity flow",
        "Expression examples",
        "Restart strategy"
      ],
      "hints": [
        "Use Lookup plus ForEach.",
        "Persist the old and new boundary for each run."
      ],
      "solution": "Read control metadata, iterate tables, calculate boundaries, copy the open/closed range, validate writes, then commit the new watermark. Route failure dependencies to logging and notification."
    },
    {
      "id": "dataflow-gen2",
      "moduleId": "dataflow-gen2",
      "title": "Reusable Low-Code Cleansing Flow",
      "scenario": "Business analysts maintain customer files with inconsistent dates, casing, and duplicate rows.",
      "requirements": [
        "Low-code maintenance",
        "Reusable transformations",
        "Typed destination",
        "Refresh diagnostics"
      ],
      "deliverables": [
        "Power Query steps",
        "Data-quality summary",
        "Destination mapping",
        "Failure-handling notes"
      ],
      "hints": [
        "Apply types deliberately.",
        "Separate source-specific cleanup from reusable business rules."
      ],
      "solution": "Use Dataflow Gen2 with clear ordered Power Query steps, explicit types, reusable functions, and a Lakehouse or Warehouse destination. Validate refresh history and destination behavior."
    },
    {
      "id": "spark-pyspark",
      "moduleId": "spark-pyspark",
      "title": "Optimize a Large PySpark Join",
      "scenario": "A 600 GB fact dataset joins a 20 MB reference table. The current notebook is slow and creates heavy shuffle.",
      "requirements": [
        "Reduce shuffle",
        "Keep deterministic output",
        "Measure before and after",
        "Avoid unnecessary caching"
      ],
      "deliverables": [
        "Spark plan explanation",
        "Optimized code",
        "Benchmark table",
        "Rollback criteria"
      ],
      "hints": [
        "Consider broadcast for the small side.",
        "Filter and select columns before the join."
      ],
      "solution": "Project and filter early, broadcast the small reference if it safely fits executor memory, avoid unnecessary repartitioning, inspect the Spark UI, and compare equivalent cold or warm runs."
    },
    {
      "id": "warehouse-tsql",
      "moduleId": "warehouse-tsql",
      "title": "Build a Historical Sales Warehouse",
      "scenario": "The source overwrites customer attributes, but reporting must preserve the customer version active at order time.",
      "requirements": [
        "Declare fact grain",
        "Use surrogate keys",
        "Implement SCD Type 2",
        "Keep unknown-member handling",
        "Support BI queries"
      ],
      "deliverables": [
        "Star-schema diagram",
        "SCD merge logic",
        "Fact loading sequence",
        "Validation queries"
      ],
      "hints": [
        "Load dimensions before facts.",
        "Use effective dates and current-row flags."
      ],
      "solution": "Create a customer dimension with surrogate key, effective dates, and current flag. Expire changed current rows, insert new versions, then resolve each fact to the correct dimension version."
    },
    {
      "id": "governance-monitoring",
      "moduleId": "governance-monitoring",
      "title": "Secure and Observe a Finance Workspace",
      "scenario": "Finance authors need broad build access, regional managers must see only their region, and auditors require activity evidence.",
      "requirements": [
        "Least privilege",
        "Regional row filtering",
        "Sensitive-column protection",
        "Audit and operational monitoring"
      ],
      "deliverables": [
        "Access matrix",
        "RLS design",
        "Classification plan",
        "Monitoring map"
      ],
      "hints": [
        "Workspace roles and data security solve different layers.",
        "Use audit logs for who-did-what evidence."
      ],
      "solution": "Grant authoring roles only to engineers, use item access for consumers, apply RLS and column protections, classify sensitive data, and combine Monitoring Hub, Capacity Metrics, and audit logs."
    },
    {
      "id": "realtime-kql",
      "moduleId": "realtime-kql",
      "title": "Real-Time Operations Analytics",
      "scenario": "A logistics company streams vehicle events and needs five-minute delay metrics plus alerts for sustained anomalies.",
      "requirements": [
        "Ingest and route events",
        "Store/query with KQL",
        "Aggregate by event time",
        "Trigger an action after a threshold"
      ],
      "deliverables": [
        "Eventstream flow",
        "KQL query",
        "Dashboard design",
        "Alert rule"
      ],
      "hints": [
        "Separate movement, analytics, and action responsibilities.",
        "Use time buckets and a clear anomaly definition."
      ],
      "solution": "Use Eventstream for ingestion and routing, Eventhouse/KQL Database for time-series storage and queries, a Real-Time dashboard for operations, and Activator for threshold-driven action."
    },
    {
      "id": "cicd",
      "moduleId": "cicd",
      "title": "Controlled Multi-Environment Release",
      "scenario": "Three engineers change notebooks and Warehouse objects while Production must remain stable.",
      "requirements": [
        "Feature branches and review",
        "Environment-specific settings",
        "Supported-item deployment",
        "Rollback evidence"
      ],
      "deliverables": [
        "Branch strategy",
        "PR checklist",
        "Deployment sequence",
        "Known limitation register"
      ],
      "hints": [
        "Source control is not deployment.",
        "Check which Fabric items are fully supported."
      ],
      "solution": "Use feature branches and pull requests for review, merge to the connected development branch, promote supported items through deployment stages, and maintain post-deployment steps for unsupported or environment-specific resources."
    },
    {
      "id": "m-language",
      "moduleId": "m-language",
      "title": "Build a Reusable M Transformation Library",
      "scenario": "Five files share the same cleaning rules but have different column names and optional fields.",
      "requirements": [
        "Reusable functions",
        "Defensive type handling",
        "Clear step dependencies",
        "Maintainable error behavior"
      ],
      "deliverables": [
        "Custom function",
        "Parameter mapping",
        "Test cases",
        "Error-report table"
      ],
      "hints": [
        "Understand List, Record, and Table values.",
        "Use optional-field checks before direct access."
      ],
      "solution": "Create parameterized M functions that normalize source schemas, apply explicit types, handle missing fields, and return clean rows plus structured error information."
    },
    {
      "id": "optimization",
      "moduleId": "optimization",
      "title": "Run a Performance Investigation",
      "scenario": "A nightly solution became 2.5× slower after data volume increased.",
      "requirements": [
        "Establish a baseline",
        "Identify the layer causing delay",
        "Apply one change at a time",
        "Verify cost and correctness"
      ],
      "deliverables": [
        "Performance timeline",
        "Bottleneck evidence",
        "Before/after result",
        "Recommendation"
      ],
      "hints": [
        "Separate pipeline wait, Spark execution, SQL query, and capacity pressure.",
        "Do not start by scaling compute."
      ],
      "solution": "Measure each layer, inspect detailed diagnostics, fix unnecessary data movement or file-layout problems first, retest comparably, then scale only when evidence shows resource saturation."
    },
    {
      "id": "structured-streaming",
      "moduleId": "structured-streaming",
      "title": "Recoverable Event-Time Stream",
      "scenario": "Late events arrive up to 20 minutes after their event time. The job must recover after restart without duplicating output.",
      "requirements": [
        "Event-time windows",
        "Watermark strategy",
        "Unique checkpoint",
        "Compatible output mode",
        "Restart test"
      ],
      "deliverables": [
        "Streaming code",
        "State explanation",
        "Late-data policy",
        "Recovery evidence"
      ],
      "hints": [
        "Checkpoint identity belongs to one logical query.",
        "Watermark choice affects state and late-event handling."
      ],
      "solution": "Parse event time, apply an appropriate watermark and window, write to an idempotent Delta sink with a unique checkpoint, and verify restart behavior using the same query identity."
    },
    {
      "id": "materialized-lake-views",
      "moduleId": "materialized-lake-views",
      "title": "Declarative Bronze-to-Gold Design",
      "scenario": "A team wants managed refresh, lineage, and quality checks for a three-layer Lakehouse pipeline.",
      "requirements": [
        "Source dependencies",
        "CDF or incremental refresh prerequisites",
        "Quality rules",
        "Schedule and failure handling"
      ],
      "deliverables": [
        "MLV dependency graph",
        "SQL definitions",
        "Quality policy",
        "Limitations review"
      ],
      "hints": [
        "Confirm current feature support before design commitment.",
        "Track refresh dependencies and CDF settings."
      ],
      "solution": "Define declarative Bronze, Silver, and Gold views with explicit dependencies, required CDF settings, quality rules, schedule, lineage review, and documented limitations or fallback."
    },
    {
      "id": "capstone",
      "moduleId": "capstone",
      "title": "Professional Fabric Platform Capstone",
      "scenario": "Build a complete platform for batch sales, real-time device events, governed BI, and operational alerts.",
      "requirements": [
        "Batch and streaming ingestion",
        "Medallion transformations",
        "Warehouse and Eventhouse serving",
        "Security and lifecycle",
        "Monitoring and optimization"
      ],
      "deliverables": [
        "Architecture pack",
        "Working Fabric artifacts",
        "Run evidence",
        "Security matrix",
        "Five-minute design defense"
      ],
      "hints": [
        "Explain every tool choice from a requirement.",
        "Include failure and recovery paths."
      ],
      "solution": "Combine Pipeline/Dataflow/Notebook for batch, Eventstream/Eventhouse for real time, Lakehouse/Warehouse for curated data, least-privilege security, Git/deployment controls, and layer-specific monitoring."
    }
  ],
  "troubleshootingLabs": [
    {
      "id": "schema-mismatch",
      "title": "Pipeline Fails on Schema Drift",
      "moduleIds": [
        "data-factory",
        "dataflow-gen2"
      ],
      "symptom": "A daily copy that worked for months now fails after the source added and renamed columns.",
      "evidence": [
        "Copy activity reports a column mapping error",
        "The source file contains two new columns",
        "The destination has a fixed schema"
      ],
      "causes": [
        "Capacity is too small",
        "Schema mapping no longer matches the source",
        "The service worker cache is stale",
        "The workspace role is Viewer"
      ],
      "answer": 1,
      "tasks": [
        "Identify where schema is enforced",
        "Choose whether drift should be accepted in Bronze",
        "Design a safe destination migration",
        "Plan a replay"
      ],
      "solution": "Inspect source and sink schemas, update or dynamically generate mappings, preserve permissive raw ingestion when appropriate, migrate the curated target deliberately, and replay from retained Bronze data."
    },
    {
      "id": "spark-shuffle",
      "title": "Spark Job Spends Most Time in Shuffle",
      "moduleIds": [
        "spark-pyspark",
        "optimization"
      ],
      "symptom": "A join stage has very long duration and large shuffle read/write volumes.",
      "evidence": [
        "One input is 25 MB",
        "The other input is 800 GB",
        "Many columns are carried through the join"
      ],
      "causes": [
        "A small reference table is not broadcast and unnecessary columns are shuffled",
        "The KQL cache is too short",
        "RLS is disabled",
        "The Git branch is behind main"
      ],
      "answer": 0,
      "tasks": [
        "Inspect the physical plan",
        "Reduce input width",
        "Select a join strategy",
        "Benchmark correctly"
      ],
      "solution": "Filter and project early, broadcast the safely small side, verify key skew, and compare execution using equivalent cache conditions and data volumes."
    },
    {
      "id": "shortcut-permission",
      "title": "Shortcut Is Visible but Queries Fail",
      "moduleIds": [
        "lakehouse-shortcuts",
        "fabric-onelake"
      ],
      "symptom": "The shortcut appears in the Lakehouse, but users receive access or path errors when reading data.",
      "evidence": [
        "The target path was recently moved",
        "Credential ownership changed",
        "Workspace access is valid"
      ],
      "causes": [
        "The target path or credential is no longer valid",
        "The Warehouse needs more statistics",
        "The Spark pool is too large",
        "The semantic model uses Import mode"
      ],
      "answer": 0,
      "tasks": [
        "Validate target existence",
        "Validate connection identity",
        "Check network and permission path",
        "Document monitoring"
      ],
      "solution": "Confirm the exact target path, refresh or reassign the connection identity, verify network controls and source permissions, then retest with the intended user context."
    },
    {
      "id": "warehouse-slow",
      "title": "Warehouse Query Suddenly Slows",
      "moduleIds": [
        "warehouse-tsql",
        "optimization"
      ],
      "symptom": "A report query that used to finish in seconds now takes minutes after a large load.",
      "evidence": [
        "Data volume increased significantly",
        "The query scans many columns",
        "A join predicate uses a transformed key"
      ],
      "causes": [
        "The query performs unnecessary scans and non-sargable join logic",
        "OneLake File Explorer is disabled",
        "The workspace is in a Domain",
        "A sensitivity label was applied"
      ],
      "answer": 0,
      "tasks": [
        "Review the query plan and scan volume",
        "Reduce selected columns",
        "Fix join/filter logic",
        "Retest under comparable conditions"
      ],
      "solution": "Inspect query diagnostics, remove unnecessary columns, use direct predicates and appropriate model grain, validate statistics or automatic optimization behavior, and compare like-for-like runs."
    },
    {
      "id": "eventstream-empty",
      "title": "Eventstream Destination Receives No Events",
      "moduleIds": [
        "realtime-kql"
      ],
      "symptom": "The source connection is configured but the Eventhouse table remains empty.",
      "evidence": [
        "Source events are visible upstream",
        "A filter was recently added",
        "The destination schema changed"
      ],
      "causes": [
        "The filter excludes all events or destination mapping is invalid",
        "A Deployment pipeline is required",
        "The Lakehouse needs VACUUM",
        "The Git repository is private"
      ],
      "answer": 0,
      "tasks": [
        "Inspect preview events before and after each transform",
        "Validate branch routing",
        "Validate destination mapping",
        "Test with a known event"
      ],
      "solution": "Use Eventstream preview at each stage, correct the filter or projection, verify destination table mapping and branch routing, and send a known test event."
    },
    {
      "id": "capacity-throttle",
      "title": "Concurrent Jobs Are Throttled",
      "moduleIds": [
        "fabric-onelake",
        "optimization"
      ],
      "symptom": "Multiple workloads slow down at the same time and some operations are delayed.",
      "evidence": [
        "Capacity metrics show sustained pressure",
        "Several large jobs overlap",
        "Individual code paths have not changed"
      ],
      "causes": [
        "Capacity contention and poor scheduling",
        "A shortcut target was renamed",
        "The RLS expression is invalid",
        "A pull request is open"
      ],
      "answer": 0,
      "tasks": [
        "Correlate time windows",
        "Identify dominant workloads",
        "Reschedule or optimize",
        "Decide whether scaling is justified"
      ],
      "solution": "Use Capacity Metrics to correlate pressure with workloads, reduce overlap or inefficient work, apply workload-specific tuning, and scale only when sustained resource demand remains."
    },
    {
      "id": "duplicate-incremental",
      "title": "Incremental Load Creates Duplicates",
      "moduleIds": [
        "data-factory",
        "spark-pyspark"
      ],
      "symptom": "A rerun after partial failure inserts the same records again.",
      "evidence": [
        "The target uses append mode",
        "The watermark advanced before validation",
        "No deterministic merge key exists"
      ],
      "causes": [
        "The process is not idempotent and commits state too early",
        "The Eventhouse retention is too long",
        "The Workspace role is Member",
        "A custom pool was not selected"
      ],
      "answer": 0,
      "tasks": [
        "Define a stable key",
        "Choose MERGE or overwrite partition behavior",
        "Move watermark commit after success",
        "Test replay"
      ],
      "solution": "Use deterministic keys and idempotent target writes, keep the run boundary fixed, validate the target, and commit the watermark only after successful completion."
    },
    {
      "id": "streaming-restart",
      "title": "Streaming Query Duplicates After Restart",
      "moduleIds": [
        "structured-streaming"
      ],
      "symptom": "Restarting the notebook causes repeated output and state loss.",
      "evidence": [
        "A new checkpoint path is generated on every run",
        "The sink is append-only",
        "The logical query is otherwise unchanged"
      ],
      "causes": [
        "The query does not reuse a stable checkpoint and sink semantics are not idempotent",
        "KQL uses the wrong operator",
        "The Warehouse lacks a primary key",
        "The deployment stage is empty"
      ],
      "answer": 0,
      "tasks": [
        "Stabilize checkpoint identity",
        "Review output mode and sink",
        "Validate event-time state",
        "Run a controlled restart test"
      ],
      "solution": "Reuse one checkpoint per logical query, choose compatible output mode and sink semantics, and verify restart behavior with controlled input and late events."
    }
  ],
  "decisionScenarios": [
    {
      "id": "store-commerce",
      "title": "Commerce Analytics Store",
      "scenario": "A SQL-heavy team needs star schemas, stored procedures, and BI-oriented relational models.",
      "options": [
        "Lakehouse",
        "Warehouse",
        "Eventhouse",
        "Eventstream"
      ],
      "answer": 1,
      "why": "Warehouse is the closest fit for relational T-SQL development and dimensional models.",
      "wrong": [
        "Lakehouse is stronger when Spark and file flexibility dominate.",
        "Eventhouse targets time-series and KQL workloads.",
        "Eventstream moves and transforms events; it is not the analytical store."
      ]
    },
    {
      "id": "store-telemetry",
      "title": "Telemetry Analytics Store",
      "scenario": "Billions of timestamped device events must be explored with low-latency KQL queries.",
      "options": [
        "Warehouse",
        "Eventhouse",
        "Dataflow Gen2",
        "Deployment pipeline"
      ],
      "answer": 1,
      "why": "Eventhouse with KQL Database is designed for high-volume time-series analytics.",
      "wrong": [
        "Warehouse is relational and SQL-oriented.",
        "Dataflow Gen2 is a transformation tool, not the target store.",
        "Deployment pipelines promote artifacts across environments."
      ]
    },
    {
      "id": "move-nocopy",
      "title": "Use Data Without Copying",
      "scenario": "Data already exists in governed ADLS and must be used in Fabric without duplicate storage.",
      "options": [
        "Shortcut",
        "Mirroring",
        "Copy activity",
        "CTAS"
      ],
      "answer": 0,
      "why": "A shortcut references data in place.",
      "wrong": [
        "Mirroring replicates supported databases.",
        "Copy activity moves data.",
        "CTAS creates and populates a new table."
      ]
    },
    {
      "id": "replicate-sql",
      "title": "Near-Real-Time Database Replica",
      "scenario": "A supported operational SQL database must appear in OneLake with managed ongoing replication.",
      "options": [
        "Shortcut",
        "Mirroring",
        "Notebook full load",
        "Semantic model refresh"
      ],
      "answer": 1,
      "why": "Mirroring provides managed near-real-time replication for supported sources.",
      "wrong": [
        "Shortcut references existing files or tables rather than replicating database changes.",
        "A full-load notebook is custom batch movement.",
        "Semantic model refresh updates a model, not a database replica."
      ]
    },
    {
      "id": "transform-lowcode",
      "title": "Business-Owned Cleansing",
      "scenario": "Analysts need visual, maintainable cleaning and joins with Power Query skills.",
      "options": [
        "Dataflow Gen2",
        "PySpark notebook",
        "Eventstream",
        "KQL Database"
      ],
      "answer": 0,
      "why": "Dataflow Gen2 is the low-code Power Query transformation experience.",
      "wrong": [
        "A notebook requires code and Spark skills.",
        "Eventstream handles continuous events.",
        "KQL Database stores and queries real-time data."
      ]
    },
    {
      "id": "orchestrate-multi",
      "title": "Coordinate Multi-Step Workflow",
      "scenario": "A process must run Lookup, ForEach, Copy, Notebook, and failure notification with dependencies.",
      "options": [
        "Data pipeline",
        "Dataflow Gen2",
        "Warehouse view",
        "Shortcut"
      ],
      "answer": 0,
      "why": "A data pipeline coordinates activities, dependencies, parameters, triggers, and monitoring.",
      "wrong": [
        "Dataflow focuses on transformation.",
        "A view does not orchestrate work.",
        "A shortcut references data."
      ]
    },
    {
      "id": "transform-big",
      "title": "Large Custom Transformation",
      "scenario": "A 2 TB dataset requires custom Python logic, partition control, and Delta MERGE.",
      "options": [
        "PySpark notebook",
        "Dataflow Gen2",
        "Deployment pipeline",
        "Activator"
      ],
      "answer": 0,
      "why": "PySpark provides distributed custom transformation and Delta APIs.",
      "wrong": [
        "Dataflow is low-code and may not suit this level of control.",
        "Deployment pipelines promote artifacts.",
        "Activator responds to conditions."
      ]
    },
    {
      "id": "sql-vs-spark",
      "title": "Write to Warehouse",
      "scenario": "The destination is a Fabric Warehouse and the team already has strong T-SQL skills.",
      "options": [
        "T-SQL",
        "PySpark direct table write",
        "KQL",
        "M only"
      ],
      "answer": 0,
      "why": "T-SQL is the natural write and transformation language for Fabric Warehouse.",
      "wrong": [
        "Spark is more natural for Lakehouse tables.",
        "KQL targets Eventhouse.",
        "M can load through Dataflow but is not the main Warehouse language."
      ]
    },
    {
      "id": "trigger-file",
      "title": "Run When a File Arrives",
      "scenario": "A pipeline should start after a new file event rather than at a fixed time.",
      "options": [
        "Schedule trigger",
        "Event-based trigger",
        "Manual run",
        "Semantic-model refresh"
      ],
      "answer": 1,
      "why": "An event-based trigger responds to the configured file or platform event.",
      "wrong": [
        "A schedule uses time.",
        "Manual execution is not automatic.",
        "Semantic-model refresh is a downstream operation."
      ]
    },
    {
      "id": "security-rows",
      "title": "Regional Data Access",
      "scenario": "Managers can open the same report but must only see rows for their assigned region.",
      "options": [
        "RLS",
        "CLS",
        "Dynamic data masking",
        "Workspace Admin"
      ],
      "answer": 0,
      "why": "Row-level security filters rows by user context.",
      "wrong": [
        "CLS blocks columns.",
        "Masking changes displayed values rather than row membership.",
        "Admin is broad access, not row filtering."
      ]
    },
    {
      "id": "performance-smallfiles",
      "title": "Delta Small-File Problem",
      "scenario": "A Lakehouse table has thousands of tiny files and slow scans.",
      "options": [
        "OPTIMIZE/compaction",
        "Increase sensitivity label",
        "Create a Domain",
        "Use a wider RLS role"
      ],
      "answer": 0,
      "why": "Compaction reduces file-count overhead and improves scan efficiency.",
      "wrong": [
        "Classification does not fix file layout.",
        "Domains organize discoverability.",
        "Security roles do not compact data."
      ]
    },
    {
      "id": "action-realtime",
      "title": "Respond to a Real-Time Condition",
      "scenario": "When a KPI remains above a threshold, the solution should notify an operations team.",
      "options": [
        "Activator",
        "Warehouse CTAS",
        "Shortcut caching",
        "Git integration"
      ],
      "answer": 0,
      "why": "Activator is intended to react to conditions and trigger actions.",
      "wrong": [
        "CTAS creates a table.",
        "Caching improves reads.",
        "Git manages source versions."
      ]
    }
  ],
  "projects": [
    {
      "id": "batch-platform",
      "title": "Project 1 · Batch Data Engineering Platform",
      "level": "Intermediate → Advanced",
      "summary": "Build a production-style batch solution from source ingestion through governed Gold outputs.",
      "scenario": "Contoso receives daily ERP sales, customer, and product files. Corrections can arrive later and all runs must be replayable.",
      "milestones": [
        "Create workspace, Lakehouse, and naming convention",
        "Land raw source data and ingestion metadata in Bronze",
        "Build parameterized incremental Pipeline",
        "Transform and deduplicate with PySpark into Silver",
        "Create Gold fact and dimension outputs",
        "Add validation, failure logging, and rerun logic",
        "Capture run evidence and architecture documentation"
      ],
      "skills": [
        "Pipeline",
        "Lakehouse",
        "PySpark",
        "Delta MERGE",
        "Medallion",
        "Monitoring"
      ],
      "definitionOfDone": [
        "A rerun does not create duplicates",
        "Failed runs do not advance the watermark",
        "Gold grain is documented",
        "A monitoring screenshot or run log is saved"
      ]
    },
    {
      "id": "enterprise-warehouse",
      "title": "Project 2 · Enterprise Fabric Warehouse",
      "level": "Advanced",
      "summary": "Build a dimensional Warehouse with historical dimensions, governed access, and BI-ready serving.",
      "scenario": "Finance requires a certified sales model with historical customer attributes and region-based access.",
      "milestones": [
        "Define business process and fact grain",
        "Create Warehouse schemas and tables",
        "Generate surrogate keys",
        "Implement SCD Type 1 and Type 2 logic",
        "Load facts after dimensions",
        "Apply RLS/column protection and governance",
        "Create semantic model and performance tests",
        "Document CI/CD promotion flow"
      ],
      "skills": [
        "Warehouse",
        "T-SQL",
        "Star schema",
        "SCD",
        "Security",
        "Semantic model",
        "CI/CD"
      ],
      "definitionOfDone": [
        "Historical customer versions are correct",
        "Fact rows resolve valid surrogate keys",
        "Regional users see only permitted rows",
        "Deployment and rollback steps are documented"
      ]
    },
    {
      "id": "realtime-operations",
      "title": "Project 3 · Real-Time Intelligence Platform",
      "level": "Advanced",
      "summary": "Build event ingestion, KQL analytics, a real-time dashboard, and automated response.",
      "scenario": "Vehicle telemetry arrives continuously. Operations needs delay, temperature, and fault analytics with threshold-based alerts.",
      "milestones": [
        "Create Eventstream source and branches",
        "Transform and route event fields",
        "Store events in Eventhouse/KQL Database",
        "Write KQL time-window and anomaly queries",
        "Build Real-Time dashboard",
        "Configure Activator condition and action",
        "Test late or malformed events",
        "Document retention, cache, monitoring, and failure recovery"
      ],
      "skills": [
        "Eventstream",
        "Eventhouse",
        "KQL",
        "Real-Time dashboard",
        "Activator",
        "Monitoring"
      ],
      "definitionOfDone": [
        "Known test events reach the correct table",
        "Dashboard metrics match validation queries",
        "Alert behavior is reproducible",
        "Retention/cache rationale is documented"
      ]
    }
  ],
  "assessments": {
    "foundations": [
      {
        "question": "A correction file can arrive two weeks late. Which design best supports replay?",
        "options": [
          "Overwrite Gold directly",
          "Retain immutable Bronze and rebuild downstream layers",
          "Delete old source files after load",
          "Store only monthly totals"
        ],
        "answer": 1,
        "why": "Replay requires a retained raw source and deterministic downstream logic."
      },
      {
        "question": "Where should standardized customer IDs and deduplication normally occur?",
        "options": [
          "Bronze",
          "Silver",
          "Gold only",
          "Semantic model"
        ],
        "answer": 1,
        "why": "Silver is the conformed and validated layer."
      },
      {
        "question": "Which statement best describes Delta Lake?",
        "options": [
          "A replacement for OneLake",
          "Transactional table capabilities over data files",
          "A KQL query engine",
          "A capacity type"
        ],
        "answer": 1,
        "why": "Delta adds ACID and table-management capabilities over files."
      },
      {
        "question": "What should be declared first when designing a fact table?",
        "options": [
          "Report color",
          "Grain",
          "Capacity SKU",
          "Sensitivity label"
        ],
        "answer": 1,
        "why": "Grain defines what one fact row represents."
      },
      {
        "question": "A process is idempotent when:",
        "options": [
          "It always uses append",
          "It cannot fail",
          "Rerunning it produces the same correct state",
          "It uses a custom pool"
        ],
        "answer": 2,
        "why": "Idempotent processing is safe to repeat."
      }
    ],
    "fabric-onelake": [
      {
        "question": "Who should receive capacity-management responsibility?",
        "options": [
          "Every report viewer",
          "Platform administrators",
          "Only external auditors",
          "All workspace Contributors"
        ],
        "answer": 1,
        "why": "Capacity is a platform resource and should be managed by the platform role."
      },
      {
        "question": "An auditor needs one Warehouse only. What is the narrowest approach?",
        "options": [
          "Workspace Admin",
          "Workspace Member",
          "Share the item with read permission",
          "Capacity Admin"
        ],
        "answer": 2,
        "why": "Item-level access avoids unnecessary workspace discovery."
      },
      {
        "question": "OneLake is best described as:",
        "options": [
          "A Spark cluster",
          "A tenant-wide logical data lake",
          "A Git repository",
          "A SQL-only store"
        ],
        "answer": 1,
        "why": "OneLake is the unified logical storage layer."
      },
      {
        "question": "Which layer controls compute allocation?",
        "options": [
          "Capacity",
          "Sensitivity label",
          "Domain",
          "RLS"
        ],
        "answer": 0,
        "why": "Capacity supplies compute resources."
      },
      {
        "question": "Domains primarily help with:",
        "options": [
          "Row filtering",
          "Data organization and discoverability",
          "Spark autoscaling",
          "T-SQL transactions"
        ],
        "answer": 1,
        "why": "Domains organize data ownership and discovery, not access by themselves."
      }
    ],
    "lakehouse-shortcuts": [
      {
        "question": "Deleting a shortcut normally does what?",
        "options": [
          "Deletes the source data",
          "Removes the reference only",
          "Vacuum the source",
          "Converts it to a managed table"
        ],
        "answer": 1,
        "why": "The target data remains in its source location."
      },
      {
        "question": "Which Lakehouse area is suited to arbitrary raw files?",
        "options": [
          "Files",
          "Tables only",
          "SQL endpoint procedures",
          "Deployment stage"
        ],
        "answer": 0,
        "why": "Files stores general file content."
      },
      {
        "question": "Which engine is most natural for complex Lakehouse writes?",
        "options": [
          "Spark",
          "KQL only",
          "Deployment pipeline",
          "Purview audit"
        ],
        "answer": 0,
        "why": "Spark is the primary engineering write engine for Lakehouse tables."
      },
      {
        "question": "A shortcut fails after a source folder rename. What should be checked first?",
        "options": [
          "Capacity scale",
          "Target path",
          "Warehouse statistics",
          "Semantic model mode"
        ],
        "answer": 1,
        "why": "A shortcut depends on the referenced path."
      },
      {
        "question": "Shortcut caching mainly aims to:",
        "options": [
          "Change permissions",
          "Reduce repeated external reads and egress where supported",
          "Create SCD history",
          "Run CI/CD"
        ],
        "answer": 1,
        "why": "Caching can improve supported external shortcut access."
      }
    ],
    "data-factory": [
      {
        "question": "Where should a new watermark be persisted?",
        "options": [
          "Before copy starts",
          "After the target write succeeds",
          "At pipeline creation",
          "Only after a manual review"
        ],
        "answer": 1,
        "why": "Committing after success avoids data loss on failure."
      },
      {
        "question": "Which activity commonly reads control-table rows for a metadata-driven pipeline?",
        "options": [
          "Lookup",
          "Until",
          "Delete",
          "Web only"
        ],
        "answer": 0,
        "why": "Lookup reads metadata or configuration values."
      },
      {
        "question": "For twenty similar table loads, which pattern minimizes duplication?",
        "options": [
          "Twenty unrelated pipelines",
          "Lookup + ForEach + parameterized child logic",
          "One manual notebook per table",
          "One semantic model refresh"
        ],
        "answer": 1,
        "why": "Metadata-driven orchestration centralizes reusable behavior."
      },
      {
        "question": "Which dependency path should perform logging after failure?",
        "options": [
          "Success dependency",
          "Failure dependency",
          "Completion only with no condition",
          "No dependency"
        ],
        "answer": 1,
        "why": "A failure path captures and handles unsuccessful activities."
      },
      {
        "question": "Pipeline parameters differ from variables because parameters are generally:",
        "options": [
          "Input values supplied to a run",
          "Always secret",
          "Only numbers",
          "The same as Spark executors"
        ],
        "answer": 0,
        "why": "Parameters are run inputs; variables can change during execution."
      }
    ],
    "dataflow-gen2": [
      {
        "question": "Which skill set most strongly favors Dataflow Gen2?",
        "options": [
          "Power Query/M",
          "Low-level JVM tuning",
          "KQL-only operations",
          "Git administration"
        ],
        "answer": 0,
        "why": "Dataflow Gen2 uses Power Query and M."
      },
      {
        "question": "What is the safest treatment of data types?",
        "options": [
          "Allow every type to remain Any",
          "Apply explicit types at a deliberate step",
          "Convert all columns to text",
          "Wait for the semantic model"
        ],
        "answer": 1,
        "why": "Explicit types improve reliability and destination behavior."
      },
      {
        "question": "Fast Copy is relevant when:",
        "options": [
          "Supported ingestion throughput is the bottleneck",
          "RLS is wrong",
          "A Git branch conflicts",
          "A KQL join is slow"
        ],
        "answer": 0,
        "why": "Fast Copy targets supported high-throughput ingestion paths."
      },
      {
        "question": "A reusable M function is useful for:",
        "options": [
          "Applying the same cleaning rule to multiple inputs",
          "Scaling capacity",
          "Creating Eventstream windows",
          "Granting workspace roles"
        ],
        "answer": 0,
        "why": "Functions centralize repeated transformation logic."
      },
      {
        "question": "Where should refresh failures be investigated first?",
        "options": [
          "Dataflow refresh history and detailed errors",
          "OneLake File Explorer only",
          "Git history",
          "Semantic-model DAX"
        ],
        "answer": 0,
        "why": "The dataflow monitoring surface provides run details."
      }
    ],
    "spark-pyspark": [
      {
        "question": "A 15 MB dimension joins a 500 GB fact table. Which optimization may help?",
        "options": [
          "Broadcast the small dimension",
          "Collect the fact to the driver",
          "Repartition everything to one partition",
          "Cache every intermediate"
        ],
        "answer": 0,
        "why": "Broadcast can avoid shuffling the large side when the small table fits safely."
      },
      {
        "question": "What does lazy evaluation allow Spark to do?",
        "options": [
          "Avoid all execution",
          "Optimize a plan before an action runs",
          "Ignore schemas",
          "Guarantee no shuffle"
        ],
        "answer": 1,
        "why": "Spark can optimize the DAG before execution."
      },
      {
        "question": "Which symptom most suggests data skew?",
        "options": [
          "All tasks finish together",
          "A few tasks run much longer than others",
          "No stages exist",
          "The notebook starts quickly"
        ],
        "answer": 1,
        "why": "Skew concentrates data in a small number of partitions."
      },
      {
        "question": "What should be checked before caching a DataFrame?",
        "options": [
          "Whether it is reused enough to justify memory cost",
          "Whether a sensitivity label exists",
          "Whether the workspace has a Domain",
          "Whether Git is connected"
        ],
        "answer": 0,
        "why": "Caching is beneficial only when reuse offsets storage and materialization cost."
      },
      {
        "question": "Which write pattern supports incremental upserts into Delta?",
        "options": [
          "MERGE",
          "VACUUM",
          "display()",
          "collect()"
        ],
        "answer": 0,
        "why": "Delta MERGE implements matched updates and unmatched inserts."
      }
    ],
    "warehouse-tsql": [
      {
        "question": "Why use a surrogate key in a dimension?",
        "options": [
          "To preserve model identity independent of source keys",
          "To increase capacity",
          "To replace all business attributes",
          "To create KQL windows"
        ],
        "answer": 0,
        "why": "Surrogate keys support history and isolate the model from source changes."
      },
      {
        "question": "SCD Type 2 handles a changed attribute by:",
        "options": [
          "Overwriting the current row only",
          "Adding a new version and expiring the old row",
          "Deleting the dimension",
          "Refreshing the semantic model only"
        ],
        "answer": 1,
        "why": "Type 2 preserves history using versioned rows."
      },
      {
        "question": "Fabric Warehouse primary-key constraints may be:",
        "options": [
          "Always clustered and enforced",
          "Declared NOT ENFORCED",
          "Unavailable in any syntax",
          "Used as Spark checkpoints"
        ],
        "answer": 1,
        "why": "Warehouse constraints can document relationships without enforcing uniqueness."
      },
      {
        "question": "Which object is best for reusable parameterized T-SQL logic?",
        "options": [
          "Stored procedure",
          "Shortcut",
          "Eventstream",
          "Sensitivity label"
        ],
        "answer": 0,
        "why": "Stored procedures package reusable SQL operations."
      },
      {
        "question": "A fact table should normally be loaded after dimensions because:",
        "options": [
          "Facts need resolved dimension keys",
          "Dimensions require KQL",
          "Warehouse cannot insert facts first",
          "Capacity only supports that order"
        ],
        "answer": 0,
        "why": "Fact foreign keys must resolve to the correct dimension versions."
      }
    ],
    "governance-monitoring": [
      {
        "question": "Which feature records who performed an administrative or user action?",
        "options": [
          "Audit logs",
          "V-Order",
          "Spark cache",
          "Shortcut caching"
        ],
        "answer": 0,
        "why": "Audit logs provide activity evidence."
      },
      {
        "question": "Which feature filters rows based on user context?",
        "options": [
          "RLS",
          "CLS",
          "Masking",
          "Endorsement"
        ],
        "answer": 0,
        "why": "RLS controls row visibility."
      },
      {
        "question": "Certified endorsement communicates:",
        "options": [
          "Formal organizational trust/review",
          "Encryption",
          "Capacity ownership",
          "A Spark runtime"
        ],
        "answer": 0,
        "why": "Certification is a trust signal, not a security control."
      },
      {
        "question": "Capacity-wide pressure should be investigated with:",
        "options": [
          "Capacity Metrics",
          "Only a notebook output cell",
          "Git diff",
          "OneLake shortcut dialog"
        ],
        "answer": 0,
        "why": "Capacity Metrics shows capacity consumption and pressure."
      },
      {
        "question": "Dynamic data masking should be treated as:",
        "options": [
          "A complete authorization boundary",
          "Display obfuscation that does not replace access control",
          "A Git policy",
          "A partitioning method"
        ],
        "answer": 1,
        "why": "Masking changes displayed results and must be combined with proper authorization."
      }
    ],
    "realtime-kql": [
      {
        "question": "Which Eventstream operation is used to keep only selected fields?",
        "options": [
          "Manage fields/project",
          "Aggregate",
          "Join only",
          "Activator"
        ],
        "answer": 0,
        "why": "Projection or Manage fields selects and renames fields."
      },
      {
        "question": "Which KQL operator calculates grouped metrics?",
        "options": [
          "summarize",
          "project",
          "take",
          "extend only"
        ],
        "answer": 0,
        "why": "summarize performs grouping and aggregation."
      },
      {
        "question": "An update policy is most associated with:",
        "options": [
          "Ingestion-time transformation into another KQL table",
          "Git branching",
          "Workspace sharing",
          "Spark pool autoscale"
        ],
        "answer": 0,
        "why": "Update policies transform and route ingested data in KQL databases."
      },
      {
        "question": "What does a materialized view provide in Eventhouse?",
        "options": [
          "A continuously maintained query result",
          "A workspace role",
          "A shortcut credential",
          "A deployment stage"
        ],
        "answer": 0,
        "why": "Materialized views maintain aggregated or transformed results."
      },
      {
        "question": "Which component should trigger an action when a real-time condition is met?",
        "options": [
          "Activator",
          "CTAS",
          "Dataflow destination",
          "Git integration"
        ],
        "answer": 0,
        "why": "Activator responds to conditions and initiates actions."
      }
    ],
    "cicd": [
      {
        "question": "What belongs in a feature branch?",
        "options": [
          "A focused change awaiting review",
          "Every production secret",
          "Capacity metrics history",
          "All user permissions"
        ],
        "answer": 0,
        "why": "Feature branches isolate a change before merge."
      },
      {
        "question": "What is the purpose of a pull request?",
        "options": [
          "Review and controlled merge",
          "Run KQL",
          "Scale capacity",
          "Create a shortcut"
        ],
        "answer": 0,
        "why": "A pull request supports review and merge governance."
      },
      {
        "question": "Deployment pipelines primarily manage:",
        "options": [
          "Promotion across lifecycle stages",
          "Source history",
          "Spark partitions",
          "RLS expressions"
        ],
        "answer": 0,
        "why": "Deployment pipelines promote supported artifacts across environments."
      },
      {
        "question": "An unsupported item requires:",
        "options": [
          "A documented alternate deployment or post-deployment step",
          "Changing every user to Admin",
          "Disabling Git",
          "Moving data to Eventhouse"
        ],
        "answer": 0,
        "why": "Unsupported items need an explicit delivery workaround."
      },
      {
        "question": "Environment-specific configuration should be:",
        "options": [
          "Separated from reusable source where possible",
          "Hard-coded everywhere",
          "Stored only in screenshots",
          "Ignored in Test"
        ],
        "answer": 0,
        "why": "Environment separation improves safe promotion."
      }
    ],
    "m-language": [
      {
        "question": "A let expression returns the value named after:",
        "options": [
          "in",
          "each",
          "type",
          "meta"
        ],
        "answer": 0,
        "why": "The in clause identifies the expression returned by the let block."
      },
      {
        "question": "Which M value represents named fields?",
        "options": [
          "Record",
          "List",
          "Number",
          "Binary only"
        ],
        "answer": 0,
        "why": "A Record is a set of named fields."
      },
      {
        "question": "The each keyword is commonly shorthand for:",
        "options": [
          "An anonymous function",
          "A capacity",
          "A SQL transaction",
          "A deployment stage"
        ],
        "answer": 0,
        "why": "each creates an implicit single-argument function."
      },
      {
        "question": "Why should optional columns be checked before access?",
        "options": [
          "To avoid errors when a field is missing",
          "To scale Spark",
          "To create KQL cache",
          "To grant RLS"
        ],
        "answer": 0,
        "why": "Defensive field checks handle schema variation."
      },
      {
        "question": "Which design is most maintainable?",
        "options": [
          "One long duplicated query per file",
          "Reusable functions plus clear typed steps",
          "Convert everything to text",
          "Hide every error"
        ],
        "answer": 1,
        "why": "Reusable functions and explicit steps reduce duplication and ambiguity."
      }
    ],
    "optimization": [
      {
        "question": "What should happen before changing compute size?",
        "options": [
          "Capture a baseline and identify the bottleneck",
          "Delete history",
          "Add more workspace admins",
          "Disable monitoring"
        ],
        "answer": 0,
        "why": "Evidence should drive optimization and scaling."
      },
      {
        "question": "Which operation addresses many small Delta files?",
        "options": [
          "Compaction/OPTIMIZE",
          "RLS",
          "Git merge",
          "Sensitivity label"
        ],
        "answer": 0,
        "why": "Compaction combines small files into more efficient sizes."
      },
      {
        "question": "Why compare cold-cache with cold-cache?",
        "options": [
          "To keep test conditions comparable",
          "To improve security",
          "To change schema",
          "To enable CDF"
        ],
        "answer": 0,
        "why": "Comparable conditions isolate the effect of the change."
      },
      {
        "question": "A pipeline with independent copies may improve through:",
        "options": [
          "Safe parallelism within source and capacity limits",
          "One sequential activity always",
          "Dynamic data masking",
          "A new Domain"
        ],
        "answer": 0,
        "why": "Parallelism can reduce duration when dependencies and resources allow."
      },
      {
        "question": "VACUUM requires caution because it can:",
        "options": [
          "Remove old files needed for time travel",
          "Delete workspace roles",
          "Disable Eventstream",
          "Create duplicate keys"
        ],
        "answer": 0,
        "why": "Retention settings determine which historical files are removed."
      }
    ],
    "structured-streaming": [
      {
        "question": "What does a checkpoint store?",
        "options": [
          "Progress and state needed for recovery",
          "Workspace roles",
          "Git commits",
          "Warehouse statistics only"
        ],
        "answer": 0,
        "why": "Checkpoints preserve streaming progress and state."
      },
      {
        "question": "Why must each logical query have a unique checkpoint?",
        "options": [
          "To avoid state collision and incorrect recovery",
          "To increase RLS",
          "To create a Domain",
          "To enable CTAS"
        ],
        "answer": 0,
        "why": "Checkpoint identity belongs to one query."
      },
      {
        "question": "A watermark primarily helps bound:",
        "options": [
          "State for late event-time data",
          "Workspace permissions",
          "Git history",
          "Capacity ownership"
        ],
        "answer": 0,
        "why": "Watermarks control late-event state and finalization."
      },
      {
        "question": "Which operation is stateful?",
        "options": [
          "Windowed aggregation",
          "Simple select",
          "Rename column",
          "Cast one value"
        ],
        "answer": 0,
        "why": "Window aggregation retains state across events."
      },
      {
        "question": "A restart test should verify:",
        "options": [
          "No lost or duplicated results under the intended sink semantics",
          "Only notebook color",
          "Git branch name",
          "Sensitivity label"
        ],
        "answer": 0,
        "why": "Recovery correctness is the core checkpoint requirement."
      }
    ],
    "materialized-lake-views": [
      {
        "question": "The key benefit of a declarative MLV pipeline is:",
        "options": [
          "Managed dependency and refresh behavior",
          "Manual file copying only",
          "Replacing OneLake",
          "Creating workspace roles"
        ],
        "answer": 0,
        "why": "MLVs describe maintained transformations and dependencies."
      },
      {
        "question": "Why might CDF be required?",
        "options": [
          "To process changes incrementally",
          "To grant item access",
          "To run KQL",
          "To create a Git branch"
        ],
        "answer": 0,
        "why": "Change Data Feed exposes row-level changes for incremental maintenance."
      },
      {
        "question": "A data-quality rule should define:",
        "options": [
          "The condition, severity, and expected handling",
          "Only a dashboard color",
          "Capacity SKU",
          "Git username"
        ],
        "answer": 0,
        "why": "Quality rules need explicit behavior and reporting."
      },
      {
        "question": "Before using a new or preview feature, the design should:",
        "options": [
          "Verify current support and limitations",
          "Assume all items deploy identically",
          "Disable monitoring",
          "Avoid documentation"
        ],
        "answer": 0,
        "why": "Current documentation is required for evolving functionality."
      },
      {
        "question": "Lineage is useful for:",
        "options": [
          "Understanding dependencies and impact",
          "Encrypting values",
          "Scaling Spark",
          "Creating KQL windows"
        ],
        "answer": 0,
        "why": "Lineage shows upstream and downstream relationships."
      }
    ],
    "capstone": [
      {
        "question": "What is the strongest architecture justification?",
        "options": [
          "It uses the newest tool",
          "It maps each requirement to a tool and trade-off",
          "It has the most items",
          "It avoids monitoring"
        ],
        "answer": 1,
        "why": "Professional design is requirement-driven and explains trade-offs."
      },
      {
        "question": "Which evidence best proves operational readiness?",
        "options": [
          "A diagram only",
          "Successful and failed run evidence plus recovery steps",
          "A list of product names",
          "A large capacity"
        ],
        "answer": 1,
        "why": "Operational readiness includes failure and recovery behavior."
      },
      {
        "question": "A mixed batch and streaming solution should:",
        "options": [
          "Force every source into one engine",
          "Use suitable ingestion paths and converge on governed outputs",
          "Avoid security until Production",
          "Skip lineage"
        ],
        "answer": 1,
        "why": "Different workloads can use different engines while sharing governed data products."
      },
      {
        "question": "What should a five-minute design defense include?",
        "options": [
          "Requirements, choices, trade-offs, and failure handling",
          "Only code syntax",
          "Only exam answer letters",
          "Only capacity cost"
        ],
        "answer": 0,
        "why": "A concise defense must explain the design reasoning."
      },
      {
        "question": "When a feature behavior is uncertain, the best action is:",
        "options": [
          "Guess based on product naming",
          "Verify current official documentation",
          "Memorize a dump answer",
          "Choose the largest SKU"
        ],
        "answer": 1,
        "why": "Current official documentation is the source of truth."
      }
    ]
  }
};
