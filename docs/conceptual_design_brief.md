### **Visual Inspiration Brief**

Based on the PRD's focus on a "cutting-edge", professional, and powerful aesthetic for an AI SaaS tool, I have researched contemporary landing pages that balance technological sophistication with clear, trust-inspiring communication. Here are three inspirational examples:

**1\. RunwayML**

* **Link:** `https://runwayml.com/`  
* **Relevance:** RunwayML's website is an excellent example of a dark-themed UI that feels modern and directly suited to an AI product. The use of subtle background videos and high-contrast typography creates a sense of innovation and power, aligning with the "cutting-edge" feel desired for 'The Bigger Boss'. The way they embed interactive elements and product demos directly into the page is a great reference for the "Instant Angle" generator.

**2\. Spline**

* **Link:** `https://spline.design/`  
* **Relevance:** Spline excels at creating a clean, professional, and highly interactive landing page. Its layout is spacious and uses a strong visual hierarchy to guide the user. This approach aligns with the need for a "Standard Professional Layout". Their use of colour is restrained but effective, employing a vibrant primary action colour against a neutral background, which would be an effective strategy for the primary CTA buttons.

**3\. Linear**

* **Link:** `https://linear.app/`  
* **Relevance:** Linear is a benchmark for B2B SaaS design that feels premium and efficient. The design is exceptionally clean, with meticulous attention to typography, spacing, and subtle gradients. This is a perfect inspiration for achieving a trustworthy and strategic aesthetic that appeals to both SMBs and agency professionals. The way they structure their "How it Works" and feature sections is a strong model for communicating a complex process with clarity.

---

### **Conceptual Design Brief**

**Recommended Mood & Aesthetic** The aesthetic should be **Professional, Powerful, and Innovative**. We need to convey that 'The Bigger Boss' is not just a simple tool but a strategic AI partner. The design should feel clean, trustworthy, and cutting-edge to appeal to both ambitious small business owners and savvy agency professionals. A modern dark theme would be highly effective in establishing this "AI-native" and premium feel, making key interactive elements and data visualisations stand out.

**Suggested Colour Palette** The palette must ensure clarity and meet accessibility standards for contrast. Using design tokens is critical for maintaining consistency. I recommend the following conceptual structure:

* **Background & Surface:** A deep charcoal or dark navy (`--color-background-primary`) to establish the sophisticated, dark aesthetic. Lighter grey tones (  
  `--color-surface-secondary`) can be used for contained elements like `Cards`.  
* **Primary Action:** A vibrant, high-contrast colour (e.g., a bright electric blue or green, `--color-action-primary`) for all main call-to-action `Button` components, such as "Start Your Limited Free Trial". This must have a 4.5:1 contrast ratio against the background.  
* **Text:** A high-contrast off-white (`--color-text-primary`) for body copy and a slightly lower-contrast grey (`--color-text-secondary`) for sub-headings and helper text.  
* **Feedback & Accents:** Utilise standard semantic colours for feedback states: a green for success, a red/amber for errors, and a blue for informational `Alerts` or `Toasts`.

**Typography Recommendations** Typography must establish a clear visual hierarchy to guide the user's attention through the page's content.

* **Headings:** Use a large, bold, modern sans-serif font for primary headlines (e.g., "Stop Competing. Start Dominating." ) to create impact and draw the user in.  
* **Body & UI Text:** A clean, highly legible sans-serif font should be used for all body copy and component labels to ensure readability and a professional feel.  
* **Scale:** Adhere to a strict typographic scale. Use the largest heading styles for section titles and smaller, semi-bold styles for sub-headings and  
   `Card` titles to create structure and consistency.

**UI & Interaction Style Notes** All components should be implemented according to the `SOP: Core Component Design System & Style Guide`.

* **Buttons:**  
  * For the main CTA ("Claim Your Free Trial Now" ), use the  
     `Button` component with the `primary` and `contained` variants for maximum emphasis.  
  * For the "Dual-Path" toggles ("For My Business" / "For My Agency" ), use the  
     `secondary` or `ghost` variant to create a clear distinction from the primary action button.  
  * Ensure all buttons have clear  
     `hover`, `focus`, and `disabled` states to provide essential user feedback. A  
     `loading` state with a spinner is critical for the "Instant Angle" generator's submit button.  
* **Inputs:**  
  * The "Instant Angle" generator's inputs should use the  
     `Text Input` component, with the `outlined` variant for a modern feel. They must include persistent labels and helper text for maximum clarity and usability.  
* **Feedback:**  
  * When the interactive tool is processing, a  
     `Loading Indicator` or `Spinner` should be clearly visible.  
  * After the tool provides its results, the sign-up form should be presented. Consider wrapping this in a  
     `Modal` component to focus user attention on the critical conversion step.  
* **Layout & Content:**  
  * Use the  
     `Card` component with the `elevated` variant to visually group and present testimonials or feature descriptions in a clean, organised manner.  
  * The FAQ section should use an accordion pattern, which could be constructed from  
     `Card` or similar custom components, to keep the page tidy as suggested.
