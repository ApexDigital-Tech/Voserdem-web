const fs = require('fs');

const content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const s1 = content.indexOf('  // Project Editing / Creating States');
const e1Text = "const [formImage, setFormImage] = useState('');";
const e1 = content.indexOf(e1Text, s1) + e1Text.length;

const s2 = content.indexOf('  const resetForm = () => {');
const e2Text = "showStatus('Error de red al intentar eliminar.', 'error');\n    };\n";
const e2 = content.indexOf(e2Text, s2) + e2Text.length;

const s3 = content.indexOf('      {/* TAB CONTENT: PROJECTS MANAGEMENT */}');
const e3Text = "          </div>\n        )}\n\n";
const e3 = content.indexOf(e3Text, s3) + e3Text.length;

if (s1 === -1 || e1 === -1 || s2 === -1 || e2 === -1 || s3 === -1 || e3 === -1) {
  console.log("Could not find markers!");
  console.log({ s1, e1, s2, e2, s3, e3 });
  process.exit(1);
}

const stateBlock = content.substring(s1, e1) + "\n";
const methodBlock = content.substring(s2, e2) + "\n";
const jsxBlock = content.substring(s3, e3);

let comp = `import React, { useState } from 'react';
import { Project } from '../types';
import { Plus, X, BookOpen, Edit2, Trash2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { cleanGoogleDriveUrl } from '../utils/imageUtils';

interface AdminProjectsProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  loadAllAdminData: () => Promise<void>;
  adminFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

export default function AdminProjects({
  projects,
  setProjects,
  loadAllAdminData,
  adminFetch
}: AdminProjectsProps) {
  const showStatus = (text: string, type: 'success' | 'error') => {
    toast[type](text);
  };

${stateBlock}
${methodBlock}
  return (
    <>
${jsxBlock.replace(/^      /gm, '    ')}
    </>
  );
}
`;

fs.writeFileSync('src/components/AdminProjects.tsx', comp);

let newContent = content.substring(0, s1) + content.substring(e1);
// recalibrate s2 because length changed
const ns2 = newContent.indexOf('  const resetForm = () => {');
const ne2 = newContent.indexOf(e2Text, ns2) + e2Text.length;
newContent = newContent.substring(0, ns2) + newContent.substring(ne2);

// recalibrate s3
const ns3 = newContent.indexOf('      {/* TAB CONTENT: PROJECTS MANAGEMENT */}');
const ne3 = newContent.indexOf(e3Text, ns3) + e3Text.length;

const replacementJsx = `      {/* TAB CONTENT: PROJECTS MANAGEMENT */}
      {adminSubTab === 'projects' && (
        <AdminProjects 
          projects={projects} 
          setProjects={setProjects} 
          loadAllAdminData={loadAllAdminData} 
          adminFetch={adminFetch} 
        />
      )}\n\n`;

newContent = newContent.substring(0, ns3) + replacementJsx + newContent.substring(ne3);

newContent = newContent.replace("import AdminDonations from './AdminDonations';", "import AdminDonations from './AdminDonations';\nimport AdminProjects from './AdminProjects';");

fs.writeFileSync('src/components/AdminPanel.tsx', newContent);
console.log("AdminProjects extraction complete!");
