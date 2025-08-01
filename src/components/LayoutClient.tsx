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

	if (!mounted) return <>{children}</>;

	return (
		<div className="min-h-screen bg-white flex flex-col">
			<Header />
			<main className="flex-grow">{children}</main>
			<Footer />
		</div>
	);
}
