'use client';

import type { Folder } from '@/app/components/FolderTree';
import { FolderTree } from '@/app/components/FolderTree';

const initialFolders = [
  {
    id: '1',
    name: '프로젝트',
    isExpanded: true,
    children: [
      {
        id: '2',
        name: '문서',
        children: [
          { id: '3', name: '보고서', children: [] },
          { id: '4', name: '프레젠테이션', children: [] }
        ]
      },
      {
        id: '5',
        name: '이미지',
        children: [
          { id: '6', name: '아이콘', children: [] },
          { id: '7', name: '배경', children: [] }
        ]
      }
    ]
  }
];

export default function Hier() {
  const handleFolderSelect = (folder: Folder) => {
    console.log('선택된 폴더:', folder);
  };

  const handleFolderMove = (dragId: string, dropId: string) => {
    console.log('폴더 이동:', { dragId, dropId });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">폴더 구조 관리</h1>
      <div className="max-w-2xl">
        <FolderTree 
          initialData={ initialFolders } 
          onFolderSelect={ handleFolderSelect }
          onFolderMove={ handleFolderMove }
        />
      </div>
    </div>
  );
}
