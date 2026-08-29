const fs = require('fs');
const content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const s1 = content.indexOf('  // Project Editing / Creating States');
const e1 = content.indexOf('  const ADMIN_PASSKEY = ');

const s2 = content.indexOf('  const resetForm = () => {');
const e2 = content.indexOf('  // Blog Form States');

const s3 = content.indexOf('      {/* TAB CONTENT: PROJECTS MANAGEMENT */}');
const e3 = content.indexOf('      {/* TAB CONTENT: AUDITED DONATIONS */}');

const stateBlock = content.substring(s1, e1);
const methodBlock = content.substring(s2, e2);
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

let newContent = content.replace(stateBlock, '');
newContent = newContent.replace(methodBlock, '');
newContent = newContent.replace(jsxBlock, `      {/* TAB CONTENT: PROJECTS MANAGEMENT */}
      {adminSubTab === 'projects' && (
        <AdminProjects 
          projects={projects} 
          setProjects={setProjects} 
          loadAllAdminData={loadAllAdminData} 
          adminFetch={adminFetch} 
        />
      )}\n\n`);

newContent = newContent.replace("import AdminDonations from './AdminDonations';", "import AdminDonations from './AdminDonations';\nimport AdminProjects from './AdminProjects';");

fs.writeFileSync('src/components/AdminPanel.tsx', newContent);
console.log("Clean extraction complete!");
