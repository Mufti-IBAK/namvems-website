"use client";

import { useState, useEffect } from "react";
import { resourcesService } from "@/lib/services/resourceService";
import { Resource } from "@/lib/types/resource";
import ResourceCard from "@/components/cards/ResourceCard";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { FaSearch, FaFilter } from "react-icons/fa";

export default function ResourcesPage() {
	const [resources, setResources] = useState<Resource[]>([]);
	const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedType, setSelectedType] = useState<string>("all");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");

	const types = [
		{ value: "all", label: "All Types" },
		{ value: "handbook", label: "Handbooks" },
		{ value: "guide", label: "Guides" },
		{ value: "video", label: "Videos" },
		{ value: "image", label: "Images" },
		{ value: "research", label: "Research" },
		{ value: "other", label: "Other" }
	];

	const categories = [
		{ value: "all", label: "All Categories" },
		{ value: "academic", label: "Academic" },
		{ value: "career", label: "Career" },
		{ value: "professional", label: "Professional" },
		{ value: "personal", label: "Personal" },
		{ value: "other", label: "Other" }
	];

	useEffect(() => {
		fetchResources();
	}, []);

	useEffect(() => {
		filterResources();
	}, [resources, searchQuery, selectedType, selectedCategory]);

	const fetchResources = async () => {
		try {
			setLoading(true);
			const data = await resourcesService.getAllResources();
			setResources(data);
			setFilteredResources(data);
		} catch (err) {
			setError("Failed to load resources. Please try again later.");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const filterResources = () => {
		let result = [...resources];

		// Apply search filter
		if (searchQuery) {
			const lowerQuery = searchQuery.toLowerCase();
			result = result.filter(
				(resource) =>
					resource.title.toLowerCase().includes(lowerQuery) ||
					resource.description.toLowerCase().includes(lowerQuery)
			);
		}

		// Apply type filter
		if (selectedType !== "all") {
			result = result.filter((resource) => resource.type === selectedType);
		}

		// Apply category filter
		if (selectedCategory !== "all") {
			result = result.filter(
				(resource) => resource.category === selectedCategory
			);
		}

		setFilteredResources(result);
	};

	const handleDownload = async (resourceId: string) => {
		try {
			const success = await resourcesService.downloadResource(resourceId);
			if (success) {
				// Update download count
				setResources((prevResources) =>
					prevResources.map((resource) =>
						resource.id === resourceId
							? { ...resource, downloads: resource.downloads + 1 }
							: resource
					)
				);
				console.log("Resource downloaded successfully");
			}
		} catch (err) {
			console.error("Failed to download resource", err);
		}
	};

	const clearFilters = () => {
		setSearchQuery("");
		setSelectedType("all");
		setSelectedCategory("all");
	};

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-16">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading resources...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto px-4 py-16">
				<div className="text-center">
					<div className="text-alert mb-4">
						<svg
							className="w-16 h-16 mx-auto"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
					</div>
					<h2 className="text-2xl font-bold text-text mb-4">
						Something went wrong
					</h2>
					<p className="text-gray-600 mb-6">{error}</p>
					<PrimaryButton onClick={fetchResources}>Try Again</PrimaryButton>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<div className="text-center mb-12">
				<h1 className="text-3xl md:text-4xl font-bold text-text mb-4">
					Resource Library
				</h1>
				<p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
					Download handbooks, guides, videos, and other educational materials
				</p>
			</div>

			{/* Search and Filters */}
			<div className="bg-white rounded-xl shadow-md p-6 mb-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
					{/* Search */}
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<FaSearch className="text-gray-400" />
						</div>
						<input
							type="text"
							placeholder="Search resources..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
						/>
					</div>

					{/* Type Filter */}
					<div>
						<select
							value={selectedType}
							onChange={(e) => setSelectedType(e.target.value)}
							className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
							aria-label="Filter by Type" // Add aria-label
						>
							{types.map((type) => (
								<option key={type.value} value={type.value}>
									{type.label}
								</option>
							))}
						</select>
					</div>

					{/* Category Filter */}
					<div>
						<select
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
							className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
							aria-label="Filter by Category"
						>
							{categories.map((category) => (
								<option key={category.value} value={category.value}>
									{category.label}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Clear Filters Button */}
				{(searchQuery ||
					selectedType !== "all" ||
					selectedCategory !== "all") && (
					<div className="flex justify-end">
						<button
							onClick={clearFilters}
							className="flex items-center text-accent hover:text-opacity-80 font-semibold"
						>
							<FaFilter className="mr-2" />
							Clear Filters
						</button>
					</div>
				)}
			</div>

			{/* Results Info */}
			<div className="mb-6 flex justify-between items-center">
				<p className="text-gray-600">
					Showing {filteredResources.length} of {resources.length} resources
				</p>
			</div>

			{/* Resources Grid */}
			{filteredResources.length === 0 ? (
				<div className="text-center py-16">
					<div className="text-gray-400 mb-4">
						<svg
							className="w-16 h-16 mx-auto"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							></path>
						</svg>
					</div>
					<h3 className="text-2xl font-bold text-text mb-2">
						No Resources Found
					</h3>
					<p className="text-gray-700 mb-4">
						Try adjusting your search or filter criteria
					</p>
					<button
						onClick={clearFilters}
						className="text-accent hover:text-opacity-80 font-semibold"
					>
						Clear All Filters
					</button>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredResources.map((resource) => (
						<ResourceCard
							key={resource.id}
							resourceId={resource.id}
							title={resource.title}
							type={resource.type}
							description={resource.description}
							fileSize={resource.fileSize}
							downloadUrl={resource.downloadUrl}
							onDownload={() => handleDownload(resource.id)}
							thumbnailUrl={resource.thumbnailUrl}
						/>
					))}
				</div>
			)}
		</div>
	);
}
