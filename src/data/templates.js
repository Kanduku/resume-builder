const templates = [
  {
    label: " Title",
    options: [
      { label: "Bold Large", type: "paragraph", content: "John Doe\nFull Stack Developer", styles: { fontSize: "28px", fontWeight: "bold" }},
      { label: "Subtle Small", type: "paragraph", content: "John Doe\nDeveloper", styles: { fontSize: "18px", color: "#444" }},
      { label: "Colorful Title", type: "paragraph", content: "🚀 John Doe", styles: { fontSize: "26px", fontWeight: "600", color: "#007acc" }},
      { label: "Elegant Serif", type: "paragraph", content: "John Doe\nSoftware Engineer", styles: { fontSize: "24px", fontFamily: "Georgia, serif", fontStyle: "italic", color: "#333" }},
      { label: "Shadow Title", type: "paragraph", content: "John Doe", styles: { fontSize: "30px", fontWeight: "700", textShadow: "2px 2px #aaa" }},
      { label: "Caps Spaced", type: "paragraph", content: "JOHN DOE", styles: { fontSize: "22px", letterSpacing: "3px", textTransform: "uppercase", color: "#555" }}
    ]
  },
  {
    label: " Summary",
    options: [
      { label: "Italic", type: "paragraph", content: "Motivated engineer passionate about clean code and scalable architecture.", styles: { fontStyle: "italic" }},
      { label: "Compact", type: "paragraph", content: "Engineer, loves scalable clean solutions.", styles: { fontSize: "14px" }},
      { label: "Highlighted", type: "paragraph", content: "💡 Motivated engineer with passion for clean code.", styles: { fontSize: "16px", background: "#fffae6" }},
      { label: "Soft Border", type: "paragraph", content: "Passionate about scalable, maintainable code and teamwork.", styles: { border: "1px solid #ccc", padding: "6px", borderRadius: "4px" }},
      { label: "Muted Gray", type: "paragraph", content: "Developer who builds robust systems with clean architecture.", styles: { color: "#777", fontSize: "15px" }},
      { label: "Large Emphasis", type: "paragraph", content: "🚀 Building reliable systems with clean design.", styles: { fontSize: "20px", fontWeight: "600", color: "#333" }}
    ]
  },
  {
    label: " Contact Info",
    options: [
      { label: "Compact Inline", type: "paragraph", content: "📞 +91 1234567890 | ✉ john@example.com | 🌐 johndoe.dev", styles: { fontSize: "14px" }},
      { label: "Centered Bold", type: "paragraph", content: "📍 Bangalore, India", styles: { fontSize: "16px", fontWeight: "600", textAlign: "center" }},
      { label: "Muted Simple", type: "paragraph", content: "✉ john@example.com", styles: { fontSize: "14px", color: "#777" }},
      { label: "Mobile Highlight", type: "paragraph", content: "📱 +91 9876543210", styles: { background: "#f0faff", padding: "4px", borderRadius: "4px", fontSize: "15px" }},
      { label: "Box Email", type: "paragraph", content: "✉ contact@johndoe.dev", styles: { border: "1px solid #007acc", padding: "4px", borderRadius: "4px", fontSize: "14px" }},
      { label: "Soft Card Links", type: "list", content: ["LinkedIn: linkedin.com/in/johndoe", "GitHub: github.com/johndoe", "Portfolio: johndoe.dev"], styles: { background: "#f9f9f9", padding: "8px", borderRadius: "6px" }},
      { label: "Simple Dash List", type: "list", content: ["📞 +91 1234567890", "✉ john@example.com", "🌐 johndoe.dev"], styles: { fontSize: "14px", color: "#444" }}
    ]
  },
  {
    label: " Experience List",
    options: [
      { label: "Detailed List", type: "list", content: ["Company: XYZ Ltd, Frontend Developer, 2020-2023","- Developed SPA using React & Redux","- Improved performance by 30%","- Led team of 4 engineers"], styles: { margin: "10px 0" }},
      { label: "Minimal List", type: "list", content: ["XYZ Ltd - Frontend Dev", "React, Redux", "2020-2023"], styles: { color: "#555" }},
      { label: "Compact Bullet", type: "list", content: ["ABC Inc - Backend", "Node.js, Express", "2018-2020"], styles: { fontSize: "14px", color: "#333" }},
      { label: "Highlighted List", type: "list", content: ["Startup Co - Fullstack", "Vue, GraphQL", "2016-2018"], styles: { background: "#f9f9f9", padding: "8px", borderRadius: "6px" }}
    ]
  },
  {
    label: " Skills List",
    options: [
      { label: "Bulleted", type: "list", content: ["✔ HTML", "✔ CSS", "✔ JavaScript", "✔ React"], styles: {} },
      { label: "Inline", type: "paragraph", content: "Skills: HTML, CSS, JavaScript, React, Node.js", styles: { fontSize: "15px" }},
      { label: "Caps Skills", type: "paragraph", content: "HTML, CSS, JAVASCRIPT, REACT", styles: { fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }},
      { label: "Muted Inline", type: "paragraph", content: "HTML, CSS, JavaScript, React", styles: { color: "#666", fontSize: "14px" }},
      { label: "Soft Card Skills", type: "list", content: ["JavaScript", "React", "Node.js", "GraphQL"], styles: { background: "#f8faff", padding: "6px", borderRadius: "4px" }}
    ]
  },
  {
    label: " Certifications",
    options: [
      { label: "Bullet Certs", type: "list", content: ["AWS Certified Solutions Architect", "Certified Kubernetes Admin"], styles: {} },
      { label: "Compact Inline", type: "paragraph", content: "Certifications: AWS, Kubernetes, Docker", styles: { fontSize: "14px" }},
      { label: "Framed Highlight", type: "paragraph", content: "📜 Google Cloud Professional", styles: { border: "1px solid #007acc", padding: "4px", borderRadius: "4px" }},
      { label: "Soft List", type: "list", content: ["AZ-204 Microsoft Certified", "Coursera AI ML Specialist"], styles: { background: "#fffae6", padding: "6px", borderRadius: "4px" }}
    ]
  },
  {
    label: " Projects",
    options: [
      { label: "Highlighted Card", type: "paragraph", content: "📂 Project: AI Chatbot\n- Built using Python & TensorFlow\n- Deployed on GCP", styles: { background: "#f0faff", padding: "8px", borderRadius: "6px" }},
      { label: "Minimal Line", type: "paragraph", content: "Project: Portfolio Website - React, Tailwind", styles: { fontSize: "14px", color: "#333" }},
      { label: "Bold Title", type: "paragraph", content: "🚀 ML Prediction System", styles: { fontSize: "16px", fontWeight: "700" }},
      { label: "Soft Border Project", type: "paragraph", content: "GraphQL Dashboard with Node & React", styles: { border: "1px solid #ccc", padding: "4px", borderRadius: "4px" }}
    ]
  },
  {
    label: " Awards / Achievements",
    options: [
      { label: "Star Highlight", type: "paragraph", content: "🏆 Best Developer Award - 2022", styles: { fontSize: "16px", color: "#333", fontWeight: "600" }},
      { label: "Soft Card", type: "paragraph", content: "💡 Hackathon Winner - AI Track", styles: { background: "#f9f9f9", padding: "6px", borderRadius: "4px" }},
      { label: "Tiny Gray", type: "paragraph", content: "Employee of the Month - March 2021", styles: { fontSize: "12px", color: "#999" }}
    ]
  },
  {
    label: " Interests",
    options: [
      { label: "Fun List", type: "list", content: ["🎸 Guitar", "📷 Photography", "✈ Travel"], styles: {} },
      { label: "Inline Likes", type: "paragraph", content: "Interests: Music, Hiking, Open Source", styles: { fontSize: "14px" }},
      { label: "Soft Highlight", type: "paragraph", content: "💻 Love tinkering with new frameworks", styles: { background: "#fffae6", padding: "4px", borderRadius: "4px" }}
    ]
  }
];

export default templates;
