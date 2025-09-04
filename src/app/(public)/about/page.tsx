// src/app/(public)/about/page.tsx
import Image from 'next/image';
import { FaBullseye, FaEye } from 'react-icons/fa';

export default function AboutPage() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-accent text-white py-20 md:py-32">
                <div className="absolute inset-0">
                    <Image 
                        src="/images/hero/mosque-nigeria.jpg" // You can replace this with a more relevant team/community image
                        alt="NAMVEMS Community" 
                        layout="fill" 
                        objectFit="cover" 
                        className="opacity-20"
                    />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-shadow-md">About NAMVEMS</h1>
                    <p className="text-lg md:text-xl mt-4 max-w-3xl mx-auto text-shadow">
                        Fostering brotherhood, knowledge, and professional excellence in veterinary medicine under the guidance of Islamic principles.
                    </p>
                </div>
            </div>

            {/* Mission & Vision Section */}
            <div className="py-16 md:py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                                    <FaBullseye className="text-3xl text-black" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Mission</h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        To unite and empower Muslim veterinary medical students across Nigeria, providing a platform for spiritual growth, academic support, and professional development in line with Islamic values.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                                    <FaEye className="text-3xl text-black" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Vision</h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        To be the leading organization that nurtures a generation of competent, ethically-grounded Muslim veterinarians who are leaders in animal welfare, public health, and their communities.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <Image 
                                src="/assets/logo.png" 
                                alt="NAMVEMS Logo Large"
                                width={500}
                                height={500}
                                className="mx-auto"
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Meet the Team Section (Placeholder) */}
            <div className="py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet the Executive Council</h2>
                    <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
                        Our dedicated team of student leaders working tirelessly to serve the NAMVEMS community.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Placeholder Team Member Cards */}
                        <div className="bg-gray-50 p-6 rounded-lg text-center">
                            <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                            <h3 className="text-xl font-bold text-gray-800">Ameenullahi Adebayo</h3>
                            <p className="text-primary font-semibold">President</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg text-center">
                            <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                            <h3 className="text-xl font-bold text-gray-800">Fatima Yusuf</h3>
                            <p className="text-primary font-semibold">Vice President</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg text-center">
                            <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                            <h3 className="text-xl font-bold text-gray-800">Ibrahim Bello</h3>
                            <p className="text-primary font-semibold">General Secretary</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg text-center">
                            <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                            <h3 className="text-xl font-bold text-gray-800">Aisha Abubakar</h3>
                            <p className="text-primary font-semibold">Financial Secretary</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}