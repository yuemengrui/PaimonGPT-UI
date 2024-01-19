import React, { useState, useEffect } from 'react';
import {fileUpload} from "/api/file";


const FileUpload = ({uploadFiles, setUploadFiles, accept, fileLimit=10}) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0])
    };

    useEffect(() => {

        async function file_upload(data){
            const res = await fileUpload(data)

            if (res) {
                setUploadFiles(prevState => [...prevState, res])
            }
        }
        if (selectedFile) {
            const formData = new FormData();

            formData.append('file', selectedFile);

            file_upload(formData)
        }
    }, [selectedFile]);

    return (
        <div className='w-[256px] ml-6 mt-6'>
            <div className='border rounded-lg border-dashed border-gray-400 px-6 py-6 bg-gray-100'>
                {uploadFiles.length < fileLimit ? (
                    <div className='text-center'>
                        <label htmlFor="upload-button" className="cursor-pointer text-blue-600">选择文件</label>
                        <input id="upload-button" style={{ display: "none" }} type="file" accept={accept} onChange={changeHandler} />
                        <div className='mt-3 flex-wrap text-xs text-gray-500'>一次选择一个文件</div>
                        <div className='flex-wrap text-xs text-gray-500'>最多可以添加10个文件</div>
                        <div className='flex-wrap text-xs text-gray-500'>单个文件大小不能超过100M</div>
                    </div>
                ) : (
                    <div className='text-center'>
                        <div>添加的文件太多了，我吃不下了</div>
                    </div>
                ) }
            </div>
        </div>
    );
};

export default FileUpload;
