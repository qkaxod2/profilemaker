

import React from 'react';
import { UserProfileData } from '../types';

interface ProfileFormProps {
  formData: UserProfileData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveProfile: () => void; 
  onResetForm: () => void;
}

const InputField: React.FC<{
  label: string;
  name: keyof UserProfileData;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: string; // Added for number type
  max?: string; // Added for number type
  // BEGIN FIX
  readOnly?: boolean; // Added for readOnly attribute
  // END FIX
}> = ({ label, name, value, onChange, type = "text", placeholder, required = false, min, max, readOnly = false }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}:</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder || `여기에 ${label} 입력`}
      required={required}
      min={min}
      max={max}
      // BEGIN FIX
      readOnly={readOnly}
      // END FIX
      className={`w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-sm ${readOnly ? 'bg-slate-100 cursor-not-allowed' : ''}`}
    />
  </div>
);

const TextAreaField: React.FC<{
  label: string;
  name: keyof UserProfileData;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
}> = ({ label, name, value, onChange, placeholder, rows = 3 }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}:</label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder || `여기에 ${label} 입력`}
      className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-sm"
    />
  </div>
);

const ProfileForm: React.FC<ProfileFormProps> = ({ formData, onInputChange, onImageChange, onSaveProfile, onResetForm }) => {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile();
  };

  const positionOptions = ["-- 포지션 선택 --", "척후병", "보병", "신비술사", "저격수", "지원병"];

  return (
    <form onSubmit={handleSubmit} className="p-0 md:p-2">
      <div className="mb-6">
        <label htmlFor="imageUpload" className="block text-sm font-medium text-slate-700 mb-1">캐릭터 이미지:</label>
        <input
          type="file"
          id="imageUpload"
          name="imageUpload"
          accept="image/*"
          onChange={onImageChange}
          className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
        />
        {formData.image && (
          <div className="mt-2">
            <img src={formData.image} alt="업로드된 이미지 미리보기" className="max-h-32 rounded border border-slate-300" />
          </div>
        )}
      </div>

      <h3 className="text-lg font-medium text-slate-700 mb-3 mt-6">신상 정보</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        <InputField label="이름" name="name" value={formData.name} onChange={onInputChange} required />
        <InputField label="종족" name="species" value={formData.species} onChange={onInputChange} />
        <InputField label="신장" name="height" value={formData.height} onChange={onInputChange} />
        <InputField label="몸무게" name="weight" value={formData.weight} onChange={onInputChange} />
        <InputField label="소속팀" name="team" value={formData.team} onChange={onInputChange} />
        
        <div className="mb-4">
          <label htmlFor="position" className="block text-sm font-medium text-slate-700 mb-1">포지션:</label>
          <select
            id="position"
            name="position"
            value={formData.position}
            onChange={onInputChange}
            className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-sm"
          >
            {positionOptions.map(option => (
              <option key={option} value={option === "-- 포지션 선택 --" ? "" : option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <h3 className="text-lg font-medium text-slate-700 mb-3 mt-6">전투 평가</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        <InputField label="전술지휘능력" name="tacticalCommand" value={formData.tacticalCommand} onChange={onInputChange} type="number" placeholder="1-5 숫자" min="1" max="5"/>
        <InputField label="대인전투능력" name="antiPersonnelCombat" value={formData.antiPersonnelCombat} onChange={onInputChange} type="number" placeholder="1-5 숫자" min="1" max="5"/>
        <InputField label="대물파괴력" name="antiMaterielDestruction" value={formData.antiMaterielDestruction} onChange={onInputChange} type="number" placeholder="1-5 숫자" min="1" max="5"/>
        <InputField label="군중제어능력" name="crowdControl" value={formData.crowdControl} onChange={onInputChange} type="number" placeholder="1-5 숫자" min="1" max="5"/>
        <InputField label="이능활용능력" name="specialAbilityUtilization" value={formData.specialAbilityUtilization} onChange={onInputChange} type="number" placeholder="1-5 숫자" min="1" max="5"/>
        <InputField label="이능최대출력" name="maxSpecialAbilityOutput" value={formData.maxSpecialAbilityOutput} onChange={onInputChange} type="number" placeholder="1-5 숫자" min="1" max="5"/>
        <InputField label="종합평가" name="overallEvaluation" value={formData.overallEvaluation} onChange={onInputChange} type="number" placeholder="자동 계산" readOnly/>
      </div>

      <h3 className="text-lg font-medium text-slate-700 mb-3 mt-6">기록 사항</h3>
      <TextAreaField label="자기소개" name="selfIntroduction" value={formData.selfIntroduction} onChange={onInputChange} />
      <TextAreaField label="임용평가" name="employmentEvaluation" value={formData.employmentEvaluation} onChange={onInputChange} />
      <TextAreaField label="개인보고서1" name="personalReport1" value={formData.personalReport1} onChange={onInputChange} />
      <TextAreaField label="개인보고서2" name="personalReport2" value={formData.personalReport2} onChange={onInputChange} />
      
      <div className="mt-8 space-y-3">
        <button
          type="submit"
          className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2.5 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-75 transition duration-150 ease-in-out"
          aria-label="프로필 저장"
        >
          프로필 저장
        </button>
        <button
          type="button"
          onClick={onResetForm}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-150 ease-in-out"
          aria-label="양식 초기화"
        >
          양식 초기화
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;