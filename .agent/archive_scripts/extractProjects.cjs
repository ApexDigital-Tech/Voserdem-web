const fs = require('fs');

const adminPanelContent = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const stateStart = adminPanelContent.indexOf('  // Project Editing / Creating States');
const stateEnd = adminPanelContent.indexOf('  const ADMIN_PASSKEY');

const methodsStart = adminPanelContent.indexOf('  const resetForm = () => {');
const methodsEnd = adminPanelContent.indexOf('  // Blog Form States');

const jsxStart = adminPanelContent.indexOf('      {/* TAB CONTENT: PROJECTS MANAGEMENT */}');
const jsxEnd = adminPanelContent.indexOf('      {/* TAB CONTENT: AUDITED DONATIONS */}');

if (stateStart === -1 || stateEnd === -1 || methodsStart === -1 || methodsEnd === -1 || jsxStart === -1 || jsxEnd === -1) {
  console.log("Could not find markers!");
  process.exit(1);
}

const statesCode = adminPanelContent.substring(stateStart, stateEnd);
const methodsCode = adminPanelContent.substring(methodsStart, methodsEnd);
const jsxCode = adminPanelContent.substring(jsxStart, jsxEnd);

// AdminProjects.tsx
const adminProjectsContent = `import React, { useState } from 'react';
import { Project } from '../types';
import { Plus, X, BookOpen, Edit2, Trash2 } from 'lucide-react';
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

${statesCode}
${methodsCode}
  return (
    <>
${jsxCode.replace(/^      /gm, '    ')}
    </>
  );
}
`;

fs.writeFileSync('src/components/AdminProjects.tsx', adminProjectsContent);

// AdminPanel.tsx updates
let newAdminPanel = adminPanelContent.replace(statesCode, '');
newAdminPanel = newAdminPanel.replace(methodsCode, '');
newAdminPanel = newAdminPanel.replace(
  jsxCode,
  `      {/* TAB CONTENT: PROJECTS MANAGEMENT */}
      {adminSubTab === 'projects' && (
        <AdminProjects 
          projects={projects} 
          setProjects={setProjects} 
          loadAllAdminData={loadAllAdminData} 
          adminFetch={adminFetch} 
        />
      )}\n\n`
);

// Add import
const importStatement = "import AdminDonations from './AdminDonations';\nimport AdminProjects from './AdminProjects';";
newAdminPanel = newAdminPanel.replace("import AdminDonations from './AdminDonations';", importStatement);

fs.writeFileSync('src/components/AdminPanel.tsx', newAdminPanel);
console.log("Extraction complete!");
