'use client';

import { ReactFilesPreview } from 'react-files-preview';
import 'react-files-preview/dist/style.css';

export const PreviewFile = ({ file }: { file: any }) => {
  const arrayBufferView = new Uint8Array(file.data);
  const blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
  const url = URL.createObjectURL(blob);

  return (
    <div className="">
      <ReactFilesPreview url="https://images.pexels.com/photos/13658554/pexels-photo-13658554.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
    </div>
  );
};
