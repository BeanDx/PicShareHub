import React, { useState, ChangeEvent } from 'react';

import { FcPicture } from "react-icons/fc";

import { Label } from '@radix-ui/react-label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface HomeProps { }

const Home: React.FC<HomeProps> = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [fileSelected, setFileSelected] = useState(false);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const isImage = file.type.startsWith('image/');

            const isSizeValid = file.size <= 10 * 1024 * 1024; // 10 MB

            if (isImage && isSizeValid) {
                const reader = new FileReader();

                reader.onloadend = () => {
                    setSelectedImage(reader.result as string);
                    setFileSelected(true);
                };

                reader.readAsDataURL(file);
            } else {
                e.target.value = '';
                setFileSelected(false);
                alert('Please select a valid image file (up to 10 MB).');
            }
        }
    };

    const handleUpload = async () => {
        try {
            if (selectedImage) {
                const response = await fetch('http://localhost:3001/upload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ image: selectedImage }),
                });

                if (response.ok) {
                    const responseData = await response.json();

                    // Получение имени файла из ответа сервера
                    const fileName = responseData.fileName;

                    // Создание ссылки на изображение
                    const imageUrl = `http://localhost:3001/uploads/${fileName}`;

                    // Копирование ссылки в буфер обмена
                    navigator.clipboard.writeText(imageUrl);

                    console.log('Image uploaded successfully:', fileName);

                    // Оповещение пользователя об успешной загрузке и копировании в буфер
                    alert(`Image uploaded successfully! Image URL copied to clipboard:\n${imageUrl}`);
                } else {
                    console.error('Failed:', response.statusText);
                }
            } else {
                console.error('No image selected');
            }
        } catch (error) {
            console.error('Unknown error:', error);
        }
    };

    const anotherPicture = () => {
        setSelectedImage(null);
        setFileSelected(false);
    }

    return (
        <div className="flex items-center justify-center flex-col">
            <div className="flex justify-center content-center mt-10">
                <span className="text-3xl mr-2">
                    <FcPicture />
                </span>
                <h1 className="text-4xl">PicShareHub</h1>
            </div>
            <div>
                <h2 className="flex text-2xl font-noto-sans justify-center mt-3">
                    <span className="text-orange">PicShareHub</span>‎ Your Simple and Engaging
                    Pics Exchange Platform!
                    Up to <span className='text-orange'>‎ 10MB!</span>
                </h2>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5 pt-10">
                <Label htmlFor="picture">Picture</Label>
                <Input id="picture" type="file" onChange={handleImageChange} />
            </div>
            {fileSelected && (
                <div className="flex justify-center flex-col items-center mt-4">
                    <img src={selectedImage as string} alt="Selected" className="max-w-full h-auto" />
                    <div className='flex pt-5'>
                        <Button
                            onClick={handleUpload}>
                            Upload
                        </Button>
                        <div className='pl-5'>
                            <Button
                                onClick={anotherPicture}>
                                Another Picture
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
