# مراجعة السؤالين غير المحسومين في تفاعلات DP-700

## النتيجة التنفيذية

بعد قراءة صور الـexhibit كاملة، تبيّن أن السؤالين DP-700N1 Q89 وDP-700N3 Q86 قابلان للحسم، وليس من المهني إبقاؤهما في حالة `unscored`. كلاهما يعرض نفس سيناريو تعيين أداة Microsoft Fabric المناسبة لكل Dataset/Team.

| المصدر | Dataset1 | Dataset2 | Dataset3 | الحالة |
|---|---|---|---|---|
| DP-700N1 Q89 | Dataflow Gen2 dataflow | Notebooks | Data pipelines | تم الحسم |
| DP-700N3 Q86 | Dataflow Gen2 dataflow | Notebooks | Data pipelines | تم الحسم |

## أساس التحقق

توضح صفحة [Microsoft Fabric decision guide](https://learn.microsoft.com/en-us/fabric/fundamentals/decision-guide-pipeline-dataflow-spark) أن **Dataflow Gen2** مناسب لإدخال البيانات وتحويلها وتهيئتها عبر واجهة منخفضة/عديمة الكود، وأن **Pipeline copy activity** مناسب لحركة البيانات والتنسيق، بينما يُستخدم **Spark** عندما تكون هناك حاجة لمعالجة تعتمد على الكود.

وتؤكد صفحة [What is Dataflow Gen2?](https://learn.microsoft.com/en-us/fabric/data-factory/dataflows-gen2-overview) أن Dataflow Gen2 يستخدم تجربة Power Query، ويوفر أكثر من 300 تحويل، ويستهدف إعداد البيانات وتحويلها دون كتابة كود. لذلك يطابق Dataset1/Team1 الذي يطلب نهجًا منخفض الكود لتحويل البيانات.

وتوضح صفحة [Develop, execute, and manage Microsoft Fabric notebooks](https://learn.microsoft.com/en-us/fabric/data-engineering/author-execute-notebook) أن Notebook هو عنصر كود أساسي لتطوير وتشغيل Apache Spark، وهو المطابقة الصحيحة لسيناريو Dataset2/Team2 المعتمد على تنفيذ كود أو Spark.

أما Dataset3/Team3 فالمطلوب له هو **Data pipelines** كما يظهر صراحة في الـexhibit. الـpipeline هو عنصر التنسيق الذي يجمع أنشطة نقل البيانات والتحويل وتشغيل الـnotebook والجدولة، وليس Notebook بديلًا عن pipeline.

## التصحيح المطبق

تم تحديث `data/uploaded-interactions.js` للسجلين `1089` و`3086`، واستبدال mapping السابق غير الدقيق في Dataset3 من `Notebook (corrected; not listed in source)` إلى `Data pipelines`. كما تم توحيد نصوص الخيارات لتطابق الـexhibit: `Data pipelines`، `Notebooks`، `Dataflow Gen2 dataflow`، وإزالة حالة `unscored`.

## الرسم الإحصائي

يظهر الملف `assets/media/dp700_interaction_distribution.png` توزيع 53 تفاعلًا مركبًا في جرد الأسئلة:

| المصدر | Drag & Drop | Hotspot / Dropdown | Yes/No Hotspot | الإجمالي |
|---|---:|---:|---:|---:|
| DP-700N1 | 8 | 14 | 3 | 25 |
| DP-700N2 | 2 | 3 | 1 | 6 |
| DP-700N3 | 6 | 13 | 3 | 22 |
| **الإجمالي** | **16** | **30** | **7** | **53** |

> ملاحظة: عدد `Hotspot / Dropdown` هنا يعكس نوع dropdown التفاعلي في inventory، بينما `Yes/No Hotspot` فئة منفصلة لأن المحرك يعالجها بعناصر Yes/No.
