import sys

def main():
    lines = []
    with open('src/components/AdminPanel.tsx', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    out_lines = []
    
    skip = False
    
    for i, line in enumerate(lines):
        # Imports replace
        if line.strip() == "import AdminDonations from './AdminDonations';":
            out_lines.append("import AdminDonations from './AdminDonations';\n")
            out_lines.append("import AdminProjects from './AdminProjects';\n")
            continue

        if line.startswith("  // Project Editing / Creating States"):
            skip = True
        
        if skip and line.strip() == "const ADMIN_PASSKEY = import.meta.env.VITE_ADMIN_PASSKEY || '';":
            skip = False
            
        if line.startswith("  const resetForm = () => {"):
            skip = True
            
        if skip and line.strip() == "const handleResetDatabase = async () => {":
            skip = False
            out_lines.append(line)
            continue
            
        if line.startswith("      {/* TAB CONTENT: PROJECTS MANAGEMENT */}"):
            skip = True
            out_lines.append("      {/* TAB CONTENT: PROJECTS MANAGEMENT */}\n")
            out_lines.append("      {adminSubTab === 'projects' && (\n")
            out_lines.append("        <AdminProjects \n")
            out_lines.append("          projects={projects} \n")
            out_lines.append("          setProjects={setProjects} \n")
            out_lines.append("          loadAllAdminData={loadAllAdminData} \n")
            out_lines.append("          adminFetch={adminFetch} \n")
            out_lines.append("        />\n")
            out_lines.append("      )}\n")
            continue
            
        if skip and line.startswith("      {/* TAB CONTENT: AUDITED DONATIONS */}"):
            skip = False
            out_lines.append(line)
            continue
            
        if not skip:
            out_lines.append(line)

    with open('src/components/AdminPanel.tsx', 'w', encoding='utf-8') as f:
        f.writelines(out_lines)
        
    print("Cleanup successful")

if __name__ == '__main__':
    main()
