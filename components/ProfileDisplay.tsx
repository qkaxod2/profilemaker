import React from 'react';
import { UserProfileData } from '../types';

interface ProfileDisplayProps {
  data: UserProfileData;
}

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="bg-slate-700 text-white text-center py-2 px-4 font-semibold text-lg rounded-t-md">
    {title}
  </div>
);

const PersonalInfoSection: React.FC<{
  image: string | null;
  name: string; species: string; height: string; weight: string; team: string; position: string;
}> = ({ image, name, species, height, weight, team, position }) => {
  const details = [
    { label1: "이름", value1: name || "-", label2: "종족", value2: species || "-" },
    { label1: "신장", value1: height || "-", label2: "몸무게", value2: weight || "-" },
    { label1: "소속팀", value1: team || "-", label2: "포지션", value2: position || "-" },
  ];

  return (
    <div className="mb-6">
      <SectionHeader title="신상정보" />
      <div className="bg-white p-1 rounded-b-md border border-slate-300 border-t-0">
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-1/3 p-4 flex justify-center items-start">
            {image ? (
              <img 
                src={image} 
                alt={`${name || '캐릭터'} 프로필 이미지`}
                className="max-w-full h-auto object-contain rounded shadow-md max-h-80" 
                aria-label={`${name || '캐릭터'}의 업로드된 프로필 이미지`}
              />
            ) : (
              <div 
                className="w-full max-h-80 h-64 bg-slate-200 flex items-center justify-center rounded shadow-md text-slate-500"
                aria-label="캐릭터 이미지가 제공되지 않았습니다"
              >
                이미지 없음
              </div>
            )}
          </div>
          <div className="w-full sm:w-2/3 p-2 sm:p-4">
            <table className="w-full border-collapse text-sm sm:text-base" aria-label="개인 신상 정보표">
              <tbody>
                {details.map((row, index) => (
                  <tr key={index}>
                    <td className="bg-slate-600 text-white p-2 sm:p-3 font-medium border border-slate-500 w-1/4">{row.label1}</td>
                    <td className="bg-white text-slate-800 p-2 sm:p-3 border border-slate-300 w-1/4">{row.value1}</td>
                    <td className="bg-slate-600 text-white p-2 sm:p-3 font-medium border border-slate-500 w-1/4">{row.label2}</td>
                    <td className="bg-white text-slate-800 p-2 sm:p-3 border border-slate-300 w-1/4">{row.value2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const CombatEvaluationSection: React.FC<{
  tacticalCommand: string; antiPersonnelCombat: string; antiMaterielDestruction: string; crowdControl: string;
  specialAbilityUtilization: string; maxSpecialAbilityOutput: string; overallEvaluation: string;
}> = (props) => {
  const stats = [
    { label1: "전술지휘능력", value1: props.tacticalCommand || "-", label2: "대인전투능력", value2: props.antiPersonnelCombat || "-" },
    { label1: "대물파괴력", value1: props.antiMaterielDestruction || "-", label2: "군중제어능력", value2: props.crowdControl || "-" },
    { label1: "이능활용능력", value1: props.specialAbilityUtilization || "-", label2: "이능최대출력", value2: props.maxSpecialAbilityOutput || "-" },
    { label1: "종합평가", value1: props.overallEvaluation || "-" },
  ];
  return (
    <div className="mb-6">
      <SectionHeader title="전투평가" />
      <div className="bg-white p-1 rounded-b-md border border-slate-300 border-t-0">
        <table className="w-full border-collapse text-sm sm:text-base" aria-label="전투 능력 평가표">
          <tbody>
            {stats.map((row, index) => (
              <tr key={index}>
                <td className="bg-slate-600 text-white p-2 sm:p-3 font-medium border border-slate-500 w-1/4">{row.label1}</td>
                <td className="bg-white text-slate-800 p-2 sm:p-3 border border-slate-300 text-center w-1/4">{row.value1}</td>
                {row.label2 ? (
                  <>
                    <td className="bg-slate-600 text-white p-2 sm:p-3 font-medium border border-slate-500 w-1/4">{row.label2}</td>
                    <td className="bg-white text-slate-800 p-2 sm:p-3 border border-slate-300 text-center w-1/4">{row.value2}</td>
                  </>
                ) : (
                  <td colSpan={2} className="bg-white border border-slate-300"></td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RecordsSection: React.FC<{
  selfIntroduction: string; employmentEvaluation: string; personalReport1: string; personalReport2: string;
}> = (props) => {
  const records = [
    { title: "자기소개", content: props.selfIntroduction || "(입력된 내용 없음)" },
    { title: "임용평가", content: props.employmentEvaluation || "(입력된 내용 없음)" },
    { title: "개인보고서1", content: props.personalReport1 || "(입력된 내용 없음)" },
    { title: "개인보고서2", content: props.personalReport2 || "(입력된 내용 없음)" },
  ];
  // Helper to preserve newlines from textarea
  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div>
      <SectionHeader title="기록사항" />
      <div className="bg-white p-4 rounded-b-md border border-slate-300 border-t-0 space-y-3">
        {records.map((record, index) => (
          <div key={index} role="article" aria-labelledby={`record-title-display-${index}`}>
            <h3 id={`record-title-display-${index}`} className="bg-slate-600 text-white p-2 font-medium rounded-t-sm text-sm sm:text-base">{record.title}</h3>
            <div className="p-3 border border-slate-300 border-t-0 bg-slate-50 text-slate-800 rounded-b-sm text-sm sm:text-base min-h-[4em]" aria-label={`${record.title} 내용`}>
              {formatContent(record.content)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ data }) => {
  return (
    <div className="w-full bg-slate-200 shadow-inner rounded-lg p-0 md:p-2" role="document" aria-label={`생성된 ${data.name || '캐릭터'} 프로필`}> {/* Adjusted padding */}
      {/* Removed h1 title, as CollapsibleSection provides it or it's part of a live preview context */}
      
      <PersonalInfoSection 
        image={data.image}
        name={data.name}
        species={data.species}
        height={data.height}
        weight={data.weight}
        team={data.team}
        position={data.position}
      />
      <CombatEvaluationSection 
        tacticalCommand={data.tacticalCommand}
        antiPersonnelCombat={data.antiPersonnelCombat}
        antiMaterielDestruction={data.antiMaterielDestruction}
        crowdControl={data.crowdControl}
        specialAbilityUtilization={data.specialAbilityUtilization}
        maxSpecialAbilityOutput={data.maxSpecialAbilityOutput}
        overallEvaluation={data.overallEvaluation}
      />
      <RecordsSection 
        selfIntroduction={data.selfIntroduction}
        employmentEvaluation={data.employmentEvaluation}
        personalReport1={data.personalReport1}
        personalReport2={data.personalReport2}
      />
    </div>
  );
};

export default ProfileDisplay;