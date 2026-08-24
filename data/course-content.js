window.DP700_COURSE_CONTENT = (() => {
  "use strict";

  const commonSources = [
    { title: "DP-700 official study guide", url: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-700" },
    { title: "Official DP-700 course", url: "https://learn.microsoft.com/en-us/training/courses/dp-700t00" }
  ];

  const moduleGuides = {
    foundations: {
      whyAr: "الهندسة الناجحة للبيانات تبدأ من فهم رحلة البيانات كاملة، وليس من اختيار أداة بعينها. في هذا الجزء تبني الصورة الذهنية التي ستستخدمها لاحقًا لاختيار Lakehouse أو Warehouse أو Eventhouse وتصميم طبقات Bronze وSilver وGold.",
      arParagraphs: [
        "Data Engineering هي عملية تحويل البيانات الخام إلى بيانات موثوقة وقابلة للاستخدام في التحليل والتقارير والذكاء الاصطناعي. المهندس مسؤول عن ingestion، التخزين، التحويل، الجودة، الأمان، المراقبة وتحسين الأداء.",
        "Data Lake يعطي مرونة كبيرة لتخزين البيانات المنظمة وغير المنظمة، بينما Data Warehouse يركز على الجداول المنظمة والتحليل باستخدام SQL. Lakehouse يجمع مرونة الـData Lake مع إدارة الجداول والموثوقية التي نحتاجها في التحليلات.",
        "Medallion Architecture تفصل مراحل الجودة: Bronze للاحتفاظ بالبيانات كما وصلت، Silver للتنظيف والتوحيد وإزالة التكرار، وGold لنماذج الأعمال والتجميعات الجاهزة للاستهلاك.",
        "Delta Lake يضيف ACID transactions وschema enforcement وtime travel وMERGE فوق ملفات Parquet، ولذلك هو طبقة الموثوقية الأساسية داخل Fabric Lakehouse."
      ],
      englishSummary: "Data engineering turns raw data into governed, reliable data products. Use Bronze for replayable raw data, Silver for validated and standardized data, and Gold for consumption-ready analytical models. Delta Lake adds transactional table behavior over Parquet.",
      concepts: [
        ["Data Lake", "Flexible storage for structured and unstructured data", "Raw and large-scale data", "Governance and quality must be designed"],
        ["Warehouse", "Relational analytical store", "T-SQL, star schemas, BI", "Less suitable for arbitrary files"],
        ["Lakehouse", "Lake flexibility plus managed Delta tables", "Spark engineering and SQL analytics", "Choose table and file boundaries carefully"],
        ["Medallion", "Progressive data-quality layers", "Repeatable engineering pipelines", "Do not treat Gold as a copy of Bronze"]
      ],
      decisionTable: [
        ["Need", "Best starting point", "Reason"],
        ["Raw files and Spark transformations", "Lakehouse", "Open files, Delta tables, Spark and SQL access"],
        ["Relational BI model and T-SQL", "Warehouse", "Strong SQL and dimensional-model experience"],
        ["High-volume time-series events", "Eventhouse", "KQL and real-time analytics"],
        ["Preserve source exactly", "Bronze", "Replay and auditability"],
        ["Clean reusable data", "Silver", "Validation and standardization"],
        ["Business-ready aggregates", "Gold", "Optimized consumption"]
      ],
      code: {
        language: "PySpark",
        value: "from pyspark.sql.functions import col, current_timestamp\n\nbronze = spark.read.format(\"json\").load(\"Files/raw/orders\")\n\nsilver = (bronze\n    .dropDuplicates([\"OrderId\"])\n    .filter(col(\"Amount\") >= 0)\n    .withColumn(\"ProcessedAt\", current_timestamp()))\n\nsilver.write.format(\"delta\").mode(\"overwrite\").saveAsTable(\"silver_orders\")",
        explanation: "The example keeps ingestion separate from validation, then writes a governed Delta table.",
        expected: "A deduplicated Silver Delta table with invalid negative amounts removed.",
        error: "Writing cleaned data directly over the raw source removes replayability.",
        relevance: "The exam often tests which Medallion layer owns a requirement."
      },
      practice: ["Choose a small public dataset and identify its source system.", "Write the Bronze contract: file format, arrival frequency, and retained source fields.", "Define three Silver quality checks.", "Design one Gold table and state its grain."],
      expectedOutput: "A one-page architecture showing source, Bronze, Silver, Gold, consumers, and quality gates.",
      mistakes: ["Using Gold as a raw archive", "Applying destructive cleaning in Bronze", "Choosing a product before understanding the workload", "Confusing Parquet files with Delta table capabilities"],
      troubleshooting: ["If consumers disagree about numbers, confirm the Gold table grain.", "If replay is impossible, verify Bronze still contains the original payload.", "If schema changes break ingestion, separate permissive Bronze ingestion from strict Silver validation."],
      examFocus: ["Bronze = raw and replayable", "Silver = clean and conformed", "Gold = business-ready", "Delta adds transactions and history above Parquet"],
      memoryHook: "Bronze keeps it, Silver fixes it, Gold serves it.",
      sources: [
        { title: "What is a lakehouse?", url: "https://learn.microsoft.com/en-us/fabric/data-engineering/lakehouse-overview" },
        { title: "Medallion architecture in OneLake", url: "https://learn.microsoft.com/en-us/fabric/onelake/onelake-medallion-lakehouse-architecture" }
      ]
    },

    "fabric-onelake": {
      whyAr: "أسئلة DP-700 كثيرًا ما تخلط بين Tenant وCapacity وWorkspace وItem. فهم الحدود الإدارية وحدود التخزين والحوسبة يمنع اختيار صلاحية أو إعداد في المستوى الخطأ.",
      arParagraphs: [
        "Tenant هو الحد التنظيمي الأعلى. داخله توجد Capacities التي توفر الحوسبة، ثم Workspaces التي تنظم عناصر Fabric وتحدد نطاق التعاون والإدارة.",
        "OneLake هو الـlogical data lake الموحد للـTenant. كل عناصر Fabric التي تكتب بيانات مدارة تستخدم OneLake، لكن محرك الحوسبة يظل منفصلًا: Spark أو SQL أو KQL حسب العنصر.",
        "Workspace roles تعطي صلاحيات واسعة داخل الـWorkspace. عندما يحتاج المستخدم عنصرًا واحدًا فقط، استخدم item sharing أو data-level security بدل توسيع دوره على الـWorkspace بالكامل.",
        "Domains تساعد على تنظيم واكتشاف البيانات بحسب مجالات العمل، لكنها لا تستبدل نظام الصلاحيات. OneLake File Explorer يتيح تصفح البيانات التي يملك المستخدم صلاحية الوصول إليها من جهازه."
      ],
      englishSummary: "Fabric is organized as tenant → capacity → workspace → item. OneLake is the tenant-wide logical data lake, while compute remains workload-specific. Apply least privilege at workspace, item, and data layers.",
      concepts: [
        ["Tenant", "Organization-wide boundary", "Tenant settings and governance", "Not a compute resource"],
        ["Capacity", "Compute allocation", "Run Fabric workloads", "Does not grant item access"],
        ["Workspace", "Collaboration and lifecycle boundary", "Organize Fabric items", "Roles can be broader than required"],
        ["OneLake", "Unified logical data lake", "Shared storage and shortcuts", "Storage is not the same as compute"]
      ],
      decisionTable: [
        ["Requirement", "Layer", "Action"],
        ["Change Spark default pool", "Workspace / Environment", "Configure Spark settings"],
        ["Give access to one Warehouse", "Item", "Share the item"],
        ["Allow broad authoring", "Workspace", "Contributor or higher as required"],
        ["Control rows", "Data", "RLS or equivalent data security"],
        ["Allocate more compute", "Capacity", "Scale or tune capacity"]
      ],
      code: null,
      practice: ["Draw Tenant → Capacity → Workspace → Item.", "Assign Viewer, Contributor, Member, and Admin to four example personas.", "Locate two managed tables through OneLake File Explorer.", "Document one permission that should be item-level rather than workspace-level."],
      expectedOutput: "A hierarchy diagram plus a least-privilege access matrix.",
      mistakes: ["Assuming capacity access grants workspace access", "Using Admin when Viewer is sufficient", "Treating Domains as a security boundary", "Confusing OneLake storage with a Spark pool"],
      troubleshooting: ["If an item is invisible, verify workspace or item permission.", "If data is visible but a query fails, verify data-level security and engine permissions.", "If a workload is slow, inspect capacity and compute rather than changing access roles."],
      examFocus: ["Capacity provides compute", "Workspace organizes and secures items", "OneLake provides shared logical storage", "Use the narrowest permission layer"],
      memoryHook: "Capacity runs it, Workspace organizes it, OneLake stores it.",
      sources: [
        { title: "OneLake overview", url: "https://learn.microsoft.com/en-us/fabric/onelake/onelake-overview" },
        { title: "Roles in workspaces", url: "https://learn.microsoft.com/en-us/fabric/get-started/roles-workspaces" },
        { title: "Domains overview", url: "https://learn.microsoft.com/en-us/fabric/governance/domains" }
      ]
    },

    "lakehouse-shortcuts": {
      whyAr: "Lakehouse هو مركز كثير من حلول Data Engineering في Fabric. يجب أن تعرف الفرق بين Files وTables، وبين نسخ البيانات وShortcut، وحدود SQL analytics endpoint.",
      arParagraphs: [
        "Lakehouse يحتوي منطقتين رئيسيتين: Files للملفات العامة وغير المدارة، وTables لجداول Delta المدارة التي تظهر لمحركات Spark وSQL.",
        "Managed table يدير Fabric موقعها ودورة حياتها. External data يبقى خارج الإدارة الكاملة. Shortcut ينشئ مرجعًا لبيانات موجودة في OneLake أو مصدر خارجي بدون نسخها إلى موقع جديد.",
        "SQL analytics endpoint يوفر سطح T-SQL للقراءة والتحليل فوق جداول Delta في Lakehouse. عمليات الكتابة والهندسة المعقدة تتم غالبًا باستخدام Spark، بينما الاستعلام والتحليل يمكن أن يتم عبر SQL.",
        "Shortcut caching يمكن أن يقلل egress والقراءة المتكررة لبعض المصادر الخارجية. حذف الـShortcut لا يحذف البيانات الأصلية، لكن نقل الهدف أو تغيير صلاحياته قد يكسر المرجع."
      ],
      englishSummary: "Use Lakehouse Files for general file storage and Tables for managed Delta tables. A shortcut references data in place; it is not a copy. The SQL analytics endpoint is a read-optimized T-SQL surface over Lakehouse Delta tables.",
      concepts: [
        ["Files", "General file area", "Raw/semi-structured content", "Not automatically a SQL table"],
        ["Tables", "Managed Delta tables", "Spark and SQL analytics", "Requires valid Delta structure"],
        ["Shortcut", "Reference to existing data", "Avoid duplication", "Target permissions and availability still matter"],
        ["SQL endpoint", "T-SQL analytical surface", "BI and SQL queries", "Not a replacement for all Spark writes"]
      ],
      decisionTable: [
        ["Scenario", "Choose", "Why"],
        ["Keep external data in place", "Shortcut", "Zero-copy reference"],
        ["Replicate supported database changes", "Mirroring", "Managed near-real-time copy"],
        ["Transform and move data", "Pipeline or Notebook", "Explicit ingestion and transformation"],
        ["Store arbitrary images or JSON", "Files", "Flexible file storage"],
        ["Query governed Delta rows with SQL", "Tables + SQL endpoint", "Managed analytical table"]
      ],
      code: {
        language: "PySpark",
        value: "df = spark.read.format(\"parquet\").load(\"Files/landing/customers\")\n\n(df.dropDuplicates([\"CustomerId\"])\n   .write.format(\"delta\")\n   .mode(\"overwrite\")\n   .saveAsTable(\"Customers\"))\n\nspark.sql(\"SELECT COUNT(*) AS CustomerCount FROM Customers\").show()",
        explanation: "Reads landing files, creates a managed Delta table, then validates it with Spark SQL.",
        expected: "A Customers table visible under Lakehouse Tables and queryable through supported SQL surfaces.",
        error: "Pointing the SQL endpoint at ordinary files does not automatically create a managed table.",
        relevance: "Expect scenarios that distinguish Files, Tables, shortcuts, and copies."
      },
      practice: ["Create a Lakehouse and load one CSV into Files.", "Create a managed Delta table from the file.", "Create an internal shortcut to another Lakehouse table.", "Query both tables and document which data was copied."],
      expectedOutput: "A Lakehouse with one locally managed table and one shortcut-backed object, with proof that the source remains authoritative.",
      mistakes: ["Calling a shortcut a copy", "Deleting source data after creating a shortcut", "Expecting every file to appear as a SQL table", "Ignoring target permissions"],
      troubleshooting: ["Broken shortcut: verify target path, existence, and credentials.", "Missing SQL table: verify the object is a valid Delta table under Tables.", "Unexpected egress: review shortcut caching eligibility and access pattern."],
      examFocus: ["Shortcut = reference", "Mirroring = managed replication", "Files ≠ Tables", "SQL endpoint reads Lakehouse Delta tables"],
      memoryHook: "Files hold anything; Tables hold Delta; Shortcuts point elsewhere.",
      sources: [
        { title: "Lakehouse overview", url: "https://learn.microsoft.com/en-us/fabric/data-engineering/lakehouse-overview" },
        { title: "OneLake shortcuts", url: "https://learn.microsoft.com/en-us/fabric/onelake/onelake-shortcuts" },
        { title: "Lakehouse SQL analytics endpoint", url: "https://learn.microsoft.com/en-us/fabric/data-engineering/lakehouse-sql-analytics-endpoint-use-cases" }
      ]
    },

    "data-factory": {
      whyAr: "Data Pipeline هو أداة orchestration الأساسية عندما تحتاج خطوات متعددة واعتماديات وTriggers ومراقبة. الامتحان يهتم بمكان استخدام كل Activity وترتيب تحديث الـwatermark والتعامل مع الفشل.",
      arParagraphs: [
        "Copy Activity تنقل البيانات بين مصدر ووجهة، بينما Pipeline ينظم العملية كاملة: Lookup وGet Metadata وFilter وForEach وIf Condition وExecute Pipeline وغيرها.",
        "Parameters تدخل قيمًا إلى الـPipeline أو Activity، وVariables تحتفظ بقيم تتغير أثناء التشغيل. Expressions تجعل المسارات والأسماء والتواريخ ديناميكية.",
        "في incremental loading اقرأ W_old، احسب W_new، انسخ الشرط watermark > W_old AND watermark <= W_new، ثم حدّث W_old فقط بعد نجاح النسخ.",
        "ضع مسارات failure واضحة، استخدم retry وtimeout حسب طبيعة المصدر، وراقب activity output بدل الاكتفاء برسالة الخطأ العامة."
      ],
      englishSummary: "Use Data Pipelines for multi-step orchestration, dependencies, parameters, triggers, retries, and monitoring. For incremental loads, update the persisted watermark only after the copy succeeds.",
      concepts: [
        ["Copy Activity", "Moves data", "Batch ingestion", "Not a full transformation engine"],
        ["Get Metadata", "Reads file/folder properties", "Metadata-driven pipelines", "Does not transform file contents"],
        ["ForEach", "Iterates over an array", "Process many files/tables", "Control concurrency"],
        ["Watermark", "Incremental boundary", "Load only changed rows", "Update after success"]
      ],
      decisionTable: [
        ["Requirement", "Activity / tool", "Reason"],
        ["List files", "Get Metadata", "Retrieve child items"],
        ["Keep supported files", "Filter", "Reduce array before loop"],
        ["Process each file", "ForEach", "Iterative orchestration"],
        ["Branch by a condition", "If Condition / Switch", "Conditional execution"],
        ["Reuse child logic", "Execute Pipeline", "Modular orchestration"],
        ["Custom Spark transform", "Notebook activity", "Code-based processing"]
      ],
      code: {
        language: "Pipeline expression",
        value: "@concat(\n  'Files/bronze/',\n  formatDateTime(utcNow(),'yyyy/MM/dd'),\n  '/',\n  item().name\n)",
        explanation: "Builds a date-partitioned destination path inside a ForEach loop.",
        expected: "Each file lands under the current UTC year/month/day path.",
        error: "Using item() outside a loop or referencing a missing property causes expression evaluation failure.",
        relevance: "Dynamic paths and parameterized datasets are common scenario questions."
      },
      practice: ["Create a pipeline with Get Metadata over a landing folder.", "Filter for CSV and Parquet files.", "Copy files in a ForEach loop with a parameterized destination.", "Add a failure branch and persist the new watermark only after success."],
      expectedOutput: "A metadata-driven pipeline that can safely restart without missing or duplicating the watermark range.",
      mistakes: ["Updating watermark before copy succeeds", "Using Variables where Parameters are required", "Running unlimited parallel copies against a constrained source", "Looking only at the pipeline-level error"],
      troubleshooting: ["Open the failed activity and inspect input, output, and error details.", "Validate connection, gateway, and credentials separately.", "For timeout or throttling, reduce concurrency or tune source extraction."],
      examFocus: ["Pipeline orchestrates", "Copy Activity moves", "Get Metadata discovers", "ForEach iterates", "Watermark updates last"],
      memoryHook: "Discover, filter, loop, copy, then commit the watermark.",
      sources: [
        { title: "Data Factory overview", url: "https://learn.microsoft.com/en-us/fabric/data-factory/data-factory-overview" },
        { title: "Pipeline activities", url: "https://learn.microsoft.com/en-us/fabric/data-factory/activity-overview" },
        { title: "Pipeline monitoring", url: "https://learn.microsoft.com/en-us/fabric/data-factory/monitor-pipeline-runs" }
      ]
    },

    "dataflow-gen2": {
      whyAr: "Dataflow Gen2 مناسب عندما يريد الفريق تحويلات مرئية قابلة للصيانة باستخدام Power Query. يجب تمييزه عن Pipeline الذي ينسق الخطوات وعن Notebook الذي يعطي حرية كود كاملة.",
      arParagraphs: [
        "Dataflow Gen2 يستخدم Power Query لتطبيق خطوات مرتبة مثل تغيير النوع، استبدال القيم، تقسيم الأعمدة، Merge، Group By وإزالة الأخطاء.",
        "كل خطوة تعتمد على الخطوة السابقة. لذلك اسم الخطوة وترتيبها مهمان عند قراءة M code أو تشخيص خطأ refresh.",
        "حدد destination بوضوح، وراجع schema mapping وأنواع الأعمدة قبل النشر. يمكن تشغيل Dataflow من Pipeline ضمن orchestration أكبر.",
        "Fast Copy يسرّع مسارات ingestion المدعومة، لكنه ليس بديلًا لكل التحويلات. إذا احتجت منطق Spark مخصصًا أو تحكمًا عميقًا في partitions فاستخدم Notebook."
      ],
      englishSummary: "Dataflow Gen2 is the low-code Power Query transformation experience. Use it for maintainable visual cleaning and joins, and orchestrate it from a Pipeline when it is part of a wider process.",
      concepts: [
        ["Power Query", "Ordered transformation steps", "Low-code data preparation", "Step dependencies matter"],
        ["Destination", "Where transformed data is loaded", "Lakehouse/Warehouse targets", "Check schema mapping"],
        ["Fast Copy", "Optimized supported ingestion", "High-throughput copy paths", "Not every transformation can use it"],
        ["Refresh log", "Run diagnostics", "Troubleshooting", "Inspect the failing query and step"]
      ],
      decisionTable: [
        ["Need", "Choose", "Reason"],
        ["Visual cleaning and joins", "Dataflow Gen2", "Power Query interface"],
        ["Dependencies and triggers", "Pipeline", "Orchestration"],
        ["Complex distributed code", "Notebook", "Spark flexibility"],
        ["Simple recurring movement", "Copy Job / Copy Activity", "Less transformation overhead"]
      ],
      code: {
        language: "Power Query M",
        value: "let\n    Source = Csv.Document(File.Contents(\"customers.csv\"), [Delimiter=\",\", Encoding=65001]),\n    Headers = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),\n    Typed = Table.TransformColumnTypes(Headers, {{\"CustomerId\", Int64.Type}, {\"Email\", type text}}),\n    CleanEmail = Table.TransformColumns(Typed, {{\"Email\", each Text.Lower(Text.Trim(_)), type text}}),\n    DistinctRows = Table.Distinct(CleanEmail, {\"CustomerId\"})\nin\n    DistinctRows",
        explanation: "Promotes headers, applies types, normalizes email, and removes duplicate customer IDs.",
        expected: "A typed and deduplicated customer query ready for a Silver destination.",
        error: "Applying text functions before handling nulls or wrong types can fail refresh.",
        relevance: "Know how visual steps map to M and when Dataflow Gen2 is the lowest-effort choice."
      },
      practice: ["Import customer and order queries.", "Correct types and replace invalid values.", "Merge by CustomerId and expand selected columns.", "Load to a Silver table and invoke the Dataflow from a Pipeline."],
      expectedOutput: "A repeatable Dataflow with documented steps, destination, and successful refresh history.",
      mistakes: ["Using Dataflow for orchestration", "Ignoring query folding or Fast Copy eligibility", "Changing destination schema without remapping", "Hiding the actual failing step"],
      troubleshooting: ["Open refresh history and inspect the exact query and step.", "Verify source credentials and gateway status.", "Check destination table types and column mapping."],
      examFocus: ["Dataflow = visual transformation", "Pipeline = orchestration", "Notebook = custom Spark", "Fast Copy applies only to supported paths"],
      memoryHook: "Dataflow cleans; Pipeline coordinates.",
      sources: [
        { title: "Dataflow Gen2 overview", url: "https://learn.microsoft.com/en-us/fabric/data-factory/dataflows-gen2-overview" },
        { title: "Decision guide: pipeline, dataflow, Eventstream, or Spark", url: "https://learn.microsoft.com/en-us/fabric/fundamentals/decision-guide-pipeline-dataflow-spark" }
      ]
    },

    "spark-pyspark": {
      whyAr: "Spark هو المحرك الأساسي للتحويلات واسعة النطاق في Lakehouse. الامتحان لا يختبر syntax فقط؛ بل يختبر partitions وshuffle وskew والفرق بين Driver وExecutors واختيار Starter أو Custom Pool.",
      arParagraphs: [
        "Driver يبني خطة التنفيذ وينسق العمل، بينما Executors تنفذ Tasks على Partitions. Job يتكون من Stages، والـStage يتكون من Tasks.",
        "Transformations مثل select وfilter غالبًا narrow، بينما groupBy وjoin قد تسبب shuffle. Shuffle مكلف لأنه ينقل البيانات بين Executors، وdata skew يظهر عندما تصبح Partition واحدة أكبر بكثير من البقية.",
        "Starter Pool يعطي بدءًا سريعًا وإعدادًا افتراضيًا. Custom Pool مناسب عندما تحتاج node size أو scaling أو network configuration مخصص. Environment يجمع libraries وSpark properties وإعدادات runtime قابلة لإعادة الاستخدام.",
        "استخدم Spark UI وMonitoring Hub لتحديد stage بطيء أو task شاردة أو memory pressure. لا تبدأ بزيادة الحوسبة قبل إصلاح partitioning أو join strategy."
      ],
      englishSummary: "Spark distributes work across partitions executed by executors under a driver. Diagnose shuffles, skew, and memory before scaling. Starter pools optimize startup; custom pools and environments provide workload-specific control.",
      concepts: [
        ["Driver", "Plans and coordinates the application", "Job control", "Can OOM after large collect()"],
        ["Executor", "Runs tasks on partitions", "Distributed processing", "Can OOM on skewed partitions"],
        ["Shuffle", "Redistributes data", "Joins and aggregations", "Network and disk cost"],
        ["Environment", "Reusable runtime configuration", "Libraries and Spark settings", "Must be published/selected correctly"]
      ],
      decisionTable: [
        ["Signal", "Likely cause", "First action"],
        ["One task much slower", "Data skew", "Inspect key distribution"],
        ["Executor OOM", "Large partition or skew", "Repartition / fix skew"],
        ["Driver OOM", "Large collect or metadata", "Avoid collecting large data"],
        ["Slow startup", "Pool provisioning/configuration", "Review Starter/Custom pool and environment"],
        ["Large-small join", "Unnecessary shuffle", "Consider broadcast of small table"]
      ],
      code: {
        language: "PySpark",
        value: "from pyspark.sql import functions as F\n\norders = spark.table(\"bronze_orders\")\ncustomers = spark.table(\"silver_customers\")\n\nresult = (orders\n    .filter(F.col(\"OrderStatus\") == \"Completed\")\n    .join(F.broadcast(customers.select(\"CustomerId\", \"Segment\")), \"CustomerId\")\n    .groupBy(\"Segment\")\n    .agg(F.sum(\"Amount\").alias(\"Revenue\")))\n\nresult.write.format(\"delta\").mode(\"overwrite\").saveAsTable(\"gold_revenue_by_segment\")",
        explanation: "Filters early, broadcasts a small dimension, aggregates, and writes a Gold Delta table.",
        expected: "Revenue totals by customer segment with reduced join shuffle when the dimension is small.",
        error: "Broadcasting a large table can create executor memory pressure.",
        relevance: "The exam links code choices to performance symptoms and workload size."
      },
      practice: ["Read a Bronze table into a DataFrame.", "Apply casting, null handling, and deduplication.", "Join a small dimension and inspect the physical plan.", "Write a partition-aware Delta table and inspect Spark UI."],
      expectedOutput: "A Silver or Gold Delta table plus screenshots/notes from the Spark execution plan and UI.",
      mistakes: ["Calling collect() on large data", "Repartitioning without a reason", "Broadcasting a large table", "Scaling compute before measuring skew and shuffle"],
      troubleshooting: ["Use explain() and Spark UI to locate shuffle and stage boundaries.", "Compare task durations to identify skew.", "Review executor and driver memory separately.", "Verify the selected Environment and pool are actually attached."],
      examFocus: ["Driver plans; Executors run", "Partitions determine parallelism", "Shuffle is expensive", "Starter = fast default; Custom = control"],
      memoryHook: "Driver decides, Executors do, Partitions divide.",
      sources: [
        { title: "Fabric Spark compute", url: "https://learn.microsoft.com/en-us/fabric/data-engineering/spark-compute" },
        { title: "Configure starter pools", url: "https://learn.microsoft.com/en-us/fabric/data-engineering/configure-starter-pools" },
        { title: "Create custom Spark pools", url: "https://learn.microsoft.com/en-us/fabric/data-engineering/create-custom-spark-pools" },
        { title: "Environment compute settings", url: "https://learn.microsoft.com/en-us/fabric/data-engineering/environment-manage-compute" }
      ]
    },

    "warehouse-tsql": {
      whyAr: "Fabric Warehouse مناسب للحلول التحليلية التي يقودها T-SQL والنمذجة البُعدية. يجب معرفة grain وfact/dimension وsurrogate keys وSCD، بالإضافة إلى قيود المفاتيح والأمان والمراقبة.",
      arParagraphs: [
        "ابدأ بتحديد grain للـFact table: ماذا يمثل كل صف؟ بعد ذلك اختر measures والمفاتيح التي تربط Dimensions مثل Customer وProduct وDate.",
        "Surrogate key مفتاح مستقل يُنشأ في النموذج التحليلي. يفيد في SCD Type 2 لأن نفس natural key يمكن أن يملك عدة إصدارات تاريخية.",
        "في Fabric Warehouse يمكن تعريف Primary Key بصيغة NONCLUSTERED NOT ENFORCED. هو metadata يساعد الفهم والتحسين، لكنه لا يمنع فعليًا إدخال duplicate keys؛ مسؤولية الجودة تظل على عملية التحميل.",
        "RLS يرشح الصفوف، CLS/OLS يمنع الوصول إلى أعمدة أو Objects، وDynamic Data Masking يغير شكل النتيجة لبعض المستخدمين ولا يغير القيمة المخزنة."
      ],
      englishSummary: "Design facts at a declared grain and use dimensions for descriptive context. Surrogate keys support historical dimensions. Fabric Warehouse key constraints are metadata and may be NOT ENFORCED, so data quality must be maintained by the load process.",
      concepts: [
        ["Fact grain", "Meaning of one fact row", "Model correctness", "Must be declared first"],
        ["Surrogate key", "Warehouse-generated identifier", "SCD and stable joins", "Not the business natural key"],
        ["SCD Type 1", "Overwrite current value", "No history required", "History is lost"],
        ["SCD Type 2", "Insert a new version", "Track history", "Requires effective dates/current flag"]
      ],
      decisionTable: [
        ["Requirement", "Technique", "Result"],
        ["Correct a typo without history", "SCD Type 1", "Update existing dimension row"],
        ["Track customer region history", "SCD Type 2", "New version row"],
        ["Filter rows by user", "RLS", "Row predicate"],
        ["Block a sensitive column", "CLS/OLS", "Column/object inaccessible"],
        ["Obscure display for nonprivileged users", "Dynamic Data Masking", "Masked result"]
      ],
      code: {
        language: "T-SQL",
        value: "CREATE TABLE dbo.DimCustomer (\n    CustomerSK BIGINT NOT NULL,\n    CustomerId VARCHAR(50) NOT NULL,\n    CustomerName VARCHAR(200),\n    EffectiveFrom DATETIME2,\n    EffectiveTo DATETIME2,\n    IsCurrent BIT\n);\n\nALTER TABLE dbo.DimCustomer\nADD CONSTRAINT PK_DimCustomer\nPRIMARY KEY NONCLUSTERED (CustomerSK) NOT ENFORCED;\n\nCREATE TABLE dbo.FactSales (\n    SalesDateKey INT,\n    CustomerSK BIGINT,\n    Amount DECIMAL(18,2)\n);",
        explanation: "Defines a Type-2-ready customer dimension and a fact table at sales-event grain.",
        expected: "A dimensional schema where facts join to the correct historical customer version.",
        error: "NOT ENFORCED means duplicate CustomerSK values are not automatically rejected.",
        relevance: "Fabric-specific constraint behavior and SCD decisions are frequently tested."
      },
      practice: ["Define the grain of a sales fact table.", "Create Date, Customer, and Product dimensions.", "Implement a Type 1 change and a Type 2 change.", "Monitor a query and compare projections before and after optimization."],
      expectedOutput: "A small star schema with documented grain, surrogate keys, and SCD behavior.",
      mistakes: ["Designing measures before declaring grain", "Using natural keys as the only historical join key", "Assuming NOT ENFORCED prevents duplicates", "Treating masking as full authorization"],
      troubleshooting: ["Duplicate facts: verify source key and incremental boundary.", "Wrong historical attributes: verify effective-date join to Type 2 dimension.", "Slow query: inspect plan, bytes read, predicates, and statistics."],
      examFocus: ["Fact = measures at a grain", "Dimension = context", "Type 1 overwrites", "Type 2 inserts history", "Keys may be NOT ENFORCED"],
      memoryHook: "Declare the grain before you design the table.",
      sources: [
        { title: "Fabric Data Warehouse", url: "https://learn.microsoft.com/en-us/fabric/data-warehouse/data-warehousing" },
        { title: "Dimensional modeling", url: "https://learn.microsoft.com/en-us/fabric/data-warehouse/dimensional-modeling-overview" },
        { title: "Table constraints", url: "https://learn.microsoft.com/en-us/fabric/data-warehouse/table-constraints" }
      ]
    },

    "governance-monitoring": {
      whyAr: "حل البيانات ليس مكتملًا بدون least privilege وclassification وlineage وaudit وmonitoring. يجب اختيار أداة المراقبة حسب السؤال: تشغيل Job، استهلاك Capacity، أو نشاط مستخدم.",
      arParagraphs: [
        "طبقات الوصول منفصلة: Workspace role، item permissions، ثم data security مثل RLS وCLS وOLS. راجع كل مسار وصول لأن المستخدم قد يصل إلى نفس البيانات عبر أكثر من عنصر.",
        "Sensitivity labels للتصنيف والحماية المدعومة، بينما Promoted وCertified إشارات ثقة وجودة. Lineage يوضح الاعتماديات بين المصادر والتحويلات والمخرجات.",
        "Monitoring Hub مناسب لمتابعة تشغيل Pipelines وNotebooks وDataflows وعناصر أخرى. Capacity Metrics يركز على استهلاك الموارد والضغط، وPurview Audit يجيب: من فعل ماذا ومتى؟",
        "عند حدوث مشكلة، ابدأ من العرض الذي يطابق الطبقة. فشل Pipeline لا يُشخّص من Capacity Metrics وحده، ونشاط حذف عنصر لا يُبحث عنه في Spark UI."
      ],
      englishSummary: "Apply least privilege across workspace, item, and data layers. Use sensitivity labels for classification, endorsement for trust, lineage for dependencies, Monitoring Hub for runs, Capacity Metrics for resource pressure, and audit logs for user actions.",
      concepts: [
        ["RLS", "Filters rows", "Per-user data visibility", "Does not block all object access"],
        ["Sensitivity label", "Classification/protection", "Governed content", "Not an endorsement"],
        ["Monitoring Hub", "Operational runs", "Failures and history", "Not a capacity-sizing tool"],
        ["Audit log", "User and admin actions", "Compliance investigation", "Not query-performance telemetry"]
      ],
      decisionTable: [
        ["Question", "Tool", "Why"],
        ["Which activity failed?", "Monitoring Hub / item run history", "Operational execution details"],
        ["Why is capacity throttling?", "Capacity Metrics", "Resource consumption"],
        ["Who deleted an item?", "Purview Audit", "User action record"],
        ["Which downstream item depends on this table?", "Lineage", "Dependency graph"],
        ["Which rows may a user see?", "RLS", "Data-level filtering"]
      ],
      code: {
        language: "T-SQL",
        value: "CREATE FUNCTION Security.fn_regionPredicate(@Region AS VARCHAR(50))\nRETURNS TABLE\nWITH SCHEMABINDING\nAS\nRETURN SELECT 1 AS allowed\nWHERE @Region = USER_NAME() OR IS_MEMBER('RegionalManagers') = 1;\n\nCREATE SECURITY POLICY Security.RegionPolicy\nADD FILTER PREDICATE Security.fn_regionPredicate(Region)\nON dbo.FactSales\nWITH (STATE = ON);",
        explanation: "Illustrates the predicate pattern used to restrict rows according to user context.",
        expected: "Users see only permitted regions, while an authorized manager role can see broader data.",
        error: "Granting a broader alternate access path can bypass the intended design.",
        relevance: "The exam tests the correct security layer and least-privilege option."
      },
      practice: ["Create an access matrix for four personas.", "Add one sensitivity label and one endorsement decision.", "Trace lineage from a source to a report.", "Diagnose one failed run and one capacity-pressure scenario using different tools."],
      expectedOutput: "A security and operations runbook showing who can access what and which monitoring surface answers each question.",
      mistakes: ["Using Certified as data protection", "Using masking instead of authorization", "Giving workspace access for one item", "Using the wrong monitoring surface"],
      troubleshooting: ["Unexpected access: enumerate workspace, item, OneLake, and SQL paths.", "Failed run: inspect activity-level error and correlation identifiers.", "Capacity issue: compare CU consumption, concurrency, and throttling windows."],
      examFocus: ["RLS rows; CLS columns; OLS objects", "Labels classify; endorsement signals trust", "Monitoring Hub runs", "Capacity Metrics resources", "Audit logs actions"],
      memoryHook: "Runs, resources, actions: Hub, Metrics, Audit.",
      sources: [
        { title: "Fabric security", url: "https://learn.microsoft.com/en-us/fabric/security/security-overview" },
        { title: "Monitoring Hub", url: "https://learn.microsoft.com/en-us/fabric/admin/monitoring-hub" },
        { title: "Capacity Metrics", url: "https://learn.microsoft.com/en-us/fabric/enterprise/metrics-app" }
      ]
    },

    "realtime-kql": {
      whyAr: "Real-Time Intelligence يعالج الأحداث المستمرة من لحظة الوصول حتى التحليل والتنبيه. يجب معرفة دور Real-Time Hub وEventstream وEventhouse وKQL واختيار التحويل الصحيح.",
      arParagraphs: [
        "Real-Time Hub يساعد على اكتشاف وربط مصادر الأحداث. Eventstream يستقبل الأحداث ويطبق transforms ويرسل فروعًا إلى وجهات مثل Eventhouse أو Lakehouse.",
        "Filter يستبعد أحداثًا، Manage fields يختار أو يعيد تسمية حقول، Expand يفك بنية nested، Aggregate يحسب قياسات داخل Window، وJoin يضيف بيانات مرجعية.",
        "Eventhouse يحتوي KQL Databases ومصمم للـtelemetry والlogs والtime-series. KQL يعتمد pipeline من operators مثل where وproject وextend وsummarize وjoin.",
        "Materialized view يحافظ على aggregation محسوب باستمرار، وupdate policy يمكن أن يحول البيانات عند ingestion. Retention يحدد مدة الاحتفاظ، بينما cache policy يحدد الجزء الساخن السريع."
      ],
      englishSummary: "Use Real-Time Hub to discover streams, Eventstream to ingest/transform/route events, and Eventhouse/KQL Database for high-volume time-series analytics. Select the transformation operator that exactly matches the requirement.",
      concepts: [
        ["Eventstream", "Ingests, transforms, routes", "Real-time event flow", "Not the final analytical store"],
        ["Eventhouse", "Container for KQL databases", "Telemetry analytics", "Tune retention and cache separately"],
        ["Materialized view", "Maintained aggregate", "Repeated fast queries", "Has maintenance cost"],
        ["Activator", "Rule-driven action", "Alerts and responses", "Requires a clear condition"]
      ],
      decisionTable: [
        ["Requirement", "Operator / feature", "Reason"],
        ["Remove unwanted events", "Filter", "Predicate-based exclusion"],
        ["Rename or select fields", "Manage fields / project", "Shape the event"],
        ["Flatten nested JSON", "Expand", "Expose nested values"],
        ["Count per 5 minutes", "Aggregate + tumbling window", "Time-bucket measure"],
        ["Enrich with reference data", "Join", "Add attributes"],
        ["Trigger an action", "Activator", "Condition-driven response"]
      ],
      code: {
        language: "KQL",
        value: "DeviceEvents\n| where Timestamp > ago(1h)\n| where Temperature > 80\n| summarize EventCount=count(), AvgTemperature=avg(Temperature)\n    by DeviceId, bin(Timestamp, 5m)\n| order by Timestamp desc",
        explanation: "Filters recent hot events and aggregates them into five-minute buckets by device.",
        expected: "Time-bucketed counts and average temperature for each device.",
        error: "Using ingestion time instead of the required event timestamp can produce incorrect windows.",
        relevance: "KQL operator selection and time-series scenarios are core DP-700 skills."
      },
      practice: ["Connect a sample event source through Real-Time Hub.", "Build Eventstream branches for raw archive and filtered alerts.", "Store events in a KQL Database.", "Write KQL for filtering, aggregation, and a real-time dashboard."],
      expectedOutput: "A live flow from source to Eventstream to Eventhouse with a KQL query and dashboard tile.",
      mistakes: ["Using Aggregate when only projection is needed", "Confusing Eventhouse with Eventstream", "Using processing time for event-time requirements", "Setting retention and cache to the same concept"],
      troubleshooting: ["No events: verify source connection and Eventstream preview.", "Missing fields: inspect schema and Expand/Manage fields transforms.", "Slow query: filter early, project needed columns, and review materialization/cache."],
      examFocus: ["Hub discovers", "Eventstream routes", "Eventhouse stores/analyzes", "KQL queries", "Activator acts"],
      memoryHook: "Hub finds, Stream moves, House analyzes, Activator reacts.",
      sources: [
        { title: "Real-Time Intelligence overview", url: "https://learn.microsoft.com/en-us/fabric/real-time-intelligence/overview" },
        { title: "Eventstream overview", url: "https://learn.microsoft.com/en-us/fabric/real-time-intelligence/event-streams/overview" },
        { title: "KQL overview", url: "https://learn.microsoft.com/en-us/kusto/query/index" }
      ]
    },

    cicd: {
      whyAr: "Git integration وDeployment pipelines يحلان مشكلتين مختلفتين: الأول لإدارة المصدر والتعاون، والثاني لترقية العناصر بين البيئات. الخلط بينهما من أشهر traps.",
      arParagraphs: [
        "Git integration يربط Workspace بمستودع ويتيح branches وcommit history وpull requests للعناصر المدعومة.",
        "Deployment pipeline ينظم مراحل Dev وTest وProduction وينشر العناصر المدعومة مع مقارنة الاختلافات وقواعد deployment عند توفرها.",
        "Feature branch تعزل التغيير، Pull Request يراجع التغيير قبل الدمج إلى main، ثم تتم الترقية للبيئات بطريقة مضبوطة.",
        "ليست كل عناصر Fabric لها نفس دعم Git أو deployment. راجع الدعم الحالي، وخطط scripts أو خطوات post-deployment للعناصر التي لا تنتقل كاملة."
      ],
      englishSummary: "Git provides version control and collaboration; deployment pipelines promote supported Fabric content between environments. Use feature branches and pull requests before controlled deployment.",
      concepts: [
        ["Git integration", "Source versioning", "Branches and history", "Not deployment"],
        ["Pull request", "Review and merge", "Controlled collaboration", "Needs a branch strategy"],
        ["Deployment pipeline", "Promotes content", "Dev/Test/Prod lifecycle", "Support varies by item"],
        ["Database project", "SQL objects as code", "Warehouse lifecycle", "Requires build/deploy discipline"]
      ],
      decisionTable: [
        ["Need", "Use", "Outcome"],
        ["Track code history", "Git", "Versioned source"],
        ["Review a feature", "Branch + Pull Request", "Controlled merge"],
        ["Move content to Test", "Deployment pipeline", "Environment promotion"],
        ["Define SQL schema as code", "Database project", "Repeatable SQL deployment"]
      ],
      code: {
        language: "Git / CMD",
        value: "git checkout -b feature/incremental-pipeline\ngit add .\ngit commit -m \"Add incremental pipeline and watermark logic\"\ngit push -u origin feature/incremental-pipeline\n\n# Create and approve a pull request, then deploy the supported Fabric items.",
        explanation: "Uses a feature branch for isolated development before review and promotion.",
        expected: "A reviewed change merged to the main branch and deployed through controlled stages.",
        error: "Pushing directly to main removes review and does not replace environment deployment.",
        relevance: "Know which lifecycle feature answers source-control versus deployment requirements."
      },
      practice: ["Connect a Dev workspace to Git.", "Create a feature branch and commit one supported item.", "Review and merge through a pull request.", "Deploy to Test and document unsupported or environment-specific settings."],
      expectedOutput: "A release record showing source commit, review, deployment stage, and validation result.",
      mistakes: ["Calling Git a deployment tool", "Editing Production directly", "Ignoring unsupported items", "Hardcoding environment-specific connections"],
      troubleshooting: ["Sync conflict: compare workspace and repository state before overwriting.", "Deployment failure: inspect unsupported items and dependencies.", "Wrong connection after deployment: apply environment rules or configuration."],
      examFocus: ["Git = source control", "Deployment pipeline = promotion", "PR = review", "Support differs by item"],
      memoryHook: "Commit the change; deploy the release.",
      sources: [
        { title: "Git integration", url: "https://learn.microsoft.com/en-us/fabric/cicd/git-integration/intro-to-git-integration" },
        { title: "Deployment pipelines", url: "https://learn.microsoft.com/en-us/fabric/cicd/deployment-pipelines/intro-to-deployment-pipelines" }
      ]
    },

    "m-language": {
      whyAr: "فهم M Language يجعل خطوات Power Query قابلة للقراءة والتصحيح وإعادة الاستخدام، بدل الاعتماد الكامل على الواجهة المرئية.",
      arParagraphs: [
        "برنامج M غالبًا يبدأ بـlet وينتهي بـin. داخل let توجد خطوات مسماة، وكل خطوة تستطيع الرجوع إلى نتيجة خطوة سابقة.",
        "M يتعامل مع قيم scalar وList وRecord وTable. اختيار object الصحيح مهم لأن دوال Table لا تعمل على List والعكس.",
        "each اختصار لإنشاء function بمعامل ضمني، ويظهر كثيرًا في Table.TransformColumns وTable.SelectRows.",
        "Custom functions تقلل تكرار منطق التنظيف. احرص على type annotations ومعالجة null والأخطاء حتى تكون الـfunction آمنة في refresh."
      ],
      englishSummary: "M is a functional expression language used by Power Query. A let/in expression defines ordered named steps. Understand scalar, List, Record, and Table values, and build reusable typed functions.",
      concepts: [
        ["let / in", "Defines steps and final result", "Power Query scripts", "in returns one expression"],
        ["List", "Ordered sequence", "Iteration and transformations", "Different from a Table"],
        ["Record", "Named fields", "Single structured value", "Access fields by name"],
        ["each", "Shorthand function", "Row/value transformations", "Know the implicit parameter"]
      ],
      decisionTable: [
        ["Data shape", "M object", "Typical function"],
        ["One number/text/date", "Scalar", "Text.*, Number.*, Date.*"],
        ["Sequence of values", "List", "List.Transform / List.Select"],
        ["Named fields", "Record", "Record.Field / Record.AddField"],
        ["Rows and columns", "Table", "Table.SelectRows / Table.AddColumn"]
      ],
      code: {
        language: "Power Query M",
        value: "let\n    CleanText = (value as nullable text) as nullable text =>\n        if value = null then null else Text.Proper(Text.Trim(value)),\n    Source = Excel.CurrentWorkbook(){[Name=\"Customers\"]}[Content],\n    Typed = Table.TransformColumnTypes(Source, {{\"CustomerId\", Int64.Type}, {\"Name\", type text}}),\n    Cleaned = Table.TransformColumns(Typed, {{\"Name\", each CleanText(_), type text}})\nin\n    Cleaned",
        explanation: "Creates a reusable null-safe text function and applies it to a table column.",
        expected: "Customer names are trimmed and converted to proper case without failing on nulls.",
        error: "A function typed as text will fail when null is passed unless nullable text is accepted.",
        relevance: "M syntax and transformation semantics support Dataflow Gen2 troubleshooting."
      },
      practice: ["Read a let/in query and identify dependencies.", "Create a List, Record, and Table example.", "Write a typed null-safe function.", "Apply the function to a Dataflow query and validate refresh."],
      expectedOutput: "A reusable M cleaning function with a sample table transformation.",
      mistakes: ["Using the wrong object type", "Returning the wrong step in in", "Ignoring nullability", "Creating circular step dependencies"],
      troubleshooting: ["Expression.Error: inspect value type and function signature.", "Missing step: verify exact step name and quoted identifiers.", "Refresh failure: isolate the first step that introduces the error."],
      examFocus: ["let defines; in returns", "Steps are expressions", "each is a function", "List, Record, Table are different"],
      memoryHook: "let builds the steps; in returns the answer.",
      sources: [
        { title: "Power Query M language specification", url: "https://learn.microsoft.com/en-us/powerquery-m/power-query-m-language-specification" },
        { title: "M function reference", url: "https://learn.microsoft.com/en-us/powerquery-m/power-query-m-function-reference" }
      ]
    },

    optimization: {
      whyAr: "التحسين الصحيح يبدأ بقياس bottleneck ثم تقليل العمل غير الضروري وتحسين layout وأخيرًا ضبط الحوسبة. زيادة Capacity أو Pool أول خطوة غالبًا تخفي المشكلة ولا تحلها.",
      arParagraphs: [
        "في Delta tables، small files تزيد metadata وI/O overhead. OPTIMIZE يدمج الملفات، V-Order يحسن layout للقراءة، وVACUUM يزيل الملفات القديمة بعد فترة retention.",
        "في Spark راقب shuffle وskew والـpartitions والـbroadcast. في Warehouse راقب query plan والـstatistics والـprojection والـfilters والفرق بين cold وwarm cache.",
        "في Pipelines اضبط parallelism حسب قدرة المصدر والوجهة، واستخدم staging أو partitioned copy عند الحاجة. concurrency الأعلى ليست دائمًا أسرع إذا كان المصدر throttled.",
        "في Eventhouse وKQL، filter مبكرًا وproject الأعمدة المطلوبة واستخدم materialized views للـaggregations المتكررة. قارن القياسات قبل وبعد تحت نفس ظروف الـcache."
      ],
      englishSummary: "Measure first, locate the bottleneck, reduce unnecessary work, improve data layout, then tune compute. Optimize Delta files, Spark shuffles, Warehouse query shape, Pipeline concurrency, and KQL query patterns according to evidence.",
      concepts: [
        ["OPTIMIZE", "Compacts active Delta files", "Small-file problems", "Does not remove history"],
        ["VACUUM", "Deletes obsolete files", "Storage cleanup", "Can affect time travel"],
        ["V-Order", "Read-optimized file layout", "Fabric reads", "Evaluate write trade-off"],
        ["Baseline", "Comparable measurement", "Prove improvement", "Control cache and data volume"]
      ],
      decisionTable: [
        ["Symptom", "Likely action", "Validate"],
        ["Thousands of tiny Delta files", "OPTIMIZE / batch writes", "File count and query time"],
        ["One Spark task dominates", "Fix skew", "Task-duration distribution"],
        ["Warehouse scans excess columns", "Project/filter early", "Bytes read and plan"],
        ["Pipeline source throttles", "Reduce concurrency", "Throughput and errors"],
        ["Repeated KQL aggregation", "Materialized view", "Latency and maintenance cost"]
      ],
      code: {
        language: "Spark SQL",
        value: "OPTIMIZE silver_orders VORDER;\n\n-- Review retention and recovery requirements before cleanup\nVACUUM silver_orders RETAIN 168 HOURS;",
        explanation: "Compacts files and applies V-Order, then removes obsolete files older than seven days.",
        expected: "Fewer, larger active files and improved read efficiency for repeated analytical scans.",
        error: "Aggressive VACUUM can remove files required for rollback or time travel.",
        relevance: "The exam distinguishes OPTIMIZE, V-Order, VACUUM, partitioning, and compute scaling."
      },
      practice: ["Capture a baseline query or job run.", "Inspect file layout, plan, Spark UI, or capacity metrics.", "Apply one targeted optimization.", "Repeat under comparable conditions and document the trade-off."],
      expectedOutput: "A before/after performance report with evidence, not only a subjective speed impression.",
      mistakes: ["Scaling before measuring", "Comparing cold and warm runs", "Overpartitioning", "Running VACUUM without retention review"],
      troubleshooting: ["No improvement after OPTIMIZE: check whether filters and layout match query patterns.", "Worse writes after partitioning: reduce partition cardinality.", "Variable timing: control cache, concurrency, and data volume."],
      examFocus: ["Measure first", "OPTIMIZE compacts", "VACUUM deletes old files", "Fix skew before scaling", "Cold cache changes comparisons"],
      memoryHook: "Measure, reduce, arrange, then scale.",
      sources: [
        { title: "Lakehouse table maintenance", url: "https://learn.microsoft.com/en-us/fabric/data-engineering/lakehouse-table-maintenance" },
        { title: "Spark capacity planning", url: "https://learn.microsoft.com/en-us/fabric/data-engineering/spark-best-practices-capacity-planning" },
        { title: "Warehouse performance guidelines", url: "https://learn.microsoft.com/en-us/fabric/data-warehouse/guidelines-warehouse-performance" }
      ]
    },

    "structured-streaming": {
      whyAr: "Structured Streaming يعامل الـstream كجدول يتجدد باستمرار. صحة الحل تعتمد على checkpoint مستقل، event-time semantics، watermark لإدارة late data وoutput mode مناسب.",
      arParagraphs: [
        "Stateless transformation مثل select وfilter لا يحتاج حفظ حالة طويلة. Stateful transformation مثل aggregation أو deduplication عبر الزمن يحتاج state وcheckpoint.",
        "Checkpoint يحفظ offsets وcommits وحالة التشغيل لتمكين recovery. يجب أن يكون لكل streaming query مسار checkpoint فريد وثابت.",
        "Event time هو وقت وقوع الحدث داخل البيانات، بينما processing time هو وقت معالجته. Watermark يحدد مدى تأخر الأحداث المقبول ويساعد على تنظيف state القديمة.",
        "Append mode يخرج النتائج النهائية فقط عندما يسمح الـwatermark باعتبار window مكتملة. Complete mode يخرج الجدول الكامل، وUpdate mode يخرج الصفوف التي تغيرت بحسب دعم العملية والوجهة."
      ],
      englishSummary: "Structured Streaming uses incremental execution over an unbounded table. Use a unique stable checkpoint per query, event time for business windows, and watermarks to bound late-event state.",
      concepts: [
        ["Checkpoint", "Offsets, commits, and state", "Recovery", "Unique path per query"],
        ["Event time", "When the event occurred", "Correct business windows", "Can arrive late"],
        ["Watermark", "Late-data/state boundary", "Bound state", "May drop excessively late events"],
        ["Output mode", "How results are emitted", "Sink behavior", "Must match aggregation semantics"]
      ],
      decisionTable: [
        ["Need", "Choice", "Reason"],
        ["Fixed non-overlapping periods", "Tumbling window", "One bucket per event"],
        ["Overlapping fixed periods", "Hopping/sliding window", "Repeated membership"],
        ["User activity separated by idle gap", "Session window", "Dynamic window length"],
        ["Recover after restart", "Checkpoint", "Restore progress and state"],
        ["Bound late data", "Watermark", "State cleanup boundary"]
      ],
      code: {
        language: "PySpark",
        value: "from pyspark.sql.functions import window, col\n\nstream = (spark.readStream\n    .format(\"delta\")\n    .table(\"bronze_device_events\"))\n\nagg = (stream\n    .withWatermark(\"EventTime\", \"10 minutes\")\n    .groupBy(window(col(\"EventTime\"), \"5 minutes\"), col(\"DeviceId\"))\n    .count())\n\nquery = (agg.writeStream\n    .format(\"delta\")\n    .outputMode(\"append\")\n    .option(\"checkpointLocation\", \"Files/checkpoints/device_5m_v1\")\n    .table(\"gold_device_events_5m\"))",
        explanation: "Aggregates by event-time tumbling windows with a watermark and stable checkpoint.",
        expected: "Finalized five-minute counts written incrementally and recoverable after restart.",
        error: "Reusing the same checkpoint for a different query can corrupt or invalidate recovery semantics.",
        relevance: "Checkpoint, watermark, windows, and output modes are frequent scenario topics."
      },
      practice: ["Read a Delta streaming source.", "Create a tumbling event-time aggregation.", "Add a ten-minute watermark and unique checkpoint.", "Restart the query and verify recovery without reprocessing committed output."],
      expectedOutput: "A recoverable streaming table with documented event-time, watermark, checkpoint, and output mode.",
      mistakes: ["Using processing time when event time is required", "Sharing checkpoint paths", "Removing checkpoint between restarts", "Choosing Append without understanding finalization"],
      troubleshooting: ["Query will not restart: verify code/schema compatibility with checkpoint.", "State grows continuously: add an appropriate watermark.", "Late events missing: compare event lateness with watermark threshold."],
      examFocus: ["Checkpoint recovers", "Watermark bounds state", "Event time drives business windows", "One checkpoint per query"],
      memoryHook: "Checkpoint remembers; watermark forgets safely.",
      sources: [
        { title: "Structured Streaming overview", url: "https://spark.apache.org/docs/latest/structured-streaming-programming-guide.html" },
        { title: "Fabric Spark monitoring", url: "https://learn.microsoft.com/en-us/fabric/data-engineering/spark-monitoring-overview" }
      ]
    },

    "materialized-lake-views": {
      whyAr: "Materialized Lake Views (MLVs) تقدم أسلوبًا declarative لبناء وتحسين تدفقات Bronze إلى Silver إلى Gold. لأنها ميزة حديثة، يجب تمييز GA عن Preview والرجوع للمستند الرسمي الحالي.",
      arParagraphs: [
        "MLV يخزن نتيجة التحويل ويقوم Fabric بتحديثها تلقائيًا. يتم تعريفه باستخدام Spark SQL أو PySpark حسب الدعم الحالي، ويظهر كجدول Lakehouse من ناحية التخزين والوصول.",
        "بدل كتابة orchestration imperatively في عدة Notebooks، تصف العلاقات بين الـviews ويستخدم Fabric lineage والاعتماديات لاختيار refresh مناسب.",
        "Optimal refresh يقرر no refresh أو incremental أو full refresh حسب ما تغير في المصادر. Change Data Feed يساعد على اكتشاف التغييرات عندما تكون المتطلبات والإعدادات مدعومة.",
        "أضف data-quality rules، راقب Recent runs وlineage، وتحقق من limitations الحالية. PySpark-based MLVs أو بعض الخصائص قد تكون Preview، فلا تفترض ثبات السلوك."
      ],
      englishSummary: "Materialized Lake Views persist and automatically refresh declarative Lakehouse transformations. Fabric can select no, incremental, or full refresh using optimal refresh. Validate current support, preview status, lineage, and data-quality behavior in Microsoft Learn.",
      concepts: [
        ["MLV", "Persisted declarative transformation", "Medallion pipelines", "Support and syntax evolve"],
        ["Optimal refresh", "No/incremental/full strategy", "Reduce refresh work", "Depends on change detection"],
        ["CDF", "Delta change feed", "Incremental dependencies", "Must be enabled/supported"],
        ["Lineage", "Dependency graph", "Refresh and troubleshooting", "Keep sources and views valid"]
      ],
      decisionTable: [
        ["Requirement", "Choose", "Reason"],
        ["Declarative maintained transformation", "MLV", "Automatic dependency-aware refresh"],
        ["Complex custom control flow", "Notebook/Pipeline", "Imperative orchestration"],
        ["Incremental source changes", "CDF + supported MLV refresh", "Change-aware processing"],
        ["Enforce expectations", "MLV data-quality rules", "Quality visibility"],
        ["Investigate freshness", "Recent runs + lineage", "Run and dependency details"]
      ],
      code: {
        language: "Spark SQL",
        value: "CREATE MATERIALIZED LAKE VIEW silver_valid_orders AS\nSELECT\n    OrderId,\n    CustomerId,\n    CAST(OrderDate AS DATE) AS OrderDate,\n    Amount\nFROM bronze_orders\nWHERE OrderId IS NOT NULL\n  AND Amount >= 0;",
        explanation: "Defines a persisted Silver transformation declaratively from a Bronze table.",
        expected: "A maintained Lakehouse table representing validated orders, subject to current MLV support and refresh configuration.",
        error: "Using preview syntax without checking the current Fabric tenant and documentation may fail or behave differently.",
        relevance: "New exam content can test architecture, CDF, quality, lineage, refresh, and limitations."
      },
      practice: ["Open a Lakehouse and create a simple Spark SQL MLV.", "Build Bronze → Silver → Gold dependencies.", "Add one data-quality rule.", "Run refresh, inspect lineage and Recent runs, and record the refresh strategy."],
      expectedOutput: "A three-layer declarative MLV chain with successful refresh and a visible lineage path.",
      mistakes: ["Treating Preview behavior as guaranteed", "Assuming every source supports incremental refresh", "Ignoring CDF requirements", "Skipping lineage and run diagnostics"],
      troubleshooting: ["Refresh failure: inspect Recent runs and upstream dependencies.", "Unexpected full refresh: verify change tracking and supported transformation pattern.", "Missing quality result: confirm rule syntax and execution scope."],
      examFocus: ["MLV = declarative persisted transform", "Optimal refresh chooses strategy", "CDF supports changes", "Check preview and limitations"],
      memoryHook: "Declare the view; Fabric maintains the flow.",
      sources: [
        { title: "MLV overview", url: "https://learn.microsoft.com/en-us/fabric/data-engineering/materialized-lake-views/overview-materialized-lake-view" },
        { title: "Get started with MLVs", url: "https://learn.microsoft.com/en-us/fabric/data-engineering/materialized-lake-views/get-started-with-materialized-lake-views" },
        { title: "Optimal refresh", url: "https://learn.microsoft.com/en-us/fabric/data-engineering/materialized-lake-views/refresh-materialized-lake-view" },
        { title: "MLV recent runs", url: "https://learn.microsoft.com/en-us/fabric/data-engineering/materialized-lake-views/run-history" }
      ]
    },

    capstone: {
      whyAr: "النجاح في DP-700 يعتمد على ربط المتطلبات بالأداة والطبقة الصحيحة. الـCapstone يجمع batch وstreaming وsecurity وCI/CD وmonitoring وoptimization في قصة واحدة.",
      arParagraphs: [
        "ابدأ من المتطلبات: volume، velocity، latency، data type، team skills، security، lifecycle وoperational targets. لا تبدأ من اسم منتج تريد استخدامه.",
        "حدد store لكل workload: Lakehouse للملفات وSpark، Warehouse للنمذجة والتحليل بـT-SQL، Eventhouse للأحداث وKQL. يمكن أن يستخدم الحل أكثر من store مع OneLake كطبقة موحدة.",
        "ارسم ingestion والتحويل والاستهلاك، ثم أضف least privilege وGit/deployment وmonitoring وfailure recovery. لكل اختيار اكتب trade-off واضحًا.",
        "في الامتحان ابحث عن الكلمات التي تحدد الأولوية: minimize development effort، avoid copying، near real time، preserve history، least privilege، reduce latency أو troubleshoot failure."
      ],
      englishSummary: "Translate each scenario into workload, latency, store, transformation tool, security layer, lifecycle, and operational requirement. Choose the simplest tool that satisfies all constraints and state the trade-off.",
      concepts: [
        ["Requirement", "A measurable need or constraint", "Architecture decisions", "Do not infer extra requirements"],
        ["Trade-off", "Cost of a choice", "Defend architecture", "No tool is best for every workload"],
        ["Readiness", "Consistent performance across domains", "Exam timing", "One high score is not enough"],
        ["Elimination", "Remove options solving the wrong layer", "Exam technique", "Read all constraints first"]
      ],
      decisionTable: [
        ["Clue", "Likely direction", "Check"],
        ["Avoid copying data", "Shortcut", "Source and permission support"],
        ["Near-real-time database replica", "Mirroring", "Supported source"],
        ["Low-code transformation", "Dataflow Gen2", "Required transformation complexity"],
        ["Custom large-scale code", "Notebook/Spark", "Skills and runtime"],
        ["Time-series telemetry", "Eventhouse/KQL", "Retention and cache"],
        ["Star schema and T-SQL", "Warehouse", "Relational requirements"]
      ],
      code: null,
      practice: ["Design a batch ingestion into Bronze and incremental Silver processing.", "Add a streaming Eventstream/Eventhouse path.", "Serve a Gold star schema or aggregate.", "Add security, Git/deployment, monitoring, recovery, and one optimization baseline."],
      expectedOutput: "A portfolio-ready architecture diagram, implementation checklist, validation evidence, and five-minute design defense.",
      mistakes: ["Choosing an answer from one keyword only", "Ignoring a security or latency constraint", "Selecting a tool that solves the wrong layer", "Memorizing answer letters instead of decision rules"],
      troubleshooting: ["When two answers seem valid, identify the one that satisfies every stated constraint with least effort.", "When a feature is new, verify current official documentation.", "When performance is poor, map the symptom to storage, compute, orchestration, or capacity before changing anything."],
      examFocus: ["Need → layer → tool → trade-off", "Use all constraints", "Least privilege", "Measure before optimize", "Verify new features"],
      memoryHook: "Read the need, find the layer, choose the tool, defend the trade-off.",
      sources: [
        { title: "Fabric data-store decision guide", url: "https://learn.microsoft.com/en-us/fabric/fundamentals/decision-guide-data-store" },
        { title: "Fabric workload decision guide", url: "https://learn.microsoft.com/en-us/fabric/fundamentals/decision-guide-pipeline-dataflow-spark" }
      ]
    }
  };

  const topicRules = [
    { test: /overview|introduction|what is|why /i, label: "Core concept and purpose", ar: "ركّز في هذا النشاط على تعريف المفهوم، المشكلة التي يحلها، وحدوده. لا تحفظ الاسم فقط؛ اربطه بمتطلب عملي وببديل قد يُخلط معه في الامتحان.", en: "Focus on the purpose, boundary, and decision criteria for this concept." },
    { test: /course|resources|slides|free account|azure fundamental/i, label: "Course setup and prerequisites", ar: "استخدم هذا النشاط لتجهيز بيئة التعلم والملفات المطلوبة. الهدف هو إزالة عوائق التطبيق العملي، وليس حفظ تفاصيل الاشتراك أو واجهة قد تتغير.", en: "Prepare the learning environment and resources; do not memorize transient portal details." },
    { test: /evolution|medallion|delta lake|time travel|parquet/i, label: "Lakehouse architecture and Delta reliability", ar: "اربط تطور المنصات بمشكلة محددة: مرونة الملفات، جودة الجداول، التاريخ والمعاملات. ميّز Parquet كصيغة ملف عن Delta كطبقة table protocol وtransaction log.", en: "Connect architecture evolution to Delta transactions, history, and managed table behavior over Parquet." },
    { test: /hierarchy|tenant|capacity|workspace|portal/i, label: "Fabric hierarchy and administration", ar: "حدد مستوى الإعداد: Tenant أم Capacity أم Workspace أم Item. وضع الإعداد في المستوى الخطأ يؤدي لصلاحيات أو حوسبة لا تطابق المطلوب.", en: "Map each setting to tenant, capacity, workspace, or item scope." },
    { test: /lakehouse|tables|schema|sql endpoint|managed table|external table/i, label: "Lakehouse storage and table surfaces", ar: "حدد هل البيانات Files أم Delta Tables، وهل المطلوب كتابة بـSpark أم قراءة وتحليل عبر SQL analytics endpoint. راجع managed مقابل external lifecycle.", en: "Distinguish Files, Delta Tables, managed/external lifecycle, and Spark versus SQL surfaces." },
    { test: /load data|ingest from|adls|copy into|ctas/i, label: "Data loading pattern", ar: "حدد المصدر والوجهة وحجم البيانات وهل التحميل full أم incremental. اختر طريقة التحميل حسب engine والوجهة، ثم تحقق من schema وrestart behavior.", en: "Choose the loading method from source, destination, volume, and full/incremental requirements." },
    { test: /type cast|replace value|string transform|statistical function|date column|timestamp function|null/i, label: "Data cleansing and type safety", ar: "طبّق النوع الصحيح مبكرًا، وتعامل مع null والقيم غير الصالحة قبل استدعاء الدوال. وثّق هل التغيير تنظيف أم business rule.", en: "Enforce types, handle nulls and invalid values, and separate cleaning from business rules." },
    { test: /diagram view|visual query|data visualization/i, label: "Visual development and validation", ar: "استخدم العرض المرئي لفهم خطوات التحويل أو العلاقات، لكن تحقق من الكود والخطة الناتجة ولا تفترض أن الواجهة تختار دائمًا أفضل تنفيذ.", en: "Use the visual surface to understand and validate, then inspect the generated logic and execution." },
    { test: /pyspark fundamental|intermediate pyspark|spark sql|notebookutils|mssparkutils/i, label: "PySpark engineering patterns", ar: "ركّز على DataFrame transformations، lazy evaluation، واستخدام utilities للتعامل مع الملفات والـnotebooks. اربط كل عملية بأثرها على partitions وshuffle.", en: "Apply DataFrame and utility patterns while reasoning about lazy execution, partitions, and shuffle." },
    { test: /spark job definition|import notebook/i, label: "Reusable Spark workloads", ar: "حوّل الكود من تجربة تفاعلية إلى workload قابل للتشغيل وإعادة النشر. راجع parameters وdependencies وruntime environment ومسار المراقبة.", en: "Package Spark logic as a reusable, parameterized workload with a controlled runtime." },
    { test: /warehouse fundamental|gold .*view|t-sql function|stored procedure|dynamic management|query insights|ssms/i, label: "Warehouse development and operations", ar: "حدد هل المطلوب schema object أم data load أم diagnostic view. استخدم T-SQL لبناء النموذج، وDMVs/Query Insights لمراقبة التنفيذ بدل التخمين.", en: "Separate schema development, data loading, and operational diagnostics in Fabric Warehouse." },
    { test: /semantic model|direct lake/i, label: "Semantic consumption and Direct Lake", ar: "افصل طبقة التخزين عن semantic model. Direct Lake يقرأ بيانات OneLake مع سلوك وأمان يجب التحقق منه، ولا يلغي الحاجة لنموذج جيد وعلاقات صحيحة.", en: "Separate storage from the semantic layer and understand Direct Lake model and security behavior." },
    { test: /lineage|endorsement|sensitivity|gateway|connection/i, label: "Governance, trust, and connectivity", ar: "Lineage يوضح الاعتماديات، Endorsement يوضح الثقة، والGateway/Connection يحل الوصول للمصدر. كل واحد يعالج سؤالًا مختلفًا.", en: "Use lineage for dependencies, endorsement for trust, and connections/gateways for source access." },
    { test: /capacity metrics/i, label: "Capacity observability", ar: "حلل استهلاك CU وthrottling وconcurrency على مستوى Capacity. لا تستخدم Capacity Metrics بدل تفاصيل فشل Activity أو Query.", en: "Use Capacity Metrics for resource pressure and throttling, not item-level error details." },
    { test: /filtering and date|aggregation in kql|kql basic|kql function|base quer/i, label: "KQL query construction", ar: "ابنِ KQL كـpipeline: filter مبكرًا، project المطلوب، ثم summarize أو join. استخدم عمود الوقت الصحيح وbin للحزم الزمنية.", en: "Build KQL as an operator pipeline with early filters, focused projection, and time-aware aggregation." },
    { test: /real-time dashboard/i, label: "Real-time dashboard design", ar: "ابدأ Base Query صحيحة ثم أنشئ tiles تجيب أسئلة تشغيلية محددة. راقب refresh، time range وquery cost.", en: "Design dashboard tiles from validated base queries, time ranges, and operational questions." },
    { test: /azure devops|continuous integration|synchronize stage|end-to-end ci/i, label: "Collaborative CI/CD workflow", ar: "اربط repository وbranch وPR وworkspace sync ثم deployment stages. حدّد نقطة المراجعة ونقطة النشر ولا تخلطهما.", en: "Connect repository, branch review, workspace sync, and deployment stages as separate controls." },
    { test: /m language use|m syntax|let and in|order of execution|custom m/i, label: "M expression model", ar: "اقرأ كل خطوة كـexpression مسماة داخل let، والنتيجة هي ما يرجعه in. تتبع dependencies والنوع في كل خطوة.", en: "Read M as named expressions in let, with in selecting the returned result." },
    { test: /select$|filter$|addcolumn|removecolumn|sorting|aggregation$|each object|list object|record object|table object|text functions|number functions|date functions|list functions|table functions/i, label: "M transformation operation", ar: "حدد نوع القيمة أولًا: scalar أو List أو Record أو Table، ثم استخدم الدالة المناسبة. راقب null وtype واسم العمود.", en: "Identify the M value type first, then apply the matching transformation function safely." },
    { test: /spark streaming structure|stateless|stateful|checkpoint|output mode|process stream/i, label: "Structured Streaming state and recovery", ar: "حدد هل العملية stateful، ثم اختر checkpoint فريد وwatermark وoutput mode متوافقًا مع الـsink والنتائج النهائية.", en: "Reason about state, a unique checkpoint, watermark, output mode, and sink semantics." },
    { test: /mlv|automatic refresh|optimal refresh|build bronze|build silver|build gold|data-quality report/i, label: "Materialized Lake View lifecycle", ar: "حدد dependency والـrefresh strategy وCDF والجودة والlineage. تحقق دائمًا من GA/Preview والlimitations الحالية قبل اعتماد التصميم.", en: "Model MLV dependencies, refresh strategy, CDF, quality, lineage, and current support status." },
    { test: /role|permission|security|rls|cls|mask|access/i, label: "Security and least privilege", ar: "حدّد طبقة الصلاحية المطلوبة: Workspace أم Item أم Data. اختر أقل صلاحية تحقق الهدف وراجع أي مسار وصول بديل.", en: "Select the narrowest effective security layer and verify alternate access paths." },
    { test: /shortcut|onelake|file explorer/i, label: "Zero-copy and OneLake access", ar: "ميّز بين المرجع والنسخ. الـShortcut لا ينقل البيانات، ويتأثر بوجود الهدف وصلاحياته ومصدره.", en: "Distinguish a reference from a copy and validate target access." },
    { test: /mirror/i, label: "Managed replication", ar: "Mirroring يكرر بيانات مصدر مدعوم إلى OneLake بصورة مُدارة وقريبة من الوقت الحقيقي؛ ليس مجرد metadata link.", en: "Mirroring is managed replication for supported sources, not a shortcut." },
    { test: /pool|spark setting|environment|node|executor|driver/i, label: "Spark compute and runtime", ar: "اربط الإعداد بأثره على startup، parallelism، memory وworkload isolation. لا تعتبر زيادة الحجم حلًا تلقائيًا.", en: "Connect compute settings to startup, parallelism, memory, and isolation." },
    { test: /join/i, label: "Join behavior and data movement", ar: "حدّد حجم الطرفين ونوع الـjoin وتأثير shuffle. broadcast مناسب فقط عندما يكون أحد الطرفين صغيرًا بما يكفي.", en: "Evaluate join semantics, table size, shuffle, and possible broadcast." },
    { test: /increment|watermark|merge|change data|cdf/i, label: "Incremental processing", ar: "حدّد boundary واضحًا، اجعل التشغيل idempotent، ولا تعتمد الـwatermark الجديد قبل نجاح الكتابة.", en: "Use reliable boundaries, idempotency, and commit the watermark after success." },
    { test: /monitor|debug|error|failure|diagnos/i, label: "Monitoring and troubleshooting", ar: "ابدأ بالعرض الذي يخص طبقة الخطأ، اقرأ التفاصيل على مستوى activity أو stage أو query، ثم أصلح السبب قبل إعادة التشغيل.", en: "Start with the monitoring surface for the failing layer and inspect detailed diagnostics." },
    { test: /optimi|performance|v-order|vacuum|partition|cache/i, label: "Performance optimization", ar: "التقط baseline، حدّد bottleneck، طبّق تغييرًا واحدًا، ثم قارن تحت ظروف متشابهة. لا تبدأ بزيادة compute.", en: "Measure, isolate the bottleneck, change one factor, and validate comparably." },
    { test: /trigger|schedule|loop|parameter|variable|activity|pipeline/i, label: "Orchestration", ar: "فكر في الاعتماديات، القيم الديناميكية، failure path وrestart behavior. الـPipeline ينسق ولا يستبدل محرك التحويل.", en: "Model dependencies, dynamic values, failures, and restart behavior." },
    { test: /kql|eventhouse|eventstream|real-time|window|activator/i, label: "Real-time analytics", ar: "حدّد هل المطلوب ingestion أو transform أو store/query أو action. اختر Eventstream للحركة، Eventhouse/KQL للتحليل وActivator للاستجابة.", en: "Separate ingestion/routing, storage/query, and action responsibilities." },
    { test: /git|branch|pull request|deploy|ci\/cd/i, label: "Lifecycle management", ar: "افصل source control عن deployment. استخدم branch وPR للمراجعة ثم Deployment pipeline لترقية العناصر المدعومة.", en: "Separate source control and review from environment promotion." },
    { test: /scd|surrogate|fact|dimension|star schema|grain/i, label: "Dimensional modeling", ar: "ابدأ بتحديد grain، ثم المفاتيح والـdimensions. اختر SCD Type 1 أو 2 حسب الحاجة إلى التاريخ.", en: "Declare grain first, then keys, dimensions, and the required history behavior." },
    { test: /quiz|knowledge test|readiness|exam/i, label: "Knowledge check", ar: "أجب من فهمك أولًا، ثم اشرح لماذا الخيارات الأخرى لا تحقق المتطلبات. سجّل سبب الخطأ وليس حرف الإجابة.", en: "Answer from reasoning, eliminate wrong layers, and record the knowledge gap." },
    { test: /project|capstone/i, label: "Hands-on project", ar: "نفّذ artifact قابلًا للتحقق: كود أو Pipeline أو diagram أو run history. وثّق expected output وfailure case وtrade-off.", en: "Produce verifiable evidence, expected output, a failure case, and a trade-off." }
  ];

  const codeByKeyword = [
    { test: /select|filter|addcolumn|removecolumn|type casting|sorting|aggregation|each|list|record|table|text function|number function|date function|custom m/i, module: "m-language" },
    { test: /kql|eventhouse|dashboard|materialized view/i, module: "realtime-kql" },
    { test: /spark|pyspark|notebook|dataframe|timestamp|managed table/i, module: "spark-pyspark" },
    { test: /warehouse|t-sql|fact|dimension|scd|surrogate|copy into|ctas|stored procedure|view/i, module: "warehouse-tsql" },
    { test: /streaming|checkpoint|output mode|stateful|stateless/i, module: "structured-streaming" },
    { test: /mlv|materialized lake/i, module: "materialized-lake-views" },
    { test: /pipeline|copy activity|parameter|variable|metadata|filter activity|trigger/i, module: "data-factory" }
  ];

  function parseActivity(entry) {
    const separator = entry.lastIndexOf("|");
    return separator === -1 ? { title: entry, duration: "" } : { title: entry.slice(0, separator), duration: entry.slice(separator + 1) };
  }

  function clone(value) {
    return value == null ? value : JSON.parse(JSON.stringify(value));
  }

  function selectTopic(title) {
    return topicRules.find(rule => rule.test.test(title)) || {
      label: "Applied lesson focus",
      ar: "اربط عنوان النشاط بالنموذج العام للوحدة، وحدد ما الذي سيتغير في قرارك أو تنفيذك بعد فهم هذه النقطة.",
      en: "Connect this activity to the module model and identify the decision it changes."
    };
  }

  function selectCode(title, moduleId, fallbackCode) {
    const override = codeByKeyword.find(rule => rule.test.test(title));
    const source = override ? moduleGuides[override.module] : moduleGuides[moduleId];
    return clone(source?.code || fallbackCode || null);
  }

  function getLesson(moduleId, activityIndex) {
    const course = window.DP700_COURSE || { modules: [] };
    const module = course.modules.find(item => item.id === moduleId);
    const index = Number(activityIndex);
    if (!module || !Number.isInteger(index) || index < 0 || index >= module.lectures.length) return null;

    const activity = parseActivity(module.lectures[index]);
    const guide = moduleGuides[moduleId] || moduleGuides.capstone;
    const topic = selectTopic(activity.title);
    const isQuiz = activity.duration === "quiz";
    const isProject = activity.duration === "project";
    const readingMinutes = /^\d+:\d+$/.test(activity.duration) ? Math.max(8, Math.ceil(Number(activity.duration.split(":")[0]) * 1.5)) : isQuiz ? 12 : isProject ? 45 : 15;
    const allSources = [...commonSources, ...(guide.sources || [])].filter((source, sourceIndex, list) => list.findIndex(item => item.url === source.url) === sourceIndex);

    return {
      id: `${moduleId}-${index}`,
      moduleId,
      moduleNumber: module.number,
      activityIndex: index,
      title: activity.title,
      duration: activity.duration,
      type: isQuiz ? "Knowledge Check" : isProject ? "Hands-on Project" : "Study Lesson",
      domain: module.domain,
      level: module.level,
      readingMinutes,
      labMinutes: isProject ? 60 : guide.practice.length * 8,
      whyAr: guide.whyAr,
      focusLabel: topic.label,
      focusAr: topic.ar,
      focusEn: topic.en,
      objectives: [
        `Explain ${activity.title} in the context of ${module.title}.`,
        module.outcomes[0],
        module.outcomes[1] || "Apply the concept in a Microsoft Fabric scenario.",
        `Recognize the DP-700 decision pattern related to ${activity.title}.`
      ],
      arabicParagraphs: clone(guide.arParagraphs),
      englishSummary: `${guide.englishSummary} Activity focus: ${topic.en}`,
      concepts: clone(guide.concepts),
      visualSteps: clone(module.conceptMap),
      decisionTable: clone(guide.decisionTable),
      code: selectCode(activity.title, moduleId, guide.code),
      practice: [
        `Open Microsoft Fabric and locate the item or setting related to “${activity.title}”.`,
        ...clone(guide.practice).slice(0, 4)
      ],
      expectedOutput: guide.expectedOutput,
      mistakes: clone(guide.mistakes),
      troubleshooting: clone(guide.troubleshooting),
      examFocus: [...clone(guide.examFocus), ...module.examPatterns.slice(0, 2)],
      memoryHook: guide.memoryHook,
      sources: allSources,
      relatedQuestionIds: clone(module.questionIds || []),
      relatedVisualLessonIds: clone(module.visualLessonIds || []),
      lastValidated: "2026-07-21"
    };
  }

  function getAllLessons() {
    const course = window.DP700_COURSE || { modules: [] };
    return course.modules.flatMap(module => module.lectures.map((_, index) => getLesson(module.id, index))).filter(Boolean);
  }

  return {
    version: "9.0.0",
    generatedLessonCount: 213,
    moduleGuides,
    getLesson,
    getAllLessons
  };
})();
