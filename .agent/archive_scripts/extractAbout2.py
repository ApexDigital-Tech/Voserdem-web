import sys

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
    
    for i, line in enumerate(lines):
        if line.strip() == "import AdminCarousel from './AdminCarousel';":
            out_lines.append(line)
            out_lines.append("import AdminAbout from './AdminAbout';\n")
            continue

        if "const [aboutIntroSub, setAboutIntroSub]" in line:
            in_states = True
            
        if in_states and "const resetBlogForm = () => {" in line:
            in_states = False
            
        if "const handleUpdateAboutUs = async (e: React.FormEvent)" in line:
            in_methods = True

        if in_methods and "const handleUpdateLogos = async (e: React.FormEvent)" in line:
            in_methods = False

        if "{/* TAB CONTENT: ABOUT US CONFIGURATION & PREVIEWS */}" in line:
            in_jsx = True
            out_lines.append("      {/* TAB CONTENT: ABOUT US CONFIGURATION & PREVIEWS */}\n")
            out_lines.append("      {adminSubTab === 'about_config' && (\n")
            out_lines.append("        <AdminAbout \n")
            out_lines.append("          loadAllAdminData={loadAllAdminData} \n")
            out_lines.append("          setLoading={setLoading} \n")
            out_lines.append("        />\n")
            out_lines.append("      )}\n\n")

        if in_jsx and "{/* TAB CONTENT: CAROUSEL SLIDES CONFIG (5 PHOTOS) */}" in line:
            in_jsx = False

        if in_states:
            state_lines.append(line)
        elif in_methods:
            method_lines.append(line)
        elif in_jsx:
            jsx_lines.append(line)
        else:
            # We also need to remove the lines inside loadAllAdminData
            if "api.get<any>('/api/about')," in line:
                continue
            out_lines.append(line)

    final_out = []
    skip_about = False
    for l in out_lines:
        if "if (aboutRes.success && aboutRes.data) {" in l:
            skip_about = True
        if skip_about and "if (carouselRes.success && carouselRes.data) {" in l:
            skip_about = False
            
        if not skip_about:
            final_out.append(l.replace(", aboutRes", ""))

    with open('src/components/AdminPanel.tsx', 'w', encoding='utf-8') as f:
        f.writelines(final_out)

    if jsx_lines[0].strip() == "{/* TAB CONTENT: ABOUT US CONFIGURATION & PREVIEWS */}":
        jsx_lines.pop(0)
    if len(jsx_lines) > 0 and "adminSubTab === 'about_config'" in jsx_lines[0]:
        jsx_lines.pop(0)
    
    while jsx_lines and jsx_lines[-1].strip() == "":
        jsx_lines.pop()
    if jsx_lines and jsx_lines[-1].strip() == ")}":
        jsx_lines.pop()

    comp_content = f"""import React, {{ useState, useEffect }} from 'react';
import {{ Compass, Save, Eye, Plus, Trash2, Leaf, Heart, Users, MapPin, Search, Calendar, Target, Flag, Info, GraduationCap, Building, Activity, BookOpen, Layers, Sparkles, FileText }} from 'lucide-react';
import toast from 'react-hot-toast';
import {{ api }} from '../services/api';
import {{ cleanGoogleDriveUrl }} from '../utils/imageUtils';

interface AdminAboutProps {{
  loadAllAdminData: () => Promise<void>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}}

export default function AdminAbout({{
  loadAllAdminData,
  setLoading
}}: AdminAboutProps) {{
  const showStatus = (text: string, type: 'success' | 'error') => {{
    toast[type](text);
  }};

{''.join(state_lines)}
  // Load data locally
  useEffect(() => {{
    const loadData = async () => {{
      const res = await api.get<any>('/api/about');
      if (res.success && res.data) {{
        const aboutData = res.data;
        setAboutIntroSub(aboutData.introSub || '');
        setAboutIntroTitle(aboutData.introTitle || '');
        setAboutIntroText(aboutData.introText || '');
        setAboutMissionTitle(aboutData.missionTitle || '');
        setAboutMissionText(aboutData.missionText || '');
        setAboutVisionTitle(aboutData.visionTitle || '');
        setAboutVisionText(aboutData.visionText || '');
        setAboutImageUrl(aboutData.imageUrl || '');
        setAboutHeroImageUrl(aboutData.heroImageUrl || '');
        if (aboutData.pillars && Array.isArray(aboutData.pillars)) {{
          setAboutPillars(aboutData.pillars);
        }}
      }}
    }};
    loadData();
  }}, []);

{''.join(method_lines)}
  return (
    <>
{''.join([l[4:] if l.startswith('    ') else l for l in jsx_lines])}    </>
  );
}}
"""
    with open('src/components/AdminAbout.tsx', 'w', encoding='utf-8') as f:
        f.write(comp_content)
        
    print(f"Extraction successful: {{len(state_lines)}} state lines, {{len(method_lines)}} method lines, {{len(jsx_lines)}} jsx lines.")

if __name__ == '__main__':
    main()
