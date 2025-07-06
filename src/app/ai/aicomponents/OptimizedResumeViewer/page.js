'use client';
export const dynamic = 'force-dynamic';

import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './OptimizedResumeViewer.css';

export default function OptimizedResumeViewer({ output: initialOutput }) {
  const resumeRef = useRef();
  const [prompt, setPrompt] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [loading, setLoading] = useState(false);

  // Default safe structure
  const defaultOutput = {
    name: { firstname: '', lastname: '' },
    contact: { email: '', phone: '', website: '', linkedin: '' },
    location: '',
    jobTitle: '',
    summary: '',
    skills: [],
    tools: [],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    languages: []
  };

  const [output, setOutput] = useState(structuredClone(initialOutput || defaultOutput));

  const GEMINI_API_KEY = "AIzaSyCkAbS7rT0uK-GqBgVSfCGRZWMMftmOEyc";

  const downloadPDF = async () => {
    const element = resumeRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(`${output.name.firstname}_${output.name.lastname}_Resume.pdf`);
  };

  const downloadJPEG = async () => {
    const element = resumeRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/jpeg', 1.0);

    const link = document.createElement('a');
    link.href = imgData;
    link.download = `${output.name.firstname}_${output.name.lastname}_Resume.jpeg`;
    link.click();
  };

  const handleGenerateAI = async () => {
    setLoading(true);
    setAiResult('⏳ Thinking...');

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ]
    };

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      const json = await res.json();
      console.log('Full AI JSON:', json);

      let text = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (!text && json?.candidates?.[0]?.output) {
        text = json.candidates[0].output;
      }
      if (!text) {
        text = '❌ No meaningful text response from AI.';
      }

      text = text
        .replace(/[\*\_\#\-\`]/g, '')
        .replace(/\s{2,}/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

      setAiResult(text);
    } catch (err) {
      setAiResult(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (path, value) => {
    setOutput((prev) => {
      const updated = structuredClone(prev);
      const keys = path.split('.');
      let obj = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  if (!output) {
    return <div>⚠️ No resume data available.</div>;
  }

  // ✂️ [Retain your long JSX layout below this point — unchanged]
  // ✅ This version includes all your JSX resume display and edit logic
  // ✅ Now works with default data, avoids build errors, and enables AI generation

  return (
    <>
      <div className="resume" ref={resumeRef}>
        <h1
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => updateField("name.firstname", e.currentTarget.textContent.split(" ")[0])}
        >
          {output.name.firstname} {output.name.lastname}
        </h1>

        <div className="contact-grid">
          <p><strong>Email:</strong>
            <span contentEditable suppressContentEditableWarning onInput={(e) => updateField("contact.email", e.currentTarget.textContent)}>
              {output.contact.email}
            </span>
          </p>
          <p><strong>Phone:</strong>
            <span contentEditable suppressContentEditableWarning onInput={(e) => updateField("contact.phone", e.currentTarget.textContent)}>
              {output.contact.phone}
            </span>
          </p>
          <p><strong>Website:</strong>
            <span contentEditable suppressContentEditableWarning onInput={(e) => updateField("contact.website", e.currentTarget.textContent)}>
              {output.contact.website}
            </span>
          </p>
          <p><strong>LinkedIn:</strong>
            <span contentEditable suppressContentEditableWarning onInput={(e) => updateField("contact.linkedin", e.currentTarget.textContent)}>
              {output.contact.linkedin}
            </span>
          </p>
          <p><strong>Location:</strong>
            <span contentEditable suppressContentEditableWarning onInput={(e) => updateField("location", e.currentTarget.textContent)}>
              {output.location}
            </span>
          </p>
        </div>

        <h2
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => updateField("jobTitle", e.currentTarget.textContent)}
        >
          {output.jobTitle}
        </h2>
        <p
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => updateField("summary", e.currentTarget.textContent)}
        >
          {output.summary}
        </p>

        <h2>Skills</h2>
        <ul className="flex-list">
          {output.skills.map((skill, i) => (
            <li
              key={i}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => {
                const newSkills = [...output.skills];
                newSkills[i] = e.currentTarget.textContent;
                setOutput({ ...output, skills: newSkills });
              }}
            >{skill}</li>
          ))}
        </ul>

        <h2>Tools</h2>
        <ul className="flex-list">
          {output.tools.map((tool, i) => (
            <li
              key={i}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => {
                const newTools = [...output.tools];
                newTools[i] = e.currentTarget.textContent;
                setOutput({ ...output, tools: newTools });
              }}
            >{tool}</li>
          ))}
        </ul>

        <h2>Education</h2>
        {output.education.map((edu, i) => (
          <div key={i}>
            <p
              className="job-title"
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => {
                const newEdus = [...output.education];
                newEdus[i].degree = e.currentTarget.textContent.split(" in ")[0] || newEdus[i].degree;
                newEdus[i].field = e.currentTarget.textContent.split(" in ")[1] || newEdus[i].field;
                setOutput({ ...output, education: newEdus });
              }}
            >
              {edu.degree} in {edu.field}
            </p>
            <p
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => {
                const newEdus = [...output.education];
                const parts = e.currentTarget.textContent.split("|").map(s => s.trim());
                newEdus[i].institution = parts[0] || newEdus[i].institution;
                newEdus[i].duration = parts[1] || newEdus[i].duration;
                newEdus[i].gpa = parts[2]?.replace("GPA:", "").trim() || newEdus[i].gpa;
                setOutput({ ...output, education: newEdus });
              }}
            >
              {edu.institution} | {edu.duration} | GPA: {edu.gpa}
            </p>
          </div>
        ))}

        <h2>Experience</h2>
        {output.experience.map((exp, i) => (
          <div key={i}>
            <p
              className="job-title"
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => {
                const newExps = [...output.experience];
                const parts = e.currentTarget.textContent.split("@").map(s => s.trim());
                newExps[i].title = parts[0] || newExps[i].title;
                newExps[i].company = parts[1] || newExps[i].company;
                setOutput({ ...output, experience: newExps });
              }}
            >
              {exp.title} @ {exp.company}
            </p>
            <p
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => {
                const newExps = [...output.experience];
                newExps[i].project = e.currentTarget.textContent.replace("Project:", "").trim();
                setOutput({ ...output, experience: newExps });
              }}
            ><strong>Project:</strong> {exp.project}</p>
            <p
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => {
                const newExps = [...output.experience];
                newExps[i].duration = e.currentTarget.textContent.replace("Duration:", "").trim();
                setOutput({ ...output, experience: newExps });
              }}
            ><strong>Duration:</strong> {exp.duration}</p>
            <ul className="responsibilities">
              {exp.responsibilities.map((r, j) => (
                <li
                  key={j}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => {
                    const newExps = [...output.experience];
                    newExps[i].responsibilities[j] = e.currentTarget.textContent;
                    setOutput({ ...output, experience: newExps });
                  }}
                >{r}</li>
              ))}
            </ul>
          </div>
        ))}

        <h2>Projects</h2>
        {output.projects.map((proj, i) => (
          <div key={i}>
            <p
              className="job-title"
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => {
                const newProjs = [...output.projects];
                newProjs[i].name = e.currentTarget.textContent;
                setOutput({ ...output, projects: newProjs });
              }}
            >{proj.name}</p>
            <p
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => {
                const newProjs = [...output.projects];
                newProjs[i].description = e.currentTarget.textContent;
                setOutput({ ...output, projects: newProjs });
              }}
            >{proj.description}</p>
            <p
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => {
                const newProjs = [...output.projects];
                newProjs[i].link = e.currentTarget.textContent;
                setOutput({ ...output, projects: newProjs });
              }}
            ><a href={proj.link} target="_blank" rel="noreferrer">{proj.link}</a></p>
          </div>
        ))}

        <h2>Certifications</h2>
        <ul className="flex-list">
          {output.certifications.map((c, i) => (
            <li
              key={i}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => {
                const newCerts = [...output.certifications];
                newCerts[i] = e.currentTarget.textContent;
                setOutput({ ...output, certifications: newCerts });
              }}
            >{c}</li>
          ))}
        </ul>

        <h2>Languages</h2>
        <ul className="flex-list">
          {output.languages.map((lang, i) => (
            <li
              key={i}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => {
                const newLangs = [...output.languages];
                newLangs[i] = e.currentTarget.textContent;
                setOutput({ ...output, languages: newLangs });
              }}
            >{lang}</li>
          ))}
        </ul>
      </div>

          {/* Download buttons */}
      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <button
          onClick={downloadPDF}
          style={{
            margin: '5px',
            padding: '10px 20px',
            background: '#2c3e50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ⬇️ Download PDF
        </button>
        <button
          onClick={downloadJPEG}
          style={{
            margin: '5px',
            padding: '10px 20px',
            background: '#8e44ad',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          🖼️ Download JPEG
        </button>
      </div>

      {/* Gemini AI Suggestion Box */}
      <div style={{ maxWidth: '700px', margin: '30px auto' }}>
        <h3>🧠 Ask Gemini AI anything about this resume:</h3>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="E.g., Suggest improvements to my experience section..."
          rows="4"
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontFamily: 'monospace'
          }}
        />
        <button
          onClick={handleGenerateAI}
          disabled={loading}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            background: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '15px'
          }}
        >
          {loading ? 'Generating...' : 'Ask Gemini AI'}
        </button>

        {aiResult && (
          <div
            style={{
              background: '#f4f4f4',
              padding: '15px',
              marginTop: '20px',
              borderRadius: '5px'
            }}
          >
            <pre style={{ whiteSpace: 'pre-wrap' }}>{aiResult}</pre>
          </div>
        )}
      </div>
    </>
  );
}
