'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DndProvider, DragPreviewImage, DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from './FolderTree.module.css';

export interface Folder {
  id: string;
  name: string;
  children: Folder[];
  isExpanded?: boolean;
}

interface FolderTreeProps {
  initialData?: Folder[];
  onFolderSelect?: (folder: Folder) => void;
  onFolderMove?: (dragId: string, dropId: string) => void;
}

interface DraggableFolderProps {
  folder: Folder;
  level: number;
  onSelect: (folder: Folder) => void;
  onToggle: (id: string) => void;
  onMove: (dragId: string, dropId: string) => void;
  isSelected: boolean;
  initialData: Folder[];
}

interface DragItem {
  id: string;
  type: string;
}

type DropPosition = 'top' | 'bottom' | 'inside';

const DraggableFolder: React.FC<DraggableFolderProps> = ({
  folder,
  level,
  onSelect,
  onToggle,
  onMove,
  isSelected,
  initialData,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [dropPosition, setDropPosition] = useState<DropPosition | null>(null);
  const [isInvalidDrop, setIsInvalidDrop] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'FOLDER',
    item: { id: folder.id, type: 'FOLDER' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'FOLDER',
    drop: (item: DragItem, monitor) => {
      if (item.id === folder.id) return;
      
      const dropPosition = getDropPosition(monitor);
      if (isInvalidDrop) return;
      
      onMove(item.id, folder.id);
      setDropPosition(null);
      setIsInvalidDrop(false);
      setIsDraggingOver(false);
      return { dropPosition };
    },
    hover: (item: DragItem, monitor) => {
      if (item.id === folder.id) {
        setIsInvalidDrop(true);
        setIsDraggingOver(true);
        return;
      }

      // 직접적인 부모-자식 관계만 체크
      const isDirectParentChild = (currentFolder: Folder, targetId: string): boolean => {
        if (!currentFolder.children) return false;
        return currentFolder.children.some(child => child.id === targetId);
      };

      // 같은 부모를 가진 폴더인지 확인
      const findParentFolder = (folders: Folder[], targetId: string): Folder | null => {
        for (const folder of folders) {
          if (folder.children?.some(child => child.id === targetId)) {
            return folder;
          }
          if (folder.children) {
            const found = findParentFolder(folder.children, targetId);
            if (found) return found;
          }
        }
        return null;
      };

      // 전체 폴더 트리에서 부모 찾기
      const dragParent = findParentFolder(initialData, item.id);
      const dropParent = findParentFolder(initialData, folder.id);

      // 같은 부모를 가진 폴더인지 확인
      const isSameLevel = dragParent?.id === dropParent?.id;

      // 직접적인 부모-자식 관계이면서 같은 레벨이 아닌 경우에만 이동 불가
      const isDirectParentChildRelation = isDirectParentChild(folder, item.id) || isDirectParentChild(folder, folder.id);
      const isInvalid = isDirectParentChildRelation && !isSameLevel;

      setIsInvalidDrop(isInvalid);
      setIsDraggingOver(true);

      if (!isInvalid) {
        const dropPosition = getDropPosition(monitor);
        setDropPosition(dropPosition);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  }));

  const getDropPosition = (monitor: DropTargetMonitor): DropPosition => {
    if (!ref.current) return 'inside';
    
    const hoverBoundingRect = ref.current.getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    
    if (!clientOffset) return 'inside';
    
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    const hoverClientX = clientOffset.x - hoverBoundingRect.left;

    // 폴더의 너비를 기준으로 좌우 여백 계산
    const hoverWidth = hoverBoundingRect.right - hoverBoundingRect.left;
    const isInLeftMargin = hoverClientX < hoverWidth * 0.2;
    const isInRightMargin = hoverClientX > hoverWidth * 0.8;

    // 상단 25% 영역 (좌우 여백 제외)
    if (hoverClientY < hoverMiddleY * 0.5 && !isInLeftMargin && !isInRightMargin) {
      return 'top';
    }
    // 하단 25% 영역 (좌우 여백 제외)
    if (hoverClientY > hoverMiddleY * 1.5 && !isInLeftMargin && !isInRightMargin) {
      return 'bottom';
    }
    // 중간 50% 영역 또는 좌우 여백
    return 'inside';
  };

  useEffect(() => {
    if (!isOver) {
      setDropPosition(null);
      setIsInvalidDrop(false);
      setIsDraggingOver(false);
    }
  }, [isOver]);

  drag(drop(ref));

  const hasChildren = folder.children && folder.children.length > 0;
  const dropTargetClass = dropPosition ? styles[`dropTarget${dropPosition.charAt(0).toUpperCase() + dropPosition.slice(1)}`] : '';
  const invalidClass = isInvalidDrop ? styles.dropTargetInvalid : '';
  const validClass = isDraggingOver && !isInvalidDrop ? styles.dropTargetValid : '';
  const dragSourceClass = isDragging ? styles.dragSource : '';

  return (
    <>
      <DragPreviewImage 
        connect={preview} 
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==" 
      />
      <div
        ref={ref}
        data-folder-id={folder.id}
        style={{
          marginLeft: `${level * 20}px`,
        }}
        className={`${styles.dropTarget} ${dropTargetClass} ${invalidClass} ${validClass} ${dragSourceClass}`}
      >
        <div
          className={`${styles.folderItem} ${isSelected ? styles.selected : ''} ${isDragging ? styles.dragging : ''}`}
          onClick={() => onSelect(folder)}
        >
          {hasChildren && (
            <span
              className={styles.expandIcon}
              onClick={(e) => {
                e.stopPropagation();
                onToggle(folder.id);
              }}
            >
              {folder.isExpanded ? '▼' : '▶'}
            </span>
          )}
          <span className={styles.folderName}>📁 {folder.name}</span>
        </div>
        {folder.isExpanded && hasChildren && (
          <div className={styles.children}>
            {folder.children.map((child) => (
              <DraggableFolder
                key={child.id}
                folder={child}
                level={level + 1}
                onSelect={onSelect}
                onToggle={onToggle}
                onMove={onMove}
                isSelected={false}
                initialData={initialData}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export const FolderTree: React.FC<FolderTreeProps> = ({
  initialData = [],
  onFolderSelect,
  onFolderMove,
}) => {
  const [folders, setFolders] = useState<Folder[]>(initialData);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const handleFolderClick = (folder: Folder) => {
    setSelectedFolder(folder.id);
    onFolderSelect?.(folder);
  };

  const toggleFolder = (folderId: string) => {
    setFolders((prevFolders) => {
      const updateFolder = (folders: Folder[]): Folder[] => {
        return folders.map((folder) => {
          if (folder.id === folderId) {
            return { ...folder, isExpanded: !folder.isExpanded };
          }
          if (folder.children) {
            return { ...folder, children: updateFolder(folder.children) };
          }
          return folder;
        });
      };
      return updateFolder(prevFolders);
    });
  };

  const moveFolder = (dragId: string, dropId: string) => {
    setFolders((prevFolders) => {
      // 깊은 복사
      const deepCopy = (folders: Folder[]): Folder[] => {
        return folders.map(folder => ({
          ...folder,
          children: folder.children ? deepCopy(folder.children) : []
        }));
      };

      const foldersCopy = deepCopy(prevFolders);

      // 폴더의 전체 경로 찾기 (루트부터 해당 폴더까지의 경로)
      const findFolderPath = (
        folders: Folder[],
        targetId: string,
        currentPath: Folder[] = []
      ): Folder[] | null => {
        for (const folder of folders) {
          const newPath = [...currentPath, folder];
          if (folder.id === targetId) {
            return newPath;
          }
          if (folder.children) {
            const found = findFolderPath(folder.children, targetId, newPath);
            if (found) return found;
          }
        }
        return null;
      };

      // 직접적인 부모-자식 관계 확인
      const isDirectParentChild = (parentFolder: Folder, childId: string): boolean => {
        if (!parentFolder.children) return false;
        return parentFolder.children.some(child => child.id === childId);
      };

      // 같은 부모를 가진 폴더인지 확인
      const findParentFolder = (folders: Folder[], targetId: string): Folder | null => {
        for (const folder of folders) {
          if (folder.children?.some(child => child.id === targetId)) {
            return folder;
          }
          if (folder.children) {
            const found = findParentFolder(folder.children, targetId);
            if (found) return found;
          }
        }
        return null;
      };

      // 폴더 경로로부터 폴더 제거
      const removeFolderByPath = (folders: Folder[], path: Folder[]): Folder[] => {
        if (path.length === 0) return folders;
        
        const [currentFolder, ...remainingPath] = path;
        return folders.map(folder => {
          if (folder.id === currentFolder.id) {
            if (remainingPath.length === 0) {
              return {
                ...folder,
                children: folder.children.filter(child => child.id !== dragId)
              };
            }
            return {
              ...folder,
              children: removeFolderByPath(folder.children, remainingPath)
            };
          }
          return folder;
        });
      };

      // 이동할 폴더의 경로 찾기
      const dragPath = findFolderPath(foldersCopy, dragId);
      if (!dragPath) return prevFolders;

      // 대상 폴더의 경로 찾기
      const dropPath = findFolderPath(foldersCopy, dropId);
      if (!dropPath) return prevFolders;

      // 이동할 폴더와 대상 폴더가 직접적인 부모-자식 관계인지 확인
      const dragFolder = dragPath[dragPath.length - 1];
      const dropFolder = dropPath[dropPath.length - 1];

      // 같은 부모를 가진 폴더인지 확인
      const dragParent = findParentFolder(foldersCopy, dragId);
      const dropParent = findParentFolder(foldersCopy, dropId);
      const isSameLevel = dragParent?.id === dropParent?.id;

      // 직접적인 부모-자식 관계이면서 같은 레벨이 아닌 경우에만 이동 불가
      const isDirectParentChildRelation = isDirectParentChild(dragFolder, dropId) || isDirectParentChild(dropFolder, dragId);
      if (isDirectParentChildRelation && !isSameLevel) {
        return prevFolders;
      }

      // 폴더 제거 후 추가
      const folderToMove = { ...dragPath[dragPath.length - 1] }; // 얕은 복사만 수행
      const foldersWithoutMoved = removeFolderByPath(foldersCopy, dragPath.slice(0, -1));

      // 드래그 중인 폴더의 dropPosition 가져오기
      const getCurrentDropPosition = (): DropPosition => {
        const dragFolderElement = document.querySelector(`[data-folder-id="${dragId}"]`);
        const dropFolderElement = document.querySelector(`[data-folder-id="${dropId}"]`);
        if (!dragFolderElement || !dropFolderElement) return 'inside';

        const dropRect = dropFolderElement.getBoundingClientRect();
        const dragRect = dragFolderElement.getBoundingClientRect();
        const dragY = dragRect.top + dragRect.height / 2;
        const dropY = dropRect.top;
        const dropHeight = dropRect.height;

        // 상단 25% 영역
        if (dragY < dropY + dropHeight * 0.25) {
          return 'top';
        }
        // 하단 25% 영역
        if (dragY > dropY + dropHeight * 0.75) {
          return 'bottom';
        }
        // 중간 영역
        return 'inside';
      };

      const dropPosition = getCurrentDropPosition();

      // 같은 레벨의 폴더인 경우 dropPosition에 따라 처리
      if (isSameLevel) {
        if (dropPosition === 'inside') {
          // 대상 폴더의 자식으로 추가
          const updatedFolders = foldersWithoutMoved.map(folder => {
            if (folder.id === dropFolder.id) {
              return {
                ...folder,
                children: [...(folder.children || []), folderToMove],
                isExpanded: true
              };
            }
            return folder;
          });
          return updatedFolders;
        } else {
          // 같은 레벨에 추가 (위/아래)
          const targetIndex = dropParent!.children.findIndex(child => child.id === dropId);
          const updatedChildren = [...dropParent!.children];
          if (dropPosition === 'top') {
            updatedChildren.splice(targetIndex, 0, folderToMove);
          } else { // bottom
            updatedChildren.splice(targetIndex + 1, 0, folderToMove);
          }
          
          return foldersWithoutMoved.map(folder => {
            if (folder.id === dropParent!.id) {
              return {
                ...folder,
                children: updatedChildren
              };
            }
            return folder;
          });
        }
      }

      // 다른 레벨의 폴더인 경우
      return foldersWithoutMoved.map(folder => {
        if (folder.id === dropFolder.id) {
          return {
            ...folder,
            children: [...(folder.children || []), folderToMove],
            isExpanded: true
          };
        }
        return folder;
      });
    });

    onFolderMove?.(dragId, dropId);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.folderTree}>
        {folders.map((folder) => (
          <DraggableFolder
            key={folder.id}
            folder={folder}
            level={0}
            onSelect={handleFolderClick}
            onToggle={toggleFolder}
            onMove={moveFolder}
            isSelected={selectedFolder === folder.id}
            initialData={folders}
          />
        ))}
      </div>
    </DndProvider>
  );
}; 