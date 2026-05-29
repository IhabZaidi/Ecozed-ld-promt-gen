import { useState, useRef } from "react";

const genders = [
  { value: "man", label: "رجل" },
  { value: "woman", label: "امرأة" },
];

const defaultReviews = [{ text: "", gender: "man" }];

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
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const outputRef = useRef(null);

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
    });
  };

  const buildFastPrompt = () => {
    if (!productUrl.trim()) return "يرجى ملء رابط صفحة المنتج";
    if (!fastLanguage.trim()) return "يرجى ملء حقل لغة الجمهور المستهدف";
    if (!fastPrice.trim()) return "يرجى ملء حقل سعر البيع";

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

### PHASE 2: PERSUASIVE COPYWRITING
Using the extracted information from Phase 1, craft compelling sales copy for this product using the structure outlined below. Provide this text clearly so I can review and utilize it.
CRITICAL LANGUAGE INSTRUCTION: ALL copywriting in Phase 2 MUST be strictly written in ${fastLanguage}.

### PHASE 3: NANO BANANA PRO DESIGN PROMPT
After writing the copy, generate a single, unified, READY-TO-USE design prompt for the image generator.

---
### STRICT GUIDELINES FOR PHASE 3:
1. Format: Enclose the complete design prompt within a single code block.
2. Product Integration: Visually describe the product in every section. Ensure the layout accommodates either a single item or a grouped bundle based on context.
3. CRITICAL: Use the exact same product with all its visual details as shown in the attached image — do not alter or substitute the product design, packaging, or branding.
4. Visual Elements: Include vivid, creative English descriptions for the visuals based on the image and the extracted page design.
5. Typography: ALL localized text MUST be displayed in massive, ultra-bold typography (20px minimum equivalent). ONLY output the generated ${fastLanguage} text inside quotation marks " ". DO NOT output English structural labels like (Headline, Body).
6. Final Cleanup: Replace all [bracketed placeholders] with your generated ${fastLanguage} text and strip out all structural labels.
7. Text Direction: Ensure the layout logic fits the requested language.

--- DESIGN PROMPT TEMPLATE ---
Act as an expert E-commerce UI/UX Designer. Create an ultra-tall vertical infographic landing page IMAGE (aspect ratio 9:32 or longer) featuring the extracted product/bundle from the provided URL.
CRITICAL RULE: DO NOT write HTML/CSS. Generate a purely visual, seamless graphic IMAGE.

DESIGN & FLOW INSTRUCTIONS:
Build a continuous visual narrative utilizing smooth gradients (specifically [use colors extracted from the product page]) and sleek kinetic lines. Avoid harsh dividers. Use a dynamic background that fits the product vibe extracted from the page. Showcase the product frequently.

* Dynamic background with glowing particles. Product is front and center. Small Yellow Label: "[Best Seller or New Arrival in ${fastLanguage}]"
* MASSIVE WHITE BOLD TEXT: "[An eye-catching main headline in ${fastLanguage}]"
* Large Text: "[A sentence highlighting the core benefit in ${fastLanguage}]"

* Smooth fade into a darker/muted zone. Color shift with problem/pain-point icons. Large Bold Red Text: "[A question targeting the customer's pain point in ${fastLanguage}]"
* Medium Black Text: "[A brief description of the problem in ${fastLanguage}]"

* Bright light burst transitioning to a pristine background. Product emerges with a glowing aura. MASSIVE BOLD COLORED TEXT: "[Headline presenting the product as the ultimate solution in ${fastLanguage}]"
* Large Black Text: "[A sentence confirming the solution's effectiveness in ${fastLanguage}]"

* Split screen layout showing a stark contrast. Left side is dark/gloomy depicting [problem from extracted context]. Right side is vibrant/bright depicting [resolution from extracted context]. LARGE BOLD COLORED TEXT: "[Headline comparing before and after in ${fastLanguage}]"
* Medium Red Text: "❌ [Short description of the struggle in ${fastLanguage}]"
* Medium Green Text: "✅ [Short description of the relief/result in ${fastLanguage}]"

* Extreme close-up highlighting [key feature extracted from page]. Glowing highlights. LARGE BOLD COLORED TEXT: "[Headline for the most important feature in ${fastLanguage}]"
* Large Black Text: "[Marketing explanation of the feature in ${fastLanguage}]"

* Two-column comparison. Left is our glowing PRODUCT. Right is a dull competitor. LARGE BOLD COLORED TEXT: "[Headline proving superiority in ${fastLanguage}]"
* Medium Green Text: "✔️ [Pro 1 from extracted features in ${fastLanguage}]\\n✔️ [Pro 2 from extracted features in ${fastLanguage}]"
* Medium Red Text: "❌ [Competitor Con 1 in ${fastLanguage}]\\n❌ [Competitor Con 2 in ${fastLanguage}]"

* Lifestyle shot illustrating [scene of product in use from extracted context]. LARGE BOLD COLORED TEXT: "[Headline highlighting daily use in ${fastLanguage}]"
* Large Black Text: "[How the product changes the user's life in ${fastLanguage}]"

* 5 glowing stars ★★★★★ centered with user avatars. LARGE BOLD BLACK TEXT: "[Write 'Our Customers Feedback' in ${fastLanguage}]"
[Use extracted customer reviews here. If none found, use a generic positive review.]

* Strong, high-contrast footer. Product prominently displayed near the CTA. LARGE BOLD TEXT: "[${fastPrice}]"
* Large White Bold Text: "⚠️ [Write 'Stock running out fast, order now!' in ${fastLanguage}]"
* MASSIVE BLACK TEXT on YELLOW Button: "[Write 'Order Now - Cash on Delivery' in ${fastLanguage}]"`;
  };

  const buildNanoBananaPrompt = ({ language, productRef, dynamicColors, reviewBlock, price }) => {
    return `### YOUR TASK INVOLVES TWO MAIN PHASES:

### PHASE 1: PERSUASIVE COPYWRITING
First, craft compelling sales copy for this product using the structure outlined below. Provide this text clearly so I can review and utilize it.
CRITICAL LANGUAGE INSTRUCTION: ALL copywriting in Phase 1 MUST be strictly written in ${language}.

### PHASE 2: NANO BANANA PRO DESIGN PROMPT
After writing the copy, generate a single, unified, READY-TO-USE design prompt for the image generator.

---
### STRICT GUIDELINES FOR PHASE 2:
1. Format: Enclose the complete design prompt within a single code block.
2. Product Integration: Visually describe the product in every section. Ensure the layout accommodates either a single item or a grouped bundle based on context.
3. CRITICAL: Use the exact same product with all its visual details as shown in the attached image — do not alter or substitute the product design, packaging, or branding.
4. Visual Elements: Include vivid, creative English descriptions for the visuals based on the image.
5. Typography: ALL localized text MUST be displayed in massive, ultra-bold typography (20px minimum equivalent). ONLY output the generated ${language} text inside quotation marks " ". DO NOT output English structural labels like (Headline, Body).
6. Final Cleanup: Replace all [bracketed placeholders] with your generated ${language} text and strip out all structural labels.
7. Text Direction: Ensure the layout logic fits the requested language.

--- DESIGN PROMPT TEMPLATE ---
Act as an expert E-commerce UI/UX Designer. Create an ultra-tall vertical infographic landing page IMAGE (aspect ratio 9:32 or longer) featuring the ${productRef} from the uploaded image.
CRITICAL RULE: DO NOT write HTML/CSS. Generate a purely visual, seamless graphic IMAGE.

DESIGN & FLOW INSTRUCTIONS:
Build a continuous visual narrative utilizing smooth gradients (specifically ${dynamicColors}) and sleek kinetic lines. Avoid harsh dividers. Use a dynamic background that fits the [product vibe]. Showcase the product frequently.

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
* MASSIVE BLACK TEXT on YELLOW Button: "[اطلب الآن - الدفع عند الاستلام - ${language}]"`;
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
            </>
          )}

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
        </footer>
      </div>
    </div>
  );
}

export default App;
