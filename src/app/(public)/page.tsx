"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Event, Resource } from '@/lib/types';
import SecondaryButton from "@/components/buttons/SecondaryButton";
import EventCard from "@/components/cards/EventCard";
import ResourceCard from "@/components/cards/ResourceCard";
import { ONLINE_IMAGES } from "@/lib/constants/images";
import { FaTelegram, FaUsers, FaCalendarAlt, FaBook, FaUniversity, FaArrowDown } from "react-icons/fa";
import Link from "next/link";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
	const supabase = createClient();
	const [latestEvents, setLatestEvents] = useState<Event[]>([]);
	const [latestResources, setLatestResources] = useState<Resource[]>([]);
	const [loading, setLoading] = useState(true);
	
	// Refs for GSAP animations
	const heroRef = useRef<HTMLDivElement>(null);
	const statsRef = useRef<HTMLDivElement>(null);
	const eventsRef = useRef<HTMLDivElement>(null);
	const resourcesRef = useRef<HTMLDivElement>(null);

	const fetchData = useCallback(async () => {
		setLoading(true);
		
		// Get current date for filtering
		const now = new Date().toISOString();
		
		// Fetch upcoming events only (events that haven't passed)
		const { data: eventsData, error: eventsError } = await supabase
			.from('events')
			.select('*')
			.gte('date', now)
			.order('date', { ascending: true })
			.limit(3);
			
		if (eventsError) console.error("Error fetching homepage events:", eventsError);
		else {
			// Keep the database format - EventCard expects Event type from database
			setLatestEvents(eventsData as Event[] || []);
		}

		const { data: resourcesData, error: resourcesError } = await supabase.from('resources').select('*').order('created_at', { ascending: false }).limit(3);
		if (resourcesError) console.error("Error fetching homepage resources:", resourcesError);
		else {
			// Keep the database format - ResourceCard expects Resource type from database
			setLatestResources(resourcesData as Resource[] || []);
		}

		setLoading(false);
	}, [supabase]);

	useEffect(() => { 
		fetchData(); 
		
		// Initialize GSAP animations
		if (typeof window !== 'undefined') {
			// Hero section animation
			const heroTimeline = gsap.timeline({ delay: 0.2 });
			heroTimeline
				.fromTo('.hero-title', 
					{ opacity: 0, y: 50, scale: 0.9 }, 
					{ opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' }
				)
				.fromTo('.hero-subtitle', 
					{ opacity: 0, y: 30 }, 
					{ opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 
					'-=0.6'
				)
				.fromTo('.hero-buttons', 
					{ opacity: 0, y: 30, scale: 0.9 }, 
					{ opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }, 
					'-=0.4'
				);
		
			// Stats animation on scroll
			gsap.fromTo('.stats-card', 
				{ opacity: 0, y: 50, scale: 0.8 },
				{
					opacity: 1,
					y: 0,
					scale: 1,
					duration: 0.6,
					ease: 'back.out(1.7)',
					stagger: 0.1,
					scrollTrigger: {
						trigger: '.stats-section',
						start: 'top 80%',
						toggleActions: 'play none none reverse'
					}
				}
			);
		
			// Section fade-in animations
const fadeSections = gsap.utils.toArray('.fade-section') as HTMLElement[];
			fadeSections.forEach((section) => {
				gsap.fromTo(section,
					{ opacity: 0, y: 40 },
					{
						opacity: 1,
						y: 0,
						duration: 0.8,
						ease: 'power3.out',
						scrollTrigger: {
							trigger: section,
							start: 'top 85%',
							toggleActions: 'play none none reverse'
						}
					}
				);
			});
		
			// Card stagger animations
const cardContainers = gsap.utils.toArray('.card-container') as HTMLElement[];
			cardContainers.forEach((container) => {
				const cards = container.querySelectorAll('.stagger-card');
				gsap.fromTo(cards,
					{ opacity: 0, y: 30, scale: 0.9 },
					{
						opacity: 1,
						y: 0,
						scale: 1,
						duration: 0.6,
						stagger: 0.15,
						ease: 'back.out(1.7)',
						scrollTrigger: {
							trigger: container,
							start: 'top 80%',
							toggleActions: 'play none none reverse'
						}
					}
				);
			});
		}
	}, [fetchData]);

	// const handleRegister = () => console.log("Register button clicked");
	const handleDownload = () => console.log("Download button clicked");

	return (
		<div className="min-h-screen overflow-x-hidden">
			{/* Enhanced Hero Section with Parallax */}
			<section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
				{/* Background with Parallax Effect */}
				<div 
					className="absolute inset-0 bg-cover bg-center bg-fixed" 
					style={{ 
						backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(34, 139, 34, 0.3)), url('/images/hero/mosque-nigeria.jpg')`,
						transform: 'scale(1.1)'
					}} 
				/>
				
				{/* Hero Content */}
				<div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
				<h1 className="hero-title text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white-high-contrast mb-4 sm:mb-6 leading-tight">
					Welcome to{' '}
					<span className="gradient-text-primary">
						NAMVEMS
					</span>
				</h1>
				<p className="hero-subtitle text-lg sm:text-xl md:text-2xl lg:text-3xl text-white-medium-contrast max-w-4xl mx-auto mb-8 sm:mb-12 leading-relaxed font-medium">
					Empowering Nigerian Veterinary Medical Students Nationwide
				</p>
					<div className="hero-buttons flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 max-w-lg mx-auto">
						<Link href="/login" className="group">
							<button className="w-full sm:w-auto hero-button-primary group-hover:scale-105 transition-all duration-300">
								<FaUsers className="inline-block mr-2" />
								Join Our Community
							</button>
						</Link>
						<Link href="/events" className="group">
							<button className="w-full sm:w-auto hero-button-secondary group-hover:scale-105 transition-all duration-300">
								<FaCalendarAlt className="inline-block mr-2" />
								Explore Events
							</button>
						</Link>
					</div>
				</div>
				
				{/* Scroll Indicator */}
				<div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
					<div className="flex flex-col items-center text-white/70">
						<FaArrowDown className="text-xl mb-2" />
						<span className="text-sm font-medium">Scroll Down</span>
					</div>
				</div>
			</section>

			{/* About Section */}
			<section className="fade-section py-12 sm:py-20 lg:py-24 bg-white">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12 sm:mb-16">
					<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-high-contrast mb-4">
						About Our Organization
					</h2>
						<div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
						<div className="order-2 lg:order-1">
						<h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-high-contrast mb-4 sm:mb-6">
							Supporting the Next Generation of Veterinary Professionals
						</h3>
						<p className="text-base sm:text-lg text-medium-contrast mb-4 sm:mb-6 leading-relaxed font-medium">
							The Nigerian Association of Muslim Veterinary Medical Students (NAMVEMS) is 
							dedicated to fostering a supportive community for Muslim students pursuing 
							careers in veterinary medicine.
						</p>
						<p className="text-base sm:text-lg text-medium-contrast mb-6 sm:mb-8 leading-relaxed font-medium">
							We provide academic resources, professional networking opportunities, and 
							spiritual guidance to create an inclusive environment where students can thrive.
						</p>
							<Link href="/about" className="inline-block group">
								<button className="btn-primary group-hover:scale-105 transition-all duration-300">
									<FaBook className="inline-block mr-2" />
									Learn More About Us
								</button>
							</Link>
						</div>
						<div className="order-1 lg:order-2 relative">
							<div className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl group">
								<div 
									className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
									style={{ backgroundImage: `url(${ONLINE_IMAGES.ABOUT.TEAM})` }} 
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							</div>
							{/* Decorative Elements */}
							<div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-20 h-20 sm:w-32 sm:h-32 bg-primary rounded-xl -z-10 opacity-80"></div>
							<div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-16 h-16 sm:w-24 sm:h-24 bg-accent rounded-xl -z-10 opacity-80"></div>
						</div>
					</div>
				</div>
			</section>
			
			{/* Stats Section */}
			<section ref={statsRef} className="stats-section relative py-16 sm:py-20 lg:py-24 overflow-hidden">
				{/* Background */}
				<div 
					className="absolute inset-0 bg-cover bg-center bg-fixed"
					style={{
						backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.85), rgba(34, 139, 34, 0.4)), url('https://images.unsplash.com/photo-1581595219310-3c40e30f8484?ixlib=rb-4.0.3')`
					}}
				/>
				
				<div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12 sm:mb-16">
					<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white-high-contrast mb-4 sm:mb-6">
						Our Impact in Numbers
					</h2>
					<p className="text-base sm:text-lg lg:text-xl text-white-medium-contrast max-w-3xl mx-auto leading-relaxed font-medium">
						Join over 1,000 members across Nigeria making a difference in veterinary 
						medicine and the Muslim community.
					</p>
					</div>
					
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
						<div className="stats-card bg-white/10 backdrop-blur-md p-6 lg:p-8 rounded-2xl border border-white/20 text-center group hover:bg-white/20 transition-all duration-300">
							<FaUsers className="text-3xl lg:text-4xl text-primary mb-4 mx-auto group-hover:scale-110 transition-transform duration-300" />
							<h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-white">1,200+</h3>
							<p className="text-sm sm:text-base lg:text-lg text-gray-200 font-medium">Active Members</p>
						</div>
						<div className="stats-card bg-white/10 backdrop-blur-md p-6 lg:p-8 rounded-2xl border border-white/20 text-center group hover:bg-white/20 transition-all duration-300">
							<FaCalendarAlt className="text-3xl lg:text-4xl text-primary mb-4 mx-auto group-hover:scale-110 transition-transform duration-300" />
							<h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-white">50+</h3>
							<p className="text-sm sm:text-base lg:text-lg text-gray-200 font-medium">Events Hosted</p>
						</div>
						<div className="stats-card bg-white/10 backdrop-blur-md p-6 lg:p-8 rounded-2xl border border-white/20 text-center group hover:bg-white/20 transition-all duration-300">
							<FaBook className="text-3xl lg:text-4xl text-primary mb-4 mx-auto group-hover:scale-110 transition-transform duration-300" />
							<h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-white">100+</h3>
							<p className="text-sm sm:text-base lg:text-lg text-gray-200 font-medium">Resources Available</p>
						</div>
						<div className="stats-card bg-white/10 backdrop-blur-md p-6 lg:p-8 rounded-2xl border border-white/20 text-center group hover:bg-white/20 transition-all duration-300">
							<FaUniversity className="text-3xl lg:text-4xl text-primary mb-4 mx-auto group-hover:scale-110 transition-transform duration-300" />
							<h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-white">10+</h3>
							<p className="text-sm sm:text-base lg:text-lg text-gray-200 font-medium">University Chapters</p>
						</div>
					</div>
				</div>
			</section>
			
			{/* Events Section */}
			<section ref={eventsRef} className="fade-section py-12 sm:py-20 lg:py-24 bg-gray-50">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12 sm:mb-16">
					<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-high-contrast mb-4 sm:mb-6">
						Upcoming Events
					</h2>
					<p className="text-base sm:text-lg text-medium-contrast max-w-3xl mx-auto mb-6 leading-relaxed font-medium">
						Join us for conferences, workshops, and networking opportunities designed 
						to enhance your veterinary education and professional development.
					</p>
						<div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
					</div>
					
					{loading ? (
						<div className="flex justify-center items-center py-16">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
							<span className="ml-4 text-gray-600 text-lg">Loading events...</span>
						</div>
					) : latestEvents.length > 0 ? (
						<div className="card-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
						{latestEvents.map((event) => {
							// Check if event has passed
							const eventDate = new Date(event.date);
							const isPassed = eventDate < new Date();
							
							return (
								<div key={event.id} className="stagger-card">
									<EventCard event={event} isPastEvent={isPassed} />
								</div>
							);
						})}
						</div>
					) : (
						<div className="text-center py-16">
							<FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-6" />
							<h3 className="text-xl sm:text-2xl font-semibold text-gray-600 mb-4">
								No upcoming events right now
							</h3>
							<p className="text-gray-500 mb-6">Check back soon for exciting new events!</p>
						</div>
					)}
					
					<div className="text-center mt-12 sm:mt-16">
						<Link href="/events" className="inline-block group">
							<SecondaryButton size="lg" className="group-hover:scale-105 transition-all duration-300">
								<FaCalendarAlt className="inline-block mr-2" />
								View All Events
							</SecondaryButton>
						</Link>
					</div>
				</div>
			</section>

			{/* Resources Section */}
			<section ref={resourcesRef} className="fade-section py-12 sm:py-20 lg:py-24 bg-white">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12 sm:mb-16">
						<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
							Featured Resources
						</h2>
						<p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto mb-6 leading-relaxed">
							Download handbooks, guides, and educational materials to support your studies
							and professional development.
						</p>
						<div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
					</div>
					
					<div className="card-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{loading ? (
							<div className="col-span-full flex justify-center items-center py-16">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
								<span className="ml-4 text-gray-600 text-lg">Loading resources...</span>
							</div>
						) : latestResources.length > 0 ? (
							latestResources.map((resource) => (
								<div key={resource.id} className="stagger-card">
									<ResourceCard 
										title={resource.title}
										type={resource.type as 'handbook' | 'guide' | 'video' | 'image' | 'research' | 'other'}
										description={resource.description || ''}
										{...(resource.file_size ? { fileSize: resource.file_size } : {})}
										downloadUrl={resource.download_url}
										onDownload={handleDownload} 
									/>
								</div>
							))
						) : (
							<div className="col-span-full text-center py-16">
								<FaBook className="text-6xl text-gray-300 mx-auto mb-6" />
								<h3 className="text-xl sm:text-2xl font-semibold text-gray-600 mb-4">
									No featured resources available
								</h3>
								<p className="text-gray-500">Check back soon for new educational materials!</p>
							</div>
						)}
						
						{/* Telegram E-Library Card */}
						<div className="stagger-card bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white flex flex-col justify-between min-h-[280px] hover:shadow-xl transition-all duration-300 group">
							<div className="flex flex-col items-center text-center">
								<div className="bg-white/20 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
									<FaTelegram className="text-3xl" />
								</div>
								<h3 className="text-lg font-bold mb-2">E-Library Access</h3>
								<p className="text-sm opacity-90 mb-4 flex-grow">
									Join our Telegram channel for instant access to a vast collection of 
									vetinary resources and study materials.
								</p>
							</div>
							<Link 
								href="/elibrary" 
								className="w-full bg-white text-blue-600 font-semibold py-3 px-4 rounded-xl text-center hover:bg-gray-100 transition-colors duration-300"
							>
								Join E-Library
							</Link>
						</div>
					</div>
					
					<div className="text-center mt-12 sm:mt-16">
						<Link href="/resources" className="inline-block group">
							<SecondaryButton size="lg" className="group-hover:scale-105 transition-all duration-300">
								<FaBook className="inline-block mr-2" />
								View All Resources
							</SecondaryButton>
						</Link>
					</div>
				</div>
			</section>

			{/* Parallax Community Section */}
			<section className="relative min-h-[400px] sm:min-h-[500px] flex items-center justify-center overflow-hidden">
				<div 
					className="absolute inset-0 bg-cover bg-center bg-fixed" 
					style={{
						backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(34, 139, 34, 0.4)), url('${ONLINE_IMAGES.PARALLAX.COMMUNITY}')`
					}}
				/>
				<div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
					<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
						Join Our Growing Community
					</h2>
					<p className="text-base sm:text-xl lg:text-2xl mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
						Connect with fellow students, professionals, and mentors who share your 
						passion for veterinary medicine and Islamic values.
					</p>
					<Link href="/login" className="inline-block group">
						<button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold py-4 px-8 rounded-xl transition-all duration-300 transform group-hover:scale-105 text-lg">
							<FaUsers className="inline-block mr-2" />
							Become a Member
						</button>
					</Link>
				</div>
			</section>
			
			{/* Final CTA Section */}
			<section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-primary via-yellow-400 to-accent">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4 sm:mb-6">
						Ready to Start Your Journey?
					</h2>
					<p className="text-base sm:text-xl lg:text-2xl text-black/80 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
						Join thousands of students who are already part of our thriving community 
						of Muslim veterinary medical professionals.
					</p>
					<div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 max-w-lg mx-auto">
						<Link href="/login" className="group">
							<button className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 font-bold py-4 px-8 rounded-xl transition-all duration-300 transform group-hover:scale-105 text-lg shadow-lg">
								<FaUsers className="inline-block mr-2" />
								Sign Up Now
							</button>
						</Link>
						<Link href="/about" className="group">
							<button className="w-full sm:w-auto bg-transparent border-2 border-black text-black hover:bg-black hover:text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform group-hover:scale-105 text-lg">
								Learn More
							</button>
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
