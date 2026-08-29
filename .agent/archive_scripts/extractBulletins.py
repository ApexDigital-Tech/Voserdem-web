import sys
import os

def main():
    with open('src/components/AdminPanel.tsx', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    out_lines = []
    
    state_lines = []
    method_lines = []
    jsx_lines = []
    
    in_states = False
    in_methods = False
    in_jsx = False
    
    for line in lines:
        if line.strip() == "import AdminBulletins from './AdminBulletins';":
            continue
            
        if line.strip() == "import AdminDonations from './AdminDonations';":
            out_lines.append("import AdminDonations from './AdminDonations';\n")
            out_lines.append("import AdminBulletins from './AdminBulletins';\n")
            continue

        if line.startswith("  // Bulletin Form States"):
            in_states = True
            
        if in_states and line.strip() == "const [aboutIntroSub, setAboutIntroSub] = useState('');":
            in_states = False
            
        if line.startswith("  const resetBulletinForm = () => {"):
            in_methods = True
            
        if in_methods and line.startswith("  const startEditBlogPost = (post: BlogPost) => {"):
            in_methods = False

        if line.startswith("  const handleCreateBulletin = async (e: React.FormEvent) => {"):
            in_methods = True

        if in_methods and line.startswith("  const handleDeleteSubscriber = async (id: string, email: string) => {"):
            in_methods = False

        if line.startswith("      {/* TAB CONTENT: BULLETINS CRUD */}"):
            in_jsx = True
            out_lines.append("      {/* TAB CONTENT: BULLETINS CRUD */}\n")
            out_lines.append("      {adminSubTab === 'bulletins' && (\n")
            out_lines.append("        <AdminBulletins \n")
            out_lines.append("          bulletins={bulletins} \n")
            out_lines.append("          loadAllAdminData={loadAllAdminData} \n")
            out_lines.append("          adminFetch={adminFetch} \n")
            out_lines.append("        />\n")
            out_lines.append("      )}\n\n")

        if in_jsx and line.startswith("      {/* TAB CONTENT: NEWSLETTER SUBSCRIBERS ROSTER */}"):
            in_jsx = False

        if in_states:
            state_lines.append(line)
        elif in_methods:
            method_lines.append(line)
        elif in_jsx:
            jsx_lines.append(line)
        else:
            out_lines.append(line)

    with open('src/components/AdminPanel.tsx', 'w', encoding='utf-8') as f:
        f.writelines(out_lines)

    if jsx_lines[0].strip() == "{/* TAB CONTENT: BULLETINS CRUD */}":
        jsx_lines.pop(0)
    if len(jsx_lines) > 0 and "adminSubTab === 'bulletins'" in jsx_lines[0]:
        jsx_lines.pop(0)
    
    while jsx_lines and jsx_lines[-1].strip() == "":
        jsx_lines.pop()
    if jsx_lines and jsx_lines[-1].strip() == ")}":
        jsx_lines.pop()

    comp_content = f"""import React, {{ useState }} from 'react';
import {{ Bulletin }} from '../types';
import {{ Plus, Edit2, Trash2, FileText }} from 'lucide-react';
import toast from 'react-hot-toast';
import {{ api }} from '../services/api';
import {{ cleanGoogleDriveUrl }} from '../utils/imageUtils';

interface AdminBulletinsProps {{
  bulletins: Bulletin[];
  loadAllAdminData: () => Promise<void>;
  adminFetch: (url: string, options?: RequestInit) => Promise<Response>;
}}

export default function AdminBulletins({{
  bulletins,
  loadAllAdminData,
  adminFetch
}}: AdminBulletinsProps) {{
  const showStatus = (text: string, type: 'success' | 'error') => {{
    toast[type](text);
  }};

{''.join(state_lines)}
{''.join(method_lines)}
  return (
    <>
{''.join([l[4:] if l.startswith('    ') else l for l in jsx_lines])}    </>
  );
}}
"""
    with open('src/components/AdminBulletins.tsx', 'w', encoding='utf-8') as f:
        f.write(comp_content)
        
    print(f"Extraction successful: {{len(state_lines)}} state lines, {{len(method_lines)}} method lines, {{len(jsx_lines)}} jsx lines.")

if __name__ == '__main__':
    main()
