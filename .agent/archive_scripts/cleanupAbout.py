import sys

with open('src/components/AdminPanel.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

to_remove = """        if (aboutRes.success && aboutRes.data) {
          const aboutData = aboutRes.data;
          setAboutIntroSub(aboutData.introSub || '');
          setAboutIntroTitle(aboutData.introTitle || '');
          setAboutIntroText(aboutData.introText || '');
          setAboutMissionTitle(aboutData.missionTitle || '');
          setAboutMissionText(aboutData.missionText || '');
          setAboutVisionTitle(aboutData.visionTitle || '');
          setAboutVisionText(aboutData.visionText || '');
          setAboutImageUrl(aboutData.imageUrl || '');
          setAboutHeroImageUrl(aboutData.heroImageUrl || '');
          if (aboutData.pillars && Array.isArray(aboutData.pillars)) {
            setAboutPillars(aboutData.pillars);
          }
        }
"""

content = content.replace(to_remove, '')
content = content.replace("          api.get<any>('/api/about'),\n", "")
content = content.replace(", aboutRes", "")

with open('src/components/AdminPanel.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
