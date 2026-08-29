import sys

def main():
    with open('src/components/AdminPanel.tsx', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    out_lines = []
    
    method_lines = []
    jsx_lines = []
    
    in_methods = False
    in_jsx = False
    
    for line in lines:
        if line.strip() == "import AdminCarousel from './AdminCarousel';":
            continue
            
        if line.strip() == "import AdminBulletins from './AdminBulletins';":
            out_lines.append("import AdminBulletins from './AdminBulletins';\n")
            out_lines.append("import AdminCarousel from './AdminCarousel';\n")
            continue

        if line.startswith("  const handleUpdateCarousel = async (e: React.FormEvent) => {"):
            in_methods = True

        if in_methods and line.startswith("  const handleUpdateLogos = async (e: React.FormEvent) => {"):
            in_methods = False

        if line.startswith("      {/* TAB CONTENT: CAROUSEL SLIDES CONFIG (5 PHOTOS) */}"):
            in_jsx = True
            out_lines.append("      {/* TAB CONTENT: CAROUSEL SLIDES CONFIG (5 PHOTOS) */}\n")
            out_lines.append("      {adminSubTab === 'carousel_config' && (\n")
            out_lines.append("        <AdminCarousel \n")
            out_lines.append("          carouselSlides={carouselSlides} \n")
            out_lines.append("          setCarouselSlides={setCarouselSlides} \n")
            out_lines.append("          loadAllAdminData={loadAllAdminData} \n")
            out_lines.append("          adminFetch={adminFetch} \n")
            out_lines.append("          setLoading={setLoading} \n")
            out_lines.append("        />\n")
            out_lines.append("      )}\n\n")

        if in_jsx and line.startswith("      {/* TAB CONTENT: LOGOS & BRANDING CONFIGURATION */}"):
            in_jsx = False

        if in_methods:
            method_lines.append(line)
        elif in_jsx:
            jsx_lines.append(line)
        else:
            out_lines.append(line)

    with open('src/components/AdminPanel.tsx', 'w', encoding='utf-8') as f:
        f.writelines(out_lines)

    if jsx_lines[0].strip() == "{/* TAB CONTENT: CAROUSEL SLIDES CONFIG (5 PHOTOS) */}":
        jsx_lines.pop(0)
    if len(jsx_lines) > 0 and "adminSubTab === 'carousel_config'" in jsx_lines[0]:
        jsx_lines.pop(0)
    
    while jsx_lines and jsx_lines[-1].strip() == "":
        jsx_lines.pop()
    if jsx_lines and jsx_lines[-1].strip() == ")}":
        jsx_lines.pop()

    comp_content = f"""import React from 'react';
import {{ CarouselSlide }} from '../types';
import {{ Sparkles, CheckCircle, Trash2, Camera, MapPin, Trees, Navigation, Leaf, Mountain, Droplets, Sun, Wind }} from 'lucide-react';
import toast from 'react-hot-toast';
import {{ cleanGoogleDriveUrl }} from '../utils/imageUtils';

interface AdminCarouselProps {{
  carouselSlides: CarouselSlide[];
  setCarouselSlides: React.Dispatch<React.SetStateAction<CarouselSlide[]>>;
  loadAllAdminData: () => Promise<void>;
  adminFetch: (url: string, options?: RequestInit) => Promise<Response>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}}

export default function AdminCarousel({{
  carouselSlides,
  setCarouselSlides,
  loadAllAdminData,
  adminFetch,
  setLoading
}}: AdminCarouselProps) {{
  const showStatus = (text: string, type: 'success' | 'error') => {{
    toast[type](text);
  }};

{''.join(method_lines)}
  return (
    <>
{''.join([l[4:] if l.startswith('    ') else l for l in jsx_lines])}    </>
  );
}}
"""
    with open('src/components/AdminCarousel.tsx', 'w', encoding='utf-8') as f:
        f.write(comp_content)
        
    print(f"Extraction successful: {{len(method_lines)}} method lines, {{len(jsx_lines)}} jsx lines.")

if __name__ == '__main__':
    main()
