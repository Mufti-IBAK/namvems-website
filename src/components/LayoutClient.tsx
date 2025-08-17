"use client";

import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function LayoutClient({
	children
}: {
	children: React.ReactNode;
}) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// This logic for preventing hydration errors is fine.
	if (!mounted) return <>{children}</>;

	// FIX: Removed the redundant wrapper div. The main flexbox is now on the body tag.
	// The <main> tag now correctly grows to fill the available space between header and footer.
	return (
		<>
			<Header />
			<main className="flex-grow">{children}</main>
			<Footer />
		</>
	);
}