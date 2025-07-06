'use client';

import { useState } from 'react';
import OptimizedResumeViewer from './aicomponents/OptimizedResumeViewer/page';
import './styles/resume.css';

export default function AiPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        overflowY: 'auto',
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
      }}
    >
      <AiOptimizer />
    </main>
  );
}

function AiOptimizer() {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    website: '',
    linkedin: '',
    location: '',
    jobTitle: '',
    summary: '',
    languages: '',
    education: [{ degree: '', field: '', institution: '', durationEdu: '', gpa: '' }],
    experience: [{ title: '', company: '', project: '', durationExp: '', responsibilities: '' }],
    skills: [''],
    tools: [''],
    certifications: [''],
    projects: [{ name: '', description: '', link: '' }],
    jobdesc: ''
  });

  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const GEMINI_API_KEY = 'AIzaSyCkAbS7rT0uK-GqBgVSfCGRZWMMftmOEyc';

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEduChange = (i, e) => {
    const newEdu = [...form.education];
    newEdu[i][e.target.name] = e.target.value;
    setForm({ ...form, education: newEdu });
  };
  const addEducation = () =>
    setForm({
      ...form,
      education: [...form.education, { degree: '', field: '', institution: '', durationEdu: '', gpa: '' }]
    });
  const removeEducation = (i) =>
    setForm({ ...form, education: form.education.filter((_, index) => index !== i) });

  const handleExpChange = (i, e) => {
    const newExp = [...form.experience];
    newExp[i][e.target.name] = e.target.value;
    setForm({ ...form, experience: newExp });
  };
  const addExperience = () =>
    setForm({
      ...form,
      experience: [
        ...form.experience,
        { title: '', company: '', project: '', durationExp: '', responsibilities: '' }
      ]
    });
  const removeExperience = (i) =>
    setForm({ ...form, experience: form.experience.filter((_, index) => index !== i) });

  const handleSkillChange = (i, e) => {
    const newSkills = [...form.skills];
    newSkills[i] = e.target.value;
    setForm({ ...form, skills: newSkills });
  };
  const addSkill = () => setForm({ ...form, skills: [...form.skills, ''] });
  const removeSkill = (i) =>
    setForm({ ...form, skills: form.skills.filter((_, index) => index !== i) });

  const handleToolChange = (i, e) => {
    const newTools = [...form.tools];
    newTools[i] = e.target.value;
    setForm({ ...form, tools: newTools });
  };
  const addTool = () => setForm({ ...form, tools: [...form.tools, ''] });
  const removeTool = (i) =>
    setForm({ ...form, tools: form.tools.filter((_, index) => index !== i) });

  const handleCertChange = (i, e) => {
    const newCerts = [...form.certifications];
    newCerts[i] = e.target.value;
    setForm({ ...form, certifications: newCerts });
  };
  const addCert = () => setForm({ ...form, certifications: [...form.certifications, ''] });
  const removeCert = (i) =>
    setForm({ ...form, certifications: form.certifications.filter((_, index) => index !== i) });

  const handleProjectChange = (i, e) => {
    const newProjects = [...form.projects];
    newProjects[i][e.target.name] = e.target.value;
    setForm({ ...form, projects: newProjects });
  };
  const addProject = () =>
    setForm({
      ...form,
      projects: [...form.projects, { name: '', description: '', link: '' }]
    });
  const removeProject = (i) =>
    setForm({ ...form, projects: form.projects.filter((_, index) => index !== i) });

  const buildResumeJSON = () => ({
    name: { firstname: form.firstname, lastname: form.lastname },
    contact: {
      email: form.email,
      phone: form.phone,
      website: form.website,
      linkedin: form.linkedin
    },
    location: form.location,
    jobTitle: form.jobTitle,
    summary: form.summary,
    skills: form.skills.filter(Boolean),
    tools: form.tools.filter(Boolean),
    languages: form.languages.split(',').map((l) => l.trim()),
    education: form.education.map((edu) => ({
      degree: edu.degree,
      field: edu.field,
      institution: edu.institution,
      duration: edu.durationEdu,
      gpa: edu.gpa
    })),
    experience: form.experience.map((exp) => ({
      title: exp.title,
      company: exp.company,
      project: exp.project,
      duration: exp.durationExp,
      responsibilities: exp.responsibilities.split(',').map((r) => r.trim())
    })),
    projects: form.projects.map((proj) => ({
      name: proj.name,
      description: proj.description,
      link: proj.link
    })),
    certifications: form.certifications.filter(Boolean)
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOutput('⏳ Generating optimized resume...');

    const resumeJSON = buildResumeJSON();
    const prompt = `
You are a professional ATS resume optimizer.

TASK:
You are an advanced resume optimization expert and applicant tracking system (ATS) specialist.

Rewrite the following JSON resume so that it is 100% tailored for the provided job description. 

**Do this:**
- KEEP the exact JSON structure, only update its values (fields inside).
- Enhance the summary to integrate strong, relevant keywords and phrases directly from the job description.
- Rewrite each experience entry with action verbs, measurable metrics (percentages, dollar values, time improvements, user counts), and outcomes tied to the job description.
- Select and optimize up to **8 total skills** and **4 total tools** that best match and prioritize the job requirements. Remove unrelated ones.
- Ensure language matches the job description exactly, to maximize ATS keyword matching.
- Maintain professional tone, clarity, and conciseness. Avoid filler.

Resume:
${JSON.stringify(resumeJSON, null, 2)}

Job description:
"""${form.jobdesc}"""
`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
          })
        }
      );

      const json = await res.json();
      const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        setOutput(`❌ Could not extract valid JSON.\n\n${text}`);
      } else {
        setOutput(JSON.parse(jsonMatch[0]));
      }
    } catch (err) {
      setOutput(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-builder">
      <h1 className="resume-builder__title">Build Your Resume & Generate Optimized Version</h1>
      <form className="resume-builder__form" onSubmit={handleSubmit}>
    <h3 className="resume-builder__section-title">Personal Info</h3>
    <input className="resume-builder__input" name="firstname" placeholder="First Name" value={form.firstname} onChange={handleFormChange} required />
    <input className="resume-builder__input" name="lastname" placeholder="Last Name" value={form.lastname} onChange={handleFormChange} required />
    <input className="resume-builder__input" name="email" placeholder="Email" value={form.email} onChange={handleFormChange} required />
    <input className="resume-builder__input" name="phone" placeholder="Phone" value={form.phone} onChange={handleFormChange} required />
    <input className="resume-builder__input" name="website" placeholder="Website" value={form.website} onChange={handleFormChange} />
    <input className="resume-builder__input" name="linkedin" placeholder="LinkedIn" value={form.linkedin} onChange={handleFormChange} />
    <input className="resume-builder__input" name="location" placeholder="Location" value={form.location} onChange={handleFormChange} required />
    <input className="resume-builder__input" name="jobTitle" placeholder="Job Title" value={form.jobTitle} onChange={handleFormChange} required />
    <textarea className="resume-builder__textarea" name="summary" placeholder="Summary" rows="3" value={form.summary} onChange={handleFormChange} required></textarea>

    <h3 className="resume-builder__section-title">Skills</h3>
    {form.skills.map((skill, i) => (
      <div className="resume-builder__list-item" key={i}>
        <input className="resume-builder__input" value={skill} onChange={e => handleSkillChange(i, e)} placeholder={`Skill #${i+1}`} />
        <button type="button" className="resume-builder__delete-btn" onClick={() => removeSkill(i)}>Delete</button>
      </div>
    ))}
    <button type="button" className="resume-builder__add-btn" onClick={addSkill}>+ Add Skill</button>

    <h3 className="resume-builder__section-title">Tools</h3>
    {form.tools.map((tool, i) => (
      <div className="resume-builder__list-item" key={i}>
        <input className="resume-builder__input" value={tool} onChange={e => handleToolChange(i, e)} placeholder={`Tool #${i+1}`} />
        <button type="button" className="resume-builder__delete-btn" onClick={() => removeTool(i)}>Delete</button>
      </div>
    ))}
    <button type="button" className="resume-builder__add-btn" onClick={addTool}>+ Add Tool</button>

    <h3 className="resume-builder__section-title">Certifications</h3>
    {form.certifications.map((cert, i) => (
      <div className="resume-builder__list-item" key={i}>
        <input className="resume-builder__input" value={cert} onChange={e => handleCertChange(i, e)} placeholder={`Certification #${i+1}`} />
        <button type="button" className="resume-builder__delete-btn" onClick={() => removeCert(i)}>Delete</button>
      </div>
    ))}
    <button type="button" className="resume-builder__add-btn" onClick={addCert}>+ Add Certification</button>

    <h3 className="resume-builder__section-title">Languages</h3>
    <input className="resume-builder__input" name="languages" placeholder="Languages (comma-separated)" value={form.languages} onChange={handleFormChange} />

    <h3 className="resume-builder__section-title">Education</h3>
    {form.education.map((edu, i) => (
      <div className="resume-builder__card" key={i}>
        <input className="resume-builder__input" name="degree" placeholder="Degree" value={edu.degree} onChange={e => handleEduChange(i, e)} />
        <input className="resume-builder__input" name="field" placeholder="Field" value={edu.field} onChange={e => handleEduChange(i, e)} />
        <input className="resume-builder__input" name="institution" placeholder="Institution" value={edu.institution} onChange={e => handleEduChange(i, e)} />
        <input className="resume-builder__input" name="durationEdu" placeholder="Duration" value={edu.durationEdu} onChange={e => handleEduChange(i, e)} />
        <input className="resume-builder__input" name="gpa" placeholder="GPA" value={edu.gpa} onChange={e => handleEduChange(i, e)} />
        <button type="button" className="resume-builder__delete-btn" onClick={() => removeEducation(i)}>Delete</button>
      </div>
    ))}
    <button type="button" className="resume-builder__add-btn" onClick={addEducation}>+ Add Education</button>

    <h3 className="resume-builder__section-title">Experience</h3>
    {form.experience.map((exp, i) => (
      <div className="resume-builder__card" key={i}>
        <input className="resume-builder__input" name="title" placeholder="Title" value={exp.title} onChange={e => handleExpChange(i, e)} />
        <input className="resume-builder__input" name="company" placeholder="Company" value={exp.company} onChange={e => handleExpChange(i, e)} />
        <input className="resume-builder__input" name="project" placeholder="Project" value={exp.project} onChange={e => handleExpChange(i, e)} />
        <input className="resume-builder__input" name="durationExp" placeholder="Duration" value={exp.durationExp} onChange={e => handleExpChange(i, e)} />
        <textarea className="resume-builder__textarea" name="responsibilities" placeholder="Responsibilities (comma-separated)" rows="2" value={exp.responsibilities} onChange={e => handleExpChange(i, e)}></textarea>
        <button type="button" className="resume-builder__delete-btn" onClick={() => removeExperience(i)}>Delete</button>
      </div>
    ))}
    <button type="button" className="resume-builder__add-btn" onClick={addExperience}>+ Add Experience</button>

    <h3 className="resume-builder__section-title">Projects</h3>
    {form.projects.map((proj, i) => (
      <div className="resume-builder__card" key={i}>
        <input className="resume-builder__input" name="name" placeholder="Project Name" value={proj.name} onChange={e => handleProjectChange(i, e)} />
        <textarea className="resume-builder__textarea" name="description" placeholder="Description" rows="2" value={proj.description} onChange={e => handleProjectChange(i, e)}></textarea>
        <input className="resume-builder__input" name="link" placeholder="Project Link" value={proj.link} onChange={e => handleProjectChange(i, e)} />
        <button type="button" className="resume-builder__delete-btn" onClick={() => removeProject(i)}>Delete</button>
      </div>
    ))}
    <button type="button" className="resume-builder__add-btn" onClick={addProject}>+ Add Project</button>

    <h3 className="resume-builder__section-title">Job Description</h3>
    <textarea className="resume-builder__textarea resume-builder__textarea--monospace" name="jobdesc" rows="5" value={form.jobdesc} onChange={handleFormChange} required></textarea>

    <button type="submit" className="resume-builder__submit-btn">
      {loading ? 'Generating...' : 'Generate Optimized Resume'}
    </button>
     </form>

      <div className="resume-builder__output">
  {typeof output === 'string' ? (
    <pre className="resume-builder__pre">{output}</pre>
  ) : (
    output && (
      <div className="resume-builder__viewer-fullscreen">
        <button className="resume-builder__back-btn" onClick={() => setOutput(null)}>⬅ Back to Builder</button>
        <OptimizedResumeViewer output={output} />
      </div>
    )
  )}
</div>

    </div>
  );
}
