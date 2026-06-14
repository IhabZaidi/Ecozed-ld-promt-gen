import { useState, useRef } from "react";

const genders = [
  { value: "man", label: "رجل" },
  { value: "woman", label: "امرأة" },
];

const defaultReviews = [{ text: "", gender: "man" }];

const promptStyles = [
  { id: "default", label: "افتراضي" },
  { id: "flashSale", label: "تخفيضات وسرعة" },
  { id: "storytelling", label: "سرد قصصي" },
  { id: "luxury", label: "فخامة" },
  { id: "pas", label: "مشكلة وحل" },
  { id: "comparison", label: "مقارنة" },
];

function App() {
  const [mode, setMode] = useState("advanced");
  const [language, setLanguage] = useState("");
  const [offerType, setOfferType] = useState("single");
  const [productName, setProductName] = useState("");
  const [benefits, setBenefits] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [price, setPrice] = useState("");
  const [theme, setTheme] = useState("");
  const [reviews, setReviews] = useState(defaultReviews);
  const [productUrl, setProductUrl] = useState("");
  const [fastLanguage, setFastLanguage] = useState("");
  const [fastPrice, setFastPrice] = useState("");
  const [fastAdditionalInfo, setFastAdditionalInfo] = useState("");
  const [abTest, setAbTest] = useState(false);
  const [noHumans, setNoHumans] = useState(true);
  const [menOnly, setMenOnly] = useState(true);
  const [forceLanguage, setForceLanguage] = useState(true);
  const [style, setStyle] = useState("default");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const outputRef = useRef(null);

  const humanConstraint = () => {
    if (noHumans) return "8. HUMAN RESTRICTION: Do NOT generate any humans, people, characters, or silhouettes in the design. Use only product imagery, icons, abstract graphics, and lifestyle elements without people.";
    if (menOnly) return "8. HUMAN RESTRICTION: If including humans in the design, ONLY include men. Do NOT generate any women, female figures, or feminine silhouettes under any circumstances.";
    return "";
  };

  const langForce = (language) => {
    if (!forceLanguage) return "";
    return `\n${humanConstraint() ? "9" : "8"}. LANGUAGE ENFORCEMENT: ALL text displayed in the design MUST be written strictly in ${language}. Absolutely NO text in any other language is allowed. Every headline, label, button, and caption must be in ${language}.`;
  };

  const updateReview = (index, field, value) => {
    setReviews((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addReview = () => {
    setReviews((prev) => [...prev, { text: "", gender: "man" }]);
  };

  const removeReview = (index) => {
    setReviews((prev) => prev.filter((_, i) => i !== index));
  };

  const buildAdvancedPrompt = () => {
    if (!language.trim()) return "يرجى ملء حقل لغة الجمهور المستهدف";
    if (!productName.trim()) return "يرجى ملء حقل الاسم التجاري للمنتج";
    if (!benefits.trim()) return "يرجى ملء حقل أبرز الفوائد والخصائص";
    if (!price.trim()) return "يرجى ملء حقل سعر البيع";

    const dynamicColors = theme.trim() || "ألوان عصرية نابضة بالحياة";
    const productRef = offerType === "bundle" ? "المنتجات / الحزمة" : "المنتج";
    const hasReviews = reviews.some((r) => r.text.trim());

    const reviewBlock = hasReviews
      ? reviews
          .filter((r) => r.text.trim())
          .map((r) => {
            const avatar = r.gender === "man" ? "[صورة رمزية لرجل]" : "[صورة رمزية لامرأة]";
            return `* ${avatar} Medium Black Text: "${r.text.trim()}"`;
          })
          .join("\n")
      : "* [صورة رمزية لزبون] Medium Black Text: \"[تجربة رائعة! منتج ممتاز وسريع في النتائج]\"";

    return buildNanoBananaPrompt({
      language,
      productRef,
      dynamicColors,
      reviewBlock,
      price,
      styleId: style,
      abTest,
    });
  };

  const buildFastPrompt = () => {
    if (!productUrl.trim()) return "يرجى ملء رابط صفحة المنتج";
    if (!fastLanguage.trim()) return "يرجى ملء حقل لغة الجمهور المستهدف";
    if (!fastPrice.trim()) return "يرجى ملء حقل سعر البيع";

    const flow = designFlows[style] || designFlows.default;
    const designFlow = flow({ language: fastLanguage, dynamicColors: "[use colors extracted from the product page]", price: fastPrice, reviewBlock: "[Use extracted customer reviews here. If none found, use a generic positive review.]" });

    return `### YOUR TASK INVOLVES THREE MAIN PHASES:

### PHASE 1: PRODUCT INFORMATION EXTRACTION
Browse and scrape the product page at the following URL:
${productUrl}

Extract ALL of the following product details from the page:
- Product name
- Offer type (single item or bundle/pack)
- Main benefits and features / bullet points
- Product price (user stated price: ${fastPrice})
- Color scheme, theme, and visual style of the page
- Product dimensions / sizes if available
- Any customer reviews, ratings, or testimonials
- The overall vibe and target audience of the product
${fastAdditionalInfo.trim() ? `- EXTRA CONTEXT FROM USER: ${fastAdditionalInfo.trim()}` : ""}
${abTest ? "\nIMPORTANT: After extraction, study TWO different marketing angles for this product and generate SEPARATE prompts for each angle. Label clearly as VERSION A and VERSION B with the angle name." : ""}

### PHASE 2: PERSUASIVE COPYWRITING
Using the extracted information from Phase 1, craft compelling sales copy for this product using the structure outlined below. Provide this text clearly so I can review and utilize it.
CRITICAL LANGUAGE INSTRUCTION: ALL copywriting in Phase 2 MUST be strictly written in ${fastLanguage}.

### PHASE 3: NANO BANANA PRO DESIGN PROMPT
After writing the copy, generate ${abTest ? "TWO separate, distinct" : "a single, unified,"} READY-TO-USE design prompt${abTest ? "s" : ""} for the image generator.${abTest ? "\nEach prompt must follow a different marketing angle (e.g. one emotional, one logical/feature-focused). Enclose each prompt in its own code block and label clearly as VERSION A - [angle] and VERSION B - [angle]." : ""}

---
### STRICT GUIDELINES FOR PHASE 3:
1. Format: Enclose the complete design prompt within a single code block.
2. Product Integration: Visually describe the product in every section. Ensure the layout accommodates either a single item or a grouped bundle based on context.
3. CRITICAL: Use the exact same product with all its visual details as shown in the attached image — do not alter or substitute the product design, packaging, or branding.
4. Visual Elements: Include vivid, creative English descriptions for the visuals based on the image and the extracted page design.
5. Typography: ALL localized text MUST be displayed in massive, ultra-bold typography (20px minimum equivalent). ONLY output the generated ${fastLanguage} text inside quotation marks " ". DO NOT output English structural labels like (Headline, Body).
6. Final Cleanup: Replace all [bracketed placeholders] with your generated ${fastLanguage} text and strip out all structural labels.
7. Text Direction: Ensure the layout logic fits the requested language.
${humanConstraint()}${langForce(fastLanguage)}

--- DESIGN PROMPT TEMPLATE ---
Act as an expert E-commerce UI/UX Designer. Create an ultra-tall vertical infographic landing page IMAGE (aspect ratio 9:32 or longer) featuring the extracted product/bundle from the provided URL.
CRITICAL RULE: DO NOT write HTML/CSS. Generate a purely visual, seamless graphic IMAGE.

DESIGN & FLOW INSTRUCTIONS:
Build a continuous visual narrative utilizing smooth gradients (specifically [use colors extracted from the product page]) and sleek kinetic lines. Avoid harsh dividers. Use a dynamic background that fits the product vibe extracted from the page. Showcase the product frequently.
${designFlow}`;
  };

  const designFlows = {
    default: ({ language, dynamicColors, price, reviewBlock }) => `
* Dynamic background with glowing particles. Product is front and center. Small Yellow Label: "[Best Seller أو New Arrival - ${language}]"
* MASSIVE WHITE BOLD TEXT: "[عنوان رئيسي جذاب يجذب الانتباه - ${language}]"
* Large Text: "[جملة تسلط الضوء على الفائدة الأساسية - ${language}]"

* Smooth fade into a darker/muted zone. Color shift with problem/pain-point icons. Large Bold Red Text: "[سؤال يستهدف نقطة الألم لدى العميل - ${language}]"
* Medium Black Text: "[وصف مختصر للمشكلة - ${language}]"

* Bright light burst transitioning to a pristine background. Product emerges with a glowing aura. MASSIVE BOLD COLORED TEXT: "[عنوان يقدم المنتج كحل نهائي - ${language}]"
* Large Black Text: "[جملة تؤكد فعالية الحل - ${language}]"

* Split screen layout showing a stark contrast. Left side is dark/gloomy depicting [describe problem]. Right side is vibrant/bright depicting [describe resolution]. LARGE BOLD COLORED TEXT: "[عنوان يقارن قبل وبعد - ${language}]"
* Medium Red Text: "❌ [وصف قصير للمعاناة - ${language}]"
* Medium Green Text: "✅ [وصف قصير للنتيجة/الراحة - ${language}]"

* Extreme close-up highlighting [describe key feature]. Glowing highlights. LARGE BOLD COLORED TEXT: "[عنوان لأهم ميزة في المنتج - ${language}]"
* Large Black Text: "[شرح تسويقي للميزة - ${language}]"

* Two-column comparison. Left is our glowing PRODUCT. Right is a dull competitor. LARGE BOLD COLORED TEXT: "[عنوان يثبت التفوق - ${language}]"
* Medium Green Text: "✔️ [الميزة الأولى للمنتج - ${language}]\\n✔️ [الميزة الثانية للمنتج - ${language}]"
* Medium Red Text: "❌ [عيب المنافس الأول - ${language}]\\n❌ [عيب المنافس الثاني - ${language}]"

* Lifestyle shot illustrating [scene of product in use]. LARGE BOLD COLORED TEXT: "[عنوان يبرز الاستخدام اليومي - ${language}]"
* Large Black Text: "[كيف يغير المنتج حياة المستخدم - ${language}]"

* 5 glowing stars ★★★★★ centered with user avatars. LARGE BOLD BLACK TEXT: "[آراء عملائنا - ${language}]"
${reviewBlock}

* Strong, high-contrast footer. Product prominently displayed near the CTA. LARGE BOLD TEXT: "[${price}]"
* Large White Bold Text: "⚠️ [المخزون ينفذ بسرعة، اطلب الآن! - ${language}]"
* MASSIVE BLACK TEXT on YELLOW Button: "[اطلب الآن - الدفع عند الاستلام - ${language}]"`,

    flashSale: ({ language, dynamicColors, price, reviewBlock }) => `
* High-energy flash sale background with exploding countdown timer and fire particles. Product highlighted with a pulsing neon border. Small Red Label with lightning icon: "[تخفيضات حصرية - ${language}]"
* MASSIVE WHITE BOLD TEXT WITH RED STROKE: "[عرض خاطف! بوقت محدود! - ${language}]"
* Large Text: "[خصم هائل لفترة محدودة فقط - ${language}]"

* Urgency zone. Dark background with pulsing red timer graphics. Large Bold White Text on Red Banner: "[لم يتبق سوى القليل! - ${language}]"
* Medium White Text: "[الكمية محدودة - اطلب الآن قبل نفاد المخزون - ${language}]"

* Bright flash transition. Product surrounded by floating discount badges and percentage tags. MASSIVE BOLD COLORED TEXT: "[لا تفوت هذه الفرصة! - ${language}]"
* Large Black Text: "[عرض خاص لفترة محدودة مع شحن مجاني - ${language}]"

* High-contrast split. Left shows old price crossed out in red. Right shows new low price in glowing green. LARGE BOLD COLORED TEXT: "[كان بـ [price_old] .. والآن بـ [price_new] - ${language}]"
* Medium Red Text: "❌ [السعر القديم المرتفع - ${language}]"
* Medium Green Text: "✅ [السعر الجديد المخفض + هدية مجانية - ${language}]"

* Extreme close-up highlighting [describe key feature] with sparkle effects. LARGE BOLD COLORED TEXT: "[أفضل ميزة تجعله لا يُقاوم - ${language}]"
* Large Black Text: "[شرح الميزة مع التأكيد على القيمة مقابل السعر - ${language}]"

* Dynamic before/after price comparison. PRODUCT on sale vs competitor regular price. LARGE BOLD COLORED TEXT: "[أفضل سعر في السوق - ${language}]"
* Medium Green Text: "✔️ [توفير يصل إلى 50% - ${language}]\\n✔️ [جودة عالية بسعر المصنع - ${language}]"
* Medium Red Text: "❌ [المنافسون يبيعون بسعر مضاعف - ${language}]\\n❌ [عروض وهمية بدون ضمان - ${language}]"

* Lifestyle shot showing happy customer with purchase. LARGE BOLD COLORED TEXT: "[احصل عليه الآن واستمتع بالتوفير - ${language}]"
* Large Black Text: "[توصيل سريع ودفع عند الاستلام - ${language}]"

* 5 glowing ★★★★★ with verified purchase badges. LARGE BOLD BLACK TEXT: "[ماذا قال المشترين؟ - ${language}]"
${reviewBlock}

* Footer with flashing CTA. Product near the button. LARGE BOLD RED TEXT: "[🔥 ${price} فقط لفترة محدودة 🔥]"
* Large White Bold Text: "⏰ [العرض ينتهي قريباً! - ${language}]"
* MASSIVE BLACK TEXT on ORANGE Button with glow: "[اطلب الآن بسعر التخفيض - ${language}]"`,

    storytelling: ({ language, dynamicColors, price, reviewBlock }) => `
* Cinematic opening. Warm gradient background. Product placed like a hero in a movie scene. Small Gold Label: "[قصة نجاح - ${language}]"
* MASSIVE WHITE BOLD TEXT WRITTEN LIKE A BOOK TITLE: "[رحلة التحول التي ستغير حياتك - ${language}]"
* Medium Text with narrative tone: "[اكتشف كيف تغلب الآلاف على [المشكلة] بفضل هذا المنتج الثوري - ${language}]"

* Dark cinematic fade with silhouette of a sad person. Soft dramatic lighting. Large Bold White Text: "[كان يوماً ما... - ${language}]"
* Medium White Text: "[قصة شخص كان يعاني من [المشكلة] ولم يجد حلاً - ${language}]"

* Golden sunrise transition. Product appears with warm light rays like a beacon of hope. MASSIVE BOLD GOLDEN TEXT: "[ثم جاء الحل! - ${language}]"
* Large Black Text: "[هذا المنتج غيّر كل شيء. تخيل أنك تستيقظ وأنت تشعر بالثقة - ${language}]"

* Split screen with visual narrative. Left: old dark life. Right: new bright life with product. LARGE BOLD COLORED TEXT: "[قبل وبعد - قصة تحول حقيقية - ${language}]"
* Medium Red Text: "❌ [أيام الشك والمعاناة - ${language}]"
* Medium Green Text: "✅ [حياة جديدة مليئة بالثقة والراحة - ${language}]"

* Emotional close-up of the product being held by a happy user, soft bokeh background. LARGE BOLD WARM TEXT: "[ما الذي يجعل هذا المنتج مميزاً؟ - ${language}]"
* Large Black Text: "[كل قطعة صُنعت بعناية لتمنحك تجربة لا تُنسى. الجودة التي تستحقها - ${language}]"

* Heartwarming comparison. Brand product with loving details vs cold competitor. LARGE BOLD WARM TEXT: "[لماذا يثق بنا الآلاف؟ - ${language}]"
* Medium Green Text: "✔️ [جودة تضمن لك الابتسامة - ${language}]\\n✔️ [خدمة عملاء على مدار الساعة - ${language}]"
* Medium Red Text: "❌ [منتجات تفتقر إلى الإحساس والاهتمام - ${language}]\\n❌ [تجارب شراء محبطة - ${language}]"

* Lifestyle shot showing a genuine moment of joy using the product. LARGE BOLD COLORED TEXT: "[هذه قصتك الجديدة - ${language}]"
* Large Black Text: "[كل يوم مع هذا المنتج هو خطوة نحو حياة أفضل. ابدأ قصتك اليوم - ${language}]"

* ★★★★★ with real customer faces and heartfelt quotes. LARGE BOLD BLACK TEXT: "[أبطال قصتنا - آراء عملائنا - ${language}]"
${reviewBlock}

* Footer with warm, inviting tones. Product sits like a trusted companion. LARGE BOLD TEXT: "[${price} - استثمار في سعادتك]"
* Large White Bold Text: "💫 [قصتك تبدأ من هنا - ${language}]"
* MASSIVE BLACK TEXT on WARM COLOR Button: "[اطلب الآن وابدأ رحلتك - ${language}]"`,

    luxury: ({ language, dynamicColors, price, reviewBlock }) => `
* Ultra-premium dark background with subtle gold particles. Product displayed like a museum piece with elegant spotlighting. Small Gold Embossed Label: "[إصدار حصري - ${language}]"
* MASSIVE WHITE BOLD ELEGANT TEXT (serif-style description): "[تعرّف على الفخامة الحقيقية - ${language}]"
* Large Text in refined tone: "[لأولئك الذين لا يقبلون إلا بأفضل ما في الحياة - ${language}]"

* Smooth transition to deep charcoal. Minimalist layout with single elegant icon. Refined Red Text: "[هل تبحث عن الكمال؟ - ${language}]"
* Medium Light Text on dark: "[القلة فقط من يفهمون قيمة الجودة الاستثنائية - ${language}]"

* Dramatic reveal. Product rises on a sleek pedestal with soft golden backlight. MASSIVE BOLD GOLD TEXT: "[التميز في أبهى صوره - ${language}]"
* Large Black Text on cream: "[حيث تلتقي الحرفية الفائقة مع التصميم الراقي - ${language}]"

* Sophisticated split. Left: ordinary life in monochrome. Right: elevated lifestyle in rich color. LARGE BOLD GOLD TEXT: "[قبل العادية.. بعد الفخامة - ${language}]"
* Medium Red Text: "❌ [التسوية والقبول بالمألوف - ${language}]"
* Medium Green Text: "✅ [الارتقاء بمستوى حياتك - ${language}]"

* Macro shot highlighting craftsmanship with shimmering light reflections. LARGE BOLD GOLD TEXT: "[صُنع بعناية فائقة - ${language}]"
* Large Black Text: "[كل تفصيل صغير يحكي قصة من الإتقان والجودة التي لا تضاهى - ${language}]"

* Elegant comparison. Our product with premium aura vs generic competitor. LARGE BOLD GOLD TEXT: "[الجودة تتحدث عن نفسها - ${language}]"
* Medium Green Text: "✔️ [مواد عالية الجودة تدوم طويلاً - ${language}]\\n✔️ [تصميم حصري لا يُقارن - ${language}]"
* Medium Red Text: "❌ [جودة رديئة وتصميم مكرر - ${language}]\\n❌ [ينكسر بسرعة ويخيب الظن - ${language}]"

* Refined lifestyle shot in an elegant setting. LARGE BOLD COLORED TEXT: "[أسلوب حياة يستحقك - ${language}]"
* Large Black Text: "[استمتع بتجربة فاخرة تغيّر مفهومك عن الجودة - ${language}]"

* ★★★★★ with refined elegant layout. LARGE BOLD BLACK TEXT: "[ما يقوله الخبراء - ${language}]"
${reviewBlock}

* Sophisticated footer with minimalist luxury aesthetic. LARGE GOLD TEXT: "[${price} - قيمة تدوم]"
* Large White Bold Text: "✦ [العدد محدود - احجز طلبك الآن - ${language}]"
* MASSIVE BLACK TEXT on GOLD Button: "[اطلب الآن - توصيل فاخر - ${language}]"`,

    pas: ({ language, dynamicColors, price, reviewBlock }) => `
* Bold high-impact opening. Dark gritty background with abstract broken shapes. Red Warning Label: "[مشكلة خطيرة - ${language}]"
* MASSIVE WHITE BOLD AGGRESSIVE TEXT: "[هل تعاني من [المشكلة] دون حل؟! - ${language}]"
* Large Red Text: "[كل يوم يمر دون حل يكلفك أكثر - ${language}]"

* Descent into deeper darkness. Painful icons floating. Large Bold Red Text with rage effect: "[لن تتحمل هذا بعد الآن! - ${language}]"
* Medium Black Text: "[الحرمان، الإحراج، الفشل المتكرر - هذا هو واقعك بدون هذا المنتج - ${language}]"

* EXPLOSIVE LIGHT. Product blasts through the darkness with radiant energy. MASSIVE BOLD INTENSE TEXT: "[الحل الثوري موجود! - ${language}]"
* Large Black Text: "[تم تطوير هذا المنتج خصيصاً ليقضي على [المشكلة] نهائياً - ${language}]"

* Stark contrast. Left: dark chaotic life with problem. Right: organized bright life with solution. LARGE BOLD IMPACT TEXT: "[قرارك سيغير كل شيء - ${language}]"
* Medium Red Text: "❌ [استمرار المعاناة والألم - ${language}]"
* Medium Green Text: "✅ [حياة خالية من المتاعب - ${language}]"

* Powerful close-up of the product's key feature with lightning effects. LARGE BOLD COLORED TEXT: "[السلاح السري الذي تحتاجه - ${language}]"
* Large Black Text: "[هذه الميزة وحدها كافية لتغيير كل شيء. تخيل النتائج - ${language}]"

* Devastating comparison. Our powerful product vs weak competitor. LARGE BOLD COLORED TEXT: "[لا مجال للمقارنة! - ${language}]"
* Medium Green Text: "✔️ [يقضي على المشكلة من جذورها - ${language}]\\n✔️ [نتائج مضمونة 100% - ${language}]"
* Medium Red Text: "❌ [حلول سطحية مؤقتة - ${language}]\\n❌ [وعود كاذبة بدون نتائج - ${language}]"

* Lifestyle shot showing triumphant user. LARGE BOLD COLORED TEXT: "[استعد السيطرة على حياتك - ${language}]"
* Large Black Text: "[تخيل نفسك وأنت تستمتع بالحياة بدون [المشكلة]. هذا ممكن الآن - ${language}]"

* ★★★★★ with determined customer stories. LARGE BOLD BLACK TEXT: "[النتائج تتحدث - ${language}]"
${reviewBlock}

* Strong, powerful footer. Product displayed like a trophy. LARGE BOLD TEXT: "[${price} - أغلى من فنجان قهوة وأقل من خيبة أمل]"
* Large White Bold Text: "🚨 [المخزون يذوب - لا تتردد - ${language}]"
* MASSIVE BLACK TEXT on RED Button: "[احسم أمرك الآن - ${language}]"`,

    comparison: ({ language, dynamicColors, price, reviewBlock }) => `
* Clean clinical background. Product on a scientific comparison chart backdrop. Small Blue Label: "[مقارنة شاملة - ${language}]"
* MASSIVE WHITE BOLD TEXT: "[لماذا تختارنا؟ الأرقام لا تكذب - ${language}]"
* Large Text: "[مقارنة موضوعية بين منتجنا وأفضل البدائل في السوق - ${language}]"

* Dark zone with red X marks on competitor logos. Large Bold White Text: "[ما الذي يخفيه المنافسون؟ - ${language}]"
* Medium Black Text: "[حقائق صادمة عن جودة المنتجات الأخرى - ${language}]"

* Bright reveal with product on a winner's podium. MASSIVE BOLD COLORED TEXT: "[التفوق بكل المقاييس - ${language}]"
* Large Black Text: "[فارق الجودة ليس مجرد شعور - إنه أرقام وحقائق - ${language}]"

* Split comparison board. Left side faded/greyscale competitor. Right side vibrant PRODUCT. LARGE BOLD COLORED TEXT: "[قارن بنفسك - ${language}]"
* Medium Red Text: "❌ [منتجات أقل جودة بسعر أعلى - ${language}]"
* Medium Green Text: "✅ [جودة فائقة بسعر منافس - ${language}]"

* Side-by-side feature highlight. Product's premium material vs competitor's cheap material. LARGE BOLD COLORED TEXT: "[الفارق في التفاصيل - ${language}]"
* Large Black Text: "[مواد عالية الجودة vs مواد رخيصة - الاختيار واضح - ${language}]"

* Detailed comparison table format. PRODUCT vs COMPETITOR. LARGE BOLD COLORED TEXT: "[المواصفات تتحدث - ${language}]"
* Medium Green Text: "✔️ [ضمان لمدة أطول - ${language}]\\n✔️ [مواد طبيعية آمنة 100% - ${language}]"
* Medium Red Text: "❌ [ضمان قصير الأمد - ${language}]\\n❌ [مواد صناعية رخيصة - ${language}]"

* Lifestyle shot showing product outperforming in real use. LARGE BOLD COLORED TEXT: "[نتائج حقيقية - ${language}]"
* Large Black Text: "[الآلاف فضّلونا بعد المقارنة. حان دورك - ${language}]"

* ★★★★★ with rating comparison bars showing our higher rating. LARGE BOLD BLACK TEXT: "[تقييم العملاء - ${language}]"
${reviewBlock}

* Footer with comparison summary. Product with checkmark vs competitor with X. LARGE BOLD TEXT: "[${price} - الجودة التي تستحقها]"
* Large White Bold Text: "📊 [الأفضل في السوق - جرب الفرق اليوم - ${language}]"
* MASSIVE BLACK TEXT on BLUE Button: "[اختر الأفضل الآن - ${language}]"`,
  };

  const buildNanoBananaPrompt = ({ language, productRef, dynamicColors, reviewBlock, price, styleId, abTest }) => {
    const flow = designFlows[styleId] || designFlows.default;
    const designFlow = flow({ language, dynamicColors, price, reviewBlock });

    const phase2 = abTest
      ? `After writing the copy, generate TWO separate, distinct design prompts for the image generator. Each prompt must follow a different marketing angle (e.g. one emotional/storytelling, one logical/feature-focused). Enclose each prompt in its own code block and label clearly as VERSION A - [angle name] and VERSION B - [angle name].
A/B TEST INSTRUCTION: Study the product and identify two distinct marketing angles. For each angle, write persuasive copy in Phase 1, then generate the corresponding design prompt in Phase 2.`
      : `After writing the copy, generate a single, unified, READY-TO-USE design prompt for the image generator.`;

    return `### YOUR TASK INVOLVES TWO MAIN PHASES:

### PHASE 1: PERSUASIVE COPYWRITING
First, craft compelling sales copy for this product using the structure outlined below. Provide this text clearly so I can review and utilize it.
CRITICAL LANGUAGE INSTRUCTION: ALL copywriting in Phase 1 MUST be strictly written in ${language}.

### PHASE 2: NANO BANANA PRO DESIGN PROMPT${abTest ? "S (A/B TEST)" : ""}
${phase2}

---
### STRICT GUIDELINES FOR PHASE 2${abTest ? " (FOR EACH PROMPT)" : ""}:
1. Format: Enclose ${abTest ? "each" : "the complete"} design prompt within a single code block.
2. Product Integration: Visually describe the product in every section. Ensure the layout accommodates either a single item or a grouped bundle based on context.
3. CRITICAL: Use the exact same product with all its visual details as shown in the attached image — do not alter or substitute the product design, packaging, or branding.
4. Visual Elements: Include vivid, creative English descriptions for the visuals based on the image.
5. Typography: ALL localized text MUST be displayed in massive, ultra-bold typography (20px minimum equivalent). ONLY output the generated ${language} text inside quotation marks " ". DO NOT output English structural labels like (Headline, Body).
6. Final Cleanup: Replace all [bracketed placeholders] with your generated ${language} text and strip out all structural labels.
7. Text Direction: Ensure the layout logic fits the requested language.
${humanConstraint()}${langForce(language)}

--- DESIGN PROMPT TEMPLATE ---
Act as an expert E-commerce UI/UX Designer. Create an ultra-tall vertical infographic landing page IMAGE (aspect ratio 9:32 or longer) featuring the ${productRef} from the uploaded image.
CRITICAL RULE: DO NOT write HTML/CSS. Generate a purely visual, seamless graphic IMAGE.

DESIGN & FLOW INSTRUCTIONS:
Build a continuous visual narrative utilizing smooth gradients (specifically ${dynamicColors}) and sleek kinetic lines. Avoid harsh dividers. Use a dynamic background that fits the [product vibe]. Showcase the product frequently.
${designFlow}`;
  };

  const generatePrompt = () => {
    setError("");
    setCopied(false);

    let result;
    if (mode === "advanced") {
      result = buildAdvancedPrompt();
    } else {
      result = buildFastPrompt();
    }

    if (result.startsWith("يرجى")) {
      setError(result);
      return;
    }

    setOutput(result);
    setTimeout(() => {
      outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = output;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabClass = (tab) =>
    `flex-1 py-3 px-4 text-center font-semibold rounded-xl transition cursor-pointer ${
      mode === tab
        ? "bg-blue-600 text-white shadow-md"
        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 leading-tight">
            Ecozed landing page promt generator
          </h1>
          <p className="text-base text-slate-500 mb-1">مولد أوامر التصميم</p>
          <p className="text-lg text-slate-600">
            قم بتعبئة الحقول أدناه لتوليد أمر تصميم احترافي لـ Nano Banana Pro
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8 space-y-6">
          {/* Tabs */}
          <div className="flex gap-3">
            <button onClick={() => setMode("advanced")} className={tabClass("advanced")}>
              الوضع المتقدم
            </button>
            <button onClick={() => setMode("fast")} className={tabClass("fast")}>
              الوضع السريع
            </button>
          </div>

          {mode === "advanced" ? (
            <>
              {/* Language */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  1. لغة الجمهور المستهدف <span className="text-red-500">*</span>
                </h3>
                <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="مثال: العربية، الدارجة الجزائرية، الإنجليزية..."
                />
              </div>

              {/* Offer Type */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  2. طبيعة العرض أو المنتج
                </h3>
                <select
                  value={offerType}
                  onChange={(e) => setOfferType(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                >
                  <option value="single">عنصر واحد</option>
                  <option value="bundle">حزمة ترويجية / باك</option>
                </select>
              </div>

              {/* Product Details */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
                <h3 className="text-lg font-semibold text-slate-800">
                  3. البيانات الإضافية للمنتج
                </h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    الاسم التجاري للمنتج <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="مثال: مجموعة تبييض الأسنان المتقدمة"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    أبرز الفوائد والخصائص <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={benefits}
                    onChange={(e) => setBenefits(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-y"
                    placeholder="مثال: يزيل القشرة، يوفر الوقت والمال..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    مقاسات / أبعاد المنتج{" "}
                    <span className="text-slate-400 text-xs">(اختياري)</span>
                  </label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="مثال: S, M, L, XL أو 20x30 سم"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    سعر البيع <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="مثال: 200 دينار / 50 دولار"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    النمط اللوني المفضل{" "}
                    <span className="text-slate-400 text-xs">(اختياري)</span>
                  </label>
                  <input
                    type="text"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="مثال: أسود مع لمسات ذهبية فخمة"
                  />
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
                <h3 className="text-lg font-semibold text-slate-800">
                  4. مراجعات وتقييمات الزبناء{" "}
                  <span className="text-slate-400 text-xs">(اختياري)</span>
                </h3>
                {reviews.map((review, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-medium text-slate-700">
                        التقييم {index + 1}:
                      </label>
                      {reviews.length > 1 && (
                        <button
                          onClick={() => removeReview(index)}
                          className="text-xs text-red-500 hover:text-red-700 transition cursor-pointer"
                        >
                          حذف
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <input
                        type="text"
                        value={review.text}
                        onChange={(e) => updateReview(index, "text", e.target.value)}
                        className="w-full sm:flex-1 rounded-xl border border-slate-300 px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        placeholder="اكتب نص المراجعة هنا..."
                      />
                      <select
                        value={review.gender}
                        onChange={(e) => updateReview(index, "gender", e.target.value)}
                        className="w-full sm:w-28 rounded-xl border border-slate-300 px-3 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                      >
                        {genders.map((g) => (
                          <option key={g.value} value={g.value}>
                            {g.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addReview}
                  className="w-full border-2 border-dashed border-slate-300 hover:border-blue-400 text-slate-500 hover:text-blue-600 rounded-xl py-3 font-medium transition cursor-pointer"
                >
                  + إضافة مراجعة
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Fast Mode - URL */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  1. رابط صفحة المنتج <span className="text-red-500">*</span>
                </h3>
                <input
                  type="url"
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="https://example.com/product-page"
                />
                <p className="text-xs text-slate-400 mt-1.5">
                  سيتم توجيه الذكاء الاصطناعي لتصفح الرابط واستخراج معلومات المنتج تلقائياً
                </p>
              </div>

              {/* Fast Mode - Language */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  2. لغة الجمهور المستهدف <span className="text-red-500">*</span>
                </h3>
                <input
                  type="text"
                  value={fastLanguage}
                  onChange={(e) => setFastLanguage(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="مثال: العربية، الدارجة الجزائرية، الإنجليزية..."
                />
              </div>

              {/* Fast Mode - Price */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  3. سعر البيع <span className="text-red-500">*</span>
                </h3>
                <input
                  type="text"
                  value={fastPrice}
                  onChange={(e) => setFastPrice(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="مثال: 200 دينار / 50 دولار"
                />
              </div>

              {/* Fast Mode - Additional Info */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  4. معلومات إضافية{" "}
                  <span className="text-slate-400 text-xs">(اختياري)</span>
                </h3>
                <textarea
                  value={fastAdditionalInfo}
                  onChange={(e) => setFastAdditionalInfo(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-y"
                  placeholder="أي معلومات إضافية تريد تزويد الذكاء الاصطناعي بها عن المنتج..."
                />
              </div>
            </>
          )}

          {/* A/B Test Checkbox */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => setAbTest(!abTest)}
              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition cursor-pointer ${
                abTest
                  ? "bg-blue-600 border-blue-600"
                  : "border-slate-300 bg-white"
              }`}
            >
              {abTest && (
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-sm font-medium text-slate-700">
              اختبار A/B — توليد أمرين بتوجهين تسويقيين مختلفين
            </span>
          </label>

          {/* No Humans Checkbox */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => {
                setNoHumans(!noHumans);
                if (!noHumans) setMenOnly(false);
              }}
              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition cursor-pointer ${
                noHumans
                  ? "bg-blue-600 border-blue-600"
                  : "border-slate-300 bg-white"
              }`}
            >
              {noHumans && (
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-sm font-medium text-slate-700">
              لا تولد بشر — منع ظهور أي أشخاص في التصميم
            </span>
          </label>

          {/* Men Only Checkbox */}
          <label className={`flex items-center gap-3 cursor-pointer select-none ${noHumans ? "opacity-40 pointer-events-none" : ""}`}>
            <div
              onClick={() => !noHumans && setMenOnly(!menOnly)}
              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition cursor-pointer ${
                menOnly && !noHumans
                  ? "bg-blue-600 border-blue-600"
                  : "border-slate-300 bg-white"
              }`}
            >
              {menOnly && !noHumans && (
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-sm font-medium text-slate-700">
              رجال فقط — توليد رجال فقط دون نساء
            </span>
          </label>

          {/* Force Language Checkbox */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => setForceLanguage(!forceLanguage)}
              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition cursor-pointer ${
                forceLanguage
                  ? "bg-blue-600 border-blue-600"
                  : "border-slate-300 bg-white"
              }`}
            >
              {forceLanguage && (
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-sm font-medium text-slate-700">
              فرض اللغة — التأكد من أن كل النصوص في التصميم بلغة الجمهور المستهدف
            </span>
          </label>

          {/* Style Selector */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              نمط أمر التصميم
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {promptStyles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`py-2.5 px-3 rounded-xl text-sm font-medium transition cursor-pointer ${
                    style === s.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-center font-medium">
              {error}
            </div>
          )}

          {/* Generate */}
          <button
            onClick={generatePrompt}
            className="w-full bg-gradient-to-l from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] cursor-pointer"
          >
            {mode === "advanced" ? "إنشاء أمر التصميم" : "إنشاء الأمر السريع"}
          </button>
        </div>

        {/* Output */}
        {output && (
          <div ref={outputRef} className="mt-8 bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                أمر التصميم المُنتَج
              </h2>
              <button
                onClick={copyToClipboard}
                className={`self-stretch sm:self-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                  copied
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                }`}
              >
                {copied ? "تم النسخ!" : "نسخ النص"}
              </button>
            </div>
            <div className="bg-slate-900 text-slate-100 rounded-xl p-5 overflow-x-auto max-h-[600px] overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
                {output}
              </pre>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-slate-500 text-sm">
          <p>
            مبني بـ ❤️ بواسطة{" "}
            <a
              href="https://github.com/IhabZaidi/Ecozed-ld-promt-gen"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline transition"
            >
              Ihab
            </a>
          </p>
          <p className="mt-1">
            <a
              href="https://github.com/IhabZaidi/Ecozed-ld-promt-gen"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline transition"
            >
              Ecozed landing page promt generator
            </a>
          </p>
          <div className="mt-3 flex items-center justify-center gap-4">
            <a
              href="https://www.tiktok.com/@ihabzzz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-blue-600 transition"
            >
              TikTok
            </a>
            <a
              href="https://wa.me/213796332534"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-blue-600 transition"
            >
              WhatsApp
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
