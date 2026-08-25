## الفحص البصري الأولي

- **Q1004 / DP-700N1 Q4:** الصورة تعرض صراحة `Answer(s): A, D`. الإجابتان هما تفعيل مزامنة عناصر Workspace مع Git repositories من Tenant settings، وتعيين WorkspaceA إلى Cap1. المفتاح الحالي كان A فقط.
- **Q1010 / DP-700N1 Q10:** الصورة تعرض سؤال DimProduct وتطلب ثلاثة أعمدة. الأعمدة الصحيحة هي ProductName (B)، ProductColor (C)، وProductID (F). المفتاح الحالي كان B فقط. Date وTransactionID وSalesAmount تخص FactSales أو ليست سمات DimProduct المطلوبة.
- **Q1012 / DP-700N1 Q12:** الصورة تعرض صراحة `Answer(s): D, E, F`. المفتاح الحالي كان D فقط. الإجابات الثلاث هي Contributor في Workspace1، نقل Employee إلى Lakehouse2، وإنشاء Workspace2 مع Lakehouse2.
- **Q1050 / DP-700N1 Q50:** الصورة تعرض السيناريو كاملًا: تشغيل يومي 07:00 UTC، إعادة Notebook مرتين عند الفشل، وتحديث Model1 بعد نجاح Notebook. الإجابات الصحيحة هي A وB وC؛ الصورة تؤكد أن A يربط Refresh بعد Notebook بـOn success، وB يضبط منطقة Pipeline إلى UTC، وC يضبط Retry للـNotebook إلى 2. المفتاح الحالي كان A فقط.
- **Q1053 / DP-700N1 Q53:** الصورة الأولى تعرض Answer(s): D فقط ضمن مادة الشرح القديمة، بينما نص السؤال يطلب إجابتين ويعرض ترتيب Notebook_03 ثم Notebook_01 ثم Notebook_02. الصورة الثانية شبه فارغة ولا تحتوي تفاصيل قابلة للقراءة؛ لذلك يلزم تصحيح مستقل من كود DAG/النص الأصلي، وعدم اعتماد Answer(s): D الأحادي كما هو.
- **Q1061 / DP-700N1 Q61:** الصورة تعرض متطلبات صور أغلفة الكتب، لكن صفحة الإجابة ليست ضمن asset هذا السؤال وحده. يتطلب التحقق ربطه بصفحة Q62 التالية.
- **Q1062 / DP-700N1 Q62:** الصورة تعرض صراحة `Answer(s): C, E`، وتذكر أن الحل هو `a streaming dataflow` و`a blob storage action`. لذلك المفتاح الصحيح هو C,E، وليس C فقط. التبرير: streaming dataflow للمعالجة شبه الفورية، وblob storage action للتعامل مع ملفات الصور عند وصولها.
- **Q1069 / DP-700N1 Q69:** الصورة تعرض `Answer(s): A, B` بوضوح، مع شرح أن MAR1 لديه سبعة endpoints، لذلك يلزم ForEach وCopy data. المفتاح الحالي كان A فقط.
- **Q1080 / DP-700N1 Q80-A:** الصورة تعرض بداية سيناريو Table1/Table2 وUpdate Policy، ولا تعرض الاختيارات المصورة بعد. لا يمكن اعتماد B,D من هذه الصفحة وحدها قبل فحص B وD.
