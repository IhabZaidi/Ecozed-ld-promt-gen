import { useState, useRef } from "react";
import avatarMd from "./assets/avatar.md?raw";
import adsMd from "./assets/ads.md?raw";
import adCreativeMd from "./assets/ad-creative.md?raw";
import imageMd from "./assets/image.md?raw";

const parseFrontmatter = (raw) => {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { name: "", description: "", content: raw };
  const meta = {};
  const nameMatch = match[1].match(/^name:\s*(.+)$/m);
  const descMatch = match[1].match(/^description:\s*"(.+)"$/m);
  if (nameMatch) meta.name = nameMatch[1];
  if (descMatch) meta.description = descMatch[1];
  return { name: meta.name || "", description: meta.description || "", content: raw };
};

const preprompts = [
  { id: "avatar", ...parseFrontmatter(avatarMd) },
  { id: "image", ...parseFrontmatter(imageMd) },
  { id: "ads", ...parseFrontmatter(adsMd) },
  { id: "ad-creative", ...parseFrontmatter(adCreativeMd) },
];

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

const creativeStyles = [
  { id: "default", label: "افتراضي" },
  { id: "clinical", label: "صحي" },
  { id: "artisticLuxury", label: "فخم" },
  { id: "modernBold", label: "جريء" },
  { id: "natureEco", label: "طبيعي" },
  { id: "techSleek", label: "تقني" },
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
  const [adCopy, setAdCopy] = useState(true);
  const [sellMethod, setSellMethod] = useState("messages");
  const [limitedQt, setLimitedQt] = useState(false);
  const [firstTimeDz, setFirstTimeDz] = useState(false);
  const [style, setStyle] = useState("default");
  const [creativeStyle, setCreativeStyle] = useState("default");
  const [creativeInputMode, setCreativeInputMode] = useState("advanced");
  const [mainTab, setMainTab] = useState("landing");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedPre, setCopiedPre] = useState(null);
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

  const buyerPersonaBlock = () => `\n### 👤 BUYER PERSONA PROFILE — CRITICAL: THIS DRIVES EVERYTHING\nBased on the product information, first define a detailed buyer persona for the target customer. Include:\n- Demographics (age, gender, location, income level)\n- Psychographics (interests, values, lifestyle)\n- Pain points and specific needs this product solves\n- Shopping behavior and purchase motivations\n\n**CRITICAL RULE:** This persona is the north star for EVERYTHING. The image creative MUST visually represent this persona's world, lifestyle, and context. The ad copy MUST speak DIRECTLY to THIS specific persona — use their language, their specific pain points, their desires. Every line of copy must feel like it was written FOR this exact person. Do NOT write generic copy that could apply to anyone.`;

  const sellingCta = () => {
    if (sellMethod === "website") return `\n### CALL TO ACTION\nUse: "اطلب الآن عبر الموقع" as the final CTA. Drive users to order through the website.`;
    return `\n### CALL TO ACTION\nUse: "للطلب راسلنا الآن" as the final CTA. Drive users to send a message to place an order.`;
  };

  const urgencyBlock = () => limitedQt ? `\n### URGENCY & SCARCITY\nIncorporate limited-quantity messaging: "الكمية محدودة جدا — اغتنم الفرصة الآن". Create a sense of urgency and fear of missing out (FOMO).` : `\n### URGENCY & SCARCITY\nDo NOT use any urgency or limited-quantity messaging. No "الكمية محدودة", no "لفترة محدودة", no scarcity tactics.`;

  const exclusivityBlock = () => firstTimeDz ? `\n### EXCLUSIVITY\nHighlight that this product is available "لأول مرة في الجزائر" — make it feel like a unique opportunity, exclusive launch, or first-of-its-kind offer in the Algerian market.` : `\n### EXCLUSIVITY\nDo NOT use any exclusivity messaging. No "لأول مرة", no "حصري", no "فريد".`;

  const marketingHooksBlock = (lang) => {
    const urgency = limitedQt ? `\n\n### URGENCY\nInclude "الكمية محدودة جدا" in the copy to create scarcity and drive immediate action.` : `\n\n### URGENCY\nDo NOT include any urgency or scarcity messaging. No "الكمية محدودة", no "لفترة محدودة".`;
    const exclusivity = firstTimeDz ? `\n\n### EXCLUSIVITY\nInclude "لأول مرة في الجزائر" to position this as a unique, first-of-its-kind offer.` : `\n\n### EXCLUSIVITY\nDo NOT include any exclusivity messaging. No "لأول مرة", no "حصري".`;
    return `${urgency}${exclusivity}`;
  };

  const adCopyBlock = (lang) => {
    if (!adCopy) return "";
    return `\n### 📝 AD COPY GENERATION — MUST TARGET THE BUYER PERSONA DIRECTLY\nIn addition to the image prompt above, produce ${abTest ? "TWO (one per version) short ready-to-use advertising copies" : "a short ready-to-use advertising copy"} written EXCLUSIVELY for the specific buyer persona defined earlier. The text must be balanced in length — not too long and not too short — and follow this exact structure:\n1. **Hook** — An attention-grabbing opening line that speaks DIRECTLY to the persona${firstTimeDz ? `\n   - Consider using the exclusivity angle: "لأول مرة في الجزائر" as part of the hook.` : ""}${limitedQt ? `\n   - Consider incorporating scarcity: "الكمية محدودة جدا" in the hook or CTA.` : ""}\n2. **Pain** — The specific problem this persona faces (use THEIR language, not generic terms)\n3. **Solution** — How the product solves it\n4. **CTA** — A clear call to action\nThe ad copy must be written in ${lang}, match the visual prompt's tone and angle.\n\n**CRITICAL — PERSONA TARGETING RULE:** The copy MUST address the persona directly using their specific context. For example, if the persona is "mothers aged 28-45 managing a household", the hook should reference motherhood/home responsibilities — NOT generic "you". Every line must feel like it was written FOR this exact person, using their language and addressing their unique situation.\n${sellMethod === "website" ? `\n### 📍 CTA DIRECTION\nThe call to action should direct users to order through the website: "اطلب الآن عبر الموقع".` : `\n### 📍 CTA DIRECTION\nThe call to action should direct users to send a message: "للطلب راسلنا الآن".`}\n${abTest ? "Generate TWO distinct ad copies (VERSION A and VERSION B), each matching its respective visual version's tone and targeting the same buyer persona from different angles." : ""}${urgencyBlock()}${exclusivityBlock()}`;
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

  const buildCreativePrompt = () => {
    const isFast = creativeInputMode === "fast";

    if (isFast) {
      if (!productUrl.trim()) return "يرجى ملء رابط صفحة المنتج";
      if (!fastLanguage.trim()) return "يرجى ملء حقل لغة الجمهور المستهدف";
      if (!fastPrice.trim()) return "يرجى ملء حقل سعر البيع";
    } else {
      if (!language.trim()) return "يرجى ملء حقل لغة الجمهور المستهدف";
      if (!productName.trim()) return "يرجى ملء حقل الاسم التجاري للمنتج";
      if (!benefits.trim()) return "يرجى ملء حقل أبرز الفوائد والخصائص";
      if (!price.trim()) return "يرجى ملء حقل سعر البيع";
    }

    const targetLang = isFast ? fastLanguage : language;
    const flow = creativeFlows[creativeStyle] || creativeFlows.default;

    const creativeHumanConstraint = noHumans
      ? "8. HUMAN RESTRICTION: Do NOT generate any humans, people, characters, or silhouettes in the image. Use only product imagery, icons, and abstract graphics without people."
      : menOnly
      ? "8. HUMAN RESTRICTION: If including humans in the image, ONLY include men. Do NOT generate any women, female figures, or feminine silhouettes."
      : "";

    const creativeLangForce = forceLanguage
      ? `\n${creativeHumanConstraint ? "9" : "8"}. LANGUAGE ENFORCEMENT: ALL text displayed in the generated creative MUST be written strictly in ${targetLang}. Absolutely NO text in any other language is allowed. Every headline, label, and caption must be in ${targetLang}.`
      : "";

    if (isFast) {
      const creativeSection = flow({ language: fastLanguage, productName: "[product name extracted from the URL]", benefits: "[benefits extracted from the URL]", dimensions: "[dimensions / sizes extracted from the URL]", price: fastPrice, theme: "[color palette extracted from the URL]" });
      const additional = fastAdditionalInfo.trim() ? `\n- EXTRA CONTEXT FROM USER: ${fastAdditionalInfo.trim()}` : "";

      return `### YOUR TASK INVOLVES TWO MAIN PHASES:

### Dont generate image, just do the task

### PHASE 1: PRODUCT INFORMATION EXTRACTION
Browse and scrape the product page at the following URL:
${productUrl.trim()}

Extract ALL of the following product details from the page:
- Product name
- Offer type (single item or bundle/pack)
- Main benefits and features / bullet points
- Product price (user stated price: ${fastPrice})
- Color scheme, theme, and visual style of the page
- Product dimensions / sizes if available
- Any customer reviews, ratings, or testimonials
- The overall vibe and target audience of the product
${additional}
${abTest ? "\nIMPORTANT: After extraction, study TWO different visual angles for this product and generate SEPARATE creative prompts for each. Label clearly as VERSION A and VERSION B." : ""}

### PHASE 2: CREATIVE IMAGE PROMPT
Using the extracted information from Phase 1, generate ${abTest ? "TWO separate, distinct" : "a single, unified,"} READY-TO-USE creative image prompt${abTest ? "s" : ""} for the image generator.
CRITICAL LANGUAGE INSTRUCTION: ALL copywriting and text in the creative MUST be strictly written in ${fastLanguage}.

${creativeSection}

### STRICT GUIDELINES:
1. Aspect Ratio: 1:1 (square format, ideal for social media and ads)
2. Visual Quality: High-resolution, photorealistic, cinematic lighting, 8k, sharp details
3. Typography: Bold, massive, ultra-readable. ALL localized text must be in ${fastLanguage}.
4. Hero Focus: The product must be the visual hero throughout the creative
5. Scene Context: The background and environment MUST be directly related to the product's usage context and natural setting
6. Text Accuracy: All ${fastLanguage} text must be perfectly spelled, correctly formatted, and culturally appropriate
${creativeHumanConstraint}${creativeLangForce}${buyerPersonaBlock()}${adCopyBlock(targetLang)}

### FINAL LANGUAGE CHECK:
IMPORTANT: Make sure ALL text throughout the creative is written strictly in ${targetLang}. Please double-check every headline, label, and caption — they must all be in ${targetLang}. No text in any other language is permitted.`;
    }

    const creativeSection = flow({ language, productName, benefits, dimensions, price, theme });

    const extraParts = [benefits.trim()];
    if (dimensions.trim()) extraParts.push(`Dimensions: ${dimensions.trim()}`);
    if (theme.trim()) extraParts.push(`Color palette: ${theme.trim()}`);

    return `### YOUR TASK:

### Dont generate image, just do the task

Act as a high-end E-commerce Graphic Designer. Create an square format marketing creative (1:1 aspect ratio) for "${productName.trim()}".

### PRODUCT INFORMATION:
- Product: ${productName.trim()}
- Key Benefits / Features: ${extraParts.join(" | ")}
- Price: ${price.trim()}
- Target Language: ${language.trim()}
${abTest ? "\nIMPORTANT: Generate TWO distinct creative versions with different visual and copy approaches. Label as VERSION A and VERSION B." : ""}

${creativeSection}

### STRICT GUIDELINES:
1. Aspect Ratio: 1:1 (square format, ideal for social media and ads)
2. Visual Quality: High-resolution, photorealistic, cinematic lighting, 8k, sharp details
3. Typography: Bold, massive, ultra-readable. ALL localized text must be in ${language}.
4. Hero Focus: "${productName.trim()}" must be the visual hero throughout the creative
5. Scene Context: The background and environment MUST be directly related to the product's usage context and natural setting
6. Text Accuracy: All ${language} text must be perfectly spelled, correctly formatted, and culturally appropriate
${creativeHumanConstraint}${creativeLangForce}${buyerPersonaBlock()}${adCopyBlock(language)}

### FINAL LANGUAGE CHECK:
IMPORTANT: Make sure ALL text throughout the creative is written strictly in ${targetLang}. Please double-check every headline, label, and caption — they must all be in ${targetLang}. No text in any other language is permitted.`;
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
${marketingHooksBlock(fastLanguage)}

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
${humanConstraint()}${langForce(fastLanguage)}${buyerPersonaBlock()}

--- DESIGN PROMPT TEMPLATE ---
Act as an expert E-commerce UI/UX Designer. Create an ultra-tall vertical infographic landing page IMAGE (aspect ratio 9:32 or longer) featuring the extracted product/bundle from the provided URL.
CRITICAL RULE: DO NOT write HTML/CSS. Generate a purely visual, seamless graphic IMAGE.

DESIGN & FLOW INSTRUCTIONS:
Build a continuous visual narrative utilizing smooth gradients (specifically [use colors extracted from the product page]) and sleek kinetic lines. Avoid harsh dividers. Use a dynamic background that fits the product vibe extracted from the page. Showcase the product frequently.
${designFlow}

### FINAL LANGUAGE CHECK:
IMPORTANT: Make sure ALL text throughout the design is written strictly in ${fastLanguage}. Please double-check every headline, label, button, and caption — they must all be in ${fastLanguage}. No text in any other language is permitted.`;
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

  const creativeFlows = {
    default: ({ language, productName, benefits, dimensions, price, theme }) => `
### DESIGN STRATEGY:
Use a clean, premium aesthetic with a color palette of "Pristine White" and "Deep Royal Blue" to evoke cleanliness and trust. The background should be a blurred, modern minimalist scene related to the product's usage context.

### CREATIVE NARRATIVE:
* SECTION 1 (The Hook): The product is hero-shot at the top. A bright red ribbon in the corner reads: "حصرياً: لأول مرة هنا"
* MASSIVE BOLD TEXT in ${language}: "[A hook headline addressing the customer's core need]"
* Large Subtext in ${language}: "[A persuasive line about the main benefit]"

* SECTION 2 (Visual Proof): 3 circular icons showing:
  1. Icon representing the top benefit — "${language}"
  2. Icon representing another key feature — "${language}"
  3. Icon representing a third advantage — "${language}"

* SECTION 3 (Utility): Lifestyle context showing the product in its practical use environment.
* Large Text in ${language}: "[Smart storage / utility message]"

* SECTION 4 (Build Quality): Close-up of the product's material quality and construction.
* Text in ${language}: "[Quality and durability message]"

* SECTION 5 (The Offer & CTA): High-contrast footer section.
* MASSIVE YELLOW TEXT: "${price} فقط!"
* Strikethrough Text: "[Original price comparison]"
* Large White Text: "⚠️ [Urgency/Scarcity message in ${language}]"
* MASSIVE BLACK TEXT on YELLOW BUTTON: "[Call to action in ${language}]"`,

    clinical: ({ language, productName, benefits, dimensions, price, theme }) => `
### DESIGN STRATEGY:
Use a "Clinical Clean" aesthetic with soft mint and white gradients. The background shows a sparkling clean environment relevant to the product with soft sunlight.

### CREATIVE NARRATIVE:
* SECTION 1: The product displayed with a "Safe/Approved" badge. LARGE BOLD TEXT in ${language}: "[Headline about cleanliness and organization]"
* SECTION 2: Macro shot of the product's surface/material. Text in ${language}: "[Benefit about resistance, hygiene, or safety]"
* SECTION 3: Illustration or icon showing a key protective feature. Text in ${language}: "[Message about safety and durability]"
* SECTION 4: Lifestyle shot showing the product in an organized, clean setting. Text in ${language}: "[Storage and organization message]"
* FOOTER: Bright Green CTA Button. Text in ${language}: "${price} - [Call to action]"`,

    artisticLuxury: ({ language, productName, benefits, dimensions, price, theme }) => `
### DESIGN STRATEGY:
Use a "Minimalist Luxury" aesthetic with warm lighting and soft shadows. Elegant typography with refined details. Background shows an upscale setting related to the product.

### CREATIVE NARRATIVE:
* SECTION 1: The product displayed against an elegant backdrop. Gold Ribbon: "[Premium tag in ${language}]"
* SECTION 2: MASSIVE BOLD TEXT in ${language}: "[Headline about luxury and distinction]"
* SECTION 3: Visual focus on the product's refined design details. Text in ${language}: "[Message about modern elegance]"
* SECTION 4: "Before vs After" comparison — problem scenario vs transformed setting with the product. Text in ${language}: "[From ordinary to extraordinary]"
* FOOTER: Gold/Black Elegant CTA. Text in ${language}: "${price} - [Exclusive offer message]"`,

    modernBold: ({ language, productName, benefits, dimensions, price, theme }) => `
### DESIGN STRATEGY:
Use a bold, vibrant aesthetic with neon accents and high-contrast colors. Energetic typography with dynamic gradients. Urban-modern background related to the product's use.

### CREATIVE NARRATIVE:
* SECTION 1: The product bursts from the center with a neon glow. Tag: "[New/Exclusive badge in ${language}]"
* MASSIVE BOLD COLORED TEXT in ${language}: "[Bold, attention-grabbing headline]"
* Large Text in ${language}: "[Strong, direct value proposition]"

* SECTION 2: 3 dynamic icons with motion-blur effect:
  1. "${language}"
  2. "${language}"
  3. "${language}"

* SECTION 3: Lifestyle shot in an energetic, modern setting. Text in ${language}: "[Lifestyle aspirational message]"

* SECTION 4: Bold side-by-side comparison. Product vs alternative. Text in ${language}: "[Clear choice message]"

* FOOTER: High-energy CTA with glow effect. Text: "${price} — [Call to action in ${language}]"`,

    natureEco: ({ language, productName, benefits, dimensions, price, theme }) => `
### DESIGN STRATEGY:
Use a natural, organic aesthetic with earthy green and warm beige tones. Subtle wood textures and organic shapes. Background shows a nature-inspired environment relevant to the product.

### CREATIVE NARRATIVE:
* SECTION 1: The product placed in a natural setting with foliage elements. Badge: "[Natural/Eco badge in ${language}]"
* MASSIVE BOLD GREEN TEXT in ${language}: "[Headline about nature and authenticity]"
* Large Text in ${language}: "[Message connecting product to nature]"

* SECTION 2: Macro shot highlighting natural/organic materials. Text in ${language}: "[Natural materials message]"

* SECTION 3: 3 nature-themed icons:
  1. "${language}"
  2. "${language}"
  3. "${language}"

* SECTION 4: Lifestyle shot bathed in warm natural light. Text in ${language}: "[Harmony with nature message]"

* FOOTER: Earth-toned CTA button. Text: "${price} — [Call to action in ${language}]"`,

    techSleek: ({ language, productName, benefits, dimensions, price, theme }) => `
### DESIGN STRATEGY:
Use a sleek, futuristic aesthetic with dark backgrounds and metallic/silver accents. Clean minimalist typography with subtle glow effects. Background shows a tech-forward environment related to the product.

### CREATIVE NARRATIVE:
* SECTION 1: The product floats in a digital space with holographic UI elements. Badge: "[Tech badge in ${language}]"
* MASSIVE BOLD WHITE TEXT ON DARK in ${language}: "[Modern, tech-inspired headline]"
* Large Text in ${language}: "[Message about innovation and technology]"

* SECTION 2: Technical specs presented with futuristic HUD-style UI elements. Text in ${language}: "[Technical/innovation message]"

* SECTION 3: 3 sleek 3D holographic icons:
  1. "${language}"
  2. "${language}"
  3. "${language}"

* SECTION 4: Split screen — Traditional vs Modern approach. Text in ${language}: "[Forward-looking message]"

* FOOTER: Neon-accented dark CTA. Text: "${price} — [Call to action in ${language}]"`,
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
${marketingHooksBlock(language)}

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
${humanConstraint()}${langForce(language)}${buyerPersonaBlock()}

--- DESIGN PROMPT TEMPLATE ---
Act as an expert E-commerce UI/UX Designer. Create an ultra-tall vertical infographic landing page IMAGE (aspect ratio 9:32 or longer) featuring the ${productRef} from the uploaded image.
CRITICAL RULE: DO NOT write HTML/CSS. Generate a purely visual, seamless graphic IMAGE.

DESIGN & FLOW INSTRUCTIONS:
Build a continuous visual narrative utilizing smooth gradients (specifically ${dynamicColors}) and sleek kinetic lines. Avoid harsh dividers. Use a dynamic background that fits the [product vibe]. Showcase the product frequently.
${designFlow}

### FINAL LANGUAGE CHECK:
IMPORTANT: Make sure ALL text throughout the design is written strictly in ${language}. Please double-check every headline, label, button, and caption — they must all be in ${language}. No text in any other language is permitted.`;
  };

  const generatePrompt = () => {
    setError("");
    setCopied(false);

    let result;
    if (mainTab === "creative") {
      result = buildCreativePrompt();
    } else if (mode === "advanced") {
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


  const mainTabClass = (tab) =>
    `flex-1 py-3 px-4 text-center font-semibold rounded-xl transition cursor-pointer ${
      mainTab === tab
        ? "bg-blue-600 text-white shadow-md"
        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
    }`;

  const subTabClass = (active) =>
    `flex-1 py-2 px-3 text-sm font-semibold rounded-xl transition cursor-pointer ${
      active
        ? "bg-emerald-600 text-white shadow-md"
        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 leading-tight">
            Ecozed Prompt Generator
          </h1>
          <p className="text-base text-slate-500 mb-1">❤️ دعوة في ظهر الغيب تكفي</p>
          <p className="text-lg text-slate-600">
            جعل الإعلانات واختبار المنتجات أكثر سهولة
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8 space-y-6">
          {/* Main Tabs */}
          <div className="flex gap-3">
            <button onClick={() => { setMainTab("landing"); setMode("advanced"); }} className={mainTabClass("landing")}>
              صفحة هبوط
            </button>
            <button onClick={() => { setMainTab("creative"); setCreativeInputMode("advanced"); }} className={mainTabClass("creative")}>
              صورة إعلانية
            </button>
            <button onClick={() => setMainTab("video")} className={mainTabClass("video")}>
              فيديو إعلاني
            </button>
            <button onClick={() => setMainTab("voiceover")} className={mainTabClass("voiceover")}>
              تعليق صوتي
            </button>
          </div>

          {(mainTab === "landing" || mainTab === "creative") && (
            <div className="flex gap-2">
              <button
                onClick={() => mainTab === "landing" ? setMode("advanced") : setCreativeInputMode("advanced")}
                className={subTabClass(mainTab === "landing" ? mode === "advanced" : creativeInputMode === "advanced")}
              >
                إدخال يدوي
              </button>
              <button
                onClick={() => mainTab === "landing" ? setMode("fast") : setCreativeInputMode("fast")}
                className={subTabClass(mainTab === "landing" ? mode === "fast" : creativeInputMode === "fast")}
              >
                رابط منتج
              </button>
            </div>
          )}

          {mainTab === "video" || mainTab === "voiceover" ? (
            <div className="text-center py-20 text-slate-400">
              {mainTab === "video" ? (
                <>
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-2xl font-bold mb-2">قريباً</p>
              <p className="text-base">توليد فيديوهات إعلانية احترافية قيد التطوير</p>
                </>
              ) : (
                <>
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <p className="text-2xl font-bold mb-2">قريباً</p>
              <p className="text-base">توليد تعليقات صوتية احترافية قيد التطوير</p>
                </>
              )}
            </div>
          ) : (mainTab === "landing" && mode === "fast") || (mainTab === "creative" && creativeInputMode === "fast") ? (
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
          ) : (
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
          )}

          {(mainTab !== "video" && mainTab !== "voiceover") && (
            <>
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

            {/* Use Buyer Avatar — always on */}
            <label className="flex items-center gap-3 select-none opacity-60 cursor-not-allowed">
              <div className="w-6 h-6 rounded-md border-2 flex items-center justify-center bg-blue-600 border-blue-600">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-500">
                استخدام شخصية المشتري — إنشاء ملف تعريف لشخصية المشتري المستهدف لتوجيه التصميم
              </span>
            </label>

            {/* Ad Copy Checkbox — image creative only */}
            {mainTab === "creative" && (
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div
                onClick={() => setAdCopy(!adCopy)}
                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition cursor-pointer ${
                  adCopy
                    ? "bg-blue-600 border-blue-600"
                    : "border-slate-300 bg-white"
                }`}
              >
                {adCopy && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm font-medium text-slate-700">
                توليد نص الإعلان — إنشاء نص تسويقي قصير (Hook → Pain → Solution → CTA)
              </span>
            </label>
            )}

            {/* Sell Method — image creative only */}
            {mainTab === "creative" && (
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-2">طريقة البيع</h3>
              <div className="flex gap-3">
                <label className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition ${sellMethod === "messages" ? "bg-blue-50 border-blue-400 text-blue-700" : "bg-white border-slate-300 text-slate-600 hover:border-slate-400"}`}>
                  <div
                    onClick={() => setSellMethod("messages")}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition cursor-pointer ${sellMethod === "messages" ? "border-blue-600" : "border-slate-300"}`}
                  >
                    {sellMethod === "messages" && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                  </div>
                  <span className="text-sm font-medium">بيع عبر المراسلة</span>
                </label>
                <label className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition ${sellMethod === "website" ? "bg-blue-50 border-blue-400 text-blue-700" : "bg-white border-slate-300 text-slate-600 hover:border-slate-400"}`}>
                  <div
                    onClick={() => setSellMethod("website")}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition cursor-pointer ${sellMethod === "website" ? "border-blue-600" : "border-slate-300"}`}
                  >
                    {sellMethod === "website" && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                  </div>
                  <span className="text-sm font-medium">بيع عبر الموقع</span>
                </label>
              </div>
            </div>
            )}

            {/* Limited Quantity Checkbox */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div
                onClick={() => setLimitedQt(!limitedQt)}
                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition cursor-pointer ${
                  limitedQt
                    ? "bg-blue-600 border-blue-600"
                    : "border-slate-300 bg-white"
                }`}
              >
                {limitedQt && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm font-medium text-slate-700">
                الكمية محدودة جدا — إضافة عبارة الندرة والإلحاح
              </span>
            </label>

            {/* First Time in Algeria Checkbox */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div
                onClick={() => setFirstTimeDz(!firstTimeDz)}
                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition cursor-pointer ${
                  firstTimeDz
                    ? "bg-blue-600 border-blue-600"
                    : "border-slate-300 bg-white"
                }`}
              >
                {firstTimeDz && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm font-medium text-slate-700">
                لأول مرة في الجزائر — إضافة عبارة التفرد والحصرية
              </span>
            </label>

          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              {mainTab === "creative" ? "نمط الصورة الإعلانية" : "نمط أمر التصميم"}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(mainTab === "creative" ? creativeStyles : promptStyles).map((s) => (
                <button
                  key={s.id}
                  onClick={() => (mainTab === "creative" ? setCreativeStyle : setStyle)(s.id)}
                  className={`py-2.5 px-3 rounded-xl text-sm font-medium transition cursor-pointer ${
                    (mainTab === "creative" ? creativeStyle : style) === s.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
            </>)}

          {/* Error */}
          {error && mainTab !== "video" && mainTab !== "voiceover" && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-center font-medium">
              {error}
            </div>
          )}

          {/* Pre-prompts */}
          <div className="mt-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl p-5 md:p-6 border border-slate-700">
            <div className="flex items-start gap-3">
              <span className="text-yellow-400 text-xl leading-none mt-0.5 shrink-0">⚡</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-sm mb-1">الأوامر التأسيسية — تُرسل مرة واحدة فقط</h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  اختر الأوامر المناسبة لمهمتك وأرسلها للذكاء الاصطناعي <strong className="text-yellow-400">مرة واحدة فقط</strong> في بداية المحادثة قبل أوامر المنتج.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {preprompts.map((p) => {
                    const labels = {
                      "avatar": { title: "شخصية المشتري", desc: "تحليل العملاء وبناء شخصيات المشتري" },
                      "image": { title: "توليد الصور", desc: "إنشاء وتحسين الصور التسويقية" },
                      "ads": { title: "الإعلانات المدفوعة", desc: "استراتيجيات وحملات الإعلانات" },
                      "ad-creative": { title: "كتابة الإعلانات", desc: "توليد نصوص إعلانية احترافية" },
                    };
                    const l = labels[p.id] || { title: p.name, desc: "" };
                    return (
                      <div key={p.id} className="bg-slate-700/60 border border-slate-600 rounded-xl p-3.5 hover:border-blue-500/50 transition-all">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h4 className="text-sm font-bold text-white">{l.title}</h4>
                          <button
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(p.content);
                              } catch {
                                const ta = document.createElement("textarea");
                                ta.value = p.content;
                                document.body.appendChild(ta);
                                ta.select();
                                document.execCommand("copy");
                                document.body.removeChild(ta);
                              }
                              setCopiedPre(p.id);
                              setTimeout(() => setCopiedPre(null), 2000);
                            }}
                            className={`shrink-0 text-xs font-medium py-1 px-2.5 rounded-lg border transition-all cursor-pointer ${
                              copiedPre === p.id
                                ? "bg-green-900/60 text-green-300 border-green-600"
                                : "bg-slate-600 text-slate-300 border-slate-500 hover:bg-slate-500 hover:text-white"
                            }`}
                          >
                            {copiedPre === p.id ? "تم ✓" : "نسخ"}
                          </button>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{l.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center mt-4 leading-relaxed">
            💡 للحصول على أفضل النتائج، أضف هذه الأوامر إلى الذكاء الاصطناعي — واحدة تلو الأخرى —
          </p>

          {/* Generate */}
          {(mainTab !== "video" && mainTab !== "voiceover") && (
          <button
            onClick={generatePrompt}
            className="w-full bg-gradient-to-l from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] cursor-pointer"
          >
            {mainTab === "creative" ? "إنشاء الصورة الإعلانية" : mode === "advanced" ? "إنشاء أمر التصميم" : "إنشاء الأمر السريع"}
          </button>
          )}
        </div>

        {/* Output */}
        {output && (
          <div ref={outputRef} className="mt-8 bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                {mainTab === "creative" ? "الصورة الإعلانية المُنتَجة" : "أمر التصميم المُنتَج"}
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
