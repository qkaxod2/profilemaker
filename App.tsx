
import React, { useState, useEffect, useCallback } from 'react';
import ProfileForm from './components/ProfileForm';
import ProfileDisplay from './components/ProfileDisplay';
import CollapsibleSection from './components/CollapsibleSection';
import { UserProfileData, initialProfileData } from './types';

// SVG Icons
const EditIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const combatStatKeys: (keyof UserProfileData)[] = [
  'tacticalCommand',
  'antiPersonnelCombat',
  'antiMaterielDestruction',
  'crowdControl',
  'specialAbilityUtilization',
  'maxSpecialAbilityOutput',
];

const App: React.FC = () => {
  const [currentProfileData, setCurrentProfileData] = useState<UserProfileData>(initialProfileData);
  const [previewData, setPreviewData] = useState<UserProfileData>(initialProfileData);
  const [savedProfiles, setSavedProfiles] = useState<UserProfileData[]>([]);
  const [activeSections, setActiveSections] = useState({
    form: true,
    preview: true,
    list: false,
  });

  const [selectedDropdownProfileName, setSelectedDropdownProfileName] = useState<string>('');
  const [profileDisplayedFromList, setProfileDisplayedFromList] = useState<UserProfileData | null>(null);

  const toggleSection = (section: keyof typeof activeSections) => {
    setActiveSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const loadSavedProfiles = useCallback(() => {
    const profiles: UserProfileData[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !key.startsWith('scrollPosition_')) { 
        try {
          const profile = JSON.parse(localStorage.getItem(key) || '');
          if (profile && typeof profile.name === 'string') { 
            profiles.push(profile);
          }
        } catch (e) {
          console.error(`Error parsing profile from localStorage key ${key}:`, e);
        }
      }
    }
    setSavedProfiles(profiles.sort((a, b) => a.name.localeCompare(b.name, 'ko')));
  }, []);

  useEffect(() => {
    loadSavedProfiles();
  }, [loadSavedProfiles]);

  useEffect(() => {
    setPreviewData(currentProfileData);
  }, [currentProfileData]);

  useEffect(() => {
    if (selectedDropdownProfileName) {
      const updatedProfileToDisplay = savedProfiles.find(p => p.name === selectedDropdownProfileName);
      setProfileDisplayedFromList(updatedProfileToDisplay || null);
    } else {
      setProfileDisplayedFromList(null);
    }
  }, [savedProfiles, selectedDropdownProfileName]);

  useEffect(() => {
    const {
      tacticalCommand,
      antiPersonnelCombat,
      antiMaterielDestruction,
      crowdControl,
      specialAbilityUtilization,
      maxSpecialAbilityOutput,
    } = currentProfileData;

    const statsToAverage = [
      tacticalCommand,
      antiPersonnelCombat,
      antiMaterielDestruction,
      crowdControl,
      specialAbilityUtilization,
      maxSpecialAbilityOutput,
    ];

    const numericStats = statsToAverage
      .map(value => parseFloat(value))
      .filter(num => !isNaN(num));

    let newOverallEvaluation = "";
    if (numericStats.length > 0) {
      const sum = numericStats.reduce((acc, cur) => acc + cur, 0);
      const average = sum / numericStats.length;
      newOverallEvaluation = Math.round(average).toString();
    }

    if (newOverallEvaluation !== currentProfileData.overallEvaluation) {
      setCurrentProfileData(prev => ({
        ...prev,
        overallEvaluation: newOverallEvaluation,
      }));
    }
  }, [
    currentProfileData.tacticalCommand,
    currentProfileData.antiPersonnelCombat,
    currentProfileData.antiMaterielDestruction,
    currentProfileData.crowdControl,
    currentProfileData.specialAbilityUtilization,
    currentProfileData.maxSpecialAbilityOutput,
    // currentProfileData.overallEvaluation, // Prevent re-triggering from its own change
    setCurrentProfileData 
  ]);


  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (combatStatKeys.includes(name as keyof UserProfileData)) {
      if (value === "") {
        setCurrentProfileData(prev => ({ ...prev, [name]: "" }));
      } else {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          if (numValue < 1) {
            setCurrentProfileData(prev => ({ ...prev, [name]: "1" }));
          } else if (numValue > 5) {
            setCurrentProfileData(prev => ({ ...prev, [name]: "5" }));
          } else {
            // Allow numbers within range (e.g., 3.5 will be stored as "3.5")
            // The overallEvaluation calculation will handle it.
            // If strict integer storage for these fields is desired, use Math.floor or Math.round here.
            setCurrentProfileData(prev => ({ ...prev, [name]: value }));
          }
        } else {
          // If value is not a number (e.g. "abc") but not empty, allow it to be set.
          // The overallEvaluation useEffect will ignore NaN values.
           setCurrentProfileData(prev => ({ ...prev, [name]: value }));
        }
      }
    } else {
      setCurrentProfileData(prev => ({ ...prev, [name]: value }));
    }
  }, [setCurrentProfileData]);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentProfileData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      setCurrentProfileData(prev => ({ ...prev, image: null }));
    }
  }, []);

  const handleResetForm = useCallback(() => {
    setCurrentProfileData(initialProfileData);
    const imageUploadElement = document.getElementById('imageUpload') as HTMLInputElement;
    if (imageUploadElement) {
        imageUploadElement.value = "";
    }
  }, []);

  const handleSaveProfile = useCallback(() => {
    if (!currentProfileData.name.trim()) {
      alert("캐릭터 이름을 입력해주세요.");
      return;
    }
    const profileNameToSave = currentProfileData.name.trim();
    try {
      localStorage.setItem(profileNameToSave, JSON.stringify(currentProfileData));
      loadSavedProfiles(); 
      alert("프로필이 저장되었습니다!");
      if (profileNameToSave === selectedDropdownProfileName) {
        // Ensure the displayed profile from list is also updated if it was the one being edited
        setProfileDisplayedFromList(currentProfileData);
      }
    } catch (error) {
      console.error("프로필 저장 중 오류 발생:", error);
      alert("프로필 저장 중 오류가 발생했습니다. 콘솔을 확인해주세요.");
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        alert("로컬 저장소 용량이 초과되었습니다.");
      }
    }
  }, [currentProfileData, loadSavedProfiles, selectedDropdownProfileName]);

  const loadProfileToFormByName = useCallback((profileName: string) => {
    const profileToLoad = savedProfiles.find(p => p.name === profileName);
    if (profileToLoad) {
      setCurrentProfileData(profileToLoad);
      setActiveSections(prev => ({ ...prev, form: true, preview: true })); 
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }
  }, [savedProfiles]);
  
  const handleDropdownChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSelectedName = e.target.value;
    setSelectedDropdownProfileName(newSelectedName);
  }, []);

  const loadSelectedProfileToForm = useCallback(() => {
    if (selectedDropdownProfileName) {
      loadProfileToFormByName(selectedDropdownProfileName);
    } else {
      alert("폼에 불러올 프로필을 드롭다운에서 선택해주세요.");
    }
  }, [selectedDropdownProfileName, loadProfileToFormByName]);

  const deleteProfileByName = useCallback((profileName: string) => {
    localStorage.removeItem(profileName);
    
    const wasCurrentProfile = currentProfileData.name === profileName;
    const wasSelectedInDropdown = selectedDropdownProfileName === profileName;

    loadSavedProfiles(); // Reloads and sorts profiles

    if (wasCurrentProfile) {
      handleResetForm(); 
    }
    
    // If the deleted profile was selected in dropdown, clear the selection
    if (wasSelectedInDropdown) {
      setSelectedDropdownProfileName(''); 
      // setProfileDisplayedFromList(null); // This will be handled by useEffect on selectedDropdownProfileName change
    }
    
    alert(`'${profileName}' 프로필이 삭제되었습니다.`);
  }, [loadSavedProfiles, currentProfileData.name, handleResetForm, selectedDropdownProfileName]);

  const deleteSelectedDropdownProfile = useCallback(() => {
    if (!selectedDropdownProfileName) {
      alert("삭제할 프로필을 드롭다운에서 선택해주세요.");
      return;
    }
    if (window.confirm(`'${selectedDropdownProfileName}' 프로필을 삭제하시겠습니까?`)) {
      deleteProfileByName(selectedDropdownProfileName);
    }
  }, [selectedDropdownProfileName, deleteProfileByName]);

  const handleDeleteAllProfiles = useCallback(() => {
    if (window.confirm("저장된 모든 프로필을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      savedProfiles.forEach(p => localStorage.removeItem(p.name));
      loadSavedProfiles(); 
      handleResetForm();
      setSelectedDropdownProfileName('');
      // setProfileDisplayedFromList(null); // useEffect will handle this
      alert("모든 프로필이 삭제되었습니다.");
    }
  }, [savedProfiles, loadSavedProfiles, handleResetForm]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center p-4 selection:bg-sky-500 selection:text-white">
      <header className="w-full max-w-4xl py-6 mb-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 text-center">캐릭터 프로필 생성기</h1>
      </header>

      <main className="w-full max-w-4xl space-y-6">
        <CollapsibleSection title="프로필 정보 입력" isOpen={activeSections.form} onToggle={() => toggleSection('form')}>
          <ProfileForm
            formData={currentProfileData}
            onInputChange={handleInputChange}
            onImageChange={handleImageChange}
            onSaveProfile={handleSaveProfile}
            onResetForm={handleResetForm}
          />
        </CollapsibleSection>

        <CollapsibleSection title="실시간 프로필 미리보기" isOpen={activeSections.preview} onToggle={() => toggleSection('preview')}>
          <ProfileDisplay data={previewData} />
        </CollapsibleSection>

        <CollapsibleSection title="저장된 프로필 관리 및 조회" isOpen={activeSections.list} onToggle={() => toggleSection('list')}>
          {savedProfiles.length === 0 ? (
            <p className="text-slate-500 text-center py-4">저장된 프로필이 없습니다.</p>
          ) : (
            <div className="p-2 md:p-4 space-y-4">
              <div className="flex items-end gap-2">
                <div className="flex-grow">
                  <label htmlFor="savedProfileSelect" className="block text-sm font-medium text-slate-700 mb-1">프로필 선택 (ㄱ~ㅎ 순):</label>
                  <select
                    id="savedProfileSelect"
                    value={selectedDropdownProfileName}
                    onChange={handleDropdownChange}
                    className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-sm"
                  >
                    <option value="">-- 프로필 선택 --</option>
                    {savedProfiles.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
                <button
                    onClick={handleDeleteAllProfiles}
                    className="p-2 rounded-full text-slate-500 hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
                    aria-label="저장된 모든 프로필 삭제"
                    title="모든 프로필 삭제"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
              </div>

              {selectedDropdownProfileName && (
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-200">
                   <span className="text-sm text-slate-600 mr-2">선택된 '{selectedDropdownProfileName}' 프로필:</span>
                  <button
                    onClick={loadSelectedProfileToForm}
                    className="p-2 rounded-full text-slate-500 hover:bg-green-100 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors"
                    aria-label="선택한 프로필 폼에 불러오기 (수정용)"
                    title="폼에 불러오기 (수정용)"
                  >
                    <EditIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={deleteSelectedDropdownProfile}
                    className="p-2 rounded-full text-slate-500 hover:bg-amber-100 hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 transition-colors"
                    aria-label="선택한 프로필 삭제"
                    title="선택 프로필 삭제"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
              
              {profileDisplayedFromList && (
                <div className="mt-6 border-t border-slate-300 pt-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3 text-center">'{profileDisplayedFromList.name}' 프로필 상세 정보</h3>
                  <ProfileDisplay data={profileDisplayedFromList} />
                </div>
              )}
            </div>
          )}
        </CollapsibleSection>
      </main>

      <footer className="w-full max-w-4xl text-center mt-12 py-4 text-xs text-slate-500 border-t border-slate-300">
        프로필 생성기 v3.5 - 전투평가 1-5 범위 제한
      </footer>
    </div>
  );
};

export default App;
