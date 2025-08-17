"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Event } from '@/lib/types/event';
import { Resource } from '@/lib/types/resource';
import { useGSAPAnimations } from "@/hooks/useGSAPAnimations";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import EventCard from "@/components/cards/EventCard";
import ResourceCard from "@/components/cards/ResourceCard";
import ParallaxSection from "@/components/ParallaxSection";
import { ONLINE_IMAGES } from "@/lib/constants/images";
import { FaTelegram } from "react-icons/fa";
import Link from "next/link";

export default function Home() {
	useGSAPAnimations();
	const supabase = createClient();
	const [latestEvents, setLatestEvents] = useState<Event[]>([]);
	const [latestResources, setLatestResources] = useState<Resource[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchData = useCallback(async () => {
		setLoading(true);
		
		const { data: eventsData, error: eventsError } = await supabase.from('events').select('*').order('date', { ascending: true }).limit(3);
		if (eventsError) console.error("Error fetching homepage events:", eventsError);
		else {
			const formattedEvents = eventsData.map(event => ({ ...event, date: new Date(event.date), maxAttendees: event.max_attendees, imageUrl: event.image_url, registeredCount: 0 }));
			setLatestEvents(formattedEvents);
		}

		const { data: resourcesData, error: resourcesError } = await supabase.from('resources').select('*').order('created_at', { ascending: false }).limit(3);
		if (resourcesError) console.error("Error fetching homepage resources:", resourcesError);
		else {
			const formattedResources = resourcesData.map(resource => ({ ...resource, downloadUrl: resource.download_url, fileSize: resource.file_size }));
			setLatestResources(formattedResources);
		}

		setLoading(false);
	}, [supabase]);

	useEffect(() => { fetchData(); }, [fetchData]);

	const handleRegister = () => console.log("Register button clicked");
	const handleDownload = () => console.log("Download button clicked");

	return (
		<div className="min-h-screen">
			<div className="relative h-screen overflow-hidden">
				<div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),  url('/images/hero/mosque-nigeria.jpg')` }} role="img" aria-label="Mosque in Nigeria" />
				<div className="relative z-10 h-full flex items-center">
					<div className="container mx-auto px-4 text-center">
						<h1 className="hero-title text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">Welcome to <span className="text-primary">NAMVEMS</span></h1>
						<p className="hero-subtitle text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10">Empowering Nigerian Veterinary Medical Students Nationwide</p>
						<div className="hero-buttons flex flex-col sm:flex-row justify-center gap-4">
							<Link href="/login"><button className="bg-primary text-black font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-lg w-full">Join Our Community</button></Link>
							<Link href="/events"><button className="bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 text-lg w-full">Explore Events</button></Link>
						</div>
					</div>
				</div>
				<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce" aria-hidden="true"><div className="w-8 h-12 rounded-full border-2 border-white flex justify-center"><div className="w-1 h-3 bg-white mt-2 rounded-full animate-pulse"></div></div></div>
			</div>

			<section className="py-20 fade-in-up" aria-labelledby="about-heading">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 id="about-heading" className="text-3xl md:text-4xl font-bold text-text mb-4">About Our Organization</h2>
						<div className="w-20 h-1 bg-primary mx-auto"></div>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						<div>
							<h3 className="text-2xl font-bold text-text mb-6">Supporting the Next Generation of Veterinary Professionals</h3>
							<p className="text-gray-700 mb-6 text-lg">The Nigerian Association of Muslim Veterinary Medical Students (NAMVEMS) is dedicated to fostering a supportive community for Muslim students pursuing careers in veterinary medicine. We provide academic resources, professional networking opportunities, and spiritual guidance.</p>
							<p className="text-gray-700 mb-8 text-lg">Our mission is to create an inclusive environment where students can thrive academically and personally while maintaining their faith and values.</p>
							<div className="inline-block"><Link href="/about"><button className="bg-primary hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">Learn More About Us</button></Link></div>
						</div>
						<div className="relative">
							<div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl"><div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${ONLINE_IMAGES.ABOUT.TEAM})` }} role="img" aria-label={ONLINE_IMAGES.ABOUT.ALT}></div></div>
							<div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary rounded-xl z-[-1]"></div>
							<div className="absolute -top-6 -left-6 w-24 h-24 bg-accent rounded-xl z-[-1]"></div>
						</div>
					</div>
				</div>
			</section>
			
			<div className="relative w-full overflow-hidden" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://images.unsplash.com/photo-1581595219310-3c40e30f8484?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%...)` }} role="img" aria-label="Veterinary students working together in a modern laboratory">
				<div className="container mx-auto px-4 py-16 md:py-20">
					<div className="flex flex-col items-center justify-center text-center">
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-6 fade-in-up">Our Impact in Numbers</h2>
						<p className="text-lg text-gray-200 mb-12 max-w-2xl fade-in-up">Join over 1,000 members across Nigeria making a difference in veterinary medicine and the Muslim community.</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-white w-full">
							<div className="bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 fade-in-up"><h3 className="text-3xl md:text-4xl font-bold mb-2 text-primary">1,200+</h3><p className="text-base md:text-lg">Active Members</p></div>
							<div className="bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 fade-in-up"><h3 className="text-3xl md:text-4xl font-bold mb-2 text-primary">50+</h3><p className="text-base md:text-lg">Events Hosted</p></div>
							<div className="bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 fade-in-up"><h3 className="text-3xl md:text-4xl font-bold mb-2 text-primary">100+</h3><p className="text-base md:text-lg">Resources Available</p></div>
							<div className="bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 fade-in-up"><h3 className="text-3xl md:text-4xl font-bold mb-2 text-primary">10+</h3><p className="text-base md:text-lg">University Chapters</p></div>
						</div>
					</div>
				</div>
			</div>
			
			<section className="py-20 bg-gray-50 stagger-container" aria-labelledby="events-heading">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16"><h2 id="events-heading" className="text-3xl md:text-4xl font-bold text-text mb-4">Upcoming Events</h2><p className="text-gray-600 max-w-2xl mx-auto mb-6">Join us for conferences, workshops, and networking opportunities</p><div className="w-20 h-1 bg-primary mx-auto"></div></div>
					{loading ? (<p className="text-center">Loading events...</p>) : latestEvents.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{latestEvents.map(event => (<EventCard key={event.id} {...event} date={new Date(event.date)} onRegister={handleRegister} />))}
						</div>
					) : (<p className="text-center text-gray-500 py-8">No upcoming events right now. Check back soon!</p>)}
					<div className="text-center mt-12"><Link href="/events"><SecondaryButton size="lg" aria-label="View all events">View All Events</SecondaryButton></Link></div>
				</div>
			</section>

			<section className="py-20 stagger-container" aria-labelledby="resources-heading">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16"><h2 id="resources-heading" className="text-3xl md:text-4xl font-bold text-text mb-4">Featured Resources</h2><p className="text-gray-600 max-w-2xl mx-auto mb-6">Download handbooks, guides, and educational materials</p><div className="w-20 h-1 bg-primary mx-auto"></div></div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{loading ? (<p className="text-center col-span-full">Loading resources...</p>) : latestResources.length > 0 ? (latestResources.map(resource => (<ResourceCard key={resource.id} {...resource} onDownload={handleDownload} />))) : (<p className="text-center text-gray-500 py-8 md:col-span-3">No featured resources available right now.</p>)}
						<div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white flex flex-col justify-between"><div className="flex justify-center mb-4"><FaTelegram className="text-4xl" /></div><h3 className="text-lg font-bold mb-2 text-center">E-Library Access</h3><p className="text-sm mb-4 text-center">Join our Telegram channel...</p><Link href="/elibrary" className="w-full bg-white text-blue-600 ...">Join Now</Link></div>
					</div>
				</div>
			</section>

			<ParallaxSection backgroundImageUrl={ONLINE_IMAGES.PARALLAX.COMMUNITY} height="h-96" overlayOpacity={0.6} aria-label="Join our community">
				<div className="container mx-auto px-4 text-center text-white">
					<h2 className="text-3xl md:text-4xl font-bold mb-6 fade-in-up">Join Our Growing Community</h2>
					<p className="text-xl mb-8 max-w-2xl mx-auto fade-in-up">Connect with fellow students, professionals, and mentors who share your passion</p>
					<div className="fade-in-up"><div className="inline-block"><Link href="/login"><PrimaryButton size="lg" variant="outline" aria-label="Become a member">Become a Member</PrimaryButton></Link></div></div>
				</div>
			</ParallaxSection>
			
			<section className="py-20 bg-gradient-to-r from-primary to-accent" aria-labelledby="cta-heading">
				<div className="container mx-auto px-4 text-center">
					<h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-black mb-6">Ready to Start Your Journey?</h2>
					<p className="text-xl text-black mb-8 max-w-2xl mx-auto">Join thousands of students who are already part of our community</p>
					<div className="flex flex-col sm:flex-row justify-center gap-4">
						<div className="inline-block"><Link href="/login"><PrimaryButton size="lg" aria-label="Sign up now">Sign Up Now</PrimaryButton></Link></div>
						<div className="inline-block"><Link href="/contact"><SecondaryButton size="lg" variant="outline" aria-label="Contact us">Contact Us</SecondaryButton></Link></div>
					</div>
				</div>
			</section>
		</div>
	);
}