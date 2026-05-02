document.addEventListener('DOMContentLoaded', () => {

    // ── XSS-safe HTML Escape Helper ────────────────────────
    function escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // ── DATA DEFINITIONS (MOVED TO TOP TO PREVENT REFERENCE ERRORS) ──
    const projects = [
        {
            id: 1,
            title_en: "Sales Report Years All",
            title_ar: "تقرير المبيعات السنوي",
            category: "Data Visualization & Dashboard",
            desc_en: "Multi-year sales dashboard featuring trend analysis and interactive KPI tracking.",
            desc_ar: "لوحة تحكم للمبيعات تشمل تحليل الاتجاهات وتتبع مؤشرات الأداء.",
            details_en: "A comprehensive multi-year sales performance dashboard built with Power BI. It includes decomposition trees for root cause analysis and dynamic forecasting.",
            details_ar: "لوحة تحكم شاملة لأداء المبيعات لعدة سنوات تم بناؤها باستخدام Power BI. تتضمن أشجار التفكيك لتحليل الأسباب الجذرية والتنبؤ الديناميكي.",
            enhancements_en: "Add predictive modeling for future sales trends and real-time data streaming.",
            enhancements_ar: "إضافة نمذجة تنبؤية لاتجاهات المبيعات المستقبلية وتدفق البيانات في الوقت الفعلي.",
            thumbnail: "sales-dashboard.webp",
            videoSrc: null,
            githubLink: "https://github.com/mohamedsalahabdelhamid/Sales-Report-Years"
        },
        {
            id: 4,
            title_en: "Pizza Sales Dashboard",
            title_ar: "أداء مبيعات البيتزا",
            category: "Data Visualization & Dashboard",
            desc_en: "BI dashboard analyzing sales metrics, revenue patterns, and efficiency.",
            desc_ar: "لوحة ذكاء أعمال لتحليل المبيعات، الإيرادات، وكفاءة العمليات.",
            details_en: "Analyzing operational efficiency and revenue drivers for a pizza retail chain. Includes peak hour analysis and ingredient cost optimization metrics.",
            details_ar: "تحليل كفاءة العمليات ومحركات الإيرادات لسلسلة متاجر بيتزا. يتضمن تحليل ساعات الذروة ومقاييس تحسين تكلفة المكونات.",
            enhancements_en: "Implement inventory tracking integration and delivery route optimization analysis.",
            enhancements_ar: "تنفيذ تكامل تتبع المخزون وتحليل تحسين مسار التوصيل.",
            thumbnail: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1000",
            videoSrc: null,
            githubLink: "https://github.com/mohamedsalahabdelhamid/Pizza-Sales-Dashboard"
        },
        {
            id: 2,
            title_en: "Superstore Performance Analysis",
            title_ar: "تحليل أداء المتجر",
            category: "Data Analysis",
            desc_en: "Performance analysis of retail data identifying profitability drivers by region.",
            desc_ar: "تحليل أداء بيانات التجزئة وتحديد محركات الربحية حسب المنطقة.",
            details_en: "Detailed EDA on Kaggle Superstore dataset to identify loss-making categories and regions. Used Python for data cleaning and Tableau for final visualization.",
            details_ar: "تحليل استكشافي مفصل لمجموعة بيانات Superstore من Kaggle لتحديد الفئات والمناطق الخاسرة. تم استخدام بايثون لتنظيف البيانات وTableau للتصور النهائي.",
            enhancements_en: "Automate report generation using Python scripts and integrate customer sentiment analysis.",
            enhancements_ar: "أتمتة إنشاء التقارير باستخدام سكربتات بايثون ودمج تحليل مشاعر العملاء.",
            thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000",
            videoSrc: null,
            githubLink: "https://github.com/mohamedsalahabdelhamid/Superstore-Performance-View"
        },
        {
            id: 3,
            title_en: "Laptop Market Trends",
            title_ar: "اتجاهات سوق الحواسيب",
            category: "Data Analysis",
            desc_en: "Market analysis comparing hardware specs, pricing, and brand positioning.",
            desc_ar: "تحليل السوق لمقارنة المواصفات، استراتيجيات التسعير، ومكانة العلامات.",
            details_en: "Comparative study of global laptop market trends. Analyzes the correlation between RAM/Storage specs and market price points.",
            details_ar: "دراسة مقارنة لاتجاهات سوق الحواسيب المحمولة العالمية. يحلل الارتباط بين مواصفات الرام/التخزين ونقاط أسعار السوق.",
            enhancements_en: "Implement a price prediction tool based on hardware specifications.",
            enhancements_ar: "تنفيذ أداة للتنبؤ بالأسعار بناءً على مواصفات العتاد.",
            thumbnail: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1000",
            videoSrc: null,
            githubLink: "https://github.com/mohamedsalahabdelhamid/Laptop-Market-Analysis-Dashboard"
        },
        {
            id: 7,
            title_en: "Telecom Churn EDA",
            title_ar: "تحليل تراجع العملاء",
            category: "Exploratory Data Analysis",
            desc_en: "Extensive EDA on telecom data identifying factors contributing to churn.",
            desc_ar: "تحليل استكشافي لبيانات الاتصالات لتحديد عوامل ترك العملاء.",
            details_en: "Identification of key churn drivers in the telecom industry using statistical testing and feature importance analysis.",
            details_ar: "تحديد الدوافع الرئيسية لتراجع العملاء في صناعة الاتصالات باستخدام الاختبارات الإحصائية وتحليل أهمية الميزات.",
            enhancements_en: "Build a full predictive pipeline using XGBoost and deploy as a web app.",
            enhancements_ar: "بناء مسار تنبؤي كامل باستخدام XGBoost ونشره كتطبيق ويب.",
            thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1000",
            videoSrc: null,
            githubLink: "https://github.com/mohamedsalahabdelhamid/EDA-Telecom-Churn-Prediction"
        },
        {
            id: 8,
            title_en: "Road Accident Analysis",
            title_ar: "تحليل حوادث الطرق",
            category: "Exploratory Data Analysis",
            desc_en: "Comprehensive EDA on road accident data to identify patterns and safety insights.",
            desc_ar: "تحليل استكشافي شامل لبيانات حوادث الطرق لتحديد الأنماط ورؤى السلامة.",
            details_en: "In-depth analysis of traffic accident datasets, focusing on weather conditions, road types, and time-based patterns to improve urban safety planning.",
            details_ar: "تحليل عميق لمجموعات بيانات حوادث المرور، مع التركيز على الظروف الجوية، أنواع الطرق، والأنماط الزمنية لتحسين التخطيط للسلامة الحضرية.",
            enhancements_en: "Integrate Real-time alerting for high-risk zones and ML-based severity prediction.",
            enhancements_ar: "دمج التنبيه الفوري للمناطق عالية الخطورة والتنبؤ بخطورة الحوادث باستخدام تعلم الآلة.",
            thumbnail: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=1000",
            videoSrc: null,
            githubLink: "https://github.com/mohamedsalahabdelhamid/EDA_Road_Accident"
        },
        {
            id: 9,
            title_en: "CRM Business Intelligence",
            title_ar: "ذكاء الأعمال لإدارة العملاء",
            category: "Data Visualization & Dashboard",
            desc_en: "Comprehensive BI dashboard for CRM data, tracking customer life cycles and sales funnel.",
            desc_ar: "لوحة ذكاء أعمال شاملة لبيانات CRM، تتبع دورات حياة العملاء ومراحل البيع.",
            details_en: "Developed automated dashboards that sync with CRM databases to monitor churn rates, conversion velocity, and customer lifetime value (CLV).",
            details_ar: "تطوير لوحات تحكم مؤتمتة تتزامن مع قواعد بيانات CRM لمراقبة معدلات التراجع، سرعة التحويل، والقيمة الدائمة للعميل (CLV).",
            enhancements_en: "Predictive churn modeling and customer segmentation using clustering algorithms.",
            enhancements_ar: "نمذجة تراجع العملاء التنبؤية وتقسيم العملاء باستخدام خوارزميات التجميع.",
            thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000",
            videoSrc: null,
            githubLink: "https://github.com/mohamedsalahabdelhamid/CRM-Business-Intelligence-Project"
        },
        {
            id: 10,
            title_en: "Body Performance Analytics",
            title_ar: "تحليلات أداء الجسم",
            category: "Machine Learning & Data Analysis",
            desc_en: "ML models to predict body performance class using XGBoost and fitness metrics.",
            desc_ar: "نماذج تعلم آلي لتوقع فئة أداء الجسم باستخدام XGBoost ومقاييس اللياقة.",
            details_en: "Comprehensive ML pipeline on 13K+ fitness records. Features EDA, feature engineering, and multiple models with XGBoost achieving 89% binary classification accuracy.",
            details_ar: "مسار عمل تعلم آلي متكامل على 13 ألف سجل لياقة. يتضمن تحليلاً استكشافياً وهندسة ميزات، حيث حقق نموذج XGBoost دقة 89٪ في التصنيف الثنائي.",
            enhancements_en: "Deploy model as an interactive web API for real-time fitness evaluation.",
            enhancements_ar: "نشر النموذج كتطبيق ويب تفاعلي لتقييم اللياقة في الوقت الفعلي.",
            thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=1000",
            videoSrc: null,
            githubLink: "https://github.com/mohamedsalahabdelhamid/Body-Performance-Analytics"
        },
        {
            id: 11,
            title_en: "Logistics Supply Chain Analysis",
            title_ar: "تحليل سلاسل التوريد واللوجستيات",
            category: "Supply Chain Analytics & ML",
            desc_en: "Predictive analysis and delay modeling for global logistics networks using SQL & ML.",
            desc_ar: "تحليل تنبؤي ونمذجة التأخير لشبكات اللوجستيات العالمية باستخدام SQL وتعلم الآلة.",
            details_en: "Technical evaluation of a 21-month logistics dataset. Implements a normalized SQL schema and a Random Forest model to predict shipment delays with actionable business insights.",
            details_ar: "تقييم فني لمجموعة بيانات لوجستية لمدة 21 شهرًا. ينفذ مخطط SQL منظماً ونموذج Random Forest للتنبؤ بتأخير الشحنات مع رؤى تجارية قابلة للتنفيذ.",
            enhancements_en: "Integration with real-time GPS tracking APIs and automated route re-optimization.",
            enhancements_ar: "التكامل مع واجهات برمجة تطبيقات تتبع GPS في الوقت الفعلي وإعادة تحسين المسار تلقائيًا.",
            thumbnail: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000",
            videoSrc: null,
            githubLink: "https://github.com/mohamedsalahabdelhamid/Logistics-Supply-Chain-Analysis-Delay-Prediction"
        },
        {
            id: 12,
            title_en: "Logistics Python Dashboard",
            title_ar: "لوحة تحكم اللوجستيات ببايثون",
            category: "Data Visualization & Dashboard",
            desc_en: "Interactive Python-powered logistics operations dashboard with real-time KPI tracking.",
            desc_ar: "لوحة تحكم تفاعلية ببايثون لعمليات اللوجستيات مع تتبع مؤشرات الأداء.",
            details_en: "A Python-based interactive dashboard for monitoring logistics KPIs. Tracks shipment volumes, delivery times, and route efficiency metrics with automated alerting.",
            details_ar: "لوحة تحكم تفاعلية ببايثون لمراقبة مؤشرات اللوجستيات. تتبع أحجام الشحن وأوقات التسليم وكفاءة المسارات مع تنبيهات آلية.",
            enhancements_en: "Integrate live GPS API and predictive delay alerts.",
            enhancements_ar: "دمج GPS مباشر وتنبيهات التأخير التنبؤية.",
            thumbnail: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&q=80&w=1000",
            videoSrc: null,
            githubLink: "https://github.com/mohamedsalahabdelhamid/Logistics_Dashboard"
        },
        {
            id: 14,
            title_en: "POS System Management",
            title_ar: "نظام إدارة نقاط البيع",
            category: "Software Solutions",
            desc_en: "Point-of-Sale management system with inventory tracking and sales reporting.",
            desc_ar: "نظام إدارة نقاط البيع مع تتبع المخزون وتقارير المبيعات.",
            details_en: "A comprehensive POS management solution featuring real-time inventory control, automated sales reporting, and financial reconciliation dashboards.",
            details_ar: "حل إدارة نقاط بيع شامل يتضمن التحكم الفوري في المخزون والتقارير الآلية والمطابقات المالية.",
            enhancements_en: "Add predictive reorder alerts and multi-branch consolidation.",
            enhancements_ar: "إضافة تنبيهات إعادة الطلب التنبؤية وتوحيد الفروع.",
            thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1000",
            videoSrc: null,
            githubLink: "https://github.com/mohamedsalahabdelhamid/pos-system-management-Project"
        }
    ];

    const certifications = [
        {
            title_en: "Foundations: Data Everywhere",
            title_ar: "أسس البيانات",
            issuer: "Google",
            platform: "Coursera",
            date_en: "Jan 2026",
            date_ar: "يناير 2026",
            link: "https://coursera.org/verify/GYH8VPX4EQKC",
            icon: "fab fa-google"
        },
        {
            title_en: "Data-Driven Decisions",
            title_ar: "اتخاذ قرارات مبنية على البيانات",
            issuer: "Google",
            platform: "Coursera",
            date_en: "Jan 2026",
            date_ar: "يناير 2026",
            link: "https://coursera.org/verify/41LFT4KZN1F3",
            icon: "fab fa-google"
        },
        {
            title_en: "Prepare Data for Exploration",
            title_ar: "إعداد البيانات",
            issuer: "Google",
            platform: "Coursera",
            date_en: "Feb 2026",
            date_ar: "فبراير 2026",
            link: "https://coursera.org/verify/LLCG68NGMPZ1",
            icon: "fab fa-google"
        },
        {
            title_en: "Process Data: Dirty to Clean",
            title_ar: "معالجة ونموذج البيانات",
            issuer: "Google",
            platform: "Coursera",
            date_en: "Feb 2026",
            date_ar: "فبراير 2026",
            link: "https://coursera.org/verify/ZN10BMWGXNAF",
            icon: "fab fa-google"
        },
        {
            title_en: "Business Agility",
            title_ar: "الرشاقة في العمل",
            issuer: "IBM",
            platform: "Coursera",
            date_en: "Feb 2026",
            date_ar: "فبراير 2026",
            link: "https://coursera.org/verify/WS0UXPQVSG0Y",
            icon: "fab fa-ibm"
        },
        {
            title_en: "Analyze Data to Answer Questions",
            title_ar: "تحليل البيانات للإجابة على الأسئلة",
            issuer: "Google",
            platform: "Coursera",
            date_en: "Mar 2026",
            date_ar: "مارس 2026",
            link: "https://coursera.org/verify/FR6K5I2J0QPY",
            icon: "fab fa-google"
        },
        {
            title_en: "Accelerate Your Job Search with AI",
            title_ar: "تسريع البحث عن وظيفة باستخدام الذكاء الاصطناعي",
            issuer: "Google",
            platform: "Coursera",
            date_en: "Apr 2026",
            date_ar: "أبريل 2026",
            link: "https://coursera.org/verify/LGWC8HLSQ5VK",
            icon: "fab fa-google"
        },
        {
            title_en: "Google Data Analytics Professional",
            title_ar: "الشهادة المهنية في تحليل بيانات جوجل",
            issuer: "Google",
            platform: "Coursera",
            date_en: "Mar 2026",
            date_ar: "مارس 2026",
            link: "https://coursera.org/verify/WCG4CYJSVDWH",
            icon: "fab fa-google"
        }
    ];

    const experience = [
        {
            role_en: "Data Analytics & AI Specialist",
            role_ar: "أخصائي تحليل بيانات وذكاء اصطناعي",
            company_en: "Digilians | Cairo, Egypt",
            company_ar: "Digilians | القاهرة، مصر",
            date_en: "Dec 2025 - Present",
            date_ar: "ديسمبر 2025 - الآن",
            tasks_en: [
                "Engineered ETL pipelines in Python, saving 10+ hours/week.",
                "Designed dashboards in Power BI/Tableau, cutting reporting time by 40%.",
                "Deployed Agentic AI to automate BI workflows."
            ],
            tasks_ar: [
                "هندسة مسارات ETL ببايثون وتوفير 10+ ساعات عمل أسبوعياً.",
                "تصميم لوحات تحكم Power BI وتقليل وقت التقارير بنسبة 40%.",
                "استخدام Agentic AI لأتمتة سير عمل ذكاء الأعمال."
            ]
        },
        {
            role_en: "Financial Data Analyst",
            role_ar: "محلل بيانات مالية",
            company_en: "Gzoor | Cairo, Egypt",
            company_ar: "جذور | القاهرة، مصر",
            date_en: "Nov 2025 - Present",
            date_ar: "نوفمبر 2025 - الآن",
            tasks_en: [
                "Architected IFRS-compliant reporting, raising accuracy by 30%.",
                "Built financial KPI dashboards, accelerating reporting by 35%.",
                "Identified $50K+ in cost-saving opportunities through variance analysis."
            ],
            tasks_ar: [
                "تصميم نظام تقارير IFRS ورفع دقة البيانات بنسبة 30%.",
                "بناء لوحات مؤشرات الأداء المالي وتسريع التقارير بنسبة 35%.",
                "تحديد فرص توفير تتجاوز 50,000 دولار من خلال تحليل الانحرافات."
            ]
        },
        {
            role_en: "General Accountant & Reporting Analyst",
            role_ar: "محاسب عام ومحلل تقارير",
            company_en: "Wamd Academy | Giza, Egypt",
            company_ar: "أكاديمية ومض | الجيزة، مصر",
            date_en: "Feb 2025 - Oct 2025",
            date_ar: "فبراير 2025 - أكتوبر 2025",
            tasks_en: [
                "Designed Excel reporting systems reducing processing time by 30%.",
                "Automated monthly financial reconciliation, eliminating manual errors.",
                "Developed management dashboards to track budget variances and KPIs."
            ],
            tasks_ar: [
                "تصميم نظام تقارير إكسيل وفر 30% من وقت العمل.",
                "أتمتة المطابقة المالية الشهرية والقضاء على الأخطاء اليدوية.",
                "بناء لوحات تحكم إدارية لتتبع انحرافات الميزانية ومؤشرات الأداء."
            ]
        },
        {
            role_en: "Accountant – ERP Migration Specialist",
            role_ar: "محاسب - أخصائي نقل بيانات (ERP)",
            company_en: "Al Osseilan | Giza, Egypt",
            company_ar: "العسيلان | الجيزة، مصر",
            date_en: "Sep 2023 – Jun 2024",
            date_ar: "سبتمبر 2023 - يونيو 2024",
            tasks_en: [
                "Led zero-loss data migration from Al Ameen to Odoo ERP on schedule.",
                "Reduced discrepancies by 90% by aligning data with ERP requirements.",
                "Managed transactions and treasury with real-time financial insights."
            ],
            tasks_ar: [
                "قيادة نقل البيانات من الأمين إلى Odoo ERP بنجاح ودون فقدان بيانات.",
                "تقليل فروق التسوية بنسبة 90% عبر مواءمة البيانات مع متطلبات النظام.",
                "إدارة معاملات المبيعات والخزينة بتقديم تقارير مالية فورية."
            ]
        },
        {
            role_en: "General Accountant",
            role_ar: "محاسب عام",
            company_en: "Agape Office | Cairo, Egypt",
            company_ar: "مكتب أغابي | القاهرة، مصر",
            date_en: "Dec 2022 - Dec 2023",
            date_ar: "ديسمبر 2022 - ديسمبر 2023",
            tasks_en: [
                "Managed full-cycle ledger, payroll, and inventory operations.",
                "Maintained zero payroll errors throughout tenure.",
                "Prepared monthly trial balance and reconciled bank statements on time."
            ],
            tasks_ar: [
                "إدارة الدفاتر المحاسبية، الرواتب، وعمليات المخزون بالكامل.",
                "الحفاظ على دقة الرواتب بنسبة 100% طوال فترة العمل.",
                "إعداد ميزان المراجعة الشهري ومطابقة كشوف الحسابات البنكية في الوقت المحدد."
            ]
        },
        {
            role_en: "Document Control Specialist",
            role_ar: "أخصائي مراقبة مستندات",
            company_en: "Iron Mountain | Giza, Egypt",
            company_ar: "Iron Mountain | الجيزة، مصر",
            date_en: "Jul 2019 – Mar 2021",
            date_ar: "يوليو 2019 - مارس 2021",
            tasks_en: [
                "Managed lifecycle for global clients: scanning, QC, and metadata tagging.",
                "Maintained 100% audit-pass rate with zero data security incidents."
            ],
            tasks_ar: [
                "إدارة دورة حياة المستندات لعملاء دوليين: المسح، الرقابة، والبيانات.",
                "تحقيق نجاح 100% في التدقيق مع حماية كاملة لسرية البيانات."
            ]
        }
    ];

    const services = [
        {
            id: 's1',
            category: "Data Analytics & AI",
            title_en: "Advanced Data Analysis & Cleaning",
            title_ar: "تنظيف و تحليل البيانات المتقدم",
            desc_en: "Professional data cleaning, processing, and statistical analysis tailored to business needs.",
            desc_ar: "تنظيف ومعالجة البيانات والتحليل الإحصائي الاحترافي المصمم لاحتياجات العمل.",
            icon: "fas fa-broom",
            details_en: "Handling messy datasets, removing duplicates, identifying outliers, and structuring data for analysis. Using Python (Pandas/NumPy) and SQL to extract actionable insights, trends, and patterns from your raw complex data.",
            details_ar: "التعامل مع مجموعات البيانات العشوائية، إزالة التكرارات، تحديد القيم المتطرفة، وهيكلة البيانات للتحليل. استخدام بايثون (Pandas/NumPy) و SQL لاستخراج رؤى واتجاهات وأنماط قابلة للتنفيذ من بياناتك الخام المعقدة.",
            links: [
                { name: "Khamsat", url: "https://khamsat.com/data/data-analytics/4099745-%D8%AA%D9%86%D8%B8%D9%8A%D9%81-%D9%88%D8%AA%D9%86%D8%B3%D9%8A%D9%82-%D9%88%D9%85%D8%B9%D8%A7%D9%84%D8%AC%D8%A9-%D8%A7%D9%84%D8%A8%D9%8A%D8%A7%D9%86%D8%A7%D8%AA-%D8%B9%D9%84%D9%89-excel-%D8%A8%D8%A7%D8%AD%D8%AA%D8%B1%D8%A7%D9%81%D9%8A%D8%A9", icon: "btn-khamsat", label_en: "Order on Khamsat", label_ar: "اطلب من خمسات" },
                { name: "Direct", url: "https://wa.me/201148295790", icon: "btn-direct", label_en: "Direct Request", label_ar: "طلب مباشر" }
            ]
        },
        {
            id: 's2',
            category: "Data Analytics & AI",
            title_en: "Interactive BI Dashboards",
            title_ar: "تصميم لوحات تحكم تفاعلية (BI)",
            desc_en: "Building dynamic Power BI and Tableau dashboards to visualize KPIs and business metrics.",
            desc_ar: "بناء لوحات تحكم ديناميكية باستخدام Power BI و Tableau لتصور مؤشرات الأداء.",
            icon: "fas fa-chart-pie",
            details_en: "Transforming your boring spreadsheets into stunning, interactive visual dashboards. I build automated reporting solutions that track your daily KPIs, sales funnels, and performance metrics in real-time, enabling faster decision-making.",
            details_ar: "تحويل جداول البيانات المملة إلى لوحات تحكم مرئية مذهلة وتفاعلية. أقوم ببناء حلول تقارير مؤتمتة تتعقب مؤشرات الأداء الرئيسية اليومية، ومسارات المبيعات، ومقاييس الأداء في الوقت الفعلي، مما يتيح اتخاذ قرارات مالية وإدارية أسرع.",
            links: [
                { name: "Direct", url: "https://wa.me/201148295790", icon: "btn-direct", label_en: "Direct Request", label_ar: "طلب مباشر" }
            ]
        },
        {
            id: 's3',
            category: "Data Analytics & AI",
            title_en: "Exploratory Data Analysis (EDA)",
            title_ar: "التحليل الاستكشافي للبيانات (EDA)",
            desc_en: "Uncovering hidden stories and correlations within your data.",
            desc_ar: "الكشف عن القصص والارتباطات المخفية داخل بياناتك لفهمها بشكل أفضل.",
            icon: "fas fa-magnifying-glass-chart",
            details_en: "I perform a deep dive into your data to find meaningful patterns. Whether it's why customers are leaving or what your top-selling products are, I provide a clear report that explains exactly what your data is trying to tell you.",
            details_ar: "أقوم بالغوص بعمق في بياناتك للعثور على أنماط ذات مغزى. سواء كان السبب في مغادرة العملاء أو ما هي المنتجات الأكثر مبيعاً لديك، سأقدم تقريراً واضحاً يشرح بدقة ما تحاول بياناتك إخبارك به.",
            links: [
                { name: "Direct", url: "https://wa.me/201148295790", icon: "btn-direct", label_en: "Direct Request", label_ar: "طلب مباشر" }
            ]
        },
        {
            id: 's4',
            category: "Data Analytics & AI",
            title_en: "Data Automation Scripts",
            title_ar: "أتمتة مهام البيانات",
            desc_en: "Automating repetitive data entry, extraction, and reporting tasks with Python.",
            desc_ar: "استخدام بايثون لأتمتة مهام إدخال واستخراج البيانات والتقارير المتكررة والمملة.",
            icon: "fas fa-robot",
            details_en: "Stop spending hours on manual data entry. I create custom automation scripts that handle your data processing and reporting automatically, ensuring accuracy and saving you valuable time every single day.",
            details_ar: "توقف عن قضاء ساعات في إدخال البيانات يدوياً. أقوم بإنشاء سكربتات أتمتة مخصصة تتعامل مع معالجة بياناتك وتقاريرك تلقائياً، مما يضمن الدقة ويوفر وقتك الثمين كل يوم.",
            links: [
                { name: "Direct", url: "https://wa.me/201148295790", icon: "btn-direct", label_en: "Direct Request", label_ar: "طلب مباشر" }
            ]
        },
        {
            id: 's5',
            category: "Accounting & ERP Systems",
            title_en: "Bookkeeping & Journal Entries",
            title_ar: "إمساك الدفاتر المحاسبية والقيود",
            desc_en: "Accurate daily recording of financial transactions and ledger management.",
            desc_ar: "تسجيل دقيق ويومي للمعاملات المالية وإدارة دفاتر الأستاذ والقيود اليومية.",
            icon: "fas fa-book",
            details_en: "Managing full-cycle bookkeeping for your business. Carefully recording daily transactions, categorizing expenses, and managing accounts payable/receivable to ensure your books are always ready for tax season or auditing.",
            details_ar: "إدارة دورة إمساك الدفاتر بالكامل لعملك. تسجيل المعاملات اليومية بدقة، وتصنيف النفقات، وإدارة الحسابات الدائنة والمدينة لضمان أن دفاترك جاهزة دائماً لموسم الضرائب أو المراجعة.",
            links: [
                { name: "Direct", url: "https://wa.me/201148295790", icon: "btn-direct", label_en: "Direct Request", label_ar: "طلب مباشر" }
            ]
        },
        {
            id: 's6',
            category: "Accounting & ERP Systems",
            title_en: "Automated Financial Reporting",
            title_ar: "أتمتة التقارير المالية (Excel & BI)",
            desc_en: "Design and automation of P&L, Balance Sheets, and Cash Flows using advanced macros.",
            desc_ar: "تصميم وأتمتة قائمة الدخل، الميزانية العمومية، والتدفقات النقدية بمعادلات متقدمة.",
            icon: "fas fa-file-invoice-dollar",
            details_en: "Full automation of your monthly and annual financial closing workflows. I build intelligent Excel templates with advanced macros and VBA that automatically generate income statements and balance sheets from raw trial balances.",
            details_ar: "أتمتة كاملة لسير عمل الإغلاق المالي الشهري والسنوي. أقوم ببناء قوالب إكسيل ذكية باستخدام وحدات ماكرو متقدمة و VBA تُنشئ تلقائياً بيانات الدخل والميزانيات العمومية من موازين المراجعة الخام.",
            links: [
                { name: "Direct", url: "https://wa.me/201148295790", icon: "btn-direct", label_en: "Direct Request", label_ar: "طلب مباشر" }
            ]
        },
        {
            id: 's7',
            category: "Accounting & ERP Systems",
            title_en: "Internal Audit & Reconciliation",
            title_ar: "المراجعة الداخلية والمطابقات",
            desc_en: "Internal audit support, error detection, and bank reconciliations.",
            desc_ar: "تقديم دعم المراجعة الداخلية، اكتشاف الأخطاء المالية، والمطابقات البنكية.",
            icon: "fas fa-check-double",
            details_en: "I help you review your financial records to ensure everything is in balance. I specialize in finding discrepancies, fixing duplicated entries, and performing accurate bank reconciliations to keep your finances error-free.",
            details_ar: "أساعدك في مراجعة سجلاتك المالية لضمان توازن كل شيء. أنا متخصص في العثور على التناقضات، وإصلاح الإدخالات المكررة، وإجراء مطابقات بنكية دقيقة للحفاظ على ماليتك خالية من الأخطاء.",
            links: [
                { name: "Direct", url: "https://wa.me/201148295790", icon: "btn-direct", label_en: "Direct Request", label_ar: "طلب مباشر" }
            ]
        },
        {
            id: 's8',
            category: "Accounting & ERP Systems",
            title_en: "Corporate Budgeting & Forecasting",
            title_ar: "الموازنات التخطيطية والتنبؤ المالي",
            desc_en: "Creating financial models to predict future revenue and control departmental budgets.",
            desc_ar: "إنشاء نماذج مالية للتنبؤ بالإيرادات المستقبلية والتحكم في ميزانيات الأقسام.",
            icon: "fas fa-coins",
            details_en: "Combine accounting standards with data science to forecast next quarter's financial health. I assist businesses in setting realistic operational budgets, projecting cash flows, and analyzing variance dynamically.",
            details_ar: "دمج المعايير المحاسبية مع علوم البيانات للتنبؤ بالصحة المالية للربع القادم. أساعد الشركات في وضع ميزانيات تشغيلية واقعية، والتنبؤ بالتدفقات النقدية، وتحليل الانحرافات بشكل ديناميكي.",
            links: [
                { name: "Direct", url: "https://wa.me/201148295790", icon: "btn-direct", label_en: "Direct Request", label_ar: "طلب مباشر" }
            ]
        }
    ];

    const skills = [
        {
            category_en: "BI & Visualization",
            category_ar: "أنظمة ذكاء الأعمال",
            icon: "fas fa-chart-pie",
            items: [
                { name: "Power BI (Advanced)", progress: "95%" },
                { name: "Tableau", progress: "85%" },
                { name: "Microsoft Excel", progress: "90%" }
            ]
        },
        {
            category_en: "Data Engineering",
            category_ar: "هندسة البيانات",
            icon: "fas fa-database",
            items: [
                { name: "SQL (Complex Queries)", progress: "90%" },
                { name: "ETL Pipelines", progress: "85%" },
                { name: "Data Cleaning", progress: "95%" }
            ]
        },
        {
            category_en: "Programming",
            category_ar: "البرمجة",
            icon: "fas fa-code",
            items: [
                { name: "Python (Pandas/NumPy)", progress: "88%" },
                { name: "Data Visualization", progress: "92%" },
                { name: "Web Tech (JS/HTML/CSS)", progress: "75%" }
            ]
        },
        {
            category_en: "Analytics & AI",
            category_ar: "الذكاء الاصطناعي والتحليلات",
            icon: "fas fa-robot",
            items: [
                { name: "Predictive Analytics", progress: "85%" },
                { name: "Machine Learning", progress: "80%" },
                { name: "Agentic AI", progress: "90%" },
                { name: "IBM SPSS", progress: "88%" }
            ]
        },
        {
            category_en: "Financial Analysis",
            category_ar: "التحليل المالي",
            icon: "fas fa-file-invoice-dollar",
            items: [
                { name: "Financial Modeling (Advanced)", progress: "90%" },
                { name: "Budgeting & Forecasting", progress: "85%" },
                { name: "IFRS Compliance & Reporting", progress: "95%" },
                { name: "Risk Assessment & Ratio Analysis", progress: "88%" }
            ]
        }
    ];

    let testimonials = [
        {
            name_en: "Ahmed Mahmoud",
            name_ar: "أحمد محمود",
            role_en: "Business Owner",
            role_ar: "صاحب عمل",
            content_en: "Exceptional speed and accuracy in data processing. Highly recommended!",
            content_ar: "دقة وسرعة استثنائية في معالجة البيانات، والتقارير المالية كانت ممتازة. أنصح بالتعامل معه بشدة!",
            avatar: "https://i.pravatar.cc/150?u=ahmed"
        },
        {
            name_en: "Sara Khalid",
            name_ar: "سارة خالد",
            role_en: "Data Lead",
            role_ar: "رئيسة قسم البيانات",
            content_en: "The dashboards provided gave us a completely new perspective on our sales data.",
            content_ar: "لوحات التحكم التي قدمها أعطتنا منظورًا جديدًا تمامًا لبيانات المبيعات لدينا، مما سهل علينا اتخاذ قرارات سريعة.",
            avatar: "https://i.pravatar.cc/150?u=sarah"
        },
        {
            name_en: "Omar Hassan",
            name_ar: "عمر حسن",
            role_en: "Operations Manager",
            role_ar: "مدير العمليات",
            content_en: "His expertise in bookkeeping and automated reporting saved our team countless hours. A true professional.",
            content_ar: "خبرته في إمساك الدفاتر المحاسبية وأتمتة التقارير وفرت لفريقنا ساعات طويلة من العمل اليدوي. شخص محترف جداً.",
            avatar: "https://i.pravatar.cc/150?u=omar"
        },
        {
            name_en: "Mahmoud Ezzat",
            name_ar: "محمود عزت",
            role_en: "Financial Director",
            role_ar: "مدير مالي",
            content_en: "Mohamed transformed our raw data into comprehensive financial dashboards. His attention to detail is unmatched.",
            content_ar: "قام محمد بتحويل بياناتنا الخام إلى لوحات تحكم مالية شاملة وواضحة جداً. اهتمامه بالتفاصيل لا يعلى عليه.",
            avatar: "https://i.pravatar.cc/150?u=mahmoud"
        },
        {
            name_en: "Tariq Saeed",
            name_ar: "طارق سعيد",
            role_en: "Sales Manager",
            role_ar: "مدير مبيعات",
            content_en: "The sales margin analysis he provided helped us increase our revenue by 15% in one quarter.",
            content_ar: "تحليل هوامش المبيعات الذي قدمه ساعدنا على زيادة إيراداتنا بنسبة ١٥٪ في ربع واحد.",
            avatar: "https://i.pravatar.cc/150?u=tariq"
        },
        {
            name_en: "Nour El-Din Mohamed",
            name_ar: "نور الدين محمد",
            role_en: "Startup Founder",
            role_ar: "مؤسس شركة ناشئة",
            content_en: "Excellent communication and deep understanding of business requirements. Delivered precisely what we needed.",
            content_ar: "تواصل ممتاز وفهم عميق لمتطلبات العمل. قدم بالضبط ما كنا نحتاجه لتطوير استراتيجيتنا.",
            avatar: "https://i.pravatar.cc/150?u=nour"
        },
        {
            name_en: "Mustafa Kamal",
            name_ar: "مصطفى كمال",
            role_en: "HR Director",
            role_ar: "مدير الموارد البشرية",
            content_en: "His HR analytics dashboards allowed us to track employee performance and turnover effectively.",
            content_ar: "لوحات تحليلات الموارد البشرية سمحت لنا بتتبع أداء الموظفين ومعدلات الدوران الوظيفي بشكل فعال جداً.",
            avatar: "https://i.pravatar.cc/150?u=mustafa"
        },
        {
            name_en: "Youssef Ibrahim",
            name_ar: "يوسف إبراهيم",
            role_en: "E-Commerce Manager",
            role_ar: "مدير تجارة إلكترونية",
            content_en: "Helped us identify our most profitable customer segments through rigorous data analysis.",
            content_ar: "ساعدنا في تحديد شرائح العملاء الأكثر ربحية من خلال تحليل دقيق وصارم لبيانات المتجر.",
            avatar: "https://i.pravatar.cc/150?u=youssef"
        },
        {
            name_en: "Salma Yassin",
            name_ar: "سلمى ياسين",
            role_en: "Marketing Analyst",
            role_ar: "محللة تسويق",
            content_en: "Mohamed's ability to clean and process messy data into actionable insights is truly impressive.",
            content_ar: "قدرة محمد على تنظيف ومعالجة البيانات العشوائية وتحويلها إلى رؤى قابلة للتنفيذ مبهرة حقاً.",
            avatar: "https://i.pravatar.cc/150?u=salma"
        },
        {
            name_en: "Khaled Zaki",
            name_ar: "خالد زكي",
            role_en: "Supply Chain Head",
            role_ar: "رئيس سلاسل الإمداد",
            content_en: "By automating our inventory reporting, he eliminated human error and gave us real-time visibility.",
            content_ar: "من خلال أتمتة تقارير المخزون، قضى على الأخطاء البشرية وأعطانا رؤية واضحة ومباشرة للمخازن.",
            avatar: "https://i.pravatar.cc/150?u=khaled"
        }
    ];

    // ── INTERFACE FUNCTIONS ──
    function updateDynamicStats() {
        // startYear = start of data-analytics-focused career
        const startYear = 2023;
        const currentYear = new Date().getFullYear();
        const yearsExp = Math.max(currentYear - startYear, 3); // At least 3+
        const projectCount = 30; // Set strictly to 30 as requested

        const statsMap = {
            'stat-years':    yearsExp,        // e.g. 3+ (matches bio text)
            'stat-projects': projectCount,    // actual project count
            'stat-reports':  40,
            'stat-hours':    10
        };

        for (const [id, val] of Object.entries(statsMap)) {
            const el = document.getElementById(id);
            if (el) el.setAttribute('data-target', val);
        }
    }

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 600; // Faster animation
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                clearInterval(timer);
                el.textContent = target + suffix;
            } else {
                el.textContent = Math.floor(current) + suffix;
            }
        }, 16);

    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateDynamicStats(); // Update values before animation
                entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const heroStatsSection = document.querySelector('.hero-stats-grid');
    if (heroStatsSection) statsObserver.observe(heroStatsSection);

    // ── Project Filter ─────────────────────────────────
    function initProjectFilter() {
        const filterContainer = document.getElementById('project-filters');
        if (!filterContainer) return;

        filterContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;

            filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Reset to page 1 on filter change
            currentProjectsPage = 1;

            const lang = localStorage.getItem('lang') || 'en';
            renderProjects(lang);
        });

        // Apply lang to filter buttons
        const lang = localStorage.getItem('lang') || 'en';
        filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
            const val = btn.getAttribute(`data-${lang}`);
            if (val) btn.textContent = val;
        });
    }
    initProjectFilter();
    window.initProjectFilter = initProjectFilter; // expose for lang change

    // Hide Loader

    const loader = document.querySelector('.loader-wrapper');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 800);
    }

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const themeIcon = themeBtn.querySelector('i');

    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        htmlEl.classList.replace('dark', 'light');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }

    themeBtn.addEventListener('click', () => {
        if (htmlEl.classList.contains('dark')) {
            htmlEl.classList.replace('dark', 'light');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            htmlEl.classList.replace('light', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    });

    // Language Toggle
    const langBtn = document.getElementById('lang-toggle');
    let currentLang = localStorage.getItem('lang') || 'en';

    // ── DOM ELEMENTS AND INITIAL RENDERING ──
    // ── PAGINATION STATE ──
    const PROJECTS_PER_PAGE = 3;
    const SERVICES_PER_PAGE = 3;
    const EXP_PER_PAGE = 3;
    const SKILLS_PER_PAGE = 3;
    const CERTS_PER_PAGE = 3;

    let currentProjectsPage = 1;
    let currentServicesPage = 1;
    let currentExpPage = 1;
    let currentSkillsPage = 1;
    let currentCertsPage = 1;
    let currentTestimonialsPage = 1;

    function renderPaginationControls(containerId, totalItems, itemsPerPage, currentPage, onPageChange) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        let html = '<div class="pagination-wrapper">';
        for (let i = 1; i <= totalPages; i++) {
            html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        html += '</div>';
        
        container.innerHTML = html;

        container.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.getAttribute('data-page'));
                onPageChange(page);
            });
        });
    }

    const projectsContainer = document.getElementById('projects-container');
    const certsContainer = document.getElementById('certs-container');
    const expContainer = document.getElementById('experience-container');
    const servicesContainer = document.getElementById('services-container');
    const servicesFilters = document.getElementById('services-filters');

    function renderProjects(lang) {
        if (!projectsContainer) return;
        projectsContainer.innerHTML = ''; // Clear previous

        const activeFilter = document.getElementById('project-filters')?.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';

        // 1. Filter projects first
        let filteredProjects = activeFilter === 'all'
            ? projects
            : projects.filter(p => p.category === activeFilter);

        // 2. Sort by ID descending (Newest first)
        filteredProjects = [...filteredProjects].sort((a, b) => b.id - a.id);

        // 3. Handle empty state
        if (filteredProjects.length === 0) {
            projectsContainer.innerHTML = `
                <div class="empty-projects-state" style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">
                    <i class="fas fa-folder-open" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p data-en="No projects found in this category." data-ar="لا توجد مشاريع في هذا التصنيف حالياً.">
                        ${lang === 'ar' ? 'لا توجد مشاريع في هذا التصنيف حالياً.' : 'No projects found in this category.'}
                    </p>
                </div>
            `;
            return;
        }

        // 4. Pagination logic
        const totalItems = filteredProjects.length;
        const startIndex = (currentProjectsPage - 1) * PROJECTS_PER_PAGE;
        const pagedProjects = filteredProjects.slice(startIndex, startIndex + PROJECTS_PER_PAGE);

        // 5. Render paged projects
        pagedProjects.forEach(project => {
            const thumbSrc = project.thumbnail ? project.thumbnail : 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80';
            const hasVideo = project.videoSrc !== null;

            const title = lang === 'ar' ? project.title_ar : project.title_en;
            const desc = lang === 'ar' ? project.desc_ar : project.desc_en;

            const cardHTML = `
                <div class="project-card">
                    <div class="project-media">
                        <img src="${thumbSrc}" alt="${title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1551288049-bebda4e38f71'">
                        ${hasVideo ? `
                        <div class="play-overlay" data-video="${project.videoSrc}" data-title="${title}">
                            <div class="play-btn"><i class="fas fa-play"></i></div>
                        </div>
                        ` : ''}
                    </div>
                    <div class="project-content">
                        <div class="project-category">${project.category}</div>
                        <h3 class="project-title">${title}</h3>
                        <p class="project-desc">${desc}</p>
                        <div style="margin-top: 1rem;">
                            <button class="btn btn-secondary open-project-modal" data-id="${project.id}" style="padding: 6px 14px; font-size: 0.85rem;">
                                <i class="fas fa-eye"></i> <span data-en="More Details" data-ar="التفاصيل">${lang === 'ar' ? 'التفاصيل' : 'More Details'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            projectsContainer.insertAdjacentHTML('beforeend', cardHTML);
        });

        // Render controls
        renderPaginationControls('projects-pagination', totalItems, PROJECTS_PER_PAGE, currentProjectsPage, (page) => {
            currentProjectsPage = page;
            renderProjects(lang);
            document.getElementById('projects').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        // Reattach Modal Events after rendering
        attachModalEvents();
        // Refresh card cache for mousemove glow effect
        window.dispatchEvent(new Event('portfolioRender'));
    }

    function renderServices(lang) {
        if (!servicesContainer) return;
        servicesContainer.innerHTML = '';

        const filteredServices = activeServiceFilter === 'all'
            ? services
            : services.filter(s => s.category === activeServiceFilter);

        // Pagination
        const totalItems = filteredServices.length;
        const startIndex = (currentServicesPage - 1) * SERVICES_PER_PAGE;
        const pagedServices = filteredServices.slice(startIndex, startIndex + SERVICES_PER_PAGE);

        pagedServices.forEach(service => {
            const title = lang === 'ar' ? service.title_ar : service.title_en;
            const desc = lang === 'ar' ? service.desc_ar : service.desc_en;
            const moreText = lang === 'ar' ? 'عرض التفاصيل' : 'View Details';

            const serviceHTML = `
                <div class="service-card" data-id="${service.id}">
                    <div class="service-icon"><i class="${service.icon}"></i></div>
                    <div class="service-category-tag">${service.category}</div>
                    <h3>${title}</h3>
                    <p>${desc}</p>
                    <button class="btn btn-secondary btn-more open-service-modal" data-id="${service.id}">
                        <i class="fas fa-plus"></i> ${moreText}
                    </button>
                </div>
            `;
            servicesContainer.insertAdjacentHTML('beforeend', serviceHTML);
        });

        renderPaginationControls('services-pagination', totalItems, SERVICES_PER_PAGE, currentServicesPage, (page) => {
            currentServicesPage = page;
            renderServices(lang);
            // Scroll to services section top
            document.getElementById('services').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        // Reattach Modal Events for services
        attachModalEvents();
    }

    // Services filter — track active filter in a variable to avoid DOM-read race conditions
    let activeServiceFilter = 'all';

    // Helper to decode HTML entities (like &amp; to &)
    function decodeHTMLEntities(text) {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }

    if (servicesFilters) {
        servicesFilters.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;
            servicesFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Reset to page 1 on filter change
            currentServicesPage = 1;

            // Decode the filter attribute just in case '&' became '&amp;' in the DOM
            let rawFilter = btn.getAttribute('data-filter') || 'all';
            activeServiceFilter = decodeHTMLEntities(rawFilter);
            
            const lang = localStorage.getItem('lang') || 'en';
            renderServices(lang);
        });
    }

    async function initTestimonials() {
        const grid = document.getElementById('testimonials-grid');
        if (!grid) return;

        // Try dynamic reviews via Proxy, fallback to local file
        try {
            const cfg = window.PORTFOLIO_CONFIG || {};
            let fetchedReviews = [];

            if (cfg.USE_PROXY && cfg.PROXY_URL) {
                try {
                    const response = await fetch(cfg.PROXY_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ provider: 'get_reviews' })
                    });
                    if (response.ok) {
                        fetchedReviews = await response.json();
                    }
                } catch (proxyErr) {
                    console.warn('Proxy review fetch failed:', proxyErr);
                }
            }

            // Fallback to local file if proxy fails, is disabled, or returns empty
            if (!Array.isArray(fetchedReviews) || fetchedReviews.length === 0) {
                const response = await fetch('data/reviews.json?t=' + Date.now());
                if (response.ok) {
                    fetchedReviews = await response.json();
                }
            }

            if (Array.isArray(fetchedReviews)) {
                testimonials = fetchedReviews;
            }
        } catch (err) {
            console.error('Testimonials loading failed:', err);
        }

        renderTestimonials(localStorage.getItem('lang') || 'en');
    }
    function renderTestimonials(lang) {
        const testimonialsGrid = document.getElementById('testimonials-grid');
        if (!testimonialsGrid) return;
        testimonialsGrid.innerHTML = '';

        // Build a horizontal slider container
        const sliderId = 'testimonials-slider';
        const sliderHTML = `
            <div class="testimonials-slider" id="${sliderId}">
                <button class="slider-nav prev" aria-label="Previous">‹</button>
                <div class="slider-track" id="${sliderId}-track"></div>
                <button class="slider-nav next" aria-label="Next">›</button>
            </div>
        `;

        testimonialsGrid.insertAdjacentHTML('beforeend', sliderHTML);
        const track = document.getElementById(`${sliderId}-track`);
        if (!track) return;

        // Render each testimonial as a slide
        testimonials.forEach(t => {
            const name = lang === 'ar' ? (t.name_ar || t.name_en) : (t.name_en || t.name_ar);
            const role = lang === 'ar' ? (t.role_ar || t.role_en) : (t.role_en || t.role_ar);
            const content = lang === 'ar' ? (t.content_ar || t.content_en) : (t.content_en || t.content_ar);
            const avatar = t.avatar || '';
            const showAvatar = avatar && !t.isNew;

            const authorBlock = `
                <div class="author-info" style="margin-top:6px; text-align:center;">
                    <h4 style="margin:0; font-size:1.1rem; color:var(--text-primary);">${escapeHTML(name)}</h4>
                    <p style="margin:0; color:var(--text-secondary); font-size:0.9rem;">${escapeHTML(role)}</p>
                </div>
            `;

            const slideHTML = `
                <div class="testimonial-slide">
                    <div class="testimonial-content">
                        <p>${escapeHTML(content)}</p>
                    </div>
                    <div class="testimonial-author">
                        ${authorBlock}
                    </div>
                </div>
            `;
            track.insertAdjacentHTML('beforeend', slideHTML);
        });

        // Initialize marquee (TV-style continuous ticker)
        setupTestimonialsMarquee(`#${sliderId}`);

        // No traditional pagination for carousel; clear existing controls
        const pagContainer = document.getElementById('testimonials-pagination');
        if (pagContainer) pagContainer.innerHTML = '';
    }

    // Marquee helper: continuous TV-style ticker
    function setupTestimonialsMarquee(selector) {
        const slider = document.querySelector(selector);
        if (!slider) return;
        const track = slider.querySelector('.slider-track');
        if (!track) return;

        // Remove nav buttons for marquee
        const prevBtn = slider.querySelector('.slider-nav.prev');
        const nextBtn = slider.querySelector('.slider-nav.next');
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';

        // Duplicate content for seamless loop
        const originalHTML = track.innerHTML;
        track.innerHTML = originalHTML + originalHTML;

        // Calculate animation duration based on actual width
        function updateAnimation() {
            // Get the original single-loop width (before duplication)
            // Ensure we measure after children are rendered
            const trackWidth = track.scrollWidth / 2;
            if (trackWidth <= 0) return;

            const pixelsPerSecond = 120; // Faster scrolling speed as requested
            const durationSeconds = Math.max(10, Math.round(trackWidth / pixelsPerSecond));
            
            track.style.animation = 'none';
            void track.offsetHeight; // Force reflow
            track.style.animation = `scroll-left ${durationSeconds}s linear infinite`;
        }

        // Initial setup after images and sub-components are likely loaded
        window.addEventListener('load', updateAnimation);
        setTimeout(updateAnimation, 500); // Fallback for dynamic content cases

        // Recalculate on window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateAnimation, 250);
        });
    }

    function initFeedbackForm() {
        const form = document.getElementById('feedbackForm');
        const successMsg = document.getElementById('feedback-success');
        const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
        if (!form) return;

        // EmailJS config — loaded from config.js
        const cfg = window.PORTFOLIO_CONFIG || {};
        const EMAILJS_SERVICE_ID  = cfg.EMAILJS_SERVICE_ID  || '';
        const EMAILJS_TEMPLATE_ID = cfg.EMAILJS_TEMPLATE_ID || '';
        const EMAILJS_PUBLIC_KEY  = cfg.EMAILJS_PUBLIC_KEY  || '';

        if (EMAILJS_PUBLIC_KEY && typeof emailjs !== 'undefined') {
            emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name      = escapeHTML(document.getElementById('fb-name')?.value.trim() || '');
            const role      = escapeHTML(document.getElementById('fb-role')?.value.trim() || '');
            const content   = escapeHTML(document.getElementById('fb-content')?.value.trim() || '');
            const recommend = form.querySelector('input[name="recommend"]:checked')?.value || 'yes';

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            }

            try {
                // 1. Simple Client-side Moderation & Persistence Check
                const badWords = ['شتم', 'badword1', 'badword2']; // Minimal example blacklist
                const isBad = badWords.some(word => content.toLowerCase().includes(word) || name.toLowerCase().includes(word));

                if (isBad) {
                    const failMsg = localStorage.getItem('lang') === 'ar' 
                        ? 'عذراً، يحتوي التعليق على كلمات غير لائقة. يرجى مراجعته.'
                        : 'Sorry, your feedback contains inappropriate language. Please review it.';
                    alert(failMsg);
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span data-en="Submit Review" data-ar="إرسال التقييم">Submit Review</span>';
                    }
                    return;
                }

                let finalizedTestimonial = {
                    name_en: name || 'Anonymous',
                    name_ar: name || 'Anonymous',
                    role_en: role || 'N/A',
                    role_ar: role || 'N/A',
                    content_en: content,
                    content_ar: content,
                    isNew: true,
                    date: new Date().toISOString()
                };

                // AI Moderation Fallback (if enabled via proxy)
                const useProxy = cfg.USE_PROXY || false;
                const proxyUrl = cfg.PROXY_URL || "";
                if (useProxy && proxyUrl) {
                    try {
                        const modResponse = await fetch(proxyUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                provider: 'moderation',
                                prompt: JSON.stringify(finalizedTestimonial)
                            })
                        });
                        const modData = await modResponse.json();
                        if (modData.result === 'FAIL') {
                             alert(localStorage.getItem('lang') === 'ar' ? 'تم رفض التعليق من قبل نظام الرقابة.' : 'Review rejected by moderation system.');
                             if (submitBtn) {
                                submitBtn.disabled = false;
                                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span data-en="Submit Review" data-ar="إرسال التقييم">Submit Review</span>';
                            }
                            return;
                        }
                        if (modData.testimonial) finalizedTestimonial = modData.testimonial;
                    } catch (modErr) {
                        console.warn('Moderation proxy unavailable, using local check.');
                    }
                }

                // 2. Add to UI locally (Immediate and bilingual)
                testimonials.unshift(finalizedTestimonial);
                renderTestimonials(localStorage.getItem('lang') || 'en');

                // 3. Email Sending (Using translated content for notification if possible)
                if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY && typeof emailjs !== 'undefined') {
                    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                        name: finalizedTestimonial.name_en + " / " + finalizedTestimonial.name_ar,
                        role: finalizedTestimonial.role_en + " / " + finalizedTestimonial.role_ar,
                        message: finalizedTestimonial.content_en + "\n\n---\n\n" + finalizedTestimonial.content_ar,
                        recommend: recommend
                    });
                }
                
                form.classList.add('hidden');
                successMsg.classList.remove('hidden');
                setTimeout(() => {
                    form.reset();
                    form.classList.remove('hidden');
                    successMsg.classList.add('hidden');
                }, 5000);
            } catch (err) {
                console.error('Submission failed:', err);
                alert('Sorry, could not send feedback. Please contact me directly.');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span data-en="Submit Review" data-ar="إرسال التقييم">Submit Review</span>';
                }
            }
        });
    }
    initFeedbackForm();

    function renderCertifications(lang) {
        if (!certsContainer) return;
        certsContainer.innerHTML = '';
        
        const totalItems = certifications.length;
        const startIndex = (currentCertsPage - 1) * CERTS_PER_PAGE;
        const pagedCerts = certifications.slice(startIndex, startIndex + CERTS_PER_PAGE);

        pagedCerts.forEach((cert, index) => {
            const title = lang === 'ar' ? cert.title_ar : cert.title_en;
            const date = lang === 'ar' ? cert.date_ar : cert.date_en;
            const issuerClass = cert.issuer.toLowerCase();

            const certHTML = `
                <div class="cert-card" style="animation-delay: ${index * 0.1}s">
                    <div class="cert-issuer cert-${issuerClass}">
                        <i class="${cert.icon}"></i>
                        <span>${cert.issuer}</span>
                    </div>
                    <div class="cert-body">
                        <h4>${title}</h4>
                        <p class="cert-platform"><i class="fas fa-certificate"></i> ${cert.platform} &nbsp;|&nbsp; <span>${date}</span></p>
                    </div>
                    <a href="${cert.link}" target="_blank" class="cert-verify-btn">
                        <i class="fas fa-external-link-alt"></i>
                        <span data-en="Verify" data-ar="تحقق">${lang === 'ar' ? 'تحقق' : 'Verify'}</span>
                    </a>
                </div>
            `;
            certsContainer.insertAdjacentHTML('beforeend', certHTML);
        });
        
        renderPaginationControls('certs-pagination', totalItems, CERTS_PER_PAGE, currentCertsPage, (page) => {
            currentCertsPage = page;
            renderCertifications(lang);
            document.getElementById('certifications').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    function renderExperience(lang) {
        if (!expContainer) return;
        expContainer.innerHTML = '';

        // Pagination for experience
        const totalItems = experience.length;
        const startIndex = (currentExpPage - 1) * EXP_PER_PAGE;
        const pagedExperience = experience.slice(startIndex, startIndex + EXP_PER_PAGE);

        pagedExperience.forEach(exp => {
            const role = lang === 'ar' ? exp.role_ar : exp.role_en;
            const company = lang === 'ar' ? exp.company_ar : exp.company_en;
            const date = lang === 'ar' ? exp.date_ar : exp.date_en;
            const tasks = lang === 'ar' ? exp.tasks_ar : exp.tasks_en;

            const taskListHTML = tasks.map(t => `<li>${t}</li>`).join('');

            const expHTML = `
                <div class="experience-card">
                    <div class="exp-header">
                        <div class="exp-date">${date}</div>
                        <h3 class="exp-role">${role}</h3>
                        <h4 class="exp-company">${company}</h4>
                    </div>
                    <ul class="exp-tasks">
                        ${taskListHTML}
                    </ul>
                </div>
            `;
            expContainer.insertAdjacentHTML('beforeend', expHTML);
        });

        renderPaginationControls('experience-pagination', totalItems, EXP_PER_PAGE, currentExpPage, (page) => {
            currentExpPage = page;
            renderExperience(lang);
            document.getElementById('experience').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    function renderSkills(lang) {
        const skillsGrid = document.getElementById('skills-grid');
        if (!skillsGrid) return;
        skillsGrid.innerHTML = '';

        // Pagination for skills
        const totalItems = skills.length;
        const startIndex = (currentSkillsPage - 1) * SKILLS_PER_PAGE;
        const pagedSkills = skills.slice(startIndex, startIndex + SKILLS_PER_PAGE);

        pagedSkills.forEach((skill, index) => {
            const category = lang === 'ar' ? skill.category_ar : skill.category_en;
            
            const skillItemsHTML = skill.items.map(item => `
                <div class="skill-progress-item">
                    <span>${item.name}</span>
                    <div class="progress-bar">
                        <div class="progress" style="--target-width: ${item.progress}; width: ${item.progress}"></div>
                    </div>
                </div>
            `).join('');

            const skillHTML = `
                <div class="skill-card reveal" style="animation-delay: ${index * 0.1}s">
                    <div class="skill-icon"><i class="${skill.icon}"></i></div>
                    <h3>${category}</h3>
                    <div class="skill-tags">
                        ${skillItemsHTML}
                    </div>
                </div>
            `;
            skillsGrid.insertAdjacentHTML('beforeend', skillHTML);
        });

        renderPaginationControls('skills-pagination', totalItems, SKILLS_PER_PAGE, currentSkillsPage, (page) => {
            currentSkillsPage = page;
            renderSkills(lang);
            document.getElementById('skills').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        // Trigger reveal observer for new cards
        const newReveals = skillsGrid.querySelectorAll('.reveal');
        newReveals.forEach(el => revealObserver.observe(el));
        
        // Refresh card cache for glow
        window.dispatchEvent(new Event('portfolioRender'));
    }

    // Function to get all portfolio context for the AI
    window.getPortfolioContext = function () {
        let context = "Mohamed Salah's Portfolio Context:\n\nProjects:\n";
        projects.forEach(p => {
            context += `- ${p.title_en}: ${p.desc_en} (Github: ${p.githubLink})\n`;
        });
        context += "\nCertifications:\n";
        certifications.forEach(c => {
            context += `- ${c.title_en} from ${c.issuer} (${c.date_en})\n`;
        });
        context += "\nProfessional Experience:\n";
        experience.forEach(e => {
            context += `- ${e.role_en} at ${e.company_en} (${e.date_en})\n`;
        });
        return context;
    };

    // Modal Logic encapsulated
    const modal = document.getElementById('unifiedModal');
    const modalContentContainer = document.getElementById('modal-dynamic-content');
    const closeBtn = document.querySelector('.close-modal');
    const cvModalBtn = document.getElementById('cv-modal-btn');

    function attachModalEvents() {
        document.querySelectorAll('.project-card, .open-project-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Determine source: If clicking a button inside a card, let the button handle it.
                // If clicking the card itself (not the button), use the card's data-id if available,
                // or find the first button inside it.
                let targetEl = btn;
                if (btn.classList.contains('project-card') && e.target.closest('button')) return; // let button handler run if present

                const card = btn.closest('.project-card') || btn;
                const modalBtn = card.querySelector('.open-project-modal');
                const projectId = parseInt(modalBtn?.getAttribute('data-id') || btn.getAttribute('data-id'));

                if (!projectId) return;
                const project = projects.find(p => p.id === projectId);
                if (!project) return;

                const lang = localStorage.getItem('lang') || 'en';
                const title = lang === 'ar' ? project.title_ar : project.title_en;
                const desc = lang === 'ar' ? project.desc_ar : project.desc_en;
                const ghText = lang === 'ar' ? 'الذهاب لـ GitHub' : 'View on GitHub';

                let mediaHTML = '';
                if (project.videoSrc) {
                    mediaHTML = `<video src="${project.videoSrc}" controls autoplay></video>`;
                } else if (project.thumbnail) {
                    mediaHTML = `<img src="${project.thumbnail}" alt="${title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1551288049-bebda4e38f71'">`;
                }

                const details = lang === 'ar' ? project.details_ar : project.details_en;
                const enhancements = lang === 'ar' ? project.enhancements_ar : project.enhancements_en;
                const enhTitle = lang === 'ar' ? 'التطويرات المستقبلية' : 'Future Enhancements';

                modalContentContainer.innerHTML = `
                    <h3>${title}</h3>
                    ${mediaHTML}
                    <div class="modal-project-details" style="margin-top:20px;">
                        <p style="font-size: 1rem; line-height: 1.6; color: var(--text-primary); margin-bottom: 15px;">${details || desc}</p>
                        
                        ${enhancements ? `
                        <div class="project-enhancements" style="background: rgba(0, 240, 255, 0.05); padding: 15px; border-left: 3px solid var(--accent-color); margin: 20px 0;">
                            <h4 style="color: var(--accent-color); margin-bottom: 10px;"><i class="fas fa-rocket"></i> ${enhTitle}</h4>
                            <p style="font-size: 0.9rem; color: var(--text-secondary);">${enhancements}</p>
                        </div>
                        ` : ''}

                        <div class="modal-actions" style="margin-top: 25px;">
                            ${project.githubLink ? `<a href="${project.githubLink}" target="_blank" class="btn btn-primary"><i class="fab fa-github"></i> ${ghText}</a>` : ''}
                        </div>
                    </div>
                `;

                showModal();
            });
        });

        document.querySelectorAll('.open-service-modal, .service-card').forEach(el => {
            el.addEventListener('click', (e) => {
                // If clicking the button, let the other listener handle it if needed, 
                // but actually we can handle both here reliably.
                const serviceId = el.getAttribute('data-id');
                if (!serviceId) return;

                // Prevent duplicate trigger if clicking the button inside the card
                if (el.classList.contains('service-card') && e.target.closest('button')) return;

                const service = services.find(s => s.id === serviceId);
                if (!service) return;

                const lang = localStorage.getItem('lang') || 'en';
                const title = lang === 'ar' ? service.title_ar : service.title_en;
                const details = lang === 'ar' ? service.details_ar : service.details_en;

                let linksHTML = service.links.map(link => {
                    const label = lang === 'ar' ? link.label_ar : link.label_en;
                    return `<a href="${link.url}" target="_blank" class="btn-service-link ${link.icon}">
                                <i class="${link.icon.includes('khamsat') ? 'fas fa-shopping-basket' : link.icon.includes('direct') ? 'fab fa-whatsapp' : 'fas fa-external-link-alt'}"></i> 
                                ${label}
                            </a>`;
                }).join('');

                modalContentContainer.innerHTML = `
                    <h3><i class="${service.icon}"></i> ${title}</h3>
                    <div class="modal-service-details" style="margin-top:20px; text-align:center;">
                        <p style="font-size: 1.1rem; line-height: 1.8; color: var(--text-primary);">${details}</p>
                        <div class="modal-actions">
                            ${linksHTML}
                        </div>
                    </div>
                `;

                showModal();
            });
        });
    }

    if (cvModalBtn) {
        cvModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = localStorage.getItem('lang') || 'en';
            const title = lang === 'ar' ? 'السيرة الذاتية (CV)' : 'Curriculum Vitae (CV)';
            const desc = lang === 'ar'
                ? 'جاري عرض وتحميل السيرة الذاتية الخاصة بـ محمد صلاح. شكراً لاهتمامك!'
                : 'Viewing and downloading Mohamed Salah\'s Resume. Thank you for your interest!';
            const dlText = lang === 'ar' ? 'تحميل' : 'Download';

            modalContentContainer.innerHTML = `
                <h3><i class="fas fa-file-alt"></i> ${title}</h3>
                <p style="margin-top:15px; margin-bottom: 20px;">${desc}</p>
                <div style="width: 100%; height: 65vh; border-radius: 12px; overflow: hidden; border: 1px solid var(--card-border); margin-bottom: 20px; background: rgba(0,0,0,0.1);">
                    <iframe src="Mohamed_Salah_Resume.pdf" width="100%" height="100%" style="border: none;"></iframe>
                </div>
                <div class="modal-actions">
                    <button id="download-cv-btn" class="btn btn-primary">
                        <i class="fas fa-download"></i> ${dlText}
                    </button>
                </div>
            `;
            showModal();

            // Direct download handler to bypass browser preview
            document.getElementById('download-cv-btn').addEventListener('click', async () => {
                const btn = document.getElementById('download-cv-btn');
                const originalContent = btn.innerHTML;

                try {
                    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ...`;
                    const response = await fetch('Mohamed_Salah_Resume.pdf');
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);

                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = 'Mohamed_Salah_Resume.pdf';
                    document.body.appendChild(a);
                    a.click();

                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                    btn.innerHTML = originalContent;
                } catch (error) {
                    console.error('Download failed:', error);
                    // Fallback to direct link if fetch fails
                    const link = document.createElement('a');
                    link.href = 'Mohamed_Salah_Resume.pdf';
                    link.download = 'Mohamed_Salah_Resume.pdf';
                    link.click();
                    btn.innerHTML = originalContent;
                }
            });
        });
    }

    const showModal = () => {
        modal.style.display = 'flex';
        void modal.offsetWidth;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeModal = () => {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore background scrolling
        setTimeout(() => {
            modal.style.display = 'none';
            // Stop video if any is playing when closed
            const video = modalContentContainer.querySelector('video');
            if (video) video.pause();
            modalContentContainer.innerHTML = '';
        }, 400);
    };

    closeBtn.addEventListener('click', closeModal);

    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            closeModal();
        }
    });

    // Translation Logic
    function applyTranslation(lang) {
        try {
            document.querySelectorAll('[data-en]').forEach(el => {
                const translation = el.getAttribute(`data-${lang}`);
                if (translation) {
                    // If it's a simple text element (no children), or specifically marked
                    if (el.children.length === 0 || el.hasAttribute('data-translate-inner')) {
                        el.textContent = translation;
                    } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                        el.placeholder = translation;
                    }
                }
            });

            // Direction Toggle
            const body = document.body;
            if (lang === 'ar') {
                body.classList.add('dir-rtl');
                body.classList.remove('dir-ltr');
                langBtn.textContent = 'EN';
                document.title = 'محمد صلاح';
            } else {
                body.classList.add('dir-ltr');
                body.classList.remove('dir-rtl');
                langBtn.textContent = 'AR';
                document.title = 'Mohamed Salah';
            }

            // Re-render Dynamic Sections Safely
            const renderSafe = (fn, name) => {
                try { if(typeof fn === 'function') fn(lang); } catch (e) { console.warn(`Render failed for ${name}:`, e); }
            };

            renderSafe(window.renderProjects, 'Projects');
            renderSafe(window.renderServices, 'Services');
            renderSafe(window.renderCertifications, 'Certifications');
            renderSafe(window.renderExperience, 'Experience');
            renderSafe(window.renderSkills, 'Skills');
            renderSafe(window.renderTestimonials, 'Testimonials');

            // Update Filter Buttons explicitly
            document.querySelectorAll('.filter-btn').forEach(btn => {
                const val = btn.getAttribute(`data-${lang}`);
                if (val) btn.textContent = val;
            });
        } catch (err) {
            console.error('Translation error:', err);
        }
    }

    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ar' : 'en';
        localStorage.setItem('lang', currentLang);
        applyTranslation(currentLang);

        // Re-initialize typing effect for the new language
        initTypingEffect();

        // Re-apply filter button labels
        if (window.initProjectFilter) window.initProjectFilter();

        // Notify chatbot of language change if it exists
        if (window.portfolioChatbot && typeof window.portfolioChatbot.updateTooltip === 'function') {
            window.portfolioChatbot.updateTooltip();
        }
    });

    // Initialize formatting based on saved theme and language
    applyTranslation(currentLang);

    // Set Copyright Year
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        // Close mobile menu when a nav link is clicked
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const icon = hamburger.querySelector('i');
                    if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-times');
                    }
                }
            });
        });
    }

    // Smooth Scrolling for Nav Links (adjusted)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // If it's a skill card, animate the progress bars
                if (entry.target.classList.contains('skill-card')) {
                    const bars = entry.target.querySelectorAll('.progress');
                    bars.forEach(bar => {
                        const targetWidth = bar.style.getPropertyValue('--target-width');
                        bar.style.width = targetWidth;
                    });
                }
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // Interactive Glass Glow Effect — throttled with RAF for performance
    let cachedCards = document.querySelectorAll('.project-card, .skill-card');
    const refreshCardCache = () => { cachedCards = document.querySelectorAll('.project-card, .skill-card'); };
    window.addEventListener('portfolioRender', refreshCardCache);

    let mouseMoveRAF = null;
    document.addEventListener('mousemove', (e) => {
        if (mouseMoveRAF) return;
        mouseMoveRAF = requestAnimationFrame(() => {
            cachedCards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
            mouseMoveRAF = null;
        });
    });

    // ── Typing Effect ──────────────────────────────────
    let typingTimer;
    function initTypingEffect() {
        if (typingTimer) clearTimeout(typingTimer);
        const titleSpan = document.querySelector('.title span[data-en]');
        const descSpan = document.querySelector('.hero-desc span:not(.typed-cursor)');
        if (!titleSpan || !descSpan) return;

        const lang = localStorage.getItem('lang') || 'en';
        
        const titlePhrases = lang === 'ar'
            ? [
                'محلل بيانات',
                'أخصائي ذكاء أعمال',
                'مطور حلول ذكاء اصطناعي'
              ]
            : [
                'Data Analyst',
                'BI Specialist',
                'AI Solutions Developer'
              ];
            
        const descText = lang === 'ar'
            ? 'محلل بيانات أركز على تحقيق النتائج، بخبرة تزيد عن 3 سنوات في قطاعات متعددة. أطور حلول متكاملة لذكاء الأعمال، وأنظمة معالجة البيانات (ETL)، وأطر عمل لتحسين مؤشرات الأداء (KPIs) لدعم اتخاذ القرارات الإدارية بدقة.'
            : 'Results-driven Data Analyst with 3+ years of cross-industry experience delivering end-to-end business intelligence solutions, ETL pipelines, and KPI optimization frameworks that drive measurable executive decision-making.';

        let titleIdx = 0, charIdx = 0, isDeleting = false;
        let isTypingDesc = false, descCharIdx = 0;
        let descDone = false;

        function type() {
            if (!isTypingDesc) {
                // Typing Title
                const current = titlePhrases[titleIdx];
                if (isDeleting) {
                    titleSpan.textContent = current.substring(0, charIdx - 1);
                    charIdx--;
                } else {
                    titleSpan.textContent = current.substring(0, charIdx + 1);
                    charIdx++;
                }

                if (!isDeleting && charIdx === current.length) {
                    // Title done — pause, then either type description or delete
                    if (!descDone && titleIdx === 0) {
                        // First time: type description
                        isTypingDesc = true;
                        typingTimer = setTimeout(type, 1500);
                    } else {
                        // Already typed desc — just wait then delete
                        isDeleting = true;
                        typingTimer = setTimeout(type, 2200);
                    }
                    return;
                }
                
                if (isDeleting && charIdx === 0) {
                    isDeleting = false;
                    titleIdx = (titleIdx + 1) % titlePhrases.length;
                    typingTimer = setTimeout(type, 400);
                    return;
                }
                typingTimer = setTimeout(type, isDeleting ? 18 : 32);
            } else {
                // Typing Description (One-time, fast)
                descCharIdx += 4; // Type 4 characters at once
                if (descCharIdx > descText.length) descCharIdx = descText.length;
                descSpan.textContent = descText.substring(0, descCharIdx);
                
                if (descCharIdx === descText.length) {
                    descDone = true;
                    isTypingDesc = false;
                    isDeleting = true; // Start deleting the title
                    typingTimer = setTimeout(type, 2000);
                    return;
                }
                typingTimer = setTimeout(type, 5);
            }
        }


        // Reset spans
        titleSpan.textContent = '';
        descSpan.textContent = '';
        typingTimer = setTimeout(type, 1000);
    }

    // --- High-End Interactivity: 3D Card Tilt ---
    function initTiltEffect() {
        const cards = document.querySelectorAll('.project-card, .service-card, .skill-card, .stat-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        });
    }

    // --- High-End Interactivity: Magnetic Elements ---
    function initMagneticElements() {
        const magneticEls = document.querySelectorAll('.social-links-hero a, .navbar-brand, .btn-primary, .theme-btn');
        
        magneticEls.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.transform = `translate(0, 0)`;
            });
        });
    }

    // --- NEW: Dynamic Neural Connectivity (Particles) Background ---

    function initNeuralBackground() {
        const canvas = document.getElementById('data-flow-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        let particles = [];
        // تقليل عدد الجسيمات بنسبة 50% لتخفيف الضغط على CPU/GPU
        const particleCount = Math.min(Math.floor((width * height) / 30000), 50);
        const connectionDistance = 140;
        const mouseRadius = 180;

        let mouse = { x: null, y: null };
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }

            update() {
                // Return to original flow if mouse is away
                this.x += this.vx;
                this.y += this.vy;

                // Mouse interaction (gentle attraction)
                if (mouse.x !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouseRadius) {
                        this.x += dx * 0.01;
                        this.y += dy * 0.01;
                    }
                }

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                const isLightMode = document.documentElement.classList.contains('light');
                // توحيد الألوان مع الثيم: ذهبي في Dark ، Teal في Light
                ctx.fillStyle = isLightMode ? 'rgba(13, 148, 136, 0.5)' : 'rgba(212, 175, 55, 0.5)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function init() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        const connectionDistanceSq = connectionDistance * connectionDistance;

        let lastTime = 0;
        const fpsInterval = 1000 / 30; // 30 FPS throttle
        let animationId = null;
        let isVisible = true;

        const observer = new IntersectionObserver((entries) => {
            isVisible = entries[0].isIntersecting;
            if (isVisible && !animationId) {
                animationId = requestAnimationFrame(animate);
            }
        }, { threshold: 0.01 });
        observer.observe(canvas);

        function animate(timestamp) {
            if (document.hidden || !isVisible) {
                animationId = null;
                return;
            }

            if (!timestamp) timestamp = performance.now();
            const elapsed = timestamp - lastTime;

            if (elapsed < fpsInterval) {
                animationId = requestAnimationFrame(animate);
                return;
            }
            
            lastTime = timestamp - (elapsed % fpsInterval);

            const isLightMode = document.documentElement.classList.contains('light');
            ctx.clearRect(0, 0, width, height);

            const time = Date.now() * 0.002;

            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                p1.update();
                p1.draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < connectionDistanceSq) {
                        const dist = Math.sqrt(distSq);
                        const opacity = (1 - dist / connectionDistance) * 0.4;

                        ctx.beginPath();
                        ctx.lineWidth = (Math.sin(time + i + j) > 0.98) ? 1.2 : 0.5;
                        ctx.strokeStyle = (ctx.lineWidth > 1)
                            ? `rgba(212, 175, 55, ${opacity * 2})`
                            : (isLightMode ? `rgba(13, 148, 136, ${opacity})` : `rgba(212, 175, 55, ${opacity})`);

                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }
            animationId = requestAnimationFrame(animate);
        }

        // إعادة تشغيل الحلقة عند العودة للتب
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) animate();
        });

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            init();
        });

        init();
        animate();
    }
    // --- Letter Glitch Background ---
    function initLetterGlitch(containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const glitchColors = options.glitchColors || ['#10b981', '#047857', '#a7f3d0'];
        const glitchSpeed = options.glitchSpeed || 50;
        const centerVignette = options.centerVignette !== undefined ? options.centerVignette : false;
        const outerVignette = options.outerVignette !== undefined ? options.outerVignette : true;
        const smooth = options.smooth !== undefined ? options.smooth : true;
        const characters = options.characters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789';

        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.overflow = 'hidden';
        container.style.zIndex = '0';
        container.style.opacity = '0.2'; // Subtle background

        const canvas = document.createElement('canvas');
        canvas.style.display = 'block';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        container.appendChild(canvas);

        if (outerVignette) {
            const ov = document.createElement('div');
            ov.className = 'letter-glitch-outer';
            container.appendChild(ov);
        }

        if (centerVignette) {
            const cv = document.createElement('div');
            cv.className = 'letter-glitch-center';
            container.appendChild(cv);
        }

        const context = canvas.getContext('2d');
        const lettersAndSymbols = Array.from(characters);
        let letters = [];
        let grid = { columns: 0, rows: 0 };
        let lastGlitchTime = Date.now();
        let animationId;

        const fontSize = 16;
        const charWidth = 10;
        const charHeight = 20;

        const getRandomChar = () => lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
        const getRandomColor = () => glitchColors[Math.floor(Math.random() * glitchColors.length)];

        const hexToRgb = hex => {
            const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        };

        const interpolateColor = (start, end, factor) => {
            const result = {
                r: Math.round(start.r + (end.r - start.r) * factor),
                g: Math.round(start.g + (end.g - start.g) * factor),
                b: Math.round(start.b + (end.b - start.b) * factor)
            };
            return `rgb(${result.r}, ${result.g}, ${result.b})`;
        };

        const calculateGrid = (width, height) => {
            const columns = Math.ceil(width / charWidth);
            const rows = Math.ceil(height / charHeight);
            return { columns, rows };
        };

        const initializeLetters = (columns, rows) => {
            grid = { columns, rows };
            const totalLetters = columns * rows;
            letters = Array.from({ length: totalLetters }, () => {
                const color = getRandomColor();
                return {
                    char: getRandomChar(),
                    color: color,
                    colorRgb: hexToRgb(color),
                    targetColor: color,
                    targetColorRgb: hexToRgb(color),
                    colorProgress: 1
                };
            });
        };

        const drawLetters = () => {
            if (!context || letters.length === 0) return;
            const width = canvas.width / (window.devicePixelRatio || 1);
            const height = canvas.height / (window.devicePixelRatio || 1);
            context.clearRect(0, 0, width, height);
            context.font = `${fontSize}px monospace`;
            context.textBaseline = 'top';

            letters.forEach((letter, index) => {
                const x = (index % grid.columns) * charWidth;
                const y = Math.floor(index / grid.columns) * charHeight;
                context.fillStyle = letter.color;
                context.fillText(letter.char, x, y);
            });
        };

        const updateLetters = () => {
            if (letters.length === 0) return;
            const updateCount = Math.max(1, Math.floor(letters.length * 0.05));

            for (let i = 0; i < updateCount; i++) {
                const index = Math.floor(Math.random() * letters.length);
                if (!letters[index]) continue;

                letters[index].char = getRandomChar();
                const newTarget = getRandomColor();
                letters[index].targetColor = newTarget;
                letters[index].targetColorRgb = hexToRgb(newTarget);

                if (!smooth) {
                    letters[index].color = newTarget;
                    letters[index].colorRgb = letters[index].targetColorRgb;
                    letters[index].colorProgress = 1;
                } else {
                    letters[index].colorProgress = 0;
                    // Keep the current color as startRgb
                }
            }
        };

        const handleSmoothTransitions = () => {
            let needsRedraw = false;
            for (let i = 0; i < letters.length; i++) {
                const letter = letters[i];
                if (letter.colorProgress < 1) {
                    letter.colorProgress += 0.05;
                    if (letter.colorProgress >= 1) {
                        letter.colorProgress = 1;
                        letter.color = letter.targetColor;
                        letter.colorRgb = letter.targetColorRgb;
                    } else {
                        const currentRgb = hexToRgb(letter.color);
                        if (currentRgb && letter.targetColorRgb) {
                            letter.color = interpolateColor(currentRgb, letter.targetColorRgb, 0.1); // Smooth toward target
                        }
                    }
                    needsRedraw = true;
                }
            }

            if (needsRedraw) {
                drawLetters();
            }
        };

        let isVisible = true;
        const observer = new IntersectionObserver((entries) => {
            isVisible = entries[0].isIntersecting;
            if (isVisible && !animationId) {
                animationId = requestAnimationFrame(animate);
            }
        }, { threshold: 0.01 });
        observer.observe(canvas);

        const animate = () => {
            if (document.hidden || !isVisible) {
                animationId = null;
                return;
            }

            const now = Date.now();
            if (now - lastGlitchTime >= glitchSpeed) {
                updateLetters();
                drawLetters();
                lastGlitchTime = now;
            }

            if (smooth) {
                handleSmoothTransitions();
            }
            animationId = requestAnimationFrame(animate);
        };

        let resizeTimeout;
        const resizeCanvas = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = container.getBoundingClientRect();

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;

            if (context) {
                context.setTransform(dpr, 0, 0, dpr, 0, 0);
            }

            const { columns, rows } = calculateGrid(rect.width, rect.height);
            initializeLetters(columns, rows);
            drawLetters();
        };

        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                cancelAnimationFrame(animationId);
                resizeCanvas();
                animate();
            }, 100);
        };

        window.addEventListener('resize', handleResize);
        resizeCanvas();
        animate();
    }

    // --- Background Parallax Effect ---
    function initParallax() {
        if (window.matchMedia("(max-width: 768px)").matches) return;
        
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX - window.innerWidth / 2) / 70;
            const y = (e.clientY - window.innerHeight / 2) / 70;
            
            document.documentElement.style.setProperty('--bg-x', `${-x}px`);
            document.documentElement.style.setProperty('--bg-y', `${-y}px`);
        });
    }

    // --- Professional Lagging Cursor Logic ---
    function initCustomCursor() {
        const cursor = document.getElementById('custom-cursor');
        const dot = cursor.querySelector('.cursor-dot');
        const ring = cursor.querySelector('.cursor-ring');
        
        if (!cursor || window.matchMedia("(max-width: 768px)").matches) return;

        let mouseX = 0, mouseY = 0;
        let dotX = 0, dotY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // For CSS glow effects on cards
            document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
        });

        const animateCursor = () => {
            const lerp = (a, b, n) => (1 - n) * a + n * b;
            
            // Dot follows almost instantly
            dotX = lerp(dotX, mouseX, 0.3);
            dotY = lerp(dotY, mouseY, 0.3);
            
            // Ring lags behind (the "circle under the arrow" effect)
            ringX = lerp(ringX, mouseX, 0.12);
            ringY = lerp(ringY, mouseY, 0.12);

            if (dot) dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
            if (ring) ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
            
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Hover states - Premium selection of interactive elements
        const interactiveElements = 'a, button, .project-card, .service-card, .skill-card, .play-overlay, .social-links-hero a, .control-btn';
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(interactiveElements)) {
                cursor.classList.add('hover');
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(interactiveElements)) {
                cursor.classList.remove('hover');
            }
        });

        // Click animation
        document.addEventListener('mousedown', () => {
            cursor.classList.add('active');
            const ping = document.createElement('div');
            ping.className = 'cursor-ping';
            ping.style.left = `${mouseX}px`;
            ping.style.top = `${mouseY}px`;
            document.body.appendChild(ping);
            setTimeout(() => ping.remove(), 600);
        });
        document.addEventListener('mouseup', () => {
            cursor.classList.remove('active');
        });
    }
    // --- Squares Background for Skills ---
    function initSquaresBackground(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const sectionContainer = container.querySelector('.section-container');
        if (sectionContainer) {
            sectionContainer.style.position = 'relative';
            sectionContainer.style.zIndex = '1';
        }

        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '0';
        canvas.style.pointerEvents = 'none';
        
        container.style.position = 'relative';
        container.style.overflow = 'hidden';
        container.insertBefore(canvas, container.firstChild);

        const ctx = canvas.getContext('2d');
        const squareSize = 60;
        const squares = new Map();

        const resize = () => {
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        };
        resize();
        window.addEventListener('resize', resize);

        container.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const gridX = Math.floor(x / squareSize);
            const gridY = Math.floor(y / squareSize);
            squares.set(`${gridX},${gridY}`, 1.0);
        });



        let isVisible = true;
        let animationId = null;
        const observer = new IntersectionObserver((entries) => {
            isVisible = entries[0].isIntersecting;
            if (isVisible && !animationId) {
                animationId = requestAnimationFrame(animate);
            }
        }, { threshold: 0.01 });
        observer.observe(canvas);

        const animate = () => {
            if (document.hidden || !isVisible) {
                animationId = null;
                return;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.04)';
            ctx.lineWidth = 1;
            const cols = Math.ceil(canvas.width / squareSize);
            const rows = Math.ceil(canvas.height / squareSize);

            for (let x = 0; x <= cols; x++) {
                ctx.beginPath();
                ctx.moveTo(x * squareSize, 0);
                ctx.lineTo(x * squareSize, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y <= rows; y++) {
                ctx.beginPath();
                ctx.moveTo(0, y * squareSize);
                ctx.lineTo(canvas.width, y * squareSize);
                ctx.stroke();
            }

            for (const [key, opacity] of squares.entries()) {
                if (opacity <= 0) {
                    squares.delete(key);
                    continue;
                }
                const [gx, gy] = key.split(',').map(Number);
                ctx.fillStyle = `rgba(16, 185, 129, ${opacity * 0.12})`;
                ctx.fillRect(gx * squareSize, gy * squareSize, squareSize, squareSize);
                squares.set(key, opacity - 0.015);
            }
            animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    // --- Hyperspeed Background for Projects ---
    function initHyperspeedBackground(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const sectionContainer = container.querySelector('.section-container');
        if (sectionContainer) {
            sectionContainer.style.position = 'relative';
            sectionContainer.style.zIndex = '1';
        }

        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '0';
        canvas.style.pointerEvents = 'none';
        
        container.style.position = 'relative';
        container.style.overflow = 'hidden';
        container.insertBefore(canvas, container.firstChild);

        const ctx = canvas.getContext('2d');
        const stars = [];
        // تقليل عدد النجوم لتخفيف الضغط
        const numStars = window.innerWidth < 768 ? 60 : 100;
        const speed = 2.5;

        const resize = () => {
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        };
        resize();
        window.addEventListener('resize', resize);

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width - canvas.width / 2,
                y: Math.random() * canvas.height - canvas.height / 2,
                z: Math.random() * canvas.width,
                pz: Math.random() * canvas.width
            });
        }



        let isVisible = true;
        let animationId = null;
        const observer = new IntersectionObserver((entries) => {
            isVisible = entries[0].isIntersecting;
            if (isVisible && !animationId) {
                animationId = requestAnimationFrame(animate);
            }
        }, { threshold: 0.01 });
        observer.observe(canvas);

        const animate = () => {
            if (document.hidden || !isVisible) {
                animationId = null;
                return;
            }
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            const isLight = document.documentElement.classList.contains('light');
            ctx.fillStyle = isLight ? 'rgba(244, 244, 249, 0.3)' : 'rgba(9, 10, 15, 0.3)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < numStars; i++) {
                let star = stars[i];
                star.z -= speed;

                if (star.z <= 0) {
                    star.x = Math.random() * canvas.width - centerX;
                    star.y = Math.random() * canvas.height - centerY;
                    star.z = canvas.width;
                    star.pz = star.z;
                }

                let sx = (star.x / star.z) * canvas.width + centerX;
                let sy = (star.y / star.z) * canvas.height + centerY;
                let px = (star.x / star.pz) * canvas.width + centerX;
                let py = (star.y / star.pz) * canvas.height + centerY;

                star.pz = star.z;

                const distSq = (sx - centerX) * (sx - centerX) + (sy - centerY) * (sy - centerY);
                const maxDistSq = centerX * centerX + centerY * centerY;
                const brightness = Math.min(1, distSq / (maxDistSq * 0.15));

                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(sx, sy);
                ctx.strokeStyle = `rgba(16, 185, 129, ${brightness * 0.6})`;
                ctx.lineWidth = 2.0;
                ctx.stroke();
            }
            animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    // --- Liquid Flow Background for Contact ---
    function initLiquidFlowBackground(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const sectionContainer = container.querySelector('.section-container');
        if (sectionContainer) {
            sectionContainer.style.position = 'relative';
            sectionContainer.style.zIndex = '1';
        }

        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.opacity = '0.4';
        
        container.style.position = 'relative';
        container.style.overflow = 'hidden';
        container.insertBefore(canvas, container.firstChild);

        const ctx = canvas.getContext('2d');
        const blobs = [
            { x: 0.2, y: 0.2, vx: 0.0008, vy: 0.0012, r: 0.4, color: '16, 185, 129' },
            { x: 0.8, y: 0.8, vx: -0.0012, vy: -0.0008, r: 0.5, color: '5, 150, 105' },
            { x: 0.5, y: 0.5, vx: 0.001, vy: -0.001, r: 0.45, color: '110, 231, 183' }
        ];

        const resize = () => {
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        };
        resize();
        window.addEventListener('resize', resize);

        const animate = () => {
            if (document.hidden || !isVisible) {
                animationId = null;
                return;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const isLight = document.documentElement.classList.contains('light');
            ctx.globalCompositeOperation = isLight ? 'source-over' : 'screen';

            for (let b of blobs) {
                b.x += b.vx;
                b.y += b.vy;
                if (b.x < -0.2 || b.x > 1.2) b.vx *= -1;
                if (b.y < -0.2 || b.y > 1.2) b.vy *= -1;

                const radius = b.r * Math.max(canvas.width, canvas.height);
                const cx = b.x * canvas.width;
                const cy = b.y * canvas.height;

                const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
                gradient.addColorStop(0, `rgba(${b.color}, 0.7)`);
                gradient.addColorStop(1, `rgba(${b.color}, 0)`);

                ctx.beginPath();
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            }
            ctx.globalCompositeOperation = 'source-over';
            animationId = requestAnimationFrame(animate);
        };

        let isVisible = true;
        let animationId = null;
        const observer = new IntersectionObserver((entries) => {
            isVisible = entries[0].isIntersecting;
            if (isVisible && !animationId) {
                animationId = requestAnimationFrame(animate);
            }
        }, { threshold: 0.01 });
        observer.observe(canvas);
        animate();
    }

    // Expose functions to window for callback access
    window.renderProjects = renderProjects;
    window.renderServices = renderServices;
    window.renderCertifications = renderCertifications;
    window.renderExperience = renderExperience;
    window.renderSkills = renderSkills;
    window.renderTestimonials = renderTestimonials;
    window.applyTranslation = applyTranslation;

    // Final Initialization Sequence
    initTestimonials();
    initCustomCursor();
    // فحص الموبايل والحركة المخففة قبل تشغيل Letter Glitch
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobileDevice = window.innerWidth < 768;
    if (!isReducedMotion && !isMobileDevice) {
        initLetterGlitch('letter-glitch-container', {
            glitchColors: ['#10b981', '#34d399', '#6ee7b7'],
            glitchSpeed: 50,
            centerVignette: false,
            outerVignette: true,
            smooth: true
        });
    }
    
    initNeuralBackground();
    initTypingEffect();
    initParallax();
    updateDynamicStats();

    // تأخير تشغيل التأثيرات الثقيلة لتجنّب تعطيل الرسم الأول
    setTimeout(() => {
        if (!isMobileDevice) {
            initSquaresBackground('skills');
            initHyperspeedBackground('projects');
            initLiquidFlowBackground('contact');
        }
        initTiltEffect();
        initMagneticElements();
    }, 900);

    // Initial translation and render
    applyTranslation(currentLang);
});

// ─── Scroll Progress Bar (Optimized) ──────────────────────────
(function() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                bar.style.width = pct + '%';
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();