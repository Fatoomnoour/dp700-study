window.DP700_ARABIC_LESSONS = {
  resources: {
    official: [
      { title: "دليل DP-700 الرسمي بالعربي", url: "https://learn.microsoft.com/ar-sa/credentials/certifications/resources/study-guides/dp-700" },
      { title: "دورة DP-700 الرسمية", url: "https://learn.microsoft.com/ar-sa/training/courses/dp-700t00" },
      { title: "صفحة شهادة Fabric Data Engineer", url: "https://learn.microsoft.com/ar-sa/credentials/certifications/fabric-data-engineer-associate/" },
      { title: "مستندات Microsoft Fabric", url: "https://learn.microsoft.com/ar-sa/fabric/" }
    ],
    videos: [
      { title: "التحضير لامتحان DP-700 بالعربي", url: "https://www.youtube.com/watch?v=qXDJub182BE" },
      { title: "Eventstream وEventhouse بالعربي", url: "https://www.youtube.com/watch?v=8lXuQmoiMYo" },
      { title: "Medallion Architecture في Fabric", url: "https://www.youtube.com/watch?v=-iO6oguFufQ" },
      { title: "PySpark وSQL وSpark Pools بالعربي", url: "https://www.youtube.com/watch?v=sM3nghHWAyY" }
    ]
  },
  lessons: {
    "fabric-map": {
      title: "الصورة الكبيرة ببساطة",
      summary: "اعتبري Microsoft Fabric مدينة واحدة للبيانات. OneLake هو الأرض المشتركة، وWorkspace هو الحي الذي يجمع الفريق والعناصر، وكل Experience متخصص في وظيفة داخل رحلة البيانات.",
      memoryHook: "مدينة واحدة: OneLake أرضها، Workspaces أحياؤها، وExperiences مبانيها المتخصصة.",
      points: [
        "Data Factory يحرك البيانات، وData Engineering يعالجها، وWarehouse يخدم تحليلات SQL.",
        "Real-Time Intelligence يتعامل مع الأحداث والبيانات التي تصل باستمرار.",
        "الأدوات ليست جزرًا منفصلة؛ أغلبها يعمل فوق OneLake وداخل Workspaces."
      ],
      trap: "لا تختاري أداة لمجرد أن اسمها مألوف. حددي أولًا أين أنتِ في رحلة البيانات: ingest أو store أو transform أو serve أو operate."
    },
    "workspace-settings": {
      title: "أربع غرف تحكم",
      summary: "إعدادات Workspace تحدد كيف تعمل العناصر الموجودة بداخله. Spark يتحكم في بيئة الحوسبة، Domain ينظم الملكية التجارية، OneLake يحدد سلوك الوصول للبيانات، وAirflow يشغل DAGs.",
      memoryHook: "S-D-O-A: Spark، Domain، OneLake، Airflow.",
      points: [
        "Spark settings تشمل pools وruntime وEnvironment وسلوك الموارد.",
        "Domain يجمع Workspaces حسب الإدارة أو المجال التجاري، وليس حسب صلاحية المستخدم.",
        "Airflow مناسب لتنفيذ DAG-based orchestration داخل Fabric."
      ],
      trap: "Domain ليس Workspace role، وSpark pool ليس طبقة Security."
    },
    "cicd-lifecycle": {
      title: "كل أداة لها وظيفة مختلفة",
      summary: "Git يحفظ تاريخ التغييرات ويسمح بالمراجعة والفروع. Database project يعرّف عناصر SQL ككود. Deployment pipeline ينقل العناصر المدعومة من Development إلى Test ثم Production.",
      memoryHook: "Git remembers. Database project defines. Deployment pipeline moves.",
      points: [
        "استخدمي Git للنسخ والمراجعة والتعاون على العناصر المدعومة.",
        "Database project يصف Schema ويمكن تحويله إلى artifact قابل للنشر.",
        "استخدمي parameters وdeployment rules بدل كتابة قيم كل بيئة داخل الكود."
      ],
      trap: "Git commit لا يعني أن التغيير وصل إلى Production، وGit branch ليس Deployment stage."
    },
    "security-layers": {
      title: "الأمان طبقات وليس زرًا واحدًا",
      summary: "ابدئي بمن يدخل Workspace، ثم من يفتح Item، ثم أي Rows أو Columns أو Objects يستطيع قراءتها. بعد ذلك أضيفي Classification وTrust وAudit حسب المطلوب.",
      memoryHook: "Door → Room → Row → Column → Display، ثم Label → Trust → Audit.",
      points: [
        "Workspace roles تعطي وصولًا واسعًا، بينما Item permissions يمكن أن تشارك عنصرًا واحدًا فقط.",
        "RLS يفلتر Rows، وCLS يمنع Columns، وDynamic data masking يغير شكل العرض فقط.",
        "Sensitivity label للتصنيف والحماية، Endorsement للثقة، وAudit لمعرفة من فعل ماذا ومتى."
      ],
      trap: "Certified لا يحمي البيانات، وMasking ليس بديلًا عن Permissions، وأي مسار وصول آخر يجب مراجعته."
    },
    "orchestration": {
      title: "اختاري قائد العملية ثم أداة التنفيذ",
      summary: "Pipeline هو قائد الأوركسترا: يرتب Activities وDependencies وTriggers. Dataflow Gen2 مناسب للتحويل المرئي، وNotebook مناسب لـSpark والكود المخصص.",
      memoryHook: "Pipeline هو المايسترو؛ Dataflow وNotebook هما العازفون.",
      points: [
        "Pipeline ينسق خطوات متعددة ويراقب تشغيلها واعتماد كل خطوة على الأخرى.",
        "Dataflow Gen2 يستخدم Power Query للتحويلات قليلة الكود.",
        "Parameters وdynamic expressions تجعل نفس التصميم يعمل في أكثر من بيئة أو سيناريو."
      ],
      trap: "لا تستخدمي Notebook لمجرد أنه قوي إذا كان المطلوب مجرد orchestration أو visual transformation بسيط."
    },
    "loading-patterns": {
      title: "كيف تدخل البيانات؟",
      summary: "Full load يعيد تحميل كل البيانات، Incremental load يجلب التغييرات فقط، Dimensional load يبني Facts وDimensions، وStreaming load يعالج الأحداث المستمرة.",
      memoryHook: "Snapshot للكل، Watermark للتغييرات، Stream للأحداث.",
      points: [
        "في Incremental load خزني old watermark واقرئي new watermark قبل النسخ.",
        "نطاق شائع وآمن هو أكبر من W_old وأقل من أو يساوي W_new.",
        "حدّثي watermark المخزن فقط بعد نجاح عملية النسخ."
      ],
      trap: "تحديث watermark قبل نجاح Copy قد يفقد بيانات، واستخدام حدود inclusive من الجانبين قد يكرر Rows."
    },
    "batch-tool-choice": {
      title: "اختاري المحرك من طبيعة الشغل",
      summary: "Dataflow Gen2 للتحويل المرئي، Notebook وPySpark للحجم الكبير والمنطق المخصص، T-SQL للبيانات العلائقية، وKQL للأحداث وTime-series.",
      memoryHook: "SQL للبنية، Spark للحجم، Power Query للمرئي، KQL للأحداث السريعة.",
      points: [
        "ابدئي بنوع البيانات واللغة والـlatency والـdestination قبل اختيار الأداة.",
        "Warehouse مناسب لنماذج SQL العلائقية، وLakehouse مناسب لـSpark والملفات وDelta.",
        "Eventhouse وKQL مناسبون للاستكشاف السريع للـtelemetry والـlogs."
      ],
      trap: "وجود أكثر من أداة قادرة على تنفيذ المهمة لا يعني أنها متساوية في سهولة الإدارة أو الأداء أو التكلفة."
    },
    "shortcuts-mirroring": {
      title: "هل نُشير للبيانات أم ننسخها؟",
      summary: "OneLake shortcut يشير إلى بيانات موجودة في مكان آخر بدون نسخها. Mirroring يكرر قاعدة بيانات مدعومة إلى OneLake ويحافظ على التحديث بصورة managed وقريبة من real time.",
      memoryHook: "Shortcut points. Mirror copies and keeps up.",
      points: [
        "حذف Shortcut لا يحذف البيانات الأصلية التي يشير إليها.",
        "Mirroring مناسب عندما تحتاجين نسخة تحليلية managed من مصدر مدعوم.",
        "عند تعطل Shortcut افحصي target path والاسم والـcredentials والـpermissions."
      ],
      trap: "Shortcut ليس Copy، وMirroring ليس مجرد Metadata reference."
    },
    "lakehouse-delta": {
      title: "البيانات تصبح أنظف على مراحل",
      summary: "Bronze يحفظ البيانات الخام كما وصلت، Silver ينظفها ويوحدها ويزيل التكرار، وGold يقدم بيانات جاهزة للتقارير والتحليل. Delta يضيف Transactions وHistory فوق ملفات Parquet.",
      memoryHook: "Bronze keeps. Silver cleans. Gold serves.",
      points: [
        "احتفظي بالـpayload الأصلي في Bronze حتى يمكن إعادة المعالجة أو Replay.",
        "استخدمي Silver للتنظيف والتحقق وتوحيد الأنواع وإزالة Duplicates.",
        "MERGE يعمل Upsert، وOPTIMIZE يضغط Small files، وVACUUM يحذف الملفات القديمة."
      ],
      trap: "VACUUM قد يحذف ملفات مطلوبة لـTime travel؛ اختاري Retention بعناية."
    },
    "warehouse-modeling": {
      title: "ابدئي من Grain",
      summary: "Fact table يحتوي القياسات عند مستوى تفصيل محدد يسمى Grain. Dimensions تصف من وماذا ومتى وأين، وSurrogate keys تحمي النموذج من تغير مفاتيح المصادر.",
      memoryHook: "Facts هي الأرقام، وDimensions تحكي قصتها.",
      points: [
        "حددي ماذا يمثل Row واحد في Fact table قبل إنشاء Measures أو Relationships.",
        "SCD Type 1 يستبدل القيمة القديمة، وType 2 يضيف Version جديدًا ويحفظ التاريخ.",
        "Warehouse مناسب عندما تكون T-SQL وStar schema في قلب الحل."
      ],
      trap: "الجدول الكبير ليس Fact table تلقائيًا؛ يجب أن يكون له Grain واضح وأحداث قابلة للقياس."
    },
    "pyspark-engineering": {
      title: "وزعي العمل قبل زيادة القوة",
      summary: "Spark يقسم البيانات إلى Partitions ويشغل Tasks بالتوازي. الأداء السيئ غالبًا يأتي من Shuffle كبير أو Skew أو Partition ضخمة، وليس فقط من نقص Compute.",
      memoryHook: "Partition first, then power.",
      points: [
        "Task واحدة بطيئة جدًا مقارنة بالباقي علامة شائعة على Data skew.",
        "Executor OOM قد ينتج من Partition ضخمة، وDriver OOM قد ينتج من collect().",
        "Cache فقط DataFrames التي ستُستخدم عدة مرات، ثم استخدمي unpersist."
      ],
      trap: "إضافة Executors أو Memory لا تعالج مفتاحًا skewed أو collect() يعيد ملايين الصفوف إلى Driver."
    },
    "realtime-map": {
      title: "خريطة Real-Time Intelligence",
      summary: "Eventstream يستقبل الأحداث ويحوّلها ويوجهها. Eventhouse يحتوي KQL Databases لتخزين وتحليل Time-series، وKQL يستعلم ويجمع ويكتشف الأنماط بسرعة.",
      memoryHook: "Eventstream moves. Eventhouse stores. KQL asks.",
      points: [
        "استخدمي Filter وManage fields وExpand وAggregate وJoin حسب المطلوب.",
        "Native Eventhouse tables مناسبة للبيانات التي تدخل مباشرة وبحجم كبير.",
        "Retention يحدد مدة الاحتفاظ، بينما Cache يحدد الجزء الساخن سريع القراءة."
      ],
      trap: "Retention وCache ليسا نفس الإعداد: الأول للتاريخ والثاني لسرعة الوصول."
    },
    "streaming-windows": {
      title: "ثلاثة أسئلة لأي Stream",
      summary: "متى حدثت الواقعة؟ كم يمكن أن تتأخر؟ وكيف يستعيد النظام حالته بعد الفشل؟ Event time وWatermark وCheckpoint وWindow يجيبون عن هذه الأسئلة.",
      memoryHook: "Checkpoint remembers. Watermark decides lateness. Window groups time.",
      points: [
        "Checkpoint يحفظ Offsets وCommits وState ليستطيع Query الاستكمال بعد الفشل.",
        "Watermark يحد مدة انتظار الأحداث المتأخرة وحجم State المحتفظ به.",
        "Tumbling لا يتداخل، Hopping قد يتداخل، وSession ينتهي بعد Inactivity gap."
      ],
      trap: "السماح بتأخير أكبر قد يزيد اكتمال النتائج، لكنه يحتفظ بـState أكثر ويؤخر النتيجة النهائية."
    },
    "monitoring-map": {
      title: "انزلي من العام إلى السبب",
      summary: "ابدئي من Monitoring hub لمعرفة أي Run فشل، ثم افتحي Run details وحددي Activity الفاشلة، وبعدها اقرئي Logs وMetrics قبل تغيير التصميم أو إعادة التشغيل.",
      memoryHook: "Hub → Run → Activity → Logs.",
      points: [
        "Monitoring hub يعطي نظرة مركزية على عمليات التشغيل في Fabric.",
        "Pipeline run details يعرض Activity الفاشلة ورسالة الخطأ.",
        "Dataflow Gen2 وSpark UI يقدمان تفاصيل مختلفة حسب نوع الـworkload."
      ],
      trap: "إعادة التشغيل فورًا بدون قراءة تفاصيل الفشل قد تخفي النمط وتهدر Capacity."
    },
    "troubleshooting": {
      title: "حددي الطبقة أولًا",
      summary: "أي خطأ ينتمي غالبًا إلى طبقة: Connection أو Permission أو Orchestration أو Transformation أو Storage أو Query أو Capacity. بعد تحديد الطبقة اختاري Log أو Tool المناسب.",
      memoryHook: "Find the layer before fixing the error.",
      points: [
        "Pipeline errors قد تكون Connector أو Expression أو Parameter أو Timeout.",
        "Notebook errors قد تكون Code أو Library أو Spark resources أو Permissions.",
        "Shortcut errors غالبًا target تغير أو Credentials أو Permissions أو path غير مدعوم."
      ],
      trap: "زيادة Compute ليست علاجًا عامًا لكل Error؛ قد يكون السبب Permission أو Schema أو Path."
    },
    "spark-optimization": {
      title: "الإشارة تقود إلى السبب",
      summary: "استخدمي Spark UI لمشاهدة Stages وTasks وShuffle والذاكرة. Task واحدة متأخرة تشير إلى Skew، وExecutor OOM يشير غالبًا إلى Partition كبيرة، وDriver OOM قد يشير إلى collect().",
      memoryHook: "Slow task → skew. Executor OOM → partition. Driver OOM → collect().",
      points: [
        "افحصي أحجام Partitions وتوزيع Keys قبل زيادة الموارد.",
        "repartition يسبب Shuffle لكنه قد يعيد توزيع البيانات بصورة أفضل.",
        "Resource profiles تضبط Compute حسب الـworkload لكنها لا تصلح Data design سيئًا."
      ],
      trap: "تكبير Executor قد يرفع التكلفة بدون إزالة Skew أو تقليل Shuffle."
    },
    "lakehouse-optimization": {
      title: "ثلاثة أفعال للصيانة",
      summary: "OPTIMIZE يجمع Small files النشطة، VACUUM يحذف الملفات القديمة بعد Retention، وV-Order يرتب البيانات لتحسين القراءة في Fabric مقابل تكلفة إضافية أثناء الكتابة.",
      memoryHook: "OPTIMIZE packs. VACUUM removes. V-Order arranges.",
      points: [
        "الكتابات الصغيرة المتكررة تنشئ Small files وتزيد تكلفة القراءة والـmetadata.",
        "OPTIMIZE يعيد تنظيم الملفات النشطة ولا يحذف History وحده.",
        "V-Order مفيد للقراءة لكنه قد لا يناسب workload شديد الكتابة."
      ],
      trap: "OPTIMIZE وVACUUM ليسا مترادفين: الأول يعيد التنظيم، والثاني يحذف ملفات obsolete."
    },
    "warehouse-pipeline-opt": {
      title: "قللي العمل قبل زيادة الموارد",
      summary: "اقرئي Rows وColumns أقل، حافظي على Statistics مفيدة، اجمعي Small writes في Batches، واستخدمي Parallelism آمن. بعد تحسين التصميم فقط فكري في Scaling.",
      memoryHook: "Estimate well, read less, write in batches.",
      points: [
        "Statistics تساعد Optimizer على تقدير Cardinality واختيار Plan أفضل.",
        "استخدمي Filters مبكرًا واختاري Columns المطلوبة فقط.",
        "COPY INTO أو Bulk patterns أفضل من عدد كبير من Small inserts."
      ],
      trap: "سرعة التشغيل الثاني قد تكون بسبب Warm cache، وليس لأن Query أصبحت أفضل."
    },
    "exam-strategy": {
      title: "حوّلي السؤال إلى قرار هندسي",
      summary: "قبل النظر إلى أسماء المنتجات، استخرجي المطلوب: نوع الـworkload، والـlatency، واللغة، ومكان التخزين، وحدود الأمان، وكيفية التشغيل والمراقبة.",
      memoryHook: "Need → layer → tool → trade-off.",
      points: [
        "حددي هل السيناريو Batch أو Streaming، وهل اللغة SQL أو PySpark أو KQL.",
        "استبعدي الخيارات التي تحل طبقة مختلفة عن المشكلة المطلوبة.",
        "إذا اختلف Video أو Dump مع Microsoft Learn الحالي، اعتمدي التوثيق الرسمي."
      ],
      trap: "لا تحفظي حروف الإجابات ولا تختاري أطول Option؛ افهمي السبب والـtrade-off."
    }
  }
};
